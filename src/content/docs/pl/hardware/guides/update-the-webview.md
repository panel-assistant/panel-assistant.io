---
title: Aktualizacja systemowego WebView
description: Dlaczego większość paneli ściennych potrzebuje nowszego Android System WebView do wyświetlenia pulpitu Home Assistant i jak zainstalować go na każdym panelu.
sidebar:
  label: Zaktualizuj WebView
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Przeczytaj to najpierw: przestarzały WebView jest najczęstszą przyczyną niepowodzenia pierwszego uruchomienia tych paneli.

Wbudowany renderer aplikacji panelu korzysta z **systemowego WebView** Androida, a większość tych paneli ma fabrycznie wersję zdecydowanie za starą dla aktualnego frontendu Home Assistant. Może to powodować pusty lub uszkodzony pulpit, brakujące karty albo komunikat o nieobsługiwanej przeglądarce. Panele **bez** Google Play (Sonoff NSPanel Pro, Tuya TPA10) potrzebują innej ścieżki aktualizacji. **Electron WF1589T i ZHICAI SMT1019 mają Google Play**, więc zaktualizuj _Android System WebView_ ze Sklepu Play lub użyj kanału deweloperskiego Play WebView.

Instalacja i aktualizacje aplikacji panelu rozpoczęte z Home Assistant mogą też zainstalować zweryfikowany, zgodny WebView. Wymaga to obsługiwanego profilu, dostawcy niezarządzanego przez Play z tym samym pakietem i podpisującym co wybrana kompilacja oraz dozwolonej ścieżki instalacji. Jeśli aktualizacja pozostaje niedokończona, wybierz **Spróbuj ponownie** w Naprawie aktualizacji panelu. Sprawdza istniejącą pracę przed żądaniem kolejnej próby; nie ma zaplanowanych ponowień. Stary silnik nie blokuje konfiguracji i parowania, ale pulpit nadal może się nie wyświetlać. Fabryczny dostawca TPA10 z blokadą podpisu nadal wymaga udokumentowanej zamiany z root przed użyciem zamiennika z innym podpisem.

## Ręczna metoda awaryjna

Użyj poniższej istniejącej metody dla panelu, gdy zarządzana ścieżka jest niedostępna. Bezpośrednia instalacja standardowego Android System WebView przez adb (pakiet **`com.android.webview`**) wymaga kompilacji zgodnej z wersją Androida i ABI panelu, bez zewnętrznego sklepu aplikacji.

:::tip
Pakiet musi nazywać się `com.android.webview`, aby system wybrał go automatycznie. Kompilacje **SystemWebView** Cromite i LineageOS używają `com.android.webview` i rejestrują się jako dostawca, ale zwykła **przeglądarka** Cromite ma inny pakiet i tego nie robi. Użyj SystemWebView, nie APK przeglądarki.
:::

## Wersje fabryczne i działające zamienniki

„Fabryczna” oznacza wersję firmware producenta, zweryfikowaną analizą firmware lub na działającym urządzeniu. „Zamiennik” to wersja, której działanie potwierdzono po instalacji. Kompilacje dopuszczające redystrybucję są kopiowane do zasobów wydania ha-paneld; zainstaluj je przez `adb install -r <file>`.

| Panel                                    | ABI           | Wersja fabryczna (firmware producenta)                                                                                                                                  | Zamiennik                                                                                                                                                                                                                                                                                                           | Pobieranie                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NSPanel Pro 86P (PX30)                   | arm64-v8a     | Chromium **107.0.5304.105**, zweryfikowany na firmware 3.5.1; przed aktualizacją sprawdź pozostałe firmware i modele                                                    | **LineageOS** 138.0.7204.63, ostatnia kompilacja dla Androida **8.1**                                                                                                                                                                                                                                               | [zasób wydania](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-138.0.7204.63.apk), [APKMirror](https://www.apkmirror.com/apk/lineageos/android-system-webview-2/android-system-webview-138-0-7204-63-2-release/android-system-webview-138-0-7204-63-8-android-apk-download) |
| TPA10 (rk3566)                           | armeabi-v7a   | **Chrome 83** (`com.android.webview`), za stary dla aktualnego frontendu Home Assistant                                                                                 | **LineageOS** SystemWebView 150.0.7871.63. Standardowy Chromium, więc strumienie kamer odtwarzają się automatycznie (Cromite 147 blokuje autoodtwarzanie i pozostaje alternatywą). **Blokada podpisu: wymaga [zamiany z root](/pl/hardware/panels/tuya/tpa10/#webview-update-this-first), nie zwykłej instalacji.** | [zasób arm](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk)                                                                                                                                                                                           |
| WF1589T (rk3576)                         | arm64-v8a     | Google Play WebView, aktualizowany automatycznie                                                                                                                        | Aktualizuj przez Sklep Play; ręczna instalacja niepotrzebna                                                                                                                                                                                                                                                         | brak                                                                                                                                                                                                                                                                                                                       |
| S9E (rk3566)                             | **arm64-v8a** | **Zależy od firmware, więc sprawdź przed zamianą.** Chromium **83.0.4103.120** na kompilacji 2024-07 (za stary dla aktualnego frontendu), **131.0.6778.200** na 2025-12 | Potrzebny tylko na starszym firmware: **LineageOS** 150.0.7871.63 (**arm64**). Wstępnie proponowany i niezweryfikowany sprzętowo; może mieć blokadę podpisu jak TPA10. Na firmware 2025-12 fabryczny WebView jest już aktualny                                                                                      | [zasób arm64](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm64.apk)                                                                                                                                                                                       |
| SMT1019 (rk3576)                         | arm64-v8a     | `com.google.android.webview` **124.0.6367.179**, Android 14 **z** Google Play                                                                                           | **Zaktualizuj _Android System WebView_ ze Sklepu Play**; ręczna instalacja niepotrzebna. Nie instaluj ręcznie `com.android.webview`: lista dostawców pochodzi z nakładki produktu, więc taki dostawca może nie zostać wybrany                                                                                       | brak                                                                                                                                                                                                                                                                                                                       |
| ZX-SMT156 (RK3566_T)                     | arm64-v8a     | Google WebView **149.0.7827.164** (firmware zgłaszającego)                                                                                                              | Już aktualny; zamiana niepotrzebna                                                                                                                                                                                                                                                                                  | brak                                                                                                                                                                                                                                                                                                                       |
| Shelly Wall Display, oryginalny (MT6580) | armeabi-v7a   | **nieznana** (bazowy ROM Android 7)                                                                                                                                     | `com.google.android.webview` **119.0.6045.194** z [oficjalnego ZIP Shelly](https://repo.shelly.cloud/firmware/SAWD-0A1XX10EU1/stable/SAWD-0A1XX10EU1-WebViewUpdate.zip); zobacz [stronę rodziny Shelly Wall Display](/pl/hardware/panels/shelly/#webview)                                                           | brak                                                                                                                                                                                                                                                                                                                       |
| Shelly Wall Display X2 (SC7731E)         | armeabi-v7a   | **nieznana** (bazowy ROM Android 8.1)                                                                                                                                   | Nieustalony; sprawdź `adb shell dumpsys webviewupdate`                                                                                                                                                                                                                                                              | brak                                                                                                                                                                                                                                                                                                                       |
| Shelly Wall Display X2i (RK3326-S)       | arm64-v8a     | Chromium **131.0.6778.200** na fabrycznym firmware 2.5.4                                                                                                                | Już aktualny; zamiana niepotrzebna                                                                                                                                                                                                                                                                                  | brak                                                                                                                                                                                                                                                                                                                       |
| Shelly Wall Display X1i, XL (arm64)      | arm64-v8a     | **nieznana** (bazowy ROM Android 11; brak w OTA Shelly)                                                                                                                 | Nieustalony; sprawdź `adb shell dumpsys webviewupdate`                                                                                                                                                                                                                                                              | brak                                                                                                                                                                                                                                                                                                                       |

Wszystkie kopie znajdują się w [wydaniu Panel WebView mirror](https://github.com/panel-assistant/android/releases/tag/webview-mirror), społecznościowej liście działających wersji. Jeśli masz wersję działającą na innym panelu lub firmware, mile widziany jest wkład.

:::note

- **Wybierz najnowszy WebView obsługiwany przez Androida panelu.** Android 8.1 NSPanel Pro kończy obsługę na Chromium 138, ostatnim dla Androida 8 i 9; nowsze kompilacje się nie zainstalują. Android 10 i nowszy (TPA10 ma 11) uruchamia aktualny LineageOS WebView 150.
- **Bezpośrednie odnośniki APKMirror są krótkotrwałymi, podpisanymi URL wygasającymi w ciągu godziny.** Użyj strony lub trwałych zasobów wydania powyżej. Kopia istnieje, ponieważ panele nie mają Play i są dostarczane z firmware sprzed wielu lat, a znalezienie działającej kompilacji może inaczej zająć dni.

:::

## Ręczna instalacja i weryfikacja

1. Pobierz aktualny APK **Android System WebView** o nazwie pakietu **`com.android.webview`**. **LineageOS** System WebView jest zalecany dla różnych Androidów: 138 jest ostatni dla 8.1, a 150 obejmuje Androida 10 i nowsze; oba są w kopii wydania. To standardowy Chromium, bez blokady autoodtwarzania Cromite zatrzymującej strumienie kamer Home Assistant. Pakiet `com.android.webview` zapewnia automatyczny wybór dostawcy bez edycji listy dozwolonych i dodatkowej aplikacji, a kompilację można swobodnie redystrybuować. Dopasuj ABI panelu.

   :::caution
   Poniższa zwykła instalacja działa na panelach, których ROM pomija kontrolę podpisu WebView, np. kompilacji `userdebug` NSPanel Pro. **Panele z blokadą podpisu, w tym TPA10 i prawdopodobnie inne kompilacje producenta `user`, odrzucają ją** komunikatem `signatures do not match`. Wymagają jednorazowej zamiany z root, która zastępuje systemowy plik WebView i usuwa jego wpis `packages.xml`; zobacz [procedurę TPA10](/pl/hardware/panels/tuya/tpa10/#webview-update-this-first).
   :::

2. Zainstaluj ręcznie. Root nie jest potrzebny:

   ```sh
   adb install -r android-system-webview.apk
   ```

   Instaluje to do `/data/app` i zastępuje przestarzały fabryczny WebView.

3. Sprawdź aktywnego dostawcę i wersję:

   ```sh
   adb shell dumpsys webviewupdate | grep "Current WebView package"
   ```

Jeśli panel wymienia więcej niż jednego dostawcę, wybierz nowego jawnie:

```sh
adb shell cmd webviewupdate set-webview-implementation com.android.webview
```

lub użyj opcji programisty, _Implementacja WebView_.
