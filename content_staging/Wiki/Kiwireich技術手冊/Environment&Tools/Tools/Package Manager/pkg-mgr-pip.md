---
title: Python / pip 現代套件與虛擬環境管理實用筆記
date: 2026-09-02
tags:
  - Linux
  - Python
---
# Python / pip 現代套件與虛擬環境管理實用筆記

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)


## 一、 起手式：絕對、千萬不要用 `sudo pip install`

在 Linux 或 macOS 裡，最可怕的災難之一就是直接下 `sudo pip install <套件>`。

1. **污染系統核心：** 作業系統本身（如 Ubuntu 的 `apt` 或 RHEL 的 `dnf`）底層重度依賴特定的 Python 套件。你用 `sudo pip` 強制覆蓋升級，極有可能讓系統的包管理員直接報廢。
2. **PEP 668 限制：** 現代的發行版（如 Debian 12, Ubuntu 23.04+）已經在系統層面**封殺**了全域 pip 安裝。如果你不用虛擬環境，系統會直接丟出 `error: externally-managed-environment` 拒絕執行。

**現代標準做法：一律使用虛擬環境 (Virtual Environment)** 或專屬工具。

## 二、 基礎維護：原生的 `venv` 與 `pip`

這是不需要安裝任何第三方工具，Python 3 內建的最標準做法。套件會跟著專案資料夾走，互不干擾。

**1. 建立與啟動虛擬環境**

```bash
# 在你的專案資料夾下，建立一個名為 .venv 的虛擬環境
python3 -m venv .venv

# 啟動虛擬環境 (Linux / macOS)
source .venv/bin/activate
# (啟動後，你終端機的提示字元前面會多出一個 (.venv) 的標籤)

# 離開虛擬環境
deactivate
```

**2. 安裝與管理套件 (在啟動虛擬環境的狀態下)**

```bash
# 安裝套件 (這時不需要也不可以加 sudo)
pip install requests

# 升級套件
pip install --upgrade requests

# 移除套件
pip uninstall requests
```

**3. 環境代碼化：`requirements.txt`**

```bash
# 將目前環境中安裝的套件與精確版本號，匯出成清單
pip freeze > requirements.txt

# 在新機器上，一鍵還原安裝所有相依套件
pip install -r requirements.txt
```

## 三、 全域 CLI 工具的神器：`pipx` (Python 界 brew/npx)

如果你不是要開發專案，而是想安裝**全域的命令列工具**（例如你常用的 `ansible`, `docker-compose`, `httpie`, `glances`），用 `venv` 太麻煩，用 `sudo pip` 又會搞壞系統，這時候請用 **`pipx`**。

`pipx` 會自動幫每個工具在背景建立一個「專屬的隔離虛擬環境」，並把它們的執行檔連結到你的全域 PATH 中。

**1. 安裝 pipx**

```bash
# Ubuntu / Debian
sudo apt install pipx
pipx ensurepath
```

**2. 使用 pipx 安裝工具**

```bash
# 安全地在全域安裝 ansible，它不會污染系統的 Python 環境
pipx install ansible

# 隨載隨跑 (類似 npx)，臨時跑個工具用完即丟
pipx run cowsay "Hello Python!"

# 更新透過 pipx 安裝的工具
pipx upgrade ansible
# 更新全部
pipx upgrade-all
```

## 四、 空間清理與快取管理

`pip` 在下載與編譯套件時，會把檔案快取在 `~/.cache/pip` 裡，久了也是硬碟殺手。

```bash
# 查看快取佔用了多少空間
pip cache info

# 清理所有快取
pip cache purge

# 針對特定套件清理快取
pip cache remove requests
```

## 五、 Dockerfile 最佳化實踐 (`--no-cache-dir`)

跟 Alpine 的 `apk --no-cache` 一樣，在打包 Docker 容器時，千萬不要讓 pip 留下佔空間的快取檔案。

**生產環境 Dockerfile 範例：**

```Dockerfile
COPY requirements.txt .

# 絕對必加 --no-cache-dir，這能讓你的映像檔直接瘦身幾十到幾百 MB
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
```

## 六、 終極加碼：現代極速替代方案 `uv` 🌟

如果你喜歡 Node.js 裡的 `fnm` 或 `pnpm` 那種極致的速度，那你一定要認識目前 Python 界當紅的炸子雞：**`uv`**。

它是由 Astral 公司用 **Rust** 寫的 Python 套件與環境管理器。它設計用來 1:1 替代 `pip` 和 `venv`，但**速度比 pip 快上 10 到 100 倍**，並且支援全域快取（類似 pnpm，節省硬碟空間）。

**1. 安裝 uv**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**2. 無縫替換日常指令** 你可以把原來的 `pip` 習慣直接換成 `uv pip`，體驗飛一般的速度：

```bash
# 建立虛擬環境 (比 python -m venv 快幾十倍)
uv venv

# 啟動環境
source .venv/bin/activate

# 極速安裝套件
uv pip install requests

# 極速從清單安裝
uv pip install -r requirements.txt
```

_(對於需要頻繁建置 CI/CD Pipeline 或是編譯容器映像檔的 DevOps 來說，換成 `uv` 可以大幅縮短等待時間。)_