---
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
title: Sonoff NSPanel Pro 86P
description: Sonoff NSPanel Pro 86P 硬件资料：搭载瑞芯微 PX30、配备 480×480 正方形屏幕和内置 Zigbee 无线模块的面板。
vendor: Sonoff
model: NSPanel Pro 86P
soc: Rockchip PX30
android: '8.1'
screen: 4 英寸，480 × 480，仅竖屏
support: 完整支持
root: userdebug，无 adb 密码；关闭背光需要 su
webview: 固件 3.5.1 为 Chromium 107；可侧载 LineageOS 138
released: '2022-09（估计）'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-front.jpg'
    alt: 墙上安装的 Sonoff NSPanel Pro 86P 正面
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-black-trim.jpg'
    alt: 黑色 Sonoff NSPanel Pro 86P 斜视图，显示安装深度
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-white-trim.jpg'
    alt: 白色 Sonoff NSPanel Pro 86P 斜视图，显示安装深度
photoCredit: '照片：Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 86P
  order: 1
---

**86P** 是 [Sonoff NSPanel Pro](/zh-hans/hardware/panels/sonoff/) 系列的正方形型号，以欧式 86 mm 墙盒命名。本页仅列出其自身规格以及与 [120P](/zh-hans/hardware/panels/sonoff/nspanel-pro-120p/) 不同的事实；其他内容（root 流程、WebView 更新、LED、传感器、Zigbee 网关和固件特性）统一记录在[系列页面](/zh-hans/hardware/panels/sonoff/)，本页相关章节会链接至该页面。

## 其他名称

NSPanel Pro 86、NSPanel Pro 86P、NSPanel120P（86P 商品信息偶尔也使用此字符串）、NSPanel Pro Gen1、px30_evb、SN-RKPX30-NSP-01、nspanel-pro。不要与 NSPanel Pro Gen2 或 Tuya S6E 和 T6E 主板混淆，它们是不同的硬件。

|          |                                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **PX30**                                                                                                                                                                                                                                       |
| CPU      | 4× **Cortex-A35**，最高 **1.512 GHz**（空闲时 408 MHz）                                                                                                                                                                                                 |
| GPU      | **Mali-G31**（实机确认）                                                                                                                                                                                                                                |
| 屏幕     | **480×480 正方形**（1:1），约 4 英寸，160 dpi（mdpi，与约 170 的物理 ppi 较为匹配），60 Hz，**480×480 dp** 画布                                                                                                                                         |
| RAM      | **2 GB**（约 1960 MB 可用）                                                                                                                                                                                                                             |
| 存储     | eMMC；`/data` 约 3.5 GB                                                                                                                                                                                                                                 |
| Android  | 8.1 (API 27)                                                                                                                                                                                                                                            |
| ABI      | arm64-v8a                                                                                                                                                                                                                                               |
| 无线连接 | **Zigbee 3.0**（Silicon Labs EFR32 协调器，参阅[系列页面](/zh-hans/hardware/panels/sonoff/#zigbee-网关)）、Wi-Fi、蓝牙。无 NFC、红外、以太网或蜂窝网络。                                                                                                |
| 发布日期 | 约 2022 年 9 月（估计）；2022 年 8 月开始预售，计划于 2022 年 9 月 20 日起发货（[CNX Software 于 2022 年 8 月的预售报道](https://www.cnx-software.com/2022/08/12/sonoff-nspanel-pro-android-control-panel-doubles-as-wifi-zigbee-smart-home-gateway/)） |

`ro.product.model` 和 `ro.product.device` 都报告 `px30_evb`，这是共用的瑞芯微主板名称，_不能_可靠区分 86P 和 120P；`ro.product.version` 则报告 86P 专用的 `NSPanel86P_x.y.z` 格式，部分固件为 `s6_android_x.y.z`。截至 **4.0.12**，OTA 以完整 ROM 提供；索引中的后续发布版本为差分更新或仅应用更新（参阅[固件页面](/zh-hans/hardware/firmware/nspanel-pro/)）。86P 的接近感应固件在 **4.0.12 恢复了距离读数**（120P 在 4.x 仍为二值读数）；参阅系列页面的[传感器](/zh-hans/hardware/panels/sonoff/#传感器光照和接近传感器可由应用直接访问)。

:::note
Cortex-A35 是能效核心，每时钟周期吞吐量明显低于 A55（TPA10）或 A72（WF1589T）。配备 2 GB RAM 的 NSPanel Pro 系列，在完整支持的面板中属于**入门性能级别**；参阅[性能比较](/zh-hans/hardware/#performance-comparison)。
:::

## 首次启用调试访问

不使用电脑、通过 TCP 端口 5555 连接网络 ADB 是否可行取决于已安装固件；尚未确认通用开关。请按照 [NSPanel Pro 首次 ADB 访问步骤](/zh-hans/hardware/panels/sonoff/#获取-adb-和-root-访问权限)操作；无法通过网络访问时，使用针对该固件的 USB 步骤。后续 root 步骤需要已有调试连接。
