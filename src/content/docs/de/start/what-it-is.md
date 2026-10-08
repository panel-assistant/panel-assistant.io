---
title: So funktioniert es
description: Was Panel Assistant auf das Panel bringt, was in Home Assistant bleibt und warum es vollständig Open Source sein kann.
sourceCommit: f84c3d3fbf79006c96fdb0539ba346aaa9ff6435
---

Panel Assistant besteht aus zwei Teilen. Einer läuft in Home Assistant und ist das, was du siehst und benutzt. Der andere läuft auf jedem Panel und macht das Panel schnell.

## In Home Assistant: die Integration

Die Integration installierst du über HACS. Hier fügst du ein Panel hinzu, hier erscheint jedes Panel als Gerät mit eigenem Status und eigenen Diagnosedaten, und hier zeigt eine Panel Assistant-Seite in der Seitenleiste alle deine Panels zusammen an: ob sie jeweils erreichbar sind, welche Version sie ausführen und ob etwas deine Aufmerksamkeit braucht.

Sie ist auch das Installationsprogramm. Gib ihr die Adresse eines neuen Panels oder schließe ein neues Panel an deinen Laptop an. Sie prüft, was bereits vorhanden ist, installiert die Panel-App, startet sie und erstellt erst dann das Gerät. Wenn auf einem Panel die App bereits läuft, übernimmt sie es stattdessen.

## Auf dem Panel: die App

Ein Wandpanel ist ein kleiner Android-Computer. Dass sich die meisten langsam anfühlen, liegt an der mitgelieferten Software. Panel Assistant ersetzt den entscheidenden Teil dieser Software durch seine eigene App, die drei Dinge tut.

- **Zeigt dein Dashboard an.** Die App lädt dein bestehendes Home Assistant-Dashboard selbst, ermittelt, welche Entitäten dieses Dashboard tatsächlich anzeigt, und fragt nur diese bei Home Assistant ab. Auf einem günstigen Panel macht das den größten Teil des Unterschieds zwischen einer verzögerten und einer verzögerungsfreien Bedienung aus.
- **Steuert die Hardware des Panels.** Der Bildschirm, seine Helligkeit und sein Ruhezustand, LEDs, Tasten, Relais, Näherungs- und Lichtsensoren und alles Weitere, was das Modell hat, werden direkt angesteuert und erscheinen in Home Assistant als Entitäten am Gerät des Panels. Jedes Modell wird durch ein Hardware-Profil beschrieben: Klartext, den du in deinem Browser auf dem Panel lesen, bearbeiten und validieren kannst, ohne Entwicklungswerkzeuge. Ein Panel, das dem Projekt noch unbekannt ist, startet mit dem zurückhaltenden Generic-Profil. Es bietet das Dashboard, Sensoren, Helligkeit, Audio und Navigation, die jedes Android-Gerät bereitstellen kann, und der Rest kommt hinzu, wenn sein Profil vervollständigt wird. Das laufende Panel prüft jede deklarierte Fähigkeit, bevor es sie nutzt. Eine fehlende Funktion wird daher als gesperrt angezeigt und erklärt, statt defekt zu bleiben, und ein Profil, das beim Start scheitert, wird auf das letzte funktionierende Profil zurückgesetzt.
- **Verhält sich wie ein Haushaltsgerät.** Die App ersetzt den Launcher des Herstellers, bietet einem Panel ohne Tasten eine Navigation auf dem Bildschirm, stellt eine eigene Statusseite in deinem Netzwerk bereit und erholt sich selbstständig, wenn etwas schiefgeht. So kannst du ein Panel einmal montieren und es danach sich selbst überlassen.

Diese App heißt ha-paneld. Der Name stammt aus ihrer Zeit als Hintergrundhelfer, auf den andere Dashboard-Software angewiesen war. Seitdem ist daraus die gesamte Panel-Seite des Produkts geworden. Der Name begegnet dir in der Referenzdokumentation und auf der eigenen Statusseite des Panels. Es lohnt sich, ihn zu kennen, damit dich nichts überrascht, aber du musst ihn nie eingeben oder dich damit beschäftigen, um Panel Assistant zu nutzen.

## Warum es Open Source sein kann

Die meisten Panel-Hersteller liefern ihre Hardware-Unterstützung als geschlossene Bibliotheken aus, die nur ihre eigene App nutzen darf. ha-paneld verwendet sie nicht. Es steuert die Hardware jedes Panels direkt über eigene Profile für das jeweilige Modell. Das hat viel Arbeit gekostet und ist der Grund, warum das Projekt überhaupt Hardware-Unterstützung bietet. Deshalb lässt sich auch das Ganze kostenlos weitergeben: Es enthält keinen Herstellercode. Somit steht nichts dem entgegen, es für Panels aller Hersteller kostenlos und als Open Source unter freizügigen Lizenzen anzubieten.

Aus demselben Grund braucht das Projekt bei der Hardware-Unterstützung am meisten Hilfe. Jedes Panel, das sich meldet, ob funktionierend oder nicht, macht das nächste Profil besser. Unter [Ein Panel auswählen](/de/install/supported-panels/) siehst du den aktuellen Stand der Unterstützung.

## Wo die Bestandteile zu finden sind

| Bestandteil           | Was es ist                                                                                             | Wo                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Panel Assistant       | Die Home Assistant-Integration: Installationsprogramm, Geräte und die Seite für alle Panels.           | [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) |
| ha-paneld             | Die App auf dem Panel: Dashboard, Hardware, Launcher, Statusseite.                                     | [panel-assistant/android](https://github.com/panel-assistant/android)               |
| Hardware-Profile      | Die Beschreibungen für jedes Modell, die der App sagen, was ein Panel hat und wie es angesteuert wird. | [Hardware-Referenz](/de/hardware/)                                                  |
| Referenzdokumentation | Die API, Hardware-Profile und das Sicherheitsmodell im Detail.                                         | [Referenz](/de/reference/api/)                                                      |

## Was es nicht ist

Es ist für fest zugeordnete Wandpanels gedacht. Tablets und Telefone können es ausführen, aber alles mit einem Akku braucht ein Kabel, und das Konzept geht von einem netzbetriebenen Panel aus, das einmal eingerichtet und danach sich selbst überlassen wird. Es ist kein Dashboard-Baukasten; es zeigt die Dashboards an, die du schon hast. Und es ist noch nicht fertig: Das Ziel sind universelle Hardware-Unterstützung und die Verwaltung aller Panels ohne laufendes Eingreifen.
