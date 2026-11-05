---
title: Sintesi vocale
description: Riproduzione delle voci di sintesi vocale di Home Assistant e degli annunci di Assist tramite l'altoparlante di un pannello.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Qualsiasi voce di sintesi vocale di Home Assistant, come Piper o Home Assistant Cloud, può parlare tramite il lettore multimediale del pannello. Per usare l'altoparlante non è necessario disporre di un microfono né avere l'assistente vocale abilitato.

## Riproduci un annuncio con l'assistente vocale attivo

Se il pannello ha un microfono e il suo [assistente vocale](/it/manage/voice-assistant/) è attivo, `assist_satellite.announce` pronuncia un messaggio direttamente sul pannello, facoltativamente preceduto da un breve segnale acustico.

## Usa una voce di sintesi vocale

Scegli un motore di sintesi vocale configurato e l'entità `media_player` del pannello. Ad esempio:

```yaml
action: tts.speak
target:
  entity_id: tts.piper
data:
  media_player_entity_id: media_player.living_room_panel
  message: 'The washing machine has finished'
```

Sostituisci entrambi gli ID delle entità con quelli presenti nel tuo Home Assistant. Il motore sintetizza la frase e Panel Assistant invia la riproduzione al pannello tramite la sua connessione nativa esistente. Home Assistant e il pannello hanno comunque bisogno di un percorso funzionante per l'audio.

Imposta prima il volume del lettore multimediale del pannello, se necessario. Per parlare in più stanze, fornisci un elenco di entità dei lettori multimediali dei pannelli in `media_player_entity_id`.

La sintesi vocale inviata al lettore multimediale del pannello tramite la sua connessione nativa non richiede l'approvazione sul pannello in [modalità protetta](/it/manage/security-mode/).
