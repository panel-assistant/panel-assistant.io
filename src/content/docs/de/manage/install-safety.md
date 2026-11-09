---
title: Installationssicherheit
description: Was Panel Assistant vor Änderungen an einem Panel prüft, warum du eine unterbrochene Installation sicher erneut ausführen kannst und was vor einem Update gesichert wird.
sourceCommit: 761d6a72fee28ab8639a6dca9fa60452d2cb5ff7
---

Panel Assistant installiert und aktualisiert Panels aus Home Assistant heraus. Eine Installation ist so ausgelegt, dass sie beim ersten Durchlauf und nach einer Unterbrechung dasselbe Ergebnis liefert. Diese Seite beschreibt die Prüfungen und die gesicherten Daten.

## Prüfungen vor jeder Änderung

Beide Installationswege prüfen das Panel, bevor sie es ändern. Die Netzwerkinstallation prüft, was bereits auf dem Panel vorhanden ist, und bittet dich, die Installation zu bestätigen. Ein Panel, auf dem die Panel-App bereits läuft, wird übernommen statt neu installiert. Die USB-Installation überschreibt keine andere vorhandene Installation: Ist genau der ausgewählte Build bereits installiert, schließt sie dessen Einrichtung ab. Ist ein anderer Build installiert, verbindet sie diesen wieder mit Panel Assistant, ohne ein Update zu installieren.

Die Veröffentlichung kommt aus deinem eigenen Home Assistant. Home Assistant prüft sie, bevor es sie an das Installationsprogramm übergibt. So erreicht das Panel nichts, was Home Assistant nicht überprüft hat. [Über USB installieren](/de/install/install-over-usb/) und [Ein Panel hinzufügen](/de/install/installing-ha-paneld/) beschreiben die beiden Wege.

## Sicher erneut ausführbar

Eine abgebrochene Installation kannst du erneut ausführen. Bei USB speichert das Installationsprogramm den Fortschritt in deinem Browser, prüft zuerst den unterbrochenen Schritt und setzt dort fort, statt von vorn zu beginnen. Wenn du bei einer Netzwerkinstallation das Panel mit derselben Adresse erneut hinzufügst, prüft Home Assistant es vor jeder Änderung erneut. Ist die Panel-App bereits installiert, verbindet Home Assistant sie und installiert nichts.

Kann Home Assistant nicht feststellen, wie weit die Installation gekommen ist, stoppt es, statt zu raten, und weist in seiner Meldung darauf hin. Die [Fehlerbehebung](/de/manage/troubleshooting/#eine-netzwerkinstallation-wurde-unterbrochen) erklärt die einzelnen Meldungen und die nächsten Schritte.

## Sicherung vor jedem Update

Panel Assistant sichert die Einstellungen des Panels vor jedem Update und behält die letzten fünf Sicherungen je Panel. Nach dem Update bestätigt es, dass das Panel wieder fehlerfrei läuft.

Erstelle vor einer Änderung, bei der du unsicher bist, und immer vor dem Entfernen der App oder dem Löschen ihrer Daten selbst eine vollständige Sicherung: Öffne in der Weboberfläche des Panels **Installation**, dann **Sicherung**, und prüfe, dass die heruntergeladene `.hpb`-Datei nicht leer ist. Sie enthält Einstellungen, dauerhaften Panel-Zustand, den Profilkatalog und eine unterstützte Anmeldung einer separaten Dashboard-App. Der erlernte Entitätenkatalog sowie Näherungs- und Umgebungsverläufe werden neu erlernt statt wiederhergestellt. Stelle die Sicherung auf derselben Seite über **Installation**, dann **Wiederherstellen**, wieder her.

## Was Panel Assistant unberührt lässt

Panel Assistant flasht ein Panel nicht neu, verschafft ihm keinen Root-Zugriff und verändert niemals seine Firmware. Sicherung und Wiederherstellung auf Firmware-Ebene sind bei einigen gerooteten Panels eine separate, manuelle Aufgabe, beschrieben unter [Firmware-Sicherung und -Wiederherstellung](/de/hardware/guides/firmware-backup-and-restore/). [Updates und Wiederherstellung](/de/manage/updates-and-recovery/) beschreibt, was sich wiederherstellen lässt, wenn etwas schiefgeht.
