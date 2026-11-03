---
title: Tekst-naar-spraak
description: Tekst-naar-spraakstemmen van Home Assistant en Assist-aankondigingen laten horen via de luidspreker van een paneel.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Elke tekst-naar-spraakstem van Home Assistant, zoals Piper of Home Assistant Cloud, kan spreken via de mediaspeler van het paneel. Je hebt geen microfoon of ingeschakelde spraakassistent nodig om de luidspreker te gebruiken.

## Een aankondiging afspelen met de spraakassistent ingeschakeld

Als het paneel een microfoon heeft en zijn [spraakassistent](/nl/manage/voice-assistant/) is ingeschakeld, spreekt `assist_satellite.announce` een bericht rechtstreeks op het paneel uit, eventueel voorafgegaan door een kort belsignaal.

## Een tekst-naar-spraakstem gebruiken

Kies een geconfigureerde engine voor tekst-naar-spraak en de `media_player`-entiteit van het paneel. Bijvoorbeeld:

```yaml
action: tts.speak
target:
  entity_id: tts.piper
data:
  media_player_entity_id: media_player.living_room_panel
  message: 'The washing machine has finished'
```

Vervang beide entiteits-ID's door die in je Home Assistant. De engine zet de zin om in spraak en Panel Assistant stuurt de weergave naar het paneel via de bestaande native verbinding. Home Assistant en het paneel hebben nog steeds een werkende route voor de audio nodig.

Stel zo nodig vooraf het volume van de mediaspeler van het paneel in. Om in meerdere ruimtes te spreken, geef je in `media_player_entity_id` een lijst met mediaspelerentiteiten van panelen op.

In de [Hardened-modus](/nl/manage/security-mode/) vereist een mediaopdracht via de native verbinding dat iemand deze op het scherm van het paneel goedkeurt. Een automatisering kan dat verzoek niet op afstand goedkeuren.
