---
title: Bekannte Probleme
description: Bekannte Einschränkungen von Panel Assistant und der passenden Panel-App und was du jeweils tun kannst.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Diese Seite nennt bekannte Einschränkungen und was du jeweils tun kannst. Melde alles Weitere im [Issue-Tracker](https://github.com/panel-assistant/ha-integration/issues) mit dem Panelmodell und deiner Beobachtung.

## Sprachsteuerung ist anfangs eingeschaltet, wenn das Geräteprofil ein Mikrofon angibt

Sprachsteuerung ist standardmäßig eingeschaltet, wenn das Geräteprofil des Panels ein Mikrofon angibt, sofern du sie nicht bereits ausgeschaltet hattest. Wenn das Panel nicht auf ein Aktivierungswort lauschen soll, schalte **Sprachassistent** unter **Sprachassistent** auf der Seite **Konfiguration** des Panels aus.

## Nach vollständigem Ausschalten des Bildschirms kann eine Bildschirmsperr-PIN nötig sein

Auf Panels, deren Weg zum Ausschalten des Bildschirms das Android-Bildschirmzeitlimit oder die Geräteadministration nutzt, kann beim Aufwecken eine eingerichtete Bildschirmsperr-PIN erforderlich sein. Entferne die PIN, wenn das Panel direkt mit seinem Dashboard aufwachen soll.

## Zwei Entitäten entfallen

Die separate Bildentität für Kamera-Schnappschüsse wurde entfernt. Verwende die Kameraentität des Panels. Auf einem Panel mit Lautsprecher entfällt die separate Lautstärke-Zahlenentität. Verwende die Lautstärke des Mediaplayers mit `media_player.volume_set`. Eine Reparatur nennt die Automatisierungen und Skripte, die noch die Lautstärke-Zahlenentität verwenden. Für das entfernte Schnappschussbild gibt es keine entsprechende Reparatur. Prüfe dessen Nutzer daher selbst.

## Beim Wiederherstellen einer Sicherung auf einem Panel ohne Root können Einstellungen übersprungen werden

Eine Einstellungssicherung von einem gerooteten Panel kann Einstellungen enthalten, die ein Panel ohne Root nicht anwenden kann. Die Wiederherstellung listet übersprungene, nicht verfügbare Einstellungen auf und wendet die unterstützten Einstellungen an. Prüfe das Ergebnis auf übersprungene Einstellungen oder Fehler.
