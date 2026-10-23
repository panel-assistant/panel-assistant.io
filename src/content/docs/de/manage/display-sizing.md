---
title: Anzeigegröße
description: Die Größe eines Home Assistant-Dashboards auf einem Panel mit Dichte und Textgröße an die Darstellung im Desktop-Browser anpassen.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Ein Home Assistant-Dashboard, das in einem Desktop-Browser gestaltet wurde, wird auf einem Android-Wandpanel oft in der falschen Größe dargestellt: Karten sind zu groß und ihre Ränder abgeschnitten, oder sie sind zu klein. Ein Smartphone bleibt meist ungefähr auf dem Niveau des Desktops, Panels jedoch häufig nicht. Ihre Hersteller liefern sie nämlich mit einer Systemdichte und Schriftskalierung aus, die schlecht zum physischen Display passen. Die Panel-App bietet unter **Installieren**, dann **Anzeigegröße**, zwei Regler: **Dichte (DPI)** und **Textgröße (Schriftskalierung)**. Damit kannst du Layout und Text wieder angleichen. Meist brauchst du beide.

:::caution[Experimentell]
Die Regler funktionieren, aber die passenden Werte für jedes Panel stehen noch nicht fest. Betrachte Dichte und Textgröße als etwas zum Ausprobieren, nicht als fertige Funktion. Rückmeldungen zu Werten, die bei einem bestimmten Panel gut funktionieren, sind willkommen.
:::

## Verwendung

Die Karte **Anzeigegröße** auf der Registerkarte **Installieren** des Panels legt eine benutzerdefinierte logische Dichte und Textgröße fest, wendet sie sofort an oder stellt die werkseitige Basisdichte von Android wieder her. Beide überstehen einen Neustart, da es sich um Systemeinstellungen von Android handelt.

:::note
Dafür ist ein genehmigter privilegierter Zugangsweg erforderlich: normalerweise das `su` des Herstellers oder der [Root-Helfer](https://github.com/panel-assistant/android/blob/main/helper/README.md). Ein kompatibles, nicht gerootetes Panel, dessen optionaler erweiterter Zugriff bereits am Panel genehmigt wurde, kann ebenfalls genau diese Anzeigeänderungen vornehmen. Wenn kein unterstützter Zugangsweg bereitsteht, bleibt die Karte sichtbar, aber gesperrt.
:::

Öffne zum Abstimmen dasselbe Dashboard zum Vergleich in einem Desktop-Browser. Senke die Dichte, bis das Layout übereinstimmt und mehr Karten Platz haben. Passe dann die Textgröße in kleinen Schritten an, bis auch der Text übereinstimmt. Gute Werte hängen sowohl vom Modell als auch von der Installation ab: von der Auflösung des Panels, dem Abstand der Personen und der Gestaltung des Dashboards.

Einige unterstützte Modelle bringen eine empfohlene Dichte mit, die meisten davon auch eine Textgröße. Wenn Panel Assistant ein solches Panel ohne privilegierten Zugangsweg einrichtet, wendet es diese Werte einmal über seine ADB-Verbindung an. Beim Entfernen der App über Panel Assistant werden die vorherigen Werte wiederhergestellt.

## Die beiden Regler

| Regler                            | Was er ändert                                                                                                                                                                                                                                                  | Mechanismus                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Dichte (DPI)**                  | Das gesamte Layout. Der effektive Darstellungsbereich in dp ist `physical px ÷ (density / 160)`. Eine niedrigere Dichte schafft mehr Platz und nähert sich dem breiteren Darstellungsbereich eines Desktops an; bei einer höheren wird die Darstellung größer. | `wm density <n>`                     |
| **Textgröße (Schriftskalierung)** | Text im Dashboard. Die systemweite Schriftskalierung von Android wird zum `textZoom` der WebView (`textZoom = scale × 100`).                                                                                                                                   | `settings put system font_scale <f>` |

Die Ausgabe von `wm density` in Android bezeichnet den werkseitigen Basiswert als `Physical density`. Diese Bezeichnung ist irreführend: Es ist die Dichte, die Android nach dem Zurücksetzen einer Überschreibung für das Layout verwendet, keine Messung der Pixel pro Zoll des Displays. Die Panel-App bezeichnet sie als **werkseitige Basis** und zeigt physische PPI nur bei Hardwareprofilen an, deren Bildschirmabmessungen unabhängig geprüft wurden.

Wenn du nur die Dichte änderst, wird das Layout skaliert. Der Text kann im Vergleich zum Desktop aber weiterhin die falsche Größe haben. Die Schriftskalierung korrigiert den Text. Indem du beide gemeinsam abstimmst, gleichst du das Panel an den Browser an, in dem das Dashboard gestaltet wurde.
