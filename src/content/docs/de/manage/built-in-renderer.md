---
title: Der integrierte Renderer
description: Wie die Panel-App dein Home Assistant-Dashboard selbst zeichnet, sich bei Fehlern erholt und die empfangenen Entitäten filtert.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Die Panel-App zeichnet dein Home Assistant-Dashboard in ihrer eigenen WebView, statt es einer separaten Dashboard-App zu übergeben. So kann sie nach einem App-Neustart schnell zum Dashboard zurückkehren: Sie öffnet das letzte von Home Assistant bestätigte Dashboard für denselben Server, dasselbe Konto und dieselbe Start-Dashboard-Einstellung, während sie im Hintergrund die aktuelle Dashboardliste prüft. Meldet Home Assistant, dass das Dashboard entfernt wurde oder sich der Kontostandard geändert hat, wechselt das Panel zur aktuellen Auswahl.

Sobald das Dashboard läuft, kann die Panel-App eine festgefahrene Verbindung erkennen, angesammelten WebView-Speicher freigeben und Renderer-Abstürze begrenzen. Die integrierte Verbindung ermöglicht auch das Filtern der Dashboard-Entitäten. Das Panel bleibt ein Gerät mit einer einzigen App, die installiert und aktualisiert werden muss.

Der integrierte Renderer ist mit Abstand der bevorzugte Weg zur Anzeige deines Dashboards und wird von der geführten Einrichtung ausgewählt. Eine separate Dashboard-App bleibt als Option unterstützt, etwa wenn ein Panel mehr als einen Home Assistant-Server oder native Benachrichtigungen benötigt (siehe [Grenzen](#grenzen)). Assist-Sprachsteuerung hängt von keiner der Dashboard-Apps ab: Auf einem Panel mit Mikrofon stellt der eigene [Sprachassistent](/de/manage/voice-assistant/) des Panels sie unabhängig von der laufenden Dashboard-App bereit.

<a id="startup-and-recovery"></a>

## Start und Wiederherstellung

Der Renderer nutzt die dokumentierte Home Assistant-Schnittstelle `?external_auth=1`. Dadurch erkennt die Panel-App, wann sich das Dashboard verbunden hat, statt die Seite als Blackbox zu behandeln. Er:

- Öffnet nach einem App-Neustart das letzte bestätigte Dashboard erneut und aktualisiert im Hintergrund die Dashboardliste von Home Assistant. Eine kurze Kompatibilitätsprüfung läuft weiterhin zuerst. Das gespeicherte Dashboard ist an den Home Assistant-Server, das Konto und das konfigurierte Dashboard gebunden. Ein ausdrücklich festgelegtes Dashboard oder ein Dashboard-Tab hat immer Vorrang.
- Friert die Seite bei ausgeschaltetem Bildschirm ein und setzt sie beim Aufwachen fort. Das spart über Nacht ungefähr 70 % der Renderer-CPU.
- Lädt ein Dashboard neu, das sich geöffnet, aber nie verbunden hat. Nach wiederholten Fehlern werden die Versuche seltener. Das Panel zeigt einen klaren Bildschirm **Verbindung zu Home Assistant wird wiederhergestellt…** statt einer Browserfehlerseite.
- Wiederholt behebbare Prüfungen mit wachsenden Abständen. Eine dauerhaft abgelehnte Anmeldung beendet die Versuche und zeigt Hinweise zur Browser-Anmeldung. Eine nicht unterstützte Home Assistant-Version oder eine inkompatible WebView nennt das nötige Update und wartet darauf.
- Gibt bei ausgeschaltetem Bildschirm angesammelten Speicher durch unsichtbares Neuladen frei.
- Begrenzt Renderer-Abstürze und ihre Häufigkeit. Eine immer wieder abstürzende Seite fällt auf den Verwaltungs-Launcher zurück, statt die ganze Nacht neu zu starten.
- Zeigt einen nativen Hinweis am Panel, wenn Home Assistant sein Herunterfahren ankündigt oder offline geht, und entfernt ihn erst, wenn Home Assistant nachweislich zurück ist.

Ziehe vom obersten Bildschirmrand nach unten, um zu aktualisieren, oder zweimal, um vollständig neu zu laden. Der Renderer unterstützt außerdem eine optionale Rückkehr zum Start-Dashboard bei Inaktivität, die automatische Wiedergabe von Kamerastreams und HTTPS mit einer vom Benutzer installierten privaten Zertifizierungsstelle. **Android-Systemleisten ausblenden** ermöglicht ein randloses Dashboard. Wische von einem Bildschirmrand, um die Leisten wieder anzuzeigen. Auf Panels mit der Software-Navigationsleiste der App holt **Dashboard** den Renderer ohne Neuladen nach vorne. **Neu laden** ist eine separate Wiederherstellungsaktion.

**Zoomstufe (%)** passt die Darstellungsgröße des Dashboards an; der Standard ist 100 %. Der Renderer fügt der Home Assistant-Seitenleiste einen Eintrag **App-Einstellungen** hinzu, der die Konfigurationsseite des Panels öffnet. Beim ersten Start blendet er die angedockte Seitenleiste aus und hält die Verbindung im Leerlauf aufrecht. Du kannst die Seitenleiste später öffnen oder diese Vorgaben ändern. Die separate Option **Navigation von Home Assistant ausblenden (nativ)** fordert das Frontend auf, seine Navigation im nativen Kioskmodus zu entfernen. Wenn das Dashboard einfach die falsche Größe hat, siehe [Anzeigegröße](/de/manage/display-sizing/).

## Voraussetzungen und Kompatibilität

Der integrierte Renderer benötigt beides:

- **Home Assistant 2026.4.2 oder neuer** und
- eine Android System WebView, die den sicheren WebMessage-Listener der nativen Host-Schnittstelle von Home Assistant unterstützt.

Die meisten benötigen nur eine aktuelle Android System WebView. Die Panel-App prüft die WebView-Fähigkeit und die Kompatibilität von Home Assistant, bevor sie das Dashboard lädt.

Zeigt das Panel **Home Assistant-Aktualisierung erforderlich**, aktualisiere Home Assistant und wähle **Erneut versuchen**. Nichts auf dem Panel kann das ersetzen.

Zeigt es **Die Webanzeige dieses Panels ist zu alt**, befolge [WebView aktualisieren](/de/hardware/guides/update-the-webview/). In der unveröffentlichten Version 1.0.0-rc2 kann ein über Home Assistant gestartetes Update der Panel-App auch eine geprüfte, kompatible WebView installieren, wenn das Panel es erlaubt. Andere Panels benötigen den im Leitfaden beschriebenen Weg. Wähle nach dem WebView-Update **Erneut versuchen**.

Der integrierte Renderer fällt niemals auf eine weniger isolierte Bridge zurück. Ein anderer Renderer kann helfen, wenn Home Assistant selbst nicht aktualisiert werden kann. Jede Dashboard-App auf dem Panel verwendet jedoch dieselbe System-WebView. Keine kann daher eine veraltete WebView umgehen.

## Einrichten

Wähle auf einem neuen oder zurückgesetzten Panel direkt am Panel **Einrichtung** oder öffne seine Einrichtungsseite auf einem Laptop oder Telefon (zum Beispiel `http://<panel>:8888/setup` beim Standardport). Die geführte Einrichtung wählt den Renderer, meldet sich bei Home Assistant an, wählt den Kontostandard, ein Dashboard oder einen bestimmten Dashboard-Tab und fragt vor dem ersten Laden nach dem Entitätenfilter. Die Autorisierung erfolgt im Browser des Administrators. Am Panel werden keine Anmeldedaten eingegeben.

Wähle bei einem bereits eingerichteten Panel auf seiner Geräteseite in Home Assistant **Besuchen** und öffne **Konfiguration**. Gib unter **Home Assistant-Verbindung** die Home Assistant-URL ein, wähle **Browser-Anmeldung** und anschließend **Integrierter Renderer** als Dashboard-App.

## Dashboarddarstellung und Android-Sperre

Die erweiterten Einstellungen auf der Seite „Konfiguration“ enthalten drei unabhängige Steuerungen für unterschiedliche Ebenen:

| Option unter „Konfiguration“                                             | Was sie ändert                                                                                                                                                                                                                                                                                   | Was sie **nicht** ändert                                                                                                                                                                                       |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Navigation von Home Assistant ausblenden (nativ)** (standardmäßig aus) | Fordert nach dem Verbinden von Home Assistant dessen Frontend auf, die Navigation auszublenden. Nur integrierter Renderer.                                                                                                                                                                       | Sperrt Android nicht, blendet dessen Systemleisten nicht aus und fügt kein Dashboard-CSS ein oder ändert es. Lehnt Home Assistant die Anfrage ab oder unterstützt sie nicht, bleibt das Dashboard unverändert. |
| **Android-Systemleisten ausblenden** (standardmäßig an)                  | Blendet die Android-Status- und Navigationsleisten für ein randloses Dashboard aus. Wische vom Rand, um sie anzuzeigen. Nur integrierter Renderer.                                                                                                                                               | Hindert niemanden am Verlassen der App und blendet nicht die eigenen Menüs und Navigation von Home Assistant aus.                                                                                              |
| **Android auf Dashboard sperren (experimentell)** (standardmäßig aus)    | Blendet mit Root die Android-Systemleisten aus und kehrt innerhalb von etwa drei Sekunden zum ausgewählten Dashboard zurück, wenn eine andere App oder „Zuletzt verwendet“ geöffnet wird. Das erschwert beiläufiges Verlassen, ist aber keine Sicherheitsgrenze gegen eine entschlossene Person. | Ändert das Aussehen des Dashboards nicht. Ohne Root wirkungslos. Nach einem Neustart gibt es ein entsperrtes Zeitfenster von 60 Sekunden zur Wiederherstellung, danach gilt die gespeicherte Sperre erneut.    |

Schalte für ein aufgeräumteres Dashboard **Navigation von Home Assistant ausblenden (nativ)** ein, sobald niemand mehr die Home Assistant-Navigation am Panel benötigt. **Android-Systemleisten ausblenden** ist bereits an. Schalte **Android auf Dashboard sperren** nur ein, wenn du beiläufiges Verlassen der App erschweren musst, und teste vorher die Auswege: die Seite „Konfiguration“, den Home Assistant-Schalter, `adb`, sieben schnelle Berührungen oben links oder das entsperrte Zeitfenster nach einem Neustart.

## Entitätenfilter

:::caution
Automatisches Lernen kann nicht jede Abhängigkeit einer benutzerdefinierten Karte oder dynamischen Vorlage nachweisen. Eine unvollständige Entitätenmenge kann Karten fehlen oder veralten lassen. Prüfe die gelernte Menge nach Dashboardänderungen und halte den Weg zum Ausschalten des Filters bereit.
:::

Der Filter gilt nur für den integrierten Renderer. Er ändert das Abonnement des Frontends bei Home Assistant, sodass Home Assistant die Zustände vor dem Serialisieren und Senden an das Panel filtert. Andere Dashboard-Apps bleiben unberührt. [Leistung](/de/manage/performance/) erklärt, warum dies auf einem langsamen Panel meist die größte Verbesserung ist.

### Automatischer Ablauf

1. Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen**, öffne **Konfiguration**, dann **Dashboard**, wähle **Integrierter Renderer** und schalte **Entitätsfilterung** ein.
2. Öffne den Tab **Entitäten** und wähle **Dashboard jetzt scannen**.
3. Besuche jeden Dashboard-Tab und verwende seine Steuerelemente, Pop-ups und bedingten Inhalte, damit das Panel ihre Abhängigkeiten zur Laufzeit beobachten kann.
4. Prüfe die aktuellen, vorgeschlagenen und ausgeschlossenen Listen. Fixiere Entitäten, die benutzerdefinierte Karten oder Vorlagen indirekt verwenden, und kläre die über den Tabellen angezeigten Entitätenfilter-Prüfungen.
5. Wähle **Regelsatz anwenden**, sobald der Kandidat bereit ist. Das Panel zeigt die alte und neue Entitätenanzahl, fragt nach deiner Bestätigung und lädt dann das Dashboard mit dem gefilterten Abonnement neu.

![Der Tab „Entitäten“ der Weboberfläche mit dem Entitäten-Abonnementfilter, den aktuell abonnierten und den vorgeschlagenen Entitäten](/screenshots/ui-entities-dark.png)

Die Entitätenseite erklärt, warum jede Entität gefunden wurde, speichert deine manuellen Fixierungen und Ausschlüsse und hält erkannte breite oder dynamische Regeln sichtbar, bis du sie korrigierst oder ausdrücklich über das Vorgehen entscheidest. Nicht erkanntes Verhalten kann weiterhin existieren. Teste daher nach dem Einschalten des Filters jeden Dashboard-Tab. Fehlt etwas, schalte **Entitätsfilterung** auf der Seite „Konfiguration“ aus und lade neu, bevor du den Kandidaten überarbeitest.

### Wenn das Panel das Dashboard zurückhält

Bei eingeschalteter automatischer Filterung öffnet der integrierte Renderer Home Assistant niemals ungefiltert. Bis ein Scan eine ausreichend abgesicherte Menge erzeugt hat, zeigt das Panel statt des Dashboards aus einem von drei Gründen einen nativen Wartebildschirm. Während der erste Scan läuft oder fehlgeschlagen ist, wiederholt das Panel ihn mit wachsenden Abständen, weil Home Assistant meistens noch nicht bereit ist. Lehnt Home Assistant die Anmeldedaten des Panels ab, nennt der Wartebildschirm die Anmeldung. Ist der Scan abgeschlossen, hat aber eine nicht eingrenzbare Regel gefunden, etwa ein durch eine Strategie erzeugtes Dashboard oder einen unbegrenzten Selektor, fordert der Wartebildschirm eine Entscheidung: markierte Regeln ignorieren und fortfahren, Filter ausschalten oder die Regeln auf der Entitätenseite prüfen. Das kannst du am Panel oder auf jedem Gerät im Netzwerk entscheiden: Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen** und öffne **Entitäten** (zum Beispiel `http://<panel>:8888/entities` beim Standardport). Der Wartebildschirm zeigt auch die Adresse.

Ein auf eine Entscheidung wartender Zustand ist stabil. Das Panel scannt den Katalog währenddessen daher nicht erneut. Fünf Minuten nach Stabilisierung und danach höchstens stündlich fragt es Home Assistant, ob sich das Dashboard geändert hat. Es scannt nur erneut, wenn sich die Dashboardkonfiguration oder der Kontostandard tatsächlich geändert hat, die Entscheidung getroffen wird oder sich die Home Assistant-Einstellungen des Panels ändern.

Ein Update der Panel-App kann eine erneute Prüfung eines bereits gefilterten Dashboards auslösen. Markiert diese Prüfung eine Regel auf einem bereits gefilterten Dashboard, speichert das Panel die Regel als ignoriert, stellt die bisherige Entitätenmenge wieder her und öffnet das Dashboard, statt es zurückzuhalten. Die Regel bleibt auf der Entitätenseite sichtbar und kann dort wieder aktiviert werden. Das gilt nur für eine durch ein Update ausgelöste Prüfung, nur mit einem zuvor akzeptierten Filter und nur bei nicht leerer wiederhergestellter Menge. Regeln, die das Panel niemals ignorieren kann, etwa ein zu großes Dashboard für die Analyse, halten den Renderer weiterhin zurück.

### Vorlagen und manuelle Fixierungen

Die Panel-App führt Dashboardvorlagen nicht aus und kann daher nicht wissen, welche Entitäten eine Vorlage zurückgibt. Sie rät nicht. Sie behandelt die beiden Arten von Entitäten, die eine Vorlage berührt, unterschiedlich.

Entitäten, die eine Vorlage nur **liest**, etwa einen in einer Bedingung geprüften Zustand, benötigen nichts. Home Assistant rendert die Vorlage selbst und sendet das Ergebnis über ein separates, vom Filter unberührtes Abonnement an das Panel. Diese Entitäten fehlen absichtlich in den Listen der Entitätenseite. Sie hinzuzufügen würde das Abonnement ohne Nutzen vergrößern.

Entitäten, die eine Vorlage **zurückgibt**, sind anders. Sie werden zu Karten im Dashboard, die ihren Zustand über das gefilterte Abonnement lesen, und müssen deshalb enthalten sein. Das Panel kann sie ohne Ausführen der Vorlage nicht entdecken. Auch das Fortfahren trotz einer Entitätenerkennungsprüfung fügt sie nicht hinzu. Diese Entscheidung erlaubt nur das Fortsetzen automatischer Aktualisierungen ohne sie.

Gib zum Hinzufügen einen beliebigen Teil des Namens oder der ID in das Suchfeld oben auf der Entitätenseite ein. Die Suche umfasst den vollständigen Home Assistant-Katalog, nicht nur bereits gefundene Entitäten, und zeigt die Trefferanzahl jeder Tabelle. Setze jede benötigte Entität auf **Angeheftet**. Eine manuelle Fixierung bleibt erhalten, bis du sie entfernst, auch über Dashboardänderungen und erneute Scans hinweg.

### Gelernte Daten zurücksetzen

Verwende **Gelernte Daten zurücksetzen** auf der Entitätenseite, wenn alte Dashboardnachweise oder frühere manuelle Entscheidungen den Kandidaten irreführend machen. Nach deiner Bestätigung werden gelernte Dashboardzugehörigkeiten und Nachweise, manuelle Fixierungen und Ausschlüsse sowie ignorierte Sicherheitsentscheidungen gelöscht. Der bewährte aktive Filter und der Home Assistant-Katalog für Kandidatennamen bleiben erhalten. Bei eingeschaltetem Lernen beginnt ein neuer Scan. Das Zurücksetzen baut also den Kandidaten neu auf, statt das Abonnement sofort wieder auf alle Home Assistant-Zustände zu erweitern.

## Design

**Dashboard-Theme** („Konfiguration“, dann „Integrierter Renderer“) bestimmt, wer zwischen hell und dunkel wählt:

- **Home Assistant folgen** (Standard) überlässt die Auswahl Home Assistant. Das Panel liefert nur einen Ausgangspunkt: Auf Android 13 und neuer folgt dieser der Systemeinstellung live, auf Android 10 bis 12 beim Laden des Dashboards, und auf Android 9 und älter legt der Schalter **Dunkelmodus** („Konfiguration“, dann „Anzeige“) ihn fest. Ein in Home Assistant gewähltes Design hat Vorrang vor diesem Ausgangspunkt.
- **Umgebungslicht** wählt hell oder dunkel anhand des Raummodells der automatischen Helligkeit. Automatische Helligkeit muss eingeschaltet sein. Bis brauchbare Messwerte vorliegen, folgt es Home Assistant. Eine Änderung benötigt eine volle Minute anhaltender Helligkeit oder Dunkelheit.
- **Dunkel** und **Hell** lassen das Panel wählen. Das ist für ein Kiosk-Dashboard mit ausgeblendeter Seitenleiste gedacht, auf dem die Home Assistant-Profilseite am Panel gar nicht erreichbar ist.

Ein erzwungenes Design ändert nur die Auswahl zwischen hell und dunkel. Ein benanntes Design und seine Farben bleiben genau erhalten. Der Wechsel zurück zu „Home Assistant folgen“ stellt die vorherige Hell-Dunkel-Auswahl wieder her, oder „Automatisch“, falls nichts festgelegt war. Das Panel ändert niemals das am Home Assistant-Konto gespeicherte Design. Ein auf „Dunkel“ eingestelltes Panel kann daher dein Telefon nicht verdunkeln.

Einen Fall kann es nicht überschreiben: Hat dieser Home Assistant-Benutzer ausdrücklich „Hell“ oder „Dunkel“ statt „Automatisch“ gewählt, hat diese Auswahl weiterhin Vorrang. Sie zu überschreiben würde eine Einstellung ändern, die mit allen anderen Geräten des Benutzers geteilt wird. Setze das Benutzerdesign auf „Automatisch“ oder gib dem Panel einen eigenen Home Assistant-Benutzer, damit die Panelauswahl gilt. Das Panel weist darauf hin: Die Karte **Laufzeitdiagnose** in der Weboberfläche meldet, dass das Home Assistant-Design das Dashboard-Design überschreibt, und die Zeile `[renderer]` im Bericht `/diag` enthält `theme_overridden=true`.

Die Weboberfläche des Panels ist davon unabhängig und folgt immer dem Browser, in dem du sie ansiehst.

## Stattdessen eine separate Dashboard-App verwenden

Benötigt ein Panel eine der unter [Grenzen](#grenzen) genannten Fähigkeiten, öffne die Seite „Konfiguration“ und wähle unter **Dashboard-App** die andere installierte Dashboard-App. Der Wechsel wirkt sofort. Wähle dafür nicht **Automatisch**, denn „Automatisch“ verwendet den integrierten Renderer, sobald er bereit ist.

## Grenzen

- **Keine Unterstützung für mehr als einen Home Assistant-Server oder native Benachrichtigungen.** Behalte eine separate Dashboard-App auf dem Panel, wenn diese Funktionen wichtig sind. Assist-Sprachsteuerung gehört nicht zu dieser Liste: Sie kommt auf einem Panel mit Mikrofon vom eigenen [Sprachassistenten](/de/manage/voice-assistant/), unabhängig von der aktiven Dashboard-App.
- **Keine Vollbild-Medienextras**, etwa Dateiauswahl oder Casting-artige Wiedergabe. Diese liegen außerhalb des Umfangs.
- Eine **aktuelle System-WebView** bleibt zum Darstellen des Home Assistant-Frontends erforderlich. Eine veraltete WebView erzeugt eine Zustandswarnung in der Weboberfläche. Aktualisiere sie mit der [Methode für dein Panel](/de/hardware/guides/update-the-webview/).
- Browser-Anmeldung und die erweiterte nicht interaktive Installation funktionieren beide ohne Root.
