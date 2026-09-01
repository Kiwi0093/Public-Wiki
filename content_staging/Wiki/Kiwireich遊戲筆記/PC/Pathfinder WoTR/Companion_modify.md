---
title: MythicSkeletonCompanion Modify
date: 2021-11-05
tags:
  - Game
  - PC-Game
  - RPG
---

:::tip
其實把跟班改好改滿後根本不用帶同伴一起冒險了,因為你這樣就等於有一個五人小隊了....
:::

<img src='https://img.shields.io/badge/Kiwi-%E5%BE%8C%E4%BE%86%E9%81%8A%E6%88%B2%E5%A4%9A%E6%AC%A1%E6%94%B9%E7%89%88%2C%E5%85%B6%E5%AF%A6%E9%80%99%E5%80%8B%E4%BD%9C%E6%B3%95%E5%BE%8C%E9%9D%A2%E6%98%AF%E4%B8%8D%E6%98%AF%E9%82%84%E5%8F%AF%E4%BB%A5%E6%88%96%E6%98%AF%E6%90%AD%E9%85%8D%E5%85%B6%E4%BB%96mod%E4%B8%80%E8%B5%B7%E6%94%B9%E6%89%8D%E5%8F%AF%E4%BB%A5%E5%B7%B2%E7%B6%93%E4%B8%8D%E5%8F%AF%E8%80%83%E4%BA%86-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

# 基本流程

因為還沒測試過直接用新創角色來創造跟班的作法,所以第一版會建議除了第一個MythicSkeletonCompanion以外（因為這個會自動生成）後面的三個都用傭兵來改會比較簡單

建議的作法

1. 用ToyBox添加MythicSkeletonCompanion的Feat(任意那一個都可以)

2. 重新創個你喜歡的跟班角色與肖像

3. 修改save檔把你喜歡的跟班角色的外型section, 肖像貼到你Feat對應的跟班Section內

4. 建立三個額外的傭兵

5. 添加其他三個MythicSkeletonCompanion feat

6. ~~修改Save檔把對應傭兵的UniqueId對應到Feat~~, m_pet並且在master的定義中加上這三個的UniqueId

   `*` 最新確認只需要定義Master跟Pet關係就可以了

# 對應資料

## 對應Feat UUID

| 種類         | UUID                             |
| ------------ | -------------------------------- |
| Archer       | 0cebe3b375b6397438909ac9752d9792 |
| Dual Wielder | d4583662450245446ae3a56e07232e6f |
| Tank         | 048456cce79943f4c9c9eec1aa5ce9a0 |
| Two-Handed   | d4583662450245446ae3a56e07232e6  |

## 修改第一個MythicSkeletonCompanion外型與肖像
### 添加外型定義

```json
#在m_part內加上
{
        "$id": "6",
        "$type": "Kingmaker.UnitLogic.Parts.UnitPartDollData, Assembly-CSharp",
              "Default": {
                    "$id": "7",
                    "EquipmentEntityIds": [									
                            "7368eafa3f5ee9d4bb9739b80faefdc3",									
                            "9ab83dd3a06ba6a4e97900bd6ffc4aab",
                            "7c55ae7f07c9d4741b4837bd305d3ec0",
                            "b8b615fabc0f7af448fb68f009113c61",
                            "8a008a34d7462524c9b96132a28bb606"
                    ],
                    "EntityRampIdices": {								   
                            "7c55ae7f07c9d4741b4837bd305d3ec0": 15,				
                            "861171cdd3930a84faab08ab85ba924a": 8,
                            "7368eafa3f5ee9d4bb9739b80faefdc3": 8,
                            "9ab83dd3a06ba6a4e97900bd6ffc4aab": 15
                    },
                    "EntitySecondaryRampIdices": {},
                    "Gender": "Female",										
                    "RacePreset": "ee326fab8804493499ce07c5cd8759e2",		
                    "ClothesPrimaryIndex": 9,								
                    "ClothesSecondaryIndex": 9
               }
}
```

### 變更肖像

```json
"Descriptor": {
    			...
                "UISettings": {
                    "$id": "2694",
                    "m_AlreadyAutomaticallyAdded": [],
                    "m_CustomPortrait": {
                        "$id": "2695",
                        "m_CustomPortraitId": "B28894B2200AAE6300A928653E91CD2B"		
                    },
                    "m_Slots": {}
                },
                ...
},
```


## 將傭兵轉變成其他三個MythicSkeletonCompanion的方法
### Feat資料格式(用不到了)

```json
 {
                        "$id": "109",
                        "$type": "Kingmaker.UnitLogic.Feature, Assembly-CSharp",
                        "m_Context": {
                            "AssociatedBlueprint": "048456cce79943f4c9c9eec1aa5ce9a0",
                            "m_OwnerRef": "e51cd2f4-f8e6-4956-93a7-86281cd5e92a",
                            "m_Params": null
                        },
                        "Blueprint": "048456cce79943f4c9c9eec1aa5ce9a0",
                        "UniqueId": "e731dd8b-31cc-4114-9dd5-650a8672ddf0",
                        "AttachTime": "12:00:47.3910000",
                        "IsActive": true,
                        "Components": {
                            "$AddPet$858ef2c0-f8cf-41f4-af45-0bb06f90fa00": {
                                "$type": "Kingmaker.EntitySystem.EntityFactComponentDelegate`2+ComponentRuntime[[Kingmaker.EntitySystem.Entities.UnitEntityData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null],[Kingmaker.UnitLogic.FactLogic.AddPetData, Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null]], Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null",
                                "m_Data": {
                                    "$id": "110",
                                    "SpawnedPetRef": "b27cd89c-a8b0-4a1c-a5f0-379c5e5fd9c3",
                                    "Disabled": false
                                }
                            }
                        }
                    },
```

基本上只要你添加了該Feat後就可以在Save檔內Search對應的UUID就可以找到對應的Section(長的像上面的段落的只有一個)

然後把你的傭兵（或是對應角色的UUID)貼在`"SpawnedPetRef"`的後面(第二個被添加的Feat這項的值會是null)

### Part

#### 要變成跟班的Part Section

```json
#在m_part內加上
{
      "$id": "2459",
      "$type": "Kingmaker.UnitLogic.Parts.UnitPartPet, Assembly-CSharp",
      "m_MasterRef": {
              "m_Ref": "e51cd2f4-f8e6-4956-93a7-86281cd5e92a"						
                     },
      "Type": "MythicSkeletalChampion"										
},
```

`m_MasterRef`下的`m_Ref`定義要確認UUID是主人(feat擁有者)的UUID

#### 該主人的Part Section

```json
#在m_part內加上
{
        "$id": "10",
        "$type": "Kingmaker.UnitLogic.Parts.UnitPartPetMaster, Assembly-CSharp",
        "m_Pets": [
                     {
               "m_Ref": "b27cd89c-a8b0-4a1c-a5f0-379c5e5fd9c3"					
                     },
                     {
               "m_Ref": "46694232-fba8-4a18-8daa-1a1c933290e2"
                     },
                     {
               "m_Ref": "14547546-c716-4e63-9a5c-d8126e9c01f6"
                     },
                     {
               "m_Ref": "2577f7e3-a782-439d-90df-eaa70a440af4"
                     }
                  ],
          "m_ExPets": []
}
```

像上面範例一樣加上`m_Ref`的定義就會把跟班定義到裡面

