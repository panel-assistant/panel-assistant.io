---
title: Shelly Wall Display (oryginalny)
description: Dane sprzętowe oryginalnego Shelly Wall Display, panelu MT6580 o przekątnej 4 cali z Androidem 7 i nazwą kodową Stargate.
vendor: Shelly
model: Wall Display (oryginalny)
soc: MT6580
android: '7.0'
screen: 4 in, 480 × 480
support: Badania
root: Nie ustalono; bazowa kompilacja userdebug, niepotwierdzone
webview: 'com.google.android.webview 119.0.6045.194 przez oficjalny ZIP'
released: '2023-09 (szac.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: Shelly Wall Display, oryginalny model, z akcesoryjnym czujnikiem H&T
  - src: 'asset:hardware-shelly-wall-display-rear-label.jpg'
    alt: Shelly Wall Display, tył z etykietą modelu i puszką ścienną
photoCredit: 'Zdjęcie: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display (oryginalny)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Wyłącznie badania: nie przetestowano żadnego egzemplarza tego modelu.** [Strona rodziny Wall Display](/pl/hardware/panels/shelly/) opisuje pochodzenie informacji, mechanizm OTA firmware, model dostępu i uwagi o bezpieczeństwie wspólne dla całej linii.
:::

:::caution
**Fabrycznie ma Androida 7.0**, czyli wersję niższą od minimalnej obsługiwanej przez Panel Assistant.
:::

Oryginalny Wall Display, o nazwie kodowej firmware **Stargate**, jest podstawowym modelem [rodziny Shelly Wall Display](/pl/hardware/panels/shelly/): panel 4 in 480×480 na MediaTek MT6580 z Androidem 7. Korzysta ze starszej ścieżki OTA **WallDisplay** (armeabi-v7a), podobnie jak [X2](/pl/hardware/panels/shelly/wall-display-x2/).

## Początkowy dostęp do debugowania

**Sieciowe ADB na porcie TCP 5555 bez komputera: nie ustalono dla tego modelu.** Początkowe debugowanie USB i odblokowanie z menu producenta także nie są tutaj zweryfikowane. [Procedura X2i](/pl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) jest potwierdzona tylko na X2i; wspólne firmware nie dowodzi, że działa tutaj. Poproś Shelly o procedurę dla swojego modelu i firmware. Użyj [instalatora USB](/pl/install/install-over-usb/) dopiero po udostępnieniu debugowania USB i połączenia danych USB. Sama kompilacja obsługująca root nie włącza debugowania.

## Także sprzedawany jako

Shelly Wall Display, SAWD-0A1XX10EU1, nazwa kodowa firmware Stargate, identyfikator urządzenia k400_mt6580_32_n.

|             |                                                                                                                                                                                                                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | MediaTek **MT6580**                                                                                                                                                                                                                                                                            |
| Wyświetlacz | **480×480, kwadratowy**, 4 in                                                                                                                                                                                                                                                                  |
| Android     | 7.0                                                                                                                                                                                                                                                                                            |
| ABI         | armeabi-v7a                                                                                                                                                                                                                                                                                    |
| Czujniki    | Udokumentowane temperatura, wilgotność i światło otoczenia; udostępnianie przez API Androida niezweryfikowane                                                                                                                                                                                  |
| Przekaźnik  | 1 wyjście                                                                                                                                                                                                                                                                                      |
| WebView     | Brak w standardowym OTA; Shelly publikuje osobny ZIP instalujący `com.google.android.webview` **119.0.6045.194**                                                                                                                                                                               |
| Root        | Nie ustalono dla tego modelu. OTA deklaruje bazową kompilację `userdebug` (`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`), więc `adb root` może działać, **jeśli** uda się nawiązać połączenie adb, ale nie potwierdzono tego na egzemplarzu.                                   |
| Premiera    | Około września 2023 (szac.); Shelly po raz pierwszy pokazało Wall Display na IFA Berlin we wrześniu 2023 ([relacja z oferty Shelly na IFA Berlin 2023, Maison et Objet Domotique](https://www.maison-et-domotique.com/en/157856-shelly-11-new-products-in-wi-fi-bluetooth-and-zwave-ifa2023/)) |

[Strona rodziny Wall Display](/pl/hardware/panels/shelly/) zawiera pełne uzasadnienie modelu dostępu, punkty końcowe aktualizacji OTA (ścieżka `WallDisplay`) i historię wersji firmware.

## Źródło

[Baza wiedzy Shelly Wall Display](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
