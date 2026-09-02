---
title: Arch系 Pacman / Yay 實用指令與維護技巧筆記
tags:
  - Linux
  - Arch
  - Manjaro
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Manjaro](https://img.shields.io/badge/Manjaro-Supported-green?style=plastic&logo=manjaro)

## 一、 起手式：如何安裝 Yay (依據不同 Arch 分支)

在 Arch 系統中，官方套件庫以外的軟體都在 AUR (Arch User Repository) 裡。`yay` 是一個用 Go 寫的強大工具，同時相容 `pacman` 的語法，並能無縫幫你從 AUR 下載與編譯軟體。

根據你所使用的 Arch 分支，安裝 `yay` 的難易度有所不同：

**1. Vanilla Arch Linux (原生 Arch) 或 ArchWSL** 因為原生 Arch 的官方庫不收錄 AUR helper，所以第一次必須手動抓原始碼下來編譯：

```bash
# 1. 安裝必備的編譯工具與 Git
sudo pacman -S --needed git base-devel

# 2. 把 yay 的原始碼 clone 下來並進入資料夾
git clone https://aur.archlinux.org/yay.git
cd yay

# 3. 編譯並安裝 (-s 自動解決相依性，-i 編譯後自動安裝)
makepkg -si
```

**2. Manjaro** Manjaro 官方很貼心地把 `yay` 放進了他們自己的社群套件庫中，所以可以直接用 pacman 安裝：

```bash
# 雖然可以直接裝 yay，但建議連 base-devel 一起裝，以後編譯 AUR 軟體才不會報錯
sudo pacman -S base-devel yay
```

**3. EndeavourOS / Garuda Linux** 這兩個主打開箱即用的 Arch 分支，系統灌好的當下**預設就已經裝好 `yay` 了**，完全不需要動手。如果真的不小心被移除，因為他們有掛載自己的倉庫，同樣直接下指令即可：

```bash
sudo pacman -S yay
```

裝好之後，你日常的套件管理基本上都可以把 `pacman` 替換成 `yay` 來執行。

## 二、 基礎維護：安裝與更新系統

**1. 系統全面更新與降級同步** 一般情況下，這會同時更新官方套件與 AUR 內的套件：

```bash
yay -Syu
```

> **進階知識：`yay -Syu` 與 `yay -Syyuu` 的差異？**
> 
> - **`-Syu` (標準更新)：** `-y` 代表同步最新的套件資料庫，`-u` 代表升級所有舊版套件。這是日常更新最常用的指令。
>     
> - **`-Syyuu` (強制同步並允許降級)：**
>     
>     - **`-yy`**：不管你本機的資料庫是不是最新的，**強制**重新從伺服器下載同步一次（通常在你剛換過 mirror 鏡像站，或是資料庫損毀時使用）。
>     - **`-uu`**：允許套件**降級 (downgrade)**。如果伺服器上的軟體版本比你電腦裡的還舊（例如：官方發現新版有嚴重 Bug 緊急撤回新版），加上兩個 `u` 就能強迫系統跟著官方倉庫的狀態一起退回舊版。

**2. 搜尋與安裝套件**

```bash
# 安裝特定套件
yay -S <套件名稱>

# 如果不知道確切名稱，直接打 yay 加上關鍵字，它會列出清單讓你選
yay <關鍵字>
```

## 三、 套件解除安裝與「孤兒」清理 (Orphans)

在 Arch 裡，最忌諱只用 `pacman -R` 移除了主程式，卻留下一大堆當初為了它而裝的相依套件。

**1. 乾淨移除套件（連帶移除依賴）** 養成習慣，移除軟體時加上 `s`，如果想連全域設定檔一起清掉，可以加上 `n`：

```bash
sudo pacman -Rns <套件名稱>
# 或是
yay -Rns <套件名稱>
```

**2. 清除孤兒套件 (Orphans)** 隨著系統滾動更新或軟體反覆安裝移除，會產生一些沒有任何軟體依賴的「孤兒套件」。

- **Pacman 原生解法：**
   
```bash
   # 一鍵清除所有孤兒套件
   sudo pacman -Rns $(pacman -Qtdq)
```
   
- **Yay 內建神技（推薦）：** 不用背上面那串，`yay` 內建專屬的清理指令：

 ```bash
   yay -Yc
 ```
   

## 四、 釋放硬碟空間：快取清理 (Cache)

每次更新或下載的安裝包都會堆積在 `/var/cache/pacman/pkg/` 裡，久了會吃掉極大的硬碟空間。

**1. 手動清理快取**

```bash
# 安全清理：只清除「已經被解除安裝」的套件快取檔
yay -Sc

# 深度清理：清除「所有」快取（釋放空間最大，但日後降級會找不到本機舊檔）
yay -Scc
```

**2. 進階技巧：使用 Systemd 自動定時清理** 利用 `paccache -r` 指令（預設會保留最新 3 個版本，刪除更舊的檔案）。

> **注意：** 需先安裝 `pacman-contrib` 套件 (`yay -S pacman-contrib`)。

建立服務檔 `/etc/systemd/system/paccache.service`：

```toml
[Unit]
Description=Clean-up old pacman pkg cache

[Service]
ExecStart=/usr/bin/paccache -r
```

建立計時器檔 `/etc/systemd/system/paccache.timer`：

```toml
[Unit]
Description=Clean-up old pacman pkg cache

[Timer]
OnCalendar=monthly    # 設定每個月做一次
Persistent=true       # 確保排程不會因為關機而漏掉

[Install]
WantedBy=multi-user.target
```

啟用並啟動計時器：

```bash
sudo systemctl enable paccache.timer
sudo systemctl start paccache.timer
```

## 五、 救命工具：套件降級 (Downgrade)

Arch 屬於滾動式更新（Rolling Release），難免會遇到某次更新後，某個軟體或核心突然爛掉的狀況。這時候就需要用 `downgrade` 工具把它退回上一個穩定版本。

**1. 安裝 Downgrade 工具** 這支程式放在 AUR 裡面，用 yay 安裝：

```bash
yay -S downgrade
```

**2. 降級特定套件** 當你發現某個套件（例如 Firefox 或是 Linux Kernel）更新後壞了，請執行：

```bash
sudo downgrade <套件名稱>
```

**執行後的流程與技巧：**

1. 程式會列出該套件的所有歷史版本。它會優先從你本機的快取（`/var/cache/pacman/pkg/`）找，如果本機沒有，它會連上 Arch Linux Archive (A.L.A.) 雲端歷史庫去抓。
2. 輸入對應版本的「編號」按下 Enter。
3. **⚠️ 關鍵步驟：** 降級完成後，終端機會問你： `add <套件名稱> to IgnorePkg? [y/N]` **強烈建議選 `y`**。這樣該套件就會被寫入 pacman 的黑名單，下次你下 `yay -Syu` 全局更新時，pacman 會自動跳過它，避免它又被偷偷升級回壞掉的版本。

**3. 如何解除降級鎖定（解除 IgnorePkg）** 當官方釋出修復更新，你想重新讓該軟體恢復升級時，只要編輯 `/etc/pacman.conf`：

```bash
sudo vim /etc/pacman.conf
```

找到 `IgnorePkg = <套件名稱>` 這一行，把它刪除或在前面加上 `#` 註解掉，存檔離開後，下次更新就會恢復正常了。

