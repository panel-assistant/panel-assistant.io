---
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
title: Shelly Wall Display（初代）
description: 初代 Shelly Wall Display 硬件资料：搭载 MT6580、运行 Android 7 的 4 英寸面板，代号 Stargate。
vendor: Shelly
model: Wall Display（初代）
soc: MT6580
android: '7.0'
screen: 4 英寸，480 × 480
support: 研究阶段
root: 尚未确认；基础构建为 userdebug，未经实机确认
webview: '通过官方 ZIP 安装 com.google.android.webview 119.0.6045.194'
released: '2023-09（估计）'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: 初代 Shelly Wall Display 及其 H&T 传感器配件
  - src: 'asset:hardware-shelly-wall-display-rear-label.jpg'
    alt: Shelly Wall Display 背面，显示型号标签和墙盒
photoCredit: '照片：Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display（初代）
  order: 1
---

:::note
**仅供研究：尚未测试过此型号的实机。** 关于整个系列共用的资料来源、固件 OTA 机制、访问方式和安全说明，请参阅 [Wall Display 系列页面](/zh-hans/hardware/panels/shelly/)。
:::

:::caution
**出厂搭载 Android 7.0**，低于 Panel Assistant 支持的最低 Android 版本。
:::

初代 Wall Display 的固件代号为 **Stargate**，是 [Shelly Wall Display 系列](/zh-hans/hardware/panels/shelly/)的入门型号：配备 4 英寸 480×480 屏幕，搭载联发科 MT6580，运行 Android 7。它与 [X2](/zh-hans/hardware/panels/shelly/wall-display-x2/) 一样，使用旧款 **WallDisplay**（armeabi-v7a）OTA 更新分支。

## 首次启用调试访问

**不使用电脑、通过 TCP 端口 5555 连接网络 ADB：此型号尚未确认。** 此型号首次启用 USB 调试以及解锁厂商菜单的方法也尚未验证。[X2i 操作步骤](/zh-hans/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode)仅在 X2i 上得到确认；共用固件不能证明这些步骤也适用于此型号。请向 Shelly 索取适合您的型号和固件的操作步骤。只有在 USB 调试和 USB 数据连接均可用后，才可使用 [USB 安装程序](/zh-hans/install/install-over-usb/)。仅有支持 root 的系统版本并不会启用调试。

## 其他名称

Shelly Wall Display、SAWD-0A1XX10EU1，固件代号 Stargate，设备 ID 为 k400_mt6580_32_n。

|          |                                                                                                                                                                                                                                                                   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | MediaTek **MT6580**                                                                                                                                                                                                                                               |
| 屏幕     | **480×480 正方形**，4 英寸                                                                                                                                                                                                                                        |
| Android  | 7.0                                                                                                                                                                                                                                                               |
| ABI      | armeabi-v7a                                                                                                                                                                                                                                                       |
| 传感器   | 文档列有温度、湿度和环境光传感器；是否通过 Android API 提供尚未验证                                                                                                                                                                                               |
| 继电器   | 1 路输出                                                                                                                                                                                                                                                          |
| WebView  | 标准 OTA 不包含；Shelly 单独发布 ZIP，用于安装 `com.google.android.webview` **119.0.6045.194**                                                                                                                                                                    |
| Root     | 此型号尚未确认。OTA 声明基础构建为 `userdebug`（`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`），因此**如果**能够建立 adb 连接，`adb root` 可能可用，但尚未经实机确认。                                                                            |
| 发布日期 | 约 2023 年 9 月（估计）；Shelly 于 2023 年 9 月在柏林 IFA 首次展示 Wall Display（[Maison et Objet Domotique 对 Shelly 柏林 IFA 2023 产品阵容的报道](https://www.maison-et-domotique.com/en/157856-shelly-11-new-products-in-wi-fi-bluetooth-and-zwave-ifa2023/)） |

有关访问方式的完整分析、OTA 更新端点（`WallDisplay` 分支）和固件版本历史，请参阅 [Wall Display 系列页面](/zh-hans/hardware/panels/shelly/)。

## 来源

[Shelly Wall Display 知识库](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
