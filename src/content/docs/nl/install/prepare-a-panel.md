---
title: Het paneel voorbereiden
description: Wat een paneel nodig heeft voordat Panel Assistant erop kan installeren, en de WebView-update die bepaalt of het eerste dashboard er goed uitziet.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Eén ding moet kloppen voordat je een paneel toevoegt, en een tweede bepaalt of het eerste dashboard er goed uitziet. Voor geen van beide heb je een opdrachtregel nodig.

## 1. Ontwikkelaarsopties en foutopsporing staan aan

Het installatieprogramma praat met het paneel via de foutopsporingsinterface van Android, die elk Android-apparaat heeft maar die standaard uit staat. Open op de meeste panelen **Instellingen**, dan **Over**, en tik zeven keer op **Buildnummer** totdat het paneel zegt dat je ontwikkelaar bent; **Ontwikkelaarsopties** verschijnt dan in Instellingen. Sommige fabrikanten verbergen dit of geven het een andere naam. De [hardwarepagina’s](/nl/hardware/) tonen de precieze stappen per model. Schakel in de ontwikkelaarsopties **USB-foutopsporing** in voor de [USB-route](/nl/install/install-over-usb/), of **netwerk-ADB op TCP-poort 5555** voor de netwerkroute. Niet elk paneel heeft een schakelaar voor netwerk-ADB; de hardwarepagina van je model vermeldt of die er is. Als die ontbreekt, gebruik dan de USB-route. De gekoppelde functie Draadloze foutopsporing van Android is een andere verbindingsmethode en wordt niet ondersteund door dit installatieprogramma.

Als het paneel vraagt de verbinding te autoriseren, moet iemand die melding op het scherm van het paneel zelf goedkeuren; dat kan niet op afstand.

Het paneel heeft geen vast adres nodig: Panel Assistant volgt een paneel waarvan het adres verandert.

## 2. De systeem-WebView is actueel

Het dashboard wordt getekend door de systeem-WebView van het paneel, en panelen worden standaard geleverd met een die jaren verouderd is. Een oude WebView geeft een leeg scherm, een half getekend dashboard of scriptfouten die eruitzien als een fout in de paneel-app. Het is met afstand het meest voorkomende probleem bij de eerste keer opstarten.

Werk hem bij voordat je iets anders beoordeelt. De procedure, inclusief de panelen die het lastig maken, staat in [De systeem-WebView bijwerken](/nl/hardware/guides/update-the-webview/).

## Voordat je iets onomkeerbaars verandert

Panel Assistant zelf flasht of root niets. Sommige panelen kun je met de hand rooten of opnieuw flashen, en een deel daarvan is terug te draaien en een deel niet. Als je die weg inslaat, lees dan eerst [installatieveiligheid](/nl/manage/install-safety/), en kijk bij [Updates en herstel](/nl/manage/updates-and-recovery/) waarvan je een back-up kunt maken en waarvan niet.
