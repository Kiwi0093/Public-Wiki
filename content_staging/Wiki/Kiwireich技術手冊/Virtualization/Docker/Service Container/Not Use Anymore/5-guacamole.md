---
title: "# 虛擬桌面 - Apache Guacamole"
tags:
  - VM
  - Container
date: 2026-09-04
---
# 虛擬桌面 - Apache Guacamole


> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

>:::tip
>其實這個用很長一段時間了但是到了最近重新整理的時候才發現我沒有寫成筆記
>:::

<img src='https://img.shields.io/badge/Kiwi-%E5%BE%8C%E4%BE%86%E6%88%91%E9%83%BDwireguard%2Bvnc%E5%B0%B1%E6%90%9E%E5%AE%9A%E4%BA%86%2C%E4%B8%8D%E9%9C%80%E8%A6%81%E5%9C%A8%E7%94%A8%E4%BB%96%E4%BA%86-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

# 參考資料

[Apache Guacamole and docker-compose &#8211; systems.dance](https://www.systems.dance/2021/01/apache-guacamole-and-docker-compose/)

# 基本流程

## 前提

這是一個把DB&AP放在同一個Docker-compose.yml內的作法,也的確後來發現不要刻意去整合DB可能對於container化後比較方便而且要項這冊一樣分切也比較簡單

## 流程

1. 先用docker run跑Image內的script來產生initial DB

2. 用compose file先單獨建立db(並且要定義volumes來保留db)

3. 在db container內把initial DB塞進db container的DB內（當然會透過volumes保留成果）

4. 移除單獨的db container(其實不宜除也可以,只不過後面的調整比較囉唆)

5. 利用compose.yml直接建立相關的container(包括DB container)

# 實際指令與文件

## Pull Image

```bash
docker pull guacamole/guacamole
docker pull guacamole/guacd
docker pull mariadb/server
```

## Create initail DB

```bash
docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --mysql > guac_db.sql
```

## Create Initial DB Container/Volume

### initial.yml

```bash
version: '3'
services:
  guacdb:
    container_name: guacdb
    image: mariadb/server:latest
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: '<PASSWD_YOU_WANT>'
      MYSQL_DATABASE: 'guacamole_db'
      MYSQL_USER: 'guacamole_user'
      MYSQL_PASSWORD: '<PASSWD_YOU_WANT>'
    volumes:
      - /var/lib/docker/volumes/<Dir_you_want>:/var/lib/mysql
```

### 指令

```bash
# Establish initial DB Container
docker-compose up -d

# Copy initial sql into db container
docker cp guac_db.sql guacdb:/guac_db.sql

# Opening a shell and initializing the db:
docker exec -it guacdb bash
cat /guac_db.sql | mysql -u root -p guacamole_db
exit

# Remove initial DB OS
docker-compose -f /where/is/your/docker-compose down
```

## Service Up

### docker-compose.yml

```bash
version: '3'
services:
  guacdb:
    container_name: guacdb
    image: mariadb/server:latest
    restart: unless-stopped
    networks:
      - traefik
    environment:
      MYSQL_ROOT_PASSWORD: '<PASSWD_YOU_WANT>'
      MYSQL_DATABASE: 'guacamole_db'
      MYSQL_USER: 'guacamole_user'
      MYSQL_PASSWORD: '<PASSWD_YOU_WANT>'
    volumes:
      - /var/lib/docker/volumes/guacamole/db:/var/lib/mysql
  guacd:
    container_name: guacd
    image: guacamole/guacd
    restart: unless-stopped
    networks:
      - traefik
  guacamole:
    container_name: guacamole
    image: 'guacamole/guacamole:latest'
    restart: unless-stopped
    networks:
      - traefik
 #   ports:
 #     - '8080:8080'
    environment:
      GUACD_HOSTNAME: "guacd"
      MYSQL_HOSTNAME: "guacdb"
      MYSQL_DATABASE: "guacamole_db"
      MYSQL_USER: "guacamole_user"
      MYSQL_PASSWORD: "<PASSWD_YOU_WANT>"
    depends_on:
      - guacdb
      - guacd
    labels:
      traefik.enable: true
      traefik.http.routers.guacamole.rule: Host(`<hostname.you.want>`)
      traefik.http.routers.guacamole.tls: true
      traefik.http.routers.guacamole.tls.certresolver: myresolver
      traefik.http.services.guacamole.loadbalancer.server.port: 8080

networks:
  traefik:
    external: true
    name: web-service
```

# 廢棄原因

* 安全性不佳,這個作法等於在防火牆上打個洞

* 改用`wireguard`+`vnc`的方式代替了相對更安全簡單
