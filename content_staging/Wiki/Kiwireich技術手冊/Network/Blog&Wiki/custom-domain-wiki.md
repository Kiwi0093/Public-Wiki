---
title: GitHub Pages 自訂網域綁定與 Docusaurus 根路徑遷移
date: 2026-09-15
tags:
  - Blog
  - Wiki
  - Network
---
# GitHub Pages 自訂網域綁定與 Docusaurus 根路徑遷移指引

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

在以 GitHub Pages 託管基於 Docusaurus 的 Wiki / Blog 時，預設專案站點會被發布於以儲存庫命名的子路徑（例如 `https://kiwi0093.github.io/Public-Wiki/`）。

若要將網站改為以獨立子網域（如 `https://blog.kiwireich.com/`）作為根站點訪問，**直接為該 GitHub Pages 專案綁定自訂網域（Custom Domain）是最簡潔的方案**。此方式無需變更 GitHub 儲存庫名稱（無需重命名為 `kiwi0093.github.io`），也不會影響舊首頁，即可自動將專案掛載於自訂網域的根路徑 `/`。

---

## 1. 核心流程與架構轉變

* **遷移前**：`https://kiwi0093.github.io/Public-Wiki/`（專案型站點，資源與路由皆依賴 `/Public-Wiki/` 前綴）。
* **遷移後**：`https://blog.kiwireich.com/`（獨立網域站點，資源與路由回歸根目錄 `/`）。
* **維護優勢**：
  * 原儲存庫 `Public-Wiki`（或 `Public_wiki`）名稱保持不變。
  * 既有的 `kiwi0093.github.io` 儲存庫不受干擾，無需做搬遷至 `/old/` 的破壞性異動。
  * 根目錄路由自然成立，解決跨平台靜態資源引用與階層路徑錯位的問題。

---

## 2. 操作步驟

### 步驟 A：設定 DNS CNAME 解析記錄

登入負責代管主網域（`kiwireich.com`）的 DNS 控制台（如 Cloudflare 或託管 DNS 服務商），新增子網域的 CNAME 導向：

| 記錄類型 (Type) | 主機名稱 (Name / Host) | 目標位址 (Target / Value) | TTL | Proxy 狀態 (若使用 Cloudflare) |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `blog` | `kiwi0093.github.io` | 自動 / Auto | **僅限 DNS (DNS only / 灰雲)** |

> **提示**：若 DNS 代管於 Cloudflare，初次綁定時建議先關閉 Proxy（轉為灰雲），避免 Cloudflare 邊緣快取與 SSL 終結機制干擾 GitHub 系統自動簽發 Let's Encrypt 憑證。

---

### 步驟 B：修改 Docusaurus 設定檔 (`docusaurus.config.js`)

由於網域更換且路徑由子資料夾變更為根路徑，需同步校正網站基礎 URL 與基底路徑：

編輯 Wiki 專案根目錄下的 `docusaurus.config.js`（或 `docusaurus.config.ts`）：

```javascript
module.exports = {
  // 將站點主網址改為指定的自訂子網域
  url: '[https://blog.kiwireich.com](https://blog.kiwireich.com)',

  // 【關鍵修正】：由原本的 '/Public-Wiki/' 改為根目錄 '/'
  baseUrl: '/',

  // GitHub Pages 部署相關宣告 (保持現況即可)
  organizationName: 'kiwi0093',
  projectName: 'Public-Wiki',
  trailingSlash: false,

  // ... 其餘主題、導覽列與外掛配置維持原樣 ...
};
```
### 步驟 C：建立靜態 `CNAME` 宣告檔（防止 CI/CD 覆蓋）

GitHub Pages 綁定自訂網域時，會在發布分支（如 `gh-pages`）根目錄寫入一個名為 `CNAME` 的檔案。若專案由 GitHub Actions 等自動化工具構建，每次建置都會以 `./build` 覆蓋發布分支，導致網頁後台手動填寫的網域被刷掉。

將 `CNAME` 納入 Docusaurus 的靜態資源目錄（`static/`），建置程序會自動將其複製到產出根目錄：

1. 在專案的 `static/` 資料夾下建立檔案 `static/CNAME`（注意：無副檔名）。
    
2. 內容僅需填寫一行為自訂網域名稱：
    
    Plaintext
    
    ```
    blog.kiwireich.com
    ```
    

### 步驟 D：推送變更並觸發 GitHub Actions

將設定與靜態檔案提交並推送至 GitHub：

Bash

```
git add docusaurus.config.js static/CNAME
git commit -m "feat: configure custom domain blog.kiwireich.com and set baseUrl to root"
git push origin main
```

推送後，檢查 GitHub 倉庫的 **Actions** 分頁，確認自動部署 Workflow 順利跑出綠燈。

### 步驟 E：GitHub 專案後台確認與強制啟用 HTTPS

1. 開啟 GitHub 上的 `Public-Wiki` 儲存庫。
    
2. 點擊 **Settings** ➔ 左側選單 **Pages**。
    
3. 檢查 **Custom domain** 欄位：
    
    - 系統此時應已自動填入 `blog.kiwireich.com`（若無，手動輸入並點擊 **Save**）。
        
4. **DNS 檢驗與憑證核發**：
    
    - 系統會自動執行 **DNS check**。通過後，GitHub 會為該網域申請 TLS/SSL 憑證（通常約需 5 至 15 分鐘）。
        
5. 憑證核發完成後，勾選 **Enforce HTTPS**，確保所有未加密 HTTP 流量自動重新導向至 HTTPS。
    

## 3. 驗證檢核清單

- [ ] 瀏覽器開啟 `https://blog.kiwireich.com/`，確認首頁能正常載入且無跑版。
    
- [ ] 檢查 CSS、JS 與圖片資源的載入路徑，確認皆以 `https://blog.kiwireich.com/assets/...` 開頭，而非帶有舊的 `/Public-Wiki/` 路徑。
    
- [ ] 檢查 Wiki 與 Blog 內部跨頁連結，確認路由切換無 404 錯誤。
    
- [ ] 檢查 SSL 憑證狀態，確認瀏覽器網址列顯示安全加密鎖頭標示。