---
title: Navidrome 輕量自建音樂串流伺服器
tags:
  - VM
  - Container
date: 2026-09-04
---
# Navidrome 輕量自建音樂串流伺服器建置與全平台客戶端手冊 (Wiki 完整版)

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 架構前置準備：Photon OS 掛載 NAS 音樂庫 (SMB vs. NFS)

若音樂本體存放在外部 NAS 上，需將目錄安全掛載至宿主機。在 Linux / Photon OS 環境下，**NFS 通常比 SMB/CIFS 具備更低的 CPU 負載與更好的音訊小檔案讀取效能**。

### 方案 A：使用 CIFS / SMB 掛載（傳統通用）

適合 NAS 原生權限偏向 Windows ACL，或需透過專屬帳密保護的場景。

```bash
# 1. 安裝工具套件
tdnf -y install cifs-utils

# 2. 建立帳密保護檔（避免密碼明文出現在 fstab）
sudo mkdir -p /root/.smbcredentials
sudo bash -c 'cat << EOF > /root/.smbcredentials/nas
username=nas_username
password=nas_secret_password
domain=WORKGROUP
EOF'
sudo chmod 600 /root/.smbcredentials/nas

# 3. 建立本機掛載點
sudo mkdir -p /mnt/nas/music
```

編輯 `/etc/fstab` 加入：

```bash
//192.168.1.50/Music /mnt/nas/music cifs credentials=/root/.smbcredentials/nas,uid=1000,gid=1000,ro,iocharset=utf8,_netdev,nofail 0 0
```

### 方案 B：使用 NFS 掛載（推薦，效能更佳、原生 Linux 支援）

NFS 走 Linux 原生協定，開銷更小。在 NAS 端先為該資料夾開啟 NFS 服務，並**將 Photon OS 的 IP 加入允許清單**（建議設定為唯讀 `ro`，並配置 `all_squash` 映射為特定 UID/GID）。

#### 步驟 1：在 Photon OS 安裝 NFS 客戶端

```bash
# 安裝 NFS 支援套件
tdnf -y install nfs-utils

# 啟動並設定 rpcbind 服務開機自啟
systemctl enable --now rpcbind
```

#### 步驟 2：測試 NAS 端 NFS 導出路徑

確認能正常看見 NAS 提供的共享資料夾：

```bash
showmount -e 192.168.1.50
# 輸出範例：
# /volume1/Music  192.168.1.0/24
```

#### 步驟 3：建立本機掛載點

```bash
sudo mkdir -p /mnt/nas/music
```

#### 步驟 4：配置 `/etc/fstab` 開機自動掛載

編輯 `/etc/fstab`，加入以下設定：

```bash
192.168.1.50:/volume1/Music /mnt/nas/music nfs nfsvers=4.1,ro,_netdev,nofail,hard,intr,rsize=1048576,wsize=1048576 0 0
```

- **關鍵參數解析**：
    
    - **`nfsvers=4.1`**：優先使用 NFSv4.1（具備更好狀態管理與防火牆友善度；若 NAS 較舊可改為 `nfsvers=3`）。
        
    - **`ro`**：掛載為**唯讀模式**。Navidrome 僅需讀取音訊，設定唯讀可徹底杜絕誤刪或勒索病毒風險。
        
    - **`_netdev`**：核心參數，強制系統**等待網路完成連線後**才掛載，避免開機階段因找不到 NAS 而卡住開機流程。
        
    - **`nofail`**：若 NAS 重開機或離線，作業系統會略過此項目繼續正常啟動，不進入 Emergency Mode。
        
    - **`hard,intr`**：若連線暫時中斷，行程會等待伺服器恢復而不是直接拋錯中斷播放，且允許使用者中斷請求。
        
    - **`rsize/wsize=1048576`**：設定傳輸緩衝區為 1MB，大幅提升傳輸高解析度音訊（FLAC / DSD）時的吞吐量。
        

#### 步驟 5：測試掛載

```bash
# 測試掛載 /etc/fstab 內的所有項目
sudo mount -a

# 檢查是否成功掛載並檢視內容
df -h | grep /mnt/nas/music
ls -la /mnt/nas/music
```

### CIFS vs. NFS 選型對比

|比較維度|CIFS / SMB|NFS (v4.1) (推薦)|
|---|---|---|
|**連線驗證**|使用使用者帳號 / 密碼驗證|使用客戶端主機 IP 白名單驗證|
|**傳輸效率**|協定較繁瑣，高頻讀取小檔案時 CPU 開銷稍高|協定精簡，傳輸延遲更低，吞吐量更佳|
|**權限映射**|需於掛載參數中強制宣告 `uid=1000,gid=1000`|支援 NAS 端直接設定 `all_squash` 統一歸併使用者|
|**跨平台相容**|Windows / macOS / Linux 均通用|專為 Unix / Linux 生態系打造|

> **儲存劃分鐵律（無論選 SMB 或 NFS）**： 音樂檔案庫 `/music` 放心掛載在 NAS 上，但 Navidrome 的資料庫目錄 `/data`（含 SQLite `navidrome.db`）**務必保留在本機 SSD**，切勿放在任何網路共享磁碟上，以確保搜尋、播放計數寫入流暢，並防止 SQLite 資料庫損毀。

## 2. Docker Compose 部署配置 (整合 Traefik v3)

在反向代理規劃中，有兩種常見模式：

1. **獨立子網域模式 (推薦)**：如 `music.example.com`，路徑單純，完全不需處理 URL 轉發問題。
    
2. **子路徑模式 (Subpath)**：如 `[example.com/music](https://example.com/music)`，需特別配置 `ND_BASEURL` 與 Traefik 的 `PathPrefix`。
    

### 步驟 1：建立本機專用目錄

```bash
sudo mkdir -p /opt/navidrome/data
sudo chown -R 1000:1000 /opt/navidrome/data
```

### 步驟 2：`docker-compose.yml` 配置 (以獨立子網域為例)

```yaml
services:
  navidrome:
    image: deluan/navidrome:latest
    container_name: navidrome
    restart: unless-stopped
    user: "1000:1000"
    environment:
      # 時區設定
      - TZ=Asia/Taipei
      # 背景掃描頻率（每 1 小時掃描一次目錄異動）
      - ND_SCANSCHEDULE=1h
      # 記錄等級 (debug, info, warn, error)
      - ND_LOGLEVEL=info
      # Session 存活時間
      - ND_SESSIONTIMEOUT=24h
      # 信任反向代理 IP 網段（支援 Docker 網段）
      - ND_REVERSEPROXYWHITELIST=172.16.0.0/12,10.0.0.0/8,192.168.0.0/16
      # 轉碼設定（依需求開啟，允許客戶端自行選用 MP3/Opus 降碼流）
      - ND_ENABLETRANSCODINGCONFIG=true
      # 若使用子路徑才需設定（例如 "/music"），子網域請留空或刪除此行
      - ND_BASEURL=
    volumes:
      - /opt/navidrome/data:/data
      - /mnt/nas/music:/music:ro
    networks:
      - proxy-network
    labels:
      - "traefik.enable=true"
      # 1. 路由規則
      - "traefik.http.routers.navidrome.rule=Host(`music.example.com`)"
      - "traefik.http.routers.navidrome.entrypoints=websecure"
      - "traefik.http.routers.navidrome.tls=true"
      - "traefik.http.routers.navidrome.tls.certresolver=myresolver"
      # 2. 明確宣告轉發至容器內部的 4533 埠口
      - "traefik.http.services.navidrome.loadbalancer.server.port=4533"

networks:
  proxy-network:
    external: true
```

## 3. Nginx / Nginx Proxy Manager 專用設定

若環境前方採用 Nginx 或 NPM：

```nginx
location /music {
    proxy_pass http://navidrome:4533;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $http_host;
    
    # 串流專用優化：關閉緩衝以避免高碼率 FLAC/DSD 播放時音訊卡頓
    proxy_buffering off;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    
    # 延長超時時間，防止長時間播放中斷
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```

## 4. 為什麼 Ultrasonic 容易出問題？Subsonic 認證機制解析

許多使用者在連線 Ultrasonic 等老舊客戶端時會遇到 `401 Unauthorized` 或重複要求輸入密碼：

- **核心成因（明文 Token vs. MD5 Salt 雜湊）**：
    
    - 早期的 Subsonic API 採用直接傳送密碼或過時的 SHA1 認證；而現代的 Subsonic / OpenSubsonic API 規範要求採用 `Token + Salt`（token=md5(password+salt)）模式。
        
    - **Ultrasonic** 專案維護頻率較低，在處理 OpenSubsonic 延伸規格及特定 URL 跳脫（Escaping）時存在相容性問題，導致傳送至 Navidrome 的授權標頭不符合預期。
        
- **排障方式**：
    
    - 在客戶端連線設定中，尋找並勾選 **「使用 Token 認證 (Use Token Authentication)」** 或強制選擇 **Subsonic API 1.16+**。
        
    - 建議直接選用社群近年維護更活躍的現代客戶端。
        

## 5. 全平台推薦客戶端選型 (Subsonic 生態系)

Navidrome 本身具備現代化的 WebUI，但若要支援離線快取、無縫播放（Gapless）、車用 Android Auto / CarPlay，推薦以下客戶端：

### 5.1 Android 客戶端

|客戶端名稱|授權模式|核心特色|適用場景|
|---|---|---|---|
|**Symfonium**|付費 (買斷)|介面極佳（Material You）、無縫播放、支援 Android Auto、全本地離線快取、進階等化器 (EQ)、**內建線上歌詞自動拉取**|**Android 體驗天花板**，推薦主力使用|
|**Tempo**|開源 / 免費|簡約流暢、直覺操作、支援離線同步與無縫播放|喜愛乾淨介面的首選|
|**DSub**|開源 / 免費|傳統經典、穩定度高、離線管理強大、介面偏早期 Android 風格|偏好復古穩定派的使用者|
|**Substreamer**|免費|介面現代、整合 Chromecast 投放、支援離線下載|免費方案中的平衡選擇|

### 5.2 iOS / iPadOS / macOS 客戶端

|客戶端名稱|授權模式|核心特色|適用場景|
|---|---|---|---|
|**Arpeggi**|免費 / 內購贊助|介面貼近 Apple Music 原生設計風格、流暢度佳|**iOS 最推薦首選**|
|**Amperfy**|開源 / 免費|支援 Apple Watch 獨立播放、CarPlay、背景下載|蘋果生態系重度使用者|
|**play:Sub**|付費|老牌長青工具、快取管理細緻、但 UI 較具年代感|追求功能完整的骨灰級玩家|

### 5.3 桌面端 (Windows / macOS / Linux)

- **Sonixd** / **Feishin**：基於 Electron 的現代跨平台播放器，UI 排版媲美 Spotify，支援即時歌詞、全域多媒體快捷鍵與本機音訊重採樣。
    
- **Supersonic**：以 Go 撰寫的極輕量桌面客戶端，啟動速度極快，記憶體消耗極低。
    

## 6. 音樂庫標籤 (Tagging)、Lidarr 自動化管理與歌詞下載整理

Navidrome 是一套**極度依賴 ID3 音訊標籤**的伺服器，底層不依賴資料夾結構分類，而是直接讀取音訊中繼資料。雖然 Lidarr 本身不自帶歌詞抓取模組，但可透過 **Lidarr 自動化鉤子 (Custom Script)** 或 **獨立 Sidecar 容器**，打造「下載 -> 自動改 Tag -> 自動抓同步動態歌詞 (.lrc) -> 即時觸發 Navidrome 掃描」的完整自動化閉環。

### 6.1 Lidarr 後端自動標準化設定 (取代手動改 Tag)

Lidarr 整合了 MusicBrainz 資料庫，在匯入音樂時可自動完成標準化 Tagging 與檔案重命名：

1. **開啟音訊檔案寫入 Tag (Media Management)**：
    
    - 前往 Lidarr **Settings** -> **Media Management**。
        
    - 勾選 **Write Audio Tags**：設為 `Sync` 或 `Scrub and Sync`。
        
    - **關鍵核取**：勾選 **Write Embedded Cover Art**（將高畫質封面嵌入檔案）與 **Save Artwork to Album Folder**（生成 `folder.jpg` / `cover.jpg`，Navidrome 會優先讀取該圖作為快取縮圖）。
        
2. **標準化重新命名結構 (Naming)**：
    
    - 開啟 **Rename Tracks**。
        
    - **Artist Folder Format**：`{Artist CleanName}`
        
    - **Album Folder Format**：`{Artist CleanName} - {Release Year} - {Album CleanTitle}`
        
    - **Track File Format**：`{Track:00} - {Track CleanTitle}`
        

### 6.2 動態歌詞自動抓取與整理方案 (兩大主流做法)

#### 做法 A：Lidarr 聯動 Custom Script (最優雅：匯入時全自動觸發)

社群開源工具（如 `synclyr2metadata`）能打包成單一靜態二進位檔，無縫嵌入 Lidarr 容器：

1. **取得工具**： 將編譯好的靜態執行檔放入 Lidarr 的掛載目錄，例如 `/opt/appdata/lidarr/scripts/synclyr2metadata`。
       
   ```bash
    chmod +x /opt/appdata/lidarr/scripts/synclyr2metadata
   ```
    
2. **在 Lidarr 設定自訂腳本**：
    
    - 前往 Lidarr **Settings** -> **Connect** -> 點選 **+** 新增 **Custom Script**。
        
    - **Name**：`Auto Sync Lyrics`
        
    - **Triggers**：勾選 `On Release Import` 與 `On Upgrade`。
        
    - **Path**：填入容器內部路徑 `/config/scripts/synclyr2metadata`。
        
3. **運作機制**： 每當 Lidarr 下載並整理完新專輯，腳本會自動以該音訊的 Artist/Title/Duration 向目前最大的開放歌詞庫 **LRCLIB** 請求同步歌詞，並直接寫入音訊檔案的內嵌 `LYRICS` / `SYLT` 標籤中（或輸出同名 `.lrc`）。
    

#### 做法 B：部署獨立歌詞抓取容器 (LRCGET-CLI / LyricFlow)

若不想在 Lidarr 內放腳本，可以在 Docker Compose 中掛載一個專用的歌詞抓取 Sidecar 服務（例如使用官方基於 LRCLIB 開發的 `lrcget-cli`）：

在 `docker-compose.yml` 中新增：

```yaml
  lrcget:
    image: diegoninja/lrcget-cli:latest
    container_name: lrcget-cli
    restart: unless-stopped
    environment:
      - TZ=Asia/Taipei
    volumes:
      - /mnt/nas/music:/music:rw  # 需有寫入權限以存放 .lrc 歌詞檔
    # 亦可設定定時 scan 排程
```

它會自動監控 `/music` 目錄下的新音訊，自動在同一目錄產出同名的 `Song.lrc` 動態滾動歌詞檔。

### 6.3 閉環自動化：Lidarr 下載完成自動通知 Navidrome 刷新

Navidrome 預設依照 `ND_SCANSCHEDULE` 定時掃描（如每 1 小時）。透過 Lidarr 的 Webhook 連動，可在新專輯下載並整理完畢的當下，**立即觸發 Navidrome 局部掃描**：

1. 前往 Lidarr **Settings** -> **Connect** -> 點擊 **+** 新增 **Webhook**。
    
2. **URL**：
    
    `http://navidrome:4533/rest/startScan?u=<admin_user>&t=<token>&s=<salt>&v=1.16.1&c=Lidarr`
    
3. **Triggers**：勾選 `On Download` 與 `On Upgrade`。 _(Token 與 Salt 產生方式遵循 Subsonic API 標準：token=md5(password+salt))_。
    

### 6.4 歷史遺留檔案補漏工具 (MusicBrainz Picard)

針對未納入 Lidarr 監控流程的老舊本機珍藏或少見自錄音訊，建議在丟進 NAS 前使用 **MusicBrainz Picard** 手動整理，洗出標準的 `Title`、`Artist`、`Album Artist`、`Track Number` 與 `Date` 欄位後再進行歸檔。

## 7. 維護與資料備份

將 `/music`（NAS 遠端庫）與 `/data`（本機 SSD）分離後，資料備份僅需備份本機的輕量目錄即可：

```bash
# 備份 Navidrome 資料庫與播放紀錄
sudo tar -czvf /opt/backups/navidrome-$(date +%F).tar.gz -C /opt/navidrome data

# 還原方式
sudo tar -xzvf /opt/backups/navidrome-*.tar.gz -C /opt/navidrome/
sudo chown -R 1000:1000 /opt/navidrome/data
docker compose restart navidrome
```