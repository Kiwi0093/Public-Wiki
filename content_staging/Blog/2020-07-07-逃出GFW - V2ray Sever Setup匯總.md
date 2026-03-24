---
title: 逃出GFW - V2ray Sever Setup匯總
date: 2020-07-07
tags:
  - V2Ray
  - Server
  - Linux
  - Old-Blog
  - Archive
slug: 2020/07/v2ray-server-setup
description: 總結2020年代架設V2ray來當梯子
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言
V2ray,這可以說是大叔開始寫Blog的最主要原因,因為這是一個住在強國才需要的被特化的技能,一般來說技術相關的文件一般都是英文的但恰恰好只有翻牆相關的文件全部都是簡體中文的...

因為這個區塊的知識相當偏門,所以大叔才燃起要把自己研讀過得方式與結果記錄下來以免每次都要重新查詢資料,順便可以的話把這些作法做成自動化處理減少相對應的工時

這篇文稿原來同名稱應該是把原先寫到update IV版的VPS V2ray Server架設與設定做個彙整, 但是仔細一想似乎最細膩的設定部份大叔都沒講到(因為V2ray官網上面講得很清楚呀,加上大叔基本上寫好的很難會重頭再來一次基本上都是直接拿來用),所以就順便把設定的部份順便寫一點,不過還是官網寫的會比較好唷

{/* 這裡插入切分線 */}
<!--truncate-->

# 事前準備
## VPS
這個東西雖然說是很多人可能會租來用但是特化拿來作為翻牆的大概只有天朝子民才會這樣幹,所以一樣可以在網路上找到很多評比,對大叔來說因為長期的人生中都認為網路上的自由不是理所當然的事情嗎？的想法所以在VPS的挑選上就會偏向小氣,以最便宜,堪用來進行選擇,但是實際上就是挑全場最低價格,機器性能不重要(但是KVM卻很重要)...
* [Anynode](https://anynode.net/) - 這是大叔主力的機台,用的是一年20USD的方案,每個月有500GB的流量作為房間裡的主要VPS來說算是夠用的
* [Hostenos](https://hosteons.com/) - 這是一個便宜又大碗的選項,兩年21USD,沒有流量限制有的只有速度上限100M這個問題,非常適合想要佛心分享,或是無視流量隨便狂用的選項(500GB自己一個人用某程度上也是無視流量隨便用....)
* [Bandwagonhost](https://bandwagonhost.com/) - 搬瓦工這個其實是個很方便的選擇,他們早期的VPS就有特別寫了*一鍵安裝S~hadow~S~ocks~*的服務,近來還提供了*[Just my socks](https://bwgjms.com/post/how-to-buy-justmysocks/)*服務,雖然比較離題但是沒有打算自己弄的人可以考慮這種方案比較省事
## Linux Destro for VPS
因為挑的都是廉價的VPS主機,自然就不太可能跑什麼有GUI的或是Windows,只能跑很單純的CLI界面的OS,其中大概最好上手的是~~FreeBSD~~Linux了,但是青菜蘿菠各有所好,只能請各位在VPS廠商提供的範圍內挑一個自己指令比較熟悉的
因為大叔挑選的關係,基本上都是挑使用agt的package manager的系統像是Ubuntu or Debain
不過大叔被Arch洗腦過後特別喜歡滾動式更新的系統(其實為了系統穩定性應該反過來的)
所以這裡都是用Debain做為基礎,使用不同Destro的人...就請自己腦內轉換指令囉

## Domain(Optional)

這個是你有打算使用Websocket+TLS+Web方式進行偽裝時會需要的,嚴格意義上還需要申請SSL憑證,但是SSL的部分可以讓Caddy來幫忙處理所以算是很簡單,只需要自己準備一個Domain,不管是免費的或是買的Domain都可以

## Cloudflare帳號(Optional)

這個是你打算在websocket+TLS+Web條件下再加上一層偽裝賭其無法把你連往VPS web port的路全斷了時才需要的,原理就是利用CDN的轉發功能達到繞過去保持連線的結果,主要是賭Cloudflare這麼大的公司不會所有的IP都被擋,當然若是你不喜歡Cloudflare,也可以使用其他的CDN,只不過Cloudflare的免費帳號這點還是蠻誘人的

最後掛越多偽裝連線速度就越慢這是沒辦法的,各位要依照自己的需求在速度與可靠度上做取捨跟平衡

## 預計使用工具
* Browser - 需要用瀏覽器來操作VPS的初始設定
* Putty or Linux Terminal - 簡單的說就是一個用順手的SSH client
* vi or vim or any editor you like - 很多編輯需求,因為我們幾乎不會抓下來在GUI環境下編輯所以最好使用CLI的文字編輯器,大叔特別偏好vi系...

## 參考文獻

[freenom](https://my.freenom.com/) - 可以弄到免費Domain的地方

[新V2Ray白話文指南](https://guide.v2fly.org/advanced/wss_and_web.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE) - 算是V2ray的官方說明網站,內容~~淺顯~~易懂

[Caddy的說明](https://caddyserver.com/docs/getting-started) - Caddy V2的官方說明網頁,相較V1有著更詳細的設定檔說明與指令說明,整個Caddy V2唯一比V1差的只缺那個自動安裝的script 

[博客-sprov](https://blog.sprov.xyz/2019/03/11/cdn-v2ray-safe-proxy/)

[那束陽光](https://eveaz.com/1094.html)

[233boy](https://github.com/233boy/v2ray/wiki/使用Cloudflare中转V2Ray流量)


# 安裝

## 系統基本安裝
1. 在Browser的VPS管理界面下挑選你喜歡的Linux Destro進行系統安裝,大叔選的是Debain.

2. 裝好之後設定你的SSH(可以用網頁terminal或是什麼設定都可以)

3. 用你喜歡的SSH Cliet登入你的VPS

4. 修改密碼以便於日後登入管理

```bash
passwd
```

5. 更新系統

  ```bash
  #Debain or Ubuntu
  sudo apt update && apt upgrade
  
  #Archlinux
  sudo pacman -Syu
  ```

  

6. 安裝必要的程式 - Vim, V2ray, Caddy, 

   ```bash
   #Debain or Ubuntu
   sudo apt install vim
   bash <(curl -L -s https://install.direct/go.sh)
   echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list
   sudo apt update
   sudo apt install caddy
   
   #Archlinux
   sudo pacman -Sy yay
   yay -Sy vim v2ray caddy2 
   ```

   

在寫原來的Blog的時候Caddy還沒正式改成Caddy2,但是因為caddy官網宣稱Caddy V1現在只是limited support所以update到V2也是遲早的事情

  看起來就是Arch比較簡潔漂亮(單純的偏心)

### 自動安裝Script - Apt系(Debain/Ubuntu)

```bash
#!bash

#變數定義
COLOR='\033[1;35m'
NC='\033[0m'

echo -e "${COLOR}Update Ubuntu System${NC}"
apt-get -y update
apt-get -y upgrade

echo -e "${COLOR}Install V2ray${NC}"
bash <(curl -L -s https://install.direct/go.sh)

echo -e "${COLOR}Set Auto Monthy Update V2ray${NC}"
echo '59 3    1 * *   root    bash <(curl -L -s https://install.direct/go.sh)'  >> /etc/crontab

echo -e "${COLOR}Install BBR${NC}"
bash <(curl -L -s https://github.com/teddysun/across/raw/master/bbr.sh)

echo -e "${COLOR}Install Caddy${NC}"
wget "https://github.com/caddyserver/caddy/releases/download/v2.1.1/caddy_2.1.1_linux_amd64.deb"
dpkg -i ./caddy_2.1.1_linux_amd64.deb"

echo -e "${COLOR}Setup  Caddy${NC}"
mkdir /etc/caddy
chown -R root:www-data /etc/caddy
mkdir /etc/ssl/caddy
chown -R www-data:root /etc/ssl/caddy
chmod 0770 /etc/ssl/caddy
mkdir /var/www
chown www-data:www-data /var/www
ufw allow http
ufw allow https
apt install libcap2-bin
setcap cap_net_bind_service=+ep /usr/local/bin/caddy
echo '<h1>Hello World!</h1>' | sudo tee /var/www/index.html

#Making Caddyfile for Caddy2
echo -e "${COLOR}Configure your Caddy setting${NC}"
echo -n "Please Enter your Domain name:"
read domain
echo "$domain" { > /etc/caddy/Caddyfile
echo tls { >> /etc/caddy/Caddyfile
echo "protocols tls1.2 tls1.3" >> /etc/caddy/Caddyfile
echo ciphers TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 >> /etc/caddy/Caddyfile
echo curves x25519 >> /etc/caddy/Caddyfile
echo } >> /etc/caddy/Caddyfile
echo @v2ray_websocket { >> /etc/caddy/Caddyfile
echo path /ray >> /etc/caddy/Caddyfile
echo header Connection *Upgrade* >> /etc/caddy/Caddyfile
echo header Upgrade websocket >> /etc/caddy/Caddyfile
echo } >> /etc/caddy/Caddyfile
echo -n "Please Enter your V2Ray port"
read PORT
echo reverse_proxy @v2ray_websocket localhost:$PORT >> /etc/caddy/Caddyfile
echo } >> /etc/caddy/Caddyfile

echo -e "${COLOR}Setup V2ray${NC}"
echo -n "${COLOR}Please Enter where you put the file:${NC}"
read link
echo -n "${COLOR}Please Enter the file name:${NC}"
read conffile
wget $Link/$conffile
mv -f  ./$conffile /etc/v2ray/config.json

echo -e "${COLOR}Please enter information as required, and press Ctl+c when Caddy running well${NC}"
caddy run -conf=/etc/caddy/Caddyfile

echo -e "${COLOR}Rebooting your VPS for normal operation${NC}"
reboot
```

### 自動安裝Script - Pacman/yay系(Archlinux)

使用前要先安裝並設定sudo後才能使用,我後面會把這一段加到Archlinux的安裝設定script內, 相關的方法如下

```bash
pacman -Syu sudo
echo <USER_NAME> ALL=(ALL) ALL >> /etc/sudoers
```
這個script要用root跑,中間會要你輸入一個none root的帳號就是你有放進sudoer裡的帳號
因為Archlinux不能用root跑yay才會這麼麻煩

```bash
#!bash

#變數定義
COLOR='\033[1;35m'
NC='\033[0m'

echo -e "${COLOR}Update Arclinux System${NC}"
pacman -Syu

echo -e "${COLOR}Install yay for Archlinux${NC}"
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

echo -e "${COLOR}Need None Root account to run yay${NC}"
echo -n "Please Enter your none root account"
read YOURID
su $YOURID
echo -e "${COLOR}Install V2ray, Caddy2${NC}"
yay -Syu v2ray caddy2
exit

echo -e "${COLOR}Install BBR${NC}"
bash <(curl -L -s https://github.com/teddysun/across/raw/master/bbr.sh)

echo -e "${COLOR}Setup  Caddy${NC}"
mkdir /etc/caddy
chown -R root:http /etc/caddy
mkdir /etc/ssl/caddy
chown -R http:root /etc/ssl/caddy
chmod 0770 /etc/ssl/caddy
mkdir /var/www
chown http:http /var/www
curl -s https://raw.githubusercontent.com/mholt/caddy/master/dist/init/linux-systemd/caddy.service -o /etc/systemd/system/caddy.service
systemctl daemon-reload
systemctl enable caddy.service
ufw allow http
ufw allow https
setcap cap_net_bind_service=+ep /usr/local/bin/caddy
echo '<h1>Hello World!</h1>' | sudo tee /var/www/index.html

#Making Caddyfile for Caddy2
echo -e "${COLOR}Configure your Caddy setting${NC}"
echo -n "Please Enter your Domain name:"
read domain
echo "$domain" { > /etc/caddy/caddy.conf
echo tls { >> /etc/caddy/caddy.conf
echo "protocols tls1.2 tls1.3" >> /etc/caddy/caddy.conf
echo ciphers TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 >> /etc/caddy/caddy.conf
echo curves x25519 >> /etc/caddy/caddy.conf
echo } >> /etc/caddy/caddy.conf
echo @v2ray_websocket { >> /etc/caddy/caddy.conf
echo path /ray >> /etc/caddy/caddy.conf
echo header Connection *Upgrade* >> /etc/caddy/caddy.conf
echo header Upgrade websocket >> /etc/caddy/caddy.conf
echo } >> /etc/caddy/caddy.conf
echo -n "Please Enter your V2Ray port"
read PORT
echo reverse_proxy @v2ray_websocket localhost:$PORT >> /etc/caddy/caddy.conf
echo } >> /etc/caddy/caddy.conf

echo -e "${COLOR}Setup V2ray${NC}"
echo -n "Please Enter where you put the file:"
read link
echo -n "Please Enter the file name:"
read conffile
wget $Link/$conffile
mv -f  ./$conffile /etc/v2ray/config.json

echo -e "${COLOR}Please enter information as required, and press Ctl+c when Caddy running well${NC}"
caddy run -conf=/etc/caddy/caddy.conf

echo -e "${COLOR}Rebooting your VPS for normal operation${NC}"
reboot
```



## V2ray

V2ray老實說是個很好用的東西,基本上來說它是一個框架而不是單指一個通訊協議,就算它的設定比較複雜(相對來說啦)但是只要搞懂一遍,就算後面vmess不能使用

大概也會出一個vmess2或是什麼有用的通訊協定被包進V2Ray的框架內繼續使用

目前V2ray依照它作為網路流向設定軟體的特性已經包含了以下功能

* 攔截所有往本機 udp 53的封包指定轉向某特定ip的某個port 實現DNS的功能

* 指定流進某PORT的流量全部以某種通訊協定到指定的IP機器去跑實現proxy的類似功能(梯子)

退一步來說就算不拿來當梯子用,V2ray應該也可以拿來替家裡的網路環境設定防火牆的功能,禁止小孩用家裡網路連上不該連的地方之類的(不過這些功能應該可以直接拿FW來做就好了沒必要這麼麻煩)

V2ray的相關設定可以參考[新V2Ray白話文指南](https://guide.v2fly.org/advanced/wss_and_web.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE),這裡面寫得很詳細也很實用,基本上只要自己照著改一下就可以用了

目前的環境下推薦使用Websocket+TLS+Web搭配Cloudflare之類的CDN, 網路上很多教程可以參考


## Caddy

比較Caddy v2的安裝,還是Arch系列的用yay來裝比較簡單,Debian/Ubuntu系列的依照它官網的作法是無法使用apt安裝的,所以大叔最後選擇用github上的deb檔進行安裝,缺點就是自動安裝的script的檔案版本得每次都依照最新版本調整

另外一點就是Arch系的設定檔是*/etc/caddy/caddy.conf*,而用deb安裝的設定檔則是維持*/etc/caddy/Caddyfile*

後續的使用上要注意才不會出問題

### Caddy2設定
這個設定檔是完全參考[新V2Ray白話文指南](https://guide.v2fly.org/advanced/wss_and_web.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E9%85%8D%E7%BD%AE)
```json
# Caddy v2 (recommended)

<mydomain.me> {
    log {
        output file /etc/caddy/caddy.log
    }
    tls {
        protocols tls1.2 tls1.3
        ciphers TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
        curves x25519
    }
    @v2ray_websocket {
        path /<your_path>
        header Connection *Upgrade*
        header Upgrade websocket
    }
    reverse_proxy @v2ray_websocket localhost:<your_port_Number>
}
```

> `<mydomain.me>` 請改成你的Domain不需`<>`
>
> `<your_path>` 請改成你的V2ray設定websocket路徑不需`<>`
>
> `<your_port_Number>` 請改成你的V2ray Port number不需`<>`

其他可以照抄

嚴格說起來caddy的設定檔因為v2是寫這份才開始導入更新的,所以大叔也不太熟,建議自己去看[Caddy的說明](https://caddyserver.com/docs/getting-started)

## Client端(Gateway)設定說明

### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/qv2ray.jpg" alt="qv2ray" style={{width: '25%'}} /> [Qv2ray](https://github.com/Qv2ray/Qv2ray)-Windows & Linux & macOS

這是一個基於Qt的V2ray圖形介面,基本上要搭配[V2ray-Core](https://github.com/v2fly/v2ray-core/releases)一起使用V2ray-Core更新的很快但是基本上它還是相容前三個版本所以問題不大

#### Windows

```
choco upgrade qv2ray v2ray -y
```

這一行基本上就都裝上了,只要打開設定弄一下就好了

#### Linux(Archlinux/Manjaro)

```
yay -Syu qv2ray v2ray
```

這樣就裝完了

#### Linux(其他)

官方的Github上有AppImage file可以抓下來直接使用

#### macOS

大叔買不起,不知道,不過官方的Github上面有dmg檔案,應該是抓下來就可以直接安裝使用才對

相關的說明請參考[Qv2ray官方文件](https://qv2ray.github.io/en/)

### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/unnamed.png" alt="unnamed" style={{width: '10%'}} />[BifrostV](https://play.google.com/store/apps/details?id=com.github.dawndiy.bifrostv) - Android

​       [<img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/google-play-badge.png" alt="google-play-badge" style={{width: '33%'}} />](https://play.google.com/store/apps/details?id=com.github.dawndiy.bifrostv)

按下去就裝完了,沒有辦法上Google play的同學你就想辦法弄到apk安裝囉可以利用Windows環境下的V2ray環境設定proxy讓手機/平板連上再安裝囉

至於手機上沒有google play的同學....那有機會開坑再說吧

使用請參考[強國高手寫的網頁](https://ssr.tools/342)

### <img src="https://raw.githubusercontent.com/Kiwi0093/graph/master/img/246x0w.png" alt="246x0w" style={{width: '33%'}} />[Shadowrocket](https://apps.apple.com/jp/app/shadowrocket/id932747118) - iOS

只要不是中國apple store帳號的捧油,應該都可以直接在app store上購買這個軟體(沒錯這是唯一一個要錢的,不過會用iPhone的人基本上都不差這點錢)

但是中國的捧油在沒有辦法的情況下只能[~~用這種旁門左道~~依靠這種好心人士](https://shadowsockshelp.github.io/ios/)不過好心人的方法很容易衍生其他安裝問題大叔不是專家沒辦法一一解決

只能靠你們這些求道者去感悟怎麼處理了...



# 結論

結論上來說最有效率的方法就是肉體翻牆,不過即使是大叔到現在還是沒辦法這麼做,所以這篇文章就給有需要的捧油作參考(更多是大叔自己的筆記)希望哪天裡面東西是因為不需要了而過時而非因為技術對抗失敗而過時...

