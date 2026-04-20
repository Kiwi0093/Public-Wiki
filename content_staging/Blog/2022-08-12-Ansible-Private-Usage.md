---
title: Ansible Private Usage
date: 2022-08-12
tags:
  - Linux
  - Life
  - Old-Blog
slug: 2022/08/ansible+private+usage
description: 私人用途
---

>  :::info 
> 本文轉載自舊站存檔。
> :::


# 前言

 玩了幾天的Ansible後針對私人使用用途有一點感想   

<!--truncate-->

# 概念

## About Ansible

老實說，Ansible真的是個很強大的工具，而且還有眾多的社群在後面默默的付出，以便在`Github`上有許多可以參考借鑒的`playbook`

能順利的進行方案測試真的要感謝以下兩個參考資料

* Ansible 教學系列影片 by Learn Linux TV
  [![Getting started with Ansible 01 - Introduction - YouTube](http://img.youtube.com/vi/3RiVKs8GHYQ/sddefault.jpg)](https://www.youtube.com/watch?v=3RiVKs8GHYQ&list=PLT98CRl2KxKEUHie1m24-wkyHpEsa4Y70)
  這個系列其實講得很詳細，對Ansible有興趣的人應該要先看完

* [GitHub - PauloPortugal/manjaro-playbook: Manjaro/Arch Linux Ansible provision playbook](https://github.com/PauloPortugal/manjaro-playbook)
  
  因為我主要的Desktop是`Manjaro`所以這個Repo對我來說很有幫助

## Ansible的限制

雖然說Ansible功能強大看起來什麼都好棒棒，但是仍有以下這些限制(對我來說)

* 運作期間沒有手動輸入的功能，所有的東西都先預先寫好，若使用公開的Git Server如`Github`可能會擔心安全性的問題

* 行為差異由Host Vars定義，非重複的行為由獨立的playbook section控制，跟上面那點合併的感覺就不太好用在初次安裝期間的Server設定

* 透過SSH account控制，同上若是剛裝好的機器沒有帳號與對應的ssh key就沒辦法馬上用

## Kiwi流用法

* 一般安裝透過`shell script`進行，保留可手動輸入等相關選項讓script泛用性提高

* 搭配Script，Ansible主要用於重複性高，同質性高的行為控制，例如同步更新所有的Server，透過Ansible對所有Server的設定檔案進行版本控制（因為Ansible基本上會搭配Git server使用

* 透過Ansible自動完成需要複雜設定的使用環境，例如複數Desktop，或是重裝Desktop的時候可以簡化作業（這點雖然也是跟script功能一樣，但是Script比較難單獨針對設定檔做版本管控）

# 作法

其實現在正在進行中的東西仔細看看，除了不在內部的機器`ansible`可以派上用場以外，其他的幾乎都是靠內部`Git server`+`shell script`就可以搞定的東西（某程度上原來想要的`rsync`+`shell script`也是可以滿足的啦....）