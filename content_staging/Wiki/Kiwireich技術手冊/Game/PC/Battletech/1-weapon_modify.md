---
title: BATTLETECH - Mod武器修改技巧
date: 2021-5-19
tags: [Game,PC-Game,SLG]
---

## Mod

這個遊戲的Mod在[Nexus mods](https://www.nexusmods.com/battletech)裡面就有

<!--more-->

## Modify

* 修改武器參數,可隨意複製後修改
* ~~改入商店作法~~
* 使用Save Editor直接修改入Save檔套用

#### 複製武器/裝備

* 檔名不能重複,可直接複製想要的類型後加**_數字**

#### 修改檔案

* 武器設定檔是json檔案,用notepad++

範例如下

```json
{
    "Category" : "Ballistic",								--類型
    "Type" : "Autocannon",
    "WeaponSubType" : "UAC20",
    "MinRange" : 0,											--最短有效距離
    "MaxRange" : 400,										--最長有效距離
    "RangeSplit" : [
        180,								
        180,
        270
    ],
    "AmmoCategory" : "AC20",								--彈藥類型
    "StartingAmmoCapacity" : 0,								--初始彈藥量
    "HeatGenerated" : 48,									--熱量
    "Damage" : 200,											--傷害
    "OverheatedDamageMultiplier" : 0,
    "EvasiveDamageMultiplier" : 0,
    "EvasivePipsIgnored" : 0,
    "DamageVariance" : 0,
    "HeatDamage" : 0,
    "StructureDamage" : 0,
    "AccuracyModifier" : 0,
    "CriticalChanceMultiplier" : 1,
    "AOECapable" : false,
    "IndirectFireCapable" : false,
    "RefireModifier" : 0,
    "ShotsWhenFired" : 10,
    "ProjectilesPerShot" : 3,								--每次開槍會有幾顆子彈
    "AttackRecoil" : 4,										--後座力
    "Instability" : 1,										--不穩定性
    "WeaponEffectID" : "WeaponEffect-Weapon_AC20_Ultra",
    "Description" : {
        "Cost" : 650000,
        "Rarity" : 99,
        "Purchasable" : true,
        "Manufacturer" : "Kiwi Tech",						--顯示的製造商可以任意修改
        "Model" : "Shredder Autocannon",					
        "UIName" : "UAC/20 Ver.K",							--顯示的武器名稱
        "Id" : "Weapon_Autocannon_UAC20_4-Kali_Yama",		--這個要同檔名
        "Name" : "UAC/20 Ver.K",							--同UIName
        "Details" : "Delivering unparalleled damage output, Ultra AC/20s issue nightmarish volleys of devastation. Like all Ultra Autocannon weaponry, UAC/20s suffer from substantial recoil effects from firing and consume two ammo per attack.",						  --細項可以任意編輯
        "Icon" : "uixSvgIcon_weapon_Ballistic"
    },
    "BonusValueA" : "+ 50 Dmg.",							--額外效果
    "BonusValueB" : "- 3000 Heat / Turn",					--額外效果
    "ComponentType" : "Weapon",
    "ComponentSubType" : "Weapon",
    "PrefabIdentifier" : "uac5",
    "InventorySize" : 1,									--佔多少格子
    "Tonnage" : 20,											--裝備重量
    "AllowedLocations" : "All",								
    "DisallowedLocations" : "All",
    "CriticalComponent" : false,
    "statusEffects" : [
        
    ],
    "ComponentTags" : {
        "items" : [
            "component_type_variant",
            "component_type_variant2",
            "range_standard",
            "component_type_lostech",
            "BLACKLISTED"
        ],
        "tagSetSourceFile" : ""
    }
}

```

#### Save Editor

使用[這個mod](https://www.nexusmods.com/battletech/mods/408)

