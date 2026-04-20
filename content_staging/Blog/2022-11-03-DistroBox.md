---
title: DistroBox
date: 2022-11-03
tags:
  - Linux
  - Life
  - Old-Blog
slug: 2022/11/distrobox
description: 這玩意真屌
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

這個很厲害的東西我也是從youtube學來的原影片的連結如下

[![Debian Stable: Fresh Kernel and the AUR! - YouTube](http://img.youtube.com/vi/p9AdhNgR69k/0.jpg)](https://www.youtube.com/watch?v=p9AdhNgR69k "利用Distrobox在Debian內跑Archlinux & AUR")

<!--truncate-->

# 基本概念

## DistroBox

專案網址 - [GitHub - 89luca89/distrobox](https://github.com/89luca89/distrobox)

介紹網頁 - [Distrobox: Try Multiple Linux Distributions via the Terminal](https://itsfoss.com/distrobox/)

其實講穿了這個就是利用docker or padman把其他Linux distrobution跑起來後export裡面的東西到外面來跑

# 實際操作

我個人有在`Fedora 36 KDE Plasma Edition`上面跑過（可惜我沒截圖就把整個VM砍了）

跑雖然可以跑但是有一些問題

## DE & WM

基本上就是外面的用什麼你裡面的就是跑什麼，所以...當我外面是`wayland`裡面的ulauncher就變得怪怪的...

## Kernel

都說了是使用`docker`/`podman`的基礎了...Kernel還能不一樣嗎？？

## 相關指令

講了這麼多，其實很有可能是我還沒摸熟它該怎麼用最好，光是你export出來的程式可以吃外部的設定檔就很好了，實際上我不知道為什麼那台有放我的Brave設定但是沒裝Brave，結果裡面的Brave一跑起來居然是套用外面的設定檔...真棒！（不過ulauncher卻死的不能再死了）

基本指令如下

| Out/In distrobox | command                                               | usage                                                  | Example                                    | Manual Link                                                                                          |
| ---------------- |:-----------------------------------------------------:| ------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| outside          | distrobox create -n name -i Docker image              | Create a distrobox container                           | distrobox create -n Archlinux -i Archlinux | [Distrobox-create](https://github.com/89luca89/distrobox/blob/main/docs/usage/distrobox-create.md)   |
| outside          | distrobox enter <Name>                                | into named container                                   | distrobox enter Archlinux                  | [Distrobox-enter](https://github.com/89luca89/distrobox/blob/main/docs/usage/distrobox-enter.md)     |
| outside          | distrobox list                                        | list all containers                                    | distrobox list                             | [Distrobox-llist](https://github.com/89luca89/distrobox/blob/main/docs/usage/distrobox-list.md)      |
| outside          | distrobox rm <Name>                                   | delete container                                       | distrobox rm Archlinux                     | [Distrobox-rm](https://github.com/89luca89/distrobox/blob/main/docs/usage/distrobox-rm.md)           |
| Outside          | distrobox upgrade <Name>                              | upgrade conatiner                                      | distrobox upgrade Archlinux                | [Distrobox-upgrade](https://github.com/89luca89/distrobox/blob/main/docs/usage/distrobox-upgrade.md) |
| Inside           | distrobox-export -a <App Name>  -ep <path to outside> | export apps install inside container to outside to use | distrobox-export -a Brave -ep ~/.local/bin | [Distrobox-export](https://github.com/89luca89/distrobox/blob/main/docs/usage/distrobox-export.md)   |

## 額外的重點

我所有的例子都是用`distrobox`建立一個`Archlinux` container然後狂用`AUR`主要的理由還是因為，沒有必要在Arch系上面另外跑`Fedora`或是`Debian/Ubuntu`(因為除了可能會升級到掛掉以外Arch系的程式安裝根本是掃台...)

不過這裡就有一個很囧的-與其說我已經是`Archlinux`的形狀還不如說我是`Manjaro`的形狀...不過無奈`manjaro`不爭氣..他的offical docker image很鳥...遠不如Archlinux...

# 未來可能的最佳解

最近有試著使用`Fedora`看起來的確會是個很棒的Base OS搭配上可以安裝AUR的話根本就是無敵（若是事情有我這個傻子想的這麼單純的話當然是這樣）不過就他的桌面風格跟可以調整的內容來看...我可能還有很長的一段時間還會維持`Manjaro`的形狀....