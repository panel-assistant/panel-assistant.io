---
title: Shelly Wall Display X2
description: Hardwaregegevens van de Shelly Wall Display X2, een 6,9-inch SC7731E-paneel met Android 8.1, codenaam Pegasus.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 in, 1440 × 720
support: Niet getest
root: Niet vastgesteld voor dit model
webview: 'Niet vastgesteld (het WallDisplay-kanaal bevat geen OTA-WebView-pakket voor dit model)'
released: '2025-01 (schatting)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, voorkant
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
---

:::note
**Geen exemplaar van dit model is getest.** Panel Assistant koppelt het aan het meegeleverde oudere Shelly-profiel, dat nog op geen X2 heeft gedraaid. Zie de [Wall Display-familiepagina](/nl/hardware/panels/shelly/) voor broninformatie, het OTA-firmwaremechanisme, het toegangsmodel en beveiligingsnotities voor de hele reeks.
:::

De Wall Display X2, firmwarecodenaam **Pegasus**, is een 6,9-inch 1440×720-paneel met een Spreadtrum/UNISOC SC7731E (Cortex-A7) en Android 8.1. Het gebruikt het oudere **WallDisplay** (armeabi-v7a) OTA-kanaal, samen met het [oorspronkelijke model](/nl/hardware/panels/shelly/wall-display/).

## Eerste toegang voor foutopsporing

**Netwerk-ADB op TCP-poort 5555 zonder computer: niet vastgesteld voor dit model.** Ook de eerste USB-foutopsporing en het ontgrendelen van het leveranciersmenu zijn hier niet geverifieerd. De [X2i-procedure](/nl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) is alleen bevestigd op de X2i; gedeelde firmware bewijst niet dat deze hier werkt. Vraag Shelly om de procedure voor jouw model en firmware. Gebruik het [USB-installatieprogramma](/nl/install/install-over-usb/) pas zodra USB-foutopsporing en een USB-dataverbinding beschikbaar zijn. Alleen een build met rootmogelijkheden schakelt foutopsporing niet in.

## Ook verkocht als

Shelly Wall Display X2, SAWD-2A1XX10EU1, firmwarecodenaam Pegasus, apparaat-ID e500_7731e_32u_o.

|             |                                                                                                                                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                                        |
| Scherm      | **1440×720**, 6,9 inch                                                                                                                                                                                                                          |
| Android     | 8.1                                                                                                                                                                                                                                             |
| ABI         | armeabi-v7a                                                                                                                                                                                                                                     |
| Sensoren    | Temperatuur, luchtvochtigheid, omgevingslicht en nabijheid gedocumenteerd; beschikbaarheid via Android-API niet geverifieerd                                                                                                                    |
| Relais      | 1 uitgang                                                                                                                                                                                                                                       |
| Root        | Niet vastgesteld voor dit model; geen bewijs van het OTA-buildtype specifiek voor dit model vastgesteld                                                                                                                                         |
| Uitgebracht | Rond januari 2025 (schatting); aangekondigd met Shelly's Gen4-reeks op CES 2025 ([Shelly's eigen CES 2025-perspagina](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)) |

Zie de [Wall Display-familiepagina](/nl/hardware/panels/shelly/) voor de volledige onderbouwing van het toegangsmodel, de OTA-update-eindpunten (kanaal `WallDisplay`) en de firmwareversiegeschiedenis.

## Bron

[Shelly Wall Display X2-kennisbank](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
