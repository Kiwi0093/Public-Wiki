---
title: 整合型Archlinux安裝Script - 2.架構說明
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

其實不用搞成這麼複雜的,但是寫的時候想說寫的細一點,順便拿來練習寫shell script


## 架構說明

因為**_Arch Linux_**的安裝邏輯如下

>  先在Live CD的OS內對HDD進行處理,然後把透過網路把新的archlinux的系統裝進HDD內,然後chroot到新的系統內,利用新的系統的東西,進行初步的設定與啟動設定等動作,最後再完全退出重開改以HDD進行開機這樣算是完成了一個新的系統的安裝

所以在Script的使用上是把所有的選項在`arch-chroot`後都做成獨立的script進行如同下面的圖

![[Arch_Install_construction]](https://raw.githubusercontent.com/Kiwi0093/graph/master/img/arch_install_construction.png)

