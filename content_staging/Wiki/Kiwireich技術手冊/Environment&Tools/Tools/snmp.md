---
title: SNMP (簡易網路管理協定) 與系統監控工具
date: 2026-09-02
tags:
  - Linux
  - FreeBSD
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)


SNMP (Simple Network Management Protocol) 是一種應用層協定，廣泛用於網通設備（如路由器、交換器、防火牆）及伺服器（Linux/FreeBSD）的狀態監控與指標收集。

## 一、 SNMP 核心概念與運作架構

SNMP 透過維持一個稱為 **MIB (Management Information Base)** 的資料庫來組織監控指標，每個指標對應一串唯一的 **OID (Object Identifier，物件識別碼)**。

- **運作機制：**
    
    - **GET / GETNEXT：** 管理端 (NMS) 主動向受監控主機（Agent）詢問數值。
    - **TRAP / INFORM：** 當系統發生異常（如介面斷線、硬體告警），受監控主機主動向外發送通知。
        
- **主要版本差異：**
    
    - **SNMPv1 / SNMPv2c：** 採用明文 Community String（社群字串，如 `public` 或 `private`）作為身分驗證，安全性較低，極易遭到攔截。
    - **SNMPv3：** 導入完整的加密與身份驗證機制（支援 MD5/SHA 驗證與 DES/AES 加密），生產環境強烈建議全面改用此版本。

## 二、 平台支援度總覽

|**元件 / 工具**|**Linux 支援**|**FreeBSD 支援**|**核心用途**|
|---|---|---|---|
|**Net-SNMP (`snmpd`)**|完整支援 (Native)|完整支援 (Native)|業界標準的 SNMP Agent 與測試工具包。|
|**SNMPwalk / SNMPget**|跨平台|跨平台|用於手動探詢 OID 數值的偵錯指令。|
|**Prometheus SNMP Exporter**|跨平台|跨平台|將 SNMP 資料轉換為時序資料庫指標的現代橋接器。|
|**LibreNMS / Cacti**|跨平台|跨平台|視覺化網管與流量繪圖系統（NMS）。|

## 三、 Linux 與 FreeBSD 的 SNMP 服務端部署 (`Net-SNMP`)

伺服器端必須安裝並設定 SNMP Agent (`snmpd`) 才能回應監控請求。

### 1. 安裝套件

- **Linux (Ubuntu / Debian / RHEL)：**
    
    
   ```bash
    sudo apt install snmpd snmp
    # 或 RHEL/CentOS
    sudo dnf install net-snmp net-snmp-utils
   ```
    
- **FreeBSD (透過 pkg)：**
    
    
   ```bash
    sudo pkg install net-snmp
   ```
    
    _(FreeBSD 需在 `/etc/rc.conf` 加入 `snmpd_enable="YES"` 並執行 `sudo service snmpd start` 啟動服務)_
    

### 2. 設定檔範例 (`/etc/snmp/snmpd.conf`)

為確保安全性，建議直接採用 **SNMPv3** 設定帳號密碼，避免使用明文 Community：

```bash
# 建立 SNMPv3 專屬唯讀帳號 (myuser)，並設定身份驗證與加密
rouser myuser authPriv -V systemview

# 設定 authPass 與 privPass 密碼（密碼長度至少需 8 碼）
createUser myuser SHA "MyAuthPassword123" AES "MyPrivPassword123"
```

設定完成後重新啟動服務：


```bash
# Linux
sudo systemctl restart snmpd

# FreeBSD
sudo service snmpd restart
```

## 四、 常用的手動偵錯與測試工具

當監控系統無法順利抓取數據時，可直接在終端機使用 `Net-SNMP` 提供的客戶端工具進行排查：

- **使用 `snmpwalk` 掃描整棵 OID 樹狀結構：**
    
    
   ```bash
    # SNMPv3 測試範例
    snmpwalk -v3 -l authPriv -u myuser -A MyAuthPassword123 -X MyPrivPassword123 127.0.0.1 .1.3.6.1.2.1.1
   ```
    
- **使用 `snmpget` 取得單一特定指標（例如系統運行時間 sysUpTime）：**
    
    
   ```bash
    snmpget -v3 -l authPriv -u myuser -A MyAuthPassword123 -X MyPrivPassword123 127.0.0.1 .1.3.6.1.2.1.1.3.0
   ```
    

## 五、 現代化監控整合方案

傳統的 SNMP 輪詢（Polling）在面對大型基礎架構時常有效能瓶頸，現代維運通常結合以下工具：

1. **Prometheus SNMP Exporter：**
    
    針對現代雲原生架構，透過專屬 Exporter 將傳統網路設備的 SNMP 數據抓取並轉換為 Prometheus 相容格式，再結合 Grafana 繪製精美儀表板。
    
2. **LibreNMS / Zabbix：**
    
    全功能的網路自動發現與效能監控系統，內建龐大的設備 MIB 資料庫，能自動繪製交換器連接埠流量圖並發送告警。