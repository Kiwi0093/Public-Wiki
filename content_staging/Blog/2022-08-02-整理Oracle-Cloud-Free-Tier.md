---
title: 整理Oracle Cloud Free Tier
date: 2022-08-02
tags:
  - Linux
  - Life
  - Old-Blog
slug: 2022/08/sort+OCI+free
description: 免錢的也是要顧
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 前言

<ruby><font  color="lightblue"><del>回顧系列</del></font><rp>(</rp><rt><font  color="red">薪水小偷</font></rt><rp>)</rp></ruby>之免費白嫖仔戰記 ～～ 擺弄OCI - Part.I(不一定會有Part.II)

<!--truncate-->

# 故事大綱

## 前情提要

前幾天在擺弄機器的時候（這個措辭有點糟糕！？）發現現在主要提供服務的那台白嫖VPS非常欠缺RAM..於是就想把主意打到那台一直沒用的ARM Base VPS

## 戲肉

### 重建

其實我也不知道之前那個系統怎麼亂搞的..連Traefik對應的功能都怪怪的，於是我就賞了系統一發終結然後又重建了台一模一樣規格的（其實本來是想拆成兩台X86的..但是看到那精美的4Gbps網路,跟24GB RAM我又不爭氣的選下去了）

### 插曲

途中我發現它可以建立四張網路卡，於是高潮的建了四張，然後絕望的發現只能有兩個`public IP`於是又砍掉兩個，接著又發現有兩個IP會導致Traefik亂掉....於是又砍掉一個...

## Service搬遷

其實最大的收穫就是我發現`Traefik`真的是很萬金油，它所reverse的網址跟他自己的Domain可以完全沒關係....真的很厲害，於是我就在使用者沒感覺的前提下把服務搬走但是Domain沒改....

# 結論

雖然很方便可以無痛的把服務搬走，但是代價就是我原來靠機器DN分類整理好的各`docker-compose.yml`就變成亂七八糟了，雖然我最終還是依照機器的host分開整理了（東西放在private repo內別人又看不到是講個毛線）