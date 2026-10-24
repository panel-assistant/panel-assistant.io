---
title: Über USB installieren
description: Ein neues Panel vor der Wandmontage über deinen Browser und ein USB-Kabel in Betrieb nehmen.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Der USB-Weg ist für ein Panel gedacht, das noch in der Verpackung liegt, oder dessen Herstellersoftware den Netzwerkzugriff erschwert. Schließe das Panel an den Computer an, an dem du sitzt, und dein Browser installiert die Panel-App direkt über das Kabel. Das Panel benötigt kein Netzwerk-ADB. Dein Browser muss mit Home Assistant verbunden bleiben, das die verifizierte Version bereitstellt. Die meisten nutzen diesen Weg genau einmal, bevor das Panel montiert wird.

## Der Ausgangspunkt ist Home Assistant

Das USB-Installationsprogramm wird in Home Assistant von einem Administrator gestartet: Gehe zu **Einstellungen**, **Geräte & Dienste**, **Integration hinzufügen**, wähle **Panel Assistant** und dann **Über USB an diesem Computer installieren**. Der Link **Panel hinzufügen** auf der Panel Assistant-Seite in der Seitenleiste öffnet dieselbe Auswahl. Home Assistant prüft die Veröffentlichung und übergibt sie an den Installer, der sich in einem eigenen sicheren Fenster öffnet. Deshalb gibt es auf dieser Website keine Schaltfläche zum Installieren: Die Seite, die die Installation ausführt, akzeptiert nur eine Veröffentlichung aus deinem eigenen Home Assistant. So gelangt nichts auf dein Panel, das Home Assistant nicht überprüft hat.

## Was du benötigst

- Die installierte [Integration](/de/home-assistant/custom-integration/) und ein Administratorkonto.
- Einen Browser auf Chromium-Basis wie Chrome oder Edge. Firefox und Safari können nicht mit USB-Geräten kommunizieren.
- Ein USB-Kabel zwischen dem Panel und dem Computer oder Telefon, auf dem dieser Browser läuft. Nicht zum Home Assistant-Server.
- Aktiviertes USB-Debugging in den Entwickleroptionen des Panels. Wenn das Panel beim Anschließen eine Autorisierungsaufforderung anzeigt, muss jemand am Panel sie bestätigen. Manche Panels fragen nie danach. Die [Hardware-Seiten](/de/hardware/) zeigen, wie du bei jedem Modell zu den Entwickleroptionen gelangst.

## So läuft es ab

1. Wähle **USB-Installationsprogramm öffnen**. Behalte auf der geöffneten Seite die empfohlene Version bei und drücke **Weiter**. Home Assistant bietet die neuesten kompatiblen Versionen an, die es verifizieren kann. Testversionen sind gekennzeichnet und werden angeboten, wenn die laufende Integration sie zulässt.
2. Das Installationsprogramm öffnet sich in einem neuen Fenster und überprüft die Veröffentlichung. Drücke **Mein Panel finden** und wähle das Panel aus der Liste deines Browsers.
3. Wenn das Panel dich auffordert, USB-Debugging zuzulassen, aktiviere **Von diesem Computer immer zulassen** und bestätige die Anfrage auf dem Bildschirm des Panels. Manche Panels fragen nicht, und das Installationsprogramm fährt direkt fort.
4. Bestätige. Bis dahin ändert sich auf dem Panel nichts. Das Installationsprogramm weigert sich, eine andere vorhandene Installation zu überschreiben. Wenn genau der ausgewählte Build bereits installiert ist, schließt es die Einrichtung dieses Builds ab.
5. Lasse das Kabel und das Fenster verbunden, bis der Abschluss gemeldet wird. Dasselbe Fenster wechselt dann zum Einrichtungsassistenten des Panels, in dem du die Einrichtung abschließt. Das Panel stellt den Assistenten bereit. Der Computer muss deshalb im selben Netzwerk wie das Panel sein.

Wenn sich das Kabel während des Vorgangs löst, schließe es wieder an, warte auf den Start des Panels, drücke die Schaltfläche auf dem Fehlerbildschirm des Installationsprogramms und dann **Mein Panel finden**. Wenn das Installationsfenster geschlossen wurde, starte erneut aus Home Assistant und wähle dieselbe Version. In beiden Fällen speichert das Installationsprogramm den Fortschritt in deinem Browser, überprüft zuerst jeden unterbrochenen Schritt und setzt dann dort fort, statt von vorn zu beginnen.

## Danach

Auf dem Panel läuft nun die App. Ein Panel frisch aus der Verpackung ist noch nicht in deinem Netzwerk. Verbinde es deshalb vor oder nach der Installation über die eigene Einstellungen-App des Panels mit deinem WLAN: Sowohl sein Einrichtungsassistent als auch seine Verbindung zu Home Assistant benötigen es. Wenn das Panel nach abgeschlossener Einrichtung nicht in Home Assistant erscheint, gehe zu **Einstellungen**, **Geräte & Dienste**, **Integration hinzufügen**, wähle **Panel Assistant**, dann **Panel im Netzwerk hinzufügen** und gib die Adresse des Panels ein. Das USB-Installationsprogramm aktualisiert kein Panel, auf dem die App bereits vorhanden ist. Siehe dazu [Updates und Wiederherstellung](/de/manage/updates-and-recovery/).
