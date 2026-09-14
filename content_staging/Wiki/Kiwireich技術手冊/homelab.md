---
slug: /homelab
title: "Homelab架構"
description: "需求與成本平衡的微型私有雲現狀，老派網工的折騰存檔"
---

# Homelab架構

這是我這些年來不斷改進自家 Homelab 的架構，算是目前需求、電費與硬體成本平衡下的現狀。放在這裡只是留個存檔供人參考，若有興趣搭建類似架構的朋友歡迎一起交流。

---

## 1. 架構核心原則 (Design Tenets)

* **最低實際花費成本**  
  考慮到預算與電費，不太可能真的弄一堆實體機來跑家庭服務。整套架構的實體底座基本上就是**一台 Tower Server + 一台實體老 NAS + 白嫖來的 OCI 免費雲端實例**。
* **盡量原子化功能**  
  經歷過早期在單一主機塞入各種服務導致依賴打結、除錯火葬場的痛苦，全面導入 Container 容器化，並依照安全等級與使用需求對 Host 實施嚴格切割。
* **滿足松鼠癖**  
  我是個有松鼠症的人。沒有資金可以天天屯企業級硬體，那我就屯數位資料。所以整個架構可能不夠清爽、不夠斷捨離，但容量與資料分級絕對管夠。
* **滿足奇怪的虛榮心**  
  我知道市面上有很多開箱即用的套裝方案或商業軟體能輕鬆達成需求，但很遺憾我是活在 2000 年代的老人：**能用 FreeBSD 硬幹的我絕不去買現成 Router，能用 Linux 硬幹的我就不會去付費訂閱服務**。

---

## 2. 網路拓撲矩陣 (Topology Overview)

```mermaid
flowchart TD
    classDef edgeBox fill:#2c3e50,stroke:#34495e,stroke-width:2px,color:#ecf0f1;
    classDef gwBox fill:#1a365d,stroke:#2b6cb0,stroke-width:2px,color:#ffffff;
    classDef zoneFamily fill:#276749,stroke:#2f855a,stroke-width:2px,color:#ffffff;
    classDef zoneService fill:#2b6cb0,stroke:#3182ce,stroke-width:2px,color:#ffffff;
    classDef zoneIoT fill:#744210,stroke:#975a16,stroke-width:2px,color:#ffffff;

    subgraph Remote_Layer [" 外部存取與雲端節點 (Remote & Cloud) "]
        WG_Mesh["<b>OCI WireGuard Mesh</b><br/>• 海外雲端運算實例 (大阪 / 東京)<br/>• 私有微服務 API 互聯<br/>• 下載流量出站中繼出口"]
        WG_Client["<b>Client WireGuard VPN</b><br/>• 外出工作筆電 / 行動端終端<br/>• 唯一合法之外部遠端管理入口"]
    end

    subgraph WAN_Layer [" 電信端邊界 (WAN) "]
        WAN_IP["<b>電信端多組 Public IP 專線群</b><br/>(Internet Edge)"]
    end

    subgraph Gateway_Layer [" 邊界閘道 (Core Gateway) "]
        Gateway["<b>BSD-based Core Gateway (FreeBSD 14.x)</b><br/>--------------------------------------------------<br/>• <b>狀態化過濾</b>：Packet Filter (PF) 預設全阻斷 (Default Deny)<br/>• <b>主動聯防</b>：SSHGuard + CrowdSec 動態黑名單<br/>• <b>佇列調度</b>：Dummynet 7 級權重排程 (CoDel AQM 主動流控)<br/>  - High: TCP ACK 加速、DNS、管理通道、VPN 隧道<br/>  - Mid: 內部維運、DHCP/PXE、跨雲內部 API<br/>  - User: 家用上網、影音串流、跨網段 mDNS 中繼<br/>  - Low: 背景下載 (BT 流量壓制)、受限 IoT 設備<br/>• <b>出站分流</b>：家庭 / 服務 / 隔離網段各自獨立 Public IP SNAT<br/>• <b>邊界收斂</b>：公網僅放行 Web 反代與 VPN 端點，其餘遠端管理全面內網化"]
    end

    subgraph Internal_Zones [" 內部獨立廣播域 (L3 Isolated Networks) "]
        subgraph Zone_Fam [" Family Zone (LAN_Family: int0, 標準 MTU) "]
            Fam_Content["<b>家用娛樂與終端設備</b><br/>• 客廳串流多媒體播放器<br/>• 家人日常手機 / 平板<br/>• 內網串流主機 (純 L2 極致低延遲)<br/>--------------------------------<br/><b>存取權限：</b><br/>• 允許單向連入 Service 網段<br/>• 允許單向存取外網 VPN 終端<br/>• 享有主動防護狀態回包"]
        end

        subgraph Zone_Ser [" Core Service Zone (LAN_Service: int1, 10GbE Jumbo Frame) "]
            Ser_VM["<b>虛擬化運算節點 (Type-1 Hypervisor)</b><br/>• Node_Base (基礎維運與日誌)<br/>• Node_Public (Traefik / 相簿 / 私有雲檔案庫)<br/>• Node_Private (影音串流 / 下載工具組)<br/>• Node_Desktop (雙網卡維運桌面)"]
            Ser_NAS["<b>冷熱分級儲存池矩陣 (NFS)</b><br/>• Tier 1: 巨量影音媒體庫 (ZFS 自癒與校驗防護)<br/>• Tier 2: 核心資料庫與備份槽<br/>• Tier 3: 下載快取中轉池 (輕量檔案系統防磨損)"]
            Ser_VM --- Ser_NAS
        end

        subgraph Zone_IoT [" Isolated / IoT Zone (LAN_IoT: int2, 標準 MTU) "]
            IoT_Content["<b>受限隔離網段</b><br/>• 訪客動態網段 (純粹上網需求)<br/>• 智慧家電受限網段 (掃地機、除濕機、洗衣家電)<br/>--------------------------------<br/><b>存取規則：</b><br/>• 阻斷特定外部連線國家庫<br/>• 出站僅放行白名單埠口 (強制走公共安全 DNS)<br/>• 嚴禁橫向刺探 Family / Service 網段"]
        end
    end

    WG_Mesh -- 加密隧道經網際網路穿透 --> WAN_IP
    WG_Client -- 加密隧道經網際網路穿透 --> WAN_IP
    WAN_IP -->|WAN 實體介面: ext0| Gateway

    Gateway -->|LAN_Family / int0| Zone_Fam
    Gateway -->|LAN_Service / int1| Zone_Ser
    Gateway -->|LAN_IoT / int2| Zone_IoT

    Zone_Fam ==>|L3 單向放行| Zone_Ser
    Zone_Fam -.->|L3 單向存取| WG_Client
    Zone_IoT x--x|L3 完全隔離| Zone_Fam
    Zone_IoT x--x|L3 完全隔離| Zone_Ser
    Zone_Ser x--x|嚴禁主動刺探| Zone_Fam

    class WG_Mesh,WG_Client,WAN_IP edgeBox;
    class Gateway gwBox;
    class Fam_Content zoneFamily;
    class Ser_VM,Ser_NAS zoneService;
    class IoT_Content zoneIoT;
```