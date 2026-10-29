---
title: Shelly Wall Display XL
description: Hardwaregegevens van de Shelly Wall Display XL, een 10,1-inch RK3566-paneel met Android 11, codenaam Blake.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 in
support: Niet getest
root: Niet vastgesteld voor dit model
webview: 'Niet vastgesteld (het WallDisplayV2-kanaal bevat geen OTA-WebView-pakket)'
released: '2025-09 (schatting)'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL, voorkant
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL, recht van voren gezien scherm
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL, zijaanzicht met montagediepte
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
---

:::note
**Geen exemplaar van dit model is getest.** Zie de [Wall Display-familiepagina](/nl/hardware/panels/shelly/) voor broninformatie, het OTA-firmwaremechanisme, het toegangsmodel en beveiligingsnotities voor de hele reeks.
:::

De Wall Display XL, firmwarecodenaam **Blake**, is een 10,1-inch paneel met een Rockchip RK3566 (Cortex-A55) en Android 11: het grootste en krachtigste model in de [Shelly Wall Display-familie](/nl/hardware/panels/shelly/). Het gebruikt het moderne **WallDisplayV2** (arm64-v8a) OTA-kanaal, samen met de [X1i](/nl/hardware/panels/shelly/wall-display-x1i/), [X2i](/nl/hardware/panels/shelly/wall-display-x2i/), Maverick en Dayna, en heeft toegang tot de ingebouwde AppStore.

## Eerste toegang voor foutopsporing

**Netwerk-ADB op TCP-poort 5555 zonder computer: niet vastgesteld voor dit model.** Ook de eerste USB-foutopsporing en het ontgrendelen van het leveranciersmenu zijn hier niet geverifieerd. De [X2i-procedure](/nl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) is alleen bevestigd op de X2i; gedeelde firmware bewijst niet dat deze hier werkt. Vraag Shelly om de procedure voor jouw model en firmware. Gebruik het [USB-installatieprogramma](/nl/install/install-over-usb/) pas zodra USB-foutopsporing en een USB-dataverbinding beschikbaar zijn. Alleen een build met rootmogelijkheden schakelt foutopsporing niet in.

## Ook verkocht als

Shelly Wall Display XL, firmwarecodenaam Blake.

|             |                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                                                                                                                                                       |
| Scherm      | 10,1 inch                                                                                                                                                                                                                                                                                                                                                                             |
| Android     | 11                                                                                                                                                                                                                                                                                                                                                                                    |
| ABI         | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                             |
| Sensoren    | Omgevingslicht gedocumenteerd; een bewegingssensor (officieel, exacte technologie niet geverifieerd); beschikbaarheid via Android-API niet geverifieerd                                                                                                                                                                                                                               |
| Relais      | 1 uitgang                                                                                                                                                                                                                                                                                                                                                                             |
| Root        | Niet vastgesteld voor dit model; de moderne OTA vermeldt geen buildtype. Op een [Wall Display X2i](/nl/hardware/panels/shelly/wall-display-x2i/) getest met fabrieksfirmware 2.5.4 worden ontwikkelaarsopties en USB-foutopsporing vanuit de app Instellingen ontgrendeld en maakt adb vervolgens verbinding, nog steeds zonder root; of dit ook voor dit model geldt is niet getest. |
| Uitgebracht | Rond september 2025 (schatting); Shelly introduceerde de XL in Europa rond 10 september 2025 ([verslag over de introductie, Notebookcheck, september 2025](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html))                                                                                                                          |

:::caution
De ingebouwde Home Assistant-browser op de XL had problemen met weergave en indeling bij Home Assistant-frontend 2025.12 en een pre-release van 2026.1 (bijgehouden in [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) en `#28746`; core-compatibiliteit in [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). Een app die de systeem-WebView op hetzelfde apparaat gebruikte gaf alles correct weer. Dat toont dat het probleem specifiek was voor de WebView van de ingebouwde browser en niet voor de hardware.
:::

Vanaf Panel Assistant 1.0 gebruikt de XL het gedeelde Shelly-profiel, met wat de [X2i](/nl/hardware/panels/shelly/wall-display-x2i/) over deze firmware liet zien: het scherm volledig uitschakelen zonder root, en Terug en Home zonder Recente apps. De eigen sensoren worden op het paneel gecontroleerd wanneer Panel Assistant start. Er is nog geen XL bevestigd, dus een melding van een eigenaar is welkom; zie [Wat de X2i betekent voor de rest van de reeks](/nl/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Zie de [Wall Display-familiepagina](/nl/hardware/panels/shelly/) voor de volledige onderbouwing van het toegangsmodel, de OTA-update-eindpunten (kanaal `WallDisplayV2`) en de firmwareversiegeschiedenis.

## Bron

[Shelly Wall Display XL-kennisbank](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
