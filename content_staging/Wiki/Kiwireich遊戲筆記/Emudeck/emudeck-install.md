---
title: EmuDeck 安裝與跨平台配置 (Windows / Linux)
date: 2026-09-15
tags:
  - Windows
  - Linux
  - Gaming
  - EMU
---
# EmuDeck 安裝與跨平台配置 (Windows / Linux)

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Windows](https://img.shields.io/badge/Windows-Supported-green?style=plastic&logo=windows) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)

## 壹、架構規劃：集中式唯讀庫與多用戶本地存檔隔離

在搭配 Duo / Sunshine 進行多用戶並行串流或家庭多帳號共享時，最穩定的儲存邏輯為「ROM / BIOS 集中唯讀共享，遊戲存檔各帳號本機隔離」：

- **唯讀集中共享 (NAS / RomM)**：ROM 與 BIOS 存放於 NAS，透過 SMB 映射給各裝置（如 `Z:\roms` 與 `Z:\bios`）。
    
- **本機多帳號存檔隔離 (Saves / States)**：各使用者的遊戲存檔（`.srm`, `.sav`）與即時存檔（Save States）嚴禁寫回網路共享目錄。若存檔共用，同款遊戲在雙開或多人遊玩時會發生檔案鎖死（File Lock）與進度覆蓋災難。
    

### 1. NAS 端目錄結構規範

遠端 NAS 共享目錄需符合標準層級結構：

```
\\<NAS_IP>\Emulation\          <-- 網路磁碟機根目錄 (映射為 Z:\)
├── bios\                     <-- 各機種 BIOS (如 scph1001.bin 等)
│   └── ...
└── roms\                     <-- 平台資料夾名稱需完全吻合 EmuDeck 規範
    ├── gba\
    ├── ps2\
    └── snes\
```

### 2. Windows 本機開機持久化網路磁碟機 (Z:)

1. 開啟「檔案總管」➔「連線網路磁碟機」。
    
2. 磁碟機代號選擇 `Z:`，路徑輸入 `\\<NAS_IP>\Emulation`（勾選「登入時重新連線」）。
    
3. 若開機時常因網路延遲導致 `Z:` 斷線打叉，可建立開機批次檔：
    

```powershell
@echo off
timeout /t 5 /nobreak >nul
net use Z: \\<NAS_IP>\Emulation /persistent:yes
```

## 貳、Windows 環境安裝與「adb.zip 卡死」排除

### 一、安裝時指向網路磁碟機卡在「adb.zip」的成因

EmuDeck for Windows 安裝精靈在「系統環境準備（Prerequisites）」階段，即使未勾選任何 Android 模擬器，仍會強制下載 platform-tools（即 `adb.zip`）進行解壓縮。當安裝目標直接指定為**網路磁碟機 (Z:)** 時，SMB 的檔案控制代碼（File Handle）鎖定延遲或非同步寫入特性，會導致腳本在執行刪除或重試迴圈時誤判檔案狀態，進而陷入無限等待或程式死鎖。

### 二、解決方案（雙軌選用）

#### Option A：本機安裝，再以目錄連接點 (Junction) 接軌 NetDrive（推薦，最穩健）

為徹底避開安裝導引在遠端路徑上執行的 SMB 權限特權調用，先在本地完成安裝再做符號連結：

1. **強制終止殘留程序**：以系統管理員身分開啟 PowerShell，終止背景鎖定程序：
    
   ```powershell
    Stop-Process -Name "adb" -Force -ErrorAction SilentlyContinue
    Stop-Process -Name "EmuDeck*" -Force -ErrorAction SilentlyContinue
   ```
    
2. **手動建立假檔案防呆（防檢查中斷）**：
    
   ```powershell
    $paths = @(
        "$env:USERPROFILE\EmuDeck",
        "$env:APPDATA\EmuDeck",
        "$env:TEMP"
    )
    foreach ($p in $paths) {
        if (Test-Path $p) {
            New-Item -ItemType File -Path "$p\adb.zip" -Force -ErrorAction SilentlyContinue
        }
    }
   ```
    
3. **執行本地安裝**：
    
    - 執行 EmuDeck 安裝程式，選擇 **Custom Mode**。
        
    - 目標目錄選擇本機硬碟（例如預設的 `C:\Users\%USERNAME%\Emulation`）。
        
    - 模擬器清單中，將所有 Android 相關模擬器取消勾選。
        
4. **建立目錄連接點**： 安裝完成後完全關閉 EmuDeck，刪除本地產生的空資料夾：
    
    - 刪除 `C:\Users\%USERNAME%\Emulation\roms`
        
    - 刪除 `C:\Users\%USERNAME%\Emulation\bios`
        
    
    以系統管理員身分開啟 CMD 建立 Junction：
    
   ```powershell
    mklink /D "C:\Users\%USERNAME%\Emulation\roms" "Z:\roms"
    mklink /D "C:\Users\%USERNAME%\Emulation\bios" "Z:\bios"
   ```
    
    _驗證方式_：開啟 `C:\Users\%USERNAME%\Emulation\roms`，能正常讀取與操作 `Z:\roms` 的檔案即可。
    

#### Option B：直接手工修改 settings.json 繞過 ADB 檢查（直接安裝於 Z:）

若堅持將 EmuDeck 的安裝根目錄直接指定在 `Z:\`，可直接修改設定設定檔，強制宣告 ADB 與 Android 模組已經安裝完成，使安裝精靈跳過下載、解壓與刪除 `adb.zip` 的流程：

1. **強制終止安裝程序**： 按下 `Ctrl + Shift + Esc` 開啟工作管理員，強制結束所有 `EmuDeck`、`PowerShell`、`cmd.exe` 與 `adb.exe`。
    
2. **修改 settings.json 宣告狀態**： 開啟 `%USERPROFILE%\EmuDeck\settings.json`（若在 AppData 則為 `%APPDATA%\EmuDeck\settings.json`），將 `adb` 與 `android` 的狀態手動標記為 `true` 與 `skip`：
    
   ```json
    {
      "tools": {
        "adb": {
          "installed": true,
          "configured": true
        },
        "platformTools": {
          "installed": true
        }
      },
      "android": {
        "installed": true,
        "configured": true,
        "skip": true
      }
    }
   ```
    
3. **補齊本地虛擬工具檔與清理快取**： 在 PowerShell 中執行以下指令建立假檔案以通過檔案存在性檢查，並刪除卡住的壓縮檔：
    
   ```powershell
    # 建立 platform-tools 佔位目錄與偽裝執行檔
    $toolsPath = "$env:USERPROFILE\EmuDeck\tools\platform-tools"
    New-Item -ItemType Directory -Path $toolsPath -Force -ErrorAction SilentlyContinue
    New-Item -ItemType File -Path "$toolsPath\adb.exe" -Force -ErrorAction SilentlyContinue
    
    # 清除暫存目錄下的 adb.zip 残留
    Remove-Item "$env:USERPROFILE\EmuDeck\adb.zip" -Force -ErrorAction SilentlyContinue
    Remove-Item "$env:TEMP\adb.zip" -Force -ErrorAction SilentlyContinue
   ```
    
4. **重啟安裝**： 重新右鍵點擊 EmuDeck 選擇「以系統管理員身分執行」，精靈將跳過 ADB 階段並直接進入模擬器選擇與配置頁面。
    

## 參、多帳號獨立存檔配置 (防止多用戶進度打架)

EmuDeck 預設會將存檔導向主目錄的 saves（例如 `Z:\Emulation\saves`），必須將存檔路徑強制收斂回各自使用者的本機空間：

### 1. RetroArch 存檔與即時存檔路徑重定向

開啟 RetroArch ➔ 進入「設定 (Settings)」➔「目錄 (Directory)」：

- **存檔 (Savefile Directory)**：設定為本機路徑，例如：`C:\Users\%USERNAME%\EmuDeck\saves\`
    
- **即時存檔 (Savestate Directory)**：設定為本機路徑，例如：`C:\Users\%USERNAME%\EmuDeck\states\`
    
- 開啟「依核心名稱儲存」或「依內容目錄儲存」，確保各遊戲存檔分離。
    

### 2. 獨立主機模擬器（PCSX2、RPCS3、Dolphin 等）

- **PCSX2**：進入 Settings ➔ Memory Cards，確認 Memory Card 檔案存放在本機 `%APPDATA%\PCSX2\memcards\` 或 `C:\Users\%USERNAME%\Documents\PCSX2\memcards\`，嚴禁指定到 `Z:\`。
    
- **Dolphin**：GC/Wii 虛擬記憶卡預設建立於本機 `%USERPROFILE%\Documents\Dolphin Emulator\`，維持預設本機路徑即可。
    

### 3. 多用戶自動備份個人存檔 (批次排程)

若需要備份個人的本機存檔至遠端 NAS，各帳號可建立獨立排程腳本：

```c
robocopy "C:\Users\%USERNAME%\EmuDeck\saves" "\\<NAS_IP>\Backup\%USERNAME%_Saves" /MIR
```

## 肆、Linux 環境安裝 (Arch Linux 及其他發行版)

### 一、Arch Linux

Arch Linux 建議直接使用官方安裝腳本配合 Flatpak 容器架構。

#### 1. 前置相依套件安裝

```bash
sudo pacman -Syu --needed base-devel git curl flatpak zenity
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

#### 2. 下載並啟動 EmuDeck

```bash
mkdir -p ~/Downloads/EmuDeck && cd ~/Downloads/EmuDeck
curl -L -O https://www.emudeck.com/EmuDeck.desktop
chmod +x EmuDeck.desktop
./EmuDeck.desktop
```

安裝精靈中選擇 Expert Mode，儲存目錄可指定本機 `/home/<user>/Emulation`，或指向預先以 `/etc/fstab` 掛載好的遠端 NFS/SMB 目錄：

```
<NAS_IP>:/mnt/share/Emulation /mnt/Emulation nfs _netdev,nofail,x-systemd.automount 0 0
```

### 二、其他 Linux 發行版

- **SteamOS (Steam Deck)**：切換至 Desktop Mode，至官網下載 `EmuDeck.desktop` 置於桌面執行，選擇安裝至 SD 卡或內建空間，系統會自動配置 TDP 與螢幕更新率優化腳本。
    
- **Ubuntu / Debian 衍生版**：
    
   ```bash
    sudo apt update && sudo apt install -y flatpak git curl zenity dialog libfuse2
    flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
    bash -c "$(curl -fsSL https://raw.githubusercontent.com/dragoonDorise/EmuDeck/main/install.sh)"
   ```
    
- **Fedora**：
    
   ```bash
    sudo dnf install -y flatpak git curl zenity
    flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
    bash -c "$(curl -fsSL https://raw.githubusercontent.com/dragoonDorise/EmuDeck/main/install.sh)"
   ```
    

## 伍、Steam ROM Manager (SRM) 注入與注意事項

1. **執行前關閉 Steam**：產生捷徑或儲存海報前，務必完全結束 Steam 客戶端，避免寫入衝突導致快取被覆蓋。
    
2. **Parsers 路徑確認**：確認各平台的 ROMs Directory 正確指向 `Z:\roms\<平台名稱>` 或本地 Junction 目錄（如 `C:\Users\%USERNAME%\Emulation\roms\<平台名稱>`）。
    
3. **Parse & Save**：點擊 Preview ➔ Parse 下載封面與海報，校對後點擊 Save to Steam 寫入捷徑。
