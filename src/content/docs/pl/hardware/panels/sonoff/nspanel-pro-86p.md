---
title: Sonoff NSPanel Pro 86P
description: Dane sprzętowe Sonoff NSPanel Pro 86P, kwadratowego panelu 480×480 z Rockchip PX30 i wbudowanym radiem Zigbee.
vendor: Sonoff
model: NSPanel Pro 86P
soc: Rockchip PX30
android: '8.1'
screen: 4 cale, 480 × 480, tylko pionowo
support: Pełne
root: userdebug, bez hasła adb; su do wyłączenia podświetlenia
webview: Chromium 107 na 3.5.1; ręczna instalacja LineageOS 138
released: '2022-09 (szac.)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-front.jpg'
    alt: Sonoff NSPanel Pro 86P, przód, zamontowany na ścianie
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-black-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, czarne wykończenie, widok pod kątem pokazujący głębokość montażu
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-white-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, białe wykończenie, widok pod kątem pokazujący głębokość montażu
photoCredit: 'Zdjęcie: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 86P
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

**86P** to kwadratowy wariant rodziny [Sonoff NSPanel Pro](/pl/hardware/panels/sonoff/), nazwany od europejskiej puszki ściennej 86 mm. Ta strona zawiera tylko jego specyfikację i różnice względem [120P](/pl/hardware/panels/sonoff/nspanel-pro-120p/); pozostałe informacje (uzyskanie root, aktualizacja WebView, LED, czujniki, bramka Zigbee i osobliwości firmware) opisano raz na [stronie rodziny](/pl/hardware/panels/sonoff/), do której prowadzą odnośniki w sekcjach tej strony.

## Sprzedawany również jako

NSPanel Pro 86, NSPanel Pro 86P, NSPanel120P (oferty 86P czasem ponownie używają tej nazwy), NSPanel Pro Gen1, px30_evb, SN-RKPX30-NSP-01, nspanel-pro. Nie należy mylić z NSPanel Pro Gen2 ani płytami Tuya S6E i T6E, które są innym sprzętem.

|          |                                                                                                                                                                                                                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **PX30**                                                                                                                                                                                                                                                                                   |
| CPU      | 4× **Cortex-A35** do **1.512 GHz** (408 MHz w spoczynku)                                                                                                                                                                                                                                            |
| GPU      | **Mali-G31** (potwierdzone na urządzeniu)                                                                                                                                                                                                                                                           |
| Ekran    | **Kwadratowy 480×480** (1:1), około 4 cale, 160 dpi (mdpi, dobrze dopasowane do około 170 fizycznych ppi), 60 Hz, obszar **480×480 dp**                                                                                                                                                             |
| RAM      | **2 GB** (około 1960 MB dostępne)                                                                                                                                                                                                                                                                   |
| Pamięć   | eMMC; `/data` około 3.5 GB                                                                                                                                                                                                                                                                          |
| Android  | 8.1 (API 27)                                                                                                                                                                                                                                                                                        |
| ABI      | arm64-v8a                                                                                                                                                                                                                                                                                           |
| Łączność | **Zigbee 3.0** (koordynator Silicon Labs EFR32, zobacz [stronę rodziny](/pl/hardware/panels/sonoff/#bramka-zigbee)), Wi-Fi, Bluetooth. Bez NFC, IR, Ethernet i sieci komórkowej.                                                                                                                    |
| Premiera | Około września 2022 (szac.); przedsprzedaż rozpoczęła się w sierpniu 2022 z wysyłką planowaną od 20 września 2022 ([opis przedsprzedaży, CNX Software, sierpień 2022](https://www.cnx-software.com/2022/08/12/sonoff-nspanel-pro-android-control-panel-doubles-as-wifi-zigbee-smart-home-gateway/)) |

`ro.product.model` i `ro.product.device` zgłaszają `px30_evb`, wspólną nazwę płyty Rockchip, która _nie_ pozwala wiarygodnie odróżnić 86P od 120P; `ro.product.version` ma postać właściwą dla 86P `NSPanel86P_x.y.z` lub w niektórych firmware `s6_android_x.y.z`. OTA jest pełnym ROM-em do **4.0.12** włącznie; późniejsze indeksowane wydania są różnicowe lub aktualizują tylko aplikację (zobacz [stronę firmware](/pl/hardware/firmware/nspanel-pro/)). Firmware czujnika zbliżenia 86P **przywrócił odczyty odległości w 4.0.12** (120P pozostał binarny w 4.x); zobacz [Czujniki](/pl/hardware/panels/sonoff/#czujniki-światło-i-zbliżenie-bezpośrednio-z-aplikacji) na stronie rodziny.

:::note
Cortex-A35 jest energooszczędnym rdzeniem o znacznie niższej wydajności na takt niż A55 (TPA10) lub A72 (WF1589T). Z 2 GB RAM rodzina NSPanel Pro ma **podstawową wydajność** wśród w pełni obsługiwanych paneli; zobacz [porównanie wydajności](/pl/hardware/#performance-comparison).
:::

## Początkowy dostęp do debugowania

Sieciowe ADB na porcie TCP 5555 bez komputera zależy od zainstalowanego firmware; nie ustalono uniwersalnego przełącznika. Wykonaj [pierwsze kroki ADB dla NSPanel Pro](/pl/hardware/panels/sonoff/#uzyskiwanie-dostępu-adb-i-root), w tym procedurę USB właściwą dla firmware, gdy dostęp sieciowy jest niedostępny. Późniejsze kroki root wymagają istniejącego połączenia debugowania.
