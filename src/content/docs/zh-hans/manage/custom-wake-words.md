---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 自定义唤醒词
description: 使用 microWakeWord 训练自己的唤醒词、导入面板、部署到多块面板，以及进行调优。
---

内置的四个唤醒词是 [microWakeWord](https://github.com/kahrendt/microWakeWord) 模型，面板的[语音助手](/zh-hans/manage/voice-assistant/)可以导入采用相同方式训练的任何模型。本页介绍训练、清单格式、在面板上导入，以及安装后的测试。

## 训练模型

microWakeWord 是 Kevin Ahrendt 开发的独立开源项目，采用 Apache-2.0 许可证；其[训练笔记本](https://github.com/kahrendt/microWakeWord/blob/main/notebooks/basic_training_notebook.ipynb)介绍了完整流程，是权威参考。概要如下：

1. **选择短语并生成合成样本。** 设置目标短语后，笔记本使用 [piper-sample-generator](https://github.com/rhasspy/piper-sample-generator) 以不同声音合成数千条该短语的语音示例。
2. **增强样本。** 笔记本为合成音频叠加效果（均衡、失真、变调、房间脉冲响应卷积，以及混入公共音频数据集的背景噪声和音乐），避免模型仅学会识别一段干净录音。
3. **训练。** 模型按可配置的步数训练，然后从非流式模型转换为面板实际运行的流式形式。笔记本本身说明，在 Google Colab 中训练可行，但明显慢于本地 GPU。
4. **导出。** 训练好的模型会导出为量化的流式 TensorFlow Lite 文件，也就是您将导入的 `.tflite` 文件。

如果已有现成模型覆盖您的短语，则无需以上步骤：[`esphome/micro-wake-word-models`](https://github.com/esphome/micro-wake-word-models) 仓库（同样采用 Apache-2.0）在 `models/v2/` 下按文件名发布已训练模型，导入方式与自行训练的模型完全相同。

## 编写清单

每个唤醒词都需要在 `.tflite` 文件旁提供一个小型 JSON 清单，采用 microWakeWord 的版本 2 格式。这与 ESPHome 的 `micro_wake_word` 组件及 `esphome/micro-wake-word-models` 仓库采用的格式相同，因此这两个来源的清单均无需修改即可使用。必填字段：

- `"type"`：始终为 `"micro"`。
- `"model"`：`.tflite` 文件的名称（不含斜杠）。
- `"micro"`：包含 `probability_cutoff`（0 至 1）、`feature_step_size`（正整数；当前模型使用 `10`）及 `sliding_window_size`（正整数）的对象。

可选字段：`wake_word`（界面显示的短语；省略时默认为唤醒词 ID）、`author`、`website`、`trained_languages`、`version` 和 `micro.tensor_arena_size`。

以下是内置 Hey Jarvis 清单，作为格式示例：

```json
{
  "type": "micro",
  "wake_word": "Hey Jarvis",
  "author": "Kevin Ahrendt",
  "website": "https://www.kevinahrendt.com/",
  "model": "hey_jarvis.tflite",
  "trained_languages": ["en"],
  "version": 2,
  "micro": {
    "probability_cutoff": 0.97,
    "feature_step_size": 10,
    "sliding_window_size": 5,
    "tensor_arena_size": 22860,
    "minimum_esphome_version": "2024.7.0"
  }
}
```

### 选择 `probability_cutoff` 和 `sliding_window_size`

两者都在误唤醒和漏唤醒之间进行权衡，没有适合所有模型的唯一正确值：

- **`probability_cutoff`** 是模型报告检测结果前必须达到的置信度阈值。提高它，面板就不容易被仅仅听起来相似的声音唤醒，但也更可能漏掉真正、较轻声或较随意说出的唤醒短语。降低它则相反。内置模型的值约为 `0.97`；训练笔记本本身建议根据训练模型的实际表现调整阈值，而不是假定一个数值适合所有模型。
- **`sliding_window_size`** 控制面板确认唤醒之前，连续多少个检测窗口的结果取平均值。较小的窗口反应更快，但更容易受到单次噪声峰值影响；较大的窗口可以平滑这种干扰，代价是唤醒略慢。

从模型自身文档或笔记本运行所建议的值开始，导入模型，然后使用[测试与调优](#测试与调优)介绍的面板近阈值日志进行调整。

## 导入模型

### 从面板的设置页面

在 **语音** 卡片上，唤醒词选择器提供 **导入** 控件。选择模型的 `.json` 清单和 `.tflite` 文件，然后按 **导入**。面板会使用自身的唤醒词引擎验证模型，再决定是否接受；如果拒绝模型，则不会安装任何内容，如果此前已导入同名模型，则保留原模型。清单最大 16 KB，模型最大 2 MB。

唤醒词 ID 根据 `.tflite` 文件名生成，转换为小写并仅保留字母、数字和下划线（必须以字母开头）。不能使用内置唤醒词的 ID；以已使用过的名称导入模型，会替换先前的模型。

导入只会让唤醒词变为可用，不会将其激活。要在面板上使用，请在 **唤醒词** 下勾选，并在 **唤醒词流水线** 下选择其管线。此后它也会出现在 Home Assistant 为该面板提供的唤醒词选择器中。

### 在多块面板上

打开“设置”的位置决定导入的模型是否共享：

- **直接打开面板自身的设置页面：** 导入的模型仅保留在该面板上，不会与其他面板共享。
- **在 Home Assistant 的 Panel Assistant 侧边栏内：** 所选面板验证并安装模型后，Panel Assistant 会保留共享副本，并将其安装到所有其他带麦克风的面板，包括以后才连接的面板。

通过侧边栏导入相同 ID 的新模型，会替换共享副本，并可更新持有此前共享副本的面板。另一块面板上以该 ID 独立导入的不同模型会保留；Panel Assistant 会提出[唤醒词修复项](/zh-hans/home-assistant/repairs/#wake-word-kept)，而不会覆盖。拒绝共享模型的面板也会获得[说明原因的修复项](/zh-hans/home-assistant/repairs/#wake-word-refused)。

共享让每块面板都能选择该模型；需要在每块面板上分别选择唤醒词和管线，才能激活。

## 测试与调优

在 Home Assistant 的面板设备页面选择 **访问**，打开 **日志**（使用默认端口时，例如 `http://<panel>:8888/logs`），然后说出唤醒词并观察日志。已听到但尚未触发的唤醒词会作为近阈值事件出现在日志中，例如 `wake word my_wake_word heard at 0.86, short of its cutoff`，其中显示该次尝试达到的最高分。如果近阈值分数略低于 `probability_cutoff`，通常稍微降低阈值或提高语音卡片上的 **唤醒灵敏度** 即可；如果该短语完全没有出现在近阈值日志中，则模型本身没有识别出它，下一步更适合增加样本数量或多样性后重新训练。
