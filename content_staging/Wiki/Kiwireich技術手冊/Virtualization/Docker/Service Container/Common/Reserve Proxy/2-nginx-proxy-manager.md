---
title: Nginx Proxy Manager (NPM) 架設、內部轉址與維護
tags:
  - VM
  - Container
date: 2026-09-04
---
# Nginx Proxy Manager (NPM) 架設、內部轉址與維護

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 資料庫選型：SQLite vs. MariaDB

NPM 在底層儲存 Proxy Hosts、Redirection 與使用者帳號資訊。

- **SQLite（強烈建議）**： 新版 NPM 預設內建 SQLite。若無多台負載平衡或叢集需求，直接使用 SQLite 可以完全擺脫外部關聯式資料庫的依賴，節省記憶體並大幅降低維護複雜度。
    
- **MariaDB / MySQL**： 若環境已有集中式 DB（例如 LibreNMS、WordPress 共用池）或對高可用有強烈需求，可透過環境變數切換。
    

## 2. Docker Compose 建置（SQLite 輕量化）

建議建立一個獨立且全域的 Docker 網路（如 `npm-network`），方便其他後端容器直接加入該網路並透過容器名稱（Container Name）進行通訊，**完全不需要對 Host 做實體 Port Mapping**。

### 步驟 1：建立前置目錄與專用網路

```bash
# 建立共用網路（若尚未建立）
docker network create npm-network

# 建立持久化目錄
mkdir -p /opt/npm/data
mkdir -p /opt/npm/letsencrypt
```

### 步驟 2：`docker-compose.yml` 配置

在 `/opt/npm/docker-compose.yml` 中定義：

```yaml
services:
  npm:
    image: jc21/nginx-proxy-manager:latest
    container_name: nginx-proxy-manager
    restart: unless-stopped
    ports:
      - "80:80"      # HTTP 轉發與 ACME 挑戰
      - "81:81"      # Web 管理儀表板
      - "443:443"    # HTTPS 轉發
    volumes:
      - /opt/npm/data:/data
      - /opt/npm/letsencrypt:/etc/letsencrypt
    networks:
      - npm-network

networks:
  npm-network:
    external: true
```

啟動服務：

```bash
docker compose up -d
```

## 3. 初始設定與登入

1. 瀏覽器訪問：`http://<Host_IP>:81`
    
2. **預設帳號密碼**：
    
    - **Email**：`admin@example.com`
        
    - **Password**：`changeme`
        
3. 首次登入後，系統會**強制要求修改管理員名稱、Email 與密碼**，請妥善保存新密碼。
    

## 4. 核心架構精華：內網純容器名轉址 (Zero-Port Mapping)

除了對外暴露服務外，NPM 在內網環境（配合內部 DNS 如 AdGuard Home、Pi-hole 或 Unbound）最優雅的用法就是**直接以「Container Name」作為轉發目標**。

### 核心運作邏輯

1. **同一個 Docker Network**：Docker 內部內建 Embedded DNS Server (`127.0.0.11`)，只要兩個容器掛載在同一個自定義 bridge 網路（如 `npm-network`），就能直接用容器名稱解析出對方的內部 IP。
    
2. **後端容器不需要映射 Port**：後端容器（例如 Emby、Jellyfin、Vaultwarden）**完全不需要在 `ports:` 暴露給 Host**，僅需在容器內監聽內部 Port。這不僅避免主機 Port 衝突，還大幅縮小內網攻擊面。
    

### 後端應用（以 Emby 為例）配置方式

```yaml
services:
  emby:
    image: amir20/clash # 或其他任何映像檔，此處以 emby 為例
    container_name: emby
    restart: unless-stopped
    # 關鍵：完全不需要寫 ports: - "8096:8096"
    networks:
      - npm-network

networks:
  npm-network:
    external: true
```

### NPM Web 介面設定 (Proxy Host)

1. 前往 **Hosts** -> **Proxy Hosts** -> **Add Proxy Host**。
    
2. **Details** 分頁填寫：
    
    - **Domain Names**：`emby.internal.local`（已在內網 DNS 指向 NPM 主機 IP）
        
    - **Scheme**：`http`
        
    - **Forward Hostname / IP**：`emby`（**直接填寫容器名稱**）
        
    - **Forward Port**：`8096`（填寫該容器內部的 Listen Port）
        
    - 勾選 **Block Common Exploits** 與 **Websockets Support**（若應用需即時通訊）。
        

## 5. 憑證管理：自訂憑證 (Custom SSL) 與 Let's Encrypt

許多人誤以為 NPM 只能透過 UI 重新向 Let's Encrypt 申請憑證，但實際上 NPM **完全支援匯入本機已有的憑證（Custom Certificates）**：

### 5.1 匯入現有/萬用字元憑證 (Custom Certificate)

若你已在主機或透過 acme.sh / DNS API 申請過憑證：

1. 進入 **SSL Certificates** -> **Add SSL Certificate** -> 選擇 **Custom**。
    
2. 命名憑證（如 `My-Wildcard-Cert`）。
    
3. 貼上或上傳檔案：
    
    - **Certificate Key**：貼上私鑰內容（`*.key`）。
        
    - **Certificate**：貼上完整憑證鏈（`fullchain.pem` 或包含憑證本體與中間 CA 的檔案）。
        
4. 儲存後，在 Proxy Host 的 SSL 分頁下拉選單即可直接選用該自訂憑證。
    

### 5.2 透過 NPM 自動申請 Let's Encrypt

- **HTTP-01 挑戰**：直接填寫網域名稱，需確保本機 Port 80 能從公網連通。
    
- **DNS-01 挑戰（推薦萬用憑證）**：勾選 **Use a DNS Challenge**，選擇你的 DNS 服務商（如 Cloudflare），填入 API Token 即可自動簽發 `*.example.com` 萬用字元憑證。
    

## 6. 歷史踩坑與常見反代問題排除 (Troubleshooting)

### 6.1 Calibre-Web 在 Subpath / Reverse Proxy 下破版或無法轉址

Calibre-Web 等應用對 Reverse Proxy 標頭與 Script Name 較敏感。**解法**：在 NPM 該 Host 設定中的 **Custom Locations** -> 加入對應路徑，點選右側齒輪（進階設定），貼入以下 Nginx 標頭指令：

```nginx
proxy_bind $server_addr;
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Scheme $scheme;
proxy_set_header X-Script-Name /${your_location};
```

### 6.2 Portainer-CE 位於 Sub-location（子路徑）的痛點

- **問題成因**：Portainer-CE 前端 Angular/Vue 資源路徑是以根目錄 `/` 進行絕對路徑引用，若硬塞在 `/portainer` 這類 Subpath 底下，會導致大量 JS/CSS 404 破版，且其 WebSocket（`/api/websocket/...`）容易被中斷。
    
- **最佳實踐**：強烈建議**不要使用 Subpath，一律採用獨立子網域（Subdomain）掛載 Virtual Host**（例如 `portainer.internal.local`）。
    
- **重要配置**：反向代理 Portainer 時，務必在 NPM 勾選 **Websockets Support**，否則網頁終端（Console / Exec）會立刻斷線。
    

### 6.3 根路徑（`Host /`）首頁導航

若網域名稱直接指向 NPM，未匹配的 Host 會顯示 NPM 的「Congratulations」預設頁面。

- **實用技巧**：可建立一個儀表板容器（如 Homepage、Dashy 或 Heimdall），在 NPM 建立一個預設 fallback 或主域名 Proxy Host，轉向該儀表板容器，作為家庭實驗室（HomeLab）的入口導航首頁。
    

## 7. Traefik vs. Nginx Proxy Manager 選型速查

|**特性比較**|**Nginx Proxy Manager (NPM)**|**Traefik (v3)**|
|---|---|---|
|**主要定位**|圖形化管理、直覺化操作、傳統 Nginx 擴展|雲原生（Cloud-Native）、宣告式組態、微服務邊緣路由|
|**配置入口**|Web UI 介面（儲存於 DB）|Docker Labels 或靜態/動態 YAML/TOML|
|**自動感知**|需手動在 UI 新增 Host 與 Port|自動監聽 `docker.sock`，容器啟動即自動上線|
|**外部非 Docker 服務**|極度友善（可在 UI 任意輸入實體主機 IP:Port）|需透過 File Provider 撰寫額外動態設定檔|
|**學習曲線**|極低，5 分鐘上手|中等，需理解 Router / Middleware / Service 概念|
|**最佳場景**|內網 DNS 轉址、小型專案、非容器化實體機混編環境|純 Docker / K8s 環境、高動態容器堆疊、無人值守自動化部署|