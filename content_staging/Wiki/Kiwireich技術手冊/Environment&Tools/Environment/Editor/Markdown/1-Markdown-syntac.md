---
title: Markdown 語法全攻略
tags:
  - Markdown
---
# Markdown 語法全攻略

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

:::tip
很久以前當我剛開始寫Blog的時候,~~曾經把我常用的語法整理過一遍~~(找不到了),但是最近看到一些騷操作就想拿出來獨立整理一篇
:::

過去在撰寫技術部落格（如 Docusaurus、Obsidian 或 Typora）時，Markdown 是記錄筆記與知識庫的核心語法。除了標準的排版規範外，透過混搭 HTML 標籤可以實現許多進階的視覺效果。本篇將完整梳理從基礎語法到進階 HTML 技巧。

## 一、 基礎語法篇 (Basic Syntax)

現代 Markdown 編輯器（如 Typora）多數支援即時預覽與快捷鍵，但掌握原生標記能確保在任何 Wiki 平台上都能完美渲染。

### 1. 標題文字 (Headings)

對應 HTML 的 `<h1>` 至 `<h6>`，共有六種尺寸階層：

# `#` H1 標題

## `##` H2 標題

### `###` H3 標題

#### `####` H4 標題

##### `#####` H5 標題

###### `######` H6 標題

### 2. 分隔線 (Dividers)

可使用三個以上的星號、減號或加號來建立水平分隔線：

```markdown
---
***
+++
```

### 3. 超連結 (Links)

標準的錨點文字與網址連結寫法：

```markdown
[標題](http網址)
```

_效果：_ [Kiwi's Wiki]([https://kiwi0093.github.io/Wiki-site/](https://kiwi0093.github.io/Public-Wiki/docs)	"WIKI知識庫") 

### 4. 文字效果 (Text Styles)

支援斜體、粗體、刪除線及其混合搭配：

|語法1|語法2|效果|
|:-:|:-:|:-:|
|\*斜體\*|\_斜體\_| *斜體*|
|\**粗體\**|\__粗體\__|**粗體**|
|\***粗斜體\***|\___粗斜體\___|***粗斜體***|
|\~~刪除\~~||~~刪除~~|

### 5. 列表 (Lists)

- **無序清單**（使用 `*`、`-` 或 `+` 效果完全相同）：
    
    
   ```markdown
    * 第一項
    * 第二項
    * 第三項
   ```
    
- **有序清單**：
    
    
   ```markdown
    1. 第一項
    2. 第二項
    3. 第三項
   ```
    
    _(註：數字編號即使顛倒，多數編輯器也會自動正確排序)_
    

### 6. 圖片與多媒體連結

- **一般圖片：**
    
    
   ```bash
    ![Alt text](/path/to/img.jpg)
   ```
    
- **巢狀影音連結（例如將 YouTube 縮圖包裝成可點擊的超連結）：**
    
    
   ```markdown
    [![影片標題](http://img.youtube.com/vi/SlzBMJvtGHo/0.jpg)](https://www.youtube.com/watch?v=SlzBMJvtGHo "影片提示")
   ```

	效果(如youtube範例)
	[![Dr.Berg的斷食說明](http://img.youtube.com/vi/SlzBMJvtGHo/0.jpg)](https://www.youtube.com/watch?v=SlzBMJvtGHo "斷食體內變化")

## 二、 進階使用篇：Markdown 混搭 HTML 騷操作

Markdown 的核心設計允許直接嵌入 **HTML 語法**。當需要更精細的排版、顏色控制或特殊標記時，可以將 HTML 標籤包覆在 Markdown 中。

> **⚠️ 注意事項：** 當在 `<>` 標籤內使用 HTML 語法時，內部結構建議全面採用 HTML 格式（例如用 `<font>` 或 `<del>` 代替 `**`），避免解析器發生衝突。

### 1. 文字裝飾與底線

Markdown 原生並未直接支援底線（避免與超連結混淆），需透過 HTML 的 `<u>` 標籤實現：

| 語法           | 效果         |
| :--------------: | :------------: |
| \<u>底線\</u>      | <u>底線</u> |
|\<del>刪除\</del>|<del>刪除</del>|

### 2. 自訂字體顏色 (`<font>`)

透過 `<font color="...">` 可以自由改變字體顏色，適合在技術筆記中標註重點：

| 語法                                | 顯示結果 | 語法                                | 顯示結果 |
| :------------------: | :-------: | :------: | :-------: |
| `<font color="#800000">酒紅色</font>` | <font color="#800000">酒紅色</font>   | `<font color="#FF0000">紅色</font>`   | <font color="#FF0000">紅色</font>     |
| `<font color="#FF6600">橘色</font>`   | <font color="#FF6600">橘色</font>     | `<font color="#FFD700">金色</font>`   | <font color="#FFD700">金色</font>     |
| `<font color="#FFFF00">黃色</font>`   | <font color="#FFFF00">黃色</font>     | `<font color="#00FF00">綠色</font>`   | <font color="#00FF00">綠色</font>    |
| `<font color="#008000">墨綠色</font>` | <font color="#008000">墨綠色</font>   | `<font color="#00FFFF">青色</font>`   | <font color="#00FFFF">青色</font>     |
| `<font color="#0000FF">深藍色</font>` | <font color="#0000FF">深藍色</font>   | `<font color="#FF00FF">粉紅色</font>` | <font color="#FF00FF">粉紅色</font>  |
| `<font color="#800080">紫色</font>`   | <font color="#800080">紫色</font>     | `<font color="#808080">灰色</font>`   | <font color="#808080">灰色</font>     |

### 3. 上標與下標 (`<sup>` / `<sub>`)

適合用於數學公式、化學式或版本標示：

|語法|效果|
|:-:|:-:|
|3\<sup>2\</sup>=9|3<sup>2</sup>=9|
|H\<sub>2\</sub>O|H<sub>2</sub>O|

### 4. 特殊數學與常用符號實體

透過 HTML 實體代碼（Entity References）直接插入特殊符號：

|   目標    |       語法       |      效果       |
| :-----: | :------------: | :-----------: |
|   商標    |     \&reg;     |    商標&reg;    |
| 函數 ƒ(x) | \&fnof;(X)=X+1 | &fnof;(X)=X+1 |
|   根號    |   \&radic;2    |   &radic;2    |
|   度數    |    45\&deg;    |    45&deg;    |

### 5. 漢字注音標示 (`<ruby>`)

利用 HTML5 的 `<ruby>`、`<rt>`（注音/拼音）與 `<rp>`（相容不支援瀏覽器的括號）標籤來製作注音夾註：

```markdown
<ruby>
注<rp>(</rp><rt>ㄓㄨˋ</rt><rp>)</rp>
音<rp>(</rp><rt>ㄧㄣˉ</rt><rp>)</rp>
</ruby>
```

_效果：_ <ruby>注<rp>(</rp><rt>ㄓㄨˋ</rt><rp>)</rp>音<rp>(</rp><rt>ㄧㄣˉ</rt><rp>)</rp></ruby>

**實戰應用範例（技術搞笑混搭）：** 可在註記中結合色彩與刪除線，打造雙層語意：

```markdown
我很喜歡 <ruby><font color="blue"><del>我家的艦隊</del></font><rp>(</rp><rt><font color="red">VMware ESXi</font></rt><rp>)</rp></ruby>
```

_效果：_ 我很喜歡 <ruby><font color="blue"><del>我家的艦隊</del></font><rp>(</rp><rt><font color="red">VMware ESXi</font></rt><rp>)</rp></ruby>

# 參考文獻

[西灣筆記](https://xiwan.io/archive/markdown-html-common-syntax-summary.html)
[馬力歐的部落格](https://ed521.github.io/2019/08/hexo-markdown/)