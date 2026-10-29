---
title: Tuya TPA10
description: Tuya TPA10 硬件信息：10.1 英寸 Rockchip rk3566 面板，配备 RGB LED、五个按键、摄像头以及温湿度和接近传感器。
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10.1 英寸, 1920 × 1200
support: 完整支持
root: 带有 su；LED、温湿度和第五个按键需辅助程序
webview: Chrome 83；通过 root 替换为 LineageOS 150
released: '2023-08（估计）'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10 正面及侧边按键条
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Tuya TPA10 正面平视图，展示侧边按键条和边框边缘
photoCredit: '照片：Tuya'
sold_as:
  - brand: Tuya
    name: 'TPA10-M2'
    note: 'Tuya 目录中的名称'
  - brand: Tuya
    name: 'Control Panel MAX'
    note: '零售和 FCC 登记名称'
evidence: [bench, mostly-open, firmware, documented, owners]
sidebar:
  label: TPA10
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

尚未找到此面板的厂商固件发行说明。本页固件信息来自对受检设备的观察。

宽大的 **10.1 英寸 1920×1200** rk3566 面板，配备一个前置 RGB LED、单色按键背光、丰富的传感器（飞行时间接近检测、温湿度、环境光）、摄像头和五个实体按键。无 Zigbee、NFC 或红外。信息来自运行中实机的逆向分析（Android 11、已 root、带有 `su`）。

## 其他销售名称

Tuya TPA10、TPA10、TPA10-M2（M2A、M2E、M2U、M2X）、TPA10 Control Panel MAX、Control Panel MAX、Panel MAX、rk3566 Tuya 面板、SmartOS Xinch（厂商软件包 `com.smartos.xinch.setting`、`com.smartos.xinch.hardware`、`com.smartos.xinch.platform.ethernet`）、`com.tuya.devicetest`。

:::tip
关键事实：adb **受密码保护**，应使用 USB 诊断应用后门。LED 和仅 root 可访问的传感器需要 **`hapaneld-helper` root 辅助守护进程**。向前置 LED 写入 `custom_animation` 可能**使面板重启**（见下方警告）。请**先更新 WebView**；参见 [WebView：请先更新](#webview请先更新)。
:::

| 项目     | 详情                                                                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **rk3566**                                                                                                                                                 |
| 显示屏   | **1920×1200**（16:10 横屏），约 10.1 英寸，**物理像素密度约 226 ppi**，56 Hz。Android 出厂基础逻辑密度为 **240 dpi**（通常会覆盖以调整仪表盘大小；建议 212）        |
| Android  | 11（API 30）                                                                                                                                                        |
| ABI      | armeabi-v7a（32 位用户空间）                                                                                                                                        |
| 无线功能 | Wi-Fi、Bluetooth 和 BLE，另有厂商 `com.smartos.xinch.platform.ethernet` 功能（有线、PoE）。**无 Zigbee、NFC、红外或蜂窝网络。**                                     |
| Root     | 可使用 `su`；LED 和 sysfs 传感器属于 `system:system`，因此**需要 root 辅助守护进程**（见下文）。                                                                    |
| 上市时间 | 约 2023 年 8 月（估计）；FCC ID 2A789-TPA10 登记名为“Control Panel MAX”，约于 2023 年 8 月 22 日获批（[FCC ID 2A789-TPA10 批准记录](https://fccid.io/2A789-TPA10)） |

:::tip
要修改无按键面板的固件？请先阅读[固件备份与恢复](/zh-hans/hardware/guides/firmware-backup-and-restore/)。TPA10（rk3566、Android 11、7.28 GB eMMC `mmcblk2`）已有通过 `adb reboot loader` 和 `rkdeveloptool` 以软件进入 Loader 的验证途径。凹入的[针孔按键](#按键)不是 Linux 输入，其恢复出厂设置或 Maskrom 行为尚未安全确认，不要将其当作恢复途径。
:::

## 获取 adb 和 root 访问权限

TPA10 出厂 adb **受密码保护**，且网络 adb 关闭。可靠的首次访问途径是 USB 诊断应用后门，无需计算密码。设备已带有 `su`，因此连上 adb 即可获取 root。以下整理自 [seaky/nspanel_pro_tools_apk issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123)。

**首次访问途径。** 尚无经过验证的无需电脑开启 TCP 端口 5555 网络 ADB 的方法。请先按下述诊断应用流程使用 USB；后续 root 命令仅在首次连接后使网络 ADB 持久启用。

**1. 开启开发者选项。** 在设置的 _关于_（About） 中连续点击构建或版本号七次。

**2. 通过 USB 诊断应用后门首次访问（推荐）。** 开发者选项提供一个只有中文界面的 Tuya 工程**诊断应用**。该应用打开时，**USB** 端口上的 adb 无需密码即可使用，且会话已具有 root。连接 USB 并运行：

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

TPA10 的 adb root 通过 USB 端口比网络更可靠。

**3. 使 adb 持久启用（root、免密码、可靠途径）。** 诊断应用在前台时，可获得 root adb 会话（带有 `su`，且因构建为 `userdebug`，`adb root` 也可用）。利用它持久启用 adb，以后不再需要测试应用或密码。实机已验证：关闭诊断应用和完整重启后均保留。推送并以 root 运行：

```bash
# persist-adb.sh — run via the diagnostics-app backdoor:
#   adb push persist-adb.sh /data/local/tmp/ && adb shell su 0 sh /data/local/tmp/persist-adb.sh
settings put global adb_enabled 1                   # USB debugging, persisted in /data
settings put global development_settings_enabled 1  # keep Developer options visible
setprop persist.adb.tcp.port 5555                   # network adb on :5555 — persist.* survives reboot

# Pre-authorise each controlling machine so NO on-screen "Allow USB debugging" is needed after reboot.
# Append the contents of every workstation's ~/.android/adbkey.pub (one key per line):
mkdir -p /data/misc/adb
cat >> /data/misc/adb/adb_keys <<'KEYS'
PASTE-EACH-adbkey.pub-LINE-HERE
KEYS
chmod 640 /data/misc/adb/adb_keys
chown system:shell /data/misc/adb/adb_keys 2>/dev/null
restorecon /data/misc/adb/adb_keys 2>/dev/null

setprop ctl.restart adbd                            # apply now (and it auto-starts every boot)
echo "adb persisted: adb_enabled=$(settings get global adb_enabled) tcp=$(getprop persist.adb.tcp.port)"
```

网络途径要求面板连接 Wi-Fi。之后，任何预先授权的电脑都可通过 `adb connect <panel-ip>:5555` 连接，即使重启或关闭厂商应用也可用。擦除 `/data` 或恢复出厂设置会清除 `adb_keys` 和 `adb_enabled`，之后需再次运行脚本。

:::caution
**开发者选项中“Enable ADB”的密码不是可用途径，请勿尝试计算。** [issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) 中的社区方法无法复现。对 `com.smartos.xinch.setting` 中 `checkDevPassword` 的反编译确认其形式为：`base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))`，再取 `takeLast(6)`，不区分大小写（`deviceId` 为空时使用 `takeLast(ro.tuya.uuid,6)`）。但其中的 `deviceId` 无法与任何可读标识符对应：实机上 `ro.serialno`、`android_id` 和 `ro.tuya.key` 均被拒绝。应用的日志器**不是** logcat，因此也无法在设备上读取预期值。该 issue 的示例还存在笔误（将 `11a` 加 `xia` 写成 `11xia`，应为 `11axia`）。请使用上述 root 方法，使密码不再相关。
:::

:::danger
仅在确认 adb 稳定可用，且已有硬件按键替代方案后，才在**最后一步**停用厂商 `com.smartos.xinch.*` 软件包。adb 尚不可靠时停用硬件或设置应用，可能使你失去访问权限。面板应用的远程导航操作（返回、主屏幕）及按键背光和 LED 实体可替代厂商应用功能。
:::

:::note
厂商设备内应用不是有效的逆向分析来源。`com.tuya.devicetest` 已 odex 化（APK 中无 dex），`com.smartos.xinch.hardware` 捆绑 Tuya **AVS（Alexa）SDK**（`libLibSampleApp.so`，17 MB）和键读取器（`libjnimain.so`）。权威来源是设备自身具有自描述信息的 sysfs 节点。
:::

## WebView：请先更新

原厂 WebView 为 **Chrome 83**，对当前 Home Assistant 前端而言过旧，因此替换前仪表盘会空白或损坏。推荐 **LineageOS System WebView 150**（`armeabi-v7a`），它是保持更新、有人维护的原版 Chromium 引擎。优先选择它而非 Cromite：Cromite 将 Chromium 的自动播放内容设置改为阻止，使 Home Assistant 摄像头卡片（WebRTC）必须点击才能开始；LineageOS 保留允许自动播放，因此摄像头流可自行开始。

TPA10 在 WebView 内的视频解码余量有限。多个可见的 720p WebRTC 卡片可能掉帧，或某个流一直等待首帧，即使单流正常。遇到此情况，请使用更低分辨率子码流、减少同时自动播放的卡片，或使用点击后切换实时视频的快照。

从镜像下载（稳定 URL）：

```
https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

### 为什么普通安装不可行

WebView 的包名为 `com.android.webview`，因此必须**替换**系统提供程序，而两种直观途径在此 Android 11 面板上均失败：

- `adb install -r` 被拒绝，错误为 `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match`。Android 仅允许使用与已安装包**相同密钥**签名的 APK 更新 `com.android.webview`，而各 WebView 厂商使用不同密钥。同理，**普通旁加载无法进行首次替换**：它通过面板阻止的 `pm install` 安装。下述替换是**一次性**手动步骤。安装 LineageOS 后，后续 LineageOS 版本可通过 `adb install -r` 旁加载，因为签名者相同。
- ROM 允许列表仅接受 `com.android.webview`，不接受 `com.google.android.webview` 版本，因此 Google 构建虽可安装，却不会被选中。

### 使用 root 的可行方法：替换文件并清除签名锁

面板有签名锁，但可获取 root：应用不能调用 `su`，shell 却可以（`adb shell su root <cmd>`）。此方法将新 APK 放入系统 WebView 位置，并从软件包数据库删除其条目，使 PackageManager 在重启后将其作为**全新**软件包注册，读取新 APK 自身签名而不发生冲突。

```bash
IP=<panel-ip>:5555
adb connect $IP
adb -s $IP shell su root id                           # confirm it prints uid=0(root)

# 1. push the new WebView, and back up the current WebView + package database first:
adb -s $IP push lineageos-webview-150.0.7871.63-arm.apk /data/local/tmp/wv-new.apk
adb -s $IP shell su root sh -c 'cp /product/app/webview/webview.apk /data/local/tmp/webview.bak;
                                cp /data/system/packages.xml /data/local/tmp/packages.xml.bak'

# 2. replace the system WebView APK (remount /product read-write first — verity must already be off;
#    a never-modified panel needs a one-time `adb root && adb disable-verity && adb reboot` beforehand):
adb -s $IP shell su root sh -c 'mount -o rw,remount /product;
    cp /data/local/tmp/wv-new.apk /product/app/webview/webview.apk;
    chmod 644 /product/app/webview/webview.apk; chown root:root /product/app/webview/webview.apk;
    restorecon /product/app/webview/webview.apk'

# 3. remove the single <package name="com.android.webview" …>…</package> element from packages.xml.
#    Do NOT hand-edit it — pull it, let a parser remove exactly that element, then push it back:
adb -s $IP shell su root sh -c 'cp /data/system/packages.xml /data/local/tmp/pkgs.xml; chmod 644 /data/local/tmp/pkgs.xml'
adb -s $IP pull /data/local/tmp/pkgs.xml packages.xml
python3 - <<'PY'
import xml.etree.ElementTree as ET
d = open('packages.xml', encoding='utf-8').read()
m = '<package name="com.android.webview"'
assert d.count(m) == 1, 'expected exactly one com.android.webview package'
s  = d.find(m); ls = d.rfind('\n', 0, s) + 1                      # start of that line
e  = d.find('</package>', s) + len('</package>'); le = d.find('\n', e) + 1  # end of its closing line
new = d[:ls] + d[le:]
ET.fromstring(new)                                                # abort if the result isn't valid XML
open('packages.xml', 'w', encoding='utf-8').write(new)
print('removed com.android.webview; XML still valid')
PY
adb -s $IP push packages.xml /data/local/tmp/pkgs.new
adb -s $IP shell su root sh -c 'cp /data/local/tmp/pkgs.new /data/system/packages.xml;
    chown system:system /data/system/packages.xml; chmod 660 /data/system/packages.xml;
    restorecon /data/system/packages.xml'

# 4. reboot — PackageManager registers the new WebView fresh:
adb -s $IP reboot
```

**如果出现问题**，请用步骤 1 的备份恢复：将 `/data/local/tmp/webview.bak` 复制回 `/product/app/webview/webview.apk`，将 `/data/local/tmp/packages.xml.bak` 复制回 `/data/system/packages.xml`（使用相同的 `chown`、`chmod` 和 `restorecon`），然后重启。

:::danger
**此方法实施后报告的 WebView 版本不正确，请勿相信。** 设置、WebView 和 `adb shell dumpsys webviewupdate` 仍显示 **`83.0.4103.120`**，因为旁加载的 SystemWebView **写入 OEM 原厂 `versionName` 和 `versionCode`**，以通过面板最低版本限制并被选中。实际引擎为 150。验证方法：

- **User-Agent：**在面板上打开任意显示用户代理的页面；UA 包含 `Chrome/150.0.7871.63`。
- **面板应用：**面板状态页面和 `/diag` 使用其报告的 HTTP 端口（默认 8888），显示 `engine Chromium 150.0.7871.63`，因为它们读取 UA，而非写入的包版本。

普通 adb 旁加载在此签名锁定面板上**不可行**。镜像中保留 Cromite 147 作为备用，使用同一流程但不同 APK。
:::

## LED

### RGB LED：`avsux` 驱动（root 辅助守护进程）

前置 RGB LED 是 `leds_pwm_avs` 平台驱动（设备 `avsux`）上的**单个** LED（`avsux_info` 报告 `led type:[single] nums:[1]`），位于 `/sys/class/leds/avs-pwm-led/`。

:::danger
已观察到向 `avsux_select` 写入 `custom_animation` 会**使面板重启**。请用 `avsux_animation` 设置颜色；除非进行测试，否则将 `avsux_select` 和 `custom_animation` 视为只读。
:::

LED **没有应用可访问的 `/dev` 节点**（对比 [WF1589T](/zh-hans/hardware/panels/electron/wf1589t/) 的 `/dev/ledjni`），sysfs 属性属于 `system:system`，因此 `untrusted_app` 无法写入。面板应用使用小型 **root 辅助守护进程**（`/system/bin/hapaneld-helper`，以 root 运行，通过 Unix 套接字通信）；`SocketLedController` 为客户端。参见[辅助程序文档](https://github.com/panel-assistant/android/blob/main/helper/README.md)。

#### `avs-pwm-led` sysfs 属性

| 属性              | 权限               | 用途                                                      |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | 总体亮度 0 至 255                                         |
| `avsux_animation` | `system:system` rw | 安全写入颜色或动画                                        |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | 列出命名动画（`bootanime`、`idle`）                       |
| `avsux_info`      | r                  | 元数据（LED 数量和类型）                                  |

### 按键背光

`/sys/class/leds/button-backlight/brightness` 是**单色** PWM 输出，范围 0 至 255（标准 `leds_pwm` 驱动，设备 `pwmleds`）。其权限为 `system:system` 0664，因此通过同一 `hapaneld-helper` 守护进程驱动。

## 传感器

接近和环境光通过 `SensorManager` 由应用直接访问。温度和湿度仅 root 可访问（输入子系统和 I²C），需要辅助守护进程。

:::tip
CHT8305 使此面板可作为 Home Assistant 的**室内温湿度传感器**。辅助守护进程用 `CHT8305` 动词读取它，即对驱动 `ABS_THROTTLE` 输入轴进行 `EVIOCGABS` 点读取，并按名称匹配 `temperature` 和 `humidity` 输入设备。面板应用随后在 Home Assistant 提供两个可选的**室内温度**和**室内湿度**传感器（设置、诊断；默认关闭）。高级设置**室内温度偏移**或配置文件的 `sensors.room_temp_offset_c` 可修正面板自身发热的影响。
:::

TPA10 的飞行时间传感器使接近检测真正基于距离，但 Android HAL 会将其量化。面板上的引导接近设置采集并保存实时传感器的无遮挡和靠近端点及方向，随后面板报告所有支持面板通用的归一化刻度，不依赖固定的设备专用阈值。

### 传感器芯片与访问途径

| 传感器           | 芯片                                                                               | 访问                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 接近（飞行时间） | Vishay **VI5300**（i2c-3 `0x6c`、`proximity_vi5300`、30 ms 轮询）                  | Android `SensorManager` `TYPE_PROXIMITY`，无需 root。驱动 I²C 节点（`…/i2c-3/3-006c`）上的原始毫米距离需 root。 |
| 温度和湿度       | **CHT8305**（3-0040 处的 `temperature_cht8305`、3-0040-1 处的 `humidity_cht8305`） | **不在** `SensorManager` 中；通过 I²C 的**输入子系统**报告，仅 root 可访问。                                    |
| 环境光           | **CG5256**（`light_cg5256`）                                                       | Android `SensorManager` 光照传感器，无需 root。                                                                 |

## 按键

通过实机 `getevent` 确认，TPA10 有**三类**实体按键：

- **四个侧边按键：**`adc-keys`，映射为 `F1` 至 `F4` 的标准 KeyEvent，由面板应用无障碍按键筛选器捕获，无需特殊途径。
- **第五个（橙色）按键：**`EV_SW` 开关，不是按键事件，通过 root 辅助守护进程的 evdev 读取器读取，并作为事件发送给 Home Assistant。
- **针孔按键**（USB-C 端口旁的凹入按键）：不是 Android 输入，因此 Home Assistant 无法使用。

### 各按键详情

**1. 四个侧边按键为 `adc-keys`，发送标准 KeyEvent。** 它们位于 rk3566 **SARADC**（`fe720000.saradc`），设备 `adc-keys1`（`/dev/input/event7`），扫描码 `59` 至 `62`。原厂 `Generic.kl` 将其映射为 **`F1` 至 `F4`**，成为 Android `KEYCODE_F1` 至 `KEYCODE_F4`；面板应用通过无障碍按键筛选器捕获。在带 `su` 的设备上，可编辑 `/system/usr/keylayout/Generic.kl` 重新映射（例如 `BRIGHTNESS_*` 或 `VOLUME_*`）。

**2. 第五个（橙色）按键是开关，而非按键。** 在 `gpio-keys`（`/dev/input/event8`）上，它报告 **`EV_SW` `SW_MUTE_DEVICE`**（开关码 `14`），是锁存事件，**不是** `EV_KEY`。因此没有对应 keylayout 条目，Android 无障碍功能也无法看到它。它会物理静音麦克风，与无障碍按键传递无关。面板应用通过 root 辅助守护进程 evdev 读取器（`WATCH /dev/input/event8`、`sw=true`）读取，并在每次切换时发送 Home Assistant 事件（`KEYCODE_MUTE`），已完成端到端验证。这是原厂行为，在撰写时尚未见其他记录。

**3. 针孔按键（USB-C 端口旁的凹入按键）不是 Android 输入。** `getevent`、`gpio-keys` 和 `dmesg` 中均不存在，因此 Home Assistant 无法使用。其电气作用尚未安全确认。位置和 rk3566 平台暗示可能用于复位或启动模式，但没有经过验证的长按时长、恢复出厂行为或 Maskrom 进入流程。不要假定它能提供可恢复的刷写途径而按下或长按。Android 仍能启动时，请使用已验证的软件进入 Loader 途径，并遵守[固件备份与恢复](/zh-hans/hardware/guides/firmware-backup-and-restore/)的限制。

## 摄像头

GalaxyCore **GC05A2 / GC5035**，2592×1944 传感器。Android 通过 `legacy/0` 提供程序（`device@3.3`）报告一个 `LIMITED` 硬件级别摄像头，仅支持 `BACKWARD_COMPATIBLE`，`Facing: Back`，无闪光灯、无自动对焦。

:::note
固件自身的功能标志不正确：面板声明 `android.hardware.camera.front`，但 HAL 报告 `Facing: Back`。应依据设备配置文件和 `CameraManager` 实际枚举结果判断，绝不依据 `hasSystemFeature`。
:::

`IMPLEMENTATION_DEFINED`、`YUV_420_888` 和 `BLOB` 三种格式均提供 1280×720，因此支持预览和静态拍摄格式。HAL 声称在 30 fps 下拍摄 720p `BLOB` 会停顿一帧。该厂商静态拍摄数据不代表面板应用 H.264 视频流的开销。`android.control.aeAvailableTargetFpsRanges` 仅提供 `[15 30]` 和 `[30 30]`：没有固定 15 fps 的传感器模式，因此 15 fps 视频流依靠编码器节奏控制，而非传感器。

唯一硬件 H.264 编码器为 `OMX.rk.video_encoder.avc`，由 OMX IL HAL 提供（此面板有 `media.codec` 进程，没有 Codec2 厂商服务）。它声明支持 `176x144` 至 `1920x1088`、`16x8` 对齐、报告码率范围 1 bps 至 10 Mbps、四个并发实例。**没有硬件 HEVC 编码器**；唯一 HEVC 条目是软件 `c2.android.hevc.encoder`，出厂为 `enabled="false"`。

:::caution
厂商 `media_codecs_performance.xml` 数据应视为模板内容，而非测量结果：硬件和软件 AVC 编码器在 720×480 和 1280×720 下报告完全相同的 `measured-frame-rate`，不可能是真实测量。在自己的面板上测出其他结果前，请按 720p 处理。
:::

显示摄像头卡片的面板并非空闲。在实测仪表盘上，面板应用维持两个活动的 `OMX.rk.video_decoder.avc` 实例，因此编码会与同一 Rockchip VPU 上现有解码任务竞争资源。

面板应用可将此摄像头作为**默认关闭**的功能提供。在设置的摄像头卡片上开启**摄像头**开关后，可调整**分辨率**、**帧率**和**比特率**（默认 720p、15 fps、2000 kbps），以及**曝光**补偿。它通过 `rtsp://<panel>:8554/live` 提供 H.264 视频流；麦克风可用且获准使用时也提供室内音频。Home Assistant 通过面板摄像头实体从此流获取静态图片。摄像头打开时，面板始终显示页面内容无法遮盖的红色指示器。摄像头实体详见[控制参考](/zh-hans/reference/api/)。

:::caution
不要在**此面板**自己的仪表盘上放置**此面板**的 Home Assistant 摄像头卡片。这会使面板在同一视频引擎上循环解码自身编码的视频，没有任何益处。
:::

## 其他芯片

摄像头 GalaxyCore **GC05A2 / GC5035**；音频编解码器 **ES7202**（采集 ADC；用橙色实体按键取消静音后，已通过 Android 采集验证近距离语音和 Assist；远场拾音和背景音乐表现尚未验证）；Goodix 触摸；`rk808` 和 `rk860` PMIC。

## 访问模型概览

- **LED 和按键背光：**仅 root（`system:system` sysfs），通过 `hapaneld-helper`。
- **接近和环境光：**应用直接访问（`SensorManager`）。
- **温度、湿度：**仅 root（输入子系统和 I²C），通过辅助守护进程。
- **按键：**四个侧边按键由应用直接访问（通过无障碍功能传递 KeyEvent）；第五个橙色按键是通过 `hapaneld-helper` evdev 监视读取的 `EV_SW` 开关；针孔按键不是输入。
