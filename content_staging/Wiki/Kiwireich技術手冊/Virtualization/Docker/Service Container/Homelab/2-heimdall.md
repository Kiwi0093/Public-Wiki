---
title: Heimdall 應用程式導航首頁建置
tags:
  - VM
  - Container
date: 2026-09-04
---
# Heimdall 應用程式導航首頁建置

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 核心定位與架構規劃

- **首頁入口門戶**：將內網中雜亂的 Port 號（如 Portainer `:9443`、LibreNMS `:8000`、Node-RED `:1880`、Nextcloud）收攏為可視化卡片。
    
- **SSL 卸載機制**：由於前端通常由 NPM / Traefik 接管 HTTPS 憑證，Heimdall 本身**完全不需要對外開放 443 Port**，僅需內部監聽 Port 80 即可，省去憑證管理負擔。
    
- **資料持久化**：所有使用者設定、卡片排列、自訂圖示與內建 SQLite 資料庫均儲存在容器內的 `/config` 目錄。
    

## 2. Docker Compose 現代化部署

### 步驟 1：建立持久化目錄與權限

```bash
sudo mkdir -p /opt/heimdall/config
sudo chown -R 1000:1000 /opt/heimdall/config
```

### 步驟 2：`docker-compose.yml` 配置

在 `/opt/heimdall/docker-compose.yml` 中定義：

```yaml
services:
  heimdall:
    image: ghcr.io/linuxserver/heimdall:latest
    container_name: heimdall
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
    volumes:
      - /opt/heimdall/config:/config
    # 若走反向代理，只需暴露內部 Port 或直接掛載到共用網路
    ports:
      - "8081:80"
    networks:
      - proxy-network

networks:
  proxy-network:
    external: true
```

啟動服務：

```bash
docker compose up -d
```

## 3. 反向代理整合 (NPM / Traefik)

### 3.1 透過 Nginx Proxy Manager (NPM) 作為預設首頁

1. 在 NPM 新增 Proxy Host：
    
    - **Domain Names**：`home.example.com`（或主網域名稱）
        
    - **Forward Hostname / IP**：`heimdall`（同處 `proxy-network` 時直接填容器名）
        
    - **Forward Port**：`80`
        
    - 勾選 **Websockets Support** 與 **Block Common Exploits**。
        
2. 申請或掛載 SSL 憑證並開啟 Force SSL。
    

### 3.2 透過 Traefik v3 (Labels 宣告)

若使用 Traefik，可直接在 `docker-compose.yml` 的 `heimdall` 服務段加上標籤，並拿掉 `ports:` 映射：

```yaml
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.heimdall.rule=Host(`home.example.com`)"
      - "traefik.http.routers.heimdall.entrypoints=websecure"
      - "traefik.http.routers.heimdall.tls=true"
      - "traefik.http.routers.heimdall.tls.certresolver=myresolver"
      - "traefik.http.services.heimdall.loadbalancer.server.port=80"
```

## 4. 基礎使用與「增強型應用 (Enhanced Apps)」功能

Heimdall 的卡片不只是靜態捷徑，它支援串接後端 API 即時顯示數據（Enhanced Apps）。

### 4.1 新增一般捷徑卡片

1. 點選首頁右下角的「+」號（Add item）。
    
2. 在 **Application Name** 輸入服務名稱（例如 `Nextcloud` 或 `Portainer`）。
    
3. 系統會自動帶出官方支援清單並補齊預設圖示與底色。
    
4. 填入 **URL**（如 `[https://cloud.example.com](https://cloud.example.com)`）。
    

### 4.2 啟用 Enhanced Apps 即時狀態顯示

若服務支援 API 整合（如 Pi-hole、AdGuard Home、qBittorrent、Transmission、Plex、Proxmox）：

- 在卡片設定下方會多出 **Config** 區塊。
    
- 輸入該應用的 **API Key**、**Token** 或帳號密碼。
    
- **效果**：卡片上會直接顯示 Pi-hole 的「已阻擋廣告數/查詢總數」、下載器的「即時下載/上傳速率」或媒體庫的「正在播放人數」。
    

## 5. Heimdall 視覺美化技巧 (Personalization)

預設的純色背景與大方塊樣式較為單調，可透過內建功能與自訂 CSS 進行升級：

### 5.1 自訂高解析度桌布與暗黑模式

1. 點擊右下角齒輪（Settings）。
    
2. **Background Image**：上傳 4K 桌布（或指定 Unsplash 隨機桌布 URL）。
    
3. **Background Blur / Opacity**：若卡片文字閱讀不易，可在設定中調整背景模糊度（Blur）與遮罩暗度。
    
4. 勾選 **Dark Mode**。
    

### 5.2 導入社群高品質向量圖示 (Dashboard Icons)

Heimdall 內建圖示多為 PNG 點陣圖，有時放大會模糊。可至社群維護的開源圖示庫（如 [walkxcode/dashboard-icons](https://github.com/walkxcode/dashboard-icons)）下載對應的 SVG / 高清 PNG，並在編輯卡片時直接上傳自訂圖示。

### 5.3 注入 Custom CSS 打造毛玻璃卡片 (Glassmorphism)

Heimdall 支援在宿主機自訂樣式檔。

編輯 `/opt/heimdall/config/www/custom.css`（若無則新建）：

```css
/* 讓卡片呈現半透明毛玻璃效果 */
.item {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

/* 滑鼠懸停時微幅上浮放大 */
.item:hover {
    transform: translateY(-4px) scale(1.02) !important;
    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5) !important;
}

/* 隱藏右下角未登入時多餘的編輯按鈕（訪客模式更乾淨） */
body:not(.logged-in) #edit-toggle {
    display: none;
}
```

編輯完成後，在瀏覽器強制重新整理（`Ctrl + F5`）即可套用。

## 6. 社群進階替代方案選型比較

Heimdall 的優勢在於**純 Web UI 點選即可完成所有配置**，但若追求更強大的系統即時監控、Docker 容器狀態聯動或宣告式（YAML）維護，可評估社群近年主流的替代方案：

|**儀表板名稱**|**設定方式**|**資源佔用**|**核心特色**|**適合客群**|
|---|---|---|---|---|
|**Heimdall**|**純 Web GUI**|極低 (~30MB)|點選式操作、內建簡易 API 數據卡、上手 1 分鐘|不想寫設定檔、需要直覺操作的輕量入口|
|**Homepage** _(gethomepage.dev)_|**純 YAML 檔案**|低 (~50MB)|高度模組化、自動感知 Docker 狀態、豐富的系統資源 Widget (CPU/RAM/磁碟)|喜歡用程式碼管理（GitOps / Infrastructure as Code）的玩家|
|**Homarr**|**Web GUI + 拖曳式**|中等 (~150MB)|格線自由拖曳排版、內建檔案總管、種子搜尋與 Docker 管理|追求高度客製化儀表板版面配置|
|**Dashy**|**YAML + Web GUI 雙向**|較高 (~200MB)|功能極度繁多、支援自建外觀主題、Status Check 健康檢查|需要高密度資訊展示、精細控管每個像素的硬核玩家|

## 7. 資料備份與還原

Heimdall 的所有配置（包含使用者、卡片、背景圖與上傳圖示）均集中在 `/config` 內：

```bash
# 備份配置
sudo tar -czvf /opt/backups/heimdall-$(date +%F).tar.gz -C /opt/heimdall config

# 還原配置
sudo tar -xzvf /opt/backups/heimdall-*.tar.gz -C /opt/heimdall/
sudo chown -R 1000:1000 /opt/heimdall/config
docker compose restart heimdall
```