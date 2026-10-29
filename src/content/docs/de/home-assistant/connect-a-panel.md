---
title: Panel verbinden
description: Dein Dashboard auf das Panel bringen und wie die eigene Hardware des Panels in Home Assistant erscheint.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ein Panel, das zu Home Assistant hinzugefügt wurde, verbindet sich auf zwei Arten damit. Die eine bringt ein Dashboard auf den Bildschirm. Die andere bindet die eigene Hardware des Panels als Entitäten ein.

## Das Dashboard auf dem Bildschirm

Du wählst das Dashboard im Einrichtungsassistenten des Panels, wenn du das Panel hinzufügst. Um es später zu ändern, wähle auf der Geräteseite des Panels in Home Assistant **Besuchen**, um seine Statusseite zu öffnen, und wähle ein anderes. Das Panel lädt dieses Dashboard selbst. Bei [aktiviertem Entitätenfilter](/de/manage/performance/) ermittelt es, welche Entitäten das Dashboard verwendet, und fordert von Home Assistant nur diese an. Einzelheiten dazu, wie das Dashboard geladen wird und was das Panel bei einem Ladefehler tut, findest du auf der Seite zum [integrierten Renderer](/de/manage/built-in-renderer/).

## Die Hardware des Panels in Home Assistant

Der Bildschirm, die LEDs, Tasten, Sensoren und Relais deines Modells erscheinen in Home Assistant als Entitäten am Gerät des Panels. So kann eine physische Taste eine Automatisierung auslösen und eine LED den Zustand von etwas Beliebigem anzeigen. Welche Entitäten du erhältst, hängt vom Hardwareprofil des Modells ab. Die [Hardwareseiten](/de/hardware/) beschreiben, was jedes Panel bereitstellt.

## Die Statusseite des Panels

Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen**, um seine Statusseite zu öffnen. Jedes Panel stellt diese Seite in deinem lokalen Netzwerk bereit, standardmäßig auf Port **8888** (zum Beispiel `http://<panel>:8888/`). Dort wählst du das Dashboard, siehst, was das Panel tut, und liest seinen Diagnosebericht. Sie ist für ein vertrauenswürdiges Heimnetzwerk ausgelegt. Behandle den Zugriff darauf deshalb genauso wie den Zugriff auf das Panel selbst. Die [API-Referenz](/de/reference/api/) und der [Sicherheitsmodus](/de/manage/security-mode/) beschreiben ihr Angebot und das Vertrauensmodell.
