---
title: 網路監控系統 - Librenms
tags:
  - VM
  - Container
  - FreeBSD
date: 2026-09-04
---
# 網路監控系統 - Librenms

> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![Docker](https://img.shields.io/badge/Docker-Supported-green?style=plastic&logo=docker)

>:::tip
>很久很久以前,我曾經使用過MRTG+SNMP做流量圖表,但是隨著去中國這幾年家裡的Server逐步變成會動就好的超低標準,就沒管了,最近因為大整理所以就想再弄一個類似的,於是挑了Librenms
>

<img src='https://img.shields.io/badge/Kiwi-%E5%85%B6%E5%AF%A6%E9%80%99%E7%8E%A9%E6%84%8F%E9%82%84%E6%98%AF%E5%8F%AF%E4%BB%A5%E5%BC%84%E5%95%A6%2C%E4%B8%8D%E9%81%8E%E7%8F%BE%E5%9C%A8%E6%88%91%E5%BE%88%E6%87%B6%E7%9A%84%E5%BC%84%E9%80%99%E4%BA%9B%E7%9B%A3%E6%8E%A7%E9%A1%9E%E7%9A%84%E6%9D%B1%E8%A5%BF-A8FF24?style=social&logo=kiwix&logoColor=EA7500' height='40' />

# 參考資料

[莫莫 雜記 - Docker LibreNMS安裝記錄(含MariaDB、PhpMyAdmin)](https://www.dotblogs.com.tw/Mokmoe/2021/04/13/Docker_LibreNMS)

其實他寫的很詳細,照著做就好了,不過我還是把我稍微調整過的做法寫在下面

# 基本做法

## MariaDB

1. <font size="+1" color="Green"><code>vi mariadb.yml</code></font>

```yml
# mariadb.yml
--------------------------------------------------------------------------------------------------------------------------------
services:
  mariadb:
    image: mariadb:latest
    container_name: mariadb
    environment:
      - MYSQL_ROOT_PASSWORD=${your_DB_root_Passwd}
      - TZ=Asia/Taipei
    ports:
      - ${your_DB_host}:${your_DB_port}:3306
    volumes:
      - /var/lib/docker/volumes/mariadb/data:/var/lib/mysql
      - /var/lib/docker/volumes/mariadb/mariadbcustom.cnf:/etc/mysql/conf.d/custom.cnf
    restart: unless-stopped
```

2. <font size="+1" color="Green"><code>vi  /var/lib/docker/volumes/mariadb/mariadbcustom.cnf </code></font>

```bash
# /var/lib/docker/volumes/mariadb/mariadbcustom.cnf 
--------------------------------------------------------------------------------------------------------------------------------
[client]
default-character-set = utf8mb4

[mysql]" >> /etc/my.cnf
default-character-set = utf8mb4

[mysqld]
skip-character-set-client-handshake
collation_server = utf8mb4_unicode_ci
character_set_server = utf8mb4
tmpdir      = /var/lib/mysqltmp
```

這個是用來定義MariaDB的預設,都使用utf-8 unicode

3. <font size="+1" color="Green"><code>sudo docker-compose -f mariadb.yml up -d</code></font>

這個是用來建立container & run

4. <font size="+1" color="Green"><code>sudo docker exec -it mariadb bash</code></font>

```bash
# @mariadb container
--------------------------------------------------------------------------------------------------------------------------------
mysql -u root -p                    # 輸入後鍵入你的sql root密碼進入mariadb

#建立librenms用的帳號,資料庫以及授予這個帳號對這個資料庫的全部權限,不喜歡用指令的人也可以用phpAdmin來進行
mysql> CREATE DATABASE librenms CHARACTER SET utf8 COLLATE utf8_unicode_ci;
mysql> CREATE USER 'librenms'@'%' IDENTIFIED BY 'user_librenms_password';
mysql> GRANT ALL PRIVILEGES on librenms.* TO 'librenms'@'%' WITH GRANT OPTION;
mysql> FLUSH PRIVILEGES;
```

## Librenms

1. <font size="+1" color="Green"><code>vi librenms.yml</code></font>

```yml
#librenms.yml
--------------------------------------------------------------------------------------------------------------------------------
version: '3'
services:
  librenms:
    image: librenms/librenms:latest
    container_name: librenms
    command: su - librenms -c "/opt/librenms/librenms-service.py -v"
    environment:
      - TZ=Asia/Taipei
      - PUID=1000
      - DB_HOST=${your_DB_host}
      - DB_PORT=${your_DB_port}
      - DB_NAME=librenms
      - DB_USER=librenms
      - DB_PASSWORD=user_librenms_passwd
      - DB_TIMEOUT=10
      - LIBRENMS_SNMP_COMMUNITY=${Community_name_you_want}
    ports:
      - ${your_Server_ip}:${port_you_want}:8000
    volumes:
      - /var/lib/docker/volumes/librenms/data:/data
    restart: always
```

這裡有個關鍵的一步就是務必要加上

<font size="+2" color="blue"><code>command: su - librenms -c "/opt/librenms/librenms-service.py -v"</code></font>

這個的意思是以<font color="blue">librenms</font>這個帳號執行<font color="blue"><code>/opt/librenms/librenms-service.py -v</code></font>

這樣他的rrd權限才會正確,不然會有問題(我之前就是信了這是optional所以一直弄不好,這個是必要條件...)

2. <font size="+1" color="Green"><code>sudo docker exec -it mariadb bash</code></font>

```bash
 #進入mariadb container
--------------------------------------------------------------------------------------------------------------------------------
mysql -u librenms -p                    #以librenms帳號登入mariadb

mysql> use librenms;                        #使用librenms資料庫
#修改資料庫資料
mysql> ALTER TABLE `notifications` CHANGE `datetime` `datetime` timestamp NOT NULL DEFAULT '1970-01-02 00:00:00' ; 
mysql> ALTER TABLE `users` CHANGE `created_at` `created_at` timestamp NOT NULL DEFAULT '1970-01-02 00:00:01' ;
```

這個是修正database issue(Validata Config裡的問題修正)

## 同場加映 - phpAdmin

這個玩意老實說用不太到,但是針對不喜歡mysql指令的人可以用這個圖形介面來操作mysql database

因為他很單純,所以直接用`docker run`指令建立就可以了

```bash
# 若你的${your_DB_host}=3306
sudo docker run --name phpmyadmin -d -e PMA_HOST=${your_DB_host} -p 8080:80 phpmyadmin/phpmyadmin

# 若你的${your_DB_host}不是預設的3306,建議用docker --link來連結
sudo docker run --name phpmyadmin -d --link mariadb:db -p 8080:80 phpmyadmin/phpmyadmin
```

這裡的8080port是對外的可以改成你想要的

## Nginx設定

老實說,要改成子目錄的方式,得去修改container內的config.php我覺得這個太麻煩了,所以我就跑去再申請一個DN專門來用

Nginx的設定就是普通的virtual host設定法,只要在`/etc/nginx/site-enables/後面再加上一個cnf檔定義一下就好了

記得要另外申請一下certbot的憑證給這個 DN使用

```bash
# librenms.cnf
--------------------------------------------------------------------------------------------------------------------------------
server {
 listen 80;
 server_name librenms.exsample.com;
 return 301 https://$server_name$request_uri;
}
server {
 listen 443 ssl http2;
 server_name librenms.exsample.com;

 ssl_certificate /etc/letsencrypt/live/librenms.exsample.com/fullchain.pem;
 ssl_certificate_key /etc/letsencrypt/live/librenms.exsample.com/privkey.pem;
# include /etc/letsencrypt/options-ssl-nginx.conf;
# ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;


#charset koi8-r;
 #access_log /var/log/nginx/host.access.log main;

client_max_body_size 20M;


location / {
 proxy_pass http://${your_Server_ip}:${port_you_want};            #這裡改成要轉發的ip/port
 proxy_set_header Host $host;
 proxy_set_header X-Real-IP $remote_addr;
 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 proxy_set_header X-Forwarded-Proto $scheme;
 proxy_set_header X-Forwarded-Protocol $scheme;
 proxy_set_header X-Forwarded-Host $http_host;
 proxy_buffering off;

        }

error_page 500 502 503 504 /50x.html;
 location = /50x.html {
 root /usr/share/nginx/html;
```

# SNMP for clients

## FreeBSD

請參考Wiki的 FreeBSD Section

## VMware ESXi 6.5

### 參考資料

[黃昏的甘蔗](https://blog.xuite.net/tolarku/blog/465843932-ESXi+%E9%96%8B%E5%95%9F%E8%88%87%E8%A8%AD%E5%AE%9A+SNMP+)

[天黑的時候星星就會出現](https://sc8log.blogspot.com/2016/12/esxi-snmp.html)

1. <font size="+1" color="Green"><code>ssh登入Esxi後</code></font>

```bash
esxcli system snmp get                                    # 確認snmp狀態與設定值
esxcli system snmp set -c YOUR_STRING                    # 設定你的community
esxcli system snmp set -p 161                            # 設定你的snmp port,基本上都是使用161 udp
esxcli system snmp set -L "City, State, Country"        # 設定你的Location
esxcli system snmp set -C noc@example.com                # 設定你的聯絡人
esxcli system snmp set -e yes                            # 設定啟用
```

2. <font size="+1" color="Green">到其他可以讀snmp的機器上執行<code>snmpwalk -v2c -c ${YOUR_STRING} ${your_server_IP}</code></font> 

確認有沒有資料就好了

# 結論

* Community若不想修改librenms內的 config.php的話建議不要用public以外的字串,這樣找起來比較方便
* 這些要開啟後至少幾個小時後才會有明顯的圖示,不要太緊張,也沒辦法一設好就馬上有資料



# 廢棄原因

* 使用率低 - 裝好後幾乎沒用過

* 有其他代替品如`netdata`,但是我又直接裝在Gateway跟DHCP上,所以用途就更少了