---
title: Homebrew on Linux (Linuxbrew) 實用筆記
date: 2026-09-02
tags:
  - Linux
  - macOS
---
# Homebrew on Linux (Linuxbrew) 實用筆記

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 一、 前言：為什麼要在 Linux 上用 Homebrew？

傳統上 Homebrew 是 macOS 的標配，但它現在對 Linux 的支援（前身為 Linuxbrew）已經非常成熟。

**最大的痛點解決方案：沒有 `sudo` 權限的伺服器。** 當你在公司或學校的共用伺服器（特別是祖傳的 CentOS 7 或舊版 RHEL）上工作時，系統自帶的套件通常老得掉牙，而你又沒有 root 權限去跑 `apt` 或 `yum` 裝新版軟體。Homebrew 完美解決了這個問題——它可以把所有最新版的 CLI 工具（如 `git`, `python`, `node`, `fzf`, `ripgrep`）全部安裝在你自己的「家目錄」下，完全不污染或干擾底層系統。

## 二、 起手式：無 Root 權限的環境安裝

官方的自動安裝腳本預設會嘗試使用 `sudo` 把系統裝在 `/home/linuxbrew/.linuxbrew`。若你沒有 root 權限，腳本會自動退而求其次，將其安裝在你的家目錄下（通常是 `~/.linuxbrew`）。

**1. 執行官方化安裝腳本**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

_(執行過程中若提示輸入 sudo 密碼，可以直接按 Enter 略過，它會自動 fallback 到本機家目錄安裝)_

**2. 寫入環境變數 (極度重要)** 安裝完成後，Homebrew 不會自動生效，你必須將它加入你的環境變數中。請依照安裝完成最後畫面的提示，將以下內容加入你的 `~/.bashrc` 或 `~/.zshrc`：

```bash
# 讓系統啟動時自動載入 Homebrew 的環境變數 (以 bash 為例)
echo 'eval "$(/home/你的帳號/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
source ~/.bashrc
```

**3. 驗證安裝**

```bash
brew doctor
```

如果顯示 `Your system is ready to brew.`，代表你已經擁有完全屬於自己的高階套件管理員了！

## 三、 基礎維護：日常套件管理

Homebrew 的語法極度直覺，且因為是安裝在使用者目錄，所有指令都**不需要**加 `sudo`。

**1. 軟體安裝與移除**

```bash
# 搜尋套件
brew search <關鍵字>

# 安裝套件
brew install <套件名稱>

# 移除套件
brew uninstall <套件名稱>

# 列出所有你自己「主動安裝」的套件 (不包含相依套件，非常適合盤點環境)
brew leaves
```

**2. 系統與軟體更新**

```bash
# 更新 Homebrew 本身與遠端套件清單
brew update

# 升級所有已安裝的套件至最新版
brew upgrade

# 只升級特定套件
brew upgrade <套件名稱>
```

## 四、 釋放硬碟空間：快取清理

Homebrew 在編譯或下載預先編譯的二進位檔 (Bottle) 時，會將檔案快取在 `~/.cache/Homebrew` 裡，久了也會吃掉不少空間。

```bash
# 安全清理：清除舊版本的快取，保留最新版
brew cleanup

# 深度清理：連同最新的快取一起刪掉 (-s = scrub)
brew cleanup -s

# 檢查一下目前 Homebrew 佔用了多少硬碟空間
brew info
```

## 五、 進階技巧與避坑指南

### 1. 解決老舊系統的 C 函式庫相依問題 (gcc / glibc)

在極度老舊的伺服器上，你用 brew 安裝新版軟體後，執行時可能會遇到 `lib64/libc.so.6: version 'GLIBC_2.28' not found` 這種錯誤。 這代表底層系統的 C 語言庫太舊了。Homebrew 的解法非常暴力且有效——**它會自己裝一套新版的 gcc 放在你的家目錄！**

```bash
# 遇到編譯或執行錯誤時，主動透過 brew 安裝現代版的 gcc
brew install gcc
```

裝完後，Homebrew 管理的軟體就會自動去吃這套新版的函式庫，不再受限於底層系統。

### 2. 環境代碼化：Brewfile (IaC 實踐)

如果你經常需要在不同的伺服器或開發機上切換，每次都要重新 `brew install` 幾十個工具非常痛苦。Homebrew 內建了類似 `requirements.txt` 或 `package.json` 的機制，稱為 **Brewfile**。

- **匯出當前環境：**
    
    
   ```bash
   # 把你現在裝的所有套件清單，倒出成一個名為 Brewfile 的檔案
   brew bundle dump
   ```
    
- **在新機器上一鍵還原：** 把這個 `Brewfile` 丟到新的機器上，然後在同一個目錄下執行：
    
     
   ```bash
   # Homebrew 會自動讀取 Brewfile，把裡面的東西全部裝好
   brew bundle
   ```
    

這招對於無 Root 權限的開發者來說，是快速複製個人熟悉開發環境（Dotfiles 哲學）的終極殺手鐧。