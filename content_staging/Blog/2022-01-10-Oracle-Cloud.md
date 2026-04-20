---
title: Oracle Cloud
date: 2022-01-10
tags:
  - Linux
  - Server
  - Container
  - Old-Blog
slug: 2022/01/Oracle+cloud
description: 佛心的雲端供應商
---


>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

隨便亂逛看到Oracle有永久免費的Cloud,一時手癢就申請了

[Oracle Cloud](https://www.oracle.com/cloud/)

<!--truncate-->

# 基本介紹

免費的部份有一大堆DB相關的服務(不愧是Oracle)都用不上,對我來說大概只有以下幾點好用

* 可以建立兩個VM - 免費的OS只有Ubuntu/CentOS/Oracle Linux..(沒有Arch系的也沒有Debian...)
* 過時的CPU+1GB RAM
* 486Mb/s不限制流量的網路
* 據說兩個加起來100GB的空間

# 目前的用途

這樣的東西老實說很適合拿來架梯子(只要牆內直連的速度夠的話...),不過我這次優先拿來跑Calibre-Web,因為我發現現在公司裡面其實也有不少輕小說的愛好者

所以乾脆拿來架設給大家用的電子書庫比較實在(當然後面應該也是會在同一台上面掛上V2Ray)

# Service構成

* Basic OS - Ubuntu 21.0 mini
* Docker Conainers
  * Traefik  - Proxy/Redirect
  * Portainer - Docker GUI
  * watchtower - Auto Updater
  * Calibre-web - Ebook library 

# 結論

除了上述的用來增加宅友的用處以外其實更重要的就是拿來練習Traefik的相關使用，目前看起來下一次家裡的大型改版應該就是要把目前用的Nginx Proxy Manger換成Traefik，畢竟這是連Port Mapping都不需要的好東西
