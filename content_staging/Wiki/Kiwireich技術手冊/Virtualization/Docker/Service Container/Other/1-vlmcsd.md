---
title: vlmcsd 本地 KMS 服務架設
tags:
  - VM
  - Microsoft
  - Container
date: 2026-09-04
---

# vlmcsd 本地 KMS 服務架設與未來趨勢分析

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Windows](https://img.shields.io/badge/Windows-Supported-green?style=plastic&logo=windows) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 核心機制與版本限制

- **KMS 啟用本質**：KMS 授權期限為 **180 天**，客戶端每隔 7 天會自動向 KMS 伺服器發送續期請求；若伺服器在線，每次續期後重置為 180 天。
    
- **支援版本限制**：
    
    - **Windows**：**僅支援大量授權版（Volume）及專業版（Pro）、企業版（Enterprise）、教育版（Education）與 Windows Server**。家庭版（Home Edition）不具備 KMS 客戶端元件，無法直接啟用（需先升級為 Pro）。
        
    - **Office**：**僅支援大量授權版本（Office LTSC / Volume License）**。一般零售版（Retail / Click-to-Run 家用版）或 Microsoft 365 訂閱版無法直接透過 KMS 啟用，需透過 Office Deployment Tool (ODT) 安裝大量授權版本。
        
- **GVLK (Generic Volume License Key)**：Microsoft 官方公開提供的通用大量授權金鑰，其作用僅在於引導系統「向局域網內的 KMS 伺服器尋求認證」，並非盜版序號。
    

## 2. Docker Compose 伺服端部署

`vlmcsd` 資源消耗極低（記憶體通常小於 5MB），僅需監聽標準 KMS 協定埠口 **TCP 1688**。

### 步驟 1：建立專用目錄

```bash
mkdir -p /opt/vlmcsd
cd /opt/vlmcsd
```

### 步驟 2：`docker-compose.yml` 配置

```yaml
services:
  vlmcsd:
    image: mikolatero/vlmcsd:latest
    container_name: vlmcsd
    restart: unless-stopped
    ports:
      - "1688:1688"
```

啟動服務並檢查日誌：

```bash
docker compose up -d
docker compose logs -f
```

## 3. Windows 客戶端啟用步驟

以**系統管理員身分 (Administrator)** 開啟命令提示字元（CMD）或 PowerShell：

```powershell
:: 1. (選用) 清除原有綁定的序號
slmgr.vbs /upk

:: 2. 安裝對應版本的微軟官方 GVLK 金鑰
slmgr.vbs /ipk <GVLK-KEY>

:: 3. 指向你的 vlmcsd 伺服器 IP 或內網主機名
slmgr.vbs /skms <DOCKER_HOST_IP>:1688

:: 4. 觸發連線啟用
slmgr.vbs /ato

:: 5. 查看詳細授權狀態與過期倒數計時
slmgr.vbs /dlv
```

### 常見 Windows GVLK 官方公開金鑰速查表

|**作業系統版本**|**官方 GVLK 金鑰**|
|---|---|
|**Windows 11 / 10 Pro (專業版)**|`W269N-WFGWX-YVC9B-4J6C9-T83GX`|
|**Windows 11 / 10 Pro Workstations**|`NRG8B-VKK3Q-CXVCJ-9G2XF-6Q84J`|
|**Windows 11 / 10 Enterprise (企業版)**|`NPPR9-FWDCX-D2C8J-H872K-2YT43`|
|**Windows Server 2025 Standard**|`TVRH6-WHNXV-R9WG3-9XRFY-MY832`|
|**Windows Server 2025 Datacenter**|`D764K-2NDRG-47T6Q-P8T8W-YP6DF`|
|**Windows Server 2022 Standard**|`VDYBN-27WPP-V4HQT-9VMD4-VMK7H`|
|**Windows Server 2022 Datacenter**|`WX4NM-KYWYW-QJJR4-XV3QB-6VM33`|

## 4. Office 大量授權版 (LTSC) 部署與啟用

零售版 Office 無法直接向 KMS 認證，必須安裝大量授權版本。

### 步驟 A：取得與配置 Office Deployment Tool (ODT)

1. 前往微軟官方下載 **Office Deployment Tool (ODT)**。
    
2. 開啟 **[Office Customization Tool](https://config.office.com/deploymentsettings)** 線上設定頁面：
    
    - 架構選擇：`64 位元`。
        
    - 產品選擇：**Office LTSC 專業增強版 (Volume License / 大量授權)**（如 Office LTSC 2021 或 2024）。
        
    - 授權與啟用：選擇 **KMS**。
        
    - 語言：`繁體中文 (台灣)`。
        
3. 匯出設定檔並命名為 `configuration.xml`，放置於解壓縮 ODT (`setup.exe`) 的同一目錄下。
    

### 步驟 B：下載與安裝

在該目錄以系統管理員身分執行 CMD：

```powershell
:: 1. 預先下載安裝檔案
setup.exe /download configuration.xml

:: 2. 執行本機靜默安裝
setup.exe /configure configuration.xml
```

### 步驟 C：透過 OSPP.VBS 啟用

進入 Office 安裝路徑（依據安裝位元度選擇）：

```powershell
:: 64 位元 Office：
cd "C:\Program Files\Microsoft Office\Office16"

:: 32 位元 Office (若裝在 64 位元 Windows)：
cd "C:\Program Files (x86)\Microsoft Office\Office16"
```

依序執行以下指令：

```powershell
:: 1. 設定 KMS 伺服器位址
cscript ospp.vbs /sethst:<DOCKER_HOST_IP>

:: 2. (若未帶入金鑰) 手動指定該產品 GVLK
cscript ospp.vbs /inpkey:<OFFICE-GVLK-KEY>

:: 3. 立即執行連線啟用
cscript ospp.vbs /act

:: 4. 檢視授權狀態與剩餘天數
cscript ospp.vbs /dstatus
```

### 常見 Office GVLK 金鑰速查

|**Office 版本**|**官方 GVLK 金鑰**|
|---|---|
|**Office LTSC 2024 專業增強版**|`2F3VR-PNB29-V9782-2JYTQ-74FY3`|
|**Office LTSC 2021 專業增強版**|`FXYTK-NJJ8C-GB6DW-3DYQT-6F79E`|
|**Office 2019 專業增強版**|`NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP`|
|**Visio LTSC 2021 專業版**|`KDX7X-BNVR8-TXXGX-4Q7Y8-78VT3`|
|**Project LTSC 2021 專業版**|`FTNWT-C6WVM-F4WDZ-DG69P-7G4F8`|

## 5. 常見錯誤碼與故障排查 (Troubleshooting)

|**錯誤代碼**|**說明**|**排除方式**|
|---|---|---|
|`0xC004F074`|無法連線至 KMS 伺服器|檢查 Docker 容器運作狀態，並確認 1688 連接埠未被宿主機防火牆阻擋。|
|`0xC004F038`|KMS 計數不足（Count not sufficient）|微軟標準要求 Windows 需 25 台、Server 需 5 台。`vlmcsd` 已模擬滿額計數；若報錯代表映像檔過舊或計數器損毀，請更新映像檔。|
|`0xC004F015`|金鑰無效或版本不支援|當前安裝為 Retail 或 Home 版，非 Volume 大量授權版。需置換 GVLK 或重裝大量授權版本。|

## 6. 微軟官方發展趨勢 vs. 本地 KMS (vlmcsd) 的未來

隨企業架構全面朝向遠端辦公與雲端原生推進，微軟近年對傳統授權架構進行了深度的戰略調整，這直接衝擊了本機 KMS 工具的實用場景：

### 6.1 微軟官方的去 KMS 化趨勢 (De-KMS)

1. **全面倒向基於身分的訂閱啟用 (Subscription-based Activation)**：
    
    - 在企業端，微軟主力推廣 **Microsoft Entra ID (舊稱 Azure AD)** 與 **Microsoft Intune**。
        
    - 現代 Windows 11/10 裝置只要透過使用者登入 M365 (E3/E5 或 A3/A5) 帳號，作業系統就會直接由 Pro 版無縫熱升級至 Enterprise，完全不需部署 KMS 伺服器、也不需要輸入 GVLK。
        
2. **混合辦公導致內網 KMS 難產**：
    
    - 傳統 KMS 要求每 180 天必須與內部網路的 KMS Host 溝通（否則進入寬限期退回未啟用）。在混合辦公（Work from Anywhere）環境下，仰賴 VPN 回公司連線 KMS 常造成大量 IT 負擔，微軟正加速輔導企業淘汰地端 KMS 轉為雲端啟用。
        
3. **Office 全面邁向 SaaS (Microsoft 365 Apps)**：
    
    - 微軟不斷壓縮 LTSC (Long-Term Servicing Channel) 買斷版的地位與支援週期（例如支援年限由過往 10 年縮減至 5 年），並限制雲端協作新功能僅提供給 M365 訂閱用戶。這讓依賴 KMS 的 Office 大量授權版本逐漸邊緣化。
        

### 6.2 vlmcsd 這類工具的未來與局限

|**評估維度**|**現況與未來展望**|
|---|---|
|**短期前景 (仍有生存空間)**|在**隔離內網（Air-gapped）、工業控制網路、內部測試 HomeLab、虛擬化叢集（Proxmox / ESXi）與 Windows Server 本地環境**中，vlmcsd 仍具極高的便利性與不可替代性，能讓未聯網的 VM 正常啟用並維持測試功能。|
|**功能限制 (功能斷層)**|透過 vlmcsd 啟用的 Office 僅能解鎖傳統離線功能，**完全無法使用微軟伺服端支援的進階雲端功能**（如 Copilot AI 整合、Excel 雲端資料類型、即時多人協同編輯等），因為這些功能均需雲端帳號驗證。|
|**協定維護與升級風險**|微軟隨新版 Windows / Windows Server 發布時，可能會調整 KMS 通訊協定版本或 RPC 驗證機制。若開源社群對 `vlmcsd` 停止維護或未及時適配新版簽名，未來新一代系統（如 Windows 12）可能會出現 `vlmcsd` 無法相容而失效的情況。|
|**數位授權 (HWID) 工具的競爭**|在個人使用者領域，社群近年多轉向利用微軟官方的無障礙升級通道或數位權利遷移漏洞（如 HWID / MAS 等直接將主機板硬體雜湊寫入微軟雲端伺服器取得永久數位授權），使得需要定時維持 180 天續期的 KMS 工具在一般桌機上被大量替代。|
