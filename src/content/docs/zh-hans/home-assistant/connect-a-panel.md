---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 连接面板
description: 在面板上显示仪表盘，以及面板自身的硬件如何呈现在 Home Assistant 中。
---

添加到 Home Assistant 后，面板通过两种方式与其连接：一种在屏幕上显示仪表盘，另一种将面板自身的硬件作为实体接入。

## 屏幕上的仪表盘

添加面板时，在面板的设置向导中选择仪表盘。以后如需更改，请在 Home Assistant 的面板设备页面选择 **访问**，打开其状态页面，然后选择另一个仪表盘。面板自行加载该仪表盘。[启用实体过滤](/zh-hans/manage/performance/)后，它会了解仪表盘使用哪些实体，并仅向 Home Assistant 请求这些实体。[内置渲染器](/zh-hans/manage/built-in-renderer/)页面介绍了仪表盘的加载方式以及加载失败时面板的处理方式。

## Home Assistant 中的面板硬件

您的型号配备的屏幕、LED、按钮、传感器和继电器会在 Home Assistant 中作为面板设备上的实体呈现。因此，实体按钮可以触发自动化，LED 也可以指示任何对象的状态。具体提供哪些实体取决于该型号的硬件配置文件；[硬件页面](/zh-hans/hardware/)说明了各款面板提供的实体。

## 面板的状态页面

在 Home Assistant 的面板设备页面选择 **访问**，打开其状态页面。每块面板通过本地网络提供此页面，默认使用端口 **8888**（例如 `http://<panel>:8888/`）。您可以在这里选择仪表盘、查看面板正在执行的操作，以及阅读诊断报告。它面向受信任的家庭网络设计，因此应像对待面板本身一样管理此页面的访问权限。[API 参考](/zh-hans/reference/api/)和[安全模式](/zh-hans/manage/security-mode/)介绍了它提供的功能及信任模型。
