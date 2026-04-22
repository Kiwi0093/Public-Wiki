---
title: 整合型Archlinux安裝Script - 1.Before Start
date: 2026-04-22
tags:
  - Linux
  - Archlinux
---


> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)

:::tip
### 這整個系列,都因為`archinstall`這個工具的出現而整個廢掉,留這些主要還是一個紀念
:::


# 前言

在Linux的世界裡,我最喜歡Arch系的系統,但是Arch Linux的安裝並不是很人性化所以我就想說自己寫script來進行安裝


## 適用範圍

這是一個用在**_VMware ESXi_**上的汎用型**Arch linux**安裝script,基本預設條件如下

* ~~Intel CPU~~(Script裡面有AMD-ucode)
* 1~2GB的RAM
* 20GB以上的HDD空間

這個版本會做以下可選項目

**update 2021/06/15 因為搬回台灣用不上了所以刪除 Ver.K並不再維護該條目*

* Simple Arch linux
  - 基本型Arch Linux,只安裝基本的系統工具
  - 單NIC with固定MAC Address & static IP
  - Copy Live CD中的zsh設定
* V2Ray Server
  - Arch Linux with V2Ray without V2Ray 設定
  - 單NIC with固定MAC Address & Static IP
  - Copy Live CD中的zsh設定

* V2Ray Client Gateway
  - Arch Linux with V2Ray without V2Ray 設定
  - 無ipatable設定
  - 雙NIC with固定MAC Address
  - 外網可選PPPOE或Static IP
  - 內網為固定IP
  - Copy Live CD中的zsh設定
* ~~V2Ray Client Gateway Kiwi private version~~
  - ~~Arch Linux with V2Ray with現有Kiwi的相關設定(加密,私人使用)~~
  - ~~直接套用Kiwi現有的iptable(加密,私人使用)~~
  - ~~雙NIC with固定MAC Address~~
  - ~~外網可選PPPOE或Static IP~~
  - ~~內網為固定IP~~
  - ~~Copy Live CD中的zsh設定~~
* Nextcloud Server(後面發現其實用docker比較快)
  - Arch Linux With Nextcloud from package
  - 單NIC with固定MAC Address & Static IP
  - Copy Live CD中的zsh設定

## 使用方式

用LiveCD開機後,確認網路是好的的狀態下執行

```bash
zsh <(curl -L -s https://Kiwi0093.gitub.io/script/Arch/arch.sh)
```

*~~牆國~~天朝會用DNS污染來擋 https://raw.githubusercontent.com/ 所以,若在牆內使用可以先設定好`/etc/hosts`看看是不是可以克服

*後來我都改用https://Kiwi0093.github.io這個web直接放我的Script

## 參考資料

* [Arch Wiki](https://wiki.archlinux.org/) - 非常詳細的Arch Wiki幾乎所有Archlinux的設定都有相關說明,而且很多都有中文翻譯非常好用
* [Archlinux Install Guide](https://wiki.archlinux.org/index.php/Installation_guide_(正體中文)) - 這是中文的官方安裝說明文件,算是安裝的最基礎,實際上就是Arch Wiki的一部分
* [Miro's Blog](https://mirokaku.github.io/Blog/2016/ArchLinux-install-notes/) - 這份Archlinux的安裝筆記寫得很不錯