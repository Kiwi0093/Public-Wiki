---
title: Duo Stream - Moonlight + Sunshine 多人遊戲串流方案
tags:
  - Windows
  - Gaming
---
# Duo Stream - Moonlight + Sunshine 多人遊戲串流方案

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Windows](https://img.shields.io/badge/Windows-Supported-green?style=plastic&logo=windows)

這是一套基於 Windows 11 系統與硬體虛擬化技術的多用戶獨立並行遊戲串流架構。傳統串流方案（如標準 Sunshine）僅能捕捉當前單一前景桌面，無法支援多人同時操作；本方案透過 **Duo** 搭配虛擬顯示卡與虛擬手把驅動，在不開虛擬機（VM）的前提下，實現單台實體主機同時輸出 2 組完全獨立、互不搶奪輸入焦點的 1080p 60fps 遊戲畫面。

## 1. System Requirement (系統需求)

|**項目**|**建議規格 (以雙人 1080p 60fps 串流為基準)**|**備註與瓶頸說明**|
|---|---|---|
|**作業系統**|**Windows 11 (22H2 / 23H2 專業版以上)**|必須使用 Windows。Linux 在單卡多 X-Server / Wayland 多座席手把穿透的相容性極差。|
|**處理器 (CPU)**|**6 核心 / 12 執行緒以上** (如 Intel Core i7-8750H / AMD Ryzen 3600 以上)|需同時承載 2 款遊戲的邏輯計算與背景服務排程。|
|**記憶體 (RAM)**|**16 GB 以上** (建議 32 GB 雙通道)|雙開中型遊戲與載入材質包時防爆記憶體。|
|**顯示卡 (GPU)**|**NVIDIA RTX 2060 6GB 以上** (或同級顯卡)|**顯存與編碼器是最大硬傷**：雙開串流每人分得約 2.5~3GB 顯存；需具備支援多路並發硬解的 NVENC（Turing / Ampere 架構以上）。4GB 顯卡（如 RTX A400）僅能應付 2D 或輕度遊戲。|
|**網路環境**|**全有線 Gigabit (1GbE / 2.5GbE)**|主機必須插實體網路線，且需與客戶端處於**同一區域網路二層交換（L2 Switching）**，避開三層軟體路由轉發與 NAT 延遲。|
|**客戶端設備**|客廳 Shield TV Pro、Android 電視盒、輕量工作筆電或平板|安裝 Moonlight Client，需配備藍牙或 2.4G 遊戲手把。|

## 2. Software Requirement (軟體需求)

- **主程式**：
    
    - **[Duo (Multi-user Sunshine Fork)](https://www.google.com/search?q=https://github.com/giggio/duo)**：核心排程管理器，專門用來指派多個 Windows 帳號、虛擬螢幕與虛擬輸入裝置。
        
    - **Sunshine**：開源低延遲遊戲串流 Host 端。
        
    - **Moonlight**：串流接收客戶端（支援 Windows / macOS / Linux / Android / iOS / tvOS）。
        
- **底層相依驅動**：
    
    - **IddSampleDriver (Virtual Display Driver)**：Windows 虛擬顯示卡驅動，在免接實體 HDMI 欺騙插頭（Dummy Plug）的情況下生成延伸虛擬螢幕。
        
    - **ViGEmBus (Virtual Gamepad Emulation Bus)**：虛擬手把驅動，負責將各客戶端傳入的手把信號隔離並注入指定 Session。
        
- **周邊管理（選用）**：
    
    - **EmuDeck for Windows**：復古模擬器整合套件。
        
    - **RomM**：集中化遊戲 ROM / BIOS 管理平台（由 NAS 或後端伺服器提供 NFS/SMB 掛載）。
        

## 3. Setting (設定指引)

### 步驟 A：基礎環境與驅動配置

1. **安裝純淨驅動**：安裝最新版 NVIDIA GeForce Game Ready 或 Studio 驅動程式。
    
2. **安裝 ViGEmBus**：下載並安裝最新版 ViGEmBus 驅動程式，提供虛擬手把支援。
    
3. **配置 IddSampleDriver (虛擬螢幕)**：
    
    - 安裝虛擬顯示驅動後，至系統「顯示器」設定確認已新增虛擬螢幕（Display）。
        
    - 將虛擬螢幕解析度設為 **1920x1080**，更新頻率設為 **60Hz**（若要串流至高刷設備可設為 120Hz）。
        
    - 螢幕模式設為「延伸這些顯示器 (Extend these displays)」。
        

### 步驟 B：建立隔離的使用者帳號

為避免多用戶連線搶奪鍵鼠與視窗作用中焦點（Active Focus），Windows 需建立獨立的使用者環境：

1. 建立兩組本機標準使用者帳號（例如：`Player1` 與 `Player2`）。
    
2. 設定自動登入或確保兩組帳號皆具備背景 Session 執行權限。
    

### 步驟 C：Duo 與 Sunshine 配置

1. **安裝 Duo**：
    
    - 執行 Duo 安裝精靈，軟體會自動偵測並綁定 Sunshine 執行檔與 IddSampleDriver。
        
    - 在 Duo 設定面板中建立兩個「Seat（座席）」：
        
        - **Seat 1**：綁定使用者 `Player1`、關聯虛擬螢幕 `Display 1`、指派虛擬手把 1。
            
        - **Seat 2**：綁定使用者 `Player2`、關聯虛擬螢幕 `Display 2`、指派虛擬手把 2。
            
2. **Sunshine 編碼器調校**：
    
    - 開啟 Sunshine WebUI（`https://localhost:47990`）。
        
    - **Configuration ➔ Audio/Video**：
        
        - **Encoder**：強制指定 `NVENC`。
            
        - **NVENC Preset**：設為 `P1` 或 `P2`（Performance，極限降低編碼延遲）。
            
        - **Capture Method**：選擇 `Desktop Duplication API (DXGI)`。
            
3. **Moonlight 配對**：
    
    - 用戶 A（如客廳電視 Shield TV）開啟 Moonlight，配對 Duo 的 Seat 1 連接埠。
        
    - 用戶 B（如筆電/房間設備）開啟 Moonlight，配對 Duo 的 Seat 2 連接埠。
        

## 4. Tips (實戰避坑與最佳化技巧)

- **避免一人關機整台斷電 (Shutdown Prevention)**：
    
    - 當客廳 Moonlight 客戶端點選選單內的「Quit / Turn Off PC」時，預設可能觸發 Windows 實體關機指令。
        
    - **解法**：按下 `Win + R` 輸入 `gpedit.msc`（本機群組原則編輯器）➔ 導航至 `電腦設定 ➔ Windows 設定 ➔ 安全性設定 ➔ 本機原則 ➔ 使用者權限指派` ➔ 編輯「關閉系統」，移除標準 Users 群組，**僅保留 Administrators**，防止遠端玩家誤觸關機。
        
- **喚醒失敗排查 (Wake-on-LAN 最佳化)**：
    
    - Windows 11 預設開啟的「快速啟動 (Fast Startup)」會切斷網卡待命供電，導致無法接收 Magic Packet。
        
    - 至「電源選項」中**關閉「開啟快速啟動」**；並至「裝置管理員」網卡內容中將「關機網路喚醒 (Shutdown Wake-On-Lan)」設為 **Enabled**、「節能乙太網路 (Energy Efficient Ethernet)」設為 **Disabled**。
        
- **遊戲存檔（Save Data）本機隔離，ROM / BIOS 集中共享**：
    
    - 若搭配 EmuDeck 或模擬器，遊戲 ROM 與 BIOS 建議透過 SMB 網路磁碟機集中掛載自 NAS；但**遊戲存檔（Saves / States）務必留在本機各使用者的 `%APPDATA%` 或各自的 Windows 使用者目錄下**。避免 Duo 雙開相同遊戲時發生檔案寫入鎖死（File Lock）或記錄互相覆蓋的慘劇。
        
- **筆電常駐防爆電池 (Battery Care)**：
    
    - 若採用電競筆電作為 Duo 主機，長期插電常駐極易因持續高溫導致鋰電池膨脹。請務必進入原廠控制軟體（如 MSI Center / Dragon Center）將充電上限鎖定在 **50%~60%**，或直接拆除內部電池由變壓器供電。
        
- **同網段 L2 直通，釋放閘道器負擔**：
    
    - 雙開 1080p 60fps 串流瞬時頻寬可達 80~100 Mbps。務必將串流主機與主要客戶端（如 Shield TV）插在同一個區域網路交換機（同 VLAN/網段），讓封包全走硬體線速交換，避免無謂流經軟體路由器產生延遲與排程抖動（Jitter）。