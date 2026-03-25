---
title: Unifi Controller又又又因為AUR的Mongodb升級爆掉啦～～～
date: 2025-12-10
tags: [Linux, Network, Old-Blog]
slug: 2025/12/unifi-failure
description: 跟unifi controller升級搏鬥的事蹟
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

最近稍微勤勞的對系統更新一下...然後我的Unifi Controller就在我一記`yay -Syu --noconfirm`下爆炸了

<!--truncate-->

# 事故紀錄

一發`yay -Syu --noconfirm`然後一路跑完後..Unifi Controller的Web UI就連不上了
開始查,發現

* `systemctl status unifi.service`結果是active ok的但是`netstat -an`中沒有Unifi Controller的listen port

* 確認`/var/log/unifi/server.log`裡確認exit code=62

* `systemctl status mongodb.service`裡發現也是exit code=62,查詢後發現是mongodb的版本舊無法正常啟動

* 查詢`/var/log/mongodb/mongodb.log`確認mongodb的版本是7.0,同時確認AUR內更新的`mongodb-bin`內的版本是8.2,差異過大所以起不來

* 改裝`mongodb80-bin`的package後用指令可以把mongodb的主要版本更新到8.0

繞路造成不爽的區塊

* Mongodb的資料庫升級概念
  
  * Mongodb不能一次跳到後面很多的版本來進行資料庫升級(對Mongodb的執行檔跟資料庫版本不是連動的,他是分開的要手動去更新)
  
  * 從7.0要到8.2得要先7.0 --> 8.0 --> 8.2通成新一版可以相容前一版的資料庫,但是沒辦法新版資料庫相容舊版bin

* 爆炸的繞路經歷
  
  * 先是移除`unifi`以及`mongodb-bin`這兩個package,然後換裝`mongodb80-bin`然後把admin資料庫升級,從7.0 --> 8.0 -->8.2
  
  * 然後又移除`mongodb80-bin`然後改裝上`mongodb-bin`跟`unifi`然後`systemctl status mongodb.service`看起來正常,但是`systemctl status unifi.service`看起來也是正常,但是Unifi Controller還是沒起
    
    來,查詢`/var/log/unifi/server.log`還是exit code=62
  
  * 看來看去還是沒看到如何可以升級unifi的mongodb資料庫（這裡應該是大叔的技能沒點到該點的...所以這裡傻的跟智障一樣）
  
  * 然後就卡在主mongodb admin database 升級OK,但是unifi的mongodb資料庫沒辦法升級....
  
  * 最後去查詢unifi的PKGBUILD檔案,發現... dependence只要是mongodb就好....
  
  * 最終採用`mongodb80-bin`+`unifi`這兩個package就因為可以相容7.0的資料庫然後就神奇的好了.....
  
  
# 幾個技術學習點

這個事件最主要的就是學習兩件事情
* Mongodb的概念與升級-還需要再看看怎麼把admin以外的Mongodb資料庫也升級（其實我是連列出資料庫都列不出來）
* Unifi要看一下以後怎麼升級不容易暴雷,之前有試著用docker來跑不過後來因為網路問題沒有採用這個可能需要再挖出來看看
