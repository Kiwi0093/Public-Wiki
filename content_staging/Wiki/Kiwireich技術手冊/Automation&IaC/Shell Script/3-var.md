---
title: Bash Shell 變數管理、特殊自動變數與空變數
date: 2026-09-07
tags:
  - Linux
  - Script
---

# Bash Shell 變數管理、特殊自動變數與空變數

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 變數定義與賦值規範

- **基本定義**：
    
    
   ```bash
    VAR_NAME="value"      # 等號兩側絕對不能有空格
    echo "${VAR_NAME}"    # 建議一律使用大括號 ${} 包裹，防止邊界混淆
   ```
    
- **指令輸出賦值 (Command Substitution)**：
    
    
   ```bash
    CURRENT_USER=$(whoami)
    BACKUP_DATE=$(date +%F)
   ```
    
- **變數作用域**：
    
    - 一般宣告為局部變數（僅限當前行程）。
        
    - 透過 `export VAR_NAME` 宣告為環境變數，才能繼承給衍生（Fork）的子行程。
        

## 2. 特殊自動變數與位置參數速查表

| **變數名稱**        | **意義說明**                       | **行為解析與工程師必知細節**                                       | **實用範例**                                                  |
| --------------- | ------------------------------ | ------------------------------------------------------ | --------------------------------------------------------- |
| **`$?`**        | 上一個指令的退出狀態碼 (Exit Code)        | `0` 代表執行成功；非 0（如 `1`, `2`, `127` 等）代表執行失敗或異常           | `systemctl restart nginx`<br />`[ $? -eq 0 ] && echo "OK"`  |
| **`$$`**        | 當前 Shell 行程的 Process ID (PID)  | 常用於腳本建立唯一的暫存檔名稱，避免並發衝突                                 | `TMP_FILE="/tmp/run_$$.tmp"`                              |
| **`$!`**        | 最後一個進入背景執行的程式 PID              | 抓取剛用 `&` 送入背景的行程 ID，方便後續用 `wait` 監控                    | `python3 job.py &`<br />`JOB_PID=$!`                        |
| **`$-`**        | 當前 Shell 所啟用的旗標 (Flags)        | 顯示當前 shell 的執行選項（如 `h`、`B`、`i` 等互動模式標誌）                | `echo "$-"`                                               |
| **`$0`**        | 當前 Shell 腳本的檔名或路徑              | 執行時輸入的指令路徑（如 `./deploy.sh` 或 `/opt/deploy.sh`）         | `SCRIPT_DIR=$(dirname "$0")`                              |
| **`$1` ~ `$9`** | 命令列位置參數 (Positional Arguments) | 依序接收外部傳入的第一至第九個參數（第十個起需用 `${10}`）                      | `./backup.sh /data /mnt/nas`<br />`# $1=/data, $2=/mnt/nas` |
| **`$#`**        | 傳入腳本的參數總個數                     | 常用於腳本開頭校驗參數數量是否足夠                                      | `[ $# -lt 2 ] && exit 1`                                  |
| **`$*`**        | 所有傳入參數的集合 (合併字串)               | 雙引號包覆 `"$*"` 時，所有參數以 `$IFS`（預設為空白）串為單一字串：`"$1 $2 $3"`  | `echo "All args: $*"`                                     |
| **`$@`**        | 所有傳入參數的集合 (獨立陣列)               | **最常用於迴圈與轉發**。雙引號 `"$@"` 會將各參數保留為獨立字串：`"$1" "$2" "$3"` | `for arg in "$@"; do ... done`                            |

## 3. 常見 Bash 內建環境變數

|**變數名稱**|**說明**|**典型用途**|
|---|---|---|
|**`$BASH_ENV`**|非互動式 Shell 啟動時自動讀取的設定檔路徑|自動化 CI/CD 排程環境注入|
|**`$CDPATH`**|使用 `cd` 指令時的搜尋目錄清單（冒號分隔）|快速切換深層目錄|
|**`$LINENO`**|當前正在執行的程式碼行號|日誌追蹤與除錯：`echo "Error at line $LINENO"`|
|**`$LINES` / `$COLUMNS`**|當前終端機畫面的高度 (列數) 與寬度 (行數)|終端 UI / 進度條寬度自適應計算|
|**`$PPID`**|當前行程的父行程 ID (Parent Process ID)|檢查是誰呼叫了此腳本|
|**`$RANDOM`**|隨機產生 0 至 32767 之間的整數|生成隨機密碼或隨機埠號：`PORT=$((10000 + RANDOM % 10000))`|
|**`$SECONDS`**|腳本啟動至今累計經過的秒數|計算腳本耗時：`echo "耗時: ${SECONDS}s"`|
|**`$SHELL`**|使用者預設偏好的 Shell 絕對路徑|檢視預設 Shell（通常為 `/bin/bash`）|
|**`$TMOUT`**|無操作自動登出時間（單位：秒）|安全加固：閒置指定秒數自動斷開終端連線|

## 4. 空變數與未設定變數處理 (Parameter Expansion)

在 Shell 腳本中，如果直接使用未經賦值的變數，容易引發未預期行為（甚至引發如 `rm -rf /${DIR}` 誤刪根目錄的災難）。使用 Bash 的參數擴展語法能安全優雅地設定預設值或防呆退出：

| **語法格式**           | **條件判定**         | **處理行為**                                 | **實用範例**                                         |
| ------------------ | ---------------- | ---------------------------------------- | ------------------------------------------------ |
| **`${var:-word}`** | `var` 為空或未設定     | **暫時使用** `word` 作為回傳值，**不改變** `var` 本身內容 | `PORT=${CUSTOM_PORT:-8080}`<br />_(未指定時預設走 8080)_  |
| **`${var:=word}`** | `var` 為空或未設定     | **將 `word` 賦值給 `var`**，隨後使用新值            | `${DATABASE_NAME:=homelab}`<br />_(未設定時自動定義並存入變數)_ |
| **`${var:?word}`** | `var` 為空或未設定     | 印出 `word` 錯誤訊息至 stderr，並**立刻強制中斷終止程式**   | `DIR=${1:?"請提供目標目錄路徑！"}`<br />_(缺少參數直接中止運行)_       |
| **`${var:+word}`** | `var` **已設定且非空** | 暫時改用 `word` 取代它；若為空則回傳空值（存在檢測用）          | `[ -n "${DEBUG:+x}" ] && echo "Debug on"`        |

> **提示**：如果省略冒號（例如 `${var-word}`），則只有在 `var` **完全未宣告 (Unset)** 時才會觸發；加上冒號（`${var:-word}`）則包含 **未宣告** 與 **宣告了但值為空字串 `""`** 兩種情況。日常腳本一律推薦使用帶冒號的寫法。

## 5. 輸入型變數：`read` 指令進階用法

`read` 指令用於在終端機暫停並讀取使用者的鍵盤輸入：

```bash
# 基礎寫法
echo -n "請輸入專案名稱: "
read PROJECT_NAME
echo "您輸入的是: ${PROJECT_NAME}"

# 推薦的現代單行寫法 (結合 -p 提示、-t 超時、-s 密碼隱藏)
# 1. 帶提示字元 (-p)
read -p "請輸入資料庫名稱: " DB_NAME

# 2. 密碼隱藏輸入 (-s, 避免螢幕印出密碼)
read -sp "請輸入連線密碼: " DB_PASSWORD
echo "" # 密碼輸入完成手動換行

# 3. 逾時自動跳過 (-t，例如等待 10 秒)
read -t 10 -p "確認繼續執行？(y/N): " CONFIRM
CONFIRM=${CONFIRM:-N} # 逾時未輸入則預設為 N
```

## 6. 指令輸出代替變數與安全條件判斷實踐

將外部指令輸出存入變數後，進行比對時務必做好防呆包裝：

```bash
#!/usr/bin/env bash

# 1. 抓取目前執行者身份
CURRENT_USER=$(whoami)

# 2. 安全的條件判斷 (推薦 [[ ]] 結構，相容性與功能最完整)
if [[ "${CURRENT_USER}" == "root" ]]; then
    echo "成功：當前是以 root 權限執行"
else
    echo "警告：必須使用 root 權限執行此腳本 (當前使用者為: ${CURRENT_USER})" >&2
    exit 1
fi

# 3. 檢查關鍵路徑變數（防禦性程式設計，避免未定義誤刪）
TARGET_DIR="${1:-}"

# 嚴格驗證避免 rm -rf /
if [[ -z "${TARGET_DIR}" ]]; then
    echo "錯誤：未指定清理目錄！" >&2
    exit 1
fi

echo "正在清理暫存資料夾: ${TARGET_DIR}..."
```