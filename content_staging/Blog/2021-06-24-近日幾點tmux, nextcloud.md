---
title: 近日幾點tmux, nextcloud
date: 2021-06-24
tags: [Life, Old-Blog, Linux, Server]
slug: 2021/06/tmux+nextcloud
description: 一個薪水小偷趁著WFH的休閒活動
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# WFH = \ = WTF

最近都在Work From Home,於是可以花一點時間假借工作之名,實則弄一點有意思的玩具

所以我把家裡的Server進一步的整理過一遍(之前是應急恢復,現在是以擴充之名行娛樂之實)

<!--truncate-->

## Tmux

老實說這是我在看Youtube的時候發現這玩意的(你看多廢,還得逛Youtube才知道有tmux).

現在就已經成為我的標準配備(用來取代screen)

這玩意支援powerline,但是蠻雞肋的在X環境下powerline才有用(至少我還沒找到console下powerline可以正確顯示相關字體的方法)

不過講是這樣講,功能還是比screen稍微強一些,所以我就開始過度到tmux去了

## Nextcloud

這個就有點冷飯新炒...之前還在蘇州的時候其實就玩過了,但是其實當時不是很好用(老實說現在也沒好用到哪去...)

不過這次倒是對於Nextcloud-Apps感到有趣

#### Nextcloud Music

這個App的基本功能就是在網頁下可以直接撥放Nextcloud folder裡的音樂,並且同時在建立成媒體庫後可以串流出去

搭配subsonic系列的apps(如[Ultrasonic](https://play.google.com/store/apps/details?id=org.moire.ultrasonic&hl=zh_TW&gl=US))就可以串流撥放,還支援封面等功能算是一個不用emby也可以使用的媒體Server

(不過要是只剩下這個功能有用,那我可能還是會去找其他的串流server來使用)

#### Nextcloud Deck

這就是一個Deck程式,說真的是沒有什麼google的替代方案所以我才用的(其實我是想要有免費的Milanote可以用...)

## Docker

這個也是不陌生的東西,但是老實說我一直沒有花時間去好好用過Docker,因為我都是用VMware ESXi直接架VM來用,很少會一台機器上跑好幾個docker的形式處理

但是現在docker也越來越方便,很多東西都可以直接弄個Image跑起來就好,省的安裝跟設定

#### [Webtop](https://docs.linuxserver.io/images/docker-webtop)

老實說這是一個看起來很炫,聽起來很炫,但是真的要用我還真找不到用途的東西....

簡單的說就是用Browser就可以遠端跑DE的東西,目前支援Alpine/Ubuntu的Xfce/KDE/mate/iceWM/i3/Openbox(沒有我喜歡的Manjaro..=-=!!)

聽起來好像還不錯對吧,但是你都有Browser可以用代表你在GUI環境,然後要開另一個DE來使用...除了架好給公司電腦什麼都鎖死的機器可以利用browser逃出去

享受自由空氣以外,我還真沒想到能幹嘛



# 結語

其實就是在家工作很無聊,既不能玩遊戲,又不能專心工作,所以就會無聊到去找其他可以打斷的東西來試試