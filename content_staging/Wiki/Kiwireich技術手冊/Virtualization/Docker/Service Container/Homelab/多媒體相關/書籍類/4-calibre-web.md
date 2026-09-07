---
title: Calibre-Web 自建私有電子書庫與跨裝置閱讀管理
tags:
  - VM
  - Container
date: 2026-09-07
---

# Calibre-Web 自建私有電子書庫與跨裝置閱讀管理

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 架構核心概念與避坑指南

### 1.1 書庫結構與 `metadata.db` 核心依賴

- Calibre-Web **無法獨立無中生有建立全新書庫**，它必須掛載一個**已經包含 `metadata.db` 的 Calibre 書庫目錄**。
    
- 初次建置時，若指定的目錄為空，系統會報錯並拒絕初始化。必須先用桌面版 Calibre 建立書庫，或放入一個空白但合格的 `metadata.db`。
    

### 1.2 儲存拆分鐵律：本機 SSD vs. NAS 網路掛載

如同 Navidrome 與 Nextcloud 的維護經驗，SQLite 資料庫在網路檔案系統上有重大陷阱：

- **書庫實體目錄 (`/books`)**：
    
    儲存書籍本體（EPUB、MOBI、PDF、封面圖），**強烈建議掛載於 NAS**（支援 SMB/CIFS 或高效能 NFS）。
    
- **設定檔與應用資料庫 (`/config`)**：
    
    包含 Calibre-Web 自身的使用者權限、閱讀進度與書籤資料庫（`app.db`）。**務必保留在宿主機本機 SSD**，切勿掛在 CIFS/NFS 網路磁碟上，以避免高頻鎖定衝突造成 SQLite 損毀。
    

### 1.3 `USE_CONFIG_DIR=true` 的作用

在 LinuxServer.io 的 Calibre-Web 映像檔中，宣告 `USE_CONFIG_DIR=true` 代表強制將 Calibre-Web 的自身系統資料庫 `app.db` 存放在 `/config` 中，與 `/books` 內的 Calibre 書庫 `metadata.db` 進行物理隔離，確保多使用者與備份管理更安全。

## 2. 前置準備：Photon OS 掛載 NAS 書庫 (CIFS vs. NFS)

### 方案 A：使用 CIFS / SMB 掛載

若 NAS 原生偏向 Windows ACL 或透過帳密存取：

```bash
# 1. 確保已安裝 cifs-utils
tdnf -y install cifs-utils

# 2. 建立掛載點
sudo mkdir -p /mnt/nas/books

# 3. 編輯 /etc/fstab 自動掛載
# //192.168.1.50/Books /mnt/nas/books cifs credentials=/root/.smbcredentials/nas,uid=1000,gid=1000,rw,iocharset=utf8,_netdev,nofail 0 0
```

### 方案 B：使用 NFSv4.1 掛載（推薦，效能更佳）

在 NAS 端開放 NFS 導出與白名單 IP，於 Photon OS 掛載：

```bash
# 1. 安裝 NFS 工具
tdnf -y install nfs-utils
systemctl enable --now rpcbind

# 2. 建立掛載點
sudo mkdir -p /mnt/nas/books

# 3. 編輯 /etc/fstab
# 192.168.1.50:/volume1/Books /mnt/nas/books nfs nfsvers=4.1,rw,_netdev,nofail,hard,intr,rsize=1048576,wsize=1048576 0 0

# 4. 測試掛載
sudo mount -a
ls -la /mnt/nas/books
```

_(注意：若需要在 Web 介面上傳書籍或編輯中繼資料，掛載權限必須是 `rw` 可讀寫)_。

## 3. Docker Compose 完整部署配置 (整合 Traefik v3)

本配置將 `/config` 保留在本機 SSD（`/opt/calibre-web/config`），書籍庫掛載 NAS 的 `/mnt/nas/books`，並由 Traefik 接管 SSL 卸載。

### 步驟 1：建立本機專用目錄並修正權限

```bash
sudo mkdir -p /opt/calibre-web/config
sudo chown -R 1000:1000 /opt/calibre-web/config
```

### 步驟 2：`docker-compose.yml` 配置

```yaml
services:
  calibre-web:
    image: lscr.io/linuxserver/calibre-web:latest
    container_name: calibre-web
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
      # 關鍵：將 app.db 隔離儲存在 /config 內
      - USE_CONFIG_DIR=true
      # 預先指定轉檔工具目錄（若有安裝 kepubify 或 Calibre 轉換二進位檔）
      - DOCKER_MODS=linuxserver/mods:universal-calibre # 可選：啟用後端格式轉檔支援
    volumes:
      - /opt/calibre-web/config:/config
      - /mnt/nas/books:/books
    networks:
      - proxy-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.calibre-web.rule=Host(`books.example.com`)"
      - "traefik.http.routers.calibre-web.entrypoints=websecure"
      - "traefik.http.routers.calibre-web.tls=true"
      - "traefik.http.routers.calibre-web.tls.certresolver=myresolver"
      # 轉發至容器內部的 8083 埠口
      - "traefik.http.services.calibre-web.loadbalancer.server.port=8083"

networks:
  proxy-network:
    external: true
```

啟動服務：

```bash
docker compose up -d
```

## 4. Nginx / Nginx Proxy Manager (Subpath 與子網域設定)

### 4.1 方案 A：子路徑反向代理 (`/book`)

若必須將 Calibre-Web 放置於次目錄路徑下，Nginx 必須帶上 `X-Script-Name`（注意路徑**不可有結尾斜線**）：

```nginx
location /book {
    proxy_pass http://calibre-web:8083;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Scheme $scheme;
    # 核心：通知後端應用子路徑基底
    proxy_set_header X-Script-Name /book;
    
    # 支援大容量電子書（如掃描版 PDF/漫畫）上傳
    client_max_body_size 500M;
}
```

### 4.2 方案 B：獨立子網域 (`books.example.com`)

在 NPM 新增 Proxy Host：

- **Forward Hostname / IP**：`calibre-web`
    
- **Forward Port**：`8083`
    
- 勾選 **Websockets Support** 與 **Block Common Exploits**。
    
- 在 **Advanced** 區塊加入 `client_max_body_size 500M;` 避免上傳大檔案被擋。
    

## 5. 初次初始化與核心功能設定

1. 瀏覽器開啟：`[https://books.example.com](https://books.example.com)`
    
2. **預設最高權限帳號密碼**：
    
    - **帳號**：`admin`
        
    - **密碼**：`admin123`
        
3. **指定書庫位置**：
    
    - 進入初始引導頁面，在 **Location of Calibre database** 欄位填入：
        
        
   ```
        /books
   ```
        
    - 點擊 **Save**。系統會自動驗證 `/books/metadata.db` 是否存在。
        
4. **安全變更**：
    
    - 立即點擊右上角 `admin` -> 變更密碼並綁定 Email。
        

### 5.1 開啟「網頁上傳」與「格式轉檔」功能

預設情況下，Calibre-Web 僅允許瀏覽與下載。若希望直接在 Web 介面上傳電子書：

1. 以 `admin` 登入 -> 進入 **Admin** -> **Edit Basic Configuration**。
    
2. 展開 **Feature Configuration**：
    
    - 勾選 **Enable Uploads**（開啟上傳按鈕）。
        
    - 勾選 **Enable Anonymous Browsing**（依需求決定是否允許訪客免登入瀏覽）。
        
3. 進入 **Edit User** -> 編輯指定使用者 -> 勾選 **Upload allowed**。
    

## 6. 跨裝置閱讀與 OPDS 書庫直連

Calibre-Web 內建強大的 **OPDS (Open Publication Distribution System)** 協定，讓平板與電子閱讀器不需透過瀏覽器下載，即可直接在 App 內瀏覽與一鍵借閱下載。

### 6.1 OPDS 連線網址

- 全域 OPDS 網址：
    
    `[https://books.example.com/opds](https://books.example.com/opds)`
    
- 若使用子路徑：
    
    `[https://example.com/book/opds](https://example.com/book/opds)`
    

### 6.2 各平台閱讀客戶端推薦

|**平台 / 設備**|**推薦閱讀軟體**|**核心特色與連線方式**|
|---|---|---|
|**Android / 開放式電子紙 (文石/墨案)**|**KOReader** (首選) / **Moon+ Reader (靜讀天下)**|支援 OPDS 直連、自訂排版、自動切邊，閱讀 EPUB/PDF 體驗最佳。在書庫管理新增 OPDS 填入網址與帳密。|
|**iOS / iPadOS**|**KyBook 3** / **Marvin** / **Yomu**|內建 OPDS 目錄同步、排版細緻、支援雲端字體。|
|**Kindle (封閉式)**|**Send-to-Kindle (郵件推播)**|在 Calibre-Web 設定 SMTP 與使用者的 `@kindle.com` 信箱，點擊書籍旁的「Send to Kindle」一鍵發送。|
|**Windows / macOS**|**Calibre 桌面版** / 網頁內建閱讀器|深度編輯、排版修訂與備份。|

> **Kindle 推播關鍵技巧**：
> 
> 1. 亞馬遜官方已全面棄用 `.mobi` 推播，目前 Send to Kindle **全面採用 `.epub` 格式**。
>     
> 2. Calibre-Web 每個使用者帳號只能綁定一組 Kindle 接收信箱。若手上有兩台以上 Kindle（如 Oasis 與 Paperwhite），需在後台建立兩個獨立帳號，各自綁定不同的 `@kindle.com` 信箱。
>     

## 7. 維護與資料備份

得益於儲存分離架構，備份十分輕鬆：

```bash
# 1. 備份 Calibre-Web 系統設定與使用者進度 (SSD 本機端)
sudo tar -czvf /opt/backups/calibre-web-config-$(date +%F).tar.gz -C /opt/calibre-web config

# 2. 書庫本體 (/books)
# 書籍本體與 metadata.db 已在 NAS 上，直接納入 NAS 本身的快照 (Snapshot) 或 Hyper Backup 排程即可。

# 還原方式
sudo tar -xzvf /opt/backups/calibre-web-config-*.tar.gz -C /opt/calibre-web/
docker compose restart calibre-web
```
