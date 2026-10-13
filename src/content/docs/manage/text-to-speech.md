---
title: Text to speech
description: Speaking Home Assistant text-to-speech voices and Assist announcements through a panel's speaker.
---

Any Home Assistant text-to-speech voice, such as Piper or Home Assistant Cloud, can speak through the panel's media player. You do not need a microphone or the voice assistant enabled to use the speaker.

## Play an announcement with the voice assistant on

If the panel has a microphone and its [voice assistant](/manage/voice-assistant/) is turned on, `assist_satellite.announce` speaks a message directly on the panel, optionally preceded by a short chime.

## Use a text-to-speech voice

Choose a configured text-to-speech engine and the panel's `media_player` entity. For example:

```yaml
action: tts.speak
target:
  entity_id: tts.piper
data:
  media_player_entity_id: media_player.living_room_panel
  message: 'The washing machine has finished'
```

Replace both entity IDs with the ones in your Home Assistant. The engine renders the phrase and Panel Assistant sends playback to the panel over its existing native connection. Home Assistant and the panel still need a working route for the audio.

Set the panel's media player volume beforehand if needed. To speak in several rooms, supply a list of panel media player entities in `media_player_entity_id`.

In [Hardened mode](/manage/security-mode/), a media command over the native connection requires someone to approve it on the panel's screen. An automation cannot approve that request remotely.
