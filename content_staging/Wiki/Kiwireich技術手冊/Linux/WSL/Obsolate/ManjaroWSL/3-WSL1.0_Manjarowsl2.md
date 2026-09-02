---
title: Manjarowsl2 in WSL1
tags:
  - Linunx
  - Windows
  - Manjaro
  - WSL
---
> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Manjaro](https://img.shields.io/badge/Manjaro-Supported-green?style=plastic&logo=manjaro)

:::tip
現在最新的作法是完全透過MS store安裝WSL2+ArchWSL, 然後就好了
:::

>:::info
>我其實算是一個`Manjaro`中毒患者...以至於用WSL我也要用Manjaro
>:::

# Manjarowsl2

[GitHub - sileshn/ManjaroWSL2: Manjaro for WSL2 using wsldl](https://github.com/sileshn/ManjaroWSL2)

這個專案基本上跟上一版一樣都是利用[wsldl: Advanced WSL launcher ](https://github.com/yuk7/wsldl)達成的作法,有興趣自己打造的人也可以用`wsldl`自己來

## Install

只要把下載的檔案解壓縮在你喜歡的位置然後執行解開的`Manjaro.exe`順著按完就好了

## 基本設定

```bash
# make sure you're root
# Set your mirrorlist to what you like
pacman-mirrors -c tw
# system full update
pacman -Syyuu
# Install basic tools
pacman -S yay neovim zsh noto-fonts-cjk .......etc 
# completed
```

看到上面的內容會不會覺得很傻眼? 畢竟看起來就跟一般的`Manjaro`設定一模一樣..

沒錯基本上就是一樣(就是這樣才棒)

但是跟之前的版本說明比較起來有一些不同

* 不需要安裝DE也可以正常跑GUI apps

例如`pacman -S brave-browser`就會直接裝上Brave, 然後神奇的是什麼都不用作也會自動在Windows產生捷徑

![](https://raw.githubusercontent.com/Kiwi0093/graph/master/img/start_manu_wsl.png)

可以看到我安裝的東西都會自動產生這樣的捷徑

這樣就可以直接在windows中啟動了不需要開啟`wslg`

## 注意要點

因為WSL畢竟還是一種VM(尤其是WSL2)所以雖然可以直接執行Linux GUI apps, 但是Windows的非英文輸入法是沒辦法直接輸入到Linux GUI apps裡面,所以才會需要安裝fcitx及其相關的輸入方式,例如chewing之類的

### 中文輸入法

```bash
# /etc/profile 內加入以下
# Add Chinese Input Support
export GTK_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
export QT_IM_MODULE=fcitx
export DefaultIMModule=fcitx
fcitx-autostart &>/dev/null
```

然後在`powershell`中`wsl --shutdown`把wsl關了後再`wsl`打開

記得設定global hot key以便啟動(因為我們沒裝DE所以沒辦法滑鼠點切換輸入法)

### 緩慢的I/O

本來想說I/O的部份會很有改善,不過我實際測試在`Windows`下的folder進行git clone, git push, 還有hexo g -d之類常用的指令就可以明顯的看到這個I/O不行呀....

# 結論

雖然說WSL1.0支援systemd而且GUI app不需要wslg就可以正常的使用是很香,但是可以看到還是有些需要打磨的地方, 例如中文輸入法有時候還是會發春, I/O還是慢...etc

不過作為輕度使用(甚至中度使用)都還算是順手