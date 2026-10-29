---
title: Über USB installieren
description: Ein fabrikneues Panel mit einem USB-Kabel direkt aus deinem Browser in Betrieb nehmen, bevor es an die Wand kommt.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Der USB-Weg eignet sich für ein Panel, das noch in der Verpackung liegt, oder dessen Herstellersoftware den Netzwerkzugang erschwert. Schließe das Panel an den Computer an, an dem du sitzt, und dein Browser installiert die Panel-App direkt über das Kabel. Das Panel braucht kein Netzwerk-ADB. Dein Browser muss mit Home Assistant verbunden bleiben, das die verifizierte Version bereitstellt. Die meisten nutzen diesen Weg genau einmal, bevor das Panel montiert wird.

## Der Start erfolgt in Home Assistant

Ein Administrator startet das USB-Installationsprogramm aus Home Assistant: Gehe zu **Einstellungen**, **Geräte & Dienste**, **Integration hinzufügen**, wähle **Panel Assistant** und dann **Über USB an diesem Computer installieren**. Der Link **Panel hinzufügen** auf der Panel Assistant-Seite in der Seitenleiste öffnet dieselbe Auswahl. Home Assistant prüft die Version und übergibt sie an das Installationsprogramm, das sich in einem eigenen sicheren Fenster öffnet. Deshalb gibt es auf dieser Website keine Installationsschaltfläche: Die Seite, die die Arbeit erledigt, akzeptiert nur eine Version von deinem eigenen Home Assistant. So gelangt nichts auf dein Panel, das Home Assistant nicht verifiziert hat.

## Was du brauchst

- Die installierte [Integration](/de/home-assistant/custom-integration/) und ein Administratorkonto.
- Einen Chromium-basierten Browser wie Chrome oder Edge. Firefox und Safari können nicht mit USB-Geräten kommunizieren.
- Ein USB-Kabel vom Panel zum Computer oder Smartphone, auf dem dieser Browser läuft. Nicht zum Home Assistant-Server.
- Aktiviertes USB-Debugging in den Entwickleroptionen des Panels. Wenn das Panel beim Anschließen eine Autorisierungsabfrage zeigt, muss jemand am Panel sie bestätigen; manche Panels fragen nie. Die [Hardwareseiten](/de/hardware/) nennen bekannte Debugging-Verfahren und kennzeichnen Modelle, deren erster USB-Zugang noch nicht verifiziert ist.

## Was passiert

1. Wähle **USB-Installationsprogramm öffnen**. Behalte auf der geöffneten Seite die empfohlene Version bei und drücke **Weiter**. Home Assistant bietet die neuesten kompatiblen Versionen an, die es verifizieren kann. Testversionen sind gekennzeichnet und werden angeboten, wenn die laufende Integration sie zulässt.
2. Das Installationsprogramm öffnet sich in einem neuen Fenster und verifiziert die Version. Drücke **Mein Panel finden** und wähle das Panel aus der Liste deines Browsers.
3. Wenn das Panel dich auffordert, USB-Debugging zuzulassen, aktiviere **Von diesem Computer immer zulassen** und bestätige auf dem Bildschirm des Panels. Manche Panels fragen nicht; das Installationsprogramm fährt dann direkt fort.
4. Bestätige. Bis dahin ändert sich nichts auf dem Panel. Das Installationsprogramm weigert sich, eine andere vorhandene Installation zu überschreiben; ist exakt der ausgewählte Build bereits installiert, schließt es dessen Einrichtung ab.
5. Lass das Kabel angeschlossen und das Fenster geöffnet, bis der Abschluss gemeldet wird. Dasselbe Fenster wechselt dann zum Einrichtungsassistenten des Panels, in dem du die Einrichtung abschließt. Das Panel stellt den Assistenten bereit; der Computer muss deshalb im selben Netzwerk wie das Panel sein.

Wenn das Kabel zwischendurch herausgezogen wird, schließe es wieder an, warte auf den Start des Panels, drücke die Schaltfläche auf der Fehlerseite des Installationsprogramms und dann **Mein Panel finden**. Wurde das Installationsfenster geschlossen, starte erneut aus Home Assistant und wähle dieselbe Version. In beiden Fällen speichert das Installationsprogramm den Fortschritt in deinem Browser, prüft vor jeder weiteren Aktion einen unterbrochenen Schritt und setzt dort fort, statt von vorn anzufangen.

## Danach

Auf dem Panel läuft jetzt die App. Ein fabrikneues Panel ist noch nicht in deinem Netzwerk. Verbinde es deshalb vor oder nach der Installation über seine eigene Einstellungen-App mit deinem WLAN: Sowohl sein Einrichtungsassistent als auch seine Verbindung zu Home Assistant benötigen das. Wenn das Panel nach Abschluss seiner Einrichtung nicht in Home Assistant erscheint, gehe zu **Einstellungen**, **Geräte & Dienste**, **Integration hinzufügen**, wähle **Panel Assistant**, dann **Panel im Netzwerk hinzufügen** und gib die Adresse des Panels ein. Das USB-Installationsprogramm aktualisiert kein Panel, auf dem die App bereits läuft; siehe dafür [Updates und Wiederherstellung](/de/manage/updates-and-recovery/).
