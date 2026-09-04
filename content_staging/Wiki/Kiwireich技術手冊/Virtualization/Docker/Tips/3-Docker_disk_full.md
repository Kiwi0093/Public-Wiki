---
title: Docker 磁碟空間暴增排除
tags:
  - VM
  - Container
  - Docker
date: 2026-09-04
---
# Docker 磁碟空間暴增排除

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 空間定位：到底是什麼吃光了硬碟？

當系統告警或磁碟滿載時，切忌盲目清空，先定位空間分佈。

### 1.1 Docker 原生空間分析

使用 Docker 內建分析工具，快速鎖定是 Images、Containers、Local Volumes 還是 Build Cache 佔據空間：

```bash
# 檢視 Docker 總體資源佔用摘要
docker system df

# 檢視各項目詳細佔用明細（含容器 ID、映像檔大小與資料卷共享資訊）
docker system df -v
```

### 1.2 Linux 系統層級排查（揪出暗藏的肥大檔案）

Docker 預設儲存路徑為 `/var/lib/docker`。若 `docker system df` 顯示異常但抓不出兇手，通常是累積在 `/var/lib/docker/containers/` 底下的標準輸出日誌（`*-json.log`）。

```bash
# 找出 /var/lib/docker 目錄下前 20 大的檔案或目錄（避免跨檔案系統掃描）
du -ahx /var/lib/docker | sort -rh | head -n 20

# 專門檢查所有容器的 JSON Log 大小並依容量排序（由大到小）
find /var/lib/docker/containers/ -name "*-json.log" -exec du -h {} + | sort -rh | head -n 20
```

## 2. 緊急處置：Log 檔案暴漲急救（線上清空）

當發現某個容器的日誌高達數十 GB 時，**絕對不可直接使用 `rm -f <container_id>-json.log` 刪除**！

> **為什麼不能用 `rm`？** Linux 核心中，只要 Docker 守護行程（dockerd）仍開啟該檔案的 File Descriptor（FD），即使檔案指標被移除，Inode 依然處於 `(deleted)` 狀態，**磁碟空間不會釋放**，直到 Docker 服務重啟。

### 正確清空方式：`truncate`

使用 `truncate` 命令將檔案長度縮減為 0，能保留 File Descriptor 同時立即返還磁碟空間：

```bash
# 語法：
# truncate -s 0 /var/lib/docker/containers/<CONTAINER_ID>/<CONTAINER_ID>-json.log

# 範例：單一容器 log 清空
truncate -s 0 /var/lib/docker/containers/a1b2c3d4e5f6.../a1b2c3d4e5f6...-json.log

# 萬用急救指令：一鍵將主機上所有大於 100M 的 Docker json-log 歸零
find /var/lib/docker/containers/ -name "*-json.log" -size +100M -exec truncate -s 0 {} \;
```

## 3. 根治方案：限制日誌上限與自動輪替 (Log Rotation)

清空只是救急，若不設定 Log Rotation，日誌遲早會再次撐爆硬碟。限制方式分為「全域預設」與「單一專案/容器自訂」。

### 方案 A：全域設定 (`/etc/docker/daemon.json`) —— 強烈推薦

設定後，後續所有新建的容器都會繼承此上限規則。

1. 編輯 `/etc/docker/daemon.json`：
    

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```

- `max-size`: 單一日誌檔達到此大小即觸發輪替（如 `50m` 或 `100m`）。
    
- `max-file`: 保留的滾動備份檔上限。超過此數量時會自動覆蓋最舊的檔案。此例最多佔用 `50m * 3 = 150m`。
    

2. 重載設定並重啟 Docker 服務：
    

```bash
systemctl daemon-reload
systemctl restart docker
```

> **重要陷阱提醒**： 修改 `daemon.json` **僅對重啟後「新建立」的容器生效**。已存在的容器必須重新建立才會套用：
> 
> 
 ```bash
> # 傳統 run 的容器：
> docker stop <name> && docker rm <name> && docker run ...
> 
> # Docker Compose 管理的容器：
> docker compose down && docker compose up -d --force-recreate
 ```

### 方案 B：Compose 專案單獨設定 (`compose.yaml`)

若某些應用（如高流量 Nginx、資料庫同步服務）需要個別指定日誌配額，可在服務層級宣告：

```yaml
services:
  app-service:
    image: my-app:latest
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

套用變更：

```bash
docker compose up -d --force-recreate
```

## 4. 空間回收指令大全 (Prune 系列)

在清理前，務必釐清各層級清理指令的影響範圍，避免誤刪正式環境資料。

### 4.1 容器與映像檔安全清理

```bash
# 1. 安全清理（日常使用）
# 刪除：所有已停止的容器、未使用的網路、懸掛映像檔（dangling: 沒有 tag 的 <none> 映像檔）
docker system prune -f

# 2. 深度清理（釋放大量空間）
# 刪除：所有已停止的容器、未使用的網路，以及「所有沒有正在被任何容器引用的映像檔」
# 注意：重開應用時會需要重新 pull 映像檔
docker system prune -a -f

# 3. 清理建置暫存（Build Cache）
# Dockerfile build 過程留下來的快取，常年累積常佔用數十 GB
docker builder prune -a -f
```

### 4.2 資料卷清理（最危險，需極度謹慎）

預設情況下，`docker system prune` **不會** 主動刪除 Volume，因為 Volume 通常存放資料庫或持久化數據。

```bash
# 列出孤立的 Volume（沒有任何容器掛載中的 volume）
docker volume ls -f dangling=true

# 清除所有孤立 Volume（警告：若有停止維護但日後要用的資料庫容器，其資料會永久遺失！）
docker volume prune -f

# 終極清理（包含未掛載 Volume 一網打盡，非重置環境請勿輕易使用）
docker system prune -a --volumes -f
```

## 5. 自動化防爆機制：Linux Logrotate 系統備援

若環境中有 legacy 容器無法輕易重構套用 `max-size`，可透過主機系統的 `logrotate` 建立排程備援。

建立 `/etc/logrotate.d/docker-containers`：

```bash
/var/lib/docker/containers/*/*.log {
    rotate 3
    daily
    copytruncate
    compress
    missingok
    notifempty
    maxsize 100M
}
```

- **`copytruncate`**：非常關鍵。它會先複製出日誌檔再將原檔截斷歸零，不會中斷 Docker 的 File Descriptor，等同自動化執行 `truncate`。
    

測試配置是否正確（不實際變更）：

```bash
logrotate -d /etc/logrotate.d/docker-containers
```

## 6. 維護速查邏輯流程

```bash
磁碟空間告警 (100% Full)
  │
  ├─ 1. docker system df (確認是 Images/Build Cache 還是 Container Log)
  │     └─ 若是 Build Cache ──> docker builder prune -f
  │     └─ 若是 Dangling Images ──> docker image prune -f
  │
  ├─ 2. 若是 Logs 肥大 (du -ahx /var/lib/docker | grep -i json.log)
  │     └─ 立即救急 ──> truncate -s 0 <path_to_log>
  │     └─ 永久修復 ──> 配置 /etc/docker/daemon.json (max-size/max-file)
  │                     └─ 重建容器生效 (docker compose down && up -d)
  │
  └─ 3. 定期維護 ──> 建立 cron 排程執行 docker system prune -f
```