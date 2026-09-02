---
title: 終端機多工器與工作階段管理
tags:
  - Linux
  - FreeBSD
date: 2026-09-02
---
# 終端機多工器與工作階段管理

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 一、 核心工具比較與平台支援度

|**工具名稱**|**平台支援度**|**核心特點**|**備註說明**|
|---|---|---|---|
|**`screen`**|跨平台 (Linux/FreeBSD/macOS)|歷史悠久的傳統標準工具，幾乎所有 Unix-like 系統皆內建。|功能相對陽春，已被多數現代開發者淘汰。|
|**`tmux`**|跨平台 (Linux/FreeBSD/macOS)|業界標準與主流，具備極強的可擴充性與腳本支援。|搭配 `oh-my-tmux` 可達到開箱即用的現代化外觀。|
|**`zellij`**|跨平台 (Rust 編寫)|現代化、基於 WASM、開箱即用支援滑鼠與豐富 UI 的新星。|效能極佳，介面直覺（類似終端機中的 IDE）。|

## 二、 現代主流：`tmux` 與 `oh-my-tmux` 實戰

### 1. 基礎安裝

- **Arch Linux:**
    
    
   ```bash
    sudo pacman -S tmux
   ```
    
- **Debian / Ubuntu:**
    
    
   ```bash
    sudo apt install tmux
   ```
    
- **FreeBSD:**
    
    
   ```bash
    sudo pkg install tmux
   ```
    

### 2. oh-my-tmux 配置（美化與快速設定）

透過知名配置專案快速打造高大上的介面：

```bash
cd
git clone https://github.com/gpakosz/.tmux.git
ln -s -f .tmux/.tmux.conf
cp .tmux/.tmux.conf.local .
```

### 3. tmux 常用快捷鍵對照表 (Prefix 預設為 `Ctrl+a` 或 `Ctrl+b`)

_(註：若使用 `oh-my-tmux`，預設 Prefix 通常會對應至 `Ctrl+a`)_

|**功能說明**|**組合鍵操作 (Prefix 後接著按)**|
|---|---|
|**開新 Session**|`Prefix` + `C-c`|
|**垂直分割 Pane**|`Prefix` + `-` 或 `%`|
|**水平分割 Pane**|`Prefix` + `_` 或 `"`|
|**切換滑鼠模式**|`Prefix` + `m`|
|**重新命名 Session**|`Prefix` + `,`|
|**移動焦點到其他區塊**|`Prefix` + `方向鍵`|
|**從清單選擇視窗**|`Prefix` + `w`|
|**快速切換分頁**|`Prefix` + `數字鍵`|
|**分離 Session (Detach)**|`Prefix` + `d` (同 screen)|

### 4. 啟動與連線管理指令

- **列出所有運行中的 Session：**
    
    
   ```bash
    tmux ls
   ```
    
- **接回指定的 Session：**
    
    
   ```bash
    tmux attach -t $數字
    # 或簡寫
    tmux at -t 0
   ```
    
- **智慧啟動指令（結合自動連線與新增）：**
    
    
   ```bash
    tmux -u attach || tmux -u
   ```
    

### 5. 進階設定：預設 Shell 與 WSL 自動接管

- **設定預設 Shell 為 zsh：**
    
    在 `~/.tmux.conf` 內加入：
    
    
   ```bash
    set -g default-shell /usr/bin/zsh
   ```
    
- **WSL 自動 Session 銜接：**
    
    將以下片段加入 `~/.zshrc` 或 `~/.bashrc`。這在 WSL 環境中極度好用：關閉終端機視窗後重開，會自動掛載回原本的 Session：
    
    
   ```bash
    if command -v tmux &> /dev/null && [ -z "$TMUX" ]; then
      tmux attach-session -t default || tmux new-session -s default
    fi
   ```
    

## 三、 經典祖師爺：GNU `screen`

雖然 `tmux` 已經成為主流，但在許多輕量級容器（Docker image）或老舊伺服器中，`screen` 仍是預設內建的最佳救援工具。

### 常用指令

- **啟動新 Session：**
    
    
   ```bash
    screen -S mysession
   ```
    
- **列出背景中的 Screen Sessions：**
    
    
   ```bash
    screen -ls
   ```
    
- **接回指定的 Screen：**
    
    
   ```bash
    screen -r mysession
   ```
    
- **鍵盤快捷鍵：**
    
    - Detach（離開並放背景）：按下 `Ctrl+a` 接著按 `d`
    - 建立新視窗：`Ctrl+a` 接著按 `c`
    - 切換視窗：`Ctrl+a` 接著按 `n` (Next) 或 `p` (Previous)

## 四、 現代 Rust 終端機新星：`zellij`

`zellij` 是一套用 Rust 寫成的終端機多工器，它將排版概念極致簡化，預設提供下方狀態列、面板選單，且對滑鼠支援度極佳。

### 1. 安裝方式

- **Arch Linux:**
    
    
   ```bash
    sudo pacman -S zellij
   ```
    
- **Cargo (Rust 套件管理)：**
    
    
   ```bash
    cargo install zellij
   ```
    

### 2. 基本使用與操作

- **啟動新工作階段：**
    
    
   ```bash
    zellij
   ```
    
- **列出與管理 Sessions：**
    
    
   ```bash
    zellij list-sessions
   ```
    
- **接回指定的 Session：**
    
    
   ```bash
    zellij attach <SESSION_NAME>
   ```
    
- **核心操作特色：**
    
    - 啟動後畫面的最下方會直接常駐黃藍色的選單提示（Shortcut Bar），透過 `Ctrl+p`（控制面板）、`Ctrl+n`（新增面板）即可直接用方向鍵或滑鼠進行直覺操作，不需要死記複雜的 Prefix 組合鍵。