---
title: Społecznościowe profile paneli
description: Profile społeczności dla paneli nieobjętych aplikacją, ich bezpieczny import i włączanie kamery, której profil nie deklaruje.
sidebar:
  label: Przegląd
  order: 0
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

To katalog profili dostarczonych przez społeczność, które nie są dołączone do ha-paneld. Obecność profilu nie oznacza, że ha-paneld działa na wymienionym sprzęcie sklepowym w stanie fabrycznym. Każdy profil może opisywać konkretne ponowne wgranie systemu, modyfikację firmware lub pojedynczą zgłoszoną instalację zamiast fabrycznego oprogramowania producenta.

Profile społecznościowe nigdy nie są wybierane automatycznie. Pobierz pojedynczy plik YAML, sprawdź jego źródło, przetestowany firmware i ograniczenia, a następnie zaimportuj go na stronie **Profile** panelu. Import i walidacja są tylko podglądem; nie zapisują ani nie aktywują profilu.

Przed zapisem wymagaj, aby podgląd potwierdził zgodność każdego warunku w jednej pełnej grupie dopasowania z niezmiennymi danymi urządzenia panelu. Sama zgodna nazwa nie wystarcza. Aktywacja ściśle sprawdza tę tożsamość i odrzuca niebezpieczne przechwytywanie ekranu dotykowego, ale nie sprawdza z wyprzedzeniem każdej działającej ścieżki uprawnień. Po kontrolowanym restarcie sterowniki poszczególnych funkcji sprawdzają interfejsy i uprawnienia podczas inicjalizacji lub użycia; niedostępne funkcje pozostają niedostępne, a stan przy uruchomieniu określa, czy proponowany profil pozostanie aktywny, czy nastąpi powrót do poprzedniego. Nigdy nie uznawaj udanego importu lub aktywacji za dowód działania wszystkich zadeklarowanych funkcji.

## Bezpieczne wypróbowanie profilu społecznościowego

1. Otwórz stronę urządzenia panelu w Home Assistant, wybierz **Odwiedź**, następnie **Profile**. Wyeksportuj aktywną rewizję i utwórz aktualną pełną kopię panelu. Przy połączeniu bezpośrednim użyj portu HTTP zgłoszonego przez panel (`http://<panel-ip>:8888/profiles` przy domyślnym porcie).
2. Pobierz i sprawdź YAML. Potwierdź, że dokładne założenia dotyczące firmware i modyfikacji opisują posiadany panel.
3. Wklej lub prześlij YAML na stronie **Profile** i zweryfikuj go. Nie kontynuuj przy niepełnym dopasowaniu tożsamości, braku wymaganego skompilowanego sterownika lub zgłoszonym niebezpiecznym mapowaniu wejść. Walidacja nie potwierdza rzeczywistych uprawnień do sprzętu.
4. Zapisz zweryfikowaną treść jako nieaktywną lokalną rewizję. Zapis nadal nie zmienia działającego profilu.
5. Testuj i aktywuj tylko wtedy, gdy ktoś widzi panel i może go dotknąć, zgodnie z [listą kontrolną testowania profilu](/pl/reference/profiles/testing/). Aktywacja jest powiązana z dokładnym identyfikatorem profilu, rewizją i skrótem treści.
6. Po restarcie sprawdź rzeczywiste wyniki funkcji i potwierdź aktywną rewizję, oczekiwane elementy sterujące i encje Home Assistant. Niedostępna ścieżka musi pozostać niedostępna zamiast być uznana za udaną. Sprawdź **Wycofaj** przed pozostawieniem profilu bez nadzoru; nieudana kontrola stanu przy uruchomieniu powinna automatycznie przywrócić ostatnią sprawną rewizję.

Powrót do **Tryb automatyczny** wybiera tylko profil dołączony do aplikacji lub zachowawczy profil zastępczy Generic. Nie aktywuje automatycznie ponownie rewizji społecznościowej.

## Włączanie kamery na panelu, którego profil jej nie deklaruje

Kamera jest dostępna na każdym panelu, który ją ma: gdy profil deklaruje ją przez `hardware.camera` lub gdy Android wykrywa kamerę na panelu, którego profil nic o niej nie mówi. Płyta z działającą kamerą zwykle nie wymaga więc żadnego wpisu w profilu, a grupa Kamera pojawia się w **Konfiguracja** bez edycji YAML.

Trzy warunki nadal mogą powodować jej brak; karta Kamera w **Konfiguracja** wskazuje właściwy zamiast znikać:

- **Profil ją wyłącza.** `hardware.camera: false` jest celowym trzecim stanem, innym niż pominięcie klucza: mówi, że wykryte urządzenie nie jest użyteczną kamerą pomieszczenia, na przykład jest wejściem przechwytywania HDMI. Usuń wiersz lub ustaw `true`, aby udostępnić kamerę.
- **Android nie wykrył żadnej kamery.** Jeśli panel ją ma, zadeklaruj w profilu `hardware.camera: true`. Deklaracja ma pierwszeństwo przed pustą listą, więc pomaga też wtedy, gdy usługa kamery istnieje, ale wykrywanie jest zawodne.
- **Wykrywanie jeszcze nie odpowiedziało.** Nie jest to stwierdzenie o sprzęcie. Poczekaj kilka sekund i odśwież Konfigurację; niczego nie trzeba edytować.

Zadeklarowanie kamery nieudostępnianej przez płytę jest bezpieczne. Lekka kontrola podczas działania odczytuje listę identyfikatorów kamer Androida do raportowania funkcji; zadeklarowana kamera nadal jest oferowana, a płyta bez kamery odmawia otwarcia ze sklasyfikowanym błędem `no_camera_id`, którego zalecenie wskazuje nieprawidłowy profil. Nie destabilizuje to panelu.

Z flagą wiąże się jeden wymóg. Użycie kamery jest blokowane, jeśli panel nie może sygnalizować osobom w pomieszczeniu, że jest otwarta; przy wyłączonym ekranie wymaga to sygnalizacji poza ekranem. Do przechwytywania przy wyłączonym ekranie zapewnij działającą sygnalizację LED. Gdy ekran świeci, wskaźnik ekranowy może spełnić wymóg bez LED. Ustaw `hardware.camera_lens_offset_px`, aby wskaźnik znalazł się pod obiektywem zamiast obok niego.

Flaga nie zmienia pozostałych zasad kamery: pozostaje wyłączona do włączenia, przełącznik nigdy nie jest sugerowanym ustawieniem domyślnym, a włączenie przez encję kamery Home Assistant wymaga zgody na ekranie samego panelu w każdym trybie bezpieczeństwa. Ustawienie Kamera w Konfiguracji jest osobną ścieżką konfiguracji właściciela.

## Katalog

- [`community-cronos-lineageos18.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml): szkic dla Amazon Echo Show 5 Gen 2 jednego ze współtwórców z wgranym LineageOS 18.1. Fabryczny Fire OS nie uruchomi ha-paneld; odblokowanie, wgrywanie systemu i odzyskiwanie nie są obsługiwane, a projekt nie zweryfikował profilu na sprzęcie. Zobacz [dowody dotyczące tego profilu](/pl/reference/profiles/community/echo-show-5-gen2/).
- [`community-lenovo-thinksmart-view-lineageos.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-lenovo-thinksmart-view-lineageos.yaml): szkic dla Lenovo ThinkSmart View jednego ze współtwórców z wgranym LineageOS 8.1. Wybiera uśpienie Androida, ponieważ jasność zero nadal pozostawia widoczne światło, zapisuje brak wybudzania dotykiem i potwierdzenie współtwórcy, że Home Assistant może go przyciemnić, całkowicie wyłączyć i ponownie wybudzić. Zobacz [dowody dotyczące tego profilu](/pl/reference/profiles/community/lenovo-thinksmart-view/).
- [`community-sunworld-yc-sm55p-p76s01.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-sunworld-yc-sm55p-p76s01.yaml): szkic dla 5,5-calowego Sunworld YC-SM55P jednego ze współtwórców na płycie Portworld P76S01. Profil zapisuje potwierdzoną firmware tożsamość RK3576S i zachowawcze ścieżki sterowania Androidem, ale pozostawia opcjonalne czujniki i kamerę wyłączone do testów fizycznych. Jego ogólna tożsamość kompilacji Rockchip nie jest bezpieczna do automatycznego wyboru. Zobacz [dowody dotyczące tego profilu](/pl/reference/profiles/community/sunworld-yc-sm55p/).

Format profilu, granicę zaufania i wymagania wkładu opisują [przewodnik profili środowiska wykonawczego](/pl/reference/profiles/), [dokumentacja formatu](/pl/reference/profiles/format/), [lista kontrolna testowania](/pl/reference/profiles/testing/) i [przewodnik udostępniania](/pl/reference/profiles/sharing/).
