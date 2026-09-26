---
title: Een paneel toevoegen
description: Een paneel toevoegen vanuit Home Assistant, via het netwerk of via een USB-kabel.
sourceCommit: e132b3f499b292a1757d97d76675e840a7a25067
---

Je voegt een paneel toe vanuit Home Assistant, zonder opdrachtregel. Er zijn twee routes, en bij allebei verschijnt het paneel uiteindelijk als apparaat.

Welke je ook kiest, werk eerst [Het paneel voorbereiden](/nl/install/prepare-a-panel/) door.

## Via het netwerk

Voor een paneel dat al op je netwerk zit. Ga naar **Instellingen**, **Apparaten en diensten**, voeg **Panel Assistant** toe en geef het adres van het paneel op. De integratie controleert wat er op het paneel staat, vraagt je de eerste keer een foutopsporingsvraag op het scherm van het paneel zelf goed te keuren, installeert de paneel-app, start die en maakt pas daarna het apparaat aan. Als de app al op het paneel draait, neemt de integratie die over, wat sneller gaat.

## Via USB

Voor een paneel dat nog in de doos zit, of waarvan de software van de fabrikant netwerktoegang lastig maakt. Sluit het aan op je laptop en installeer vanuit je browser, zonder dat er iets over je netwerk gaat. Je start het vanaf de pagina Panel Assistant in de zijbalk, en je hebt een op Chromium gebaseerde browser nodig. Zie [Installeren via USB](/nl/install/install-over-usb/).

## Wat het installatieprogramma beschermt

Beide routes controleren het paneel voordat ze iets veranderen, en weigeren over een bestaande installatie heen te installeren in plaats van te riskeren wat erop staat. De netwerkroute maakt een momentopname van de gegevens van het paneel voordat er iets verandert. Als een installatie wordt onderbroken, kun je die opnieuw starten; dan controleert hij elke half afgemaakte stap voordat hij verdergaat. De [notities over installatieveiligheid](/nl/manage/install-safety/) beschrijven precies wat er wordt beschermd en wanneer het installatieprogramma stopt.

## Na de installatie

Het paneel verschijnt als apparaat met een statussensor en diagnostiek, en op de pagina Panel Assistant in de zijbalk. Het paneel biedt ook een eigen statuspagina op je netwerk op poort 8888; daar stel je in naar welk dashboard het wijst. Tot die tijd toont het scherm van het paneel zelf dat adres, met een QR-code en knoppen om het te configureren of het dashboard te openen.

![Het wachtscherm van het paneel vóór de installatie, met het configuratieadres, een QR-code en de knoppen Configure en Dashboard](asset:standing-screen.png)

Ga verder met [Een paneel verbinden](/nl/home-assistant/connect-a-panel/).

## Andere manieren

Er is ook een [installatieprogramma voor de opdrachtregel](/nl/manage/command-line-install/) voor wie daar de voorkeur aan geeft, en dat gebruikte het project voordat de integratie bestond. Je hebt het niet nodig.
