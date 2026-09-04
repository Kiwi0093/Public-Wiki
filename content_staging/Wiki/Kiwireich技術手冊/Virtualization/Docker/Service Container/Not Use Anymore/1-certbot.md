---
title: 自動簽署SSL Certification - certbot
tags:
  - VM
  - Container
date: 2026-09-04
---
# 自動簽署SSL Certification - Certbot

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

>:::tip
>雖然可以用這個方法來代直接安裝certbot,不過後來用方Nginx Proxy Manager
>:::

<img src='https://img.shields.io/badge/Kiwi-%E5%9B%A0%E7%82%BA%E5%BE%8C%E4%BE%86%E9%83%BD%E7%94%A8Traefik%E6%88%96%E6%98%AFNPM%E6%89%80%E4%BB%A5%E4%B8%8D%E7%94%A8%E8%87%AA%E5%B7%B1%E7%B0%BD%E4%BA%86-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

# Certbot

##### Install

參考[Certbot的Doc](https://certbot.eff.org/docs/install.html#running-with-docker)

```bash
sudo docker run -it --rm --name certbot -v "/etc/letsencrypt:/etc/letsencrypt" -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
            certbot/certbot certonly
```

想要對於指定IP有不同Domain的話可以再加上`-p 你要的ip:80:80 -p 你要的ip:443:443`這一個參數這樣就可以對應了

##### Auto Renew

在crontab裡面加上

```bash
0 0 * * * docker run --rm -v /etc/letsencrypt:/etc/letsencrypt -ti certbot/certbot renew
```

就好了



# 廢棄理由

用不上了..現在都是使用含自動簽發SSL的reserve proxy,如traefik或nginx proxy manager所以就不需要這個這麼純的東西了
