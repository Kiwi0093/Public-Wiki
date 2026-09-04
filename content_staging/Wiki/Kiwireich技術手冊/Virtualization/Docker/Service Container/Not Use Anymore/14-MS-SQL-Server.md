---
title: 資料庫 - MS SQL Server
tags:
  - VM
  - Container
date: 2026-09-04
---
# 資料庫 - MS SQL Server


> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

>:::tip
>老實說這個大概只有幫公司IT做這個專案的時候會用到,但是還是加減放一下
> :::

# MS SQL-Server docker-compose.yml

```yml
# Docker-compose.yml
version: '3'
services:
  mssql
    image:  mcr.microsoft.com/mssql/server:2019-latest
    container_name: sql-server
    environment:
      - PUID=1000
      - ACCEPT_EULA=Y
#     - MSSQL_PID=<your_product_id | edition_name> (default: Developer)"
      - SA_PASSWORD=<your@Passw0rd>
    ports:
      - 1433:1433
    volumes:
      - /var/lib/docker/volumes/mssql:/var/lib/mssqlql
    restart: always
```

### 基本說明

* PUID=1000 因為SQL-Server不能用root運作所以要另外指定一個USER不然容易會有問題,但是我看一堆教學都沒放所以若是沒放也可以正常跑就不用這行
* ACCEPT_EULA=Y 這個其實是廢話,因為不同意就不能跑，不過這個Image是微軟官方做的所以也沒辦法改
* MSSQL_PID 這個其實是最重要的一個參數,因為他決定了你在跑的這個SQL Server是什麼版本的,若是公司在用的，就要在這裡放入你買的SN
* SA_PASSWORD 就如字義等於Mysql的root密碼定義

# 結語

這個只是單純跑起來其實很簡單..不愧是微軟...

不過他沒有預付的圖形化管理界面,要就要另外用client連，所以有的會加裝`Adminer`

這樣就可以做簡單的管理

# 廢棄原因

* 本來家裡就沒用這玩意,都用免錢的SQL
