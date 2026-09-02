---
title: Flatpak / Snap / AppImage 實用筆記
date: 2026-09-02
tags:
  - Linux
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

# Linux 跨發行版沙盒三大神器：

## 一、 三大格式本質與特性速覽

|**格式**|**主要推動者**|**核心哲學**|**運行機制**|**優點**|**缺點 / 痛點**|
|---|---|---|---|---|---|
|**Flatpak**|Red Hat / 社群|專注桌面 GUI 應用|依賴共用 Runtime，Bubblewrap 沙盒隔離|權限控管極佳、去中心化套件庫 (Flathub)、啟動速度快|CLI 工具支援差，主要針對桌面應用|
|**Snap**|Canonical (Ubuntu)|全方位 (桌面 + 伺服器)|依賴 squashfs 掛載，AppArmor 沙盒隔離|支援伺服器後端/Daemon、自動更新機制強大|啟動冷開機稍慢、中心化 (只有 Canonical 官方商店)、`lsblk` 會被塞滿 loop 設備|
|**AppImage**|開源社群 (probono)|極致單檔，綠色免安裝|內建依賴的唯讀映像檔，透過 FUSE 直接執行|隨載隨跑、不需 Root、完全不污染系統|缺乏官方統一更新機制、桌面整合 (捷徑/圖示) 需手動處理|

## 二、 Flatpak：現代 Linux 桌面 GUI 應用的首選

Flatpak 現在已經是 Fedora、Arch、Debian 等社群在桌面端事實上的標準。它的套件全部集中在 [Flathub](https://flathub.org/)，而且權限控管非常嚴格（預設讀不到你的家目錄）。

### 1. 起手式：安裝與啟用 Flathub 軟體源

大部分現代發行版已內建，如果沒有：

```bash
# Arch: sudo pacman -S flatpak
# Debian/Ubuntu: sudo apt install flatpak

# 加入目前最大的軟體倉庫 Flathub (必做)
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

### 2. 基礎操作

Flatpak 的軟體通常使用類似 Java 的「反向域名」來命名（例如 `org.mozilla.firefox`、`com.spotify.Client`）。

```bash
# 搜尋軟體
flatpak search <軟體名稱>

# 安裝軟體 (可以打全名或關鍵字讓它選)
flatpak install flathub com.spotify.Client

# 執行軟體 (通常應用程式選單會自動出現圖示，若要在終端機跑)：
flatpak run com.spotify.Client

# 全面更新所有 Flatpak 軟體與 Runtime
flatpak update -y

# 移除軟體
flatpak uninstall com.spotify.Client
```

### 3. 神級清理與權限調整 (必學)

- **清理未使用的 Runtime (釋放空間)：**
    
    Flatpak 升級後，舊的 Runtime（如 GNOME/KDE 執行環境）常會留著佔硬碟：
    
    
 ```bash
  flatpak uninstall --unused
 ```
    
- **權限修改神器 Flatseal：**
    
    因為 Flatpak 預設有沙盒隔離，有時候你裝了某個編輯器（如 VSCode 或 GIMP），會發現它「讀不到你硬碟其他槽的資料夾」或「抓不到隨身碟」。直接安裝 **Flatseal**：
    
    
   ```bash
   flatpak install flathub com.github.tchx84.Flatseal
   ```
    
    打開這個圖形化工具，你可以像在手機上一樣，隨意開關某個軟體能否存取網路、檔案系統、攝影機或 Wayland/X11 顯示。
    

## 三、 Snap：Ubuntu 的親兒子，桌面與伺服器兩棲

Snap 是 Canonical 打造的技術。除了桌面軟體，它最大的特點是**可以直接打包系統 Daemon 與伺服器軟體**（例如 Nextcloud、Docker、Certbot）。

### 1. 基礎操作

```bash
# 安裝軟體
sudo snap install <軟體名稱>

# ⚠️ 關鍵參數：經典模式 (--classic)
# 某些需要深層存取系統的開發工具 (例如 VSCode, Go, Node.js)，需要關閉沙盒模式安裝：
sudo snap install code --classic

# 搜尋與資訊
snap find <關鍵字>
snap info <軟體名稱>

# 更新軟體 (Snap 預設會在背景自動更新，但你也可以手動強制觸發)
sudo snap refresh

# 移除軟體
sudo snap remove <軟體名稱>
```

### 2. 空間瘦身神技 (清理舊版 snap)

Snap 預設會保留每個軟體的「舊版本」以防升級失敗回滾，但這會讓 `/var/lib/snapd/snaps/` 吃掉幾十 GB 空間。

可以調整保留的版本數量（預設是 3，改成只保留 2 個）：

```bash
sudo snap set system refresh.retain=2
```

## 四、 AppImage：真正的單一執行檔「綠色軟體」

AppImage 就像 Windows 時代的「免安裝綠色版 (.exe)」。它把所有的程式碼、函式庫與依賴通通封裝成一個 `.AppImage` 檔案。

### 1. 使用流程 (極其簡單)

1. 從 GitHub Release 或官網下載 `xxx.AppImage`。
    
2. 給予執行權限：
    
     
   ```bash
   chmod +x xxx.AppImage
   ```
    
3. 直接雙擊執行，或在終端機輸入：
    
    
   ```bash
   ./xxx.AppImage
   ```
    
4. **不要了怎麼辦？** 直接把這個檔案丟進垃圾桶，就徹底解除安裝了，完全不殘留系統庫。
    

### 2. 避坑指南：必備的 FUSE 支援

現代很多 Linux（例如 Ubuntu 22.04+ 或某些極簡系統）預設沒有安裝舊版 FUSE，導致執行 AppImage 時會報錯：`dlopen(): error loading libfuse.so.2`。

遇到這個問題，補裝一下相容套件即可：

- **Ubuntu / Debian:** `sudo apt install libfuse2`
    
- **Arch:** `sudo pacman -S fuse2`
    
- **Fedora:** `sudo dnf install fuse-libs`
    

### 3. 進階神器：AppImageLauncher (解決桌面捷徑痛點)

AppImage 最大的缺點就是：它只是一個檔案，不會自動出現在你的系統應用程式選單（Application Menu）裡，也沒有圖示。

強烈建議安裝社群工具 **[AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher)**：

- 安裝後，每次你雙擊任何新的 `.AppImage` 檔，它會跳出提示問你：「要不要整合到系統？」。
- 選「Yes」後，它會自動幫你把檔案歸檔到集中目錄，並在應用程式選單建立標準的桌面捷徑與 Icon，體驗瞬間變得跟原生軟體一模一樣！