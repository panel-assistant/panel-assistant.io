---
title: Meta Portal 10" (2e generatie)
description: Hardwaregegevens en koopadvies voor de Meta Portal 10 inch (2e generatie), model WD50JM, een Qualcomm QCS605-smartdisplay met Android 10, gemeten op een fysiek exemplaar met Panel Assistant zonder root.
vendor: Meta
model: Portal 10" (2nd gen), WD50JM
soc: Qualcomm QCS605
android: '10'
screen: 10.1 in, 1280 × 800
support: Voorlopig
root: Geen root; Meta's ADB-schakelaar volstaat voor het instellen
webview: Meta's eigen Chromium 131-WebView
released: '2019'
evidence: [bench, firmware, documented]
sidebar:
  label: Portal 10" (2e generatie)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Alles op deze pagina is gemeten op één winkelmodel Portal 10" (2e generatie)** met Meta-firmware `QKQ1.210213.001.3051355900018050` (Android 10, beveiligingspatch 2020-08-05), met Panel Assistant zonder root. Portal-ondersteuning vereist versie 1.0 of nieuwer van de paneel-app. Niets hier is gecontroleerd op een ander Portal-model; zie de [Meta Portal-familiepagina](/nl/hardware/panels/meta/) voor de omgang met andere modellen.
:::

De Portal 10" (2e generatie), model **WD50JM**, is een liggend 10,1-inch smartdisplay met een Qualcomm QCS605, ongeveer 3 GB RAM, een 13MP-camera met eigen cameralampje, twee microfoons, een luidspreker en een fysieke privacyschuif. Meta's [ADB-schakelaar](#adb-inschakelen) is alles wat Panel Assistant nodig heeft: de paneel-app wordt via USB geïnstalleerd, herkent de Portal en laadt het eigen hardwareprofiel. Dashboard, camera, microfoon, activeringswoord, gesproken antwoorden, lichtsensor en echt schermuitschakelen werken allemaal zonder root.

Het is een goed paneel met ongebruikelijke voorwaarden, grotendeels van Meta. De voorwaarden die ertoe doen voordat je geld uitgeeft staan bij [Vóór je aankoop](#vóór-je-aankoop).

:::tip
De belangrijkste gegevens: **houd het Meta-account aangemeld**, want de ADB-schakelaar zit achter de pincode daarvan. **De ADB-schakelaar ziet er aan en uit hetzelfde uit**, dus controleer de toestand op je computer. **Reken erop dat je ADB na een herstart weer moet inschakelen**; de netwerkfoutopsporing die Panel Assistant voor updates gebruikt blijft nooit na een herstart behouden. Voor fabrieksherstel houd je **beide volumeknoppen ingedrukt terwijl je de voeding aansluit, zonder USB-verbinding met een computer**.
:::

## Ook verkocht als

Meta Portal, Facebook Portal, Portal (2e generatie), Portal 10", model WD50JM. Android meldt model `Portal`, apparaat en bord `omni`, product `omni_prod`, fabrikant en merk `Facebook`, hardwareplatform `atlas`.

|               |                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC           | Qualcomm **QCS605**, 8 kernen                                                                                                                         |
| RAM           | Ongeveer **3 GB** (Android meldt 2.85 GB)                                                                                                             |
| Opslag        | 6.7 GB voor apps en gegevens, ongeveer 3.9 GB vrij na instellen; geen geheugenkaartsleuf                                                              |
| Scherm        | **1280×800** liggend, 10,1 inch, **ongeveer 149 ppi**, bij Androids basisdichtheid 160 dpi. FocalTech-aanraakcontroller met dubbeltikken om te wekken |
| Android       | 10 (API 29), productie-`user`-build, SELinux enforcing; arm64-v8a                                                                                     |
| WebView       | Meta's eigen WebView-build, Chromium **131**, actueel gehouden door Meta's achtergrondupdater. Geen WebView-werk nodig                                |
| Sensoren      | **Versnellingsmeter** en kanteling; **omgevingslicht met kleur**. **Geen nabijheidssensor**                                                           |
| Camera        | **13MP**-sensor linksboven in de rand, met een **groen cameralampje** ernaast. Apps zoals de paneel-app krijgen 1280×720 aangeboden                   |
| Audio         | **Twee microfoons**, één luidspreker                                                                                                                  |
| Privacy       | **Schuif met drie standen**: camera en microfoons aan; camera afgedekt; camera afgedekt en microfoons uit                                             |
| Knoppen       | Volume omhoog en omlaag. Geen aan-uitknop                                                                                                             |
| Radio's       | Wifi, Bluetooth met **Bluetooth Low Energy**                                                                                                          |
| Aansluitingen | **USB-C**, gebruikt voor ADB                                                                                                                          |
| Root          | Geen. Geen `su`, geen bekende bootloaderontgrendeling. ADB komt uit Meta's eigen Debug-instelling                                                     |
| Uitgebracht   | 2019 (aangekondigd in september, te koop in oktober)                                                                                                  |

## Vóór je aankoop

Geen van deze punten is een reden om geen Portal te kopen, maar je kunt ze beter vooraf weten.

- **Je hebt een Facebook-account nodig.** Meta's instelproces bereikt Instellingen niet zonder aanmelden. Het biedt Facebook of WhatsApp; de WhatsApp-QR-code verscheen bij ons nooit en Facebook-aanmelding werkte. Een nieuw account voor het paneel is prima.
- **Het account moet aangemeld blijven.** ADB inschakelen vraagt om de pincode van het Meta-account die tijdens het instellen is gemaakt. Zonder aangemeld account vonden we geen manier om ADB opnieuw in te schakelen en ook Meta's fabrieksherstel op het scherm werkte niet meer; alleen de [hardwarematige reset](#herstel-fabrieksinstellingen) bracht de Portal terug. Verwijder het account niet en schakel Meta's instelapp niet uit.
- **ADB blijft niet aan.** Naar verluidt schakelt Meta's ADB-instelling zichzelf bij elke herstart uit, dus reken erop dat je die opnieuw moet inschakelen. De netwerkfoutopsporingsverbinding die Panel Assistant voor updates gebruikt ging verloren bij elke herstart die we probeerden. Dat heeft gevolgen voor [updates](#updates).
- **Weiger indien mogelijk de firmwaredownload tijdens het instellen.** Meta's instelproces biedt aan een update te downloaden. Wij weigerden, dus alles op deze pagina is getest met de bovenaan genoemde firmwarebuild. Of latere Meta-firmware ADB-toegang verandert is onbekend en Meta publiceert geen manier om terug te gaan.
- **Meta bouwt Portal af.** Meta stopte in 2022 met de verkoop van Portals en heeft sindsdien functies ingetrokken. Verwacht dat meer eigen Meta-services, en mogelijk aanmeldmethoden, stoppen met werken. De paneel-app is van geen ervan afhankelijk.
- **Een computer met een op Chromium gebaseerde browser en een USB-C-datakabel** zijn nodig voor installatie, zoals bij elk paneel dat [via USB](/nl/install/install-over-usb/) wordt geïnstalleerd.

## ADB inschakelen

Meta documenteert de procedure voor elke Portal ([Meta, Portal instellen voor Android-apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)):

1. Open op de Portal **Settings › Debug**.
2. Tik op **ADB Enabled** en voer de pincode van het Meta-account in wanneer daarom wordt gevraagd.
3. Verbind de Portal via USB-C met de computer.
4. Tik de eerste keer op **Allow** op de Portal om de computer te vertrouwen.

:::caution
**ADB Enabled ziet er precies hetzelfde uit wanneer ADB aan of uit staat en elke tik schakelt de toestand om.** Niets op het Portal-scherm vertelt je de toestand. Het enige bewijs staat op de computer: de Portal verschijnt in de USB-apparaatlijst van de browser of in `adb devices`. Staat deze er niet, tik dan nog eenmaal en controleer opnieuw in plaats van meerdere keren te tikken.
:::

Er is geen geverifieerde manier om netwerk-ADB op TCP-poort 5555 zonder computer in te schakelen. Gebruik eerst de bovenstaande USB-route; alleen Meta’s ADB-schakelaar inschakelen is geen geverifieerde netwerkinstallatieroute. Het USB-installatieprogramma bereidt netwerkfoutopsporing voor op latere updates. Root is niet nodig.

## Panel Assistant installeren

Installeer de paneel-app vanuit Home Assistant met het [USB-installatieprogramma](/nl/install/install-over-usb/), met de Portal via USB-C aan je computer verbonden en ADB zoals hierboven ingeschakeld. Panel Assistant is vereist: daarmee wordt de app geïnstalleerd, verbonden en bijgewerkt. Op de geteste Portal werd de installatie normaal voltooid, verscheen de app op het dashboardinstelscherm en selecteerde deze bij de eerste start zelf het profiel Portal 10" (2e generatie).

Voor een Portal bereidt Panel Assistant het paneel ook tijdens installatie voor: het maakt de paneel-app het startscherm, verleent microfoontoestemming en schakelt Meta's schermbeveiliging en omhoogveegbalk uit. Geen van deze zaken kan via Meta's eigen app Instellingen worden gewijzigd. Cameratoestemming wordt op het Portal-scherm gevraagd wanneer je de camera voor het eerst inschakelt.

Eén instelling kies je zelf: **dashboardzoom**. Bij de eigen dichtheid van de Portal wordt het dashboard groter getekend dan op andere liggende panelen. Het paneelprofiel zet **Zoom (%)** standaard op **85**, zodat Androids eigen schermen scherp blijven; wijzig dit in de instellingen van de [ingebouwde renderer](/nl/manage/built-in-renderer/) als je een andere grootte wilt.

[Voeg daarna het paneel toe](/nl/install/installing-ha-paneld/) in Panel Assistant zoals gebruikelijk.

## Wat werkt

- **Het dashboard**, soepel, in Meta's eigen actuele WebView.
- **Camera.** Standaard uit, zoals op elk paneel, en ingeschakeld via de kaart **Camera** in Configureren. Deze biedt dan een stream van 1280×720 en stilstaande beelden aan Home Assistant en het groene cameralampje van de Portal brandt tijdens gebruik.
- **Microfoons, activeringswoord en gesproken antwoorden.** Het activeringswoord werd herkend en de Home Assistant-spraakpipeline antwoordde via de Portal-luidspreker. Zie [spraakassistent](/nl/manage/voice-assistant/).
- **Omgevingslicht**, inclusief kleur, als gewone Android-sensor, voor adaptieve helderheid en Home Assistant.
- **Het scherm echt uitschakelen zonder root.** De paneelapp schakelt het scherm uit via de eigen slaaptime-out van Android, zodat de achtergrondverlichting volledig uitgaat in plaats van naar de laagste stand te gaan. De helderheid naar nul verlagen is op een Portal niet genoeg: het beeld blijft zichtbaar. Als de time-out niet werkt, probeert de app eerst de schermvergrendeling via apparaatbeheer van Android. Als geen van beide methoden werkt, dimt de app het scherm.
- **Wekken**: dubbeltikken op het scherm wekt het, net als Meta's eigen bewegingsdetectie wanneer iemand in de buurt beweegt.
- **De knop Launcher** in de navigatie van de paneel-app gaat naar de eigen launcher van de app. Het profiel laat Meta's launcher overslaan: dat is een wijzerplaat in plaats van een applijst.

## Huidige beperkingen

- **Automatische slaapstand staat standaard uit en we adviseren die uit te laten.** De Portal heeft geen nabijheidssensor, dus de paneel-app kan niet zien of er iemand voor staat. Slapen na een periode zonder aanraking schakelde het scherm uit terwijl iemand bij het paneel zat, waarna Meta's bewegingsdetectie het steeds opnieuw wekte. Die detectie wekt bij elke beweging, ook van iemand die voorbijloopt, wekte het scherm soms zonder iemand in de kamer en is niet uitleesbaar door andere apps. De paneel-app kan die daarom niet als aanwezigheidssignaal gebruiken. Je kunt het scherm nog steeds via Home Assistant uit- en inschakelen.
- **Twee camera-indicatoren.** De paneel-app tekent zijn eigen camera-aan-indicator middenboven op het scherm, terwijl de lens en het groene lampje van de Portal linksboven zitten. De schermindicator is hier dubbelop en kan niet uitgeschakeld worden.
- **Meta's volumeschuif verandert het mediavolume niet**, dat voor gesproken antwoorden en aankondigingen wordt gebruikt. Mediavolume kan op nul beginnen, waardoor het eerste antwoord stil is. Stel het in met **Volume van het paneel** of de volume-entiteit in Home Assistant; Meta's schuif verandert het niet.
- **Android-instellingen zijn grotendeels onbereikbaar.** Meta vervangt Androids app Instellingen door een eigen beperkte app. Panel Assistant stelt tijdens installatie in wat de paneel-app nodig heeft; andere Android-instellingen kunnen niet op het paneel zelf worden gewijzigd.

:::danger
**Schakel Meta's instelapp (`com.facebook.alohaapps.devicesetup`) niet uit en verwijder het Meta-account niet.** Met het account verwijderd en die app uitgeschakeld verloor de geteste Portal zowel de ADB-schakelaar als Meta's fabrieksherstel op het scherm. Alleen de [hardwarematige reset](#herstel-fabrieksinstellingen) herstelde dit. Laat Meta's account-, instellingen- en instelapps met rust.
:::

## Updates

Een Portal kan app-updates niet zelf installeren, omdat daarvoor root nodig is. Panel Assistant werkt deze daarom bij via netwerkfoutopsporing, die de Portal bij elke herstart uitschakelt, ook na stroomuitval. Het paneel blijft dan werken op de aanwezige versie en Home Assistant toont een Reparatie, zoals beschreven in [Updates en herstel](/nl/manage/updates-and-recovery/#een-paneel-dat-niet-kan-worden-bijgewerkt).

Om Panel Assistant weer te laten bijwerken schakel je [ADB](#adb-inschakelen) in, sluit je de Portal via USB aan op je computer en start je het USB-installatieprogramma vanuit Home Assistant, zoals beschreven bij [een paneel dat niet kan worden bijgewerkt](/nl/manage/updates-and-recovery/#een-paneel-dat-niet-kan-worden-bijgewerkt). Het installatieprogramma installeert niets op een Portal die de app al heeft; het schakelt netwerkfoutopsporing weer in zodat Panel Assistant kan bijwerken. Controleer na de update dat de Portal het dashboard nog steeds als [startscherm](#panel-assistant-installeren) opent.

## Privacy

Een Portal blijft een Meta-apparaat met Meta-software en de paneel-app verandert dat niet. Hieronder staat wat we op het geteste exemplaar hebben gemeten, geen volledige audit.

**Meta's software.** In ongeveer 25 minuten na fabrieksherstel uploadden alle Meta-apps samen ongeveer 3 MB en verzonden Meta's camera-analyse en aanwezigheidsservices elk minder dan 0.05 MB. Voortdurende video-upload zou veel groter zijn, dus binnen die periode is geen video-upload gezien; dit is een korte test en sluit incidentele uploads niet uit. Verschillende Meta-services houden verbindingen met Meta-servers open en Meta's systeemsoftware logt analysegebeurtenissen, waaronder elk gebruik van de privacyschuif en de toestand van het cameralampje.

**Meta's camera-analyse laat het groene lampje niet branden.** Meta's eigen bewegings- en aanwezigheidsdetectie bekijkt de kamer via een afzonderlijke, verkleinde camerastream die continu draait zonder het cameralampje in te schakelen. Het groene lampje meldt alleen de camerastream die andere apps gebruiken. De paneel-app kan Meta's analysestream niet openen, dus wanneer de paneel-app de camera gebruikt brandt het groene lampje.

**De privacyschuif werkt voor de paneel-app.** Met de schuif op de camerastand meldt Android de camera als niet beschikbaar en stopt de camera van de paneel-app met beelden leveren. In de microfoon-uitstand hoorde de spraakassistent van de paneel-app niets. In 1.0 volgt de paneel-app Meta's privacygebeurtenis naast Androids demptoestand en kan deze microfoondemping tonen. Fysieke schuifovergangen en opstarten met ingeschakelde microfoon zijn voor dat rapportagepad nog niet gekwalificeerd.

**De paneel-app.** De camera staat uit totdat deze wordt ingeschakeld. Zolang de camera is ingeschakeld is de stream beschikbaar voor clients op je lokale netwerk, met kamergeluid waar microfoontoegang is toegestaan. Assist en de Home Assistant-entiteiten gebruiken je eigen Home Assistant-verbinding.

## Herstel: fabrieksinstellingen

De hardwarematige reset van de Portal werkt zonder Meta-apps, werkend scherm of ADB:

1. Koppel de voeding los en **ontkoppel elke USB-kabel naar een computer**.
2. Houd **beide volumeknoppen** ingedrukt en sluit de voeding weer aan. Blijf ze vasthouden totdat de Portal toont dat deze wordt gewist.

De reset wist alles, inclusief de paneel-app en de instellingen daarvan. Doorloop daarna Meta's instelproces opnieuw, [schakel ADB in](#adb-inschakelen) en [installeer Panel Assistant](#panel-assistant-installeren).

:::caution
**Met een aangesloten USB-kabel naar een computer reset dezelfde knopcombinatie de Portal niet.** Deze start in plaats daarvan Qualcomms nooddownloadmodus, die op de computer als Qualcomm-USB-apparaat verschijnt. In die modus verandert niets. Koppel de voeding los om deze te verlaten, ontkoppel de USB-kabel en probeer opnieuw.
:::

## Firmware

Zie de [firmwarecatalogus van de Portal 10" (2e generatie)](/nl/hardware/firmware/builds/meta-portal-10-gen2/) voor geïndexeerde builds, originele Meta-download-URL's en Internet Archive-kopieën.

## Bron

[Meta for Developers: Portal instellen voor Android-apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): de ADB-procedure en de lijst met ondersteunde modellen.
