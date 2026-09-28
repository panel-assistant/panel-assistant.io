---
title: Voice assistant
description: Turning a panel's microphone into a Home Assistant Assist satellite, wake words, pipelines, announcements and troubleshooting.
---

A panel with a microphone can act as a Home Assistant [Assist satellite](https://www.home-assistant.io/voice_control/). It listens for a wake word, streams your command to Home Assistant, and speaks the answer back through the panel's speaker. There is no separate device to add: the satellite is an `assist_satellite.<panel>` entity on the panel's existing Home Assistant device, and the audio travels over the same connection the panel already uses.

:::note
It needs ha-paneld 0.9.9 or later on the panel and the Panel Assistant integration 0.7.0 or later in Home Assistant. Only a panel whose device profile declares a microphone offers it. Today that means the Sonoff NSPanel Pro (86 and 120) and the Electron WF1589T. Other panels do not show a Voice card on the Configure page.
:::

## Turn it on

It is off by default, so the microphone stays released until you enable it.

1. Open `http://<panel>:8888/`, then **Configure**.
2. On the **Voice** card, turn on **Voice assistant**.
3. Tick each wake word you want the panel to listen for under **Wake words**.
4. Under **Wake word pipelines**, choose which Assist pipeline each ticked wake word should use.
5. **Save**.

With the voice assistant off, the microphone is released entirely and the satellite entity shows unavailable in Home Assistant.

## Wake words and pipelines

The panel ships with four wake words: **Okay Nabu**, **Hey Jarvis**, **Hey Mycroft** and **Alexa**. You can have several active at once, and each one can point at a different Assist pipeline, so one wake word can answer in a different language, or hand off to a different conversation agent, than another. Leaving a wake word on its default uses whatever pipeline Home Assistant currently treats as preferred. If a pipeline you assigned is later deleted, that wake word falls back to the preferred pipeline as well.

You can also change the active wake words from Home Assistant itself: the satellite's own settings, under **Settings > Voice assistants** or on the panel's device page, show the same list and write changes back to the panel. Which pipeline each wake word uses is set on the panel's Configure page.

Wake word detection itself runs on the panel, not in the cloud or on your Home Assistant server. The panel only starts sending audio to Home Assistant once it hears a wake word, and only for as long as speech-to-text is still receiving your command; it stops sending as soon as Home Assistant reports the command has ended.

Want a wake word that is not in this list? See [custom wake words](/manage/custom-wake-words/).

## What the panel shows

A short chime and a ripple mark the moment the panel hears a wake word. While it is listening, thinking or answering, the screen edges take on a gentle, slowly pulsing tint. The colour identifies which pipeline is answering: Panel Assistant gives every pipeline one colour the first time any panel uses it and keeps that pairing, so the same pipeline looks the same on every panel in the house. There is nothing to configure here.

If the pipeline's conversation agent asks a follow-up question, the panel starts listening again on its own, without needing the wake word repeated.

## Announcements and starting a conversation

Once the voice assistant is on, `assist_satellite.announce` speaks a message on the panel from any automation or script, optionally preceded by a short chime. `assist_satellite.start_conversation` speaks a prompt and then listens for the reply; Home Assistant only allows this with a conversation agent that supports starting a conversation itself, which the built-in Home Assistant agent does not. Both services need the voice assistant turned on; see [Text-to-speech](/manage/text-to-speech/#play-an-announcement-with-the-voice-assistant-on) for the simpler REST alternative on panels without a microphone.

## Several assistants in one room

If two satellites on the same Home Assistant instance hear the same wake word phrase within two seconds of each other, Home Assistant suppresses the duplicate so only one of them answers. This applies across every satellite on that Home Assistant instance, not just panels in the same Home Assistant area, so it also covers a panel and any other satellite you already have. If you want to choose which device answers in a shared room, give them different wake words.

## Settings

The Voice card has a few tuning options beyond the wake word list:

- **Wake sensitivity** — Low, Normal or High. High lowers the wake word model's threshold, so the panel wakes more readily but is also more likely to wake on a false match; Low asks for a clearer match before waking.
- **Microphone gain (dB)** — amplifies only the audio sent to Home Assistant for transcription, never the audio the wake word listener itself analyses. Raise it if the wake word reliably triggers but commands spoken from across the room are missed or misheard.
- **Audio source** — the Android audio source used to capture the microphone. Leave this at its default (`voice_recognition`) unless you have been told otherwise.

## Troubleshooting

**The panel never wakes.** Confirm **Voice assistant** is on and the wake word you are saying is ticked under **Wake words**. Try **Wake sensitivity: High**, and speak from where you normally would use the panel, not right next to the microphone.

**It wakes but does not understand the command.** Raise **Microphone gain (dB)** a little and try again; this only affects the audio sent for transcription, so it will not make the panel wake more easily by itself. If you are training your own wake word, the panel's log also records near misses with the score they reached, which is the most direct way to see whether a missed wake word was close or nowhere near — see [custom wake words](/manage/custom-wake-words/#testing-and-tuning).

**The satellite entity shows unavailable.** The voice assistant is off, or the panel is not connected to Home Assistant through Panel Assistant. Turn the voice assistant on from the panel's Configure page; it cannot be switched on from Home Assistant.
