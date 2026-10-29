---
title: Shelly Wall Display (oorspronkelijk)
description: Hardwaregegevens van de oorspronkelijke Shelly Wall Display, een 4-inch MT6580-paneel met Android 7, codenaam Stargate.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Shelly
model: Wall Display (oorspronkelijk)
soc: MT6580
android: '7.0'
screen: 4 in, 480 × 480
support: Onderzoek
root: Niet vastgesteld; userdebug-basisbuild, niet bevestigd
webview: 'com.google.android.webview 119.0.6045.194 via officiële ZIP'
released: '2023-09 (schatting)'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: Shelly Wall Display, oorspronkelijk model, met H&T-sensoraccessoire
  - src: 'asset:hardware-shelly-wall-display-rear-label.jpg'
    alt: Shelly Wall Display, achterkant met modelaanduiding en inbouwdoos
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display (oorspronkelijk)
  order: 1
---

:::note
**Alleen onderzoek: geen exemplaar van dit model is getest.** Zie de [Wall Display-familiepagina](/nl/hardware/panels/shelly/) voor broninformatie, het OTA-firmwaremechanisme, het toegangsmodel en beveiligingsnotities voor de hele reeks.
:::

:::caution
**Wordt geleverd met Android 7.0**, lager dan de minimale Android-versie die Panel Assistant ondersteunt.
:::

De oorspronkelijke Wall Display, firmwarecodenaam **Stargate**, is het instapmodel van de [Shelly Wall Display-familie](/nl/hardware/panels/shelly/): een 4-inch 480×480-paneel met een MediaTek MT6580 en Android 7. Het gebruikt het oudere **WallDisplay** (armeabi-v7a) OTA-kanaal, samen met de [X2](/nl/hardware/panels/shelly/wall-display-x2/).

## Eerste toegang voor foutopsporing

**Netwerk-ADB op TCP-poort 5555 zonder computer: niet vastgesteld voor dit model.** Ook de eerste USB-foutopsporing en het ontgrendelen van het leveranciersmenu zijn hier niet geverifieerd. De [X2i-procedure](/nl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) is alleen bevestigd op de X2i; gedeelde firmware bewijst niet dat deze hier werkt. Vraag Shelly om de procedure voor jouw model en firmware. Gebruik het [USB-installatieprogramma](/nl/install/install-over-usb/) pas zodra USB-foutopsporing en een USB-dataverbinding beschikbaar zijn. Alleen een build met rootmogelijkheden schakelt foutopsporing niet in.

## Ook verkocht als

Shelly Wall Display, SAWD-0A1XX10EU1, firmwarecodenaam Stargate, apparaat-ID k400_mt6580_32_n.

|             |                                                                                                                                                                                                                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | MediaTek **MT6580**                                                                                                                                                                                                                                                                                        |
| Scherm      | **480×480 vierkant**, 4 inch                                                                                                                                                                                                                                                                               |
| Android     | 7.0                                                                                                                                                                                                                                                                                                        |
| ABI         | armeabi-v7a                                                                                                                                                                                                                                                                                                |
| Sensoren    | Temperatuur, luchtvochtigheid en omgevingslicht gedocumenteerd; beschikbaarheid via Android-API niet geverifieerd                                                                                                                                                                                          |
| Relais      | 1 uitgang                                                                                                                                                                                                                                                                                                  |
| WebView     | Niet in de standaard-OTA; Shelly publiceert een afzonderlijke ZIP die `com.google.android.webview` **119.0.6045.194** installeert                                                                                                                                                                          |
| Root        | Niet vastgesteld voor dit model. De OTA vermeldt een `userdebug`-basisbuild (`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`), dus `adb root` werkt mogelijk **als** een adb-verbinding tot stand kan worden gebracht, hoewel dit niet op een exemplaar is bevestigd.                         |
| Uitgebracht | Rond september 2023 (schatting); Shelly toonde de Wall Display voor het eerst op IFA Berlin in september 2023 ([verslag over Shelly's IFA Berlin 2023-assortiment, Maison et Objet Domotique](https://www.maison-et-domotique.com/en/157856-shelly-11-new-products-in-wi-fi-bluetooth-and-zwave-ifa2023/)) |

Zie de [Wall Display-familiepagina](/nl/hardware/panels/shelly/) voor de volledige onderbouwing van het toegangsmodel, de OTA-update-eindpunten (kanaal `WallDisplay`) en de firmwareversiegeschiedenis.

## Bron

[Shelly Wall Display-kennisbank](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
