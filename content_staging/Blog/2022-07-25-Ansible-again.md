---
title: Ansible - again
date: 2022-07-25
tags:
  - Linux
  - Life
  - Old-Blog
slug: 2022/07/Ansible+again
description: 永不放棄的ansible
image:
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

最近我<ruby><font  color="blue"><del>好學不倦</del></font><rp>(</rp><rt><font  color="red">閒的蛋疼</font></rt><rp>)</rp></ruby>所以又把之前碰了一下就放棄的Ansible撿回來再念一下


<!--truncate-->

# 簡介

如同[我的Wiki](https://kiwi0093.github.io/wiki/wiki/Network/Ansible/Install%20&%20Configuration/1-Intro/)裡面寫的, 這是RedHat的一個好用Server管理程式，透過Python+ssh可以在client端執行management node端的playbook或是指令來對client進行控制與管理，最大的優點是他有很多module可以來確認client的狀態(例如某個package是否有安裝之類的)以達到對於client端的組態管理成果

## 限制

* 基本上要順順的連線就要搭配不須另外Key密碼的SSH private key來進行連線

* 執行的速度沒有直接跑script快

* 沒有大量重複性設定的前提下不會比汎用型的shell script快/好用

## 大致結構

基本上就是利用`inventory`來管理連線的對象，用`動作定義.yml`來定義自動化的動作

這個`動作定義.yml`可以是最上層的playbook, 也可以是roles內的主要tasks, 也可以是tasks裡面被`inculde_tasks`帶進的其他`動作定義.yml`, 所以在編寫的時候可以一塊一塊的先寫出獨立的object,然後在用上層的playbook全部串起來搭配變數做判斷式最終達到通用的server管理框架（這時候就可以回到inventory去定義不同的群組做不同的事情）

# 結論...

寫到一半,我發現要設定server還是用script跑比較輕鬆愉快，要修改也容易，不過要狀態管理的話這個比script方便多了....