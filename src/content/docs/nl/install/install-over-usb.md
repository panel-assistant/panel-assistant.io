---
title: Installeren via USB
description: Een gloednieuw paneel vanuit je browser met een USB-kabel aan de praat krijgen, voordat het aan de muur gaat.
sourceCommit: e3bcf608109626496dd34c3ae14d144c5f355917
---

De USB-route is voor een paneel dat nog in de doos zit, of een paneel waarvan de software van de fabrikant netwerktoegang lastig maakt. Sluit het paneel aan op de computer waar je achter zit, en je browser installeert de paneel-app rechtstreeks via de kabel. Er gaat niets over je netwerk, en de Home Assistant-server hoeft het paneel nooit te zien. De meeste mensen gebruiken dit precies één keer, voordat het paneel wordt opgehangen.

## Het begint in Home Assistant

Het USB-installatieprogramma wordt door een beheerder geopend vanaf de pagina Panel Assistant in de zijbalk van Home Assistant. Home Assistant controleert de release en geeft die aan het installatieprogramma, dat in een eigen beveiligd venster opent. Daarom staat er op deze site geen installatieknop: de pagina die het werk doet, accepteert alleen een release van je eigen Home Assistant, zodat er niets op je paneel komt dat Home Assistant niet heeft geverifieerd.

## Wat je nodig hebt

- De [integratie](/nl/home-assistant/custom-integration/) geïnstalleerd, en een beheerdersaccount.
- Een op Chromium gebaseerde browser zoals Chrome of Edge. Firefox en Safari kunnen niet met USB-apparaten praten.
- Een USB-kabel van het paneel naar de computer of telefoon waarop die browser draait. Niet naar de Home Assistant-server.
- USB-foutopsporing ingeschakeld in de ontwikkelaarsopties van het paneel, en iemand bij het paneel om de autorisatievraag goed te keuren wanneer die verschijnt. De [hardwarepagina's](/nl/hardware/) laten per model zien hoe je bij de ontwikkelaarsopties komt.

## Wat er gebeurt

1. Kies een versie op de pagina Panel Assistant. Alleen releases van ha-paneld die Home Assistant voor installatie kan verifiëren staan erin: de nieuwste stabiele release, plus eventuele recente releasekandidaten, die als testversie zijn gemarkeerd.
2. Het installatievenster verifieert de release en vraagt je het paneel te kiezen in de USB-vraag van de browser.
3. Keur de vraag voor USB-foutopsporing goed op het scherm van het paneel.
4. Bevestig. Er verandert niets op het paneel totdat je dat doet, en het installatieprogramma controleert eerst of het paneel echt schoon is: het weigert over een bestaande installatie heen te installeren in plaats van de gegevens van het paneel te riskeren.
5. Houd de kabel en het tabblad verbonden totdat het meldt dat het klaar is, en rond daarna de begeleide installatie op het paneel zelf af.

Als de kabel eruit gaat of het venster halverwege sluit, sluit hem weer aan, zet dezelfde release opnieuw over vanuit Home Assistant en verbind hetzelfde paneel opnieuw. Het installatieprogramma bewaart zijn voortgang in je browser, controleert eerst de stap waarbij het werd onderbroken voordat het iets anders doet, en gaat vanaf daar verder in plaats van opnieuw te beginnen.

## Daarna

Het paneel draait de app en is klaar om als apparaat aan Home Assistant te worden toegevoegd. Het USB-installatieprogramma werkt geen paneel bij waarop de app al staat; zie daarvoor [Updates en herstel](/nl/manage/updates-and-recovery/).
