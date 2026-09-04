---
title: 3-isso
tags:
  - VM
  - Container
  - Blog
slug:
date: 2026-09-04
description:
image:
---
# Blog評論系統 - ISSO

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)


>:::tip
>繞了一圈最佳的Blog評論系統就在身邊...改用Isso吧
>:::

<img src='https://img.shields.io/badge/Kiwi-%E5%BE%8C%E4%BE%86%E7%99%BC%E7%8F%BE%E5%85%B6%E5%AF%A6%E6%A0%B9%E6%9C%AC%E6%B2%92%E4%BA%BA%E6%9C%83%E7%95%99%E8%A8%80%E7%B5%A6%E6%88%91...%E6%89%80%E4%BB%A5%E5%B0%B1%E4%B9%BE%E8%84%86%E6%8B%86%E4%BA%86-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

# 參考資料

[Hexo-theme-Next的comment說明](https://theme-next.js.org/docs/third-party-services/comments#Overview)

[Isso QuickStart](https://posativ.org/isso/docs/quickstart/#configuration)

# 作法

## Docker-compose.yml內容

*更新於2022/7/26*

```bash
services:
  isso:
    image: ghcr.io/isso-comments/isso:latest
    container_name: isso
    environment:
      - PUID=1000
    volumes:
      - /var/lib/docker/volumes/isso/config:/config
      - /var/lib/docker/volumes/isso/data:/db
    restart: unless-stopped
    networks:
      - traefik
    labels:
      traefik.enable: true
      traefik.http.routers.isso.rule: Host(`$domain_you_like`)
      traefik.http.routers.isso.tls: true
      traefik.http.routers.isso.tls.certresolver: myresolver

networks:
  traefik:
    external: true
    name: web-service
```

基本上這種寫法需要先去`touch`一個`isso.conf`檔案並且記得權限要讓定義的PUID可以讀

## isso.conf內容

```bash
[general]
dbpath = /db/$(databasename).db        #這個檔名可以自己定義
host = https://$(your_Blog_domain)        #這裡記得要設定Blog的網址
[server]
listen = http://0.0.0.0:8080            #這裡設定的Port就是docker-compose.yml裡面要定義的容器內的port
[guard]
enabled = true
ratelimit = 2
direct-reply = 3
reply-to-self = false
require-author = true
require-email = true
[moderation]                            #這個是需要不需要先審查過再貼出,要的就改成true
enabled = false
purge-after = 30d
[admin]                                     #這是設定要不要管理員
enabled = false
password = strong-password
```

## 外部轉出

<font color="red"><del>跑起來後用nginx-proxy-manager去弄個外部的連接位置然後就可以去設定Next了</del></font>

有強大的Traefik..什麼都不用擔心.....

## Next設定

在_config.next.yml裡面加上

```bash
# ---------------------------------------------------------------
# Comments Settings
# See: https://theme-next.js.org/docs/third-party-services/comments
# ---------------------------------------------------------------

# Multiple Comment System Support
comments:
  # Available values: tabs | buttons
  style: tabs
  # Choose a comment system to be displayed by default.
  # Available values: disqus | disqusjs | changyan | livere | gitalk | utterances
  active: isso 
  # Setting `true` means remembering the comment system selected by the visitor.
  storage: true
  # Lazyload all comment systems.
  lazyload: false
  # Modify texts or order for any naves, here are some examples.
  nav:
    #disqus:
    #  text: Load Disqus
    #  order: -1
    #gitalk:
    #  order: -2
.....
.....
# Isso
# For more information: https://posativ.org/isso/
isso: https://$domain_you_like/
```

然後`hexo d -g`就好了

# 注意事項

* 我用Traefik跑`https`的話data-isso就用`https://$domain_you_like/`來取代教學裡面的`//$domain_you_like/`

* `hexo s`在本機跑的時候是看不到評論的..一定要`hexo g -d`拋到github上面才看得到....
