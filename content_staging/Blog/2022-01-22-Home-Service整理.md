---
title: Home Service整理
date: 2022-01-22
tags:
  - Linux
  - Server
  - Container
  - Old-Blog
slug: 2022/01/home+service
description: 整理我家的服務
image:
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

最近在其他VPS上面實驗Traefik等東西後覺得原來家裡的架構不是那麼的好,所以想重新整理現在家裡的相關服務

<!--truncate-->

# 原來的架構與服務

## 原來的服務

### 架構類

* Nginx Proxy Manager - 前端的Reserve proxy server
* Mariadb - 主要的DB
* Portainer - Docker Web GUI
* Watchtower - 自動更新Container/Image工具

### 服務類
#### 基礎網路服務
* Wireguard - vpn to Home
* Guacamole - Web terminal to Home
#### 多媒體網路服務
* Navidrome - Music Streaming
* Calibre-web - E-Book Library 
##### 追劇套餐(bundle)
* qbittorent - Major BT downloader
* Emby - Media Front-end
* Sonarr - Automatic tool for Drama/Anime
* Radarr - Automatic tool for Movie
* Lidarr - Automatic tool for Music
* Chinesesubfinder - Automatic tool for Chinese Sub file
* Jackett - RSS feed interface
* Flaresovlerr - Tool for supporting Jackett
#### 其他類
* Librenms - Monitoring 
* phpBB - BBS
* Heimdall - Dashboard

# 打算的更新版本

### 架構類

* Nginx Proxy Manager - 更換為Traefik
* Mariadb - 後續依照Service需求不要集中使用改分散到各Service獨立建立db簡化備份
* Portainer - 保留
* Watchtower - 保留

### 服務類

#### 基礎網路服務

* Wireguard - 保留
* Guacamole - 保留

#### 多媒體網路服務 - 完整保留

* Navidrome - 保留
* Calibre-web - 保留 

##### 追劇套餐(bundle) - 完整保留

* qbittorent - Major BT downloader
* Emby - Media Front-end
* Sonarr - Automatic tool for Drama/Anime
* Radarr - Automatic tool for Movie
* Lidarr - Automatic tool for Music
* Chinesesubfinder - Automatic tool for Chinese Sub file
* Jackett - RSS feed interface
* Flaresovlerr - Tool for supporting Jackett

#### 其他類

* Librenms - 蠻雞肋的,還在考慮要拿什麼替代或是取消
* phpBB - 沒用途取消
* Heimdall - 沒用途取消

