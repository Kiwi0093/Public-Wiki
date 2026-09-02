---
title: 使用ssh連線github
tags:
  - Git
date: 2026-09-02
---
# 使用ssh連線github

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 

:::tip
現在Github只吃ssh key的連線,不然就得用token...所以我還是把Key做了吧
:::

# 參考資料

* Expired time - [nixCraft Blog](https://www.cyberciti.biz/faq/linux-howto-check-user-password-expiration-date-and-time/)
* Complexity

# 沒有Key的狀態

就產生新的Key

```bash
ssh-keygen -t rsa -C "your@mail.for.github"
```

然後把產生的id_rsa.pub裡的資料貼到Github的 Setting -> SSH and GPG keys -> new ssh key

然後就可以了

# 已經有現成的Private key

```bash
eval `ssh-agent -s`
ssh-add /location/to/your/key
```

# 變更repo連線方式

```bash
vi /location/to/repo/.git/config
把裡面的
url = https://github.com/<USER>/Repo.git
改成
url = git@github.com:<USER>/Repo.git
```

然後就可以快樂的連線了



# 追加

雖然可以用

`ssh-add`把key加入使用，但是常常會有問題需要一直加入key，根本的解決方案就是讓key file為維持檔名id_rsa就可以直接用了....
