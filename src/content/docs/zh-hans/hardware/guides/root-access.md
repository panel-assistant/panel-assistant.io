---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 获取 adb 和 root 访问权限
description: 各款已记录的壁挂面板如何获得 adb 和 root 权限、面板应用使用 root 的用途，以及各型号的具体操作位置。
sidebar:
  label: adb 和 root 访问权限
  order: 1
---

每款面板获得 adb 以及可用的 root 权限的方式都不同。本页介绍总体情况；针对具体固件的步骤请参阅各面板页面。

## root 的用途

面板应用无需 root 即可安装和运行。只有 Android 不向普通应用开放的硬件才需要 root：

- **归 `system` 所有的 sysfs 和输入节点。** 某些面板的 LED、按钮背光和温湿度传感器属于 `system:system` 文件，沙盒中的应用无法写入或读取。此时，面板应用通过 Unix 套接字与小型 root 辅助守护进程 `hapaneld-helper` 通信。参阅[辅助程序文档](https://github.com/panel-assistant/android/blob/main/helper/README.md)。
- **真正关闭背光、重启和控制 CPU 调速器。** 没有 root 途径时，会退回 Android 允许的方式，例如将亮度设为零，而不是切断背光电源。
- **继电器和 GPIO 线路**：适用于仅通过需要 root 的 sysfs 开放这些硬件的面板。

面板应用在使用特权通道时会检查这些通道。没有 root 权限的面板仍可使用仪表盘、标准传感器、亮度调节及受支持的导航功能。一些需要特权的控件在其状态可读取时仍会显示，但如果没有任何特权通道可用，更改这些控件的设置可能会失败。

## 各面板的途径

- **[Sonoff NSPanel Pro](/zh-hans/hardware/panels/sonoff/#获取-adb-和-root-访问权限)。** 使用测试密钥的 `userdebug` 构建，**没有 adb 密码**。唯一的门槛是进入开发者模式，具体方式随 eWeLink 固件而异。然后使用 `adb root`、重新挂载并安装持久的 `su`。
- **[Tuya TPA10](/zh-hans/hardware/panels/tuya/tpa10/#获取-adb-和-root-访问权限)。** adb **有密码保护**。可靠途径是 USB 诊断应用后门，系统中已有 `su`。之后用一个简短脚本让网络 adb 在重启后保持启用。
- **[Electron WF1589T](/zh-hans/hardware/panels/electron/wf1589t/#获取-adb-和-root-访问权限)。** 带 Google Play 的 `userdebug` 构建。可直接使用 `adb root`。应用可以直接访问 LED，因此很少需要 root。
- **[Electron WF2489T (ZHICAI SMT1019)](/zh-hans/hardware/panels/electron/wf2489t/#不同固件构建的-root-访问)。** 零售生产构建没有 root。供应商的 `userdebug` 构建已获取 root，但辅助程序要持久安装仍需先重新挂载。
- **[SMT156](/zh-hans/hardware/panels/electron/smt156/)。** 据报告，该安装环境中没有应用可访问的 `su`。USB `adb root`、厂商工程模式和持久解锁途径尚未测试。
- **[Smatek S9E](/zh-hans/hardware/panels/smatek/s9e/)。** 厂商应用会运行 root 命令，部分设备出厂时已解锁开发者模式。有用户报告固件 1.1.0 提供应用级 `su`；访问权限仍取决于具体设备和固件。
- **[Shelly Wall Display](/zh-hans/hardware/panels/shelly/)。** 在出厂固件 2.5.4 上测试的 [Wall Display X2i](/zh-hans/hardware/panels/shelly/wall-display-x2i/)，可以从“设置”应用解锁开发者选项和 USB 调试，此后 adb 无需授权提示即可连接，但没有 root：既没有 `su`，也无法使用 `adb root`。在那里，安装面板应用和日常使用无需 root，但本页所述的特权功能需要。其他型号尚未测试；旧款固件基于 `userdebug` 构建，因此如果能够建立 adb 连接，那里可能可以使用 `adb root`。

## 更改之前

- 禁用任何厂商应用之前，先确保 adb 可靠工作，最好是网络连接，并已预先授权工作站密钥。先禁用厂商启动器、设置或硬件应用可能导致您无法再访问面板。
- 保留导航方式。对于没有按钮的面板，面板应用的导航操作可代替厂商的返回和最近任务功能。
- 如果有厂商更新程序，请停止它，否则无线更新可能撤销您的更改。参阅[阻止不需要的更新](/zh-hans/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates)。
- 修改已获取 root 的 Rockchip 面板固件之前，请备份分区。参阅[固件备份与恢复](/zh-hans/hardware/guides/firmware-backup-and-restore/)。
- 某些途径需要 `adb disable-verity`，该操作会重启面板。受 PIN 保护的面板重启后，只有有人输入 PIN，应用才能重新启动，因此请在面板前操作。
