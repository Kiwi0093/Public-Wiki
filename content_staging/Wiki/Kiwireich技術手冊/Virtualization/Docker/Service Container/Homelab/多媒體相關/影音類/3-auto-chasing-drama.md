---
title: 自動化影音追劇與媒體庫全流程建置
tags:
  - VM
  - Container
date: 2026-09-04
---
# 自動化影音追劇與媒體庫全流程建置

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 架構全景與現代化演進

### 1.1 核心元件分工

自動化追劇系統本質上是資料流水線（Pipeline），各層元件職責如下：

```
       [ 使用者需求 (Requests) ]
         │ (搜尋劇集 / 動畫 / 音樂)
         ▼
 ┌───────────────────────────────────────────────────────────┐
 │ *arr 管理層 (Sonarr / Radarr / Lidarr)                     │
 └───────┬───────────────────────────────────────────▲───────┘
         │ 1. 查詢種子               4. 抓取完成通知  │ (Hardlink 匯入媒體庫)
         ▼                                           │
 ┌───────────────┐                           ┌───────┴──────────┐
 │ Prowlarr      │                           │ qBittorrent      │
 │ (聚合索引器)   │                           │ (下載客戶端)     │
 └───────┬───────┘                           └───────▲──────────┘
         │ 2. 送出搜尋                               │ 3. 指派下載 (走 VPN)
         ▼                                           │
 ┌───────────────┐                           ┌───────┴──────────┐
 │ FlareSolverr  │                           │ Gluetun (VPN)    │
 │ (解 Cloudflare)│                          │ [Kill-Switch]    │
 └───────────────┘                           └──────────────────┘
                                                       │
                                                       ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ 字幕與媒體展現層 (Bazarr / Emby / Navidrome)                  │
 │ - Bazarr: 監控 Sonarr/Radarr 自動匹配中文字幕                │
 │ - Emby: 電影/影集刮削展示、GPU 轉碼播放                      │
 │ - Navidrome: 輕量音樂串流 (適配 Lidarr 音樂庫)               │
 └──────────────────────────────────────────────────────────────┘
```

### 1.2 社群最新演進與選型修正 (Change Log: Rev 2.0+)

1. **僅將下載器包進 VPN，管理層全面釋出**：
    
    - 過去「將全部服務塞進 Gluetun 網路」的做法，會導致 Sonarr/Radarr/Lidarr 的 API 請求（如 MusicBrainz、TheTVDB 等外部中繼資料）全部被 VPN 節點品質牽制；一旦 VPN 節點出現線路不穩或公網 IP 檢查失敗，所有元資料抓取便會全面停擺。
        
    - **最新標準解法**：僅讓 **qBittorrent** 共享 Gluetun 的網路命名空間（`network_mode: "service:gluetun"`），確保只有實際 BT/PT 下載流量走 VPN。其餘管理容器走標準 Docker 自訂 Bridge 網路，直接以「容器名稱」通訊，免去寫死靜態 IP 的繁瑣維護。
        
2. **使用 Prowlarr 取代 Jackett**：
    
    - Jackett 是傳統的 Indexer 代理工具；新一代的 **Prowlarr** 與 Sonarr / Radarr 同為 LinuxServer/*arr 家族，原生整合度更高，能透過單一介面將設定好的索引器「一鍵自動同步」到所有 Sonarr、Radarr 與 Lidarr 實例中，不再需要手動在每個工具內複製 Torznab URL 與 API Key。
        
3. **使用 Bazarr 取代 ChineseSubFinder**：
    
    - ChineseSubFinder 已停止維護。目前最佳替代品為 **Bazarr**，它直接透過 API 監控 Sonarr / Radarr 的資料庫，並支援多種字幕來源（如字幕庫、Shooter、Assrt），無字幕時自動背景定時重試。
        

## 2. 前期準備：儲存架構、硬連結與系統底層

### 2.1 儲存目錄結構與 Hardlink（極度重要）

很多初學者將下載目錄掛載為 `/downloads`，媒體目錄掛載為 `/media`，這會導致 Docker 認為它們是兩個不同的檔案系統。當下載完成時，Sonarr/Radarr 只能使用 **跨卷拷貝 (Copy + Delete)**，不僅速度緩慢、大量消耗磁碟壽命，還會使硬碟空間被佔用兩倍。

**最佳實踐：統一掛載單一根目錄以實現硬連結 (Hardlinks)**

```
/data
├── torrents         <-- qBittorrent 下載暫存與做種目錄
│   ├── movies
│   ├── tv
│   ├── anime
│   └── music
└── media            <-- Emby / Navidrome 讀取的整理完畢媒體庫
    ├── movies       <-- 由 Radarr 硬連結過來 (零磁碟空間重複佔用)
    ├── tv           <-- 由 Sonarr 硬連結過來
    ├── anime
    └── music        <-- 由 Lidarr 硬連結過來
```

所有容器內部統一掛載 `/data:/data`。當下載完成時，系統只需建立 inode 指標（Hardlink），一秒完成匯入，且能維持 BT 原檔在 `torrents` 目錄繼續做種。

### 2.2 Photon OS 載入 TUN 核心模組

Gluetun 需要宿主機支援 TUN 虛擬網路介面。Photon OS 預設未載入 `tun.ko`：

```bash
# 1. 手動載入 TUN 核心模組
modprobe tun

# 2. 確認載入成功
lsmod | grep tun

# 3. 設定開機自動載入
echo tun > /etc/modules-load.d/tun.conf
```

## 3. 後端 Docker Compose 完整配置範本

本設定採用以下機制：

- **qBittorrent** 透過 `network_mode: "service:gluetun"` 完全被保護在 VPN 隧道與 Kill-Switch 內。
    
- **qBittorrent 的 WebUI (Port 4080)** 與 BT 傳輸埠對外發布於 `gluetun` 的 `ports:` 段。
    
- **其他服務** 掛載在共用橋接網路 `media_net`，透過容器名稱相互解析，完全不需在 Compose 裡寫死 IP。
    
- 關閉 Gluetun 的公網 IP 檢查（`PUBLICIP_ENABLED=false`），避免因查詢 API 被阻擋導致啟動卡死。
    

```yaml
services:
  # =========================================================================
  # 1. VPN 核心層 (Gluetun + qBittorrent)
  # =========================================================================
  gluetun:
    image: qmcgaw/gluetun:latest
    container_name: gluetun
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    ports:
      # 轉發 qBittorrent WebUI
      - "4080:4080"
      # 轉發 qBittorrent 傳輸埠 (若 VPN 支援 Port Forwarding 可對外開放)
      - "6881:6881"
      - "6881:6881/udp"
    volumes:
      - /opt/appdata/gluetun:/gluetun
    environment:
      - VPN_SERVICE_PROVIDER=custom
      - VPN_TYPE=wireguard
      - WIREGUARD_ENDPOINT_IP=<Your_VPN_Endpoint_IP>
      - WIREGUARD_ENDPOINT_PORT=<Your_VPN_Endpoint_Port>
      - WIREGUARD_PUBLIC_KEY=<Your_Wireguard_Public_Key>
      - WIREGUARD_PRESHARED_KEY=<Your_Wireguard_Preshared_Key>
      - WIREGUARD_PRIVATE_KEY=<Your_Wireguard_Private_Key>
      - WIREGUARD_ADDRESSES=<Your_Wireguard_Internal_IP/CIDR>
      # 關鍵：關閉啟動時的外部 IP 檢查，避免因第三方 API 失敗引發 Kill-Switch 阻擋
      - PUBLICIP_ENABLED=false
      # 允許宿主機或局域網網段存取 Gluetun 暴露的 WebUI (依實際內網調整)
      - FIREWALL_OUTBOUND_SUBNETS=172.16.0.0/12,192.168.0.0/16
    networks:
      - media_net

  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    container_name: qbittorrent
    restart: unless-stopped
    depends_on:
      gluetun:
        condition: service_started
    # 核心：完全依附於 Gluetun 網路，無任何漏網風險
    network_mode: "service:gluetun"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
      - WEBUI_PORT=4080
    volumes:
      - /opt/appdata/qbittorrent:/config
      # 統一資料路徑以實現 Hardlink
      - /mnt/storage/data:/data

  # =========================================================================
  # 2. 索引器與驗證碼解析層 (Prowlarr + FlareSolverr)
  # =========================================================================
  prowlarr:
    image: lscr.io/linuxserver/prowlarr:latest
    container_name: prowlarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
    volumes:
      - /opt/appdata/prowlarr:/config
    ports:
      - "9696:9696"
    networks:
      - media_net

  flaresolverr:
    image: ghcr.io/flaresolverr/flaresolverr:latest
    container_name: flaresolverr
    restart: unless-stopped
    environment:
      - LOG_LEVEL=info
      - TZ=Asia/Taipei
    ports:
      - "8191:8191"
    networks:
      - media_net

  # =========================================================================
  # 3. 媒體管理與自動下載排程層 (*arr 系列)
  # =========================================================================
  radarr:
    image: lscr.io/linuxserver/radarr:latest
    container_name: radarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
    volumes:
      - /opt/appdata/radarr:/config
      - /mnt/storage/data:/data
    ports:
      - "7878:7878"
    networks:
      - media_net

  sonarr:
    image: lscr.io/linuxserver/sonarr:latest
    container_name: sonarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
    volumes:
      - /opt/appdata/sonarr:/config
      - /mnt/storage/data:/data
    ports:
      - "8989:8989"
    networks:
      - media_net

  lidarr:
    image: lscr.io/linuxserver/lidarr:latest
    container_name: lidarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
    volumes:
      - /opt/appdata/lidarr:/config
      - /mnt/storage/data:/data
    ports:
      - "8686:8686"
    networks:
      - media_net

  # =========================================================================
  # 4. 字幕刮削層 (Bazarr)
  # =========================================================================
  bazarr:
    image: lscr.io/linuxserver/bazarr:latest
    container_name: bazarr
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
    volumes:
      - /opt/appdata/bazarr:/config
      - /mnt/storage/data:/data
    ports:
      - "6767:6767"
    networks:
      - media_net

networks:
  media_net:
    name: media_net
    driver: bridge
```

## 4. 前端展示層配置 (Emby & Navidrome)

前端展示層直接讀取 `/data/media` 內的各類別目錄，不參與下載流程，通常獨立於另一個 Compose 管理或配置於同一主機。

```yaml
services:
  emby:
    image: amir20/clash # 或官方 emby/embyserver:latest
    container_name: emby
    restart: unless-stopped
    environment:
      - UID=1000
      - GID=1000
      - TZ=Asia/Taipei
    volumes:
      - /opt/appdata/emby:/config
      - /mnt/storage/data/media:/media:ro  # 建議掛載為唯讀，防止誤刪
    # 若有 Intel 內顯轉碼需求，開啟硬體加速 (QSV)
    # devices:
    #   - /dev/dri:/dev/dri
    ports:
      - "8096:8096"
    networks:
      - media_net

  navidrome:
    image: deluan/navidrome:latest
    container_name: navidrome
    restart: unless-stopped
    user: "1000:1000"
    environment:
      - ND_SCANSCHEDULE=1h
      - ND_LOGLEVEL=info
      - ND_BASEURL=""
    volumes:
      - /opt/appdata/navidrome:/data
      - /mnt/storage/data/media/music:/music:ro
    ports:
      - "4533:4533"
    networks:
      - media_net

networks:
  media_net:
    external: true
```

## 5. 跨服務串接指南 (內部通訊填寫標準)

因為所有服務（除了依附於 Gluetun 的 qBittorrent 外）都在同一個 `media_net` 自訂網路內，**容器間能直接透過服務名稱進行 DNS 通訊**，無需填寫宿主機 IP 或設定額外的靜態 IP。

### 5.1 Prowlarr 串接 FlareSolverr

- 在 Prowlarr 進入 **Settings** -> **Indexers** -> 點選新增 **FlareSolverr**。
    
- **Host** 填入：`http://flaresolverr:8191`
    
- **Tag** 填入：`flaresolverr`（之後遇到有 Cloudflare 防護的站點，在該 Indexer 上標記此 Tag 即可）。
    

### 5.2 Prowlarr 自動同步到 Sonarr / Radarr / Lidarr

進入 **Settings** -> **Apps** -> 點選新增：

- **Sonarr**：
    
    - **Prowlarr Server**：`http://prowlarr:9696`
        
    - **Sonarr Server**：`http://sonarr:8989`
        
    - **ApiKey**：填入 Sonarr 的 API Key。
        
- **Radarr** 與 **Lidarr** 比照辦理，填入對應的容器名稱與埠號。儲存後，Prowlarr 內的所有種子站點會全自動同步進各應用程式。
    

### 5.3 Sonarr / Radarr 串接 qBittorrent

進入 **Settings** -> **Download Clients** -> 選擇 **qBittorrent**：

- **Host**：填入 `gluetun`（**注意：因為 qBittorrent 使用了 Gluetun 的網路，其對外暴露的主機名稱就是 `gluetun`**）。
    
- **Port**：`4080`
    
- **Username / Password**：填入 qBittorrent WebUI 設定的帳密。
    
- **Category**：
    
    - Sonarr 填入：`tv`
        
    - Radarr 填入：`movies`
        
    - Lidarr 填入：`music`
        

### 5.4 Bazarr 串接 Sonarr 與 Radarr

進入 **Settings** -> **Sonarr**：

- **Address**：`sonarr`，**Port**：`8989`，填入 API Key。 進入 **Settings** -> **Radarr**：
    
- **Address**：`radarr`，**Port**：`7878`，填入 API Key。
    

## 6. 常見疑難排解 (Troubleshooting)

### 6.1 qBittorrent 預設密碼無法登入（無效憑證）

新版 LinuxServer qBittorrent 容器為求安全，已不再使用預設的 `adminadmin`：

- **初次密碼獲取**：執行 `docker compose logs qbittorrent`，日誌中會印出一串一次性隨機產生的管理員密碼。
    
- **手動重設密碼**：若無法登入，可執行以下指令重置為 `adminadmin`：
    
    
   ```bash
    # 停止 qbittorrent
    docker compose stop qbittorrent
    # 編輯 /opt/appdata/qbittorrent/qBittorrent/qBittorrent.conf
    # 刪除 WebUI\Password_PBKDF2 該行設定後重啟容器
    docker compose start qbittorrent
   ```
    

### 6.2 Lidarr 無法新增音樂、搜不到歌手 (MusicBrainz 報錯)

- **原因**：舊配置若將 Lidarr 放進 Gluetun 內部，常因為 VPN 節點被 MusicBrainz API 封鎖，或是 Gluetun DNS 異常造成請求逾時。
    
- **處置**：遵循 Rev 2.0 架構，確保 Lidarr 連接標準 Docker 網路走本地寬頻對外，即可解決歌手中繼資料查詢卡死的問題。
    

### 6.3 檔案重複佔用空間、硬碟迅速被塞滿

- **原因**：Sonarr / Radarr 的下載目錄映射與 qBittorrent 不一致，導致 Hardlink 機制失效退回成「複製（Copy）」。
    
- **處置**：檢查各容器的 volume 設定，確認映射路徑皆為全域相同的根目錄（例如全數使用 `/data:/data`），並且在 Sonarr/Radarr 的 **Settings -> Media Management** 中確認已開啟 **Use Hardlinks instead of Copy**。