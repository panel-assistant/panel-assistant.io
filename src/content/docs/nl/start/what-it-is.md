---
title: Hoe het werkt
description: Wat Panel Assistant op een paneel zet, wat in Home Assistant blijft, en waarom het volledig open source kan zijn.
sourceCommit: cb91a53b7fe4ae129274b56dae846d3dcc4a9eff
---

Panel Assistant bestaat uit twee delen. Het ene deel woont in Home Assistant en is wat je ziet en gebruikt. Het andere deel woont op elk paneel en is wat het paneel snel maakt.

## In Home Assistant: de integratie

De integratie is wat je via HACS installeert. Hier voeg je een paneel toe, hier verschijnt elk paneel als apparaat met zijn eigen status en diagnostische gegevens, en hier toont een Panel Assistant-pagina in de zijbalk al je panelen bij elkaar, met per paneel of het bereikbaar is, welke versie erop draait en of er iets aandacht nodig heeft.

Het is ook het installatieprogramma. Geef het het adres van een nieuw paneel, of sluit een nieuw paneel aan op je laptop, en het controleert wat er op staat, installeert de paneel-app, start die, en maakt pas daarna het apparaat aan. Draait er op een paneel al de app, dan neemt het dat paneel in plaats daarvan over.

## Op het paneel: de app

Een wandpaneel is een kleine Android-computer, en dat de meeste traag aanvoelen, komt door de software die erbij geleverd werd. Panel Assistant vervangt het deel van die software dat ertoe doet door zijn eigen app, die drie dingen doet.

- **Geeft je dashboard weer.** De app laadt zelf je bestaande Home Assistant-dashboard, zoekt uit welke entiteiten dat dashboard echt toont, en vraagt Home Assistant alleen om die. Op een goedkoop paneel is dat het grootste deel van het verschil tussen haperen en niet haperen.
- **Bestuurt de hardware van het paneel.** Het scherm, de helderheid en slaapstand ervan, de LED’s, knoppen, relais, nabijheids- en lichtsensoren en wat het model verder nog heeft, worden rechtstreeks aangestuurd en verschijnen in Home Assistant als entiteiten op het apparaat van het paneel. Elk model wordt beschreven door een hardwareprofiel: platte tekst die je in je browser op het paneel kunt lezen, bewerken en valideren, zonder ontwikkeltools. Een paneel dat het project nog nooit heeft gezien, begint op het voorzichtige generieke profiel, dat het het dashboard, de sensoren, helderheid, audio en navigatie geeft die elk Android-apparaat kan bieden, en het paneel krijgt de rest erbij naarmate zijn profiel wordt ingevuld. Het draaiende paneel controleert elke opgegeven mogelijkheid voordat het die gebruikt, zodat een ontbrekende functie vergrendeld en met uitleg wordt getoond in plaats van kapot te blijven, en een profiel dat bij het opstarten faalt, valt terug op het laatste profiel dat wel werkte.
- **Gedraagt zich als een huishoudapparaat.** De app neemt de plaats in van de launcher van de fabrikant, geeft een paneel zonder knoppen een manier om op het scherm te navigeren, biedt een eigen statuspagina op je netwerk en herstelt zichzelf als er iets misgaat, zodat je een paneel één keer ophangt en het daarna met rust kunt laten.

Die app heet ha-paneld. De naam komt uit zijn verleden als achtergrondhulpprogramma waar andere dashboardsoftware op leunde, en de app is sindsdien uitgegroeid tot de hele paneelkant van het product. Je komt de naam tegen in de referentiedocumentatie en op de eigen statuspagina van het paneel, en het is goed om hem te kennen zodat niets je verrast, maar je hoeft hem nooit te typen of eraan te denken om Panel Assistant te gebruiken.

## Waarom het open source kan zijn

De meeste paneelfabrikanten leveren hun hardware-ondersteuning als gesloten bibliotheken die alleen hun eigen app mag gebruiken. ha-paneld gebruikt die niet. Het stuurt de hardware van elk paneel rechtstreeks aan, via eigen profielen per model, wat veel werk heeft gekost en de reden is dat het project überhaupt hardware-ondersteuning heeft. Het is ook de reden dat het geheel weggegeven kan worden: er zit geen code van fabrikanten in, dus niets houdt tegen dat het gratis en open source is onder ruime licenties, voor elk merk paneel.

Om dezelfde reden heeft het project juist bij hardware-ondersteuning de meeste hulp nodig. Elk paneel dat zich meldt, of het nu werkt of niet, maakt het volgende profiel beter. Zie [Een paneel kiezen](/nl/install/supported-panels/) voor hoe de ondersteuning er vandaag voor staat.

## Waar de onderdelen staan

| Onderdeel              | Wat het is                                                                                      | Waar                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Panel Assistant        | De Home Assistant-integratie: installatieprogramma, apparaten en de pagina met alle panelen.    | [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) |
| ha-paneld              | De app op het paneel: dashboard, hardware, launcher, statuspagina.                              | [panel-assistant/android](https://github.com/panel-assistant/android)               |
| Hardwareprofielen      | De beschrijvingen per model die de app vertellen wat een paneel heeft en hoe het aan te sturen. | [Hardware-referentie](/nl/hardware/)                                                |
| Referentiedocumentatie | De API, hardwareprofielen en het beveiligingsmodel in detail.                                   | [Referentie](/nl/reference/api/)                                                    |

## Wat het niet is

Het is bedoeld voor vaste wandpanelen. Tablets en telefoons kunnen het draaien, maar alles met een accu hangt aan een kabel, en het ontwerp gaat uit van een paneel op netstroom dat één keer wordt ingericht en daarna met rust wordt gelaten. Het is geen dashboardbouwer; het draait de dashboards die je al hebt. En het is niet af: de richting is universele hardware-ondersteuning en beheer van elk paneel zonder omkijken.
