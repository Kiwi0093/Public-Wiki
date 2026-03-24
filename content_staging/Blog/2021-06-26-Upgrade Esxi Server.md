---
title: Upgrade Esxi Server
date: 2021-06-26
tags: [Server, Life, Archive, Old-Blog]
slug: 2021/06/esxi-upgrade
description: 升級esxi
---

>  :::info 
> 本文轉載自舊站存檔。
> :::

# 艦隊升級計畫

從回到台灣後,持續的家裡Server維護/升級就一直沒停,終於到了該對主要Server的ESXi進行升級的時候了...


{/* 這裡插入切分線 */}
<!--truncate-->

# 升級ESXi

## 參考資料

這次的升級主要參考[師匠的經驗](https://roidintw.kaienroid.com/2020/09/vmware-esxi-upgrade-from-60-to-65-with.html)

不過他比較驚險沒有進入maintenance mode 就跑,我好歹還是有進maintenance mode去執行

## 檔案取得

首先先去登入你的My VMware,然後找VMware vSphere Hypervisor下載,雖然6.X目前有6.7版了,不過看了看都是ISO,於是我就只下載了6.5的**VMware vSphere Hypervisor (ESXi) Offline Bundle**

這是個zip檔,下載完後扔到esxi的datastorage裡面去就可以了

## 升級順序

### maintenance mode

這個很簡單,使用原來的client連上ESXi,然後選maintenance mode就好了

### 確認檔案位置

使用putty ssh login你的ESXi主機

```bash
ls /vmfs/volume/
```

你就會看到datastorage,你剛剛upload的ZIP就在裡面

### 確認Profile Image

```bash
esxcli software sources profile list -d /vmfs/volumes/$(your_volume)/$(your_file.zip)
```

你就可以看到他的profile image

### 升級

```bash
esxcli software profile update -d /vmfs/volumes/$(your_volume)/$(your_file.zip) -p $(profile-image)
```

他就會開始安裝一堆VIB,最後重開(這裡很討厭,因為他的shell不接受reboot或是shutdown指令,所以我去他的client上按reboot host)

 ### 升級重開後

改用web介面登入後記得去關閉maintenance mode,然後把你的VM該開的打開就好了

# 後續規劃

這波主要的升級原因還是想開始把家裡的幾個服務從獨立的Linux VM改成直接在Photon OS上跑docker,這樣一來可以比較省空間跟機器的效能

二來也減少跑服務的Linux安裝手順或是調教之類的

因此後續有幾個學習的方向需要再花時間

* Photon OS的使用
  * Photon OS多IP的設定
  * Photon OS shell變更與相關工具的安裝與調教(搞了半天還是得從Arch跳到Photon OS)
* Docker用法
  * 基本語法
  * Docker的活用方式
* 我到底要整合哪些服務在家裡跑

# 結語

其實最後的問題才是最大的問題,最近弄了Nextcloud但是覺得很雞肋,感覺用不太到,想說建一個Airsonic來當作音樂串流又覺得動力沒那麼大(這個主要是Nextcloud Music雖然可以用但是感覺一下子就卡住),抑或是來架設Emby(感覺也用不太到,因為現在大多數都是直接上串流平台)架設Calibre-web好像有搞頭一點但是這個也牽扯到後續要整理一大堆的電子書...想到就很累...