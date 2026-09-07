---
title: 3-Hexo-setting
tags:
  - Network
  - Server
  - Git
  - Blog
  - Wiki
date: 2026-09-07
---
# Hexo - Setting

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />
## Hexo本體設定

Hexo本體的設定均在`<folder>/_config.yml`裡面,大多數的設定都可以直接沿用很方便只有一些部分需要修改調整

詳細的[Hexo Configuration](https://hexo.io/docs/configuration.html)

#### #Site Section

```c
# Site
title: Kiwi's Blog
subtitle: 中年大叔的自言自語
description: ''
keywords:
author: Kiwi 
language: zh_TW
timezone: 
```

| 設定          | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| `title`       | 網站標題                                                     |
| `subtitle`    | 網站副標題                                                   |
| `description` | 網站描述                                                     |
| `keywords`    | 網站的關鍵詞。支援多個關鍵詞。                               |
| `author`      | 您的名字                                                     |
| `language`    | 網站使用的語言，參考 [2-lettter ISO-639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)，預設為 `en` |
| `timezone`    | 網站時區，Hexo 預設使用您電腦的時區，您可以在 [時區列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) 尋找適當的時區，例如 `America/New_York` 、 `Japan` 與 `UTC` |

#### #URL Section

如果您的網站存放在子目錄中，例如 `http://example.org/blog`，請將您的 `url` 設為 `http://example.org/blog` 並把 `root` 設為 `/blog/`。

```CQL
# URL
url: https://kiwi0093.github.io/
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:
pretty_urls:
  trailing_index: true
  trailing_html: true
```

| 設定                         | 描述                                                         | 預設值                      |
| :--------------------------- | :----------------------------------------------------------- | :-------------------------- |
| `url`                        | 網站的網址，must starts with `http://` or `https://`         |                             |
| `root`                       | 網站的根目錄                                                 |                             |
| `permalink`                  | 文章 [永久連結](https://hexo.io/zh-tw/docs/permalinks) 的格式 | `:year/:month/:day/:title/` |
| `permalink_defaults`         | `permalink` 中各區段的預設值                                 |                             |
| `pretty_urls`                | 改寫 [`permalink`](https://hexo.io/zh-tw/docs/variables) 的值來美化 URL |                             |
| `pretty_urls.trailing_index` | 是否在永久鏈接中保留尾部的 `index.html`，設置為 `false` 時去除 | `true`                      |
| `pretty_urls.trailing_html`  | 是否在永久鏈接中保留尾部的 `.html`, 設置為 `false` 時去除 (*對尾部的 `index.html`無效*) | `true`                      |

#### #Directory Section

```c
# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:
```

| 設定           | 描述                                                         | 預設值           |
| :------------- | :----------------------------------------------------------- | :--------------- |
| `source_dir`   | 原始檔案資料夾，這個資料夾用於存放您的內容                   | `source`         |
| `public_dir`   | 靜態檔案資料夾，這個資料夾用於存放建立完畢的檔案             | public           |
| `tag_dir`      | 標籤資料夾                                                   | `tags`           |
| `archive_dir`  | 彙整資料夾                                                   | `archives`       |
| `category_dir` | 分類資料夾                                                   | `categories`     |
| `code_dir`     | Include code 資料夾                                          | `downloads/code` |
| `i18n_dir`     | 國際化（i18n）資料夾                                         | `:lang`          |
| `skip_render`  | 跳過指定檔案的渲染，您可使用 [glob 表達式](https://github.com/micromatch/micromatch#extended-globbing) 來配對路徑 |                  |

#### #Writing Section

```c
# Writing
new_post_name: :title.md
default_layout: post
titlecase: false
external_link:
  enable: true
  field: site
  exclude: ''
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace: ''
  wrap: true
  hljs: false
prismjs:
  enable: false
  preprocess: true
  line_number: true
  tab_replace: ''
```

| 設定                    | 描述                                                         | 預設值      |
| :---------------------- | :----------------------------------------------------------- | :---------- |
| `new_post_name`         | 新文章的檔案名稱                                             | `:title.md` |
| `default_layout`        | 預設佈局                                                     | `post`      |
| `auto_spacing`          | 在西方文字與東方文字中加入空白                               | `false`     |
| `titlecase`             | 把標題轉換為 title case                                      | `false`     |
| `external_link`         | 在新頁籤中開啟連結                                           | `true`      |
| `external_link.enable`  | 在新頁籤中開啟連結                                           | `true`      |
| `external_link.field`   | Applies to the whole `site` or `post` only                   | `site`      |
| `external_link.exclude` | Exclude hostname. Specify subdomain when applicable, including `www` | `[]`        |
| `filename_case`         | 把檔案名稱轉換為: `1` 小寫或 `2` 大寫                        | `0`         |
| `render_drafts`         | 顯示草稿                                                     | `false`     |
| `post_asset_folder`     | 啟動 [Asset 資料夾](https://hexo.io/zh-tw/docs/asset-folders) | `false`     |
| `relative_link`         | 把連結改為與根目錄的相對位址                                 | `false`     |
| `future`                | 顯示未來的文章                                               | `true`      |
| `highlight`             | 程式碼區塊的設定, see [Highlight.js](https://hexo.io/docs/syntax-highlight#Highlight-js) section for usage guide |             |
| `prismjs`               | 程式碼區塊的設定, see [PrismJS](https://hexo.io/docs/syntax-highlight#PrismJS) section for usage guide |             |

#### #Homepage Section

```c
# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:
  path: ''
  per_page: 10
  order_by: -date
```

#### #Category & #Tag Section

```c
# Category & Tag
default_category: uncategorized
category_map:
tag_map:
```

| 設定               | 描述     | 預設值          |
| :----------------- | :------- | :-------------- |
| `default_category` | 預設分類 | `uncategorized` |
| `category_map`     | 分類別名 |                 |
| `tag_map`          | 標籤別名 |                 |

#### #Date & #Time Section

```c
# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss
## updated_option supports 'mtime', 'date', 'empty'
updated_option: 'mtime'
```

#### #Pagination Section

```
# Pagination
per_page: 10
pagination_dir: page
```

| 設定             | 描述                                  | 預設值 |
| :--------------- | :------------------------------------ | :----- |
| `per_page`       | 一頁顯示的文章量 (`0` = 關閉分頁功能) | `10`   |
| `pagination_dir` | 分頁目錄                              | `page` |

#### #Include / #Exclude Section

```c
# Include / Exclude file(s)
## include:/exclude: options only apply to the 'source/' folder
include:
exclude:
ignore:
```

| 設定      | 描述                                                         |
| :-------- | :----------------------------------------------------------- |
| `include` | Hexo 預設會忽略隱藏檔與隱藏資料夾，但列在這個欄位中的檔案，Hexo 仍然會去處理 |
| `exclude` | 列在這裡的檔案將會被 Hexo 忽略                               |
| `ignore`  | Ignore files/folders                                         |

#### #Extension Section

```c
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next

# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: https://github.com/Kiwi0093/Kiwi0093.github.io
  branch: master
```

| 設定     | 描述                                        |
| :------- | :------------------------------------------ |
| `theme`  | 使用主題名稱, 設為 `false` 表示關閉主題功能 |
| `deploy` | 佈署設定                                    |

##### #Update 2021/8/16

因為Github修改了政策,所以無法直接在https模式下用帳號/密碼登入,所以deloy的設定得改成以下

```bash
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: https://<token>@github.com/Kiwi0093/Kiwi0093.github.io
  branch: master
```

要注意這樣設定的話hexo d -g就不用在輸入username/password但是一旦這個token流出去也會很有問題,最簡單的解就是把整個repo改成private這樣可以多少減少問題

## Hexo使用方式

```bash
#清除建立好的資料
hexo clean
#建立靜態網頁
hexo g
#啟動Local Server
hexo s
#Deploy到Server上
hexo d
```

### Hexo剛建好的時候需要手動建立以下頁面

- 新增一個分類主頁：`hexo new page categories`

- 新增一個Tag主頁：`hexo new page tags`

  在 `source/tags/index.md` 编辑:

  ```c
  ---
  type: "tags"
  ---
  ```

### Hexo使用其他config.yml的方法

```c
# 使用自訂的 'custom.yml' 取代預設的 '_config.yml'
$ hexo server --config custom.yml

# 使用多個配置檔, 有衝突時優先使用 'custom2.json'
$ hexo server --config custom.yml,custom2.json
```

## 參考資料

[OHLIA's Wiki](https://ohlia.github.io/Wiki-site/wiki/Hexo/build-blog-by-hexo/)

[Hexo的官方文件](https://hexo.io/zh-tw/docs/)

## 同場加映

最近更新後常常會有

```bash
FATAL YAMLException: unknown tag !<tag:yaml.org,2002:js/regexp> (116:49)

 113 |  ... ttributes: true
 114 |  ... ce: true
 115 |  ... ore -->' https://hexo.io/docs/tag-plugins#Post-Excerpt
 116 |  ... ents: [ !!js/regexp /^\s*more/]
------------------------------------------^
 117 |  ... true
 118 |  ... butes: true
    at generateError (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:183:10)
    at throwError (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:187:9)
    at composeNode (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1521:7)
    at readFlowCollection (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:780:5)
    at composeNode (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1442:11)
    at readBlockMapping (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1164:11)
    at composeNode (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1441:12)
    at readBlockMapping (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1164:11)
    at composeNode (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1441:12)
    at readDocument (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1625:3)
    at loadDocuments (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1688:5)
    at Object.load (/home/kiwi/GitHub/Wiki-site/node_modules/js-yaml/lib/loader.js:1714:19)
    at Hexo.yamlHelper (/home/kiwi/GitHub/Wiki-site/node_modules/hexo/lib/plugins/renderer/yaml.js:7:15)
    at Hexo.tryCatcher (/home/kiwi/GitHub/Wiki-site/node_modules/bluebird/js/release/util.js:16:23)
    at Hexo.<anonymous> (/home/kiwi/GitHub/Wiki-site/node_modules/bluebird/js/release/method.js:15:34)
    at /home/kiwi/GitHub/Wiki-site/node_modules/hexo/lib/hexo/render.js:75:22
    at tryCatcher (/home/kiwi/GitHub/Wiki-site/node_modules/bluebird/js/release/util.js:16:23)
    at Promise._settlePromiseFromHandler (/home/kiwi/GitHub/Wiki-site/node_modules/bluebird/js/release/promise.js:547:31)
    at Promise._settlePromise (/home/kiwi/GitHub/Wiki-site/node_modules/bluebird/js/release/promise.js:604:18)
    at Promise._settlePromise0 (/home/kiwi/GitHub/Wiki-site/node_modules/bluebird/js/release/promise.js:649:10)
    at Promise._settlePromises (/home/kiwi/GitHub/Wiki-site/node_modules/bluebird/js/release/promise.js:729:18)
    at _drainQueueStep (/home/kiwi/GitHub/Wiki-site/node_modules/bluebird/js/release/async.js:93:12) {
  reason: 'unknown tag !<tag:yaml.org,2002:js/regexp>',
.......
```

這樣的錯誤訊息跑出來,解決方案如下

```bash
# /under/your/web/_config.yml
---------------------------------------------------------------------------------------------------------------------------------
....
html_minifier:  
  collapseBooleanAttributes: true
  collapseWhitespace: true
  # Ignore '<!-- more -->' https://hexo.io/docs/tag-plugins#Post-Excerpt
  #ignoreCustomComments: [ !!js/regexp /^\s*more/]		#把這行Mark掉就好了
  removeComments: true
  removeEmptyAttributes: true
  removeScriptTypeAttributes: true
  removeStyleLinkTypeAttributes: true
  minifyJS: true
  minifyCSS: true
...
```

