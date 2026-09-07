---
title: Docusaurus + GitHub Actions 自動化編譯與 GitHub Pages 部署
date: 2026-09-07
tags:
  - Github
  - Network
  - Blog
  - Wiki
---
# Docusaurus + GitHub Actions 自動化編譯與 GitHub Pages 部署

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

## 1. 自動化部署架構拓撲

目前 GitHub Pages 支援兩種發布模式：

1. **GitHub Actions 原生 Artifact 發布 (推薦首選)**： 建置產物（`build/`）直接以二進位壓縮包形式傳送給 GitHub Pages 底層基礎設施，倉庫內**不需要**額外維護一個充滿編譯雜訊的 `gh-pages` 分支，乾淨且執行速度極快。
    
2. **傳統分支覆寫發布 (`gh-pages` 分支)**： 由 Action 自動建立 `gh-pages` 分支，並將靜態產物 commit 至該分支。
    

```
[本地終端 / Obsidian / VSCode]
             │
             │ 1. Git Push Markdown 文件與程式碼變更
             ▼
      [GitHub 遠端儲存庫: main 分支]
             │
             │ 2. Webhook 觸發 GitHub Actions (.github/workflows/deploy.yml)
             ▼
┌───────────────────────────────────────────────────────────┐
│ GitHub Actions Runner (ubuntu-latest)                     │
│ ├─ Actions Checkout: 完整拉取歷史 (包含文檔 Git 時間戳)   │
│ ├─ Setup Node.js: 載入 Node.js 20 環境並自動命中 NPM 快取 │
│ ├─ npm ci: 依據 package-lock.json 嚴格安裝依賴            │
│ └─ npm run build: 編譯靜態 HTML / CSS / JS 產物至 build/   │
└────────────────────────────┬──────────────────────────────┘
                             │
                             │ 3. 封裝 build/ 並安全簽發部署憑證
                             ▼
                [GitHub Pages 託管 CDN 伺服]
                             │
                             ▼
               線上正式站點: https://<User>.github.io/<Repo>/
```

## 2. 前置準備：倉庫與 `docusaurus.config.js` 網址對齊

Docusaurus 在編譯時會嚴格依據 `url` 與 `baseUrl` 計算所有資源（CSS、JS、圖片）的絕對路徑。路徑設定錯誤是造成 GitHub Pages 上線後樣式遺失（破版）、404 的最主要原因。

### 2.1 網址配置計算公式

假設你的 GitHub 帳號為 `kiwihome`，倉庫名稱為 `kiwi-wiki`：

- **`url`**：`[https://kiwihome.github.io](https://kiwihome.github.io)`（若綁定自訂網域則填自訂網域，如 `[https://wiki.example.com](https://wiki.example.com)`）
    
- **`baseUrl`**：`/<Repo名稱>/`（前後必須都要有斜線，例如 `/kiwi-wiki/`；**若使用自訂頂級網域，此處必須改為 `'/'`**）
    
- **`organizationName`**：GitHub 組織或個人帳號名稱
    
- **`projectName`**：倉庫名稱
    
- **`trailingSlash`**：明確指定結尾是否帶斜線（建議設為 `false`，可避免 GitHub Pages 上特定錨點連結轉跳失敗）
    

編輯專案根目錄的 `docusaurus.config.js`：

```javascript
// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My HomeLab Wiki',
  tagline: '自動化維運與技術文件庫',
  favicon: 'img/favicon.ico',

  // 核心路徑宣告 (依據專案嚴格替換)
  url: 'https://<USERNAME>.github.io',
  baseUrl: '/<REPO_NAME>/',

  organizationName: '<USERNAME>',
  projectName: '<REPO_NAME>',
  trailingSlash: false,

  onBrokenLinks: 'throw',         // 遇到死連結直接中斷 Build，防止髒資料上線
  onBrokenMarkdownLinks: 'warn',

  // ... 其餘主題與外掛配置保持不變
};

module.exports = config;
```

## 3. GitHub 倉庫控制台一次性權限設定

在推送 Workflow 前，必須前往 GitHub 倉庫網頁完成權限放行：

1. 開啟目標 GitHub 儲存庫。
    
2. 點選頂部導航列的 **Settings (設定)**。
    
3. 左側選單找到 **Pages**（位於 Code and automation 區塊）：
    
    - **Build and deployment -> Source**：將預設的 `Deploy from a branch` 切換改為 **`GitHub Actions`**。
        
4. 左側選單點擊 **Actions** -> **General**：
    
    - 滾動至 **Workflow permissions** 區塊。
        
    - 確認選取 **Read and write permissions**（讀取與寫入權限）。
        
    - 勾選 **Allow GitHub Actions to approve pull request requests**（若有跳出），點擊 **Save**。
        

## 4. GitHub Actions 工作流程配置檔案

在本地專案根目錄建立目錄與檔案：`.github/workflows/deploy.yml`。

### 方案 A：現代化原生 Pages 部署（強烈推薦，零分支污染）

本配置採用 GitHub 官方 `upload-pages-artifact` 與 `deploy-pages` 模組，不需要建立 Personal Access Token (PAT)，完全依靠 Runner 內建的短效 OIDC Token 進行安全部署。

```yaml
name: Deploy Docusaurus to GitHub Pages

on:
  push:
    branches:
      - main # 觸發分支，若專案預設為 master 請自行調整

# 嚴格定義 Workflow 權限
permissions:
  contents: read      # 讀取儲存庫程式碼
  pages: write         # 寫入 GitHub Pages 產物
  id-token: write      # 用於 OIDC 認證完成免金鑰部署

# 避免多個 commit 同時推送時產生並發衝突，自動取消前一個未完成的任務
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    name: Build Docusaurus
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          # fetch-depth: 0 代表抓取完整 Git 歷史紀錄
          # 關鍵：若設為 1，Docusaurus 將無法獲取文件的「最後編輯時間」與「作者資訊」
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm # 自動快取 ~/.npm 目錄，大幅加速 npm ci 時間

      - name: Install dependencies
        # 使用 npm ci 取代 npm install，依據 package-lock.json 嚴格還原版本
        run: npm ci

      - name: Build website
        # 編譯產生靜態 build/ 目錄
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build/ # 指定 Docusaurus 的編譯輸出目錄

  deploy:
    name: Deploy to GitHub Pages
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 方案 B：傳統推送至 `gh-pages` 分支（相容舊架構）

若你的組織專案規範要求必須能在分支列表中看見實體檔案與 commit 歷史，可使用 Docusaurus 官方內建的 CLI 發布腳本：

```yaml
name: Deploy to gh-pages Branch

on:
  push:
    branches:
      - main

permissions:
  contents: write # 必須具備對倉庫的寫入權限以建立分支

jobs:
  deploy:
    name: Deploy via Docusaurus CLI
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Deploy to gh-pages
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          npx docusaurus deploy
        env:
          # 使用內建的 GITHUB_TOKEN，無需手動配置 Secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 5. 自訂網域 (Custom Domain) 與 HTTPS 配置

若打算為該 Wiki 綁定自己的網域（例如 `wiki.example.com`）：

### 步驟 1：建立 `CNAME` 靜態檔案

在專案的 **`static/`** 目錄下新增名為 **`CNAME`** 的純文字檔案（無副檔名），內容填寫你的網域名稱：

```
wiki.example.com
```

_放在 `static/` 下的檔案在 build 時會自動被原封不動複製到 `build/` 根目錄。_

### 步驟 2：修改 `docusaurus.config.js`

```javascript
  url: 'https://wiki.example.com',
  baseUrl: '/',                     // 綁定自訂網域後，baseUrl 必須改回根路徑 '/'
```

### 步驟 3：DNS 設定 (以 Cloudflare / DNS 解析商為例)

在 DNS 解析商新增一筆 **CNAME 紀錄**：

- **名稱 (Name)**：`wiki`
    
- **目標 (Target)**：`<USERNAME>.github.io`
    
- **代理狀態**：若是 Cloudflare，初次申請證書時建議先設為 **DNS Only (灰雲)**，待 GitHub 成功發下 Let's Encrypt 證書並啟用「Enforce HTTPS」後再評估是否開啟橘雲。
    

## 6. 常見疑難排解 (Troubleshooting)

### 6.1 Action 建置失敗，日誌出現 `Docusaurus found broken links!`

- **原因**：Docusaurus 預設在編譯期具備防呆機制，如果 Markdown 內文引用了不存在的文件檔名、相對路徑打錯、或引用了不存在的 Markdown 錨點（`#section-title`），編譯會強制中斷。
    
- **處置**：
    
    1. 檢視 Action 執行記錄，輸出會明確標註具體是哪個檔案的第幾行出現死連結。
        
    2. 修正該路徑；若有特定頁面仍在草稿階段，可在該 Markdown 的 Frontmatter 加上 `draft: true` 略過編譯。
        

### 6.2 部署完成後訪問網站，頁面全白且 Console 出現大量的 404

- **原因**：`baseUrl` 與 GitHub 倉庫名稱不吻合。例如倉庫名叫 `my-wiki`，但 `baseUrl` 設成了 `'/'`，導致瀏覽器去 `https://<User>.github.io/assets/css/...` 抓資源，而非去 `https://<User>.github.io/my-wiki/assets/css/...`。
    
- **處置**：回頭檢查 `docusaurus.config.js`，確認 `baseUrl: '/<REPO_NAME>/'` 頭尾皆有斜線。
    

### 6.3 Action 報錯 `Permission to ... denied to github-actions[bot]`

- **原因**：儲存庫未開啟 Actions 寫入權限。
    
- **處置**：前往儲存庫 **Settings** -> **Actions** -> **General** -> **Workflow permissions**，切換為 **Read and write permissions** 並點選 Save。
    

### 6.4 本地能跑 `npm start`，但在 Actions 的 `npm run build` 拋出記憶體不足 (OOM)

- **原因**：文檔數量達數百篇以上時，Node.js 預設堆疊記憶體（1.5GB 左右）在編譯 Webpack 產物時耗盡。
    
- **處置**：在 Workflow 的編譯步驟前注入 Node 環境變數拉高記憶體上限：
    
    
   ```yaml
        - name: Build website
          run: npm run build
          env:
            NODE_OPTIONS: "--max-old-space-size=4096"
   ```