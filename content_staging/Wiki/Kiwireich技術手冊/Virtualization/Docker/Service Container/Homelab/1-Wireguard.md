---
title: "# WireGuard VPN 服務端 (Docker) 與全平台客戶端設定"
tags:
  - VPN
  - VM
  - Container
date: 2026-09-04
---
# WireGuard VPN 服務端 (Docker) 與全平台客戶端設定手冊 (Wiki)

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

<img src='https://img.shields.io/badge/Kiwi-%E6%88%91%E5%85%B6%E5%AF%A6%E7%8F%BE%E5%9C%A8%E5%B9%BE%E4%B9%8E%E9%83%BD%E6%98%AF%E7%94%A8%E8%A3%B8%E6%A9%9F%E7%9A%84wiregaurd%E8%87%AA%E5%B7%B1%E4%B8%8A%2C%E4%B8%8D%E9%81%8Edocker%E7%89%88%E7%9A%84%E8%87%AA%E5%8B%95%E7%94%A2%E7%94%9F%E8%A8%AD%E5%AE%9A%E6%AA%94%E6%98%AF%E8%A0%BB%E6%A3%92%E7%9A%84-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

## 1. 核心機制與網路架構

WireGuard 採用 **點對點（Peer-to-Peer, P2P）** 的概念，架構中每台機器本質上都是「Peer」，只是通常將具備固定公網 IP 的主機視為「Server / Relay Node」：

```
[客戶端 (Phone / Laptop)] (WireGuard IP: 10.13.13.2)
        │
        │ UDP (加密封包，預設埠 51820)
        ▼
[WireGuard Server 容器] (WireGuard IP: 10.13.13.1 / 宿主機 Public IP:Port)
        │
        ├─► [區網內部設備 (LAN 存取)] (192.168.1.0/24)
        └─► [網際網路 (Full Tunnel 轉發出站)] (0.0.0.0/0)
```

- **UDP 協定**：WireGuard 完全運行於 UDP 之上，若沒有數據傳輸時不會發送任何探針封包，表現如同「靜默無響應」，防掃描能力極佳。
    
- **Cryptokey Routing（加密金鑰路由）**：伺服端透過每台 Client 的 **Public Key** 與其分配到的內部 IP 進行強綁定。只有簽名正確且來源 IP 符合宣告的封包才會被接受。
    

## 2. Docker Compose 伺服端部署 (LinuxServer.io)

LinuxServer.io 的映像檔最大特色在於：啟動時能根據環境變數宣告的 `PEERS` 名稱，**自動生成對應的客戶端設定檔 (`peer_*.conf`) 與終端 QR Code**，省去手動生成金鑰與設定路由的繁瑣流程。

### 步驟 1：建立專用目錄

```bash
sudo mkdir -p /opt/wireguard/config
```

### 步驟 2：`docker-compose.yml` 完整配置

在 `/opt/wireguard/docker-compose.yml` 中定義：

```yaml
services:
  wireguard:
    image: ghcr.io/linuxserver/wireguard:latest
    container_name: wireguard
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Taipei
      # 1. 外部存取位址（公網固定 IP 或 DDNS 網域名稱）
      - SERVERURL=vpn.example.com
      # 2. 外部監聽 UDP 連接埠
      - SERVERPORT=51820
      # 3. 客戶端命名清單（以逗號分隔，會自動產生對應的配置檔）
      - PEERS=phone,laptop,ipad
      # 4. 指派給 Client 的 DNS 伺服器（可填 1.1.1.1、8.8.8.8 或內網 AdGuard Home IP）
      - PEERDNS=1.1.1.1
      # 5. WireGuard 內部虛擬網段（Server 會自動取得該網段的 .1）
      - INTERNAL_SUBNET=10.13.13.0/24
      # 6. 預設下發給客戶端的 AllowedIPs 範圍（0.0.0.0/0 表示全流量翻牆/回傳）
      - ALLOWEDIPS=0.0.0.0/0
    volumes:
      - /opt/wireguard/config:/config
      - /lib/modules:/lib/modules:ro
    ports:
      - "51820:51820/udp"
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
```

> **核心參數與權限關鍵**：
> 
> - `cap_add: [NET_ADMIN, SYS_MODULE]`：容器需要操作宿主機的虛擬網路介面（TUN/TAP）及加載 WireGuard 核心模組。
>     
> - `/lib/modules:/lib/modules:ro`：讓容器內部能載入宿主機的 WireGuard 核心驅動以達成極致效能（Linux 5.6+ 核心已原生內建）。
>     
> - `net.ipv4.conf.all.src_valid_mark=1`：防止多路由表環境下封包被 rp_filter 丟棄。
>     

啟動服務：

```bash
docker compose up -d
```

## 3. 客戶端獲取設定與連線方式

### 3.1 行動裝置 (Android / iOS)

1. 從 Google Play 或 App Store 安裝官方 **WireGuard** App。
    
2. 檢視容器產生的 QR Code：
    
    
   ```bash
    # 查看特定 Peer 的 QR Code
    docker compose logs -f wireguard
    # 或使用容器內工具指定顯示特定 peer (例如 phone)
    docker compose exec wireguard /app/show-peer phone
   ```
    
3. 打開手機 WireGuard App，點擊 `+` 號 -> 選擇「掃描行動條碼 (Scan from QR code)」即可一秒匯入並啟用。
    

### 3.2 桌面版與 Linux 客戶端設定檔提取

所有生成的設定檔皆已保存在宿主機的掛載目錄中：

```bash
# 檢視已生成的設定檔案
ls -l /opt/wireguard/config/peer_laptop/
# 內容包含：
# - peer_laptop.conf (標準設定檔)
# - peer_laptop.png  (QR code 圖片檔)
# - privatekey-peer_laptop / publickey-peer_laptop
```

## 4. Linux 客戶端設定實務 (以 Arch / Manjaro / Debian / Ubuntu 為例)

在 Linux 桌面或伺服器上，主要有兩種連線方式：傳統的 `wg-quick` CLI 工具，以及整合桌面網路管理的 `NetworkManager`。

### 方式 A：使用 `wg-quick` CLI（推薦伺服器或輕量環境）

1. 安裝工具套件：
    
    
   ```bash
    # Arch / Manjaro
    sudo pacman -S wireguard-tools
    
    # Ubuntu / Debian
    sudo apt-get install -y wireguard-tools
   ```
    
2. 部署設定檔：
    
    將伺服器生成的 `peer_laptop.conf` 複製到客戶端的 `/etc/wireguard/`，並改名為你偏好的介面名稱（如 `wg0.conf`）：
    
    
   ```bash
    sudo mkdir -p /etc/wireguard
    sudo cp peer_laptop.conf /etc/wireguard/wg0.conf
    # 嚴格限制金鑰權限（否則 wg-quick 會警告）
    sudo chmod 600 /etc/wireguard/wg0.conf
   ```
    
3. 啟動與停止連線：
    
    
   ```bash
    # 啟動連線（介面名稱即為檔名 wg0）
    sudo wg-quick up wg0
    
    # 檢視連線狀態與傳輸量 (Transfer RX/TX)
    sudo wg show
    
    # 斷開連線
    sudo wg-quick down wg0
   ```
    
4. （選用）設定開機自動連線：
    
    
   ```bash
    sudo systemctl enable wg-quick@wg0
   ```
    

### 方式 B：匯入至 NetworkManager / GUI（推薦桌面環境）

如果你使用 GNOME / KDE 等桌面系統，透過 `nmcli` 一鍵匯入後即可使用系統右上角的網路圖示進行開關：

```bash
# 一鍵匯入設定檔建立連線設定檔
sudo nmcli connection import type wireguard file /etc/wireguard/wg0.conf

# 啟用連線
nmcli connection up wg0

# 中斷連線
nmcli connection down wg0
```

_(匯入後可在系統「網路設定 (Network Settings)」圖形化介面中自由切換開關與修改)_。

## 5. 核心避坑：`AllowedIPs` 路由規劃（全域翻牆 vs. 內網分流）

客戶端設定檔中的 `AllowedIPs` 是最常導致「一開 VPN 原本網路就斷線」或「伺服器其他服務連不上」的主因。它具備**雙重功能**：

1. **本機路由注入**：決定本機哪些目標 IP 流量要塞進 WireGuard 隧道。
    
2. **入站封包過濾**：決定 WireGuard 介面只允許接收哪些來源 IP 的封包。
    

### 情境 1：全域通道 (Full Tunnel / 全翻牆回傳)

希望出外連上公共 Wi-Fi 時，**所有網路流量**均經由家裡/VPS 的 WireGuard 伺服器代理出站：

```toml
[Peer]
# 包含所有 IPv4 與 IPv6 網段
AllowedIPs = 0.0.0.0/0, ::/0
```

> **注意**：
> 
> 當設為 `0.0.0.0/0` 時，WireGuard 會接管預設路由（Default Gateway）。如果客戶端所在的區網有其他服務或本機伺服器，可能需要確保有排除本機局域網路由。

### 情境 2：分流通道 (Split Tunnel / 僅存取內網設備)

只想安全存取遠端家中/機房的內部設備（例如連回 NAS、HomeLab 或查看內部網頁），其餘一般上網（YouTube、Google）依然走自己原本的寬頻：

```toml
[Peer]
# 僅將遠端內網網段 (如 192.168.1.0/24) 與 WireGuard 自身網段 (10.13.13.0/24) 走 VPN
AllowedIPs = 10.13.13.0/24, 192.168.1.0/24
```

## 6. NAT 穿透保活：`PersistentKeepalive`

WireGuard 預設是無狀態的。若你的 Client 位於 NAT（家用路由器、行動基地台 4G/5G）後方，路由器的 NAT 對應表通常會在數十秒至數分鐘後將逾期的 UDP 連線狀態清除。這會導致「**Client 可以發送請求給 Server，但 Server 主動發送數據時卻送不到 Client**」（例如在 Client 上收推播訊息延遲）。

### 解決方案：

在客戶端設定檔的 `[Peer]` 區塊加入：

```toml
[Peer]
# 每 25 秒主動向伺服器發送一次輕量 Keepalive 封包，維持 NAT 打洞狀態
PersistentKeepalive = 25
```

_(LinuxServer.io 預設生成的 peer.conf 通常已內建此行設定)_。

## 7. 伺服端核心轉發與常見故障排除 (Troubleshooting)

|**異常現象**|**根本原因**|**排除步驟**|
|---|---|---|
|**連線後 Client 端完全沒有網際網路**|宿主機 Linux 核心未開啟 IPv4 Forwarding|在**宿主機**執行：<br><br>  <br><br>`echo "net.ipv4.ip_forward = 1" \| sudo tee /etc/sysctl.d/99-wireguard.conf`<br><br>  <br><br>`sudo sysctl -p /etc/sysctl.d/99-wireguard.conf`|
|**能連線但傳輸量只有 TX 增加、RX 為 0**|1. 外部防火牆未放行 UDP 51820。<br><br>  <br><br>2. `SERVERURL` 或 `SERVERPORT` 填寫錯誤。<br><br>  <br><br>3. 雲端平台（如 OCI、AWS、GCP）安全群組漏開 UDP。|1. 確認雲端控制台放行 **`0.0.0.0/0 -> UDP 51820`**。<br><br>  <br><br>2. 在宿主機檢查監聽：`sudo ss -ulpn \| grep 51820`。|
|**Client 手機連線正常，但換 IP 後偶爾卡死**|MTU 過大造成封包分段被電信商丟棄|手機端通常預設 1420 即可。若在行動網路下不穩定，可嘗試將客戶端 `[Interface]` 的 `MTU = 1280` 手動寫入。|
|**想動態新增更多 Peer**|Compose 檔案變更環境變數|1. 編輯 `docker-compose.yml`，在 `PEERS=` 後方加入新名字（如 `PEERS=phone,laptop,ipad,newpc`）。<br><br>  <br><br>2. 執行 `docker compose up -d`，容器會自動補建新 Peer 的設定檔，原有 Peer 不受影響。|
