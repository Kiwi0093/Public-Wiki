---
title: 系統調整與應用程式
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
雖然寫了一個Manjaro的自動安裝script,但是某程度上並不是很實用,因為Manjaro在我個人的使用上是當Desktop使用的,其實不是真的很需要自動安裝的script
所以我就針對現在(21.0.7)整理一下我個人會使用的程式與系統調整
>:::

# Tweak

## 環境條件

* Manjaro KDE 21.0.7

### 變更Mirror-list

Manjaro比Arch人性化的地方在於它有提供工具可以直接變更Mirror-list而不用靠編輯文件檔(可能其他人會覺得那樣比較簡潔乾淨又快速)

```bash
#依照國別選擇
sudo pacman-mirrors --country <County Name>
#依照速度選擇
sudo pacman-mirrors --fasttrack <數量>
```

之前我還住在中國的時候習慣性是把Mirror-list設成中國這樣可以省掉很多因為牆的問題

現在回台灣了應該都會改以速度為原則來選,甚至不選就可以了

### 安裝VGA Driver

```bash
sudo mhwd -a [pci or usb connection] [free or nonfree drivers] 0300
```

這個就會自動確認並且下載安裝了

### VM Guest OS

#### 安裝ISO無法開機

這個發生在21.0.6版,理由大概是因為Manjaro針對VM Guest的Driver做了調整,所以導致預設開機的driver=free無法正確驅動顯示,導致會卡在mhwd偵測

解決方案就是在開機選單中手動修改grub的開機參數

```bash
#將原先預設參數中的
driver=free
#改成
driver=mesa
```

改用mesa來驅動顯示就可以了開了,不過21.0.7的時候這個問題又被改好了

#### 進入VM後無法resize解析度以及不會自動fit畫面大小

這個是目前21版的毛病(以前用20或是19沒有這個問題不知道後面的版本會不會修正)原因是因為缺乏VM顯示的driver造成的

```bash
#安裝需要的Package
sudo pacman -S open-vm-tools virtualbox-guest-utils
```

雖然不算是正式的解決,因為沒裝上video-virtualmachine這個driver(怎麼安裝怎麼fail,後面可能會修好吧)

但是這樣畫面就可以動了,於是我也就先不管了

### Console

~~之前我會自己裝powerline,或是power10k這種東西來美化我的console,但是很神奇的是,21.0.7開始Manjaro的zsh就有寫好漂漂亮亮的powerline顯示可以使用,我就不用自己再弄,但是還是需要調整一下~~

請參考[Wiki for manjaro-zsh-config](https://kiwi0093.github.io/wiki/wiki/Misc/Zsh/1-Zsh&Powerlevel10k/)

#### tmux

參考[其他Wiki頁面](https://kiwi0093.github.io/wiki/wiki/Misc/Tmux/1-Tmux+oh-my-tmux/)

#### yakuake

這是一個下拉式的console,以前我會移除,但是最近發現他其實很好用,所以就保留著,設定上沒什麼特別的,基本上就是

* 調整下拉後的寬度,我習慣是90%
* 調整下拉後的高度,我習慣是80%
* 設定使用的是/bin/zsh,這個也可以用chsh把shell都改過就好了

要使用的時候按F12就可以了(應該可以設定改成其他的鍵,但是我個人覺得F12蠻好的),用其他的GUI程式的時候就會自動縮起來不佔空間

沒有exit前再次按F12會回到正在跑的console,這點很好用

#### yay

```bash
sudo pacman -S base-devel yay
```

這是神器肯定要上的

#### 中文輸入

請參考[Wiki - Fcitx](https://kiwi0093.github.io/wiki/wiki/Misc/Input%20Method/Fcitx/)

# Application

因為我都是拿Manjaro當desktop使用,所以也沒用什麼太花俏的程式

## 網路相關

### Browser

目前我都是用Brave作為我的主力browser,但是Brave是在AUR裡面的所以要用yay安裝

```bash
yay -S brave-bin
```

變更為`brave-bin`不然等compile會等死
這樣就好了,通常我還會移除firefox,因為我沒用上

### FTP client

```bash
yay -S filezilla
```

Filezilla也支援SFTP跟ppk檔,所以蠻方便的,不過近日大家都在用web的cloud在傳輸,傳統的ftp/sftp使用的機率越來越低,其實不裝也可以

### RDP

```
yay -S remmina freerdp
```

這樣就可以用rdp遠端控制其他的windwos了

### Github-desktop(Optional)

```bash
yay -S github-desktop
```

雖然可以用console的git,~~但是有時候GUI還是比較好用的~~還是CLI比較好用

### Hexo(Optional)

```bash
yay -S nodejs npm
```

因為我基本上安裝Hexo都是為了我自己的Blog/Wiki,若不是的可以任意找一個目錄

```bash
sudo npm install -g hexo-cli
```

就可以開始使用了

### ~~Putty(Optional)~~

```bash
yay -S putty
```

其實在Linux下Putty~~不是很需要~~是單純佔空間的雞肋,~~但是因為我會有ppk檔的使用需求所以還是加上會比較好(或是用比較傳統的方式把ssh-key放進console裡面也可以)~~
請參考[這篇Wiki把ppk轉成pem](https://kiwi0093.github.io/wiki/wiki/Misc/SSH/1-ssh_basic/)後用ssh直接上就好了,企鵝的Putty超難用


## 文書工作相關

### ~~Typora~~要收費了所以改用Marktext

```bash
yay -S marktext-bin
```
請參考[這篇進行安裝與設定picgo](https://kiwi0093.github.io/wiki/wiki/Misc/Markdown/2-Marktext&picgo/)

### Onlyoffice (Optianl)

```bash
yay -S onlyoffice-desktopeditors
```

這是一個跟M$ Office相容性很高的免費Office程式,安裝後只有Word,Excel,Powerpoint相容程式可以用,本來想弄server版的但是一直沒成功就懶了

Update: 搞了半天其實直接用網頁版的office 365就可以了....

## VM相關

### VMWare Workstation

```bash
yay -S vmware-workstation
```

沒什麼特別的,但是記得要去找SN不然不能用