---
title: 文本转语音
description: 通过面板的扬声器播放 Home Assistant 文本转语音音色和 Assist 播报。
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

任何 Home Assistant 文本转语音音色（如 Piper 或 Home Assistant Cloud）都可以通过面板的媒体播放器朗读。使用扬声器无需配备麦克风，也无需启用语音助手。

## 在语音助手已启用时播放播报

如果面板配备麦克风且已启用[语音助手](/zh-hans/manage/voice-assistant/)，`assist_satellite.announce` 会直接在面板上朗读一条消息，也可以选择在朗读前播放一声简短的提示音。

## 使用文本转语音音色

选择一个已配置的文本转语音引擎和面板的 `media_player` 实体。例如：

```yaml
action: tts.speak
target:
  entity_id: tts.piper
data:
  media_player_entity_id: media_player.living_room_panel
  message: 'The washing machine has finished'
```

将这两个实体 ID 替换为您的 Home Assistant 中的实体 ID。引擎将短语合成为语音，Panel Assistant 则通过面板现有的原生连接将播放内容发送到面板。Home Assistant 与面板之间仍需有可用的音频传输路径。

如有需要，请事先设置面板媒体播放器的音量。要在多个房间中朗读，请在 `media_player_entity_id` 中提供面板媒体播放器实体列表。

在[加固模式](/zh-hans/manage/security-mode/)下，通过原生连接发送的媒体命令需要有人在面板屏幕上批准。自动化无法远程批准该请求。
