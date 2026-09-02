---
title: 在桌面環境用root身份執行程式
tags:
  - Linux
  - Arch
  - Manjaro
  - Fedora
date: 2026-09-02
---

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)


部分圖形介面 (GUI) 應用程式（例如 SonicWall NetExtender）雖然提供了操作介面，但在背景呼叫系統底層核心工具（如 `pppd`、網路路由設定等）時需要 root 權限。若直接以一般使用者身分執行，常會因為權限不足而導致連線失敗。

## 命令列終端機執行法 (CLI)

- **透過 `su` 切換身分：** 直接切換至 root 帳號後再啟動應用程式。
    
    
   ```bash
    su -
    netExtenderGui
   ```
    
- **透過 `sudo` 暫時提權：** 前提需確保當前使用者已被加入 `sudoers` 清單中。
    
    
   ```bash
    sudo netExtenderGui
   ```
    

## 桌面捷徑與選單修改法 (.desktop)

若希望點擊應用程式選單或桌面捷徑時，系統能自動彈出密碼提示框並以 root 身分執行，必須修改對應的 `.desktop` 檔案（通常位於 `/usr/share/applications/` 或 `~/.local/share/applications/`）。

- **KDE 桌面環境 (`kdesu`)** 透過文字編輯器打開 `.desktop` 檔案，將 `Exec=` 欄位修改為使用 `kdesu`：
    
    
   ```bash
    # 修改前
    Exec=/usr/bin/netExtenderGui
    
    # 修改後
    Exec=kdesu /usr/bin/netExtenderGui
   ```
    
- **GNOME / XFCE / 通用桌面環境 (`pkexec`)** 非 KDE 環境建議使用現代 Linux 標準的 PolicyKit 提權工具 `pkexec`：
    
    
   ```bash
    # 修改後
    Exec=pkexec /usr/bin/netExtenderGui
   ```
    
    _修改完成後，若系統未立即生效，可執行以下指令重新整理桌面資料庫：_
    
    
   ```bash
    update-desktop-database ~/.local/share/applications/
   ```
    

## 進階應用：透過 Polkit 實現免密碼執行

若不想每次啟動該 GUI 軟體都必須手動輸入 root 密碼，可透過 PolicyKit 規則建立授權白名單。

1. 在 `/etc/polkit-1/rules.d/` 目錄下建立設定檔（例如 `49-netextender.rules`）：
    
    
   ```bash
    sudo nano /etc/polkit-1/rules.d/49-netextender.rules
   ```
    
2. 寫入以下規則內容（允許屬於 `wheel` 或 `sudo` 群組的使用者免密碼執行）：
    
    
   ```javascript
    polkit.addRule(function(action, subject) {
        if (action.id == "org.freedesktop.policykit.exec" &&
            action.lookup("program") == "/usr/bin/netExtenderGui" &&
            subject.isInGroup("wheel")) {
            return polkit.Result.YES;
        }
    });
   ```