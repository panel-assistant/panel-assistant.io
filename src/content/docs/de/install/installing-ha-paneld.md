---
title: Panel hinzufügen
description: Ein Panel über Home Assistant hinzufügen – über das Netzwerk oder ein USB-Kabel.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Du fügst ein Panel über Home Assistant hinzu, ohne Befehlszeile. Es gibt zwei Wege. Bei beiden erscheint das Panel am Ende als Gerät.

Arbeite unabhängig vom gewählten Weg zuerst [Panel vorbereiten](/de/install/prepare-a-panel/) durch.

## Über das Netzwerk

Für ein Panel, das bereits in deinem Netzwerk ist. Gehe zu **Einstellungen**, **Geräte & Dienste**, füge **Panel Assistant** hinzu und gib die Adresse des Panels an. Die Integration prüft, was auf dem Panel installiert ist, bittet dich bei Bedarf um die Bestätigung einer Debugging-Abfrage auf dem Bildschirm des Panels, lässt dich die Installation bestätigen, installiert die Panel-App, startet sie und erstellt erst danach das Gerät. Läuft die App bereits auf dem Panel, übernimmt sie diese stattdessen. Das geht schneller.

## Über USB

Für ein Panel, das noch im Karton liegt oder dessen Herstellersoftware den Netzwerkzugriff erschwert. Schließe es an deinen Laptop an und installiere über deinen Browser mit dem USB-Kabel. Dein Browser bleibt mit Home Assistant verbunden, das die geprüfte Veröffentlichung bereitstellt. Das Panel benötigt kein Netzwerk-ADB. Starte den Ablauf über **Einstellungen**, **Geräte & Dienste**, **Integration hinzufügen**, **Panel Assistant**, **Über USB auf diesem Computer installieren**. Dafür ist ein Chromium-basierter Browser erforderlich. Siehe [Über USB installieren](/de/install/install-over-usb/).

In der unveröffentlichten Version 1.0.0-rc2 können beide Installer auf unterstützten Panels auch ein geprüftes, kompatibles Update der Browser-Engine anfordern. Wenn ein Update nicht abgeschlossen werden kann, verhindert das weder die Einrichtung noch die Kopplung. Hinweise zur Wiederherstellung findest du unter [Panel vorbereiten](/de/install/prepare-a-panel/).

## Was der Installer schützt

Beide Wege prüfen das Panel, bevor sie etwas ändern. Der Netzwerkweg übernimmt eine vorhandene App, statt sie neu zu installieren. USB überschreibt keine andere vorhandene Installation. Ist genau der ausgewählte Build bereits installiert, schließt es dessen Einrichtung ab. Eine unterbrochene USB-Installation kann mit derselben Veröffentlichung erneut versucht werden. Dabei wird vor dem Fortfahren geprüft, was bereits abgeschlossen ist. Zu Sicherungen vor einem App-Update siehe [Updates und Wiederherstellung](/de/manage/updates-and-recovery/).

## Nach der Installation

Das Panel erscheint als Gerät mit einem Statussensor und Diagnosedaten sowie auf der Panel Assistant-Seite in der Seitenleiste. Danach schließt du den eigenen Einrichtungsassistenten des Panels ab, in dem du dem Panel einen Namen gibst und sein Dashboard auswählst. Bis die Einrichtung abgeschlossen ist, zeigt der Bildschirm des Panels einen QR-Code und eine Schaltfläche **Einrichten**. Du kannst die Einrichtung also auch über ein Telefon oder direkt auf dem Panel abschließen. Um später das Dashboard zu ändern, öffne die Geräteseite des Panels in Home Assistant und wähle **Besuchen**. Wenn du die Adresse des Panels direkt öffnest, verwende seinen gemeldeten HTTP-Port. Der Standard ist 8888.

Weiter mit [Panel verbinden](/de/home-assistant/connect-a-panel/).
