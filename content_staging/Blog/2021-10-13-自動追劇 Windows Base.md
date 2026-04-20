---
title: 自動追劇 Windows Base
date: 2021-10-13
tags: [Windows, Network, Server, Old-Blog]
slug: 2021/10/Servarr-windows
description: 是個很沒用的廢文,誰會用windows來跑servarr..
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

其實自動追劇的基本都是一樣的,只不過看起來有些人需要Windows Based所以我之前寫了這個

不過大概比起Windows Base,他們更喜歡HDD流...

<!--truncate-->

## 參考資料

[sleele的Blog](https://sleele.com/2020/03/16/%e9%ab%98%e9%98%b6%e6%95%99%e7%a8%8b-%e8%bf%bd%e5%89%a7%e5%85%a8%e6%b5%81%e7%a8%8b%e8%87%aa%e5%8a%a8%e5%8c%96/comment-page-2/#comment-1651)

## 基本概念

### 組成元件

其實不管你用什麼平台主要就是要以下東西分工來達成

* [jackett](https://github.com/Jackett/Jackett) - 這個負責去Indexer上進行尋找後把資料扔回來
* [sonarr](https://sonarr.tv/) - 這個是最主要的元件,透過tvdb訂閱你要的影集後往Jackett扔指令讓他去找種子,然後再把找到的訊息扔給下載器去下載,最後再把下載回來的東西改名子整理整齊（搭配emby的格式需要）
* [radarr](https://radarr.video/) - 基本上跟sonarr功能一樣不過這個是專攻電影的,所以如同建議的要把影集跟動畫分別跑不同的sonarr一樣要跑電影就另外在跑個radarr
* [qBittorrent](https://www.qbittorrent.org/) - 其實就是個BT下載器,主要是因為sonarr直接可以透過他的WebUI界面去控制他下載所以使用他
* [Emby](https://emby.media/) - 其實這個可有可無,使用的真正目的只是要讓媒體庫有一個漂亮的UI可以讓所有的Device依照帳號去觀看,簡單的說有看起來就高大上一點
* [Chinesesubfinder](https://github.com/allanpk716/ChineseSubFinder) - 幫你自動找中文字幕的東西

### 基本要求

因為是自動下載填滿媒體庫,所以主要有以下兩點要滿足

* 夠大的空間 - 不管是存放媒體庫的空間,或是BT的暫存空間,都很吃硬碟空間,尤其是BT的暫存可以的話最好找可隨便扔掉的HDD來使用延長媒體庫的硬碟壽命
* 能長期開機的主機 -  這也是大多數的教程都會說用NAS+Docker的原因,畢竟NAS就一定是7X24的在跑,所以拿來跑這個是最合適的

### 簡易流程說明

設定好後,只要在Sonarr/Radarr的界面上增加你想要訂閱的影集或是電影,接著就放著,只要是Indexer上面有的就會自動安排到下載器,然後就是等他載完,然後會自動改名子,接著繼續等就會自己去找字幕來放好,然後在你的Emby上就可以看到了

### 與Blog內的差異

最大的不同就是Blog裡面的東西都是用Docker安裝的,若你要用Windows來跑,就要去下載這些東西的Windows版(基本上我只有用docker的方式,不過我有確認過這些程式都有提供Windows版的程式,所以應該沒什麼問題)

* [jackett](https://github.com/Jackett/Jackett/releases)
* [sonarr](https://sonarr.tv/#download)
* [radarr](https://radarr.video/#download)
* [qBittorrent](https://www.qbittorrent.org/download.php)
* [emby](https://emby.media/download.html) - 記得是emby server版
* [Chinesesubfinder](https://github.com/allanpk716/ChineseSubFinder/releases)

###  設定方法

我覺得Sleele的Blog寫得很詳細,所以我就不多說了,頂多下一個section我提一下我在設定上遇到的一些注意事項

### 注意事項

#### Profile

在sonarr/radarr的profile設定裡面,會讓你定義要抓到多高解析度的影片,在這裡我只能作人不能貪心,我一開始設定4K最高畫質,然後就是一部電影70GB,若你沒有大到嚇死人的空間請量力而為,一般來說設定在1080p webrip程度的大概一個電影是2~5GB之間

#### indexer

基本上美劇跟電影我是都用RARBG為主,其他就看各自心情,動畫的部份我用DMHY,但是深處在中國的朋友們請先確認你們這些indexer是不是有被牆,若有請記得Jackett連線的那台機器的線路要翻牆

#### 手動下載

基本上動畫我都是手動下載的,中劇的部份也是（因為這些玩意對這兩樣的支援性比較差）, 若手動下載下來的檔案請放到sonarr/radarr定義的該影集/電影的主目錄下面然後在用他們的手動導入功能導入後再整理,這樣就好了

#### 其他

上述的各項元件其實可以拆成各自獨立的機器跑,但是請記得/download跟/media這些地方要讓sonarr/radarr都要可以直接控制,其他的我建議你們就先試試看有什麼問題再來討論（甚至需要teamviewer來幫忙處理都ok唷）
