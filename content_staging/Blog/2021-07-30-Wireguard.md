---
title: Wireguard
date: 2021-07-30
tags: [VPN, Server, Old-Blog, Linux]
slug: 2021/07/wireguard
description: 搭建第一個wireguard
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

雖然離開中國後就不需要<ruby>科學上網<rt style="color:orange">翻牆 aka 梯子</rt></ruby>但是畢竟家裡一堆服務還是掛在NAT後面, 所以弄個VPN來連家裡面也是很正常的

<!--truncate-->

# WireGuard

是的,我沒有挑我在中國熟到爛掉的V2ray,而採用Linux Kernel直接support的WIreGuard,原因如下

* 不在中國境內不需要使用偽裝連線
* WireGuard目前是Linux Kernel直接支援
* 設定上Wireguard比較簡單（這點嘛..懂了之後的確是啦）

不過由於這個通訊協定是明確告訴人家我是VPN,所以很自然就算在台灣用得再順,也沒辦法拿來當梯子用

想要使用梯子還是乖乖的用V2ray之類有偽裝的會比較好

# 架設方式

一如往常,我還是把詳細的技術細節放在[Wiki](https://kiwi0093.github.io/Wiki-site/)上面,自己上去看

# 雜談

## Wireguard-Manager

我最開始試跑的是帶有Web-UI的Wireguard Manager,使用docker是無痛架起來了,但是...他不會動...（是的,我弄了一個下午界面看起來很漂亮但是最重要的機能卻不會動...)

## Wireuard

後來我死心了就直接用wireguard,不過不得不說本來以為很麻煩的但是實際用起來發現linuxserver.io提供的image還真的很好用,一開始docker-compose.yml裡面寫了要多少peer就直接建好多少peer,絲毫不拖泥帶水真的是棒,追加peer到docker-compose.yml也會自動追加

## Linux Client

老實說Android的設定很簡單甚至只要刷一下QR code就好了,但是Linux的設定就相對麻煩,所有的參數都要一致才會動



