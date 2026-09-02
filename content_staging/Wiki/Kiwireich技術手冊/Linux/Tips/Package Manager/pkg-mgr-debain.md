---
title: Debian系 Apt 實用指令與維護技巧筆記
tags:
  - Linux
  - Debian
  - Ubuntu
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Debian](https://img.shields.io/badge/Debian-Supported-green?style=plastic&logo=debian) 
![Ubuntu](https://img.shields.io/badge/Ubuntu-Supported-green?style=plastic&logo=ubuntu)

## 一、 起手式：現代化套件管理與 Nala (推薦選項)

在 Debian 家族中，底層的包管理工具是 `dpkg`，而我們日常最常使用的是高階指令 `apt`（取代了老舊的 `apt-get`）。

**推薦工具：Nala**

如果你習慣了 Arch 系 `yay` 漂亮且直覺的介面，強烈建議在 Debian/Ubuntu 上安裝 `nala`。它是 `apt` 的前端替代品，擁有更漂亮的排版、平行下載加速，以及歷史紀錄回退功能。

```bash
# 安裝 Nala
sudo apt update
sudo apt install nala
```

裝好之後，你日常的 `apt` 指令幾乎都可以無縫替換成 `nala`（例如 `sudo nala update`）。以下的基礎指令我們仍以原生的 `apt` 為主，但兩者邏輯通用。

## 二、 基礎維護：安裝與更新系統

**1. 系統全面更新**

Debian 系的更新分為兩個步驟：先更新本機的軟體清單，再執行實際升級：

```bash
sudo apt update && sudo apt upgrade -y
```

> **進階知識：`apt upgrade` 與 `apt full-upgrade` 的差異？**
> 
> - **`upgrade` (安全升級)：** 只會升級現有的套件。如果某個套件的新版本需要「移除」其他舊套件才能安裝，`upgrade` 會選擇**跳過**該套件，保持現狀以求穩定。
>     
> - **`full-upgrade` (完整升級)：** 允許系統在升級時，主動**移除**阻礙升級的舊相依套件。通常在進行發行版大版本升級（例如 Ubuntu 22.04 升級 24.04）或碰到套件依賴卡死時使用。
>     
>     _(註：在舊版指令中，對應的是 `apt-get dist-upgrade`)_
>     

**2. 搜尋與安裝套件**

```bash
# 安裝特定套件
sudo apt install <套件名稱>

# 搜尋套件（支援正則表達式）
apt search <關鍵字>
```

## 三、 套件解除安裝與「孤兒」清理 (Orphans)

Debian 系統在解除安裝時，最常犯的錯就是只用 `remove`，導致設定檔和相依套件殘留在系統中。

**1. 乾淨移除主程式**

- **一般移除：** 只刪除程式本體，但保留你在 `/etc` 底下修改過的設定檔。

   ```bash
   sudo apt remove <套件名稱>
   ```
   
- **徹底移除 (Purge)：** 連同所有的全域設定檔一起拔除（不包含你在個人家目錄 `~/.config/` 裡的設定）。

```bash
   sudo apt purge <套件名稱>
```
   

**2. 清除孤兒套件 (Orphans)**

當初為了安裝某軟體而跟著裝的依賴套件，主程式移除了，它們卻還留著。Debian 內建了清理指令：

```bash
# 清除所有已不再被需要的孤兒套件
sudo apt autoremove

# 進階：連同孤兒套件的設定檔一起清乾淨（推薦）
sudo apt --purge autoremove
```

## 四、 釋放硬碟空間：快取清理 (Cache)

每次你用 `apt install` 下載的 `.deb` 安裝檔，都會被快取在 `/var/cache/apt/archives/` 裡面。對於長年運行的 VM 或硬碟空間有限的機器，這非常佔空間。

**1. 手動清理快取**

```bash
# 安全清理：只刪除「已經無法從伺服器下載」的舊版本過期安裝檔
sudo apt autoclean

# 深度清理：毫不留情，把快取資料夾全部清空（釋放最大空間）
sudo apt clean
```

> **自動化小技巧：** Debian / Ubuntu 其實內建了排程任務。只要你有安裝 `unattended-upgrades`，系統預設就會在背景默默幫你清理過期的快取，不需要像 Arch 那樣手動寫 Systemd Timer。

## 五、 救命工具：套件降級與鎖定 (Downgrade & Hold)

雖然 Debian 系相對穩定，但如果你添加了第三方 PPA 或來源，還是有可能遇到更新後軟體壞掉的狀況。

**1. 尋找歷史版本**

首先，你要查出伺服器上還有哪些舊版本可以降級。

```bash
apt-cache madison <套件名稱>
# 或是
apt list -a <套件名稱>
```

這會印出該套件所有可用的版本號碼（例如 `1.2.3-1ubuntu2`）。

**2. 執行降級安裝**

找到你想退回的版本號後，用 `=` 直接指定版本強制安裝（這會直接覆蓋掉有 Bug 的新版）：

```bash
sudo apt install <套件名稱>=<版本號>
```

**3. ⚠️ 關鍵步驟：鎖定版本防升級 (Hold)**

降級完成後，為了避免下次手殘打 `apt upgrade` 時又把它升級回去，你必須把這個套件「鎖定」：

```bash
sudo apt-mark hold <套件名稱>
```

被 hold 住的套件，即使有新版推出，apt 也會自動忽略它。

**4. 如何解除降級鎖定 (Unhold)**

等到官方推出修復檔，你決定再給它一次機會時，只要解除鎖定即可：

```bash
sudo apt-mark unhold <套件名稱>
```

解鎖後，下次下達 `apt upgrade` 就會正常升級了。

## 六、 進階：正確新增第三方套件庫與 GPG 金鑰 (告別 apt-key)

過去我們在新增第三方軟體源（例如 Docker、Node.js、Grafana）時，習慣使用 `sudo apt-key add` 來加入 GPG 金鑰。但如果你現在這麼做，系統會跳出大大的 **apt-key is deprecated** 警告。

**為什麼被棄用？** 因為 `apt-key` 會把金鑰放進系統的「全域信任庫」(`/etc/apt/trusted.gpg`)。這意味著，如果你加了某個小軟體的金鑰，這個金鑰竟然也有權限去偽造並驗證系統核心層級的套件，這在資安上是個極大的漏洞。

**現代標準做法 (Signed-by 綁定法)：** 現在的新規範是：將金鑰獨立存放在專屬目錄，並在設定檔中嚴格指定「這個套件庫只能用這把金鑰驗證」。

以下是符合 Ubuntu 22.04+ 與 Debian 12+ 規範的標準操作流程（以加入某個虛構的 `example` 軟體庫為例）：

**1. 建立存放金鑰的專屬目錄** 系統現在推薦將第三方金鑰統一放在 `/etc/apt/keyrings/`（有些舊系統預設沒這個資料夾，先建起來）：

```bash
sudo mkdir -p /etc/apt/keyrings
```

**2. 下載金鑰並轉碼 (Dearmor)** 大多數第三方給的金鑰是 ASCII 文字檔（`.asc` 或 `.pub`），`apt` 現在更喜歡二進位格式的 `.gpg` 檔。我們用 `curl` 下載，並透過 `gpg --dearmor` 轉換後存入剛才建的目錄：

```bash
curl -fsSL https://example.com/key.pub | sudo gpg --dearmor -o /etc/apt/keyrings/example.gpg
```

**3. 加入套件庫來源，並綁定金鑰** 在 `/etc/apt/sources.list.d/` 建立該軟體的清單檔，**最關鍵的一步是在 `deb` 後面加上 `[signed-by=...]`**：

```bash
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/example.gpg] https://example.com/apt stable main" | sudo tee /etc/apt/sources.list.d/example.list
```

> **解析：** 加上 `signed-by=/etc/apt/keyrings/example.gpg` 後，系統就只會用這把特定的金鑰去驗證 `example.com` 下載來的軟體，再也不會越權干涉其他系統套件。

**4. 更新快取檔案** 最後更新一下清單，就不會再看到討厭的 deprecation 警告了：

```bash
sudo apt update
```