---
title: SSH的基本
tags:
  - SSH
date: 2026-09-02
---
# SSH的基本

> <img src='https://img.shields.io/badge/Status-Active-A8FF24?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 
![Archlinux](https://img.shields.io/badge/Arch_Linux-Supported-green?style=plastic&logo=archlinux)
![Photon_OS](https://img.shields.io/badge/Photon_OS-Supported-green?style=plastic&logo=linux) 
![Oracle_linux](https://img.shields.io/badge/Oracle_Linux-Supported-green?style=plastic&logo=linux)
![WSL](https://img.shields.io/badge/WSL-Supported-green?style=plastic&logo=linux) 
![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)


:::tip
現在要求用Key pair的SSH越來越多,不管是Git, Ansible或是Oracle Cloud的VM都會要求用Key pair來連線,所以就把相關的指令整理一下
:::

## SSH key Pair

## 參考資料

* [GTW - SSH 公開金鑰認證：不用打密碼登入 Linux 設定教學，安全又方便](https://blog.gtwang.org/linux/linux-ssh-public-key-authentication/)]

* [MIS腳印 - Windows 使用 SSH 金鑰免密碼登入 Linux](https://www.footmark.info/linux/centos/windows-ssh-nopassword-linux/)
  
  * Window工具 - [Putty](https://www.putty.org/), [Puttygen](https://www.puttygen.com/)

## 產生Key Pair

### Linux/FreeBSD console

基本指令是使用`ssh-keygen`指令但是基於使用方便可以加上一些參數來調整

```bash
# Basic from man ssh-keygen
ssh-keygen [-q] [-a rounds] [-b bits] [-C comment] [-f output_keyfile] [-m format] [-N new_passphrase] [-O option] [-t dsa | ecdsa | ecdsa-sk | ed25519 | ed25519-sk | rsa] [-w provider] [-Z cipher]
     ssh-keygen -p [-a rounds] [-f keyfile] [-m format] [-N new_passphrase] [-P old_passphrase] [-Z cipher]
     ssh-keygen -i [-f input_keyfile] [-m key_format]
     ssh-keygen -e [-f input_keyfile] [-m key_format]
     ssh-keygen -y [-f input_keyfile]
     ssh-keygen -c [-a rounds] [-C comment] [-f keyfile] [-P passphrase]
     ssh-keygen -l [-v] [-E fingerprint_hash] [-f input_keyfile]
     ssh-keygen -B [-f input_keyfile]
     ssh-keygen -D pkcs11
     ssh-keygen -F hostname [-lv] [-f known_hosts_file]
     ssh-keygen -H [-f known_hosts_file]sa 
     ssh-keygen -K [-a rounds] [-w provider]
     ssh-keygen -R hostname [-f known_hosts_file]
     ssh-keygen -r hostname [-g] [-f input_keyfile]
     ssh-keygen -M generate [-O option] output_file
     ssh-keygen -M screen [-f input_file] [-O option] output_file
     ssh-keygen -I certificate_identity -s ca_key [-hU] [-D pkcs11_provider] [-n principals] [-O option] [-V validity_interval] [-z serial_number] file ...
     ssh-keygen -L [-f input_keyfile]
     ssh-keygen -A [-a rounds] [-f prefix_path]
     ssh-keygen -k -f krl_file [-u] [-s ca_public] [-z version_number] file ...
     ssh-keygen -Q [-l] -f krl_file file ...
     ssh-keygen -Y find-principals [-O option] -s signature_file -f allowed_signers_file
     ssh-keygen -Y check-novalidate [-O option] -n namespace -s signature_file
     ssh-keygen -Y sign -f key_file -n namespace file ...
     ssh-keygen -Y verify [-O option] -f allowed_signers_file -I signer_identity -n namespace -s signature_file [-r revocation_file]

# 基本上會用的function大概就是幾個而已
-b 定義編碼長度, rsa預設是3072,其實很夠用了
-t 編碼方式, 有dsa | ecdsa | ecdsa-sk | ed25519 | ed25519-sk | rsa可以挑,一般教學都是推薦用rsa
-C 這個Comment可以定義對應的Email address
-f 可以定義out put的key pair名稱
```

 所以一般來說我都會這樣用

```bash
ssh-keygen -b 4096 -t rsa -f <server_or_service_name>
```

然後就會在`~/.ssh/`裡面產生`<server_or_service_name>` & `<server_or_service_name>.pub`兩個檔案

### Windows by Putty

![puttygen-generate](https://raw.githubusercontent.com/Kiwi0093/graph/master/img/puttygen-3.png)

基本上是一樣的在右下角設定好bits,確認是哪一種,然後按下Generate就會產生Private key跟Public Key

### 同場加映 - 在企鵝下的ppk->pem

因為時常會用Manjaro client,所以去查了一下, Manjaro安裝putty後就自動裝上puttygen了,所以不需要再安裝,使用Ubuntu/Debian的人還還需要裝上

```bash
#安裝Putty工具
apt install putty-tools
```

有了工具就轉檔

```bash
#把你的ppk檔轉成pem檔供ssh client直接使用
puttygen yourkey.ppk -O private-openssh -o yourkey.pem
```

轉好後就可以用以下指令登入

```bash
#使用pem登入
ssh -i /your/key/file user@hostname.or.ip
```

## Public Key @ Server side

這個有兩個方法可以做

### Simple Copy & Paste

直接把public key的內容貼到被登入帳號的`~/.ssh/authorized_keys`

可以利用vi編輯的時候複製貼上或是

```bash
cat <server_or_service_name>.pub >> ~/.ssh/authorized_keys
```

不過一般來說在做這件事的時候都會懶的先upload `<server_or_service_name>.pub`到目標server上,所以很少會這樣用

#### Putty Keygen轉換

因為Putty不吃一般的pem檔案,所以要轉換成ppk給`putty`從windows連線到sshd使用
![Puttygen-import](https://raw.githubusercontent.com/Kiwi0093/graph/master/img/puttygen-1.png)

讀進去後,可以加上自己的密碼

![Puttygen-save](https://raw.githubusercontent.com/Kiwi0093/graph/master/img/puttygen-2.png)

鍵入自己想要的密碼後Save as a ppk file就好了

### ssh-copy-id

```bash
ssh-copy-id -i ~/.ssh/<server_or_service_name>.pub USER@HOST
```

預設是`~/.ssh/id_rsa.pub`所以要用`-i`指令定義是哪個檔案

這樣就可以把public key弄上去,之後再去修改Server端的`sshd_config`把密碼登入關掉就好了

# sshd_config

除了client端的設定以外,其實server端也有不少要調整的

```bash
# 禁止Root帳號透過ssh登入
PermitRootLogin no
# 基本上都會建議設定要拒絕root的遠端登入,但是碰上使用ansible的時候就會覺得除了root帳號直接拿來用以外的方法都很麻煩...所以這裡要慎選

# 接受Public Key認證方式
PubkeyAuthentication yes

# 預設的Public Key位置檔名
AuthorizedKeysFile      .ssh/authorized_keys
# 這個其實是可以修改的,不過我都不會去改他

# 不使用Build-in的密碼認證系統也禁止空白密碼
PasswordAuthentication no
PermitEmptyPasswords no

# 禁止使用密碼認證登入
ChallengeResponseAuthentication no
UsePAM no

# 特定User的設定(這個整段只能放在sshd_config的最後面
Match <User1>, <User2>, ...
# 然後定義這些User的設定, 例如
    PasswordAuthentication yes
# 這樣就只有User1跟User2可以用密碼登入其他都不行
```

# SSH

其實這個很簡單就是

```bash
ssh USER@HOST
```

就可以用了,但是有指定的key的話就要加參數

```bash
ssh -i /location/private_key USER@HOST
```

因為是認Private key的,所以可以在常用的client主機上都放上一樣的private key來進行
