---
title: Shelly Wall Display X1i
description: Hardwaregegevens van de Shelly Wall Display X1i, een 4-inch RK3326-S-paneel met Android 11, codenaam Cally.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 in, 720 × 720
support: Niet getest
root: Niet vastgesteld voor dit model
webview: 'Niet vastgesteld (het WallDisplayV2-kanaal bevat geen OTA-WebView-pakket)'
released: '2026-07 (schatting)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x1i-front.jpg'
    alt: Shelly Wall Display X1i, voorkant
  - src: 'asset:hardware-shelly-wall-display-x1i-silver.jpg'
    alt: Shelly Wall Display X1i, zilveren uitvoering, voorkant
  - src: 'asset:hardware-shelly-wall-display-x1i-rear-label.jpg'
    alt: Shelly Wall Display X1i, achterkant met modelaanduiding SAWD-6A1XX10EU0
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display X1i
  order: 3
---

:::note
**Geen exemplaar van dit model is getest.** Zie de [Wall Display-familiepagina](/nl/hardware/panels/shelly/) voor broninformatie, het OTA-firmwaremechanisme, het toegangsmodel en beveiligingsnotities voor de hele reeks.
:::

De Wall Display X1i, firmwarecodenaam **Cally**, is een 4-inch 720×720-paneel met een Rockchip RK3326-S (Cortex-A35) en Android 11. Het gebruikt het moderne **WallDisplayV2** (arm64-v8a) OTA-kanaal, samen met de [X2i](/nl/hardware/panels/shelly/wall-display-x2i/), [XL](/nl/hardware/panels/shelly/wall-display-xl/), Maverick en Dayna, en heeft toegang tot de ingebouwde AppStore.

## Eerste toegang voor foutopsporing

**Netwerk-ADB op TCP-poort 5555 zonder computer: niet vastgesteld voor dit model.** Ook de eerste USB-foutopsporing en het ontgrendelen van het leveranciersmenu zijn hier niet geverifieerd. De [X2i-procedure](/nl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) is alleen bevestigd op de X2i; gedeelde firmware bewijst niet dat deze hier werkt. Vraag Shelly om de procedure voor jouw model en firmware. Gebruik het [USB-installatieprogramma](/nl/install/install-over-usb/) pas zodra USB-foutopsporing en een USB-dataverbinding beschikbaar zijn. Alleen een build met rootmogelijkheden schakelt foutopsporing niet in.

## Ook verkocht als

Shelly Wall Display X1i, firmwarecodenaam Cally.

|             |                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **RK3326-S**, Cortex-A35                                                                                                                                                                                                                                                                                                                                                     |
| Scherm      | **720×720 vierkant**, 4 inch                                                                                                                                                                                                                                                                                                                                                          |
| Android     | 11                                                                                                                                                                                                                                                                                                                                                                                    |
| ABI         | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                             |
| Sensoren    | Omgevingslicht en nabijheid gedocumenteerd; geen temperatuur- of luchtvochtigheidssensor; beschikbaarheid via Android-API niet geverifieerd                                                                                                                                                                                                                                           |
| Relais      | Verwisselbare basis: standaard 1 uitgang, optionele basis met 2 uitgangen                                                                                                                                                                                                                                                                                                             |
| Root        | Niet vastgesteld voor dit model; de moderne OTA vermeldt geen buildtype. Op een [Wall Display X2i](/nl/hardware/panels/shelly/wall-display-x2i/) getest met fabrieksfirmware 2.5.4 worden ontwikkelaarsopties en USB-foutopsporing vanuit de app Instellingen ontgrendeld en maakt adb vervolgens verbinding, nog steeds zonder root; of dit ook voor dit model geldt is niet getest. |
| Uitgebracht | Rond juli 2026 (schatting); Shelly kondigde de X1i aan op 15 juli 2026 ([verslag over de introductie, TechBuzz Ireland, juli 2026](https://techbuzzireland.com/2026/07/15/shelly-expands-its-smart-home-portfolio-with-wall-display-x1i-and-blu-motion-zb/))                                                                                                                          |

Vanaf Panel Assistant 1.0 gebruikt de X1i het gedeelde Shelly-profiel, met wat de [X2i](/nl/hardware/panels/shelly/wall-display-x2i/) over deze firmware liet zien: het scherm volledig uitschakelen zonder root, en Terug en Home zonder Recente apps. De eigen sensoren worden op het paneel gecontroleerd wanneer Panel Assistant start. Er is nog geen X1i bevestigd, dus een melding van een eigenaar is welkom; zie [Wat de X2i betekent voor de rest van de reeks](/nl/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Zie de [Wall Display-familiepagina](/nl/hardware/panels/shelly/) voor de volledige onderbouwing van het toegangsmodel, de OTA-update-eindpunten (kanaal `WallDisplayV2`) en de firmwareversiegeschiedenis.

## Bron

[Shelly Wall Display X1i-kennisbank](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
