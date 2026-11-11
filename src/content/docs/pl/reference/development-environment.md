---
title: Środowisko programistyczne
description: Zestaw narzędzi kompilujący aplikację panelu, metody Docker i devcontainer oraz informacje o podpisywaniu potrzebne autorom forków.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
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
