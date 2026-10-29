---
title: Installatiescript (buiten gebruik)
description: Het opdrachtregel-installatieprogramma installeert of actualiseert geen panelen meer. Wat je in plaats daarvan gebruikt en hoe je ha-paneld van een paneel verwijdert.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Het opdrachtregel-installatieprogramma is verwijderd. Voeg panelen toe en werk ze bij via Panel Assistant in Home Assistant.

Gebruik voortaan Panel Assistant in [Home Assistant](/nl/install/installing-ha-paneld/) om panelen toe te voegen en bij te werken. Een paneel dat met het script is geïnstalleerd, blijft werken. Voeg het toe aan Panel Assistant: het wordt verbonden in plaats van opnieuw geïnstalleerd en Panel Assistant biedt daarna de updates aan.

## ADB op het netwerk beschikbaar maken

Op sommige Tuya TPA10- en Smatek-panelen werkt ADB eerst alleen via USB. Sluit de USB-kabel aan en zet netwerk-ADB aan voordat je het paneel in Home Assistant toevoegt:

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

## ha-paneld van een paneel verwijderen

Kies de optie **Panel Assistant van dit paneel verwijderen** onder **Configureren** in Home Assistant. Kies in 1.0.0-rc1 of Home Assistant het paneel moet vergeten en selecteer **Verzenden**. In de nog niet uitgebrachte versie 1.0.0-rc2 heet de optie **Van dit paneel verwijderen** en wordt bij geslaagde verwijdering de Home Assistant-vermelding altijd verwijderd. Panel Assistant geeft het paneel zijn eigen startscherm terug en verwijdert de paneel-app. Lees eerst [Voordat je ha-paneld verwijdert](/nl/manage/removal-risks/).

## Toegangsroutes en beveiligingsmodus

Aanbevelingen van hardwareprofielen zijn uitsluitend informatief. Een profiel kiezen is geen toestemming om pakketten uit te schakelen, ADB blijvend beschikbaar te maken, bevoorrechte software te installeren of beeldscherminstellingen te wijzigen. Pakketten die je al hebt getemd op de kaart [Pakketten van de fabrikant](/nl/manage/vendor-packages/), worden nog steeds bij elke start opnieuw getemd.

De [beveiligde modus Hardened](/nl/manage/security-mode/) vereist dat iemand op het paneel geselecteerde externe handelingen met grote gevolgen goedkeurt. Je kunt deze modus alleen op het paneel inschakelen. Netwerk-ADB is niet bruikbaar zolang hij aan staat, dus zet het paneel op het paneel zelf terug naar Relaxed voordat je via ADB installeert of bijwerkt.

## Zelf bouwen

De app is gratis en opensource. De pagina [Ontwikkelomgeving](/nl/reference/development-environment/) beschrijft hoe je hem bouwt.
