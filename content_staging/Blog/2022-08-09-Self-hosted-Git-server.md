---
title: Self-hosted Git server
date: 2022-08-09
tags:
  - Linux
  - Life
  - Old-Blog
slug: 2022/08/self+hosted+git+server
description: 自己動手豐衣足食
image:
---

>  :::info 
> 本文轉載自舊站存檔。
> :::


# 前言

因為我想用`ansible`以及`ansible-pull`來自動化自己的<ruby><font color="lightblue"><del>Desktops & Servers</del></font><rp>(</rp><rt><font color="red">各種玩具</font></rt><rp>)</rp></ruby>，所以需要一個搭配的Git server, 有鑑於我覺得東西還是放在自己家裡比較安全的出發點，我就上了一台`gitea`

<!--truncate-->

# 安裝過程

其實沒什麼好講的就是單純的`docker-compose up -d`就好了唯一的坑應該是`sqlite`沒辦法正常的使用，所以我就上了`mariadb`一發搞定...詳細的內容我都放在`wiki`裡面了

# 結論

因為內部網路加上我是共用docker host，所以我最終只用很不安全的`http`來進行git的相關動作（連`SSH`都沒設定）所以可以說超陽春...

接下來就會把重心轉移到<ruby><font color="lightblue"><del>Ansible</del></font><rp>(</rp><rt><font color="red">netboot.xyz</font></rt><rp>)</rp></ruby>(好像哪裡怪怪的...)

沒有啦，應該還是會先focus在Ansible上面啦，畢竟Netboot.xyz實質上我沒什麼用的到的機會頂多就是炫而已...