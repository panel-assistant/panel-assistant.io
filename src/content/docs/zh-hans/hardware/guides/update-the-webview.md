---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 更新系统 WebView
description: 为什么大多数墙面板需要较新的 Android System WebView 才能显示 Home Assistant 仪表盘，以及各面板的安装方法。
sidebar:
  label: 更新 WebView
  order: 2
---

请先阅读本页：WebView 过旧是这些面板首次运行失败的最常见原因。

面板应用的内置渲染器依赖 Android **系统 WebView**，而多数面板出厂版本太旧，无法运行当前 Home Assistant 前端。因此开箱后可能出现空白或损坏的仪表盘、卡片缺失或“浏览器不受支持”。**没有** Google Play 的面板（Sonoff NSPanel Pro、Tuya TPA10）需要其他更新途径。**Electron WF1589T 和 ZHICAI SMT1019 带有 Google Play**，请从 Play 商店更新 _Android System WebView_，或使用 Play WebView 开发通道。

在尚未发布的 1.0.0-rc2 版本中，从 Home Assistant 启动的安装和面板应用更新也可以安装经过验证且兼容的 WebView。这需要受支持的配置文件、未由 Play 管理且与所选构建包名和签名者相同的提供程序，以及允许的安装途径。如果更新仍未完成，请在面板的更新修复中选择**重试**。它会先检查现有工作，再请求另一次尝试；没有计划重试。旧引擎不会阻止设置和配对，但仪表盘仍可能无法显示。TPA10 的原装提供程序受签名锁定，仍需先执行文档中的 root 替换流程，才能使用不同签名的替代版本。

## 手动备用方法

托管更新途径不可用时，请使用下方适合面板的现有方法。通过 adb 直接侧载标准 Android System WebView（包名 **`com.android.webview`**）时，需要与面板 Android 版本和 ABI 匹配的构建，无需第三方应用商店。

:::tip
系统要自动选择提供程序，包名必须为 `com.android.webview`。Cromite 和 LineageOS 的 **SystemWebView** 构建使用 `com.android.webview`，能注册为提供程序；普通 Cromite **浏览器**应用的包名不同，不能注册。请使用 SystemWebView 构建，而非浏览器 APK。
:::

## 原装版本与已知可用的替代版本

“原装”指厂商固件出厂附带的版本，已通过固件检查或实机验证。“替代版本”指安装后已确认可用的版本。允许再分发的构建镜像为 ha-paneld 发布附件；使用 `adb install -r <file>` 侧载。

| 面板                                 | ABI           | 原装（厂商固件）                                                                                                                      | 替代版本                                                                                                                                                                                                                                               | 下载                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NSPanel Pro 86P (PX30)               | arm64-v8a     | Chromium **107.0.5304.105**，在固件 3.5.1 上验证；更新前检查其他固件和型号                                                            | **LineageOS** 138.0.7204.63，支持 Android **8.1** 的最后构建                                                                                                                                                                                           | [发布附件](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-138.0.7204.63.apk), [APKMirror](https://www.apkmirror.com/apk/lineageos/android-system-webview-2/android-system-webview-138-0-7204-63-2-release/android-system-webview-138-0-7204-63-8-android-apk-download) |
| TPA10 (rk3566)                       | armeabi-v7a   | **Chrome 83**（`com.android.webview`），太旧，无法运行当前 Home Assistant 前端                                                        | **LineageOS** SystemWebView 150.0.7871.63。原版 Chromium，摄像头流可自动播放（Cromite 147 会阻止自动播放，保留为备用）。**受签名锁定：需要 [root 替换](/zh-hans/hardware/panels/tuya/tpa10/#webview请先更新)，不能普通侧载。**                         | [arm 附件](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk)                                                                                                                                                                                       |
| WF1589T (rk3576)                     | arm64-v8a     | Google Play WebView，自动更新                                                                                                         | 通过 Play 商店更新；无需侧载                                                                                                                                                                                                                           | 无                                                                                                                                                                                                                                                                                                                    |
| S9E (rk3566)                         | **arm64-v8a** | **取决于固件，替换前请检查。** 2024-07 构建为 Chromium **83.0.4103.120**（太旧，无法运行当前前端），2025-12 构建为 **131.0.6778.200** | 仅旧固件需要：**LineageOS** 150.0.7871.63（**arm64**）。暂定，未经硬件验证；可能与 TPA10 一样受签名锁定。2025-12 固件的原装 WebView 已足够新                                                                                                           | [arm64 附件](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm64.apk)                                                                                                                                                                                   |
| SMT1019 (rk3576)                     | arm64-v8a     | `com.google.android.webview` **124.0.6367.179**，Android 14 **带有** Google Play                                                      | **从 Play 商店更新 _Android System WebView_**；无需侧载。不要侧载 `com.android.webview` 构建：此面板的提供程序列表由产品覆盖配置提供，因此侧载的提供程序可能不会被选中                                                                                 | 无                                                                                                                                                                                                                                                                                                                    |
| ZX-SMT156 (RK3566_T)                 | arm64-v8a     | Google WebView **149.0.7827.164**（报告者的固件）                                                                                     | 已足够新；无需替换                                                                                                                                                                                                                                     | 无                                                                                                                                                                                                                                                                                                                    |
| Shelly Wall Display（初代） (MT6580) | armeabi-v7a   | **未知**（Android 7 基础 ROM）                                                                                                        | 通过[官方 Shelly ZIP](https://repo.shelly.cloud/firmware/SAWD-0A1XX10EU1/stable/SAWD-0A1XX10EU1-WebViewUpdate.zip) 提供 `com.google.android.webview` **119.0.6045.194**；参阅 [Shelly Wall Display 系列页面](/zh-hans/hardware/panels/shelly/#webview) | 无                                                                                                                                                                                                                                                                                                                    |
| Shelly Wall Display X2 (SC7731E)     | armeabi-v7a   | **未知**（Android 8.1 基础 ROM）                                                                                                      | 尚未确认；检查 `adb shell dumpsys webviewupdate`                                                                                                                                                                                                       | 无                                                                                                                                                                                                                                                                                                                    |
| Shelly Wall Display X2i (RK3326-S)   | arm64-v8a     | 出厂固件 2.5.4 为 Chromium **131.0.6778.200**                                                                                         | 已足够新；无需替换                                                                                                                                                                                                                                     | 无                                                                                                                                                                                                                                                                                                                    |
| Shelly Wall Display X1i, XL (arm64)  | arm64-v8a     | **未知**（Android 11 基础 ROM；Shelly OTA 中未包含）                                                                                  | 尚未确认；检查 `adb shell dumpsys webviewupdate`                                                                                                                                                                                                       | 无                                                                                                                                                                                                                                                                                                                    |

所有镜像构建均位于 [Panel WebView 镜像发布页](https://github.com/panel-assistant/android/releases/tag/webview-mirror)，这是一份社区维护的已知可用版本列表。如果您已在其他面板或版本上成功使用某个构建，欢迎贡献。

:::note

- **选择面板 Android 版本支持的最新 WebView。** NSPanel Pro 的 Android 8.1 最高支持 Chromium 138，这是支持 Android 8 和 9 的最后版本；更新构建无法安装。Android 10 及更高版本（TPA10 运行 11）可以运行当前 LineageOS WebView 150。
- **APKMirror 的直接下载链接是短期预签名 URL，会在一小时内过期。** 请使用网页，或上述持久的发布附件。提供镜像是因为这些面板没有 Play，且出厂固件已过时多年，否则寻找可用构建可能耗费数日。

:::

## 侧载与验证

1. 下载当前版本的 **Android System WebView** APK，包名为 **`com.android.webview`**。各 Android 版本均推荐使用 **LineageOS** System WebView：138 是支持 Android 8.1 的最后版本，150 适用于 Android 10 及更高版本；镜像均有提供。它采用原版 Chromium，不含 Cromite 中会阻止 Home Assistant 摄像头流的自动播放限制。`com.android.webview` 包名使其自动被选为提供程序，无需编辑允许列表或安装额外应用，且允许自由再分发。请匹配面板 ABI。

   :::caution
   下述普通侧载适用于 ROM 免除 WebView 签名检查的面板，例如 NSPanel Pro 的 `userdebug` 构建。**受签名锁定的面板，包括 TPA10 和可能的其他厂商 `user` 构建，会拒绝它**，并显示 `signatures do not match`。这些面板需要一次性 root 替换，以更换系统 WebView 文件并清除其 `packages.xml` 条目；参阅 [TPA10 操作步骤](/zh-hans/hardware/panels/tuya/tpa10/#webview请先更新)。
   :::

2. 侧载，无需 root：

   ```sh
   adb install -r android-system-webview.apk
   ```

   它会安装到 `/data/app`，并取代过时的原装 WebView。

3. 验证当前提供程序和版本：

   ```sh
   adb shell dumpsys webviewupdate | grep "Current WebView package"
   ```

如果面板列出多个提供程序，请明确选择新版本：

```sh
adb shell cmd webviewupdate set-webview-implementation com.android.webview
```

或在开发者选项中使用 _WebView 实现_。
