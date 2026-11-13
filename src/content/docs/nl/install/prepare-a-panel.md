---
title: Het paneel voorbereiden
description: Wat een paneel nodig heeft voordat Panel Assistant erop kan installeren, en de WebView-update die bepaalt of het eerste dashboard er goed uitziet.
sourceCommit: 909b9380c8cfacc743c099e74e56e8ef2524d3b8
---

Eén ding moet kloppen voordat je een paneel toevoegt, en een tweede bepaalt of het eerste dashboard er goed uitziet. De route hangt af van je model en firmware.

## 1. Ontwikkelaarsopties en foutopsporing staan aan

Het installatieprogramma praat met het paneel via de foutopsporingsinterface van Android, die fabrikanten kunnen uitschakelen of beperken. Je schakelt dit op het paneel zelf in, in de eigen Instellingen; op je computer hoeft niets te worden geïnstalleerd. Open op de meeste panelen **Instellingen**, dan **Over**, en tik zeven keer op **Buildnummer** totdat het paneel zegt dat je ontwikkelaar bent; **Ontwikkelaarsopties** verschijnt dan in Instellingen. Sommige fabrikanten verbergen dit of geven het een andere naam. De [hardwarepagina’s](/nl/hardware/) beschrijven de bekende stappen en geven aan welke procedures niet zijn geverifieerd. Schakel in de ontwikkelaarsopties **USB-foutopsporing** in voor de [USB-route](/nl/install/install-over-usb/), of **netwerk-ADB op TCP-poort 5555** voor de netwerkroute. Niet elk paneel heeft een schakelaar voor netwerk-ADB; de hardwarepagina van je model vermeldt of die er is. Als die ontbreekt, gebruik dan de USB-route zodra USB-foutopsporing beschikbaar is. Is ook USB-toegang niet geverifieerd, vraag dan de leverancier om instructies voor je model en firmware voordat je een installatieprogramma kiest. Roottoegang staat hier los van en Panel Assistant heeft die niet nodig om te installeren. De gekoppelde functie Draadloze foutopsporing van Android is een andere verbindingsmethode en wordt niet ondersteund door dit installatieprogramma.

Als het paneel vraagt de verbinding te autoriseren, moet iemand die melding op het scherm van het paneel zelf goedkeuren; dat kan niet op afstand.

Het paneel heeft geen vast adres nodig: Panel Assistant volgt een paneel waarvan het adres verandert.

## 2. De systeem-WebView is actueel

Het dashboard wordt getekend door de systeem-WebView van het paneel, ook wel de browser-engine genoemd. Een oude WebView kan een leeg of gedeeltelijk getekend dashboard opleveren.

Zowel het netwerk- als het USB-installatieprogramma kunnen een geverifieerde, compatibele update van de browser-engine aanvragen op ondersteunde panelen. Als die update niet kan worden afgerond, blijven instellen en koppelen beschikbaar. Een onafgeronde poging kun je voortzetten via de update-reparatie van het paneel in Home Assistant: kies **Opnieuw proberen**. Er wordt gecontroleerd welk werk al is gedaan voordat een nieuwe poging wordt aangevraagd; mislukte updates worden niet volgens een schema opnieuw geprobeerd.

De installatiewizard waarschuwt wanneer de ingebouwde browser-engine te oud is. Je kunt het instellen en koppelen afronden, maar het dashboard wordt mogelijk nog steeds niet weergegeven. Als het paneel de update niet kan installeren, volg dan [De systeem-WebView bijwerken](/nl/hardware/guides/update-the-webview/).

## Voordat je iets onomkeerbaars verandert

Panel Assistant zelf flasht of root niets. Sommige panelen kun je met de hand rooten of opnieuw flashen, en een deel daarvan is terug te draaien en een deel niet. Als je die weg inslaat, lees dan eerst [firmwareback-up en -herstel](/nl/hardware/guides/firmware-backup-and-restore/), en kijk bij [Updates en herstel](/nl/manage/updates-and-recovery/) waarvan je een back-up kunt maken en waarvan niet.
