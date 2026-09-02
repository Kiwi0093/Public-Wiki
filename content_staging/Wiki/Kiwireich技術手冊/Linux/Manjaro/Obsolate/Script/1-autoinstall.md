---
title: 自動安裝script
date: 2026-09-02
tags:
  - Linunx
  - Manjaro
---

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Manjaro](https://img.shields.io/badge/Manjaro-Supported-green?style=plastic&logo=manjaro)

:::tip
這個系列現在已經不適用了,只是留個紀念
:::

>:::tip
>老實說這個script的實用性不是很高,充其量是拿來恢復自己使用的Manjaro-KDE,即使如此,後來還是發現因為會改來改去,可能後面拆成多個小的script還比較實在
>:::

## 基本介紹

### 使用指令

```bash
bash <(curl -L https://Kiwi0093.github.io/script/Manajro/manjaro.sh)
```

這裡還是使用萬用的`shell <(Curl -L URL/script)`語法來跑,試過改用`curl -L URL/script | shell`來跑的結果就是script中的一些等待輸入都會有問題,詳細細節我也不是懂為什麼,反正就是盡量不要用pipe去跑shell script比較不會有問題

### 內容介紹

這個script的內容主要是讓我可以快速的把自己在用的**Manjro**環境快速的port到新裝的機器或是VM上,減少重複設定調整工作環境的作業,這份主要會先說明整體會裝上什麼跟會產生什麼,詳細的script後面會分段來說明

- **_Terminator_** : 

  一個console程式支援分頁使用,上次看到Garuda裡面用的terminal看起來也蠻好看的若有找到其他更順手的會把他換掉

- **_PowerLevel10k_** :

  這個基本上就是個terminal美化工具,但是在企鵝下使用terminal的機率那麼高弄的漂漂亮亮的賞心悅目不好嗎？,基本就是**powerlevel10k**加上一些nerd font,最多還會在加個**neofetch**

- **_V2ray系列_** : 

  因為身在~~牆國~~天朝所以這個變成必裝的程式(其實在只在宿舍內使用的機器到是可以不裝因為已經在gateway處理掉了)主要是裝**Qv2ray**跟**V2ray**用圖形界面來控制

  '*'其實要再更Nerdy一點的話可以拋棄圖形界面只用單純的v2ray+config.json搭配systemed來跑也是可以的...不過Desktop嘛...還是弄個GUI比較應景

  不過這幾次試跑都發現安裝**Qv2ray**很浪費時間...還常常error...可能再多幾次讓我沒耐心了就會拿掉(或是做成選項！？)

- **_Rambox_** : 

  作為一個有朋友的人(這個毋庸置疑...),我還是會需要一些IM,以及Mail的client,Rambox目前算是用起來很順的整合型界面,(YES,他只是整合了各種web界面的東西)

- **_Brave_** :

  因為我不是那麼喜歡**firefox**所以會改用**Brave**

- **_Blog/Wiki寫作系列_** :

  這裡面包含了**Typora** - 我目前最喜歡的Markdown編輯器, **Git & Github-Desktop** - 我知道其實CLI的**git**就應該夠用了,但是GUI的**Githhub-Desktop**其實也是很好用的尤其是沒有把**git**的CLI指令弄的那麼熟的我來說...,另外還要加上**Typora**上傳圖片需要的**Picgo**

-  **_Putty_** : 

  其實某程度上直接使用terminal來跑ssh client是比Linux版的**Putty**好用的,但是這樣pkk的key就沒辦法直接用,加上要開ssh tunel的話還是寫好設定的**Putty**比較方便所以我都會裝上但是大概只有連回老家的時候才會用

- **_Remmina_** : 

  這個其實還要裝上**freerdp**才能直接跑rdp,我基本上都是用這玩意+ssh tunel連回老家的P2P windows

- **_Filezilla_** :

  其實這個東西現在已經沒什麼用了,因為還會採取**FTP/SFTP**傳輸的事情少了...但是還是會習慣性的裝上以備不時之需

- **_gnome-pie_** :

  這個是個Launcher,但是看起來很炫所以我現在很喜歡會放在必安裝的清單中使用

- **_fcitx系列_** :

  作為一個非英語母語的人,我絕對需要非英語的輸入法...所以我一般會用這個裝上**chewing(酷音)**以及**Mozc**來應付我的中日文打字需求...

- **_teamviewer_** :

  其實我沒有很常用**teamviewer**,只是會習慣性裝上以備不時之需

- **_VMware Workstation pro (optional)_** :

  這個我做成選項,因為我有些機器是裝在VM裡面的就不搞VM中的VM這種把戲了...

- **_KDE 個人趣味小東西 (optional)_** ：

  這個其實就是安裝一些Widget或是開機動畫等...後面可能會連多重開機的主題都放進去....

## 結論

雖然一開始是我自己用的私人script,不過我還是會盡量寫成可以通用(沒什麼意義就是了),然後把個人色彩很強的東西盡量都做成optional