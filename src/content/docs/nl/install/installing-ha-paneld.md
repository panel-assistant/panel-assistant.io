---
title: Een paneel toevoegen
description: Een paneel toevoegen vanuit Home Assistant, via het netwerk of via een USB-kabel.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Je voegt een paneel toe vanuit Home Assistant, zonder opdrachtregel. Er zijn twee routes, en bij allebei verschijnt het paneel uiteindelijk als apparaat.

Welke je ook kiest, werk eerst [Het paneel voorbereiden](/nl/install/prepare-a-panel/) door.

## Via het netwerk

Voor een paneel dat al op je netwerk zit. Ga naar **Instellingen**, **Apparaten en diensten**, voeg **Panel Assistant** toe en geef het adres van het paneel op. De integratie controleert wat er op het paneel staat, vraagt je zo nodig een foutopsporingsvraag op het scherm van het paneel zelf goed te keuren, vraagt je de installatie te bevestigen, installeert de paneel-app, start die en maakt pas daarna het apparaat aan. Als de app al op het paneel draait, neemt de integratie die over, wat sneller gaat.

## Via USB

Voor een paneel dat nog in de doos zit, of waarvan de software van de fabrikant netwerktoegang lastig maakt. Sluit het aan op je laptop en installeer vanuit je browser via de USB-kabel. Je browser blijft verbonden met Home Assistant, dat de geverifieerde release levert; het paneel heeft geen netwerk-ADB nodig. Start dit via **Instellingen**, **Apparaten en diensten**, **Integratie toevoegen**, **Panel Assistant**, **Installeer via USB op deze computer**; je hebt een op Chromium gebaseerde browser nodig. Zie [Installeren via USB](/nl/install/install-over-usb/).

## Wat het installatieprogramma beschermt

Beide routes controleren het paneel voordat ze iets veranderen. De netwerkroute neemt een bestaande app over in plaats van die opnieuw te installeren. USB overschrijft geen andere bestaande installatie; als exact de geselecteerde build al is geïnstalleerd, rondt het de configuratie van die build af. Een onderbroken USB-installatie kun je met dezelfde release opnieuw proberen; het installatieprogramma controleert wat al is afgerond voordat het verdergaat. Zie [Updates en herstel](/nl/manage/updates-and-recovery/) voor back-ups vóór een app-update.

## Na de installatie

Het paneel verschijnt als apparaat met een statussensor en diagnostiek, en op de pagina Panel Assistant in de zijbalk. Daarna rond je de installatie af in de eigen installatiewizard van het paneel, waarin je het paneel een naam geeft en het dashboard kiest. Tot de configuratie klaar is, toont het scherm van het paneel zelf een QR-code en een knop **Instellen**, zodat je ook via een telefoon of op het paneel zelf kunt afronden. Wil je het dashboard later veranderen, open dan de statuspagina van het paneel in je browser, op zijn adres met poort 8888.

Ga verder met [Een paneel verbinden](/nl/home-assistant/connect-a-panel/).
