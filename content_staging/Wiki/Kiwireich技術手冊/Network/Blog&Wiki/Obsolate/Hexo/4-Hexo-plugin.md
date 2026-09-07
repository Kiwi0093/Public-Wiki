---
title: 4-Hexo-plugin
tags:
  - Network
  - Server
  - Git
  - Blog
  - Wiki
date: 2026-09-07
---
# Hexo - Plugin

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

## Plugin安裝方法

Hexo Plugin官方網頁:[https://hexo.io/plugins/](https://hexo.io/plugins/)

### 基本命令

```bash
#安裝
npm install <plugin> --save
#解除安裝
npm uninstall <plugin> --save
#更新plugin & Framework(under Hexo Dir)
npm update
```

### 追加指令

先安裝npm-check-update

```bash
#Manjaro環境
pacman -S npm-check-update
```

有用的指令

```bash
#確認哪些package過期了
npm outdate

#確認是否有最新的package
npm-check-update
#update package.json
ncu -u
#更新package
npm install
```

另外,當git clone下整個Blog(包含package.json)時可以不用重新下安裝指令

```bash
#依照package.json更新整個node_module
npm update
```

## 本站有安裝的Plugin

* [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)

* [hexo-renderer-markdown-it-plus](https://github.com/CHENXCHEN/hexo-renderer-markdown-it-plus)

* [hexo-html-minifier](https://github.com/hexojs/hexo-html-minifier)

## 相關設定

#### Render-markdown-it-plus Section

```c
markdown_it_plus:
    highlight: true
    html: true
    xhtmlOut: true
    breaks: true
    langPrefix:
    linkify: true
    typographer:
    quotes: “”‘’
    pre_class: highlight
```

#### Deployment Section

```c
deploy:
  type: git
  repo: https://github.com/<Username>/<username>.github.io
  branch: <branch_name>
```

#### Hexo-html-minifier

```c
html_minifier:  
  collapseBooleanAttributes: true
  collapseWhitespace: true
  # Ignore '<!-- more -->' https://hexo.io/docs/tag-plugins#Post-Excerpt
  ignoreCustomComments: [ !!js/regexp /^\s*more/]
  removeComments: true
  removeEmptyAttributes: true
  removeScriptTypeAttributes: true
  removeStyleLinkTypeAttributes: true
  minifyJS: true
  minifyCSS: true
```
