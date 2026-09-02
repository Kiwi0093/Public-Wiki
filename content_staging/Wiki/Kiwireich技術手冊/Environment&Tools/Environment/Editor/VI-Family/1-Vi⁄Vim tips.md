---
title: Vi / Vim 編輯器通用指令與進階技巧
tags:
  - Linux
  - Arch
  - Manjaro
  - Fedora
---
# Vi / Vim 編輯器通用指令與進階技巧

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

:::tip
Vi /Vim是我很常用的Editor,所以會一點小技巧很重要
:::

## 一、 基本操作與存檔離開

所有指令皆在 **Command Mode（命令模式）** 下輸入，按下 `Esc` 鍵可隨時回到此模式。

|**指令**|**效果描述**|
|---|---|
|`:q`|不存檔離開（若有未儲存變更會阻擋）|
|`:q!`|強制不存檔離開（捨棄所有未儲存修改）|
|`:w`|寫入並儲存當前檔案|
|`:wq` 或 `ZZ`|存檔並離開|
|`:wq!`|強制存檔並離開（適用於權限允許時的複寫）|

## 二、 鍵盤編輯與導覽快捷鍵

從命令模式切換至編輯模式或執行區塊操作的常用快速鍵：

|**指令 / 鍵盤動作**|**效果描述**|
|---|---|
|`i`|在游標當前位置進入編輯模式 (Insert)|
|`a`|在游標**後方**位置進入編輯模式|
|`o`|在當前行的**下方**新增空白行並進入編輯模式|
|`dd`|刪除（剪下）整列|
|`[數字]dd`|刪除從當前行開始的指定「[數字]」列（例如 `5dd`）|
|`u`|復原 (Undo) 上一個動作|
|`p`|貼上 (`dd` 或 `yy` 暫存的內容)|

## 三、 搜尋與全域取代進階指令

利用命令模式底下的 Ex 指令來進行強大的字串尋找與批次取代。

### 1. 基礎搜尋

- 在命令模式輸入 `/` 後接關鍵字即可向下搜尋（按 `n` 找下一個，`N` 找上一個）。
    

### 2. 全域字串取代語法

- **全檔案全面取代：**
    
    
   ```
    :%s/search_from/replace_to/g
   ```
    
- **取代前逐一向使用者確認（Interactive）：**
    
    
   ```
    :%s/search_from/replace_to/gc
   ```
    
    _(跳出提示時，按 `y` 確定取代、`n` 跳過、`a` 全部取代、`q` 離開)_
    
- **略過英文大小寫差異：**
    
    
   ```
    :%s/search_from/replace_to/gi
   ```
    
- **僅取代「當前行」：**
    
    
   ```
    :s/search_from/replace_to/g
   ```
    
- **指定特定行數範圍取代：**
    
    
   ```
    :[行數起點],[行數終點]s/search_from/replace_to/gc
   ```
    
    _(例如 `:10,50s/foo/bar/gc` 代表僅在第 10 行到第 50 行之間進行確認取代)_
    

## 參考資料

[Find and Replace in Vim / Vi](https://linuxize.com/post/vim-find-replace/)
[Linux技術手札](https://www.opencli.com/)

