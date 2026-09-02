---
title: Node.js 現代套件與環境管理實用筆記
date: 2026-09-02
tags:
  - Linux
  - Nodejs
---
# Node.js 現代套件與環境管理實用筆記

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

<img src='https://img.shields.io/badge/Kiwi-%E4%BB%A5%E5%89%8D%E7%94%A8Hexo%E6%88%96%E6%98%AFHugo%E7%9A%84%E6%99%82%E5%80%99%E5%B9%BE%E4%B9%8E%E9%83%BD%E8%A6%81%E7%94%A8npm%E7%9A%84%E6%8C%87%E4%BB%A4-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

## 一、 起手式：絕對不要用系統原生指令安裝 Node.js

在 Linux (apt/dnf) 或 macOS 裡，最忌諱的就是直接下 `sudo apt install nodejs` 或 `sudo npm install -g xxx`。這會導致兩個嚴重後果：

1. **版本老舊：** 系統庫的 Node.js 通常落後好幾個大版本。
2. **權限地獄：** 全域安裝套件時會一直遇到 `EACCES` 權限報錯，逼得你用 `sudo` 去跑 npm，這在資安與環境整潔上是大忌。

**現代標準做法：使用版本管理器 (Version Manager)**

- **經典首選：NVM (Node Version Manager)** 老牌且最普及。安裝方式：
    
     
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```
    
    常用指令：
    
    
   ```bash
   nvm install 20       # 安裝 Node.js v20 (LTS)
   nvm use 20           # 切換到 v20
   nvm alias default 20 # 設定預設版本
   nvm ls-remote        # 查看所有可安裝的版本
   ```
    
- **極速新星：fnm (Fast Node Manager) 🌟** 由 Rust 編寫，速度比 nvm 快上數十倍，不會拖慢終端機啟動時間，且原生支援跨平台。非常推薦新機器改用這個：
    
    
   ```bash
   # 透過腳本安裝
   curl -fsSL https://fnm.vercel.app/install | bash
   
   # 常用指令幾乎跟 nvm 一樣
   fnm install 20
   fnm default 20
   ```
    

## 二、 現代套件管理器三國鼎立：npm / yarn / pnpm

有了 Node.js 後，你會面臨套件管理器的選擇：

1. **npm (Node Package Manager)：** 內建預設，中規中矩。
2. **Yarn：** Facebook 開發，曾因速度快、有 lockfile 而稱霸，但目前 v1 與 v2+ 世代交替有些混亂。
3. **pnpm (Performant npm)：🌟 現代強烈推薦！** 它利用「Hard link (硬連結)」機制，同樣的套件在全機硬碟只會存一份。如果你的電腦有 10 個專案都用到 React，npm 會複製 10 份，而 pnpm 只存 1 份並連結過去。**極度節省硬碟空間且安裝速度飛快。**

**啟用/安裝 pnpm：** 在較新的 Node.js 版本中，預設內建了 `corepack` 來管理這些工具：

```bash
# 啟用 corepack 並準備好 pnpm
corepack enable pnpm
```

_(註：以下基礎指令會以業界最通用的 `npm` 為主，但參數邏輯多半與 `pnpm` 通用)_

## 三、 基礎維護：專案內的套件管理

在 Node.js 中，套件通常跟著專案資料夾走，設定檔是 `package.json`。

**1. 初始化與安裝**

```bash
# 初始化一個新的專案 (產生 package.json)
npm init -y

# 根據 package.json 批次安裝所有依賴
npm install
# (pnpm 則直接下 pnpm install 或 pnpm i)

# 安裝特定套件並寫入 dependencies (正式環境需要)
npm install axios

# 安裝套件並寫入 devDependencies (僅開發環境需要，如 eslint, typescript)
npm install -D typescript
```

**2. 移除與更新**

```bash
# 移除套件並自動更新 package.json
npm uninstall axios

# 檢查目前專案有哪些套件過期了
npm outdated

# 將套件升級到 package.json 允許的最新小版本
npm update
```

## 四、 避免全域污染的神器：npx

過去我們常為了用某個命令列工具（例如 Vue CLI、Create React App、TypeScript 編譯器），而把它裝在全域： `npm install -g create-react-app` _(不推薦)_

現在的標準做法是使用 **`npx` (Node Package Execute)**。它可以「免安裝」直接從雲端抓取並執行最新的 CLI 工具，用完即丟，不留痕跡：

```bash
# 臨時下載並執行最新版的 create-react-app，用完即清理
npx create-react-app my-project

# 如果你專案內部已經安裝了 typescript (本地套件)，用 npx 可以直接呼叫它
npx tsc --init
```

## 五、 空間清理：拯救被塞爆的硬碟

惡名昭彰的 `node_modules` 是硬碟殺手，久了會吃掉幾十上百 GB。

**1. 清理 npm 全域快取** 每次下載的壓縮包都會留在快取裡，有時遇到套件損壞（如 `npm ERR! cb() never called`）也可以靠這招解決：

```bash
npm cache clean --force
```

**2. 一鍵清除所有專案的 node_modules (硬碟拯救者)** 如果你有一堆陳年專案，可以用第三方開源工具 `npkill`。它會用超快速的文字圖形介面，幫你找出整台電腦裡所有的 `node_modules` 讓你按空白鍵殺掉。

```bash
# 用 npx 隨載隨跑，不污染環境
npx npkill
```

## 六、 進階：Docker 與 CI/CD 最佳實踐 (`npm ci`)

當你在撰寫 Dockerfile 或是設定 GitLab CI / GitHub Actions 自動化佈署時，**絕對不要使用 `npm install`**。

在生產環境中，你必須保證裝起來的版本跟開發時「一模一樣」。`npm install` 有時會聰明作祟，偷偷幫你把次要版本升級。

**生產環境唯一指定指令：**

```bash
npm ci
```

**`npm ci` (Clean Install) 的特性：**

1. 嚴格讀取 `package-lock.json` 的鎖定版本，保證 100% 一致。
2. 執行前會強制**先刪除**現有的 `node_modules`，保證環境乾淨。
3. 如果 `package.json` 跟 lock 檔對不上，它會直接報錯終止，而不是偷偷修改 lock 檔。
4. 安裝速度通常比 `npm install` 快兩倍以上。

**Dockerfile 範例：**

```Dockerfile
COPY package*.json ./
# 生產環境強烈建議使用 npm ci
RUN npm ci --only=production
COPY . .
```