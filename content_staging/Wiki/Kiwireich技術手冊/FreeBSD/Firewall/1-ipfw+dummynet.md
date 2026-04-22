---
title: IPFW流量控制
tags:
  - FreeBSD
  - Network
date: 2026-04-21
description: 利用ipfw來進行網路速度限制
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 

:::tip
### FreeBSD Gateway可以利用ipfw來達成流量限制的功能,需要搭配`dummynet`才能正常作動

:::

## Dummynet

### 動態載入

由於現在都是使用Generic的Kernel(減少compile Kernel的動作)所以使用`kldload`來載入`dummynet.ko`

#### 手動載入:

```bash
kldload dummynet
```


想要確認有沒有跑起來請用

```bash
kldstat
```


這個指令會列出所有動態載入的`.ko`，請確認其中包含`dummynet.ko`

#### 開機自動載入:

為了讓設定在重開機後依然生效，請修改 `/boot/loader.conf`：

```bash
#/boot/loader.conf
dummynet_load="YES"
```

之後重開機的時候就會自動載入了

## ipfw 系統設定


`/etc/rc.conf`

這部分定義系統啟動時如何處理防火牆。

```Bash
# /etc/rc.conf
firewall_enable="YES"
firewall_script="/etc/ipfw.conf"  # 設定檔路徑
firewall_type="unknown"           # 告訴系統我們要跑自己的 script
natd_enable="NO"                  # 不啟動 natd
```

## 流量限制實戰範例

`/etc/ipfw.conf`

這是最核心的部分。2026 年的建議做法是將定義與規則分開。

```Bash
#!/bin/sh
# 定義 ipfw 指令路徑
IPFW="/sbin/ipfw"

# --- 定義介面 ---
EXT_IF="ext0"
INT_IF="int0"

# --- 定義網路與 IP ---
DMZ_NET="192.168.0.0/24"
GUEST_NET="192.168.2.0/24"
VPN_NET="10.8.0.0/24"       # 修正：補足原本缺失的定義
P2P1_IP="192.168.0.100"     # 修正：補足原本缺失的定義
P2P2_IP="192.168.0.101"

# --- 定義頻寬類型與速度 ---
P2P_UP="100KBytes/s"
VPN_UP="500KBytes/s"
RDP_P2P="500KBytes/s"
SERV_UP="350KBytes/s"
GUEST_BAND="30KBytes/s"

# --- 規則開始 ---

# 1. 清除所有現有規則與 pipe
$IPFW -f flush
$IPFW -f pipe flush

# 2. 允許本機回環 (Loopback) 流量 (重要：沒加這條系統服務會自閉)
$IPFW add 10 allow ip from any to any via lo0

# 3. 使用 ipfw pipe 定義每一項流量限制與編號
$IPFW pipe 1 config bw $VPN_UP
$IPFW pipe 2 config bw $P2P_UP
$IPFW pipe 3 config bw $RDP_P2P
$IPFW pipe 4 config bw $SERV_UP
$IPFW pipe 5 config bw $GUEST_BAND

# 4. 利用 pipe 定義流量規則 (數字越小優先權越高)

# VPN 流量限制
$IPFW add 20 pipe 1 ip from any to $VPN_NET

# RDP 特定流量 (修正：加入 3389 端口確保精準)
$IPFW add 25 pipe 3 tcp from $P2P1_IP to any 3389 in recv $INT_IF

# P2P 流量限制
$IPFW add 30 pipe 2 ip from $P2P1_IP to any in recv $INT_IF
$IPFW add 40 pipe 2 ip from $P2P2_IP to any in recv $INT_IF

# Guest 網路限速 (進出都限)
$IPFW add 110 pipe 5 ip from $GUEST_NET to any
$IPFW add 120 pipe 5 ip from any to $GUEST_NET

# DMZ 出口流量限制 (修正：使用變數 $EXT_IF 替換原稿的硬編碼)
$IPFW add 210 pipe 4 ip from $DMZ_NET to any via $EXT_IF

# 5. 最後放行其餘所有流量
$IPFW add 65534 allow ip from any to any
```

## 總結

現在的主要`firewall`已經很少用`IPFW`了,主要都改用`PF`, 不過`PF`在限流的部份沒有`IPFW`簡單所以我現在的用法是雙層防火牆
主要是`PF`管安全,`IPFW`管流量