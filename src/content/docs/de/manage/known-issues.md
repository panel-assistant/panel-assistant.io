---
title: Bekannte Probleme in 1.0.2
description: Bekannte Einschränkungen von Panel Assistant 1.0.2 und der passenden Panel-App und was du jeweils tun kannst.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0.2 und die passende Panel-App sind stabile Versionen. Diese Seite nennt bekannte Einschränkungen und was du jeweils tun kannst. Lies zuerst [Upgrade auf 1.0](/de/manage/upgrade-to-1-0/): Dort steht, welche Voraussetzungen vor der Installation erfüllt sein müssen und warum ein Panel mit 1.0 nicht zu 0.9 zurückkehren kann. Melde alles Weitere im [Issue-Tracker](https://github.com/panel-assistant/ha-integration/issues) mit dem Panelmodell und deiner Beobachtung.

## Ein Panel mit der App 0.9 benötigt möglicherweise eine wiederhergestellte ADB-Verbindung

Die Reparatur, die für ein Panel die App 1.0 verlangt, bedeutet, dass seine App noch nicht mit Panel Assistant 1.0 kommunizieren kann. Wenn Home Assistant außerdem meldet, dass das Panel keine App-Updates empfangen kann, befolge diese Reparatur, um seinen Updateweg wiederherzustellen. Ist das Netzwerk-Debugging ausgeschaltet, schließe das Panel an deinen Computer an und starte den USB-Installer über Home Assistant, wie unter [Ein Panel, das nicht aktualisiert werden kann](/de/manage/updates-and-recovery/#ein-panel-das-sich-nicht-aktualisieren-lässt) beschrieben. Auf einem Panel, das die App bereits hat, kann der USB-Installer die Verbindung ohne Neuinstallation wiederherstellen: Aktiviere bei Aufforderung **Von diesem Computer immer zulassen** und tippe am Panel auf **Zulassen**. Der Installer schaltet das Netzwerk-Debugging wieder ein, damit Home Assistant die App aktualisieren kann.

## Die Seitenleiste kann ein Panel erst mit der App 1.0 öffnen

In 1.0 zeigt die Panel Assistant-Seitenleiste die Seiten eines Panels über dessen eigene Verbindung zu Home Assistant an. Die Seiten eines Panels mit der App 0.9 können dort nicht geöffnet werden. Aktualisiere zuerst die Panel-App.

## Sprachsteuerung ist anfangs eingeschaltet, wenn das Geräteprofil ein Mikrofon angibt

Sprachsteuerung ist standardmäßig eingeschaltet, wenn das Geräteprofil des Panels ein Mikrofon angibt, sofern du sie nicht bereits ausgeschaltet hattest. Wenn das Panel nicht auf ein Aktivierungswort lauschen soll, schalte **Sprachassistent** unter **Sprachassistent** auf der Seite **Konfiguration** des Panels aus.

## Nach vollständigem Ausschalten des Bildschirms kann eine Bildschirmsperr-PIN nötig sein

Auf Panels, deren Weg zum Ausschalten des Bildschirms das Android-Bildschirmzeitlimit oder die Geräteadministration nutzt, kann beim Aufwecken eine eingerichtete Bildschirmsperr-PIN erforderlich sein. Entferne die PIN, wenn das Panel direkt mit seinem Dashboard aufwachen soll.

## Zwei Entitäten entfallen

Die separate Bildentität für Kamera-Schnappschüsse wurde entfernt. Verwende die Kameraentität des Panels. Auf einem Panel mit Lautsprecher entfällt die separate Lautstärke-Zahlenentität. Verwende die Lautstärke des Mediaplayers mit `media_player.volume_set`. Eine Reparatur nennt die Automatisierungen und Skripte, die noch die Lautstärke-Zahlenentität verwenden. Für das entfernte Schnappschussbild gibt es keine entsprechende Reparatur. Prüfe dessen Nutzer daher selbst.

## Beim Wiederherstellen einer Sicherung auf einem Panel ohne Root können Einstellungen übersprungen werden

Eine Einstellungssicherung von einem gerooteten Panel kann Einstellungen enthalten, die ein Panel ohne Root nicht anwenden kann. Die Wiederherstellung listet übersprungene, nicht verfügbare Einstellungen auf und wendet die unterstützten Einstellungen an. Prüfe das Ergebnis auf übersprungene Einstellungen oder Fehler.
