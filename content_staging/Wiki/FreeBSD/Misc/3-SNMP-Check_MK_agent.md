---
title: SNMP & Check_MK_agent
tags:
  - FreeBSD
date: 2026-04-21
---


> <img src='https://img.shields.io/badge/Status-Obsolete-red?style=for-the-badge&labelWidth=100' height='38' />

![FreeBSD](https://img.shields.io/badge/FreeBSD-Supported-green?style=plastic&logo=freebsd) 

### Librenms需要SNMP才能監控,另外也可以使用check_mk_agent來輔助

:::info 
但是我現在已經沒在用Librenms,也許哪天想不開又要用的時候會裝上
:::

<!--truncate-->

# 參考資料

[柯仓无居所](http://swimming.leanote.com/post/FreeBSD%E4%B8%8B%E5%AE%89%E8%A3%85check_mk_agent)

# bsnmp

FreeBSD有內建的bsnmp

1. <font size="+1" color="Green"><code>vi /etc/rc.conf</code></font>

```bash
# /etc/rc.conf
--------------------------------------------------------------------------------------------------------------------------------
bsnmpd_enable="YES"
```

2. <font size="+1" color="Green"><code>pkg install bsnmp-ucd</code></font>
3. <font size="+1" color="Green"><code>vi /etc/snmpd.conf</code></font>

```bash
# /etc/snmpd.conf 加上以下內容
--------------------------------------------------------------------------------------------------------------------------------
begemotSnmpdModulePath."ucd" = "/usr/local/lib/snmp_ucd.so"
%ucd
updateInterval = 500
extCheckInterval = 100
extUpdateInterval = 3000
extTimeout = 60

memMinimumSwap = 1600
memSwapErrorMsg = "No free swap!"

laConfig.1 = "6.0"
laConfig.2 = "5.0"
laConfig.3 = "4.0"

laErrMessage.1 = "1min load average is high!"
laErrMessage.2 = "5min load average is high!"
laErrMessage.3 = "15min load average is high!"

# Process table

prNames.0 = "httpd"
prMin.0 = 3
prMax.0 = 100

prErrFix.0 = 1
prErrFixCmd.0 = "/usr/local/etc/rc.d/apache22 restart"

# Extension commands (extTable)

extNames.0 = "uname"
extCommand.0 = "/usr/bin/uname -a"

extNames.1 = "uptime"
extCommand.1 = "/usr/bin/uptime"

# example of extension with fix command
extNames.2 = "apache"
extCommand.2 = "/usr/local/etc/rc.d/apache status"
extErrFix.2 = 1
extErrFixCmd.2 = "/usr/local/etc/rc.d/apache restart"
```

4. <font size="+1" color="Green"><code>/etc/rc.d/bsnmpd restart</code></font>
5. <font size="+1" color="Green"><code>bsnmpwalk -v 2c -c public</code></font>

確認有取得資料就是OK了

# check_mk_agent

## pre-install needed

```bash
pkg install bash ipmitool libstatgrab git
```

因為check_mk_agent需要用bash跑,沒有bash是不會動的

## Install and setup

1. <font size="+1" color="Green"><code>取得check_mk_agent & 賦予執行權限</code></font>

```bash
git clone https://github.com/librenms/librenms-agent.git
cp librenms-agent/check_mk_agent_freebsd /usr/local/bin/check_mk_agent
chmod +x /usr/local/bin/check_mk_agent
```

上述的方法過時了..因為現在port裡面就有支援

`/usr/ports/net-mgmt/check_mk_agent/`

```bash
cd /usr/ports/net-mgmt/check_mk_agent/
make install clean
```



2. <font size="+1" color="Green"><code>vi /etc/services </code></font>

```bash
# /etc/services
--------------------------------------------------------------------------------------------------------------------------------
check_mk        6556/tcp   #check_mk agent
```

這個是加進去的

3. <font size="+1" color="Green"><code>vi /etc/inetd.conf</code></font>

```
#/etc/inetd.conf
--------------------------------------------------------------------------------------------------------------------------------
check_mk  stream  tcp nowait  root  /usr/local/bin/check_mk_agent check_mk_agent
```

這個也是加進去的

3. <font size="+1" color="Green"><code>vi /etc/rc.conf</code></font>

```bash
#/etc/rc.conf
--------------------------------------------------------------------------------------------------------------------------------
inetd_enable=yes
inetd_flags=-wW
```

這個也是加進去的

4. <font size="+1" color="Green"><code>vi /etc/hosts.allow</code></font>

```bash
#/etc/hosts.allow
--------------------------------------------------------------------------------------------------------------------------------
# Allow nagios server to access us
check_mk_agent : 192.168.56.3 : allow
check_mk_agent : ALL : deny
```

這個也是加進去

5. <font size="+1" color="Green"><code>/etc/rc.d/inetd start</code></font>

6. <font size="+1" color="Green"><code>telnet確認一下</code></font>

```bash
telnet bsdhost 6556
<<<check_mk>>>
Version: 1.1.13i1
AgentOS: freebsd
```

這樣就好了

## 結論

雖然我不是很喜歡開inetd來跑,不過這些機器跟port基本上都用FW限制死了連線,加上librenms架在裡面,所以問題應該沒有那麼大

勉強還是可以這樣用的