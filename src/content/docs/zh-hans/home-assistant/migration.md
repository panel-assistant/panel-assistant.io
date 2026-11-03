---
title: 必须使用 Panel Assistant
description: 面板提示必须使用 Panel Assistant 时的处理方法，以及从 0.9 面板应用迁移到 Panel Assistant 1.0 的路径。
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

如果面板显示**必须使用 Panel Assistant**，并附有本页地址，说明它运行的是 0.9 面板应用，尚未连接到 Home Assistant 中的 Panel Assistant 集成。所选的仪表盘和面板设置仍保存在面板上，无需重新安装或重置面板。

Panel Assistant 1.0 无法接管仍在运行旧版 ha-paneld 应用或硬件实体仍在使用 MQTT 的面板。这类面板需要先由 Panel Assistant 0.9.0 完成迁移，再升级到 1.0：

1. [通过 HACS 安装 Panel Assistant 集成](/zh-hans/home-assistant/custom-integration/)。如果面板仍在运行旧版应用或使用 MQTT，请在首次重启前选择 **0.9.0** 版本；如果已安装 Panel Assistant 1.0，请在更改版本前按照“[如果迁移未完成](/zh-hans/manage/upgrade-to-1-0/#如果迁移未完成)”中的说明操作。当 HACS 提示重启时，请重启 Home Assistant。
2. 如果面板已经出现在**设置 → 设备与服务 → Panel Assistant** 下，则无需再次添加。否则，请使用其主机名或地址在此处添加该**现有面板**；这并非安装新面板。
3. 打开**设置 → 修复**。如果 Panel Assistant 提示面板仍在运行旧版 ha-paneld 应用，请按照其修复项的指引，将面板迁移到 Panel Assistant 应用。如果面板的硬件实体仍在使用 MQTT，[将面板从 MQTT 迁出](/zh-hans/home-assistant/move-from-mqtt/)介绍了这一交接过程，该过程由 0.9.0 完成。
4. 如果安装的是 0.9.0，请在它不再为任何面板列出迁移项后，按照“[升级到 1.0](/zh-hans/manage/upgrade-to-1-0/)”中的说明更新到 1.0。

如需查找面板地址或检查连接方面的帮助，请参阅[连接面板](/zh-hans/home-assistant/connect-a-panel/)和[故障排除](/zh-hans/manage/troubleshooting/)。
