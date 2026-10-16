---
title: Über USB installieren
description: Ein neues Panel vor der Wandmontage über Ihren Browser und ein USB-Kabel in Betrieb nehmen.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Der USB-Weg ist für ein Panel gedacht, das noch in der Verpackung liegt, oder dessen Herstellersoftware den Netzwerkzugriff erschwert. Schließe das Panel an den Computer an, an dem du sitzt, und dein Browser installiert die Panel-App direkt über das Kabel. Das Panel benötigt kein Netzwerk-ADB. Dein Browser muss mit Home Assistant verbunden bleiben, das die verifizierte Version bereitstellt. Die meisten nutzen diesen Weg genau einmal, bevor das Panel montiert wird.

## Der Ausgangspunkt ist Home Assistant

Home Assistant prüft die Veröffentlichung und übergibt sie an den Installer, der sich in einem eigenen sicheren Fenster öffnet. Deshalb gibt es auf dieser Website keine Schaltfläche zum Installieren: Die Seite, die die Installation ausführt, akzeptiert nur eine Veröffentlichung aus Ihrem eigenen Home Assistant. So gelangt nichts auf Ihr Panel, das Home Assistant nicht überprüft hat.

## Was Sie benötigen

- Die installierte [Integration](/de/home-assistant/custom-integration/) und ein Administratorkonto.
- Einen Browser auf Chromium-Basis wie Chrome oder Edge. Firefox und Safari können nicht mit USB-Geräten kommunizieren.
- Ein USB-Kabel zwischen dem Panel und dem Computer oder Telefon, auf dem dieser Browser läuft. Nicht zum Home Assistant-Server.
- Aktiviertes USB-Debugging in den Entwickleroptionen des Panels und jemanden am Panel, der die Berechtigungsanfrage bestätigt, sobald sie erscheint. Die [Hardware-Seiten](/de/hardware/) zeigen, wie Sie bei jedem Modell zu den Entwickleroptionen gelangen.

## So läuft es ab

1. Wähle eine Version. Home Assistant bietet die neuesten kompatiblen Versionen an, die es verifizieren kann. Testversionen sind gekennzeichnet und werden angeboten, wenn die laufende Integration sie zulässt.
2. Das Installer-Fenster überprüft die Veröffentlichung und fordert Sie auf, das Panel im USB-Auswahldialog des Browsers auszuwählen.
3. Bestätigen Sie die USB-Debugging-Anfrage auf dem Bildschirm des Panels.
4. Bestätige. Bis dahin ändert sich auf dem Panel nichts. Das Installationsprogramm weigert sich, eine andere vorhandene Installation zu überschreiben. Wenn genau der ausgewählte Build bereits installiert ist, schließt es die Einrichtung dieses Builds ab.
5. Lassen Sie das Kabel angeschlossen und den Tab verbunden, bis der Installer den Abschluss meldet.

Wenn sich das Kabel löst oder das Fenster während des Vorgangs geschlossen wird, schließen Sie das Kabel wieder an, verbinden Sie dasselbe Panel wieder. Der Installer speichert den Fortschritt in Ihrem Browser, überprüft zuerst jeden unterbrochenen Schritt und setzt dann dort fort, statt von vorn zu beginnen.

## Danach

Auf dem Panel läuft nun die App. Falls Home Assistant es nicht erreichen konnte, füge es hinzu, sobald sich das Panel im Netzwerk von Home Assistant befindet. Das USB-Installationsprogramm aktualisiert kein Panel, auf dem die App bereits vorhanden ist. Siehe dazu [Updates und Wiederherstellung](/de/manage/updates-and-recovery/).
