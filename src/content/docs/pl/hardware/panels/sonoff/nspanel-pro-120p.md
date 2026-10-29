---
title: Sonoff NSPanel Pro 120P
description: Dane sprzętowe Sonoff NSPanel Pro 120P, pionowego panelu Rockchip RK3326-S 750×1334 z wbudowanym radiem Zigbee.
vendor: Sonoff
model: NSPanel Pro 120P
soc: Rockchip RK3326-S
android: '8.1'
screen: 4.7 in, 750 × 1334, pionowo, dostępny układ poziomy
support: Pełna
root: userdebug, bez hasła adb; su do wyłączania podświetlenia
webview: Chromium 107 w 3.5.1; ręczna instalacja LineageOS 138
released: '2024-08 (szac.)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-120p-front.jpg'
    alt: Sonoff NSPanel Pro 120P, białe i czarne wykończenie, przód, zamontowany na ścianie
photoCredit: 'Zdjęcie: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 120P
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

**120P** to wysoki wariant linii [Sonoff NSPanel Pro](/pl/hardware/panels/sonoff/), nazwany od europejskiej puszki ściennej 120 mm. Ta strona zawiera tylko jego specyfikację i informacje różniące go od [86P](/pl/hardware/panels/sonoff/nspanel-pro-86p/); wszystko inne (proces uzyskania roota, aktualizacja WebView, LED, czujniki, brama Zigbee, osobliwości firmware) opisano raz na [stronie rodziny](/pl/hardware/panels/sonoff/), do której prowadzą sekcje tej strony.

## Także sprzedawany jako

NSPanel Pro 120, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, SN_3326S, nspanel-pro-ver120. Nie mylić z NSPanel Pro Gen2 ani płytami Tuya S6E i T6E, które są innym sprzętem.

|                  |                                                                                                                                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC              | Rockchip **RK3326-S** (ta sama rodzina PX30/RK3326 co 86P; `ro.board.platform=rk3326`, drzewo urządzeń `rockchip,px30`)                                                                                                           |
| CPU              | 4× **Cortex-A35**, do **1.512 GHz** (408 MHz w bezczynności)                                                                                                                                                                      |
| GPU              | **Mali-G31** (potwierdzone na urządzeniu)                                                                                                                                                                                         |
| Wyświetlacz      | **750×1334** pionowo, **240 dpi** (nadpisane 250); dostępny układ poziomy; około 1 cm węższy i dłuższy niż 86P                                                                                                                    |
| RAM              | **2 GB** (około 1960 MB użyteczne)                                                                                                                                                                                                |
| Pamięć masowa    | eMMC; `/data` około 3.5 GB                                                                                                                                                                                                        |
| Android          | 8.1 (API 27)                                                                                                                                                                                                                      |
| ABI              | arm64-v8a                                                                                                                                                                                                                         |
| Łączność radiowa | **Zigbee 3.0** (koordynator Silicon Labs EFR32, zobacz [stronę rodziny](/pl/hardware/panels/sonoff/#bramka-zigbee)), Wi-Fi, Bluetooth. Brak NFC, IR, Ethernet i sieci komórkowej.                                                 |
| Premiera         | Około sierpnia 2024 (szac.); sprzedaż na stronie Sonoff rozpoczęła się około 14 sierpnia 2024 ([relacja z premiery, haade.fr, sierpień 2024](https://haade.fr/en/blog/special-discount-new-sonoff-nspanel-pro-120-on-itead-site)) |

`ro.product.model` i `ro.product.device` zgłaszają `px30_evb`, wspólną nazwę płyty Rockchip, która _nie_ jest wiarygodnym sposobem odróżnienia 120P od 86P; `ro.product.version` zgłasza charakterystyczną dla 120P postać `NSPanel120P_x.y.z` (kanał OTA `nspanel-pro-ver120`, pełny ROM `SN_3326S_750X1334_…`). Poza tym forma OTA jest taka jak w 86P (zobacz [stronę firmware](/pl/hardware/firmware/nspanel-pro/)). Firmware zbliżenia 120P **pozostało binarne w 4.x** (86P przywrócił odczyty odległości w 4.0.12; jądra różnią się między modelami); zobacz [Czujniki](/pl/hardware/panels/sonoff/#czujniki-światło-i-zbliżenie-bezpośrednio-z-aplikacji) na stronie rodziny. Zweryfikowano na działającym 120P (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, gęstość 240, `ro.board.platform=rk3326`.

:::note
Cortex-A35 to rdzeń energooszczędny o wyraźnie niższej wydajności na takt niż A55 (TPA10) lub A72 (WF1589T). Z 2 GB RAM linia NSPanel Pro zapewnia **podstawowy poziom wydajności** wśród w pełni obsługiwanych paneli; zobacz [porównanie wydajności](/pl/hardware/#performance-comparison).
:::

## Początkowy dostęp do debugowania

Sieciowe ADB na porcie TCP 5555 bez komputera zależy od zainstalowanego firmware; nie ustalono uniwersalnego przełącznika. Wykonaj [początkowe kroki ADB dla NSPanel Pro](/pl/hardware/panels/sonoff/#uzyskiwanie-dostępu-adb-i-root), w tym procedurę USB dla danego firmware, gdy dostęp sieciowy jest niedostępny. Późniejsze kroki roota wymagają istniejącego połączenia debugowania.
