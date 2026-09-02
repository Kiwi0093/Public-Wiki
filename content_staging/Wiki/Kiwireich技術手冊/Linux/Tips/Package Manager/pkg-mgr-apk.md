---
title: Alpine / apk 實用指令與 Docker 最佳化筆記
date: 2026-09-02
tags:
  - Linux
  - Alpine
  - Docker
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Alpine](https://img.shields.io/badge/Alpine-Supported-green?style=plastic&logo=alpinelinux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 一、 起手式：認識 apk 與 Alpine 的極簡哲學

Alpine Linux 之所以能成為 Docker 基礎映像檔（Base Image）的霸主，是因為它捨棄了龐大的 GNU 工具鏈（如 `glibc`），改用極輕量的 `musl libc` 與 `BusyBox`。一個純淨的 Alpine 映像檔只有不到 5MB！

而與之搭配的 `apk`，其操作邏輯非常直覺，且執行速度極快。設定檔主要位於 `/etc/apk/repositories`。

## 二、 基礎維護：日常系統的安裝與更新

如果你是把 Alpine 當作一台獨立的 VM 或 LXC 容器在日常維護，基礎指令如下：

**1. 系統更新** 跟 `apt` 類似，需要先更新本地的索引目錄，再執行升級：

```bash
# 更新套件索引
apk update

# 升級所有已安裝的套件
apk upgrade

# 也可以一行搞定
apk update && apk upgrade
```

**2. 搜尋與查詢**

```bash
# 搜尋套件
apk search <關鍵字>

# 查詢已安裝套件的詳細資訊
apk info <套件名稱>

# 列出所有已安裝的套件
apk info
```

## 三、 Dockerfile 必備神技：映像檔極致瘦身

如果你是在寫 Dockerfile，請**忘記**上面那招 `apk update`。在容器打包的最佳實踐中，我們有更聰明的參數可以把映像檔體積壓到最小。

**1. 神級參數：`--no-cache` (取代 update 與清理快取)** 在 Debian/Ubuntu 寫 Dockerfile 時，我們常被迫寫出這種又長又醜的指令來避免快取殘留： `apt-get update && apt-get install -y xxx && rm -rf /var/lib/apt/lists/*`

在 Alpine 裡，你只需要加上 `--no-cache`，它會自動從伺服器抓取最新的索引，將軟體裝好，然後**完全不在本地硬碟留下任何快取與索引檔**，一行搞定：

```dockerfile
# 完美、乾淨、不留痕跡的安裝方式
RUN apk add --no-cache curl nginx
```

**2. 虛擬群組參數：`--virtual` (用完即丟的免洗筷)** 這是 `apk` 最強大的殺手級功能。 當你需要「編譯」某個軟體（例如 Python 套件或 C 程式）時，往往需要安裝一堆編譯工具（`gcc`, `make`, `dev` 包）。編譯完後，這些工具就不需要了，但一個一個 `del` 掉非常麻煩。

`--virtual <自訂群組名稱>` 可以把這些依賴包暫時綁成一個虛擬標籤：

```dockerfile
# 1. 將編譯工具打包成名為 'build-deps' 的虛擬群組並安裝
RUN apk add --no-cache --virtual .build-deps gcc musl-dev python3-dev make

# 2. 執行你的編譯或安裝動作 (例如 pip install)
RUN pip install some-complex-package

# 3. 過河拆橋：一行指令把剛才 'build-deps' 裡面的所有工具全部清得一乾二淨！
RUN apk del .build-deps
```

> **實務應用：** 把上面三個步驟用 `&&` 串在 Dockerfile 的同一個 `RUN` 裡面，你的映像檔層 (Layer) 就不會包含任何肥大的編譯工具，體積會小得驚人。

## 四、 套件解除安裝與「孤兒」清理

`apk` 在解除安裝時，預設就會自動幫你檢查並移除那些「不再被任何軟體依賴的孤兒套件」，所以你不太需要像其他系統那樣頻繁地下達 autoremove。

**1. 移除套件**

```bash
apk del <套件名稱>
```

**2. 強制清理孤兒 (保險起見)** 如果你手動亂砍過檔案，或者想確保系統極度乾淨，雖然沒有原生的 autoremove 指令，但可以透過這招找出未被明確記錄的孤兒：

```bash
# 修正與清理所有系統依賴（不屬於 world 清單的包都會被洗掉）
apk fix
```

## 五、 進階：套件庫 (Repository) 管理

Alpine 的套件庫主要分為 `main` (核心支援) 與 `community` (社群維護)。很多好用的開源軟體預設在 `community` 裡，但系統可能沒有開啟。

**1. 開啟 Community 庫** 編輯 `/etc/apk/repositories`：

```bash
vi /etc/apk/repositories
```

你會看到類似這樣的內容，把 `community` 開頭的那行前面的 `#` 註解拿掉即可：

```bash
http://dl-cdn.alpinelinux.org/alpine/v3.18/main
http://dl-cdn.alpinelinux.org/alpine/v3.18/community
```

改完後記得跑一次 `apk update`。

**2. 針對單一套件臨時指定邊緣測試庫 (Edge)** 如果你急需某個軟體的最新版，但不想把整個系統升級成不穩定的測試版，可以這樣下指令臨時跨庫安裝：

```bash
# 臨時使用 edge 庫來安裝最新版的特定軟體
apk add --no-cache <套件名稱> --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
```