---
title: Installeren via USB
description: Een gloednieuw paneel vanuit je browser met een USB-kabel aan de praat krijgen, voordat het aan de muur gaat.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

De USB-route is voor een paneel dat nog in de doos zit, of een paneel waarvan de software van de fabrikant netwerktoegang lastig maakt. Sluit het paneel aan op de computer waar je achter zit, en je browser installeert de paneel-app rechtstreeks via de kabel. Het paneel heeft geen netwerk-ADB nodig. Je browser moet verbonden blijven met Home Assistant, dat de geverifieerde release levert. De meeste mensen gebruiken dit precies één keer, voordat het paneel wordt opgehangen.

## Het begint in Home Assistant

Een beheerder start het USB-installatieprogramma vanuit Home Assistant: ga naar **Instellingen**, **Apparaten en diensten**, **Integratie toevoegen**, kies **Panel Assistant** en vervolgens **Installeer via USB op deze computer**. De link **Paneel toevoegen** op de Panel Assistant-pagina in de zijbalk opent dezelfde keuze. Home Assistant controleert de release en geeft die aan het installatieprogramma, dat in een eigen beveiligd venster opent. Daarom staat er op deze site geen installatieknop: de pagina die het werk doet, accepteert alleen een release van je eigen Home Assistant, zodat er niets op je paneel komt dat Home Assistant niet heeft geverifieerd.

## Wat je nodig hebt

- De [integratie](/nl/home-assistant/custom-integration/) geïnstalleerd, en een beheerdersaccount.
- Een op Chromium gebaseerde browser zoals Chrome of Edge. Firefox en Safari kunnen niet met USB-apparaten praten.
- Een USB-kabel van het paneel naar de computer of telefoon waarop die browser draait. Niet naar de Home Assistant-server.
- USB-foutopsporing ingeschakeld in de ontwikkelaarsopties van het paneel. Als het paneel bij het verbinden een autorisatievraag toont, moet iemand bij het paneel die goedkeuren; sommige panelen vragen er nooit om. De [hardwarepagina's](/nl/hardware/) laten per model zien hoe je bij de ontwikkelaarsopties komt.

## Wat er gebeurt

1. Kies **Open het USB-installatieprogramma**. Houd op de geopende pagina de aanbevolen versie aan en druk op **Doorgaan**. Home Assistant biedt de nieuwste compatibele versies aan die het kan verifiëren. Testversies zijn gemarkeerd en worden aangeboden als de draaiende integratie ze toestaat.
2. Het installatieprogramma opent in een nieuw venster en verifieert de release. Druk op **Mijn paneel zoeken** en kies het paneel in de lijst van je browser.
3. Als het paneel vraagt USB-foutopsporing toe te staan, vink dan **Altijd toestaan vanaf deze computer** aan en keur dit goed op het scherm van het paneel. Sommige panelen vragen er niet om en het installatieprogramma gaat meteen verder.
4. Bevestig. Er verandert niets op het paneel totdat je dat doet. Het installatieprogramma weigert een andere bestaande installatie te overschrijven; als exact de geselecteerde build al is geïnstalleerd, rondt het de configuratie van die build af.
5. Houd de kabel en het venster verbonden totdat het meldt dat het klaar is. Hetzelfde venster gaat daarna verder met de installatiewizard van het paneel, waarin je de installatie afrondt. Het paneel biedt de wizard aan, dus de computer moet op hetzelfde netwerk als het paneel zitten.

Als de kabel halverwege losraakt, sluit hem dan weer aan, wacht tot het paneel is gestart, druk op de knop op het foutscherm van het installatieprogramma en daarna op **Mijn paneel zoeken**. Als het installatievenster gesloten was, begin dan opnieuw vanuit Home Assistant en kies dezelfde versie. In beide gevallen bewaart het installatieprogramma zijn voortgang in je browser, controleert het eerst de stap waarbij het werd onderbroken voordat het iets anders doet en gaat het vanaf daar verder in plaats van opnieuw te beginnen.

## Daarna

Het paneel draait nu de app. Een paneel dat net uit de doos komt, zit nog niet op je netwerk. Verbind het daarom vóór of na de installatie met je wifi via de eigen app Instellingen van het paneel: zowel de installatiewizard als de verbinding met Home Assistant hebben dat nodig. Als het paneel na het afronden van de configuratie niet in Home Assistant verschijnt, ga dan naar **Instellingen**, **Apparaten en diensten**, **Integratie toevoegen**, kies **Panel Assistant** en daarna **Voeg een paneel op je netwerk toe**, en voer het adres van het paneel in. Het USB-installatieprogramma werkt geen paneel bij waarop de app al staat; zie daarvoor [Updates en herstel](/nl/manage/updates-and-recovery/).
