---
title: Das Wettrennen
description: Zwei identische Wandpanels, dasselbe Dashboard, dieselben Berührungen im selben Moment. Eines verwendet die Home Assistant Companion-App im Auslieferungszustand des Panels, das andere Panel Assistant. Gemessen, gefilmt und warum Latenz wichtiger ist als die Stoppuhr.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Zwei Sonoff NSPanel Pro 86 stehen nebeneinander am selben Home Assistant und zeigen jeweils eine identische Kopie desselben Dashboards. Ein Skript tippt gleichzeitig auf beide Bildschirme, Seite für Seite. Eine Uhr unter jedem Panel stoppt, sobald der jeweilige Bildschirm reagiert hat. Das linke Panel verwendet die Home Assistant Companion-App mit der Web-Engine aus seiner Firmware. Das rechte Panel verwendet Panel Assistant mit der Web-Engine, die es selbst installiert. Anschließend tauschen die Panels die Rollen und das Rennen wird wiederholt, damit die individuelle Geschwindigkeit eines Panels das Ergebnis nicht beeinflusst.

## Darstellung: etwa doppelt so schnell

![Film A: Das erste Panel mit der Companion-App und das zweite mit Panel Assistant treten gleichzeitig gegeneinander an](/screenshots/drag-race-film-a.gif)

Sieben Berührungen: drei Seitenwechsel, eine Rückkehr zur Startseite und drei Berührungen einer Lichtkarte. Drei Durchläufe je Zuordnung. Die Filme zeigen den mittleren Durchlauf, und zwischen den beiden Filmen tauschen die Panels die Rollen.

|                                              | Companion-App, Web-Engine der Firmware | Panel Assistant, eigene Web-Engine |
| -------------------------------------------- | -------------------------------------- | ---------------------------------- |
| Erste Zuordnung, Median aus drei Durchläufen | 11.7 s                                 | 6.4 s                              |
| Zweite Zuordnung, Panels vertauscht          | 14.3 s                                 | 6.1 s                              |
| CPU-Nutzung der Darstellungsprozesse         | 1.3 bis 1.5 Kerne                      | 0.4 bis 0.6 Kerne                  |
| Bildrate der Dashboardseite im Leerlauf      | 5 Bilder pro Sekunde                   | 59 Bilder pro Sekunde              |
| Von der Seite verfolgte Entitäten            | 4,118                                  | 54                                 |

Die Dashboardseite unter Panel Assistant verfolgt nur die Entitäten, die sie anzeigt. Unter der Companion-App empfängt sie jede Zustandsänderung im Haus, Tausende von Entitäten, und verbringt den Großteil der Zeit mit deren Verarbeitung. Deshalb zeichnet dieselbe Seite auf einem Panel fünf und auf dem anderen sechzig Bilder pro Sekunde, und deshalb benötigen die Darstellungsprozesse zweieinhalbmal so viel CPU.

![Film B: Die Panels haben getauscht, das zweite mit der Companion-App und das erste mit Panel Assistant](/screenshots/drag-race-film-b.gif)

## Latenz: das eigentliche Problem

Doppelt so schnell auf der Stoppuhr ist eine mäßige Verbesserung. Das ist nicht das, was du an der Wand bemerkst. Du bemerkst den Moment, in dem du eine Schaltfläche drückst und nichts passiert.

Du drückst und erwartest eine Änderung. Nach mehr als einer halben Sekunde ohne Reaktion denkst du, du hättest nicht getroffen, und drückst erneut. Jetzt kommen beide Berührungen an: Das Licht geht an und sofort wieder aus, oder die angeforderte Seite erscheint und wird durch die Seite deiner zweiten Berührung ersetzt. Du hast alles richtig gemacht und das Gegenteil des Gewünschten erhalten. So ein Panel ist nicht langsam, sondern unbrauchbar. Nach einer Woche vertraut ihm niemand im Haus mehr.

![Der Doppeldruck: Dieselbe Berührung desselben Lichts auf beiden Panels, nach der menschlichen Regel, nach einer Sekunde ohne Reaktion erneut zu tippen](/screenshots/drag-race-double-press.gif)

Dieselben beiden Panels, dieselbe Lichtkarte, das Licht auf beiden ausgeschaltet. Ein Finger tippt auf das Licht und folgt der Regel, der jeder folgt: Wenn sich nach einer Sekunde nichts geändert hat, erneut tippen, bis zu dreimal.

|                                             | Companion-App, Web-Engine der Firmware                              | Panel Assistant, eigene Web-Engine   |
| ------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------ |
| Licht nach der ersten Berührung sichtbar an | 15.2 s, nach drei Berührungen                                       | 0.3 s, nach einer Berührung          |
| Die beiden anderen Aufnahmen                | 7 s nach einer Berührung; Seite lädt noch, drei Berührungen, nichts | Jedes Mal 0.3 s nach einer Berührung |

Fünfzehn Sekunden sind kein langsames Panel. Es ist ein Panel, das du aufgegeben hast und von dem du weggegangen bist, während hinter dir das Licht angeht. Die Seite unter der Companion-App war nicht kaputt. Sie verarbeitete gerade den Zustandsstrom des ganzen Hauses auf einem Vierkernpanel, und die Berührung musste hinter dieser Arbeit warten. Die Seite von Panel Assistant musste sich nur um ihre eigenen Entitäten kümmern und verarbeitete die Berührung daher sofort.

## Wie gemessen wurde

- Zwei Sonoff NSPanel Pro 86 (Vierkern-Rockchip PX30, Bildschirme mit 480 mal 480 Pixeln) an einem produktiven Home Assistant mit etwa 4,100 Entitäten und rund 20 Zustandsänderungen pro Sekunde.
- Zwei Kopien eines Dashboards, identisch bis auf das Licht hinter einer Karte, damit die beiden Panels nie um dieselbe Entität konkurrieren.
- Die Companion-App 2026.6.5 mit der Web-Engine der Firmware, Chromium 107, die auf den meisten installierten Panels noch läuft. Panel Assistant mit Chromium 138, der für diese Durchläufe verwendeten kompatiblen Web-Engine.
- Berührungen werden als rohe Bildschirmereignisse im selben Moment auf beiden Panels eingespeist. Jeder Schritt wird vom Panel selbst aufgezeichnet. Die Uhr läuft von der Berührung bis zum Stillstand der Bildschirmänderungen. Ändert sich ein Schritt beim Ende seines Clips noch, ist der Durchlauf ungültig.
- Drei Durchläufe je Zuordnung, der mittlere Durchlauf wird gefilmt. Eine Musikkarte, die Liedtexte aus dem Internet lud, wurde entfernt, da keine Panel-App einen externen Dienst beschleunigen kann. Die Live-Kameraseite blieb außen vor, weil ihre Zeit auf den Streamaufbau und nicht auf Dashboardarbeit entfällt.

Du kannst die CPU-Auslastung, die Reaktionsfähigkeit des Dashboards und den Home Assistant-Zustandsdatenstrom deines eigenen Panels unter **Leistung** in seiner Weboberfläche prüfen. [Leistung](/de/manage/performance/) erklärt, wie du diese Messungen liest.
