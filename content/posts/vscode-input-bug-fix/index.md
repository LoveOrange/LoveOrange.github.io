---
title: "修复 VSCode、Cursor 输入中文时字符颤抖问题"
slug: vscode-input-bug-fix
description: 解决 VSCode 与 Cursor 输入中文时 editor 文字颤抖问题
date: 2024-11-16T07:34:33+08:00
draft: true
image:
math: false
hidden: false
categories:
  - dev tools
tags:
  - dev tools
---

## 1. 引言

讲一个最近遇到的问题。在 VSCode 和 Cursor 输入中文时，editor 的文字一直在颤抖。日常写注释时影响不大，但是在写 Blog 的时候，大量的中文输入，而文字一直颤抖，体感很差。

## 2. 解决

搜了一些资料以及尝试后，发现问题出现在 Vim 插件上，卸载或禁用 Vim 插件后，问题不再复现。

参考：[VSCode 输入中文时 editor 文字颤抖](https://github.com/microsoft/vscode/issues/184666)

但是对于 Vim 星人来说，不使用 Vim 几乎不会打字了，那么介绍两种另外的解决办法。

### 2.1. 方案一：修改 VSCode 配置

上述 Issue 中给出了解决方案，在 VSCode 配置中添加以下配置：

```json
"editor.experimentalEditContextEnabled": true
```

重启后即可生效。

但是 Cursor 中没有这个配置，因此我们继续探索另外的解决办法。

### 2.2. 方案二：使用 NeoVim 插件

对于 Vim，我更多的需求是使用 Vim 的键位，那么找一个能够提供 Vim 键位的插件即可，这里我选择的是 [NeoVim](https://marketplace.visualstudio.com/items?itemName=asvetliakov.vscode-neovim)。

除了插件外，还需要安装 NeoVim 客户端，可以使用 Homebrew 安装：

```bash
brew install neovim
```

同样重启后生效。

## 3. 其他的问题：无法连续移动光标

安装好 NeoVim 后，发现了另一个问题，按住 `hjkl` 时，无法持续移动光标，效率很差。

这里涉及到一个 MacOS 的问题。MacOS 中有一个默认的按键重复限制，对于特定按键来说，按住时会显示字符选择框。可以在终端中针对特定的应用禁用。

VSCode 禁用方法：

```bash
defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false
```

这里的 `com.microsoft.VSCode` 是 VSCode 的 Bundle ID。

Cursor 的 Bundle ID 不像 VSCode 这么统一，可以使用以下命令查询：

```bash
osascript -e 'id of app "Cursor"'
```

我显示的 Bundle ID 是 `com.todesktop.230313mzl4w4u92`，因此禁用命令为：

```bash
defaults write com.todesktop.230313mzl4w4u92 ApplePressAndHoldEnabled -bool false
```

需要强制退出 VSCode 和 Cursor 后生效，`⌘ + Q` 一下吧。

至此，VSCode 与 Cursor 的输入问题解决，继续开心的码代码吧～
