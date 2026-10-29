---
title: Leistung
description: Warum ein Wandpanel bei einem auf dem Telefon flüssigen Dashboard langsam wirken kann, wie du das misst und welche Maßnahmen am meisten helfen.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ein günstiges Android-Wandpanel kann träge reagieren, beim Scrollen ruckeln, leer werden oder keine Aktualisierungen mehr zeigen, obwohl dasselbe Dashboard auf einem Telefon oder Desktop gut funktioniert. Beginne bei der Arbeit, die Home Assistant an das Panel sendet, und miss danach die verbleibenden Dashboard- und Hardwaregrenzen, bevor du von einem nötigen Austausch ausgehst.

:::tip
Eine häufige Ursache ist die Anzahl der Home Assistant-Entitätenzustände und Aktualisierungen, die das Dashboard erreichen. [Das Wettrennen](/de/manage/drag-race/) zeigt die Kosten auf zwei identischen, nebeneinander gefilmten Panels. Eine große Installation kann ein leistungsschwaches Panel Tausende Entitäten verarbeiten lassen, die es nie anzeigt. Mit dem [integrierten Renderer](/de/manage/built-in-renderer/) solltest du zuerst den Entitätenfilter versuchen.
:::

## Vor jeder Änderung messen

Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen**, um seine Weboberfläche zu öffnen (zum Beispiel `http://<panel-ip>:8888/` beim Standardport). Zeichne vor und nach jeder Änderung dieselbe Dashboardansicht über einen ähnlichen Zeitraum auf, damit der Vergleich aussagekräftig ist.

- **Reaktionsfähigkeit des Dashboards**: tatsächliche Interaktionslatenz, die langsamste Interaktion aufgeteilt in Eingabe-, Handler- und Darstellungszeit, Blockierung des Hauptthreads, Zeit bis zur Interaktivität und unerwartetes Neuladen des Renderers.
- **Home Assistant-Zustandsdatenstrom**: Zustandsaktualisierungen pro Sekunde, unkomprimierte JSON-Datenrate, Größe der anfänglichen Befüllung, Zeit bis zur Freigabe des Hauptthreads und die drei in der letzten Stunde stärksten beitragenden Entitäten, sowohl nach Aktualisierungsrate als auch Datenvolumen.
- **Leistung** und **Top-Prozesse**: CPU, GPU, RAM, Taktfrequenz, Temperatur und die aktivsten Prozesse.
- **Kamerastream**, auf einem Panel mit angebotener Kamera: die Abonnenten, die die Sitzung offenhalten, der verwendete Encoder, angeforderte neben gelieferter Bildrate und gelieferte Bitrate neben der Encodergrenze. Eine deutlich niedrigere Rate als angefordert wird so gemeldet, ohne Ursachenzuweisung: Aufnahmegeschwindigkeit bei wenig Licht, Kodierweg und Konkurrenz um Videohardware sind mögliche Ursachen. Die Karte rät nicht. Die Anforderung wird niemals still verringert. Kann die Sitzung einem Stream die angeforderte Rate nicht liefern, zeigt die Karte die Anforderung neben der an den Encoder gegebenen Rate. Sie nennt bewusst keinen CPU-Wert, denn Hardwarekodierung läuft sowohl in Codec-Hardware und Compositor als auch in der App. Kein einzelner Prozess entspricht den Kamerakosten. Lies die Gesamtlast unter „Leistung“ und „Top-Prozesse“ ab.
- **Entitätenseite**: was der integrierte Renderer aktuell abonniert, was automatisches Lernen gefunden hat und welche Dashboardregeln noch eine Entscheidung benötigen.
- **Diagnosebericht** (`/diag`): ein Bericht zum Einfügen in eine Fehlermeldung, wenn die Ursache unklar bleibt.

Der integrierte Renderer erfasst diese Browsermesswerte direkt und benötigt weder Root noch WebView-Debugging. Bei einer separaten Dashboard-App kann die Panel-App mit Root oder Helper die Renderer-CPU und Android-Darstellungswerte anzeigen, aber nicht die tatsächliche Interaktionslatenz dieser App messen.

Der Hauptthreadwert für Zustandsereignisse beginnt beim Zustellen einer relevanten Home Assistant-Nachricht und endet, wenn der Browser nach allen Handlern und Microtasks den Thread freigibt. Er umfasst die geringen Beobachtungskosten der Panel-App und alle anderen Arbeiten in derselben Nachrichtenaufgabe. Er wird daher bewusst nicht als reine Home Assistant-Verarbeitungszeit bezeichnet. Die Datenrate ist das vom Frontend verarbeitete unkomprimierte JSON, kein komprimierter Netzwerkverkehr.

Suche im zeitlich ausgerichteten Diagramm nach Zusammenhängen. Interaktionsspitzen bei starkem Zustandsverkehr und hoher Zustandsereignis-Belegung deuten auf die Größe des Zustandsstroms. Lange Handlerzeiten bei ruhigem Strom deuten auf Dashboard-JavaScript. Darstellungsverzögerung und lange Rendering-Frames deuten auf Layout, Animation, Kamera oder Medienarbeit. Wiederholtes Neuladen des Renderers deutet auf Speicher- oder Renderer-Instabilität. Lies die Werte gemeinsam. Eine einzelne CPU-Momentaufnahme kann die Ursache nicht bestimmen.

Die Zeile **Vermutliche Ursache** wendet diese Regeln zurückhaltend an und nennt ihre Sicherheit. Wenn die Nachweise keine vorherrschende Ursache stützen, sagt sie das.

### Gefiltert und ungefiltert von außerhalb des Panels vergleichen

Überlastet das ungefilterte Dashboard seine eigene WebView, können die Werte auf der Seite stehen bleiben. Ein auf einem Computer ausgeführtes Erfassungsskript fragt stattdessen die eigene Leistungsschnittstelle der Panel-App ab. Sie gehört zur veralteten REST-API (siehe [Steuerungsreferenz](/de/reference/api/#the-rest-api-is-deprecated)). So bleibt die Gesamt-CPU des Panels beobachtbar und mit Root oder Helper auch eine native Messung des Chromium-Rendererthreads. Das Skript erfasst außerdem das Alter des letzten Browsermesswertpakets. Alles über 15 Sekunden wird als festgefahren statt als aktuell gemeldet.

Das Skript ändert deine Konfiguration nicht. Es schaltet den Entitätenfilter weder ein noch aus und schreibt ihn nicht um. Seine erste Anfrage kann einen privaten Installationsschlüssel im internen Zustand der Panel-App erzeugen. Wähle für beide Durchläufe dieselbe Dashboardansicht und Arbeitslast, ändere den Filter in der Weboberfläche, warte auf das Neuladen und führe pro Zustand einen Befehl aus einem Checkout des [ha-paneld-Repositorys](https://github.com/panel-assistant/android) aus:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Vergleiche die beiden Ergebnisse:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Jeder Durchlauf dauert standardmäßig drei Minuten mit 30 Sekunden Aufwärmzeit und Abfragen alle 10 Sekunden. `--pair-with` verwendet eine undurchsichtige Vergleichs-ID aus dem ersten Ergebnis wieder. So kann der Vergleich ein anderes physisches Panel, einen anderen konfigurierten Home Assistant oder ein anderes Dashboard sowie geänderte messungsrelevante Einstellungen ablehnen, ohne diese privaten Werte zu speichern. Eine von Hand ausgewählte andere Ansicht innerhalb desselben Dashboards kann er nicht erkennen. Halte daher sichtbare Ansicht und Arbeitslast gleich.

Das Skript lehnt einen Durchlauf ab, wenn der erwartete Modus nicht aktiv ist, sich Filterrevision oder Renderergeneration ändern, Build oder Konfiguration während der Erfassung wechseln, die Filterung zurückfällt oder weniger als drei Stichproben, drei Gesamt-CPU-Stichproben oder drei native Renderer-CPU-Stichproben verbleiben. Es schreibt das abgelehnte Ergebnis trotzdem mit den genauen Gründen und überschreibt nie eine vorhandene Ausgabedatei.

Das JSON lässt URL und ID des Panels, Home Assistant-URL und Dashboardpfad, Entitäts-IDs, Prozessnamen und Filterhash weg. Das Panel berechnet die undurchsichtigen Fingerabdrücke mit einem privaten zufälligen 256-Bit-Installationsschlüssel, der es niemals verlässt. Die Fingerabdrücke sind für jedes Vergleichspaar einzigartig. Separate Messungen lassen sich darüber weder verknüpfen noch zum Erraten eines Panelnamens verwenden. Kann ein Panel den Schlüssel nicht speichern, verweigert es die Messung. Die ungefilterte Entitätenanzahl ist die zuletzt synchronisierte Kataloganzahl, kein aus der überlasteten WebView ermittelter Live-Wert. Bei leerem Katalog wird sie als nicht verfügbar gemeldet. Netzwerk- und Browserverkehrszähler werden auf die tatsächlich beobachteten Intervalle normiert, damit eine verpasste Abfrage den Vergleich nicht verzerrt. Veraltete Browserzeit- und Verkehrsraten fehlen in den Zusammenfassungen. CPU-, Speicher-, Netzwerk- und Rendererwerte der Panel-App selbst werden weiter erfasst.

### Optionales WebView-Ferndebugging

Die integrierten Leistungskarten benötigen keine DevTools. Verwende die Karte **Remote-WebView-Debugging** nur, wenn du den Seitenquellcode eingehend untersuchen musst.

Aktiviere bei einer separaten Dashboard-App zuerst deren eigene WebView-Ferndebugging-Einstellung und starte das Dashboard neu. Ohne sie kann das Relay die WebView der App nicht finden. Das Netzwerk-Relay selbst benötigt Root.

### Den Zigbee-Watchdog-Fehler der originalen NSPanel Pro-Firmware ausschließen

Ältere originale Sonoff NSPanel Pro-Firmware mit der rekursiven Zuweisung `export LD_LIBRARY_PATH=/vendor/bin/siliconlabs_host/:${LD_LIBRARY_PATH}` kann den Herstellerprozess `guard_process.sh` selbst zum Leistungsproblem machen. Eine [Community-Untersuchung](https://github.com/panel-assistant/android/issues/34) bestätigte den Fehler auf einem NSPanel Pro 120 mit Originalfirmware 3.8.0 und meldete ihn auf allen 16 Panels des Meldenden. Das Skript stellt sein Verzeichnis alle fünf Sekunden voran. Nach ungefähr zehn Stunden überschreitet die Umgebungszeichenfolge das Linux-Limit pro Zeichenfolge beim Programmstart. Externe Befehle schlagen mit `E2BIG` fehl, `sleep` verzögert die Schleife nicht mehr und der Watchdog kann einen CPU-Kern auslasten. Dann kann auch der Neustart eines beendeten `zgateway` scheitern und Zigbee ausfallen. Firmware von 1.x bis 3.x könnte überall dort betroffen sein, wo dieselbe Zeile vorkommt. Das wurde jedoch nicht unabhängig bestätigt.

Achte auf dieses Muster, wenn ein sonst untätiges originales NSPanel Pro regelmäßig Systemlast meldet:

- `guard_process.sh` bleibt nahe 100 % eines CPU-Kerns, und seine Prozessgröße wächst weit über den gesunden Wert von etwa 9 MB;
- `zgateway` fehlt oder erholt sich nicht mehr; und
- ein Neustart hilft, doch die Last kehrt ungefähr zehn Stunden später zurück.

Ein Neustart setzt die wachsende Umgebung nur vorübergehend zurück. Das verlinkte Issue enthält eine vom Meldenden bereitgestellte Umgehungslösung mit Root und ADB, die das Projekt nicht unabhängig geprüft hat. Wende sie nur an, wenn die genaue rekursive Zuweisung einmal im Herstellerskript vorkommt. Jede Reparatur muss zuerst eine nicht leere Sicherung prüfen und Eigentümer, Modus sowie SELinux-Metadaten erhalten. Stoppe bei unerwarteten Treffern vor jeder Änderung. Setze nach der Änderung zurück, wenn Neustart oder Prüfung scheitern, hänge `/vendor` wieder schreibgeschützt ein und prüfe sowohl `zgateway` als auch seine Verfügbarkeit in Home Assistant. Ein Firmware-Update, das `/vendor` neu schreibt, entfernt den lokalen Patch. Der Fehler kehrt nur zurück, wenn die neue Firmware die Zuweisung weiterhin enthält. Community-Prüfungen der Firmware 4.0.12 und 4.6.0 fanden sie nicht.

Dieser Fehler unterscheidet sich von einem stabilen `zgateway`, das in einer Warteschleife auf ein nicht antwortendes Funkmodul läuft. Der Zigbee-Zustandssensor des Panels trennt CPU von Guard und Gateway, Beitrittsnachweise und Neustartverlauf. Er warnt vor der genauen rekursiven Zuweisung, bearbeitet Herstellerskripte aber nicht selbst. Ein konfiguriertes Gateway, das ausdrücklich keinem Netzwerk beigetreten ist und nach seiner 15-minütigen Schonfrist bei fünf Messungen im Minutenabstand über 50 % eines Kerns bleibt, wird automatisch ausgeschaltet und begrenzt. Ein beigetretener Router mit hoher CPU löst nur eine Warnung aus.

## Maßnahmen nach Wirkung

### 1. Entitätenabonnement des integrierten Renderers filtern

Das Home Assistant-Frontend abonniert normalerweise die Zustände jeder für den angemeldeten Benutzer sichtbaren Entität. Das Panel muss sie alle empfangen und verarbeiten, auch wenn sein Dashboard nur wenige nutzt. Der integrierte Renderer kann die gelernte Entitätenmenge des Dashboards zum Abonnement hinzufügen. Home Assistant filtert den Strom dann vor dem Serialisieren und Senden. Das Panel behält seine gewöhnliche authentifizierte Verbindung zu Home Assistant. Es sind weder Proxy noch zusätzlicher Server beteiligt.

Der Entitätenfilter gilt nur für den integrierten Renderer. Die geführte Einrichtung fragt vor dem ersten Laden, ob er eingeschaltet werden soll. Auf einem bereits eingerichteten Panel:

1. Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen**, öffne **Konfiguration**, dann **Dashboard**, wähle **Integrierter Renderer (ha-paneld)** und schalte **Entitätsfilterung** ein.
2. Öffne den Tab **Entitäten** und wähle **Dashboard jetzt scannen**.
3. Besuche jeden Dashboard-Tab und verwende Steuerelemente, Pop-ups und bedingte Inhalte, damit Laufzeitabhängigkeiten beobachtet werden können.
4. Prüfe aktuelle, vorgeschlagene und ausgeschlossene Entitäten. Fixiere alles, was benutzerdefinierte Karten oder Vorlagen indirekt benötigen.
5. Kläre alle Entitätenfilter-Prüfungen. Grenze breite oder dynamische Dashboardregeln nach Möglichkeit ein oder triff eine ausdrückliche Entscheidung und akzeptiere die angezeigte Warnung.
6. Wende die Menge an, lass das Dashboard neu laden und vergleiche dieselben Ansichten anhand der Leistungskarten auf dem Dashboard-Tab.

Automatisches Lernen kann nicht jede Abhängigkeit einer benutzerdefinierten Karte oder dynamischen Vorlage nachweisen. Eine fehlende Entität kann eine Karte veraltet oder nicht verfügbar machen. Prüfe das Ergebnis daher zuerst auf einem Panel, auf das du nicht angewiesen bist, und lasse den Filter aus, bis der Kandidat glaubwürdig ist. Das ungefilterte Abonnement bleibt als Rückweg verfügbar: Schalte **Entitätsfilterung** aus und lade das Dashboard neu.

Wenn alte gelernte Nachweise oder manuelle Entscheidungen das Dashboard nicht mehr beschreiben, verwende **Gelernte Daten zurücksetzen** auf der Entitätenseite. Nach deiner Bestätigung werden gelernte Zugehörigkeiten, Fixierungen, Ausschlüsse und ignorierte Sicherheitsentscheidungen gelöscht. Der bewährte aktive Filter bleibt erhalten und ein neuer Scan beginnt. Während der Kandidat neu aufgebaut wird, bleibt der Filter als Rückfalloption bestehen.

### 2. Das Dashboard selbst vereinfachen

- Teile ein dichtes Dashboard in gezielte Ansichten auf und lade keine Karten, die das Panel nie benötigt.
- Bevorzuge integrierte Karten, wenn eine benutzerdefinierte Karte ständig animiert, einen großen Dokumentbaum aufbaut oder häufig JavaScript ausführt.
- Beobachte Interaktionsverarbeitung, lange Animationsframes und Renderer-Neuladungen. Dominiert eine Ansicht, vereinfache sie oder verwende `button.<panel>_reload` als vorübergehende Abhilfe, während du die aufwendige Karte suchst.
- Teste Kamera- und Diagrammkarten einzeln. Ihre Dekodierung, Verlaufsabfragen und Darstellung können selbst bei korrekt funktionierender Entitätenfilterung dominieren.

### 3. Unnötige Aktualisierungen an der Quelle reduzieren

Die Entitätenfilterung schützt das Panel vor nicht angezeigten Entitäten, macht eine benötigte Entität aber nicht günstiger. Zeigt das Dashboard tatsächlich einen Stromzähler, Bluetooth-Abstandssensor, eine schnell wechselnde Vorlage oder eine unruhige Diagnoseentität, senke die Aktualisierungsrate an der Quelle, soweit deren Integration es erlaubt. Das kann auch Recorder- und Datenbankarbeit für die gesamte Home Assistant-Installation verringern.

Nützliche Möglichkeiten sind ESPHome-Throttle- und Delta-Filter, Zigbee-Meldeintervalle, `scan_interval`-Einstellungen von Integrationen und seltenere Vorlagenaktualisierungen. Prüfe vor einer flächendeckenden Anwendung, ob die Änderung Automatisierungen oder Verlaufsansichten weniger nützlich macht.

### 4. Das verbleibende Dashboard an die Hardware anpassen

PX30- und RK3566-Panels können ein gezieltes Dashboard gut ausführen, haben aber weiterhin begrenzte Einzelthread-Leistung und meist nur 2 GB RAM. Die Entitätenfilterung entfernt unnötige Zustandsarbeit. Sie macht einen übergroßen Kamerastream, eine komplexe Animation oder ein sehr großes Verlaufsdiagramm nicht kostenlos. Gestalte für die logische Anzeigegröße des Panels und teste die schwerste Ansicht, statt nur den Start-Tab zu beurteilen. Die [Hardwareseiten](/de/hardware/) vergleichen die unterstützten Panels.

## Checkliste

- [ ] Der integrierte Renderer ist überall ausgewählt, wo native Benachrichtigungen nicht benötigt werden
- [ ] Automatische Entitätenfilterung ist eingeschaltet, gescannt, geprüft und ausdrücklich angewendet
- [ ] Jeder Dashboard-Tab, jedes Pop-up und jeder bedingte Pfad wurde beim Lernen verwendet
- [ ] Abhängigkeiten von benutzerdefinierten Karten und Vorlagen sind fixiert oder anderweitig berücksichtigt
- [ ] Entitätenfilter-Prüfungen wurden bewusst geklärt und nicht versehentlich ignoriert
- [ ] Dieselben Ansichten wurden vor und nach dem Filtern mit den Leistungskarten auf dem Dashboard-Tab verglichen
- [ ] Falls die ungefilterte Seite selbst stehen bleibt, wurden beide Durchläufe mit dem Messskript erfasst und geprüft
- [ ] Aufwendige Karten, Kamerastreams und Diagramme wurden einzeln getestet
- [ ] Benötigte hochfrequente Entitäten wurden gegebenenfalls an der Quelle angepasst
- [ ] Bei einem originalen NSPanel Pro-Zigbee-Stack wurde `guard_process.sh` geprüft
- [ ] Neuladen und Ausschalten des Filters wurden beide als Wiederherstellungswege getestet

## Referenz

### Warum eine große Home Assistant-Installation ein Panel verlangsamen kann

Das Home Assistant-Frontend hält ein WebSocket-Abonnement mit dem aktuellen Zustand und jeder späteren Aktualisierung der für den Benutzer verfügbaren Entitäten. Ohne eingeschränkte Entitätenmenge empfängt der Renderer weit mehr Daten, als ein gezieltes Wanddashboard nutzt. Sein JavaScript-Hauptthread muss die Nachrichten parsen, das Zustandsmodell des Frontends aktualisieren und ermitteln, ob sich Sichtbares geändert hat.

Günstige Panels reagieren besonders empfindlich, weil JavaScript, Layout und Zeichnen stark von einem Rendererthread abhängen. Zusätzliche CPU-Kerne helfen bei anderer Arbeit, beseitigen diese Verzögerung aber nicht. Begrenzter RAM macht die automatische Speicherbereinigung zunehmend störend, wenn der WebView-Speicher wächst.

### Häufige Symptome

| Symptom                                                                                                     | Wahrscheinliche Ursache                                                                           |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Verzögerte Berührungen, träge Navigation oder ruckelndes Scrollen                                           | Hauptthreadarbeit des Renderers durch großen Entitätenstrom, aufwendige Karten oder beides        |
| Eine Dashboardansicht ist viel schlechter als die anderen                                                   | Aufwendige Karten, Kameradekodierung, Verlaufsdaten oder großer Dokumentbaum dieser Ansicht       |
| Die ganze Ansicht wird leer, während die umgebende Oberfläche bleibt                                        | WebView-Speicherdruck oder Rendererfehler                                                         |
| Das Dashboard wird über Tage schrittweise schlechter                                                        | Speicherwachstum, Fragmentierung oder eine Karte, die Arbeit ansammelt                            |
| Entitäten aktualisieren sich nicht mehr und kommen dann schubweise                                          | WebSocket-Unterbrechung, Neuverbindung oder ein überforderter Renderer                            |
| Ähnliche Panels verhalten sich unterschiedlich                                                              | Unterschiedliche Dashboardinhalte, Entitätenabonnements, WebView-Versionen, Laufzeiten oder Wärme |
| Ein originales NSPanel Pro ruckelt etwa zehn Stunden nach dem Start und `guard_process.sh` nutzt einen Kern | Die rekursive Zuweisung im Hersteller-Zigbee-Watchdog führt zu `E2BIG`                            |

Die automatische Speicherbereinigung pausiert JavaScript gelegentlich, um ungenutzten Speicher freizugeben. Nahe der Speichergrenze werden diese Pausen länger und häufiger. Das kann die Darstellung aushungern, selbst wenn der Android-Prozess nicht abgestürzt ist.
