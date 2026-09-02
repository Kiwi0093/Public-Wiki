---
title: Qemu+KVM in WSL
tags:
  - Linunx
  - Windows
  - WSL
  - VM
---

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 


:::tip
WSL 現在可以透過啟用 Nested Virtualization（巢狀虛擬化）當作直通的 Hypervisor 來跑虛擬機。簡單來說，WSL2 本身已經是跑在 Windows Hyper-V 上的虛擬機了，開啟這個功能後，我們可以在 WSL2 裡面再跑 QEMU/KVM 虛擬機，達成「虛擬機裡面跑虛擬機」的無限套娃境界（當然效能會遞減）。
:::

## 參考資料

- [Ivon's Blog - Linux啟用巢化虛擬化,在虛擬機裡面跑虛擬機](https://www.google.com/search?q=https://ivonblog.com/posts/wsl2-nested-virtualization/)
    
- [Ivon's Blog - Spice Guest Tools用法,QEMU/KVM虛擬機自動縮放解析度,共享資料夾](https://ivonblog.com/)
    
- [Ivon's Blog - VirtIO-Balloon:伸縮自在的RAM,QEMU/KVM虛擬機動態分配記憶體](https://ivonblog.com/)
    
- [在Arch Linux上安裝QEMU/KVM和Virt Manager虛擬機軟體](https://ivonblog.com/)
    

## 一、 Host Setting (Windows 宿主機設定)

**1. 更新 WSL 核心** 確保你的 WSL 是最新版本，在 Windows 的 PowerShell 中執行：

PowerShell

```
wsl --update
```

**2. 開啟 Nested Virtualization**

> **⚠️ 易錯提醒：** 巢狀虛擬化的設定是針對整個 WSL2 虛擬機引擎的，所以必須寫在 Windows 端的全域設定檔 `.wslconfig` 中，**不能**寫在 WSL 內部的 `/etc/wsl.conf`。

開啟 Windows 的檔案總管，編輯或建立 `C:\Users\<你的帳號>\.wslconfig`，加上以下這段：

Ini, TOML

```
[wsl2]
nestedVirtualization=true
```

完成後，在 PowerShell 強制重啟 WSL 讓設定生效：

PowerShell

```
wsl --shutdown
```

## 二、 ArchWSL 安裝 QEMU/KVM 與 Virt-Manager

重新啟動並進入 WSL (Arch Linux) 後，開始安裝虛擬化相關的工具。

**1. 安裝核心與網路套件**

Bash

```
sudo pacman -S archlinux-keyring qemu-full virt-manager virt-viewer edk2-ovmf dnsmasq vde2 bridge-utils openbsd-netcat libguestfs ebtables iptables virglrenderer
```

**2. 安裝 TPM 2.0 模擬套件 (若需要跑 Windows 11 Guest)**

Bash

```
sudo pacman -S swtpm
```

**3. 啟動與設定 Libvirt 服務**

Bash

```
# 啟動並設定開機自啟 libvirtd
sudo systemctl enable --now libvirtd

# 啟動預設的虛擬網路 (NAT)
sudo virsh net-start default

# 設定虛擬網路開機自動啟動
sudo virsh net-autostart default
```

**4. 調整帳號權限** 為了讓你不用每次開 Virt-Manager 都要打 root 密碼，需將當前使用者加入相關群組：

Bash

```
sudo usermod -a -G libvirt $USER
sudo usermod -a -G libvirt root
sudo usermod -a -G kvm $USER
sudo usermod -a -G kvm root
```

**5. 設定 Polkit 規則 (免密碼管理)** 編輯 `/etc/polkit-1/rules.d/50-libvirt.rules`：

JavaScript

```
/* Allow users in kvm group to manage the libvirt daemon without authentication */
polkit.addRule(function(action, subject) {
    if (action.id == "org.libvirt.unix.manage" &&
        subject.isInGroup("kvm")) {
            return polkit.Result.YES;
    }
});
```

都改完後，重開服務套用權限（最保險是直接登出 WSL 再登入，或執行 `wsl --shutdown`）：

Bash

```
sudo systemctl restart libvirtd
```

## 三、 Guest OS 設定 (以第二層的 Arch Linux 為例)

當你在 Virt-Manager 裡面裝好了一台 Guest OS（虛擬機）後，需要安裝類似 VM-tools 的增強套件來實現畫面自動縮放與剪貼簿共用。

**1. 安裝 QEMU 與 SPICE 客體代理程式** 在 **Guest OS (虛擬機內部)** 執行：

Bash

```
sudo pacman -S spice-vdagent qemu-guest-agent xf86-video-qxl
```

若你是使用 X11 桌面環境，為了讓視窗可以自動縮放，可透過 AUR 安裝 `x-resize`：

Bash

```
yay -S x-resize
```

> **💡 關於 Service Enable 的疑惑：** 網路上很多舊教學會說要 systemctl enable 這些服務。但其實現在的 `spice-vdagent` 通常是由桌面環境（如 GNOME / KDE / XFCE 的 autostart）自動啟動，而 `qemu-guest-agent` 則是透過 socket 觸發。所以找不到 service 檔案或不需要手動 enable 是正常的，只要重開機有生效即可。

## 四、 加掛 Shared Folder (VirtioFS)

透過 VirtioFS，可以讓 Guest OS 原生且高效地存取 Host (這裡指 WSL) 的資料夾。

**1. Virt-Manager 硬體設定**

1. 先將 Guest OS 關機。
2. 點擊 Virt-Manager 視窗上方那排的「燈泡」圖示（顯示虛擬硬體詳細資料）。
3. 點擊左下角的 **Add Hardware (新增硬體)**。
4. 選擇 **Filesystem (檔案系統)**：
    
    - **Driver:** 選擇 `virtiofs`
    - **Source path:** 填入 WSL 裡的目錄，例如 `/home/kiwi/host` (記得先在 WSL 建立好這個資料夾)
    - **Target path:** 這個是標籤名稱（Mount Tag），自己取名，例如 `host`
        
5. 點擊完成並啟動虛擬機。

**2. 在 Guest OS 中掛載**

**手動掛載測試：**

Bash

```
# -t virtiofs <Target Path 標籤> <Guest OS 內的掛載點>
sudo mount -t virtiofs host /home/kiwi/host
```

**寫入 `/etc/fstab` 開機自動掛載：** 確認手動掛載沒問題後，編輯 Guest OS 內的 `/etc/fstab`，加上這行：

程式碼片段

```
# Shared Folder with HOST (WSL)
# <Target標籤>  <掛載點>           <格式>      <參數>                       <dump> <pass>
host            /home/kiwi/host   virtiofs   rw,noatime,_netdev           0      2
```

> **注意：** 加上 `_netdev` 參數可以確保系統在載入網路與外部設備模組後才執行掛載，避免開機卡住。