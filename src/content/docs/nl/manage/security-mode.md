---
title: Beveiligingsmodus
description: Het standaardgedrag van het paneel op een vertrouwd netwerk en de modus Hardened, die goedkeuring op het paneel vereist voor externe handelingen met grote gevolgen.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

De webinterface, API en Home Assistant-bediening van het paneel zijn ontworpen voor een vertrouwd thuisnetwerk. **Relaxed** is de standaardmodus: automatiseringen, installatiehulpmiddelen en browserhandelingen werken zonder extra vraag. Eén handeling valt bewust buiten die regel. De camera via zijn Home Assistant-entiteit aanzetten vraagt in elke modus, ook Relaxed, om goedkeuring op het paneel. De camera-instelling in Configureren is een afzonderlijke configuratieroute voor de eigenaar. Uitzetten vraagt nooit om goedkeuring.

Voor een paneel op een netwerk met minder vertrouwde apparaten voegt de optionele modus **Hardened** persoonlijke goedkeuring toe aan geselecteerde netwerkbewerkingen met grote gevolgen. Dit is een extra veiligheidsgrens, geen vervanging voor een afzonderlijk netwerk of firewall en geen algemene API-authenticatie. Alleen-lezen-eindpunten en gewone paneelbediening blijven beschikbaar volgens het normale model van een vertrouwd netwerk.

**In Hardened vereisen beschermde rechtstreekse LAN-verzoeken fysieke toegang tot het paneel. Ze kunnen pas doorgaan als iemand ze op het paneelscherm goedkeurt, en die goedkeuring kan niet op afstand worden gegeven.**

Beheerders kunnen via de geauthenticeerde Panel Assistant-zijbalk geselecteerde gewone beheertaken zonder fysieke melding uitvoeren: beeldscherm- en voedingsconfiguratie, bevestiging van voedingsveiligheid, profielactivering, media afspelen, fabriekspakketten temmen en het dashboard herladen. Installeren, verwijderen, back-ups, herstellen, herstarten en andere beschermde bewerkingen vereisen nog goedkeuring op het paneel. Rechtstreekse LAN-verzoeken krijgen deze uitzondering niet.

De webinterface markeert betrokken handelingen in beide modi met een klein schild, zodat je vóór het inschakelen ziet welke procedures de goedkeuringsgrens overschrijden.

## Hardened inschakelen

Deze instelling kan alleen op het paneel zelf worden gewijzigd:

1. Open het scherm **Configureren** van de paneel-app op het paneel.
2. Open het overloopmenu van de werkbalk en kies **Beveiligingsmodus**.
3. Kies **Hardened-modus inschakelen**.

Netwerk-ADB en draadloze foutopsporing van Android moeten eerst beide uit staan, omdat elk een externe ADB-client invoer op het goedkeuringsscherm laat injecteren. Voordat de wijziging wordt vastgelegd, controleert de paneel-app alle ondersteunde Android-eigenschappen voor netwerk-ADB, blijvende netwerk-ADB, expliciete ADB-luisteradressen en de toestand van draadloze foutopsporing. Ook stopt hij elke actieve WebView-ontwikkeltoolsrelay op het netwerk en controleert of proces en luisterpoort verdwenen zijn. Kan hij niet vaststellen dat deze afstandsbedieningsroutes inactief zijn, dan weigert hij Hardened in te schakelen. Zet ADB en draadloze foutopsporing uit in de ontwikkelaarsopties van Android en probeer opnieuw. Mislukt de verificatie van de relay, herstart dan het paneel voordat je opnieuw probeert.

De instelling hoort uitsluitend bij het paneel. Ze zit niet in configuratie-exporten of volledige back-ups en kan niet worden gewijzigd via de API, vanuit Home Assistant, door herstel, door configuratie-import of door een update over meerdere panelen. Een bestaand paneel blijft dus in Relaxed totdat iemand Hardened op het paneel inschakelt.

Gebruik hetzelfde menu om terug te gaan naar Relaxed. Daarbij worden openstaande goedkeuringsverzoeken gewist.

## Een netwerkverzoek goedkeuren

Wanneer Hardened een beschermd API-verzoek onderschept, geeft de eerste poging HTTP `202 Accepted` terug met een antwoord `approval-required`, bijvoorbeeld:

```json
{
  "ok": false,
  "error": "approval-required",
  "approval_id": "…",
  "message": "Approve this request physically on the panel, then retry it; it cannot be approved remotely."
}
```

De bewerking afronden:

1. Open op het paneel **Configureren**, het overloopmenu van de werkbalk, **Beveiligingsmodus** en dan **Goedkeuringen controleren**.
2. Controleer de bewerking, samenvatting en het aanvragende apparaat en keur goed of weiger.
3. Stuur binnen tien minuten na het oorspronkelijke verzoek exact hetzelfde verzoek opnieuw vanaf hetzelfde apparaat.

Een goedkeuring is gebonden aan de bewerking, het aanvragende apparaat en de beschermde inhoud van het verzoek en is eenmaal bruikbaar. Het verzoek wijzigen, vanaf een ander adres verzenden, langer dan tien minuten wachten of de paneel-app herstarten vereist een nieuwe goedkeuring. Alleen de overeenkomende nieuwe poging verbruikt een goedkeuring; het is geen tijdelijke algemene vrijstelling.

Opdrachten van native Home Assistant-entiteiten en automatiseringen dragen de transportherkomst van Panel Assistant in plaats van de identiteit van de individuele gebruiker. Hun goedkeuringen zijn aan die herkomst en de exacte opdracht gebonden. Dit verschilt van de bovenstaande uitzondering voor de geauthenticeerde beheerderszijbalk.

Verzoeken via loopback van software die al op het paneel draait, hebben geen netwerkgoedkeuring nodig. Hardened vertrouwt lokale Android-apps en isoleert apps op het paneel niet van elkaar, dus houd niet-vertrouwde apps van het paneel.

## Beschermde bewerkingen

In Hardened heeft een rechtstreekse netwerkclient goedkeuring op het paneel nodig om:

- een geüploade app of een beheerde kopie van de paneel-app of een afzonderlijke dashboardapp te installeren;
- een app te verwijderen of te wijzigen of een fabriekspakket ingeschakeld is, draait of over het scherm mag tekenen;
- een volledige back-up of een configuratiebundel met geheimen te exporteren;
- een configuratie te importeren, een opgeslagen configuratierevisie te herstellen of een paneelback-up te herstellen;
- een hardwareprofiel te activeren of terug te draaien;
- media van een externe URL af te spelen;
- de dashboardrenderer te herladen of het paneel te herstarten;
- een app via een link te downloaden, waarvoor apart van de installatie goedkeuring nodig is: de download is aan de SHA-256 van die exacte URL gebonden en er wordt pas na goedkeuring een verbinding geopend, dus installeren via een link vraagt in Hardened tweemaal;
- databaseherstelonderhoud voort te zetten;
- de configuratie van een afzonderlijke dashboardapp te repareren of de browsergegevens van de ingebouwde renderer te wissen;
- de systeemschermdichtheid of lettertypeschaal te wijzigen;
- de ingestelde beveiligingen tegen slapen of dimmen bij inactiviteit, die het paneel bereikbaar houden, via Configureren of Home Assistant uit te schakelen;
- de voedingsveiligheidsinstellingen van het paneel te repareren; of
- één exacte, ongewijzigde waarschuwing te verbergen over een voedingsveiligheidsinstelling die alleen handmatig te herstellen is. Dit verandert alleen de weergave; de onderliggende beoordeling, diagnostiek en het installatieresultaat blijven gelijk.

De camera via zijn Home Assistant-entiteit inschakelen vereist in beide modi goedkeuring op het paneel. Via Configureren inschakelen blijft een afzonderlijke eigenaarsinstelling; Android-cameratoestemming en een werkende indicator voor cameragebruik blijven vereist.

Een externe opslagactie in Configureren moet in Hardened een verlaging van voedingsveiligheid apart van fabriekspakketwijzigingen opslaan, omdat die verschillende goedkeuringen vereisen. Gecombineerd opslaan in Relaxed of via loopback gaat direct door.

Hardened weigert tikinjectie van buiten loopback, zodat een verzoek zichzelf niet kan goedkeuren. Hij weigert ook netwerk-ADB, draadloze Android-foutopsporing of de WebView-ontwikkeltoolsrelay aan te zetten. Zet het paneel op het paneel zelf terug naar Relaxed voordat je die gebruikt.

De goedkeuringsgrens authenticeert niet de rest van de API. Diagnostiek, status en gewone bediening behouden hun normale gedrag op een vertrouwd netwerk. Houd de paneel-API ook met Hardened weg van niet-vertrouwde netwerken; de [beveiligingsreferentie](/nl/reference/security/) beschrijft het volledige model.

Updates starten wanneer je via Panel Assistant installeert of zelf een installatie kiest. De paneel-app heeft geen beleid voor geplande installaties of opgeslagen updatekanaal. Door de eigenaar gestarte installaties op het tabblad **Installeren** blijven beschikbaar, met goedkeuring op het paneel voor beschermde externe verzoeken in Hardened.

## Het Home Assistant-adres wijzigen

De **Home Assistant-URL** wijzigen wist de eerdere aanmeldgegevens, tenzij in dezelfde opslagactie nieuwe gegevens worden meegegeven. Dit geldt in beide beveiligingsmodi. Gewone opslagacties die hetzelfde adres behouden, bewaren opgeslagen geheimen wanneer die velden leeg blijven.
