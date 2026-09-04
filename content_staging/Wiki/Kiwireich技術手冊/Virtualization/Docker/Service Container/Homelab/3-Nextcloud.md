---
title: Nextcloud 搭配 Traefik v3 反向代理架設
tags:
  - VM
  - Container
date: 2026-09-04
---
# Nextcloud 搭配 Traefik v3 反向代理架設

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 核心觀念與避坑準則

- **映像檔選型**：
    
    - 強烈採用官方標準映像檔 `nextcloud:apache`（或 `nextcloud:latest`）。內建 Apache + PHP-FPM 整合環境，對 `X-Forwarded-*` 標頭的相容度最成熟。
        
    - **絕對避開 LinuxServer.io 的 Nextcloud**：該映像檔自帶預裝 Nginx 與自簽 SSL 流程，會與外部反向代理的 SSL 卸載（SSL Offloading）產生嚴重衝突。
        
- **權限陷阱 (UID 33)**：
    
    - 官方容器內部執行身份為 `www-data`，其 **UID 與 GID 均為 33**。宿主機掛載的目錄權限必須指派給 `33:33`，否則會因無法讀寫 `.ocdata` 或資料目錄而啟動失敗。
        
- **資料目錄分離 (`NEXTCLOUD_DATA_DIR`)**：
    
    - 將使用者上傳的資料獨立掛載於 `/var/www/data`（位於 Web 根目錄 `/var/www/html` 外側），既保障安全性，又方便單獨進行快照或掛載外部磁碟卷。
        

## 2. Docker Compose 完整部署配置 (Traefik v3 現代化設定)

### 步驟 1：建立專用目錄並修正權限

```bash
# 建立程式目錄與獨立的資料儲存目錄
sudo mkdir -p /opt/nextcloud/html
sudo mkdir -p /opt/nextcloud/data

# 將所有權給予容器內的 www-data (UID 33)
sudo chown -R 33:33 /opt/nextcloud/html /opt/nextcloud/data
sudo chmod 750 /opt/nextcloud/data
```

### 步驟 2：`docker-compose.yml` 配置

在 `/opt/nextcloud/docker-compose.yml` 中編排：

```yaml
services:
  nextcloud:
    image: nextcloud:apache
    container_name: nextcloud
    restart: unless-stopped
    environment:
      - TZ=Asia/Taipei
      # 1. 初始資料庫設定（使用 SQLite）
      - SQLITE_DATABASE=nextcloud
      # 2. 資料目錄獨立路徑（避開巢狀掛載問題）
      - NEXTCLOUD_DATA_DIR=/var/www/data
      # 3. 首次安裝時信任的網域（多個以空白分隔）
      - NEXTCLOUD_TRUSTED_DOMAINS=cloud.example.com
      # 4. 信任代理網段（Docker 預設網段）
      - TRUSTED_PROXIES=172.16.0.0/12 10.0.0.0/8 192.168.0.0/16
      # 5. 強制以 HTTPS 認知對外請求（防止登入跳回 http 與 CSRF 失敗的關鍵）
      - OVERWRITEPROTOCOL=https
      - OVERWRITECLIURL=https://cloud.example.com
      - OVERWRITEHOST=cloud.example.com
      # 6. PHP 運行環境配額微調
      - PHP_MEMORY_LIMIT=1024M
      - PHP_UPLOAD_LIMIT=16G
    volumes:
      - /opt/nextcloud/html:/var/www/html
      - /opt/nextcloud/data:/var/www/data
    networks:
      - proxy-network
    labels:
      - "traefik.enable=true"

      # --- [Router 基本設定] ---
      - "traefik.http.routers.nextcloud.rule=Host(`cloud.example.com`)"
      - "traefik.http.routers.nextcloud.entrypoints=websecure"
      - "traefik.http.routers.nextcloud.tls=true"
      - "traefik.http.routers.nextcloud.tls.certresolver=myresolver"
      # 掛載中介軟體清單
      - "traefik.http.routers.nextcloud.middlewares=nc-dav,nc-wellknown,nc-headers"
      # 明確指定轉發到容器內部 Apache 的 80 埠
      - "traefik.http.services.nextcloud.loadbalancer.server.port=80"

      # --- [Middleware 1: CalDAV / CardDAV 重定向] ---
      - "traefik.http.middlewares.nc-dav.redirectregex.regex=^https://(.*)/\\.well-known/(card|cal)dav(.*)"
      - "traefik.http.middlewares.nc-dav.redirectregex.replacement=https://$${1}/remote.php/dav$${3}"
      - "traefik.http.middlewares.nc-dav.redirectregex.permanent=true"

      # --- [Middleware 2: Webfinger / Nodeinfo 重定向 (消除新版黃字警告)] ---
      - "traefik.http.middlewares.nc-wellknown.redirectregex.regex=^https://(.*)/\\.well-known/(webfinger|nodeinfo)(.*)"
      - "traefik.http.middlewares.nc-wellknown.redirectregex.replacement=https://$${1}/index.php/.well-known/$${2}$${3}"
      - "traefik.http.middlewares.nc-wellknown.redirectregex.permanent=true"

      # --- [Middleware 3: 安全標頭與 HSTS] ---
      - "traefik.http.middlewares.nc-headers.headers.stsSeconds=31536000"
      - "traefik.http.middlewares.nc-headers.headers.stsIncludeSubdomains=true"
      - "traefik.http.middlewares.nc-headers.headers.stsPreload=true"
      - "traefik.http.middlewares.nc-headers.headers.contentTypeNosniff=true"
      - "traefik.http.middlewares.nc-headers.headers.browserXssFilter=true"

networks:
  proxy-network:
    external: true
```

啟動服務：

```bash
docker compose up -d
```

## 3. 系統初始化後的「後續配置」與警告徹底排除

在網頁端完成建立管理者帳號後，進入「管理設定」->「概觀」，若有警報，請直接使用以下方式處理：

### 3.1 消除警告：「未設定記憶體快取 (Memcache)」

官方映像檔已編譯 `APCu` 模組，但需要在設定檔中手動指定：

1. 編輯 `/opt/nextcloud/html/config/config.php`，在 `$CONFIG = array (` 區塊內加入：
    
    
   ```php
      'memcache.local' => '\OC\Memcache\APCu',
   ```
    
2. 讓 PHP CLI 也支援 APCu（避免執行背景 Cron 時噴錯）：
    
    建立或編輯 `/opt/nextcloud/html/.user.ini`，加入：
    
    
   ```toml
    apc.enable_cli=1
   ```
    
3. 重啟容器生效：
    
    
   ```bash
    docker compose restart nextcloud
   ```
    

### 3.2 消除警告：「資料庫遺失索引」或「BigInt 欄位未轉換」

直接使用容器內的 `occ` 命令自動修復：

```bash
# 補齊遺失的資料庫索引
docker compose exec --user 33 nextcloud php occ db:add-missing-indices

# 轉換檔案快取的大整數欄位
docker compose exec --user 33 nextcloud php occ db:convert-filecache-bigint
```

### 3.3 運行後新增網域或調整反向代理（不要修改 Compose！）

容器初次建置後，環境變數將不再複寫 `config.php`。若日後需要增加網域或補加信任 IP，直接使用 `occ`：

```bash
# 新增第二個網域 (例如 cloud2.example.com)
docker compose exec --user 33 nextcloud php occ config:system:set trusted_domains 2 --value="cloud2.example.com"

# 補加或修改受信任代理網段 (Trusted Proxies)
docker compose exec --user 33 nextcloud php occ config:system:set trusted_proxies 0 --value="172.16.0.0/12"
docker compose exec --user 33 nextcloud php occ config:system:set trusted_proxies 1 --value="10.0.0.0/8"
```

## 4. 背景定時任務配置：Cron vs. Systemd Timer

Nextcloud 預設的 **AJAX 模式** 依賴使用者點擊網頁來偷跑維護工作，不僅拖慢瀏覽速度，在夜間無人存取時排程還會完全停擺。

請先在網頁端完成切換：

進入「管理設定」->「基本設定」-> 背景工作改選 **「Cron (建議)」**。隨後依據環境在宿主機選擇 **選項 A** 或 **選項 B** 部署定時觸發器。

### 選項 A：使用傳統 Crontab (設定簡單、輕量快速)

適用於追求單行指令搞定、不想建立額外設定檔的主機。

1. 在宿主機開啟 root crontab：
    
    
   ```bash
    sudo crontab -e
   ```
    
2. 加入以下排程（每 5 分鐘執行一次）：
    
    
   ```
    */5 * * * * docker compose -f /opt/nextcloud/docker-compose.yml exec -T --user 33 nextcloud php -f /var/www/html/cron.php > /dev/null 2>&1
   ```
    
    - **`-T`**：停用 TTY 分配，避免在非交互環境噴出 `the input device is not a TTY` 報錯。
        
    - **`--user 33`**：強制以容器內的 `www-data` (UID 33) 身分執行，防止快取目錄權限遭 root 污染。
        

### 選項 B：使用 Systemd Timer (現代發行版推薦、生產級標準)

適用於 Photon OS、Debian、Ubuntu、Rocky Linux 等現代發行版。具備開機延遲、崩潰超時防護、`journalctl` 統一收集日誌，以及透過 `Persistent=true` 達成關機重開後的自動補跑機制。

#### 步驟 1：建立執行任務的 Service 單元

建立 `/etc/systemd/system/nextcloud-cron.service`：

```toml
[Unit]
Description=Nextcloud Background Cron Job
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
User=root
WorkingDirectory=/opt/nextcloud
# 請依 which docker 結果調整路徑（通常為 /usr/bin/docker）
ExecStart=/usr/bin/docker compose exec -T --user 33 nextcloud php -f /var/www/html/cron.php
TimeoutSec=600

[Install]
WantedBy=multi-user.target
```

#### 步驟 2：建立定時觸發的 Timer 單元

建立 `/etc/systemd/system/nextcloud-cron.timer`（檔名必須與 `.service` 一致）：

```toml
[Unit]
Description=Run Nextcloud Cron every 5 minutes

[Timer]
# 開機後延遲 5 分鐘觸發第一次，避開系統開機尖峰
OnBootSec=5min
# 之後每 5 分鐘執行一次
OnUnitActiveSec=5min
# 若關機錯過執行時間點，開機後立即補跑一次
Persistent=true

[Install]
WantedBy=timers.target
```

#### 步驟 3：載入、測試與啟動 Timer

```bash
# 1. 重新載入 systemd 設定
sudo systemctl daemon-reload

# 2. 手動執行一次 service 測試運作狀態
sudo systemctl start nextcloud-cron.service

# 3. 檢查單次執行日誌輸出
journalctl -u nextcloud-cron.service -n 20 --no-pager

# 4. 啟用定時器並設定開機自啟
sudo systemctl enable --now nextcloud-cron.timer

# 5. 查看定時器下次觸發倒數
systemctl list-timers nextcloud-cron.timer
```

## 5. SQLite 維護與效能調優

針對採用 SQLite 的輕量建置：

- **開啟 WAL (Write-Ahead Logging) 提升並發能力**：
    
    SQLite 採用檔案鎖定機制，若多裝置同時上傳易發生逾時。編輯 `/opt/nextcloud/html/config/config.php`，在陣列中加入：
    
    
   ```php
    'sqlite.journal_mode' => 'WAL',
   ```
    
- **一鍵完整備份**：
    
    SQLite 的資料庫實體位於 `/opt/nextcloud/data/owncloud.db`，備份時只需直接封裝檔案目錄與組態：
    
    
   ```bash
    sudo tar -czvf /opt/backup/nextcloud_$(date +%F).tar.gz \
      /opt/nextcloud/data \
      /opt/nextcloud/html/config/config.php
   ```
    

## 6. 常見故障速查表 (Quick Troubleshooting)

| **異常現象**                     | **根本原因**                                               | **排除處置**                                                                                             |
| ---------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **登入後跳回登入頁（循環登出 / CSRF 失敗）** | 缺少 `OVERWRITEPROTOCOL=https`，導致 Session Cookie 判定非安全協定 | 在 Compose 加入 `OVERWRITEPROTOCOL=https`，`docker compose up -d` 重建容器，並清理瀏覽器 Cookie。                    |
| **`.ocdata` 遺失報錯**           | 宿主機目錄擁有者非 UID 33                                       | 執行 `sudo chown -R 33:33 /opt/nextcloud/data`。                                                        |
| **手機 App 無法同步行事曆與聯絡人**       | Traefik 的 `nc-dav` 重定向未生效                              | 訪問 `https://<domain>/.well-known/caldav`，確認是否自動導向至 `/remote.php/dav/`。                               |
| **上傳大檔案中斷**                  | 受到 PHP 上傳配額限制                                          | 檢查環境變數 `PHP_UPLOAD_LIMIT=16G`，或在 `.user.ini` 設定 `upload_max_filesize = 16G` 與 `post_max_size = 16G`。 |