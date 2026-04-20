---
title: Bye-Bey WSL~~
date: 2022-07-16
tags:
  - Linux
  - Life
  - Old-Blog
slug: 2022/07/bye+WSL
description: 再會了
image:
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

因為是公司的電腦，所以我一直忍著不亂搞，想說用著WSL2+WSLg加減用用就好不要太過分（是說這樣應該已經蠻過份了），但就在我上週末手賤重新整理正在使用的ManjaroWSL時候發現我沒辦法複製出那個被我幹掉的full functional WSL了...然後我就跟WSL說Bye Bye了

<!--truncate-->

# 現在的方案

講方案就有點沈重,其實就是Manjaro KDE guest in Virtualbox @ windows10 host

# 苦難歷程

### Hypervisor選擇

其實在選定最終方案之前我也是很猶豫是要用Virtualbox還是VMware workstation player...

講真的要不是公司的電腦不用考慮太多我應該是會直接選用VMware workstation Pro..

你說我怎麼不選Qemu？恩....答案非常單純，單純的就是我以為在Windows Host上用效能會很差所以連測試都沒有就跳過了....

最後真的是VMware player的功能太陽春了，連auto resize都沒有....所以就忍痛放棄

### Convert from WSL to Virtualbox

其實這個只能說我自己蠢...

在移除WSL還有點三心兩意，以至於Hyper-V相關的套件沒移除乾淨所以很多下個月才會碰到的現象我幾乎全遇上了

像是莫名其妙會freeze guest os，Linux多核心無法開機，就算可以用也超級慢....

結果把最後windows的模擬系統平台關了就解決了...什麼鳥問題都沒有

### System Tuning

生在這個時代真的很幸運，什麼系統裝完的基礎調校一律不用，預設都幫你裝好了...

只要把要拿掉的拿掉，要用的裝上，然後就可以直接用了...

### 不免俗的吐槽

雖說一切看起來很好，但是我還是得吐槽一下那個Guest/Host shared folder功能，我想應該不是故意不做好而是真的有些限制才對，結論上來說就是我若是把我的Git repo放在那個共用夾內就會有各種奇怪的問題，像是git clone會莫名其妙失敗，`.git`底下奇怪的東西會被Host lock住不能remove...或是npm安裝的時候會告訴你link失敗所以失敗...

完全打碎了我想Git & Hexo靠企鵝，editor在Windows的騷包用法，現在只能乖乖的都在企鵝底下進行這些...

### 後續

需要測試多螢幕環境下是否可以弄到一個螢幕一個全畫面系統的方法進行（要是可以的話其實也蠻炫的）

# 結論

Windows還是拿來打電動（跟上班)就好了...整合Linux弄出的WSL真的很像個殘廢的砲灰,不能用systemd依賴的東西（我試過genie systemd也是很鳥）然後resolv.conf相關的也會有問題

在現在這個企鵝對systemd依賴性越來越高的時代，我只能用雞肋來形容

另外那個看起來很炫的WSLg其實也不能說不好，不過就是包上微軟皮的VcXsrv沒有太多因為微軟而特有的奇淫巧計...