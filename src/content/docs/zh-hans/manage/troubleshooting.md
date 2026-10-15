---
title: 故障排查
description: 壁挂面板常见的问题，以及应先检查什么。
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

先查看 Home Assistant 中的面板设备，它提供状态传感器和可下载的诊断信息；同时查看面板自身地址的 8888 端口上的状态页面。该页面的 `/diag` 报告无需猜测就能回答下方大多数问题。

如果需要实时查看面板正在做什么，该页面的**日志**标签页会实时传输面板应用自身的日志，并遮盖令牌和密码。

![面板网页界面的日志标签页，显示面板应用的实时日志，带有筛选框以及跟随和暂停控件](/screenshots/ui-logs-dark.png)

## 仪表盘空白、只显示一部分，或出现大量脚本错误

先检查系统 WebView。这是首次运行时最常见的故障，远超其他原因。旧版 WebView 恰好会造成这些症状，却看起来像面板应用出错。操作步骤见 [更新系统 WebView](/zh-hans/hardware/guides/update-the-webview/)。

如果 WebView 已是最新版本，[启动与恢复](/zh-hans/manage/built-in-renderer/#startup-and-recovery)一节说明了仪表盘加载失败时面板会如何处理，以及如何查看原因。

## 仪表盘响应缓慢

原因可能来自面板，也可能来自仪表盘。[性能](/zh-hans/manage/performance/)说明了面板状态页面可以测量什么，以及通常哪些措施有帮助；[硬件参考](/zh-hans/hardware/)对受支持面板进行了性能排序，帮助你判断是否超出了硬件能力。

## 安装程序无法访问面板

通过网络安装时：确认面板地址，并确认 TCP 端口 5555 上的网络 ADB 仍然开启，因为有些面板会在重启后再次关闭它。如果面板出现授权提示，请在面板屏幕上接受。通过 USB 安装时：确认使用的是基于 Chromium 的浏览器，线缆连接的是运行浏览器的电脑，并且已开启 USB 调试。各型号进入开发者选项和开启调试的方式不同，详见 [准备面板](/zh-hans/install/prepare-a-panel/)和 [硬件页面](/zh-hans/hardware/)。如果面板始终无法接受网络连接，请改为 [通过 USB 安装](/zh-hans/install/install-over-usb/)：面板无需网络 ADB，但浏览器仍需连接到 Home Assistant 以获取经过验证的发布版本。

## Home Assistant 中缺少面板的硬件

如果部分实体出现，而另一些没有，通常是该型号的硬件配置文件所致，而非连接问题。[硬件页面](/zh-hans/hardware/)说明了每台面板提供哪些实体。

## 其他问题

如果本站或其链接的参考文档中没有答案，请在 [集成的问题区](https://github.com/panel-assistant/ha-integration/issues)提问；涉及面板应用本身的问题，请在 [ha-paneld 的问题区](https://github.com/panel-assistant/android/issues)提问。请附上面板型号、面板设备页面显示的版本，以及下载的诊断信息，因为回答问题首先需要这三项信息。诊断信息已经过脱敏，但公开发布前仍请通读一遍，删除任何残留的、可识别面板、网络或 Home Assistant 配置的信息。
