---
title: XigmaNAS SSH 服務修復與免密碼 (Public Key) 登入設定
date: 2026-09-22
tags:
  - Xigmanas
  - FreeBSD
  - SSH
---
# XigmaNAS SSH 服務修復與免密碼 (Public Key) 登入設定

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 

## 1. 修復 SSH 服務無法啟動 (Error Code 1)

### 症狀

- 在 WebGUI 啟動 SSH 服務時失敗，並顯示 `Error Code 1`。
    
- 即使在終端機手動產生 Host Key (`ssh-keygen -A`)，只要回到 WebGUI 點擊儲存，服務又會立刻崩潰。
    

### 診斷

在 Console 執行以下指令測試 SSH 設定檔，強制顯示錯誤輸出：

Bash

```
/usr/sbin/sshd -t -f /var/etc/ssh/sshd_config 2>&1
```

若輸出 `sshd: no hostkeys available -- exiting.`，代表底層 `config.xml` 紀錄的私鑰已損壞或遺失，導致 WebGUI 每次套用設定時，都將錯誤的金鑰覆寫至系統中。

### 解決方案

必須透過 WebGUI 強制系統重新產生並記錄新的 Host Keys。

1. 進入 WebGUI，導覽至 **Services -> SSH**。
    
2. 往下滑找到 **Private Keys** 區塊。
    
3. 將裡面的四個文字方塊（**RSA, DSA, ECDSA, Ed25519**）內容**全部清空**。
    
4. 滑至頁面最下方，點擊 **Save and Restart**。
    
5. 系統偵測到空值，便會自動產生全新的 Host Keys 並寫入 `config.xml`，SSH 服務即可正常啟動。
    

## 2. 設定免密碼登入 (固化 authorized_keys)

### 情境說明

XigmaNAS 若採用 **Embedded (嵌入式)** 模式，系統根目錄 (`/`) 位於記憶體 (RAM Disk) 中（可透過 `mount | grep ' / '` 看到 `/dev/md0` 確認）。這意味著：

- 預設沒有 `~/.ssh` 目錄。
    
- 透過 `ssh-copy-id` 寫入的 `/root/.ssh/authorized_keys` 在重開機後會立刻消失。
    

為了解決此問題，必須將公鑰儲存於開機用的實體 USB 隨身碟 (`/cf` 分區) 中，並指示 SSH 服務直接讀取該實體檔案。

### 步驟一：解鎖並寫入公鑰至 USB 開機碟

預設情況下，USB 分區 (`/cf`) 為唯讀保護狀態 (Read-Only)。必須先切換為讀寫模式。

1. **掛載為可讀寫 (Read-Write)：**
    
    Bash
    
    ```
    mount -u -w /cf
    ```
    
2. **建立金鑰目錄並設定權限：**
    
    Bash
    
    ```
    mkdir -p /cf/conf/ssh_config
    chmod 700 /cf/conf/ssh_config
    ```
    
3. **寫入公鑰：** 使用編輯器將 Ansible 控制節點或客戶端的公鑰（`id_ed25519.pub` 或 `zeon.key.pub`）貼入檔案中。
    
    Bash
    
    ```
    vi /cf/conf/ssh_config/authorized_keys
    ```
    
4. **設定檔案權限：** （權限錯誤會導致 SSH 拒絕讀取金鑰）
    
    Bash
    
    ```
    chmod 600 /cf/conf/ssh_config/authorized_keys
    ```
    
5. **重新鎖定為唯讀 (Read-Only)：** 保護 USB 隨身碟，避免頻繁寫入損壞。
    
    Bash
    
    ```
    mount -u -r /cf
    ```
    

### 步驟二：修改 WebGUI 設定

告訴 XigmaNAS SSH 服務繞過記憶體，直接去 USB 隨身碟讀取設定。

1. 進入 WebGUI，導覽至 **Services -> SSH**。
    
2. 確保 **Permit root login** 有勾選（若需使用 root 自動化操作）。
    
3. 滑至最下方的 **Extra options** 文字方塊。
    
4. 貼上以下參數：
    
    Plaintext
    
    ```
    AuthorizedKeysFile /cf/conf/ssh_config/authorized_keys
    ```
    
5. 點擊 **Save and Restart**。
    

### 測試連線

從發起連線的端點執行測試，確認可直接進入系統且無須密碼：

Bash

```
ssh -i ~/.ssh/ssh.key root@<XigmaNAS_IP>
```