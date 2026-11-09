---
title: Updates en herstel
description: De app op een paneel actueel houden en wat je kunt herstellen wanneer er iets misgaat.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

## Een paneel bijwerken

**Vanuit Home Assistant.** Elk paneel heeft een update-entiteit. Zodra een nieuwere versie is gepubliceerd, biedt de entiteit die aan en installeer je met één druk op de knop; Panel Assistant installeert de update en bevestigt dat het paneel gezond is teruggekomen. Gebruik deze route. De [releasenotities](/nl/release-notes/) vermelden wat er in elke versie is veranderd.

Een update begint wanneer Panel Assistant of jij er expliciet om vraagt. De paneel-app installeert geen geplande updates. Via het tabblad **Installeren** in de webinterface kun je ook een versie van de paneel-app kiezen en installeren, inclusief een prerelease. Die keuze geldt voor de installatie die je start; er is geen opgeslagen updatekanaal.

In de nog niet uitgebrachte versie 1.0.0-rc2 kan een vanuit Home Assistant gestarte paneel-app-update op ondersteunde panelen ook een geverifieerde, compatibele systeem-WebView installeren. Blijft de browser-enginefase onafgerond, gebruik dan **Opnieuw proberen** in de update-reparatie. Daarbij wordt bestaand werk gecontroleerd voordat een nieuwe poging wordt aangevraagd; er is geen geplande nieuwe poging. Andere panelen hebben nog de Play Store, firmware van de fabrikant of de handmatige route onder [De systeem-WebView bijwerken](/nl/hardware/guides/update-the-webview/) nodig.

In die versie kan een ondersteund geroot paneel netwerk-ADB uit laten terwijl Panel Assistant het via de geauthenticeerde app-verbinding beheert. App-updates en ondersteund onderhoud gebruiken die verbinding en het bevoorrechte installatieprogramma van het paneel. De lokale herstelservice kan netwerk-ADB weer openen als de app-verbinding niet meer wordt vernieuwd of herstel dat vereist.

### Panelen die ADB nodig hebben

Installeer je vanuit Home Assistant een update, dan gebruikt Panel Assistant automatisch ADB voor panelen die de update niet zelf kunnen installeren. Accepteert het paneel de verbinding zonder aanraking op het scherm, dan dekt je oorspronkelijke toestemming om Panel Assistant te installeren ook het aanmaken en opslaan van een ADB-sleutel voor toekomstige updates. Vereist het paneel goedkeuring op zijn scherm, dan maakt Home Assistant een reparatie aan die het paneel noemt en de autorisatie start. Volg die reparatie om de melding op dat paneel goed te keuren.

### Een paneel dat niet kan worden bijgewerkt

Sommige panelen kunnen alleen via ADB worden bijgewerkt, omdat ze zelf geen app kunnen installeren. Daar is ADB geen gemak: het is de volledige updateroute. Als die niet meer werkt, blijft het paneel normaal werken, maar stilzwijgend op zijn huidige versie. Home Assistant toont dan een reparatie met de naam van het paneel.

De oorzaak is meestal een wijziging op het paneel in plaats van in Home Assistant. Een firmware-update van de fabrikant, een fabrieksreset of een fabrieksoptie die de oorspronkelijke software herstelt, kan de ontwikkelaarsopties van Android weer uitschakelen, en daarmee ADB. Op dat moment volgt geen waarschuwing, want vanuit het paneel gezien is er niets mis.

Op de meeste panelen herstelt het opnieuw inschakelen van ontwikkelaarsopties en USB-foutopsporing de updateroute. De stappen zijn dezelfde als bij het eerste voorbereiden van dat paneel: zie [Het paneel voorbereiden](/nl/install/prepare-a-panel/#1-ontwikkelaarsopties-en-foutopsporing-staan-aan). Hoe je die instellingen bereikt, verschilt per paneel; sommige fabrikanten verbergen ze achter een reeks tikken op een Over-scherm.

Blijft de reparatie staan of zet het paneel netwerkfoutopsporing zelf uit, zoals een Meta Portal na een herstart of een Shelly Wall Display na een reset, sluit het paneel dan via USB op je computer aan en start het USB-installatieprogramma vanuit Home Assistant, zoals bij [Installeren via USB](/nl/install/install-over-usb/#het-begint-in-home-assistant). Je hoeft eerst niets te verwijderen: op een paneel waarop de app al staat, installeert het installatieprogramma niets. Vink zo nodig **Altijd toestaan vanaf deze computer** aan en tik op **Toestaan**; het installatieprogramma zet netwerkfoutopsporing weer aan en meldt dat Panel Assistant het paneel weer kan bereiken. Home Assistant biedt daarna de paneelupdate aan, die instellingen en geschiedenis behoudt.

Toont Home Assistant ook **Updates toestaan op …** voor het paneel, dan is het bereikbaar maar heeft het deze Home Assistant nog niet geaccepteerd. Open die reparatie, of ga naar **Instellingen**, **Apparaten en diensten**, **Panel Assistant**, kies **Configureren** voor het paneel en dan **Updates toestaan**, en tik op **Toestaan** op het paneel wanneer daarom wordt gevraagd.

## Wat een update beschermt

Panel Assistant controleert het paneel voordat het iets verandert en maakt vóór elke update een back-up van de paneelinstellingen. Het bewaart de laatste vijf back-ups per paneel.

Maak vóór een wijziging waarover je twijfelt zelf een back-up: open in de webinterface van het paneel **Installeren** en dan **Back-up**, en bewaar het gedownloade `.hpb`-bestand.

## Herstel

Een dashboard dat na een update niet laadt, heeft meestal een probleem met de systeem-WebView of het dashboard zelf. Het paneel heeft daarvoor eigen gedrag bij [opstarten en herstel](/nl/manage/built-in-renderer/#opstarten-en-herstel). [Problemen oplossen](/nl/manage/troubleshooting/) behandelt de gebruikelijke oorzaken. Een paneel met de 1.0-paneel-app kan niet terug naar een eerdere release; [Upgraden naar 1.0](/nl/manage/upgrade-to-1-0/#teruggaan) legt uit wat wel kan.

Herstel onder de app is een ander verhaal. Panel Assistant raakt nooit de firmware van een paneel aan, maar op sommige gerote panelen kun je handmatig een back-up van de firmwarepartities maken en die herstellen. Dat staat beschreven in [Firmwareback-up en herstel](/nl/hardware/guides/firmware-backup-and-restore/).

:::danger
Firmwareherstel is experimenteel en is niet getest op een onbruikbaar geraakt apparaat. Beschouw werken op partitieniveau als iets dat een paneel onbruikbaar kan maken en lees dat document volledig voordat je begint.
:::
