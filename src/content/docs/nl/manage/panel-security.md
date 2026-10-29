---
title: Paneelaccount en netwerkbeveiliging
description: Kies het Home Assistant-account van je paneel en plan de netwerktoegang.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

## Welk Home Assistant-account gebruikt het paneel?

Wanneer je vanuit Panel Assistant een nieuw paneel toevoegt, gebruikt de browseraanmelding normaal het Home Assistant-account waarmee je al op je computer bent aangemeld. Is dat je beheerdersaccount, dan meldt het paneel zich als die beheerder aan. Panel Assistant vraagt niet om je wachtwoord en maakt geen andere Home Assistant-gebruiker aan. Het paneel bewaart een eigen Home Assistant-aanmelding, zodat het je dashboard kan laden en als die gebruiker met Home Assistant kan communiceren.

Je gewone account gebruiken is prima, vooral als je Home Assistant-installatie maar één gebruiker heeft. Een afzonderlijke **bestaande** gebruiker is nuttig als je de toegang van het paneel van je beheerdersaccount wilt scheiden. Een gebruiker zonder beheerdersrechten kan dashboards gebruiken zonder toegang tot Home Assistant-instellingen. Een afzonderlijk account is optioneel; Panel Assistant maakt er tijdens het instellen geen aan.

Home Assistant bewaart ook een standaarddashboard en thema per gebruiker. Een paneelgebruiker kan een wanddashboard en uiterlijk hebben zonder de keuzes op je telefoon of computer te veranderen. De ingebouwde renderer gebruikt dat standaarddashboard wanneer **Startdashboard** op **Auto** staat; een dashboard dat in de paneelinstellingen is geselecteerd, heeft voorrang. De instelling **Dashboard-thema** kan een lichte of donkere modus aanvragen, maar een expliciete Home Assistant-themakeuze heeft nog steeds voorrang.

Je kunt de paneelgebruiker eigen zijbalkitems en een eigen volgorde, taal, tijdzone en getal-, datum- en tijdnotatie geven onder **Home Assistant → Gebruikersprofiel → Algemeen**. Zijbalkvoorkeuren doen ertoe wanneer de zijbalk zichtbaar is; de ingebouwde renderer verbergt de vastgezette zijbalk bij de eerste start. Een zijbalkitem verbergen beperkt de toegang ertoe niet. Zie de [Home Assistant-handleiding voor gebruikersprofielen](https://www.home-assistant.io/docs/configuration/user-configuration/) voor deze accountinstellingen.

### De aanmelding van het paneel wijzigen

Open **Panel Assistant** in Home Assistant, selecteer het paneel en open het tabblad **Configureren**. Kies onder **Inloggen via de browser** voor **Opnieuw verbinden** en **Link kopiëren**. Open die link in een privévenster, meld je bij Home Assistant aan als de bestaande gebruiker die het paneel moet gebruiken en laat de browser terugkeren naar het paneel. Een privévenster helpt als je gewone browser al als beheerder is aangemeld. Je kunt ook **Configureren** rechtstreeks op het paneel openen en daar browseraanmelding starten. Meldt Home Assistant daarna een afwijkende paneelgebruiker onder **Instellingen → Reparaties**, bevestig dan dat de genoemde nieuwe gebruiker degene is die je hebt gekozen.

De browser moet zowel Home Assistant als het lokale adres van het paneel kunnen bereiken om de aanmelding af te ronden. Ook het paneel moet Home Assistant kunnen bereiken. Heb je Configureren op afstand via Home Assistant geopend maar kan je browser het lokale paneeladres niet bereiken, rond de aanmelding dan af terwijl je op het netwerk van het paneel zit of rechtstreeks op het paneel.

## Zet het paneel op een afzonderlijk netwerk

Een paneel kan een VLAN zonder internettoegang gebruiken als je firewall het paneel en Home Assistant elkaar laat bereiken en een browser op je netwerk het paneel kan bereiken wanneer iemand moet aanmelden. Het paneel gebruikt het lokale adres van Home Assistant voor de aanmelding en het dashboard. Home Assistant moet het paneel ook kunnen bereiken voor beheer en updates.

Panel Assistant kan een geverifieerde paneel-app-update op de Home Assistant-machine ophalen en via het lokale netwerk naar het paneel sturen. Home Assistant heeft nog steeds toegang tot de updatebron nodig. Versiecontroles van het paneel en door de eigenaar gestarte installaties op het tabblad Installeren gebruiken GitHub en vereisen ook internettoegang. Die controles en downloads werken niet op een VLAN zonder internetroute. In de nog niet uitgebrachte versie 1.0.0-rc2 kan een vanuit Home Assistant gestarte app-update op ondersteunde panelen ook een compatibele WebView installeren. Houd ook rekening met de [WebView-updateroute](/nl/hardware/guides/update-the-webview/) die je paneel ondersteunt.

Netwerkscheiding beperkt welke apparaten de webinterface en API van het paneel kunnen bereiken. Ze vermindert niet de rechten van een Home Assistant-account dat al op het paneel is aangemeld. Gebruikt het paneel een beheerdersaccount, dan blijft dat een beheerdersaanmelding, ook op een geïsoleerd VLAN. Kies het account en de firewallregels passend bij wat je aan de muur en op het lokale netwerk vertrouwt.

De webinterface en gewone bediening van het paneel gaan uit van een vertrouwd lokaal netwerk. De optionele [modus Hardened](/nl/manage/security-mode/) vereist fysieke toegang voor geselecteerde rechtstreekse LAN-verzoeken met grote gevolgen. Sommige gewone beheertaken kunnen via de geauthenticeerde Panel Assistant-zijbalk worden uitgevoerd door een Home Assistant-beheerder; andere beschermde bewerkingen vereisen nog goedkeuring op het paneelscherm. Dit vervangt netwerkscheiding niet en authenticeert niet elk API-verzoek.
