---
title: Tuya TPA10
description: Dane sprzętowe Tuya TPA10, 10,1-calowego panelu Rockchip rk3566 z diodą RGB, pięcioma przyciskami, kamerą i czujnikami temperatury, wilgotności oraz zbliżenia.
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Pełne
root: su obecne; pomocnik dla LED, klimatu i 5. przycisku
webview: Chrome 83; zamiana na LineageOS 150 z rootem
released: '2023-08 (szac.)'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10 od przodu z bocznym paskiem przycisków
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Tuya TPA10 od przodu na wprost, z widocznym bocznym paskiem przycisków i krawędzią ramki
photoCredit: 'Zdjęcie: Tuya'
sold_as:
  - brand: Tuya
    name: 'TPA10-M2'
    note: 'Nazwa w katalogu Tuya'
  - brand: Tuya
    name: 'Control Panel MAX'
    note: 'Nazwa w ofercie detalicznej i rejestrze FCC'
evidence: [bench, mostly-open, firmware, documented, owners]
sidebar:
  label: TPA10
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Nie znaleziono informacji producenta o wydaniach firmware tego panelu. Dane o firmware na tej stronie pochodzą z obserwacji zbadanego urządzenia.

Przestronny panel rk3566 **10,1 cala 1920×1200** z pojedynczą przednią diodą RGB, monochromatycznym podświetleniem przycisków, bogatym zestawem czujników (zbliżenie na podstawie czasu przelotu, temperatura i wilgotność, światło otoczenia), kamerą i pięcioma fizycznymi przyciskami. Nie ma Zigbee, NFC ani IR. Inżynierię wsteczną przeprowadzono na działającym egzemplarzu (Android 11, z rootem, obecne `su`).

## Inne nazwy handlowe

Tuya TPA10, TPA10, TPA10-M2 (M2A, M2E, M2U, M2X), TPA10 Control Panel MAX, Control Panel MAX, Panel MAX, panel Tuya rk3566, SmartOS Xinch (pakiety producenta `com.smartos.xinch.setting`, `com.smartos.xinch.hardware`, `com.smartos.xinch.platform.ethernet`), `com.tuya.devicetest`.

:::tip
Najważniejsze informacje: adb jest **chronione hasłem**, więc użyj tylnej furtki aplikacji diagnostycznej USB. Dioda i czujniki wymagające roota potrzebują **demona pomocniczego root `hapaneld-helper`**. Zapis `custom_animation` przedniej diody może **zrestartować panel** (ostrzeżenie poniżej). Najpierw zaktualizuj **WebView**; zobacz [WebView: najpierw zaktualizuj](#webview-najpierw-zaktualizuj).
:::

|                  |                                                                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC              | Rockchip **rk3566**                                                                                                                                                                                 |
| Ekran            | **1920×1200** (16:10 poziomo), około 10,1 cala, **około 226 fizycznych ppi**, 56 Hz. Fabryczna bazowa gęstość logiczna Androida **240 dpi** (często nadpisywana dla rozmiaru pulpitu; zalecane 212) |
| Android          | 11 (API 30)                                                                                                                                                                                         |
| ABI              | armeabi-v7a (32-bitowa przestrzeń użytkownika)                                                                                                                                                      |
| Łączność radiowa | Wi-Fi, Bluetooth i BLE oraz funkcja producenta `com.smartos.xinch.platform.ethernet` (przewodowo, PoE). **Brak Zigbee, NFC, IR i łączności komórkowej.**                                            |
| Root             | `su` dostępne; dioda i czujniki sysfs mają `system:system`, więc **wymagany jest demon pomocniczy root** (poniżej).                                                                                 |
| Premiera         | Około sierpnia 2023 (szac.); FCC ID 2A789-TPA10, pod nazwą „Control Panel MAX”, zatwierdzono około 22 sierpnia 2023 ([wpis zatwierdzenia FCC ID 2A789-TPA10](https://fccid.io/2A789-TPA10))         |

:::tip
Zmieniasz firmware panelu bez przycisków? Najpierw przeczytaj [Kopia zapasowa i przywracanie firmware](/pl/hardware/guides/firmware-backup-and-restore/). TPA10 (rk3566, Android 11, eMMC 7.28 GB `mmcblk2`) ma zweryfikowaną programową ścieżkę wejścia w Loader przez `adb reboot loader` i `rkdeveloptool`. Zagłębiony [przycisk w otworze](#przyciski) nie jest wejściem Linuksa, a jego zachowanie resetu fabrycznego lub Maskrom nie zostało bezpiecznie potwierdzone, więc nie polegaj na nim jako drodze odzyskiwania.
:::

## Uzyskiwanie dostępu adb i root

TPA10 jest dostarczany z adb **chronionym hasłem** i wyłączonym adb sieciowym. Niezawodna droga pierwszego dostępu to tylna furtka aplikacji diagnostycznej USB, bez obliczania hasła. `su` jest już obecne, więc po uzyskaniu adb masz root. Opracowano na podstawie [seaky/nspanel_pro_tools_apk, zgłoszenie 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123).

**Pierwsza droga dostępu.** Nie ma zweryfikowanego sposobu włączenia sieciowego ADB na porcie TCP 5555 bez komputera. Najpierw użyj USB według poniższej procedury aplikacji diagnostycznej; późniejsze polecenia root utrwalają sieciowe ADB dopiero po tym pierwszym połączeniu.

**1. Włącz opcje programisty.** Ustawienia, _Informacje_, dotknij numeru kompilacji lub wersji siedem razy.

**2. Pierwszy dostęp przez tylną furtkę aplikacji diagnostycznej USB (zalecane).** Opcje programisty udostępniają inżynierską **aplikację diagnostyczną** Tuya z interfejsem wyłącznie po chińsku. Gdy jest otwarta, adb przez port **USB** jest dozwolone _bez_ hasła, a sesja ma już root. Podłącz USB i uruchom:

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

Dostęp root adb TPA10 jest pewniejszy przez USB niż przez sieć.

**3. Utrwal adb (root, bez hasła, niezawodna droga).** Z aplikacją diagnostyczną na pierwszym planie masz sesję adb z rootem (`su` jest obecne, a `adb root` także działa, ponieważ to kompilacja `userdebug`). Użyj jej do utrwalenia adb, aby aplikacja testowa ani hasło nie były już potrzebne. Przetrwa to zamknięcie aplikacji diagnostycznej **i** pełny restart, co zweryfikowano na działającym egzemplarzu. Prześlij i uruchom jako root:

```bash
# persist-adb.sh — run via the diagnostics-app backdoor:
#   adb push persist-adb.sh /data/local/tmp/ && adb shell su 0 sh /data/local/tmp/persist-adb.sh
settings put global adb_enabled 1                   # USB debugging, persisted in /data
settings put global development_settings_enabled 1  # keep Developer options visible
setprop persist.adb.tcp.port 5555                   # network adb on :5555 — persist.* survives reboot

# Pre-authorise each controlling machine so NO on-screen "Allow USB debugging" is needed after reboot.
# Append the contents of every workstation's ~/.android/adbkey.pub (one key per line):
mkdir -p /data/misc/adb
cat >> /data/misc/adb/adb_keys <<'KEYS'
PASTE-EACH-adbkey.pub-LINE-HERE
KEYS
chmod 640 /data/misc/adb/adb_keys
chown system:shell /data/misc/adb/adb_keys 2>/dev/null
restorecon /data/misc/adb/adb_keys 2>/dev/null

setprop ctl.restart adbd                            # apply now (and it auto-starts every boot)
echo "adb persisted: adb_enabled=$(settings get global adb_enabled) tcp=$(getprop persist.adb.tcp.port)"
```

Panel musi być połączony z Wi-Fi, aby użyć drogi sieciowej. Od tej pory `adb connect <panel-ip>:5555` działa z każdego wcześniej zatwierdzonego komputera, po restartach i przy zamkniętych aplikacjach producenta. Wyczyszczenie `/data` lub reset fabryczny usuwa `adb_keys` i `adb_enabled`, więc później uruchom skrypt ponownie.

:::caution
**Hasło „Enable ADB” w opcjach programisty nie jest użyteczną drogą, więc nie próbuj go obliczać.** Przepis społeczności ze [zgłoszenia 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) nie daje się odtworzyć. Dekompilacja `checkDevPassword` w `com.smartos.xinch.setting` potwierdza jego _postać_: `base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))`, a następnie `takeLast(6)`, bez rozróżniania wielkości liter (lub `takeLast(ro.tuya.uuid,6)`, gdy `deviceId` jest puste). Nie udało się jednak dopasować używanego `deviceId` do żadnego czytelnego identyfikatora: `ro.serialno`, `android_id` i `ro.tuya.key` zostały odrzucone na działającym egzemplarzu. Rejestrator aplikacji **nie** jest logcat, więc oczekiwanej wartości nie da się też odczytać na urządzeniu. Przykład w zgłoszeniu ma również literówkę (`11a` plus `xia` zapisane jako `11xia`; powinno być `11axia`). Użyj powyższej metody root, która czyni hasło nieistotnym.
:::

:::danger
Wyłączaj pakiety producenta `com.smartos.xinch.*` dopiero jako **ostatni krok**, po potwierdzeniu niezawodności adb _i_ posiadania zamiennika przycisków sprzętowych. Wyłączenie aplikacji sprzętu lub ustawień przed uzyskaniem niezawodnego adb może odciąć dostęp. Zdalne działania nawigacji aplikacji panelu (Wstecz, Ekran główny) oraz encje podświetlenia przycisków i diody zastępują funkcje aplikacji producenta.
:::

:::note
Aplikacje producenta na urządzeniu _nie_ były użytecznym źródłem inżynierii wstecznej. `com.tuya.devicetest` jest w postaci odex (brak dex w APK), a `com.smartos.xinch.hardware` zawiera SDK Tuya **AVS (Alexa)** (`libLibSampleApp.so`, 17 MB) i czytnik klawiszy (`libjnimain.so`). Źródłem rozstrzygającym są samodokumentujące się węzły sysfs urządzenia.
:::

<a id="webview-update-this-first"></a>

## WebView: najpierw zaktualizuj

Fabryczny WebView to **Chrome 83**, zdecydowanie za stary dla aktualnego frontendu Home Assistant, więc pulpit pozostaje pusty lub uszkodzony do czasu wymiany. Zalecana kompilacja to **LineageOS System WebView 150** (`armeabi-v7a`), aktualny, utrzymywany, standardowy silnik Chromium. Wybierz go zamiast Cromite: Cromite zmienia ustawienie automatycznego odtwarzania Chromium na _blokowanie_, przez co strumienie kart kamer Home Assistant (WebRTC) nie ruszają bez dotknięcia. LineageOS pozostawia automatyczne odtwarzanie dozwolone, więc strumienie kamer ruszają same.

TPA10 ma ograniczony zapas dekodera wideo w WebView. Kilka widocznych kart WebRTC 720p może gubić klatki albo pozostawić jeden strumień oczekujący na pierwszą klatkę, mimo że pojedynczy strumień działa prawidłowo. W takim przypadku użyj podstrumieni o niższej rozdzielczości, mniejszej liczby jednocześnie odtwarzanych kart lub zdjęć przełączanych na wideo na żywo po dotknięciu.

Pobierz z kopii (stały URL):

```
https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

### Dlaczego zwykła instalacja nie działa

WebView ma nazwę pakietu `com.android.webview`, więc musi **zastąpić** dostawcę systemowego, a obie oczywiste drogi zawodzą na tym panelu Android 11:

- `adb install -r` jest odrzucane z `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match`. Android pozwala aktualizować `com.android.webview` tylko APK podpisanym **tym samym kluczem** co zainstalowany, a każdy dostawca WebView używa innego klucza. Z tego samego powodu **zwykła instalacja spoza sklepu nie może wykonać pierwszej zamiany**: używa `pm install`, blokowanego przez panel. Poniższa zamiana jest **jednorazowym** krokiem ręcznym. Gdy LineageOS jest już zainstalowany, kolejne wersje LineageOS można instalować przez `adb install -r`, ponieważ mają ten sam podpis.
- Lista dozwolonych dostawców ROM-u akceptuje tylko `com.android.webview`, a nie wariant `com.google.android.webview`, więc kompilacja Google instaluje się, lecz nigdy nie zostaje wybrana.

### Działająca metoda z rootem: wymiana pliku i usunięcie blokady podpisu

Panel ma blokadę podpisu, lecz pozwala uzyskać root: aplikacja nie może wykonać `su`, ale powłoka może (`adb shell su root <cmd>`). Metoda umieszcza nowe APK w _systemowym_ miejscu WebView i usuwa jego wpis z bazy pakietów, aby PackageManager zarejestrował go **od nowa** przy restarcie, odczytując własny podpis nowego APK bez konfliktu.

```bash
IP=<panel-ip>:5555
adb connect $IP
adb -s $IP shell su root id                           # confirm it prints uid=0(root)

# 1. push the new WebView, and back up the current WebView + package database first:
adb -s $IP push lineageos-webview-150.0.7871.63-arm.apk /data/local/tmp/wv-new.apk
adb -s $IP shell su root sh -c 'cp /product/app/webview/webview.apk /data/local/tmp/webview.bak;
                                cp /data/system/packages.xml /data/local/tmp/packages.xml.bak'

# 2. replace the system WebView APK (remount /product read-write first — verity must already be off;
#    a never-modified panel needs a one-time `adb root && adb disable-verity && adb reboot` beforehand):
adb -s $IP shell su root sh -c 'mount -o rw,remount /product;
    cp /data/local/tmp/wv-new.apk /product/app/webview/webview.apk;
    chmod 644 /product/app/webview/webview.apk; chown root:root /product/app/webview/webview.apk;
    restorecon /product/app/webview/webview.apk'

# 3. remove the single <package name="com.android.webview" …>…</package> element from packages.xml.
#    Do NOT hand-edit it — pull it, let a parser remove exactly that element, then push it back:
adb -s $IP shell su root sh -c 'cp /data/system/packages.xml /data/local/tmp/pkgs.xml; chmod 644 /data/local/tmp/pkgs.xml'
adb -s $IP pull /data/local/tmp/pkgs.xml packages.xml
python3 - <<'PY'
import xml.etree.ElementTree as ET
d = open('packages.xml', encoding='utf-8').read()
m = '<package name="com.android.webview"'
assert d.count(m) == 1, 'expected exactly one com.android.webview package'
s  = d.find(m); ls = d.rfind('\n', 0, s) + 1                      # start of that line
e  = d.find('</package>', s) + len('</package>'); le = d.find('\n', e) + 1  # end of its closing line
new = d[:ls] + d[le:]
ET.fromstring(new)                                                # abort if the result isn't valid XML
open('packages.xml', 'w', encoding='utf-8').write(new)
print('removed com.android.webview; XML still valid')
PY
adb -s $IP push packages.xml /data/local/tmp/pkgs.new
adb -s $IP shell su root sh -c 'cp /data/local/tmp/pkgs.new /data/system/packages.xml;
    chown system:system /data/system/packages.xml; chmod 660 /data/system/packages.xml;
    restorecon /data/system/packages.xml'

# 4. reboot — PackageManager registers the new WebView fresh:
adb -s $IP reboot
```

**Jeśli coś pójdzie nie tak**, przywróć kopie z kroku 1: skopiuj `/data/local/tmp/webview.bak` z powrotem na `/product/app/webview/webview.apk`, a `/data/local/tmp/packages.xml.bak` na `/data/system/packages.xml` (z tym samym `chown`, `chmod` i `restorecon`), a następnie uruchom ponownie.

:::danger
**Po tej metodzie zgłaszana wersja WebView jest błędna, więc jej nie ufaj.** `Ustawienia, WebView` i `adb shell dumpsys webviewupdate` nadal pokazują **`83.0.4103.120`**, ponieważ SystemWebView instalowany spoza sklepu **przepisuje fabryczne `versionName` i `versionCode` OEM**, aby przejść bramkę minimalnej wersji panelu i zostać wybranym. _Rzeczywisty_ silnik to 150. Sprawdź go przez:

- **User-Agent:** otwórz na panelu dowolną stronę sprawdzającą user agent; UA zawiera `Chrome/150.0.7871.63`.
- **Aplikację panelu:** strona stanu panelu i `/diag`, na zgłaszanym porcie HTTP (domyślnie 8888), pokazują `engine Chromium 150.0.7871.63`, ponieważ odczytują UA, a nie przepisaną wersję pakietu.

Zwykła instalacja adb **nie** działa na tym panelu z blokadą podpisu. Cromite 147 pozostaje w kopii jako wariant awaryjny, używający tej samej procedury z innym APK.
:::

## LED

### RGB LED: sterownik `avsux` (demon pomocniczy root)

Przednia dioda RGB jest **pojedynczą** diodą (`avsux_info` zgłasza `led type:[single] nums:[1]`) na sterowniku platformy `leds_pwm_avs` (urządzenie `avsux`), udostępnianą pod `/sys/class/leds/avs-pwm-led/`.

:::danger
Zaobserwowano, że zapis `custom_animation` do `avsux_select` **restartuje panel**. Używaj `avsux_animation` dla koloru, a `avsux_select` i `custom_animation` traktuj jako tylko do odczytu poza testami.
:::

Dioda **nie ma węzła `/dev` dostępnego dla aplikacji** (porównaj `/dev/ledjni` na [WF1589T](/pl/hardware/panels/electron/wf1589t/)), a atrybuty sysfs mają `system:system`, więc `untrusted_app` nie może ich zapisywać. Aplikacja panelu używa więc małego **demona pomocniczego root** (`/system/bin/hapaneld-helper`, działającego jako root na gnieździe Unix); klientem jest `SocketLedController`. Zobacz [dokumentację pomocnika](https://github.com/panel-assistant/android/blob/main/helper/README.md).

#### Atrybuty sysfs `avs-pwm-led`

| Atrybut           | Uprawnienia        | Zastosowanie                                              |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | ogólny poziom od 0 do 255                                 |
| `avsux_animation` | `system:system` rw | bezpieczny zapis koloru lub animacji                      |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | lista nazwanych animacji (`bootanime`, `idle`)            |
| `avsux_info`      | r                  | metadane (liczba i typ diod)                              |

### Podświetlenie przycisków

`/sys/class/leds/button-backlight/brightness` jest **monochromatycznym** wyjściem PWM, od 0 do 255 (standardowy sterownik `leds_pwm`, urządzenie `pwmleds`). Ma `system:system` 0664, więc steruje nim ten sam demon `hapaneld-helper`.

## Czujniki

Zbliżenie i światło otoczenia są dostępne bezpośrednio z aplikacji przez `SensorManager`. Temperatura i wilgotność wymagają roota (podsystem wejściowy i I²C) oraz demona pomocniczego.

:::tip
CHT8305 czyni ten panel użytecznym **czujnikiem temperatury i wilgotności w pomieszczeniu** dla Home Assistant. Demon pomocniczy odczytuje go poleceniem `CHT8305`, punktowym odczytem `EVIOCGABS` osi wejściowej sterownika `ABS_THROTTLE`, dopasowującym urządzenia wejściowe `temperature` i `humidity` po nazwie. Aplikacja panelu oferuje wtedy dwa opcjonalne czujniki **Temperatura w pomieszczeniu** i **Wilgotność w pomieszczeniu** w Home Assistant (Konfiguracja, Diagnostyka; domyślnie wyłączone). Zaawansowane ustawienie **Korekta temperatury w pomieszczeniu** lub `sensors.room_temp_offset_c` profilu koryguje ciepło samego panelu.
:::

Czujnik czasu przelotu TPA10 oznacza, że zbliżenie faktycznie opiera się na odległości, lecz HAL Androida ją kwantuje. Prowadzona konfiguracja zbliżenia na panelu przechwytuje i zapisuje daleki i bliski punkt końcowy oraz kierunek działającego czujnika, a następnie panel zgłasza tę samą znormalizowaną skalę co każdy obsługiwany panel, zamiast polegać na stałym progu dla urządzenia.

### Układy czujników i ścieżki dostępu

| Czujnik                   | Układ                                                                           | Dostęp                                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Zbliżenie (czas przelotu) | Vishay **VI5300** (i2c-3 `0x6c`, `proximity_vi5300`, odpytywanie co 30 ms)      | Android `SensorManager` `TYPE_PROXIMITY`, bez roota. Surowa odległość w mm na węźle I²C sterownika (`…/i2c-3/3-006c`) wymaga roota. |
| Temperatura i wilgotność  | **CHT8305** (`temperature_cht8305` pod 3-0040, `humidity_cht8305` pod 3-0040-1) | **Nie** w `SensorManager`; zgłasza przez **podsystem wejściowy** na I²C, tylko root.                                                |
| Światło otoczenia         | **CG5256** (`light_cg5256`)                                                     | Czujnik światła Android `SensorManager`, bez roota.                                                                                 |

## Przyciski

TPA10 ma **trzy klasy** przycisków fizycznych, potwierdzone na urządzeniu przez `getevent`:

- **Cztery przyciski boczne:** `adc-keys`, standardowe KeyEvents mapowane na `F1` do `F4`, przechwytywane przez filtr klawiszy ułatwień dostępu aplikacji panelu bez specjalnej ścieżki.
- **Piąty (pomarańczowy) przycisk:** _przełącznik_ `EV_SW`, a nie klawisz, odczytywany przez czytnik evdev demona pomocniczego root i wysyłany do Home Assistant jako zdarzenie.
- **Przycisk w otworze** (zagłębiony, obok portu USB-C): nie jest wejściem Androida, więc nie jest dostępny dla Home Assistant.

### Szczegóły poszczególnych przycisków

**1. Cztery przyciski boczne to `adc-keys` wysyłające standardowe KeyEvents.** Są podłączone do **SARADC** rk3566 (`fe720000.saradc`), urządzenie `adc-keys1` (`/dev/input/event7`), scancodes od `59` do `62`. Fabryczny `Generic.kl` mapuje je na **`F1` do `F4`**, stające się Android `KEYCODE_F1` do `KEYCODE_F4`; aplikacja panelu przechwytuje je filtrem klawiszy ułatwień dostępu. Na egzemplarzu z `su` można zmienić mapowanie przez edycję `/system/usr/keylayout/Generic.kl` (np. na `BRIGHTNESS_*` lub `VOLUME_*`).

**2. Piąty (pomarańczowy) przycisk jest przełącznikiem, a nie klawiszem.** Na `gpio-keys` (`/dev/input/event8`) zgłasza **`EV_SW` `SW_MUTE_DEVICE`** (kod przełącznika `14`), zdarzenie _zatrzaskowe_, **nie** `EV_KEY`. Dlatego nie ma wpisu keylayout i ułatwienia dostępu Androida nigdy go nie widzą. Fizycznie wycisza mikrofony, niezależnie od dostarczania klawiszy przez ułatwienia dostępu. Aplikacja panelu odczytuje go czytnikiem evdev demona pomocniczego root (`WATCH /dev/input/event8`, `sw=true`) i wysyła zdarzenie Home Assistant (`KEYCODE_MUTE`) przy każdym przełączeniu, co zweryfikowano od początku do końca. To zachowanie **fabryczne**, w chwili pisania nieudokumentowane gdzie indziej.

**3. Przycisk w otworze (zagłębiony, obok portu USB-C) nie jest wejściem Androida.** Nie występuje w `getevent`, `gpio-keys` ani `dmesg`, więc Home Assistant nie może go używać. Jego rola elektryczna nie została bezpiecznie potwierdzona. Umiejscowienie i platforma rk3566 sugerują funkcję resetowania lub trybu rozruchu, lecz nie ma zweryfikowanego czasu przytrzymania, zachowania resetu fabrycznego ani procedury wejścia w Maskrom. Nie naciskaj ani nie przytrzymuj go w założeniu, że zapewnia odzyskiwalną drogę ponownego wgrania. Używaj zweryfikowanej programowej drogi Loader, gdy Android nadal się uruchamia, i przestrzegaj ograniczeń w [Kopia zapasowa i przywracanie firmware](/pl/hardware/guides/firmware-backup-and-restore/).

## Kamera

GalaxyCore **GC05A2 / GC5035**, matryca 2592×1944. Android zgłasza jedną kamerę na poziomie sprzętowym `LIMITED`, tylko `BACKWARD_COMPATIBLE`, `Facing: Back`, bez lampy błyskowej i autofokusa, przez dostawcę `legacy/0` (`device@3.3`).

:::note
Własne flagi funkcji firmware są tu błędne: panel deklaruje `android.hardware.camera.front`, podczas gdy HAL zgłasza `Facing: Back`. Opieraj decyzję na profilu urządzenia i tym, co rzeczywiście wylicza `CameraManager`, nigdy na `hasSystemFeature`.
:::

1280×720 jest oferowane we wszystkich trzech formatach: `IMPLEMENTATION_DEFINED`, `YUV_420_888` i `BLOB`, więc dostępne są formaty podglądu i zdjęć. HAL deklaruje jednoklatkowe zatrzymanie przy przechwytywaniu `BLOB` 720p przy 30 fps. Ta liczba producenta dotycząca zdjęć nie mierzy kosztu strumienia H.264 aplikacji panelu. `android.control.aeAvailableTargetFpsRanges` oferuje tylko `[15 30]` i `[30 30]`: nie ma stałego trybu matrycy 15 fps, więc strumień 15 fps uzyskuje się przez taktowanie enkodera, a nie matrycy.

Jedyny sprzętowy enkoder H.264 to `OMX.rk.video_encoder.avc`, obsługiwany przez OMX IL HAL (panel ma proces `media.codec` i nie ma usługi producenta Codec2). Deklaruje zakres od `176x144` do `1920x1088` z wyrównaniem `16x8`, przepływność zgłaszaną od 1 bps do 10 Mbps i cztery jednoczesne instancje. **Nie ma sprzętowego enkodera HEVC**; jedyny wpis HEVC to programowy `c2.android.hevc.encoder`, dostarczony z `enabled="false"`.

:::caution
Traktuj liczby `media_codecs_performance.xml` producenta jako szablon, a nie pomiar: sprzętowy i programowy enkoder AVC zgłaszają identyczne wartości `measured-frame-rate` przy 720×480 i 1280×720, co nie może być rzeczywistym pomiarem. Zakładaj 720p, dopóki nie zmierzysz inaczej na własnym panelu.
:::

Panel pokazujący karty kamer nie jest bezczynny. Na zmierzonym pulpicie aplikacja utrzymywała dwie aktywne instancje `OMX.rk.video_decoder.avc`, więc sesja kodowania konkuruje z już wykonywanym dekodowaniem na tym samym VPU Rockchip.

Aplikacja panelu może udostępniać tę kamerę jako funkcję **domyślnie wyłączoną**. Przełącznik **Kamera** na karcie Kamera w Konfiguracji włącza ją, z domyślnymi wartościami **Rozdzielczość**, **Liczba klatek na sekundę** i **Przepływność** (720p, 15 fps, 2000 kbps) oraz korektą **Ekspozycja**. Udostępnia strumień H.264 pod `rtsp://<panel>:8554/live`, z dźwiękiem pomieszczenia, gdy dostęp do mikrofonu jest dostępny i dozwolony. Home Assistant pobiera obrazy nieruchome przez encję kamery panelu z tego strumienia. Gdy kamera jest otwarta, panel pokazuje czerwony wskaźnik, którego treść strony nie może zasłonić. Encję kamery opisuje [dokumentacja sterowania](/pl/reference/api/).

:::caution
Nie umieszczaj karty kamery Home Assistant dla **tego** panelu na jego **własnym** pulpicie. Panel dekodowałby własny zakodowany obraz w pętli na tym samym silniku wideo, bez żadnej korzyści.
:::

## Pozostałe układy

Kamera GalaxyCore **GC05A2 / GC5035**; kodek audio **ES7202** (ADC przechwytywania; mowę blisko panelu i Assist zweryfikowano przez przechwytywanie Androida po wyłączeniu wyciszenia pomarańczowym przyciskiem sprzętowym; odbiór z daleka i działanie z muzyką w tle pozostają niezakwalifikowane); dotyk Goodix; PMIC `rk808` i `rk860`.

## Podsumowanie modelu dostępu

- **LED i podświetlenie przycisków:** tylko root (sysfs `system:system`), przez `hapaneld-helper`.
- **Zbliżenie i światło otoczenia:** bezpośrednio z aplikacji (`SensorManager`).
- **Temperatura, wilgotność:** tylko root (podsystem wejściowy i I²C), przez demona pomocniczego.
- **Przyciski:** cztery boczne są dostępne bezpośrednio z aplikacji (KeyEvents przez ułatwienia dostępu); piąty pomarańczowy jest przełącznikiem `EV_SW` odczytywanym przez obserwowanie evdev `hapaneld-helper`; przycisk w otworze nie jest wejściem.
