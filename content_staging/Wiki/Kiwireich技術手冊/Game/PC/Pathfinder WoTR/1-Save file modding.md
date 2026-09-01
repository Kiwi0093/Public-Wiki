---
title: Pathfinder:WoTR - Save Modding Intruduce
date: 2021-11-01
tags: [Game,PC-Game,RPG]
---

# 前言

上一代的Pathfinder:Kingmaker的時候已經搞過一次，這次也不免俗也要改一下

<!--more-->

# 主要變更

## 最多可以有六個跟班？（每個正常角色）

經過測試有以下三種共六個跟班可以改出來

* Animal Companion

​        每種動物的動物夥伴都是獨立的Feat, 搞不好可以每種帶一隻？？（不過還沒測試）

* MythicSkeleton
  *  Archer
  * Dual Wielder
  * Tank
  * Two-Handed
* Azata Dragon Companion

## 基本原理

要帶的小弟,需要滿足三個條件就可以帶

* Feature defined
* m_pet defined
* m_master defined

也就是說這一代不是單純定義主人與寵物關係就可以變成寵物,還需要有配套的feat,雖然還是有限制,但是比起上一代只能定義一個 m_pet來的放寬了

# Save檔編輯

## Save檔所在位置

`C:\Users\{Username}\AppData\LocalLow\Owlcat Games\Pathfinder Wrath Of The Righteous\Saved Games`

因為`AppData`是隱藏目錄.所以需要手動進入

記錄檔為`*.zks`可以當作一般的Zip解開,解開後的檔案有兩個重點檔案

+ party.json

  這個檔案紀錄了整個隊伍裡面每一個角色(包括隊友跟寵物)的資訊,我們想要變更跟班的外貌與種族請編輯這個

+ player.json

  這個檔案主要是紀錄主角的一些訊息

## 工具
### Windows
#### Editor
推薦使用[notepad++](https://notepad-plus-plus.org/downloads/)
#### 整理Json File
使用Notepad++的extension - [Jstool](https://www.sunjw.us/jstool/npp/)Plug-in,再讀入json file的時候可以利用Jstool裡的JSFormat功能把json對齊成好看的樣子

### Linux
#### Editor
推薦使用Notepadqq
#### 整理Json File

```bash
cat <file> | python -m jstool | > <new file>
```

這個指令要注意file&new file要用不同的檔名才不會有問題

# 其他所需

* Unity ModManager
* ToyBox Mod - 需要assign相關feat給主角以及後續的跟班升級與裝備
