---
title: Party.json
date: 2021-11-04
tags:
  - Game
  - PC-Game
  - RPG
---

:::
在《正義之怒》中，`party.json` 是整個存檔的核心，記錄了隊伍中每一個角色（包含主角、NPC 隊友、傭兵與各類跟班）的所有數據。了解其底層的 JSON 結構，是進行任何高階修改（如自訂外觀、多重跟班綁定）的基礎。
:::

<img src='https://img.shields.io/badge/Kiwi-%E8%80%81%E5%AF%A6%E8%AA%AA%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8ToyBox%E6%AF%94%E8%BC%83%E5%BF%AB%E5%95%A6-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

## 🏗️ 1. 基本存檔結構 (Basic Structure)

打開 `party.json` 後，你會看到整個檔案被包裝在一個巨大的物件中。每個角色都是 `m_EntityData` 陣列（Array）裡的一個獨立區塊。

JSON

```
{
    "SceneName": "<cross-scene>",
    "HasEntityData": false,
    "m_EntityData": [
        { 角色 A 的完整資料 },
        { 角色 B 的完整資料 },
        { 角色 C 的完整資料 }
    ]
}
```

> 💡 **快速搜尋技巧**：
> 
> 在龐大的文件中，建議使用 `"m_GroupId": "<directly-controllable-unit>"` 作為搜尋關鍵字，這能幫你快速定位到玩家可控制的核心角色區塊。

## 🧩 2. 角色實體拆解 (UnitEntityData)

每一個角色的區塊都被宣告為 `UnitEntityData`。以下是該區塊內最重要的五大一級節點：

|**節點名稱**|**內容說明**|
|---|---|
|**`UniqueId`**|**角色的唯一身分證號碼**。位於該角色區塊的最底層（如 `"e51cd2f4-f8e6-..."`），在進行主從綁定時極為重要。|
|**`Parts`**|**附加組件區**。管理角色的 3D 外型 (Doll)、寵物主從關係 (Pet/Master)、Buff 狀態等。|
|**`Facts`**|**能力區**。角色的專長 (Feats)、技能 (Abilities) 都儲存在這裡。|
|**`Descriptor`**|**核心敘述區**。定義角色的名字、性別、2D 頭像、基礎屬性 (Stats) 與陣營。|
|**`Position`**|**座標**。角色在當前地圖上的 X/Y/Z 絕對位置。|

## 🔗 3. 主從關係綁定 (Parts: Pet & Master)

要讓系統承認跟班，必須在 `Parts` 區塊中進行「雙向綁定」。

### 主人端 (Master) 的設定

主人必須具備 `UnitPartPetMaster` 組件。若要增加多個跟班，請在 `"m_Pets"` 陣列中依序增加跟班的 UUID。

JSON

```
{
    "$type": "Kingmaker.UnitLogic.Parts.UnitPartPetMaster, Assembly-CSharp",
    "m_Pets": [
        { "m_Ref": "跟班A的-UUID" },
        { "m_Ref": "跟班B的-UUID" },
        { "m_Ref": "跟班C的-UUID" }
    ],
    "m_ExPets": []
}
```

### 跟班端 (Pet) 的設定

跟班必須具備 `UnitPartPet` 組件，並指回主人的 UUID。

JSON

```
{
    "$type": "Kingmaker.UnitLogic.Parts.UnitPartPet, Assembly-CSharp",
    "m_MasterRef": {
        "m_Ref": "主人的-UUID"
    },
    "Type": "MythicSkeletalChampion"
}
```

**WotR 支援的三大寵物類型 (`Type`)：**

- `AnimalCompanion` (常規動物夥伴)
- `MythicSkeletalChampion` (神話骷髏戰士)
- `DragonAzataCompanion` (靈使道途專屬龍伴)
    

## 👗 4. 外觀與紙娃娃系統 (Parts: Doll Data)

角色的 3D 模型外觀由 `UnitPartDollData` 組件控制。若要替換跟班外觀（尤其是骷髏變體），通常會修改這裡。

|**參數名稱**|**設定影響與說明**|
|---|---|
|**`EquipmentEntityIds`**|**外觀部件 UUID 陣列**。包含頭部、身體、髮型、鬍鬚等各部位的模型代碼。若有全遊戲的部件總表，可直接替換這裡的字串來變更長相。|
|**`EntityRampIdices`**|**顏色定義**。利用 Key (部件 UUID) 與 Value (色號代碼) 的對應，來決定膚色、髮色與細節顏色。|
|**`Gender`**|**外觀性別**。決定模型是使用男性骨架還是女性骨架 (`Male` / `Female`)。|
|**`RacePreset`**|**種族預設值**。決定基本體型與種族特徵（如精靈耳朵、矮人身高）。|
|**`ClothesPrimaryIndex`** / **`Secondary`**|**衣服主副顏色**。對應遊戲內的色盤代碼（整數值）。|

## 👤 5. 核心屬性宣告 (Descriptor)

`Descriptor` 是系統識別角色狀態的地方。尋找你要修改的跟班時，第一步就是來這裡看名字。

|**參數名稱**|**設定影響與說明**|
|---|---|
|**`CustomName`**|**顯示名稱**。遊戲內顯示的名字，支援輸入中文（如 `"烏緹卡"`）。|
|**`m_CustomPortraitId`**|**2D 頭像 ID**。對應遊戲資料夾內的自訂頭像（Custom Portrait）名稱。|
|**`CustomGender`**|**系統性別**。影響遊戲文本的代名詞（He/She）與部分裝備限制。與前述的 3D 外觀性別無直接綁定，可分開設定。|
|**`Alignment`** / **`Faction`**|陣營與派系判定。|

## ⚠️ 6. JSON 修改防呆守則 (Modding Rules)

手動編輯存檔極易因為語法錯誤導致遊戲讀檔崩潰，請務必謹記以下鐵則：

### 關於 ID 與參照 (`$id` & `$ref`)

- **`$id` (身分證發放)**：Owlcat 引擎會為每一個獨立的 JSON 節點分配一個 `$id`（如 `"$id": "2457"`）。這個數字**絕對不可與檔案內的其他 `$id` 重複**。若你複製了別人的區塊過來，請隨意修改這些數字（例如改成 `"992457"`），只要不重複即可，不需要照順序排列。
- **`$ref` (呼叫身分證)**：當系統需要引用已經宣告過的節點時，會使用 `"$ref": "2471"`。若你亂改了前面的 `$id`，記得同步檢查是否有 `$ref` 正在呼叫它。

### 標點符號的致命傷

1. **引號不可少**：所有的字串與 Key 值都必須用雙引號 `""` 包起來。
2. **逗號結尾**：同階層的元素之間必須用逗號 `,` 隔開。但**陣列或物件的「最後一個元素」後方絕對不能有逗號**。
3. **括號配對**：大括號 `{}` 用於定義物件 (Object)，中括號 `[]` 用於定義陣列 (Array)。漏掉任何一個都會導致解析失敗。強烈建議依賴 Notepad++ 的 Jstool 進行格式化檢查。

