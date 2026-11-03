---
title: Adaptive Näherungserkennung und Wecken per Winken
description: Wie das Panel seinen Näherungssensor einlernt, was es an Home Assistant meldet und wie eine Winkbewegung den Bildschirm aufweckt.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Näherungssensoren in Android-Wandpanels haben keine gemeinsame brauchbare Skala. Manche melden eine Entfernung, andere nur zwei Werte, die Polarität kann umgekehrt sein, und Ruhemesswerte können sich zwischen Geräten und Firmwareversionen verschieben. Die Panel-App verwendet das kalibrierte Modell des aktiven Sensorprofils oder ein Modell, das du über die geführte Einrichtung speicherst, um Basiswert, Nahreferenz und Polarität des Sensors zu interpretieren.

![Die geführte Einrichtung der Näherungserkennung des Panels bei Schritt 3 von 7: Du wirst aufgefordert, wie gewohnt auf das Panel zuzugehen, während ein Countdown läuft](/screenshots/proximity-setup-screen-480.gif)

## Geführte Einrichtung

Öffne **Konfiguration** und dann **Anwesenheit & Aufwecken**, um zu sehen, ob das aktive Sensorprofil ein brauchbares Modell hat. Wenn dort eine Einrichtung angeboten wird, starte die geführte Einrichtung der Näherungserkennung und folge den Anweisungen auf dem Bildschirm des Panels selbst. Dabei werden das Signal bei freiem Erfassungsbereich und gezielte Handbewegungen gemessen; prüfe das Ergebnis und speichere es auf dem Panel.

**Profil-Standardwerte wiederherstellen** ersetzt deine gespeicherte Kalibrierung durch die Standardwerte des Sensorprofils, sofern diese verfügbar sind. Ein Sensor ohne brauchbares Modell benötigt eine geführte Einrichtung, bevor das Aufwecken durch Annäherung bereit ist. Aufwecken durch Berührung bleibt auf Panels mit einem validierten Pfad zum Aufwecken durch Berührung verfügbar.

## Entitäten in Home Assistant

Wenn das eingelernte Modell vertrauenswürdig ist und das aktive Hardwareprofil eine brauchbare Näherungsquelle bereitstellt, erhält das Gerät des Panels in Home Assistant:

- `binary_sensor.<panel>_proximity`, eingelernte Anwesenheit im Nah- oder Fernbereich; und
- `sensor.<panel>_proximity_level`, einen normalisierten Wert von 0 (fern) bis 100 (nah) auf derselben Skala für jedes Panel.

Beide Entitäten bleiben nicht verfügbar, solange nicht genügend Anhaltspunkte vorliegen oder der Sensor nicht ordnungsgemäß funktioniert. Das Panel meldet keinen zuverlässig wirkenden Wert aus einem Modell, dem es nicht vertraut. Ein Sensor, der nur zwei Werte meldet, kann dennoch Anwesenheit und Aufweckgesten liefern, und der Näherungswert wird nur gemeldet, wenn das Signal einen solchen tatsächlich unterstützt.

## Aufwecken durch Winken

**Wecken per Winken** verwendet das vom Sensorprofil oder von der geführten Einrichtung validierte Muster einer Handannäherung oder Winkbewegung. Ein Muster mit einer Hand löst aus, sobald sich die Hand nähert; ein Muster mit zweimaligem Winken prüft die zusammengehörigen Bewegungen vor dem Aufwecken. Die Einrichtung und kurze Signalschwankungen im Ruhezustand erzeugen keine Aufweckanforderungen.

Dafür werden eine Näherungsquelle, die aktuell Daten liefert, und ein einsatzbereites eingelerntes Modell benötigt. Die Quelle kann ein gewöhnlicher Android-Sensor oder ein vom Hardwareprofil gewählter Pfad sein. Die Weboberfläche und die Diagnose des Panels zeigen den tatsächlich verwendeten Pfad und ob er einsatzbereit ist; allein die Angabe eines Sensors in einem Profil macht noch keinen Sensor verfügbar.
