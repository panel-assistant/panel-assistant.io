---
title: adb- en roottoegang verkrijgen
description: Hoe elk gedocumenteerd wandpaneel adb en root bereikt, waarvoor de paneel-app root gebruikt en waar de precieze procedure per model staat.
sidebar:
  label: adb- en roottoegang
  order: 1
sourceCommit: f49bf12954ed3e89e5e32d635b4bbcb06095cf9b
---

Elk paneel bereikt adb en, waar beschikbaar, root via een andere route. Deze pagina geeft het algemene beeld; de precieze firmwareafhankelijke stappen staan op de pagina van elk paneel.

## Waarvoor root dient

De paneel-app installeert en draait zonder root. Root is alleen van belang voor hardware die Android niet aan een gewone app beschikbaar stelt:

- **Sysfs- en invoerknooppunten van `system`.** Op sommige panelen zijn de led, knopverlichting en klimaatsensoren bestanden met eigenaar `system:system`, die een afgeschermde app niet kan schrijven of lezen. De paneel-app communiceert dan via een Unix-socket met een kleine root-helperdaemon, `hapaneld-helper`. Zie de [helperdocumentatie](https://github.com/panel-assistant/android/blob/main/helper/README.md).
- **De achtergrondverlichting werkelijk uitschakelen, herstarten en de CPU-governor besturen.** Zonder rootroute vallen die terug op wat Android toestaat, bijvoorbeeld helderheid nul in plaats van de achtergrondverlichting stroomloos maken.
- **Relais en GPIO-lijnen**, waar een paneel die alleen via root-sysfs beschikbaar stelt.

De paneelapp controleert routes met verhoogde rechten wanneer ze die gebruikt. Een paneel zonder root heeft nog steeds het dashboard, de standaardsensoren, helderheidsregeling en de ondersteunde navigatie. Sommige bedieningselementen die verhoogde rechten vereisen, blijven zichtbaar als hun status kan worden uitgelezen, maar het wijzigen ervan kan mislukken als geen enkele route met verhoogde rechten werkt.

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
- Controleer wat een update van de fabrikant verandert voordat je beslist of je die uitstelt: updates kunnen wijzigingen in de toegang terugdraaien, maar ook beveiligingslekken verhelpen. Zie [Firmware-updates en mogelijkheden](/nl/hardware/firmware/#firmware-updates-and-capabilities) en [Ongewenste updates stoppen](/nl/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Maak een partitieback-up voordat je firmware op een geroot Rockchip-paneel wijzigt. Zie [Firmwareback-up en herstel](/nl/hardware/guides/firmware-backup-and-restore/).
- Sommige routes vereisen `adb disable-verity`, wat het paneel herstart. Een met een pincode beveiligd paneel kan na een herstart zijn apps pas starten als iemand de pincode invoert, dus zorg dat je erbij bent.

## Mogelijke routes op andere firmware

[CVE-2026-43499](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/43xxx/CVE-2026-43499.json) is een kwetsbaarheid in de Linux-kernel waarmee code die al lokaal wordt uitgevoerd hogere rechten kan verkrijgen. Het is een onderzoekskandidaat voor andere huidige en toekomstige paneelfamilies, niet alleen voor Meta Portal. Een kernelversie alleen toont niet aan dat er op een build van de fabrikant een bruikbare route bestaat: patches, de kernelconfiguratie en apparaatbeperkingen moeten worden gecontroleerd.

Houd drie vragen gescheiden: kan een eigenaar eerst code installeren of uitvoeren; kan die code kernelrechten verkrijgen; en kan de paneel-app de resulterende toegang gebruiken, ook na een herstart? Tijdelijke rechten zouden kunnen helpen bij de installatie, ADB minder omslachtig maken, beheerinstellingen wijzigen of toegang tot afgeschermde hardware mogelijk maken. Op zichzelf levert dit geen blijvende roottoegang of een voor apps toegankelijke helper op.

Het [onderzoek naar Meta Portal](/nl/hardware/panels/meta/#cve-2026-43499-and-community-provisioning) is een voorbeeld met exact gerapporteerde doelen en expliciete beperkingen. Het is geen algemeen installatieprogramma voor Panel Assistant en ook geen nieuw geleverde functie. De toepasbaarheid op Shelly en op gepatchte builds van fabrikanten is niet vastgesteld. Normale installatie en dagelijks gebruik blijven zonder root mogelijk waar het paneel die ondersteunt.
