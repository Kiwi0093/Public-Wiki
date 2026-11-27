# Public-Wiki 專案規則（AGENTS.md）

本檔案定義 `Public-Wiki` 儲存庫的運作邊界、部署架構與開發協作規範。所有在此工作區執行的自動化協助與設定調整均須遵守下列規則。

---

## 1. 架構總覽與不可變紅線

- **固定發佈管線**：
  `本地 Obsidian (Private-Vault)` → 同步至 `Public-Wiki/content_staging/{Wiki,Blog}` → `Public-Wiki`（`main` 分支）GitHub Actions 建置 Docusaurus → 發佈至 `gh-pages` 分支 → GitHub Pages（`https://blog.kiwireich.com`）
- **禁止擅自變更整體架構**：
  - 不得更改上述雙 Repo 同步框架與上游 `content_staging/` 結構。
  - 不得更換 GitHub Pages 的 `gh-pages` 分支發佈模式或改用其他部署平台／建置框架（除非使用者明確要求）。
  - 不得隨意更動既有文章的路由結構與 `slug`，確保外部連結相容。

---

## 2. Repo 職責邊界與禁止事項

- **`Public-Wiki` 的唯一職責（網站編譯引擎）**：
  - Docusaurus 核心設定：`docusaurus.config.js`、`sidebars.js`、`package.json`、`package-lock.json`
  - 客製化外觀與主題元件：`src/css/`、`src/theme/`、`src/pages/`
  - 靜態資源：`static/`（含 `CNAME`、`robots.txt`、站台圖示與圖片）
  - 內容前處理腳本：`fix-mdx.py`
  - 網站介面層 i18n 字串：`i18n/{en,ja}/**/*.json`
  - CI/CD 與依賴自動化：`.github/workflows/`、`renovate.json`
- **嚴禁修改 `content_staging/` 內任何檔案**：
  - `content_staging/` 為上游 `Private-Vault` 人工審閱後同步產物，任何在 `Public-Wiki` 的直接修改都會在下次同步時被覆蓋。
  - 所有文章內容（含未來收歸 Obsidian 統一管理的 Wiki 首頁）一律於 `Private-Vault` 維護。
- **嚴禁直接操作、修改或手動提交 `gh-pages` 分支**：
  - `gh-pages` 分支完全由 `.github/workflows/deploy.yml` 透過 `peaceiris/actions-gh-pages` 以 `keep_files: false` 自動覆寫，並由 GitHub Pages 內建的 `pages build and deployment` 自動發佈。
  - 日常開發與維護僅限操作 `main` 分支（或開 PR 合併進 `main`）。

---

## 3. 站台基準設定

- **正式網域**：`https://blog.kiwireich.com`（須與 `static/CNAME` 保持一致）。
- **路由結構**：
  - Blog 掛載於根路徑 `/`
  - Wiki 掛載於 `/docs`
- **介面與預設語系**：
  - 預設語系為 `zh-Hant`（繁體中文，台灣慣用語）。
  - 站台內任何由本專案維護的頁面或文案皆不允許殘留 AI 引用標記（例如 `[cite: ...]`）。

---

## 4. i18n 多語系架構規範（`zh-Hant` / `en` / `ja`）

- **語系設定**：`defaultLocale` 為 `zh-Hant`，目標語系為 `['zh-Hant', 'en', 'ja']`。
- **單一事實來源（SSOT）**：
  - 所有文章原稿以 `zh-Hant` 為主（由作者撰寫或與 AGY 在 `Private-Vault` 協作）。
  - `en` 與 `ja` 均為由 `zh-Hant` 衍生的翻譯版本，不單獨維護脫離原稿的內容分支。
- **翻譯檔對齊規則**：
  - `en` 與 `ja` 的文章譯本必須維持與 `zh-Hant` 原稿**完全相同的相對路徑、檔名、`date` 與 `slug`**，以確保 Docusaurus 語言切換器（`localeDropdown`）正確對應，並讓尚未翻譯的文章能自動 fallback 顯示 `zh-Hant` 內容。
  - 所有 AI 自動翻譯之 `en` / `ja` 文章譯本開頭（Frontmatter 之後）須包含對應目標語言的 `> :::info` 宣告，標明由 Google `"<LLM Model>"` 自動翻譯且作者不保證精確性與用字。
- **語系檔案分責**：
  - **文章 `.md` / `.mdx` 譯本**：隨原稿集中由 `Private-Vault` 管理並同步至 `Public-Wiki`。
  - **網站 UI 字串（導覽列、頁尾、Theme 標籤等 JSON）**：放置於 `Public-Wiki/i18n/{en,ja}/` 管理。
- **建置注意事項**：
  - 啟用多語系建置後，`.github/workflows/deploy.yml` **不可**再傳入 `--locale zh-Hant`（否則會略過 `en` 與 `ja` 語系建置），須執行完整 `npm run build` 並保留足夠的 Node.js 記憶體上限（例如 `NODE_OPTIONS="--max-old-space-size=4096"`）。

---

## 5. 單一轉換邊界（Obsidian → MDX 統一處理）

- **職責單一化**：
  - `Private-Vault` 保留原生 Obsidian 語法以便本地編寫與預覽，不在 `Private-Vault` 端重複進行 MDX 轉換或相容性檢查；上游同步只負責搬運內容，避免重複處理並提升同步效率。
- **統一轉換時機**：
  - 所有「Obsidian Markdown → Docusaurus MDX 標準格式」的轉換與檢查，統一收斂於 `Public-Wiki` 建置網頁前的 GitHub Actions 階段（由 `fix-mdx.py` 等前處理流程一次性完成）。
  - 轉換範圍必須同時涵蓋 `zh-Hant` 與未來 `en` / `ja` 所有語系文檔，確保編譯行為一致。
- **轉換腳本品質與效率要求**：
  - 維護或擴充 `fix-mdx.py` 時，須嚴格保護各類程式碼區塊（含多反引號 fence、`~~~` 與行內代碼），避免誤傷範例程式碼。
  - 完整涵蓋 Obsidian 常用語法轉換（如縮圖語法、Callout、HTML 自閉合與樣式轉 JSX、易觸發 MDX 解析錯誤的語法）。
  - 維持高效能設計：單次遍歷處理所有目標檔案，且僅在內容實際異動時寫回磁碟。

---

## 6. CI/CD 與 Docusaurus 漸進最佳化守則

- **小步迭代、先確認再修改**：每次調整 workflow、Docusaurus 設定、CSS、Theme 或 `fix-mdx.py` 時，僅針對明確範圍修改，說明變更內容與影響，不做未經討論的大規模重構。
- **改動必驗證**：任何修改 `docusaurus.config.js`、`sidebars.js`、`src/`、`fix-mdx.py`、`package.json` 或 `.github/workflows/` 的變更，提交前須驗證能順利編譯現有 `content_staging/` 內容，不因設定錯誤或 MDX 衝突導致建置中斷。
- **依賴可控性**：套件版本應採明確版號與鎖檔管理，避免使用浮動標籤（如 `latest`）造成無法重現的 CI 建置失敗。
