---
title: Linux 與 FreeBSD 中/日文輸入法完整設定
tags:
  - Linux
  - Arch
  - Manjaro
  - PhotonOS
date: 2026-09-02
---

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)


## 一、 中日韓通用字型安裝 (Fonts)

無論使用哪種系統，首要步驟是安裝能正確渲染中日韓字符的通用字型：

- **Arch Linux / Manjaro：**
    
    
   ```bash
    sudo pacman -S noto-fonts-cjk
   ```
    
- **Debian / Ubuntu / Linux Mint：**
    
    
   ```bash
    sudo apt install fonts-noto-cjk
   ```
    
- **RHEL / CentOS / Fedora：**
    
    
   ```bash
    sudo dnf install google-noto-sans-cjk-fonts
   ```
    
- **FreeBSD：**
    
    
   ```bash
    sudo pkg install noto-fonts-cjk
   ```
    

## 二、 輸入法框架與引擎安裝 (各大系統指令)

強烈建議全面採用現代化的 **Fcitx5** 家族，以獲得最佳的效能、Wayland 相容性與日文/注音選字體驗。

### 1. Arch Linux 家族

```bash
sudo pacman -S fcitx5 fcitx5-mozc fcitx5-chewing fcitx5-configtool fcitx5-qt fcitx5-gtk
```

### 2. Debian / Ubuntu 家族

```bash
sudo apt install fcitx5 fcitx5-frontend-qt5 fcitx5-frontend-gtk3 fcitx5-module-quickphrase fcitx5-config-qt fcitx5-mozc fcitx5-chewing
```

### 3. RHEL / Fedora 家族 (Fedora 34+)

```bash
sudo dnf install fcitx5 fcitx5-gtk fcitx5-qt fcitx5-config-qt fcitx5-mozc fcitx5-chewing
```

### 4. FreeBSD

```bash
sudo pkg install fcitx5 fcitx5-configtool fcitx5-gtk4 fcitx5-gtk3 fcitx5-qt fcitx5-chewing fcitx5-mozc
```

## 三、 系統環境設定與運行情境

根據你使用的「桌面環境」與「顯示伺服器（X11 vs Wayland）」，設定方式有所不同：

### 情境 A：現代 Wayland + KDE Plasma (如 Arch Linux 搭配 Plasma 5.27/6)

在這種組合下，Fcitx5 具備極高的整合度，**幾乎不需要手動設定任何環境變數**：

1. 確保安裝完成上述套件後重新登入（Re-login）。
2. 系統會透過 XDG 自動在背景啟動 `fcitx5`。
3. 直接進入 KDE 的系統設定（**Regional Settings -> Input Method**），將新酷音（Chewing）與 Mozc 加入清單即可開箱使用。

### 情境 B：傳統 X11 或 XFCE / GNOME / 無完整桌面環境 (如 WSL)

若非運作於 Wayland + KDE，或系統無法自動帶入模組，則需手動配置環境變數：

- **全域環境變數 (`/etc/environment`)：**
    
    
   ```bash
    GTK_IM_MODULE=fcitx
    QT_IM_MODULE=fcitx
    XMODIFIERS=@im=fcitx
    SDL_IM_MODULE=fcitx
    GLFW_IM_MODULE=fcitx
   ```
    
- **FreeBSD 環境變數與自動啟動：**
    
    - 在 Shell 設定檔（`~/.xprofile` 或 `~/.bashrc`）中加入：
        
        
 ```bash
        export GTK_IM_MODULE=fcitx5
        export QT_IM_MODULE=fcitx5
        export XMODIFIERS=@im=fcitx5
 ```
        
    - 在視窗管理器啟動腳本（`~/.xinitrc`）中加入背景啟動指令：
        
        
   ```bash
        fcitx5 -d &
   ```
        

## 四、 跨平台與主流系列支援對照總表

| **系統 / 桌面情境**            | **建議輸入法架構** | **中文引擎**         | **日文引擎**      | **設定與啟動特性**                              |
| ------------------------ | ----------- | ---------------- | ------------- | ---------------------------------------- |
| **Arch / Wayland / KDE** | `fcitx5`    | `fcitx5-chewing` | `fcitx5-mozc` | **免設定開箱即用**，透過桌面設定介面直接掛載。                |
| **Debian / Ubuntu**      | `fcitx5`    | `fcitx5-chewing` | `fcitx5-mozc` | 企業與伺服器桌面常用，多數 X11 環境需配置環境變數。             |
| **RHEL / Fedora**        | `fcitx5`    | `fcitx5-chewing` | `fcitx5-mozc` | 預設全面擁抱 Wayland，與 Gnome/KDE 整合度高。         |
| **FreeBSD**              | `fcitx5`    | `fcitx5-chewing` | `fcitx5-mozc` | 透過 `pkg` 安裝，需手動設定 `.xinitrc` 與 Shell 變數。 |
