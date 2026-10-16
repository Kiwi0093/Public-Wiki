---
title: Krdp and Wayland
date: 2026-10-16
tags:
  - Archlinux
  - KDE
  - Network
---

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)

:::tip
### VNC沒辦法在Wayland環境使用只能換囉
:::

<img src='https://img.shields.io/badge/Kiwi-%E6%9C%AC%E4%BE%86%E8%A6%BA%E5%BE%97vnc%E7%9C%8B%E8%B5%B7%E4%BE%86%E6%AF%94%E8%BC%83linux%2C%E7%B5%90%E6%9E%9C%E7%8F%BE%E5%9C%A8%E5%A4%A7%E5%AE%B6%E9%83%BD%E5%BE%80rdp%E5%8E%BB%E4%BA%86....%E5%8F%8D%E8%80%8C%E6%98%AFwindows%E9%96%8B%E5%A7%8B%E5%90%9D%E5%97%87%E7%B5%A6rdp%20server-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />
## 📝 背景與架構目標

針對常駐運作的 `archdesk` ，升級至 KDE Plasma 6.8 後，原生 Wayland 顯示伺服器已深度整合 RDP 協定。 為獲得更穩定的連線與更佳的 Wayland 顯示支援，本指南將引導如何淘汰傳統基於 X11 的 TigerVNC，並轉向 `krdp` + Remmina (FreeRDP) 的現代化遠端桌面方案。

## 🛠️ 第一階段：系統升級與環境清理

### 1. 系統更新與升級

執行全系統更新以確保獲取最新的 Plasma 6.8 與相關依賴套件：

Bash

```
sudo pacman -Syu
```

### 2. 移除 TigerVNC Server

清理舊版的 TigerVNC 伺服器及其孤立的依賴套件，避免與後續的 RDP 服務產生通訊埠 (Port) 或背景行程衝突：

Bash

```
sudo pacman -Rns tigervnc
```

移除使用者家目錄下殘留的 VNC 密碼與設定檔：

Bash

```
rm -rf ~/.vnc
```

## ⚙️ 第二階段：核心關鍵 — 設定 SDDM 自動登入

**⚠️ 重要觀念：** `krdp` 是深度整合在 KWin Wayland 內的「使用者層級 (User Session)」服務。若 VM 重新開機後停留在 SDDM 登入畫面，Wayland Session 尚未啟動，`krdp` 伺服器就不會處於監聽狀態，將導致外部完全無法連線。

### 1. 配置自動登入 (Auto-login)

請在 `archdesk` 建立或編輯 `/etc/sddm.conf.d/autologin.conf`，讓系統開機後自動載入預設的 Wayland Session：

Ini, TOML

```
[Autologin]
User=kiwi
Session=plasma
```

### 2. 處理 KWallet (KDE 金鑰環) 密碼彈窗

設定自動登入後，系統登入時不會收到明碼密碼，因此 KDE 預設的 KWallet 將無法自動解鎖。

- **解法：** 當你用 RDP 連進桌面後，打開「KDE 錢包管理員 (KWalletManager)」，將預設錢包的密碼變更為「空白」，即可免除後續打開瀏覽器或其他應用時的彈窗干擾。
    
- (註：此設定不影響由 Systemd User Service 在背景常駐的 SSH Agent 授權 )
    

## 🚀 第三階段：安裝與啟用 KRDP

### 1. 安裝必要套件

安裝 KDE 原生的 RDP 伺服器組件 (`krdp`)，以及在本地端所需的客戶端工具 `remmina` 與其依賴的 `freerdp` 協定核心：

Bash

```
sudo pacman -S krdp remmina freerdp
```

### 2. 啟動 RDP 服務

KDE Plasma 6 之後的 Wayland 環境已將 RDP 伺服器完全整合進圖形介面中，不需手動維護設定檔：

1. 開啟 **「系統設定 (System Settings)」**。
    
2. 導航至 **「系統 (System)」** -> **「遠端桌面 (Remote Desktop)」**。
    
3. 開啟 **「啟用 RDP 伺服器 (Enable RDP server)」** 選項。
    
4. 在介面中設定專用於遠端連線的使用者名稱與密碼。
    
5. _(防火牆確認)_：確保本機防火牆已放行標準的 RDP 通訊埠 (TCP 3389)。
    

## 💻 第四階段：客戶端連線設定 (Remmina)

在發起連線的客戶端主機（如家中的實體 Dell 筆電，IP 192.168.31.21 / .54 等）開啟 Remmina 建立新連線配置：

- **協定 (Protocol)**：選擇 `RDP - FreeRDP plugin`。
    
- **伺服器 (Server)**：輸入目標 `archdesk` 的 IP `192.168.31.11`。
    
- **憑證**：輸入在 KDE 系統設定中所建立的 RDP 帳號與密碼。
    
- **色彩與畫質**：內網環境建議將色彩深度調至 `True color (32 bpp)` 或開啟 RemoteFX，以發揮最佳的圖形渲染效果。
    

### 驗證連線

執行 `sudo reboot` 重新啟動 `archdesk`。等待約 30 秒後，完全不開啟任何 ESXi 終端控制台，直接從客戶端發起 RDP 連線。若能直接進入並看到完整的 KDE 桌面，即代表自動登入與 KRDP 背景服務皆已成功運作。