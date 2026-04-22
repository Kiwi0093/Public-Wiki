---
title: Photon OS在Kiwireich的角色
date: 2026-04-22
tags:
  - Linux
  - PhotonOS
  - Docker
---


> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />


![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)


## Main Role in Kiwireich

 * #### Docker Host

Photon OS是VMware的輕量container host用OS, 在VMware ESXi上因Kernel可以最佳化, 達到節約資源,以及榨乾效能的特點,在我的`Homelab`中主要是扮演Docker host的功能,由Docker來提供各種內部服務

## Major Service:

* #### Docker engine service

目前版本`VMware Photon OS 5.0`
