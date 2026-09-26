---
title: Het paneel voorbereiden
description: De twee dingen die een paneel nodig heeft voordat Panel Assistant erop kan installeren, en de WebView-update die bepaalt of het eerste dashboard er goed uitziet.
sourceCommit: e132b3f499b292a1757d97d76675e840a7a25067
---

Er moeten twee dingen kloppen voordat je een paneel toevoegt, en een derde bepaalt of het eerste dashboard er goed uitziet. Voor geen van drieën heb je een opdrachtregel nodig.

## 1. Ontwikkelaarsopties en foutopsporing staan aan

Het installatieprogramma praat met het paneel via de foutopsporingsinterface van Android, die elk Android-apparaat heeft maar die standaard uit staat. Om die aan te zetten open je de ontwikkelaarsopties op het paneel en schakel je foutopsporing in: **USB-foutopsporing** voor de [USB-route](/nl/install/install-over-usb/), of **draadloze foutopsporing**, soms netwerk-ADB genoemd, voor de netwerkroute. De precieze stappen verschillen per model en staan op de [hardwarepagina's](/nl/hardware/).

De eerste keer dat het installatieprogramma verbinding maakt, toont het paneel een autorisatievraag op zijn eigen scherm. Iemand moet die daar goedkeuren; dat kan niet op afstand.

## 2. Het paneel heeft een vast adres

Geef het paneel voor de netwerkroute een vast adres of een DHCP-reservering, zodat het niet van adres verandert. Dat adres gebruik je om het toe te voegen, en daarna voor de eigen statuspagina van het paneel op poort 8888. Een paneel dat via USB is geïnstalleerd, kun je achteraf een vast adres geven.

## 3. De systeem-WebView is actueel

Het dashboard wordt getekend door de systeem-WebView van het paneel, en panelen worden standaard geleverd met een die jaren verouderd is. Een oude WebView geeft een leeg scherm, een half getekend dashboard of scriptfouten die eruitzien als een fout in de paneel-app. Het is met afstand het meest voorkomende probleem bij de eerste keer opstarten.

Werk hem bij voordat je iets anders beoordeelt. De procedure, inclusief de panelen die het lastig maken, staat in [De systeem-WebView bijwerken](/nl/hardware/guides/update-the-webview/).

## Voordat je iets onomkeerbaars verandert

Panel Assistant zelf flasht of root niets. Sommige panelen kun je met de hand rooten of opnieuw flashen, en een deel daarvan is terug te draaien en een deel niet. Als je die weg inslaat, lees dan eerst [installatieveiligheid](/nl/manage/install-safety/), en kijk bij [Updates en herstel](/nl/manage/updates-and-recovery/) waarvan je een back-up kunt maken en waarvan niet.
