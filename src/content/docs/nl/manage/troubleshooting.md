---
title: Problemen oplossen
description: Wat er meestal misgaat met een wandpaneel en waar je het eerst moet kijken.
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
---

Begin bij het apparaat van het paneel in Home Assistant, met zijn statussensor en downloadbare diagnostiek, en de eigen statuspagina van het paneel: kies **Bezoeken** op de apparaatpagina in Home Assistant. Het rapport `/diag` beantwoordt de meeste onderstaande vragen zonder giswerk.

Wil je zien wat het paneel op dit moment doet, dan streamt het tabblad **Logs** op die pagina het eigen logboek van de paneel-app live, met tokens en wachtwoorden onleesbaar gemaakt.

![Het tabblad Logboeken in de webinterface van het paneel, met het live logboek van de paneel-app, een filtervak en bediening voor Volgen en Pauzeren](/screenshots/ui-logs-dark.png)

## Het dashboard is leeg, half getekend of vol scriptfouten

Controleer eerst de systeem-WebView. Dit is verreweg de meest voorkomende fout bij de eerste start, en een oude WebView veroorzaakt precies deze verschijnselen terwijl het op een fout in de paneel-app lijkt. De procedure staat in [De systeem-WebView bijwerken](/nl/hardware/guides/update-the-webview/).

Is de WebView actueel, dan beschrijft [Opstarten en herstel](/nl/manage/built-in-renderer/#opstarten-en-herstel) wat het paneel doet wanneer een dashboard niet laadt en hoe je de oorzaak kunt zien.

## Het dashboard is traag

Dit ligt deels aan het paneel en deels aan het dashboard. [Prestaties](/nl/manage/performance/) beschrijft wat de statuspagina van het paneel kan meten en wat meestal helpt, en de [hardwarereferentie](/nl/hardware/) rangschikt ondersteunde panelen, zodat je kunt beoordelen of je te veel van de hardware vraagt.

## Het installatieprogramma kan het paneel niet bereiken

Via het netwerk: controleer het paneeladres en of netwerk-ADB op TCP-poort 5555 nog aan staat, want sommige panelen zetten dat na een herstart weer uit. Toont het paneel een autorisatiemelding, keur die dan op het paneelscherm goed. Via USB: zorg dat je een op Chromium gebaseerde browser gebruikt, de kabel naar de computer met de browser loopt en USB-foutopsporing aan staat. Hoe je ontwikkelaarsopties bereikt en foutopsporing inschakelt, verschilt per model en staat in [Het paneel voorbereiden](/nl/install/prepare-a-panel/) en de [hardwarepagina’s](/nl/hardware/). Accepteert het paneel geen netwerkverbinding, [installeer dan via USB](/nl/install/install-over-usb/): het paneel heeft geen netwerk-ADB nodig, terwijl je browser met Home Assistant verbonden blijft voor de geverifieerde release.

## Een netwerkinstallatie stopte halverwege

Wanneer Home Assistant een netwerkinstallatie stopt, vermeldt de melding hoever die kwam. Zoek hieronder de zin die met jouw melding overeenkomt. Verwijder in geen van de gevallen Panel Assistant, wis de appgegevens niet en reset het paneel niet: de toestand van het paneel vertelt waar de installatie stopte.

Waar de onderstaande stappen zeggen dat je de integratie opnieuw moet toevoegen: als het paneel al is toegevoegd en deze melding verscheen bij het toestaan van updates in **Configureren** of een Repair, probeer je het daar opnieuw en voeg je de integratie niet opnieuw toe.

### Er is geen APK geïnstalleerd

Zegt de melding dat er geen APK is geïnstalleerd of geen paneelwijziging is gedaan, dan stopte de installatie voordat iets werd veranderd. Controleer of het paneel aan staat en op hetzelfde adres op je netwerk zit. Voeg de Panel Assistant-integratie opnieuw toe en voer hetzelfde adres in. Home Assistant controleert het paneel opnieuw voordat het iets verandert. Stopt de installatie een tweede keer op dezelfde plek, bekijk dan het paneel en volg het volgende gedeelte als Panel Assistant erop staat.

### Geïnstalleerd maar niet gestart of gecontroleerd

Zegt de melding dat de APK is geïnstalleerd maar Panel Assistant niet startte of niet door de controle kwam, dan staat de app op het paneel en ontbreekt alleen de laatste stap. Open Panel Assistant vanuit de applijst van het paneel en wacht op het instelscherm. Voeg daarna de Panel Assistant-integratie opnieuw toe met hetzelfde adres: wanneer de app antwoordt, biedt Home Assistant aan hem te verbinden ('Panel Assistant is geïnstalleerd maar niet verbonden') en installeert het niets. Zegt Home Assistant dat de geïnstalleerde app niet de gekozen release is, kies dan de versie die geïnstalleerd is. Je vindt die in de Android-instellingen van het paneel onder Apps › Panel Assistant. Opent Panel Assistant niet of verschijnt het instelscherm nooit, probeer de automatische installatie dan niet opnieuw: vraag om hulp zoals het volgende gedeelte beschrijft.

### De installatie heeft het paneel mogelijk gewijzigd

Zegt de melding dat het installatieprogramma “is gestopt met een onbekend resultaat”, dat de installatie het paneel mogelijk heeft gewijzigd, dat Home Assistant het resultaat niet kon verifiëren of niet kan bewijzen dat doorgaan veilig is, dan kon Home Assistant niet vaststellen hoever het paneel kwam en stopt het in plaats van te gokken. Probeer de automatische installatie nog niet opnieuw. Bekijk eerst het paneel: verschijnt het instelscherm of dashboard van Panel Assistant, of opent de app vanuit de applijst, volg dan het bovenstaande gedeelte om het te verbinden. Staat Panel Assistant niet op het paneel, vraag dan hulp in de [integratie-issues](https://github.com/panel-assistant/ha-integration/issues) en vermeld het paneelmodel, de gekozen versie, de volledige melding en de Home Assistant-logregels van de installatie (zoek in het logboek naar `panel_assistant`).

## De hardware van het paneel ontbreekt in Home Assistant

Verschijnen sommige entiteiten wel en andere niet, dan ligt dit meestal aan het hardwareprofiel voor het model en niet aan een verbindingsprobleem. De [hardwarepagina’s](/nl/hardware/) vermelden wat elk paneel beschikbaar stelt.

## Iets anders

Staat het antwoord niet op deze site of in de gekoppelde referentiedocumentatie, vraag dan in de [integratie-issues](https://github.com/panel-assistant/ha-integration/issues) of, voor de paneel-app zelf, de [ha-paneld-issues](https://github.com/panel-assistant/android/issues). Vermeld het paneelmodel, de versie op de apparaatpagina en de gedownloade diagnostiek, want elk antwoord begint met die drie. De diagnostiek is al ontdaan van gevoelige gegevens, maar lees haar voordat je haar openbaar plaatst en verwijder overgebleven gegevens die je paneel, netwerk of Home Assistant-installatie identificeren.
