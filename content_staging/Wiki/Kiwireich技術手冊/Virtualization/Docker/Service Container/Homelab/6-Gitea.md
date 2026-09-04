---
title: Gitea 輕量化自建 Git 伺服器架設
tags:
  - VM
  - Container
date: 2026-09-04
---
# Gitea 輕量化自建 Git 伺服器架設與維護手冊 (Wiki)

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 架構定位與核心設計原則

在專注於 HomeLab 內部自動化（如 Ansible / Docusaurus / Docker Compose Repo）的場景下，架構有以下設計重點：

- **純內網 HTTP 策略**：
    
    在隔離內網中，Git 伺服器僅供內部 VM 或實體節點拉取代碼（如 `ansible-pull -U [http://git.internal.local/admin/homelab.git](http://git.internal.local/admin/homelab.git)`）。走內部 HTTP 能完全免去內網 CA 自簽憑證過期或各客戶端節點需要手動安裝信任 Root CA 的管理麻煩。
    
- **資料庫選型：為什麼棄用 SQLite 改採 MySQL / MariaDB？**
    
    - SQLite 本質是單一檔案資料庫，在高頻併發寫入時會觸發全表/資料庫層級鎖（Database-level Lock）。
        
    - 當多個節點同時執行 `ansible-pull`、或有多個 Git Hook / CI Runner 同時回報狀態時，極易出現 `database is locked (5)` 致命錯誤，導致 Git Push/Pull 失敗中斷。
        
    - 採用獨立 MySQL / MariaDB 可藉由行級鎖（Row-level Lock）與連線池徹底根治鎖定逾時問題。
        
- **SSH 埠口衝突避免**：
    
    若想在容器內開放 Git 走 SSH 協定（`git@host:repo.git`），容器內的 Port 22 嚴禁直接映射到宿主機的 22（避免與宿主機本身的 SSH 管理埠口衝突），通常需映射為 `2222:22`，或透過宿主機 OpenSSH 的 `AuthorizedKeysCommand` 達成直通。
    

## 2. Docker Compose 完整部署範本

### 步驟 1：建立專用目錄與權限

```bash
sudo mkdir -p /opt/gitea/data /opt/gitea/config /opt/gitea/mysql
# Gitea 官方映像檔預設使用 UID 1000 運行
sudo chown -R 1000:1000 /opt/gitea/data /opt/gitea/config
```

### 步驟 2：`docker-compose.yml` 配置

在 `/opt/gitea/docker-compose.yml` 中編排：

```yaml
services:
  server:
    image: gitea/gitea:latest
    container_name: gitea
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - TZ=Asia/Taipei
      # 關鍵：外部存取網址（影響前端頁面複製 Git Clone 連結的生成路徑）
      - GITEA__server__ROOT_URL=http://git.internal.local/
      - GITEA__server__HTTP_PORT=3000
      - GITEA__server__DOMAIN=git.internal.local
      - GITEA__server__SSH_PORT=2222
      - GITEA__server__SSH_LISTEN_PORT=22
      # 資料庫連線配置（支援 GITEA__*__* 格式自動複寫 app.ini）
      - GITEA__database__DB_TYPE=mysql
      - GITEA__database__HOST=db:3306
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=gitea_secret_password
    volumes:
      - /opt/gitea/data:/data
      - /opt/gitea/config:/etc/gitea
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      # Git SSH 服務埠口（外部存取走 2222）
      - "2222:22"
      # 若直接走 NPM 反向代理且在同個 Docker 網路，下行 3000 埠甚至不用對外映射
      - "3000:3000"
    networks:
      - backend

  db:
    image: mariadb:10.11
    container_name: gitea_db
    restart: unless-stopped
    command:
      - "mariadbd"
      - "--character-set-server=utf8mb4"
      - "--collation-server=utf8mb4_unicode_ci"
      - "--innodb-file-per-table=1"
    environment:
      - TZ=Asia/Taipei
      - MARIADB_ROOT_PASSWORD=db_root_secret_password
      - MARIADB_DATABASE=gitea
      - MARIADB_USER=gitea
      - MARIADB_PASSWORD=gitea_secret_password
    volumes:
      - /opt/gitea/mysql:/var/lib/mysql
    networks:
      - backend
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 5s
      timeout: 5s
      retries: 10

networks:
  backend:
    driver: bridge
    # 若有使用共用的 npm-network，可直接掛載外部網路：
    # external: true
    # name: npm-network
```

> **改進說明**：
> 
> 1. 原先使用 `mysql:latest` 偶爾會遭遇預設認證外掛改版（如 `caching_sha2_password`）造成的連線中斷，此處推薦採用長效支援的 `mariadb:10.11`，資源開銷更小且相容性更佳。
>     
> 2. 加入 `healthcheck` 與 `depends_on: condition: service_healthy`，確保資料庫確實初始化完成後才拉起 Gitea 服務，杜絕啟動初期的 DB Connection Refused 錯誤。
>     

## 3. 反向代理整合 (Nginx Proxy Manager)

將 NPM 與 Gitea 接在同一個自訂網路（例如 `backend` 或外部共用的 `npm-network`）時，反向代理設定非常乾淨：

### NPM Proxy Host 設定

1. 前往 **Hosts** -> **Proxy Hosts** -> **Add Proxy Host**。
    
2. **Details** 分頁設定：
    
    - **Domain Names**：`git.internal.local`
        
    - **Scheme**：`http`
        
    - **Forward Hostname / IP**：`gitea`（**直接填寫容器名稱**）
        
    - **Forward Port**：`3000`（Gitea 容器內部預設 Listen 埠）
        
    - 勾選 **Websockets Support**（Gitea 內部通知需要）。
        
3. **上傳大檔案防中斷 (重要)**：
    
    - 前往 **Advanced** 分頁，在自訂 Nginx 配置區塊貼入：
        
        
   ```nginx
        # 允許大容量 Git Push（預設僅 1MB，大專案或 binary 檔會被擋）
        client_max_body_size 512M;
   ```
        

## 4. 搭配 Ansible-Pull 實戰技巧

在 HomeLab 中利用 `ansible-pull` 達成節點自我配置時，Gitea 純 HTTP 的優勢尤為明顯：

### 4.1 建立免密唯讀權限帳號或 Access Token

1. 在 Gitea 建立一個專門用於自動化維運的帳號（例如 `ci-bot`）。
    
2. 在該帳號的 **設定** -> **應用程式** -> 建立一個具有 `read:repository` 權限的 **個人存取權杖 (Personal Access Token)**。
    

### 4.2 節點端執行 `ansible-pull`

在客戶端主機執行自動化同步（無須配置 SSH Key 或信任憑證）：

```bash
# 使用 Token 進行純 HTTP 拉取與執行
ansible-pull -U http://ci-bot:<YOUR_TOKEN>@git.internal.local/infra/homelab-ansible.git \
  -i localhost, \
  local.yml
```

## 5. 常見踩坑排障與調優 (Troubleshooting)

|**異常現象**|**根本原因**|**排除步驟**|
|---|---|---|
|**Git Push 報錯：`RPC failed; HTTP 413 curl 22 The requested URL returned error: 413`**|經過 NPM 時觸發 Nginx 預設的 `client_max_body_size` 限制|在 NPM 的進階設定中加入 `client_max_body_size 512M;`（或更高），並確認 Gitea 的 `app.ini` 中 `[repository.upload] FILE_MAX_SIZE = 512`。|
|**Web 介面點選 Clone 複製出來的網址變成 `http://localhost:3000/...`**|`ROOT_URL` 未正確解析|檢查環境變數是否設置 `GITEA__server__ROOT_URL=[http://git.internal.local/](http://git.internal.local/)`（結尾務必帶斜線 `/`），並重啟容器。|
|**透過 SSH Clone 失敗（Permission denied / Connection refused）**|外部埠口映射錯亂或混淆了 Host 與容器的 SSH|1. 確認連線時帶上 Port 2222：`git clone ssh://git@git.internal.local:2222/user/repo.git`。<br><br>  <br><br>2. 若要免打 2222，可於客戶端 `~/.ssh/config` 定義別名。|
|**忘記管理員密碼**|Web UI 無法登入重設|直接使用容器內 CLI 一鍵重設管理員密碼：<br><br>  <br><br>`docker compose exec --user 1000 server gitea admin user change-password --username admin --password "New_Password"`|

## 6. 資料備份與災難復原

Gitea 官方提供了專屬的備份指令，能將資料庫 SQL、倉庫裸檔案（Bare Repositories）、使用者設定與外掛資料完整封裝為單一 ZIP 壓縮檔：

```bash
# 1. 於容器內執行一鍵備份命令
docker compose exec -T --user 1000 server gitea dump -c /data/gitea/conf/app.ini --file /data/gitea-dump.zip

# 2. 將備份檔從宿主機目錄移至備份儲存區
sudo mv /opt/gitea/data/gitea-dump.zip /opt/backups/gitea-$(date +%F).zip

# 還原方式（在全新的乾淨目錄中）：
# unzip gitea-dump.zip
# 將還原出的 SQL 匯入 MariaDB，並將 data 目錄覆蓋回 /opt/gitea/data/gitea
```