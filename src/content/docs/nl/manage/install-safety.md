---
title: Installatieveiligheid
description: Wat Panel Assistant controleert voordat het een paneel wijzigt, waarom je een onderbroken installatie veilig opnieuw kunt uitvoeren en wat het vóór een update bewaart.
sourceCommit: 761d6a72fee28ab8639a6dca9fa60452d2cb5ff7
---

Panel Assistant installeert en actualiseert panelen vanuit Home Assistant en is zo gebouwd dat een installatie hetzelfde resultaat geeft, of je die nu eenmaal uitvoert of na een onderbreking opnieuw start. Deze pagina beschrijft wat het controleert en bewaart.

## Gecontroleerd voordat er iets verandert

Beide installatieprogramma's bekijken het paneel voordat ze het wijzigen. Het netwerkinstallatieprogramma controleert wat er al op het paneel staat en vraagt je de installatie te bevestigen. Een paneel waarop de paneelapp al draait, wordt gekoppeld in plaats van opnieuw geïnstalleerd. Het USB-installatieprogramma overschrijft geen andere bestaande installatie: als exact de geselecteerde build al is geïnstalleerd, voltooit het de configuratie van die build. Als er een andere build staat, verbindt het die opnieuw met Panel Assistant zonder een update te installeren.

De release komt uit je eigen Home Assistant. Home Assistant controleert die voordat het deze aan het installatieprogramma doorgeeft, zodat niets het paneel bereikt dat Home Assistant niet heeft geverifieerd. [Installeren via USB](/nl/install/install-over-usb/) en [Een paneel toevoegen](/nl/install/installing-ha-paneld/) beschrijven beide routes.

## Veilig opnieuw uitvoeren

Een installatie die halverwege stopt, kun je opnieuw uitvoeren. Via USB bewaart het installatieprogramma de voortgang in je browser, controleert het eerst elke stap waarbij het werd onderbroken en gaat het van daaruit verder in plaats van opnieuw te beginnen. Via het netwerk zorgt het opnieuw toevoegen van het paneel met hetzelfde adres ervoor dat Home Assistant het paneel opnieuw controleert voordat het iets wijzigt. Als de paneelapp al is geïnstalleerd, koppelt Home Assistant die en installeert het niets.

Als Home Assistant niet kan vaststellen hoe ver een installatie is gekomen, stopt het in plaats van te gokken, en vermeldt het bericht dat ook. [Probleemoplossing](/nl/manage/troubleshooting/#een-netwerkinstallatie-stopte-halverwege) legt elk bericht uit en beschrijft wat je vervolgens moet doen.

## Een back-up vóór elke update

Panel Assistant maakt vóór elke update een back-up van de paneelinstellingen en bewaart de laatste vijf back-ups per paneel. Na de update bevestigt het dat het paneel weer gezond is opgestart.

Maak zelf een volledige back-up vóór een wijziging waarover je twijfelt, en altijd voordat je de app verwijdert of de appgegevens wist: open in de webinterface van het paneel **Installeren**, dan **Back-up**, en controleer of het gedownloade `.hpb`-bestand niet leeg is. Het bevat instellingen, blijvende paneelstatus, de profielcatalogus en een daarvoor geschikte aanmelding die een afzonderlijke dashboardapp bewaart. De geleerde entiteitencatalogus en de nabijheids- en omgevingslichthistorie worden opnieuw geleerd in plaats van hersteld. Herstel de back-up via **Installeren**, dan **Herstellen**, op dezelfde pagina.

## Wat Panel Assistant ongemoeid laat

Panel Assistant flasht een paneel niet opnieuw, geeft het geen roottoegang en raakt de firmware van het paneel nooit aan. Back-up en herstel op firmwareniveau zijn op sommige geroote panelen een afzonderlijke, handmatige taak, beschreven in [firmwareback-up en -herstel](/nl/hardware/guides/firmware-backup-and-restore/). [Updates en herstel](/nl/manage/updates-and-recovery/) beschrijft wat je kunt herstellen als er iets misgaat.
