---
title: "# BookStack 知識庫系統部署"
tags:
  - VM
  - Container
date: 2026-09-04
---
# BookStack 知識庫系統部署

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 核心架構與環境變數重大變更 (Breaking Changes)

- **儲存模型**：BookStack 的文章內容、使用者權限與頁面中繼資料存於 **MariaDB / MySQL**；圖片、附件與上傳檔案則儲存於檔案系統目錄（`/config/www/storage`）。
    
- **LinuxServer 變數更名陷阱**：
    
    - LinuxServer.io 映像檔已逐步統一資料庫環境變數命名規範，與 Laravel 預設變數對齊：
        
        - 舊版參數：`DB_USER` / `DB_PASS`
            
        - **新版強制參數**：`DB_USERNAME` / `DB_PASSWORD`
            
    - 若沿用舊範例，容器初始化時將抓取空值，導致容器反覆噴出 `Database connection error: SQLSTATE[HY000] [1045] Access denied`。
        
- **`APP_URL` 嚴格限制**：
    
    - Laravel 框架底層強烈依賴 `APP_URL` 來生成靜態資源（CSS / JS）與頁面重定向超連結。
        
    - 若走 HTTPS 反向代理，**`APP_URL` 必須嚴格包含 `https://` 與完整網域名稱**（不可留空或填 `http://localhost`），否則會造成前端載入 Mixed Content 破版、登入 CSRF Token 驗證失敗或無限循環導向。
        

## 2. Docker Compose 部署配置 (整合 Traefik v3)

部署採用 Traefik v3 進行邊界 SSL 終止，後端容器完全不對外映射 Host Port，統一經由共用的外部 Docker 網路通訊。

### 步驟 1：建立專用目錄與權限

```bash
# 建立資料庫與應用設定目錄
sudo mkdir -p /opt/bookstack/db /opt/bookstack/app

# 設定 PUID/PGID 對齊的擁有者（以 UID 1000 為例）
sudo chown -R 1000:1000 /opt/bookstack
```

### 步驟 2：`docker-compose.yml` 完整配置

在 `/opt/bookstack/docker-compose.yml` 中編排服務：

```yaml
services:
  bookstack_db:
    image: lscr.io/linuxserver/mariadb:latest
    container_name: bookstack_db
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
      - MYSQL_ROOT_PASSWORD=your_super_root_pass
      - MYSQL_DATABASE=bookstackapp
      - MYSQL_USER=bookstack
      - MYSQL_PASSWORD=your_db_secret_pass
    volumes:
      - /opt/bookstack/db:/config
    networks:
      - bookstack_internal

  bookstack:
    image: lscr.io/linuxserver/bookstack:latest
    container_name: bookstack
    restart: unless-stopped
    depends_on:
      - bookstack_db
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
      # 關鍵：必須完整帶入 https:// 且與 Traefik 路由域名一致
      - APP_URL=https://wiki.example.com
      # 資料庫連線（注意新版參數名稱）
      - DB_HOST=bookstack_db
      - DB_DATABASE=bookstackapp
      - DB_USERNAME=bookstack
      - DB_PASSWORD=your_db_secret_pass
      # SMTP 郵件通知設定（選用）
      - MAIL_DRIVER=smtp
      - MAIL_HOST=smtp.example.com
      - MAIL_PORT=587
      - MAIL_ENCRYPTION=tls
      - MAIL_USERNAME=notify@example.com
      - MAIL_PASSWORD=your_smtp_password
      - MAIL_FROM=notify@example.com
      - MAIL_FROM_NAME=BookStack Wiki
    volumes:
      - /opt/bookstack/app:/config
    networks:
      - bookstack_internal
      - proxy-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.bookstack.rule=Host(`wiki.example.com`)"
      - "traefik.http.routers.bookstack.entrypoints=websecure"
      - "traefik.http.routers.bookstack.tls=true"
      - "traefik.http.routers.bookstack.tls.certresolver=myresolver"
      # 關鍵：LinuxServer 內部 Nginx 監聽 Port 80，必須明確指定負載均衡目標埠
      - "traefik.http.services.bookstack.loadbalancer.server.port=80"

networks:
  bookstack_internal:
    driver: bridge
  proxy-network:
    external: true
```

啟動服務：

```bash
docker compose up -d
```

## 3. 初始管理員登入與安全變更

容器初次啟動會自動執行資料庫遷移（Migration）與預設種子資料填充：

1. 瀏覽器開啟：`[https://wiki.example.com](https://wiki.example.com)`
    
2. **預設最高權限帳號**：
    
    - **Email**：`admin@admin.com`
        
    - **Password**：`password`
        
3. 登入後立即進入「Settings」->「Users」-> 點擊 `Admin` 變更 Email 並替換為高強度密碼。
    

## 4. 關鍵踩坑與進階除錯指南 (Troubleshooting)

### 4.1 轉址到 `http://localhost:6875` 或 CSS/JS 破版 (Mixed Content)

- **原因**：`APP_URL` 漏填、格式錯誤，或反向代理未正確傳遞轉發標頭。
    
- **解法**：
    
    1. 確保 `APP_URL` 正確設定且以 `https://` 開頭。
        
    2. 若使用自訂 Nginx / NPM 反向代理，需確保向上游傳遞以下 Header：
        
        
   ```nginx
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
   ```
        

### 4.2 為什麼 Traefik 必須顯式指定 `server.port: 80`？

- LinuxServer.io 的映像檔內部使用 S6-overlay 啟動 Nginx + PHP-FPM。容器映像檔內部可能宣告了多個監聽埠，若未加入 `traefik.http.services.bookstack.loadbalancer.server.port: 80`，Traefik 在多埠情境下無法判定轉發目標，會導致轉發至錯誤 Port 並回傳 `502 Bad Gateway`。
    

### 4.3 圖片或大檔案上傳失敗 (HTTP 413 Payload Too Large)

預設上傳限制受 PHP 與 Nginx 雙重約束。若需上傳數十 MB 的 PDF 或影片附件：

1. 編輯 `/opt/bookstack/app/php/php-local.ini`（若無則新建）：
    
    
   ```toml
    upload_max_filesize = 100M
    post_max_size = 100M
    memory_limit = 512M
   ```
    
2. 編輯 `/opt/bookstack/app/nginx/site-confs/default.conf`，在 `server { ... }` 區塊加入：
    
    
   ```nginx
    client_max_body_size 100M;
   ```
    
3. 重啟容器：`docker compose restart bookstack`。
    

## 5. 備份與災難復原 (Disaster Recovery)

BookStack 的資料完整性由「資料庫 SQL」與「上傳檔案目錄」兩者共同維繫，兩者必須同步備份。

### 5.1 完整備份指令

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/bookstack"
DATE=$(date +%F_%H%M%S)
mkdir -p $BACKUP_DIR

# 1. 導出 MariaDB 資料庫 Dump
docker compose exec -T bookstack_db mysqldump -u bookstack -pyour_db_secret_pass bookstackapp > $BACKUP_DIR/db_$DATE.sql

# 2. 打包上傳的附件、圖片與設定檔
tar -czvf $BACKUP_DIR/app_data_$DATE.tar.gz -C /opt/bookstack/app .

echo "Backup completed: $DATE"
```

### 5.2 災難復原步驟

1. 啟動全新的 MariaDB 與 BookStack 容器。
    
2. 還原檔案系統：將 `app_data_*.tar.gz` 解壓縮覆蓋至 `/opt/bookstack/app/` 並校正權限（`chown -R 1000:1000`）。
    
3. 還原資料庫：
    
    
   ```bash
    docker compose exec -i bookstack_db mysql -u bookstack -pyour_db_secret_pass bookstackapp < /opt/backups/bookstack/db_*.sql
   ```
    
4. 清理 Laravel 快取並重啟：
    
    
   ```bash
    docker compose exec -it bookstack php /app/www/artisan cache:clear
    docker compose restart bookstack
   ```
