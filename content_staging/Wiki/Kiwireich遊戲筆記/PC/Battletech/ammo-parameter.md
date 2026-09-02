---
slug: Game/PC/Battletech/ammo
title: 彈藥系統與自訂彈藥箱
date: 2026-09-01
tags:
  - Game
  - PC-Game
  - SLG
---
# 彈藥系統與自訂彈藥箱

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

:::tip
彈藥也是一個值得修改的地方,最起碼彈藥數量就很重要
:::

在 BattleTech 的底層架構中，彈藥系統採用了「三層式」的嚴謹對應邏輯。要成功發射一發子彈，必須確保**武器 (Weapon)**、**彈藥箱 (AmmunitionBox)** 與**子彈本體 (Ammunition)** 三者的 JSON 設定完美串接。

## 1. 彈藥配對與觸發邏輯 (System Logic)

當機甲在戰鬥中嘗試開火時，系統會依序執行以下檢驗：

1. **第一層【武器端】**：讀取 `Weapon` JSON 中的 `AmmoCategory` 參數（例如 `"AC20"`），確認這把武器吃哪種口徑的子彈。
2. **第二層【機甲庫存】**：掃描機甲身上的所有裝備，尋找 `ComponentType` 為 `AmmunitionBox` 的實體彈藥箱，並核對該箱子是否能提供 `"AC20"` 類別的彈藥。
3. **第三層【子彈定義】**：彈藥箱內的 `AmmoID` 會指向一個獨立的 `Ammunition` JSON 檔案（例如 `Ammunition_AC20.json`）。這個底層檔案才真正定義了這顆子彈的屬性（如是否為穿甲彈或燃燒彈）。

> 💡 **最安全的修改法 (Safe Modding Rule)**
> 
> 如果您的目的只是單純「擴充攜彈量」，請**只修改彈藥箱 (AmmunitionBox) 的 `Capacity` 參數**，並保持 `AmmoID` 指向原廠預設的子彈檔案。這樣能確保遊戲絕對不會發生讀取錯誤。

## 2. 彈藥箱 (AmmunitionBox) 核心參數字典

彈藥箱是玩家實際上在改裝介面中安裝到機甲上的「實體裝備」。

|**參數名稱 (Key)**|**設定影響與說明**|
|---|---|
|`AmmoID`|**核心連結點**：指定這箱彈藥裝的子彈類型。必須完全對應底層的 Ammunition 檔案名稱（例如 `"Ammunition_AC20"`）。**絕對不能填錯，否則武器會顯示無彈藥。**|
|`Capacity`|**攜彈量**：這箱彈藥提供的總發射次數。例如設為 `100`，代表這箱彈藥能讓單發消耗 1 彈藥的武器開火 100 次。|
|`ComponentType`|**組件主分類**：必須設定為 `"AmmunitionBox"`。讓系統將其判定為彈藥容器而非武器或散熱器。|
|`ComponentSubType`|**組件次分類**：必須設定為 `"Ammunition"`。|
|`InventorySize`|**佔用格數 (Slots)**：在機甲部位（如腿部、軀幹）佔據的空間大小。原廠彈藥通常佔 1 格。|
|`Tonnage`|**裝備重量 (噸)**：佔用機甲總載重的額度。原廠彈藥通常為 1 噸。|
|`Description.Id`|**物件 ID**：必須與此彈藥箱的 JSON 檔名完全相同。|

## 3. 子彈本體 (Ammunition) 核心參數字典 (進階)

如果你想製作特殊的子彈（例如：擊中時增加熱量的高爆燃燒彈，或是傷害更高的貧鈾穿甲彈），你需要建立一個全新的 `Ammunition` JSON 檔案，並將彈藥箱的 `AmmoID` 指向它。

_檔案範例：可以複製原廠的 `Ammunition_AC20.json` 來修改。_

|**參數名稱 (Key)**|**設定影響與說明**|
|---|---|
|`AmmoCategory`|**彈藥口徑類別**：必須與武器的 `AmmoCategory` 匹配（例如 `"AC20"`）。這告訴系統這種子彈是給誰用的。|
|`WeaponEffectID`|**專屬視覺特效**：可選填。如果這是一種特殊子彈，你可以指定不同的開火特效或彈道顏色。|
|`HeatGeneratedModifier`|**產熱修正倍率**：改變發射這種子彈時的產熱。例如 `1.2` 代表發射此彈藥時，武器產熱增加 20%。|
|`ArmorDamageModifier`|**裝甲傷害修正倍率**：改變對裝甲的破壞力。例如 `1.5` 代表對敵方裝甲造成 1.5 倍的額外傷害。|
|`ISDamageModifier`|**結構傷害修正倍率**：改變對無裝甲部位（Internal Structure）的破壞力。例如 `2.0` 代表極易摧毀敵方機甲內部。|
|`InstabilityModifier`|**失衡值修正倍率**：改變擊中時扣除目標穩定度的倍率。|

## 📦 自訂彈藥箱 JSON 範本

以下是一個經過修改的高容量 (100發) 彈藥箱設定範例，可以直接儲存為 `Ammo_AmmunitionBox_UAC20_VerK.json`：

JSON

```
{
    "AmmoID" : "Ammunition_AC20",
    "Capacity" : 100,
    "Description" : {
        "Cost" : 150000,
        "Rarity" : 0,
        "Purchasable" : true,
        "Manufacturer" : "Kiwi Tech",
        "Model" : "High-Density Drum",
        "UIName" : "Ammo AC/20 Ver.K",
        "Id" : "Ammo_AmmunitionBox_UAC20_VerK",
        "Name" : "Ammo AC/20 Ver.K",
        "Details" : "採用高密度壓縮技術的特製 AC/20 彈藥鼓，單一儲存格可容納高達 100 發常規 AC/20 穿甲彈。",
        "Icon" : "uixSvgIcon_equipment_AmmoBox"
    },
    "BonusValueA" : "+ 100 Rounds",
    "BonusValueB" : "",
    "ComponentType" : "AmmunitionBox",
    "ComponentSubType" : "Ammunition",
    "PrefabIdentifier" : "",
    "InventorySize" : 1,
    "Tonnage" : 1,
    "AllowedLocations" : "All",
    "DisallowedLocations" : "All",
    "CriticalComponent" : false,
    "statusEffects" : [
        
    ],
    "ComponentTags" : {
        "items" : [
            "component_type_variant",
            "component_type_variant2"
        ],
        "tagSetSourceFile" : ""
    }
}
```