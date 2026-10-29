---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 参考
description: 面板应用的技术参考，涵盖 Home Assistant 实体、设备配置文件、安全状况及构建方式。
sidebar:
  label: 概览
  order: 0
---

这些页面介绍面板应用的底层工作方式：它提供的接口、描述各型号面板的配置文件格式，以及两者背后的安全决策。安装或使用 Panel Assistant 并不需要阅读这些内容。

## 接口

- [控制与 Home Assistant 参考](/zh-hans/reference/api/)：用于自动化面板的实体和服务，以及面板在其 HTTP 端口（默认为 8888）上提供的页面和端点。
- [安全状况](/zh-hans/reference/security/)：信任模型、攻击面及所作决策。

## 设备配置文件

- [运行时面板配置文件](/zh-hans/reference/profiles/)：什么是配置文件，以及如何编写、测试和激活。
- [配置文件格式与兼容性](/zh-hans/reference/profiles/format/)：完整的 schema-2 字段参考。
- [配置文件测试与故障排查](/zh-hans/reference/profiles/testing/)：分阶段硬件测试顺序及恢复步骤。
- [分享与贡献配置文件](/zh-hans/reference/profiles/sharing/)：来源、安全交换与捆绑要求。
- [设备配置文件架构](/zh-hans/reference/profiles/architecture/)：应用如何解析、匹配和激活配置文件。
- [社区面板配置文件](/zh-hans/reference/profiles/community/)：应用未内置的面板配置文件。
  - [Echo Show 5 Gen 2 (LineageOS)](/zh-hans/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/zh-hans/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/zh-hans/reference/profiles/community/sunworld-yc-sm55p/)

## 代码

- [开发环境](/zh-hans/reference/development-environment/)：工具链、构建脚本，以及 fork 项目需要了解的签名事项。
- [DeepWiki 代码导览](https://deepwiki.com/panel-assistant/android)：带您了解 ha-paneld 源码。
