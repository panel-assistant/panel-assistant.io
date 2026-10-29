---
title: Sonoff NSPanel Pro
description: Dane sprzętowe oryginalnych Sonoff NSPanel Pro 86P i 120P, paneli Rockchip PX30 z wbudowanym radiem Zigbee.
vendor: Sonoff
panelIndex: true
sidebar:
  label: Przegląd
  order: 0
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
---

Oryginalna linia NSPanel Pro obejmuje dwa fizycznie różne panele: **[86P](/pl/hardware/panels/sonoff/nspanel-pro-86p/)** i **[120P](/pl/hardware/panels/sonoff/nspanel-pro-120p/)**, nazwane od europejskich puszek ściennych 86 mm i 120 mm. Oba mają wbudowany **koordynator Zigbee 3.0**, nie mają NFC ani IR i mają najsłabszy CPU spośród w pełni obsługiwanych paneli. Współdzielą prawie wszystko opisane na tej stronie (uzyskiwanie roota, WebView, dioda, czujniki, bramka Zigbee); strona każdego wariantu zawiera tylko jego własną specyfikację i kilka odmiennych cech. Inżynierię wsteczną tej strony przeprowadzono głównie na działającym **86P** (Android 8.1, z rootem, toolbox `su`), z osobną weryfikacją działającego 120P tam, gdzie zaznaczono.

## Inne nazwy handlowe

Sonoff NSPanel Pro 86, NSPanel Pro 120, NSPanel Pro 86P, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, px30_evb, SN_3326S, SN-RKPX30-NSP-01, nspanel-pro, nspanel-pro-ver120. Nie myl z NSPanel Pro Gen2 ani płytami Tuya S6E i T6E, które są odrębnym sprzętem.

:::tip
Najważniejsze informacje: panel jest dostarczany jako **`userdebug` bez hasła adb**, więc `adb root` po prostu działa. **Dioda nie została scharakteryzowana** (nie znaleziono sterowalnego węzła RGB). Światło i zbliżenie są dostępne **bezpośrednio z aplikacji**. Wbudowanym **radiem Zigbee EFR32** zarządza się przez lokalnego brokera, bez ponownego wgrywania firmware. W niewydanej wersji 1.0.0-rc2 instalacja i aktualizacje aplikacji panelu uruchamiane z Home Assistant mogą zainstalować zweryfikowany WebView; zobacz [WebView: najpierw zaktualizuj](#webview-najpierw-zaktualizuj).
:::

|                  |                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC              | Rockchip **PX30 / rk3326**                                                                                                                 |
| CPU              | 4× **Cortex-A35** do **1.512 GHz** (408 MHz w bezczynności)                                                                                |
| GPU              | **Mali-G31** (potwierdzone na urządzeniu)                                                                                                  |
| Ekran            | **Kwadratowy 480×480** (1:1), około 4 cale, 160 dpi (mdpi, dobrze dopasowane do około 170 fizycznych ppi), 60 Hz, obszar **480×480 dp**    |
| RAM              | **2 GB** (około 1960 MB dostępne)                                                                                                          |
| Pamięć masowa    | eMMC; `/data` około 3.5 GB                                                                                                                 |
| Android          | 8.1 (API 27)                                                                                                                               |
| ABI              | arm64-v8a                                                                                                                                  |
| Łączność radiowa | **Zigbee 3.0** (koordynator Silicon Labs EFR32 na UART `ttyS5`, poniżej), Wi-Fi, Bluetooth. Brak NFC, IR, Ethernet i łączności komórkowej. |

:::note
Cortex-A35 jest rdzeniem energooszczędnym o znacznie niższej wydajności na takt niż A55 (TPA10) lub A72 (WF1589T). Z 2 GB RAM NSPanel Pro jest **podstawowym poziomem wydajności** wśród w pełni obsługiwanych paneli; zobacz [porównanie wydajności](/pl/hardware/#performance-comparison).
:::

:::tip
Zmieniasz firmware panelu bez przycisków? Najpierw przeczytaj [Kopia zapasowa i przywracanie firmware](/pl/hardware/guides/firmware-backup-and-restore/). NSPanel Pro używa [narzędzi seaky dla konkretnego modelu](/pl/hardware/guides/firmware-backup-and-restore/#per-panel-notes) zamiast `rkdeveloptool`.
:::

## Warianty: 86P i 120P

Powyższą tabelę specyfikacji i większość tej strony zebrano na **86P**; **120P** ma inną płytę. Strony [86P](/pl/hardware/panels/sonoff/nspanel-pro-86p/) i [120P](/pl/hardware/panels/sonoff/nspanel-pro-120p/) zawierają własną specyfikację i zdjęcie każdego wariantu.

|                           | NSPanel Pro **86P**                                                                                                                                         | NSPanel Pro **120P**                                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| SoC                       | Rockchip **PX30**                                                                                                                                           | Rockchip **RK3326-S** (ta sama rodzina PX30/RK3326; `ro.board.platform=rk3326`, drzewo urządzeń `rockchip,px30`)                    |
| Ekran                     | **480×480** kwadratowy, około 160 dpi, tylko pionowo                                                                                                        | **750×1334** pionowo, **240 dpi** (nadpisanie 250); dostępna orientacja pozioma; około 1 cm węższy i dłuższy niż 86P                |
| Identyfikatory kompilacji | oba zgłaszają `ro.product.model/device/name = px30_evb`, wspólną nazwę płyty Rockchip, _nie_ niezawodny sposób odróżnienia wariantów                        | jak 86P                                                                                                                             |
| `ro.product.version`      | postać `NSPanel86P_x.y.z` lub `s6_android_x.y.z`                                                                                                            | `NSPanel120P_x.y.z` (kanał OTA `nspanel-pro-ver120`, pełny ROM `SN_3326S_750X1334_…`)                                               |
| Postać OTA                | pełny ROM do **4.0.12**; późniejsze indeksowane wydania to różnice lub aktualizacje samej aplikacji ([strona firmware](/pl/hardware/firmware/nspanel-pro/)) | jak 86P                                                                                                                             |
| Firmware zbliżenia        | **4.0.12 przywróciło odczyty zakresowe**                                                                                                                    | pozostały **binarne** na 4.x (jądra różnią się między modelami; [Czujniki](#czujniki-światło-i-zbliżenie-bezpośrednio-z-aplikacji)) |

Oba współdzielą radio Zigbee EFR32, Android 8.1 (AOSP), arm64-v8a oraz opisane poniżej zasady roota i odzyskiwania. Zweryfikowano na działającym 120P (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, gęstość 240, `ro.board.platform=rk3326`.

:::note
Ta strona nie zaleca wersji firmware w opisie; rozstrzygający jest generowany [indeks firmware](/pl/hardware/firmware/). Procedura wgrywania jest zweryfikowana sprzętowo do **4.4.0**. Późniejsze indeksowane wydania sprawdzono tylko w CDN, nigdy nie wgrano ich na działający panel. Według stanu z 2026-08-14 [publiczny dziennik zmian Sonoff](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq) dokumentuje wydania do **4.6.0**; 4.6.2 i 4.8.0 znaleziono tylko przez odpytywanie CDN, a 4.7.0 omówiono tylko w [wątku opinii użytkowników eWeLink](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789), będącym dyskusją, nie ogłoszeniem wydania. **4.5.3** to różnica ROM-u na 120P, ale aktualizacja samej aplikacji na 86P, a **4.6.2** to aktualizacja samej aplikacji bez różnicy ROM-u na obu kanałach, więc aktualizacja nie zawsze jest pojedynczym krokiem. Brak w indeksie oznacza, że kompilacji nie znaleziono przez odpytywanie; CDN nie pozwala wyświetlić listy, więc brak nigdy nie dowodzi nieistnienia kompilacji.

**Zgłoszenia społeczności opisują pętle restartów na 4.5.1 i 4.5.2**, co około 10–60 minut na obu modelach. Dla 4.7.0 wątek opinii zawiera zgłoszenia problemów połączenia urządzeń podrzędnych po aktualizacji; część ustąpiła po restarcie, inne opisano jako trwające. Nie odtworzono ani nie zmierzono ich, więc traktuj je jako niezweryfikowane zgłoszenia użytkowników, a nie znaną regresję. Sprawdź każde nowsze wydanie na jednym panelu przed wdrożeniem na kilku; **4.0.12** pozostaje zachowawczym pełnym ROM-em do przypięcia.
:::

### Osobliwości firmware według wersji

Zachowania zmienne między wersjami firmware eWeLink, od najstarszej. `ro.product.version` jest **wewnętrznym** identyfikatorem (`NSPanel86P_x.y.z` lub `s6_android_x.y.z` na 86P, `NSPanel120P_x.y.z` na 120P), _nie_ numerem marketingowym lub OTA pokazywanym przez aplikację eWeLink (4.0.12, 4.5.x). Wykrywanie i logika zależna od wersji muszą odczytywać `ro.product.version`, a nie ciąg marketingowy.

| Firmware                           | Osobliwość lub zachowanie                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Co zrobić                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Starszy (przed 1.3.2)**          | Brak przełącznika adb w aplikacji; opcje programisty niedostępne z interfejsu                                                                                                                                                                                                                                                                                                                                                                                                 | Włącz adb przez wewnętrzny **port OTG** (otwórz obudowę); [Uzyskiwanie dostępu adb i root](#uzyskiwanie-dostępu-adb-i-root).                                                                                                                                                                                                                              |
| **1.3.2 i późniejsze**             | Włączanie adb przeniesiono do aplikacji eWeLink                                                                                                                                                                                                                                                                                                                                                                                                                               | eWeLink, _Device Settings_, dotknij **Device ID** osiem razy, tryb programisty, adb.                                                                                                                                                                                                                                                                      |
| **1.4 i późniejsze**               | Tryb programisty **usunięto** z interfejsu                                                                                                                                                                                                                                                                                                                                                                                                                                    | Włącz adb przez **pięć cykli zasilania** przy animacji rozruchowej Sonoff; [Uzyskiwanie dostępu adb i root](#uzyskiwanie-dostępu-adb-i-root).                                                                                                                                                                                                             |
| **3.5.1 (86P, zweryfikowane)**     | Fabryczny systemowy WebView to **Chromium 107.0.5304.105**, za stary dla nowoczesnego pulpitu Home Assistant; inne firmware mogą się różnić                                                                                                                                                                                                                                                                                                                                   | Użyj zarządzanej aktualizacji WebView w niewydanej wersji 1.0.0-rc2 albo ręcznej metody awaryjnej adb; [WebView: najpierw zaktualizuj](#webview-najpierw-zaktualizuj). Baner sprawności aplikacji także oznacza WebView starsze niż Chromium 110.                                                                                                         |
| **3.7.1 (120P, na urządzeniu)**    | Bazowa kompilacja odniesienia                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `wm size` 750×1334, gęstość 240, `ro.board.platform=rk3326`.                                                                                                                                                                                                                                                                                              |
| **4.0.0** (wdrażane od 2025-09-19) | Fabryczny firmware zawiera sklep F-Droid; znacznie szybszy interfejs                                                                                                                                                                                                                                                                                                                                                                                                          | Potwierdź, że wersje **APP** _i_ **OS** wynoszą co najmniej 4.0.0.                                                                                                                                                                                                                                                                                        |
| **4.0.12**                         | Odczyty zakresowe zbliżenia przywrócono na **86P**; **120P pozostaje binarny** (jądra różnią się między modelami)                                                                                                                                                                                                                                                                                                                                                             | Zachowawcza stabilna wersja do przypięcia. Surowa postać wejścia zależy od modelu i firmware, a prowadzona konfiguracja zbliżenia kalibruje i normalizuje obie; [Czujniki](#czujniki-światło-i-zbliżenie-bezpośrednio-z-aplikacji).                                                                                                                       |
| **4.5.1 i 4.5.2**                  | **Liczne zgłoszenia społeczności o pętlach restartów** (około 10–60 minut, oba modele); 4.5.2 jest warstwą samej aplikacji na 4.5.1                                                                                                                                                                                                                                                                                                                                           | Zastąpione późniejszymi wydaniami. Przypnij **4.0.12** dla maksymalnej stabilności albo najpierw przetestuj nowsze wydanie na jednym panelu.                                                                                                                                                                                                              |
| **4.5.3**                          | Automatyczne wykrywanie Matter i optymalizacje zarządzania ekranem; różnica ROM-u na 120P, tylko aplikacja na 86P                                                                                                                                                                                                                                                                                                                                                             | Brak dowodów pętli restartów właściwych 4.5.3; zastąpione późniejszymi wydaniami.                                                                                                                                                                                                                                                                         |
| **4.6.0** (czerwiec 2026)          | **Local Web Portal** (`nspanelpro.local`: konfiguracja LAN, eksport MQTT Discovery do Home Assistant, Matter Bridge); badanie CDN znalazło różnice z 4.0.12, 4.4.0 i 4.5.1                                                                                                                                                                                                                                                                                                    | Udokumentowane w publicznym dzienniku Sonoff. **4.6.2** jest indeksowane jako aktualizacja samej aplikacji bez różnicy ROM-u na obu kanałach; nie znaleziono 4.6.1.                                                                                                                                                                                       |
| **4.7.0** (lipiec 2026)            | Omawiane we wątku opinii eWeLink, ale **nieobecne w publicznym dzienniku Sonoff**; obejmuje Gen1 i Gen2; użytkownicy zgłaszają dodanie obsługi przekaźnika Basic gen-5 (BASIC-1GS); badanie CDN znalazło różnice wejściowe z 4.0.12, 4.4.0, 4.5.1 i 4.6.0 na obu modelach oraz z 4.5.3 tylko na 120P                                                                                                                                                                          | Zgłoszenia problemów połączenia urządzeń podrzędnych, część usunięta restartem, część trwająca; niezweryfikowane. Sprawdź na jednym panelu przed szerszym wdrożeniem.                                                                                                                                                                                     |
| **4.8.0** (sierpień 2026)          | **Nie znaleziono ogłoszenia wydania ani dziennika zmian**; znalezione przez odpytywanie CDN. Wpis pracownika eWeLink z 2026-07-16 w [wątku planów](https://forum.ewelink.cc/t/nspanel-pro-roadmap-and-co-created-future/206240) planował je na sierpień i potwierdzał jedną funkcję: opcję automatycznej aktualizacji panelu przez aplikację eWeLink. Badanie CDN znalazło różnice wejściowe z 4.0.12, 4.4.0, 4.5.1, 4.6.0 i 4.7.0 na obu modelach oraz z 4.5.3 tylko na 120P | Pozostała zawartość nieznana; nie znaleziono wątku opinii, więc brak doniesień o stabilności w którąkolwiek stronę. Traktuj jako nieocenione, nie jako wolne od problemów. **Jeśli opcja automatycznej aktualizacji jest domyślnie włączona, panel może przyjąć firmware bez nadzoru**, więc sprawdź to ustawienie przed poleganiem na przypiętej wersji. |

:::note
To osobliwości oryginalnych 86P i 120P. NSPanel Pro **Gen2** (RK3326-**S**, dwa przekaźniki, EFR32**MG24**) jest innym celem sprzętowym. Sonoff wydaje Gen1 i Gen2 w tej samej linii wersji firmware (4.7.0 obejmuje oba), więc nie wnioskuj o oddzielnej linii ani nie zakładaj, że każda uwaga o oryginalnym modelu przenosi się na Gen2. Profil oryginalnego NSPanel Pro dopasowuje każdy panel zgłaszający nazwę płyty PX30 lub RK3326, więc Gen2 zgłaszający jedną z nich zostanie dopasowany do czasu otrzymania własnego profilu; tego profilu nie testowano na Gen2 i nie udostępnia jego przekaźników.
:::

Pokrewne płyty rodziny Tuya, **S6E** i **T6E** (warianty z przekaźnikami; S6E to T6E z dwoma przekaźnikami), [**Smatek S9E**](/pl/hardware/panels/smatek/s9e/) i [**Tuya TPA10**](/pl/hardware/panels/tuya/tpa10/) (RK3566, Cortex-A55, Android 11), są odrębnymi celami i nie używają firmware NSPanel Pro.

:::danger
Wykrywanie nie może polegać na `ro.product.model`, ponieważ oba warianty zgłaszają `px30_evb`. Używaj `ro.product.version`, metryk ekranu lub `ro.board.platform`, aby odróżnić 86P od 120P. Zachowanie zbliżenia także różni się między modelami i firmware, więc prowadzona konfiguracja kalibruje bieżące odczyty i zapisuje wynik zamiast wybierać klasyfikator właściwy dla firmware.
:::

## Uzyskiwanie dostępu adb i root

W przeciwieństwie do TPA10 NSPanel Pro **nie ma hasła adb**. Jest dostarczany jako `userdebug` z kluczami testowymi (`ro.debuggable=1`), więc `adb root` działa i `/system` można ponownie zamontować. Trudne jest tylko _dotarcie_ do opcji programisty, ukrywanych inaczej przez różne wersje eWeLink. Opracowano na podstawie przewodników blakadder ([instalowanie spoza sklepu](https://blakadder.com/nspanel-pro-sideload/), [sekrety](https://blakadder.com/nspanel-pro-secrets/)).

**Pierwsza droga dostępu (86P i 120P).** Możliwość włączenia sieciowego ADB na porcie TCP 5555 bez komputera zależy od firmware; nie ustalono uniwersalnego przełącznika na panelu. Poniższa droga trybu programisty eWeLink jest udokumentowana dla wskazanego firmware, lecz nie ustala TCP5555 na każdej późniejszej kompilacji. Jeśli sieciowe ADB jest niedostępne, użyj udokumentowanej drogi USB dla swojego firmware. Polecenia root nie włączają pierwszego dostępu.

**1. Włącz adb.** Droga zależy od firmware:

- **Starszy firmware:** otwórz obudowę (usuń tylne śruby i odłącz złącze dotyku), aby odsłonić port OTG USB, i podłącz komputer; adb działa bezpośrednio przez USB.
- **Firmware 1.3.2 i późniejsze:** w **aplikacji eWeLink** otwórz _Device Settings_ panelu i dotknij **Device ID** osiem razy, aby włączyć tryb programisty przywracający adb.
- **Firmware 1.4 i późniejsze** (usunięty tryb programisty): wyłącz i włącz panel **pięć razy** podczas animacji rozruchowej Sonoff, aby wymusić rozruch odzyskiwania, i w tym oknie uruchom `adb install ultra-small-launcher.apk`. Po restarcie ustaw ten launcher jako domyślny, a następnie dotknij _Ustawienia, System, Informacje o tablecie, Numer kompilacji_ siedem razy, aby przywrócić opcje programisty i włączyć debugowanie USB.

**2. Przełącz na sieciowe adb**, aby obudowa mogła pozostać zamknięta:

```bash
adb tcpip 5555
adb shell ip -o a            # find the panel IP
adb connect <panel-ip>:5555
adb shell su 0 setprop persist.adb.tcp.port 5555   # survive reboot (service prop resets)
```

**3. Root.** Ponieważ to kompilacja `userdebug`, `adb root` natychmiast daje powłokę adbd root. Aplikacja panelu wywołuje `su` z piaskownicy, więc zainstaluj trwałe `su` w `/system`. **SuperSU `su` 2.76** w `/system/xbin/su` jest sprawdzoną kompilacją:

```bash
adb root
adb disable-verity          # only if remount is refused; this reboots the panel
adb remount                 # or: adb shell mount -o remount,rw /system
adb push su /system/xbin/su
adb shell chmod 06755 /system/xbin/su
```

:::danger
Wyłączaj aplikacje eWeLink (`com.eWeLinkNSPro.dev`, `com.eWeLinkControlPanel`) dopiero **po** uzyskaniu niezawodnego adb i `su` oraz innej drogi do ekranu głównego i wstecz; działania nawigacji aplikacji panelu to zapewniają. Stos **bramki Zigbee** eWeLink jest niezależny od tych aplikacji i nadal działa; zarządzaj nim [przełącznikiem routera Zigbee](#bramka-zigbee) zamiast go usuwać.
:::

<a id="webview-update-this-first"></a>

## WebView: najpierw zaktualizuj

Na 86P świeżo wgranym do firmware `3.5.1` (kompilacja `164637`) zweryfikowano `com.android.webview` **107.0.5304.105** (Chromium 107), za stary do renderowania aktualnego pulpitu Home Assistant. Inne firmware i modele mogą się różnić, więc sprawdź zainstalowanego dostawcę przed decyzją o aktualizacji. Zarchiwizowane pakiety różnic OTA nie zawierają APK WebView, więc tę wersję odczytano z działającego egzemplarza przez `dumpsys webviewupdate`. Ten egzemplarz używa Chromium **138** po aktualizacji adb. W niewydanej wersji 1.0.0-rc2 instalacja i aktualizacje aplikacji panelu uruchamiane z Home Assistant mogą zainstalować zweryfikowany zgodny WebView. Jeśli próba pozostaje niedokończona, wybierz **Spróbuj ponownie** w naprawie aktualizacji panelu, aby ją kontynuować. Ręczną metodą awaryjną jest aktualizacja adb; zobacz [Aktualizowanie systemowego WebView](/pl/hardware/guides/update-the-webview/#ręczna-metoda-awaryjna).

## LED

Na tym egzemplarzu nie znaleziono węzła RGB `/sys/class/leds` ani `/dev/ledjni`, więc na NSPanel Pro **nie scharakteryzowano diody RGB sterowanej przez aplikację lub sysfs** (porównaj węzeł `avsux` TPA10 i `/dev/ledjni` WF1589T). Jasność i podświetlenie ekranu używają standardowych ścieżek Androida.

## Czujniki: światło i zbliżenie bezpośrednio z aplikacji

W przeciwieństwie do TPA10, gdzie temperatura i wilgotność wymagają roota, NSPanel Pro udostępnia zespolony czujnik Sensortek przez standardowy `SensorManager`: `android.sensor.light`, `android.sensor.proximity` i `android.sensor.accelerometer`, wszystkie czytelne dla zwykłej aplikacji bez roota. Aplikacja panelu odczytuje tu światło i zbliżenie bezpośrednio. Nie zamontowano czujnika temperatury ani wilgotności.

:::note
**Odczyty zbliżenia zależą zarówno od firmware, jak i modelu.** Czujnik to Sensortek STK3A5x w wycięciu górnej płytki za szkłem osłonowym. Spoczynkowy poziom odniesienia znacznie różni się między egzemplarzami (jeden około 1000, inny około 4000); liczy się tylko zmiana _względna_, więc wysoki poziom bezczynności jest normalny, nie jest usterką. Do około firmware **3.3** zgłasza odczyt zakresowy co około 50 ms; od około **3.3 do 3.4** sterownik jądra przełączył go na binarne 0 lub 1. **4.0.12 przywróciło odczyty zakresowe tylko na 86P**; **120P pozostał binarny**. Prowadzona konfiguracja zbliżenia kalibruje oba sygnały i zapisuje wynik, a panel normalizuje użyteczny zakres między panelami, więc profile nie kodują progów właściwych dla firmware ani klasyfikatorów zakresowych i binarnych. (Źródła: zgłoszenia narzędzi seaky [142](https://github.com/seaky/nspanel_pro_tools_apk/issues/142), [144](https://github.com/seaky/nspanel_pro_tools_apk/issues/144), [171](https://github.com/seaky/nspanel_pro_tools_apk/issues/171) i [262](https://github.com/seaky/nspanel_pro_tools_apk/issues/262).)
:::

### Powiązane urządzenia I²C

| Adres I²C           | Sterownik lub nazwa         | Funkcja                                                         |
| ------------------- | --------------------------- | --------------------------------------------------------------- |
| `0-0020`            | `rk809`                     | PMIC                                                            |
| `1-001a` / `1-005a` | `CST226` / `CST226SE`       | Pojemnościowy kontroler dotyku Hynitron                         |
| `2-003c`            | `tp`                        | panel dotykowy                                                  |
| `2-0046`            | `ls_stk3a5x` i `ps_stk3a5x` | Sensortek **STK3A5x**, zespolone światło otoczenia i zbliżenie  |
| `2-0047`            | `ls_stk3x3x` i `ps_stk3x3x` | Sensortek **STK3x3x**, światło i zbliżenie (alternatywny układ) |

## Bramka Zigbee

NSPanel Pro ma wbudowane **radio Zigbee 3.0 Silicon Labs EFR32** na UART `/dev/ttyS5`, obsługiwane przez stos hosta producenta (`/vendor/bin/siliconlabs_host/zgateway`) przez lokalnego brokera MQTT. Aplikacje eWeLink używają tego samego stosu, dlatego panel jest dostarczany jako hub Zigbee eWeLink.

Aplikacja panelu zarządza nim bezpośrednio. `switch.<panel>_zigbee_router` zamienia panel w **router** Zigbee rozszerzający istniejącą sieć mesh (uruchamia bramkę i zapewnia rolę Repeater), a następnie wyłącza go (zatrzymując bramkę i zwalniając radio). Działa przez lokalnego brokera, bez poświadczeń i bez bezpośredniej obsługi `ttyS5`. Panel pojawia się wtedy jako zwykły router w koordynatorze ZHA lub Zigbee2MQTT.

:::note
Zmiana roli **nie jest ponownym wgraniem firmware**: nie ma kroku `.gbl` ani bootloadera, ustawiany jest tylko typ węzła EZSP. Prace nad firmware na poziomie partycji opisuje [Kopia zapasowa i przywracanie firmware](/pl/hardware/guides/firmware-backup-and-restore/).
:::

:::note
**Nie udokumentowano ani nie scharakteryzowano Thread Border Router.** Zainstalowany stos producenta używa EFR32 jako Zigbee NCP. Układ EFR32MG21 obsługuje wiele protokołów, lecz nie dowodzi to obecności firmware Thread ani routera brzegowego na panelu; Sonoff dokumentuje zamiast tego Matter Bridge.

**Firmware 4.x przebudowało stos Zigbee.** Badanie społeczności znalazło fork Zigbee2MQTT, zmienione hasło MQTT na urządzeniu i inną sekwencję startową. [Sonoff dokumentuje przełączanie koordynatora i routera](https://sonoff.tech/blogs/news/nspanel-pro-v4-3-0-central-heating-redefining-whole-home-temperature-automation) w aktualnym firmware, lecz droga sterowania lokalnym brokerem w aplikacji panelu została zbudowana dla 3.x i starszych i **może wymagać dostosowania do 4.x**. (Źródła społeczności: zgłoszenia narzędzi seaky [241](https://github.com/seaky/nspanel_pro_tools_apk/issues/241), [244](https://github.com/seaky/nspanel_pro_tools_apk/issues/244) i [255](https://github.com/seaky/nspanel_pro_tools_apk/issues/255) oraz [roottool, zgłoszenie 3](https://github.com/seaky/nspanel_pro_roottool_apk/issues/3).)
:::

:::caution
**Zgłaszający potwierdził usterkę starego watchdoga Zigbee producenta na NSPanel Pro 120 z fabrycznym firmware 3.8.0.** Firmware zawierające rekurencyjne przypisanie `LD_LIBRARY_PATH` opisane w [zgłoszeniu](https://github.com/panel-assistant/android/issues/34) może z czasem powodować niepowodzenie każdego zewnętrznego polecenia uruchamianego przez watchdog z `E2BIG`, zużywać jeden rdzeń CPU i przestać odzyskiwać martwy `zgateway`. Restart usuwa problem tylko tymczasowo. [Dostrajanie wydajności](/pl/manage/performance/) opisuje dowody i warunki bezpiecznej naprawy. Obejście zgłaszającego nie zostało niezależnie zweryfikowane. Badanie społeczności 4.0.12 i 4.6.0 nie znalazło podatnego przypisania.
:::

### Wymagania: firmware 2.2.0 lub nowsze

Stos hosta to **własna** bramka eWeLink i Sonoff producenta, wersjonowana zgodnie z firmware panelu (np. `sonoff-v3.5.4`). **Tryb routera** Zigbee pojawił się w **firmware NSPanel Pro 2.2.0** (2023; aplikacja eWeLink, _Device Settings, Pilot Features, Zigbee Mode_), a obsługa repeatera lokalnego stosu hosta w pakiecie bramki 1.1.9. W praktyce:

- **Bramka obecna** (firmware 2.2.0 lub nowsze albo zainstalowana dodatkowo): aplikacja panelu wykrywa ją i publikuje `switch.<panel>_zigbee_router`. Włącz go, a panel dołączy do koordynatora jako router.
- **Brak bramki** (bardzo stare firmware, nigdy nieskonfigurowane): przełącznik **nie pojawia się**, ponieważ zależy od obecności skryptu uruchamiania bramki. Zaktualizuj firmware do 2.2.0 lub nowszego.

Aplikacja panelu **steruje** bramką; nie dostarcza jej ani nie instaluje, ponieważ to binarka eWeLink. Firmware 4.x dodaje most Matter i może eksportować urządzenia Zigbee do Home Assistant przez MQTT Discovery, jako alternatywy dla roli routera.

### Sprawność bramki i automatyczne ograniczanie awarii

Na panelu obsługującym Zigbee `sensor.<panel>_zigbee_gateway_health` raportuje stos producenta niezależnie od przełącznika routera, więc nieskonfigurowana fabryczna bramka jest nadal widoczna bez udzielania aplikacji panelu zgody na jej zatrzymanie.

Gdy przełącznik routera został jawnie włączony, aplikacja panelu daje 15 minut na start i parowanie, a następnie co minutę sprawdza dwa objawy niekontrolowanego działania: jawnie nieprawidłową lub niedołączoną sieć wraz z użyciem ponad 50% jednego rdzenia CPU przez pięć kolejnych próbek albo co najmniej trzy zmiany identyfikatora procesu bramki w dziesięć minut. Dołączony router ze stale wysokim CPU powoduje tylko ostrzeżenie i nadal działa. Nieznane układy 4.x lub brak dowodów dołączenia właściwych dla firmware bezpiecznie dają `unknown`.

Włączenie przełącznika routera Zigbee jawnie żąda trybu Repeater nawet przy działającej bramce producenta, więc włączenie go, gdy koordynator ZHA lub Zigbee2MQTT zezwala na dołączanie, jest nową próbą dołączenia bez uruchamiania drugiego nadzorcy bramki.

Karta Konfiguracja pokazuje działanie **Poproś o dołączenie** bezpośrednio pod przełącznikiem routera Zigbee; przełącznik pozostaje jedynym sterowaniem włączaniem i wyłączaniem. Włącz zezwolenie na dołączanie w ZHA lub Zigbee2MQTT, a następnie poproś o dołączenie i potwierdź, że jest otwarte. Działanie ponawia tryb Repeater, rozpoczyna nowy 15-minutowy okres ochronny i odpytuje stan sprawności; nie restartuje panelu. Przycisk jest niedostępny przy wyłączonym routerze, już dołączonym routerze lub w okresie oczekiwania po niedawnym żądaniu.

Po okresie ochronnym włączona bramka, która nadal nie dołączyła, powoduje trwałe ostrzeżenie na pulpicie i karcie Instalacja, z odnośnikiem do tego działania Konfiguracji. Nie pozostawiaj jej w tym stanie, ponieważ kolejne próby dołączenia mogą zużywać dużo CPU. Dołącz panel jako router albo wyłącz przełącznik routera Zigbee.

Jeśli skonfigurowana starsza bramka spełnia regułę niekontrolowanego działania, aplikacja panelu trwale wyłącza przełącznik routera i podejmuje jedną ograniczoną próbę opanowania awarii. Natywne ograniczanie stosu producenta może objąć tylko strażnika Sonoff, `zgateway` i pasującego lokalnego brokera. Jeśli procesu nie można zatrzymać, w miarę możliwości usuwa się mechanizm odradzania, a pozostała praca bramki jest obniżana do nice 19 i cpuset tła Androida. Późniejsze włączenie routera rozpoczyna jeden nowy okres ochronny i próbę.

Atrybuty sprawności obejmują wersje firmware i produktu, układ bramki i wersję pakietu, stan dołączenia i roli, zaokrąglone CPU bramki i strażnika, liczbę ostatnich restartów oraz wynik ograniczania awarii. Nigdy nie obejmują klucza sieci Zigbee, surowych poświadczeń lokalnego brokera, adresu MAC radia ani surowego `netinfo` bramki.

### Migracja z NSPanelTools

Jeśli NSPanelTools zainstalował bramkę Sonoff na starszym panelu, stos hosta w `/vendor` przetrwa usunięcie NSPanelTools. Usuń NSPanelTools przed włączeniem sterowania ekranem i czujnikami Panel Assistant, aby uniknąć podwójnych działań. Panel Assistant może sterować istniejącą bramką; gdy przełącznik routera Zigbee pozostaje włączony, uruchamia ją przy starcie nawet po usunięciu poprzedniego haka startowego.

### Wnętrze stosu hosta EZSP

Na starszym natywnym stosie producenta (3.x i wcześniejsze) radio używa **firmware EZSP NCP** (EFR32MG21, EZSP v8). `zgateway` jest binarką _hosta_ EZSP w `/vendor/bin/siliconlabs_host/`, utrzymywaną przez własnego nadzorcę `guard_process.sh` (pętla 5 sekund, uruchamiana przy starcie) i sterowaną przez **lokalnego brokera mosquitto** na `127.0.0.1:1883`. Broker jest anonimowy: wiersz `password_file` w `mosquitto.conf` jest zakomentowany. Stos 4.x różni się, jak opisano powyżej.

- Stan roli: `zigbee/system/network-role/information` zwraca `{"role":"Repeater"|"Coordinator"}`
- Zmiana roli: opublikuj `{"role":"Repeater"}` w `zigbee/system/network-role/switch`

„Repeater” to tryb routera rozszerzający istniejącą sieć mesh; rola pozostaje w nieulotnej pamięci NCP. `zgateway` producenta przetrwa usunięcie _aplikacji_ eWeLink, ponieważ znajduje się w `/vendor`, a nie APK.

Pełny samodzielny koordynator Zigbee2MQTT lub ZHA _na panelu_ opisuje [seaky/nspanel_pro_zigbee](https://github.com/seaky/nspanel_pro_zigbee), zastępujący stos hosta. Jest bardziej obciążający i nie jest tym, co robi aplikacja panelu.

## Podsumowanie modelu dostępu

- **Światło, zbliżenie, akcelerometr:** bezpośrednio z aplikacji (`SensorManager`).
- **Jasność ekranu, uśpienie, nawigacja, synteza mowy:** standardowe ścieżki Androida (`su` dla rzeczywistego wyłączenia podświetlenia).
- **LED:** brak scharakteryzowanej.
- **Zigbee:** radio EFR32 zarządzane przez lokalnego brokera bramki na urządzeniu (`switch.<panel>_zigbee_router`).
- **Łączność radiowa:** Zigbee 3.0, Wi-Fi i Bluetooth.

## Oczekiwania dotyczące wydajności

NSPanel Pro ma **ograniczony CPU i RAM** dla rozbudowanych pulpitów:

- W bezczynności pracuje przy 408 MHz, z około 500 MB używanej pamięci RAM; ciężki pulpit mocno obciąża oba zasoby.
- **2 GB RAM jest decydującym ograniczeniem.** WebView pulpitu, Android i aplikacje tła konkurują o pamięć, a duże pulpity z wieloma kartami, dużymi obrazami, długimi wykresami historii lub kosztownymi kartami niestandardowymi powodują przeładowania WebView i zacinanie.
- Rdzenie A35 sprawiają, że przejścia stron i animacje są wyraźnie wolniejsze niż na panelach A55 lub A72.

Z wbudowanym rendererem zacznij od automatycznego filtra encji pulpitu opisanego w [Dostrajaniu wydajności](/pl/manage/performance/), aby panel nie przetwarzał stanów, których pulpit nigdy nie pokazuje. Następnie użyj kart wydajności na karcie Pulpit, aby znaleźć pozostałe ciężkie widoki, presję pamięci lub ograniczenia termiczne przed uproszczeniem pulpitu.
