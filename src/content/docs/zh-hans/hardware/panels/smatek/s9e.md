---
title: Smatek S9E
description: Smatek S9E 硬件信息：10.1 英寸 Rockchip RK3566 嵌墙面板，带两个市电继电器、四个 LED 背光按键、雷达接近检测、Zigbee、以太网和 RS485。
vendor: Smatek
model: S9E
soc: Rockchip RK3566
android: '11'
screen: 10.1 英寸, 1920 × 1200
support: 社区测试
root: 继电器、按键 LED、接近检测（据报告，应用可使用 su）
webview: 2024-07 固件为 Chromium 83；2025-12 为 131
released: '不早于 2021 年（根据 RK3566 SoC 估计）'
photos:
  - src: 'asset:hardware-smatek-s9e-front.jpg'
    alt: Smatek S9E 正面和背面，展示继电器和端子接线
photoCredit: '照片：Smatek'
sold_as_note: 'Zigbee（Tuya）版本，带两个市电继电器，AC 100-240 V'
sold_as:
  - brand: Smatek
    name: 'S9E-NZ'
    note: '不带 Zigbee 网关的 Android 版本：RS485、四个按键、AC 100-240 V'
  - brand: Smatek
    name: 'S9PE-NZ'
    note: '与 S9E-NZ 相同，但使用以太网供电（PoE）或 DC 9-24 V，而非市电'
evidence: [firmware, documented, platform, owners]
sidebar:
  label: S9E
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

尚未找到此处所述版本的厂商固件发行说明。下方版本比较来自对提供的镜像的检查，而非厂商更新日志。

:::note
与完整支持的面板不同，S9E **尚未**在手边实机上进行逆向分析。规格来自 Smatek 产品信息，控制途径来自 [seaky/nspanel_pro_tools_apk issue 98](https://github.com/seaky/nspanel_pro_tools_apk/issues/98)、Home Assistant 社区讨论和报告者。一位用户已在 1.1.0 固件上从 Home Assistant 切换继电器和按键 LED（[issue 93](https://github.com/panel-assistant/android/issues/93)）；其他控制途径细节在验证前应视为未确认。
:::

10.1 英寸 **1920×1200** RK3566 嵌墙面板，与 TPA10 属于同一 SoC 系列，带**两个板载市电继电器**、四个 LED 背光按键、雷达接近传感器，以及 **Zigbee、以太网和 RS485**。

## 首次调试访问

**无需电脑、通过 TCP 端口 5555 使用网络 ADB 的方法：尚未确认。** 设备已运行 Panel Assistant，或固件提供 root，都不能证明新面板如何开启调试。

**首次开启 USB 调试的方法也尚未确认。** 请向供应商索取适用于确切固件版本的调试说明，并确认 USB 端口支持数据传输。如果提供 USB 调试，可使用 [USB 安装器](/zh-hans/install/install-over-usb/)；不要假定充电端口支持 ADB。此处没有经过验证的出厂菜单操作步骤。

检查 root 需要已建立可用的 ADB 连接。root 权限与首次调试访问是两个独立问题。

## 其他销售名称

Smatek S9E、Smatek S9、S9E-NZ（不带 Zigbee 网关）、S9PE、S9PE-NZ（PoE 版本）、`Build.MODEL` S9、`Build.DEVICE` rk3566_r、`ro.product.version` S9_Android_1.0.2 和 S9_Android_1.1.0。

:::tip
关键事实：它使用与 TPA10 相同的 **RK3566** 平台，因此应用侧功能很可能无需 S9E 专用代码即可工作。**继电器切换市电负载**（通过 root sysfs；一位用户报告在 1.1.0 上正常工作）。按键发出 **`F1` 至 `F4`** KeyEvent（应用直接访问，无需 root）。请先检查 WebView：2024-07 固件自带 **Chromium 83**。
:::

| 项目       | 详情                                                                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Rockchip **RK3566**（四核 Cortex-A55），与 TPA10 同属一个 SoC 系列                                                                                                                                                                            |
| RAM 与存储 | **2 GB** RAM、**16 GB** eMMC                                                                                                                                                                                                                  |
| 显示屏     | **10.1 英寸**、**1920×1200** 多点触控                                                                                                                                                                                                         |
| Android    | 11                                                                                                                                                                                                                                            |
| 连接       | Wi-Fi、Bluetooth、**Zigbee**、**RJ45 以太网**、**RS485**（另有 PoE 版本 **S9PE**）                                                                                                                                                            |
| 传感器     | 接近**雷达**、环境**光**、**温度和湿度**                                                                                                                                                                                                      |
| 输入       | **4 个实体按键**，各自带 LED                                                                                                                                                                                                                  |
| 继电器     | **2 个板载市电继电器**                                                                                                                                                                                                                        |
| Root       | 厂商应用使用 `execRootCmd`，因此具备 root；部分设备出厂已解锁开发者模式。一位用户报告 1.1.0 上普通应用沙箱能够调用 `su`；这决定面板应用可直接驱动 sysfs 节点，还是需要 root 辅助守护进程。                                                    |
| 上市时间   | 无法可靠确定；RK3566 SoC 系列约在 2021 年才上市，这是目前找到的最早可能时间依据（[CNX Software 2020 年 12 月的 RK3566 数据手册报道](https://www.cnx-software.com/2020/12/16/rockchip-rk3566-and-rk3568-datasheets-and-features-comparison/)） |

:::danger
下列控制接口通过 **root 写入 sysfs**，继电器切换的是**市电负载**。支持依据报告的路径实现，一位用户报告继电器和按键 LED 在 1.1.0 上可用；1.0.2 的 `st_relay` 路径**尚未确认**，请在依赖它之前先在自己的 S9E 上验证。
:::

:::tip
由于 S9E 与 TPA10 共用 **RK3566** 平台，面板应用现有的应用侧功能很可能无需 S9E 专用代码即可工作，温度、湿度和光照也可能通过 `SensorManager` 提供。旧固件自带的 **WebView 很旧（Chromium 83）**，请先更新：可使用 Magisk OpenWebView、2025-03-24 固件或旁加载 SystemWebView。2025-12 固件已自带 Chromium 131。参见[更新系统 WebView](/zh-hans/hardware/guides/update-the-webview/)。
:::

:::tip
S9E 正面有四个功能按键，但没有已记录的电源键加音量键恢复组合。尚未在实机上获取其分区表、root 途径和恢复流程，因此不要原样套用 TPA10 和 WF1589T 的[固件备份指南](/zh-hans/hardware/guides/firmware-backup-and-restore/)。
:::

## 固件版本

已分析两个原厂镜像。它们是 AOSP 动态分区格式的基于块的 OTA `.zip` 文件：使用 `brotli -d` 解压 `.new.dat.br`，用 `lpunpack` 解包 super 镜像，然后使用 `strings` 搜索 `build.prop` 和 init `.rc` 文件。两者均报告 `Build.MODEL` 为 **`S9`**、`Build.DEVICE` 为 **`rk3566_r`**、Android 11；厂商版本代码在 **`ro.product.version`** 中：

| 镜像                               | `ro.product.version` | 构建                         | 继电器类              |
| ---------------------------------- | -------------------- | ---------------------------- | --------------------- |
| `S9_1920x1200_20240712_Android_US` | `S9_Android_1.0.2`   | `eng.*.20240712`             | `/sys/class/st_relay` |
| `S9_1920x1200_20251202_Android_US` | `S9_Android_1.1.0`   | `eng.xiaolp.20251202.160404` | `/sys/class/strelay`  |

:::caution
**不同固件版本之间重命名了继电器 sysfs 类。** 只有**初始**镜像（1.0.2）使用 `/sys/class/st_relay`；**所有更新**镜像（1.1.0 及以后）使用 `/sys/class/strelay`，已由[报告者](https://github.com/panel-assistant/android/issues/3)确认，且与固件差异一致。面板应用探测两个类名，并使用面板提供的类；参见[继电器](#继电器strelay-或-st_relay-类root)。
:::

两个镜像均由报告者从 Smatek 获取并分享：`S9_1920x1200_20240712_Android_US`（**1.0.2**）和 `S9_1920x1200_20251202_Android_US`（**1.1.0**）。位于 `docs.smatek.store:10001` 的原 Smatek 下载链接已无法访问；请联系 Smatek 支持或报告者获取副本。

两个镜像的差异表明，**只有 `ro.product.version` 和继电器类不同。** 下文记录的其他控制路径（按键键码、按键 LED GPIO、接近 GPIO、传感器接线）在两者中完全相同，因此依据以 `S9` 开头的 `ro.product.version` 检测可覆盖整个系列。

## 继电器：`strelay` 或 `st_relay` 类（root）

仅在具有继电器 sysfs 类的面板上，面板应用将两个市电继电器提供为 `switch.<panel>_relay1` 和 `switch.<panel>_relay2`。

:::note
**类名取决于固件**（参见[固件版本](#固件版本)）：初始 1.0.2 镜像使用 `st_relay`，1.1.0 及以后使用 `strelay`。面板应用探测**两个**名称，并使用面板提供的类。
:::

```bash
# firmware 1.1.0+ (most panels in the field)
echo 1 > /sys/class/strelay/relay1    # on
echo 0 > /sys/class/strelay/relay1    # off
echo 1 > /sys/class/strelay/relay2

# firmware 1.0.2 (initial release)
echo 1 > /sys/class/st_relay/relay1
```

## 按键：`F1` 至 `F4` KeyEvent（应用直接访问）

四个按键发出标准 Android 键码 **131 至 134**，即 `KEYCODE_F1` 至 `KEYCODE_F4`。面板应用的无障碍捕获功能将其报告至 `event.<panel>_button`（事件类型 `KEYCODE_F1` 至 `KEYCODE_F4`）；可在 Home Assistant 中为其绑定仪表盘操作。这些事件无需 root。

## LED：各按键的 GPIO 背光

每个按键在 `/sys/class/gpio/gpio<16+keycode>/value` 处有一个 LED，F1 至 F4 对应 GPIO **147 至 150**。每个 LED 为单色，只能开启或关闭。面板应用将其提供为 `light.<panel>_button_led1` 至 `light.<panel>_button_led4`（通过 `su` 切换），编号依据配置文件的 `hardware.button_led_gpio_base`。这些 LED **不在** `/sys/class/leds` 下，S9E 的该目录只有 `mmc2::` SD 卡 LED；它们是原始 GPIO。

:::note
**固件分析：**init 脚本**仅导出 `gpio113`**。按键 LED 引脚 **gpio147 至 gpio150 开机时未导出**，因此在导出前不存在对应 `/sys/class/gpio/gpioNNN/value` 节点。面板应用按需导出每个引脚，并在首次写入前将其设为输出，这就是未在开机时导出仍能使用 LED 的原因。
:::

```bash
echo 147 > /sys/class/gpio/export        # one-time, if the node is absent
echo 1 > /sys/class/gpio/gpio147/value   # button F1 LED on
```

:::tip
固件还包含 **RGB 状态 LED**（`led_r`、`led_g`、`led_b`）、**振动马达**和**以太网活动 LED**。面板应用未提供这些功能。
:::

## 传感器：接近信号来自 GPIO 18，而非 `SensorManager`

:::caution
`SensorManager` 中注册了一个接近传感器，声明为 `Proximity=yes · Binary · 0/1 cm`，但在 S9E 上它**从不发出事件**。报告者在[后续报告](https://github.com/panel-assistant/android/issues/5)中的实时读数确认 Android 途径始终无信号。同一面板的光照传感器正常工作（约 46 lx），所以问题仅影响接近检测；真实信号从 `gpio18` 读取。
:::

真实信号是**通过 root 读取 GPIO 18**。内核注册了一个从不触发的虚假 Android 传感器，因此必须从 sysfs 读取：

```bash
cat /sys/class/gpio/gpio18/value   # 1 = near, 0 = far  (no export needed — reporter-confirmed)
```

因此 S9E 配置文件声明 `sensors.proximity_gpio: 18`，而不使用无效的 `SensorManager` 来源。root 辅助程序保持数值描述符打开，在内核支持 GPIO 边沿时立即推送变化；否则每秒通过同一描述符检查两次。描述符丢失会明确报告，因此 Home Assistant 会将传感器显示为不可用，直到恢复后的辅助程序流提供当前值。此信号与 Android 传感器使用相同的引导设置和已保存校准；设置成功后可使用校准后的存在检测和手势输出。报告者确认 gpio18 读数为**远离时 0，靠近时 1**；引导设置会测量端点，而不是依赖猜测的极性。环境光、温度和湿度按预期通过 `SensorManager` 提供。

## 访问模型概览

- **继电器：**通过继电器 sysfs 类（root）提供 `switch.<panel>_relay1` 和 `switch.<panel>_relay2`；同时探测 `strelay` 和 `st_relay`。
- **按键：**`event.<panel>_button`（`KEYCODE_F1` 至 `KEYCODE_F4`），通过无障碍功能由应用直接访问。
- **按键 LED：**通过 `su` 提供 `light.<panel>_button_led1` 至 `light.<panel>_button_led4`（GPIO 147 至 150，按需导出）。
- **接近检测：**通过 root 辅助程序保持打开的 `gpio18` 事件流，提供已校准的 `binary_sensor.<panel>_proximity` 和归一化的 `sensor.<panel>_proximity_level`。`SensorManager` 接近传感器虽已注册但从不触发，因此被绕过。
- **光照：**通过 `SensorManager` 提供 `sensor.<panel>_illuminance`，**正常工作**。

## 来源

- [GitHub 上的 Smatek S9E 报告](https://github.com/panel-assistant/android/issues/3)：报告者的 `/diag`（检测字符串、`SensorManager` 接近传感器）、继电器类从 `st_relay` 改名为 `strelay`，以及两个固件镜像。
- 报告者分享的 Smatek S9E 原厂固件：1.0.2（20240712）和 1.1.0（20251202），即已分析的两个镜像。原 Smatek 下载链接（`docs.smatek.store:10001`）已无法访问。
- [seaky/nspanel_pro_tools_apk issue 98，“添加 Smatek S9E 支持”](https://github.com/seaky/nspanel_pro_tools_apk/issues/98)：继电器（`st_relay`）、按键（键码 131 至 134）、按键 LED（GPIO 147 至 150）和接近检测（GPIO 18）控制路径。
- [Home Assistant 社区：“Smatek S9E 触摸面板”](https://community.home-assistant.io/t/smatek-s9e-touch-panel/828244)：WebView 更新、GPIO 18 接近检测脚本、集成说明。
- [Smatek S9E 产品页面](https://smatek.com/product/10-1-inch-smart-control-panel-s9e/)和 [S9PE-NZ PoE 版本](https://smatek.com/product/10-1-inch-android-panel-s9e-nz/)：SoC、RAM 和存储、显示屏、传感器、连接功能。
- [Smatek S9E 规格表（PDF）](https://smatek.com/wp-content/uploads/2025/03/Smatek-S9E-10-Super-Smart-Control-Panelin-wall-SPEC.pdf)：仅含图像、无法提取文字的扫描件，但它是原始数据表。
