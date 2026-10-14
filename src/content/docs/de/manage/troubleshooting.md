---
title: Fehlerbehebung
description: Was bei einem Wandpanel häufig schiefgeht und wo du zuerst nachsehen solltest.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Beginne beim Gerät des Panels in Home Assistant, das einen Statussensor und einen Diagnose-Download bietet, und bei der eigenen Statusseite des Panels unter seiner Adresse auf Port 8888. Ihr Bericht unter `/diag` beantwortet die meisten der folgenden Fragen ohne Rätselraten.

Wenn du unmittelbar sehen möchtest, was das Panel gerade tut, überträgt die Registerkarte **Protokolle** auf dieser Seite das eigene Protokoll der Panel-App live. Tokens und Passwörter sind dabei unkenntlich gemacht.

![Die Registerkarte „Protokolle“ der Weboberfläche des Panels überträgt das Live-Protokoll der Panel-App, mit einem Filterfeld und Steuerelementen zum Folgen und Pausieren](/screenshots/ui-logs-dark.png)

## Das Dashboard ist leer, nur teilweise dargestellt oder voller Skriptfehler

Prüfe zuerst die System-WebView. Mit Abstand am häufigsten scheitert der erste Start daran. Eine alte WebView verursacht genau diese Symptome und wirkt dabei wie ein Fehler in der Panel-App. Die Anleitung findest du unter [System-WebView aktualisieren](/de/hardware/guides/update-the-webview/).

Wenn die WebView aktuell ist, beschreibt der Abschnitt [Start und Wiederherstellung](/de/manage/built-in-renderer/#startup-and-recovery), was das Panel tut, wenn ein Dashboard nicht geladen werden kann, und wie du den Grund dafür herausfindest.

## Das Dashboard ist langsam

Ein Teil davon liegt am Panel, ein Teil am Dashboard. [Leistung](/de/manage/performance/) beschreibt, was die Statusseite des Panels messen kann und was meist hilft. Die [Hardwareübersicht](/de/hardware/) ordnet die unterstützten Panels nach Leistung ein, damit du erkennen kannst, ob du der Hardware zu viel abverlangst.

## Das Installationsprogramm kann das Panel nicht erreichen

Über das Netzwerk: Prüfe die Adresse des Panels und ob Netzwerk-ADB auf TCP-Port 5555 noch aktiviert ist, denn manche Panels schalten es nach einem Neustart wieder aus. Wenn das Panel eine Autorisierungsaufforderung anzeigt, bestätige sie auf seinem Bildschirm. Über USB: Achte darauf, dass du einen Chromium-basierten Browser verwendest, dass das Kabel zum Computer führt, auf dem der Browser läuft, und dass USB-Debugging aktiviert ist. Wie du die Entwickleroptionen erreichst und Debugging einschaltest, unterscheidet sich je nach Modell. Das beschreiben [Panel vorbereiten](/de/install/prepare-a-panel/) und die [Hardwareseiten](/de/hardware/). Wenn das Panel einfach keine Netzwerkverbindung annimmt, [installiere stattdessen über USB](/de/install/install-over-usb/): Das Panel benötigt kein Netzwerk-ADB, während dein Browser für die verifizierte Version mit Home Assistant verbunden bleibt.

## Die Hardware des Panels fehlt in Home Assistant

Wenn manche Entitäten erscheinen und andere nicht, liegt das meist am Hardwareprofil des Modells und nicht an einem Verbindungsproblem. Die [Hardwareseiten](/de/hardware/) beschreiben, was jedes Panel bereitstellt.

## Etwas anderes

Wenn du die Antwort weder auf dieser Website noch in der verlinkten Referenzdokumentation findest, frage in den [Issues der Integration](https://github.com/panel-assistant/ha-integration/issues) oder, wenn es um die Panel-App selbst geht, in den [ha-paneld-Issues](https://github.com/panel-assistant/android/issues). Nenne das Panelmodell und die Version von der Geräteseite des Panels und füge den Diagnose-Download bei, denn diese drei Angaben sind der Ausgangspunkt für jede Antwort. Die Diagnosedaten sind bereits bereinigt. Lies sie trotzdem vor einer öffentlichen Veröffentlichung durch und entferne alles Verbliebene, das dein Panel, dein Netzwerk oder deine Home Assistant-Einrichtung identifiziert.
