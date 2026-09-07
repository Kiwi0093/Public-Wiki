---
title: V2Ray客戶端推薦與設定
date: 2026-09-07
tags:
  - Linux
  - Android
  - Microsoft
  - iOS
---
# V2Ray客戶端推薦與設定

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Linux](https://img.shields.io/badge/Linux-Supported-green?style=plastic&logo=linux) 
![Windows](https://img.shields.io/badge/Windows-Supported-green?style=plastic&logo=windows)
![Android](https://img.shields.io/badge/Android-Supported-green?style=plastic&logo=android) 
![iOS](https://img.shields.io/badge/iOS-Supported-green?style=plastic&logo=ios)

<img src='https://img.shields.io/badge/Kiwi-%E8%87%AA%E5%BE%9E%E5%9B%9E%E5%8F%B0%E5%B7%A5%E4%BD%9C%E9%80%99%E4%B8%80%E5%A1%8A%E5%B0%B1%E5%BE%88%E5%B0%91%E9%97%9C%E6%B3%A8%E4%BA%86%2C%E4%B8%BB%E8%A6%81%E9%82%84%E6%98%AF%E7%82%BA%E4%BA%86%E9%82%84%E7%95%99%E5%9C%A8%E4%B8%AD%E5%9C%8B%E7%9A%84%E5%8F%8B%E4%BA%BA%E8%80%8C%E6%8C%81%E7%BA%8C%E6%9C%8D%E5%8B%99%E7%9A%84...-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

## 快速連接資訊對照（以先前的架構為基準）

- **Reality 直連節點**：
    
    - 域名：`reality.yourdomain.com`，埠號：`443`
        
    - 傳輸：`TCP`，安全：`Reality`，流控：`xtls-rprx-vision`
        
    - SNI：`reality.yourdomain.com`，Fingerprint：`chrome`
        
    - 必填參數：`UUID`、`Public Key`、`Short ID`
        
- **WS+TLS+CDN 救援節點**：
    
    - 域名：`cdn.yourdomain.com`（或 Cloudflare 優選 IP），埠號：`443`
        
    - 傳輸：`WebSocket (WS)`，路徑：`/ray-ws-stream`
        
    - 安全：`TLS`，SNI / Host：`cdn.yourdomain.com`
        
    - 必填參數：`UUID`
        

## 1. Android 客戶端推薦與設定

### 推薦客戶端

- **首選：v2rayNG**（介面直覺、Xray 核心支援最完整、支援 Reality/Vision 完整特性）
    
- **進階替代：sing-box (Android 官方版)**（規則分流強大、耗電量極低）
    

### v2rayNG 設定步驟

#### 匯入最快方式（剪貼簿匯入）

1. 在 3X-UI 面板複製節點的 `vless://` 連結。
    
2. 開啟 v2rayNG，點擊右上角 **`+`** 號 -> 選擇 **「從剪貼簿匯入」**。
    
3. 點選右下角 V 圖示連線，點擊下方狀態列測試延遲。
    

#### 手動設定 VLESS-Reality

1. 點擊右上角 **`+`** -> **「手動輸入 [VLESS]」**。
    
2. 依序填寫：
    
    - **備註**：`Reality-Direct`
        
    - **位址 (Address)**：`reality.yourdomain.com`
        
    - **連接埠 (Port)**：`443`
        
    - **使用者 ID (id)**：填入你的 `UUID`
        
    - **流控 (flow)**：選擇 `xtls-rprx-vision`
        
    - **傳輸協定 (network)**：`tcp`
        
    - **傳輸安全 (streamSecurity)**：選擇 `reality`
        
    - **SNI**：`reality.yourdomain.com`
        
    - **Fingerprint (uTLS)**：`chrome`
        
    - **PublicKey**：填入 3X-UI 生成的 `Public Key`
        
    - **ShortId**：填入對應的 `Short ID`
        
3. 點擊右上角勾勾存檔。
    

#### 手動設定 VLESS-WS+TLS+CDN

1. 點擊右上角 **`+`** -> **「手動輸入 [VLESS]」**。
    
2. 依序填寫：
    
    - **備註**：`WS-CDN-Rescue`
        
    - **位址 (Address)**：`cdn.yourdomain.com`（或 Cloudflare 優選 IP）
        
    - **連接埠 (Port)**：`443`
        
    - **使用者 ID (id)**：填入你的 `UUID`
        
    - **流控 (flow)**：留空
        
    - **傳輸協定 (network)**：選擇 `ws`
        
    - **WebSocket -> path**：`/ray-ws-stream`
        
    - **WebSocket -> host**：`cdn.yourdomain.com`
        
    - **傳輸安全 (streamSecurity)**：選擇 `tls`
        
    - **SNI**：`cdn.yourdomain.com`
        
3. 點擊右上角勾勾存檔。
    

## 2. iPhone (iOS) 客戶端推薦與設定

### 推薦客戶端

- **首選：Shadowrocket (小火箭)**（性價比最高、買斷制、相容性好、支援 Reality 與 uTLS）
    
- **替代/進階：Loon** 或 **Sing-box** 或 **Stash (Clash for iOS)**
    

### Shadowrocket 設定步驟

#### 匯入最快方式（掃碼/連結）

1. 在 3X-UI 面板點擊節點的 QR Code 圖示。
    
2. 開啟 Shadowrocket，點擊左上角**掃描按鈕**對準螢幕，或複製 `vless://` 後打開 App 自動提示新增。
    

#### 手動設定 VLESS-Reality

1. 點擊右上角 **`+`**。
    
2. **類型**：選擇 `VLESS`。
    
3. 依序填寫：
    
    - **伺服器**：`reality.yourdomain.com`
        
    - **連接埠**：`443`
        
    - **密碼 (UUID)**：填入 `UUID`
        
    - **混淆 (Security)**：選擇 `Reality`
        
    - **PublicKey**：填入 `Public Key`
        
    - **Short ID**：填入 `Short ID`
        
    - **Peer (SNI)**：`reality.yourdomain.com`
        
    - **演算法 (Flow)**：選擇 `xtls-rprx-vision`
        
    - **Fingerprint**：選擇 `chrome`
        
4. 點擊右上角 **儲存**。
    

#### 手動設定 VLESS-WS+TLS+CDN

1. 點擊右上角 **`+`**。
    
2. **類型**：選擇 `VLESS`。
    
3. 依序填寫：
    
    - **伺服器**：`cdn.yourdomain.com`
        
    - **連接埠**：`443`
        
    - **密碼 (UUID)**：填入 `UUID`
        
    - **傳輸方式 (Transport)**：選擇 `websocket`
        
    - **Path**：`/ray-ws-stream`
        
    - **Host**：`cdn.yourdomain.com`
        
    - **TLS**：開啟勾選
        
    - **SNI**：`cdn.yourdomain.com`
        
4. 點擊右上角 **儲存**。
    

## 3. Windows 客戶端推薦與設定

### 推薦客戶端

- **首選（GUI 直覺）：v2rayN**（支援 Xray 核心，開箱即用支援 Reality）
    
- **首選（規則分流）：Clash Verge Rev**（基於 Mihomo / Clash Meta 核心，介面極美，支援訂閱與自訂規則）
    

### 方案 A：v2rayN (Xray 核心)

#### 快速匯入

複製 `vless://` 節點文字，在 v2rayN 主視窗按快捷鍵 `Ctrl + V` 自動新增。

#### 手動新增 VLESS-Reality

1. 點擊上方 **伺服器 (Servers)** -> **新增 VLESS 伺服器**。
    
2. 參數對齊：
    
    - **伺服器位址 (Address)**：`reality.yourdomain.com`
        
    - **連接埠 (Port)**：`443`
        
    - **使用者 ID (id)**：你的 `UUID`
        
    - **流控 (flow)**：`xtls-rprx-vision`
        
    - **傳輸協定 (network)**：`tcp`
        
    - **傳輸安全 (streamSecurity)**：選擇 `reality`
        
    - **SNI**：`reality.yourdomain.com`
        
    - **uTLS**：`chrome`
        
    - **PublicKey**：貼上 Public Key
        
    - **ShortId**：貼上 Short ID
        
3. 點擊確定。在工作列右下角圖示按右鍵，將「系統代理」切換為 **自動配置系統代理 (PAC/全域)**。
    

### 方案 B：Clash Verge Rev (Mihomo 核心)

在配置中手動加入以下 Proxies 片段：

YAML

```
proxies:
  # 1. Reality 直連節點
  - name: "Reality-Direct"
    type: vless
    server: reality.yourdomain.com
    port: 443
    uuid: YOUR_UUID_HERE
    network: tcp
    flow: xtls-rprx-vision
    tls: true
    udp: true
    servername: reality.yourdomain.com
    client-fingerprint: chrome
    reality-opts:
      public-key: YOUR_PUBLIC_KEY_HERE
      short-id: YOUR_SHORT_ID_HERE

  # 2. WS+TLS+CDN 救援節點
  - name: "CDN-Rescue"
    type: vless
    server: cdn.yourdomain.com       # 若阻斷可換成 Cloudflare 優選 IP
    port: 443
    uuid: YOUR_UUID_HERE
    cipher: auto
    tls: true
    udp: true
    servername: cdn.yourdomain.com   # SNI 維持域名
    network: ws
    ws-opts:
      path: "/ray-ws-stream"
      headers:
        Host: cdn.yourdomain.com
```

## 4. Linux (桌面/伺服器/Photon OS) 客戶端推薦與設定

### 推薦客戶端

- **桌面環境 (GUI)**：**Clash Verge Rev (AppImage / .deb / .rpm)**
    
- **伺服器 / 命令列 (CLI 首選)**：**sing-box (單一二進位執行檔或 Systemd 服務)**
    

### sing-box CLI 設定步驟 (通用於 Debian/Ubuntu/Photon OS)

#### 步驟 1：安裝 sing-box

Bash

```
# 下載官方二進位檔 (以 amd64 為例)
bash -c "$(curl -fsSL https://sing-box.app/deb-install.sh)" 2>/dev/null || \
curl -Lo /usr/local/bin/sing-box https://github.com/SagerNet/sing-box/releases/latest/download/sing-box-linux-amd64.tar.gz
chmod +x /usr/local/bin/sing-box
```

#### 步驟 2：配置 `/etc/sing-box/config.json`

建立設定檔，在本地開啟 SOCKS5 (Port 10808) 與 HTTP 代理 (Port 10809)：

JSON

```
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "inbounds": [
    {
      "type": "mixed",
      "tag": "mixed-in",
      "listen": "127.0.0.1",
      "listen_port": 10809
    }
  ],
  "outbounds": [
    {
      "type": "vless",
      "tag": "reality-out",
      "server": "reality.yourdomain.com",
      "server_port": 443,
      "uuid": "YOUR_UUID_HERE",
      "flow": "xtls-rprx-vision",
      "network": "tcp",
      "tls": {
        "enabled": true,
        "server_name": "reality.yourdomain.com",
        "utls": {
          "enabled": true,
          "fingerprint": "chrome"
        },
        "reality": {
          "enabled": true,
          "public_key": "YOUR_PUBLIC_KEY_HERE",
          "short_id": "YOUR_SHORT_ID_HERE"
        }
      }
    },
    {
      "type": "vless",
      "tag": "cdn-out",
      "server": "cdn.yourdomain.com",
      "server_port": 443,
      "uuid": "YOUR_UUID_HERE",
      "network": "ws",
      "tls": {
        "enabled": true,
        "server_name": "cdn.yourdomain.com"
      },
      "transport": {
        "type": "ws",
        "path": "/ray-ws-stream",
        "headers": {
          "Host": "cdn.yourdomain.com"
        }
      }
    }
  ],
  "route": {
    "rules": [
      {
        "outbound": "reality-out"
      }
    ]
  }
}
```

#### 步驟 3：啟動與背景運行

Bash

```
# 測試設定檔正確性
sing-box check -c /etc/sing-box/config.json

# 直接啟動運行
sing-box run -c /etc/sing-box/config.json

# 測試連線
curl -x http://127.0.0.1:10809 https://ip.sb
```

## 5. 各平台客戶端選型矩陣總結

|**作業系統平台**|**建議首選客戶端**|**核心支援亮點**|**備選方案**|
|---|---|---|---|
|**Android**|**v2rayNG**|原生 Xray 核心、掃碼一鍵匯入、穩定可靠|sing-box (Android)|
|**iOS / iPadOS**|**Shadowrocket**|支援 Reality、性價比高、背景自動重連|Loon / Stash / Sing-box|
|**Windows**|**v2rayN**|介面直覺、更新快速、核心切換容易|Clash Verge Rev|
|**Linux (CLI)**|**sing-box**|輕量單一二進位檔、記憶體佔用極低 (約 20MB)|Xray-core 原生服務|