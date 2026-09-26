---
title: Een paneel kiezen
description: De Android-wandpanelen die Panel Assistant nu ondersteunt, wat een paneel geschikt maakt, en hoe je een model dat niet in de lijst staat ondersteund krijgt.
sourceCommit: cb91a53b7fe4ae129274b56dae846d3dcc4a9eff
---

De meeste wandpanelen worden via buitenlandse marktplaatsen gekocht, op basis van niet veel meer dan een advertentie en een beetje hoop. Deze pagina is de controle die je doet voordat je koopt. Op elk model dat hier staat draait Panel Assistant, en eigenaren hebben ze allemaal op echte hardware bevestigd, behalve de Shelly Wall Display-familie: daarvan is één X2i-exemplaar getest en de rest van de familie is gedocumenteerd en wacht op een eerste bevestigd exemplaar.

:::tip
Elk model heeft een eigen [hardwarepagina](/nl/hardware/) met een factsheet, wat er in Home Assistant terechtkomt en hoe je het aan de praat krijgt.
:::

## Generieke ondersteuning: elk ander Android-paneel

**Een paneel dat niet op deze pagina staat, is niet een niet-ondersteund paneel.** Panel Assistant hoeft je hardware niet te herkennen om erop te draaien. Elk paneel dat aan de vereisten verderop voldoet, start met het generieke profiel, en voor de meeste mensen is dat al het paneel dat ze wilden: het dashboard van Home Assistant op het scherm, schermhelderheid en slaapstand, audio, navigatie en de standaard Android-sensoren zoals licht en nabijheid, die allemaal in Home Assistant verschijnen als entiteiten op het eigen apparaat van het paneel.

Wat het eigen profiel van een model toevoegt, is de hardware die specifiek is voor dat model: RGB-leds, fysieke knoppen, relais, fabrikantspecifieke radio's en klimaatchips. Veel panelen hebben daar niets van, en veel eigenaren hebben nooit nodig wat hun paneel wel heeft. In die gevallen is het generieke profiel geen mindere instelling die je moet verdragen tot er iets beters komt: het is de volledige set functies.

Koop dus op basis van de vereisten hieronder in plaats van op basis van deze lijst, en zie een eigen profiel als een bonus als dat er is.

## Volledige ondersteuning

Getest op exemplaren die we in handen hebben, met de meest uitgebreide hardwaredekking: scherm, leds, knoppen, sensoren en relais, voor zover het model die heeft.

- **[Sonoff NSPanel Pro](/nl/hardware/panels/sonoff-nspanel-pro/)** (inclusief de 120- en 86-varianten)
- **[Tuya TPA10](/nl/hardware/panels/tuya-tpa10/)**
- **[Electron WF1589T](/nl/hardware/panels/electron-wf1589t/)**

## Getest door de community

Eigenaren draaien Panel Assistant op deze modellen. Hun profielen zijn samengesteld op basis van meldingen van eigenaren, en op elke hardwarepagina zie je precies welke hardware van het paneel in Home Assistant terechtkomt.

- **[ZHICAI SMT1019](/nl/hardware/panels/zhicai-smt1019/)**
- **[ZX-SMT156 / RK3566_T](/nl/hardware/panels/zx-smt156/)**
- **[Smatek S9E](/nl/hardware/panels/smatek-s9e/)**

## Voorlopig

Onderzocht op één fysiek exemplaar; de hardwaredekking wordt nog bevestigd.

- **[Shelly Wall Display X2i](/nl/hardware/panels/shelly/wall-display-x2i/)**

## Gedocumenteerd

Profielen opgesteld op basis van firmware-onderzoek, klaar om door de eerste eigenaar op een exemplaar te worden bevestigd. Als je er een hebt, is een melding de snelste manier om het hoger op deze pagina te krijgen.

- [Shelly Wall Display](/nl/hardware/panels/shelly/) X2, X1i en XL

## Wat maakt een paneel geschikt

- **Android 8.0 of nieuwer.**
- **Ontwikkelaarsopties.** Het installatieprogramma gebruikt de foutopsporingsinterface van Android, die je op bijna elk paneel kunt inschakelen.
- **Elke systeem-WebView.** Fabrikanten leveren vaak een browser-engine die jaren verouderd is. Panel Assistant controleert die en installeert, waar het paneel dat toestaat, een versie waarvan bekend is dat die goed werkt. [Het paneel voorbereiden](/nl/install/prepare-a-panel/) behandelt de rest.
- **Een hardwareprofiel, alleen als je de extra's wilt.** Alles hierboven is genoeg voor het generieke profiel. Het eigen profiel van een model is wat de leds, knoppen, relais en modelspecifieke sensoren bereikt, zoals [Generieke ondersteuning](#generieke-ondersteuning-elk-ander-android-paneel) beschrijft.
- **Root, voor een paar extra's.** Een paar functies op sommige modellen hebben root nodig. Op elke hardwarepagina staat welke, en hoe je root krijgt.

## Staat je paneel er niet bij?

Hardwareondersteuning is data, geen code, dus een nieuw paneel is een profiel en geen nieuwe build van de app, en de snelste manier om je model ondersteund te krijgen is het te melden. Vermeld in de [issues](https://github.com/panel-assistant/android/issues) welk model het is en wat er gebeurde, en als je zin hebt, beschrijft de [profieldocumentatie](/nl/reference/profiles/) wat een profiel bevat. Elke melding, of het nu werkt of niet, brengt het project dichter bij ondersteuning voor elk paneel.
