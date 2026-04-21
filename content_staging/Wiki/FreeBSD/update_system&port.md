---
title: System & Packages Update
tags:
  - FreeBSD
slug: FreeBSD
date: 2026-04-21
description: FreeBSD的系統/安裝包升級方法
---



><img src='https://img.shields.io/badge/Status-Active-A8FF24? style="for-the-badge&labelW"  idth="100"' height='38' />
>

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd)


<!--truncate-->


### FreeBSD指令,用來update system, port, and packages

<img src='https://img.shields.io/badge/Kiwi-%E4%B8%8D%E9%81%8E%E5%9B%A0%E7%82%BAFreeBSD%E5%BE%88%E7%A9%A9%E5%AE%9A%2C%E6%89%80%E4%BB%A5%E5%B8%B8%E5%B8%B8%E5%BF%98%E8%A8%98%E6%9B%B4%E6%96%B0%E4%BB%96-A8FF24? style="social&logo=kiwix&logoColor=EA7500"' height='40' />


<!--truncate-->

# 基本概念

與`Linux`一個package manager可以更新整個系統與packages不同,FreeBSD更新系統與Package使用不同的指令
### Linux的作法

```bash
# Debian/Ubuntu
apt update && apt upgrade
# Arch
pacman -Syu
```

一個指令搞定全世界

# FreeBSD 系統更新

## 更新系統

```bash
# 現有版本更新patch
freebsd-update fetch && freebsd-update install
# 更新到x.y-Release版
freebsd-update upgrade -r x.y-RELEASE && freebsd-update install
```

## 更新Package - pkg

其實不需要自己compile的話用`pkg`比較方便

<img src='https://img.shields.io/badge/Kiwi-%E7%B0%A1%E5%96%AE%E7%9A%84%E8%AA%AA%E5%B0%B1%E6%98%AF%E6%87%B6%E7%9A%84%E7%AD%89port%20make%20install-A8FF24? style="social&logo=kiwix&logoColor=EA7500"' height='40' />

```bash
# Install
pkg install <pkg_name>

# Remove
pkg delete <pkg_name>

# Autoremove
pkg autoremove

# Check pkgs version
pkg version

# 更新repo
pkg update

# 更新pkg
pkg upgrade
```


## Port更新

以前FreeBSD大多數都是用port自己compile所需的package, 但是到了現在,除了需要特殊compile參數的條件以外,基本上都用`pkg`來安裝

<img src='https://img.shields.io/badge/Kiwi-%E5%87%BA%E4%BE%86%E8%B7%91%E7%B8%BD%E6%98%AF%E8%A6%81%E9%82%84%E5%BE%97%2C%E9%81%87%E5%88%B0%E9%9C%80%E8%A6%81%E7%89%B9%E6%AE%8A%E5%8F%83%E6%95%B8%E7%9A%84%2C%E9%82%84%E6%98%AF%E5%BE%97%E4%B9%96%E4%B9%96%E7%9A%84make%20install-A8FF24? style="social&logo=kiwix&logoColor=EA7500"' height='40' />

### Port Tree更新

```bash
cd /usr/ports
# 第一次使用
portsnap fetch && portsnap extract && portsnap update
# 之後使用
portsnap fetch && portsnap update
```

### Port Software更新

```bash
portmaster -a
```


# 結論與雜談

現在我都用通用的參數,所以失去了使用`port`的必要性, 都只用`pkg`,不知道是不是因為過去好幾年我都在使用企鵝,技能點都沒繼續點FreeBSD系列,所以使用習慣也被企鵝影響直接安裝二進位的package就好了...

<img src='https://img.shields.io/badge/Kiwi-%E5%9C%A8%E5%BC%B7%E5%9C%8B%E7%9A%84%E6%97%A5%E5%AD%90%2C%E6%8A%80%E8%83%BD%E9%BB%9E%E5%85%A8%E9%83%A8%E6%8B%BF%E5%8E%BB%E9%BB%9E%E6%A2%AF%E5%AD%90%E4%BA%86..-A8FF24? style="social&logo=kiwix&logoColor=EA7500"' height='40' />