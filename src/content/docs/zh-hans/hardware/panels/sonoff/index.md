---
title: Sonoff NSPanel Pro
description: 原版 Sonoff NSPanel Pro 86P 和 120P 的硬件信息：内置 Zigbee 无线模块的 Rockchip PX30 面板。
vendor: Sonoff
panelIndex: true
sidebar:
  label: 概览
  order: 0
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
---

原版 NSPanel Pro 系列有两款外形不同的面板：**[86P](/zh-hans/hardware/panels/sonoff/nspanel-pro-86p/)** 和 **[120P](/zh-hans/hardware/panels/sonoff/nspanel-pro-120p/)**，分别以欧洲 86 mm 和 120 mm 墙盒命名。两者都内置 **Zigbee 3.0 协调器**，没有 NFC 或红外，是完整支持面板中 CPU 性能最低的产品。本页记录的内容（root 流程、WebView、LED、传感器、Zigbee 网关）几乎全部共用；各版本页面仅列出自身规格和少量差异。本页主要依据运行中的 **86P** 实机逆向分析（Android 8.1、已 root、工具箱 `su`），标注处另已在 120P 实机验证。

## 其他销售名称

Sonoff NSPanel Pro 86、NSPanel Pro 120、NSPanel Pro 86P、NSPanel Pro 120P、NSPanel120P、NSPanel Pro Gen1、px30_evb、SN_3326S、SN-RKPX30-NSP-01、nspanel-pro、nspanel-pro-ver120。不要与 NSPanel Pro Gen2 或 Tuya S6E、T6E 主板混淆，它们属于不同硬件。

:::tip
关键事实：面板出厂为 **`userdebug`，没有 adb 密码**，所以可直接使用 `adb root`。**LED 尚未查明**（未找到可控 RGB 节点）。光照和接近传感器可由**应用直接访问**。板载 **EFR32 Zigbee 无线模块**通过本地消息代理管理，无需重刷固件。在尚未发布的 1.0.0-rc2 中，从 Home Assistant 发起的安装和面板应用更新可安装经过验证的 WebView；参见 [WebView：请先更新](#webview请先更新)。
:::

| 项目     | 详情                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **PX30 / rk3326**                                                                                                |
| CPU      | 4× **Cortex-A35**，最高 **1.512 GHz**（空闲时 408 MHz）                                                                   |
| GPU      | **Mali-G31**（实机确认）                                                                                                  |
| 显示屏   | **480×480 正方形**（1:1），约 4 英寸，160 dpi（mdpi，与约 170 物理 ppi 相配），60 Hz，**480×480 dp** 画布                 |
| RAM      | **2 GB**（约 1960 MB 可用）                                                                                               |
| 存储     | eMMC；`/data` 约 3.5 GB                                                                                                   |
| Android  | 8.1（API 27）                                                                                                             |
| ABI      | arm64-v8a                                                                                                                 |
| 无线功能 | **Zigbee 3.0**（UART `ttyS5` 上的 Silicon Labs EFR32 协调器，见下文）、Wi-Fi、Bluetooth。无 NFC、红外、以太网或蜂窝网络。 |

:::note
Cortex-A35 是能效核心，每时钟周期吞吐量明显低于 A55（TPA10）或 A72（WF1589T）。加上 2 GB RAM，NSPanel Pro 在完整支持面板中属于**入门性能**；参见[性能比较](/zh-hans/hardware/#performance-comparison)。
:::

:::tip
要修改无按键面板的固件？请先阅读[固件备份与恢复](/zh-hans/hardware/guides/firmware-backup-and-restore/)。NSPanel Pro 使用 [seaky 的型号专用工具](/zh-hans/hardware/guides/firmware-backup-and-restore/#per-panel-notes)，而非 `rkdeveloptool`。
:::

## 版本：86P 和 120P

上表和本页大部分信息采集自 **86P**；**120P** 使用不同主板。各版本的独立规格表和照片见 [86P](/zh-hans/hardware/panels/sonoff/nspanel-pro-86p/) 和 [120P](/zh-hans/hardware/panels/sonoff/nspanel-pro-120p/) 页面。

| 项目                 | NSPanel Pro **86P**                                                                                                     | NSPanel Pro **120P**                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| SoC                  | Rockchip **PX30**                                                                                                       | Rockchip **RK3326-S**（同属 PX30/RK3326 系列；`ro.board.platform=rk3326`，设备树 `rockchip,px30`） |
| 显示屏               | **480×480** 正方形，约 160 dpi，仅竖屏                                                                                  | **750×1334** 竖屏，**240 dpi**（覆盖值 250）；支持横屏；相比 86P 约窄 1 cm，且更长                 |
| 构建标识             | 两者均报告 `ro.product.model/device/name = px30_evb`，这是共用的 Rockchip 主板名，不能可靠区分版本                      | 同 86P                                                                                             |
| `ro.product.version` | `NSPanel86P_x.y.z` 或 `s6_android_x.y.z` 形式                                                                           | `NSPanel120P_x.y.z`（OTA 通道 `nspanel-pro-ver120`，完整 ROM `SN_3326S_750X1334_…`）               |
| OTA 形式             | 直到 **4.0.12** 为完整 ROM；之后索引中的版本为差分或仅应用更新（见[固件页面](/zh-hans/hardware/firmware/nspanel-pro/)） | 同 86P                                                                                             |
| 接近检测固件         | **4.0.12 恢复了连续范围读数**                                                                                           | 4.x 中仍为**二值**（各型号内核不同；见[传感器](#传感器光照和接近传感器可由应用直接访问)）          |

两者共用 EFR32 Zigbee 无线模块、Android 8.1（AOSP）、arm64-v8a，以及下述 root 和恢复方法。已在 120P 实机（固件 `NSPanel120P_3.7.1`）验证：`wm size` 750×1334、密度 240、`ro.board.platform=rk3326`。

:::note
本页正文不推荐固件版本；生成的[固件索引](/zh-hans/hardware/firmware/)才是权威来源。刷写流程已在硬件上验证至 **4.4.0**。索引中更新的版本仅通过 CDN 验证，未在实机刷写。截至 2026-08-14，[Sonoff 公开更新日志](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq)记录至 **4.6.0**；4.6.2 和 4.8.0 仅通过探测 CDN 找到，4.7.0 仅见于 [eWeLink 用户反馈讨论](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789)，这属于讨论而非发行公告。**4.5.3** 在 120P 上为 ROM 差分，在 86P 上仅更新应用；**4.6.2** 在两个通道均仅更新应用，没有 ROM 差分，因此升级不一定一步完成。未列入索引表示探测时未找到；CDN 无法列目录，所以缺失绝不证明版本不存在。

**社区报告 4.5.1 和 4.5.2 出现重启循环**，两种型号均约每 10 至 60 分钟重启。4.7.0 反馈讨论中有升级后子设备连接异常的报告，部分重启后解决，部分持续存在。这些情况尚未复现或量化，应视为未经验证的用户报告，而非已知回归。在多台部署前先在一台面板上验证新版本；**4.0.12** 仍是保守的完整 ROM 固定检查点。
:::

### 各固件版本的特殊行为

以下按从旧到新的顺序列出 eWeLink 固件版本之间的行为变化。`ro.product.version` 是**内部**标识（86P 上为 `NSPanel86P_x.y.z` 或 `s6_android_x.y.z`，120P 上为 `NSPanel120P_x.y.z`），不是 eWeLink 应用显示的营销或 OTA 版本号（4.0.12、4.5.x）。检测和按版本判断的逻辑必须读取 `ro.product.version`，不能使用营销字符串。

| 固件                           | 特殊行为                                                                                                                                                                                                                                                                                                                                                | 建议操作                                                                                                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **较旧版本（1.3.2 之前）**     | 应用内无 adb 开关；界面无法访问开发者选项                                                                                                                                                                                                                                                                                                               | 打开外壳，通过内部 **OTG 端口**启用 adb；参见[获取 adb 和 root 访问权限](#获取-adb-和-root-访问权限)。                                                                               |
| **1.3.2 及以后**               | adb 启用选项移至 eWeLink 应用                                                                                                                                                                                                                                                                                                                           | eWeLink 的 _设备设置_（Device Settings） 中连续点击 **设备 ID**（Device ID） 八次，进入开发者模式并启用 adb。                                                                        |
| **1.4 及以后**                 | 界面**移除了**开发者模式                                                                                                                                                                                                                                                                                                                                | 在 Sonoff 启动动画期间**断电重启五次**来启用 adb；参见[获取 adb 和 root 访问权限](#获取-adb-和-root-访问权限)。                                                                      |
| **3.5.1（86P，已验证）**       | 原厂系统 WebView 为 **Chromium 107.0.5304.105**，对于现代 Home Assistant 仪表盘过旧；其他固件可能不同                                                                                                                                                                                                                                                   | 使用尚未发布的 1.0.0-rc2 的受管理 WebView 更新，或 adb 手动备用方法；见 [WebView：请先更新](#webview请先更新)。面板应用健康横幅也会提示低于 Chromium 110 的版本。                    |
| **3.7.1（120P，实机）**        | 基准参考构建                                                                                                                                                                                                                                                                                                                                            | `wm size` 750×1334，密度 240，`ro.board.platform=rk3326`。                                                                                                                           |
| **4.0.0**（2025-09-19 起推送） | 原厂固件捆绑 F-Droid 应用商店；界面明显更快                                                                                                                                                                                                                                                                                                             | 确认 **APP** 和 **OS** 版本均为 4.0.0 或更高。                                                                                                                                       |
| **4.0.12**                     | **86P** 恢复连续范围接近读数；**120P 仍为二值**（各型号内核不同）                                                                                                                                                                                                                                                                                       | 保守稳定的固定版本。原始输入形式取决于型号和固件，引导接近设置会校准并归一化两种形式；见[传感器](#传感器光照和接近传感器可由应用直接访问)。                                          |
| **4.5.1 和 4.5.2**             | **社区广泛报告重启循环**（两款型号，约 10 至 60 分钟）；4.5.2 是叠加于 4.5.1 的仅应用更新                                                                                                                                                                                                                                                               | 已被后续版本替代。追求最高稳定性可固定 **4.0.12**，或先在一台面板上测试新版本。                                                                                                      |
| **4.5.3**                      | Matter 自动发现和屏幕管理优化；120P 为 ROM 差分，86P 仅更新应用                                                                                                                                                                                                                                                                                         | 没有针对 4.5.3 的重启循环证据；已被后续版本替代。                                                                                                                                    |
| **4.6.0**（2026 年 6 月）      | **本地 Web 门户**（`nspanelpro.local`：局域网设置、通过 MQTT Discovery 导出至 Home Assistant、Matter Bridge）；CDN 检查找到来自 4.0.12、4.4.0 和 4.5.1 的差分                                                                                                                                                                                           | Sonoff 公开更新日志有记录。**4.6.2** 索引为仅应用更新，两个通道均无 ROM 差分；尚未找到 4.6.1。                                                                                       |
| **4.7.0**（2026 年 7 月）      | eWeLink 用户反馈讨论提及，但 **Sonoff 公开更新日志未列出**；覆盖 Gen1 和 Gen2；用户报告新增 Basic gen-5 继电器（BASIC-1GS）支持；CDN 检查在两款型号均找到来自 4.0.12、4.4.0、4.5.1、4.6.0 的差分，另仅 120P 有来自 4.5.3 的差分                                                                                                                         | 社区报告子设备连接问题，部分重启后解决，部分持续存在；未经验证。进一步部署前先在一台面板上验证。                                                                                     |
| **4.8.0**（2026 年 8 月）      | **未找到发行公告或更新日志**；通过探测 CDN 找到。eWeLink 工作人员于 2026-07-16 在[路线图讨论](https://forum.ewelink.cc/t/nspanel-pro-roadmap-and-co-created-future/206240)中计划于 8 月发布，并确认一项功能：通过 eWeLink 应用自动更新面板的选项。CDN 检查在两款型号均找到来自 4.0.12、4.4.0、4.5.1、4.6.0、4.7.0 的差分，另仅 120P 有来自 4.5.3 的差分 | 其他内容未知，也未找到反馈讨论，因此没有任何稳定性报告。应视为尚未评估，而非已确认无问题。**若自动更新选项默认开启，面板可能在无人操作时更新固件**，因此依赖固定版本前请检查该设置。 |

:::note
这些特殊行为适用于原版 86P 和 120P。NSPanel Pro **Gen2**（RK3326-**S**、双继电器、EFR32**MG24**）是不同硬件。Sonoff 对 Gen1 和 Gen2 使用相同固件版本线（4.7.0 同时覆盖两者），因此不要推断另有独立固件线，也不要假定原版的每项说明都适用。原版 NSPanel Pro 配置文件匹配报告 PX30 或 RK3326 主板名的所有面板，因此报告此名称的 Gen2 在拥有专用配置文件前也会被匹配；该配置文件尚未在 Gen2 上测试，也不提供 Gen2 的继电器。
:::

同系列 Tuya 主板 **S6E** 和 **T6E**（继电器版本；S6E 是带两个继电器的 T6E）、[**Smatek S9E**](/zh-hans/hardware/panels/smatek/s9e/) 和 [**Tuya TPA10**](/zh-hans/hardware/panels/tuya/tpa10/)（RK3566、Cortex-A55、Android 11）均是独立目标，不运行 NSPanel Pro 固件。

:::danger
检测不能依赖 `ro.product.model`，因为两款均报告 `px30_evb`。应使用 `ro.product.version`、显示参数或 `ro.board.platform` 区分 86P 和 120P。接近检测行为也因型号和固件而异，因此引导接近设置会校准当前读数并保存结果，而非选择固件专用分类器。
:::

## 获取 adb 和 root 访问权限

与 TPA10 不同，NSPanel Pro **没有 adb 密码**。出厂为使用测试密钥的 `userdebug` 构建（`ro.debuggable=1`），因此 `adb root` 可用，也可重新挂载 `/system`。唯一难点是进入开发者选项，eWeLink 固件各版本的隐藏方法不同。以下整理自 blakadder 的指南（[旁加载](https://blakadder.com/nspanel-pro-sideload/)、[隐藏功能](https://blakadder.com/nspanel-pro-secrets/)）。

**首次访问途径（86P 和 120P）。** 能否无需电脑开启 TCP 端口 5555 上的网络 ADB 取决于固件；尚未确认通用的面板内开关。下述 eWeLink 开发者模式途径适用于所列固件，但不能证明所有后续构建都能开启 TCP5555。网络 ADB 不可用时，请使用适合该固件的已记录 USB 途径。root 命令不能开启首次访问。

**1. 启用 adb。** 方法取决于固件：

- **较旧固件：**打开外壳（拆下背面螺钉并断开触摸连接器），露出 OTG USB 端口并连接主机；adb 可直接通过 USB 使用。
- **1.3.2 及以后固件：**在 **eWeLink 应用**中打开面板的 _设备设置_（Device Settings），连续点击 **设备 ID**（Device ID） 八次启用开发者模式，恢复 adb。
- **1.4 及以后固件**（已移除开发者模式）：在 Sonoff 启动动画期间**断电重启五次**，强制进入恢复启动，并在此窗口运行 `adb install ultra-small-launcher.apk`。重启后将该启动器设为默认，再依次点击 _设置 → 系统 → 关于平板电脑 → 版本号_（Settings → System → About tablet → Build number） 七次，重新开启开发者选项并打开 USB 调试。

**2. 切换到网络 adb**，以便保持外壳关闭：

```bash
adb tcpip 5555
adb shell ip -o a            # find the panel IP
adb connect <panel-ip>:5555
adb shell su 0 setprop persist.adb.tcp.port 5555   # survive reboot (service prop resets)
```

**3. Root。** 构建为 `userdebug`，所以 `adb root` 立即提供 root adbd shell。面板应用从沙箱调用 `su`，因此需将持久 `su` 安装至 `/system`。已测试版本为 `/system/xbin/su` 处的 **SuperSU `su` 2.76**：

```bash
adb root
adb disable-verity          # only if remount is refused; this reboots the panel
adb remount                 # or: adb shell mount -o remount,rw /system
adb push su /system/xbin/su
adb shell chmod 06755 /system/xbin/su
```

:::danger
只有在 adb 和 `su` 已稳定可用，且已有其他返回主屏幕和返回途径**之后**，才能停用 eWeLink 应用（`com.eWeLinkNSPro.dev`、`com.eWeLinkControlPanel`）；面板应用的导航操作可提供这些功能。eWeLink **Zigbee 网关**栈独立于这些应用，仍会运行；请用 [Zigbee 路由器开关](#zigbee-网关)管理，不要将其删除。
:::

## WebView：请先更新

一台刚刷入 `3.5.1` 固件（构建 `164637`）的 86P，经验证使用 `com.android.webview` **107.0.5304.105**（Chromium 107），过旧而无法渲染当前 Home Assistant 仪表盘。其他固件和型号可能不同，请先检查已安装的提供程序，再决定是否更新。归档 OTA 差分包不包含 WebView APK，因此该版本通过实机 `dumpsys webviewupdate` 读取。此设备在 adb 更新后运行 Chromium **138**。在尚未发布的 1.0.0-rc2 中，从 Home Assistant 发起的安装和面板应用更新可安装经过验证的兼容 WebView。若尝试未完成，请在面板的更新修复中选择**重试**以继续。手动备用方法是 adb 更新；参见[更新系统 WebView](/zh-hans/hardware/guides/update-the-webview/#手动备用方法)。

## LED

此设备未找到 `/sys/class/leds` RGB 节点或 `/dev/ledjni`，因此 NSPanel Pro **尚未查明可由应用或 sysfs 控制的 RGB LED**（对比 TPA10 的 `avsux` 节点和 WF1589T 的 `/dev/ledjni`）。屏幕亮度和背光使用标准 Android 途径。

## 传感器：光照和接近传感器可由应用直接访问

与温湿度仅 root 可访问的 TPA10 不同，NSPanel Pro 通过标准 `SensorManager` 提供 Sensortek 组合传感器：`android.sensor.light`、`android.sensor.proximity` 和 `android.sensor.accelerometer`，普通应用均可读取，无需 root。面板应用在此直接读取光照和接近信号。未安装温度或湿度传感器。

:::note
**接近读数同时取决于固件和型号。** 传感器是 Sensortek STK3A5x，位于盖板玻璃后方顶部 PCB 的开口处。静止基线在设备间差异很大（某台约 1000，另一台约 4000）；仅相对变化有意义，因此空闲基线高是正常现象，并非故障。约 **3.3** 固件之前，以约 50 ms 间隔报告连续范围读数；约 **3.3 至 3.4** 起内核驱动改为二值 0 或 1。**4.0.12 仅在 86P 上恢复了连续范围读数**；**120P 仍为二值**。引导接近设置可校准任一信号并保存结果，随后面板将各台设备的有效范围归一化，因此配置文件不编码各固件阈值，也不区分连续范围和二值分类器。（来源：seaky 工具 issues [142](https://github.com/seaky/nspanel_pro_tools_apk/issues/142)、[144](https://github.com/seaky/nspanel_pro_tools_apk/issues/144)、[171](https://github.com/seaky/nspanel_pro_tools_apk/issues/171)、[262](https://github.com/seaky/nspanel_pro_tools_apk/issues/262)。）
:::

### 已绑定的 I²C 设备

| I²C 地址            | 驱动或名称                   | 用途                                               |
| ------------------- | ---------------------------- | -------------------------------------------------- |
| `0-0020`            | `rk809`                      | PMIC                                               |
| `1-001a` / `1-005a` | `CST226` / `CST226SE`        | Hynitron 电容触摸控制器                            |
| `2-003c`            | `tp`                         | 触摸屏                                             |
| `2-0046`            | `ls_stk3a5x` 和 `ps_stk3a5x` | Sensortek **STK3A5x** 环境光与接近组合传感器       |
| `2-0047`            | `ls_stk3x3x` 和 `ps_stk3x3x` | Sensortek **STK3x3x** 光照与接近传感器（替代器件） |

## Zigbee 网关

NSPanel Pro 内置 **Silicon Labs EFR32 Zigbee 3.0 无线模块**，位于 UART `/dev/ttyS5`，由厂商主机栈（`/vendor/bin/siliconlabs_host/zgateway`）通过本地 MQTT 消息代理驱动。eWeLink 应用使用同一栈，因此面板出厂可用作 eWeLink Zigbee 集线器。

面板应用直接管理它。`switch.<panel>_zigbee_router` 可将面板变为扩展现有网状网络的 Zigbee **路由器**（启动网关并确保 Repeater 角色），也可关闭它（停止网关并释放无线模块）。操作通过本地消息代理完成，无需凭据，也不直接操作 `ttyS5`。面板随后会在 ZHA 或 Zigbee2MQTT 协调器中显示为普通路由器。

:::note
切换角色**不是重刷固件**：没有 `.gbl` 或引导加载程序步骤，只设置 EZSP 节点类型。分区级固件操作见[固件备份与恢复](/zh-hans/hardware/guides/firmware-backup-and-restore/)。
:::

:::note
**没有已记录或查明的 Thread 边界路由器。** 已安装的厂商栈将 EFR32 用作 Zigbee NCP。EFR32MG21 芯片支持多协议，但这不证明面板上有 Thread 固件或边界路由器；Sonoff 记录的是 Matter Bridge。

**4.x 固件重构了 Zigbee 栈。** 社区检查发现 Zigbee2MQTT 分支、变更的设备内 MQTT 密码和不同启动顺序。[Sonoff 在当前固件中记录了协调器与路由器切换](https://sonoff.tech/blogs/news/nspanel-pro-v4-3-0-central-heating-redefining-whole-home-temperature-automation)，但面板应用的本地消息代理控制途径依据 3.x 及更早版本构建，**在 4.x 上可能需要调整**。（社区来源：seaky 工具 issues [241](https://github.com/seaky/nspanel_pro_tools_apk/issues/241)、[244](https://github.com/seaky/nspanel_pro_tools_apk/issues/244)、[255](https://github.com/seaky/nspanel_pro_tools_apk/issues/255)，以及 [roottool issue 3](https://github.com/seaky/nspanel_pro_roottool_apk/issues/3)。）
:::

:::caution
**报告者确认 NSPanel Pro 120 原厂固件 3.8.0 的旧版厂商 Zigbee 看门狗存在缺陷。** 包含[报告者 issue](https://github.com/panel-assistant/android/issues/34)所述递归 `LD_LIBRARY_PATH` 赋值的固件，最终可能使看门狗启动的所有外部命令以 `E2BIG` 失败、占用一个 CPU 核心，并停止恢复已退出的 `zgateway`。重启只能暂时清除问题。证据及安全修复要求见[性能调优](/zh-hans/manage/performance/)。报告者的变通方法尚未独立验证。社区检查 4.0.12 和 4.6.0 时未发现有漏洞的赋值。
:::

### 要求：固件 2.2.0 或更高

主机栈是**厂商自己的** eWeLink 和 Sonoff 网关，其版本与面板固件匹配（例如 `sonoff-v3.5.4`）。Zigbee **路由器模式**在 **NSPanel Pro 固件 2.2.0**（2023 年；eWeLink 应用 _设备设置 → 试验功能 → Zigbee 模式_（Device Settings → Pilot Features → Zigbee Mode））中加入，本地主机栈中继支持始于网关包 1.1.9。实际情况如下：

- **存在网关**（固件 2.2.0 或更高，或已旁加载）：面板应用检测后发布 `switch.<panel>_zigbee_router`。开启后，面板以路由器身份加入协调器。
- **没有网关**（极旧固件，从未配置）：开关**不会出现**，因为它依赖网关启动脚本存在。请更新至固件 2.2.0 或更高。

面板应用**驱动**网关，不捆绑或安装它，因为这是 eWeLink 的二进制程序。4.x 固件加入 Matter 桥接，也可通过 MQTT Discovery 将 Zigbee 设备导出到 Home Assistant，作为路由器角色的替代方案。

### 网关健康与自动遏制

在具备 Zigbee 的面板上，`sensor.<panel>_zigbee_gateway_health` 独立于路由器开关报告厂商栈状态，因此即使未授权面板应用停止网关，未配置的原厂网关仍可见。

明确开启路由器开关后，面板应用允许 15 分钟启动和配对宽限期，随后每分钟检查两种失控特征：网络明确无效或未加入，且连续五次采样占用一个 CPU 核心的 50% 以上；或十分钟内网关进程 ID 至少变化三次。已加入的路由器若持续高 CPU，仅产生警告并继续运行。未知 4.x 布局或缺少固件专用加入证据时，安全地报告 `unknown`。

明确开启 Zigbee 路由器开关，即使厂商网关已运行，也会请求 Repeater 模式，因此在 ZHA 或 Zigbee2MQTT 协调器允许加入时开启它，相当于重新尝试加入，不会启动第二个网关监督进程。

设置选项卡在 Zigbee 路由器开关正下方显示**请求加入**操作；开关仍是唯一的开启和关闭控件。在 ZHA 或 Zigbee2MQTT 中允许加入，然后请求加入并确认允许加入已开放。此操作重新声明 Repeater 模式，开始新的 15 分钟宽限期并轮询健康状态；不会重启面板。路由器停用、已加入或最近请求后正在冷却时，按钮不可用。

宽限期后，已启用但仍未加入的网关会在仪表盘和安装选项卡产生持续警告，链接至上述设置操作。不要让它保持此状态，因为重复加入尝试可能消耗大量 CPU。请让面板作为路由器加入，或关闭 Zigbee 路由器开关。

若已配置的旧版网关满足失控规则，面板应用会持久关闭路由器开关，并尝试一次有界遏制。厂商原生遏制只能针对 Sonoff 守护进程、`zgateway` 和匹配的本地消息代理。如果某个进程无法停止，会尽可能移除其重启器，并将残留网关任务降至 nice 19 和 Android 后台 cpuset。之后再次开启路由器开关，会开始一次新的宽限期和尝试。

健康属性包括固件和产品版本、网关布局和软件包版本、加入与角色状态、取整后的网关与守护进程 CPU、近期重启次数和遏制结果。绝不包含 Zigbee 网络密钥、原始本地消息代理凭据、无线 MAC 地址或原始网关 `netinfo`。

### 从 NSPanelTools 迁移

如果 NSPanelTools 曾在旧面板上安装 Sonoff 网关，移除 NSPanelTools 后 `/vendor` 中的主机栈会保留。启用 Panel Assistant 的屏幕和传感器控制前，请先移除 NSPanelTools，避免重复操作。Panel Assistant 可驱动现有网关；Zigbee 路由器开关保持开启时，即使旧启动钩子已移除，它也会在开机时启动网关。

### EZSP 主机栈内部机制

旧版厂商原生栈（3.x 及更早）中，无线模块运行 **EZSP NCP 固件**（EFR32MG21、EZSP v8）。`zgateway` 是 `/vendor/bin/siliconlabs_host/` 中的 EZSP 主机二进制程序，由自身 `guard_process.sh` 监督进程保活（每 5 秒循环，开机启动），并通过 `127.0.0.1:1883` 上的**本地 mosquitto 消息代理**控制。消息代理允许匿名访问：`mosquitto.conf` 的 `password_file` 行被注释。4.x 栈有所不同，见上文。

- 角色状态：`zigbee/system/network-role/information` 返回 `{"role":"Repeater"|"Coordinator"}`
- 角色切换：向 `zigbee/system/network-role/switch` 发布 `{"role":"Repeater"}`

“Repeater” 即路由器模式，扩展现有网状网络；角色保存在 NCP 的非易失性存储中。移除 eWeLink 应用后厂商 `zgateway` 仍保留，因为它位于 `/vendor`，而非 APK 中。

若希望改为在面板上运行完整独立 Zigbee2MQTT 或 ZHA 协调器，参见 [seaky/nspanel_pro_zigbee](https://github.com/seaky/nspanel_pro_zigbee)，它会替换主机栈。此方案更重，不是面板应用采用的方式。

## 访问模型概览

- **光照、接近、加速度计：**应用直接访问（`SensorManager`）。
- **屏幕亮度、休眠、导航、文字转语音：**标准 Android 途径（真正关闭背光需 `su`）。
- **LED：**尚未查明。
- **Zigbee：**通过设备内网关的本地消息代理管理 EFR32 无线模块（`switch.<panel>_zigbee_router`）。
- **无线功能：**Zigbee 3.0、Wi-Fi、Bluetooth。

## 性能预期

对于丰富的仪表盘，NSPanel Pro 的 **CPU 和 RAM 资源有限**：

- 空闲时频率为 408 MHz，约使用 500 MB RAM；重型仪表盘会同时增加两者负担。
- **2 GB RAM 是主要约束。** 仪表盘 WebView、Android 和后台应用争夺内存；包含大量卡片、大图、长历史图表或高开销自定义卡片的大型仪表盘会导致 WebView 重新加载和卡顿。
- A35 核心使页面切换和动画明显慢于 A55 或 A72 面板。

使用内置渲染器时，请先采用[性能调优](/zh-hans/manage/performance/)中的自动仪表盘实体筛选，避免面板处理仪表盘从不显示的状态。然后使用仪表盘选项卡上的性能卡片查找剩余高负载视图、内存压力或温度限制，再简化仪表盘。
