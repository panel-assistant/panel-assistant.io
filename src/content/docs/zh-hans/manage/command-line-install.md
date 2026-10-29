---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 安装脚本（已停用）
description: 命令行安装程序已无法安装或更新面板。了解替代方式，以及如何从面板移除 ha-paneld。
---

命令行安装程序已移除。请通过 Home Assistant 中的 Panel Assistant 添加和更新面板。

请改用 Panel Assistant 从 [Home Assistant](/zh-hans/install/installing-ha-paneld/) 添加和更新面板。使用脚本安装的面板仍可继续工作。将其添加到 Panel Assistant 后，会直接连接而不重新安装，此后由 Panel Assistant 提供更新。

## 启用网络 ADB

在某些 Tuya TPA10 和 Smatek 面板上，ADB 最初只能通过 USB 工作。请在 Home Assistant 中添加面板之前，连接 USB 线并开启网络 ADB：

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

## 从面板移除 ha-paneld

在 Home Assistant 的 **配置** 中选择面板的 **从此面板移除 Panel Assistant** 选项。在 1.0.0-rc1 中，选择是否让 Home Assistant 忘记该面板，然后选择 **提交**。在尚未发布的 1.0.0-rc2 版本中，该选项名为 **从此面板移除**，成功移除后始终会删除其 Home Assistant 条目。Panel Assistant 会恢复面板自身的主屏幕并卸载面板应用。请先阅读[移除 ha-paneld 之前](/zh-hans/manage/removal-risks/)。

## 访问方式和安全模式

硬件配置文件的建议仅供报告。选择配置文件并不表示同意禁用软件包、持久启用 ADB、安装特权软件或更改显示设置。您已在[厂商软件包](/zh-hans/manage/vendor-packages/)卡片上限制的软件包，仍会在每次启动时重新受到限制。

[强化安全模式](/zh-hans/manage/security-mode/)要求面板前有人批准特定的高影响远程操作。只能在面板上开启此模式。开启后无法使用网络 ADB，因此通过 ADB 安装或更新之前，请先在面板上切回宽松模式。

## 自行构建

此应用是自由开源软件，[开发环境](/zh-hans/reference/development-environment/)页面介绍了构建方法。
