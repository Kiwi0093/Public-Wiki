---
title: Linux / Bash Shell 特殊字元與萬用字元
date: 2026-09-07
tags:
  - Linux
  - Script
---
# Linux / Bash Shell 特殊字元與萬用字元

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. Shell 特殊控制字元速查表

| **符號**                     | **名稱**             | **核心功能與行為解析**                                    | **實用指令範例**                                                                      |
| -------------------------- | ------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| **`$`**                    | 變數取值符號             | 提取變數對應的值，亦可用於環境變數或特殊變數（如 `$?`、`$$`）              | `echo $USER`<br />`echo $?` _(回傳上一指令狀態碼)_                                         |
| **`#`**                    | 註解符號               | 行首或空格後的 `#` 代表註解，Shell 會直接忽略其後內容                 | `# 這是註解`<br />`mkdir app # 建立目錄`                                                  |
| **`\`**                    | 跳脫符號 (Escape)      | 消除後續緊跟單一字元的特殊語意，還原為純文字；或作為換行延續符                  | `echo \$PATH`<br />`rm -f filename\ with\ space.txt`                              |
| **`\|`**                   | 管道符號 (Pipe)        | 將左側指令的「標準輸出 (stdout)」轉向送入右側指令的「標準輸入 (stdin)」     | `cat access.log \| grep "404" \| wc -l`                                         |
| **`;`**                    | 指令分隔符              | 連續循序執行多條指令（不論前一條指令成功與否，後一條都會執行）                  | `cd /opt; ls -la; df -h`                                                        |
| **`&`**                    | 背景執行工作控制           | 將指令移至背景（Background）執行，立即釋放當前終端提示字元               | `python3 server.py &`<br />`nohup ./backup.sh &`                                  |
| **`/`**                    | 目錄路徑分隔符            | Linux 虛擬檔案系統樹狀結構的目錄層級分隔符，最頂層單獨的 `/` 代表根目錄        | `/var/log/docker.log`                                                           |
| **`>`**                    | 輸出重導向 (覆蓋)         | 將標準輸出導向寫入指定檔案，**若檔案已存在則直接覆蓋覆寫**                  | `echo "token=123" > config.env`                                                 |
| **`>>`**                   | 輸出重導向 (追加)         | 將標準輸出導向寫入指定檔案，**追加寫入至檔案最末端**而不覆蓋                 | `date >> /var/log/deploy.log`                                                   |
| **`<`**                    | 輸入重導向              | 將指定檔案的內容作為指令的標準輸入（取代鍵盤輸入）                        | `mysql -u root -p db < backup.sql`                                              |
| **`<<`**                   | Here-Document      | 定義一段多行文字塊作為標準輸入，直到遇見自訂的終止標籤（如 `EOF`）             | `cat << 'EOF' > test.txt`<br />`hello`<br />`EOF`                                   |
| **`' '`**                  | 單引號 (強引用)          | **完全維持字面字元（Literal）**，內部所有變數、跳脫符均不解析             | `echo '$USER'` _(輸出: `$USER`)_                                                  |
| **`" "`**                  | 雙引號 (弱引用)          | 保留大部分文字，但**允許解析變數 (`$`)、指令替換 (`$()`) 與跳脫 (`\`)** | `echo "Hi, $USER"` _(輸出: `Hi, admin`)_                                          |
| **`$( )`** 或 **`` ` ` ``** | 指令替換               | 優先執行括號內部的指令，並將其執行結果（stdout）回填於原處                 | `TODAY=$(date +%F)`<br />`tar -czvf "backup-$TODAY.tar.gz" /data`                 |
| **`( )`**                  | 子 Shell (Subshell) | 在獨立衍生（Fork）的子行程中執行整組指令，其內部的目錄變更或變數不會污染外層         | `(cd /tmp && rm -rf *)` _(執行完畢後本機仍留在原目錄)_                                       |
| **`{ }`**                  | 命令群組 / 展開          | 1. 在當前 Shell 中群組化執行指令（需有空格與分號）。<br />2. 序列/字串批量展開。 | `{ echo 1; echo 2; }`<br />`mkdir -p /opt/{app,db,config}`<br />`cp app.yml{,.bak}` |

## 2. 萬用字元 (Wildcards / Globbing) 速查表

萬用字元主要由 Shell 在執行指令前展開（Pathname Expansion），用於**匹配檔名與路徑**：

| **萬用字元**                       | **匹配規則**       | **精確行為解析**                       | **實用範例**                                                               |
| ------------------------------ | -------------- | -------------------------------- | ---------------------------------------------------------------------- |
| **`*`**                        | 0 個到任意多個字元     | 匹配檔名中任意長度的字串（不包含隱藏檔的開頭點 `.`）     | `ls *.log` _(列出所有 .log 結尾檔案)_<br />`rm -rf /tmp/cache*`                  |
| **`?`**                        | **剛好 1 個任意字元** | 必須且只能匹配 1 個字元（不能為 0 個，也不能超過 1 個） | `ls file?.txt` _(匹配 `file1.txt`、`fileA.txt`，但不匹配 `file10.txt`)_        |
| **`[abc]`**                    | 集合內任一字元        | 匹配括號內列出的任一單一字元                   | `ls report_[abc].pdf` _(匹配 `report_a.pdf`、`report_b.pdf` 等)_           |
| **`[0-9]`**                    | 編碼範圍內任一字元      | 匹配 ASCII / 編碼連續範圍內的任一字元          | `ls img_[0-9].png` _(匹配 0 至 9 的單碼數字)_<br />`ls [a-z]*.md` _(以小寫字母開頭的檔案)_ |
| **`[!abc]`**<br />_(或 `[^abc]`)_ | 排除集合 (否定)      | **不包含** 括號內指定字元的任一單一字元           | `ls file[!0-9].txt` _(匹配 `fileA.txt`，排除 `file1.txt`)_                  |

## 3. 進階工程師必備：容易混淆的邊界細節 (Tips)

### 3.1 邏輯運算子 `&&` 與 `||`

- **`cmd1 && cmd2` (AND)**：只有在 `cmd1` **執行成功（Exit Code = 0）** 時，才會接著執行 `cmd2`。
    
- **`cmd1 || cmd2` (OR)**：只有在 `cmd1` **執行失敗（Exit Code ≠ 0）** 時，才會執行 `cmd2`。
    
- **經典範例**：
    
    
   ```bash
    docker compose pull && docker compose up -d || echo "部署更新失敗！"
   ```
    

### 3.2 萬用字元與正則表達式 (Regex) 的差別

- **Shell 萬用字元 (Globbing)**：由 Shell 解析，直接對應磁碟上的**檔名**。
    
    - `*` 代表「任意字串」。
        
    - `?` 代表「單一字元」。
        
- **正則表達式 (Regex)**：由特定工具（`grep`、`sed`、`awk`、`python`）解析，用於匹配**文字內容**。
    
    - `*` 代表「前一個字元重複 0 到多次」。
        
    - `.` 代表「任意單一字元」。
        
    - `.*` 兩者結合才等於萬用字元的 `*`。
        

### 3.3 大括號展開 (Brace Expansion) 的高效率用法

不用寫迴圈，直接使用大括號生成批量連續字串或檔案：

```bash
# 1. 批量建立 1 到 10 號目錄
mkdir -p node_{01..10}

# 2. 快速建立備份檔 (等於 cp nginx.conf nginx.conf.bak)
cp nginx.conf{,.bak}

# 3. 雙維度矩陣展開 (生成 a1, a2, b1, b2)
echo {a,b}{1,2}
```