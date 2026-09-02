---
title: NeoVim 與 NvChad 安裝、設定暨快速鍵
date: 2026-09-02
tags:
  - Linux
  - FreeBSD
---
# NeoVim 與 NvChad 安裝、設定暨快速鍵對照

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 一、 NeoVim 基礎安裝

NeoVim 具備高度擴充性與非同步處理能力，各大 Linux 發行版均可透過原生套件管理工具直接安裝：

- **Arch Linux / Manjaro：**
    
   ```bash
    sudo pacman -S neovim
   ```
    
- **Debian / Ubuntu / Linux Mint：**
    
   ```bash
    sudo apt install neovim
   ```
    
- **Fedora / RHEL：**
    
   ```bash
    sudo dnf install neovim
   ```
    
- _基本設定檔路徑：_ `~/.config/nvim/`

## 二、 NvChad 框架部署

**NvChad** 是一個預先配置好、全面採用 Lua 語言編寫的 NeVim 美化與開箱即用集成包。它保有極佳的輕量性與模組化架構。

### 1. 安裝與初始化

透過 Git 將官方 Starter 專案複製到使用者的 `.config/nvim` 目錄下：

```bash
git clone https://github.com/NvChad/starter ~/.config/nvim && nvim
```

_(註：初次啟動 NeVim 時，系統會自動觸發外掛（Plugin）的下載與安裝介面。)_

### 2. 個人化自訂專案結構管理 (`custom` 目錄)

NvChad 的核心設計建議將所有個人客製化內容放在 `~/.config/nvim/lua/custom/` 目錄下。由於該目錄預設包含在 `.gitigonre` 中，非常適合將其獨立成自己的 Git Repo 進行跨主機同步：

- **全部替代（Full Override）：** 在 `custom` 下放置 `init.lua`，會直接覆寫並清除 NvChad 的預設行為。 
- **部分替代（Partial Override / 推薦）：** 在 `custom` 下放置 `chadrc.lua`，依據 `core/default_config.lua` 的結構進行局部覆寫或擴充。

## 三、 自訂設定實例 (`chadrc.lua` 與 Lua 整合)

### 1. `~/.config/nvim/lua/custom/chadrc.lua` 範例

所有 UI 主題與自訂模組掛載皆在此檔定義：

```lua
---@type ChadrcConfig
local M = {}

-- 設定預設佈景主題
M.ui = {
  theme = "onedark",
}

-- 掛載自訂的程式碼摺疊模組 (對應 custom/folder.lua)
M.folder = require "custom.folder"

return M
```

- **模組載入邏輯說明：** 語法 `M.XXX = require "custom.XXX"` 代表去讀取 `custom/XXX.lua` 檔案。建議複製官方 `core/` 對應檔案前來修改，相容性最高。
    

### 2. `~/.config/nvim/lua/custom/folder.lua` (程式碼摺疊設定實例)

```lua
-- 語法高亮（Neovim 預設開啟，若需強制執行可保留 vim.cmd）
vim.cmd('syntax on')

-- 使用 vim.opt 設定選項 (等同於 Vimscript 的 set)
vim.opt.foldmethod = 'marker'
vim.opt.foldmarker = '{{{,}}}'
vim.opt.foldlevel = 0
vim.opt.foldnestmax = 3

-- 設定全域變數 (等同於 Vimscript 的 let，用來處理舊式外掛變數)
vim.g.php_folding = 1
```

#### 核心對應原則說明：

- **`vim.opt`**：專門用來設定各類 Vim 選項（如 `foldmethod`、`number`、`shiftwidth` 等），支援自動補全與型別處理。
- **`vim.g`**：用來設定全域變數（Global Variables），例如原本的 `let php_folding = 1` 必須對應到 `vim.g.php_folding = 1`。

也可以透過 Lua 呼叫 `vim.cmd()` 可以無縫沿用傳統 Vimrc 的各項設定：

```lua
vim.cmd('syntax on')
vim.cmd('set foldmarker={{{,}}}')
vim.cmd('set foldmethod=marker')
vim.cmd('set foldlevel=0')
vim.cmd('let php_folding = 1')
vim.cmd('set foldnestmax=3')
```

#### 在 Vim 操作摺疊狀態的常用快捷鍵：

|**快捷鍵指令**|**效果與說明**|
|---|---|
|`zi`|**啟用 / 關閉** 檔案整體的摺疊功能|
|`zo`|**打開 (Open)** 當前游標所在的摺疊區塊|
|`zc`|**關閉 (Close)** 當前游標所在的摺疊區塊|
|`zO`|**遞迴打開** 當前游標所在層級以下的所有摺疊區塊|
|`zC`|**遞迴關閉** 當前游標所在層級以下的所有摺疊區塊|
|`zm`|將 `foldlevel` 減 1（將整體摺疊層級再收緊）|
|`zM`|將 `foldlevel` 設為 0（**全部區塊強制摺疊**）|
|`zr`|將 `foldlevel` 加 1（將整體摺疊層級再放寬）|
|`zR`|將 `foldlevel` 設到最大（**全部區塊完全展開**）|
|`zx`|更新摺疊狀態（除了游標所在的區塊外，其餘重新套用規則）|
|`zf`|動態製作透過視覺模式選取範圍的起始與結束摺疊標記|


## 四、 NvChad 核心快速鍵與操作指南 (Key Mappings)

NvChad 的快速鍵多數以 **Leader Key（前導鍵）** 作為起手勢。預設的前導鍵為 **`Space`（空白鍵）**。按下後系統會自動彈出按鍵提示選單（Which-Key）。

### 1. 介面與導覽常用快捷鍵

|**快捷鍵組合 (先按 Leader Space)**|**功能描述**|**備註說明**|
|---|---|---|
|`Space` + `ch`|呼叫內建 Cheat Sheet|查看與搜尋所有快速鍵的好幫手|
|`Space` + `th`|主題切換器 (Theme Switcher)|即時預覽並切換你喜歡的色彩主題|
|`Space` + `ff`|搜尋檔案 (Find Files)|全域專案檔案快速模糊搜尋（非搜文件字串）|
|`Space` + `b`|開啟新 Buffer (分頁)|新增空白的分頁空間|
|`Space` + `x`|關閉當前 Buffer|關閉正在使用中的分頁（比直接用 `:q!` 安全）|
|`方向鍵` 或 `h/j/k/l`|切換正在使用中的 Buffer|在多個開啟的分頁間快速游動|

### 2. NvimTree 檔案樹狀圖快捷鍵

|**快捷鍵組合 (先按 Leader Space)**|**功能描述**|**備註說明**|
|---|---|---|
|`Space` + `e`|開啟 / 關閉左側檔案樹|若沒開會自動展開並將焦點聚焦於左側 Tree|
|`Space` + `q`|關閉左側檔案樹|單純收起側邊欄|
|`:cd <路徑>`|切換工作目錄|將檔案樹的根目錄切換至指定位置（屬指令）|
|`L` (大寫)|跳到右側文本區塊|將游標焦點從檔案樹移回編輯中的程式碼|
|`H` (大寫)|跳回左側檔案樹|將游標焦點移回檔案樹側邊欄|

## 五、 Mason 套件管理器 (LSP / DAP / Linters 管理)

在現代 Neovim 開發環境中，**Mason.nvim** 是用來管理語言伺服器 (LSP)、除錯器 (DAP)、Linter 及 Formatter 的核心外掛。透過統一的圖形介面，開發者可以輕鬆安裝與更新各大程式語言的開發工具。

### 1. 常用指令與操作

在 NvChad 或 Neovim 中輸入以下 Ex 指令即可呼叫 Mason：

|**指令**|**效果描述**|**備註說明**|
|---|---|---|
|`:Mason`|開啟 Mason 主控台介面|呈現互動式儀表板，可透過上下鍵瀏覽、安裝或解除安裝各類工具。|
|`:MasonInstall <package>`|安裝指定工具|直接在命令列安裝特定 Linter 或 LSP（例如 `:MasonInstall pyright`、`:MasonInstall typescript-language-server`）。|
|`:MasonUninstall <package>`|移除指定工具|解除安裝不再需要的語言伺服器或格式化工具。|
|`:MasonUpdate`|更新所有已安裝工具|檢查並將 Mason 管理的所有外部二進位工具升級至最新版本。|

### 2. 結合 NvChad 的 LSP 整合設定

在 NvChad 中，Mason 通常會與 `mason-lspconfig.nvim` 搭配，確保透過 Mason 安裝的語言伺服器能自動與 Neovim 的內建 LSP 進行對接。若需自訂或額外預裝特定 LSP，可在 `~/.config/nvim/lua/custom/plugins.lua` 中進行擴充配置：

```lua
-- 範例：透過 NvChad 的 plugins 覆寫機制擴充 Mason 自動安裝清單
local plugins = {
  {
    "williamboman/mason.nvim",
    opts = {
      ensure_installed = {
        "lua-language-server",
        "pyright",
        "typescript-language-server",
        "gopls",
      },
    },
  },
}

return plugins
```

## 六、 常用 LSP (Language Server Protocol) 推薦清單

透過 Mason 安裝語言伺服器能賦予 Neovim 程式碼自動補全、語法檢查、定義跳轉（Go to Definition）與即時錯誤提示等 IDE 級功能。以下為各大主流程式語言最推薦安裝的 LSP 伺服器清單：

|**程式語言 / 技術**|**Mason 套件名稱 (Package Name)**|**核心功能與特色**|
|---|---|---|
|**Python**|`pyright` 或 `basedpyright`|微軟開發的強大型別檢查與自動補全 LSP，支援即時錯誤提示與程式碼導航。|
|**Lua**|`lua-language-server`|開發 Neovim 自訂設定與 Lua 腳本必備，對 Neovim 的 `vim` 全域變數支援極佳。|
|**TypeScript / JavaScript**|`typescript-language-server`|前端開發核心，提供 TS/JS 的型別推導、重構與自動補全。|
|**HTML / CSS / JSON**|`vscode-langservers-extracted`|網頁三寶的標準 LSP，提供精準的標籤與樣式提示。|
|**Go**|`gopls`|Go 語言官方維護的官方 LSP，效能極佳且功能最完整。|
|**Rust**|`rust-analyzer`|Rust 開發不可或缺的重度核心，提供強大的巨集展開與型別分析。|
|**Bash / Shell**|`bash-language-server`|針對 Shell Script 提供語法檢查與基本自動完成。|
|**C / C++**|`clangd`|基於 LLVM/Clang，提供極速且精準的 C/C++ 導航與補全（比 ccls 更受推薦）。|

### 快速一鍵安裝範例

若想在啟動時自動透過 Mason 安裝上述常用 LSP，可在 `~/.config/nvim/lua/custom/plugins.lua` 的 `ensure_installed` 陣列中直接加入：

```lua
ensure_installed = {
  "lua-language-server",
  "pyright",
  "typescript-language-server",
  "gopls",
  "clangd",
  "bash-language-server",
}
```

## 七、 常用 Formatter (程式碼格式化工具) 推薦

除了透過 LSP 處理語法檢查與跳轉外，Neovim 通常會搭配專門的 Formatter（格式化工具）來維持團隊或個人的程式碼排版風格一致性。透過 Mason 安裝並結合 `conform.nvim` 或 `null-ls` (none-ls) 進行掛載，即可實現存檔自動格式化。

|**程式語言 / 支援範圍**|**Mason 套件名稱 (Package Name)**|**核心功能與特色**|
|---|---|---|
|**Python**|`black` 或 `ruff`|`black` 是 Python 界標準的無腦排版工具；`ruff` 則是當前極速崛起、以 Rust 編寫的超高速 Lint 兼 Formatter 組合。|
|**JavaScript / TypeScript / JSON / HTML / CSS / Markdown**|`prettier`|前端開發全能型格式化工具，能完美掌控各類網頁與標記語言的縮排與換行。|
|**Lua**|`stylua`|專為 Lua 語言設計的強大格式化工具（Nvim/NvChad 內參設定極為常見）。|
|**Go**|`gofmt` 或 `goimports`|Go 語言官方標配的格式化工具（通常隨 `gopls` 或 Go SDK 本身內建，亦可透過 Mason 管理）。|
|**C / C++ / Java / Rust (等多語言)**|`clang-format`|基於 Clang 的強大格式化工兵，透過專案根目錄的 `.clang-format` 檔可嚴格控制排版規範。|
|**Shell Script**|`shfmt`|專門用來排版 Bash / Shell 腳本的標準縮排工具。|

### 整合至 Mason 自動安裝清單範例

同樣可以將常用的 Formatter 納入 `~/.config/nvim/lua/custom/plugins.lua` 的 `ensure_installed` 陣列中，確保每次全新部署時自動到位：

```lua
ensure_installed = {
  -- LSP
  "lua-language-server",
  "pyright",
  "typescript-language-server",
  "gopls",
  -- Formatter
  "prettier",
  "stylua",
  "black",
  "shfmt",
}
```