---
title: Środowisko programistyczne
description: Zestaw narzędzi kompilujący aplikację panelu, metody Docker i devcontainer oraz informacje o podpisywaniu potrzebne autorom forków.
sourceCommit: 396e908e6370b88a9fd555abcb67b0816c4cd6f4
---

Nie musisz kompilować ha-paneld, aby go używać: instalacja panelu pobiera podpisane wydanie. Ta strona jest przeznaczona dla współtwórców i osób utrzymujących fork. Oprowadzenie po źródłach znajdziesz w [przewodniku po kodzie w DeepWiki](https://deepwiki.com/panel-assistant/android).

## Zestaw narzędzi

Aplikacja panelu jest aplikacją Android napisaną w Kotlinie i kompilowaną przez Gradle. Wymaga **JDK 17** i Android SDK z **platformą 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 i CMake 3.22.1** (CMake i NDK kompilują natywny sterownik LED). Wrapper Gradle ustala wersję Gradle, a wersje zależności znajdują się w [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml).

Po lokalnej instalacji tych narzędzi:

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

Jeśli wolisz nie instalować nic poza Dockerem, [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) tworzy obraz z ustalonymi wersjami i tym samym zestawem narzędzi, a następnie uruchamia w nim Gradle. APK trafia do twojego drzewa roboczego, obraz pozostaje w pamięci podręcznej po pierwszej kompilacji, a pamięci podręczne Gradle są zachowywane w nazwanym wolumenie Docker.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Jeśli uruchamiasz skrypt wewnątrz kontenera komunikującego się z zewnętrznym demonem Docker, przeczytaj uwagę o `HOST_WORKDIR` w `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) ustala ten sam zestaw narzędzi Android dla VS Code, więc SDK i NDK nie trafiają na twój komputer. Otwórz repozytorium w VS Code, wybierz **Otwórz ponownie w kontenerze**, a następnie uruchom powyższe polecenia Gradle. JDK devcontainera jest nowsze niż JDK 17, więc za rozstrzygającą dla zachowania wersji Java uznawaj kompilację z JDK 17.

## Pomocnik roota

Gradle automatycznie kompiluje i weryfikuje oba pomocniki roota dla poszczególnych ABI przed kompilacją aplikacji. Aplikacja i pomocniki zawierają tę samą tożsamość, wyprowadzoną z każdego pliku źródłowego pomocnika, nagłówka i definicji polecenia, więc lokalna kompilacja aplikacji nie może po cichu zależeć od nieaktualnego kodu uprzywilejowanego.

## Pomiar wydajności pulpitu z komputera

Własna strona stanu panelu przedstawia wydajność na potrzeby codziennego użytkowania; zobacz [Wydajność](/pl/manage/performance/). Repozytorium zawiera skrypt zbierający pomiary do zarejestrowanego porównania pulpitu z filtrem encji i bez niego, mierzonego spoza panelu.

Jeśli niefiltrowany pulpit przeciąża własny WebView, pomiary na stronie mogą przestać się zmieniać. Skrypt kolektora uruchomiony na komputerze odpytuje zamiast tego interfejs wydajności samej aplikacji panelu, należący do przestarzałego REST API (zobacz [dokumentację sterowania](/pl/reference/api/#the-rest-api-is-deprecated)). CPU całego panelu pozostaje więc widoczne, a przy root lub pomocniku także natywny pomiar wątku renderera Chromium. Skrypt zapisuje też wiek ostatniej partii pomiarów przeglądarki; ponad 15 sekund oznacza zatrzymany pomiar, a nie bieżący wynik.

Kolektor nie zmienia konfiguracji. Nigdy nie włącza, nie wyłącza ani nie przepisuje filtra encji; pierwsze żądanie może utworzyć jeden prywatny klucz instalacji w wewnętrznym stanie aplikacji. Wybierz ten sam widok i obciążenie dla obu pomiarów, zmień filtr w interfejsie panelu, poczekaj na przeładowanie pulpitu i wykonaj jedno polecenie z lokalnego [repozytorium ha-paneld](https://github.com/panel-assistant/android) dla każdego stanu:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Porównaj wyniki:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Każdy pomiar domyślnie trwa trzy minuty, z 30-sekundową rozgrzewką i odpytywaniem co 10 sekund. `--pair-with` używa niejawnego identyfikatora porównania z pierwszego wyniku, aby odrzucić inny fizyczny panel, inny skonfigurowany Home Assistant lub pulpit albo zmianę ustawienia wpływającą na pomiar bez zapisywania tych prywatnych wartości. Nie wykrywa ręcznej zmiany widoku w tym samym pulpicie, dlatego zachowaj ten sam widoczny widok i obciążenie.

Kolektor odrzuca pomiar, gdy oczekiwany tryb nie jest aktywny, zmienia się rewizja filtra lub generacja renderera, kompilacja lub konfiguracja podczas zbierania, następuje awaryjne wycofanie filtrowania albo pozostają mniej niż trzy próbki, mniej niż trzy próbki CPU całego panelu lub mniej niż trzy natywne próbki CPU renderera. Nadal zapisuje odrzucony wynik z dokładnymi powodami i nigdy nie nadpisuje istniejącego pliku.

JSON pomija URL i identyfikator panelu, URL Home Assistant i ścieżkę pulpitu, identyfikatory encji, nazwy procesów i skrót filtra. Panel oblicza niejawne odciski prywatnym losowym 256-bitowym kluczem instalacji, który go nie opuszcza; odciski są unikalne dla jednej pary porównania, więc nie można łączyć oddzielnych pomiarów ani zgadywać nazwy panelu. Panel, który nie może zapisać klucza, odmawia pomiaru. Liczba niefiltrowanych encji jest ostatnią zsynchronizowaną liczbą z katalogu, a nie odczytem na żywo z przeciążonego WebView; przy pustym katalogu jest niedostępna. Liczniki ruchu sieciowego i przeglądarki są normalizowane do rzeczywiście obserwowanych odstępów, więc pominięte odpytanie nie zniekształca porównania. Nieaktualne czasy i tempo ruchu przeglądarki są pomijane w podsumowaniach, podczas gdy CPU, pamięć, sieć i dane renderera z samej aplikacji nadal są zbierane.

## Podpisywanie

Nie musisz konfigurować podpisywania, aby kompilować i uruchamiać ha-paneld. Kopia repozytorium bez konfiguracji podpisywania używa zatwierdzonego `debug.keystore` do kompilacji debug. Jeśli `keystore.properties` zawiera konfigurację podpisywania, kompilacje debug używają zamiast tego wskazanego klucza. Oficjalne wydania są podpisywane prywatnym kluczem wydaniowym projektu, którego nigdy nie ma w repozytorium.

Android odmawia aktualizacji zainstalowanej aplikacji plikiem APK podpisanym innym kluczem. Przeniesienie panelu między oficjalnym wydaniem, własnym kluczem wydaniowym a kompilacją debug wymaga więc wcześniejszego odinstalowania. Zanim to zrobisz, utwórz pełną zaszyfrowaną kopię `.hpb` przez **Instalacja → Kopia zapasowa** i sprawdź, czy plik został zapisany; w przeciwnym razie odinstalowanie usuwa profile, wyuczony stan i historię. Panel Assistant czyni aplikację panelu administratorem urządzenia, a Android odmawia odinstalowania administratora urządzenia, więc najpierw odbierz tę rolę. Usuń aplikację opcją panelu **Usuń z tego panelu** w **Konfiguruj** w Home Assistant albo zwolnij administratora urządzenia i odinstaluj przez ADB:

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

Jeśli `pm uninstall` nadal odpowiada `DELETE_FAILED_DEVICE_POLICY_MANAGER`, odczekaj sekundę i uruchom je ponownie. Zainstaluj drugą kompilację, a następnie przywróć kopię przez **Instalacja → Przywróć**. Zobacz [Aktualizacje i odzyskiwanie](/pl/manage/updates-and-recovery/).

Aby konsekwentnie podpisywać własne kompilacje, skopiuj [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) do `keystore.properties` i uzupełnij plik; gdy jest obecny, `assembleRelease` podpisuje kluczem wydaniowym. Fork publikujący oznaczone tagami wydania przez GitHub Actions dostarcza ten sam klucz jako sekrety repozytorium.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Nigdy nie zatwierdzaj `keystore.properties` ani pliku `.jks` (oba są ignorowane przez git). Utwórz kopię zapasową magazynu kluczy i jego hasła: jeśli je utracisz, nigdy więcej nie opublikujesz aktualizacji instalowanej na własnych kompilacjach z zachowaniem aplikacji.
:::
