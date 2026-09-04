---
title: Portainer-CE 與 Portainer Agent 多節點集中管理
tags:
  - VM
  - Container
date: 2026-09-04
---
# Portainer-CE 與 Portainer Agent 多節點集中管理

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 架構概念與通訊埠角色

Portainer 採典型的 Server-Agent 架構：

```
[管理者瀏覽器]
       │ (存取 Port 9443 - HTTPS Web UI)
       ▼
┌──────────────────────────────────────┐
│  Portainer Server (中央管理節點)     │
│  - 儲存帳號、端點清單、組態於 /data  │
└──────┬───────────────────────┬───────┘
       │ (TCP 9001 TLS 探針)   │ (TCP 8000 反向隧道)
       ▼                       ▼
┌─────────────────────┐  ┌──────────────────────────────────┐
│ VPS-A (直連模式)    │  │ VPS-B (邊緣運算 / NAT 內網節點)  │
│ Portainer Agent     │  │ Portainer Edge Agent             │
│ (監聽 TCP 9001)     │  │ (主動向 Server 建立連線)         │
└─────────────────────┘  └──────────────────────────────────┘
```

### 通訊埠 (Ports) 定位速查

- **9443 (TCP)**：現代 Portainer-CE 預設的 **HTTPS 管理介面**（舊版 9000 為未加密 HTTP，現代版本強烈建議全面轉向 9443）。
    
- **9001 (TCP)**：**Portainer Agent 通訊埠**。Agent 在受控端節點監聽此埠，等待 Server 發起連線（具備雙向 mTLS 加密）。
    
- **8000 (TCP)**：**Edge Agent 反向通道監聽埠**（Edge Tunnel Server）。若受控端處於 NAT 內網或防火牆嚴格封鎖外部連線時，由 Edge Agent 主動向 Server 的 8000 建立隧道。
    

## 2. 中央端部署：Portainer-CE Server

建議以 `docker-compose.yml` 管理，方便設定資料卷、自動重啟與反向代理整合。

### 步驟 1：建立專用目錄與持久化磁碟卷

```bash
mkdir -p /opt/portainer/data
cd /opt/portainer
```

### 步驟 2：`docker-compose.yml` 配置

```yaml
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: unless-stopped
    ports:
      - "9443:9443"  # 官方標準 HTTPS 介面
      - "8000:8000"  # Edge Agent 邊緣通道（若有需要接入內網節點再開）
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /opt/portainer/data:/data
    networks:
      - portainer-net

networks:
  portainer-net:
    driver: bridge
```

啟動服務：

```bash
docker compose up -d
```

> **安全倒數機制提醒**： 首次啟動 Portainer-CE 後，必須在 **5 分鐘內** 使用瀏覽器進入 `https://<Server_IP>:9443` 完成初始管理員帳號密碼設定。逾時系統會強制關閉以防被未授權搶佔，此時需重啟容器（`docker compose restart`）重新計時。

## 3. 受控節點部署：Portainer Agent

在需要被納入管理的各台 VPS / 節點上，部署 `portainer/agent`。

### 3.1 `docker-compose.yml` 部署（被控端 VPS）

建立 `/opt/portainer-agent/docker-compose.yml`：

```yaml
services:
  agent:
    image: portainer/agent:latest
    container_name: portainer_agent
    restart: always
    ports:
      - "9001:9001"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    # 關閉不必要的特權模式，僅依賴 socket 與 volumes 即可
```

啟動 Agent：

```bash
docker compose up -d
```

### 3.2 重要掛載點說明

- `/var/run/docker.sock:/var/run/docker.sock`：讓 Agent 能調用宿主機 Docker API，即時回傳容器運作狀態與轉發管理指令。
    
- `/var/lib/docker/volumes:/var/lib/docker/volumes`：讓管理端在 Web UI 上點選「Volumes」時，能直接瀏覽、下載或上傳資料卷內的檔案。
    

## 4. 在 Portainer Server 介面新增遠端節點 (Environments)

1. 登入 Portainer Server Web 介面。
    
2. 點擊左側導航列的 **Environments** -> **Add environment**。
    
3. 選擇 **Docker Standalone** -> 點擊 **Start Wizard**。
    
4. 選擇 **Portainer Agent**：
    
    - **Name**：輸入識別名稱（例如 `VPS-Tokyo-01`）。
        
    - **Environment address**：輸入遠端受控節點的 IP 與埠號，格式為 `<VPS_IP>:9001`。
        
5. 點擊 **Connect**。
    
6. 連線成功後，首頁清單即會出現該遠端 VPS，點入即可如同操作本地主機般管理該台機器的 Containers、Images、Networks 與 Volumes。
    

## 5. 公網環境安全加固防護 (Security Hardening)

將 Portainer 與 Agent 暴露在公網 VPS 時，若未妥善防護，等同將伺服器的 Root 權限拱手讓人。

### 5.1 嚴格限制 Agent (Port 9001) 的來源 IP

`portainer/agent` 本身雖有連線配對驗證，但強烈建議在受控端 VPS 的防火牆（`ufw` 或雲端安全群組）限制 **僅允許 Portainer Server 的公網 IP 存取 9001 埠口**：

```bash
# 在被控端 VPS 執行（以 UFW 為例）：
sudo ufw default deny incoming
sudo ufw allow ssh
# 僅允許中央 Server IP 存取 9001
sudo ufw allow from <PORTAINER_SERVER_IP> to any port 9001 proto tcp
sudo ufw reload
```

### 5.2 無固定公網 IP 時的替代解法：Edge Agent (主動出站模式)

若受控端處於動態 IP、NAT 內網，或者不願對外開放 9001 埠口，應改用 **Edge Agent**：

1. 在 Server 端新增 Environment 時選擇 **Edge Agent**。
    
2. 系統會自動生成一串帶有金鑰（Edge ID / Key）的 `docker run` 指令。
    
3. 在受控端貼上執行，由被控端主動往 Server 的 `Port 8000` 建立安全反向連線，被控端**完全不需開啟任何對外入站埠口**。
    

### 5.3 反向代理整合 (Traefik v3 / NPM)

若將 Server 端交由反向代理託管以取得正規 SSL 憑證，需注意：

- **WebSocket 支持**：Portainer 的網頁終端機（Exec Console）依賴 WebSocket，反代軟體需保持連線升級（NPM 請務必勾選 `Websockets Support`）。
    
- **代理目標 Port**：若 NPM/Traefik 與 Portainer 位於同一 Docker 網路，建議直接反代 `http://portainer:9000`（若映像檔仍支援內部 HTTP）或設定忽略 self-signed 憑證反代 `https://portainer:9443`。