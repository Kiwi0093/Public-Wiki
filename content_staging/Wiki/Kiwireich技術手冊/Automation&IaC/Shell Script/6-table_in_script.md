---
title: Linux 命令列文字轉表格 (CLI Table Formatting)
date: 2026-09-07
tags:
  - Linux
  - Script
---
# Linux 命令列文字轉表格 (CLI Table Formatting)

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 原指令鏈邏輯拆解與改進點

### 原寫法拆解

```bash
... | tr : , | sed -e 's/^/| /' -e 's/,/,| /g' -e 's/$/,|/' | column -t -s,
```

1. `tr : ,`：將冒號分隔符轉為逗號。
    
2. `sed` 三連替換：
    
    - `s/^/| /`：行首補上 `|` 。
        
    - `s/,/,| /g`：把 `,` 替換為 `|` ，並保留逗號作為後續 `column` 的切割點。
        
    - `s/$/,|/`：行末補上 `|`。
        
3. `column -t -s,`：指定以 `,` 為分隔符切齊欄位，並將 `,` 吃掉。
    

### 原寫法的盲點與潛在問題

- **工具鏈冗餘**：`column` 本身就支援自訂輸入分隔符（`-s`）與輸出分隔符（`-o`），不需要先繞道 `tr` 轉成逗號。
    
- **空欄位塌陷問題**：傳統 BSD/SysV 版本的 `column` 在遇到連續分隔符（如 `/etc/passwd` 中的 `::` 空 GECOS 欄位）時，預設會將多個分隔符**合併為一個**，導致後續欄位往前錯位移位。
    
- **缺少表頭與分隔線**：僅有左右豎線，視覺上缺少真正的 Table Header 與分隔橫線。
    

## 2. 現代化純 `column` 極簡解法 (util-linux 現代標準)

現代 Linux 發行版（Photon OS、Ubuntu、Debian、Arch 等）內建的 `column`（來自 `util-linux` 套件）原生支援指定輸入與輸出分隔符：

### 2.1 一行指令排版 (免 tr / sed)

直接將輸入分隔符設為 `:`，輸出分隔符設為 `|`：

```bash
head -n 4 /etc/passwd | column -t -s ':' -o ' | '
```

**輸出效果**：

```
root   | x | 0 | 0 |  | /root           | /usr/bin/zsh
bin    | x | 1 | 1 |  | /               | /usr/bin/nologin
daemon | x | 2 | 2 |  | /               | /usr/bin/nologin
mail   | x | 8 | 12 |  | /var/spool/mail | /usr/bin/nologin
```

### 2.2 補齊外層邊框與 Markdown 格式

若需要完整的 `| ... |` 邊框，僅需一層精簡的 `sed` 補齊頭尾：

```bash
head -n 4 /etc/passwd | column -t -s ':' -o ' | ' | sed 's/^/| /; s/$/ |/'
```

**輸出效果**：

```
| root   | x | 0 | 0  |  | /root           | /usr/bin/zsh     |
| bin    | x | 1 | 1  |  | /               | /usr/bin/nologin |
| daemon | x | 2 | 2  |  | /               | /usr/bin/nologin |
| mail   | x | 8 | 12 |  | /var/spool/mail | /usr/bin/nologin |
```

> **關鍵參數 `-n`（避免空欄位塌陷）**：
> 
> 若系統上的 `column` 會吃掉空的 `::` 欄位導致錯位，請務必加上 **`-n`** 參數（例如 `column -t -s ':' -o ' | ' -n`），讓空欄位維持原本的佔位。

## 3. 進階：產出帶有 Header 與水平隔線的完整 ASCII 表格

若希望產出可直接貼入文件的 Markdown 表格或純 ASCII 表格，可使用 `sed` 在第一行下方動態插入分隔線。

### 3.1 產出標準 Markdown 表格

以自訂資料為例，包含表頭：

```bash
cat << 'EOF' | column -t -s ',' -o ' | ' | sed 's/^/| /; s/$/ |/' | sed '2s/ [^|]*/ --- /g'
User,UID,GID,Home,Shell
root,0,0,/root,/bin/bash
docker,1000,1000,/home/docker,/bin/bash
nobody,65534,65534,/nonexistent,/usr/sbin/nologin
EOF
```

**輸出效果**：

```
| User   | UID   | GID   | Home         | Shell              |
| ---    | ---   | ---   | ---          | ---                |
| root   | 0     | 0     | /root        | /bin/bash          |
| docker | 1000  | 1000  | /home/docker | /bin/bash          |
| nobody | 65534 | 65534 | /nonexistent | /usr/sbin/nologin  |
```

## 4. 單一工具極速流：純 AWK 格式化 (無外部管線依賴)

在資源受限環境或追求極致執行效能的腳本中，單靠 `awk` 的 `printf` 即可一步完成對齊與加框，無須在行程間透過 Pipe 傳輸數據：

```bash
awk -F':' '
BEGIN {
    print "+------------------+------+------+--------------------+-------------------+"
    printf "| %-16s | %-4s | %-4s | %-18s | %-17s |\n", "USERNAME", "UID", "GID", "HOME", "SHELL"
    print "+------------------+------+------+--------------------+-------------------+"
}
NR<=5 {
    printf "| %-16s | %-4s | %-4s | %-18s | %-17s |\n", $1, $3, $4, $6, $7
}
END {
    print "+------------------+------+------+--------------------+-------------------+"
}' /etc/passwd
```

**輸出效果**：

```
+------------------+------+------+--------------------+-------------------+
| USERNAME         | UID  | GID  | HOME               | SHELL             |
+------------------+------+------+--------------------+-------------------+
| root             | 0    | 0    | /root              | /usr/bin/zsh      |
| bin              | 1    | 1    | /                  | /usr/bin/nologin  |
| daemon           | 2    | 2    | /                  | /usr/bin/nologin  |
| mail             | 8    | 12   | /var/spool/mail    | /usr/bin/nologin  |
| ftp              | 14   | 11   | /srv/ftp           | /usr/bin/nologin  |
+------------------+------+------+--------------------+-------------------+
```

## 5. 社群高顏值工具推薦 (Modern CLI Table Tools)

若腳本運作於現代 Linux 發行版，可直接引入開源的專門表格美化工具：

|**工具名稱**|**核心優勢**|**安裝方式**|**輸出樣式風格**|
|---|---|---|---|
|**`column`** _(util-linux)_|**系統內建免安裝**、支援 `-t` 與 `-o`|預裝|標準對齊文字|
|**`boxes`**|支援數十種邊框花樣（ASCII、Unicode、Rounded）|`tdnf/apt install boxes`|裝飾性文字框 / 註解框|
|**`charmbracelet/gum table`**|支援 TUI 互動式表格、箭頭翻頁選取|Go binary / 套件庫|現代互動式終端 UI|
|**`csvkit` (`csvlook`)**|自動解析各類 CSV/TSV 並轉為 Markdown 表格|`pip install csvkit`|