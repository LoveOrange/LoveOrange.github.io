---
title: "Xray 自动安装脚本"
slug: index
description: 感谢 Claude 的大力支持。
date: 2025-12-28T09:04:01+08:00
draft: false
image: xray-install-head.png
math: false
hidden: false
categories:
  - efficiency
  - network
tags:
  - efficiency
  - network
---

## 1. 前言

写一个 Xray 自动安装脚本需要多久？如果让我自己写的话，可能是「一辈子」。倒不是脚本有多难写，而是每次安装也就十几分钟，一年也就折腾个一两次，一旦折腾成功，就失去了些脚本的动力。

好在有我最好的朋友 Claude，如果不是它的话，我估计这辈子我也写不完这个脚本，而且再看看人家的脚本质量，啧啧，我下辈子也写不出来。

## 2. 术语

这个脚本希望可以让没有技术知识的普通用户也可以快速搭建起自己的服务器，因此在安装流程上做了很多优化，但是依然有一些术语需要了解一下，避免看到后面仍然一头雾水。

- Shadowsocks，V2Ray，Xray，Hysteria 2：这些都是常见的科学上网工具，不需要了解太多细节，只需要知道它们可以让我们看到更大的世界。
- GitHub，Git：GitHub 是世界上最大的代码托管平台，会有很多人的代码上传到平台上。代码是区分版本的，而 Git 就是常用来管理代码版本的工具。GitHub 上的代码就是使用 Git 来管理的。
- VPS(Virtual Private Server)：虚拟私人服务器，简单来说就是租用的一台远程服务器，可以用来搭建各种服务。
- IP 地址：互联网协议地址，每台连接到互联网的设备都会有一个唯一的 IP 地址，用来在互联网上找到指定的 IP。
- Domain 域名：IP 地址不具备可读性，通过将域名绑定到 IP 上，可以让用户更容易记住和访问网站。
- DNS：域名系统，用于记录域名与 IP 的对应关系。

## 3. 方案选型

我的折腾路线基本上是 Shadowsocks -> V2Ray -> Xray -> Hysteria 2 -> Xray。从搭建上来看，Hysteria 2 是最简单的，但是之前的 Hysteria 2 服务器断联的十分频繁，不确定是 Hysteria 2 的问题还是机器的问题，同样的机器跑 Xray 就稳定了不少，因此最终还是用回了 Xray。

当然 Xray 的配置会更麻烦一些，尤其是按照官方的「[小小白话文]()」中的流程，手慢的话估计要配置个半个小时，这也是考虑自己写自动化脚本的初衷了。

本文的附录中也会提供一些我使用的 VPS 供应商和域名注册商，供大家参考。

## 4. 功能

**1. 自动安装**

最基本的目标就是实现自动安装 Xray，除了一些必要的配置外，尽量减少用户的输入。最终目前来看，必须输入的内容基本就只有：

1. 域名
2. 用户邮箱，用于申请 TLS 证书

**2. 绕开 AI 服务商限制**

很多 AI 网站都会限制用户的 IP，尤其是 Claude，基本上不允许使用 VPS IP 访问它们的网站，因此脚本需要实现绕开这些限制的功能。

当然想要绕开这些限制，除了 VPS 之外，还需要提供一个静态的 ISP 地址，后文会介绍如何获取这个地址。

这是个可选功能，如果启用的话，需要手工配置：

1. 静态 ISP 地址
2. 端口
3. 用户名
4. 密码

以上内容都由静态 ISP 提供商提供。

## 5. 前置条件

### 5.1. 购买 VPS

科学上网本质通过一个「中间商」，将原本我们访问不了的网站，通过中间商来访问。在互联网中，这个「中间商」就是 VPS 服务器。

从上述的描述中也能看到，为了完成流量的中转，我们需要保证：

1. 我们可以访问到用来转发流量的 VPS
2. VPS 可以访问到我们想要访问的网站

基本上海外 VPS 都能满足第二点，我们只需要在购买的时候，使用 VPS 供应商提供的测试 IP，看看我们能否 `ping` 通即可。在「终端」中执行以下命令进行测试：

```bash
ping 中间商提供的测试 IP
```

### 5.2. 购买域名

购买域名可以让我们更加方便地访问我们的 VPS，同时也可以通过搭建伪装网站的方式，来隐藏我们的科学上网服务。

脚本中会自动让我们的服务器反向代理到 Hacker News 网站，从而实现伪装。我们只需要考虑购买域名即可。

购买域名后，还需要将域名解析到 VPS 的 IP 地址上。一般的域名注册商也会提供 DNS 解析服务，我们只需要在域名管理后台中添加一条「A」记录，将域名指向 VPS 的 IP 地址即可。

不建议使用国内的域名注册商。

### 5.3. 获取静态 ISP 地址（可选）

如上所述，如果需要绕开 AI 服务商的 IP 限制，我们还需要一个静态的 ISP 地址。这个按需选择即可，如果不需要使用 AI 服务，其实可以不需要准备静态 ISP。

一部分 AI 也不会像 Claude 那么严格，大部分的 VPS 都直接可用。但是需要注意，香港的 VPS 无法访问 ChatGPT。

_但是这个年代谁会不需要 AI 呢？_

除了解锁 AI 服务外，静态 ISP 也可以解锁流媒体服务，比如 Netflix，Hulu 等等。当前版本的脚本还没有集成这些功能，后续可能会考虑加入。

## 6. 搭建 Xray 服务

### 6.1. 登录机器

购买了 VPS 后，VPS 供应商会提供给我们以下信息：

1. IP 地址，格式为 xxx.xxx.xxx.xxx，后文我们以 123.45.678.90 为例
2. 用户名，一般为 root
3. 密码，一串复杂的字符串

我们在本地机器上打开「终端」应用，先通过 `ping` 命令测试一下能否连通 VPS。

```bash
ping 123.45.678.90
```

如果显示类似：

```
64 bytes from 123.45.678.90: icmp_seq=1 ttl=54 time=23.4 ms
```

就表示我们本地的网络可以访问到 VPS。不同的操作系统显示的可能不一样，但是有 time 字段基本上就表示可以连通。

之后，我们通过 `ssh` 命令登录到 VPS：

```bash
ssh root@123.45.678.90
```

系统会提示我们输入密码，输入密码后就可以登录到 VPS 上了。

不论我们敲多少字符，终端上都不会显示任何内容，这是一个安全特性，输入完成后直接按回车即可（也可以直接复制）。

第一次登录时，系统会提示我们是否继续连接，输入 `yes` 并回车即可。

### 6.2. 更新系统并且安装 Git

因为我们的脚本是从 GitHub 上拉取下来的，因此需要先安装 Git 工具。

登录到 VPS 后，首先我们需要更新一下系统，并且安装 Git。复制以下命令并回车执行：

```bash
apt update && apt upgrade -y
apt install git -y
```

### 6.3. 拉取脚本并且执行

接下来的内容与 GitHub 仓库中维护的基本一致。

```bash
git clone https://github.com/loveorangesad/xray-installer.git
cd xray-installer
sudo bash install.sh
```

执行过程中会提示我们输入一些必要的信息，按照提示输入即可。

如果提示信息中有被括号包围的内容，表示这是默认值，直接按回车即可使用默认值。

类似地，如果提示信息中有 `[y/N]`，表示这是一个 Yes/No 选项，输入 `y` 并回车表示选择 Yes，输入 `n` 并回车表示选择 No。大写的字母表示默认值，直接按回车即可。

需要注意的是，在执行脚本时，必须先绑定域名到 VPS 的 IP 地址，否则脚本会因为无法申请 TLS 证书而失败。

### 6.4. 完成安装

安装完成后，脚本会输出一些必要的信息：

```plaintext
================================================================================
                    XRAY CLIENT CONFIGURATION
                    Generated: Sat Dec 27 04:56:29 AM PST 2025
================================================================================

=== Server Information ===
Domain:         your-domain.com
Server IP:      123.45.678.90
Port:           443
Protocol:       VLESS
Security:       TLS
Network:        TCP

=== VLESS Settings ===
UUID:           asdf1234-asdf-1234-asdf-1234asdf1234
Flow:           xtls-rprx-vision
Encryption:     none

=== TLS Settings ===
SNI:            your-domain.com
ALPN:           http/1.1
Allow Insecure: false

=== Share Links ===

--- v2rayN / v2rayNG / Nekoray ---
vless://asdf1234-asdf-1234-asdf-1234asdf1234@your-domain.com:443?encryption=none&flow=xtls-rprx-vision&security=tls&sni=your-domain.com&alpn=http%2F1.1&type=tcp#Xray-TLS

--- Clash Meta / Stash ---
- name: "Xray-TLS"
  type: vless
  server: your-domain.com
  port: 443
  uuid: asdf1234-asdf-1234-asdf-1234asdf1234
  network: tcp
  udp: true
  tls: true
  flow: xtls-rprx-vision
  servername: your-domain.com
  client-fingerprint: chrome

--- Shadowrocket (iOS) ---
vless://asdf1234-asdf-1234-asdf-1234asdf1234@your-domain.com:443?encryption=none&security=tls&type=tcp&headerType=none&host=your-domain.com&sni=your-domain.com&flow=xtls-rprx-vision#Xray-TLS
--- Quantumult X ---
vless=your-domain.com:443, method=none, password=asdf1234-asdf-1234-asdf-1234asdf1234, obfs=over-tls, obfs-host=your-domain.com, tls-verification=true, fast-open=false, udp-relay=false, tag=Xray-TLS
```

关键的信息有：

1. 域名，这个是我们用来访问 VPS 的域名
2. UUID，这个是用来验证身份的密钥
3. VLESS 协议的配置信息。脚本默认会使用 VLESS 协议，并且开启 TLS 加密，流控方式为 `xtls-rprx-vision`，不同的客户端可能不一样，参考这个填写即可。

除了基本信息之外，为了简化使用，也会生成一些可以直接导入到客户端的链接，直接复制到对应的客户端中即可使用。以上的链接信息都在 「Share Links」部分。

### 6.5. 配置静态 ISP（可选）

如果开启了绕开 AI 限制的功能，脚本在安装过程中会提示我们输入静态 ISP 的相关信息：

1. 静态 ISP 地址
2. 端口
3. 用户名
4. 密码。与登录时一样，不论输入多少字符，终端上都不会显示任何内容，输入完成后直接按回车即可。

配置完成后，脚本会自动在配置文件中添加相应的配置项，不需要我们手动修改配置文件。

### 6.6. 验证安装结果

安装成功后，会输出「6.4. 完成安装」中的信息，我们可以通过这些信息来验证安装结果。

也可以采用手工的方式验证：

```bash
systemctl status xray
```

如果显示绿色的 `active (running)`，就表示 Xray 服务已经成功启动。

如果有问题，可以咨询一些 AI 的服务，或者再 GitHub 仓库中提交 Issue 寻求帮助。

## 7. 结语

我自己的实测，使用以上脚本后，除开购买域名和 VPS 的时间，整个安装过程大概只需要 5 分钟左右，远远低于手工安装的时间。还是很方便的。

后续我也会考虑提供一个 Web 界面自动生成配置，并且提供一些更加多样化的配置选项，比如解锁流媒体服务等等，敬请期待吧。

_不过是什么时候能，或者又是一辈子了吧......_

## 附录：一些我在用的资源

1. VPS 供应商推荐
   - [搬瓦工](https://bandwagonhost.com/)([推广链接](https://bandwagonhost.com/aff.php?aff=76049)) - 贵，有的机房速度很快
   - [VMISS](https://www.vmiss.com/)([推广链接](https://app.vmiss.com/aff.php?aff=3114)) - 便宜，速度还行
   - [Vultr](https://www.vultr.com/)([推广链接](https://www.vultr.com/?ref=7126266)) - 稳定，价格适中，推广链接需要 10 美金充值才有效果。可以在 [测速页面](https://osk-jp-ping.vultr.com/) 测试各个机房的访问效果。
2. 域名注册商推荐
   - [Godaddy](https://www.godaddy.com/) - 老牌注册商，价格适中
   - [Cloudflare](https://www.cloudflare.com/) - 服务多，除了域名之外还提供了很多高级玩法
3. 静态 ISP 提供商推荐
   - [Thordata](https://thordata.com/) - 忘了在哪里看到的了，能用，效果不错，能够正常使用 Claude，但是没有被 AI 推荐过

一些小的 Tips：

1. 非高峰期 VPS 一般都会有不错的速度，但是高峰期（晚上下班之后）可能比较慢，如果 VPS 供应商有提供测速页面，可以在高峰期测试一下速度。
2. 一般各种各样的厂商都会提供多种促销活动与优惠码，可以多留意一下。
