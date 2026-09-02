---
title: Linux 系統密碼與效期管理
tags:
  - Linux
  - Arch
  - Manjaro
  - PhotonOS
date: 2026-09-02
---
# Linux 系統密碼與效期管理

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)



**chage 指令集與參數細節**

Linux 系統的帳號密碼有效期限由 `shadow` 檔案控管，最常透過 `chage` 指令進行調整。以下為各項核心參數與實際範例：

- **檢視帳號完整狀態 (`-l`)**
    
    
   ```bash
    sudo chage -l john
   ```
    
    輸出結果會包含：密碼上次修改日期、密碼過期日、密碼失效前的警告天數、帳號停用日，以及密碼最小/最大修改間隔。
    
- **設定密碼最大有效天數 (`-M`)**
    
    
   ```bash
    sudo chage -M 90 john
   ```
    
    強制使用者每 90 天必須變更一次密碼。若設定為 `-1` 則代表該使用者的密碼永不過期。
    
- **設定密碼最短修改天數 (`-m`)**
    
    
   ```bash
    sudo chage -m 7 john
   ```
    
    規定使用者在變更密碼後，必須至少滿 7 天才能再次修改，防止使用者透過連續改密碼繞過密碼歷史限制。
    
- **設定密碼到期前警告天數 (`-W`)**
    
    
   ```bash
    sudo chage -W 14 john
   ```
    
    當密碼距離過期還有 14 天時，使用者每次登入終端機都會收到提示訊息。
    
- **設定帳號絕對過期日 (`-E`)**
    
    
   ```bash
    sudo chage -E 2026-12-31 john
   ```
    
    指定該帳號能使用的最後期限（格式為 `YYYY-MM-DD`）。過了這天後帳號將直接鎖定，不受密碼是否有效影響。
    

**密碼複雜度設定 (pwquality.conf)**

現代 Linux 發行版通常使用 `libpwquality` 來檢核密碼強度。修改 `/etc/security/pwquality.conf` 檔案來定義密碼強度原則：

| **參數設定**    | **預設或建議值** | **說明**                          |
| ----------- | ---------- | ------------------------------- |
| `minlen`    | `12`       | 允許的最小密碼總長度。                     |
| `minclass`  | `3`        | 必須包含幾種不同字元類別（大寫、小寫、數字、特殊符號）。    |
| `dcredit`   | `-1`       | 負數代表至少包含幾個數字（例如 `-1` 表示至少 1 個）。 |
| `ucredit`   | `-1`       | 至少包含幾個大寫字母。                     |
| `lcredit`   | `-1`       | 至少包含幾個小寫字母。                     |
| `ocredit`   | `-1`       | 至少包含幾個特殊符號。                     |
| `maxrepeat` | `3`        | 允許連續重複出現相同字元的最大次數。              |