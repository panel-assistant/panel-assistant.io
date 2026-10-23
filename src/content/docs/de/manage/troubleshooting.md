---
title: Fehlerbehebung
description: Was bei einem Wandpanel häufig schiefgeht und wo du zuerst nachsehen solltest.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
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

## Eine Netzwerkinstallation wurde unterbrochen

Wenn Home Assistant eine Netzwerkinstallation stoppt, sagt seine Meldung, wie weit die Installation gekommen ist. Suche unten den Satz, der zu deiner Meldung passt. In jedem Fall gilt: Deinstalliere Panel Assistant nicht, lösche seine Daten nicht und setze das Panel nicht zurück. Der Zustand des Panels zeigt dir, wo die Installation angehalten hat.

### Es wurde kein APK installiert

Wenn die Meldung sagt, dass kein APK installiert oder keine Änderung am Panel vorgenommen wurde, hat die Installation angehalten, bevor sie etwas verändert hat. Prüfe, ob das Panel eingeschaltet und unter derselben Adresse in deinem Netzwerk ist. Füge dann die Panel Assistant-Integration erneut hinzu und gib dieselbe Adresse ein. Home Assistant prüft das Panel erneut, bevor es etwas verändert. Wenn die Installation ein zweites Mal an derselben Stelle anhält, sieh auf dem Panel nach und folge dem nächsten Abschnitt, falls Panel Assistant darauf vorhanden ist.

### Installiert, aber nicht gestartet oder geprüft

Wenn die Meldung sagt, dass das APK installiert ist, Panel Assistant aber nicht gestartet wurde oder seine Prüfung nicht bestanden hat, ist die App auf dem Panel und nur der letzte Schritt fehlt. Öffne Panel Assistant über die App-Liste des Panels und warte auf seinen Einrichtungsbildschirm. Füge dann die Panel Assistant-Integration mit derselben Adresse erneut hinzu: Wenn die App antwortet, bietet Home Assistant an, sie zu verbinden („Panel Assistant ist installiert, aber nicht verbunden“), und installiert nichts. Wenn Home Assistant meldet, dass die installierte App nicht die von dir gewählte Version ist, wähle die installierte Version. Die Android-Einstellungen des Panels zeigen sie unter Apps › Panel Assistant an. Wenn Panel Assistant sich nicht öffnet oder sein Einrichtungsbildschirm nie erscheint, wiederhole die automatische Installation nicht. Bitte wie im nächsten Abschnitt beschrieben um Hilfe.

### Die Installation hat das Panel möglicherweise verändert

Wenn die Meldung sagt, dass die Installation das Panel möglicherweise verändert hat, Home Assistant das Ergebnis nicht überprüfen konnte oder nicht nachweisen kann, dass ein Fortfahren sicher ist, konnte Home Assistant nicht erkennen, wie weit das Panel gekommen ist. Es hält deshalb an, statt zu raten. Wiederhole die automatische Installation noch nicht. Sieh zuerst auf dem Panel nach: Wenn der Einrichtungsbildschirm oder das Dashboard von Panel Assistant angezeigt wird oder die App sich über die App-Liste öffnen lässt, folge dem vorherigen Abschnitt, um sie zu verbinden. Wenn Panel Assistant nicht auf dem Panel ist, frage in den [Issues der Integration](https://github.com/panel-assistant/ha-integration/issues) und nenne das Panelmodell, die gewählte Version, die vollständige Meldung und die Home Assistant-Protokollzeilen der Installation (suche im Protokoll nach `panel_assistant`).

## Die Hardware des Panels fehlt in Home Assistant

Wenn manche Entitäten erscheinen und andere nicht, liegt das meist am Hardwareprofil des Modells und nicht an einem Verbindungsproblem. Die [Hardwareseiten](/de/hardware/) beschreiben, was jedes Panel bereitstellt.

## Etwas anderes

Wenn du die Antwort weder auf dieser Website noch in der verlinkten Referenzdokumentation findest, frage in den [Issues der Integration](https://github.com/panel-assistant/ha-integration/issues) oder, wenn es um die Panel-App selbst geht, in den [ha-paneld-Issues](https://github.com/panel-assistant/android/issues). Nenne das Panelmodell und die Version von der Geräteseite des Panels und füge den Diagnose-Download bei, denn diese drei Angaben sind der Ausgangspunkt für jede Antwort. Die Diagnosedaten sind bereits bereinigt. Lies sie trotzdem vor einer öffentlichen Veröffentlichung durch und entferne alles Verbliebene, das dein Panel, dein Netzwerk oder deine Home Assistant-Einrichtung identifiziert.
