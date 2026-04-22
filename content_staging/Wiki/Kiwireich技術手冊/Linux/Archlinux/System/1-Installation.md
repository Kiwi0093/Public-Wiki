---
title: Archlinux Installation
date: 2026-04-22
tags:
  - Linux
  - Archlinux
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)

:::tip
### 這個工具真的很偉大,一口氣解決了Archlinux長久以來因為不好安裝導致的門檻
:::

<img src='https://img.shields.io/badge/Kiwi-%E9%9B%96%E7%84%B6%E7%95%8C%E9%9D%A2%E8%B7%9FFreeBSD%E4%B8%80%E6%A8%A3%E9%99%BD%E6%98%A5%2C%E4%BD%86%E6%98%AF%E6%88%91%E9%82%84%E8%A0%BB%E6%9C%89%E8%A6%AA%E5%88%87%E6%84%9F%E7%9A%84%2C%E4%B8%8D%E7%9F%A5%E9%81%93%E4%BD%95%E6%99%82%E9%9A%94%E5%A3%81%E7%9A%84Gentoo%E4%B9%9F%E5%AD%B8%E4%B8%80%E4%B8%8B-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

<!--truncate-->

## Archinstall：現代人的 Arch Linux 安裝標準

如果你還在手敲 pacstrap 和手寫 fstab，那真的辛苦了。現在安裝 Arch Linux 其實只需要一個核心前提：確認網路會通。只要網路通了，一個指令 archinstall 就能讓你體驗到什麼叫作「自動化安裝的快感」。

它不只是個腳本，它是一個基於選單的互動式安裝程式（TUI）。比起像 Ubuntu 或 Manjaro 那種肥大的 Calamares GUI 介面，archinstall 更快、更穩，而且最重要的是：它讓你對系統保有完全的控制權，卻不用浪費時間在重複的勞力活上。

##### 🛠 核心流程：開機、聯網、執行

進入 Arch Live 環境後，別急著分區，照這三步走：

檢查網路： `ping google.com` 看一下。如果是 WiFi，用 `iwctl` 連一下，這步沒過後面都不用談。

##### 啟動神器：

直接在 Shell 輸入：

```Bash
archinstall

```
##### 填空題時間：

畫面會出現一連串選單。這不是考試，按照你的直覺填就好（細節請看下方進階配置）。

#### ⚡ 進階配置要點（別亂填，看這裡）

雖然是自動化，但有些選項選對了，你的 Arch 才會真的「起飛」：

##### 1. 磁碟分割 (Disk Layout) —— 建議選 Btrfs

別再用傳統的 ext4 了。選 "Wipe all selected drives" 然後檔案系統指名 Btrfs。它支援壓縮和子卷（Subvolumes），以後要配快照備份（如 Timeshift）超方便。

<img src='https://img.shields.io/badge/Kiwi-%E4%BD%86%E6%98%AF%E6%88%91%E9%83%BD%E7%94%A8ext4-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

##### 2. 核心 (Kernels) —— 效能黨必選

想穩定：選 linux。

想噴射：選 linux-zen。 對於桌面用戶來說，Zen kernel 的反應速度和調度優化真的有感。

##### 3. 功能組合 (Profiles) —— 懶人福音

這步最爽。選 Desktop 後，你可以直接挑 KDE, GNOME, Sway, 或 Hyprland。它會自動幫你把相關的 Display Manager（如 SDDM 或 GDM）跟基礎驅動一次補齊。

##### 4. 顯示卡驅動 (Graphics Driver)

它會自動偵測硬體。如果你是 NVIDIA 用戶，選專有驅動（Proprietary）；如果是 AMD 或 Intel，選開源驅動就好。它裝得比你自己手動抓還準。

#### 💾 神技：設定檔的「傳家寶」模式

這是我覺得 `archinstall` 徹底擊敗 `Calamares` 的地方。

安裝結束前，它會問你要不要存下 User Configuration。這會生成一個 JSON 檔案。請一定要存下來！ * 它的好處： 以後你換新電腦，或是在別的虛擬機要部署一模一樣的環境，你連選單都不用點。

怎麼用： 把那個 JSON 丟到隨身碟，開機後執行：

```Bash
archinstall --config my_favorite_setup.json
```

然後你就可以去泡咖啡了。這才是真正的「Infrastructure as Code」，把你的安裝習慣變成程式碼。

### ⚖️ 為什麼放棄 GUI 安裝介面？

速度： Calamares 常常卡在載入圖形介面或奇怪的解壓過程。archinstall 跑的是底層 Python 邏輯，純文字介面反應極快。

乾淨： 很多 GUI 安裝程式會硬塞一堆預設軟體。archinstall 給你的是官方原汁原味的 Arch，只裝你選的東西。

自動化彈性： 你可以隨時進去修改它的 config.json，這種客製化程度是 GUI 介面永遠給不了的。

### 總結： 

> 以前裝 Arch 是為了證明技術，現在裝 Arch 是為了效率。如果你追求的是「快、準、穩」，`archinstall` 就是目前最完美的解決方案，沒有之一。

<img src='https://img.shields.io/badge/Kiwi-%E4%BD%86%E6%98%AF%E6%88%91%E6%98%AF%E8%BF%BD%E6%B1%82%E7%88%BD%E8%B7%9F%E4%B9%BE%E6%B7%A8-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />