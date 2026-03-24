---
title: 整理Arch linux自動安裝的囉唆抱怨
date: 2020-12-03
tags:
  - Linux
  - Life
  - Archive
  - Old-Blog
slug: 2020/12/archlinux+auto+install
description: 在還沒有archinstall前的個人掙扎與碎碎念
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

雖然Wiki裡面寫了一堆Archlinux自動安裝用的script,不過昨天才開始*本格的*進行驗證跟補充,然後就很想把自己打死...

{/* 這裡插入切分線 */}
<!--truncate-->

## 前言

首先這一篇不是什麼技術補充的Blog,而是一篇純粹抱怨的**_深宮怨婦文章_**, 若是希望在這裡尋得什麼有價值的資料的捧油麻煩左轉去[Wiki](https://kiwi0093.github.io/Wiki-site/wiki/Linux/Arch%20Linux%20&%20Manjaro/Archlinux%20Gateway%E8%87%AA%E5%8B%95%E5%AE%89%E8%A3%9D/1-Arch_linux_Gateway_installation/)可能對你才有幫助

## 以下全是抱怨

* https://raw.githubusercontent.com被牆

  真的很想罵人...把東西放在Gitub上就是想說~~牆國~~天朝不會對github下手,所以東西放在上面使用很方便,結果...天朝還是來了一記DNS污染..真的很OOXX

* pacstrap /mnt base沒有安裝kernel

  看著新的[Archlinux installation Guide](https://wiki.archlinux.org/index.php/installation_guide)裡面說不需要跑mkinitpico這是實話,~~但是沒說跑pacstrap的時候不會順手裝上kernel package,所以當然不會跑mkinitpico,然後grub-mkconfig當然也就不會建立選單...~~然後開機就變成一個悲劇....

  更正:好吧是我自己白目,最新版的Installation Guide裡面是要求

  ```bash
  pacstrap /mnt base linux linux-firmware
  ```

  這個算是自己白目..但是還是罵一下...

* netctl變成另外裝的

  其實我也忘記之前是不是另外裝,原來預設的網路界面設定說明是用netctl的,現在變成用ip指令,不過還是可以以package安裝後拿來使用

* pacman-mirrors居然不是arch linux的package

  因為我Linux Desktop喜歡用Manjaro,而Manjaro幾乎跟archlinux一模一樣(好啦其實除了Logo還是有些差別啦),不過沒想到繼yay之後還有package是archlinux裡面沒有的...這樣在安裝的時候就只能用sed指令去篩選出mirrorlist裡面想要的location..後面研究一下AUR可不可以安裝好了...

  追申:查過Arch的AUR,裡面沒有pacman-mirrors...（哭哭）

## 抱怨之後

雖說我喜歡Arch,但是仔細想想,其實我喜歡的是Manjaro....

Arch linux大概只有在Server端或是Gateway上我才會使用...不過似乎也可以使用Manjaro直接裝沒有GUI的版本來使用...

不過我個人比較龜毛,對於Server跟Desktop的要求不太一樣,Server還是盡量簡潔乾淨最好,而Desktop還是方便為主只要還是在Arch系內就好...