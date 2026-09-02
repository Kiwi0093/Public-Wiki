---
title: WSL 客製化Kernel
tags:
  - Linunx
  - Windows
  - WSL
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 

:::tip
WSL 預設允許使用者載入自訂的 Linux Kernel（核心）。因為某些特定的進階應用（例如跑 QEMU/KVM 虛擬機時需要使用橋接網路或進階流量控制），官方預設的 Kernel 往往缺少了對應的模組（如 TC/QoS）。透過自己 Config 與編譯 WSL Kernel，我們可以完美補齊這些需要的功能。
:::
## 參考資料

- [MacOS on WSL2(Win10)](https://www.google.com/search?q=https://github.com/sickcodes/Docker-OSX)
- [Accelerated KVM guests on WSL 2](https://www.google.com/search?q=https://boxofcables.dev/accelerated-kvm-guests-on-wsl-2/)
- [WSL2-Linux-Kernel (Microsoft GitHub)](https://www.google.com/search?q=https://github.com/microsoft/WSL2-Linux-Kernel)
- [WSL2 自编译内核使用 tc qdisc](https://www.google.com/search?q=https://zhuanlan.zhihu.com/p/...)
- [如何編譯與更換WSL核心 (custom WSL kernel)](https://www.google.com/search?q=https://...)

## 一、 編譯前置準備 (Preparation)

### 1. 安裝編譯所需的套件

在 Arch Linux (WSL) 內，除了基本的 `base-devel`，編譯 Kernel 還需要 `ncurses` (為了 menuconfig)、`bc`、`flex` 與 `bison` 等工具：

Bash

```
sudo pacman -S base-devel ncurses bc flex bison pahole libelf
```

### 2. 取得 WSL2 Linux Kernel 原始碼

使用 Git 抓取微軟開源的 WSL Kernel 原始碼。

> **提示：** 這裡假設你要抓 `6.1.y` 版。若要其他版本，請參考 GitHub repo 上的 branch name 替換。加上 `--depth=1` 可以只抓取最新的 commit，大幅節省下載時間與硬碟空間。

Bash

```
git clone https://github.com/microsoft/WSL2-Linux-Kernel.git --depth=1 -b linux-msft-wsl-6.1.y
cd WSL2-Linux-Kernel
```

## 二、 準備 Kernel Config 設定檔

很多教學會建議直接複製 `WSL2-Linux-Kernel` repo 內的 `Microsoft/config-wsl` 來用，但**強烈不建議**這麼做。

**為什麼不用官方的 `config-wsl`？** 你會發現官方檔案裡有大量的 `M` (編譯為動態載入模組)。但在 WSL 環境中，如果沒有特別設定模組的路徑與載入機制，自訂 Kernel 換上去之後，那些設為 `M` 的功能（例如 WireGuard）往往會抓不到而直接「暴死」。

**最佳實踐：從當前系統匯出設定檔** 從正在穩定運行的 WSL Kernel 中把 Config 抽出來用最保險，抽出來的設定檔預設都會是 `*` (Built-in，直接包進核心裡)。

你可以用以下兩種方式之一，將設定檔匯出並命名為 `.config` (放在剛才 clone 下來的原始碼根目錄)：

Bash

```
zcat /proc/config.gz > .config

# 或是
cat /proc/config.gz | gunzip > .config
```

## 三、 設定與編譯 (Configuration and Compile)

### 1. 修改 Config (加入 TC/QoS 支援)

如同前面的建議，請**不要手動去編輯** `.config` 文字檔，因為模組之間有相依性，手動改很容易出錯。請使用 `menuconfig` 工具來操作：

Bash

```
# 如果你的檔案就叫 .config 且在當前目錄，其實可以直接打 make menuconfig
make menuconfig KCONFIG_CONFIG=.config
```

**加入 TC/QoS (Traffic Control / Quality of Service) 功能：** 我這次手動編譯的原因，是因為新的 QEMU package 需要用到 tc/QoS 的功能。進入文字圖形介面後，請導航到以下路徑，並將裡面的項目全部按下 `Y` 鍵，使其變成 `*` (Built-in) 狀態： `Networking support` -> `Network options` -> `QoS and/or fair queueing`

設定完成後，選擇 `Save` 並離開。

### 2. 開始編譯 (Compile)

設定好並儲存後，就可以開始編譯了。我們可以直接指定編譯 `bzImage`，這樣更精準：

Bash

```
# 使用系統所有的 CPU 核心去編譯 (速度最快)
make -j$(nproc) KCONFIG_CONFIG=.config bzImage

# 當然，若你只想分配特定數量的核心 (例如 16 核心)，可以手動指定：
make -j16 KCONFIG_CONFIG=.config bzImage
```

編譯完成後，你的新核心檔案會靜靜地躺在： `arch/x86/boot/bzImage`

## 四、 替換與使用自訂 Kernel

把編譯好的 `bzImage` 複製到 Windows 主機上你喜歡的資料夾，例如 `C:\WSL_Kernel\bzImage`。

### 方法 A：修改全域設定 `.wslconfig` (強烈推薦 🌟)

這也是官方最推薦且最安全的做法。在 Windows 中編輯 `C:\Users\<你的帳號>\.wslconfig` 檔案：

> **注意：** Windows 路徑中的反斜線 `\` 必須跳脫寫成 `\\` 才會生效。

Ini, TOML

```
# Main WSL Setting Section
[wsl2]
# 允許 WSL 跑 Hypervisor 功能 (QEMU/KVM 必備)
nestedVirtualization=true

# 指定自訂的 Kernel 檔案位置
kernel=C:\\WSL_Kernel\\bzImage

# 限制 WSL 的最大 RAM 使用量 (單位可使用 GB/MB)
memory=16GB
```

設定好之後，在 PowerShell 中執行 `wsl --shutdown` 強制關閉 WSL，再次啟動時就會載入你的自訂核心了。（可用 `uname -r` 確認版本）

### 方法 B：直接覆蓋 Windows 預設 Kernel (極度不推薦 ❌)

Windows 預設存放 WSL Kernel 的路徑位於： `C:\Windows\system32\lxss\tools\kernel`

你可以直接把編譯好的 `bzImage` 改名為 `kernel` 並丟進這個資料夾覆蓋它（需要 Administrator 權限，且必須先將 WSL 完全 shutdown）。 **缺點：** 什麼都不用設定就能直接套用。 **致命傷：** 萬一你自己編譯的核心有 Bug 導致無法開機，你連預設的救援環境都沒有，非常慘烈，因此極度不建議這麼做。