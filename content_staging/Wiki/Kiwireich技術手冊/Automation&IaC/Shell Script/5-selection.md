---
title: Bash 互動式方向鍵選單 (TUI Menu)
date: 2026-09-07
tags:
  - Linux
  - Script
---
# # Bash 互動式方向鍵選單 (TUI Menu) 

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 核心實作：健壯版方向鍵選單函式 (`select_option`)

這個改良版本採用**相對游標定位（Relative Cursor Movement）**，不依賴易受終端滾動影響的 `\E[6n` 座標查詢，更加穩定且相容各大終端環境（macOS Terminal、Windows Terminal、iTerm2、Linux Console）。

```bash
#!/usr/bin/env bash

# ==============================================================================
# 互動式方向鍵選單函式
# 參數: 選項清單 (字串或陣列展開)
# 返回: 使用者所選選項的索引值 (0, 1, 2...)
# ==============================================================================
select_option() {
    local -a options=("$@")
    local num_options=${#options[@]}

    # 如果沒有傳入任何選項，直接返回錯誤
    [[ $num_options -eq 0 ]] && return 1

    # ANSI 控制碼定義
    local ESC=$'\033'
    local CURSOR_OFF="${ESC}[?25l"
    local CURSOR_ON="${ESC}[?25h"
    local CLEAR_LINE="${ESC}[2K"
    local TEXT_INVERT="${ESC}[7m"
    local TEXT_RESET="${ESC}[0m"

    # 捕獲中斷訊號 (Ctrl+C)，確保終端游標與屬性正常恢復
    trap 'printf "${CURSOR_ON}"; stty echo; printf "\n"; exit 130' INT TERM

    # 關閉游標閃爍
    printf "%s" "${CURSOR_OFF}"

    local selected=0

    # 首次渲染清單
    local i
    for ((i=0; i<num_options; i++)); do
        if [[ $i -eq $selected ]]; then
            printf "  ${TEXT_INVERT} > %s ${TEXT_RESET}\n" "${options[i]}"
        else
            printf "    %s \n" "${options[i]}"
        fi
    done

    # 監聽鍵盤輸入迴圈
    while true; do
        # 讀取 3 個字元以捕獲方向鍵的轉義序列 (\033[A, \033[B)
        IFS= read -rsn1 key
        if [[ $key == "${ESC}" ]]; then
            read -rsn2 -t 0.1 rest
            key="${key}${rest}"
        fi

        case "$key" in
            "${ESC}[A"|k|K) # 向上鍵 (或 Vim 鍵位的 k)
                ((selected--))
                [[ $selected -lt 0 ]] && selected=$((num_options - 1))
                ;;
            "${ESC}[B"|j|J) # 向下鍵 (或 Vim 鍵位的 j)
                ((selected++))
                [[ $selected -ge $num_options ]] && selected=0
                ;;
            "") # Enter 鍵確認選擇
                break
                ;;
        esac

        # 游標往上移回清單起點，重新覆寫整份選單
        printf "${ESC}[%dA" "${num_options}"
        for ((i=0; i<num_options; i++)); do
            printf "${CLEAR_LINE}"
            if [[ $i -eq $selected ]]; then
                printf "  ${TEXT_INVERT} > %s ${TEXT_RESET}\n" "${options[i]}"
            else
                printf "    %s \n" "${options[i]}"
            fi
        done
    done

    # 復原游標與環境
    printf "%s" "${CURSOR_ON}"

    # 輸出選取的索引值
    echo "$selected"
}
```

## 2. 基礎使用範例：固定選項選單

```bash
echo "請使用 [上下方向鍵] 移動，[Enter] 確認選擇："
echo

MENU_ITEMS=("啟動所有 Docker 容器" "停止 Nextcloud 服務" "執行資料庫備份" "離開腳本")

# 呼叫函式並接取選中的索引
CHOICE_INDEX=$(select_option "${MENU_ITEMS[@]}")

echo "----------------------------------------"
echo "您選取的項目索引: ${CHOICE_INDEX}"
echo "您選取的項目內容: ${MENU_ITEMS[CHOICE_INDEX]}"

case "${CHOICE_INDEX}" in
    0) echo "正在啟動容器..." ;;
    1) echo "正在停止服務..." ;;
    2) echo "開始執行備份..." ;;
    3) echo "離開程式。"; exit 0 ;;
esac
```

## 3. 解決動態目錄空白行痛點：結合動態陣列

原筆記使用 `DATE1=$(ls ... | sed -n '1p')` 寫死 5 個變數，當實際目錄不足 5 個時會產生空白行。

**標準解法**：使用 `mapfile`（或 `readarray`）將實際存在的目錄**動態讀入陣列**，再動態補上 `離開 (Exit)` 選項：

```bash
#!/usr/bin/env bash

BACKUP_DIR="/storage/backup"

# 1. 檢查目錄是否存在
if [[ ! -d "${BACKUP_DIR}" ]]; then
    echo "錯誤：備份目錄 ${BACKUP_DIR} 不存在！" >&2
    exit 1
fi

# 2. 動態讀取該目錄下所有「子目錄名稱」到陣列中
# 方式 A：使用 find (最精準，排除一般檔案)
mapfile -t BACKUP_LIST < <(find "${BACKUP_DIR}" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort -r)

# 3. 檢查是否有備份資料
if [[ ${#BACKUP_LIST[@]} -eq 0 ]]; then
    echo "提示：目前沒有任何可用的備份目錄。"
    exit 0
fi

# 4. 在陣列最末尾動態加入「離開」選項
BACKUP_LIST+=("取消並離開 (Exit)")

# 5. 渲染選單
echo "請選擇要進行還原的備份快照目錄："
SELECTED_IDX=$(select_option "${BACKUP_LIST[@]}")

# 6. 判定使用者選擇
LAST_IDX=$((${#BACKUP_LIST[@]} - 1))

if [[ "${SELECTED_IDX}" -eq "${LAST_IDX}" ]]; then
    echo "使用者取消操作，腳本安全退出。"
    exit 0
fi

CHOSEN_BACKUP="${BACKUP_LIST[SELECTED_IDX]}"
echo "--------------------------------------------------"
echo "成功選取備份目錄: ${CHOSEN_BACKUP}"
echo "完整路徑: ${BACKUP_DIR}/${CHOSEN_BACKUP}"
echo "正在準備還原程序..."
```

## 4. 關鍵技術細節與避坑速查

|**項目**|**傳統寫死寫法**|**動態陣列最佳實踐 (Best Practice)**|
|---|---|---|
|**目錄擷取**|`DATE1=$(ls \| sed -n '1p')`|`mapfile -t LIST < <(find ... -type d)`|
|**空白選項**|目錄少於宣告變數時必出空白|陣列有幾項就渲染幾行，零空白|
|**例外離開 (Ctrl+C)**|游標消失、終端機不回顯文字|加入 `trap` 在中斷時還原 `stty echo` 與游標|
|**游標覆寫機制**|`\E[6n` 依賴終端絕對座標（易滾動跑版）|`\033[NA` 相對行數回退搭配 `\033[2K` 清除整行|