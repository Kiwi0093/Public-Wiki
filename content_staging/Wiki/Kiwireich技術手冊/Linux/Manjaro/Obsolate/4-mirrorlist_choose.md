---
title: 選擇Mirrorlist
tags:
  - Linux
  - Manjaro
---

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Manjaro](https://img.shields.io/badge/Manjaro-Supported-green?style=plastic&logo=manjaro)

:::tip
這個系列現在已經不適用了,只是留個紀念
:::
##### 參考網頁

[FOSS Linux](https://www.fosslinux.com/4252/how-to-find-mirror-list-and-set-fastest-download-server-on-manjaro.htm)

<!--more-->

##### By Country選擇

```Bash
sudo pacman-mirrors --country <County Name>
```

這個指令會依照選定的Country的server列表進行速度確認建立mirror-list

##### By 速度選擇

```Bash
sudo pacman-mirrors --fasttrack <數量>
```

