---
slug: Game/PC/Battletech/status
title: 狀態效果與Buff設定
date: 2026-09-01
tags:
  - Game
  - PC-Game
  - SLG
---
> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

:::tip
在 BattleTech 中，`statusEffects` 是一個非常深度的系統。它不僅能做「被動裝備增益（Passive）」，還能做「擊中時觸發的負面效果（OnHit）」。每一個狀態效果都由四個主要的 JSON 區塊組成。
:::
## 1. 觸發與目標設定 (Duration & Targeting)

這兩個區塊決定了「效果持續多久」以及「作用在誰身上」。

| **參數名稱 (Key)**                    | **設定影響與說明**                                                                              |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `durationData.duration`           | **持續回合數**：設為 `-1` 代表永久生效（只要裝備還在）。若設為正整數（如 `2`），則代表效果持續 2 回合（通常用於擊中敵方時附加的 Debuff）。        |
| `targetingData.effectTriggerType` | **觸發時機**：<br />• `Passive`：被動常駐，只要裝備著就生效。<br />• `OnHit`：當武器擊中目標時觸發。                         |
| `targetingData.effectTargetType`  | **作用目標**：<br />• `Creator`：作用於裝備此武器/組件的機甲本身（Buff）。<br />• `Target`：作用於被此武器擊中的敵方機甲（Debuff）。   |
| `targetingData.showInStatusPanel` | **UI 顯示**：`true` 或 `false`。是否在戰鬥畫面的狀態列顯示這個 Buff/Debuff 的圖示。隱藏的被動能力通常設為 `false`，以免介面過於雜亂。 |

## 2. 顯示與描述 (Description)

控制該效果在遊戲介面中被點開時顯示的資訊。

|**參數名稱 (Key)**|**設定影響與說明**|
|---|---|
|`Description.Id`|**效果唯一識別碼**：全遊戲不能重複，強烈建議使用 `StatusEffect-裝備名-效果名` 的格式。|
|`Description.Name`|**效果名稱**：UI 上顯示的 Buff/Debuff 名稱。|
|`Description.Details`|**詳細說明**：UI 上針對該效果的文字敘述。|
|`Description.Icon`|**介面圖示**：調用的 SVG 向量圖檔名稱（例如 `uixSvgIcon_equipment_TTS`）。|

## 3. 核心運算引擎 (Statistic Data)

這是最關鍵的區塊，負責執行底層數值的加減乘除。

| **參數名稱 (Key)**                   | **設定影響與說明**                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `statisticData.targetCollection` | **作用範圍**：<br />• `Weapon`：效果僅限於提供此 Buff 的武器本身。<br />• `StatCollection`：效果擴及整台機甲的所有組件與基礎數值。                      |
| `statisticData.statName`         | **修改的屬性對象**：你要更改哪一個系統數值（請參考下方的「常用屬性名稱字典」）。                                                                  |
| `statisticData.operation`        | **運算邏輯**：<br />• `Float_Add` / `Int_Add`：加法運算（輸入負數即為減法）。<br />• `Float_Multiply`：乘法運算，用於計算倍率（如 `1.1` 代表增加 10%）。 |
| `statisticData.modValue`         | **修改數值**：要改變的具體數字。**注意：在 JSON 中必須用雙引號包起來當作字串**（如 `"-1.0"` 或 `"15"`）。                                        |
| `statisticData.modType`          | **資料型態**：<br />• `System.Single`：對應浮點數（帶小數點的數值）。<br />• `System.Int32`：對應整數（沒有小數點的數值）。                          |

## 📖 常用屬性名稱 (statName) 字典

當你要打造特殊裝備時，將以下字串填入 `statisticData.statName` 即可修改對應的機甲或武器能力。

### 📌 武器專屬強化 (範圍：`Weapon`)

_當 `targetCollection` 設為 `"Weapon"` 時適用，僅影響該把武器。_

|**屬性名稱 (statName)**|**運算建議**|**實際效果說明**|
|---|---|---|
|`AccuracyModifier`|Float_Add|**命中率修正**。輸入負值（如 `-1.0`）代表增加命中率，降低射擊難度。|
|`DamagePerShot`|Float_Add|**單發傷害增加**。直接增加每發子彈或雷射的基礎傷害值。|
|`HeatGenerated`|Float_Add|**發射產熱修正**。輸入負值（如 `-5.0`）代表武器開火時產生的熱量減少。|
|`EvasivePipsIgnored`|Int_Add|**無視迴避點數**。提升武器無視敵方 Evasion 點數的能力（如 `1` 代表多無視 1 格）。|
|`MaxRange`|Float_Add|**最大射程延伸**。直接增加武器的極限射擊距離。|

### 📌 全機甲強化 (範圍：`StatCollection`)

_當 `targetCollection` 設為 `"StatCollection"` 時適用，影響整台機甲的體質與移動。_

|**屬性名稱 (statName)**|**運算建議**|**實際效果說明**|
|---|---|---|
|`MaxHeat`|Int_Add|**過熱臨界值上限**。提高機甲容忍熱量的總槽位數量。|
|`HeatSinkCapacity`|Int_Add|**基礎散熱能力**。每回合結束時額外排出的熱量值（類似內建散熱器）。|
|`WalkSpeed`|Float_Add|**行走距離**。增加機甲在戰鬥地圖上單次移動的範圍。|
|`RunSpeed`|Float_Add|**衝刺距離**。增加機甲執行 Sprint 時的最大移動範圍。|
|`JumpDistanceMultiplier`|Float_Multiply|**跳躍距離倍率**。必須有裝備跳躍噴氣背包（Jump Jets）才有效，提升跳躍的極限距離。|
|`DamageReductionMultiplierAll`|Float_Multiply|**全域減傷倍率**。例如 `0.9` 代表受到任何來源的傷害都會減少 10%（極度強大的防禦屬性）。|
|`SensorSignatureModifier`|Float_Add|**雷達信號修正**。輸入負值（如 `-0.2`）代表讓敵方更難在遠距離鎖定並發現這台機甲（潛行效果）。|
## 狀態效果 JSON 範例 (命中+1 與 熱量上限+15)

JSON

```
"statusEffects": [
    {
        "durationData": { "duration": -1 },
        "targetingData": {
            "effectTriggerType": "Passive",
            "effectTargetType": "Creator",
            "showInStatusPanel": true
        },
        "effectType": "StatisticEffect",
        "Description": {
            "Id": "StatusEffect-UAC20K-Accuracy",
            "Name": "精準火控系統",
            "Details": "命中率 +1。",
            "Icon": "uixSvgIcon_equipment_TTS"
        },
        "nature": "Buff",
        "statisticData": {
            "statName": "AccuracyModifier",
            "operation": "Float_Add",
            "modValue": "-1.0",
            "modType": "System.Single",
            "targetCollection": "Weapon"
        }
    },
    {
        "durationData": { "duration": -1 },
        "targetingData": {
            "effectTriggerType": "Passive",
            "effectTargetType": "Creator",
            "showInStatusPanel": false
        },
        "effectType": "StatisticEffect",
        "Description": {
            "Id": "StatusEffect-UAC20K-HeatCap",
            "Name": "冷卻管線擴充",
            "Details": "最大熱量容量增加 15 點。",
            "Icon": "uixSvgIcon_equipment_Heatsink"
        },
        "nature": "Buff",
        "statisticData": {
            "statName": "MaxHeat",
            "operation": "Int_Add",
            "modValue": "15",
            "modType": "System.Int32",
            "targetCollection": "StatCollection"
        }
    }
]
```
