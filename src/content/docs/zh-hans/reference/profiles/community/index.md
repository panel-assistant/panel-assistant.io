---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 社区面板配置文件
description: 社区为应用未内置支持的面板提供的配置文件、安全导入方法，以及如何启用配置文件未声明的相机。
sidebar:
  label: 概览
  order: 0
---

这里列出社区提供、未内置于 ha-paneld 的配置文件。列入此处并不表示 ha-paneld 能在所述零售硬件的出厂状态下运行。每个配置文件可能描述某种特定刷机、固件修改或单个已报告安装环境，而非厂商原装软件。

社区配置文件绝不会被自动选择。请下载单独的 YAML 文件，检查其来源、已测试固件和限制，再使用面板的 **配置文件** 页面导入。导入和验证仅用于预览，不会保存或激活配置文件。

保存之前，预览必须报告至少一个完整匹配组中的每项条件都与面板不可变的设备事实一致。仅名称匹配并不足够。激活会严格检查该身份并拒绝不安全的触摸屏独占，但不会预先检查每条实时特权途径。受控重启后，运行中的各功能驱动会在初始化或使用时探测其接口和权限；不可用的功能会保持不可用，启动健康检查决定候选配置保持激活还是回滚。绝不要将成功导入或激活视为所有已声明功能都能工作的证明。

## 安全试用社区配置文件

1. 打开 Home Assistant 中的面板设备页面，选择 **访问**，然后打开 **配置文件**。导出当前激活的修订版本，并创建最新的完整面板备份。如果直接连接，请使用面板报告的 HTTP 端口（默认端口下为 `http://<panel-ip>:8888/profiles`）。
2. 下载并检查 YAML。确认其具体固件和修改前提与您面前的面板一致。
3. 在 **配置文件** 中粘贴或上传 YAML，然后验证。如果身份匹配不完整、缺少所需的已编译驱动，或报告不安全的输入映射，请不要继续。验证不能证明实际硬件权限可用。
4. 将验证后的内容保存为未激活的本地修订版本。保存仍不会改变运行中的配置文件。
5. 只有有人能看到并触摸面板时，才按照[配置文件测试清单](/zh-hans/reference/profiles/testing/)测试并激活。激活与确切的配置文件 ID、修订版本和内容哈希绑定。
6. 重启后，检查实际功能结果，确认激活的修订版本、预期控制和 Home Assistant 实体。不可用的途径必须保持不可用，不能被当作成功。在无人值守地依赖该配置文件之前，请实际执行 **回滚**；启动健康检查失败时，应自动返回上次正常工作的修订版本。

返回 **使用自动匹配** 只会选择内置配置文件或保守的通用回退配置，不会自动重新激活社区修订版本。

## 在配置文件未声明相机的面板上启用相机

面板只要有相机，就会提供相机功能：可以是配置文件通过 `hardware.camera` 声明的相机，也可以是配置文件未说明、但 Android 枚举出的相机。因此，具备可用相机硬件的主板通常完全不需要配置文件条目，**设置** 中就会出现摄像头分组，无需任何人编辑 YAML。

仍有三种情况会使其不可用，此时 **设置** 中的摄像头卡片会说明具体原因，而不是直接消失：

- **配置文件抑制了它。** `hardware.camera: false` 是有意设置的第三种状态，不等同于省略该键：它表示枚举出的设备不是可用的房间相机，例如 HDMI 采集输入。删除该行或设为 `true`，即可提供相机。
- **Android 未枚举到相机。** 如果面板确实有相机，请在配置文件中声明 `hardware.camera: true`。声明优先于空的枚举结果，因此相机服务存在但枚举不可靠时，也可以这样修复。
- **枚举尚未返回。** 这并不说明硬件情况。请等待几秒后重新加载设置页面，无需编辑任何内容。

声明主板未提供的相机是安全的，不会造成损害。轻量运行时探测会读取 Android 的相机标识符列表以报告功能；已声明的相机仍会提供，而没有相机的主板会以归类的 `no_camera_id` 故障拒绝打开，操作提示会说明配置文件有误。不会影响面板稳定性。

这一标志伴随一项要求：除非面板能向房间中的人指示相机已开启，否则会拒绝使用相机；屏幕关闭时，这意味着需要屏幕以外的指示途径。如需在屏幕关闭时采集，请提供可用的 LED 指示途径。屏幕点亮时，屏幕上的指示器可以满足要求，无需 LED。设置 `hardware.camera_lens_offset_px`，让指示器位于镜头下方，而不是旁边。

该标志不会改变相机的其他行为：启用之前保持关闭，不会建议默认开启该开关，而且通过 Home Assistant 相机实体开启时，无论哪种安全模式，都需要在面板自身屏幕上批准。“设置”中的摄像头设置是单独的所有者配置途径。

## 目录

- [`community-cronos-lineageos18.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml)：为一位贡献者刷入 LineageOS 18.1 的 Amazon Echo Show 5 Gen 2 编写的草稿。原装 Fire OS 无法运行 ha-paneld；不支持解锁、刷机和恢复，项目也未在硬件上验证该配置文件。参阅[此配置文件的证据说明](/zh-hans/reference/profiles/community/echo-show-5-gen2/)。
- [`community-lenovo-thinksmart-view-lineageos.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-lenovo-thinksmart-view-lineageos.yaml)：为一位贡献者刷入 LineageOS 8.1 的 Lenovo ThinkSmart View 编写的草稿。由于亮度为零时仍明显发光，它选择 Android 休眠，记录触摸无法唤醒面板，并注明贡献者已确认 Home Assistant 可以调暗、完全关闭并再次唤醒。参阅[此配置文件的证据说明](/zh-hans/reference/profiles/community/lenovo-thinksmart-view/)。
- [`community-sunworld-yc-sm55p-p76s01.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-sunworld-yc-sm55p-p76s01.yaml)：为一位贡献者使用 Portworld P76S01 主板的 5.5 英寸 Sunworld YC-SM55P 编写的草稿。配置文件记录了由固件佐证的 RK3576S 身份和保守的 Android 控制途径，但在实物测试之前保持可选传感器和相机硬件禁用。其通用 Rockchip 构建身份不足以安全地用于自动选择。参阅[此配置文件的证据说明](/zh-hans/reference/profiles/community/sunworld-yc-sm55p/)。

配置文件格式、信任边界和贡献要求请参阅[运行时配置文件指南](/zh-hans/reference/profiles/)、[格式参考](/zh-hans/reference/profiles/format/)、[测试清单](/zh-hans/reference/profiles/testing/)和[分享指南](/zh-hans/reference/profiles/sharing/)。
