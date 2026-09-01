---
slug: GAME/PS2/Berwick/pnach
title: pnach for PCSX2
date: 2026-09-01
description: ティアリングサーガシリーズ ベルウィックサーガの改造コードfor PCSX2
tags:
  - Game
  - PS2
  - SLG
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

| ゲーム番号      | ゲーム名前                         | CRC      |
| ---------- | ----------------------------- | -------- |
| SLPS-25496 | ティアリングサーガシリーズ ベルウィックサーガ DXパック |          |
| SLPS-25497 | ティアリングサーガシリーズ ベルウィックサーガ [通常版] | 2FCA8492 |

|ジャンル|[シミュレーションRPG](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%AB%E3%83%97%E3%83%AC%E3%82%A4%E3%83%B3%E3%82%B0%E3%82%B2%E3%83%BC%E3%83%A0 "シミュレーションロールプレイングゲーム")|
|---|---|
|対応機種|[PlayStation 2](https://ja.wikipedia.org/wiki/PlayStation_2 "PlayStation 2")|
|開発元|[ティルナノーグ](https://ja.wikipedia.org/wiki/%E3%83%86%E3%82%A3%E3%83%AB%E3%83%8A%E3%83%8E%E3%83%BC%E3%82%B0_\(%E3%82%B2%E3%83%BC%E3%83%A0%E4%BC%9A%E7%A4%BE\) "ティルナノーグ (ゲーム会社)")|
|発売元|[エンターブレイン](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%96%E3%83%AC%E3%82%A4%E3%83%B3 "エンターブレイン")|
|人数|1人|
|発売日|[2005年](https://ja.wikipedia.org/wiki/2005%E5%B9%B4 "2005年")[5月26日](https://ja.wikipedia.org/wiki/5%E6%9C%8826%E6%97%A5 "5月26日")  <br>2005年[12月1日](https://ja.wikipedia.org/wiki/12%E6%9C%881%E6%97%A5 "12月1日")(PS2 the Best)|

<!--truncate-->

gametitle=ティアリングサーガシリーズ ベルウィックサーガ (Japan) [SLPS-25497]

[資金MAX]
patch=1,EE,21EC52E4,extended,000F423F
patch=1,EE,202918A8,extended,00000000

[等級相關\レベル上限解除]
patch=1,EE,20174824,extended,10000002

[等級相關\経験値16倍]
patch=1,EE,20224598,extended,0803F803
patch=1,EE,200FE00C,extended,8E360008
patch=1,EE,200FE010,extended,00139900
patch=1,EE,200FE014,extended,08089167

[等級相關\レベルUP時にレベル上がらないけどステータスは上がる]
patch=1,EE,20224658,extended,24050000
patch=1,EE,2022465C,extended,00000000

[等級相關\レベルUP時にレベル上がらないけどステータスは上がる R2でオン、L2でオフ]
patch=1,EE,D0503A42,extended,0000FDFF
patch=1,EE,20224658,extended,24050000
patch=1,EE,D0503A42,extended,0000FDFF
patch=1,EE,2022465C,extended,00000000
patch=1,EE,D0503A42,extended,0000FEFF
patch=1,EE,20224658,extended,0C05D154
patch=1,EE,D0503A42,extended,0000FEFF
patch=1,EE,2022465C,extended,3053003F

[等級相關\レベルアップ後ステータスUP***(完全版)]
patch=1,EE,202239C8,extended,14000000
patch=1,EE,202239E0,extended,10000011
patch=1,EE,2022361C,extended,14000000

[等級相關\レベルアップ後技能ALLUP***(NEW)]
patch=1,EE,2022361C,extended,14000000

[等級相關\レベルアップ後ステータスALLUP***(完全版)]
patch=1,EE,2022390C,extended,1000002F
patch=1,EE,202239E0,extended,10000011
patch=1,EE,2022361C,extended,14000000

[能力上升\戦闘後ステータスUP]
patch=1,EE,20223890,extended,10000019
patch=1,EE,202238F8,extended,3C100044
patch=1,EE,202239C8,extended,14000000
patch=1,EE,202239E0,extended,10000011
patch=1,EE,2022361C,extended,14000000

[能力上升\戦闘後ステータス全部UP]
patch=1,EE,20223890,extended,10000019
patch=1,EE,202238F8,extended,3C100044
patch=1,EE,2022390C,extended,1000002F
patch=1,EE,202239E0,extended,10000011
patch=1,EE,2022361C,extended,14000000

[能力上升\戦闘後必ずLvUP L1戦闘後必ずLvUP R1通常モード]
patch=1,EE,D0503A42,extended,0000F7FF
patch=1,EE,20224580,extended,0040982D
patch=1,EE,D0503A42,extended,0000FBFF
patch=1,EE,20224580,extended,24130064

[能力上升\通常よりクラススキル覚えやすくなる]
patch=1,EE,2022475C,extended,00042200

[撃破数\捕縛すると撃破数が100になる]
patch=1,EE,201744D0,extended,1080000D
patch=1,EE,201744D4,extended,0000102D
patch=1,EE,201744DC,extended,1060000A
patch=1,EE,201744E0,extended,0000102D
patch=1,EE,201744E4,extended,8C62001C
patch=1,EE,201744E8,extended,24020064
patch=1,EE,201744EC,extended,AC62001C

[撃破数\撃破数カウント量]
patch=1,EE,20223F40,extended,24420001

[掠奪\誰でも略奪]
patch=1,EE,203F97F4,extended,10000004

[掠奪\略奪射程無限]
patch=1,EE,203F97A8,extended,10000003

[捕縛大作戦]
patch=1,EE,2022CD64,extended,14000000
patch=1,EE,2022CDA0,extended,00000000

[裝備\超上級装備]
patch=1,EE,2017A5FC,extended,00000000
patch=1,EE,2017A604,extended,2631FFCE

[裝備\全装備の精度変化]
patch=1,EE,2016A0EC,extended,6042000A

[店のアイテム\店のアイテム１～８個目　耐久無限]
patch=1,EE,1052BB06,extended,00000000
patch=1,EE,1052BB0E,extended,00000000
patch=1,EE,1052BB16,extended,00000000
patch=1,EE,1052BB1E,extended,00000000
patch=1,EE,1052BB26,extended,00000000
patch=1,EE,1052BB2E,extended,00000000
patch=1,EE,1052BB36,extended,00000000
patch=1,EE,1052BB3E,extended,00000000

[店のアイテム\店のアイテム一個目を変更 L2で1+、R2で-1]
patch=1,EE,D0503A42,extended,0000FEFF
patch=1,EE,30100001,extended,0052BB04
patch=1,EE,D0503A42,extended,0000FDFF
patch=1,EE,30200001,extended,0052BB04

[店のアイテム\收集品\ブラッドナイフ-アサシンダガー（アサシン）-妖刀アルバトロス-妖刀アルバトロス-帝国騎士丸盾-将軍の盾]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,00000013
patch=1,EE,2052BB0C,extended,00000016
patch=1,EE,2052BB14,extended,00000045
patch=1,EE,2052BB1C,extended,0000004A
patch=1,EE,2052BB24,extended,0000015C
patch=1,EE,2052BB2C,extended,00000180

[店のアイテム\收集品\ガルフォーク-カーリーアクス-司教の腕輪-司教の腕輪-煉獄の腕輪-飛竜の鱗]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000007D
patch=1,EE,2052BB0C,extended,000000A9
patch=1,EE,2052BB14,extended,000000AD
patch=1,EE,2052BB1C,extended,000001BD
patch=1,EE,2052BB24,extended,000001C0
patch=1,EE,2052BB2C,extended,000001CB

[店のアイテム\收集品\ダークヒール-スリープ-ヘルウォーム-スキュラ-ブラックメティオ-三連射弓]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000011D
patch=1,EE,2052BB0C,extended,0000011E
patch=1,EE,2052BB14,extended,00000118
patch=1,EE,2052BB1C,extended,00000115
patch=1,EE,2052BB24,extended,0000011B
patch=1,EE,2052BB2C,extended,000000D0

[店のアイテム\短劍\ポイズンダガー-クロタロス-ナルコーゼ-サクス-クリテカルナイフ-ルーンナイフ-シーフダガー-スタンナイフ]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,00000002
patch=1,EE,2052BB0C,extended,00000005
patch=1,EE,2052BB14,extended,00000006
patch=1,EE,2052BB1C,extended,00000008
patch=1,EE,2052BB24,extended,00000009
patch=1,EE,2052BB2C,extended,0000000A
patch=1,EE,2052BB34,extended,0000000B
patch=1,EE,2052BB3C,extended,0000000E

[店のアイテム\短劍-劍\リターンダガー-スリープダガー-カラドヴルフ-ボルトナイフ-短劍予備 (1+a/1/10/1/F)-カリスソード-ラーゼタール-デヴァインソード]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000000F
patch=1,EE,2052BB0C,extended,00000012
patch=1,EE,2052BB14,extended,00000014
patch=1,EE,2052BB1C,extended,00000015
patch=1,EE,2052BB24,extended,0000001E
patch=1,EE,2052BB2C,extended,00000027
patch=1,EE,2052BB34,extended,0000003D
patch=1,EE,2052BB3C,extended,00000031

[店のアイテム\劍-大劍\バルムンク-サクシード-センシュアル-ツヴァイハンダー-グレートソード-ブリムランガー-ロードグラム-神剣ヴリトラ]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000004B
patch=1,EE,2052BB0C,extended,0000003E
patch=1,EE,2052BB14,extended,0000005A
patch=1,EE,2052BB1C,extended,00000033
patch=1,EE,2052BB24,extended,00000034
patch=1,EE,2052BB2C,extended,00000037
patch=1,EE,2052BB34,extended,00000039
patch=1,EE,2052BB3C,extended,0000003A

[店のアイテム\劍-槍\イグニートソード-クリームヒルト-ハルペリア-アドラスティア-ジャベリン-ドラゴンランス-ヴォーダンの槍-ブリューナク]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,00000059
patch=1,EE,2052BB0C,extended,0000005B
patch=1,EE,2052BB14,extended,0000005C
patch=1,EE,2052BB1C,extended,0000005D
patch=1,EE,2052BB24,extended,00000063
patch=1,EE,2052BB2C,extended,0000006F
patch=1,EE,2052BB34,extended,0000008D
patch=1,EE,2052BB3C,extended,0000008E

[店のアイテム\槍-斧\フォラージュ-ウインドスピア-カエルムスピア-エウシュフロネ-ハルバード-グレートアクス-マオザウルフ-タバルジン]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000006D
patch=1,EE,2052BB0C,extended,00000071
patch=1,EE,2052BB14,extended,00000072
patch=1,EE,2052BB1C,extended,00000074
patch=1,EE,2052BB24,extended,00000077
patch=1,EE,2052BB2C,extended,000000A1
patch=1,EE,2052BB34,extended,000000A2
patch=1,EE,2052BB3C,extended,000000BC

[店のアイテム\斧-弓\トールハンマー-グルヴェイグ-グレートボウ-バスカニオン-セレニアの弓-魔弓アベイロン-聖弓ロスヴァイセ-アーバレスト]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,000000BD
patch=1,EE,2052BB0C,extended,000000BF
patch=1,EE,2052BB14,extended,000000C7
patch=1,EE,2052BB1C,extended,000000C8
patch=1,EE,2052BB24,extended,000000CB
patch=1,EE,2052BB2C,extended,000000D6
patch=1,EE,2052BB34,extended,000000D7
patch=1,EE,2052BB3C,extended,000000DC

[店のアイテム\弓-魔法\ブレンクロスボウ-スナイパーボウ-ホークアイ-オティヌスの弩-ドーラ-スコーピオン-パラスセレニア-パラスリアナ]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,000000DF
patch=1,EE,2052BB0C,extended,000000E0
patch=1,EE,2052BB14,extended,000000E5
patch=1,EE,2052BB1C,extended,000000EF
patch=1,EE,2052BB24,extended,000000F4
patch=1,EE,2052BB2C,extended,000000F6
patch=1,EE,2052BB34,extended,00000108
patch=1,EE,2052BB3C,extended,0000010F

[店のアイテム\魔法\アースブレイズ-パラスレイア-ブレンサンダー-パラスセレニア-サンダーストーム-暗預備(全迴避+ペリアオンペリア無效)-ジャヌーラ-レンジヒール]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,000000FF
patch=1,EE,2052BB0C,extended,00000100
patch=1,EE,2052BB14,extended,00000107
patch=1,EE,2052BB1C,extended,00000108
patch=1,EE,2052BB24,extended,00000113
patch=1,EE,2052BB2C,extended,00000119
patch=1,EE,2052BB34,extended,00000120
patch=1,EE,2052BB3C,extended,0000012A

[店のアイテム\魔法\エリアヒール-ヒールⅡ-キュアヒール-エスケープ-予備(ラーズオンラーズ無効化)-予備((精神+20)+神聖技能％　回復)-スターライト-予備(魔防＋７)]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000012B
patch=1,EE,2052BB0C,extended,0000012E
patch=1,EE,2052BB14,extended,0000012F
patch=1,EE,2052BB1C,extended,00000130
patch=1,EE,2052BB24,extended,00000133
patch=1,EE,2052BB2C,extended,00000134
patch=1,EE,2052BB34,extended,00000136
patch=1,EE,2052BB3C,extended,0000013D

[店のアイテム\魔法-盾\予備(ALL サイレス)-予備(ワープ)-カリスシールド-シャインシールド-ベルシーダ-フォルエンデン-アイアスの盾-ドラゴンシールド]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000013E
patch=1,EE,2052BB0C,extended,00000141
patch=1,EE,2052BB14,extended,0000014F
patch=1,EE,2052BB1C,extended,00000151
patch=1,EE,2052BB24,extended,00000152
patch=1,EE,2052BB2C,extended,0000015D
patch=1,EE,2052BB34,extended,00000160
patch=1,EE,2052BB3C,extended,00000169

[店のアイテム\盾-矢\盾予備-グレートシールド-邪神の盾-盾予備-ミスリルの矢-致命の矢-眠りの矢-毒の矢]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000017D
patch=1,EE,2052BB0C,extended,0000017F
patch=1,EE,2052BB14,extended,00000184
patch=1,EE,2052BB1C,extended,00000185
patch=1,EE,2052BB24,extended,00000197
patch=1,EE,2052BB2C,extended,00000198
patch=1,EE,2052BB34,extended,00000199
patch=1,EE,2052BB3C,extended,0000019A

[店のアイテム\矢\雷神の矢-馬殺の矢-スナイプアロー-貫きの矢-破盾の矢-ヒートアロー-フリーズアロー-鋼鉄の矢＋]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000019B
patch=1,EE,2052BB0C,extended,0000019C
patch=1,EE,2052BB14,extended,0000019D
patch=1,EE,2052BB1C,extended,0000019E
patch=1,EE,2052BB24,extended,0000019F
patch=1,EE,2052BB2C,extended,000001A3
patch=1,EE,2052BB34,extended,000001A4
patch=1,EE,2052BB3C,extended,000001A6

[店のアイテム\矢-護符\矢預備(命中+20)-新型バリスタの矢-祈りの護符-奇跡の護符-癒しの護符-盗賊の護符-流星の護符-月光の護符]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,000001A8
patch=1,EE,2052BB0C,extended,000001A9
patch=1,EE,2052BB14,extended,000001B2
patch=1,EE,2052BB1C,extended,000001B3
patch=1,EE,2052BB24,extended,000001B5
patch=1,EE,2052BB2C,extended,000001B6
patch=1,EE,2052BB34,extended,000001B7
patch=1,EE,2052BB3C,extended,000001B8

[店のアイテム\護符-道具\太陽の護符-無双の腕輪-預備(死亡攻擊無效)-リペアストン-歸還的魔石-消失的魔石-タルサの額飾り-黑鐵作的強固盔甲]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,000001B9
patch=1,EE,2052BB0C,extended,000001C1
patch=1,EE,2052BB14,extended,000001C2
patch=1,EE,2052BB1C,extended,000001DD
patch=1,EE,2052BB24,extended,000001F1
patch=1,EE,2052BB2C,extended,000001F2
patch=1,EE,2052BB34,extended,000001F3
patch=1,EE,2052BB3C,extended,000001E6

[店のアイテム\道具\携帯袋-持有就有潛行效果,騎乘時無效-整備的手引書-リース專用,使用後取得指揮官II-可以裝特殊道具的袋子-魔神的戒指-睡眠豎琴-俘虜]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,000001DA
patch=1,EE,2052BB0C,extended,000001FD
patch=1,EE,2052BB14,extended,000001FE
patch=1,EE,2052BB1C,extended,000001FF
patch=1,EE,2052BB24,extended,00000204
patch=1,EE,2052BB2C,extended,00000281
patch=1,EE,2052BB34,extended,00000282
patch=1,EE,2052BB3C,extended,0000027F

[店のアイテム\藥水\ポーションⅢ-キュアポーション-筋力の秘薬-守りの秘薬-速さの秘薬-体力の秘薬-精神の秘薬-道具預備(喝下取得強健技能)]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,000001CF
patch=1,EE,2052BB0C,extended,000001D7
patch=1,EE,2052BB14,extended,000001D2
patch=1,EE,2052BB1C,extended,000001D3
patch=1,EE,2052BB24,extended,000001D4
patch=1,EE,2052BB2C,extended,000001D5
patch=1,EE,2052BB34,extended,000001D6
patch=1,EE,2052BB3C,extended,000001D8

[店のアイテム\素材\太陽のかけら-セリカ鋼-灼熱の粉-ミスリル板-バロールの魔眼-リュコスの皮-アルゲントゥム-シノン鋼]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,00000215
patch=1,EE,2052BB0C,extended,00000216
patch=1,EE,2052BB14,extended,00000217
patch=1,EE,2052BB1C,extended,00000218
patch=1,EE,2052BB24,extended,0000021A
patch=1,EE,2052BB2C,extended,0000021B
patch=1,EE,2052BB34,extended,0000021C
patch=1,EE,2052BB3C,extended,0000021E

[店のアイテム\素材\グラース鋼-隕鉄-トネリコの木-ノトス鉄-ティリアの木-アマルガム水銀-黒曜石-パンタスマ鋼]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000021F
patch=1,EE,2052BB0C,extended,00000221
patch=1,EE,2052BB14,extended,00000222
patch=1,EE,2052BB1C,extended,00000223
patch=1,EE,2052BB24,extended,00000224
patch=1,EE,2052BB2C,extended,00000226
patch=1,EE,2052BB34,extended,00000227
patch=1,EE,2052BB3C,extended,00000228

[店のアイテム\素材\レーヴェの皮-アンティロブの皮-雷光のかけら-ユグドの木-風塵のかけら-シュティアの皮-アークサファイア-ミスリルの粉]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,00000229
patch=1,EE,2052BB0C,extended,0000022A
patch=1,EE,2052BB14,extended,0000022C
patch=1,EE,2052BB1C,extended,0000022D
patch=1,EE,2052BB24,extended,0000022E
patch=1,EE,2052BB2C,extended,0000022F
patch=1,EE,2052BB34,extended,00000230
patch=1,EE,2052BB3C,extended,00000231

[店のアイテム\素材\ティグリスの皮-ブラッドルビー-スィムルグの羽-シュヴァインの皮-ラピスラズリ-光の聖石-ソーマの薬剤-ペジュタ草]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,00000232
patch=1,EE,2052BB0C,extended,00000233
patch=1,EE,2052BB14,extended,00000234
patch=1,EE,2052BB1C,extended,00000235
patch=1,EE,2052BB24,extended,00000237
patch=1,EE,2052BB2C,extended,00000238
patch=1,EE,2052BB34,extended,00000239
patch=1,EE,2052BB3C,extended,0000023A


[店のアイテム\素材\イチイの木-アリアドネの糸-ヴンダアウィンチ-スチールヴァイン-古代の呪符-スラブの体液-白金-オパール]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000023C
patch=1,EE,2052BB0C,extended,0000023F
patch=1,EE,2052BB14,extended,00000240
patch=1,EE,2052BB1C,extended,00000243
patch=1,EE,2052BB24,extended,00000245
patch=1,EE,2052BB2C,extended,00000246
patch=1,EE,2052BB34,extended,00000248
patch=1,EE,2052BB3C,extended,00000249


[店のアイテム\素材\レッドルビー-ペルダン砂金-琥珀-ドラゴンパール-やせた馬-普通の馬]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,0000024A
patch=1,EE,2052BB0C,extended,0000024B
patch=1,EE,2052BB14,extended,0000024C
patch=1,EE,2052BB1C,extended,0000024D
patch=1,EE,2052BB24,extended,00000266
patch=1,EE,2052BB2C,extended,00000267


[店のアイテム\馬\丈夫な馬-頑丈な馬-イシス白馬-シノン馬-リガ黒馬-リガ駿馬-モラキア軍馬-イシス駿馬]
patch=1,EE,0052BB00,extended,00000008
patch=1,EE,2052BB04,extended,00000268
patch=1,EE,2052BB0C,extended,00000269
patch=1,EE,2052BB14,extended,0000026A
patch=1,EE,2052BB1C,extended,0000026B
patch=1,EE,2052BB24,extended,0000026C
patch=1,EE,2052BB2C,extended,0000026D
patch=1,EE,2052BB34,extended,0000026E
patch=1,EE,2052BB3C,extended,0000026F









