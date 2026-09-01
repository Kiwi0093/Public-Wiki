---
title: Party.json
date: 2021-11-04
tags:
  - Game
  - PC-Game
  - RPG
---

:::
其實Save檔裡面就定義了你的角色外型,技能,Feat, Ability,Inventory等資料,若是不喜歡用Mod或是其他工具修改的人可以手工修改,不過建議盡量不要玩到遊戲中後期後才修改(除非有必要)不然檔案會很大很難改
:::

<img src='https://img.shields.io/badge/Kiwi-%E8%80%81%E5%AF%A6%E8%AA%AA%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8ToyBox%E6%AF%94%E8%BC%83%E5%BF%AB%E5%95%A6-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

# Party.json sample

```json
{
    "SceneName": "<cross-scene>",
    "HasEntityData": false,
    "m_EntityData": [
        {
            "$id": "1",
            "$type": "Kingmaker.EntitySystem.Entities.UnitEntityData, Assembly-CSharp",
            "m_GroupId": "<directly-controllable-unit>",
            "Position": "-6788|4068|603",
            "m_Orientation": 251.672562,
            "Sleepless": 0,
            "Parts": {
                "$id": "2",
                "m_Parts": [
                    {},
                    {
                        "$id": "4",
                        "$type": "Kingmaker.UnitLogic.Parts.UnitPartCompanion, Assembly-CSharp",
                        "m_Spawner": null,
                        "m_HealOnExit": false,
                        "State": "InParty",
                        "LastCampingRole": "Alchemist"
                    },
                    {},
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
                    },
                    {},
                    {},
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
                    },
                    {},
                    {},
                    {}
                ]
            },
            "Facts": {},
            "m_IsRevealed": true,
            "Stealth": {},
            "SpawnPosition": "0|0|0",
            "LastMoveTime": "2.12:30:27.8830000",
            "Descriptor": {
                "$id": "2065",
                "m_Inventory": {},
                "m_Spellbooks": [],
                "Faction": "72f240260881111468db610b6c37c099",
                "Stats": {
                    "$id": "2309",
                    "Strength": {},
                    "Dexterity": {},
                    "Constitution": {},
                    "Intelligence": {},
                    "Wisdom": {},
                    "Charisma": {},
                    "HitPoints": {},
                    "TemporaryHitPoints": {},
                    "AC": {},
                    "AdditionalAttackBonus": {},
                    "AdditionalDamage": {},
                    "BaseAttackBonus": {},
                    "AttackOfOpportunityCount": {},
                    "AdditionalCMB": {},
                    "AdditionalCMD": {},
                    "Initiative": {},
                    "Speed": {},
                    "SaveFortitude": {},
                    "SaveReflex": {},
                    "SaveWill": {},
                    "SkillMobility": {},
                    "SkillAthletics": {},
                    "SkillPerception": {},
                    "SkillThievery": {},
                    "SkillPersuasion": {},
                    "SkillStealth": {},
                    "SkillUseMagicDevice": {},
                    "SkillKnowledgeArcana": {},
                    "SkillKnowledgeWorld": {},
                    "SkillLoreNature": {},
                    "SkillLoreReligion": {},
                    "CheckBluff": {},
                    "CheckDiplomacy": {},
                    "CheckIntimidate": {},
                    "SneakAttack": {},
                    "DamageNonLethal": {},
                    "Reach": {}
                },
                "AttackFactions": {},
                "Resources": {},
                "Progression": {},
                "UISettings": {
                    "$id": "2400",
                    "m_AlreadyAutomaticallyAdded": [],
                    "m_CustomPortrait": {
                        "$id": "2401",
                        "m_CustomPortraitId": "4BE5DB6815BD1B86F14B4B687F1BA1FF"
                    },
                    "m_Slots": {}
                },
                "State": {},
                "Proficiencies": {},
                "Alignment": {},
                "CustomGender": "Female",
                "LeftHandedOverride": true,
                "CustomName": "Kiwi Von Hohenzollen",
                "CustomAsks": "e7b22776ba8e2b84eaaff98e439639a7",
                "ForcceUseClassEquipment": true,
                "BirthDay": 23,
                "BirthMonth": 10,
                "m_IsEssentialForGame": 1,
                "Body": {},
                "Brain": {},
                "OriginalBlueprint": "4391e8b9afbb0cf43aeba700c089f56d",
                "Blueprint": "4391e8b9afbb0cf43aeba700c089f56d",
                "MainFact": {},
                "Encumbrance": "Light",
                "HasOwnInventory": false,
                "LastRestTime": "2.07:02:52.1970000"
            },
            "PreviousPosition": "-6788|4068|603",
            "DesiredOrientation": 251.672562,
            "TimeToNextRoundTick": 2.977339,
            "LootViewed": false,
            "UniqueId": "e51cd2f4-f8e6-4956-93a7-86281cd5e92a"
        },
        {
            "$id": "2457",
            "$type": "Kingmaker.EntitySystem.Entities.UnitEntityData, Assembly-CSharp",
            "m_GroupId": "<directly-controllable-unit>",
            "Position": "-7137|4068|442",
            "m_Orientation": 270.454346,
            "Sleepless": 0,
            "Parts": {
                "$id": "2458",
                "m_Parts": [
                    {
                        "$id": "2459",
                        "$type": "Kingmaker.UnitLogic.Parts.UnitPartPet, Assembly-CSharp",
                        "m_MasterRef": {
                            "m_Ref": "e51cd2f4-f8e6-4956-93a7-86281cd5e92a"
                        },
                        "Type": "MythicSkeletalChampion"
                    },
                    {},
                    {
                        "$id": "2461",
                        "$type": "Kingmaker.UnitLogic.Parts.UnitPartDollData, Assembly-CSharp",
                        "Default": {
                            "$id": "2462",
                            "EquipmentEntityIds": [
                                "971d4ec9ff97af447b415c8eb4c5b0b5",
                                "6831469a4e2bc664f9622bdfbf5ed30c",
                                "3fa56cc5d206ca142bde8f93ad089a02",
                                "b8b615fabc0f7af448fb68f009113c61",
                                "8a008a34d7462524c9b96132a28bb606"
                            ],
                            "EntityRampIdices": {
                                "3fa56cc5d206ca142bde8f93ad089a02": 11,
                                "bb6988a21733fad4296ad22537248fea": 8,
                                "971d4ec9ff97af447b415c8eb4c5b0b5": 8,
                                "6831469a4e2bc664f9622bdfbf5ed30c": 11
                            },
                            "EntitySecondaryRampIdices": {},
                            "Gender": "Female",
                            "RacePreset": "e03b9c63971878743b8f53bdf14673ee",
                            "ClothesPrimaryIndex": 54,
                            "ClothesSecondaryIndex": 12
                        }
                    },
                    {}
                ]
            },
            "Facts": {},
            "m_IsRevealed": true,
            "Stealth": {},
            "SpawnPosition": "0|0|0",
            "LastMoveTime": "2.12:30:38.7740000",
            "Descriptor": {
                "$id": "2631",
                "m_Inventory": {},
                "m_Damage": 291,
                "m_Spellbooks": [],
                "Faction": "72f240260881111468db610b6c37c099",
                "Stats": {},
                "AttackFactions": {},
                "Resources": {},
                "Progression": {},
                "UISettings": {
                    "$id": "2694",
                    "m_AlreadyAutomaticallyAdded": [],
                    "m_CustomPortrait": {
                        "$id": "2695",
                        "m_CustomPortraitId": "B28894B2200AAE6300A928653E91CD2B"
                    },
                    "m_Slots": {}
                },
                "State": {},
                "Proficiencies": {},
                "Alignment": {},
                "CustomGender": "Female",
                "LeftHandedOverride": true,
                "CustomName": "烏緹卡",
                "BirthDay": 25,
                "BirthMonth": 12,
                "CustomPrefabGuid": null,
                "m_IsEssentialForGame": 0,
                "Body": {},
                "Brain": {},
                "OriginalBlueprint": "3038bf627339a4d469e3c7455007f10d",
                "Blueprint": "3038bf627339a4d469e3c7455007f10d",
                "MainFact": {
                    "$ref": "2471"
                },
                "Encumbrance": "Light",
                "HasOwnInventory": false,
                "LastRestTime": "2.07:02:52.1970000"
            },
            "PreviousPosition": "-7137|4068|442",
            "DesiredOrientation": 270.454346,
            "TimeToNextRoundTick": 5.049661,
            "LootViewed": false,
            "UniqueId": "b27cd89c-a8b0-4a1c-a5f0-379c5e5fd9c3"
        }
}
```

# Save檔的結構

## 基本結構

基本上就如sample一樣, 它是一個人完整定義完了之後在開始下一個重點

```json
{
    "SceneName": "<cross-scene>",
    "HasEntityData": false,
    "m_EntityData": [
        {
            "$id": "1",
            "$type": "Kingmaker.EntitySystem.Entities.UnitEntityData, Assembly-CSharp",
            "m_GroupId": "<directly-controllable-unit>",
            "Position": "-6788|4068|603",
            "m_Orientation": 251.672562,
            "Sleepless": 0,
            "Parts": {},
            "Facts": {},
            "m_IsRevealed": true,
            "Stealth": {},
            "SpawnPosition": "0|0|0",
            "LastMoveTime": "2.12:30:27.8830000",
            "Descriptor": {},
            "PreviousPosition": "-6788|4068|603",
            "DesiredOrientation": 251.672562,
            "TimeToNextRoundTick": 2.977339,
            "LootViewed": false,
            "UniqueId": "e51cd2f4-f8e6-4956-93a7-86281cd5e92a"
        },
        {
            "$id": "2457",
            "$type": "Kingmaker.EntitySystem.Entities.UnitEntityData, Assembly-CSharp",
            "m_GroupId": "<directly-controllable-unit>",
            "Position": "-7137|4068|442",
            "m_Orientation": 270.454346,
            "Sleepless": 0,
            "Parts": {},
            "Facts": {},
            "m_IsRevealed": true,
            "Stealth": {},
            "SpawnPosition": "0|0|0",
            "LastMoveTime": "2.12:30:38.7740000",
            "Descriptor": {},
            "PreviousPosition": "-7137|4068|442",
            "DesiredOrientation": 270.454346,
            "TimeToNextRoundTick": 5.049661,
            "LootViewed": false,
            "UniqueId": "b27cd89c-a8b0-4a1c-a5f0-379c5e5fd9c3"
        },
        {}
}
```

所以若要搜索建議可以用`"m_GroupId"`作為關鍵字進行搜尋

## 大致分類

### 主結構

```json
"$id": "2457",
"$type": "Kingmaker.EntitySystem.Entities.UnitEntityData, Assembly-CSharp",
"m_GroupId": "<directly-controllable-unit>",
"Position": "-7137|4068|442",
"m_Orientation": 270.454346,
"Sleepless": 0,
"Parts": {},																	#角色的外型,buff,Pet都在這一個Section
"Facts": {},																	#角色的feat, ability都在這一個Section
"m_IsRevealed": true,
"Stealth": {},
"SpawnPosition": "0|0|0",
"LastMoveTime": "2.12:30:38.7740000",
"Descriptor": {},																#角色最重要的定義,後面會另外break down
"PreviousPosition": "-7137|4068|442",
"DesiredOrientation": 270.454346,
"TimeToNextRoundTick": 5.049661,
"LootViewed": false,
"UniqueId": "b27cd89c-a8b0-4a1c-a5f0-379c5e5fd9c3"								#角色的UniqueID,每個角色都有一個不重複的
```

### Parts - Pet & Master

```json
#定義Pet種類與其Master
"Parts": {
                "$id": "2458",
                "m_Parts": [
                    {
                        "$id": "2459",
                        "$type": "Kingmaker.UnitLogic.Parts.UnitPartPet, Assembly-CSharp",
                        "m_MasterRef": {
                            "m_Ref": "e51cd2f4-f8e6-4956-93a7-86281cd5e92a"						#這裡要確認跟Master的UniqueID一致
                        },
                        "Type": "MythicSkeletalChampion"										#這種一共有三大種
                    },
                   ]
          }
#定義Master的Pet們
"Parts": {
                "$id": "2",
                "m_Parts": [
                    {
                        "$id": "10",
                        "$type": "Kingmaker.UnitLogic.Parts.UnitPartPetMaster, Assembly-CSharp",
                        "m_Pets": [
                            {
                                "m_Ref": "b27cd89c-a8b0-4a1c-a5f0-379c5e5fd9c3"					#定義寵物的UniqueID,用這個格式增加數量
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
                ]
            },
```

因為系統限制,除了不同大種類差異的會增加以外其他的不會自動加上第二個所以需要手動加上

#### Pet Type

* AnimeCompanion
* MythicSkeletalChampion
* DragonAzataCompaion

### Part - 外型

```json
"Parts": {
                "$id": "2",
                "m_Parts": [
                    {
                        "$id": "6",
                        "$type": "Kingmaker.UnitLogic.Parts.UnitPartDollData, Assembly-CSharp",
                        "Default": {
                            "$id": "7",
                            "EquipmentEntityIds": [									#各外型部位的UUID,若有總表可以直接修改
                                "7368eafa3f5ee9d4bb9739b80faefdc3",									
                                "9ab83dd3a06ba6a4e97900bd6ffc4aab",
                                "7c55ae7f07c9d4741b4837bd305d3ec0",
                                "b8b615fabc0f7af448fb68f009113c61",
                                "8a008a34d7462524c9b96132a28bb606"
                            ],
                            "EntityRampIdices": {								   #顏色定義,髮色/膚色什麼的
                                "7c55ae7f07c9d4741b4837bd305d3ec0": 15,				
                                "861171cdd3930a84faab08ab85ba924a": 8,
                                "7368eafa3f5ee9d4bb9739b80faefdc3": 8,
                                "9ab83dd3a06ba6a4e97900bd6ffc4aab": 15
                            },
                            "EntitySecondaryRampIdices": {},
                            "Gender": "Female",										#外型性別
                            "RacePreset": "ee326fab8804493499ce07c5cd8759e2",		
                            "ClothesPrimaryIndex": 9,								#衣服顏色
                            "ClothesSecondaryIndex": 9
                        }
                    }
                ]
}
```

基本上只有第一個MythicSkeletalChampion會需要去剪下其他的來貼,其他的都會建議用傭兵來改會比較快

### Descriptor

```json
"Descriptor": {
    			"$id": "2631",
                "m_Inventory": {},
                "m_Damage": 291,
                "m_Spellbooks": [],
                "Faction": "72f240260881111468db610b6c37c099",
                "Stats": {},
                "AttackFactions": {},
                "Resources": {},
                "Progression": {},
                "UISettings": {
                    "$id": "2694",
                    "m_AlreadyAutomaticallyAdded": [],
                    "m_CustomPortrait": {
                        "$id": "2695",
                        "m_CustomPortraitId": "B28894B2200AAE6300A928653E91CD2B"		#定義頭像
                    },
                    "m_Slots": {}
                },
                "State": {},
                "Proficiencies": {},
                "Alignment": {},
                "CustomGender": "Female",												#系統性別跟外型沒關係
                "LeftHandedOverride": true,
                "CustomName": "烏緹卡",												  #名字可以用中文
                "BirthDay": 25,
                "BirthMonth": 12,
                "CustomPrefabGuid": null,
                "m_IsEssentialForGame": 0,
                "Body": {},
                "Brain": {},
                "OriginalBlueprint": "3038bf627339a4d469e3c7455007f10d",
                "Blueprint": "3038bf627339a4d469e3c7455007f10d",
                "MainFact": {},
                "Encumbrance": "Light",
                "HasOwnInventory": false,
                "LastRestTime": "2.07:02:52.1970000"
},
```




# 其他重點
## Json construction

```json
{
    "All":(
    	"data": "A"
        ),{
    	"wrote": {
    		"like":{
    				"this": "B"
				}
    		}
		}
}
```

用`{` `}`或是`[` `]`把設定框起來,同一層定義的用`,`連結,所以要變成人看得懂的需要先整理成sample那樣的格式

## id & $ref

在Pathfinder兩代的save file中需要注意每個獨立的項目均會assign一個id,這個id不需要依照順序只要不重複即可

$ref是用來呼叫被定義好的id

## `"` `"`符號與`:`不要忘記

若是`"` `"` `:` `[` `]` `{` `}`符號有漏的就會讓整個文件的對齊跑了機器會讀不出來

