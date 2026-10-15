---
title: 面板账户与网络安全
description: 选择面板使用的 Home Assistant 账户，并规划其网络访问。
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

## 面板使用哪个 Home Assistant 账户？

从 Panel Assistant 添加新面板时，浏览器登录通常会使用电脑上已经登录的 Home Assistant 账户。如果那是管理员账户，面板就会以该管理员身份登录。Panel Assistant 不会索要你的密码，也不会创建另一个 Home Assistant 用户。面板会保留自己的 Home Assistant 登录状态，以便加载仪表盘，并以该用户身份与 Home Assistant 通信。

使用你平时的账户没有问题，尤其是 Home Assistant 实例只有一个用户时。如果希望将面板的访问权限与管理员账户区分开来，使用一个单独的**现有**用户就值得考虑。非管理员用户可以使用仪表盘，但无法访问 Home Assistant 设置。单独账户是可选的；Panel Assistant 不会在设置过程中创建账户。

Home Assistant 还会为每个用户保存默认仪表盘和主题。面板用户可以拥有自己的壁挂仪表盘和外观，而不改变手机或电脑上的选择。当**主仪表盘**设为**自动**时，内置渲染器会使用该默认仪表盘；在面板设置中明确选择的仪表盘优先。其**仪表盘主题**设置可以请求浅色或深色模式，但明确选择的 Home Assistant 主题仍然优先。

你可以在 **Home Assistant → 用户个人资料 → 常规**中，为面板用户设置独立的侧边栏项目与顺序、语言、时区，以及数字、日期和时间格式。侧边栏可见时，其偏好设置才有影响；面板默认隐藏导航。隐藏某个侧边栏项目不会限制对它的访问。有关这些账户设置，请参阅 [Home Assistant 的用户个人资料指南](https://www.home-assistant.io/docs/configuration/user-configuration/)。

### 更改面板的登录账户

在 Home Assistant 中打开 **Panel Assistant**，选择面板，然后打开其**配置**标签页。在**浏览器登录**下选择**重新连接**和**复制链接**。在浏览器隐私窗口中打开该链接，以你希望面板使用的现有用户身份登录 Home Assistant，然后让浏览器返回面板。如果平时的浏览器已经以管理员身份登录，使用隐私窗口会有帮助。你也可以直接在面板上打开**配置**，从那里开始浏览器登录。如果 Home Assistant 随后在**设置 → 修复**中报告面板用户不匹配，请确认所列的新用户就是你选择的用户。

浏览器必须能够同时访问 Home Assistant 和面板的本地地址，才能完成登录。面板也必须能够访问 Home Assistant。如果你通过 Home Assistant 远程打开了配置页面，但浏览器无法访问面板的本地地址，请连接到面板所在网络后完成登录，或直接在面板上完成。

## 将面板放在单独的网络中

面板可以使用无法访问互联网的 VLAN，前提是防火墙仍允许面板与 Home Assistant 相互访问，而且需要登录时，你网络中的浏览器能够访问面板。面板使用 Home Assistant 的本地地址登录并加载仪表盘。Home Assistant 也需要访问面板，以进行管理和更新。

Panel Assistant 可以在 Home Assistant 所在的机器上获取经过验证的面板应用更新，再通过本地网络发送给面板。Home Assistant 仍需能够访问更新来源。面板的版本检查以及用户从“安装”标签页主动启动的安装使用 GitHub，也需要互联网访问。没有互联网路由的 VLAN 无法执行这些检查和下载。Android System WebView 通过 Play Store、厂商固件或手动安装单独维护，因此也请规划它的维护方式。

网络隔离会限制哪些设备能够访问面板的网页界面和 API，但不会降低已在面板上登录的 Home Assistant 账户权限。如果面板使用管理员账户，即使处于隔离的 VLAN 中，它仍然以管理员身份登录。请根据你对墙上面板和本地网络的信任程度，选择账户和防火墙规则。

面板的网页界面和常规控制以可信的本地网络为前提。可选的 [加固模式](/zh-hans/manage/security-mode/)要求对某些影响较大的直接 LAN 请求进行面板现场操作。对于 Home Assistant 管理员，一些常规管理操作可以通过已认证的 Panel Assistant 侧边栏执行；其他受保护操作仍需在面板屏幕上批准。该模式不能替代网络隔离，也不会为每个 API 请求提供身份认证。
