---
title: adb- en roottoegang verkrijgen
description: Hoe elk gedocumenteerd wandpaneel adb en root bereikt, waarvoor de paneel-app root gebruikt en waar de precieze procedure per model staat.
sidebar:
  label: adb- en roottoegang
  order: 1
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Elk paneel bereikt adb en, waar beschikbaar, root via een andere route. Deze pagina geeft het algemene beeld; de precieze firmwareafhankelijke stappen staan op de pagina van elk paneel.

## Waarvoor root dient

De paneel-app installeert en draait zonder root. Root is alleen van belang voor hardware die Android niet aan een gewone app beschikbaar stelt:

- **Sysfs- en invoerknooppunten van `system`.** Op sommige panelen zijn de led, knopverlichting en klimaatsensoren bestanden met eigenaar `system:system`, die een afgeschermde app niet kan schrijven of lezen. De paneel-app communiceert dan via een Unix-socket met een kleine root-helperdaemon, `hapaneld-helper`. Zie de [helperdocumentatie](https://github.com/panel-assistant/android/blob/main/helper/README.md).
- **De achtergrondverlichting werkelijk uitschakelen, herstarten en de CPU-governor besturen.** Zonder rootroute vallen die terug op wat Android toestaat, bijvoorbeeld helderheid nul in plaats van de achtergrondverlichting stroomloos maken.
- **Relais en GPIO-lijnen**, waar een paneel die alleen via root-sysfs beschikbaar stelt.

De paneel-app controleert elke bevoorrechte route wanneer hij die gebruikt. Een paneel zonder root krijgt dus nog steeds het dashboard, standaardsensoren, helderheid en navigatie. Een functie die root nodig heeft, wordt als niet beschikbaar getoond in plaats van te mislukken.

## Routes per paneel

- **[Sonoff NSPanel Pro](/nl/hardware/panels/sonoff/#gaining-adb-and-root-access).** Een `userdebug`-build met testsleutels en **zonder adb-wachtwoord**. De enige hindernis is de ontwikkelaarsmodus bereiken, wat afhangt van de eWeLink-firmware. Daarna `adb root`, opnieuw aankoppelen en een blijvende `su` installeren.
- **[Tuya TPA10](/nl/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access).** adb is **met een wachtwoord beveiligd**. De betrouwbare route is de achterdeur via de USB-diagnoseapp, en `su` is al aanwezig. Een kort script maakt netwerk-adb daarna blijvend beschikbaar over herstarts heen.
- **[Electron WF1589T](/nl/hardware/panels/electron/wf1589t/#gaining-adb-and-root-access).** Een `userdebug`-build met Google Play. `adb root` werkt direct. De led is rechtstreeks vanuit de app te bedienen, dus root is zelden nodig.
- **[Electron WF2489T (ZHICAI SMT1019)](/nl/hardware/panels/electron/wf2489t/#root-access-by-firmware-build).** De productiebuild uit de winkel heeft geen root. De `userdebug`-build van de leverancier is geroot, maar vereist opnieuw aankoppelen voordat de helper blijvend kan worden geïnstalleerd.
- **[SMT156](/nl/hardware/panels/electron/smt156/).** Geen vanuit apps toegankelijke `su` op de gemelde installatie. USB `adb root`, de engineeringmodus van de fabrikant en blijvende ontgrendelroutes zijn niet getest.
- **[Smatek S9E](/nl/hardware/panels/smatek/s9e/).** De fabrieksapp voert rootopdrachten uit en sommige exemplaren worden met ontgrendelde ontwikkelaarsmodus geleverd. `su` op appniveau is gemeld op firmware 1.1.0; toegang hangt nog af van het exemplaar en de firmware.
- **[Shelly Wall Display](/nl/hardware/panels/shelly/).** Op een [Wall Display X2i](/nl/hardware/panels/shelly/wall-display-x2i/), getest met fabrieksfirmware 2.5.4, worden ontwikkelaarsopties en USB-foutopsporing via de app Instellingen ontgrendeld. adb verbindt daarna zonder autorisatiemelding en er is geen root: geen `su`, en `adb root` is niet beschikbaar. De paneel-app installeren en dagelijks gebruiken vereist daar geen root, maar de bevoorrechte functies op deze pagina wel. De andere modellen zijn niet getest; de oudere firmware is gericht op een `userdebug`-basisbuild, dus `adb root` werkt daar mogelijk als een adb-verbinding tot stand kan worden gebracht.

## Voordat je iets verandert

- Zorg dat adb betrouwbaar werkt, bij voorkeur via het netwerk met de sleutel van je werkstation vooraf geautoriseerd, voordat je een fabrieksapp uitschakelt. Eerst een launcher, instellingenapp of hardware-app van de fabrikant uitschakelen kan je buitensluiten.
- Houd een manier om te navigeren. Op een paneel zonder knoppen vervangen de navigatieacties van de paneel-app Terug en Recente apps van de fabrikant.
- Stop de updater van de fabrikant als die er is, anders kan een draadloze update je wijzigingen terugdraaien. Zie [Ongewenste updates stoppen](/nl/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Maak een partitieback-up voordat je firmware op een geroot Rockchip-paneel wijzigt. Zie [Firmwareback-up en herstel](/nl/hardware/guides/firmware-backup-and-restore/).
- Sommige routes vereisen `adb disable-verity`, wat het paneel herstart. Een met een pincode beveiligd paneel kan na een herstart zijn apps pas starten als iemand de pincode invoert, dus zorg dat je erbij bent.
