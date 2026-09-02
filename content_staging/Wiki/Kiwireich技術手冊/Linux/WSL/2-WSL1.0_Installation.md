---
title: WSL 1.0 安裝
tags:
  - Linunx
  - Windows
  - WSL
---
# WSL 1.0 安裝

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 

:::tip
Microsoft 的 WSL (Windows Subsystem for Linux) 進入 Store 版本（1.0 版以上）後，最大的優點就是官方直接支援 `systemd`，並且對 GUI Apps (WSLg) 有了更好的支援。這篇記錄了如何從零開始搭建 WSL 核心環境，並將發行版替換成我比較習慣的 Arch Linux (ArchWSL)。
:::

## 基本環境與需求

**Windows 系統版本確認**

- **最低要求：** Windows 10 版本 2004 和更新版本 (Build 19041 以上) 或 Windows 11。
- **版本檢查方式：** 按下 `Win + R` 鍵入 `winver` 就可以查看。
- **Windows 10 補充說明：** 為了完整支援 WSL 的最新功能，Windows 10 基本上需要安裝更新檔 **KB5020030**。若系統未自動更新，可至 [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/Search.aspx?q=KB5020030) 搜尋並依照你的平台下載安裝。

## WSL 安裝步驟

現在安裝 WSL 有兩種方式，推薦直接用指令比較快，但如果你習慣用 GUI 介面也可以：

### 方法一：快速指令安裝 (推薦)

用系統管理員權限打開 PowerShell 並輸入：

PowerShell

```
wsl --install
```

這個指令會自動幫你開啟所有必要的 Windows 功能並預設安裝 Ubuntu。若不想裝 Ubuntu 只要開啟功能，可以加上 `--no-distribution` 參數。跑完後重新開機即可。

### 方法二：GUI 傳統模式安裝

如果你喜歡手動確認功能，或是從 Microsoft Store 下載：

1. 去 Microsoft Store 裡搜尋 **WSL** 並安裝。
2. 進入「開啟或關閉 Windows 功能」
3. 務必將以下幾個核心組件打勾
    
    - **Hyper-V**：這是基本必開的。
    - **Windows Hypervisor 平台**
    - **Windows 子系統 Linux 版**：整個 WSL 的基本組件。
    - **虛擬機器平台**
        
4. 設定完成後重開機。

## 推薦工具：Windows Terminal

使用 WSL 強烈建議搭配 **Windows Terminal**（一樣可在 Store 下載）。

> **美化小提醒：** 記得要另外安裝 **Nerd-Fonts** 系列字型，並在 Windows Terminal 的設定中將字型改過去。這樣你後續在 WSL 裡面用 `zsh` 搭配 `powerlevel10k` 等佈景主題時，那些漂亮的 icon 跟狀態列才不會變成亂碼（基本上有美化過的環境都需要這個字型）。

## 自訂發行版：ArchWSL

由於 WSL 內建的 Distribution 我都不是很喜歡（主要都是 Debian / Ubuntu 系），所以我選擇使用 **ArchWSL**。

- **安裝用法：** 非常簡單，現在可以直接打開 **Microsoft Store**，搜尋 **ArchWSL**（或 Arch Linux）並點擊取得與安裝。 安裝完成後直接從開始選單啟動，就會自動進行初步的環境初始化。比起以前還要到 GitHub 手動下載壓縮檔解壓縮，現在透過微軟商店安裝與管理方便很多。
    

## 確認 Systemd 狀態

透過商店安裝完 ArchWSL 後，我們需要確認並手動開啟 WSL 內的 `systemd` 支援，可以依循以下步驟：

**1. 確認 WSL 版本** 在 Windows 的 PowerShell 或 CMD 中輸入：

PowerShell

```
wsl --version
```

_確認有顯示版本號且為 Store 版 (1.0.0 以上)。_

**2. 檢查與修改 WSL 設定檔** 進入你的 ArchWSL 終端機，確認或建立 `/etc/wsl.conf` 檔案中包含以下字串：

Ini, TOML

```
[boot]
systemd=true
```

**3. 重啟並驗證** 回到 Windows PowerShell，將 WSL 完全關閉再重新啟動：

PowerShell

```
wsl --shutdown
wsl
```

重新進入 WSL 後，執行以下指令檢查 PID 1 的程序：

Bash

```
ps --no-headers -o comm 1
```

如果畫面顯示 `systemd`，就代表成功了！

## 附錄：VirtualBox 衝突解決 (Hyper-V support)

既然開啟了 Hyper-V 與虛擬機器平台，如果你同時有在使用 VirtualBox，可能會遇到虛擬機無法啟動的問題。 解決方法很簡單：只要進到 VirtualBox 該台 VM 的設定裡面，將「系統」->「加速」裡的 **半虛擬化介面 (Paravirtualization Interface)** 改成 `Hyper-V` 就好了。


## **結論** 

核心環境與 Arch 發行版搞定後，更細部的 WSL 開發環境與網路設定就留給下一篇寫。