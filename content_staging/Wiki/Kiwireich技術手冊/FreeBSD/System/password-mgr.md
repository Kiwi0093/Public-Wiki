---
title: FreeBSD 系統密碼與效期管理
date: 2026-09-02
tags:
  - FreeBSD
---
# FreeBSD 系統密碼與效期管理

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 


**login.conf 與 pw 指令集** FreeBSD 的機制與 Linux 不同，它透過登入類別（Login Classes）與帳號管理指令來控制生命週期。

1. **透過登入類別設定效期 (`/etc/login.conf`)** 編輯 `/etc/login.conf` 檔案，在目標群組區段（通常是 `default:\`）中新增效期參數：
    
      
   ```bash
    default:\
        :passwdtime=90d:\
        :passwordlength=12:\
        :tc=std-default:
   ```
  
    - `:passwdtime=90d:` 代表該類別下的使用者密碼 90 天後過期。
        
    - 修改後必須透過指令重新編譯資料庫才能生效：
        
        
       ```bash
        sudo cap_mkdb /etc/login.conf
       ```
        
2. **透過 pw 指令修改單一帳號限制** 若不想全面套用類別，可以直接針對特定使用者操作：
    
    - **設定密碼過期日：**
        
        
       ```bash
        sudo pw usermod john -p 2026-12-31
       ```
        
    - **鎖定或解鎖帳號：**
        
        
       ```bash
        sudo pw lock john
        sudo pw unlock john
       ```
        

**密碼複雜度設定 (pam_passwdqc)** FreeBSD 採用 Pluggable Authentication Modules (PAM) 機制，透過 `pam_passwdqc` 模組限制密碼強度。

- 編輯 `/etc/pam.d/passwd` 檔案，調整或加入檢查規則：
    
    
   ```bash
    password required pam_passwdqc.so min=disabled,disabled,12,8,6
   ```
    
- 參數的五個數值分別代表：密碼為片語（passphrase）、長單字、短單字、一般混合字串及極短字串時的最低長度限制，藉此過濾掉過於簡單的弱密碼。
    

## 維運小建議與應急對策

- **遭遇密碼過期卡在 SSH 登入時的解法：** 若擁有該機台的 `root` 權限或具備 `sudo` 能力的其他帳號（或透過雲端主機的序列主控台 / Recovery 模式），直接執行以下指令解除限制即可再次登入並重新設定密碼：
    
    
   ```bash
    sudo chage -M -1 <Username>
   ```