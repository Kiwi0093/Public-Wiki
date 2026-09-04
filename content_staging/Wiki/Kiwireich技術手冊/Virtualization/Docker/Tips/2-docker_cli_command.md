---
title: Docker 核心 CLI 指令
date: 2026-09-04
tags:
  - VM
  - Container
  - Docker
---
# Docker 核心 CLI 指令

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

## 1. 容器生命週期管理 (Container Lifecycle)

### 1.1 建立與啟動

```bash
# 後台執行容器並指定名稱、連接埠映射、自動重啟與環境變數
docker run -d \
  --name web-app \
  -p 8080:80 \
  -e ENV=production \
  --restart unless-stopped \
  nginx:alpine

# 交互模式進入臨時容器（結束後自動銷毀）
docker run --rm -it alpine:latest sh

# 限制 CPU 與記憶體配額
docker run -d \
  --name limited-app \
  --memory="512m" \
  --cpus="1.5" \
  nginx:alpine
```

### 1.2 狀態控制與檢視

```bash
# 列出執行中的容器
docker ps

# 列出所有容器（含已停止或 Exited），並只顯示 ID 與名稱
docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"

# 啟動 / 停止 / 重啟容器
docker start <container_id_or_name>
docker stop <container_id_or_name>
docker restart <container_id_or_name>

# 強制終止容器（發送 SIGKILL）
docker kill <container_id_or_name>

# 暫停與恢復容器行程（凍結 cgroup）
docker pause <container_id_or_name>
docker unpause <container_id_or_name>

# 刪除已停止的容器
docker rm <container_id_or_name>

# 強制刪除執行中的容器（等同 kill + rm）
docker rm -f <container_id_or_name>
```

## 2. 容器除錯、進程與檔案互動 (Debug & Operations)

### 2.1 進入容器與日誌檢視

```bash
# 進入運行中容器的 Shell（最常用）
docker exec -it <container_name> /bin/sh
# 若有安裝 bash
docker exec -it <container_name> /bin/bash

# 以 root 身分在容器內執行特定單行指令
docker exec -u 0 -it <container_name> whoami

# 即時追蹤日誌（Tail -f），並限制顯示行數與時間戳記
docker logs -f --tail 100 -t <container_name>

# 檢視自某時間點以來的日誌
docker logs --since "2026-09-01T00:00:00" <container_name>
```

### 2.2 動態資源監控與行程檢視

```bash
# 即時查看容器資源使用率（CPU, Memory, Network I/O, Block I/O）
docker stats

# 格式化輸出非串流的資源佔用快照
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# 查看容器內部的 Process 列表（在 Host 角度看容器內的 PID）
docker top <container_name>
```

### 2.3 檔案拷貝與底層檢查

```bash
# 將本機檔案複製到容器內
docker cp /path/to/local/file.conf <container_name>:/etc/app/file.conf

# 將容器內檔案複製至本機
docker cp <container_name>:/var/log/app.log ./app.log

# 檢視容器內部檔案系統相較於 Image 的異動紀錄 (A: Added, C: Changed, D: Deleted)
docker diff <container_name>

# 檢視容器完整底層 JSON 屬性（IP、Mounts、Env、Config 等）
docker inspect <container_name>

# 使用 jq 或 Go template 快速擷取容器 IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name>
```

## 3. 映像檔管理 (Images)

```bash
# 搜尋 Docker Hub 上的映像檔
docker search nginx

# 拉取指定版本的映像檔
docker pull ubuntu:24.04

# 檢視本機現有的映像檔列表
docker images

# 依映像檔大小排序顯示
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | sort -k 3 -h

# 建置映像檔（指定 Dockerfile 與 tag）
docker build -t my-app:v1.0 .

# 免快取強制重新建置
docker build --no-cache -t my-app:v1.0 .

# 為映像檔打上新標籤（用於 Push 至 Private Registry）
docker tag my-app:v1.0 registry.example.com/proj/my-app:v1.0

# 推送至 Registry
docker push registry.example.com/proj/my-app:v1.0

# 檢視映像檔分層結構與建置歷史（排查映像檔過大成因）
docker history --no-trunc my-app:v1.0

# 匯出與匯入映像檔（離線環境部署）
docker save -o my-app.tar my-app:v1.0
docker load -i my-app.tar

# 刪除指定映像檔
docker rmi <image_id_or_name>

# 強制刪除映像檔（即使被已停止容器引用）
docker rmi -f <image_id_or_name>
```

## 4. 資料卷與持久化儲存 (Volumes)

```bash
# 建立具名資料卷
docker volume create my-data-vol

# 列出所有資料卷
docker volume ls

# 列出所有未被任何容器使用的孤立資料卷（Dangling Volumes）
docker volume ls -f dangling=true

# 檢視資料卷的實際 Host 掛載路徑（Mountpoint）
docker volume inspect my-data-vol

# 刪除特定資料卷（必須在無容器使用狀態下）
docker volume rm my-data-vol

# 清除所有未使用的資料卷
docker volume prune -f
```

## 5. 虛擬網路管理 (Networks)

```bash
# 列出本機所有網路驅動與網路清單
docker network ls

# 建立自定義 Bridge 網路（支援容器間直接以「服務名稱 / 容器名稱」作 DNS 解析）
docker network create --driver bridge my-isolated-net

# 建立指定子網段的自定義網路
docker network create --subnet 172.28.0.0/16 my-custom-net

# 檢視網路配置與目前連線到該網路的容器名單與 IP
docker network inspect my-isolated-net

# 將運作中的容器動態接入某網路
docker network connect my-isolated-net <container_name>

# 將容器自某網路斷開
docker network disconnect my-isolated-net <container_name>

# 刪除未使用網路
docker network rm my-isolated-net
docker network prune -f
```

## 6. 現代 Docker Compose (V2) 核心指令

Compose V2 使用 Go 語言直接整合進 Docker CLI，指令以空白分隔的 `docker compose` 為主：

```bash
# 啟動並於後台運行（自動建立網路與 Volume）
docker compose up -d

# 強制重新建立容器（配置或 daemon.json 變動後套用）
docker compose up -d --force-recreate

# 建置並啟動服務
docker compose up -d --build

# 停止並移除 Compose 專案容器與自建網路
docker compose down

# 停止並「連同 Volume 資料卷」一併移除（破壞性操作，需謹慎）
docker compose down -v

# 停止並移除所有映像檔（--rmi all 或 local）
docker compose down --rmi local

# 即時追蹤專案中所有容器日誌
docker compose logs -f

# 僅追蹤特定服務日誌
docker compose logs -f <service_name>

# 檢視專案容器運行狀態與 Port 映射
docker compose ps

# 重啟指定單一服務
docker compose restart <service_name>

# 臨時針對某服務執行單次指令（不對外暴露 Port）
docker compose run --rm <service_name> sh
```

## 7. 系統維護與全域排查 (System)

```bash
# 檢視 Docker 引擎版本與詳細架構（Kernel、Storage Driver、OS 等）
docker version
docker info

# 即時監聽 Docker 守護行程發生的事件（容器啟動、終止、OOM 等）
docker events

# 查看各類型資源佔用比例
docker system df

# 檢視磁碟詳細佔用清單
docker system df -v

# 一鍵清理：已停止容器 + 未使用網路 + 懸掛映像檔 (<none>)
docker system prune -f

# 深度清理：包含所有「未被任何容器使用」的映像檔與 Build Cache
docker system prune -a -f
```