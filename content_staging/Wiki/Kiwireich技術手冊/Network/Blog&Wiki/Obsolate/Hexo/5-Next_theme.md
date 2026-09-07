---
title: 5-Next_theme
tags:
  - Network
  - Server
  - Git
  - Blog
date: 2026-09-07
---
# Hexo - NEXT Theme

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />
# 前言

Next主題是一個很漂亮的Blog主題/風格,安裝起來也非常簡單用npm直接下指令安裝就好了

# 安裝

[Next Theme官網](https://github.com/next-theme/hexo-theme-next)上有兩種安裝方式

+ 透過npm直接安裝(需要Hexo5.0以上版本)
  
  ```bash
  #在Hexo目錄下
  npm install hexo-theme-next
  ```
  
  安裝後直接變更Hexo目錄的`_config.yml`內的theme部分就可以用了
  
  ```C
  theme: next
  ```

+ <font color="red"><del>透過Git指令直接clone整個theme到Hexo的theme目錄</del></font> V8後基本上都用`npm`安裝
  
  ```bash
  #在Hexo目錄下
  git clone https://github.com/next-theme/hexo-theme-next themes/next
  ```
  
  安裝後一樣要變更Hexo目錄的`_config.yml`

```c
theme: next
```

# 設定

## #Theme Setting

將Theme的`_config.yml`複製為`_config.[Theme_name].yml`

詳細的說明可以參考[官方的文件說明](https://theme-next.js.org/docs/getting-started/configuration.html)

基本上只需要修改下述幾個主要參數就可以了

## #Choosing Scheme

```
# ---------------------------------------------------------------
# Scheme Settings
# ---------------------------------------------------------------

# Schemes
#scheme: Muse
scheme: Mist
#scheme: Pisces
#scheme: Gemini

# Dark Mode
darkmode: true
```

有四種scheme可以挑選,官網上有範例可以參考[Muse](https://theme-next.js.org/muse/), [Mist](https://theme-next.js.org/mist/), [Pisces](https://theme-next.js.org/pisces/), [Gemini](https://theme-next.js.org/)可以自行挑選後修改設定啟用

另外現在Next官方支援Darkmode,預設是false,修改成true後可以變成darkmode

### #手動切換Darkmode

#### 參考資料

[Clay 的技术博客](https://www.techgrow.cn/posts/abf4aee1.html)

### 設定方式

#### 安裝Plug-in

```bash
$ npm install hexo-next-darkmode --save
```

#### 設定

```bash
#_config.next.yml
---------------------------------------------------------------------------------------------------------------------------------
# disable default Darkmode
darkmode: false
# add below

# Darkmode JS
# For more information: https://github.com/rqh656418510/hexo-next-darkmode, https://github.com/sandoche/Darkmode.js
darkmode_js:
  enable: true
  bottom: '64px' # default: '32px'
  right: 'unset' # default: '32px'
  left: '32px' # default: 'unset'
  time: '0.5s' # default: '0.3s'
  mixColor: 'transparent' # default: '#fff'
  backgroundColor: 'transparent' # default: '#fff'
  buttonColorDark: '#100f2c' # default: '#100f2c'
  buttonColorLight: '#fff' # default: '#fff'
  isActivated: false # default false
  saveInCookies: true # default: true
  label: '🌓' # default: ''
  autoMatchOsTheme: true # default: true
  libUrl: # Set custom library cdn url for Darkmode.js
```

* `isActivated: true`：默認使用Darkmode，始終搭配 `saveInCookies: false`、`autoMatchOsTheme: false` 

## Menu

```c
# ---------------------------------------------------------------
# Menu Settings
# ---------------------------------------------------------------

menu:
  home: / || fa fa-home
  #about: /about/ || fa fa-user
  tags: /tags/ || fa fa-tags
  categories: /categories/ || fa fa-th
  archives: /archives/ || fa fa-archive
  #schedule: /schedule/ || fa fa-calendar
  #sitemap: /sitemap.xml || fa fa-sitemap
  #commonweal: /404/ || fa fa-heartbeat
  wiki: https://kiwi0093.github.io/Wiki-site/ || fa fa-sitemap

# Enable / Disable menu icons / item badges.
menu_settings:
  icons: true
  badges: false
```

編輯這個部分可以簡易做出Blog框架內的選單,在官方文件內還有介紹出可以分層的Menu寫法,如下

```c
menu:
  home: / || fa fa-home
  archives: /archives/ || fa fa-archive
  Docs:
    default: /docs/ || fa fa-book
    Getting Started:
      default: /getting-started/ || fa fa-flag
      Installation: /installation.html || fa fa-download
      Configuration: /configuration.html || fa fa-wrench
    Third Party Services:
      default: /third-party-services/ || fa fa-puzzle-piece
      Math Equations: /math-equations.html || fa fa-square-root-alt
      Comment Systems: /comments.html || fa fa-comment-alt
```

其他的細部設定就參考官方文件設定即可

在現在的架構下務必要加上

```c
wiki: https://kiwi0093.github.io/Wiki-site/ || fa fa-sitemap
```

才會建立Wiki的Link

## 留言功能

我搞了一圈最後還是選擇使用<font color="red"><del>Disqus+DisqusJS</del></font>自己搭建的isso

### <font color="red"><del>參考資料</del></font>

* [老青菜](https://laoqingcai.com/)
* [DisqusJS Github](https://github.com/SukkaW/DisqusJS)

### <font color="red"><del>申請Disqus帳號這個</del></font>

<font color="red"><del>這個去官網申請就好了,申請完後記得連API一起弄一下(參考[DisqusJS Github](https://github.com/SukkaW/DisqusJS)的作法)</del></font>

### <font color="red"><del>設定檔</del></font>

```bash
#_config.next.yml
---------------------------------------------------------------------------------------------------------------------------------
# Disqus
disqus:
  enable: true
  shortname: ${your_shortname}
  count: true

# DisqusJS
# Alternative Disqus - Render comment component using Disqus API.
# Demo: https://suka.js.org/DisqusJS/
# For more information: https://github.com/SukkaW/DisqusJS
disqusjs:
  enable: true
  # API Endpoint of Disqus API (https://disqus.com/api/).
  # Leave api empty if you are able to connect to Disqus API. Otherwise you need a reverse proxy for it.
  # For example:
  # api: https://disqus.skk.moe/disqus/
  api:
  apikey: ${Your_API_KEY} # Register new application from https://disqus.com/api/applications/
  shortname: ${your_shortname} # See: https://disqus.com/admin/settings/general/
```

<font color="red"><del>好了之後`hexo clean`,`hexo d -g`就好了</del></font>

### ISSO - 參考

請參考另外一篇[Isso comment system for Hexo Blog | Kiwi's Wiki (kiwi0093.github.io)](https://kiwi0093.github.io/wiki/wiki/VM&Container/Service%20Container/10-isso/)  
