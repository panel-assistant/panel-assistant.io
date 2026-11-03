---
title: Texto a voz
description: Reproducción de voces de texto a voz de Home Assistant y anuncios de Assist a través del altavoz de un panel.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Cualquier voz de texto a voz de Home Assistant, como Piper o Home Assistant Cloud, puede hablar a través del reproductor multimedia del panel. No necesitas un micrófono ni tener habilitado el asistente de voz para usar el altavoz.

## Reproducir un anuncio con el asistente de voz habilitado

Si el panel tiene un micrófono y su [asistente de voz](/es/manage/voice-assistant/) está habilitado, `assist_satellite.announce` pronuncia directamente en el panel un mensaje, opcionalmente precedido de un breve tono de aviso.

## Usar una voz de texto a voz

Elige un motor de texto a voz configurado y la entidad `media_player` del panel. Por ejemplo:

```yaml
action: tts.speak
target:
  entity_id: tts.piper
data:
  media_player_entity_id: media_player.living_room_panel
  message: 'The washing machine has finished'
```

Sustituye ambos ID de entidad por los de tu Home Assistant. El motor sintetiza la frase y Panel Assistant envía la reproducción al panel a través de su conexión nativa existente. Home Assistant y el panel siguen necesitando una ruta funcional para el audio.

Ajusta previamente el volumen del reproductor multimedia del panel si es necesario. Para hablar en varias habitaciones, proporciona una lista de entidades de reproductores multimedia de los paneles en `media_player_entity_id`.

En el [modo reforzado](/es/manage/security-mode/), un comando multimedia a través de la conexión nativa requiere que alguien lo apruebe en la pantalla del panel. Una automatización no puede aprobar esa solicitud de forma remota.
