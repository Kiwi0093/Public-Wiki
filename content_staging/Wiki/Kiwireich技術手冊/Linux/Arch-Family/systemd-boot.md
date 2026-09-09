---
title: systemd-boot 全攻略與 Pacman Hook 自動化
date: 2026-09-09
tags:
  - Linux
  - Archlinux
---
# systemd-boot 全攻略與 Pacman Hook 自動化

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)

<!--truncate-->

一、 認識 systemd-boot：比 GRUB 更輕量的現代 UEFI 引導器 在現代 UEFI 架構下，越來越多 Arch 原生使用者與 `archinstall` 腳本選擇採用 **systemd-boot**（前身為 Gummiboot）。 相較於設定檔龐大且依賴 `grub-mkconfig` 重新生成的 GRUB，systemd-boot 具備以下優勢：

- **原生整合**：systemd 內建，無需額外安裝龐大的引導軟體套件。
    
- **配置模組化**：每個核心的啟動項目都是獨立的 `.conf` 檔案，互不干擾。
    
- **極速開機**：直接調用 UEFI 韌體介面載入 EFI 執行檔，開機延遲極低。
    

二、 systemd-boot 核心結構與日常管理 systemd-boot 的所有設定與核心映像檔都存放在 EFI 系統分割區（通常掛載於 `/boot` 或 `/efi`，以下以 `/boot` 為例）。

1. **核心檔案目錄樹**
    
    
   ```
    /boot/
    ├── EFI/
    │   ├── systemd/systemd-bootx64.efi
    │   └── BOOT/BOOTX64.EFI
    └── loader/
        ├── loader.conf                 # 全域引導設定檔
        └── entries/                    # 開機選單項目存放處
            ├── arch.conf               # 預設 Linux 核心
            └── arch-linux-zen.conf     # Zen 效能核心
   ```
    
2. **核心開機項目檔範例 (`loader/entries/arch-linux-zen.conf`)**
    
    
   ```toml
    title   Arch Linux (Linux-Zen)
    linux   /vmlinuz-linux-zen
    initrd  /intel-ucode.img            # 若為 AMD 請改用 amd-ucode.img
    initrd  /initramfs-linux-zen.img
    options root=UUID=xxxx-xxxx-xxxx rw quiet
   ```
    
3. **開機維護核心指令：bootctl** 日常維護完全不需要手動翻找設定檔，透過 `bootctl` 即可完成常用操作：
    
    
   ```bash
    # 查看當前引導狀態、預設核心與所有偵測到的啟動項目
    bootctl status
    
    # 列出所有可用的開機項目清單
    bootctl list
    
    # 一鍵變更預設開機項目（名稱對應 entries 裡的檔名，不需副檔名）
    sudo bootctl set-default arch-linux-zen
    
    # 設定開機選單等待時間（例如 3 秒）
    sudo bootctl set-timeout 3
   ```
    

三、 核心痛點：為什麼更新核心後容易翻車？ 在使用 systemd-boot 時，常見的翻車場景有兩個：

1. **systemd 套件更新後引導二進位檔未同步**：系統升級了 `systemd`，但 `/boot/EFI/systemd/systemd-bootx64.efi` 仍停留在舊版。
    
2. **多核心切換時 initramfs 遺失**：安裝或移除新核心（例如在 `linux` 與 `linux-zen` 之間切換）時，若未及時執行 `mkinitcpio -P` 重新生成映像檔，重開機將直接卡在 UEFI 引導錯誤。
    

四、 終極自動化：部署 Pacman Hook 一勞永逸 在 Arch Linux 哲學中，最優雅的解法是利用 **Pacman Hook**，讓系統在套件安裝或更新後，自動在背景觸發維護腳本，徹底杜絕人為遺漏。

1. **Hook 一：systemd 更新時自動升級開機引導程式** 建立 `/etc/pacman.d/hooks/95-systemd-boot.hook`：
    
    
   ```toml
    [Trigger]
    Type = Package
    Operation = Upgrade
    Target = systemd
    
    [Action]
    Description = Updating systemd-boot in EFI system partition...
    When = PostTransaction
    Exec = /usr/bin/bootctl update
   ```
    
    _作用：每當 `systemd` 套件升級，系統自動執行 `bootctl update`，確保 EFI 分割區內的引導二進位檔永遠與系統同步，防止版本斷節。_
    
2. **Hook 二：核心更新後自動防護與狀態檢查** 雖然 Arch 預設的 `90-mkinitcpio-install.hook` 會自動編譯映像檔，但若你常切換自訂核心或 DKMS 模組，可建立自訂檢查 Hook `/etc/pacman.d/hooks/99-boot-integrity.hook`：
    
    
   ```toml
    [Trigger]
    Type = Package
    Operation = Install
    Operation = Upgrade
    Operation = Remove
    Target = linux
    Target = linux-zen
    Target = linux-lts
    
    [Action]
    Description = Verifying bootloader entries integrity...
    When = PostTransaction
    Exec = /usr/bin/bootctl --dry-run list
   ```
    
    _作用：在任何核心安裝、升級或移除後，在終端機背景預演並檢驗開機選單設定檔的完整性，若路徑損毀會直接在 pacman 更新流程中噴出警示，讓你在關機前就能當場修復。_