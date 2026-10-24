---
title: 更新与恢复
description: 让面板上的应用保持最新，以及出问题时可以恢复哪些内容。
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

## 更新面板

**通过 Home Assistant。**每台面板都有一个更新实体。新版本发布后，该实体会提供更新，只需按一下按钮即可安装；Panel Assistant 会安装更新，并确认面板已恢复正常运行。应使用这一途径。

只有在 Panel Assistant 或你明确请求时，更新才会开始。面板应用不会按计划安装更新。其网页界面的**安装**标签页也允许你选择并安装面板应用版本，包括预发布版本。所选版本只适用于你此次启动的安装；应用不会保存更新通道。

Android System WebView 单独维护，具体通过 Play Store、厂商固件或手动安装，取决于你的面板。请参阅 [更新系统 WebView](/zh-hans/hardware/guides/update-the-webview/)。

### 需要 ADB 的面板

从 Home Assistant 安装更新时，对于无法自行安装更新的面板，Panel Assistant 会自动使用 ADB。如果面板接受连接时无需在屏幕上点击，你最初同意安装 Panel Assistant 的授权也涵盖了创建和保存 ADB 密钥，以供今后更新使用。如果面板要求在屏幕上批准，Home Assistant 会创建一个注明该面板名称并启动授权的修复条目。请按照该修复条目的指引，在对应面板上批准提示。

### 无法更新的面板

有些面板无法自行安装应用，只能通过 ADB 更新。对于这些面板，ADB 并非只是方便之选，而是唯一的更新途径。如果它停止工作，面板仍会正常运行，却会悄然停留在当前版本。发生这种情况时，Home Assistant 会显示一个注明面板名称的修复条目。

通常是面板上的改动导致，而不是 Home Assistant 中的改动。厂商固件更新、恢复出厂设置，或恢复出厂软件的厂商选项，都可能重新关闭 Android 的开发者选项，连带关闭 ADB。当时不会出现任何警告，因为从面板的角度看，一切正常。

对于大多数面板，重新开启开发者选项和 USB 调试即可恢复更新途径，步骤与首次准备该面板时相同：请参阅 [准备面板](/zh-hans/install/prepare-a-panel/#1-developer-options-and-debugging-are-on)。不同面板进入这些设置的方式不同，有些厂商会将它们隐藏在“关于”页面的一连串点击操作之后。

如果修复条目仍然存在，或面板会自行关闭网络调试，例如 Meta Portal 重启后或 Shelly Wall Display 重置后，请用 USB 将面板连接到计算机，并从 Home Assistant 启动 USB 安装程序，具体参见 [通过 USB 安装](/zh-hans/install/install-over-usb/#从-home-assistant-中开始)。无需先移除任何内容：对于已有应用的面板，安装程序不会安装任何内容。如果面板询问，请勾选**始终允许使用这台计算机进行调试**，并点按**允许**；安装程序随后会重新开启网络调试，并提示 Panel Assistant 已能再次访问面板。之后 Home Assistant 会提供该面板的更新，更新会保留设置和历史记录。

如果 Home Assistant 还为该面板显示**允许更新……**，表示可以访问面板，但面板尚未接受此 Home Assistant。请打开该修复条目，或依次打开**设置**、**设备与服务**、**Panel Assistant**，选择面板的**配置**，再选择**允许更新**，然后在面板询问时点按**允许**。

## 更新会保护什么

Panel Assistant 在做出任何改动前都会检查面板，并在每次更新前备份面板设置，为每台面板保留最近五份备份。

在进行没有把握的改动之前，请自行备份：在面板网页界面打开**安装**，再打开**备份**，并保留下载的 `.hpb` 文件。

## 恢复

更新后仪表盘无法加载，通常是系统 WebView 或仪表盘自身的问题。面板为此提供了自身的 [启动与恢复](/zh-hans/manage/built-in-renderer/#startup-and-recovery)机制。[故障排查](/zh-hans/manage/troubleshooting/)介绍了常见原因。运行 1.0 面板应用的面板无法退回更早的发布版本；[升级到 1.0](/zh-hans/manage/upgrade-to-1-0/#going-back)说明了哪些部分可以退回旧版。

应用以下层级的恢复是另一回事。Panel Assistant 从不改动面板固件，但部分已取得 root 权限的面板可以手动备份和恢复固件分区，相关步骤见 [固件备份与恢复](/zh-hans/hardware/guides/firmware-backup-and-restore/)。

:::danger
固件恢复属于实验性功能，尚未在已变砖的设备上测试。对面板分区进行操作可能导致面板无法使用，请在开始前完整阅读该文档。
:::
