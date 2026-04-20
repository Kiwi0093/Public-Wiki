---
title: Change to Archlinux
date: 2023-07-18
tags:
  - Linux
  - Old-Blog
slug: 2023/07/change+archlinux
description: 皈依Archlinux
---

>  :::info 
> 本文轉載自舊站存檔。
> :::


# 前言

由於`Archinstall`的驚豔,我正在考慮從`Manjaro`轉向`Archllinux`這一切就先從
我的`WSL`及`VirtualBox`裡的VM開始吧...

<!--truncate-->

# ArchWSL

## Github Project

* Link - [GitHub - yuk7/ArchWSL](https://github.com/yuk7/ArchWSL)

* Online Manual - [How to Setup | ArchWSL official documentation](https://wsldl-pg.github.io/ArchW-docs/How-to-Setup/)

## 注意事項

* 需要先初始化`archlinux-keyring``以免會有問題
  
  ```bash
  [root@wsl]$ pacman-key --init
  [root@wsl]$ pacman-key --populate
  [root@wsl]$ pacman -Sy archlinux-keyring
  [root@wsl]$ pacman -Syyu
  ```

* 需要建立一般User的帳號(不然一些GUI會有問題)
  
  ```bash
  # 定義wheel群組的User都可以sudo
  [root@wsl]$ echo "%wheel ALL=(ALL) ALL" > /etc/sudoers.d/wheel
  # 建立一個{username}帳號,並且屬於wheel群組
  [root@wsl]$ useradd -m -G wheel -s /bin/bash {username}
  ```

* 需要設定預設的user為{username},這個操作得在WSL外面
  
  ```bash
  [User@Windows]$ Arch.exe config --default-user {username}
  ```

# Archlinux Guest in Virtualbox

## Install

基本上就是使用ISO開機,然後使用`archinstall`選好後直接安裝就好了,實際安裝確認過,需要desktop的可以直接選他的`desktop profile`,就我直接選`KDE`的結果來看

* 它預設`Xorg` & `Wayland`都會裝上,可以在`SDDM`登入時選擇
  
  * 基本上現在`Wayland`的支援還沒很好,連`ArchWiki`都建議先用`Xorg`

## 必須packages

建議必裝的package如下

| Pkg Name               | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| git                    | 除了一般Git使用以外,在安裝上`yay`之前`AUR`的package安裝也要靠它（包括安裝`yay`)           |
| base-devel             | 這個其實是一個package的集合,主要是一些compiler跟相關工具,需要自己compile package的人需要安裝  |
| virtualbox-guest-utils | 這個是VirtualBox的guest端工具包括特殊的driver之類的等同於VMware tools             |
| yay                    | 有在用Arch base的人都知道這是什麼, Manjaro可以直接用pacman安裝,但是Arch內只能用下面附上的方式安裝 |

### yay安裝方式(under Archlinux)

```bash
# 不能用root
[user@archlinux]$ git clone https://aur.archlinux.org/yay-git.git
[user@archlinux]$ cd yay-git
[user@archlinux]$ makepkg -si
```

## 注意事項

* systemd服務要手動啟動
  
  * systemd-resolved.service
    
    * 這是systemd版的resolvconf,主要是`wireguard`需要使用
    
    * `systemctl enable --now systemd-resolved.service`
  
  * vboxservice.service
    
    * 這是自動載入virtualbox-guest-utils裡的元件
    
    * `systemctl enable --now vboxservice.service`

# 結論

就目前來看,只要copy了`Manjaro`（或是其他喜歡的Distro)的一些美化設定(例如zsh-theme-powerlevel10k的設定),整個`Archlinux`就不會看起來不夠漂亮.

安裝上也變得很輕鬆.使用上就是Arch base沒什麼不同(跟Manjaro比起來)

大概要再觀察一段時間才會有比較明顯的好壞比較