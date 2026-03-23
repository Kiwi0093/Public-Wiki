---
title: 大叔的碎碎念 - Hugo+Github
date: 2020-07-06
description: 基本說明如何轉移到Github上
tags: [Old-Blog, Markdown, Blog, Archive]
slug: 2020/07/hugo+github
---
>  info 
> 本文轉載自舊站存檔。

# 前言

日前看了[CTT](https://www.youtube.com/user/homergfunk/featured)的Youtube頻道,發現了Hugo+Github或是Hugo+Netlify的選項也很適合拿來做BLog,考慮到Blogger的編輯模式真的不是那麼先進以及大叔我賣力想轉向Markdown的語法的努力,從這篇開始大叔打算把自己這個沒人看的Blog從Blogger移到github順便學習一下時髦的git方式來管理我的Blog

``

## 事前準備

新的Blog需要用到以下工具

* **[Hugo](https://gohugo.io/)** - 用來製作靜態網頁的工具有Linux, Windows, MacOS, FreeBSD ...etc平台,一個純CLI的工具

* **[Github](www.github.com)** - 可以說是M$最佛心的服務,我們主要是利用他可以免費建立自己的專案以及方便用git指令upload與管理的特點

* **[Remarkable](https://remarkable.com/)** or **[Typora](https://typora.io/)** 等Markdown Editor, 這個主要是可以順手編輯md檔作為Blog文章的本體,也是我更換的最主要原因

* **[git](https://git-scm.com/)** - 超強大的工具基本上只要是linux預設都會先裝上,若是用Windows的話就需要另外裝上

出乎意料的不需要什麼工具,但是因為大叔不熟所以需要參考的資料就相對很多了但是資料其實也不少啦只要上Google查詢一下*hugo 教學*就一堆了

## 安裝步驟

### Hugo安裝

由於大叔主要都是上班時間偷寫Blog所以主力就使用Manjaro來進行,總之先裝上hugo

```bash
sudo pacman -S hugo
```

### 建立Github repo
這裡建議採用[chanmitsu55氏](https://chanmitsu55.github.io/posts/2017/12/create-blog-by-hugo/)的作法進行
首先我們會需要一個Github的帳號, 這是免費的請用E-Mail去申請,申請好後請建立兩個repo

1. 與你的Site同名的repo,大叔的場合就是Blog
2. 建立一個`<username>github.io`的repo

 先clone同名的repo作為local端的基本目錄

 	`git clone https://github.com/<username>/Blog.git`

### 建立網頁本體&複製網頁本體到Local工作目錄下&加掛Public submodule
然後建立一個新的網站,這個步驟大概就是第一遍需要做而已

```bash
hugo new site _blog
cp -p -f -R _blog/* Blog/
cd Blog
git submodule add -b master https://github.com/<username>/<username>.github.io.git public
```

會先複製過來的理由是因為大叔用的Fuji theme是用submodule的方式掛上的,不在git目錄下沒辦法掛submodule
另外在hugo還沒生成網頁前先加掛public的原因是反正後面要掛的時候還要*rm -rf public*才能加掛那還不如在還沒有的時候就掛上

### 安裝主題
這樣我們就有一個基礎的網頁框架了,接著先來裝個Theme,這樣才有具體的樣子
大叔比較簡僕,所以挑了一個簡單的主題[Fuji](https://themes.gohugo.io/hugo-theme-fuji/),你們也可以挑自己喜歡的來裝

```bash
cd ~/Blog
git submodule add https://github.com/amzrk2/hugo-theme-fuji.git themes/fuji
```

這樣就裝好了Theme,接著就要對這個Theme進行簡單的設定

```bash
cp themes/fuji/exampleSite/config.toml ./
cp -R themes/fuji/exampleSite/content/archives ./content/
cp -R themes/fuji/exampleSite/content/search ./content/
```

這一步其實重要的就是把example裡的config.toml拿來改,另外的兩個是因為我只打算留下archive跟Search的選單所以把他copy過來

接著編輯config.toml

`vim config.toml`

幾個主要的Item要改一下

```bash
#這個是定義你的主頁網址,請跟你的設定一致
baseURL = "https://Kiwi0093.github.io"	
#這個是你的網頁主要Title
title = "中年大叔的自言自語"
#這個是定義你網頁的主題
theme = "fuji"

[params]
  #這個是作者的名字
  author = "Kiwi.L"
  #這個是網頁的副標
  subTitle = "對應老年癡呆與記憶衰退的筆記"	

[taxonomies]
  #這是定義Tag會使用tags來進行分類
  tag = "tags"

[menu]
  #這個定義的是導向哪邊而非簡單的link
  [[menu.nav]]
   #這個定義了右邊連結的Home
   name = "Home"
   #連線是相對位置*/*對應的是*./content*
   url = "/"
   #這個定義了排序
   weight = 1
[[menu.nav]]
   name = "Archives"
   url = "/archives/"
   weight = 2
[[menu.nav]]
   name = "Search"
   url = "/search/"
   weight = 3
 #這個定義的是簡單的link
[[menu.link]]
 #這個是你想要表現的字串
   name = "R2d Blog"
   #這個是他的連結
   url = "https://roidintw.kaienroid.com/"
   #這個一樣是排序
   weight = 1
```

### 新文章建立與寫法
這些弄好基本上的網頁框架就弄好了,接著就寫個簡易的內容

```bash
cd ~/Blog
hugo new post/what-ever-you-like-to-name.md
```

然後用你喜歡的Editor打開這個檔你會看到

```bash
#這個---不要動
---
#這個是這個文件的主題會出現在Post的標題上
title: "what-ever-you-like-to-name"
#這個是時間戳記
date: 2020-07-06
#這是標記是否為草稿,寫好要正式發出去的文章把這行去掉
draft: true
#增加tag的寫法
tags: [ "A-tag", "B-tag", "C-tag" ]
#這個---不要動
---
```

這個編輯上面的內容作為你的這份文件的表頭,然後在下面用Markdown語法直接寫你的Blog內容就好了,到這裡基本的重點已經完成,後面是生成網頁與放到github上

### 生成網頁與本機測試
在放上之前凡請先生成網頁並且用local的看一下是不是自己要的

```bash
cd ~/Blog
hugo && hugo server
```

記得依照提示上去看一下還有沒有要調整的沒有就要正式扔上github囉

### 自動deploy script
這個部份官方的建議script還有手動輸入commit的部份時常容易忘記,這裡採用[chanmitsu55氏]的版本,等於只是update時間在後面

```bash
#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build the project.我們已經在config.toml裡定義了theme所以簡單的hugo就夠了
hugo

# Go To Public folder
cd public
# Add changes to git.
git add .

# Commit changes.
msg="rebuilding site `date`"
   if [ $# -eq 1 ]
   then msg="$1"
   fi
git commit -m "$msg"

# Push source and build repos.
git push origin master

# Come Back up to the Project Root
cd ..

# Commit source repository changes
git add .
git commit -m "$msg"
git push
```

我不喜歡直接做成執行檔,所以我會把上述內容寫在deploy.sh裡面用下面指令跑

`sh ./deploy.sh`

過程中會要求輸入github的帳號密碼兩次,分別是push Blog跟Public用的不要打錯了

### 異地工作

至於在其他機器上也想編輯時怎麼辦？,基本上只需要以下的指令就可以把東西從頭抓下來

`git clone --recursive https://github.com/<username>/Blog.git`

已經有舊的git folder的機器要可以單純寫新的update就好因為git push/pull都是差異比對
不是更新版本的不會上傳(有偏執狂而且網路不用錢的可以每次都重新clone啦)
這樣就可以確保我們的資料基本上都是存在github上
