---
title: Panel vorbereiten
description: Was ein Panel vor der Installation von Panel Assistant benötigt und welches WebView-Update entscheidet, ob das erste Dashboard richtig aussieht.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Eine Voraussetzung muss erfüllt sein, bevor du ein Panel hinzufügst. Eine zweite entscheidet, ob das erste Dashboard richtig aussieht. Der Weg hängt von deinem Modell und seiner Firmware ab.

## 1. Entwickleroptionen und Debugging sind eingeschaltet

Der Installer kommuniziert mit dem Panel über die Android-Debugging-Schnittstelle, die Hersteller deaktivieren oder einschränken können. Öffne auf den meisten Panels **Einstellungen**, dann **Über das Gerät**, und tippe siebenmal auf **Build-Nummer**, bis das Panel meldet, dass du Entwickler bist. Anschließend erscheinen die **Entwickleroptionen** in den Einstellungen. Manche Hersteller verstecken diese Funktion oder benennen sie anders. Die [Hardwareseiten](/de/hardware/) nennen die bekannten Schritte und kennzeichnen ungeprüfte Verfahren. Schalte in den Entwickleroptionen **USB-Debugging** für den [USB-Weg](/de/install/install-over-usb/) oder **Netzwerk-ADB auf TCP-Port 5555** für den Netzwerkweg ein. Nicht jedes Panel hat einen Schalter für Netzwerk-ADB. Die Hardwareseite deines Modells beschreibt, ob es einen gibt. Falls nicht, verwende den USB-Weg, sobald USB-Debugging verfügbar ist. Wenn auch der USB-Zugang ungeprüft ist, frage den Lieferanten nach einer Anleitung für dein Modell und seine Firmware, bevor du einen der Installer wählst. Root-Zugriff ist davon getrennt: Ein Befehl `adb root` setzt bereits funktionierendes Debugging voraus. Die gekoppelte Android-Funktion „Drahtloses Debugging“ ist eine andere Verbindungsmethode und wird von diesem Installer nicht unterstützt.

Wenn das Panel dich zur Autorisierung der Verbindung auffordert, muss jemand die Abfrage auf dem Bildschirm des Panels bestätigen. Das ist aus der Ferne nicht möglich.

Das Panel benötigt keine feste Adresse: Panel Assistant folgt einem Panel, dessen Adresse sich ändert.

## 2. Die System-WebView ist aktuell

Das Dashboard wird von der System-WebView des Panels gezeichnet, auch Browser-Engine genannt. Eine alte WebView kann dazu führen, dass ein Dashboard leer bleibt oder nur teilweise dargestellt wird.

In der unveröffentlichten Version 1.0.0-rc2 können sowohl der Netzwerk- als auch der USB-Installer auf unterstützten Panels ein geprüftes, kompatibles Update der Browser-Engine anfordern. Wenn dieses Update nicht abgeschlossen werden kann, bleiben Einrichtung und Kopplung möglich. Ein unvollständiger Versuch kann über die Update-Reparatur des Panels in Home Assistant fortgesetzt werden: Wähle **Erneut versuchen**. Dabei werden vorhandene Arbeiten geprüft, bevor ein weiterer Versuch angefordert wird. Fehlgeschlagene Updates werden nicht nach einem Zeitplan erneut versucht.

In dieser Version warnt der Einrichtungsassistent, wenn die integrierte Browser-Engine zu alt ist. Du kannst Einrichtung und Kopplung abschließen, aber das Dashboard wird möglicherweise weiterhin nicht angezeigt. Wenn das Panel das Update nicht installieren kann, befolge [System-WebView aktualisieren](/de/hardware/guides/update-the-webview/).

## Bevor du etwas Unumkehrbares änderst

Panel Assistant selbst flasht und rootet nichts. Manche Panels lassen sich von Hand rooten oder neu flashen. Einige dieser Änderungen lassen sich rückgängig machen, andere nicht. Wenn du diesen Weg einschlägst, lies zuerst [Installationssicherheit](/de/manage/install-safety/). Unter [Updates und Wiederherstellung](/de/manage/updates-and-recovery/) erfährst du, was gesichert werden kann und was nicht.
