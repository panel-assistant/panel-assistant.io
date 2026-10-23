---
title: Een paneel verbinden
description: Je dashboard op het paneel zetten, en hoe de hardware van het paneel zelf wordt weergegeven in Home Assistant.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Een paneel dat aan Home Assistant is toegevoegd, is er op twee manieren mee verbonden. De ene zet een dashboard op het scherm. De andere brengt de eigen hardware van het paneel binnen als entiteiten.

## Het dashboard op het scherm

Je kiest het dashboard in de installatiewizard van het paneel wanneer het paneel wordt toegevoegd. Wil je het later wijzigen, open dan de statuspagina van het paneel in je browser, op zijn adres met poort 8888, en kies een ander dashboard. Het paneel laadt dat dashboard zelf. Als [entiteitsfiltering is ingeschakeld](/nl/manage/performance/), leert het welke entiteiten het dashboard gebruikt en vraagt het alleen die op bij Home Assistant. Hoe het dashboard wordt geladen en wat het paneel doet als het laden mislukt, lees je op de pagina over de [ingebouwde renderer](/nl/manage/built-in-renderer/).

## De hardware van het paneel in Home Assistant

Het scherm, de leds, knoppen, sensoren en relais die jouw model heeft, verschijnen in Home Assistant als entiteiten op het apparaat van het paneel, zodat een fysieke knop een automatisering kan starten en een led de status van van alles kan tonen. Welke entiteiten je krijgt, hangt af van het hardwareprofiel van het model; op de [hardwarepagina’s](/nl/hardware/) staat wat elk paneel beschikbaar stelt.

## De statuspagina van het paneel

Elk paneel biedt zijn eigen pagina aan op je lokale netwerk, op poort 8888. Daar kies je het dashboard, zie je wat het paneel doet en lees je zijn diagnoserapport. De pagina is bedoeld voor een vertrouwd thuisnetwerk, dus ga met toegang ertoe om zoals met toegang tot het paneel zelf. De [API-referentie](/nl/reference/api/) en de [beveiligingsmodus](/nl/manage/security-mode/) beschrijven wat de pagina biedt en het vertrouwensmodel.
