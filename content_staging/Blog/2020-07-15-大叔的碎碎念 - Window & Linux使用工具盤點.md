---
title: 大叔的碎碎念 - Window & Linux使用工具盤點
date: 2020-07-15
tags: [Linux, Windows, Old-Blog, Archive]
id: 20260323-B-31
---

> [!info]
> 本文轉載自舊站存檔。

# 前言

使用電腦多年,使用的軟體也隨著時間的變更而有些調整,看著自己之前寫過一些Manjaro的安裝使用或是Gaming之類的文章就在想是否該寫一篇~~大雜燴~~整合文章把現在這個時間點開始使用或是使用多年也不厭倦的軟體以及習慣的設定方式做個紀錄,也給有興趣的人們留下一點參考

``

# 基本前提

從今年開始大叔我開始慢慢習慣多平台的使用(主要是指Windows/Linux的Desktop)所以軟體的選擇使用上也盡量會選擇以下幾個特點

* Freeware or Open-Source的軟體
* 支援多平台
* 最好可以互相sync不容易因為更換平台或是終端無法繼續接著工作
* 不需要依賴網路就可以操作

以上這幾點基本上就是讓自己盡量少用盜版軟體,減少對於Web app的依賴(例如一大堆的chrome擴充程式)

# Desktop環境

## Editor/Coding/Note tools

### Markdown Editor

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/Typora.jpg" alt="Typora" width="50" />[Typora](https://typora.io/) - Windows & Linux

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade typora -y
```

* Linux(Manjaro)

```r
#None root account & yay installed
yay -S typora
```

這是一個用過才知道超好用的,大叔在[另外一篇](https://kiwi0093.github.io/post/git/)裡面有提到這個還可以結合Github當圖床自動上傳圖片,習慣Hot-key後拿來寫Blog工作效率會很好是個值得推薦的Markdown Editor

順便筆記一下,要在Markdown內插入youtube影片的話[請這樣做](https://gist.github.com/billthelizard/a632b6a6a79839cba1c0fd67f64b87ff)

```r
基本語法
[![alt text](http://example.com/exampl.png)](http://example.com/link "title")

封面的圖
http://img.youtube.com/vi/{video-id}/0.jpg

所以範例就是
[![Audi R8](http://img.youtube.com/vi/KOxbO0EI4MA/0.jpg)](https://www.youtube.com/watch?v=KOxbO0EI4MA "Audi R8")
```

其中*KOxbO0EI4MA*就是Video-id,可以從影片的連結來找,不過play list是沒有封面的

### Editor for coding

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/notepad%2B%2B.png" width="50" />[Notepad++](https://notepad-plus-plus.org/downloads/) - Windows & Linux

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade notepadplusplus -y
```

這個Editor在Windows底下算是好用的,大叔主要拿來修改HOI4的檔案(不務正業的代表),不過可惜的是只有Windows版,可以用choco安裝或是抓下來跑,更甚至可以用portable的方式跑

### Note

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/Notion_app_logo.png" width="50" />[Notion](https://www.notion.so/) - Browser based

* Windows & Linux & macOS & 只要有Browser的終端

  使用你喜歡的Browser.[點這裡](https://www.notion.so/)

* iOS

  到[app store上找notion](https://apps.apple.com/us/app/notion-notes-projects-docs/id1232780281)

* Android

  [<img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/google-play-badge.png" alt="google-play-badge" style="zoom: 33%;" />](https://play.google.com/store/apps/details?id=notion.id)

  自從Notion把免費帳號的使用Block數限制改為unlimited後,Notion一口氣就變成神器了,對於有作筆記習慣的人基本上是推薦必定要去申請一個的(不過大叔的筆記方式改成寫Blog所以就不太用得上)

  八卦一下的是大叔其實是看了Notion的安麗影片才想學用Markdown的,可見他的使用上是多麼誘人,順便附上幾個相關的youtube連結,牆內的捧油就請自動當作沒看到好了

  <a href="https://www.youtube.com/watch?v=kI1JQaNpBks&list=PLC5c1koJaYqucZwMGChO36IRPzOxXhXcn"><img src="https://img.youtube.com/vi/8B23t_jqySU/0.jpg" alt="Notion guide" style="zoom:50%;" /></a>
  Note: YouTube Video - Hold Ctrl + Left Click to open in new window

## Multimedia

### Player - Video

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/k-lite-codec-pack-logo.png" width="50" />[K-lite codepack](https://codecguide.com/download_kl.htm) - Windows

* Windwos

```r
#Powershell as Administrator with Chocolatey
choco upgrade k-litecodecpackfull -y
or
choco upgrade k-litecodecpackmega -y
or
choco upgrade k-litecodecpackbasic -y
```



#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/vlc.jpg" width="70" />[VLC](https://www.videolan.org/vlc/index.html) -Windwos & Linux

* Windwos

```r
#Powershell as Administrator with Chocolatey
choco upgrade vlc -y
```

* Linux(Manjaro)

內建,其他的應該用該Distro裡的package manager就可以很容易裝上,甚至用GUI的都可以

### Player - Audio

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/Foobar2000_logo.png" width="40" />[foobar2000](https://www.foobar2000.org/) - Windows

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade foobar2000 -y
```

不過這個程式大叔倒是推薦不要用安裝版的,用portable的,主要是用安裝的每次都要調整UI,而它的軟體升級老實說不怎麼有需要,主要是他的codec幾乎都是靠plugin,而plugin也不怎麼更新...

使用的時候記得搭配[Lame MP3 Encoder](https://lame.sourceforge.io/)就可以很方便的進行音樂的轉檔與整理

## Game

### Platform

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/steam.jpg" width="50" />[Steam](https://store.steampowered.com/) - Windows & Linux

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade steam -y
```

* Linux(Mangaro)

內建裝好的不用特別改



這個只能說是神器,尤其是對Linux來說根本就是Gaming的最重要software.

現在年紀大了很多時候遊戲與其花時間精神去到處找人放出的ISO或是什麼亂七八糟的版本,還不如趁特價的時候卡刷下去來的實在省事

在Steam library裡的遊戲不僅想玩的時候再安裝就好,還可以比對原始檔案把改得亂七八糟的遊戲直接回復到正常可以跑的狀態,搭配workshop跟Nexus mod基本上在電腦上玩遊戲的體驗與爽度(對啦大叔就是Mod黨+cheat愛好者啦)是很高的 



另外,現在Steam出了Steam link與遠端同樂等新功能,在Linux下也可以跑得很順,是遵循AMD教誨的Linux同伴想要串流的好選擇

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/galaxy_logo.png" width="50" />[GOG Glaxy](https://www.gog.com/galaxy) - Windows

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade goggalaxy -y
```

這是GOG版的~~Steam~~遊戲download/Install管理程式,GOG最大的好處就是DRM free,不過一般的玩家應該沒太多感覺,簡單的說就是版權保護沒有那麼嚴格,所以很方便拿來玩就遊戲(阿都叫Good Old Game了)

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/lutris_logo.jpg" width="50" />[Lutris](https://lutris.net/) - Linux

* Linux(Manjaro)

```r
sudo pacman -Sy lutris
```

Lutris雖說也是神器,因為他是一個集合很多神人寫好的遊戲安裝script並且可以自動化執行的好東西(不過大叔沒有成功地拿來跑什麼遊戲就是了),但是由於它的基礎很多都是使用wine(是的各種不同版本的wine與設定)所以使用前要先把你的硬體設定弄好,跑的時候還是很Linux風味的要一直關注要是有問題要怎麼解決,[這裡有一篇簡單的Manjaro Lutris Install Guide](https://forum.manjaro.org/t/manjaro-specific-lutris-install-guide/143943)簡單的說就幾個重點

1. 如果你用Linux,就買AMD的CPU & GPU, Nvida會讓你懷疑人生
2. 若是你的遊戲在steam裡面,那還是用Steam吧孩子,玩遊戲應該是快樂的不要為了遊戲以外的事情折磨自己

### GameSteam

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/stream_logo.jpg" width="50" />[Moonlight - Steam](https://moonlight-stream.org/) - Windwos & Linux & macOS & Android & iOS

[上述連結](https://moonlight-stream.org/)的最下面就有漂亮而且完整的安裝連結們,大叔就省一點字數

這個基本上就是一個第三方的Nvidia shield client跟Server的架構,推薦的使用方式是

![](https://raw.githubusercontent.com/Kiwi0093/graph/master/img/moonlight.png)

這個東西好歸好,但是有以下幾個限制

1. 他只能找到在同一個子網路中的Server,想要從很外部連進來玩~~需要在gateway上開洞~~可以透過[Moonlight Internet Hosting Tool](https://github.com/moonlight-stream/moonlight-docs/wiki/Setup-Guide#streaming-over-the-internet)達成

2. 因為是串流,所以一台Server只能同時讓一個Client連線,並且你在Client上做什麼Server上就在做什麼,某程度上可以當作remote desktop使用

3. Server基本上限定了只能用Nvidia,rending的機能也是用Nvidia的Geforce Experience原始機能,不過好處是Host的設定非常簡單

如同架構圖很適合未來若是大叔想不開決定把所有工作的console都換成Linux後,可以另外建立一台專門拿來玩遊戲的Windows Server,不裝螢幕的扔在某個角落

搭配WOL(Wake on Lan的功能,要玩遊戲的時候在開啟,打完就把它遠端關機,既省電又不佔地方,還可以搭配電視盒用大電視玩,要是未來這個可以更像Xwindow一樣

不是畫面rendering送出來而是直接輸出到client,一台Server可以多個Client跑不同的東西那就太棒啦(繼續幻想吧)

PS:AMD也搞了一個AMD Link應該也是可以這樣搞的只不過大叔還沒試過

## Network

### Browser

<img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/brave-logo.png" alt="brave-logo" width="40" />[Brave Browser](https://brave.com/) - Windows & Linux & Android

* Windows安裝方法

```r	
#Powershell as Administrator with Chocolatey
choco upgrade brave -y
```

當然也可以用老方法去官方網頁上下載回來雙擊安裝,只不過我覺得有package manager來管理更新似乎比較現在的胃口一點
	
* Linux(Manjaro) 安裝方法

```r
sudo pacman -Syu brave
```

* Android安裝方法

  [<img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/google-play-badge.png" alt="google-play-badge" style="zoom: 33%;" />](https://play.google.com/store/apps/details?id=com.brave.browser)

基本上這個Browser跟Google Chrome有著很高的相容性(因為是用Chromium為基礎開發的嘛)SYNC的方法不是採用帳號式的sync而是用一段文字作為SYNC Code來進行sync,用到現在沒有什麼特別需要提的設定

### SSH Client

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/putty.jpg" alt="putty" width="50" />[Putty](https://www.putty.org/) - Windows & Linux

* Windows安裝方法

1. 使用Portable的版本

	[Portable Version](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)

2. 使用Chocolatey安裝

```r
#Powershell as Administrator with Chocolatey
choco upgrade putty -y
```

* Linux(Manjaro)安裝方法

```r
sudo pacman -Syu putty
```

在Windows環境下沒有Putty是很痛苦的,因為沒有什麼好用的SSH Client,但是在Linux環境下由於本來的Terminal或是後裝的Terminator都很好用,所以除了socket功能與private Key的使用條件下其實沒有什麼使用Putty的特別需求	
#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/download.jpg" alt="download" width="50" />[JuiceSSH](https://play.google.com/store/apps/details?id=com.sonelli.juicessh) - Android
​      [<img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/google-play-badge.png" alt="google-play-badge" style="zoom: 33%;" />](https://play.google.com/store/apps/details?id=com.sonelli.juicessh)

雖然Android普遍都是觸控螢幕鍵盤用在CLI上面很痛苦,但是應急的時候有個Client其實還是可以頂一下的

### SFTP/FTP Client

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/1200px-FileZilla_logo.svg.png" alt="download" width="50" />[Filezilla]() - Windows & Linux

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade filezilla -y
```

* Linux(Manjaro)

```r
yay -S filezilla
```

現在其實沒有大學時代那麼常用FTP/SFTP了但是某程度上還是需要有個SFTP Client,這個也是吃Putty Key的軟體所以其實還是挺實用的,不用這個就只能用*WinSCP*不過實際上兩個用起來沒有那麼大的差別

### Mail/IM

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/large.png" alt="download" width="50" />[Rambox](https://rambox.pro/#home) - Windows & Liunx 

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade Rambox -y
```

* Linux

```r
yay -S rambox
```

這個其實蠻好用的,現在是手機的時代,所以很多IM軟體的主體都是手機版的如同Line/Wechat/Telegram之類的,Rambox其實就是一個框架可以把有web client的IM/Mail Box全部放在一起節省桌面開一大堆程式的雜亂感, 缺點就是沒有Line(因為沒有Web Client)

### Remote Desktop

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/Remmina-Official-Logo.png" alt="download" width="50" />[Remmina](https://remmina.org/) - Linux

* Linux(Manjaro)

```r
yay -S remmina
```

要使用RDP請裝上

```r
yay -S freerdp
```

算是在Linux下想走RDP的好工具,因為大叔不是很喜歡Teamviewer/VNC之類要走其他特殊protocol的Remote Desktop程式,所以喜歡用RDP(Windows下就直接用內建的RDP程式),這個似乎可以不需開Putty就直接開SSH Tunnel但是大叔沒有成功試過

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/teamviewer_logo.jpg" width="50" />[Teamviewer](https://www.teamviewer.com/en/) - Windows & Linux

* Windwos

```r
#Powershell as Administrator with Chocolatey
choco upgrade teamviewer -y
```

* Linux(Manjaro)

```r
yay -S teamviewer
```

老實說這是一個很強大的Remote Desktop軟體,但是也就是因為他太強大了,所以大叔不是很喜歡,最大的心理障礙就是明明一台在NAT後面的機器,沒在NATD上打洞

也能透過code或是帳號連上,真的是強大無比的穿透跟連線能力..所以大叔不太敢用這個

### VPN

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/qv2ray.jpg" alt="download" width="50" />[qv2ray](https://github.com/Qv2ray/Qv2ray) - Windows & Linux

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade qv2ray -y
```

* Linux(Manjaro)

```r
yay -S qv2ray
```

要搭配[V2ray-Core](https://github.com/v2ray/v2ray-core)服用,算是V2ray-Core的 GUI介面而已,用起來還算順利好用,介紹很少但卻是很重要的梯子

## System Tools

### Launcher

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/orchis-51s.png" alt="download" width="50" />[Orchis](http://www.eonet.ne.jp/~gorota/) - Windows

* Windows

這個程式伴隨我很久了,基本上只能去[他的網頁](http://www.eonet.ne.jp/~gorota/)下載回來用,非常日式風格的做法

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/1200px-Gnome-Pie_Logo.svg.png" alt="download" width="50" />[Gnome Pie](http://schneegans.github.io/gnome-pie) - Linux

* Linux(Manjaro)

```r
yay -S gnome-pie
```

這個算是我在找Orchis 在Linux上的替代品成果,實際用起來感覺還不錯

### Package Manager

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/download.png" alt="download" width="50" />[Chocolatey](https://chocolatey.org/) - Windows

* Windows

```r
#Powershell as Administrator with Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

這個非常好用但是前提是你的網路要可以才好用

#### [yay](https://github.com/Jguer/yay) - Archlinux & Manjaro

* Linux(Manjaro)

```r
sudo pacman -S yay
```

yay在Manjaro裡面可以直接用上面的指令安裝,但是在Archlinux內是沒辦法的,只能用git安裝

### Termanial

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/WT.jpg" width="50" />[Windows Terminal](https://github.com/microsoft/terminal) - Windows

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade microsoft-windows-terminal -y
```

這算是Microsoft最好用的terminal程式了,以前的cmd, powershell跟這個沒得比,要是安裝了WSL的話可以直接開linux terminal來用很方便

<img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/terminator.jpg" width="50" />[Terminator](https://terminator-gtk3.readthedocs.io/en/latest/) - Linux

* Linux(Manjaro)

```r
yay -S terminator
```

其實大叔對於Linux的Console沒有太多要求,基本功能就夠用了不過看Chris Titus推薦他愛用這款就來跟風一下

### Virtual Machine

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/vmware-workstation-logo-png.png" width="70" />[VMware Workstation](https://www.vmware.com/products/workstation-pro.html) - Windows & Linux

* Windows

```r
#Powershell as Administrator with Chocolatey
choco upgrade vmware-workstation -y
```

* Linux(Manjaro)

```r
yay -S vmware-workstation
```

VMware,在我心中統治著Virtual Machine環境的王者,簡單但是功能強大的VM,大叔連Server都用VMware ESXi來跑了,Windows下可以用Chocolatey安裝這件事也是導致大叔整個偏向Chocolatey使用的關鍵原因

#### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/qemu_logo.jpg" width="50" />[Qemu](https://www.qemu.org/) - Windwos & Linux

* Windwos

```r
#Powershell as Administrator with Chocolatey
choco upgrade qemu -y
```

GUI請使用[<img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/QtEmu.jpg" width="100" />](https://qtemu.org/)

* Linux(Manjaro)

```r
yay -S qemu
```

GUI請安裝[<img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/virt-m.png" width="50" />](https://virt-manager.org/)

```r
yay -S libvirt
```

說實話,會想碰qemu最主要的理由只有一個,他是目前看起來唯一可以做Portable Virtual Machine的程式,其他的基本上都需要安裝

關於Qemu的使用後面會專門寫一篇筆記
