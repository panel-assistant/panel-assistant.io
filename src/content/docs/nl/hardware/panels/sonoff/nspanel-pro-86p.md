---
title: Sonoff NSPanel Pro 86P
description: Hardwaregegevens van de Sonoff NSPanel Pro 86P, een vierkant 480×480 Rockchip PX30-paneel met ingebouwde Zigbee-radio.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Sonoff
model: NSPanel Pro 86P
soc: Rockchip PX30
android: '8.1'
screen: 4 in, 480 × 480, alleen staand
support: Volledig
root: userdebug, geen adb-wachtwoord; su voor uitschakelen achtergrondverlichting
webview: Chromium 107 op 3.5.1; LineageOS 138 handmatig installeren
released: '2022-09 (schatting)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-front.jpg'
    alt: Sonoff NSPanel Pro 86P, voorkant, aan de muur
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-black-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, zwarte uitvoering, schuin zicht op montagediepte
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-white-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, witte uitvoering, schuin zicht op montagediepte
photoCredit: 'Foto: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 86P
  order: 1
---

De **86P** is de vierkante variant van de [Sonoff NSPanel Pro](/nl/hardware/panels/sonoff/)-reeks, genoemd naar de Europese 86mm-inbouwdoos. Deze pagina bevat alleen de eigen specificaties en de feiten die verschillen van de [120P](/nl/hardware/panels/sonoff/nspanel-pro-120p/); al het andere (rootprocedure, WebView-update, led, sensoren, Zigbee-gateway, firmware-eigenaardigheden) staat eenmaal op de [familiepagina](/nl/hardware/panels/sonoff/), waarnaar de secties op deze pagina verwijzen.

## Ook verkocht als

NSPanel Pro 86, NSPanel Pro 86P, NSPanel120P (vermeldingen van de 86P hergebruiken deze tekst soms), NSPanel Pro Gen1, px30_evb, SN-RKPX30-NSP-01, nspanel-pro. Niet te verwarren met de NSPanel Pro Gen2 of de Tuya S6E- en T6E-borden; dat is andere hardware.

|             |                                                                                                                                                                                                                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **PX30**                                                                                                                                                                                                                                                                                                |
| CPU         | 4× **Cortex-A35** tot **1.512 GHz** (408 MHz in rust)                                                                                                                                                                                                                                                            |
| GPU         | **Mali-G31** (bevestigd op het apparaat)                                                                                                                                                                                                                                                                         |
| Scherm      | **480×480 vierkant** (1:1), ongeveer 4 inch, 160 dpi (mdpi, passend bij ongeveer 170 fysieke ppi), 60 Hz, een canvas van **480×480 dp**                                                                                                                                                                          |
| RAM         | **2 GB** (ongeveer 1960 MB bruikbaar)                                                                                                                                                                                                                                                                            |
| Opslag      | eMMC; `/data` ongeveer 3.5 GB                                                                                                                                                                                                                                                                                    |
| Android     | 8.1 (API 27)                                                                                                                                                                                                                                                                                                     |
| ABI         | arm64-v8a                                                                                                                                                                                                                                                                                                        |
| Radio's     | **Zigbee 3.0** (Silicon Labs EFR32-coördinator, zie de [familiepagina](/nl/hardware/panels/sonoff/#zigbee-gateway)), wifi, Bluetooth. Geen NFC, IR, Ethernet of mobiel netwerk.                                                                                                                                  |
| Uitgebracht | Rond september 2022 (schatting); voorbestellen begon in augustus 2022 met verzending gepland vanaf 20 september 2022 ([verslag over voorbestellingen, CNX Software, augustus 2022](https://www.cnx-software.com/2022/08/12/sonoff-nspanel-pro-android-control-panel-doubles-as-wifi-zigbee-smart-home-gateway/)) |

`ro.product.model` en `ro.product.device` melden beide `px30_evb`, een gedeelde Rockchip-bordnaam en _geen_ betrouwbare manier om de 86P van de 120P te onderscheiden; `ro.product.version` meldt de 86P-specifieke vorm `NSPanel86P_x.y.z`, of `s6_android_x.y.z` op sommige firmware. OTA wordt tot en met **4.0.12** als volledige ROM geleverd; latere geïndexeerde releases worden geleverd als verschillen of updates van alleen de app (zie de [firmwarepagina](/nl/hardware/firmware/nspanel-pro/)). De nabijheidsfirmware van de 86P **kreeg afstandsmetingen terug bij 4.0.12** (de 120P bleef binair op 4.x); zie [Sensoren](/nl/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) op de familiepagina.

:::note
De Cortex-A35 is een zuinige kern met aanzienlijk minder verwerking per kloktik dan de A55 (TPA10) of A72 (WF1589T). Met 2 GB RAM is de NSPanel Pro-reeks qua prestaties het **instapniveau** van de volledig ondersteunde panelen; zie de [prestatievergelijking](/nl/hardware/#performance-comparison).
:::

## Eerste toegang voor foutopsporing

Netwerk-ADB op TCP-poort 5555 zonder computer hangt af van de geïnstalleerde firmware; er is geen universele schakelaar vastgesteld. Volg de [eerste ADB-stappen voor de NSPanel Pro](/nl/hardware/panels/sonoff/#gaining-adb-and-root-access), inclusief de firmwarespecifieke USB-procedure wanneer netwerktoegang niet beschikbaar is. De latere rootstappen vereisen een bestaande foutopsporingsverbinding.
