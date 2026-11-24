---
title: Bekende problemen
description: Bekende beperkingen van Panel Assistant en de bijbehorende paneel-app, en wat je eraan kunt doen.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Deze pagina beschrijft bekende beperkingen en wat je eraan kunt doen. Meld andere problemen in de [issuetracker](https://github.com/panel-assistant/ha-integration/issues), met het paneelmodel en wat je zag.

## Spraak staat standaard aan als het apparaatprofiel een microfoon vermeldt

Spraak staat standaard aan wanneer het apparaatprofiel van het paneel een microfoon vermeldt, tenzij je het al had uitgezet. Wil je niet dat het paneel naar een activeringswoord luistert, zet dan **Spraakassistent** uit onder **Spraak** op de pagina **Configureren** van het paneel.

## Na volledig uitschakelen van het scherm kan een schermvergrendelingspincode nodig zijn

Op panelen waarbij het uitschakelen van het scherm via de schermtime-out of apparaatbeheer van Android loopt, kan bij het ontwaken een ingestelde schermvergrendelingspincode nodig zijn. Verwijder de pincode als het paneel direct naar zijn dashboard moet ontwaken.

## Twee entiteiten zijn verdwenen

De afzonderlijke afbeeldingsentiteit voor cameramomentopnamen is verwijderd; gebruik de camera-entiteit van het paneel. Op een paneel met een luidspreker is het afzonderlijke volumenummer verwijderd; gebruik het volume van de mediaspeler met `media_player.volume_set`. Een reparatie vermeldt de automatiseringen en scripts die het volumenummer nog gebruiken. Voor de verwijderde momentopname-afbeelding bestaat geen overeenkomstige reparatie, dus controleer zelf waar die wordt gebruikt.

## Een back-up herstellen op een paneel zonder root kan instellingen overslaan

Een instellingenback-up van een geroot paneel kan instellingen bevatten die een paneel zonder root niet kan toepassen. Het herstel vermeldt welke niet-beschikbare instellingen worden overgeslagen en past de ondersteunde instellingen toe. Controleer het herstelresultaat op overgeslagen instellingen of fouten.
