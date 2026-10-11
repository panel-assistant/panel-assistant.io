---
title: 读懂支持报告
description: 了解 Panel Assistant 安装或更新失败的情况，并在求助时分享报告。
sourceCommit: ddee491d1892568fda8e9bb47f003b2333e3b666
---

安装或更新失败时，在 Home Assistant 的**设置 → 修复**中打开对应条目，然后选择**支持报告**。报告在可复制的文本块中保留准确的字段名和值。开头依次列出 `panel_assistant.version`、`panel_assistant.build`、`home_assistant.version`，以及 `repair.issue_id` 中的 Repair ID。已保存的事件列在 `events[N]` 下，其中 `N` 从 0 开始。

分享前请先阅读报告。它可能包含面板地址、设备标识符、发布版本详情和异常追踪信息。删除你不想在公开问题中发布的内容。尽可能保留失败原因和相关详情，它们有助于解释发生了什么。

如果安装或更新失败后需要帮助，请 [为 Home Assistant 集成创建问题](https://panel-assistant.io/go/report-issue)，并将报告粘贴到问题正文中。补充你当时在做什么、预期会发生什么，以及面板实际发生了什么。如果能够访问面板，下载其 [诊断信息](/zh-hans/manage/troubleshooting/)可以提供更多背景。

## 如何理解各字段

- `events[N]` 按顺序列出已保存的事件，从 `events[0]` 开始。较晚的事件可能描述的是重试被暂缓，而不是最初的失败。
- `kind` 表明事件来自 `install`、`update` 还是 `retry_hold` 尝试。`at` 如果存在，则表示记录的时间。
- `panel` 是面板的显示名称或地址；`address` 是 Home Assistant 使用的网络目标。`entry_id` 标识 Home Assistant 集成条目。`job_id` 标识一次安装尝试。
- `reason` 是已保存的结果或错误消息。对于安装，`receipt.result_code` 表示总体结果，`receipt.failure_stage` 表明失败时正在执行哪个步骤。`receipt.result_subcode` 如果存在，可以缩小诊断范围；它的值可能随发布版本变化。
- `target_version` 和 `artifact.*` 描述更新时选择的发布版本。`receipt.*` 保存安装回执，其中包括目标和步骤详情。`exception` 是技术追踪信息；最后几行通常指向直接导致失败的问题。

安装结果为 `authorization_failed`，表示 Home Assistant 未能获得操作面板的权限。`preflight_rejected` 表示面板未通过安装前检查。`artifact_rejected` 表示所选应用文件未被接受。`transport_failed` 表示与面板的通信失败。`install_failed` 和 `launch_failed` 分别表示安装步骤和应用启动步骤失败。`health_check_failed` 表示应用未通过安装后检查。`ambiguous_mutation` 或 `verification_required` 表示 Home Assistant 无法确认面板的状态；再次尝试前请检查面板。更新或重试则可能改为在 `reason` 中显示描述性错误消息。

## 请 AI 助手协助解读

复制以下提示词，然后在其后粘贴你已检查过的报告。助手可以解释报告中的证据并建议检查方法，但仅凭报告无法了解面板当前的状态。

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report is a copyable text block with exact dotted field names and values. It starts with panel_assistant.version and panel_assistant.build, followed by home_assistant.version and the Repair ID in repair.issue_id. Saved install, update, or retry-hold events appear under events[N], starting at events[0]. Each event preserves its original fields and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
