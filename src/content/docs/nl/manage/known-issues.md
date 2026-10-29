---
title: Bekende problemen in 1.0.0-rc1
description: Bekende beperkingen van Panel Assistant 1.0.0-rc1 en de bijbehorende paneel-app, en wat je eraan kunt doen.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0.0-rc1 en de bijbehorende paneel-app zijn release candidates. Deze pagina beschrijft bekende beperkingen en wat je eraan kunt doen. Lees eerst [Upgraden naar 1.0](/nl/manage/upgrade-to-1-0/): daar staat waaraan je moet voldoen vóór de installatie en waarom een paneel op 1.0 niet terug kan naar 0.9. Meld andere problemen in de [issuetracker](https://github.com/panel-assistant/ha-integration/issues), met het paneelmodel en wat je zag.

## Een paneel met de 0.9-app moet mogelijk opnieuw met ADB worden verbonden

De reparatie die zegt dat een paneel app 1.0.0-rc1 nodig heeft, betekent dat de app nog niet met Panel Assistant 1.0 kan communiceren. Zegt Home Assistant ook dat het paneel geen app-updates kan ontvangen, volg dan die reparatie om de updateroute te herstellen. Is netwerkfoutopsporing uitgeschakeld, sluit het paneel dan op je computer aan en start het USB-installatieprogramma vanuit Home Assistant, zoals beschreven onder [een paneel dat niet kan worden bijgewerkt](/nl/manage/updates-and-recovery/#een-paneel-dat-niet-kan-worden-bijgewerkt). Op een paneel waarop de app al staat, kan het USB-installatieprogramma de verbinding herstellen zonder opnieuw te installeren: vink zo nodig **Altijd toestaan vanaf deze computer** aan en tik op **Toestaan** op het paneel. Het installatieprogramma zet netwerkfoutopsporing weer aan, zodat Home Assistant de app kan bijwerken.

## De zijbalk kan een paneel pas openen als de 1.0-app erop draait

In 1.0 toont de Panel Assistant-zijbalk de pagina’s van een paneel via de eigen verbinding van het paneel met Home Assistant. Een paneel met een 0.9-app kan daar zijn pagina’s niet openen. Werk eerst de paneel-app bij.

## Spraak staat standaard aan als het apparaatprofiel een microfoon vermeldt

Spraak staat standaard aan wanneer het apparaatprofiel van het paneel een microfoon vermeldt, tenzij je het al had uitgezet. Wil je niet dat het paneel naar een activeringswoord luistert, zet dan **Spraakassistent** uit onder **Spraak** op de pagina **Configureren** van het paneel.

## Na volledig uitschakelen van het scherm kan een schermvergrendelingspincode nodig zijn

Op panelen waarbij het uitschakelen van het scherm via de schermtime-out of apparaatbeheer van Android loopt, kan bij het ontwaken een ingestelde schermvergrendelingspincode nodig zijn. Verwijder de pincode als het paneel direct naar zijn dashboard moet ontwaken.

## Twee entiteiten zijn verdwenen

De afzonderlijke afbeeldingsentiteit voor cameramomentopnamen is verwijderd; gebruik de camera-entiteit van het paneel. Op een paneel met een luidspreker is het afzonderlijke volumenummer verwijderd; gebruik het volume van de mediaspeler met `media_player.volume_set`. Een reparatie vermeldt de automatiseringen en scripts die het volumenummer nog gebruiken. Voor de verwijderde momentopname-afbeelding bestaat geen overeenkomstige reparatie, dus controleer zelf waar die wordt gebruikt.

## Een back-up herstellen op een paneel zonder root kan instellingen overslaan

Een instellingenback-up van een geroot paneel kan instellingen bevatten die een paneel zonder root niet kan toepassen. Het herstel vermeldt welke niet-beschikbare instellingen worden overgeslagen en past de ondersteunde instellingen toe. Controleer het herstelresultaat op overgeslagen instellingen of fouten.
