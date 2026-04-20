---
title: Windows Game Server and Stream
date: 2021-10-13
tags: [Windows, Network, Server, Old-Blog]
slug: 2021/10/windows-gaming-stream
description: Windows最有用的Server..Gaming Server
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

其實概念很久以前就有想過,但是一直沒有實際需要所以沒弄...(就是懶)

但是最近因為想要玩[Pathfinder:WoTR](https://store.steampowered.com/app/1184370/Pathfinder_Wrath_of_the_Righteous/)所以還是弄了一下

<!--truncate-->

# 基本概念

其實很簡單,就是把一台可以玩遊戲的Windows變成可以遠端接續玩遊戲,這樣就可以隨意拿其他Console來玩遊戲而不用被自己的Gaming PC/NB限制住

相關的作法跟教學很多,甚至連[Learn Linux TV](https://www.youtube.com/c/LearnLinuxtv)都有教學...

影片如下

[![Setting up a Windows to Linux Game Streaming Server](http://img.youtube.com/vi/z2U09XubbAE/sddefault.jpg)](https://www.youtube.com/watch?v=z2U09XubbAE)

想要弄的人可以自己參考影片

# 相關工具

* Wake on Lan

  這個其實就是現在主機板都有的功能,詳細怎麼使用請自行Google, Client方面Android有Apk, Linux可以用gwake,都很簡單

* Nvidia Experiance

  這個基本上是因為我是用N家的卡,所以本來就會裝,要是不用N家的卡,那就會建議用steam link或是kino console,不過沒有搭配的Moonlight快

* Moonlight

  這個就是個好用的client, 速度快又免錢超贊的而且各平台都有

# 幾個心得

## 垃圾話

之前就有想過,由於各種需求的增加,會需要很多強大的console,例如高速的平板,足夠玩遊戲的NB,還要輕量好帶的NB,要能跟工作整合的NB等一大堆

既然家中的Service都開始逐步透過VM的方式虛擬化整合了,在導入docker跟Wireguard後家裡與外面的邊界也越來越模糊,然後就是早從10年前就開始的VM上的Windows P2P專機,到前一陣子的Guaamole+Manjaro,其實我就是開始走系統雲端化的路線讓console回歸真的是個console,不需要高速,不需要性能（網路卡還是需要的）,不過PC/NB之於我最原始也是最重要的一個機能 - Gaming卻一直沒被整合進來...

這次的驗證確立了在網路環境許可的前提下,連同Gaming是可以一併被遠端化的,不過因為耗電等關係,還是不建議一開始就整合進VM裡面(即使可以用PCI passthrogh技術)不玩遊戲的時候還一直讓他開著吃電實在太浪費了

## 重點摘要

* Wake on Lan的重要性

  說穿了就是省電...老實說要是你不在乎電費以及北極熊的死活,你是可以讓你的Gaming Server 7X24一直開著...

* Auto Login

  這個其實很重要,因為Windows的尿性,你開機完後沒有真的login的話是不會啟動Nvidia shield,所以你沒辦法連上,要是你用rdp連上去又會相衝而且rdp不會真的讓desktop login...所以不弄auto login的話你就會需要一個可以連上的console..大概是VNC或是DWservice之類的（而且你要連接device要key pin的時候也會需要或是你就去本機按一按弄好再離開也可以）

* MSTSC.EXE

  需要在shield裡面加上這個玩意直接啟動,用來代替Steam的Big Picture mode,不然你就得去弄個Fake HDMI或是真的接個螢幕(LLT裡面有提到)

  這也是Windows的尿性...但是你設MSTSC.EXE的話就沒這問題了(但是也變成一個遠端桌面不方便把手直接控制)

## 用後感想

其實Moonlight真的算是順暢的,網路沒問題的時候用起來跟本機沒太大差異,但是網路不好的時候就很卡...

另外其實在網路許可的前提下最好是不要把解析度設的比遊戲本體跑得還小..因為這樣還得壓縮更小傳出...反而會有延遲

