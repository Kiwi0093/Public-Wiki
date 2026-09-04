---
title: Uptime Kuma 服務監控、跨節點守護、即時告警與狀態頁美化
tags:
  - VM
  - Container
date: 2026-09-04
---
# Uptime Kuma 服務監控、跨節點守護、即時告警與狀態頁美化

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 架構設計與多主機安全拓撲

在單一主機上，可以直接掛載 `/var/run/docker.sock`；若容器分散在多台實體機或 VPS，直接把未加密的 Docker Socket 暴露到外網等同開放 Root 提權。

因此，多主機監控架構的標準安全解法是引入 **`docker-socket-proxy`**：

```
[Uptime Kuma 中心伺服器]
       │
       ├─► 監控本機容器: 掛載本地 /var/run/docker.sock:ro
       │
       ├─► 監控遠端主機 A: 透過 TCP 2375 查詢 (受 docker-socket-proxy 唯讀保護)
       │         ▲
       │         └─ [遠端節點 A] ── docker-socket-proxy ── /var/run/docker.sock
       │
       ├─► 異常觸發時 ───► Telegram Bot API ───► 即時推播至手機 / 群組
       │
       └─► 外部訪客 ───► 專屬狀態頁 (Status Page) ───► 毛玻璃深色主題展示
```

- **`docker-socket-proxy` 的防護機制**：底層透過 HAProxy 攔截 Docker API 請求。透過設定 `POST=0` 關閉所有寫入、建立與刪除權限，僅開放 `CONTAINERS=1` 等唯讀端點，杜絕攻擊者藉由暴露的 Docker 埠提權控制宿主機。
    

## 2. Docker Compose 部署配置

### 2.1 遠端受控節點：部署 `docker-socket-proxy`（多主機適用）

在遠端 VPS 或受控節點上建立 `/opt/dockerproxy/docker-compose.yml`：

```yaml
services:
  dockerproxy:
    image: ghcr.io/tecnativa/docker-socket-proxy:latest
    container_name: dockerproxy
    restart: unless-stopped
    environment:
      # 僅開放監控所需的唯讀權限
      - CONTAINERS=1
      - SERVICES=1
      - TASKS=1
      - POST=0
      - BUILD=0
      - COMMIT=0
      - CONFIGS=0
      - DISTRIBUTION=0
      - EXEC=0
      - IMAGES=0
      - INFO=0
      - NETWORKS=0
      - NODES=0
      - PLUGINS=0
      - SECRETS=0
      - SESSION=0
      - SWARM=0
      - SYSTEM=0
      - VOLUMES=0
    ports:
      # 建議僅在內網或 WireGuard VPN 網段開放；若走公網務必以防火牆限制來源 IP
      - "2375:2375"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
```

### 2.2 中心伺服器：部署 Uptime Kuma 本體

建立 `/opt/uptime-kuma/docker-compose.yml`：

```yaml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: uptime-kuma
    restart: unless-stopped
    ports:
      # 直連預設 Port，若前方有 NPM / Traefik 可取消對外映射
      - "3001:3001"
    volumes:
      - /opt/uptime-kuma/data:/app/data
      # 掛載本機 socket 監控本地容器
      - /var/run/docker.sock:/var/run/docker.sock:ro
    networks:
      - monitor-net
      # 若需走反向代理，加入 proxy 網路
      - proxy-network

networks:
  monitor-net:
    driver: bridge
  proxy-network:
    external: true
```

啟動服務：

```bash
docker compose up -d
```

## 3. Telegram 告警機器人完整串接步驟

### 步驟 A：向 BotFather 申請 Bot Token

1. 在 Telegram 搜尋官方機器人 `@BotFather`。
    
2. 發送指令 `/newbot`。
    
3. 依序輸入機器人顯示名稱（Name）與使用者名稱（Username，結尾必須為 `bot`，例如 `HomeLab_alert_bot`）。
    
4. 儲存回傳的 **HTTP API Token**（格式如：`123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`）。
    

### 步驟 B：取得個人或群組 `chat_id`

1. 在 Telegram 搜尋剛剛建立的機器人，點擊 **Start** 或傳送任意訊息給它。
    
2. 取得 Chat ID：
    
    - **方法 1**：在瀏覽器訪問 `[https://api.telegram.org/bot](https://api.telegram.org/bot)<YOUR_BOT_TOKEN>/getUpdates`，在返回的 JSON 內找到 `"chat":{"id": 123456789, ...}`。
        
    - **方法 2**：在 Telegram 搜尋 `@userinfobot` 並點擊 Start，它會直接返回你的個人數字 `Id`。
        

### 步驟 C：於 Uptime Kuma 綁定通知管道

1. 開啟 Uptime Kuma 後台 (`http://<IP>:3001`) -> 點擊右上角頭像 -> **設定 (Settings)** -> **通知 (Notification)** -> **設定通知 (Setup Notification)**。
    
2. 類型選擇 **Telegram**：
    
    - **Bot Token**：貼上剛取得的 API Token。
        
    - **Chat ID**：填入數字 ID。
        
3. 點選 **測試 (Test)**，確認 Telegram 收到測試訊息後存檔。
    

## 4. 監控項目建立 (Docker 容器監控)

點擊左上角「**新增監控項目**」：

- **監控本地容器**：
    
    - **監控類型**：選擇 `Docker 容器 (Docker Container)`。
        
    - **Docker 節點 (Docker Host)**：選擇預設的 `/var/run/docker.sock`。
        
    - **容器名稱/ID**：輸入目標容器名稱（如 `nextcloud`、`gitea`）。
        
- **監控遠端節點容器 (經由 Socket Proxy)**：
    
    1. 至 **設定** -> **Docker 主機** -> **新增 Docker 主機**。
        
    2. 連線方式選 `TCP Socket`，位址填入 `tcp://<REMOTE_VPS_IP>:2375`。
        
    3. 新增監控項目時，下拉選單切換至該遠端主機，即可填寫該主機上的容器名稱進行跨機監控。
        

## 5. 進階維運玩法

### 5.1 「死人開關 (Dead Man's Switch)」：Push 被動心跳監控

一般監控是主動 Ping 目標，但若要確認**備份腳本、NAS 任務或 Cron Job 有沒有準時跑完**，應使用 **Push 模式**：

1. 監控類型選擇 **「Push」**，設定心跳間隔（例如 86400 秒 = 1 天）。
    
2. Kuma 會生成一組專屬 Webhook URL： `[https://kuma.example.com/api/push/keyXYZ?status=up&msg=OK&ping=](https://kuma.example.com/api/push/keyXYZ?status=up&msg=OK&ping=)`
    
3. 在備份腳本末端加入打卡指令：
    
    
   ```bash
    curl -fsS -m 10 --retry 3 "https://kuma.example.com/api/push/keyXYZ?status=up&msg=BackupSuccess"
   ```
    

- 若腳本異常崩潰或卡死，Kuma 在時間內未收到回報便會立刻觸發警報。
    

### 5.2 搭配 Webhook 實現「服務崩潰自動重啟 (Self-Healing)」

當容器異常中斷時，除傳送訊息外，可驅動外部服務自動救回：

1. 在通知設定中新增 **Webhook**。
    
2. 串接 Node-RED 或輕量級 Webhook 伺服器（如 `adnanh/webhook`）。
    
3. 當收到事件 `DOWN` 時，由背景服務自動執行 `docker restart <container_name>`，達成故障自癒。
    

### 5.3 內建 SSL 憑證即期自動告警

監控類型選擇 **HTTP(s)** 並填入域名，Kuma 會自動提取 TLS 憑證鏈，預設在憑證到期前 **21、14、7 天** 主動推播，避免 Let's Encrypt 自動續期失效引發中斷。

## 6. 公開狀態頁 (Status Page) 與 Custom CSS 毛玻璃美化

Uptime Kuma 支援建立獨立的展示頁面供訪客確認各項服務可用度。

### 6.1 建立狀態頁面

1. 點選頂部選單的 **狀態頁面 (Status Pages)** -> **新增狀態頁面**。
    
2. 設定頁面名稱、Slug（如 `/status`）與分組項目。
    
3. 點選右上角 **編輯 (Edit)**，展開底部的 **自訂 CSS (Custom CSS)** 區塊。
    

### 6.2 完整毛玻璃暗黑主題 CSS

將以下代碼完整貼入 Custom CSS 欄位並儲存：

```css
/* ============================================================
   Uptime Kuma Status Page - Modern Glassmorphism Theme
   ============================================================ */

/* 1. 全域深色漸層背景 */
body {
    background-color: #0d1117 !important;
    background-image: 
        radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.12) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(15, 23, 42, 0.8) 0px, transparent 100%) !important;
    background-attachment: fixed !important;
    color: #e2e8f0 !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
}

/* 2. 頁首與整體狀態大看板毛玻璃化 */
header, .overall-status {
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
}

.overall-status {
    background: rgba(30, 41, 59, 0.45) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
    padding: 24px !important;
}

/* 3. 監控群組容器與服務卡片 (Card) */
.item-list, .shadow-box {
    background: rgba(30, 41, 59, 0.4) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 14px !important;
    box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.25) !important;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* 4. 單一服務條目懸停反饋 */
.item {
    border-radius: 10px !important;
    padding: 10px 14px !important;
    transition: all 0.2s ease-in-out !important;
}

.item:hover {
    background: rgba(255, 255, 255, 0.04) !important;
    transform: translateY(-2px);
}

/* 5. 狀態心跳長條條 (Heartbeat Bar) 與發光霓虹樣式 */
.beat {
    border-radius: 4px !important;
    margin: 0 1.5px !important;
    transition: transform 0.15s ease !important;
}

.beat:hover {
    transform: scaleY(1.3);
}

/* 在線 (UP) 綠色發光 */
.bg-primary, .badge.bg-primary {
    background-color: #10b981 !important;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.35) !important;
}

/* 離線 (DOWN) 紅色呼吸警示發光 */
.bg-danger, .badge.bg-danger {
    background-color: #ef4444 !important;
    box-shadow: 0 0 14px rgba(239, 68, 68, 0.5) !important;
}

/* 維護中 (Maintenance) 藍色 */
.bg-info, .badge.bg-info {
    background-color: #0ea5e9 !important;
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.35) !important;
}

/* 6. 群組標題 (Group Title) */
.group-title {
    color: #94a3b8 !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    font-size: 0.85rem !important;
    margin-bottom: 12px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding-bottom: 6px;
}

/* 7. 事件時間軸與維護公告 (Incidents) */
.incident {
    background: rgba(30, 41, 59, 0.55) !important;
    border-left: 4px solid #38bdf8 !important;
    border-radius: 8px !important;
    backdrop-filter: blur(8px) !important;
}

/* 8. 頁尾樣式微調 */
footer {
    opacity: 0.65;
    font-size: 0.85rem;
    transition: opacity 0.2s;
}

footer:hover {
    opacity: 1;
}
```

## 7. 備份與還原

Uptime Kuma 所有監控項目、自訂告警規則與歷史統計數據均存放在 `/app/data/kuma.db`（SQLite）：

```bash
# 1. 備份資料目錄
sudo tar -czvf /opt/backups/uptime-kuma-$(date +%F).tar.gz -C /opt/uptime-kuma data

# 2. 恢復備份至新環境
sudo tar -xzvf /opt/backups/uptime-kuma-*.tar.gz -C /opt/uptime-kuma/
docker compose restart uptime-kuma
```
