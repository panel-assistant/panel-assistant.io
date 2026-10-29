---
title: Eigene Aktivierungswörter
description: Ein eigenes Aktivierungswort mit microWakeWord trainieren, auf einem Panel importieren, auf mehreren Panels verteilen und abstimmen.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Die vier mitgelieferten Aktivierungswörter sind [microWakeWord](https://github.com/kahrendt/microWakeWord)-Modelle. Der [Sprachassistent](/de/manage/voice-assistant/) eines Panels kann jedes auf dieselbe Weise trainierte Modell importieren. Diese Seite beschreibt das Training, das Manifestformat, den Import auf dem Panel und das Testen nach der Installation.

## Ein Modell trainieren

microWakeWord ist ein eigenständiges Open-Source-Projekt von Kevin Ahrendt unter der Apache-2.0-Lizenz. Sein [Trainingsnotebook](https://github.com/kahrendt/microWakeWord/blob/main/notebooks/basic_training_notebook.ipynb) führt durch den gesamten Ablauf und ist die maßgebliche Referenz. Im Überblick:

1. **Phrase auswählen und synthetische Beispiele erzeugen.** Du legst die Zielphrase fest. Das Notebook verwendet [piper-sample-generator](https://github.com/rhasspy/piper-sample-generator), um Tausende gesprochene Beispiele mit unterschiedlichen Stimmen zu erzeugen.
2. **Beispiele erweitern.** Das Notebook versieht das synthetische Audio mit Effekten (Entzerrung, Verzerrung, Tonhöhenänderung, Faltung mit Raumimpulsantworten sowie Beimischen von Hintergrundgeräuschen und Musik aus öffentlichen Audiodatensätzen). So lernt das Modell nicht nur, eine einzige saubere Aufnahme zu erkennen.
3. **Trainieren.** Das Modell wird für eine konfigurierbare Anzahl von Schritten trainiert und dann von einem nicht streamenden Modell in die Streaming-Form umgewandelt, die das Panel tatsächlich ausführt. Laut Notebook ist das Training in Google Colab möglich, aber deutlich langsamer als mit einer lokalen GPU.
4. **Exportieren.** Das trainierte Modell wird als quantisierte, streamende TensorFlow Lite-Datei exportiert. Diese `.tflite`-Datei importierst du später.

Wenn bereits ein fertiges Modell für deine Phrase existiert, benötigst du all das nicht. Das Repository [`esphome/micro-wake-word-models`](https://github.com/esphome/micro-wake-word-models) (ebenfalls Apache-2.0) veröffentlicht trainierte Modelle nach Dateinamen unter `models/v2/`. Eines davon wird genau wie ein selbst trainiertes Modell importiert.

## Das Manifest schreiben

Jedes Aktivierungswort benötigt neben seiner `.tflite`-Datei ein kleines JSON-Manifest im Version-2-Format von microWakeWord. Es ist dasselbe Format wie bei der ESPHome-Komponente `micro_wake_word` und im Repository `esphome/micro-wake-word-models`. Ein Manifest aus einer dieser Quellen funktioniert daher unverändert. Pflichtfelder:

- `"type"`: immer `"micro"`.
- `"model"`: der Name der `.tflite`-Datei (ohne Schrägstriche).
- `"micro"`: ein Objekt mit `probability_cutoff` (0 bis 1), `feature_step_size` (positive Ganzzahl; aktuelle Modelle verwenden `10`) und `sliding_window_size` (positive Ganzzahl).

Optionale Felder: `wake_word` (die in der Oberfläche angezeigte Phrase; ohne Angabe wird die ID des Aktivierungsworts verwendet), `author`, `website`, `trained_languages`, `version` und `micro.tensor_arena_size`.

Als Beispiel für die Struktur dient das mitgelieferte Hey Jarvis-Manifest:

```json
{
  "type": "micro",
  "wake_word": "Hey Jarvis",
  "author": "Kevin Ahrendt",
  "website": "https://www.kevinahrendt.com/",
  "model": "hey_jarvis.tflite",
  "trained_languages": ["en"],
  "version": 2,
  "micro": {
    "probability_cutoff": 0.97,
    "feature_step_size": 10,
    "sliding_window_size": 5,
    "tensor_arena_size": 22860,
    "minimum_esphome_version": "2024.7.0"
  }
}
```

### `probability_cutoff` und `sliding_window_size` wählen

Beide wägen Fehlaktivierungen gegen verpasste Aktivierungen ab. Für keinen gibt es einen für alle Modelle richtigen Wert:

- **`probability_cutoff`** ist der Konfidenzschwellenwert, den das Modell für eine Erkennung überschreiten muss. Erhöhst du ihn, reagiert das Panel seltener auf Dinge, die deiner Phrase nur ähnlich klingen. Es übersieht aber auch eher eine echte, leiser oder beiläufiger gesprochene Phrase. Senkst du ihn, gilt das Gegenteil. Die mitgelieferten Modelle liegen ungefähr bei `0.97`. Das Trainingsnotebook empfiehlt, den Schwellenwert anhand der tatsächlichen Leistung des trainierten Modells anzupassen, statt einen universell passenden Wert anzunehmen.
- **`sliding_window_size`** bestimmt, über wie viele aufeinanderfolgende Erkennungsfenster gemittelt wird, bevor das Panel eine Aktivierung auslöst. Ein kleineres Fenster reagiert schneller, ist aber anfälliger für einzelne Störspitzen. Ein größeres glättet diese, aktiviert jedoch etwas langsamer.

Beginne mit den Werten aus der Dokumentation deines Modells oder deinem Notebook-Durchlauf, importiere es und stimme es anhand des unter [Testen und abstimmen](#testen-und-abstimmen) beschriebenen Protokolls knapp verfehlter Erkennungen ab.

## Das Modell importieren

### Über die Seite „Konfiguration“ des Panels

Auf der Karte **Sprachassistent** bietet die Auswahl der Aktivierungswörter eine **Importfunktion**. Wähle das `.json`-Manifest des Modells und seine `.tflite`-Datei aus und drücke **Trainiertes Aktivierungswort importieren**. Das Panel prüft das Modell mit seiner eigenen Aktivierungswort-Engine, bevor es es annimmt. Lehnt es ein Modell ab, wird nichts installiert. War bereits ein Modell gleichen Namens importiert, bleibt dieses frühere Modell erhalten. Manifeste sind auf 16 KB und Modelle auf 2 MB begrenzt.

Die ID des Aktivierungsworts wird aus dem Namen der `.tflite`-Datei abgeleitet, kleingeschrieben und auf Buchstaben, Ziffern und Unterstriche beschränkt (sie muss mit einem Buchstaben beginnen). Die ID eines mitgelieferten Aktivierungsworts darf nicht wiederverwendet werden. Der Import unter einem bereits verwendeten Namen ersetzt das frühere Modell.

Der Import macht das Aktivierungswort verfügbar, aktiviert es aber nicht. Aktiviere es zur Verwendung auf einem Panel unter **Aktivierungswörter** und wähle unter **Aktivierungswort-Pipelines** seine Pipeline. Ab dann erscheint es auch in der eigenen Aktivierungswortauswahl von Home Assistant für dieses Panel.

### Auf mehreren Panels

Wo du „Konfiguration“ öffnest, bestimmt, ob der Import geteilt wird:

- **Direkt auf der eigenen Seite „Konfiguration“ des Panels:** Das importierte Modell bleibt auf diesem Panel und wird nicht mit anderen Panels geteilt.
- **Innerhalb der Panel Assistant-Seitenleiste in Home Assistant:** Sobald das ausgewählte Panel das Modell geprüft und installiert hat, bewahrt Panel Assistant eine gemeinsame Kopie auf und installiert sie auf jedem anderen Panel mit Mikrofon, einschließlich später verbundener Panels.

Ein neueres Modell mit derselben ID über die Seitenleiste zu importieren, ersetzt die gemeinsame Kopie und kann Panels mit einer zuvor geteilten Kopie aktualisieren. Ein anderes, unabhängig unter derselben ID auf einem anderen Panel importiertes Modell bleibt erhalten. Panel Assistant erzeugt eine [Aktivierungswort-Reparatur](/de/home-assistant/repairs/#wake-word-kept), statt es zu überschreiben. Ein Panel, das ein geteiltes Modell ablehnt, erhält ebenfalls eine [Reparatur mit dem Grund](/de/home-assistant/repairs/#wake-word-refused).

Das Teilen macht das Modell auf jedem Panel auswählbar. Wähle sein Aktivierungswort und die Pipeline auf jedem Panel separat, um es zu aktivieren.

## Testen und abstimmen

Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen** und öffne **Protokolle** (zum Beispiel `http://<panel>:8888/logs` beim Standardport). Sprich dann das Aktivierungswort und beobachte das Protokoll. Ein gehörtes Aktivierungswort, das nicht ganz zur Aktivierung reichte, erscheint dort als knapp verfehlte Erkennung, etwa mit einer Zeile wie `wake word my_wake_word heard at 0.86, short of its cutoff` und der höchsten Bewertung dieses Versuchs. Liegen diese Bewertungen knapp unter deinem `probability_cutoff`, genügt meist ein leichtes Senken des Schwellenwerts oder das Erhöhen der **Aktivierungsempfindlichkeit** auf der Karte „Sprachassistent“. Erscheint die Phrase überhaupt nicht als knapp verfehlte Erkennung, erkennt das Modell selbst sie nicht. Dann ist erneutes Training mit mehr oder vielfältigeren Beispielen der sinnvollere nächste Schritt.
