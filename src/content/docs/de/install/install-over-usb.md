---
title: Über USB installieren
description: Ein neues Panel vor der Wandmontage über Ihren Browser und ein USB-Kabel in Betrieb nehmen.
sourceCommit: ddee491d1892568fda8e9bb47f003b2333e3b666
---

Der USB-Weg eignet sich für ein Panel, das noch in der Verpackung liegt, oder dessen Herstellersoftware den Netzwerkzugriff erschwert. Schließen Sie das Panel an den Computer an, an dem Sie sitzen, und Ihr Browser installiert die Panel-App direkt über das Kabel. Dabei wird nichts über Ihr Netzwerk übertragen, und der Home Assistant-Server muss das Panel zu keinem Zeitpunkt erreichen können. Die meisten Menschen nutzen diesen Weg genau einmal, bevor das Panel montiert wird.

## Der Ausgangspunkt ist Home Assistant

Ein Administrator öffnet den USB-Installer über die Panel Assistant-Seite in der Seitenleiste von Home Assistant. Home Assistant prüft die Veröffentlichung und übergibt sie an den Installer, der sich in einem eigenen sicheren Fenster öffnet. Deshalb gibt es auf dieser Website keine Schaltfläche zum Installieren: Die Seite, die die Installation ausführt, akzeptiert nur eine Veröffentlichung aus Ihrem eigenen Home Assistant. So gelangt nichts auf Ihr Panel, das Home Assistant nicht überprüft hat.

## Was Sie benötigen

- Die installierte [Integration](/de/home-assistant/custom-integration/) und ein Administratorkonto.
- Einen Browser auf Chromium-Basis wie Chrome oder Edge. Firefox und Safari können nicht mit USB-Geräten kommunizieren.
- Ein USB-Kabel zwischen dem Panel und dem Computer oder Telefon, auf dem dieser Browser läuft. Nicht zum Home Assistant-Server.
- Aktiviertes USB-Debugging in den Entwickleroptionen des Panels und jemanden am Panel, der die Berechtigungsanfrage bestätigt, sobald sie erscheint. Die [Hardware-Seiten](/de/hardware/) zeigen, wie Sie bei jedem Modell zu den Entwickleroptionen gelangen.

## So läuft es ab

1. Wählen Sie auf der Panel Assistant-Seite eine Version aus. Aufgeführt werden nur ha-paneld-Veröffentlichungen, die Home Assistant für die Installation überprüfen kann: die neueste stabile Veröffentlichung sowie gegebenenfalls aktuelle Release Candidates, die als Testversionen gekennzeichnet sind.
2. Das Installer-Fenster überprüft die Veröffentlichung und fordert Sie auf, das Panel im USB-Auswahldialog des Browsers auszuwählen.
3. Bestätigen Sie die USB-Debugging-Anfrage auf dem Bildschirm des Panels.
4. Bestätigen Sie die Installation. Bis zu Ihrer Bestätigung ändert sich nichts auf dem Panel. Der Installer prüft zunächst, ob das Panel tatsächlich frei von einer vorhandenen Installation ist: Er verweigert die Installation über eine bestehende Installation, um die Daten des Panels nicht zu gefährden.
5. Lassen Sie das Kabel angeschlossen und den Tab verbunden, bis der Installer den Abschluss meldet. Schließen Sie anschließend die geführte Einrichtung direkt auf dem Panel ab.

Wenn sich das Kabel löst oder das Fenster während des Vorgangs geschlossen wird, schließen Sie das Kabel wieder an, übertragen Sie dieselbe Veröffentlichung erneut aus Home Assistant und verbinden Sie dasselbe Panel wieder. Der Installer speichert den Fortschritt in Ihrem Browser, überprüft zuerst jeden unterbrochenen Schritt und setzt dann dort fort, statt von vorn zu beginnen.

## Danach

Die App läuft auf dem Panel, und Sie können es nun als Gerät zu Home Assistant hinzufügen. Der USB-Installer aktualisiert kein Panel, auf dem die App bereits installiert ist. Informationen dazu finden Sie unter [Updates und Wiederherstellung](/de/manage/updates-and-recovery/).
