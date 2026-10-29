---
title: Sonoff NSPanel Pro 120P
description: Hardwaregegevens van de Sonoff NSPanel Pro 120P, een staand 750×1334 Rockchip RK3326-S-paneel met ingebouwde Zigbee-radio.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Sonoff
model: NSPanel Pro 120P
soc: Rockchip RK3326-S
android: '8.1'
screen: 4.7 in, 750 × 1334, staand, liggend beschikbaar
support: Volledig
root: userdebug, geen adb-wachtwoord; su voor uitschakelen achtergrondverlichting
webview: Chromium 107 op 3.5.1; LineageOS 138 handmatig installeren
released: '2024-08 (schatting)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-120p-front.jpg'
    alt: Sonoff NSPanel Pro 120P, witte en zwarte uitvoering, voorkant, aan de muur
photoCredit: 'Foto: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 120P
  order: 2
---

De **120P** is de hoge variant van de [Sonoff NSPanel Pro](/nl/hardware/panels/sonoff/)-reeks, genoemd naar de Europese 120mm-inbouwdoos. Deze pagina bevat alleen de eigen specificaties en de feiten die verschillen van de [86P](/nl/hardware/panels/sonoff/nspanel-pro-86p/); al het andere (rootprocedure, WebView-update, led, sensoren, Zigbee-gateway, firmware-eigenaardigheden) staat eenmaal op de [familiepagina](/nl/hardware/panels/sonoff/), waarnaar de secties op deze pagina verwijzen.

## Ook verkocht als

NSPanel Pro 120, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, SN_3326S, nspanel-pro-ver120. Niet te verwarren met de NSPanel Pro Gen2 of de Tuya S6E- en T6E-borden; dat is andere hardware.

|             |                                                                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **RK3326-S** (dezelfde PX30/RK3326-familie als de 86P; `ro.board.platform=rk3326`, device tree `rockchip,px30`)                                                                                                        |
| CPU         | 4× **Cortex-A35** tot **1.512 GHz** (408 MHz in rust)                                                                                                                                                                           |
| GPU         | **Mali-G31** (bevestigd op het apparaat)                                                                                                                                                                                        |
| Scherm      | **750×1334** staand, **240 dpi** (overschrijving 250); liggend beschikbaar; ongeveer 1 cm smaller en langer dan de 86P                                                                                                          |
| RAM         | **2 GB** (ongeveer 1960 MB bruikbaar)                                                                                                                                                                                           |
| Opslag      | eMMC; `/data` ongeveer 3.5 GB                                                                                                                                                                                                   |
| Android     | 8.1 (API 27)                                                                                                                                                                                                                    |
| ABI         | arm64-v8a                                                                                                                                                                                                                       |
| Radio's     | **Zigbee 3.0** (Silicon Labs EFR32-coördinator, zie de [familiepagina](/nl/hardware/panels/sonoff/#zigbee-gateway)), wifi, Bluetooth. Geen NFC, IR, Ethernet of mobiel netwerk.                                                 |
| Uitgebracht | Rond augustus 2024 (schatting); kwam rond 14 augustus 2024 te koop op Sonoffs site ([verslag over de introductie, haade.fr, augustus 2024](https://haade.fr/en/blog/special-discount-new-sonoff-nspanel-pro-120-on-itead-site)) |

`ro.product.model` en `ro.product.device` melden beide `px30_evb`, een gedeelde Rockchip-bordnaam en _geen_ betrouwbare manier om de 120P van de 86P te onderscheiden; `ro.product.version` meldt de 120P-specifieke vorm `NSPanel120P_x.y.z` (OTA-kanaal `nspanel-pro-ver120`, volledige ROM `SN_3326S_750X1334_…`). De OTA-vorm volgt verder de 86P (zie de [firmwarepagina](/nl/hardware/firmware/nspanel-pro/)). De nabijheidsfirmware van de 120P **bleef binair op 4.x** (de 86P kreeg afstandsmetingen terug bij 4.0.12; de kernels verschillen per model); zie [Sensoren](/nl/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) op de familiepagina. Live geverifieerd op een 120P (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, dichtheid 240, `ro.board.platform=rk3326`.

:::note
De Cortex-A35 is een zuinige kern met aanzienlijk minder verwerking per kloktik dan de A55 (TPA10) of A72 (WF1589T). Met 2 GB RAM is de NSPanel Pro-reeks qua prestaties het **instapniveau** van de volledig ondersteunde panelen; zie de [prestatievergelijking](/nl/hardware/#performance-comparison).
:::

## Eerste toegang voor foutopsporing

Netwerk-ADB op TCP-poort 5555 zonder computer hangt af van de geïnstalleerde firmware; er is geen universele schakelaar vastgesteld. Volg de [eerste ADB-stappen voor de NSPanel Pro](/nl/hardware/panels/sonoff/#gaining-adb-and-root-access), inclusief de firmwarespecifieke USB-procedure wanneer netwerktoegang niet beschikbaar is. De latere rootstappen vereisen een bestaande foutopsporingsverbinding.
