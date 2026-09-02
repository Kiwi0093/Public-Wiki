---
title: du - 磁碟空間分析與管理指南
date: 2026-09-02
tags:
  - Linux
  - FreeBSD
---
# du - 磁碟空間分析與管理指南

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 一、 傳統核心工具：`du` (Disk Usage)

`du` 是所有 Unix-like 系統（Linux、FreeBSD、macOS）原生內建的 POSIX 標準工具。透過循序讀取檔案系統中介資料來計算佔用空間，適合用於標準 Shell Script 自動化排查。

### 平台支援度

- **支援狀態：** 兩者皆有（Linux / FreeBSD 均為標準內建）。

### 核心指令與實戰範例

- **限制顯示目錄深度（最常用於排查空間）：**
    
    
   ```bash
    du -h --max-depth=1
    # 或簡寫為
    du -h -d 1
   ```
    
- **指定以 MB 單位輸出並列出指定目錄總和：**
    
    
   ```bash
    du -m -s /var/log/
   ```
    
- **實戰經典：找出當前目錄下前 5 大的子目錄或檔案**
    
    
   ```bash
    du -m --max-depth=1 | sort -nr | head -n 5
   ```
    

## 二、 終端機互動化先驅：`ncdu` (NCurses Disk Usage)

為了彌補純文字 `du` 查詢結果難以逐層追查的缺點而生。它引入了 `ncurses` 文字介面，讓管理者能在終端機裡像操作檔案總管一樣直覺。

### 平台支援度

- **支援狀態：** 兩者皆有（可透過各系統套件庫安裝）。
    

### 安裝與操作方式

- **安裝指令：**
    
    
   ```bash
    # Linux (Ubuntu / Debian / RHEL)
    sudo apt install ncdu
    
    # FreeBSD (透過 pkg 或 Ports)
    sudo pkg install ncdu
   ```
    
- **啟動與互動：**
    
    
   ```bash
    # 掃描當前目錄並進入互動介面
    ncdu
    
    # 掃描指定目錄
    ncdu /var/log
   ```
    
- **互動快捷鍵：** 使用上下方向鍵導覽，按 `Enter` 進入子目錄，選定目標後直接按下 `d` 即可刪除佔空間的肥大檔案。
    

## 三、 現代化磁碟分割區檢視器：`duf` (Disk Usage/Free Utility)

雖然名稱帶有 `du`，但核心功能更專注於取代傳統的 `df` 指令，以極佳的排版視覺化呈現整體磁碟分割區（Mount points）的健康度與剩餘容量。

### 平台支援度

- **支援狀態：** 兩者皆有（跨平台支援）。
    

### 安裝與使用方式

- **安裝指令：**
    
    
   ```bash
    # 透過套件庫或二進位檔安裝
    sudo apt install duf  # 部分 Linux 發行版
   ```
    
- **執行方式：**
    
    
   ```bash
    duf
   ```
    

## 四、 極速平行運算新星：`gdu` (Go Disk Usage)

使用 Go 語言編寫的高效能磁碟分析工具，專門針對現代 SSD 硬碟與多核心 CPU 架構最佳化設計，能完全榨乾硬體效能進行平行運算掃描。

### 平台支援度

- **支援狀態：** 兩者皆有（跨平台支援）。
    

### 優勢與核心操作

- **速度極快：** 相比傳統 `du` 或 `ncdu`，在掃描含有數百萬個小檔案（如 `node_modules`）的目錄時快上數倍。
    
- **常用操作指令：**
    
    
   ```bash
    # 互動式掃描當前目錄
    gdu
    
    # 僅顯示所有掛載點的空間狀態
    gdu -d
    
    # 啟動網頁伺服器模式，直接透過 Browser 遠端檢視掃描結果
    gdu --web /path/to/scan
   ```
    

## 跨平台支援對照總表

| 工具名稱       | 類型      | Linux 支援     | FreeBSD 支援     | 核心優勢                    |
| ---------- | ------- | ------------ | -------------- | ----------------------- |
| **`du`**   | 命令列工具   | 內建 (Native)  | 內建 (Native)    | 標準 POSIX，適合 Script 自動化。 |
| **`ncdu`** | 互動式 TUI | 支援 (APT/Pkg) | 支援 (Pkg/Ports) | 輕量、支援鍵盤互動刪除。            |
| **`duf`**  | 磁碟分割檢視  | 支援           | 支援             | 彩色進度條、完美的掛載點巡檢介面。       |
| **`gdu`**  | 高速平行分析  | 支援           | 支援             | 多執行緒、極速掃描、支援 Web 介面。    |
