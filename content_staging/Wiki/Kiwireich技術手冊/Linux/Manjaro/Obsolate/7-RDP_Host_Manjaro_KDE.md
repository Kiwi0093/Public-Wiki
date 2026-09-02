---
title: Majaro KDE的RDP Host設定
tags:
  - Linux
  - Manjaro
  - Windowsc
---

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Manjaro](https://img.shields.io/badge/Manjaro-Supported-green?style=plastic&logo=manjaro)

:::tip
這個系列現在已經不適用了,只是留個紀念
:::

>:::tip
>之前為了家裡要有個client console以便使用,所以我弄了個XFCE的VNC server
>不過我自己比較喜歡用KDE所以...
>:::
# 參考文獻

[How to make Manjaro (KDE 5) work as a xrdp server? · Issue #1456 · neutrinolabs/xrdp · GitHub](https://github.com/neutrinolabs/xrdp/issues/1456)

# 基本作法

## 安裝`xrdp` & `xorgxrdp`

```bash
yay -S xrdp xorgxrdp
```

然後啟動服務

```bash
sudo systemctl enable --now xrdp.service
sudo systemctl enable --now xrdp-sesman.service
```

然後就可以用了基本上什麼其他設定都不用改

# 注意事項

請記得把`~/.xinitrc`裡的內容改一下

```bash
get_session(){
#    local dbus_args=(--sh-syntax --exit-with-session)
    local dbus_args=(--sh-syntax)
    case $1 in
#記得把--exit-with-session拿掉不然會卡住
```