---
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
title: Shelly Wall Display XL
description: Shelly Wall Display XL 硬件资料：搭载 RK3566、运行 Android 11 的 10.1 英寸面板，代号 Blake。
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 英寸
support: 未测试
root: 此型号尚未确认
webview: '尚未确认（WallDisplayV2 更新分支未提供 OTA WebView 软件包）'
released: '2025-09（估计）'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL 正面
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL 屏幕正视图
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL 侧面，显示安装深度
photoCredit: '照片：Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
---

:::note
**尚未测试过此型号的实机。** 关于整个系列共用的资料来源、固件 OTA 机制、访问方式和安全说明，请参阅 [Wall Display 系列页面](/zh-hans/hardware/panels/shelly/)。
:::

Wall Display XL 的固件代号为 **Blake**，配备 10.1 英寸屏幕，搭载瑞芯微 RK3566（Cortex-A55），运行 Android 11，是 [Shelly Wall Display 系列](/zh-hans/hardware/panels/shelly/)中最大、性能最强的型号。它与 [X1i](/zh-hans/hardware/panels/shelly/wall-display-x1i/)、[X2i](/zh-hans/hardware/panels/shelly/wall-display-x2i/)、Maverick 和 Dayna 一样，使用新款 **WallDisplayV2**（arm64-v8a）OTA 更新分支，并可访问内置 AppStore。

## 首次启用调试访问

**不使用电脑、通过 TCP 端口 5555 连接网络 ADB：此型号尚未确认。** 此型号首次启用 USB 调试以及解锁厂商菜单的方法也尚未验证。[X2i 操作步骤](/zh-hans/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode)仅在 X2i 上得到确认；共用固件不能证明这些步骤也适用于此型号。请向 Shelly 索取适合您的型号和固件的操作步骤。只有在 USB 调试和 USB 数据连接均可用后，才可使用 [USB 安装程序](/zh-hans/install/install-over-usb/)。仅有支持 root 的系统版本并不会启用调试。

## 其他名称

Shelly Wall Display XL，固件代号 Blake。

|          |                                                                                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC      | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                        |
| 屏幕     | 10.1 英寸                                                                                                                                                                                                                                              |
| Android  | 11                                                                                                                                                                                                                                                     |
| ABI      | arm64-v8a                                                                                                                                                                                                                                              |
| 传感器   | 文档列有环境光传感器；运动传感器（官方资料，具体技术尚未验证）；是否通过 Android API 提供尚未验证                                                                                                                                                      |
| 继电器   | 1 路输出                                                                                                                                                                                                                                               |
| Root     | 此型号尚未确认；新款 OTA 未声明构建类型。在出厂固件 2.5.4 上测试的 [Wall Display X2i](/zh-hans/hardware/panels/shelly/wall-display-x2i/) 可从设置应用解锁开发者选项和 USB 调试，随后通过 adb 连接，但仍没有 root；这些步骤是否适用于此型号尚未经测试。 |
| 发布日期 | 约 2025 年 9 月（估计）；Shelly 于 2025 年 9 月 10 日左右在欧洲推出 XL（[Notebookcheck 于 2025 年 9 月的发布报道](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html)）                                   |

:::caution
XL 内置的 Home Assistant 浏览器在 Home Assistant 前端 2025.12 和 2026.1 预发布版上出现过渲染和布局问题（由 [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) 和 `#28746` 跟踪；核心兼容性由 [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665) 跟踪）。同一设备上使用系统 WebView 的应用能够正确渲染，说明问题与内置浏览器的 WebView 有关，而非硬件。
:::

从 Panel Assistant 1.0 起，XL 使用共用的 Shelly 配置文件，包含 [X2i](/zh-hans/hardware/panels/shelly/wall-display-x2i/) 在此固件上展示的能力：无需 root 即可完全关闭屏幕，支持返回和主屏幕，但不支持最近任务。Panel Assistant 启动时会在面板上检查其自身传感器。尚未确认过 XL 实机，欢迎用户提供报告；请参阅 [X2i 对系列其他型号意味着什么](/zh-hans/hardware/panels/shelly/#x2i-对系列其他型号的意义)。

有关访问方式的完整分析、OTA 更新端点（`WallDisplayV2` 分支）和固件版本历史，请参阅 [Wall Display 系列页面](/zh-hans/hardware/panels/shelly/)。

## 来源

[Shelly Wall Display XL 知识库](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
