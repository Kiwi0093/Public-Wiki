---
title: Traefik 反向代理與自動 SSL 部署 (v3 版)
tags:
  - VM
  - Container
date: 2026-09-04
---
# Traefik 反向代理與自動 SSL 部署 (v3 版)

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 核心觀念與架構解析

Traefik 的資料流與配置邏輯由三大核心抽象組成：

```bash
[外部請求 (Client)]
        │ (Port 80 / 443)
        ▼
   [EntryPoints]   ─── (web / websecure: 定義監聽的通訊協定與埠口)
        │
        ▼
    [Routers]      ─── (根據 Rule 如 Host(`app.example.com`) 解析請求)
        │
        ├─► [Middlewares] ─── (中介處理：如 HTTP轉HTTPS、Basic Auth、Rate Limit)
        │
        ▼
   [Services]      ─── (轉發至對應的容器 IP 與內部 Port)
        │
        ▼
 [後端容器 (Backend App)]
```

- **靜態配置 (Static Configuration)**：定義全域基礎設施（EntryPoints、Providers、憑證解析器 ACME）。在啟動時載入，支援 CLI 參數（`command:`）或靜態設定檔（`traefik.yml`）。
    
- **動態配置 (Dynamic Configuration)**：定義路由規則（Routers、Services、Middlewares），由 Provider（此處為 Docker Labels）動態注入，容器重啟或異動時無須重啟 Traefik 本體。
    
- **SSL 憑證保存 (`acme.json`)**：Traefik 整合 ACME 客戶端，所有由 Let's Encrypt 簽發的私鑰與憑證均存放在單一 JSON 檔案中。**該檔案權限嚴格限制為 `600`**，否則 Traefik 會出於安全考量直接拒絕載入。
    

## 2. Traefik v3 核心配置 (Docker Compose)

相較於舊版 v2.5，**Traefik v3** 帶來了多項現代化與簡化改進：

1. **EntryPoints 原生支援 HTTP 轉 HTTPS**：不再需要在 Routers 宣告繁瑣的 `hostregexp` catch-all 與 RedirectScheme middleware，直接在 EntryPoint 啟用 `redirections` 即可全域生效。
    
2. **ACME 挑戰方式互斥**：不可同時開啟 `httpChallenge` 與 `tlsChallenge`，選用其中一種即可（一般推薦 `tlsChallenge`，走 443 埠口最簡潔）。
    
3. **安全強化**：Dashboard 預設必須以明確的中介軟體驗證（如 BasicAuth）防護，不允許未保護直接暴露。
    

### 步驟 1：建立專屬網路與掛載目錄

為避免各專案容器與 Traefik 網路互相干擾，建立一個全域共享的 Docker Bridge 網路：

```bash
# 建立 Traefik 專屬共用外部網路
docker network create proxy-network

# 建立放憑證的目錄並初始化 acme.json 權限（務必 600）
mkdir -p /opt/traefik/letsencrypt
touch /opt/traefik/letsencrypt/acme.json
chmod 600 /opt/traefik/letsencrypt/acme.json

# 建立 BasicAuth 帳號密碼（以 admin / secret123 為例，需安裝 apache2-utils 或使用 openssl/htpasswd）
# 格式為: username:hashed_password（注意：YAML 中 $ 必須寫成 $$ 避免轉義）
echo $(htpasswd -nb admin secret123)
# 輸出範例：admin:$apr1$xyz123... -> 寫進 label 時需轉換為 admin:$$apr1$$xyz123...
```

### 步驟 2：Traefik 本體 `docker-compose.yml` (v3 配置)

在 `/opt/traefik/docker-compose.yml` 中配置：

```yaml
services:
  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    networks:
      - proxy-network
    ports:
      - "80:80"
      - "443:443"
      # 若要直通查看 debug/dashboard 可開 8080，生產環境建議透過內部 Router 存取並關閉 8080 Mapping
      # - "8080:8080"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /opt/traefik/letsencrypt/acme.json:/letsencrypt/acme.json
    command:
      #### 1. API 與儀表板 (Dashboard) ####
      - --api.dashboard=true
      - --api.insecure=false

      #### 2. Log 與除錯記錄 ####
      - --log.level=INFO
      - --accesslog=true

      #### 3. Docker Provider 設定 ####
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false # 預設不暴露，必須主動加 label 才代理
      - --providers.docker.network=proxy-network # 明確指定預設通訊網路

      #### 4. EntryPoints (通訊埠口定義) ####
      # HTTP (Port 80) - v3 原生內建全域重定向至 HTTPS
      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --entrypoints.web.http.redirections.entrypoint.permanent=true

      # HTTPS (Port 443)
      - --entrypoints.websecure.address=:443

      #### 5. 憑證解析器 (Let's Encrypt ACME) ####
      # 使用 TLS-ALPN-01 挑戰（直接在 443 埠口驗證，無須額外開放檔案目錄）
      - --certificatesresolvers.myresolver.acme.tlschallenge=true
      - --certificatesresolvers.myresolver.acme.email=your-email@example.com
      - --certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json
    labels:
      - "traefik.enable=true"

      # --- Dashboard 路由設定 (HTTPS) ---
      - "traefik.http.routers.traefik-dashboard.rule=Host(`traefik.example.com`)"
      - "traefik.http.routers.traefik-dashboard.entrypoints=websecure"
      - "traefik.http.routers.traefik-dashboard.service=api@internal"
      - "traefik.http.routers.traefik-dashboard.tls=true"
      - "traefik.http.routers.traefik-dashboard.tls.certresolver=myresolver"

      # --- Dashboard 安全防護 (BasicAuth 中介軟體) ---
      - "traefik.http.routers.traefik-dashboard.middlewares=auth"
      # 注意：密碼字串中的 $ 符號在 compose 中需用 $$ 跳脫
      - "traefik.http.middlewares.auth.basicauth.users=admin:$$apr1$$xyz123...YourHash..."

networks:
  proxy-network:
    external: true
```

## 3. 被代理服務 (Upstream Container) 的配置規範

當部署任何 Web 服務時，**不需要宣告 `ports` 暴露給 Host**，僅需滿足兩個條件：

1. 加入共用的外部網路 `proxy-network`。
    
2. 標註 `labels`，告訴 Traefik 該服務的網域名稱與目標 Port。
    

### 語法結構邏輯

Traefik Labels 的階層規則遵循：

```
traefik.<協定>.<元件類型>.<自定義識別名>.<具體參數>=<值>
```

### 範例：部署 Whoami 測試服務與獨立應用 (如 V2ray / Web App)

```yaml
services:
  whoami:
    image: traefik/whoami
    container_name: test-whoami
    restart: unless-stopped
    networks:
      - proxy-network
    # 不需寫 ports: ["80:80"]，容器完全處於內部網路，提升主機安全性
    labels:
      # 1. 啟用 Traefik 感知
      - "traefik.enable=true"

      # 2. 定義 HTTPS Router 規則
      - "traefik.http.routers.whoami.rule=Host(`whoami.example.com`)"
      - "traefik.http.routers.whoami.entrypoints=websecure"

      # 3. 啟用 TLS 自動憑證申請
      - "traefik.http.routers.whoami.tls=true"
      - "traefik.http.routers.whoami.tls.certresolver=myresolver"

      # 4. 指定內部轉發 Port（若映像檔有 EXPOSE 多個 Port，或使用客製化 Port 時必填）
      - "traefik.http.services.whoami.loadbalancer.server.port=80"

networks:
  proxy-network:
    external: true
```

## 4. 常見實用 Middlewares (中介軟體) 配置範例

在 Docker Labels 中，可以在應用前掛載各種安全與過濾中介：

### 4.1 安全標頭 (Security Headers / HSTS)

```yaml
labels:
  - "traefik.http.middlewares.sec-headers.headers.sslredirect=true"
  - "traefik.http.middlewares.sec-headers.headers.stsseconds=31536000"
  - "traefik.http.middlewares.sec-headers.headers.browserxssfilter=true"
  - "traefik.http.middlewares.sec-headers.headers.contenttypenosniff=true"
  - "traefik.http.routers.myapp.middlewares=sec-headers"
```

### 4.2 速率限制 (Rate Limit)

防止 API 或登入端點遭到暴力破解：

```yaml
labels:
  # 平均每秒 100 個請求，最大突發 50 個
  - "traefik.http.middlewares.my-ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.my-ratelimit.ratelimit.burst=50"
  - "traefik.http.routers.myapp.middlewares=my-ratelimit"
```

### 4.3 移除路徑前綴 (StripPrefix)

將 `[example.com/api/](https://example.com/api/)*` 轉發給容器時自動把 `/api` 剔除：

```yaml
labels:
  - "traefik.http.routers.myapi.rule=Host(`example.com`) && PathPrefix(`/api`)"
  - "traefik.http.middlewares.api-strip.stripprefix.prefixes=/api"
  - "traefik.http.routers.myapi.middlewares=api-strip"
```

## 5. 重要架構原則與除錯排查

### 5.1 SSL 卸載 (SSL Offloading)

- 後端容器（如 Nextcloud、WordPress、V2ray 等）**內部請直接執行 HTTP**，嚴禁在容器內自簽憑證或跑 HTTPS。
    
- 所有憑證加解密一律在 Traefik 邊界完成（SSL Offloading），容器與 Traefik 之間透過內部 Docker 網路走純 HTTP 通訊，大幅降低運算開銷並避免證書衝突。
    

### 5.2 憑證申請失敗排查重點

| **常見錯誤現象**                                                         | **根本原因**                     | **排除處置**                                                                                                           |
| ------------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `permissions of /letsencrypt/acme.json are too open`               | 檔案權限不是 600                   | 執行 `chmod 600 /opt/traefik/letsencrypt/acme.json` 並重啟 Traefik。                                                     |
| `Cannot obtain certificates: 403 / 400 urn:ietf:params:acme:error` | 外部 Port 80/443 未打通或 DNS 尚未生效 | 確認外部防火牆/路由器有將 80/443 對齊主機，且 Public DNS A 紀錄已完全指向本機公網 IP。                                                           |
| `Bad Gateway (502)`                                                | Traefik 無法連通後端容器             | 1. 檢查後端容器是否有加入 `proxy-network`。<br><br>  <br><br>2. 檢查 `loadbalancer.server.port` 指定的 Port 是否與容器內部 Listen Port 一致。 |
| 容器有多個 Port 時轉發混亂                                                   | 映像檔定義了多個 EXPOSE 埠            | 必須透過 `traefik.http.services.<name>.loadbalancer.server.port=<port>` 明確鎖定。                                          |