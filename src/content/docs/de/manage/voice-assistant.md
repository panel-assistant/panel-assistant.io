---
title: Sprachassistent
description: Das Mikrofon eines Panels als Home Assistant Assist-Satellit verwenden – Aktivierungswörter, Pipelines, Durchsagen und Fehlerbehebung.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ein Panel mit Mikrofon kann als Home Assistant [Assist-Satellit](https://www.home-assistant.io/voice_control/) dienen. Es lauscht auf ein Aktivierungswort, überträgt deinen Befehl an Home Assistant und gibt die Antwort über seinen Lautsprecher aus. Du musst kein separates Gerät hinzufügen: Der Satellit ist eine Entität `assist_satellite.<panel>` am vorhandenen Home Assistant-Gerät des Panels. Audio wird über dieselbe Verbindung übertragen, die das Panel bereits verwendet.

:::note
Die Karte „Sprachassistent“ wird angeboten, wenn das Geräteprofil ein Mikrofon angibt oder Android ein integriertes Mikrofon auf einem Panel meldet, dessen Profil dazu keine Angabe macht. Ein ungeprüftes Mikrofon muss die Aufnahmeprüfung des Panels bestehen, bevor das Lauschen beginnt. Wenn ein Profil ausdrücklich kein Mikrofon angibt, wird „Sprachassistent“ nicht angeboten.
:::

## Einschalten

Bei einer neuen Installation ist Sprachsteuerung standardmäßig eingeschaltet, wenn das Geräteprofil des Panels ein Mikrofon angibt. Vorhandene gespeicherte Einstellungen bleiben erhalten. Schalte auf anderen Panels, auf denen die Karte „Sprachassistent“ angeboten wird, **Sprachassistent** ein, um sie zu nutzen. Schalte ihn aus, wenn das Panel nicht auf ein Aktivierungswort lauschen soll.

1. Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen** und öffne **Konfiguration** (zum Beispiel `http://<panel>:8888/` beim Standardport).
2. Aktiviere auf der Karte **Sprachassistent** die Einstellung **Sprachassistent**.
3. Aktiviere unter **Aktivierungswörter** jedes Wort, auf das das Panel lauschen soll.
4. Wähle unter **Aktivierungswort-Pipelines**, welche Assist-Pipeline jedes aktivierte Aktivierungswort verwenden soll.

Wenn der Sprachassistent aus ist, werden seine Mikrofonbelegungen freigegeben und die Satellitenentität erscheint in Home Assistant als nicht verfügbar. Eine andere aktivierte Funktion, etwa Raumton der Kamera, kann das Mikrofon weiterhin verwenden.

## Aktivierungswörter und Pipelines

Das Panel enthält vier Aktivierungswörter: **Okay Nabu**, **Hey Jarvis**, **Hey Mycroft** und **Alexa**. Mehrere können gleichzeitig aktiv sein und auf unterschiedliche Assist-Pipelines verweisen. So kann ein Aktivierungswort in einer anderen Sprache antworten oder einen anderen Konversationsagenten verwenden als ein anderes. Bleibt die Pipeline eines Aktivierungsworts auf dem Standardwert, verwendet es die von Home Assistant aktuell bevorzugte Pipeline. Wenn eine zugewiesene Pipeline später gelöscht wird, fällt dieses Aktivierungswort ebenfalls auf die bevorzugte Pipeline zurück.

Du kannst die aktiven Aktivierungswörter auch direkt in Home Assistant ändern: Die eigenen Einstellungen des Satelliten unter **Einstellungen > Sprachassistenten** oder auf der Geräteseite des Panels zeigen dieselbe Liste und schreiben Änderungen auf das Panel zurück. Welche Pipeline jedes Aktivierungswort verwendet, legst du auf der Seite „Konfiguration“ des Panels fest.

Die Erkennung des Aktivierungsworts läuft auf dem Panel selbst, weder in der Cloud noch auf deinem Home Assistant-Server. Das Panel sendet erst Audio an Home Assistant, wenn es ein Aktivierungswort hört, und nur so lange, wie die Spracherkennung deinen Befehl noch empfängt. Es hört mit der Übertragung auf, sobald Home Assistant das Ende des Befehls meldet.

Du möchtest ein Aktivierungswort, das nicht in dieser Liste steht? Siehe [Eigene Aktivierungswörter](/de/manage/custom-wake-words/).

## Was das Panel anzeigt

Ein kurzer Signalton und eine Welle markieren den Moment, in dem das Panel ein Aktivierungswort hört. Während es zuhört, nachdenkt oder antwortet, bekommen die Bildschirmränder eine dezente, langsam pulsierende Färbung. Die Farbe zeigt, welche Pipeline antwortet: Panel Assistant weist jeder Pipeline bei ihrer ersten Verwendung durch irgendein Panel eine Farbe zu und behält diese Zuordnung bei. Dieselbe Pipeline sieht daher auf jedem Panel im Haus gleich aus. Hier musst du nichts konfigurieren.

Wenn der Konversationsagent der Pipeline eine Rückfrage stellt, beginnt das Panel selbstständig wieder zuzuhören, ohne dass du das Aktivierungswort wiederholen musst.

## Durchsagen und eine Konversation starten

Wenn der Sprachassistent eingeschaltet ist, spricht `assist_satellite.announce` eine Nachricht aus einer beliebigen Automatisierung oder einem Skript auf dem Panel, optional mit einem kurzen Signalton davor. `assist_satellite.start_conversation` spricht eine Aufforderung und lauscht anschließend auf die Antwort. Home Assistant erlaubt dies nur mit einem Konversationsagenten, der das eigenständige Starten einer Konversation unterstützt. Der integrierte Home Assistant-Agent unterstützt das nicht. Beide Dienste benötigen den eingeschalteten Sprachassistenten. Eine einfachere REST-Alternative für Panels ohne Mikrofon findest du unter [Text-to-Speech](/de/manage/text-to-speech/#play-an-announcement-with-the-voice-assistant-on).

## Mehrere Assistenten in einem Raum

Wenn zwei Satelliten derselben Home Assistant-Instanz dieselbe Aktivierungswort-Phrase innerhalb von zwei Sekunden hören, unterdrückt Home Assistant das Duplikat, sodass nur einer antwortet. Das gilt für alle Satelliten dieser Home Assistant-Instanz, nicht nur für Panels im selben Home Assistant-Bereich. Es schließt daher auch ein Panel und jeden anderen bereits vorhandenen Satelliten ein. Wenn du entscheiden möchtest, welches Gerät in einem gemeinsamen Raum antwortet, gib ihnen unterschiedliche Aktivierungswörter.

## Einstellungen

Die Karte „Sprachassistent“ bietet neben der Aktivierungswortliste einige weitere Einstellmöglichkeiten:

- **Aktivierungsempfindlichkeit:** Niedrig, Normal oder Hoch. „Hoch“ senkt den Schwellenwert des Aktivierungswortmodells. Das Panel reagiert dadurch leichter, aber auch eher auf eine falsche Übereinstimmung. „Niedrig“ verlangt vor der Aktivierung eine deutlichere Übereinstimmung.
- **Mikrofonverstärkung (dB):** Verstärkt nur das Audio, das zur Transkription an Home Assistant gesendet wird, niemals das Audio, das der Aktivierungswort-Erkenner selbst analysiert. Erhöhe sie, wenn das Aktivierungswort zuverlässig auslöst, aber aus der Entfernung gesprochene Befehle überhört oder falsch verstanden werden.
- **Audioquelle:** Die Android-Audioquelle für die Mikrofonaufnahme. Belasse den Standard (`voice_recognition`), sofern du keine andere Anweisung erhalten hast.

## Fehlerbehebung

**Das Panel reagiert nie auf das Aktivierungswort.** Prüfe, ob **Sprachassistent** eingeschaltet und das gesprochene Wort unter **Aktivierungswörter** aktiviert ist. Probiere **Aktivierungsempfindlichkeit: Hoch** und sprich von deinem üblichen Standort, nicht direkt neben dem Mikrofon.

**Es reagiert, versteht aber den Befehl nicht.** Erhöhe **Mikrofonverstärkung (dB)** etwas und versuche es erneut. Das betrifft nur das zur Transkription gesendete Audio und sorgt nicht von sich aus für leichteres Aktivieren. Wenn du ein eigenes Aktivierungswort trainierst, protokolliert das Panel auch knapp verfehlte Erkennungen mit ihrer erreichten Bewertung. So erkennst du am direktesten, ob ein verpasstes Aktivierungswort knapp danebenlag oder deutlich verfehlt wurde. Siehe [Eigene Aktivierungswörter](/de/manage/custom-wake-words/#testen-und-abstimmen).

**Die Satellitenentität wird als nicht verfügbar angezeigt.** Der Sprachassistent ist ausgeschaltet oder das Panel ist nicht über Panel Assistant mit Home Assistant verbunden. Schalte den Sprachassistenten auf der Seite „Konfiguration“ des Panels ein. Er kann nicht aus Home Assistant eingeschaltet werden.
