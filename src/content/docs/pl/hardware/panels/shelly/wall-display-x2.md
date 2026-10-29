---
title: Shelly Wall Display X2
description: Dane sprzętowe Shelly Wall Display X2, panelu SC7731E o przekątnej 6.9 cala z Androidem 8.1 i nazwą kodową Pegasus.
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 in, 1440 × 720
support: Nieprzetestowany
root: Nie ustalono dla tego modelu
webview: 'Nie ustalono (ścieżka WallDisplay nie zawiera pakietu OTA WebView dla tego modelu)'
released: '2025-01 (szac.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, przód
photoCredit: 'Zdjęcie: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Nie przetestowano żadnego egzemplarza tego modelu.** Panel Assistant dopasowuje go do dołączonego starszego profilu Shelly, którego nie uruchomiono jeszcze na żadnym X2. [Strona rodziny Wall Display](/pl/hardware/panels/shelly/) opisuje pochodzenie informacji, mechanizm OTA firmware, model dostępu i uwagi o bezpieczeństwie wspólne dla całej linii.
:::

Wall Display X2, o nazwie kodowej firmware **Pegasus**, to panel 6.9 in 1440×720 oparty na Spreadtrum/UNISOC SC7731E (Cortex-A7), z Androidem 8.1. Korzysta ze starszej ścieżki OTA **WallDisplay** (armeabi-v7a), podobnie jak [oryginalny model](/pl/hardware/panels/shelly/wall-display/).

## Początkowy dostęp do debugowania

**Sieciowe ADB na porcie TCP 5555 bez komputera: nie ustalono dla tego modelu.** Początkowe debugowanie USB i odblokowanie z menu producenta także nie są tutaj zweryfikowane. [Procedura X2i](/pl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) jest potwierdzona tylko na X2i; wspólne firmware nie dowodzi, że działa tutaj. Poproś Shelly o procedurę dla swojego modelu i firmware. Użyj [instalatora USB](/pl/install/install-over-usb/) dopiero po udostępnieniu debugowania USB i połączenia danych USB. Sama kompilacja obsługująca root nie włącza debugowania.

## Także sprzedawany jako

Shelly Wall Display X2, SAWD-2A1XX10EU1, nazwa kodowa firmware Pegasus, identyfikator urządzenia e500_7731e_32u_o.

|             |                                                                                                                                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                                        |
| Wyświetlacz | **1440×720**, 6.9 in                                                                                                                                                                                                                            |
| Android     | 8.1                                                                                                                                                                                                                                             |
| ABI         | armeabi-v7a                                                                                                                                                                                                                                     |
| Czujniki    | Udokumentowane temperatura, wilgotność, światło otoczenia i zbliżenie; udostępnianie przez API Androida niezweryfikowane                                                                                                                        |
| Przekaźnik  | 1 wyjście                                                                                                                                                                                                                                       |
| Root        | Nie ustalono dla tego modelu; brak ustalonych dowodów typu kompilacji OTA konkretnie dla tego modelu                                                                                                                                            |
| Premiera    | Około stycznia 2025 (szac.); zapowiedziany z serią Shelly Gen4 na CES 2025 ([własna strona prasowa Shelly o CES 2025](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)) |

[Strona rodziny Wall Display](/pl/hardware/panels/shelly/) zawiera pełne uzasadnienie modelu dostępu, punkty końcowe aktualizacji OTA (ścieżka `WallDisplay`) i historię wersji firmware.

## Źródło

[Baza wiedzy Shelly Wall Display X2](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
