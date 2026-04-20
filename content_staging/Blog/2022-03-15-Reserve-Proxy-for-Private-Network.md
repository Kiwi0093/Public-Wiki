---
title: Reserve Proxy for Private Network
date: 2022-03-15
tags:
  - Linux
  - Server
  - Container
  - Life
  - Old-Blog
slug: 2022/03/reserve+proxy+private+network
description: 轉來轉去
---

>  :::info 
> 本文轉載自舊站存檔。
> :::


# 前言

重整家中內部服務..把內部跟外部的Server拆為Private & DMZ,但是內部連線的部份老是用`http://ip:port`真的很醜（好啦我很有病）所以就想弄個反向代理來直接指定..無奈又是一個學藝不經的故事..


<!--truncate-->

# 目標

其實很單純,沒有要弄到跟很多年前的那個什麼`dual chroot bind`的超複雜方式進行,而是採用簡單的`dnsmasq+adguard home`搞定內部DNS（包括內部Domain指定與擋廣告）..你說為什麼不用`Pi Hole`?
因為我懶而且先看到ADGUARD Home, 不過可能為了精簡也導入直接在dnsmasq上做擋廣告也可以

PS:感謝[師匠提供的偉大連結](https://pgl.yoyo.org/adservers/)

# 基本架構

其實也說不上什麼架構...就是對比外部使用Traefik,裡面不需要自動SSL(內部Domain也很難做SSL)所以內部就加掛一個`Nginx Proxy Manager`然後透過NPM來進行轉址

## 慘劇

不知道為什麼,應該是很單純的設定就是沒辦法成功..例如

```bash
http://emby.private -> http://emby.private:8888
```

但是卻沒有Mapping過去

## 解決方案

最終用docker container間指定的方式可以達成

```bash
http://emby.private -> http://emby:8888
```

這樣就搞定了（前提是都要在同一個docker network裡面）



# 結語

只有一句話...學藝不精呀～～～
