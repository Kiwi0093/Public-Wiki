---
title: Pathfinder:Kingmaker - Save檔修改技巧
date: 2020-11-17
tags: [Game,PC-Game,RPG]
---

# 前言

我很喜歡D&D類型的RPG,也很喜歡這種類冰風谷的CRPG,然而更大的樂趣,卻是亂搞遊戲本身...

<!--more-->

### Save檔所在位置

`C:\Users\{Username}\AppData\LocalLow\Owlcat Games\Pathfinder Kingmaker\Saved Games`

因為`AppData`是隱藏目錄.所以需要手動進入

記錄檔為`*.zks`可以當作一般的Zip解開,解開後的檔案有兩個重點檔案

+ party.json

  這個檔案紀錄了整個隊伍裡面每一個角色(包括隊友跟寵物)的資訊,我們想要變更跟班的外貌與種族請編輯這個

+ player.json

  這個檔案主要是紀錄主角的一些訊息

### Json file好用的Editor

可以使用[notepad++](https://notepad-plus-plus.org/downloads/)加上[Jstool](https://www.sunjw.us/jstool/npp/)Plug-in,再讀入json file的時候可以利用Jstool裡的JSFormat功能把json對齊成好看的樣子

### Party.json

在使用CoTW這個mod之後,有一些職業會帶有跟班,例如牧師的Undead Lord或是Summoner

這樣的跟班在系統中與動物夥伴一樣都被視作Pet,不會佔夥伴的人數,CoTW內的跟班預設是寫死的模型

沒有像傭兵一樣的紙娃娃系統可以變更外貌,但是可以透過修改save檔的方式把Pet變成跟傭兵一樣效果(不過升級的部分還是同Pet沒有自己的經驗值,這點可以靠Bag of Tricks來解決)

##### 修改跟班

###### 文件說明

在party.json內用來定義一個角色的內容在"Descriptor"這個大section內,我們只要修改這個Section內用來控制相關部分就好

```json
"UISettings": {
...
"m_CustomPortrait": {
                        "$id": "582",
                        "m_CustomPortraitId": "aa28" //使用aa28頭像
                    }
              }
```

這段定義的是角色的頭像照片

```json
"CustomGender": "Male", //定義這個角色的性別
"LeftHandedOverride": false, //定義是不是左撇子
"CustomName": "Kiwi Von Hohenzollen", //角色的名字,基本上可以利用這個找到想修改的角色
```
這段定義角色名字與性別

```json
//這一整段是定義這個角色的外型
"Doll": {
                    "$id": "644",
                    "Gender": "Male",
                    "RacePreset": "7f4584a1e1ad4135aef72ebd41462271",
                    "EquipmentEntityIds": ["ee_head_face02_m_dp", "ee_eyebrows_face03_m_dp", "24c5b0a90952b8843a93ec33feacb78b", "ee_facialandhair_empty_u_dp"],
                    "EntityRampIdices": [{
                            "Key": "24c5b0a90952b8843a93ec33feacb78b",
                            "Value": 1
                        }, {
                            "Key": "ee_naked_m_dp",
                            "Value": 2
                        }, {
                            "Key": "ee_head_face02_m_dp",
                            "Value": 2
                        }, {
                            "Key": "ee_facialandhair_empty_u_dp",
                            "Value": 1
                        }, {
                            "Key": "ee_eyebrows_face03_m_dp",
                            "Value": 1
                        }
                    ],
                    "EntitySecondaryRampIdices": [],
                    "LeftHanded": false,
                    "ClothesPrimaryIndex": 31,
                    "ClothesSecondaryIndex": 19
                },
```
這段定義角色的3D model也就是紙娃娃的外型,定義了種族,身體,頭,髮型,鬍子等
```json
//這段是定義對應的Pet UUID
"m_Pet": {
                    "m_UniqueId": "81851e9f-0723-4290-91ab-3cd29ab6e731"
                },
```

與

```json
//這是定義主人
"Master": {
                    "m_UniqueId": null
                },
```

是要對應的,也就是說主人定義的Pet要定義pet角色的UUID, 而Pet的Master段要定義主人的UUID

這樣才不會有問題

```json
"Blueprint": "4391e8b9afbb0cf43aeba700c089f56d",
```

在`"Descriptor"`階層下的'Blueprint是指這個角色的UUID,要注意對應階層的角色

###### 相關作法

+ Pet角色的UUID不能使用原先遊戲檔案內藍圖創好的UUID,例如直接copy某NPC的UUID,這樣會因為UUID重複的關係產生錯誤

+ 為了有一個獨特的UUID,建議可以另外開一個新檔案,然後使用遊戲的角色建立工具建立新角色後

  再把該角色的`UUID`, `doll section`,`m_CustomPortrait` copy對應到想要的Pet對應位置去
  
+ 最後要確認的是所有Copy的條目內若有`id`的都不能跟文件內的其他id重複,可以不照順序增加就好了

###### 後遺症

這個方法改出來的角色不知道為什麼都沒穿衣服...應該是沒看到衣服的定義區塊後面有找到再更新

