---
title: Sprachausgabe
description: Wiedergabe von Text-to-Speech-Stimmen von Home Assistant und Assist-Ankündigungen über den Lautsprecher eines Panels.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Jede Text-to-Speech-Stimme von Home Assistant, etwa Piper oder Home Assistant Cloud, kann über den Mediaplayer des Panels sprechen. Du brauchst weder ein Mikrofon noch einen aktivierten Sprachassistenten, um den Lautsprecher zu verwenden.

## Eine Ankündigung bei eingeschaltetem Sprachassistenten wiedergeben

Wenn das Panel ein Mikrofon hat und sein [Sprachassistent](/de/manage/voice-assistant/) eingeschaltet ist, gibt `assist_satellite.announce` eine Nachricht direkt auf dem Panel aus, auf Wunsch mit einem kurzen Signalton davor.

## Eine Text-to-Speech-Stimme verwenden

Wähle eine konfigurierte Text-to-Speech-Engine und die `media_player`-Entität des Panels aus. Zum Beispiel:

```yaml
action: tts.speak
target:
  entity_id: tts.piper
data:
  media_player_entity_id: media_player.living_room_panel
  message: 'The washing machine has finished'
```

Ersetze beide Entitäts-IDs durch die aus deinem Home Assistant. Die Engine wandelt den Satz in Sprache um und Panel Assistant sendet die Wiedergabe über die bestehende native Verbindung des Panels an das Panel. Home Assistant und das Panel benötigen weiterhin einen funktionierenden Übertragungsweg für die Audiodaten.

Stelle bei Bedarf vorher die Lautstärke des Mediaplayers des Panels ein. Um in mehreren Räumen zu sprechen, gib in `media_player_entity_id` eine Liste von Mediaplayer-Entitäten der Panels an.

Im [gehärteten Modus](/de/manage/security-mode/) muss jemand einen über die native Verbindung gesendeten Medienbefehl auf dem Bildschirm des Panels genehmigen. Eine Automatisierung kann diese Anfrage nicht aus der Ferne genehmigen.
