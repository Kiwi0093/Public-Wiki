---
title: Phoenix OS
date: 2020-12-14
tags:
  - Android
  - Archive
  - Old-Blog
slug: 2020/12/phoenix+os
description: 一款中國國產的android x86
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

同是有台ASUS T100想改裝成Android給小朋友玩..

看了看可能還是中國國產的Phoenix OS(其實就是客製的Android X86)比較適合他的需求...

<!--truncate-->

## ASUS T100

這是一台ASUS早期的二合一小筆電,規格非常的陽春,算是Windows7轉Windows8.1各家廠商都把CPU & RAM下降規格降價的時期產品

 [詳細Spec](https://www.asus.com/us/2-in-1-PCs/ASUS_Transformer_Book_T100_Chi/specifications/)

- Intel® Bay Trail-T Quad Core Z3775 1.46 GHz ~ 2.39 GHz Processor

- Memory

  OnBoard Memory 2 GB

- Display

  10.1" 16:10 Full HD (1920x1200) LED Backlight Touchscreen LCD Panel

- Graphic

  Integrated Intel® HD Graphics

- Storage

  32GB eMMC
  64GB eMMC

- Card Reader

  card reader (Micro SD )

- Camera

  Front 2 MP and Rear 5 MP

- Networking

  Dual-band 802.11 a/b/g/n
  Built-in Bluetooth™ V4.0+HS

- Interface

  1 x COMBO audio jack
  1 x Micro USB
  1 x micro HDMI
  1 x micro SDXC card reader
  1 x Volume up/down

- Audio

  Built-in Speakers And Array Microphone

- Battery

  31 Whrs

- Dimensions

  Tablet:
  10.1 x 6.9 x 0.3 inch (WxDxH)

- Weight

  Tablet:
  1.3 lbs (with Polymer Battery)

---

## [Phoenix OS](http://www.phoenixos.com/)

這是一個基於[Android X86](https://www.android-x86.org/)中國客製化的Android系統

特點是針對PC環境做了UI調整,加上有線網路連線的功能,並且預設的安裝方式中就有用exe檔直接裝在Windows下做成雙系統開機



## 結論

#### Day 1 

* 在ASUS T100上就算讓他強制USB開機,也只會停在

  ```bash
  grub>
  ```

  這時候需要手動keyin才能boot

  ```bash
  configfile /efi/boot/grub.cfg
  ```

* 若選擇安裝,進入HDD選擇畫面鍵盤就失效了..所以無法下一步
* 若改採用exe在WIndows界面下安裝,不管怎麼裝都會出現安裝失敗...

#### Day2

搞了一天才發現,其實是T100非常神奇的是32bit UFEI開機的奇妙舊時代產物...

為了這個,我只好重新去download並做了一個Windows 10 32bit版的安裝USB來重裝那個被我搞壞掉的系統

然後去下載32bit的PhoeinxOS(基於Android5的版本)

重新安裝好Windows 10然後跑exe安裝,接著在開機的時候按`esc`進入選單選Phoenix OS就可以開機進入新裝好的Phoenix OS了

什麼？你說可不可以用x86版的Iso整個裝Phoenix OS就好？

我也想,但是該死的鍵盤還是不會動呀～～～～




