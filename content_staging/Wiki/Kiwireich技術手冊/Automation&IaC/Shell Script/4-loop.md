---
title: Bash 迴圈流程控制、Case 條件分支與互動選單
date: 2026-09-07
tags:
  - Linux
  - Script
---
# Bash 迴圈流程控制、Case 條件分支與互動選單

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 核心觀念：流程控制跳轉關鍵字

在任何迴圈結構（`while`、`until`、`for`）內部，控制流程的主要指令如下：

|**關鍵字**|**核心行為**|**典型應用場景**|
|---|---|---|
|**`break`**|**跳出整層迴圈**，立即執行迴圈 `done` 後續的下一行指令|使用者完成選單操作，或已找到目標檔案|
|**`continue`**|**略過本次迭代**，不跑剩下的程式碼，直接回到迴圈開頭判斷下一次|輸入錯誤時提示並重新輸入，或略過暫存檔|
|**`exit`**|**直接終止整個 Script 行程**，返回給父行程指定的退出狀態碼（預設 0）|使用者主動選擇離開，或遭遇不可復原的致命錯誤|

## 2. 修正版：標準 While + Case 互動選單架構

針對原筆記的選單範例，修正語法並加入清除畫面、提示字元與防呆機制的標準模板：

```bash
#!/usr/bin/env bash

while true; do
    echo "=================================="
    echo "  HomeLab 維運管理選單"
    echo "=================================="
    echo "  a) 查看 Docker 容器狀態"
    echo "  b) 重啟 Nextcloud 服務"
    echo "  c) 執行資料庫備份"
    echo "  q) 離開選單"
    echo "=================================="
    
    # -r 防止反斜線被轉義，-p 顯示提示文字
    read -r -p "請輸入選項 [a-c, q]: " CHOICE

    case "${CHOICE}" in
        a|A)
            echo "--> 正在列出運行中的容器..."
            docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
            break  # 執行完畢跳出選單
            ;;
        b|B)
            echo "--> 正在重啟 Nextcloud..."
            docker compose -f /opt/nextcloud/docker-compose.yml restart
            echo "重啟完成。"
            continue  # 重新回到選單開頭
            ;;
        c|C)
            echo "--> 執行備份任務..."
            /opt/scripts/backup.sh
            continue
            ;;
        q|Q)
            echo "離開程式。"
            exit 0  # 正常結束腳本
            ;;
        *)
            echo "錯誤：無效的選項 [${CHOICE}]，請重新輸入！" >&2
            sleep 1
            continue
            ;;
    esac
done

echo "選單結束，繼續執行後續自動化作業..."
```

> **語法細節提醒**：
> 
> - `case` 支援多值匹配：使用豎線 `|` 可同時捕獲大小寫（如 `a|A)`）。
>     
> - 每個條件分支區塊必須以兩個分號 `;;` 結尾，代表該分支處理結束。
>     
> - `*)` 代表通配符，能匹配前面皆未中選的所有其他字元，作為預設防呆分支（Default Fallback）。
>     

## 3. Bash 三大經典迴圈語法結構

除了搭配 `case` 製作選單，日常腳本處理資料時最常使用的是下列三種迴圈：

### 3.1 For 迴圈 (固定清單 / 陣列 / 範圍迭代)

適用於目標數量明確的場景（如批量巡檢多個 Docker Compose 專案）：

```bash
# 1. 遍歷清單
STACKS=("nextcloud" "bookstack" "gitea" "wireguard")

for stack in "${STACKS[@]}"; do
    echo "正在檢查堆疊: ${stack}..."
    docker compose -f "/opt/${stack}/docker-compose.yml" ps
done

# 2. 數值序列 (C 語言風格)
for ((i=1; i<=5; i++)); do
    echo "重試第 ${i} 次..."
done
```

### 3.2 While 迴圈 (條件為真時持續執行)

常用於**輪詢等待服務健康**，直到特定狀態達成：

```bash
# 等待 MariaDB 容器完全啟動 (Health Check 輪詢)
CONTAINER="gitea_db"

while ! docker inspect --format='{{.State.Health.Status}}' "${CONTAINER}" 2>/dev/null | grep -q "healthy"; do
    echo "等待 ${CONTAINER} 資料庫初始化中 (每 2 秒檢查一次)..."
    sleep 2
done

echo "${CONTAINER} 已就緒，啟動主應用！"
```

### 3.3 逐行讀取檔案 (While Read 模式)

在處理設定檔、主機清單或日誌時，**絕對不要用 `for line in $(cat file)`**（會因空格斷詞引發 Bug），標準寫法是使用 `while IFS= read -r line`：

```bash
# 安全地逐行讀取主機 IP 清單並執行 Ping 測試
HOSTS_FILE="/opt/network/hosts.txt"

if [[ -f "${HOSTS_FILE}" ]]; then
    while IFS= read -r host || [[ -n "${host}" ]]; do
        # 略過空白行與 # 開頭的註解行
        [[ -z "${host}" || "${host}" =~ ^# ]] && continue
        
        if ping -c 1 -W 1 "${host}" >/dev/null 2>&1; then
            echo "[OK] ${host} 連線正常"
        else
            echo "[FAIL] ${host} 無法連線" >&2
        fi
    done < "${HOSTS_FILE}"
fi
```

## 4. 進階技巧：內建 Select 選單語法

若僅需快速列出數字選單讓使用者挑選，Bash 原生提供了極度簡潔的 `select` 結構，可自動渲染編號並省略手動排版的繁瑣程式碼：

```bash
#!/usr/bin/env bash

PS3="請選擇要維護的服務編號: "  # 定義提示字元

SERVICES=("Nextcloud" "BookStack" "Gitea" "結束離開")

select srv in "${SERVICES[@]}"; do
    case "${srv}" in
        "Nextcloud")
            echo "維護 Nextcloud 中..."
            break
            ;;
        "BookStack")
            echo "維護 BookStack 中..."
            break
            ;;
        "Gitea")
            echo "維護 Gitea 中..."
            break
            ;;
        "結束離開")
            echo "程式結束。"
            exit 0
            ;;
        *)
            echo "輸入錯誤，請輸入 1 到 4 的數字。"
            ;;
    esac
done
```