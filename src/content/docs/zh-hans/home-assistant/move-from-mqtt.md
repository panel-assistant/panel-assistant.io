---
title: 将面板从 MQTT 迁出
description: 将面板的实体从 Home Assistant 的 MQTT 集成交接给 Panel Assistant，并保留实体 ID、历史记录和自定义设置。
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Panel Assistant 1.0 使用 Home Assistant 的原生连接，不支持 MQTT。如果面板实体仍在使用 MQTT，请先运行 Panel Assistant **0.9.0**，以便它在保留实体 ID、历史记录和自定义设置的同时完成迁移。如果已经更新到 1.0，请在更改版本之前，按照[如果迁移未完成](/zh-hans/manage/upgrade-to-1-0/#如果迁移未完成)中的说明操作。

下面的操作指南是适用于 Panel Assistant 0.3 至 0.8 的历史说明。其中的**控制方式**选项在 1.0 中已不存在。

每次迁移一个面板，每次迁移都可以撤销。面板的实体会保留其实体 ID、历史记录，以及您为它们设置的任何名称、图标或区域，因此使用这些实体的仪表盘和自动化会继续正常工作。

:::caution[抢先体验]
迁移是一项新功能。请先在一个面板上试用，并在 [Discord](https://panel-assistant.io/go/discord) 或[问题跟踪](https://github.com/panel-assistant/ha-integration/issues)中告诉我们结果。
:::

## 开始之前

- Home Assistant 中已按照“[安装集成](/zh-hans/home-assistant/custom-integration/)”中的说明，通过 HACS 安装 **Panel Assistant 0.3.0 至 0.8**。
- 面板上已安装 **ha-paneld 0.9.8-rc1 或更新版本**。在 Home Assistant 中，通过面板的 Panel Assistant 更新实体安装所提供的更新。如果所需的预发布版本未在此处提供，请在面板 Web 界面的**安装**选项卡中选择该版本，并自行启动安装。
- **面板已登录 Home Assistant**；如果面板显示了仪表盘，就说明它已登录。
- **保持现有 MQTT 设置不变**。迁移期间，面板仍会使用消息代理，无需对消息代理做任何更改。

## 1. 启用 Panel Assistant 实体

将以下内容添加到 `configuration.yaml`，然后重启 Home Assistant：

```yaml
panel_assistant:
  native_entities: true
```

此时尚不会迁移任何内容。Panel Assistant 已知的每个面板都会在其 Panel Assistant 设备下新增第二组实体，与 MQTT 实体并存，以便比较这两组实体。迁移面板时，其 MQTT 实体会取代这第二组实体。

## 2. 将面板添加到 Panel Assistant

如果面板已经出现在**设置**、**设备与服务**中的 Panel Assistant 下，请跳过此步骤。

选择**添加集成**，然后选择 **Panel Assistant**，再选择**添加面板**，并输入面板的主机名或地址。Panel Assistant 会发现 ha-paneld 已在运行，并提供**连接到 Home Assistant**选项。面板上的任何内容都不会被重新安装。

## 3. 确认面板的用户

面板首次连接时，Home Assistant 会显示一条修复提示，要求**确认面板的 Home Assistant 用户**。从**设置**、**修复**中打开该提示，检查其中列出的用户是否为面板登录时使用的账户，然后确认。

面板会自行重试，因此修复提示最多可能需要 15 分钟才会出现；确认后，面板也可能需要再等待同样长的时间才能连接。

## 4. 迁移面板

在**设备与服务**下打开面板的 Panel Assistant 条目，选择**配置**，将**控制方式**设为 **Panel Assistant**，然后保存。

该条目会重新加载，面板会重新连接。其 MQTT 实体会迁移到 Panel Assistant，面板确认迁移后，该面板的 MQTT 设备就会被移除。在此过程稳定下来之前，实体预计会显示为不可用几秒钟，大约 30 秒后还会再出现一次这种情况。随着每个实体上报状态，设备的活动日志会充满状态变化记录；这是正常现象。

从此以后，更改面板实体上的设置或按下其按钮，都会通过 Panel Assistant 执行。迁移面板之前，操作这些相同的控件时，收到的回应会是该面板由 MQTT 控制。

### 不会迁移的内容

两个 MQTT 按钮在 Panel Assistant 中没有对应项：**Update ha-paneld** 和 **Update Companion app**，因此它们会被移除，任何残留的 ha-paneld MQTT 更新实体也会一并移除。请使用面板的 Panel Assistant 更新实体来更新面板应用。

如果其中某个实体自定义过名称、图标或区域，或已被隐藏或禁用，Panel Assistant 不会代为移除它，而是会在修复提示中将其列出。在删除该实体或清除这些设置之前，面板会保留其 MQTT 实体。

## 将面板迁回

再次打开**配置**，将**控制方式**设为 **MQTT，并附带用于比较的原生报告**，或设为 **MQTT**。实体会迁回 MQTT 集成，并保留相同的实体 ID 和历史记录，面板也会再次宣告其 MQTT 设备。

始终使用这种方式将面板迁回。Panel Assistant 控制面板期间，不要删除该面板的 Panel Assistant 条目：Home Assistant 会在删除过程中清除该条目的实体，虽然 Panel Assistant 会先将这些实体交还，但自定义过的实体仍可能在此过程中丢失其名称、图标或区域。

## 已知限制

- **某些传感器会一直不可用。** 面板可能会为其硬件未上报的传感器提供实体，例如接近、温度或湿度传感器。这些是新增的 Panel Assistant 实体，并非迁移而来的实体，因此禁用它们不会丢失任何内容。
- **已迁移面板上的旧版 ha-paneld。** 如果已迁移的面板后来降级到低于 0.9.8-rc1 的版本，它会再次宣告其 MQTT 实体。Panel Assistant 会禁用重复的实体，并发出**更新 ha-paneld** 修复提示；面板更新后，该提示就会消除。
- **重启通知。** Home Assistant 重启时，使用非管理员账户的面板仍会通过 MQTT 获知重启，这也是目前继续让消息代理运行的另一个原因。
