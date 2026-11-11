---
title: Format profilu i zgodność
description: Omówienie profili paneli w schemacie 2 wraz z regułami walidacji, dopasowania i zgodności egzekwowanymi przez aplikację panelu.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Profile paneli używane podczas działania są dokumentami YAML z zamkniętym, wersjonowanym schematem. Na stronie Profil panelu obsługującego profile dostępne są maszynowy deskryptor tworzenia profili i katalog sterowników; ta strona zawiera omówienie. Pełny zestaw pól i słownik sterowników zainstalowanej kompilacji znajdziesz na stronie Profil. Opisuje ona model dokumentu i reguły zgodności, ale nie zastępuje walidacji przez docelową wersję ha-paneld.

## Model dokumentu

Każdy profil zawiera następujące sekcje pojęciowe:

| Sekcja                | Cel                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Schemat               | Wybiera język dokumentu profilu rozumiany przez ha-paneld.                                                                           |
| Tożsamość             | Stały identyfikator profilu i niezależnie wersjonowana zawartość.                                                                    |
| Metadane              | Nazwa, autor, źródło, linki tylko do wyświetlania, licencja, dojrzałość, przetestowane firmware i znane ograniczenia.                |
| Wymagania             | Minimalny zgodny rdzeń ha-paneld oraz wkompilowane sterowniki/funkcje wymagane przez dokument.                                       |
| Dopasowanie           | Ograniczone reguły dotyczące odcisku panelu.                                                                                         |
| Funkcje i sterowniki  | Fakty sprzętowe oraz wybór wkompilowanych sterowników i typowane parametry.                                                          |
| Nazwane strategie     | Opcjonalne reguły rdzenia dla niewielkiego zestawu obsługiwanych wartości zależnych od firmware/modelu.                              |
| Zamiary przygotowania | Wskazówki dostępu, zalecenia oprogramowania/wyświetlacza, żądany stan pakietów i wybrane procedury rdzenia; nigdy nadanie uprawnień. |

Pola główne obejmują `schema`, `id`, `version`, `display_name`, `soc_class`, `soc`, `metadata`, `requires`, `match`, `platform`, `hardware`, `sensors`, `identity`, `input`, `cpu`, `display` i `provisioning`. Nazwy pól mają postać małych liter `snake_case`; wielkość liter w wartościach ma znaczenie, chyba że opis pola stanowi inaczej. Zobacz [minimalny przykład społecznościowy](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml).

Dokładne dozwolone wartości wyliczeniowe oraz słownik sterowników i artefaktów definiują schemat i katalog sterowników udostępniane przez działającą wersję. Waliduj względem tego samego wydania, które będzie aktywować profil.

## Zamknięty schemat

Nieznane pola są błędami. Pozwala to wykryć literówki, które mogłyby bez ostrzeżenia usunąć właściwość bezpieczeństwa lub pozostawić funkcję nieskonfigurowaną. Schemat 2 nie ma obszaru dowolnych rozszerzeń. Autora, źródło HTTPS, licencję w stylu SPDX, dojrzałość `draft`/`experimental`/`verified`, przetestowane firmware i ograniczenia umieszczaj w `metadata`; wartości te nie mogą definiować dopasowania, sterowników, dostępu ani zachowania podczas działania.

Powtórzone klucze YAML, aliasy i klucze rekurencyjne są błędami. Dozwolony jest dokładnie jeden dokument YAML. Tagi YAML nie mogą tworzyć obiektów aplikacji ani Javy, a profile nie mogą zawierać predykatów z wyrażeniami regularnymi. Moduł wczytujący przyjmuje najwyżej 20 poziomów zagnieżdżenia, 20 000 zdarzeń parsera, 512 wpisów w jednej mapie lub liście oraz 16 384 znaki w jednym ciągu. Zachowuj proste, jawne dokumenty, nawet gdy edytor YAML obsługuje bardziej złożoną składnię.

Każda rewizja YAML ma limit 128 KiB. Lokalny katalog importów jest ograniczony do łącznie 128 rewizji, 16 rewizji jednego identyfikatora profilu i 4 MiB YAML. Przed zapisaniem kolejnych wyeksportuj i usuń zbędne nieaktywne rewizje; aktywne, oczekujące i ostatnie znane działające pozostają chronione. Limity zapobiegają wyczerpaniu pamięci masowej panelu przez wymianę profili i parsowaniu nieograniczonego katalogu przy starcie.

Pola wymagane nie mogą mieć wartości null. Dla pól opcjonalnych obecny czytnik zwykle traktuje null jako brak, ale autorzy powinni pomijać nieznane wartości, aby jasno wyrażać zamiar. Puste ciągi, puste listy/mapy, zera i false są rzeczywistymi wartościami i mogą różnić się od pominięcia lub udokumentowanej wartości domyślnej.

## Tożsamość i wersje

Używaj stałego, rozróżnialnego identyfikatora profilu o długości od 1 do 128 małych liter ASCII lub cyfr, z kropkami i łącznikami wyłącznie wewnątrz. Kolejne kropki są niedozwolone. Stosuj prefiks autora lub organizacji, gdy ogólna nazwa modelu mogłaby kolidować, np. `org.example.wallpanel-x1`. Nie umieszczaj numeru firmware w identyfikatorze, jeśli jeden profil i jego nazwane strategie mogą objąć rodzinę sprzętu.

Wersja zawartości profilu należy do autora i zmienia się wraz z wiedzą lub zachowaniem profilu. Jeśli profil będzie udostępniany, stosuj wersjonowanie semantyczne:

- patch: wyjaśnienia lub metadane bez zmiany dopasowania czy zachowania podczas działania;
- minor: dodatkowa wiedza o funkcjach, nowy zgodny wariant firmware lub bezpieczniejsze zalecenie;
- major: zmiana tożsamości dopasowania, wyboru sterownika, wymaganych uprawnień lub inna zmiana wymagająca świadomej migracji.

Wersja schematu należy do ha-paneld. Autorzy nie mogą jej zwiększać w celu wersjonowania własnego profilu.

## Omówienie pól schematu 2

„Wymagane” oznacza, że klucz musi występować z podanym typem. „Opcjonalne; domyślnie …” oznacza, że pominięcie (lub null w polu opcjonalnym) daje tę wartość. Nieznane klucze na każdym poziomie są błędami. Wszystkie liczby całkowite muszą mieścić się w 32-bitowej wartości ze znakiem przed sprawdzeniem węższego zakresu pola, a wszystkie liczby muszą pozostać skończone po konwersji na 32-bitową liczbę zmiennoprzecinkową, gdy pole używa liczby.

### Pola główne

| Pole           | Obecność                   | Typ i walidacja                                                                                                                                                                                                                                            |
| -------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`       | Wymagane                   | Liczba całkowita; dokładnie `2`. Schemat 1 nie jest akceptowany.                                                                                                                                                                                           |
| `id`           | Wymagane                   | Ciąg od 1 do 128 znaków; małe litery ASCII/cyfry, z `.` lub `-` tylko wewnątrz; `..` jest zabronione.                                                                                                                                                      |
| `version`      | Wymagane                   | Wersja zawartości profilu: dokładnie trzy części rozdzielone kropkami, każda to `0` lub od 1 do 9 cyfr bez początkowego zera; opcjonalne rozdzielone kropkami identyfikatory wersji wstępnej z liter ASCII, cyfr i `-`; bez sufiksu metadanych kompilacji. |
| `display_name` | Wymagane                   | Ciąg o długości od 1 do 100 znaków, niepusty i niebędący samymi białymi znakami.                                                                                                                                                                           |
| `soc_class`    | Wymagane                   | Ciąg o długości od 1 do 100 znaków, niepusty i niebędący samymi białymi znakami.                                                                                                                                                                           |
| `soc`          | Opcjonalne; domyślnie brak | Ustrukturyzowane fakty o SoC poparte dowodami profilu; pola poniżej.                                                                                                                                                                                       |
| `metadata`     | Wymagane                   | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `requires`     | Wymagane                   | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `match`        | Wymagane                   | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `platform`     | Wymagane                   | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `hardware`     | Wymagane                   | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `sensors`      | Opcjonalne; domyślnie `{}` | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `identity`     | Opcjonalne; domyślnie `{}` | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `input`        | Opcjonalne; domyślnie `{}` | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `cpu`          | Opcjonalne; domyślnie `{}` | Mapa; pola poniżej.                                                                                                                                                                                                                                        |
| `display`      | Opcjonalne; domyślnie `{}` | Fakty o fizycznym wyświetlaczu; pola poniżej.                                                                                                                                                                                                              |
| `provisioning` | Wymagane                   | Mapa zamiarów przygotowania urządzenia; pola poniżej.                                                                                                                                                                                                      |

### `metadata` i `requires`

| Pole                        | Obecność                      | Typ i walidacja                                                                                                                                                                                                                                                                                           |
| --------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata.author`           | Wymagane                      | Ciąg o długości od 1 do 100 znaków, niepusty i niebędący samymi białymi znakami.                                                                                                                                                                                                                          |
| `metadata.source`           | Opcjonalne; domyślnie brak    | Bezwzględny adres URL HTTPS, najwyżej 500 znaków, z niepustym hostem i bez składnika informacji o użytkowniku.                                                                                                                                                                                            |
| `metadata.links`            | Opcjonalne; domyślnie `[]`    | Lista najwyżej ośmiu linków zewnętrznych służących tylko do wyświetlania. ha-paneld nigdy ich nie pobiera, nie ładuje wstępnie ani nie używa do przygotowania urządzenia. Adresy URL i etykiety muszą być unikalne, a link nie może powtarzać `metadata.source`.                                          |
| `metadata.links[].label`    | Wymagane dla każdego elementu | Etykieta wyświetlana, od 1 do 48 znaków, niepusta i niebędąca samymi białymi znakami, bez znaków sterujących ani formatowania dwukierunkowego. Interfejs Profile pokazuje też nazwę hosta docelowego w izolowanym fragmencie tekstu.                                                                      |
| `metadata.links[].url`      | Wymagane dla każdego elementu | Bezwzględny adres URL HTTPS z tymi samymi regułami limitu 500 znaków, hosta i braku informacji o użytkowniku co `metadata.source`.                                                                                                                                                                        |
| `metadata.license`          | Wymagane                      | Ciąg w stylu SPDX z jednego lub większej liczby identyfikatorów od 1 do 64 znaków pasujących do `[A-Za-z0-9][A-Za-z0-9.+-]*`, rozdzielonych wyłącznie przez `AND` lub `OR`. Nawiasy, `WITH` i dowolny tekst nie są akceptowane.                                                                           |
| `metadata.maturity`         | Wymagane                      | `draft`, `experimental` lub `verified`.                                                                                                                                                                                                                                                                   |
| `metadata.tested_firmware`  | Opcjonalne; domyślnie `[]`    | Lista najwyżej 32 ciągów, niepustych i niebędących samymi białymi znakami, każdy najwyżej 120 znaków.                                                                                                                                                                                                     |
| `metadata.limitations`      | Opcjonalne; domyślnie `[]`    | Lista najwyżej 32 ciągów, niepustych i niebędących samymi białymi znakami, każdy najwyżej 500 znaków.                                                                                                                                                                                                     |
| `requires.min_core_version` | Opcjonalne; domyślnie brak    | Wersja wydania z kropkami, najwyżej 64 znaki: od 1 do 4 części numerycznych po 1 do 6 cyfr, z opcjonalnym sufiksem wersji wstępnej z części rozdzielonych kropkami zawierających litery i cyfry ASCII oraz `-`. Działający rdzeń musi być równy lub nowszy, z uwzględnieniem kolejności wersji wstępnych. |
| `requires.drivers`          | Wymagane                      | Lista identyfikatorów sterowników rdzenia. Nieznane identyfikatory są błędami; sterownik wymagany przez wypełnioną funkcję musi być wymieniony. Nieużywany poza tym sterownik powoduje ostrzeżenie.                                                                                                       |

### `soc`

`soc_class` pozostaje wymaganą ogólną etykietą rodziny. Opcjonalny blok strukturalny zapisuje fakty, których Android zwykle nie potrafi wiarygodnie rozpoznać, np. czy nominalnie czterordzeniowy panel używa rdzeni Cortex-A35 czy Cortex-A55. Wartości pojawiają się na stronach Pulpit i Profile, ale są pomijane w zwięzłym publicznym raporcie `/diag`. Dodawaj wyłącznie fakty poparte publicznym źródłem lub dowodami sprzętowymi; pomijaj nieznane pola, zamiast zgadywać.

| Pole                           | Obecność                      | Typ i walidacja                                                                                                                                                                 |
| ------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `soc.model`                    | Wymagane, gdy występuje `soc` | Nazwa modelu od 1 do 100 znaków, niepusta i niebędąca samymi białymi znakami, bez znaków sterujących C0 lub DEL.                                                                |
| `soc.introduced_year`          | Opcjonalne; domyślnie brak    | Liczba całkowita od 1970 do 2100. Użyj roku publicznego wprowadzenia SoC, a nie wydania panelu.                                                                                 |
| `soc.cpu_cores`                | Opcjonalne; domyślnie `[]`    | Najwyżej osiem klastrów architektury i łącznie 256 rdzeni. Pusta lista oznacza znany model, ale niewystarczająco udokumentowaną topologię CPU.                                  |
| `soc.cpu_cores[].architecture` | Wymagane dla każdego elementu | Architektura rdzenia od 1 do 64 znaków, niepusta i niebędąca samymi białymi znakami, bez znaków sterujących; architektury muszą być unikalne bez uwzględnienia wielkości liter. |
| `soc.cpu_cores[].count`        | Wymagane dla każdego elementu | Liczba całkowita od 1 do 128.                                                                                                                                                   |

### `match`

`match.any` łączy grupy operatorem OR; lista `all` jednej grupy łączy predykaty operatorem AND; lista `values` jednego predykatu używa OR. Porównania uwzględniają wielkość liter wobec danych kompilacji, które ha-paneld wcześniej zamienił na małe litery.

| Pole                       | Obecność | Typ i walidacja                                                                                                                                                             |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `match.priority`           | Wymagane | Liczba całkowita od 0 do 1000; rozstrzyga remisy profili po priorytecie dopasowanej grupy.                                                                                  |
| `match.fallback`           | Wymagane | Wartość logiczna. `true` jest dozwolone tylko dla dostarczonego profilu o identyfikatorze `generic`; profile importowane/społecznościowe nie mogą być profilami awaryjnymi. |
| `match.any`                | Wymagane | Lista najwyżej 64 obiektów grup. Profil niebędący awaryjnym wymaga co najmniej jednej grupy; dostarczony Generic może mieć pustą listę.                                     |
| `match.any[].priority`     | Wymagane | Liczba całkowita od 0 do 1000; szczegółowość gałęzi używana przed priorytetem profilu.                                                                                      |
| `match.any[].all`          | Wymagane | Lista od 1 do 8 obiektów predykatów.                                                                                                                                        |
| `match.any[].all[].field`  | Wymagane | `model`, `device` lub `product_version`.                                                                                                                                    |
| `match.any[].all[].op`     | Wymagane | `equals`, `starts_with` lub `contains`.                                                                                                                                     |
| `match.any[].all[].values` | Wymagane | Lista od 1 do 32 ciągów zapisanych małymi literami, niepustych i niebędących samymi białymi znakami; każdy najwyżej 100 znaków, bez znaków sterujących C0 lub DEL.          |

### `platform` i `hardware`

| Pole                                     | Obecność                         | Typ i walidacja                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform.su_form`                       | Wymagane                         | `none`, `android` lub `toolbox`.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `platform.app_can_su`                    | Wymagane                         | Wartość logiczna. Musi być `false`, gdy `su_form` to `none`; forma `android` lub `toolbox` nadal może być zadeklarowana z `false` dla aplikacji zamkniętej w piaskownicy.                                                                                                                                                                                                                                                             |
| `platform.has_recents`                   | Opcjonalne; domyślnie `true`     | Wartość logiczna.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `platform.has_native_navbar`             | Opcjonalne; domyślnie brak       | Pomiń, aby sprawdzić widoczność paska nawigacyjnego firmware. Jawne `true` lub `false` zastępuje wynik tego sprawdzenia.                                                                                                                                                                                                                                                                                                              |
| `platform.launcher.vendor_home_packages` | Opcjonalne; domyślnie puste      | Lista najwyżej 8 nazw pakietów Androida, bez duplikatów. Aplikacje producenta rejestrujące się jako ekran główny Androida, ale niebędące szufladami aplikacji, np. aplikacja sterująca producenta. Przycisk Launcher na pasku nawigacyjnym je pomija, a gdy nic innego nie pasuje, otwiera Launcher panelu, który nadal wymienia je jako aplikacje.                                                                                   |
| `hardware.led`                           | Wymagane                         | Mapa zawierająca poniższe pola LED.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `hardware.led.mechanism`                 | Wymagane                         | `none`, `autodetect`, `rk3576-ioctl`, `rk3576-ioctl-daemon` lub `sysfs-daemon`. Mechanizmy wyłącznie dla demona są odrzucane, gdy `platform.app_can_su` to `true`.                                                                                                                                                                                                                                                                    |
| `hardware.led.transfer`                  | Opcjonalne; domyślnie `identity` | Wybiera wkompilowaną krzywą przenoszenia. Przykłady to `identity`, `rk3576-four-bit`, `perceptual`, `gamma` i zmierzone `points`; parametry znajdziesz w udostępnianym schemacie.                                                                                                                                                                                                                                                     |
| `hardware.screen_off`                    | Wymagane                         | Wybiera wkompilowany sterownik wyłączania ekranu, np. `brightness-zero`, `su-blpower`, `daemon-blpower`, `keyevent`, `screen-timeout`, `device-admin` lub `vendor-rpc`. Wymagania uprawnień i lokalnego budzenia zależą od wybranej ścieżki; korzystaj z udostępnianego schematu i zweryfikuj ścieżkę na sprzęcie.                                                                                                                    |
| `hardware.has_button_backlight`          | Opcjonalne; domyślnie `false`    | Wartość logiczna; true wybiera ograniczoną funkcję podświetlenia przycisków obsługiwaną przez helper.                                                                                                                                                                                                                                                                                                                                 |
| `hardware.local_wake`                    | Opcjonalne; domyślnie brak       | Lista unikalnych wartości spośród `touch`, `proximity` i `button`: sposoby obudzenia całkowicie ciemnego panelu na samym panelu. `touch` oznacza budzenie dowolnym dotknięciem, `proximity` — machnięciem po kalibracji zbliżenia, a `button` — przyciskiem sprzętowym. Pomiń, gdy nieznane; pusta lista deklaruje budzenie wyłącznie przez Home Assistant. Home Assistant zawsze może obudzić panel, więc nigdy nie jest wymieniany. |
| `hardware.zigbee_gateway_dir`            | Opcjonalne; domyślnie brak       | Dokładna dozwolona ścieżka `/vendor/bin/siliconlabs_host`; żadna inna nie jest akceptowana.                                                                                                                                                                                                                                                                                                                                           |
| `hardware.relay_base`                    | Opcjonalne; domyślnie brak       | Jedna dokładna dozwolona ścieżka: `/sys/class/relay`, `/sys/class/st_relay` lub `/sys/class/strelay`.                                                                                                                                                                                                                                                                                                                                 |
| `hardware.relay_base_fallbacks`          | Opcjonalne; domyślnie `[]`       | Lista najwyżej trzech ścieżek z tej samej listy dozwolonych ścieżek przekaźnika. Wpisy muszą być unikalne i nie mogą powtarzać `relay_base`.                                                                                                                                                                                                                                                                                          |
| `hardware.button_led_gpio_base`          | Opcjonalne; domyślnie brak       | Liczba całkowita od 0 do 4092, oznaczająca pierwszy GPIO w bloku czterech GPIO.                                                                                                                                                                                                                                                                                                                                                       |
| `hardware.camera`                        | Opcjonalne; domyślnie brak       | Wartość logiczna z trzema stanami: pominięcie pozwala na wyliczanie przez Androida, `true` deklaruje kandydata nawet przy niepowodzeniu wyliczania, a `false` wyłącza kamerę. Przechwytywanie zawsze wymaga dołączonego wskaźnika ekranowego; przy wyłączonym wyświetlaczu wymaga też działającego wskaźnika LED. Bez sygnalizacji przy wyłączonym wyświetlaczu przechwytywanie kończy się z jego wyłączeniem.                        |
| `hardware.microphone`                    | Opcjonalne; domyślnie brak       | `true` deklaruje potwierdzony mikrofon, `false` go wyłącza, a pominięcie używa wyliczania wbudowanych mikrofonów Androida, a następnie sprawdza przechwytywanie przed nasłuchem. Niezależne od obecności kamery.                                                                                                                                                                                                                      |
| `hardware.camera_lens_offset_px`         | Opcjonalne                       | Liczba całkowita; piksele ekranu od górnej krawędzi aktywnego obszaru wyświetlacza do środka obiektywu kamery. Wskaźnik użycia kamery jest rysowany jako łuk ze środkiem w obiektywie, więc ta wartość go pozycjonuje; to pomiar ramki różniący się między płytkami. Pomiń, jeśli nie zmierzono — wskaźnik użyje wartości domyślnej.                                                                                                  |
| `hardware.touch_click_gain`              | Opcjonalne; domyślnie `0.2`      | Liczba od 0.05 do 1.0; skaluje głośność dźwięku dotknięcia dla płytki, której dźwięk jest zbyt głośny lub cichy przy wartości systemowej.                                                                                                                                                                                                                                                                                             |

### `sensors` i `identity`

| Pole                            | Obecność                             | Typ i walidacja                                                                                                                                                                   |
| ------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sensors.proximity_technology`  | Opcjonalne; domyślnie brak           | Ciąg od 1 do 100 znaków, niepusty i niebędący samymi białymi znakami, bez znaków sterujących C0 lub DEL. Obecność deklaruje użycie czujnika zbliżeniowego Androida.               |
| `sensors.proximity_gpio`        | Opcjonalne; domyślnie brak           | Liczba całkowita od 0 do 4095 dla obsługiwanej binarnej ścieżki GPIO wymagającej roota.                                                                                           |
| `sensors.light_technology`      | Opcjonalne; domyślnie brak           | Ciąg od 1 do 100 znaków, niepusty i niebędący samymi białymi znakami, bez znaków sterujących C0 lub DEL. Obecność deklaruje użycie czujnika światła otoczenia Androida.           |
| `sensors.vi530x`                | Opcjonalne; domyślnie `false`        | Wartość logiczna; udostępnia uruchamiane przez helper źródło odległości czasu przelotu VI530x, uruchamiane przez ioctl, a następnie odpytywane. Wymaga uwierzytelnionego helpera. |
| `sensors.cht8305`               | Opcjonalne; domyślnie `false`        | Wartość logiczna; włącza dokładne obsługiwane przez rdzeń wejście klimatu pomieszczenia zgodne z CHT8305 przez uwierzytelnioną ścieżkę helpera.                                   |
| `sensors.room_temp_offset_c`    | Opcjonalne; domyślnie `0.0`          | Skończona liczba od -30 do 30 °C.                                                                                                                                                 |
| `identity.manufacturer`         | Opcjonalne; domyślnie brak           | Ciąg od 1 do 100 znaków, niepusty i niebędący samymi białymi znakami, bez znaków sterujących C0 lub DEL; brak oznacza wnioskowanie podczas działania.                             |
| `identity.model`                | Opcjonalne; domyślnie brak           | Ciąg od 1 do 100 znaków, niepusty i niebędący samymi białymi znakami, bez znaków sterujących C0 lub DEL; brak oznacza wnioskowanie podczas działania.                             |
| `identity.model_label_strategy` | Opcjonalne; domyślnie `display-name` | `display-name` lub `nspanel-product-version`.                                                                                                                                     |

Zapisana rewizja schematu 2 może zawierać `proximity_near_below`, `proximity_near_raw`, `proximity_far_raw` lub `proximity_graded_strategy`. Moduł wczytujący przyjmuje te wycofane klucze wyłącznie jako pozostałości dla zgodności: są ignorowane przy wczytywaniu i pomijane przy serializacji dokumentu profilu. Eksport niezmiennej zapisanej rewizji zachowuje jej oryginalne bajty. Podczas działania używane są skalibrowane wartości domyślne profilu czujnika lub zapisana konfiguracja z przewodnikiem, a źródło na żywo jest sprawdzane przed zgłoszeniem znormalizowanych wartości.

### `input`, `cpu` i `display`

| Pole                               | Obecność                      | Typ i walidacja                                                                                                                                                   |
| ---------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input.evdev_buttons`              | Opcjonalne; domyślnie `[]`    | Lista najwyżej 32 obiektów mapowania evdev. Powtórzone pary `(sw, code)` są odrzucane nawet przy różnych węzłach.                                                 |
| `input.evdev_buttons[].node`       | Wymagane dla każdego elementu | Ciąg pasujący do `/dev/input/eventN`, gdzie `N` to od 1 do 3 cyfr dziesiętnych. Inne ścieżki urządzeń nie są akceptowane.                                         |
| `input.evdev_buttons[].code`       | Wymagane dla każdego elementu | Całkowity kod wejścia/przełącznika Linux od 1 do 767.                                                                                                             |
| `input.evdev_buttons[].grab`       | Wymagane dla każdego elementu | Wartość logiczna; true żąda wyłącznego `EVIOCGRAB`.                                                                                                               |
| `input.evdev_buttons[].event_type` | Wymagane dla każdego elementu | Ciąg najwyżej 64 znaków pasujący do `KEYCODE_[A-Z0-9_]+`.                                                                                                         |
| `input.evdev_buttons[].sw`         | Opcjonalne; domyślnie `false` | Wartość logiczna; false wybiera `EV_KEY`, true wybiera `EV_SW`.                                                                                                   |
| `cpu.governors`                    | Opcjonalne; domyślnie brak    | Mapa, której jedyne dozwolone klucze to `Performance`, `Efficiency` i `Auto`. Każda wartość jest nazwą zarządcy od 1 do 32 znaków pasującą do `[a-z][a-z0-9_-]*`. |
| `display.physical_ppi`             | Opcjonalne; domyślnie brak    | Liczba całkowita od 50 do 1000.                                                                                                                                   |

### `provisioning`

| Pole                                          | Obecność                         | Typ i walidacja                                                                                                                                                                                                             |
| --------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provisioning.access`                         | Opcjonalne; domyślnie `{}`       | Mapa zaleceń dostępu.                                                                                                                                                                                                       |
| `provisioning.access.shizuku`                 | Wycofane pole zgodności          | Stare wartości są akceptowane i ignorowane. Nie zapewniają drogi dostępu podczas działania.                                                                                                                                 |
| `provisioning.software`                       | Opcjonalne; domyślnie `{}`       | Mapa polityki oprogramowania należącej do rdzenia.                                                                                                                                                                          |
| `provisioning.software.webview.artifact`      | Opcjonalne; domyślnie brak       | Identyfikator rdzenia `lineageos-138-arm`, `lineageos-150-arm` lub `lineageos-150-arm64`. Profil nie może podawać adresu URL, wersji ani skrótu podpisującego.                                                              |
| `provisioning.software.companion.max_version` | Opcjonalne; domyślnie brak       | Wersja wydania z kropkami, z tą samą składnią i limitem 64 znaków co `requires.min_core_version`.                                                                                                                           |
| `provisioning.display.density`                | Opcjonalne; domyślnie brak       | Liczba całkowita od 80 do 640 dpi lub nazwana strategia `nspanel-variant`.                                                                                                                                                  |
| `provisioning.display.font_scale`             | Opcjonalne; domyślnie brak       | Skończona liczba od 0.5 do 1.5.                                                                                                                                                                                             |
| `provisioning.packages`                       | Opcjonalne; domyślnie `[]`       | Lista od 0 do 128 obiektów żądanego stanu pakietu.                                                                                                                                                                          |
| `provisioning.packages[].package`             | Wymagane dla każdego elementu    | Unikalna nazwa pakietu Androida pasująca do `[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+`.                                                                                                                                      |
| `provisioning.packages[].desired_state`       | Wymagane dla każdego elementu    | `disabled`. Opisuje stan docelowy i nie jest zgodą na wykonanie.                                                                                                                                                            |
| `provisioning.packages[].importance`          | Wymagane dla każdego elementu    | `recommended` lub `optional`. Ważność steruje tylko prezentacją i nigdy nie oznacza domyślnego zastosowania.                                                                                                                |
| `provisioning.packages[].tags`                | Opcjonalne; domyślnie `[]`       | Lista najwyżej ośmiu tagów. Każdy ma od 1 do 24 znaków, zaczyna się małą literą ASCII, a dalej zawiera tylko małe litery, cyfry lub `-`.                                                                                    |
| `provisioning.packages[].note`                | Opcjonalne; domyślnie pusty ciąg | Ciąg najwyżej 500 znaków. Uwagi są dodatkowymi wyjaśnieniami, a nie procedurami.                                                                                                                                            |
| `provisioning.recipes`                        | Opcjonalne; domyślnie `[]`       | Lista najwyżej 32 wyborów procedur należących do rdzenia.                                                                                                                                                                   |
| `provisioning.recipes[].id`                   | Wymagane dla każdego elementu    | Unikalny zarejestrowany identyfikator. Schemat 2 zna `nspanel-pro.watchdog-e2big-repair` i `tpa10.vendor-stack-minimize`. Wpisy procedur nie mogą zawierać argumentów, poleceń, adresów URL ani definicji przepływów pracy. |

Trzy identyfikatory WebView wskazują następujące kompilacje i metadane zgodności należące do rdzenia:

| Identyfikator artefaktu | Kompilacja rdzenia                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `lineageos-138-arm`     | LineageOS System WebView `138.0.7204.63`; ABI ARM `armeabi-v7a` i `arm64-v8a`; Android 8–9.           |
| `lineageos-150-arm`     | LineageOS System WebView `150.0.7871.63`; ABI ARM `armeabi-v7a`; Android 10 lub nowszy.               |
| `lineageos-150-arm64`   | LineageOS System WebView `150.0.7871.63`; ABI ARM `armeabi-v7a` i `arm64-v8a`; Android 10 lub nowszy. |

Pole artefaktu WebView wybiera kompilację, której pobieranie, suma kontrolna, pakiet, wersja i podpisujący są wkompilowane w rdzeń. Aktualizacja aplikacji panelu rozpoczęta z Home Assistant może również zainstalować zgodny WebView. Jeśli aktualizacja pozostaje niedokończona, spróbuj ponownie przez jej Naprawę aktualizacji. Import lub aktywacja profilu nie rozpoczyna aktualizacji. Zobacz [Aktualizacja WebView](/pl/hardware/guides/update-the-webview/).

### Warunkowe wymagania sterowników

Każdy sterownik wybrany przez wypełnione pola musi występować w `requires.drivers`. Udostępniany katalog sterowników określa wymagania uprawnień każdego sterownika; kilka ścieżek Androida i usług producenta działa bez roota.

| Warunek profilu                                                            | Wymagany sterownik        |
| -------------------------------------------------------------------------- | ------------------------- |
| `platform.su_form: android` i `platform.app_can_su: true`                  | `access.android-su`       |
| `platform.su_form: toolbox` i `platform.app_can_su: true`                  | `access.toolbox-su`       |
| `hardware.led.mechanism: autodetect`                                       | `led.autodetect`          |
| `hardware.led.mechanism: rk3576-ioctl`                                     | `led.rk3576-ioctl`        |
| `hardware.led.mechanism: rk3576-ioctl-daemon`                              | `led.rk3576-ioctl-daemon` |
| `hardware.led.mechanism: sysfs-daemon`                                     | `led.sysfs-daemon`        |
| `hardware.screen_off: brightness-zero`                                     | `screen.brightness-zero`  |
| `hardware.screen_off: su-blpower`                                          | `screen.su-blpower`       |
| `hardware.screen_off: daemon-blpower`                                      | `screen.daemon-blpower`   |
| `hardware.screen_off: keyevent`                                            | `screen.keyevent`         |
| `hardware.zigbee_gateway_dir` występuje                                    | `radio.siliconlabs-host`  |
| `hardware.relay_base` występuje, lub `relay_base_fallbacks` nie jest puste | `relay.sysfs`             |
| `hardware.button_led_gpio_base` występuje                                  | `relay.gpio-button-led`   |
| `hardware.has_button_backlight: true`                                      | `input.button-backlight`  |
| `sensors.proximity_technology` lub `sensors.light_technology` występuje    | `sensor.android`          |
| `sensors.proximity_gpio` występuje                                         | `sensor.gpio-proximity`   |
| `sensors.cht8305: true`                                                    | `sensor.cht8305-daemon`   |
| `sensors.vi530x: true`                                                     | `sensor.vi530x-daemon`    |
| `input.evdev_buttons` nie jest puste                                       | `input.evdev`             |
| `provisioning.software.webview.artifact` występuje                         | `update.webview`          |

### Limity składni i przechowywania

| Zakres                                    | Limit                                              |
| ----------------------------------------- | -------------------------------------------------- |
| Jedna surowa rewizja YAML                 | 128 KiB bajtów UTF-8.                              |
| Liczba dokumentów YAML                    | Dokładnie jeden; puste dane są nieprawidłowe.      |
| Aliasy YAML                               | Zero.                                              |
| Zagnieżdżenie                             | Najwyżej 20 poziomów kolekcji.                     |
| Praca parsera                             | Najwyżej 20 000 zdarzeń parsera.                   |
| Jedna mapa lub lista                      | Najwyżej 512 wpisów przed węższymi limitami pól.   |
| Jeden ciąg                                | Najwyżej 16 384 znaki przed węższymi limitami pól. |
| Katalog importów                          | Najwyżej 128 przyjętych rewizji.                   |
| Jeden identyfikator importowanego profilu | Najwyżej 16 przyjętych rewizji.                    |
| Pamięć importowanego YAML                 | Łącznie najwyżej 4 MiB.                            |

## Wymagania

Profil deklaruje minimalne zachowanie rdzenia i wkompilowane sterowniki, których wymaga. Gdy wymaganie jest niedostępne, walidacja bezpiecznie odmawia. Niedostępne wymaganie różni się od nieudanego sprawdzenia na żywo: pierwsze oznacza, że ta kompilacja ha-paneld nie zna żądanego mechanizmu; drugie — że mechanizm istnieje w rdzeniu, ale był nieosiągalny na tym panelu.

Nie rozszerzaj wymagań na zapas. Wymaganie nieużywanego uprzywilejowanego sterownika utrudnia uruchomienie i przegląd profilu, nie dodając funkcji.

## Reguły dopasowania

Reguły dopasowania działają tylko na niezmiennych danych `model`, `device` i `product_version` udostępnianych przez ha-paneld. Lista `match.any` używa OR; predykaty na liście `all` jednej grupy używają AND. Predykaty obsługują `equals`, `starts_with` i `contains` dla oczekiwanych wartości zapisanych małymi literami, nigdy wyrażeń regularnych.

Każda grupa ma priorytet gałęzi `priority` od 0 do 1000. Wygrywa pasujący profil z pakietu o najwyższym priorytecie dopasowanej grupy; `match.priority` profilu rozstrzyga pozostały remis, a dokładny remis bezpiecznie przechodzi do Generic. Używaj wyższych priorytetów grup dla dokładnych tożsamości produktów, a niższych dla szerokich awaryjnych dopasowań zgodności. Reguła pasująca tylko do `px30`, `rk3326`, `rk3566`, `rk3576` lub podobnie wielokrotnie używanej nazwy referencyjnej nie jest wystarczającym dowodem dla sterowania konkretnym sprzętem.

Dopasowanie wybiera profil kandydujący; nie dowodzi dostępności funkcji. Sterowniki nadal sprawdzają dostępność na żywo, a przy rozbieżności dowodów i deklaracji wygrywa wynik zachowawczy.

## Nazwane strategie modeli

Schemat nie ma ogólnego języka wyrażeń ani sekcji dowolnych warunkowych poprawek. Jego nazwane strategie są celowo niewielkie i należą do rdzenia:

- `identity.model_label_strategy: nspanel-product-version` dekoduje wariant NSPanel i etykietę firmware;
- `provisioning.display.density: nspanel-variant` wybiera udokumentowaną gęstość 86P/120P;
- domyślne `display-name` i stałe wartości całkowite unikają tych przekształceń.

`hardware.relay_base_fallbacks` to zwykłe ograniczone dane dla znanych obsługiwanych zmian nazw klas przekaźników, a nie wyrażenie czy dowolne wyszukiwanie ścieżek.

Strategie są wkompilowanymi, ograniczonymi przekształceniami nazwanymi w schemacie, a nie skryptami z profilu. Nie mogą wywoływać operacji wejścia/wyjścia ani sterowników. Udostępniany schemat opisuje obsługiwane strategie i ich dane wejściowe.

Twórz osobne profile, gdy żadna nazwana strategia nie obejmuje różnicy lub gdy produkty wymagają innych wkompilowanych sterowników, poziomów uprawnień, oczekiwań dotyczących odzyskiwania albo niezależnie utrzymywanych dowodów.

## Funkcje i wkompilowane sterowniki

Deklaracja funkcji zawiera fakty sprzętowe oraz, gdy potrzeba, identyfikator sterownika z typowanymi parametrami. Identyfikatory sterowników nazywają implementacje wkompilowane w ha-paneld. Sterownik odpowiada za walidację ścieżek, zakresów, kodów zdarzeń, nazw pakietów i innych danych istotnych dla bezpieczeństwa. Ścieżki uprzywilejowane są wybierane z list dozwolonych w rdzeniu. Zachowane metadane `provisioning.software.webview.artifact` wskazują URL, wersję, sumę kontrolną artefaktu i skrót podpisującego wkompilowane w rdzeń i audytowane wraz z nim; profil nie może przedefiniować tej podstawy zaufania. Aktualizacja rozpoczęta przez właściciela sprawdza zainstalowanego dostawcę i jego zgodność przed użyciem artefaktu; profil nie może dostarczyć innego pliku do pobrania ani podstawy zaufania.

Profile nie mogą dostarczać:

- poleceń powłoki ani tablic argumentów;
- nazw poleceń demona pomocniczego;
- dowolnych operacji odczytu/zapisu systemu plików;
- bibliotek natywnych, numerów ioctl ani ładunków bajtowych;
- adresów URL APK, skrótów podpisujących ani nowych artefaktów aktualizacji;
- wykonywalnych wyrażeń z dostępem do sieci, systemu plików, procesów, refleksji lub zegara;
- danych uwierzytelniających, tokenów Home Assistant ani konfiguracji MQTT.

Zadeklarowana funkcja pozostaje kandydatem, dopóki sterownik jej nie potwierdzi. Interfejs i diagnostyka powinny rozróżniać stany **zadeklarowana**, **dostępna**, **niedostępna** i **brak uprawnień**, zamiast traktować YAML jako dowód.

## Zachowanie przy niezgodności

ha-paneld traktuje błędy zgodności jako problemy nieaktywnego profilu, a nie błędy uruchamiania panelu:

- Schemat `2` jest jedynym akceptowanym językiem dokumentu. Zapisane rewizje schematu 1 nadal można wyświetlać, eksportować i usuwać, ale nie aktywować; wybrana niezgodna rewizja przechodzi do zgodnej ostatniej znanej działającej rewizji schematu 2, pasującego profilu z pakietu lub dostarczonego `generic.yaml`.
- Nieznany wymagany sterownik lub przekształcenie uniemożliwia aktywację.
- Zainstalowane lokalne rewizje są ponownie walidowane po aktualizacji aplikacji.
- Oryginalny YAML i skrót jego zawartości pozostają rozpoznawalne po walidacji i normalizacji.
- Niepowodzenie aktywacji przywraca ostatnią znaną działającą rewizję.
- Jeśli żaden profil konkretnego panelu nie może działać, ha-paneld uruchamia zachowawcze zachowanie dostarczonego `generic.yaml`. Jeśli ten profil awaryjny jest nieobecny lub uszkodzony, awaryjny kontrakt bez funkcji sprzętowych utrzymuje dostępność lokalnego interfejsu zarządzania bez deklarowania sprzętu panelu.

Skróty zawartości i ewentualne osobno publikowane podpisy odpowiadają na różne pytania. Skrót rewizji ha-paneld wiąże zapis i aktywację z bajtami, które sprawdzono. Zewnętrzny podpis może pomóc rozpoznać wydawcę, ale nie jest sygnałem uprawnień interpretowanym przez moduł wczytujący profile. Żaden z nich nie daje roota ani pozwolenia na pominięcie walidacji i potwierdzeń.

## Kolejność dopasowania

Polityka rozstrzygania chroni znane produkty przed niejawną aktywacją plików społeczności:

1. jawny, prawidłowy wybór administratora przypięty do dokładnej rewizji z pakietu lub lokalnej;
2. automatyczne dokładne dopasowanie z pakietu;
3. automatyczne awaryjne dopasowania zgodności z pakietu;
4. Generic.

Reguły dopasowania lokalne/społecznościowe są oceniane tylko dla podglądu i porównania. Nigdy nie uczestniczą w automatycznym wyborze, więc import lub zapis pliku nie może zastąpić wykrywania z pakietu. Aktywacja zawsze wymaga jawnego przypiętego wyboru.

## Lista zgodności dla autorów

Przed udostępnieniem nowej rewizji potwierdź:

- schemat `2` i każde pole przechodzą walidację na najstarszej wersji rdzenia deklarowanej przez plik;
- każdy wymagany sterownik występuje w tej wersji;
- dokładne przypadki testowe odcisków obejmują każdy deklarowany model i rodzinę firmware;
- podobny, lecz niepasujący przypadek testowy nie dopasowuje innego produktu z tym samym SoC;
- każdą granicę nazwanej strategii przetestowano bezpośrednio poniżej, na i powyżej przejścia, gdzie ma to zastosowanie;
- każda grupa dokładnego dopasowania ma wyższy priorytet gałęzi niż jej szerokie dopasowanie awaryjne, z przypadkami testowymi kolizji między profilami;
- profil działa bez dostępnego opcjonalnego sprzętu i uprawnień, nie blokując startu;
- poprzednia aktywna rewizja pozostaje użytecznym celem wycofania zmian.
