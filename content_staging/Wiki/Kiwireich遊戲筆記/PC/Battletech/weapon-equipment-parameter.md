---
slug: Game/PC/Battletech/weapon
title: 武器與裝備參數解析
date: 2026-09-01
tags:
  - Game
  - PC-Game
  - SLG
---
> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

:::tip
本篇彙整武器與裝備 JSON 檔案中各項參數的定義與實際影響，主要分為四大類別。
:::
## 1. 基礎武器屬性 (Base Weapon Stats)

控制武器的硬體分類、射程與運作基礎。

|**參數名稱 (Key)**|**設定影響與說明**|
|---|---|
|`Category`|武器大類別：如 `Ballistic` (彈道)、`Energy` (能量)、`Missile` (飛彈)。決定該武器適用的機甲硬點 (Hardpoint)。|
|`Type`|武器類型：如 `Autocannon`、`Laser` 等，用於系統內部邏輯辨識。|
|`WeaponSubType`|武器子類型：如 `UAC20`，進一步細分種類，影響彈藥庫匹配與駕駛員技能加成。|
|`RangeSplit`|射程門檻：格式為 `[短, 中, 長]`。定義武器在不同距離區間下的命中率遞減判定點。|
|`AmmoCategory`|彈藥類別：如 `AC20`。機甲上必須安裝對應類別的彈藥箱才能開火。|
|`HeatGenerated`|發射產熱：每次開火會增加機甲的熱量值。|

## 2. 傷害與戰鬥判定 (Damage Mechanics)

定義武器開火時造成的破壞力與附加戰鬥效果。

|**參數名稱 (Key)**|**設定影響與說明**|
|---|---|
|`Damage`|單發基礎傷害：每發彈藥/光束擊中時扣除的裝甲或內部結構值。|
|`ShotsWhenFired`|開火發射數：單次攻擊指令射出的次數。總傷害 = 基礎傷害 × 發射數。|
|`ProjectilesPerShot`|單發彈丸數：針對散彈 (LBX) 或飛彈，一發彈藥會分裂出多少個獨立計算命中的彈丸。|
|`Instability`|失衡值破壞：擊中時扣除目標的穩定度。累積達標會導致敵方機甲倒地。|
|`AccuracyModifier`|命中率修正：**負值**代表提升命中率，正值代表降低命中率。|
|`AttackRecoil`|攻擊後座力：連續回合開火產生的命中懲罰（UAC 類別通常設定較高）。|
|`IndirectFireCapable`|曲射能力：布林值 (`true`/`false`)。是否能無視直線視線 (LoS) 跨越障礙物攻擊。|

## 3. 機甲安裝與物理規格 (Mech Specs)

定義裝備在改裝畫面中的空間佔用與安裝限制。

|**參數名稱 (Key)**|**設定影響與說明**|
|---|---|
|`InventorySize`|佔用格數 (Critical Slots)：安裝在機甲部位時佔據的空間大小。|
|`Tonnage`|裝備重量 (噸)：佔用機甲總載重的額度。|
|`AllowedLocations`|允許安裝部位：`All` 代表全機皆可安裝；也可限制如 `MechHead`。|

## 4. UI 顯示與設定 (UI & Description)

|**參數名稱 (Key)**|**設定影響與說明**|
|---|---|
|`Description.Id`|**最核心參數**。必須與 JSON 檔名完全相同。|
|`BonusValueA / B`|特殊效果提示：綠色增益文字（如 `+ 50 Dmg.`）。_注意：這僅是 UI 字串，實際效果需在 Damage 或 statusEffects 修改。_|
|`ComponentTags`|組件標籤：影響商店生成。標記 `BLACKLISTED` 會使其不在商店或戰利品中出現。|