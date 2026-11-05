---
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
title: Meta Portal 10 英寸（第二代）
description: Meta Portal 10 英寸（第二代）WD50JM 的硬件资料与购买建议：搭载高通 QCS605、运行 Android 10 的智能显示器，已在无 root 运行 Panel Assistant 的实机上测量。
vendor: Meta
model: 'Portal 10" (2nd gen), WD50JM'
soc: Qualcomm QCS605
android: '10'
screen: 10.1 英寸，1280 × 800
support: 初步支持
root: 无 root；Meta 的 ADB 开关足以完成设置
webview: Meta 自有的 Chromium 131 WebView
released: '2019'
evidence: [bench, firmware, documented]
sidebar:
  label: Portal 10 英寸（第二代）
  order: 1
---

:::note
**本页所述的原厂系统下 Panel Assistant 的安装配置和运行行为，均在一台零售版 Portal 10 英寸（第二代）上实测**，该设备运行 Meta 固件 `QKQ1.210213.001.3051355900018050`（Android 10，安全补丁日期 2020-08-05），在无 root 权限的情况下运行 Panel Assistant。对 Portal 的支持需要 1.0 或更高版本的面板应用。本页内容均未在其他 Portal 型号上验证；其他型号的处理方式请参阅 [Meta Portal 系列页面](/zh-hans/hardware/panels/meta/)。
:::

Portal 10 英寸（第二代）型号为 **WD50JM**，是搭载高通 QCS605、约 3 GB RAM 的 10.1 英寸横向智能显示器，配备带独立摄像头指示灯的 1300 万像素摄像头、两个麦克风、扬声器和物理隐私滑块。Panel Assistant 只需 Meta 的 [ADB 开关](#启用-adb)：面板应用通过 USB 安装，识别 Portal 并加载专用硬件配置文件；仪表盘、摄像头、麦克风、唤醒词、语音回复、光传感器和真正的屏幕关闭都无需 root 即可工作。

这是一款不错的面板，但附带一些不寻常的条件，大多来自 Meta。花钱前需要了解的内容列于[购买前](#购买前)。

:::tip
最重要的事实：**保持 Meta 账户登录**，因为 ADB 开关需要其 PIN。**ADB 开关开启和关闭时外观相同**，请在电脑上检查状态。**重启后预计需要重新开启 ADB**，Panel Assistant 用于更新的网络调试在重启后绝不会保留。恢复出厂设置时，**不要用 USB 连接电脑，按住两个音量按钮并插入电源**。
:::

## 其他名称

Meta Portal、Facebook Portal、Portal（第二代）、Portal 10 英寸、型号 WD50JM。Android 报告型号 `Portal`，设备和主板为 `omni`，产品为 `omni_prod`，制造商和品牌为 `Facebook`，硬件平台为 `atlas`。

|          |                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| SoC      | 高通 **QCS605**，8 核                                                                                                          |
| RAM      | 约 **3 GB**（Android 报告 2.85 GB）                                                                                            |
| 存储     | 应用和数据可用 6.7 GB，设置后约剩 3.9 GB；无存储卡插槽                                                                         |
| 屏幕     | **1280×800** 横屏，10.1 英寸，**约 149 ppi**，Android 基础密度 160 dpi。FocalTech 触控控制器，支持双击唤醒                     |
| Android  | 10（API 29），生产 `user` 构建，SELinux enforcing；arm64-v8a                                                                   |
| WebView  | Meta 自有的 Chromium **131**；在已验证的原厂固件上仅有厂商版本，且没有更新的合格提供程序。此主版本已不再获得 Chromium 安全修复 |
| 传感器   | **加速度计**和倾斜；**带颜色的环境光**。**无接近传感器**                                                                       |
| 摄像头   | 边框左上方 **1300 万像素**传感器，旁有**绿色摄像头灯**。面板应用等应用可使用 1280×720                                          |
| 音频     | **两个麦克风**，一个扬声器                                                                                                     |
| 隐私     | **三档滑块**：摄像头与麦克风开启；摄像头遮挡；摄像头遮挡且麦克风关闭                                                           |
| 按钮     | 音量增加和减小。无电源按钮                                                                                                     |
| 无线连接 | Wi-Fi、蓝牙（支持**低功耗蓝牙**）                                                                                              |
| 接口     | **USB-C**，用于 ADB                                                                                                            |
| Root     | 无。没有 `su`，无已知引导加载程序解锁。ADB 来自 Meta 自有调试设置                                                              |
| 发布日期 | 2019 年（9 月公布，10 月开售）                                                                                                 |

## 购买前

这些条件都不意味着不该购买 Portal，但提前知道会更容易。

- **需要 Facebook 账户。** Meta 设置流程不登录就无法进入设置。它提供 Facebook 或 WhatsApp；测试时 WhatsApp 二维码始终未出现，Facebook 登录可用。可为面板新建账户。
- **账户必须保持登录。** 开启 ADB 会要求输入设置期间创建的 Meta 账户 PIN。没有已登录账户时，测试未找到重新开启 ADB 的方法，Meta 屏幕内恢复出厂设置也停止工作；只有[硬件重置](#恢复恢复出厂设置)恢复了 Portal。不要移除账户，也不要停用 Meta 设置应用。
- **ADB 不会保持开启。** 据报告，Meta 的 ADB 设置每次重启都会自行关闭，因此预计需要重新开启；测试的每次重启都丢失了 Panel Assistant 用于更新的网络调试连接。这会影响[更新](#更新)。
- **设置期间尽可能拒绝固件下载。** Meta 设置会提议下载更新。测试拒绝了它，因此本页所有内容均在页首指定固件构建上测试。未知更新的 Meta 固件是否会改变 ADB 访问，Meta 也未公布回退方法。
- **Meta 正在逐步终止 Portal。** Meta 于 2022 年停止销售 Portal，此后持续撤除功能。预计更多 Meta 自有服务，以及可能的登录方式，会停止工作。面板应用不依赖这些服务。
- 安装需要**运行基于 Chromium 的浏览器的电脑和 USB-C 数据线**，与其他[通过 USB](/zh-hans/install/install-over-usb/)安装的面板一样。

## 启用 ADB

Meta 为每款 Portal 提供操作说明（[Meta：为 Android 应用设置 Portal](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)）：

1. 在 Portal 打开 **Settings › Debug**。
2. 点击 **ADB Enabled**，在提示时输入 Meta 账户 PIN。
3. 通过 USB-C 将 Portal 连接到电脑。
4. 首次连接时，在 Portal 点击 **Allow**，信任电脑。

:::caution
**ADB Enabled 项目在 ADB 开启和关闭时外观完全相同，每次点击都会切换。** Portal 屏幕没有状态提示。唯一证据在电脑上：Portal 是否出现在浏览器 USB 设备列表或 `adb devices` 中。如果没有，请再点击一次并重新检查，不要连续点击多次。
:::

没有经过验证的方法能在不使用电脑时启用 TCP 端口 5555 的网络 ADB。请先使用上述 USB 途径；仅开启 Meta ADB 开关并不是经过验证的网络安装途径。USB 安装程序会为后续更新准备网络调试。无需 root。

## 安装 Panel Assistant

按上述方式开启 ADB，通过 USB-C 将 Portal 连接电脑，并从 Home Assistant 使用 [USB 安装程序](/zh-hans/install/install-over-usb/)安装面板应用。必须使用 Panel Assistant：它负责应用安装、连接和更新。测试的 Portal 上安装正常完成，应用进入仪表盘设置画面，首次启动时自行选中 Portal 10 英寸（第二代）配置文件。

Panel Assistant 还会在安装期间准备 Portal：将面板应用设为主屏幕、授予麦克风权限，并关闭 Meta 屏保和上滑栏；这些都无法从 Meta 自有设置应用更改。首次开启摄像头时，会在 Portal 屏幕请求摄像头权限。

有一项设置由您选择：**仪表盘缩放**。在 Portal 原生密度下，仪表盘比其他横向面板显示得更大。配置文件默认将**缩放（%）**设为 **85**，保留 Android 自身屏幕的清晰度；如需其他尺寸，可在[内置渲染器](/zh-hans/manage/built-in-renderer/)设置更改。

然后照常在 Panel Assistant [添加面板](/zh-hans/install/installing-ha-paneld/)。

## 可用功能

- **仪表盘**在 Meta 自有的 Chromium 131 WebView 中运行流畅。
- **摄像头。** 与所有面板一样默认关闭，从设置中的**摄像头**卡片开启。之后向 Home Assistant 提供 1280×720 流和静态图像，使用期间 Portal 绿色摄像头灯点亮。
- **麦克风、唤醒词和语音回复。** 已识别唤醒词，Home Assistant 语音管线通过 Portal 扬声器回复。参阅[语音助手](/zh-hans/manage/voice-assistant/)。
- **环境光**（含颜色）作为普通 Android 传感器，用于自适应亮度和 Home Assistant。
- **无需 root 的真正屏幕关闭。** 面板应用通过 Android 自身休眠超时关闭屏幕，使背光完全熄灭，而非降至最低。Portal 仅将亮度降为零仍不够，图像仍可见。如果超时未生效，应用会回退到最暗设置。
- **唤醒**：双击屏幕可唤醒，附近有人移动时 Meta 自身运动检测也会唤醒。
- 面板应用导航中的**启动器按钮**进入应用自己的启动器。配置文件指示跳过 Meta 启动器，因为后者只是钟面，而非应用列表。

## 当前限制

- **自动休眠默认关闭，建议保持关闭。** Portal 没有接近传感器，面板应用无法判断是否有人站在前面。触摸空闲一段时间后休眠会在人坐在面板前时关闭屏幕，随后 Meta 运动检测又将其唤醒，如此反复。该运动检测会响应任何移动，包括路人；偶尔在房间无人时也唤醒屏幕，而且其他应用无法读取，因此面板应用不能将其用作存在信号。仍可从 Home Assistant 开关屏幕。
- **两个摄像头指示器。** 面板应用在屏幕顶部中央绘制自己的摄像头开启指示器，而 Portal 镜头和绿灯位于左上方。此处屏幕指示器是冗余的，但无法关闭。
- **Meta 音量滑块不会改变媒体音量**，而语音回复和播报使用媒体音量。媒体音量初始可能为零，导致首次回复无声。请用面板的**面板音量**设置或 Home Assistant 音量实体调整；Meta 滑块不会改变它。
- **Android 设置大多无法访问。** Meta 用自己的精简设置应用替换 Android 设置。Panel Assistant 安装时设置面板应用所需内容；其他 Android 设置无法在面板上更改。

:::danger
**不要停用 Meta 设置应用（`com.facebook.alohaapps.devicesetup`）或移除 Meta 账户。** 测试中移除账户并停用该应用后，Portal 同时丢失 ADB 开关和 Meta 屏幕内恢复出厂设置，只有[硬件重置](#恢复恢复出厂设置)才能恢复。请保留 Meta 账户、设置和设置流程应用。
:::

## 更新

Portal 无法自行安装应用更新，因为这需要 root。因此 Panel Assistant 通过网络调试更新它，而 Portal 每次重启（包括断电后）都会关闭网络调试。此时面板继续使用现有版本，Home Assistant 显示修复提示，详见[更新与恢复](/zh-hans/manage/updates-and-recovery/#无法更新的面板)。

若要让 Panel Assistant 再次更新，请开启 [ADB](#启用-adb)，通过 USB 将 Portal 插到电脑，从 Home Assistant 启动 USB 安装程序，详见[无法更新的面板](/zh-hans/manage/updates-and-recovery/#无法更新的面板)。面板已有应用时，安装程序不会安装任何内容；它会重新开启网络调试，让 Panel Assistant 能更新。更新后，检查 Portal 仍将仪表盘作为[主屏幕](#安装-panel-assistant)打开。

## 隐私

Portal 仍是运行 Meta 软件的 Meta 设备，面板应用不会改变这一点。下方是测试实机上的测量，不是完整审计。

**Meta 软件。** 恢复出厂设置后约 25 分钟内，Meta 所有应用合计上传约 3 MB，Meta 摄像头分析和存在服务各自发送不足 0.05 MB。持续视频上传会大得多，因此该时间窗口未观察到视频上传；测试时间短，不能排除偶发上传。多个 Meta 服务持续连接 Meta 服务器，Meta 系统软件会记录分析事件，包括每次使用隐私滑块和摄像头灯状态。

**Meta 摄像头分析不会点亮绿灯。** Meta 自有运动和存在检测使用独立、缩减的摄像头流持续观察房间，不会开启摄像头灯。绿灯只报告其他应用使用的摄像头流。面板应用无法打开 Meta 分析流，因此它使用摄像头时绿灯始终点亮。

**隐私滑块对面板应用有效。** 滑块处于摄像头档位时，Android 报告摄像头不可用，面板应用停止提供图像。处于麦克风关闭档位时，面板应用语音助手听不到任何内容。在 1.0 中，面板应用同时跟随 Meta 隐私事件和 Android 静音状态，可显示麦克风静音。此报告途径的物理滑块切换及麦克风开启时启动尚未经验证。

**面板应用。** 摄像头在启用前关闭。启用后，局域网客户端可访问其流；允许麦克风访问时包含房间音频。Assist 和 Home Assistant 实体使用您自己的 Home Assistant 连接。

## 恢复：恢复出厂设置

Portal 硬件重置不依赖 Meta 应用、正常屏幕或 ADB：

1. 拔掉电源，并**断开所有连接电脑的 USB 线**。
2. 按住**两个音量按钮**并重新插入电源，保持按住直到 Portal 显示正在擦除。

重置会清除全部内容，包括面板应用及设置。之后重新完成 Meta 设置，[启用 ADB](#启用-adb)并[安装 Panel Assistant](#安装-panel-assistant)。

:::caution
**连接电脑的 USB 线仍插着时，同样的按钮组合不会重置 Portal。** 它会进入高通紧急下载模式，在电脑显示为高通 USB 设备。该模式不会更改任何内容。拔掉电源退出，断开 USB 线后重试。
:::

## 固件

社区研究报告称，代号为 `omni`、固件为 `3051355900018050`、内核为 `4.9.227-perf+` 的本型号是 CVE-2026-43499 的已测试目标。可能的益处、限制和来源请参阅[该系列的安全与配置说明](/zh-hans/hardware/panels/meta/#cve-2026-43499-and-community-provisioning)；Panel Assistant 尚未独立测试此漏洞利用。

索引构建、Meta 原始下载 URL 和 Internet Archive 副本请参阅 [Portal 10 英寸（第二代）固件目录](/zh-hans/hardware/firmware/builds/meta-portal-10-gen2/)。

## 来源

[Meta for Developers：为 Android 应用设置 Portal](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)：ADB 步骤和受支持型号列表。
