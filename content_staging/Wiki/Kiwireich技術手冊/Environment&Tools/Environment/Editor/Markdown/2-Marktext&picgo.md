---
title: Marktext 與 PicGo 圖片自動上傳暨跨平台筆記工具
tags:
  - Markdown
---
# Marktext 與 PicGo 圖片自動上傳暨跨平台筆記工具

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

:::tip
自從 Typora 轉為付費軟體後，開源的 **Marktext** 成為優秀的替代方案。為了擺脫圖床手動上傳的痛點，結合命令列的 **PicGo-Core** 可以實現完美的自動化圖床工作流程，這套邏輯也能無縫延伸至 **Obsidian** 筆記環境中。
:::

**Marktext 常用快捷鍵與排版對應**

|**功能名稱**|**快捷鍵**|**產出語法與效果**|
|---|---|---|
|**插入圖片**|`Ctrl + Shift + I`|`![說明文字](圖片連結)`（跳出對話框輸入資訊，若配置好 Image Uploader 會自動上傳）|
|**程式碼區塊**|`Ctrl + Shift + K`|`語法`（快速產生 Code Fence 框線）|
|**數學公式**|`Ctrl + Shift + $`|插入數學表達式區塊|

**PicGo-Core 於 Linux (Manjaro) 的安裝實戰**

在 Linux (如 Manjaro / Arch) 環境下，切記**不要安裝**網路上常見的 GUI 版 `picgo-appimage`，因為 Marktext 的圖片上傳外掛無法直接對應抓取該 GUI 的背景行程。必須改用 Node.js 的命令列核心 **PicGo-Core**：

- **全域安裝指令：**
    
    
   ```bash
    sudo npm install picgo -g
   ```
    
    _(註：需使用 `sudo` 確保全域環境權限完整，避免寫入路徑失敗。)_
    
- **初始化與圖床設定：**
    
    執行互動式設定精靈，以 GitHub 圖床為例：
    
    
   ```bash
    picgo set uploader
   ```
    
    依序填入相關參數（如 `repo` 倉庫名稱、`token` 權限憑證、`path` 儲存路徑等）。
    
- **啟用指定圖床：**
    
    設定完成後，**務必執行以下指令**才會正式套用：
    
    
   ```bash
    picgo use uploader
   ```
    
- **Marktext 內的外掛對應：**
    
    打開 Marktext 的偏好設定，在圖片上傳選項中勾選 `picgo`。只要設定正確，貼上或匯入圖片時就會自動透過命令列背景上傳。
    

**Obsidian 的 PicGo 整合應用**

與 Marktext 著重於「貼上即上傳」的即時編輯不同，Obsidian 預設是以本地 Markdown 檔案與資料夾 vault 為核心。若希望在 Obsidian 中也能享有與 PicGo 相同的自動上傳雲端圖床體驗，通常透過社群外掛來實現：

1. **安裝外掛：**
    
    在 Obsidian 的「社群外掛 (Community Plugins)」中搜尋並安裝 **Image Auto Upload Plugin** 或 **PicGo Integration**。
    
2. **指定 PicGo 執行檔路徑：**
    
    在該外掛的設定頁面中，將 PicGo Path 指向上一步透過 npm 安裝的全域執行檔路徑（例如 `/usr/bin/picgo` 或透過 `which picgo` 查詢）。
    
3. **運作機制：**
    
    當你在 Obsidian 內貼上截圖或圖片時，外掛會自動呼叫系統的 `picgo` 命令將圖片推送到 GitHub 雲端，並自動把 Markdown 中的本機絕對路徑替換為遠端圖床的 CDN 連結，讓跨裝置同步筆記時不再因為找不到圖片而破圖。