---
title: Znane problemy w 1.0.2
description: Znane ograniczenia Panel Assistant 1.0.2 i odpowiadającej mu aplikacji panelu oraz sposoby postępowania.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0.2 i odpowiadająca mu aplikacja panelu są stabilnymi wydaniami. Ta strona opisuje znane ograniczenia i sposoby postępowania. Najpierw przeczytaj [Aktualizacja do 1.0](/pl/manage/upgrade-to-1-0/): opisano tam wymagania przed instalacją i powód, dla którego panel z wersją 1.0 nie może wrócić do 0.9. Inne problemy zgłaszaj w [systemie zgłoszeń](https://github.com/panel-assistant/ha-integration/issues), podając model panelu i zaobserwowane zachowanie.

## Panel z aplikacją 0.9 może wymagać przywrócenia połączenia ADB

Naprawa informująca, że panel wymaga aplikacji 1.0, oznacza, że jego aplikacja nie może jeszcze komunikować się z Panel Assistant 1.0. Jeśli Home Assistant informuje również, że panel nie może otrzymywać aktualizacji aplikacji, wykonaj tę naprawę, aby przywrócić drogę aktualizacji. W przypadku panelu z wyłączonym debugowaniem sieciowym podłącz go do komputera i uruchom instalator USB z Home Assistant, zgodnie z opisem [panelu, którego nie można zaktualizować](/pl/manage/updates-and-recovery/#panel-którego-nie-można-zaktualizować). Na panelu, który ma już aplikację, instalator USB może ponownie połączyć go bez ponownej instalacji: jeśli pojawi się pytanie, zaznacz **Zawsze zezwalaj z tego komputera** i dotknij **Zezwól** na panelu. Instalator ponownie włącza debugowanie sieciowe, aby Home Assistant mógł zaktualizować aplikację.

## Pasek boczny nie otworzy panelu, dopóki nie działa na nim aplikacja 1.0

W wersji 1.0 pasek boczny Panel Assistant pokazuje strony panelu przez własne połączenie panelu z Home Assistant. Panel z aplikacją 0.9 nie może tam otworzyć swoich stron. Najpierw zaktualizuj aplikację panelu.

## Głos jest domyślnie włączony, jeśli profil urządzenia deklaruje mikrofon

Głos jest domyślnie włączony, gdy profil urządzenia panelu deklaruje mikrofon, chyba że wcześniej go wyłączono. Jeśli nie chcesz, aby panel nasłuchiwał hasła wybudzania, wyłącz **Asystent głosowy** w sekcji **Głos** na stronie **Konfiguracja** panelu.

## Po całkowitym wyłączeniu ekranu może być potrzebny kod PIN blokady

Na panelach, których metoda wyłączania ekranu używa limitu czasu ekranu Androida lub administracji urządzeniem, skonfigurowany kod PIN blokady ekranu może być wymagany po wybudzeniu. Usuń kod PIN, jeśli panel ma wybudzać się bezpośrednio do pulpitu nawigacyjnego.

## Usunięto dwie encje

Usunięto osobną encję obrazu migawki kamery; używaj encji kamery panelu. Na panelu z głośnikiem usunięto osobną encję liczbową głośności; używaj głośności odtwarzacza multimediów z `media_player.volume_set`. Naprawa wskazuje automatyzacje i skrypty, które nadal używają encji liczbowej głośności. Dla usuniętego obrazu migawki nie ma odpowiedniej naprawy, więc samodzielnie sprawdź miejsca, które go używają.

## Przywracanie kopii zapasowej na panelu bez roota może pomijać ustawienia

Kopia zapasowa ustawień utworzona na panelu z rootem może zawierać ustawienia, których panel bez roota nie może zastosować. Przywracanie wyświetla pomijane, niedostępne ustawienia i stosuje obsługiwane. Sprawdź wynik przywracania pod kątem pominiętych ustawień i błędów.
