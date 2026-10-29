---
title: Installationsskript (eingestellt)
description: Der Installer für die Befehlszeile installiert oder aktualisiert keine Panels mehr. Die Alternativen und wie du ha-paneld von einem Panel entfernst.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Der Installer für die Befehlszeile wurde entfernt. Füge Panels über Panel Assistant in Home Assistant hinzu und aktualisiere sie dort.

Verwende stattdessen Panel Assistant in [Home Assistant](/de/install/installing-ha-paneld/) zum Hinzufügen und Aktualisieren von Panels. Ein mit dem Skript installiertes Panel funktioniert weiterhin. Füge es zu Panel Assistant hinzu: Es wird verbunden statt neu installiert. Anschließend bietet Panel Assistant seine Updates an.

## ADB im Netzwerk verfügbar machen

Auf manchen Tuya TPA10- und Smatek-Panels funktioniert ADB anfangs nur über USB. Schließe das USB-Kabel an und aktiviere Netzwerk-ADB, bevor du das Panel in Home Assistant hinzufügst:

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

## ha-paneld von einem Panel entfernen

Wähle unter **Konfigurieren** in Home Assistant die Option **Panel Assistant von diesem Panel entfernen**. Wähle in 1.0.0-rc1, ob Home Assistant das Panel vergessen soll, und anschließend **Absenden**. In der unveröffentlichten Version 1.0.0-rc2 heißt die Option **Von diesem Panel entfernen**, und eine erfolgreiche Entfernung löscht immer den Home Assistant-Eintrag. Panel Assistant gibt dem Panel seinen eigenen Startbildschirm zurück und deinstalliert die Panel-App. Lies zuerst [Bevor du ha-paneld entfernst](/de/manage/removal-risks/).

## Zugriffswege und Sicherheitsmodus

Empfehlungen eines Hardwareprofils dienen nur der Information. Die Auswahl eines Profils ist keine Zustimmung zum Deaktivieren von Paketen, dauerhaften Aktivieren von ADB, Installieren privilegierter Software oder Ändern von Anzeigeeinstellungen. Pakete, die du bereits auf der Karte [Herstellerpakete](/de/manage/vendor-packages/) gebändigt hast, werden bei jedem Start erneut gebändigt.

Der [gehärtete Sicherheitsmodus](/de/manage/security-mode/) verlangt für ausgewählte Fernaktionen mit weitreichenden Folgen die Bestätigung einer Person am Panel. Er kann nur am Panel eingeschaltet werden. Netzwerk-ADB ist in diesem Modus nicht nutzbar. Stelle das Panel daher direkt am Panel auf den entspannten Modus zurück, bevor du über ADB installierst oder aktualisierst.

## Selbst bauen

Die App ist frei und quelloffen. Die Seite [Entwicklungsumgebung](/de/reference/development-environment/) beschreibt, wie du sie baust.
