---
title: Smatek S9E
description: Dane Smatek S9E, podtynkowego panelu 10,1 cala z Rockchip RK3566, dwoma przekaźnikami sieciowymi, czterema przyciskami podświetlanymi LED, radarem zbliżenia, Zigbee, Ethernet i RS485.
vendor: Smatek
model: S9E
soc: Rockchip RK3566
android: '11'
screen: 10,1 cala, 1920 × 1200
support: Przetestowany przez społeczność
root: Przekaźniki, LED przycisków, zbliżenie (zgłoszono działające su aplikacji)
webview: Chromium 83 w 2024-07; 131 w 2025-12
released: 'nie wcześniej niż 2021 (szac., SoC RK3566)'
photos:
  - src: 'asset:hardware-smatek-s9e-front.jpg'
    alt: Smatek S9E, przód i tył, z przekaźnikami i zaciskami przewodów
photoCredit: 'Zdjęcie: Smatek'
sold_as_note: 'Wersja Zigbee (Tuya) z dwoma przekaźnikami sieciowymi, AC 100-240 V'
sold_as:
  - brand: Smatek
    name: 'S9E-NZ'
    note: 'Wersja Android bez bramki Zigbee: RS485, cztery przyciski, AC 100-240 V'
  - brand: Smatek
    name: 'S9PE-NZ'
    note: 'Jak S9E-NZ, zasilany przez Ethernet (PoE) lub DC 9-24 V zamiast napięcia sieciowego'
evidence: [firmware, documented, platform, owners]
sidebar:
  label: S9E
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Nie znaleziono informacji producenta o zmianach firmware dla opisanych wersji. Poniższe porównanie wynika z analizy dostarczonych obrazów, nie z dziennika zmian producenta.

:::note
W odróżnieniu od w pełni obsługiwanych paneli S9E **nie** poddano inżynierii wstecznej na posiadanym egzemplarzu. Specyfikacja pochodzi z oferty Smatek, a ścieżki sterowania ze [zgłoszenia seaky/nspanel_pro_tools_apk 98](https://github.com/seaky/nspanel_pro_tools_apk/issues/98), wątku społeczności Home Assistant i od zgłaszających. Właściciel przełączał przekaźniki i LED przycisków z Home Assistant na firmware 1.1.0 ([zgłoszenie 93](https://github.com/panel-assistant/android/issues/93)); pozostałe szczegóły ścieżek traktuj jako niepotwierdzone do czasu weryfikacji.
:::

Podtynkowy panel 10,1 cala **1920×1200** z RK3566, tej samej rodziny SoC co TPA10, z **dwoma wbudowanymi przekaźnikami sieciowymi**, czterema przyciskami z LED, radarowym czujnikiem zbliżenia oraz **Zigbee, Ethernet i RS485**.

## Początkowy dostęp do debugowania

**Sieciowe ADB na porcie TCP 5555 bez komputera: nieustalone.** Właściciel korzystający z Panel Assistant lub kompilacja firmware oferująca root nie dowodzą, jak nowy panel włącza debugowanie.

**Procedura początkowego debugowania USB również nie jest ustalona.** Poproś dostawcę o instrukcje debugowania dla dokładnego firmware i potwierdzenie portu USB do danych. Jeśli udostępnia debugowanie USB, użyj [instalatora USB](/pl/install/install-over-usb/); nie zakładaj, że port ładowania zapewnia ADB. Nie ma tu zweryfikowanej sekwencji menu fabrycznego.

Sprawdzanie root wymaga już działającego połączenia ADB. Dostęp root i początkowy dostęp do debugowania to osobne kwestie.

## Sprzedawany również jako

Smatek S9E, Smatek S9, S9E-NZ (bez bramki Zigbee), S9PE, S9PE-NZ (wariant PoE), `Build.MODEL` S9, `Build.DEVICE` rk3566_r, `ro.product.version` S9_Android_1.0.2 i S9_Android_1.1.0.

:::tip
Najważniejsze fakty: współdzieli platformę **RK3566** z TPA10, więc funkcje aplikacji prawdopodobnie działają bez kodu dla S9E. **Przekaźniki przełączają obciążenia sieciowe** (sysfs z root, właściciel zgłosił działanie na 1.1.0). Przyciski wysyłają KeyEvents **`F1` do `F4`** (bezpośrednio do aplikacji, bez root). Najpierw sprawdź WebView: firmware 2024-07 zawiera **Chromium 83**.
:::

|              |                                                                                                                                                                                                                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC          | Rockchip **RK3566** (cztery Cortex-A55), ta sama rodzina SoC co TPA10                                                                                                                                                                                                                                       |
| RAM i pamięć | **2 GB** RAM, **16 GB** eMMC                                                                                                                                                                                                                                                                                |
| Ekran        | **10,1 cala**, **1920×1200**, wielodotykowy                                                                                                                                                                                                                                                                 |
| Android      | 11                                                                                                                                                                                                                                                                                                          |
| Łączność     | Wi-Fi, Bluetooth, **Zigbee**, **RJ45 Ethernet**, **RS485** (istnieje też wariant PoE **S9PE**)                                                                                                                                                                                                              |
| Czujniki     | **radar** zbliżenia, **światło** otoczenia, **temperatura i wilgotność**                                                                                                                                                                                                                                    |
| Wejścia      | **4 fizyczne przyciski** z osobnymi LED                                                                                                                                                                                                                                                                     |
| Przekaźniki  | **2 wbudowane przekaźniki sieciowe**                                                                                                                                                                                                                                                                        |
| Root         | aplikacja producenta używa `execRootCmd`, więc root jest dostępny; część egzemplarzy ma odblokowany tryb programisty. Raport właściciela pokazuje dostęp do `su` ze zwykłej piaskownicy aplikacji na 1.1.0; od tego zależy, czy aplikacja steruje sysfs bezpośrednio, czy potrzebuje demona pomocnika root. |
| Premiera     | Brak pewnej daty; rodzina SoC RK3566 trafiła na rynek dopiero około 2021, co jest najlepszą znalezioną dolną granicą dla panelu ([opis dokumentacji RK3566, CNX Software, grudzień 2020](https://www.cnx-software.com/2020/12/16/rockchip-rk3566-and-rk3568-datasheets-and-features-comparison/))           |

:::danger
Poniższe operacje sterowania to zapisy **sysfs z root**, a przekaźniki przełączają **obciążenia sieciowe**. Obsługę wdrożono na podstawie zgłoszonych ścieżek, a właściciel zgłosił działanie przekaźników i LED na 1.1.0; ścieżka `st_relay` z 1.0.2 jest **niepotwierdzona**, więc sprawdź ją na swoim S9E, zanim na niej polegniesz.
:::

:::tip
Ponieważ S9E współdzieli platformę **RK3566** z TPA10, istniejące funkcje aplikacji prawdopodobnie działają bez kodu dla S9E, a temperatura, wilgotność i światło mogą być dostępne przez `SensorManager`. Starszy firmware zawiera **bardzo stary WebView (Chromium 83)**, więc zaktualizuj go najpierw: Magisk OpenWebView, firmware 2025-03-24 lub ręcznie zainstalowany SystemWebView. Firmware 2025-12 zawiera już Chromium 131. Zobacz [Aktualizację systemowego WebView](/pl/hardware/guides/update-the-webview/).
:::

:::tip
S9E ma cztery przednie przyciski funkcyjne, ale nie ma udokumentowanej kombinacji zasilania i głośności do odzyskiwania. Nie zarejestrowano na działającym sprzęcie jego tablicy partycji, dostępu root ani odzyskiwania, dlatego nie stosuj do niego bez zmian [przewodnika kopii firmware](/pl/hardware/guides/firmware-backup-and-restore/) dla TPA10 i WF1589T.
:::

## Wersje firmware

Przeanalizowano dwa fabryczne obrazy. To blokowe pliki OTA `.zip` w formacie dynamicznych partycji AOSP: rozpakuj `.new.dat.br` przez `brotli -d`, obraz super przez `lpunpack`, a następnie przeszukaj `build.prop` i pliki init `.rc` przez `strings`. Oba zgłaszają `Build.MODEL` **`S9`**, `Build.DEVICE` **`rk3566_r`** i Android 11; kod kompilacji producenta jest w **`ro.product.version`**:

| Obraz                              | `ro.product.version` | Kompilacja                   | Klasa przekaźnika     |
| ---------------------------------- | -------------------- | ---------------------------- | --------------------- |
| `S9_1920x1200_20240712_Android_US` | `S9_Android_1.0.2`   | `eng.*.20240712`             | `/sys/class/st_relay` |
| `S9_1920x1200_20251202_Android_US` | `S9_Android_1.1.0`   | `eng.xiaolp.20251202.160404` | `/sys/class/strelay`  |

:::caution
**Nazwa klasy sysfs przekaźnika zmieniła się między wersjami.** Tylko **początkowy** obraz (1.0.2) używa `/sys/class/st_relay`; **wszystkie nowsze** (1.1.0 i późniejsze) używają `/sys/class/strelay`, co potwierdził [zgłaszający](https://github.com/panel-assistant/android/issues/3) i porównanie firmware. Aplikacja sprawdza obie nazwy i używa udostępnionej przez panel; zobacz [Przekaźniki](#przekaźniki-klasa-strelay-lub-st_relay-root).
:::

Oba obrazy zgłaszający otrzymał od Smatek: `S9_1920x1200_20240712_Android_US` (**1.0.2**) i `S9_1920x1200_20251202_Android_US` (**1.1.0**). Oryginalne odnośniki Smatek w `docs.smatek.store:10001` nie są już dostępne; poproś wsparcie Smatek lub zgłaszającego o kopię.

Porównanie obrazów pokazuje, że **różnią się tylko `ro.product.version` i klasa przekaźnika.** Wszystkie inne opisane niżej ścieżki (kody przycisków, GPIO ich LED, GPIO zbliżenia i połączenia czujników) są identyczne, więc wykrywanie po `ro.product.version` zaczynającym się od `S9` obejmuje całą rodzinę.

## Przekaźniki: klasa `strelay` lub `st_relay` (root)

Aplikacja udostępnia dwa przekaźniki sieciowe jako `switch.<panel>_relay1` i `switch.<panel>_relay2`, tylko na panelu z klasą sysfs przekaźników.

:::note
**Nazwa klasy zależy od firmware** (zobacz [Wersje firmware](#wersje-firmware)): `st_relay` na początkowym obrazie 1.0.2, `strelay` na 1.1.0 i nowszych. Aplikacja sprawdza **obie** nazwy i używa udostępnionej przez panel.
:::

```bash
# firmware 1.1.0+ (most panels in the field)
echo 1 > /sys/class/strelay/relay1    # on
echo 0 > /sys/class/strelay/relay1    # off
echo 1 > /sys/class/strelay/relay2

# firmware 1.0.2 (initial release)
echo 1 > /sys/class/st_relay/relay1
```

## Przyciski: KeyEvents `F1` do `F4` (bezpośrednio do aplikacji)

Cztery przyciski wysyłają standardowe kody klawiszy Androida **131 do 134**, `KEYCODE_F1` do `KEYCODE_F4`. Przechwytywanie przez ułatwienia dostępu zgłasza je do `event.<panel>_button` (typy zdarzeń `KEYCODE_F1` do `KEYCODE_F4`); przypisz do nich działania pulpitu w Home Assistant. Zdarzenia nie wymagają root.

## LED: podświetlenie GPIO każdego przycisku

Każdy przycisk ma LED pod `/sys/class/gpio/gpio<16+keycode>/value`, czyli GPIO **147 do 150** dla F1–F4. Każda jest monochromatyczna, włączona lub wyłączona. Aplikacja udostępnia je jako `light.<panel>_button_led1` do `light.<panel>_button_led4` (przełączane przez `su`), licząc od `hardware.button_led_gpio_base` profilu. LED **nie** znajdują się pod `/sys/class/leds`, gdzie S9E ma tylko LED karty SD `mmc2::`; to surowe GPIO.

:::note
**Analiza firmware:** skrypty init eksportują **tylko `gpio113`**. Piny LED przycisków **gpio147 do gpio150 nie są eksportowane przy starcie**, więc ich węzły `/sys/class/gpio/gpioNNN/value` nie istnieją do eksportu. Aplikacja eksportuje każdy pin na żądanie i ustawia wyjście przed pierwszym zapisem, dlatego LED działają mimo braku eksportu przy starcie.
:::

```bash
echo 147 > /sys/class/gpio/export        # one-time, if the node is absent
echo 1 > /sys/class/gpio/gpio147/value   # button F1 LED on
```

:::tip
Firmware zawiera też **RGB LED stanu** (`led_r`, `led_g`, `led_b`), **silnik wibracyjny** i **LED aktywności Ethernet**. Aplikacja panelu nie udostępnia żadnych z nich.
:::

## Czujniki: zbliżenie pochodzi z GPIO 18, nie `SensorManager`

:::caution
Czujnik zbliżenia jest _zarejestrowany_ w `SensorManager` i ogłasza `Proximity=yes · Binary · 0/1 cm`, ale na S9E **nigdy nie dostarcza zdarzeń**. Odczyty na żywo w [kolejnym zgłoszeniu](https://github.com/panel-assistant/android/issues/5) ustaliły, że ścieżka Androida milczy. Czujnik światła tego samego panelu działa (około 46 lx), więc problem dotyczy tylko zbliżenia; rzeczywisty sygnał jest odczytywany z `gpio18`.
:::

Rzeczywisty sygnał to **odczyt GPIO 18 z root**. Jądro rejestruje pozorny czujnik Androida, który nigdy nie wysyła zdarzeń, więc wartość trzeba czytać z sysfs:

```bash
cat /sys/class/gpio/gpio18/value   # 1 = near, 0 = far  (no export needed — reporter-confirmed)
```

Profil S9E deklaruje więc `sensors.proximity_gpio: 18` zamiast martwego źródła `SensorManager`. Pomocnik root utrzymuje otwarty deskryptor wartości i natychmiast przesyła zmiany, gdy jądro obsługuje zbocza GPIO; w przeciwnym razie sprawdza ten sam deskryptor dwa razy na sekundę. Utrata deskryptora jest jawnie zgłaszana, więc Home Assistant pokazuje niedostępny czujnik, dopóki odzyskany strumień pomocnika nie dostarczy bieżącej wartości. Sygnał używa tej samej konfiguracji z przewodnikiem i zapisanej kalibracji co czujniki Androida; skalibrowana obecność i gesty stają się dostępne po udanej konfiguracji. Zgłaszający potwierdził **0 daleko, 1 blisko** dla gpio18, a konfiguracja mierzy końce zakresu zamiast zgadywać polaryzację. Światło otoczenia, temperatura i wilgotność są zgodnie z oczekiwaniem dostępne przez `SensorManager`.

## Podsumowanie modelu dostępu

- **Przekaźniki:** `switch.<panel>_relay1` i `switch.<panel>_relay2` przez klasę sysfs przekaźników (root); sprawdzane są `strelay` i `st_relay`.
- **Przyciski:** `event.<panel>_button` (`KEYCODE_F1` do `KEYCODE_F4`), bezpośrednio przez ułatwienia dostępu.
- **LED przycisków:** `light.<panel>_button_led1` do `light.<panel>_button_led4` przez `su` (GPIO 147 do 150, eksportowane na żądanie).
- **Zbliżenie:** skalibrowany `binary_sensor.<panel>_proximity` i znormalizowany `sensor.<panel>_proximity_level` ze strumienia utrzymywanego `gpio18` pomocnika root. Czujnik zbliżenia `SensorManager` rejestruje się, ale nigdy nie wysyła zdarzeń, więc jest pomijany.
- **Światło:** `sensor.<panel>_illuminance` przez `SensorManager`, który **działa**.

## Źródła

- [Zgłoszenie Smatek S9E na GitHubie](https://github.com/panel-assistant/android/issues/3): `/diag` zgłaszającego (ciągi wykrywania, zbliżenie `SensorManager`), zmiana klasy `st_relay` na `strelay` i dwa obrazy firmware.
- Fabryczny firmware Smatek S9E udostępniony przez zgłaszającego: 1.0.2 (20240712) i 1.1.0 (20251202), dwa przeanalizowane obrazy. Oryginalne odnośniki Smatek (`docs.smatek.store:10001`) nie są już dostępne.
- [seaky/nspanel_pro_tools_apk, zgłoszenie 98 „Add Smatek S9E Support”](https://github.com/seaky/nspanel_pro_tools_apk/issues/98): ścieżki sterowania przekaźnikiem (`st_relay`), przyciskami (kody 131–134), LED przycisków (GPIO 147–150) i zbliżeniem (GPIO 18).
- [Społeczność Home Assistant: „Smatek S9E Touch Panel”](https://community.home-assistant.io/t/smatek-s9e-touch-panel/828244): aktualizacja WebView, skrypty zbliżenia GPIO 18, uwagi o integracji.
- [Strona produktu Smatek S9E](https://smatek.com/product/10-1-inch-smart-control-panel-s9e/) i [wariant PoE S9PE-NZ](https://smatek.com/product/10-1-inch-android-panel-s9e-nz/): SoC, RAM i pamięć, ekran, czujniki i łączność.
- [Specyfikacja Smatek S9E (PDF)](https://smatek.com/wp-content/uploads/2025/03/Smatek-S9E-10-Super-Smart-Control-Panelin-wall-SPEC.pdf): skan graficzny bez możliwości wyodrębnienia tekstu, ale źródłowy arkusz danych.
