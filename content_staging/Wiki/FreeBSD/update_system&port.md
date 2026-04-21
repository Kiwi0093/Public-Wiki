---
title: update_system&port
tags:
  - FreeBSD
slug: FreeBSD
date: 2026-04-21
description: FreeBSD的系統/安裝包升級方法
---



:::info []
<img src='https://img.shields.io/badge/Status-Active-A8FF24? style="for-the-badge&labelWidth=100"' height='38' />
:::

<!--truncate-->


### FreeBSD指令,用來update system, port, and packages

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