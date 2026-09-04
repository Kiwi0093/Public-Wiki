---
title: 網路論壇 - phpBB
tags:
  - VM
  - Container
---
# 網路論壇 - phpBB

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

>:::tip
>論壇還是用phpBB via docker, 簡單 省事 方便
>:::

<img src='https://img.shields.io/badge/Kiwi-%E5%A4%A7%E5%AD%B8%E6%99%82%E4%BB%A3%E5%B0%B1%E7%94%A8%E9%81%8E%E5%BE%97%E7%B6%B2%E9%A0%81%E7%89%88BBS%2C%E5%88%B0%E4%BA%86%E7%8F%BE%E4%BB%A3%E5%9B%A0%E7%82%BAIM%E7%9A%84%E7%99%BC%E9%81%94%E5%9F%BA%E6%9C%AC%E4%B8%8A%E5%B0%B1%E6%B2%92%E7%94%A8%E4%BA%86-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

# 作法

## Docker-compose.yml內容

```bash
version: '2'
services:
  mariadb:
    image: docker.io/bitnami/mariadb:10.3
    environment:
      - ALLOW_EMPTY_PASSWORD=yes
      - MARIADB_USER=bn_phpbb
      - MARIADB_DATABASE=bitnami_phpbb
    volumes:
      - /var/lib/docker/volumes/phpbb/mariadb:/bitnami/mariadb
  phpbb:
    image: docker.io/bitnami/phpbb:3
    ports:
      - 192.168.131.2:8082:8080
    environment:
      - PHPBB_DATABASE_HOST=mariadb
      - PHPBB_DATABASE_PORT_NUMBER=3306
      - PHPBB_DATABASE_USER=bn_phpbb
      - PHPBB_DATABASE_NAME=bitnami_phpbb
      - ALLOW_EMPTY_PASSWORD=yes
    volumes:
      - /var/lib/docker/volumes/phpbb/phpbb:/bitnami/phpbb
    depends_on:
      - mariadb
```

老實說我已經跑了另一個mariadb了是該可以整合在一起,但是...我懶,所以就另外跑一個Mariadb,要這樣搞記得名字不要重複, port不要重複

不過這個compose.yml裡面的定義是沒有mapping到外面的好方法直接跑就好了（這樣連db的安全性都可以保證）

# 注意事項

老實說使用的感想我對於bitnami的習性不是很喜歡,當你跑了之後需要把`/var/lib/docker/volumes/phpbb`的權限改了

他預設是UID=1001不是`chown 1001`就是直接用`chmod 777`不然的話東西會因為沒有寫入權限不會正常跑...



# 廢棄原因

* 沒在用,主要現在IM太發達,只是朋友家人間的溝通根本不會去建論壇
