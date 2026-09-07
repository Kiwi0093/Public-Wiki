---
title: 2-installation
tags:
  - Network
  - Server
  - Git
  - Blog
  - Wiki
date: 2026-09-07
---
# Hexo - Installation

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

# 前言

Hexo是個很簡單好用的靜態網頁產生工具,基本上就是需要npm+node.js

## 相關工具

### Git

+ #### Linux

  - ##### Arch系列

  ```bash
  sudo pacman -S git
  ```

  - ##### Debian/Ubuntu系

  ```bash
  sudo apt-get install git-core
  ```

  由於Github Desktop Linux版的安裝比較麻煩,尤其是在~~強國~~天朝內沒有翻牆的情況下安裝比較累

  所以會建議用Command Line的git就好了,大不了寫成script還是很方便

+ #### Windows

  Windows下建議直接下載[Github Desktop](https://desktop.github.com/)會比較方便,可以在官方網頁上下載安裝也可以透過chocolatey安裝

  ```bash
  choco install github-desktop
  ```

### node.js & npm

+ #### Linux

  - ##### Arch系列

  ```bash
  sudo pacman -S nodejs npm
  ```

  - ##### Debian/Ubuntu系

  ```bash
  sudo apt-get install -y nodejs npm 
  ```

+ #### Windows

  同Github Desktop,可以去[node.js](https://nodejs.org/en/)下載安裝,裝的時候就會包含npm一起裝了,或是透過chocolatey安裝

  ```bash
  choco install nodejs
  ```

## Hexo安裝

Hexo是利用npm安裝的,我沒在WIndows下安裝過,但是我想應該都是一樣的

```bash
npm install -g hexo-cli
```

跑完就裝好了