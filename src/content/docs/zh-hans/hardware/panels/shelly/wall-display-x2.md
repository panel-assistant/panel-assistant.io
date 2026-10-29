---
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
title: Shelly Wall Display X2
description: Shelly Wall Display X2 硬件资料：搭载 SC7731E、运行 Android 8.1 的 6.9 英寸面板，代号 Pegasus。
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 英寸，1440 × 720
support: 未测试
root: 此型号尚未确认
webview: '尚未确认（WallDisplay 更新分支未提供此型号的 OTA WebView 软件包）'
released: '2025-01（估计）'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2 正面
photoCredit: '照片：Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
---

:::note
**尚未测试过此型号的实机。** Panel Assistant 会将其匹配到内置的旧款 Shelly 配置文件，但尚无 X2 运行过该配置文件。关于整个系列共用的资料来源、固件 OTA 机制、访问方式和安全说明，请参阅 [Wall Display 系列页面](/zh-hans/hardware/panels/shelly/)。
:::

Wall Display X2 的固件代号为 **Pegasus**，配备 6.9 英寸 1440×720 屏幕，搭载展讯/紫光展锐 SC7731E（Cortex-A7），运行 Android 8.1。它与[初代型号](/zh-hans/hardware/panels/shelly/wall-display/)一样，使用旧款 **WallDisplay**（armeabi-v7a）OTA 更新分支。

## 首次启用调试访问

**不使用电脑、通过 TCP 端口 5555 连接网络 ADB：此型号尚未确认。** 此型号首次启用 USB 调试以及解锁厂商菜单的方法也尚未验证。[X2i 操作步骤](/zh-hans/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode)仅在 X2i 上得到确认；共用固件不能证明这些步骤也适用于此型号。请向 Shelly 索取适合您的型号和固件的操作步骤。只有在 USB 调试和 USB 数据连接均可用后，才可使用 [USB 安装程序](/zh-hans/install/install-over-usb/)。仅有支持 root 的系统版本并不会启用调试。

## 其他名称

Shelly Wall Display X2、SAWD-2A1XX10EU1，固件代号 Pegasus，设备 ID 为 e500_7731e_32u_o。

|          |                                                                                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC      | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                       |
| 屏幕     | **1440×720**，6.9 英寸                                                                                                                                                                                                         |
| Android  | 8.1                                                                                                                                                                                                                            |
| ABI      | armeabi-v7a                                                                                                                                                                                                                    |
| 传感器   | 文档列有温度、湿度、环境光和接近传感器；是否通过 Android API 提供尚未验证                                                                                                                                                      |
| 继电器   | 1 路输出                                                                                                                                                                                                                       |
| Root     | 此型号尚未确认；尚无专门针对该型号的 OTA 构建类型证据                                                                                                                                                                          |
| 发布日期 | 约 2025 年 1 月（估计）；与 Shelly Gen4 系列一同在 CES 2025 上公布（[Shelly 官方 CES 2025 新闻页面](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)） |

有关访问方式的完整分析、OTA 更新端点（`WallDisplay` 分支）和固件版本历史，请参阅 [Wall Display 系列页面](/zh-hans/hardware/panels/shelly/)。

## 来源

[Shelly Wall Display X2 知识库](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
