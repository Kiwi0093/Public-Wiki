---
title: Gentoo / Portage / Emerge 實用指令與維護技巧筆記
date: 2026-09-02
tags:
  - Linux
  - Gentoo
---
# Gentoo / Portage / Emerge 實用指令與維護技巧筆記

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Gentoo](https://img.shields.io/badge/Gentoo-Supported-green?style=plastic&logo=gentoo) 

## 一、 起手式：Portage 與 USE Flags 的哲學

在 Gentoo 中安裝軟體，系統預設是把原始碼抓下來「現場編譯」。這帶出了 Gentoo 最強大的核心：**USE Flags**。 你可以透過定義 USE Flags，在編譯時就決定要拔除或加入什麼功能（例如：全系統不編譯藍牙支援、不帶 GUI 介面等），達成極致的輕量化。

全域設定檔通常位於 `/etc/portage/make.conf`，而個別套件的精細設定則放在 `/etc/portage/package.use/`。

## 二、 基礎維護：同步與更新系統

Gentoo 的更新指令被玩家戲稱為「詠唱咒語」，因為參數非常長，但每一個都很重要。

**1. 同步 Portage 樹 (Sync)** 先去遠端把最新的「編譯腳本 (ebuilds)」目錄抓下來：

```bash
# 傳統用法
sudo emerge --sync

# 現代較推薦的用法 (速度較快，支援多種 repository)
sudo emaint sync -a
```

**2. 系統全面更新 (World Update)** 這行是 Gentoo 玩家最熟悉的終極指令：

```bash
sudo emerge --ask --verbose --update --deep --newuse @world
# 通常會縮寫為：
sudo emerge -avuDN @world
```

> **參數解析：**
> 
> - `-a (ask)`：編譯前先列出清單問你確不確定（必加，防手殘）。
> - `-v (verbose)`：顯示詳細資訊（包含 USE Flags 變動）。
> - `-u (update)`：更新套件。
> - `-D (deep)`：連同相依套件的整條依賴鏈一起檢查更新。
> - `-N (newuse)`：如果你改了 USE Flags，這會自動把受影響的套件抓出來「重新編譯」以套用新設定。

**3. 更新設定檔 (Dispatch-conf)** 更新完軟體後，如果有全域設定檔發生衝突，Gentoo 不會直接覆蓋。你需要執行：

```bash
sudo dispatch-conf
# 或是
sudo etc-update
```

按下 `u` 來套用新設定，或按 `z` 捨棄。

## 三、 套件安裝與「孤兒」清理

**1. 搜尋與安裝套件**

```bash
# 搜尋套件 (但原生的 search 速度很慢，後面會介紹替代方案 eix)
emerge --search <關鍵字>

# 安裝套件 (並加入 world 記錄檔中)
sudo emerge -av <套件名稱>

# ⚠️ 關鍵技巧：只安裝不記錄 (Oneshot)
# 當你想安裝某個編譯工具或依賴，但不想把它當作主要軟體記錄下來時用：
sudo emerge -av --oneshot <套件名稱>
```

**2. 解除安裝與清理孤兒套件 (Depclean)** Gentoo 的移除邏輯非常嚴謹。如果你直接用 `emerge -C <套件>` (unmerge) 強制移除，很容易把別人的依賴砍掉導致系統爆炸。

**標準且安全的移除流程：**

```bash
# 1. 拔除指定套件，並從 @world 清單中刪除 (它會檢查相依性，若有別人需要它會阻止你)
sudo emerge --deselect <套件名稱>

# 2. 執行依賴清理 (Depclean)！它會把所有不在 @world 裡，也沒人需要的孤兒套件清乾淨
sudo emerge --ask --depclean
# 縮寫為：
sudo emerge -a --depclean
```

**3. 重建受損的動態連結庫 (Preserved-rebuild)** 當你清理完或升級完核心函式庫 (如 glibc, openssl) 後，某些舊軟體可能會找不到 `.so` 檔。執行這行可以自動幫你把受影響的軟體找出來重新編譯：

```bash
sudo emerge @preserved-rebuild
```

## 四、 釋放硬碟空間：原始碼快取清理

Gentoo 編譯前會下載所有的 Source Code 壓縮檔 (Tarballs)，全部堆在 `/var/cache/distfiles/`。久了會吃掉極度恐怖的空間。

**1. 安裝 Gentoolkit** 這是官方維護的一組超強管理工具包，必裝：

```bash
sudo emerge -av app-portage/gentoolkit
```

**2. 使用 eclean 清理快取**

```bash
# 安全清理：保留目前已安裝套件的原始碼壓縮檔，刪除過期版本的
sudo eclean-dist

# 深度清理：超狠！只要不是 Portage 樹裡面的最新版本，全部刪除 (-d = deep)
sudo eclean-dist -d

# 如果你有打包二進位檔 (buildpkg)，清理舊的二進位包
sudo eclean-pkg -d
```

## 五、 救命工具：套件降級、版本鎖定與 Mask

在 Gentoo 中，版本的控制是透過 `/etc/portage/package.mask` (黑名單/禁用) 和 `/etc/portage/package.accept_keywords` (解鎖測試版) 來實現的。

**1. 指定安裝舊版本 (降級)** 如果你發現新版有 Bug，可以用 `=` 指定版本號強行安裝舊版：

```bash
# 注意前面的 = 號必加，且要加上完整的類別路徑
sudo emerge -av =sys-kernel/gentoo-sources-6.1.60
```

**2. 鎖定版本防升級 (Masking)** 為了避免下次 `emerge -avuDN @world` 時系統又手賤幫你升級回去，你必須把新版「Mask（遮蔽）」掉。

編輯或建立 `/etc/portage/package.mask` 檔案（也可以建一個同名資料夾，在裡面放文字檔）：

```bash
# 告訴 Portage：大於等於 6.2 版本的這個軟體，我通通不要
>=sys-kernel/gentoo-sources-6.2.0
```

設定好之後，Portage 就會當作世界上沒有 6.2 版以上的存在了。

## 六、 進階神兵利器 (加速與搜尋)

**1. Eix：極速搜尋工具** 原生的 `emerge --search` 每次都要掃描整個文字庫，慢到令人髮指。請務必安裝 `eix`。

```bash
sudo emerge -av app-portage/eix

# 初始化建立索引資料庫
sudo eix-update

# 極速搜尋套件
eix <關鍵字>
```

**2. 加速編譯：MAKEOPTS** 因為都是現場編譯，編譯速度取決於你的 CPU 核心數。請務必在 `/etc/portage/make.conf` 裡面設定平行編譯：

```toml
# 假設你的 CPU 是 16 執行緒，通常設定為核心數或 核心數+1
MAKEOPTS="-j16 -l16"
```

**3. Ccache：編譯快取** 如果你常常重新編譯同樣的套件（例如你在改寫自己的 Kernel config 或是換 USE Flags 測試），安裝並啟用 `ccache` 可以讓第二次編譯的速度提升好幾倍。這也是 Gentoo 玩家的必備設定。
