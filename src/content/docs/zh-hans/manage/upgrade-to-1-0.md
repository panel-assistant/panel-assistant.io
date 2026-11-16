---
sourceCommit: 45ad784a56e8c07917f0c76636d2b389a610b982
title: 升级到 1.0
description: 将 Home Assistant 和面板从 Panel Assistant 0.9 迁移至 1.0，以及回退意味着什么。
---

Panel Assistant 1.0 与 1.0 面板应用需要一同升级。1.0 集成只与 1.0 面板应用通信，1.0 面板应用也只与 1.0 集成通信，因此任一端都无法与 0.9 的另一端配合。请先更新集成，再从 Home Assistant 更新每块面板，而且**运行 1.0 应用的面板无法回退到 0.9**。开始之前，请阅读整页内容。 [1.0.0 发行说明](/zh-hans/release-notes/#panel-assistant-100)列出了全部变更。

## 开始之前

**完成 0.9.0 需要完成的全部工作。** 运行 Panel Assistant **0.9.0**，打开 **设置**、**修复**。Panel Assistant 1.0 已无法将面板从 MQTT 迁移出来，也无法迁移仍运行旧 ha-paneld 应用的面板，因此会保持这两类面板原样。如果 0.9.0 为任何面板列出其中任一情况，请按照其修复项操作，直到面板完成迁移；[从 MQTT 迁移面板](/zh-hans/home-assistant/move-from-mqtt/)介绍了 MQTT 部分。如果使用的 Panel Assistant 早于 0.9.0，请先更新到 0.9.0 并让它完成迁移。

**创建 Home Assistant 备份。** 在 **设置**、**系统**、**备份** 下创建备份，并保留到所有面板均运行 1.0 且您对其表现满意为止。这是 Home Assistant 一侧的回退方式。

**保留每块面板的备份。** 在每块面板的网页界面中打开 **安装**，然后选择 **备份**，保留下载的 `.hpb` 文件。Panel Assistant 也会在每次更新前保存面板设置，但您自己的副本才是可以自行恢复的备份。

## 1. 更新集成

在 Home Assistant **2026.11 或更新版本**中，通过 **设置**、**更新** 安装 Panel Assistant 更新。在受支持的较旧版本（**2026.8.3 至 2026.10**）中，在 HACS 中下载更新。然后按照重启修复项或 HACS 的提示重启 Home Assistant，以加载新集成。[安装集成](/zh-hans/home-assistant/custom-integration/#updates)说明了通过 Marketplace 或 HACS 更新的方法。

## 2. 检查修复项

重启后，再次打开 **设置**、**修复**。

- **“…需要应用…”** 是所有仍运行 0.9 应用的面板都会出现的预期提示。更新之前，Home Assistant 无法查看或控制该面板，其实体显示为不可用。面板本身仍会继续工作，保留设置和历史记录。
- **“…无法接收应用更新”** 表示 Panel Assistant 无法在该面板上安装，通常是因为面板本身发生过更改，例如固件更新或重置。按照修复项 **了解更多** 中的说明，通过 USB 将面板重新连接到 Panel Assistant，之后即可更新。不会移除任何内容：对于已安装应用的面板，USB 安装程序不会安装任何东西，只会让 Panel Assistant 重新获得访问权限。
- **“…从未从 MQTT 迁移”** 表示在 0.9.0 中未完成 MQTT 迁移。参阅[如果迁移未完成](#如果迁移未完成)。
- **“…仍运行旧应用”** 表示需要替换旧 ha-paneld 应用。请按照[手动步骤](#a-panel-still-runs-the-old-app)操作。

## 3. 先更新一块面板，再更新其余面板

每块面板在 Home Assistant 中的更新实体都会提供最新的 1.0 面板应用。请先在一块面板上安装，使用一段时间后再安装到其他面板，因为该面板无法回退。Panel Assistant 会备份面板设置、安装更新并确认面板已恢复正常，详见[更新与恢复](/zh-hans/manage/updates-and-recovery/)。0.9 面板应用的设置会保留。

## 回退

两部分的情况不同。

**使用 1.0 应用的面板会留在 1.0。** 面板应用拒绝在自身上安装旧版本，Panel Assistant 从不提供旧版本，0.9 集成也无法与其通信。如果 1.0 面板表现异常，请查看[故障排查](/zh-hans/manage/troubleshooting/)，然后附上[支持报告](/zh-hans/home-assistant/support-report/)进行反馈，以便在后续版本中修复。

**只要没有面板运行 1.0，集成就可以回退。** 恢复开始之前创建的 Home Assistant 备份。这也会撤销创建备份之后 Home Assistant 中的其他所有更改。面板仍运行 0.9 应用，并重新连接到 0.9.0。一旦任何面板运行 1.0 应用，恢复备份就会使 Home Assistant 无法访问该面板，直到集成重新升级到 1.0。

不要通过 Marketplace 或 HACS 安装 0.9.0 来覆盖 1.0，以此进行回退。1.0 更新会移除 0.9.0 依赖的一项设置；缺少此设置时，0.9.0 会将已迁移的面板重新交回 MQTT，而 1.0 面板应用已不再响应 MQTT。请改为恢复备份。

## 如果迁移未完成

如果 1.0 提示某块面板从未从 MQTT 迁移，请按照修复项的安全恢复步骤，在 Panel Assistant 0.9.0 中完成迁移，然后返回 1.0。不要通过 Marketplace 或 HACS 安装 0.9.0 来覆盖 1.0。 只要尚无面板运行 1.0 应用，请基于上述原因，恢复更新之前创建的 Home Assistant 备份来返回 0.9.0。然后在 0.9.0 中完成迁移，再从头执行本页步骤。如果其他面板已经运行 1.0 应用，或者没有更新前的备份，请在更改任何内容之前到 [Discord](https://panel-assistant.io/go/discord) 或 [issues](https://github.com/panel-assistant/ha-integration/issues) 求助。

对于仍使用 MQTT 的面板，修复项还提供从头开始的方式：删除 MQTT 集成下的面板设备，再重新添加面板。这会创建新实体，且不保留任何历史记录。

<a id="a-panel-still-runs-the-old-app"></a>

### 面板仍运行旧应用

对于 0.9.0 能处理的面板，通过它迁移仍是受支持的方式。如果面板仍运行旧 ha-paneld 应用，而且无法完成该迁移，请使用当前 Panel Assistant 按照以下手动步骤操作。这会替换应用并创建新的 Home Assistant 设备：历史记录会重新开始，使用旧实体的自动化需要检查。此方式无需降级 Panel Assistant。

1. 在旧应用的网页界面中打开**安装**，使用**导出设置**。移除应用前先保存文件。导出默认不包含密码和令牌，因此请保留需要重新输入的凭据。
2. 如果曾使用旧应用停用厂商应用，请先在其**安装**页面使用**恢复主屏幕**，再移除旧应用。保持端口 **5555** 上的网络 ADB 启用，以便 Panel Assistant 安装新应用。
3. 通过 ADB 连接面板，仅移除旧应用：

   ```sh
   adb connect PANEL_IP:5555
   adb uninstall io.github.maxlyth.hapaneld
   ```

   将 `PANEL_IP` 替换为面板地址。不要重置面板。

4. 如果此面板在 Home Assistant 的 Panel Assistant 中已有条目，请移除该条目。安装当前 Panel Assistant 后，[添加面板](/zh-hans/install/installing-ha-paneld/)以安装当前应用。完成链接指向的面板设置页面，包括名称、Home Assistant 地址、登录和仪表盘，然后返回 Home Assistant 并选择**提交**。
5. 在新应用的网页界面中打开**安装**，选择**导入设置…**，再选择导出的文件。应用前先查看变更列表。MQTT 设置不会迁移。保存为旧应用默认值的设置可能覆盖新应用的默认值，因此之后请在**设置**页面检查语音助手和实体过滤器。
6. 导入后，打开**设置 → Home Assistant 连接**，使用**浏览器登录**旁的**重新连接**再次登录。导入可能清除部分登录信息，导致下次刷新令牌时出现 **Home Assistant 登录被拒绝**。确认仪表盘可以加载、面板在 Home Assistant 中可以连接，然后检查设置和自动化。
