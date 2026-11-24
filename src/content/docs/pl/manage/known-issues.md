---
title: Znane problemy
description: Znane ograniczenia Panel Assistant i odpowiadającej mu aplikacji panelu oraz sposoby postępowania.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ta strona opisuje znane ograniczenia i sposoby postępowania. Inne problemy zgłaszaj w [systemie zgłoszeń](https://github.com/panel-assistant/ha-integration/issues), podając model panelu i zaobserwowane zachowanie.

## Głos jest domyślnie włączony, jeśli profil urządzenia deklaruje mikrofon

Głos jest domyślnie włączony, gdy profil urządzenia panelu deklaruje mikrofon, chyba że wcześniej go wyłączono. Jeśli nie chcesz, aby panel nasłuchiwał hasła wybudzania, wyłącz **Asystent głosowy** w sekcji **Głos** na stronie **Konfiguracja** panelu.

## Po całkowitym wyłączeniu ekranu może być potrzebny kod PIN blokady

Na panelach, których metoda wyłączania ekranu używa limitu czasu ekranu Androida lub administracji urządzeniem, skonfigurowany kod PIN blokady ekranu może być wymagany po wybudzeniu. Usuń kod PIN, jeśli panel ma wybudzać się bezpośrednio do pulpitu nawigacyjnego.

## Usunięto dwie encje

Usunięto osobną encję obrazu migawki kamery; używaj encji kamery panelu. Na panelu z głośnikiem usunięto osobną encję liczbową głośności; używaj głośności odtwarzacza multimediów z `media_player.volume_set`. Naprawa wskazuje automatyzacje i skrypty, które nadal używają encji liczbowej głośności. Dla usuniętego obrazu migawki nie ma odpowiedniej naprawy, więc samodzielnie sprawdź miejsca, które go używają.

## Przywracanie kopii zapasowej na panelu bez roota może pomijać ustawienia

Kopia zapasowa ustawień utworzona na panelu z rootem może zawierać ustawienia, których panel bez roota nie może zastosować. Przywracanie wyświetla pomijane, niedostępne ustawienia i stosuje obsługiwane. Sprawdź wynik przywracania pod kątem pominiętych ustawień i błędów.
