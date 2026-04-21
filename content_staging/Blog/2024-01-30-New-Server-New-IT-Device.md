---
title: New Server! New IT Device!
date: 2024-01-30
tags:
  - Life
  - Linux
  - Old-Blog
slug: 2024/01/new+server+device
description: 新玩具～～～
---
>  :::info 
> 本文轉載自舊站存檔。
> :::


# 前言

前一陣子終於完成新家的裝潢及搬運,稟持著<ruby><font color="lightblue"><del>更新換代</del></font><rp>(</rp><rt><font color="red">喜新厭舊</font></rt><rp>)</rp></ruby>,新家的網路設備與相關Server我幾乎都換了,所以自然會有一些更換機器與設定的部份要來筆記一下

<!--truncate-->


# 硬體介紹

* ASUS TS110-E14
  
  * 這台現在是我的主要Esxi Server,目前跑以下VM
    
    * FreeBSD 14-release X1 : Gateway + Firewall
    
    * Archlinux X1 : DHCPd + DNS + Unifi Network Application
    
    * PhotonOS 5 X3 : Docker hosts for Containers
    
    * Xigmanas 13 With PCI passthrough X2 : Server Backup and Temp

* HPE Microserver Gen8
  
  * Xigmanas 13 : Main NAS for Media Center

* Unifi Switch Enterprise 8 PoE
  
  * Main Switch

* Access Point U6 In-Wall

* Access Point U6 Pro(運送中) 

# 內容介紹

## Unifi系列

其實主打的就是一個騷包....

想說把新家的IT基礎設備換成類商用等級的,並且可以用一個中控台直接apply設定到AP,應該會比較方便,並且剛好被老家之前換的**TP-Link Deco X75**雷到,高單價的Mesh AP居然沒有whitelist mode的MAC Address filter功能...

原來想說房子不大用台**U6 In-Wall**就可以搞定,無奈位置不好電視牆背後的空間訊號都不好

所以再買台**U6 Pro**來補一下

## HPE Microserver Gen8

這台是舊機本來有兩台,不過因為老家的ASUS Server硬體掛了(10年左右也夠本了)所以得挪用一台回老家充當NAS使用,剩下的一台就直接**10GbE NIC + 16TB HDD X4**變成一台有**48T**可用空間的**raidz1** NAS

## ASUS TS110-E14

這台沒什麼懸念就是**Esxi Server**,不過在建構基礎網路環境的時候還是很痛

### FreeBSD 14 Gateway

沿用過去的習慣,Gateway還是選用老牌可靠的FreeBSD+pf+ipfw

#### 網路架構

本來是想要全部用一個C class子網路搞定所有的（這樣可以簡化架構,只是沒有在我手上跟殘廢沒兩樣的DMZ區隔）結果發現因為**NAT Loopback**問題導致內部網路沒辦法Access~~我對外的Service所以只能再次改回原來的WAN+LAN+DMZ的架構~~修改pf設定後解決了這個問題-參考[這裡](https://www.twbsd.org/cht/book/new/ch12.htm)

```shell
# Nat Loopback
no nat on $int_if proto tcp from $int_if to $int_net
rdr on $int_if proto tcp from $int_net to $ext_ip port { 25, 165, 993 } -> 192.168.0.2
nat on $int_if proto tcp from $int_net to 192.168.0.2 port { 25, 165, 993 } -> $int_if
```

所以最終還是整回一個C Class subnet解決

### Archlinux Dnsmasq+Unifi

這個算是本次的大型地雷的一部份,在原始的構想中我是打算把**dnsmasq**還有**Unifi Network Application**都用docker container掛起來就好了結果

#### Dnsmasq

用Docker是可以跑得起來,但是因為IP區段的關係加上我沒有認真去研究Mapping,所以就出現了,service雖然有跑起來,但是其他client根本沒有辦法正常跑dhcp跟dns,搞了半天一把dnsmasq移到獨立的VM上就好了什麼都不用改....

#### Unifi Network Application

這個就更氣人,不是依照說明搭配的**mongodb**有問題就是mongodb搞定後controller因為java問題無法正確跑出網頁...看了原來落落長的說明之後發現只需要在**Archlinux**有安裝yay的狀態下

```bash
yay -S unifi
```

然後只要確認jre的version是17就好了....一行指定搞定所有.....

### XigmaNAS

有鑑於Docker後端及一些系統的備份需求,我掛了一個ZFS Mirror的NAS透過nfs掛到各server上進行基本備份, 後續會搭配自建的Git server一併做整體內部的專案管理

另外,老家的機器之前是直接在Esxi上加HDD做TEMP供BT download或是其他系統需要的容量擴充使用,但是在這次的移機中我也飽受因為沒有同時加掛該HDD導致某些VM開不起來

所以這次我就把Temp HDD掛在XigmaNAS內再走nfs export出去

# 酸爽的過程重點

## XigmaNAS無法加掛Temp槽

不知道是啥原因,我的XigmaNAS就是沒辦法加上Temp槽,所以最後我只好再加開一台VM以及其配套PCI Passthrough的硬體去跑一個單獨的XigmaNAS專做Temp export使用

## Unifi系列

如同前面提到的,該死的Unifi-Network-Application沒辦法在Docker上好好的運作...加上Dnsmasq也不順所以最終多開了一台VM

## WiFi AP位置不良

裝潢設計的時候大概我的腦子被什麼東西啃了,所以U6 In-Wall的安裝位置不好,會背對兩個臥室及兩個洗手間導致訊號不好...所以只好在加裝一顆U6 Pro提早達成Unifi無性增殖...

# 結論

住在新家是個很高興的事情,但是過程中的搬家卻不是....使用新的Server及變更架構是很高興(?)的事情,但是硬體爆掉得緊急救援以及大量資料搬遷卻不是....

一些詳細的設定變更部份我會再update到wiki裡面去