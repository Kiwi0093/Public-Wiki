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
  經歷過早期在單一主機塞入各種服務導致依賴打結、除錯火葬場的痛苦，全面導入 Container 容器化，並依照安全等級與使用需求對 Host 實施嚴格切割[cite: 1, 4]。
* **滿足松鼠癖**  
  我是個有松鼠症的人。沒有資金可以天天屯企業級硬體，那我就屯數位資料。所以整個架構可能不夠清爽、不夠斷捨離，但容量與資料分級絕對管夠。
* **滿足奇怪的虛榮心**  
  我知道市面上有很多開箱即用的套裝方案或商業軟體能輕鬆達成需求，但很遺憾我是活在 2000 年代的老人：**能用 FreeBSD 硬幹的我絕不去買現成 Router，能用 Linux 硬幹的我就不會去付費訂閱服務**。

---

## 2. 網路拓撲矩陣 (Topology Overview)

<div dangerouslySetInnerHTML={{ 
  __html: (() => { 
    return `
    <div id="ascii-e1iybux-wrapper">
      <style>
        @import url('https://googleapis.com');
        
        #ascii-e1iybux-wrapper pre {
          font-family: 'Sarasa Mono TC', 'Noto Sans Mono', monospace !important;
          font-variant-ligatures: none !important;
          white-space: pre !important;
          overflow-x: auto !important;
          padding: 16px;
          border-radius: 8px;
          line-height: 1.5;
          text-align: left;
          font-size: 14px;
          
          background-color: #f6f8fa !important;
          color: #24292e !important;
          border: 1px solid #e1e4e8;
        }

        html[data-theme='dark'] #ascii-e1iybux-wrapper pre {
          background-color: #1b1b1d !important;
          color: #e3e3e3 !important;
          border: 1px solid #2f2f31;
        }
      </style>

      <pre>
┌──────────────────────────────────────┐       ┌─────────────────────────────────────────┐
 │        OCI WireGuard Mesh            │       │           Client WireGuard VPN          │
 │    - 海外雲端運算實例 (大阪/東京)    │       │      - 外出工作筆電 / 行動終端          │
 │    - 私有微服務 API 互聯             │       │      - 唯一合法之外部遠端管理入口       │
 │    - 下載流量出站中繼出口            │       │                                         │
 └──────────────────────────────────────┘       └─────────────────────────────────────────┘
                 │                                           │
                 │ (加密隧道穿透網際網路)                    │ (加密隧道穿透網際網路)
                 ▼                                           ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                 電信端多組 Public IP 專線群 (Internet Edge)                            │
 └────────────────────────────────────────────────────────────────────────────────────────┘
                                       │ WAN 實體介面 (ext0)
                                       ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                       BSD-based Core Gateway (FreeBSD 14.x)                            │
 │      - 邊界過濾：Packet Filter (PF) 預設全阻斷 (Default Deny)                          │
 │      - 主動防禦：SSHGuard + CrowdSec 動態威脅情報黑名單                                │
 │      - 流量整形：Dummynet 7 級權重排程 (CoDel AQM 主動流控)                            │
 │          * Queue High : ACK 加速, DNS, 遠端管理 (SSH/RDP), VPN 隧道                    │
 │          * Queue Mid  : 內部維運, DHCP/PXE, 跨雲內部 API 互聯                          │
 │          * Queue User : 家用上網, 影音串流, 跨網段 mDNS/SSDP 中繼                      │
 │          * Queue Low  : 背景下載 (BT 流量壓制), 受限 IoT 設備                          │
 │      - 邊界收斂：公網僅開放必要反向代理與 VPN 端點，其餘遠端管理全面內網化             │
 │      - 出站分流：家庭、服務與隔離網段各自指派獨立 Public IP 實施 SNAT                  │
 └────────────────────────────────────────────────────────────────────────────────────────┘
     │ LAN_Family (int0)             │ LAN_Service (int1, 10GbE 骨幹)│ LAN_IoT (int2)
     │ 標準 MTU                      │ Jumbo Frame (MTU 9000)        │ 標準 MTU
     ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│       Family Zone       │     │    Core Service Zone    │     │   Isolated / IoT Zone   │
├─────────────────────────┤     ├─────────────────────────┤     ├─────────────────────────┤
│ [家用娛樂與終端]        │ L3  │ [虛擬化運算宿主機]      │ L3  │ [受限隔離網段]          │
│ - 客廳串流多媒體播放器  │ 單向│ - Node_Base             │ 完全│ - 訪客動態網段          │
│ - 家人日常手機 / 平板   │ 放行│   (基礎維運與日誌)      │ 隔離│   (純粹外網上網需求)    │
│ - 內網串流主機          ├────►│ - Node_Public           │◄─X─►│ - 智慧家電網段          │
│   (純 L2 極致超低延遲)  │     │   (Traefik/相簿/檔案庫) │     │   (掃地機、除濕機、家電)│
│                         │     │ - Node_Private          │     │                         │
│ [存取權限]              │     │   (影音串流/下載工具組) │     │ [存取規則]              │
│ - 允許單向連入 Service  │     │ - Node_Desktop (雙網卡) │     │ - 阻斷特定外部連線國家庫│
│ - 允許單向連向外網 VPN  │     │                         │     │ - 出站僅放行白名單埠口  │
│ - 預設受邊界狀態隔離    │     │ [冷熱分級儲存池 (NFS)]  │     │   (強制走公共安全 DNS)  │
│                         │     │ - Tier 1: 巨量影音媒體池│     │ - 嚴禁橫向刺探其他網段  │
│                         │     │   (ZFS 自癒與校驗防護)  │     │                         │
│                         │     │ - Tier 2: 資料庫與備份池│     │                         │
│                         │     │ - Tier 3: 下載快取中轉池│     │                         │
│                         │     │   (輕量檔案系統防磨損)  │     │                         │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
</pre>
    </div>
    `;
  })() 
}} />



