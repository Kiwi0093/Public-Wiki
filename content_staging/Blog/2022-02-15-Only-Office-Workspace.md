---
title: Only Office Workspace
date: 2022-02-15
tags:
  - Linux
  - Server
  - Container
  - Old-Blog
slug: 2022/02/only+office
description: open office
image:
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

延續先前G-suite的問題..今天把手伸向了Only Office

<!--truncate-->


# 開端

其實也不完全是因為G-suite,主要還是在想說未來家中的服務是否還需要再整合提昇，所以就試裝only office workspace來試試看，沒想到還挺麻煩的

# OnlyOffice Workspace

## 簡介

其實就是一個免費版的Office365，Workspace包含了

* Mail
  
  * Web Client
  
  * SMTP server
  
  * Customize Domain

* Document
  
  * Word
  
  * Excel
  
  * Powerpoint 

* Project
  
  * Task
  
  * Gantt chart

* CRM

* People

* Calander

## Docker-compose

不出意外，這個也是用docker—compose來進行安裝，細節的部份老規矩放到wiki上面去

但是這個安裝上有著很大的漏洞

不像其他的docker安裝，他的sql初始化指令跟mysql的設定都沒塞在image裡面得事先手動加上，因為如此所以一開始的時候問題多多

## Server Resource

雖然他一開始就寫了但是我還是很白目的一開始在我那資源很少的Oracle Cloud上試跑，然後下場就是完全用光系統資源然後還是跑步起來....後來只能靠著重開初期勉強還能操作的時候硬把Container砍了...然後才恢復正常...

後來在家裡的機器上跑看起來的確吃了不少資源（不過原始我就因為追劇套餐得消耗不少系統資源了（大概佔60％的RAM用量）但是還在可以運作的範圍內

## 殘留課題

* Document無法開啟
  
  這個看網路上的說法是因為Traefik V2沒有設好middlewares造成的

* Traefik Middleware不會設定
  
  好啦....這個搭配上述的就等於是目前我搞不定啦～～

* 沒有繁體中文界面
  
  這個也無解

# 結論

就結果來看目前還蠻令人興奮的，不過話又說回來在Office跟Google Doc都還有免費的可以使用的情況下..似乎除了自己Domain的Mail Address, Project,以及可以直接download文件以外似乎沒什麼誘因一定要克服萬難去把它裝上.....
