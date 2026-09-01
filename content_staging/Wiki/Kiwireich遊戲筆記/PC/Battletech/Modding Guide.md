---
title: Modding 總綱與流程
date: 2021-5-19
tags:
  - Game
  - PC-Game
  - SLG
slug: Game/PC/Battletech/guide
---
:::tip
這個遊戲的Mod在[Nexus mods](https://www.nexusmods.com/battletech)裡面就有
:::

<img src='https://img.shields.io/badge/Kiwi-%E9%80%99%E5%80%8B%E5%85%B6%E5%AF%A6%E5%B0%B1%E6%98%AFArmor%20Core%2FFront%20Mission%E9%80%99%E7%A8%AE%E9%81%8A%E6%88%B2%E7%9A%84%E5%89%8D%E8%BA%AB%E5%90%A7%EF%BC%9F-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

## 核心概念

BattleTech 的裝備與武器系統完全由 JSON 檔案驅動。每一個武器、彈藥箱、裝備，甚至子彈本體，都有獨立的 JSON 定義檔。修改的核心原則在於**確保 ID 唯一性**與**邏輯關聯正確**。

## 修改與套用流程 (SOP)

### 1. 檔案準備與編輯

- **必備工具**：使用 Notepad++ 或其他純文字編輯器處理 JSON 檔案，確保格式正確無亂碼。
- **複製與命名**：直接複製原廠檔案（例如 `Weapon_Autocannon_UAC20.json`）進行修改。**檔名絕對不能重複**，建議加上自訂後綴（例如 `_VerK`）。
- **ID 一致性**：JSON 檔案內的 `"Id"` 參數**必須**與修改後的新檔名完全一致，否則遊戲啟動時會產生讀取錯誤。
    

### 2. 實裝至遊戲的方法

- **商店生成法（常規）**：修改 `Description` 中的 `"Cost"`, `"Rarity"`（建議設低一點方便測試）與 `"Purchasable"` (設為 `true`)，並在 `"ComponentTags"` 中移除 `"BLACKLISTED"` 標籤，讓裝備能在遊戲內的星系商店中隨機刷出。
- **Save Editor 法（快速測試）**：利用社群提供的 [BattleTech Save Editor]，直接將新建的裝備 ID 寫入現有的 Save 存檔庫存中，啟動遊戲即可立即安裝測試。