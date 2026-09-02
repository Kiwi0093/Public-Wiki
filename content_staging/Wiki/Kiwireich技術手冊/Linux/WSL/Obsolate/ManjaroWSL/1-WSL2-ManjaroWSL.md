---
title: ManjaroWSL in WSL2
tags:
  - Linux
  - Manjaro
  - Windows
  - WSL
---

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Manjaro](https://img.shields.io/badge/Manjaro-Supported-green?style=plastic&logo=manjaro)

:::tip
現在最新的作法是完全透過MS store安裝WSL2+ArchWSL, 然後就好了
:::

>:::info
>因為手上有台機器的windows拿到了權限可以安裝WSL來用..就來加裝ManjaroWSL
>:::


# Pre-Start

首先要先把WSL/WSL2弄好

* 用管理者權限打開`powershell`並執行下列指令來開啟Windows Subsystem for Linux

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

* 用管理者權限打開`powershell`並執行下列指令來開啟Virtual Machine

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

* Download [WSL-Kernel](https://www.catalog.update.microsoft.com/Search.aspx?q=wsl) and Install

* Set Default to WSL2

```powershell
wsl --set-default-version 2
```

# Install & Initialize ManjaroWSL

## Download

[ManjaroWSL](https://github.com/sileshn/ManjaroWSL)很佛心已經包好了直接[到這裡](https://github.com/sileshn/ManjaroWSL/releases)下載最新的zip檔

## 放置＆安裝

把下載好的zip檔放在你預設要作為ManjaroWSL整個系統的地方並解壓後

打開powershell

```powershell
./Manjaro.exe
```

就會自動進行解壓然後再執行一次

```powershell
./Manjaro.exe
```

## Initialize

首先依照提示進行是否要resize及建立new user

這裡就都選`No`理由如下

* 不會用到250GB以上 尤其是它都會mount windows的槽到/mnt/

* User的部份後面的script會建立,為了好看的zsh console以及Xfce還是後面建會比較好

# Configure System

Run Script as root

```bash
bash <(curl -L -s https://kiwi0093.github.io/script/WSL/manjaro.sh)
```

### Script使用注意

* 一開始的時候自己輸入國家會比讓它跳最快的快

* 中間需要編輯`/etc/wsl.conf`的時候（就是會忽然跑出一個`vi``的界面)

```bash
[Users]
#加入以下資訊
default = <User Name you created and wish to be default>
```

好了之後`:wq`存檔跳出

### Script說明

詳細的script內容我就不貼了

#### Mirrorlist & System Upgrade

```bash
# Basic system configuration
echo -e "${color1}Basic system configuration started${NC}"
echo -e "${color1}Setting your Repo${NC}"
echo -e "${color2}Do you want to set location for the mirror-list?(Y for Location, others for fastest 3 location)${NC}"
while :
do
        read LT
        case $LT in
                Y)
                        echo -e "${color2}Please input location you want(EX, tw for Taiwan, us for USA)\n${NC}"
                        read LT2
                        pacman-mirrors -c $LT2
                        break
                        ;;
                *)
                        pacman-mirrors --fasttrack 3
                        break
                        ;;
        esac
done
echo -e "${color1}Update system${NC}"
pacman -Syyu
```

簡單的說就是弄個選項來跑`pacman-mirrors` & `pacman -Syyu`

#### Basic Tools Install

```bash
echo -e "${color1}Install Basic tools${NC}"
pacman -S git yay wget curl rsync sshpass zsh manjaro-zsh-config \
ttf-nerd-fonts-symbols ttf-meslo-nerd-font-powerlevel10k \
ttf-meslo-nerd-font-powerlevel10k powerline-fonts \
nerd-fonts-noto-sans-mono vim wireguard-tools systemd-resolvconf htop --noconfirm
```

在這個區塊裝上`zsh`及其相關的美化工具, `git` `yay` `rsync` `wireguard`及其相關工具

#### Xfce4及Manjaro theme

```bash
echo -e "${color1}Install Xfce4 for GUI${NC}"
pacman -S xfce4-gtk3 xfce4-goodies xfce4-terminal network-manager-applet \
xfce4-notifyd-gtk3 xfce4-whiskermenu-plugin-gtk3 tumbler engrampa lightdm \
lightdm-gtk-greeter lightdm-gtk-greeter-settings manjaro-xfce-gtk3-settings \
manjaro-settings-manager --noconfirm
```

這段就是抄Manjaro官方文件的

#### GUI Tools & 中文

```bash
echo -e "${color1}Install GUI$ tools${NC}"
pacman -S terminator brave-browser tigervnc gnome-pie --noconfirm
echo -e "${color1}Install Chinese Environment${NC}"
pacman -S adobe-source-han-serif-tw-fonts adobe-source-han-serif-hk-fonts \
adobe-source-han-serif-cn-fonts adobe-source-han-sans-tw-fonts \
adobe-source-han-sans-hk-fonts adobe-source-han-sans-cn-fonts \
adobe-source-han-serif-jp-fonts adobe-source-han-sans-jp-fonts \
fcitx fcitx-chewing fcitx-configtool fcitx-mozc fcitx-configtool --noconfirm
```

一樣沒裝什麼

其他的部份就是一些設定檔的匯入與帳號建立沒什麼好看的比較值得看的是

#### Systemd on WSL

```bash
echo -e "${color1}Change your root password & shell to zsh${NC}"
sudo -u $USERN yay -S genie-systemd-git
echo 'genie -i' > /etc/init.wsl
chmod +x /etc/init.wsl
genie -i
genie -c systemctl disable auditd.service
genie -c systemctl disable multipathd.service
genie -c systemctl disable systemd-modules-load.service
genie -c systemctl enable systemd-resolved.service
genie -c systemctl start systemd-resolved.service
```

經過實驗,大概能簡單又正常跑起來的就只有`genie-systemd-git`了他的原理我也不是很懂

反正就是裝好之後記得用

`genie -i`來初始化然後可以用`genie -c` 來執行指令或是開新的`shell`也可以

## ### 建立desktop shortcut

使用[GWSL]([GWSL | gwsl](https://opticos.github.io/gwsl/)),先進行設定

`GWSL Distro Tools`--> `Display/Audio auto exporting` 開啟

`GWSL Distro Tools` --> `LibGL Indirect`開啟

然後

`Shortcut Creator`

![](https://raw.githubusercontent.com/Kiwi0093/graph/master/2022/03/16-15-22-35-gwsl-shortcut.PNG)

* Shortcut Label - 這個是你的Windows start Menu會出現的名字隨你定義

* shortcut Command - 因為是Xfce4所以固定是`startxfce4`

* Display Mode - 要想整個desktop顯示只能選`single Window`或是`Fullscreen`

* Keep Xserver Instance - Display Mode若是選`Fullscreen`的時候這個要選`true` 不然會閃退

好了之後可以先`Test Configuration`測試一下是不是自己要的,若沒問題就`Add to Start Menu``

# 結語

老實說一看到 `WSL`的時候很讓人開心,發現有`Manjaro`的時候超開心的然後真的裝上後

就沒那麼開心了,理由如下

* 速度沒有想像的快,尤其是開在desktop內跑的

* 所有multiscreen跑的程式都不能切換輸入法（或是可以試試預設改用chewing然後只用shift切換？）

* Desktop模式放置一段時間就會死掉..連同在裡面跑的都一起.....

* systemd雖然勉強可以跑但是感覺還是差一大截

所以說若是只需要一個linux shell拿來跑點東西或是有什麼原因非得同時跑Windows+Linux的時候是個好選擇（應該會越來越好用）但是若要跟真的Linux Desktop一比較就蠻渣的

甚至比不上VNC另外一台Linux Desktop的效能...

不過就是有特殊用途才用呀～～～～