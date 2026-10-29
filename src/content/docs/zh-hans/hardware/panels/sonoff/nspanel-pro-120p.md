---
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
title: Sonoff NSPanel Pro 120P
description: Sonoff NSPanel Pro 120P 硬件资料：搭载瑞芯微 RK3326-S、配备 750×1334 竖向屏幕和内置 Zigbee 无线模块的面板。
vendor: Sonoff
model: NSPanel Pro 120P
soc: Rockchip RK3326-S
android: '8.1'
screen: 4.7 英寸，750 × 1334，竖屏，也支持横屏
support: 完整支持
root: userdebug，无 adb 密码；关闭背光需要 su
webview: 固件 3.5.1 为 Chromium 107；可侧载 LineageOS 138
released: '2024-08（估计）'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-120p-front.jpg'
    alt: 墙上安装的白色和黑色 Sonoff NSPanel Pro 120P 正面
photoCredit: '照片：Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 120P
  order: 2
---

**120P** 是 [Sonoff NSPanel Pro](/zh-hans/hardware/panels/sonoff/) 系列的长屏型号，以欧式 120 mm 墙盒命名。本页仅列出其自身规格以及与 [86P](/zh-hans/hardware/panels/sonoff/nspanel-pro-86p/) 不同的事实；其他内容（root 流程、WebView 更新、LED、传感器、Zigbee 网关和固件特性）统一记录在[系列页面](/zh-hans/hardware/panels/sonoff/)，本页相关章节会链接至该页面。

## 其他名称

NSPanel Pro 120、NSPanel Pro 120P、NSPanel120P、NSPanel Pro Gen1、SN_3326S、nspanel-pro-ver120。不要与 NSPanel Pro Gen2 或 Tuya S6E 和 T6E 主板混淆，它们是不同的硬件。

|          |                                                                                                                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | 瑞芯微 **RK3326-S**（与 86P 同属 PX30/RK3326 系列；`ro.board.platform=rk3326`，设备树为 `rockchip,px30`）                                                                                      |
| CPU      | 4× **Cortex-A35**，最高 **1.512 GHz**（空闲时 408 MHz）                                                                                                                                        |
| GPU      | **Mali-G31**（实机确认）                                                                                                                                                                       |
| 屏幕     | **750×1334** 竖屏，**240 dpi**（覆盖值 250）；可用横屏；比 86P 约窄 1 cm、长 1 cm                                                                                                              |
| RAM      | **2 GB**（约 1960 MB 可用）                                                                                                                                                                    |
| 存储     | eMMC；`/data` 约 3.5 GB                                                                                                                                                                        |
| Android  | 8.1 (API 27)                                                                                                                                                                                   |
| ABI      | arm64-v8a                                                                                                                                                                                      |
| 无线连接 | **Zigbee 3.0**（Silicon Labs EFR32 协调器，参阅[系列页面](/zh-hans/hardware/panels/sonoff/#zigbee-网关)）、Wi-Fi、蓝牙。无 NFC、红外、以太网或蜂窝网络。                                       |
| 发布日期 | 约 2024 年 8 月（估计）；约于 2024 年 8 月 14 日在 Sonoff 网站开售（[haade.fr 于 2024 年 8 月的发布报道](https://haade.fr/en/blog/special-discount-new-sonoff-nspanel-pro-120-on-itead-site)） |

`ro.product.model` 和 `ro.product.device` 都报告 `px30_evb`，这是共用的瑞芯微主板名称，_不能_可靠区分 120P 和 86P；`ro.product.version` 则报告 120P 专用的 `NSPanel120P_x.y.z` 格式（OTA 渠道为 `nspanel-pro-ver120`，完整 ROM 为 `SN_3326S_750X1334_…`）。其他 OTA 形式与 86P 相同（参阅[固件页面](/zh-hans/hardware/firmware/nspanel-pro/)）。120P 的接近感应固件在 **4.x 仍为二值读数**（86P 在 4.0.12 恢复了距离读数；不同型号的内核已有差异）；参阅系列页面的[传感器](/zh-hans/hardware/panels/sonoff/#传感器光照和接近传感器可由应用直接访问)。在 120P（固件 `NSPanel120P_3.7.1`）上实机验证：`wm size` 为 750×1334，密度为 240，`ro.board.platform=rk3326`。

:::note
Cortex-A35 是能效核心，每时钟周期吞吐量明显低于 A55（TPA10）或 A72（WF1589T）。配备 2 GB RAM 的 NSPanel Pro 系列，在完整支持的面板中属于**入门性能级别**；参阅[性能比较](/zh-hans/hardware/#performance-comparison)。
:::

## 首次启用调试访问

不使用电脑、通过 TCP 端口 5555 连接网络 ADB 是否可行取决于已安装固件；尚未确认通用开关。请按照 [NSPanel Pro 首次 ADB 访问步骤](/zh-hans/hardware/panels/sonoff/#获取-adb-和-root-访问权限)操作；无法通过网络访问时，使用针对该固件的 USB 步骤。后续 root 步骤需要已有调试连接。
