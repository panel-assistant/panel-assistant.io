---
title: Zamiana tekstu na mowę
description: Odczytywanie tekstu głosami syntezy mowy Home Assistant i odtwarzanie komunikatów Assist przez głośnik panelu.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Dowolny głos syntezy mowy Home Assistant, na przykład Piper lub Home Assistant Cloud, może mówić przez odtwarzacz multimedialny panelu. Aby korzystać z głośnika, nie potrzebujesz mikrofonu ani włączonego asystenta głosowego.

## Odtwórz komunikat przy włączonym asystencie głosowym

Jeśli panel ma mikrofon i jego [asystent głosowy](/pl/manage/voice-assistant/) jest włączony, `assist_satellite.announce` odczytuje komunikat bezpośrednio na panelu, opcjonalnie poprzedzając go krótkim sygnałem dźwiękowym.

## Użyj głosu syntezy mowy

Wybierz skonfigurowany silnik syntezy mowy i encję `media_player` panelu. Na przykład:

```yaml
action: tts.speak
target:
  entity_id: tts.piper
data:
  media_player_entity_id: media_player.living_room_panel
  message: 'The washing machine has finished'
```

Zastąp oba identyfikatory encji identyfikatorami z twojej instalacji Home Assistant. Silnik generuje wypowiedź, a Panel Assistant zleca jej odtworzenie na panelu przez swoje istniejące połączenie natywne. Home Assistant i panel nadal potrzebują działającej ścieżki przesyłania dźwięku.

W razie potrzeby ustaw wcześniej głośność odtwarzacza multimedialnego panelu. Aby odtwarzać mowę w kilku pomieszczeniach, podaj listę encji odtwarzaczy multimedialnych paneli w `media_player_entity_id`.

W [trybie wzmocnionym](/pl/manage/security-mode/) polecenie multimedialne przesłane przez połączenie natywne wymaga, aby ktoś zatwierdził je na ekranie panelu. Automatyzacja nie może zdalnie zatwierdzić tego żądania.
