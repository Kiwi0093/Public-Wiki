---
title: Nix / NixOS 實用指令與維護技巧筆記
date: 2026-09-02
tags:
  - Linux
  - Nix
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![NixOS](https://img.shields.io/badge/NixOS-Supported-green?style=plastic&logo=nixos) 

## 一、 起手式：不可變的 `/nix/store` 與世代 (Generations)

在 Nix 的世界裡，沒有傳統的 `/usr/bin` 或 `/lib`。所有的軟體安裝、相依性與設定檔，都會被加上一段由內容計算出來的 Hash 值，統一丟進 `/nix/store/` 裡面（例如 `/nix/store/1a2b3c...-python-3.10`）。

這帶來兩個極大的好處：

1. **沒有依賴地獄（Dependency Hell）：** 軟體 A 需要 Python 3.9，軟體 B 需要 Python 3.10，兩者可以完美並存在系統中互不干擾。
2. **無痛回滾：** 每次變更系統都會產生一個新的「世代 (Generation)」，升級爛了？隨時秒切回上一個世代。

_(註：以下的指令分為「Standalone Nix 套件管理器」與「NixOS 作業系統」兩種情境說明。)_

## 二、 基礎維護：安裝與更新系統

在 Nix 中，我們現在處於舊版 `nix-env` 指令與新版 `nix` 指令交替的過渡期，這裡以最穩定且常用的語法為主。

**1. NixOS 的全系統更新與套用** 如果你是用 NixOS，你幾乎不會用指令手動裝軟體，而是修改 `/etc/nixos/configuration.nix` 這個宣告檔，然後讓系統去「實現」它：

```bash
# 編輯你的系統設定檔，把需要的套件寫進去
sudo vim /etc/nixos/configuration.nix

# 讓系統根據設定檔，編譯/下載並切換到新狀態
sudo nixos-rebuild switch

# 如果只想要套用狀態測試一下，重開機就恢復原狀 (非常適合測試高風險設定)：
sudo nixos-rebuild test
```

**2. Standalone Nix 的日常套件管理** 如果你是在 Ubuntu 或 macOS 上單純把 Nix 當套件管理員用：

```bash
# 搜尋套件 (建議直接用網頁版 search.nixos.org 比較快)
nix-env -qaP <關鍵字>

# 安裝套件 (強烈建議加上 -A 參數從屬性路徑安裝，速度快且精準)
nix-env -iA nixpkgs.<套件名稱>

# 升級所有已安裝的使用者套件
nix-env -u
```

## 三、 環境清理與垃圾回收 (Garbage Collection)

這是在 Nix 中**最重要**的維護動作！因為 Nix 的不可變特性，預設情況下它**永遠不會刪除任何舊軟體**（為了讓你隨時能回滾）。如果放著不管，`/nix/store` 很快就會把你的硬碟塞爆。

**1. 手動觸發垃圾回收 (GC)**

```bash
# 找出並刪除目前系統中「沒有被任何世代參照」的孤兒檔案
nix-collect-garbage

# ⚠️ 終極清理 (Deep Clean)：刪除所有舊世代，只保留「當下正在用」的版本
# 注意：下達這行之後，你就無法回滾到以前的狀態了！
nix-collect-garbage -d

# 需要 root 權限清理全系統等級的廢棄物 (NixOS 必做)
sudo nix-collect-garbage -d
```

**2. 設定自動垃圾回收 (NixOS 限定)** 在你的 `configuration.nix` 裡加上這段，讓系統每週自動幫你倒垃圾，並自動砍掉超過 7 天的舊世代：

```bash
nix.gc = {
  automatic = true;
  dates = "weekly";
  options = "--delete-older-than 7d";
};
```

## 四、 救命工具：時光機與世代回滾 (Rollbacks)

這是 Nix 的超級殺手級功能。當你更新了系統或裝了新軟體，結果服務起不來或是系統崩潰，修復的方式極度簡單暴力。

**1. NixOS 的全系統回滾**

```bash
# 列出系統所有的世代與時間戳記
sudo nix-env --list-generations --profile /nix/var/nix/profiles/system

# 發現剛套用的設定爛了，無腦退回上一個世代
sudo nixos-rebuild switch --rollback
```

_(就算你連系統都開不了機，NixOS 的開機選單 (GRUB/systemd-boot) 預設就會列出所有歷史世代，直接選上一個世代開機就滿血復活了！)_

**2. 使用者套件的回滾 (Standalone Nix)**

```bash
# 列出目前帳號的套件變更歷史
nix-env --list-generations

# 退回上一次操作前的狀態
nix-env --rollback
```

## 五、 進階神兵利器：Nix Shell (用過就回不去的功能)

對於經常開發、測試不同環境，或是管理 IaC 自動化流程的人來說，`nix-shell` 是神器中的神器。它可以幫你建立一個「用完即丟的乾淨環境」。

**情境：我現在只是想臨時跑個 Python 腳本並用到 Ansible，但我不想把它們裝到系統裡弄髒環境！**

```bash
# 臨時開啟一個包含 python3 與 ansible 的虛擬終端機環境
nix-shell -p python3 ansible
```

進入這個 shell 後，你就可以正常使用 `python3` 和 `ansible`。一旦你輸入 `exit` 離開這個終端機，這兩個軟體就像從未存在過一樣，不會留在你的全域環境中（但已經下載的檔案會暫存在 `/nix/store` 裡，等待下次垃圾回收時被清掉）。

這完美解決了開發機上到處都是亂七八糟臨時依賴的問題！