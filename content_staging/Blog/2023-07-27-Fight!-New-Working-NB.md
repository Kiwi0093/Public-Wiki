---
title: Fight! New Working NB
date: 2023-07-27
tags:
  - Life
  - Linux
  - Old-Blog
slug: 2023/07/new+working+nb
description: 新的玩具,而且是公司出錢的
image:
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

由於<ruby><font color="lightblue"><del>不知名原因</del></font><rp>(</rp><rt><font color="red">高達八成是我家小孩幹的</font></rt><rp>)</rp></ruby>我的公司配給NB的螢幕整個死透
讓我過了一段只能外接的日子...

在敝司<ruby><font color="lightblue"><del>狼狽為奸</del></font><rp>(</rp><rt><font color="red">心地善良</font></rt><rp>)</rp></ruby>的IT大大的協助下,我又換了一台NB..

想當然爾,我就得來<ruby><font color="lightblue"><del>Fine Tune</del></font><rp>(</rp><rt><font color="red">違法改造</font></rt><rp>)</rp></ruby>..

<!--truncate-->

# 機器介紹

這次算是我運氣好,更換的這批不僅不是<ruby><font color="lightblue"><del>Lenovo</del></font><rp>(</rp><rt><font color="red">萬惡的阿共牌</font></rt><rp>)</rp></ruby>還是原來預計要給ME的機器,所以給了我一台`Dell Precision 3561`

我算是因禍得福整個Spec UP
CPU from 11th gen i5 to 11 gen i7(好啦我知道都是好幾個世代前的cpu了)
RAM from 16GB to 32GB(這個就真的有差..畢竟我喜歡跑一堆亂七八糟的)
GPU from Intel Iris@Xe to Nvidia T600 Laptop(好啦有快一些)

# 機器整理

基本上這台機器還是公司的NB所以不能亂改的太嚴重,(不過好心的IT還是有給我Admin的權限可以先做Tuning)

## Basic

因為是公司的機器所以基本上就是`Windows 11 pro`
所以拿到的時候是已經預裝了公司工作用的軟體(什麼？你說我的工作不是只要一個Browser就可以了？怎麼可能,我還是會需要用到Office的唷),所以我就只需要用`Winget`裝一下以下幾個

* Open-shell - 好啦這個其實不是最重要的,單純只是我不喜歡`Win10`後的選單所以才裝的

* VirtualBox - 這個其實是核心之一,有vbox就可以很大程度上做自己了

* WSL - 這個其實也很重要不過這次有些問題

## VitrualBox

其實這個很單純就是VM內再裝個Archlinux而已...

## WSL

### 困境

這台Windows很奇怪,我其實是沒辦法從任何地方安裝新版的WSL...都會跑出 `error code  0x80070490`
用`wsl --update`則是會跟我說找不到元素....
代價就是..WSL Distro沒辦法正常使用`systemd`(這個很傻眼,因為Windows11的其中一個賣點就是新版的WSL有內建`systemd`的功能)

### 對策與結果

我基本上是改用[ArchWSL2 from Sileshn](https://github.com/sileshn/ArchWSL2)因為這個版本有持續再更新...
至於systemd問題,其實我真的需要WSL內的systemd只是為了`systemd-resolved.service` for `Wireguard`所以只要把`resolvconf`裝成`oopenresolv`就好了

### 小發現

我很愛`Manjaro KDE`預設改好的zsh theme,之前我都是直接copy `/usr/share/zsh/`下的customize檔來用,直到最近我發現`AUR`內其實也有`manjaro-zsh-config`,裝上後只要確定`~/.zshrc`內容正確就可以了,唯一的小缺點就是他的console顏色是`Manjaro綠`而不是`Arch藍`

# 結論與後續方針

結論？老實講就這樣,東西弄好就乖乖上班....
後續的方針就是看看怎麼能再擠出一些`GPU`效能給WSL或是VM囉...