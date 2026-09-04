---
title: Docker 與 Docker Compose 完整架設
tags:
  - VM
  - Container
  - Docker
date: 2026-09-04
---

# Docker 與 Docker Compose 完整架設

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 各常見 Linux 發行版安裝 Docker Engine

### 1.1 VMware Photon OS

Photon OS 已在官方安裝庫中預載 Docker Engine：

```bash
# 啟動並設定開機自啟
systemctl enable --now docker

# 檢查狀態
systemctl status docker
```

### 1.2 Debian / Ubuntu

使用 Docker 官方 APT 倉庫安裝最新版本：

```bash
# 1. 更新套件清單並安裝基礎套件
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# 2. 加入 Docker 官方 GPG 金鑰
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release && echo "$ID")/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. 建立 APT 來源清單
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$(. /etc/os-release && echo "$ID") \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. 安裝 Engine 與 CLI 插件
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. 啟動並設定開機自啟
sudo systemctl enable --now docker
```

### 1.3 RHEL / Rocky Linux / AlmaLinux / CentOS

使用 DNF / YUM 設定官方鏡像源：

```bash
# 1. 安裝必要工具
sudo dnf install -y dnf-utils

# 2. 新增 Docker 官方 Repo
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 3. 安裝 Docker 套件
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. 啟動並啟用開機自啟
sudo systemctl enable --now docker
```

### 1.4 Alpine Linux

Alpine 採用 OpenRC 作為服務管理員，且預設在 Community 倉庫內提供套件：

```bash
# 1. 啟用 Community 倉庫（若未啟用，編輯 /etc/apk/repositories 移除 community 該行的註解）
# 2. 安裝 Docker
apk update
apk add docker

# 3. 加入開機預設 Runlevel 並啟動
rc-update add docker boot
service docker start
```

## 2. Docker Compose 安裝與部署方式

現代標準已全面棄用舊版 Python pip 安裝（`pip install docker-compose`），改採 **Docker Compose V2**（以 Go 編寫的 CLI 插件 `docker compose`），相容性佳且不干擾系統 Python 環境。

|**發行版**|**推薦安裝方式**|**指令**|
|---|---|---|
|**Photon OS**|官方套件庫原生安裝（V1/V2二進位）|`tdnf -y install docker-compose`|
|**Ubuntu / Debian**|APT 官方外掛（推薦）|`sudo apt-get install -y docker-compose-plugin`|
|**RHEL / Rocky Linux**|DNF 官方外掛（推薦）|`sudo dnf install -y docker-compose-plugin`|
|**Alpine Linux**|APK 套件庫（`docker-cli-compose`）|`apk add docker-cli-compose`|
|**通用手動安裝**|官方 GitHub Binary Standalone / Plugin|參考下方「通用手動部署」|

### 通用手動部署（適用於任何 x86_64 / aarch64 Linux）

當發行版套件庫版本落後或處於極簡系統時，直接下載二進位檔安裝至 CLI 插件路徑：

```bash
# 1. 建立 Docker CLI 外掛目錄
sudo mkdir -p /usr/libexec/docker/cli-plugins

# 2. 自動抓取最新版並下載（以 x86_64 為例，aarch64 請改為 aarch64）
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
sudo curl -SL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-$(uname -m)" -o /usr/libexec/docker/cli-plugins/docker-compose

# 3. 賦予可執行權限
sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose

# 4. （選用）建立全域符號連結供舊版指令相容
sudo ln -sf /usr/libexec/docker/cli-plugins/docker-compose /usr/local/bin/docker-compose

# 5. 驗證
docker compose version
```

## 3. 全域優化與權限設定

### 3.1 非 Root 使用者執行權限

避免日常操作均使用 root 身分：

```bash
# 將目標使用者加入 docker 群組
sudo usermod -aG docker $USER

# 套用群組權限（或重新登入 SSH）
newgrp docker
```

### 3.2 守護行程最佳化 (`/etc/docker/daemon.json`)

建立或覆蓋 `/etc/docker/daemon.json`，防止容器日誌撐爆硬碟空間並開啟守護行程無損重啟：

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 65535,
      "Soft": 65535
    }
  }
}
```

套用配置：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 3.3 核心網路轉發 (IP Forwarding)

若容器網路無法對外通訊或暴露埠口失敗，確認 IPv4 轉發已開啟：

```bash
# 檢查狀態（回傳 1 為正常）
sysctl net.ipv4.ip_forward

# 若為 0，寫入設定檔永久生效
echo "net.ipv4.ip_forward = 1" | sudo tee /etc/sysctl.d/99-docker-forward.conf
sudo sysctl -p /etc/sysctl.d/99-docker-forward.conf
```

## 4. 使用 Systemd 管理 Docker Compose 服務開機自啟

除了在 `compose.yaml` 中宣告 `restart: always` 或 `restart: unless-stopped` 外，生產環境中建議將整組 Compose 專案封裝為 **Systemd Unit**，便於納入作業系統標準監控、相依性排序與自動重啟機制。

### 步驟 1：建立專案目錄與 Compose 檔案

以 `/opt/apps/my-stack` 為例：

```bash
sudo mkdir -p /opt/apps/my-stack
cd /opt/apps/my-stack
```

建立 `docker-compose.yml`：

```yaml
services:
  app:
    image: nginx:alpine
    ports:
      - "8080:80"
```

### 步驟 2：建立 Systemd Service Unit

建立檔案 `/etc/systemd/system/docker-compose@.service`（使用實例化範本 `@`，可同時支援多個 Compose 專案）：

```toml
[Unit]
Description=Docker Compose Application Service (%i)
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/apps/%i

# 啟動前預拉取鏡像並啟動容器堆疊
ExecStartPre=-/usr/bin/docker compose pull
ExecStart=/usr/bin/docker compose up -d --remove-orphans

# 停止時優雅關閉所有容器
ExecStop=/usr/bin/docker compose down

# 重新載入設定
ExecReload=/usr/bin/docker compose pull
ExecReload=/usr/bin/docker compose up -d --remove-orphans

# 逾時時間設定
TimeoutStartSec=300
TimeoutStopSec=60

[Install]
WantedBy=multi-user.target
```

> **注意**：請以 `which docker` 確認路徑，若為 `/usr/local/bin/docker`，請調整 `Exec*` 路徑。

### 步驟 3：載入與啟用服務

範本單元會自動匹配目錄名稱。例如目錄為 `/opt/apps/my-stack`，則服務名稱即為 `docker-compose@my-stack`：

```bash
# 1. 重新載入 systemd 設定
sudo systemctl daemon-reload

# 2. 啟動服務並設定開機自啟
sudo systemctl enable --now docker-compose@my-stack

# 3. 檢查服務運行狀態
sudo systemctl status docker-compose@my-stack

# 4. 查看容器運作日誌
journalctl -u docker-compose@my-stack -f
```

## 5. 系統維護與磁碟空間管理速查

定期執行維護指令以回收未釋放的空間：

```bash
# 1. 檢視目前 Docker 空間佔用
docker system df

# 2. 清理所有已停止的容器、未使用的網路與懸掛映像檔（Dangling Images）
docker system prune -f

# 3. 深度清理：連同未被任何現存容器使用的映像檔一併刪除
docker system prune -a -f

# 4. 清理孤立資料卷（警告：具破壞性，可能刪除不再掛載的資料）
docker volume prune -f
```