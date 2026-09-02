---
title: openSUSE / SUSE / Zypper 實用指令與維護技巧筆記
date: 2026-09-02
tags:
  - Linux
  - SUSE
  - openSUSE
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![SUSE](https://img.shields.io/badge/SUSE-Supported-green?style=plastic&logo=suse) 
![openSUSE](https://img.shields.io/badge/openSUSE-Supported-green?style=plastic&logo=opensuse)

## 一、 起手式：認識 Zypper 與超強的依賴解析器

Zypper 是 SUSE 家族（包含穩定的 openSUSE Leap、滾動更新的 Tumbleweed，以及企業版的 SLES）的命令列套件管理工具。

它的兩大招牌特色：

1. **地表最強的依賴解析器 (SAT Solver)：** 當遇到套件衝突時，Zypper 不會直接報錯罷工，而是會給出多種解決方案（例如：降級 A、移除 B、或保留現狀），讓你像做選擇題一樣解決衝突。
2. **極致的縮寫支援：** 幾乎所有指令都可以縮寫（例如 `install` = `in`，`search` = `se`），打字極快。

## 二、 基礎維護：日常更新 (Leap 與 Tumbleweed 差異)

這裡有一個極度重要的觀念！openSUSE 分為兩個版本，更新指令**完全不同**，下錯指令可能會讓系統陷入混亂。

**1. openSUSE Leap (固定版本發行，類似 Ubuntu/Debian)** 只做安全更新與 Bug 修復，請使用：

```bash
sudo zypper update
# 縮寫：
sudo zypper up
```

**2. openSUSE Tumbleweed (滾動更新，類似 Arch)** 因為所有套件包含核心都在不斷推進，必須使用發行版升級指令。它會自動處理套件的降級、移除與依賴重組：

```bash
sudo zypper dist-upgrade
# 縮寫：
sudo zypper dup
```

## 三、 套件的安裝、搜尋與清理

Zypper 的指令縮寫非常直覺，日常操作幾乎都是兩三個字母。

**1. 搜尋與安裝**

```bash
# 搜尋套件 (Search)
zypper se <關鍵字>

# 顯示套件的詳細資訊 (Info)
zypper info <套件名稱>

# 安裝套件 (Install)
sudo zypper in <套件名稱>
```

**2. 乾淨移除與孤兒套件清理** 跟 `apt` 類似，如果只下 `zypper rm`，相依套件會殘留。

```bash
# 乾淨移除套件，並連帶移除「當初為了它安裝，且現在無人使用的相依套件」(-u = clean-deps)
sudo zypper rm -u <套件名稱>

# 找出系統中所有的孤兒套件 (無人依賴的套件)
zypper packages --unneeded

# 實用技巧：一鍵清除所有孤兒套件
sudo zypper rm -u $(zypper packages --unneeded | awk -F'|' 'NR>4 {print $3}')
```

## 四、 殺手級神技：Btrfs + Snapper 系統快照無痛還原

這點是 SUSE 家族傲視群雄的功能。只要你安裝系統時選擇預設的 Btrfs 檔案系統，**你甚至不需要手動打快照。**

當你下達 `zypper in` (安裝) 或 `zypper dup` (重大更新) 時，Zypper 會在底層自動觸發 Snapper 幫你拍一張「更新前」與「更新後」的快照。

**系統更新爛了、開不了機怎麼辦？**

1. 重開機，在 GRUB 開機選單選擇 `Start bootloader from a read-only snapshot`。
2. 選單會列出你最近的幾次 Zypper 操作紀錄與時間。
3. 選擇一個更新前能正常運作的快照，按 Enter 進入系統。
4. 進入這顆唯讀的「時光機系統」後，打開終端機確認一切正常，接著下達：
  
   ```bash
   sudo snapper rollback
   ```
   
5. 系統會立刻把你當前的狀態設為預設，重開機後，你就滿血復活了！完全不需要進 Hypervisor 弄虛擬機快照。
   

## 五、 進階技巧：Patterns (模式) 與套件鎖定

**1. Patterns (安裝群組)** Zypper 不只有單一套件，它把很多相關的軟體打包成 `Pattern`（例如：整個 KDE 桌面、整個伺服器 LAMP 環境、C/C++ 開發環境）。

```bash
# 列出系統中所有的 Pattern
zypper patterns
# 縮寫：
zypper pt

# 安裝某個特定的 Pattern (例如 KVM 虛擬化宿主機環境)
sudo zypper in -t pattern kvm_server
```

**2. 鎖定套件 (Locks)** 如果你不希望某個軟體被升級（例如特定版本的 Docker），可以把它上鎖。

```bash
# 加上鎖定 (Add Lock)
sudo zypper al <套件名稱>

# 列出目前被鎖定的所有套件 (List Locks)
zypper ll

# 解除鎖定 (Remove Lock)
sudo zypper rl <套件名稱>
```

**3. 清理快取** 釋放硬碟空間用：

```bash
# 清理所有下載的安裝檔與中繼資料快取
sudo zypper clean -a
# 縮寫：
sudo zypper cc -a
```