---
title: Suwayomi (Tachidesk) 自建線上漫畫庫與自動追更
tags:
  - VM
  - Container
date: 2026-09-07
---

# Suwayomi (Tachidesk) 自建線上漫畫庫與自動追更

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 架構全景與現代化演進

```
[使用者客戶端 (Web / Android / iOS / 電子書)]
       │
       ▼ (預設 Port 4567 / HTTPS 反向代理)
┌────────────────────────────────────────────────────────────┐
│ Suwayomi-Server (中央漫畫伺服器)                           │
│ - 書架狀態、閱讀進度、歷史紀錄                             │
│ - 依排程自動檢查新章節並下載至本地儲存 (/data)             │
│ - 內建 Tachiyomi 擴充插件執行環境 (Extensions)             │
└──────────────┬─────────────────────────────┬───────────────┘
               │ (繞過 Cloudflare 驗證)      │ (抓取漫畫圖片)
               ▼                             ▼
       ┌───────────────┐             [各線上漫畫來源網站]
       │ FlareSolverr  │             - 拷貝漫畫 (CopyManga)
       │ (Port 8191)   │             - 漫畫櫃 (Manhuagui)
       └───────────────┘             - 外部擴充庫 (Keiyoushi 等)
```

### 關鍵更新與選型重點 (Breaking Changes & Best Practices)

1. **映像檔名稱更新**：
    
    官方已正式將 Docker 映像檔遷移命名為 `ghcr.io/suwayomi/suwayomi-server:stable`（舊版 `ghcr.io/suwayomi/tachidesk` 仍有別名，但建議全面採用新標準以獲取最新修正）。
    
2. **與 FlareSolverr 網路整合**：
    
    許多漫畫站點（如 CopyManga、動漫之家等）掛載了 Cloudflare 5 秒盾反爬機制。透過共用 Docker 自訂 Bridge 網路，Suwayomi 可直接以 `http://flaresolverr:8191` 調用 FlareSolverr 繞過驗證，無需將 FlareSolverr 暴露給 Host 或走外部路由。
    
3. **儲存規劃與 CBZ 打包**：
    
    預設下載會以散裝圖片目錄儲存；開啟環境變數 `DOWNLOAD_AS_CBZ=true` 可自動將每一話壓縮為單一 `.cbz` 檔案，大幅減少小檔案對宿主機 Inode 的消耗，且方便日後直接匯入 Kavita 或 Komga 等專業漫畫伺服器。
    

## 2. Docker Compose 完整部署範本

本配置整合了 **Suwayomi** 與 **FlareSolverr**，同時設定日誌輪替上限與常用環境參數：

```yaml
services:
  suwayomi:
    image: ghcr.io/suwayomi/suwayomi-server:stable
    container_name: suwayomi
    restart: unless-stopped
    ports:
      # 直連 WebUI 預設埠，若純走 Traefik / NPM 可註解
      - "4567:4567"
    environment:
      - TZ=Asia/Taipei
      # 核心：啟用 FlareSolverr 穿透 Cloudflare
      - FLARESOLVERR_ENABLED=true
      - FLARESOLVERR_URL=http://flaresolverr:8191
      # 自動化下載與更新設定
      - AUTO_DOWNLOAD_CHAPTERS=true           # 偵測到新章節時自動下載
      - DOWNLOAD_AS_CBZ=true                  # 下載章節自動封裝為 .cbz 壓縮檔
      - UPDATE_INTERVAL=12                    # 每 12 小時全域自動檢查更新一次
      # 內建身分驗證（若需暴露於公網，強烈建議開啟）
      - AUTH_MODE=none                        # 可改為 basic_auth 或 ui_login
      # - AUTH_USERNAME=admin
      # - AUTH_PASSWORD=your_super_password
    volumes:
      # 漫畫資料庫、擴充插件與下載章節的持久化目錄
      - /opt/suwayomi/data:/home/suwayomi/.local/share/Tachidesk
    depends_on:
      - flaresolverr
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "3"
    networks:
      - manga_net
      # 若要接入 Traefik / NPM，加入 proxy 網路
      - proxy-network

  flaresolverr:
    image: ghcr.io/flaresolverr/flaresolverr:latest
    container_name: flaresolverr
    restart: unless-stopped
    environment:
      - LOG_LEVEL=info
      - TZ=Asia/Taipei
    # 僅於內部通訊，不需暴露對外 Port
    networks:
      - manga_net

networks:
  manga_net:
    name: manga_net
    driver: bridge
  proxy-network:
    external: true
```

## 3. 反向代理整合 (Traefik v3 / NPM)

### 3.1 透過 Traefik v3 (Labels 宣告)

若使用 Traefik v3，直接在 `suwayomi` 服務段新增 Labels（可將 ports `4567:4567` 註解移除）：

```yaml
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.suwayomi.rule=Host(`manga.example.com`)"
      - "traefik.http.routers.suwayomi.entrypoints=websecure"
      - "traefik.http.routers.suwayomi.tls=true"
      - "traefik.http.routers.suwayomi.tls.certresolver=myresolver"
      - "traefik.http.services.suwayomi.loadbalancer.server.port=4567"
```

### 3.2 透過 Nginx Proxy Manager (NPM)

1. 確保 Suwayomi 與 NPM 在同一個 Docker 外部網路（如 `proxy-network`）。
    
2. 在 NPM UI 新增 Proxy Host：
    
    - **Domain Names**：`manga.example.com`
        
    - **Forward Hostname / IP**：`suwayomi`（直接填容器名稱）
        
    - **Forward Port**：`4567`
        
    - 勾選 **Websockets Support**（閱讀器即時進度同步與終端日誌需要）。
        

## 4. 擴充插件庫 (Extensions) 與圖源設定

自從原 Tachiyomi 官方擴充庫關閉後，社群目前由 **Keiyoushi** 等開源團隊主導維護。新版 Suwayomi 必須先手動加入第三方擴充庫才能搜尋並安裝圖源。

### 步驟 1：新增擴充插件庫 (Extension Repositories)

1. 瀏覽器開啟 `http://<Host_IP>:4567` 進入 Suwayomi Web 介面。
    
2. 點選左側選單 **Settings** -> **Browse** -> **Extension repositories（擴充庫）**。
    
3. 貼入目前社群最主流的 **Keiyoushi** 插件庫索引網址：
    
   ```
    https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.min.json
   ```
    
4. 點擊 **Add** 儲存。
    

### 步驟 2：搜尋並安裝漫畫圖源

1. 點選左側 **Browse（瀏覽）** -> 上方切換至 **Extensions（插件）**。
    
2. 右上角語言篩選器勾選 **中文 (ZH)** 及其他偏好語言。
    
3. 搜尋常用圖源並點擊 **Install** 安裝：
    
    - **CopyManga (拷貝漫畫)**：資源全面、畫質佳。
        
    - **Manhuagui (漫畫櫃)**：老牌經典圖源。
        
    - **Bilibili / 騰訊等官方源**（部分非付費章節可閱）。
        
4. 安裝完成後，切換至 **Sources（圖源）** 分頁，即可開始搜尋漫畫並點擊「**Add to Library（加入書架）**」。
    

## 5. 全平台跨裝置客戶端推薦與連線設定

Suwayomi 不僅能在網頁瀏覽器上看，還支援多元的客戶端連線：

|**客戶端名稱**|**支援平台**|**核心特色**|**連線方式**|
|---|---|---|---|
|**原生 WebUI**|任何有瀏覽器的裝置 (PC / 手機 / 電子書)|免安裝、開箱即用、支援 Webhook 與鍵盤翻頁快捷鍵|直接開啟網址|
|**Sorayomi** (Tachidesk-Sorayomi)|**Android / Windows / Linux / macOS**|官方專屬客戶端，Flutter 開發，UI 極簡、流暢度佳，支援離線快取|設定伺服器 URL：`[https://manga.example.com](https://manga.example.com)`|
|**Mihon (原 Tachiyomi)**|**Android**|透過安裝 `Tachidesk` 擴充套件插件，直接把 Suwayomi 當作單一圖源接入手機端 Mihon|安裝外掛並填入 Server IP|
|**Tachimanga**|**iOS / iPadOS**|iOS 平台上相容 Tachiyomi 擴充協議的優秀閱讀器|透過外部源接入或當成獨立 Reader 使用|

## 6. 常見疑難排解 (Troubleshooting)

### 6.1 圖源無法載入、一直轉圈或報錯 `HTTP 403 / Cloudflare`

- **原因**：圖源站點開啟了嚴格的 Cloudflare 盾或 Turnstile 驗證。
    
- **處置**：
    
    1. 檢查 Compose 中是否確實定義了 `FLARESOLVERR_ENABLED=true` 與 `FLARESOLVERR_URL`。
        
    2. 進入 Suwayomi 容器內測試與 FlareSolverr 的通訊：
        
        
   ```bash
        docker compose exec suwayomi curl -I http://flaresolverr:8191
   ```
        
    3. 若特定來源（如 CopyManga）頻繁超時，可進入該插件設定頁切換不同的 API 鏡像線路。
        

### 6.2 宿主機磁碟空間被吃光

- **原因**：追蹤多本連載漫畫且開啟了自動下載，每話幾十張高畫質圖快速累積數十 GB。
    
- **處置**：
    
    1. 設定 `DOWNLOAD_AS_CBZ=true` 降低目錄零碎檔案。
        
    2. 在 WebUI「Settings -> Downloads」中設定 **Download limit（下載上限）**，例如限制僅快取未讀的前 5 話，已讀自動清除快取。
        

### 6.3 目錄權限報錯 (Permission Denied)

- **原因**：容器內部預設以 `suwayomi` 使用者運行。若宿主機掛載的目錄由 root 建立，會導致無法寫入資料庫或下載圖片。
    
- **處置**：
    
    在宿主機放寬或校正掛載目錄所有權：
    
    
   ```bash
    sudo chown -R 1000:1000 /opt/suwayomi/data
    sudo chmod -R 755 /opt/suwayomi/data
   ```
    

## 7. 維護與資料備份

Suwayomi 的所有書架紀錄、章節進度、已安裝外掛與下載檔案均集中在單一目錄下：

```bash
# 1. 備份資料目錄（排除 downloads 可大幅縮減備份體積）
sudo tar --exclude='downloads' -czvf /opt/backups/suwayomi-config-$(date +%F).tar.gz -C /opt/suwayomi data

# 2. 全量備份（含已下載漫畫）
sudo tar -czvf /opt/backups/suwayomi-full-$(date +%F).tar.gz -C /opt/suwayomi data

# 3. 還原方式
sudo tar -xzvf /opt/backups/suwayomi-*.tar.gz -C /opt/suwayomi/
docker compose restart suwayomi
```