---
title: Photon OS安裝與設定
tags:
  - VM
  - Container
  - PhotonOS
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

:::tip
由於打算把所有的網路服務都逐步改成docker的方式,所以打算把底層的系統也換成Vmware針對docker等容器特化版的Linux - PhotoOS
:::

<img src='https://img.shields.io/badge/Kiwi-%E9%9B%96%E7%84%B6%E5%8E%9F%E4%BE%86%E6%98%AF%E5%9B%A0%E7%82%BA%E4%BD%BF%E7%94%A8ESXi%E7%9A%84%E9%97%9C%E4%BF%82%E6%89%80%E4%BB%A5%E7%89%B9%E5%88%A5%E6%8C%91Photon%20OS%2C%20%E4%BD%86%E6%98%AF%E7%94%A8%E4%B9%85%E4%BA%86%E8%A6%81%E6%98%AF%E4%BB%A5%E5%BE%8C%E6%8F%9B%E6%88%90PVE%E6%88%91%E5%8F%AF%E8%83%BD%E9%82%84%E6%98%AF%E6%8D%A8%E4%B8%8D%E5%BE%97Photon%20OS-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />
## Installation

下載 Image ISO，然後在 VMware workstation 或 VMware ESXi 上建立新的 VM（選擇 VMware PhotonOS 64 bits 或是 Linux Kernel 最新的 64 bits 都可以）。 用光碟開機後依照步驟做就好了。

基本上這個系統需要的 RAM 跟空間很小，但是你會需要 RAM 跟空間來跑 Docker。所以在建立的時候，請考慮你要使用的服務數量來設定你的 RAM 跟 HDD 空間。

## Basic Setup

**確認基本服務** 看一下基本的系統服務是否有開啟，例如 `open-vm-tools`：

Bash

```
systemctl status vmtoolsd.service
```

**帳號設定** 安裝的時候就會設定 root 密碼了。可以利用 `useradd` 再增加一般使用者（為了安全性）：

Bash

```
# 增加使用者 (-m 建立家目錄, -g 指定 root 群組)
useradd -m -g root $(your_id)

# 替你的帳號設定密碼
passwd $(your_id)
```

因為使用上還是很常會需要 root 權限，所以可以依照個人喜好決定：看是要建立額外帳號然後登入後用 `su` / `sudo`，或者是直接修改 `/etc/ssh/sshd_config` 改成允許 root SSH 登入都可以。

## 網路設定 (Systemd-Networkd)

安裝後的系統預設是 DHCP 開啟的狀態。若是只要單 IP，並且有另外的 DHCP Server 加上 MAC Address 控制的話，是可以不用動的。有其他固定 IP 需求的，需要去修改以下檔案。

**關閉 DHCP** 編輯 `/etc/systemd/network/99-dhcp-en.network`：

Ini, TOML

```
[Match]
Name=e*

[Network]
DHCP=no    # 這個改成no來關閉dhcp
IPv6AcceptRA=no
```

**固定 IP 設定方法** 編輯 `/etc/systemd/network/10-static-en.network`：

Ini, TOML

```
[Match]
Name=ens160                                # 網卡名稱

[Network]
Address=10.1.10.9/24                       # IP位置,可重複多次定義多個IP
Gateway=10.1.10.1                          # Gateway IP
DNS=10.1.10.1                              # DNS IP
# NTP設定,用空白隔開不同Server
NTP=tock.stdtime.gov.tw watch.stdtime.gov.tw time.stdtime.gov.tw 
# 關閉IPV6
LinkLocalAddressing=no
IPv6AcceptRA=no
```

**設定網路介面名稱** 編輯 `/etc/systemd/network/10-ethusb0.link`：

Ini, TOML

```
[Match]
MACAddress=00:00:00:00:00:00               # 卡號

[Link]
Description=USB to Ethernet Adapter        # 這張網路卡的說明
Name=ethusb0                               # 介面名字
```

想建立多張網卡的話，就建立三個檔案分開定義卡號就好了。

## 系統更新與安裝 Package

> **修正筆記：** Photon OS 底層預設的套件管理工具其實是 `tdnf`。雖然打 `yum` 它也有做 alias 會通，但建議習慣直接改打 `tdnf`。

Bash

```
tdnf update -y          # 升級系統packages
tdnf install -y vim     # 安裝vim
tdnf search python      # 尋找所有名字裡有python的package
```

## 掛載 SMB 分享的檔案

基本上會把 Docker 的 volume 資料夾先 mount 上 NAS 上的備份用資料夾，這樣可以：

1. 簡單備份。
    
2. 減少 PhotonOS 的 HDD 空間需求。
    
3. 針對某些需要 NAS 上檔案的 Docker 服務可以直接 access（基本上我的音樂檔案都是放在 NAS 上面，所以用 SMB/CIFS 掛載很方便）。
    

先在 PhotonOS 上利用 tdnf 安裝：

Bash

```
tdnf install -y cifs-utils
```

然後建立憑證檔 `/root/secret`：

Ini, TOML

```
username=sushi    # SMB ID
password=yummy    # SMB ID的Password
```

> 記得把 `/root/secret` 的權限改成 0400，比較安全 (`chmod 0400 /root/secret`)。

接著修改加入 `/etc/fstab`：

Plaintext

```
\\winbox\getme /mnt/win cifs user,uid=500,rw,noauto,suid,credentials=/root/secret 0 0
```

**使用 Systemd 開機自動掛載** 之前試過用 `autofs`（這個在 PhotonOS 上測試無效），也試過直接靠 `/etc/fstab` 的 auto 掛載，但因為 auto 的啟動速度比網路連線還快，很容易失敗。所以最保險的方法，還是建立 systemd 的 service，並指定在網路連通後才執行。

編輯 `/etc/systemd/system/mount-nas.service`：

Ini, TOML

```
[Unit]
Description=mount CIFS
# 修正為網路確定連線後再執行
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/bin/mount -a
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

重點是要定義 `After=network-online.target`，這樣才會在真正有網路後進行。弄好後啟動服務：

Bash

```
systemctl daemon-reload
systemctl enable --now mount-nas.service
```

## 延伸 Tips：擴容

實際跑一陣子後，會發現不管怎麼省吃儉用，一開始給予的 VM 硬碟大小，很大機率會不夠用然後需要擴大（實際上我已經遇到兩三次了）。 以前用 Windows VM 的時候，解決方案通常是再加一個 HDD 然後掛其他槽解決，但是使用 Photon OS 的情況下，大多數都會希望直接擴大原有的 `/dev/sda` 就好了。

**1. ESXi 調整 HDD 容量** 這個就不用特別說明，去 ESXi 後台直接修改讓 HDD 大小增加就好了。

**2. 進入系統重新掃描並擴展分割區** 先安裝 parted（若沒裝的話）：

Bash

```
tdnf -y install parted
```

接著照著敲指令：

Bash

```
# 先 scan 變更，讓系統抓到你在 ESXi 剛加上的空間
echo 1 > /sys/class/block/sda/device/rescan

# 進入 parted 介面
parted /dev/sda
```

進入 Parted 之後的互動：

Plaintext

```
# 列出你的分割區，若有提示你沒用上全部的硬碟要不要 fix 就選 f (或輸入 fix) 去修正
(parted) print

# 看一下你主要使用的是第幾個分割區 (通常是 1 或 3)。
# 使用 resizepart 把空間都用上 (100%)
(parted) resizepart 1 100%

# 完成後離開 Parted
(parted) quit
```

**3. 擴展檔案系統 (File System)**

> **修正筆記：** `resize2fs` 後面要接的是「分割區」名稱 (例如 `/dev/sda1`)，而不是整顆硬碟 (`/dev/sda`)。

使用 `resize2fs` 指令把你擴大後的空間 fs 弄好（假設你剛擴容的是第一個分割區）：

Bash

```
resize2fs /dev/sda1
```

搞定後可以用 `df -H` 指令看一下效果！