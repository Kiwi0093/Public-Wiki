---
title: WSL & WSLg Tips for ArchWSL
tags: [Linunx, Windows]

---
> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 

:::tip
現在`WSLg`基本上已經內建在WSL安裝內，所以不再需要弄個`GWSL`來進行設定
順便紀錄一下`ArchWSL`的一些設定以免忘記
:::

# Basic Setting

基本上沒打算用GUI的同學只需要弄這塊就好了

## Archlinux-keyring

```bash
# 初始化keyring
sudo pacman-key --init
# Poplutae keyring
sudo pacman-key --populate
# 套用及更新 (若需要調整mirrorlist，可以先修改/etc/pacman.d/mirrorlist)
sudo pacman -Syu
```

這一步驟是ArchWSL必備的，不然沒有正確的keyring什麼都沒辦法裝

## /etc/wsl.conf

```bash
# 使用systemd
[boot]
systemd=true
# 設定預設的使用者
[users]
default=<username>
```

## yay

```bash
# 需要先安裝上go, git, base-devel
cd <what ever you like>
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

yay為目前安裝`AUR`最方便的工具所以強烈建議裝上

## zsh & manjaro-zsh-config (Optional)

請參考[其他篇wiki進行設定](https://kiwi0093.github.io/wiki/wiki/Misc/Zsh/1-Zsh&Powerlevel10k/)

## Tmux + oh-my-tmux (Optional)

請參考[其他篇wiki進行設定](https://kiwi0093.github.io/wiki/wiki/Misc/Tmux/1-Tmux+oh-my-tmux/)

## NeoVim + NvChad (Optional)

這個在[其他篇wiki內有寫請參考](https://kiwi0093.github.io/wiki/wiki/Misc/Vim/NeoVim%20+%20NvChad/1-Basic%20Install%20&%20Configure/)

## npm + npm-check-update ...etc(Optional)

這個是我個人喜歡用這個來管理我在Github上的Blog & Wiki所需
請參考[其他的wiki內容](https://kiwi0093.github.io/wiki/wiki/Network/Hexo/3-Hexo-setting/)

# GUI(WSLg)

## X server

參考資料：

* [Bug of WSL Preview - Empty /mnt/wslg/.X11-unix & /tmp/.X11-unix Directory](https://github.com/microsoft/wslg/issues/782)

```bash
# 檢查Display為:0
echo $DISPLAY
:0

# 檢查/mnt/wslg/.X11-unix存在，以及是否為 /tmp/.X11-unix -> /mnt/wslg/.X11-unix
ls -la /mnt/wslg
ls -la /tmp

#若/mnt/wslg/.X11-unix存在但沒有link到/tmp/.X11-unix
sudo rm -r /tmp/.X11-unix
ln -s /mnt/wslg/.X11-unix /tmp/.X11-unix
```

然後測試你的GUI軟體是否可以正確的執行若可以執行下一步，若不行...請翻文件....

```bash
/etc/tmpfiles.d/wslg.conf
---

# TYPE    PATH        Mode    UID    GID Age    Argument
L+    /tmp/.X11-unix    -        -    -    -    /mnt/wslg/.X11unix
```

@powershell > wsl --shutdown
然後重新進入WSL就可以了

## dolphin + breeze (Optional)

Dolphin是KDE的文件管理器(類似windows的explore)
只裝dolphin會有缺icon的問題發生所以要裝上KDE的theme - breeze才會正常

```bash
yay -S breeze dolphin
```

## Remmina + freerdp (Optional)

這個是個很好用的rdp client，不過remmina只是個皮，要裝上freerdp才能RDP到其他RDP server

```bash
yay -S remmina freerdp
```

## Brave (Optional)

總要有瀏覽器..不然GUI要幹麻

```bash
yay -S brave-bin
```

## Fcitx (Optional)

基本上因為我們不會在WSL內安裝完整的桌面環境所以在挑選Fcitx的時候只能用Fcitx4的版本所以不要假會去裝Fcitx5...
詳細的內容我放在[其他的wiki內，請參考](https://kiwi0093.github.io/wiki/wiki/Linux/Tips/6-Fcitx/)