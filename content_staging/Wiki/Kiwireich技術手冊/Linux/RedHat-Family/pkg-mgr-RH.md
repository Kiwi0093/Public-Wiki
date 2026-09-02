---
title: Red Hat / Fedora DNF 實用指令與維護技巧筆記
date: 2026-09-02
tags:
  - Linux
  - Oracle-Linux
  - PhotonOS
  - RHEL
  - Fedora
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![RHEL](https://img.shields.io/badge/RHEL-Supported-green?style=plastic&logo=redhat) 
![Centos](https://img.shields.io/badge/Centos-Supported-green?style=plastic&logo=centos)
![Fredora](https://img.shields.io/badge/Fedora-Supported-green?style=plastic&logo=fedora) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 


# Red Hat / Fedora / DNF 實用指令與維護技巧筆記

## 一、 起手式：從 YUM 到 DNF 的現代化轉變

在 Red Hat 家族中，老玩家可能非常習慣使用 `yum`。但自從 RHEL 8 / CentOS 8 之後，底層的包管理工具已經全面被 **`dnf` (Dandified YUM)** 取代。

`dnf` 解決了以前 `yum` 佔用記憶體過大、解析相依性緩慢的問題。雖然你在終端機打 `yum` 還是會通（因為系統做了一個指向 `dnf` 的 alias），但強烈建議把肌肉記憶改成直接打 `dnf`。

_(註：如果你是用極簡的容器映像檔或是 VMware Photon OS，可能會看到 `microdnf` 或 `tdnf`，它們是 `dnf` 的輕量級 C 語言實作版，指令用法有 95% 以上是共通的。)_

## 二、 基礎維護：安裝與更新系統

**1. 系統全面更新** 這會自動比對套件庫並更新所有已安裝的軟體：

```bash
sudo dnf upgrade -y
# （註：在 dnf 中，update 跟 upgrade 基本上是同義詞，官方建議使用 upgrade）
```

**2. 搜尋與安裝套件**

```bash
# 安裝特定套件
sudo dnf install <套件名稱>

# 模糊搜尋套件
dnf search <關鍵字>

# 神奇指令：用「檔案路徑」來反查是哪個套件提供的 (Provides)
# 例如你缺了某個指令卻不知道要裝什麼包，可以直接查：
dnf provides */ifconfig
```

## 三、 套件解除安裝與「孤兒」清理 (Orphans)

Red Hat 家族在清理孤兒套件的機制上，比 Debian 預設聰明很多。現代的 DNF 預設（`clean_requirements_on_remove=True`）在移除軟體時，就會順手把不需要的相依套件帶走。

**1. 移除套件**

```bash
sudo dnf remove <套件名稱>
```

**2. 清除孤兒套件 (Orphans)** 雖然 DNF 移除時很乾淨，但有時候因為套件庫變動，還是會產生一些沒人要的依賴。定期清一下保平安：

```bash
sudo dnf autoremove
```

## 四、 釋放硬碟空間：快取清理 (Cache)

DNF 每次下載中繼資料 (Metadata) 和安裝檔 (`.rpm`) 都會存在 `/var/cache/dnf/` 中。這也是最容易吃掉 VM 硬碟空間的元兇。

**1. 手動清理快取**

```bash
# 安全清理：只清除下載過的 rpm 安裝檔，保留 metadata
sudo dnf clean packages

# 深度清理：把安裝檔和 metadata 全部清空（釋放最大空間）
sudo dnf clean all
```

> **注意：** 執行 `clean all` 後，下次你下 `dnf install` 或是 `dnf search` 時，系統會花比較長的時間重新把幾十 MB 的清單 (Metadata) 抓回來。

## 五、 救命工具：歷史回溯 (History) 與套件鎖定 (Versionlock)

這是 DNF 最強大的殺手級功能！相較於 Arch 或 Debian 還要自己找舊檔降級，DNF 內建了「時光機」。

**1. 超強神技：使用 History 退回更新前狀態** 如果你更新完系統發現爛掉了，不用慌，用 history 把整個更新動作「復原」：

```bash
# 1. 查詢 DNF 執行紀錄（會列出一個清單，最左邊有 ID 編號）
dnf history

# 2. 檢視某次 ID 到底裝了/更新了什麼東西 (假設 ID 是 15)
dnf history info 15

# 3. 時光倒流！把 ID 15 做的所有變更「復原 (undo)」
sudo dnf history undo 15
```

**2. 單一套件直接降級** 如果不想用歷史紀錄，單純只想把某個套件退回上一版：

```bash
sudo dnf downgrade <套件名稱>
```

**3. 套件鎖定防升級 (Versionlock)** 當你降級了某個軟體（例如某個特定版本的 Docker），不希望它在下次更新時被升上去，你需要安裝 versionlock 外掛：

```bash
# 安裝 DNF 核心外掛包
sudo dnf install dnf-plugins-core

# 將套件上鎖
sudo dnf versionlock add <套件名稱>

# 查詢目前被鎖定的套件有哪些
dnf versionlock list

# 解除鎖定
sudo dnf versionlock delete <套件名稱>
# 或是全解鎖
sudo dnf versionlock clear
```

## 六、 進階：第三方套件庫與 EPEL (企業版必備)

在 Red Hat / Rocky / AlmaLinux 中，預設的官方套件庫非常保守，為了求穩，很多好用的開源軟體（例如 htop, nginx 較新版, certbot）預設都沒有。

**1. 必裝套件庫：EPEL (Extra Packages for Enterprise Linux)** 這是由 Fedora 社群維護，專門提供給企業版 Linux 的高質量額外套件庫。開新機器第一件事就是裝它：

```bash
sudo dnf install epel-release
sudo dnf upgrade
```

**2. 新增第三方套件庫 (Repository)** Red Hat 系的套件庫設定檔都放在 `/etc/yum.repos.d/` 下，副檔名為 `.repo`。 要新增第三方的源（例如 Docker 官方源），不需要自己建檔案，使用內建的 config-manager 最快：

```bash
# 新增一個 .repo
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

**3. GPG 金鑰管理** DNF 預設會自動處理金鑰，當你第一次從新的 repo 下載軟體時，終端機會跳出提示問你是否接受該金鑰，按 `y` 即可。如果是自動化佈署腳本，可以提前手動匯入金鑰：

```bash
sudo rpm --import https://download.docker.com/linux/centos/gpg
```

## 七、 終極加碼：專為容器宿主機打造的極簡變體 TDNF (Tiny DNF)

如果你是在虛擬化環境（例如 ESXi）中運行專為容器最佳化的 **VMware Photon OS**，系統內建的套件管理員會是 `tdnf` (Tiny DNF)。

**為什麼要有 TDNF？** 完整的 DNF 背後重度依賴龐大的 Python 環境與函式庫。為了讓作業系統的映像檔保持極致精簡、減少攻擊面與資源佔用，開發團隊用 C 語言重新改寫了 DNF，徹底拔除了 Python 依賴，這就是 `tdnf` 的由來。

**1. 無痛轉移的基礎操作** 因為是相容實作，你從 DNF 建立起來的肌肉記憶，在 `tdnf` 上幾乎可以 100% 照搬：

```bash
# 系統全面更新
sudo tdnf upgrade -y

# 安裝與移除套件
sudo tdnf install <套件名稱>
sudo tdnf remove <套件名稱>

# 搜尋套件
tdnf search <關鍵字>

# 清理快取（精簡空間必備）
sudo tdnf clean all
```

**2. TDNF 的限制與差異 (避坑指南)** 雖然指令語法幾乎一樣，但因為是「極簡版」，少了龐大的外掛生態系，實務上有幾個關鍵差異需要特別注意：

- **沒有 History 時光機：** `tdnf` 沒有內建像原版 DNF 那樣完整的本地資料庫來追蹤每一次的安裝歷史，因此無法使用 `tdnf history undo` 這種高級回退功能。在執行核心升級或重大更新前，請務必先在 Hypervisor 端**打好 VM 快照 (Snapshot)** 以防萬一。
    
- **套件庫生態系完全獨立：** Photon OS 有自己專屬的官方軟體庫。**千萬不要**試圖把 CentOS / RHEL / Fedora 的 EPEL (Extra Packages for Enterprise Linux) 設定檔硬塞給 Photon OS 用，底層 glibc 與核心版本的差異極有可能會讓系統直接崩潰。
    
- **不支援 Python 擴充套件：** 像是 `dnf-plugins-core` 或是用來鎖定版本的 `versionlock` 等依賴 Python 的高階外掛，在 TDNF 上是無法使用的。
    

**3. 套件庫設定與快取重建** TDNF 的套件庫設定檔與一般 Red Hat 系相同，皆存放在 `/etc/yum.repos.d/` 下。如果你手動新增或修改了 `.repo` 檔，或是網路連線異常導致抓不到最新軟體，可以強制清除並重建快取：

```bash
# 清除舊快取並強制從伺服器重新下載中繼資料
sudo tdnf clean all
sudo tdnf makecache
```