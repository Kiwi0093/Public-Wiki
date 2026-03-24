---
slug: 2020/07/archlinux-gateway
title: 企鵝育成-Archlinux Gateway-彙整篇
date: 2020-07-07
description: 說明如何使用archlinux當作homelab的Gateway
tags: [Linux, Server, V2Ray, Old-Blog, Archive]
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

換了新的Blog但是還沒想到內容要寫什麼,所以就想說先把之前寫的筆記再整理一次做個精簡的增補版(其實就是把一些後來發現不好用的部份拿掉或改掉)

並且練習用Github來管理大叔自己寫的script,不過因為很多是私人性質的所以應該會放在不公開的Repo裡面然後另外寫一個公開版的放在外面供有需要的人使用

{/* 這裡插入切分線 */}
<!--truncate-->


# 期望環境

## 基本條件

會使用Archlinux而非使用大叔長年使用的FreeBSD來作為一個網路環境的主要Gateway的最大因素就是V2Ray+iptables的翻牆組合(單看V2ray的話其實FreeBSD也可以裝啦,但是沒有iptables),從網路上看到的所有教範幾乎清一色都是這個搭配,由於大叔也不是什麼真正的高手所以就隨波逐流挑個看的順眼的Linux destro來使用,在這裡可能有人會問為什麼大叔不乾脆就跟教範一樣直接用Ubuntu就好了,在這裡只能說因為大叔還是有點傲驕的....

其實本來是想更極端用Gentoo的,但是過去那個光安裝系統就花了我三天(因為一堆compile)的慘痛過去(那時候機器不夠力也是啦)所以就退而求其次的改用幾乎都是binary安裝的Archlinux

## 期望

基本上最大的期望就是打造一個不須額外做什麼就可以跟在台灣家裡類似的網路環境,基於此一個大型的NAT內部網路以及從Gateway端就把牆翻好就是最基本中的基本要求

## 規劃藍圖

![Network_top](https://raw.githubusercontent.com/Kiwi0093/graph/master/img/Network_top.png)

# 事前準備
## 基本工具&設備
### 硬體
* 一台可以跑VMware ESXi的Server硬體
* 一台符合網路需求的Wireless AP
### 軟體工具
* [VMware ESXi](https://www.vmware.com/products/esxi-and-esx.html) 5.5 or 5.0 - (主要是因為client的關係,其實也可以用最新的版本)或是其他類型的VM例如Zen之類的
* [Archlinux install Image](https://www.archlinux.org/) - 這個是主角類似~~MS-06F~~ RX-78之於初代鋼彈
* [vSphere Client](https://players.brightcove.net/1534342432001/Byh3doRJx_default/index.html?videoId=2011143030001) - 這個是client來控制VMware ESXi

現在VMWare將Esxi改為[vSphere Hypervisor](https://www.vmware.com/products/vsphere-hypervisor.html)功能更多但是不確定他的費用以及大叔沒有真的用過,所以只是先放著當參考
若是未來有機會架設新的VMware server的話倒是可以試試看

## 參考文獻

表示尊重,我還是把先前寫的時候參考的文件都列在這裡

* [Arch Wiki](https://wiki.archlinux.org/) - 非常詳細的Arch Wiki幾乎所有Archlinux的設定都有相關說明,而且很多都有中文翻譯非常好用
* [Archlinux Install Guide](https://wiki.archlinux.org/index.php/Installation_guide_(正體中文)) - 這是中文的官方安裝說明文件,算是安裝的最基礎,實際上就是Arch Wiki的一部分
* [Miro's Blog](https://mirokaku.github.io/Blog/2016/ArchLinux-install-notes/) - 這份Archlinux的安裝筆記寫得很不錯

另外一個參考的網頁,不知道為什麼這次整理的時候消失了...所以我就不再放上去,但是還是很感謝前輩們的努力與分享

# 安裝步驟

## 基本概念

由於大叔~~是個懶鬼~~這個主要是拿來安裝Gateway用的所以需要盡可能安裝中不要東查西看的,,縱使前面列了一堆安裝的重點,最終還是要回到用簡易的安裝script來代替大叔在網路不夠好用一切從簡的條件下進行安裝

## 基本流程

因為Arch的安裝流程中會因為chroot的關係無法一個script跑完所有的動作,而大叔也沒高手到chroot的同時還可以自動跑另一個script,所以script分兩次手動輸入

開機後第一個scrip

`zsh <(curl -L -s http://my_home.or.any.vps/arch-install-before-chroot.sh)`

他會自動跑到chroot後停住,接著在用第二劑

`zsh <(curl -L -s http://my_home.or.any.vps/arch-install--after-chroot.sh)`

這兩個script的執行方式說穿了就是利用*curl*指令讓shell直接執行在別的web server上的script
這在Live環境下要跑script來說是個相對方便的作法,但是這就需要事先準備可以放script的web server並且還得擔心script內一些比較敏感的安全性問題,不能說是個萬無一失的作法, 所以大叔的作法是把script customize後先放在私密的地方,要用的時候放到VPS或是其他server上跑完後就delete
這是比較麻煩的

## Script說明

### 顏色定義
ASCII有顏色的定義如下

|Color|Code|Color|Code|
|---|---|---|---|
|Black|0;30|Dark Gray|1;30|
|Red|0;31|Light Red|1;31|
|Green|0;32|Light Green|1;32|
|Brown/Orange|0;33|Yellow|1;33|
|Blue|0;34|Light Blue|1;34|
|Purple|0;35|Light Purple|1;35|
|Cyan|0;36|Light Cyan|1;36|
|Light Gray|0;37|White|1;37|

有需要的同學可以依照個人喜好變更以下Script內的顯示顏色

### Scrip內容說明

Script內的一些基本解說

`echo -e "<what ever you like>"`

這個語法是在跑Script的時候想要顯示在螢幕上的字串,照上面打的話會出現`<what ever you like>`

```bash
變數=XYZ
${變數}
```

這個語法主要是搭配最前面的變數定義,與到重複會使用的就用這種方式來省字數,在下面我主要是把顏色設定為變數,這樣只要你不想搞七彩字串的話只要改這裡就好了

Update7/12: 大叔把其中非通用的部分改成輸入型的了,所以這一份script後面可以放到github上面供要用的人直接使用

#### arch-install-before-chroot.sh

```bash
#-------------------------------------------------------------------------------------------------------------------------
#(從Iso boot後直到完成change root內所有安裝/調整動作)
#-------------------------------------------------------------------------------------------------------------------------
#!/bin/zsh
#Parmeter Define
COLOR='\033[1;35m'
NC='\033[0m'

#start ntp
echo -e "${COLOR}Starting NTP Service${NC}"
timedatectl set-ntp true
echo -e "${COLOR}Finished.${NC}"

#Modify Mirrorlist to setting country
echo -e "${COLOR}Starting Modify mirrorlist to China servers${NC}"
echo -n "${COLOR}Please Enter which Country you like(ie. United_State or China)${NC}"
read COUNTRY
sed -i '/Score/{/$COUNTRY/!{n;s/^/#/}}' /etc/pacman.d/mirrorlist
echo -e "${COLOR}Finished.${NC}"

#Fdisk
echo -e "${COLOR}Partition your HDD please create 1 data as sda1 and 1 swap as sda2${NC}"
fdisk /dev/sda
echo -e "${COLOR}Finished.${NC}"

#Format
echo -e "${COLOR}Format /dev/sda1 as EXT4 format${NC}"
mkfs.ext4 /dev/sda1
echo -e "${COLOR}Finished.${NC}"
echo -e "${COLOR}Format /dev/sda2 as Linux Swap${NC}"
mkswap /dev/sda2
echo -e "${COLOR}Finished.${NC}"
echo -e "${COLOR}Mount /dev/sda1 to /mnt${NC}"
mount /dev/sda1 /mnt
echo -e "${COLOR}Finished.${NC}"
echo -e "${COLOR}Mount Swap${NC}"
swapon /dev/sda2
echo -e "${COLOR}Finished.${NC}"

#Install
echo "${COLOR}Starting Install Archlinux into /mnt${NC}"
pacstrap /mnt base vim zsh curl
echo -e "${COLOR}Finished.${NC}"

#fstab
echo "${COLOR}Starting Gernerate fstab${NC}"
genfstab -U -p /mnt >> /mnt/etc/fstab
echo -e "${COLOR}Finished.${NC}"

#Copy Zsh
echo "${COLOR}Starting Copy ZSH setting file to new Archlinux${NC}"
cp -Rv /etc/zsh /mnt/etc/
echo -e "${COLOR}Finished.${NC}"

# Change root
echo -e "${COLOR}Change root to new Archlinux${NC}"
arch-chroot /mnt /bin/zsh
#------------------------------------------------------------------------------------------------------------------------
#(以下是什麼都弄完了只剩下重開機)
#------------------------------------------------------------------------------------------------------------------------
echo -e "${COLOR}Finished Installation, will reboot, Good luck${NC}"
# Reboot
echo -e "${COLOR}Rebooting...${NC}"
reboot
```

基本上這個Script除了分割的選項可能需要調整以外其實都沒什麼好動的,基於我這台都是拿來當VM上的Gateway,自然沒必要把分割弄得很麻煩,有其他需要的同學可以參照官方的安裝說明調整你想要的分割設定

預設的分割結果為

```bash
/dev/sda1為主要資料
/dev/sda2為Swap
```

#### arch-install-after-chroot.sh

這份可以說是主要的安裝Script,內容有很多需要事先修改與設定的,我盡可能的把他做成變數放在最前面

```bash
#------------------------------------------------------------------------------------------------------------------------
#(所有動作都是在change root內完成的)
#-------------------------------------------------------------------------------------------------------------------------
#!/bin/zsh
#Parameter Define
COLOR='\033[1;34m'
NC='\033[0m'

#update package
echo -e "${COLOR}Start Pacman Update${NC}"
pacman -Syuu
echo -e "$COLOR}Finished.${NC}"

#locale-gen to add en_US & zh_TW
echo -e "${COLOR}Setting local file${NC}"
echo "en_US.UTF-8 UTF-8" >> /etc/locale.gen
echo "zh_TW.UTF-8 UTF-8" >> /etc/locale.gen
echo -e "#{COLOR}Generate locale.conf${NC}"
locale-gen
echo -e "${COLOR}Setting locale.conf${NC}"
echo LANG=en_US.UTF-8 > /etc/locale.conf
export LANG=en_US.UTF-8
echo -e "$COLOR}Finished.${NC}"

#change Timezone to CTS(Taipei)
echo -e "${COLOR}Change Time Zone to Asia/Taipei & Set Hardware time${NC}"
ln -sf /usr/share/zoneinfo/Asia/Taipei /etc/localtime
hwclock --systohc --utc
echo -e "$COLOR}Finished.${NC}"

#Network
echo -e "${COLOR}Setting 'Gateway' as hostname${NC}"
echo Gateway > /etc/hostname
echo "127.0.0.1 localhost Gateway" >> /etc/hosts
echo -e "${COLOR}Finished.${NC}"

echo -e "${COLOR}Define your NIC by Mac address${NC}"
echo -n "${COLOR}Please Enter your MAC address for your outside NIC${NC}"
read OUTSIDE
echo 'SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="$OUTSIDE", NAME="EXT0"' > /etc/udev/rules.d/10-network.rules
echo -n "${COLOR}Please Enter your MAC address for your inside NIC${NC}"
read INSIDE
echo 'SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="$INSIDE", NAME="INT0"' >> /etc/udev/rules.d/10-network.rules
echo -e "${COLOR}Finished.${NC}"

echo -e "${COLOR}Define your PPPOE Setting${NC}"
echo "Description='EXT0 PPPOE SETTING'" > /etc/netctl/EXT0.service
echo "Interface=EXT0" >> /etc/netctl/EXT0.service
echo "Connection=pppoe" >> /etc/netctl/EXT0.service
echo -n "${COLOR}Please Enter your PPPOE acount:${NC}"
read ISP
echo "User='${ISP}'" >> /etc/netctl/EXT0.service
echo -n "${COLOR}Please Enter your PPPOE password${NC}"
read ISPPW
echo "Password='${ISPPW}'" >> /etc/netctl/EXT0.service
echo "ConnectionMode='persist'" >> /etc/netctl/EXT0.service
echo "UsePeerDNS=false" >> /etc/netctl/EXT0.service
echo -e "${COLOR}Enable EXT0{NC}"
netctl enable EXT0.service
echo -e "${COLOR}Finished.${NC}"

echo -e "${COLOR}Define your Private Gateway IP for INT0${NC}"
echo "Description='INT0 IP SETTING'" > /etc/netctl/INT0.service
echo "Interface=INT0" >> /etc/netctl/INT0.service
echo "Connection=ethernet" >> /etc/netctl/INT0.service
echo "IP=static" >> /etc/netctl/INT0.service
echo -n "${COLOR}Please Enter your Gateway IP address:${NC}"
read GATEWAYIP
echo "Address=('${GATEWAYIP}/24')" >> /etc/netctl/INT0.service
echo -e "${COLOR}Enable INT0${NC}"
netctl enable INT0.service
echo -e "${COLOR}Finished.${NC}"

#Initramfs
echo -e "${COLOR}Initramfs your Linux${NC}"
mkinitcpio -p linux
echo -e "${COLOR}Finished.${NC}"

#Root Password
echo -e "${COLOR}Set your root password${NC}"
passwd
chsh -s /bin/zsh
echo -e "${COLOR}Finished.${NC}"

#add User
echo -e "${COLOR}Add user account:${NC}"
echo -n "$What ID you want:${NC}"
read YOURID
useradd -m -g root -s /bin/zsh ${YOURID}
passwd ${YOURID}
echo -e "${COLOR}Finished.${NC}"

echo -e "${COLOR}Add $YOURID into sudo list${NC}"
pacman -Syu sudo
echo "$YOURID ALL=(ALL) ALL" >> /etc/sudoers

#install Tools
echo -e "${COLOR}Install Packages Microcode/Bootloader - grub/dnsutils/open-vm-	tools/v2ray${NC}"
pacman -Sy intel-ucode grub dnsutils open-vm-tools v2ray screen
echo -e "${COLOR}Finished.${NC}"

#install Bootloader
echo -e "${COLOR}Install grub Boot Loader into /dev/sda1${NC}"
grub-install --target=i386-pc /dev/sda1
grub-mkconfig -o /boot/grub/grub.cfg
echo -e "${COLOR}Finished.${NC}"

#V2ray config.json get
echo -e "${COLOR}Fetch V2ray config.json and replace${NC}"
echo -n "${COLOR}Please Enter where you put the file:${NC}"
read link
echo -n "${COLOR}Please Enter the file name:${NC}"
read conffile
wget $Link/$conffile
mv -f  ./$conffile /etc/v2ray/config.json
echo -e "${COLOR}Finished.${NC}"

#Set Nat
echo -e "${COLOR}Open package fowrading${NC}"
echo "net.ipv4.ip_forward=1" > /etc/sysctl/30-ipforward.conf
echo -e "${COLOR}Finished.${NC}"

echo -e "${COLOR}Create Iptable start script${NC}"
echo -n "${COLOR}Please Enter your V2ray Server IP:${NC}"
read VPSIP
echo "#Re-direction TCP" > /etc/iptables/iptable.sh
echo "iptables -t nat -N V2RAY" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d 0.0.0.0/8 -j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d 10.0.0.0/8 -j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d 127.0.0.0/8 -j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d 169.254.0.0/16 -j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d 172.16.0.0/12-j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d 192.168.0.0/16 -j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d 224.0.0.0/4 -j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d 240.0.0.0/4 -j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -d ${VPSIP} -j RETURN" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A V2RAY -p tcp -j REDIRECT --to-ports 12345" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A PREROUTING -p tcp -j V2RAY" >> /etc/iptables/iptable.sh
echo " " >> /etc/iptables/iptable.sh
echo "#Natd" >> /etc/iptables/iptable.sh
echo "iptables -t nat -A POSTROUTING -s 192.168/16 -j MASQUERADE" >> /etc/iptables/iptable.sh
chmod 750 /etc/iptables/iptable.sh
echo -e "${COLOR}Finished.${NC}"
echo -e "${COLOR}Create Systemd Service${NC}"
echo "[Unit] > /etc/systemd/system/iptables.service
echo "Description=iptables rules for V2Ray Daemon >> /etc/systemd/system/iptables.service
echo " " >> /etc/systemd/system/iptables.service
echo "[Service]" >> /etc/systemd/system/iptables.service
echo "ExecStart=/bin/sh /etc/iptables/iptable.sh" >> /etc/systemd/system/iptables.service
echo " " >> /etc/systemd/system/iptables.service
echo "[Install]" >> /etc/systemd/system/iptables.service
echo "WantedBy=multi-user.target" >> /etc/systemd/system/iptables.service
systemctl enable iptables.service
echo -e "${COLOR}Finished.${NC}"

#Finished install
sync
sync
sync
exit
```

這份Scrip有以下假設前提

1. 這台機器是Intel CPU
2. V2ray的config.json已經提前寫好了,並且是配合V2ray 4.20版的DNS功能,可以取消Dnsmasq的安裝與設定(變得更加簡潔了）

# 結論
在原來的Blog內我寫了兩篇關於這個Gateway的自動安裝,實際生活上我也用了幾次算是有真的實驗過得,這個script其實可以直接拿回去把變數改一改就可以直接用了
