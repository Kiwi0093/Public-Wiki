---
title: Vim 終端機美化與進階折疊
tags:
  - Editor
  - Unix
date: 2026-09-02
---

# Vim 終端機美化與進階折疊技巧

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

:::tip
自從我開始用Linux當主要的console後就開始騷包的準備大量導入Powerline
:::

<img src='https://img.shields.io/badge/Kiwi-%E4%B8%8D%E9%81%8E%E6%88%91%E5%BE%8C%E4%BE%86%E6%94%B9%E7%94%A8neovim%2Bnvchad%E5%BE%8C%E5%B0%B1%E6%B2%92%E8%87%AA%E5%B7%B1%E6%90%9E%E9%81%8E%E7%BE%8E%E5%8C%96%E4%BA%86-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />



本篇聚焦於傳統與現代命令列介面中的經典 Vim，專注於如何透過 **Powerline** 打造高顏值的狀態列，並結合 **Marker 摺疊機制** 與高效快捷鍵，讓純文字編輯器兼具視覺與結構管理的極致體驗（註：Neovim 與 NvChad 的現代化 Lua 架構請參閱另篇專文）。

## 一、 前置準備：Powerline 字型與核心安裝

為了讓狀態列正確渲染特殊圖標與箭頭，必須確保終端機字型與套件到位。

### 1. 安裝 Powerline 專用補字字型 (Patched Fonts)

- **Arch Linux / Manjaro：**
    
   ```bash
    sudo pacman -S powerline-fonts ttf-jetbrains-mono-nerd
   ```
    
- **Debian / Ubuntu：**
    
   ```bash
    sudo apt install fonts-powerline
   ```
    
- **FreeBSD：**
    
   ```bash
    sudo pkg install powerline-fonts
   ```

_(安裝後請記得將終端機模擬器的字型設定切換為帶有 Powerline 支援的字型，如 `JetBrainsMono Nerd Font`)_

### 2. 安裝 Vim 與 Powerline 核心

以 Arch Linux / Manjaro 系統為例：

```bash
sudo pacman -S vim powerline python-powerline
```

## 二、 Powerline 狀態列美化設定

透過內嵌 Python 模組驅動動態狀態列。

### 1. 初始化設定檔

將系統內建的 Vim 範例設定複製到家目錄：

```bash
cp /usr/share/vim/vim90/vimrc_example.vim ~/.vimrc
```

_(註：依據實際 Vim 版本，路徑中的 `vim90` 可能會是 `vim91` 等版本號)_

### 2. 寫入 Powerline 啟動設定

使用編輯器打開 `~/.vimrc`，在結尾加入以下設定：

```vimScript
" Powerline 狀態列美化
set laststatus=2           " 永遠顯示底部狀態列

" 透過內嵌 Python 3 載入 Powerline 框架
python3 from powerline.vim import setup as powerline_setup
python3 powerline_setup()
python3 del powerline_setup
```

### 效果圖

![](https://raw.githubusercontent.com/Kiwi0093/graph/master/img/vim_powerline.PNG)

## 三、 程式碼摺疊 (Code Folding) 與 Marker 設定

面對動輒數百行的程式碼，透過 Marker 標記與 `foldmethod` 能有效收合暫時不看的邏輯區塊。

### 1. 在 `~/.vimrc` 內追加摺疊配置

在同一個 `~/.vimrc` 檔案中加入以下摺疊參數：

Vim Script

```
syntax on
set foldmarker={{{,}}}
set foldmethod=marker
set foldlevel=0          " 預設啟動時將所有區塊全數摺疊關閉
let php_folding = 1      " 針對 PHP 語法的額外相依摺疊支援
set foldnestmax=3        " 限制最大巢狀摺疊層數為 3 層
```

### 2. 實際撰寫範例

設定完成後，在程式碼註解中加入 `{{{` 與 `}}}` 即可建立摺疊區塊：

PHP

```
// 資料庫連線與初始化模組 {{{
function init_connection() {
    // 實作細節...
}
// }}}
```

## 四、 摺疊控制高頻快捷鍵對照表 (Folding Commands)

在 Vim 操作摺疊狀態的常用快捷鍵：

|**快捷鍵指令**|**效果與說明**|
|---|---|
|`zi`|**啟用 / 關閉** 檔案整體的摺疊功能|
|`zo`|**打開 (Open)** 當前游標所在的摺疊區塊|
|`zc`|**關閉 (Close)** 當前游標所在的摺疊區塊|
|`zO`|**遞迴打開** 當前游標所在層級以下的所有摺疊區塊|
|`zC`|**遞迴關閉** 當前游標所在層級以下的所有摺疊區塊|
|`zm`|將 `foldlevel` 減 1（將整體摺疊層級再收緊）|
|`zM`|將 `foldlevel` 設為 0（**全部區塊強制摺疊**）|
|`zr`|將 `foldlevel` 加 1（將整體摺疊層級再放寬）|
|`zR`|將 `foldlevel` 設到最大（**全部區塊完全展開**）|
|`zx`|更新摺疊狀態（除了游標所在的區塊外，其餘重新套用規則）|
|`zf`|動態製作透過視覺模式選取範圍的起始與結束摺疊標記|

# 參考文獻

[Powerline on Linux: An Integration Guide](https://dane-bulat.medium.com/powerline-on-linux-an-integration-guide-c097831106f6)

# 結論

就是騷而已