---
title: 流程自動化引擎 - Node-Red
tags:
  - VM
  - Container
date: 2026-09-04
---
# 流程自動化引擎 - Node-Red

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

>:::tip
>本來我只是想弄個類似[IFTTT](https://ifttt.com/)的東西,結果一踏進去才發現這玩意根本不是那麼單純呀～～
>:::

<img src='https://img.shields.io/badge/Kiwi-%E6%88%91%E5%BC%84%E4%BA%86%E4%B8%80%E9%99%A3%E5%AD%90%E7%99%BC%E7%8F%BE%E6%90%9E%E4%B8%8D%E6%87%82%E4%B9%9F%E6%89%BE%E4%B8%8D%E5%88%B0%E5%AF%A6%E9%9A%9B%E7%9A%84%E6%87%89%E7%94%A8%E5%A0%B4%E6%99%AF-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

# 參考資料

[Node-Red Official web site](https://nodered.org/)

# 安裝

其實安裝這部份是最簡單的一部分了...

## docker-compose.yml

```bash
version: '3.3'
services:
  node-red:
    image: nodered/node-red
    container_name: node-red
#    ports:
#      - '1880:1880'
    environment:
      - TZ=Asia/Taipei
    volumes:
      - /var/lib/docker/volumes/node-red:/data
    restart: unless-stopped
    labels:
      traefik.enable: true
      traefik.http.routers.node-red.rule: Host(`<Domain>`)
      traefik.http.routers.node-red.tls: true
      traefik.http.routers.node-red.tls.certresolver: myresolver
      traefik.http.services.node-red.loadbalancer.server.port: 1880

networks:
  default:
    external: true
    name: traefik_backend
```

### 注意要點

* Volumes權限
   因為預設的UID權限是1000所以用root建立container後會因為寫入權限不能正常執行,解決方案是定義為root或是直接把目錄權限改了（我是改成777）
* Setting.js設定
   因為我是用traefik來處理SSL,所以只剩下登入權限的部份需要注意
   基本上登入設定開啟很容易
  
  ```bash
  adminAuth: {
   type: "credentials",
   users: [
       {
           username: "admin",
           password: "$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.",
           permissions: "*"
       },
       {
           username: "george",
           password: "$2b$08$wuAqPiKJlVN27eF5qJp.RuQYuy6ZYONW7a/UWYxDTtwKFCdB8F19y",
           permissions: "read"
       }
   ]
  }
  ```
  
  只要把username的部份改成你喜歡的ID
  然後透過
  `docker exec -it <NodeRed_container_name> bash`
  執行
  `node-red-admin hash-pw`
  它就會讓你輸入你想要的密碼後把hash檔弄出來,copy到上面的設定裡面去就好了

# 實際使用

因為這個玩意實在太博大精深了....
以後專門開個主題來寫好了..（這應該是個不會去填補的坑)



# 廢棄原因

* 沒想到用途

* 很困難,需要學習整套思維,沒有使用需求驅動根本不會想去學