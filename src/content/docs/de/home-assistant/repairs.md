---
title: Reparaturen
description: Was jede Panel Assistant-Reparatur bedeutet, warum sie erscheint und wie du sie behebst.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Öffne in Home Assistant **Einstellungen → System → Reparaturen** und wähle die Panel Assistant-Meldung. Ihr erster Link öffnet die betreffende Einstellung oder die Wiederherstellungsschritte. Verwende **Mehr erfahren** für die folgende Erklärung.

Bewahre den gespeicherten Supportbericht auf, während du eine fehlgeschlagene Installation oder ein Update prüfst. Die Aktion **Fehler löschen** entfernt diesen Bericht; sie verändert das Panel nicht.

Verwende das abgesicherte **Erneut versuchen** der vorhandenen Reparatur erst, nachdem du Bericht und Panel geprüft hast. Starte keine neue automatische Installation, Deinstallation oder Rücksetzung, solange der Installationszustand unbekannt ist. Siehe [Installationswiederherstellung](/de/manage/troubleshooting/#eine-netzwerkinstallation-wurde-unterbrochen) und [Supportberichte](/de/home-assistant/support-report/).

## Deine Reparatur finden

- [Panel Assistant von &lt;panel&gt; entfernen](#panel-assistant-von-panel-entfernen)
- [Panel-App zu alt](#panel-app-too-old)
- [Alte App benötigt 0.9.0](#old-app-needs-090)
- [MQTT-Panel benötigt 0.9.0](#mqtt-panel-needs-090)
- [Panelberechtigungen](#panel-permissions)
- [Näherungseinrichtung des Panels](#panel-proximity-setup)
- [Dashboard ungefiltert](#dashboard-unfiltered)
- [Sprachmikrofon stumm](#voice-microphone-silent)
- [Sprachmikrofon ohne Audio](#voice-microphone-no-audio)
- [Sprachmikrofon ohne Audio: Details](#voice-microphone-no-audio-detail)
- [Aktivierungswort beibehalten](#wake-word-kept)
- [Aktivierungswort abgelehnt](#wake-word-refused)
- [Lautstärke-Zahlenentität entfernt](#volume-number-removed)
- [Neustart erforderlich](#restart-required)
- [Abweichender Panelbenutzer](#panel-user-mismatch)
- [Kein Update-Zugangsweg](#no-update-route)
- [Zusammengeführte Panelidentität](#merged-panel-identity)
- [Installationsfehler](#installer-failure)
- [Installationsfehler: Autorisierung fehlgeschlagen](#installer-failure-authorization-failed)
- [Installationsfehler: Vorprüfung abgelehnt](#installer-failure-preflight-rejected)
- [Installationsfehler: Artefakt abgelehnt](#installer-failure-artifact-rejected)
- [Installationsfehler: Übertragung fehlgeschlagen](#installer-failure-transport-failed)
- [Installationsfehler: Installation fehlgeschlagen](#installer-failure-install-failed)
- [Installationsfehler: Start fehlgeschlagen](#installer-failure-launch-failed)
- [Installationsfehler: Zustandsprüfung fehlgeschlagen](#installer-failure-health-check-failed)
- [Installationsfehler: Änderung unklar](#installer-failure-ambiguous-mutation)
- [Installationsfehler: Prüfung erforderlich](#installer-failure-verification-required)
- [Installationsfehler: Update](#installer-failure-update)
- [Installationsfehler: Wiederholungsversuch angehalten](#installer-failure-retry-hold)
- [Paneladresse nicht erreichbar](#panel-address-unreachable)
- [Paneladresse ungeprüft](#panel-address-unverified)
- [Abweichende Panelidentität](#panel-identity-mismatch)
- [Gemeinsame Panelverknüpfung](#panel-link-shared)
- [Panelidentität bestätigen](#panel-identity-confirmation)
- [Installationsfehler: ADB-Autorisierung](#installer-failure-adb-authorization)
- [ADB-Update-Autorisierung](#adb-update-authorization)
- [Anderer Home Assistant](#another-home-assistant)

## Panel Assistant von &lt;panel&gt; entfernen

**Bedeutung:** Jemand hat auf der Geräteseite dieses Panels **Von diesem Panel entfernen** gedrückt. Die Schaltfläche entfernt nichts; die Reparatur bleibt verfügbar, bis die Entfernung abgeschlossen ist.

**Ursache:** Panel Assistant bittet dich um Bestätigung, bevor es den Startbildschirm und die Apps des Herstellers wiederherstellt, ha-paneld deinstalliert und das Panel aus Home Assistant löscht.

**So behebst du es:** Lies [was das Entfernen bewirkt und wie die Neuinstallation funktioniert](/de/manage/removal-risks/), bevor du zur Bestätigung einmal **OK** auswählst. Falls das ein Versehen war, schließe den Dialog, ohne abzusenden, und lass die Reparatur unbestätigt.

<a id="panel-app-too-old"></a>

## Panel-App zu alt

**Bedeutung:** Home Assistant kann das Panel über das aktuelle Verbindungsprotokoll weder sehen noch steuern.

**Ursache:** Die Panel-App meldet kein unterstütztes Verbindungsprotokoll, oder ihr Protokollbereich überschneidet sich nicht mit dem, den dieser Panel Assistant bereitstellen kann.

**So behebst du es:** Öffne die Updates in Home Assistant und installiere ein kompatibles App-Update für dieses Panel, falls eines angeboten wird. Warte auf die erneute Verbindung. Wird keines angeboten, verwende die Update-Wiederherstellungsanleitung; führe kein unüberlegtes Downgrade durch.

<a id="old-app-needs-090"></a>

## Alte App benötigt 0.9.0

**Bedeutung:** Panel Assistant 1.0 kann dieses Panel mit alter App weder installieren noch aktualisieren.

**Ursache:** Der Umzug von der alten ha-paneld-App wurde in 1.0 entfernt.

**So behebst du es:** Lade Panel Assistant 0.9.0 nicht erneut über eine laufende 1.0-Installation herunter: Eine von 1.0 entfernte Einstellung kann dazu führen, dass 0.9.0 bereits umgezogene Panels zu MQTT zurückführt. Nur wenn noch kein Panel die 1.0-App hat, stelle eine Home Assistant-Sicherung von vor dem Upgrade wieder her, schließe jeden Umzug in 0.9.0 ab und kehre dann zu 1.0 zurück. Hat bereits irgendein Panel die 1.0-App oder gibt es keine geeignete Sicherung, frage vor einem Versionswechsel nach Unterstützung. Siehe die [Wiederherstellungsanleitung zum 1.0-Upgrade](/de/manage/upgrade-to-1-0/).

<a id="mqtt-panel-needs-090"></a>

## MQTT-Panel benötigt 0.9.0

**Bedeutung:** Panel Assistant kann dieses noch nicht umgezogene MQTT-Panel nicht verbinden, ohne seine Entitäten und seinen Verlauf aufzuteilen.

**Ursache:** Panel Assistant 1.0 führt den MQTT-Umzug nicht mehr aus.

**So behebst du es:** Lade Panel Assistant 0.9.0 nicht erneut über eine laufende 1.0-Installation herunter: Eine von 1.0 entfernte Einstellung kann dazu führen, dass 0.9.0 bereits umgezogene Panels zu MQTT zurückführt. Nur wenn noch kein Panel die 1.0-App hat, stelle eine Home Assistant-Sicherung von vor dem Upgrade wieder her, schließe jeden Umzug in 0.9.0 ab und kehre dann zu 1.0 zurück. Hat bereits irgendein Panel die 1.0-App oder gibt es keine geeignete Sicherung, frage vor einem Versionswechsel nach Unterstützung. Siehe die [Wiederherstellungsanleitung zum 1.0-Upgrade](/de/manage/upgrade-to-1-0/).

<a id="panel-permissions"></a>

## Panelberechtigungen

**Bedeutung:** Einige Panelfunktionen können nicht arbeiten, weil Android ihre Berechtigungen nicht erteilt hat. Das Dashboard bleibt verfügbar.

**Ursache:** Eine ältere Installation oder geänderte Android-Berechtigung kann eine erforderliche Freigabe fehlen lassen. Die Kameraberechtigung ist relevant, solange die Kamera aktiviert ist; die Mikrofonberechtigung, solange Kamera oder Sprachassistent aktiviert sind. Ein unbekannter Funktionszustand hält die Warnung aufrecht, bis er geprüft werden kann.

**So behebst du es:** Öffne am physischen Panel die Android-Einstellungen → Apps → Panel Assistant. Erlaube Kamera, Mikrofon und Benachrichtigungen, soweit aufgeführt. Erlaube unter Spezieller App-Zugriff das Ändern von Systemeinstellungen und das Einblenden über anderen Apps; aktiviere anschließend Panel Assistant unter Bedienungshilfen. Ist die Navigation auf Durch Wischen einblenden oder Immer sichtbar eingestellt und fehlt die Überlagerungsberechtigung, wische vom unteren Dashboardrand nach oben, um die Berechtigung zum Einblenden über anderen Apps zu öffnen. Erlaube sie, kehre zurück und wische erneut. Kehre zur Reparatur zurück und wähle Absenden. Home Assistant muss jede relevante Freigabe erneut prüfen; ein fehlgeschlagener Lesezugriff oder ein App-Update allein kann die Reparatur nicht schließen.

<a id="panel-proximity-setup"></a>

## Näherungseinrichtung des Panels

**Bedeutung:** Aufwecken durch Winken ist nicht verfügbar, weil das Panel seine Näherungskalibrierung nicht gespeichert hat.

**Ursache:** Das Panel meldet calibration_required. Die Kalibrierung misst diese Installation und benötigt eine Person vor dem Panel; allein der Start der Einrichtung belegt keinen Abschluss.

**So behebst du es:** Öffne die Seite Konfiguration dieses Panels unter Anwesenheit & Aufwecken und wähle Näherung auf dem Panel einrichten. Folge den Anweisungen am physischen Panel, was ungefähr eine Minute dauert. Sobald es die gespeicherte Kalibrierung bestätigt, kehre zur Reparatur zurück und wähle Absenden. Home Assistant liest vor dem Abschluss den aktuellen Status; läuft die Einrichtung noch oder ist das Panel nicht lesbar, schließe sie ab oder stelle die Verbindung wieder her und sende erneut ab. Die Dashboard-Aktion Näherungssensor einrichten bietet ebenfalls einen Startpunkt auf dem Panel.

<a id="dashboard-unfiltered"></a>

## Dashboard ungefiltert

**Bedeutung:** Das Panel zeigt sein Dashboard mit allen Entitäten von Home Assistant statt nur den vom Dashboard verwendeten.

**Ursache:** Während das Panel lernt, welche Entitäten sein Dashboard verwendet, wartet es hinter einem Bildschirm, der den Wartegrund anzeigt. Dauert dies länger als 90 Sekunden, zeigt es das Dashboard ungefiltert, statt dich ohne Dashboard zu lassen. Häufige Ursachen sind eine unbeantwortete Abfrage an Home Assistant, eine abgelehnte Anmeldung, Dashboard-Regeln, die deine Entscheidung benötigen, und eine zum Filtern zu alte Browser-Engine. Das Panel versucht es hinter dem Dashboard weiter.

**So behebst du es:** Öffne dieses Panel in der Panel Assistant-Seitenleiste und dann Entitäten, um den Wartegrund zu sehen. Beantworte dort die Entscheidung zu markierten Regeln oder melde dich über Konfiguration erneut an, wenn Home Assistant die Anmeldung abgelehnt hat. Bietet Panel Assistant eine neuere Browser-Engine an, installiere sie. Das Panel kehrt selbstständig zum gefilterten Dashboard zurück, und die Reparatur verschwindet.

<a id="voice-microphone-silent"></a>

## Sprachmikrofon stumm

**Bedeutung:** Das Panel lauscht nicht auf ein Aktivierungswort, weil seine Mikrofonaufnahmeprüfung nur Stille aufgezeichnet hat.

**Ursache:** Die Prüfung fand nur Stille oder einen unveränderten Audio-Grundpegel.

**So behebst du es:** Öffne dieses Panel in der Panel Assistant-Seitenleiste und dann Konfiguration → Sprachassistent. Schalte ihn aus und wieder ein, um erneut zu prüfen. Schlägt die Prüfung weiter fehl, ändere die Audioquelle auf derselben Sprachassistent-Karte; ihr direkter Link macht die erweiterte Einstellung sichtbar. Eine erfolgreiche Prüfung löscht die Reparatur. Das Ausschalten des Sprachassistenten nimmt sie ebenfalls zurück, weil Zuhören nicht mehr angefordert wird.

<a id="voice-microphone-no-audio"></a>

## Sprachmikrofon ohne Audio

**Bedeutung:** Das Panel lauscht nicht auf ein Aktivierungswort, weil seine Mikrofonaufnahmeprüfung kein Audio erhalten hat.

**Ursache:** Die Android-Aufnahme lieferte kein Audio, ohne einen genaueren Fehler.

**So behebst du es:** Öffne dieses Panel in der Panel Assistant-Seitenleiste und dann Konfiguration → Sprachassistent. Schalte ihn aus und wieder ein, um erneut zu prüfen. Schlägt die Prüfung weiter fehl, ändere die Audioquelle auf derselben Sprachassistent-Karte; ihr direkter Link macht die erweiterte Einstellung sichtbar. Eine erfolgreiche Prüfung löscht die Reparatur. Das Ausschalten des Sprachassistenten nimmt sie ebenfalls zurück, weil Zuhören nicht mehr angefordert wird.

<a id="voice-microphone-no-audio-detail"></a>

## Sprachmikrofon ohne Audio: Details

**Bedeutung:** Das Panel lauscht nicht auf ein Aktivierungswort, weil seine Mikrofonaufnahmeprüfung kein Audio erhalten hat.

**Ursache:** Die Android-Aufnahme lieferte kein Audio; die vom Panel gemeldeten Details erklären den Aufnahmefehler.

**So behebst du es:** Öffne dieses Panel in der Panel Assistant-Seitenleiste und dann Konfiguration → Sprachassistent. Schalte ihn aus und wieder ein, um erneut zu prüfen. Schlägt die Prüfung weiter fehl, ändere die Audioquelle auf derselben Sprachassistent-Karte; ihr direkter Link macht die erweiterte Einstellung sichtbar. Eine erfolgreiche Prüfung löscht die Reparatur. Das Ausschalten des Sprachassistenten nimmt sie ebenfalls zurück, weil Zuhören nicht mehr angefordert wird.

<a id="wake-word-kept"></a>

## Aktivierungswort beibehalten

**Bedeutung:** Dieses Panel hat sein eigenes Modell unter der gemeinsamen Aktivierungswort-ID beibehalten und verwendet daher nicht das gemeinsame Modell.

**Ursache:** Das installierte Modell hat einen anderen SHA-256-Wert als das gemeinsame Modell und ist keine frühere gemeinsame Kopie. Panel Assistant bewahrt ein unabhängig importiertes Modell, statt es zu überschreiben.

**So behebst du es:** Öffne dieses Panel in Panel Assistant, Konfiguration, Aktivierungswörter. Möchtest du dort das gemeinsame Modell, importiere dessen zusammengehöriges .json-Manifest und .tflite-Modell auf diesem Panel. Behalte das aktuelle Modell, wenn es beabsichtigt war; die automatische Freigabe ersetzt es niemals. Der Import über die Seitenleiste macht das importierte Modell außerdem zur gemeinsamen Kopie; die Freigabe aktiviert keine Aktivierungswörter.

Der Import über die Seitenleiste ersetzt die gemeinsame Kopie und kann andere Panels aktualisieren. Siehe [eigene Aktivierungswörter](/de/manage/custom-wake-words/).

<a id="wake-word-refused"></a>

## Aktivierungswort abgelehnt

**Bedeutung:** Das gemeinsame Aktivierungswort wurde nicht auf diesem Panel installiert; seine anderen installierten Aktivierungswörter bleiben verfügbar.

**Ursache:** Das Panel hat das importierte Modell abgelehnt und einen Grund gemeldet. Ein Modell kann ein ungültiges Manifest haben, seine Grenzen überschreiten, die Prüfung der Aktivierungswort-Engine nicht bestehen oder nicht gespeichert werden. Ein von einem Panel angenommenes Modell kann ein anderes ablehnen.

**So behebst du es:** Öffne dieses Panel in Panel Assistant, Konfiguration, Aktivierungswörter. Korrigiere oder trainiere das microWakeWord-Modell anhand des gemeldeten Grunds neu und importiere dort sein zusammengehöriges .json-Manifest und seine .tflite-Datei. Der Import zeigt die Panelantwort und bewahrt bei Ablehnung das letzte funktionierende Modell. Die Freigabe aktiviert das Aktivierungswort nicht; wähle es aus, wenn das Panel darauf lauschen soll. Nicht unterstützte Befehle älterer Apps und Verbindungszeitüberschreitungen erzeugen Warnungen statt dieser Reparatur.

Der Import über die Seitenleiste ersetzt die gemeinsame Kopie und kann andere Panels aktualisieren. Siehe [eigene Aktivierungswörter](/de/manage/custom-wake-words/).

<a id="volume-number-removed"></a>

## Lautstärke-Zahlenentität entfernt

**Bedeutung:** Automationen oder Skripte verweisen noch auf eine separate Lautstärke-Zahlenentität, die von einem Panel entfernt wurde, das nun einen Mediaplayer hat. Diese Aktionen müssen aktualisiert werden.

**Ursache:** Der Panel-Mediaplayer verwaltet nun die Lautstärke. Panel Assistant entfernt nach dem Start von Home Assistant nur die frühere Lautstärke-Zahlenentität dieses Panels und nennt die noch darauf verweisenden Automationen und Skripte.

**So behebst du es:** Öffne Automationen oder Skripte und finde die in der Reparatur aufgeführten Einträge. Ersetze auf die entfernte Zahlenentität zielende number.set_value-Aktionen durch media_player.volume_set für den Mediaplayer des Panels; setze volume_level zwischen 0 und 1, beispielsweise 0.5 für 50 %. Aktualisiere andere Verweise ihrem Zweck entsprechend. Speichere, prüfe die Funktion der Automation oder des Skripts und ignoriere dann die Reparatur. Panel Assistant schreibt sie nicht automatisch um.

<a id="restart-required"></a>

## Neustart erforderlich

**Bedeutung:** Home Assistant führt noch die vorherige Panel Assistant-Version aus.

**Ursache:** Die installierte Integrationsversion oder der Build unterscheidet sich vom bereits in Home Assistant geladenen Code.

**So behebst du es:** Öffne die Reparatur, prüfe installierte und laufende Version und wähle dann Absenden, wenn du bereit bist, Home Assistant neu zu starten und die installierte Version zu laden.

<a id="panel-user-mismatch"></a>

## Abweichender Panelbenutzer

**Bedeutung:** Eine Anfrage für ein Panelkonto wartet auf deine Bestätigung.

**Ursache:** Ein angemeldeter Home Assistant-Benutzer hat angefragt, sich als dieses Panel zu verbinden. Die erste Bindung oder ein Wechsel vom gespeicherten Konto benötigt deine Zustimmung.

**So behebst du es:** Öffne die Reparatur und vergleiche das genannte Panel und den Benutzer mit dem absichtlich eingerichteten Konto. Wähle Absenden nur, wenn du die Anfrage erkennst. Hat das Panel bereits ein anderes Konto, beendet die Bestätigung des Wechsels die Annahme dieses Kontos. Bei einer unerwarteten Anfrage schließe den Dialog und ignoriere das Problem: Jeder angemeldete Benutzer kann eine Panelverbindung anfordern.

<a id="no-update-route"></a>

## Kein Update-Zugangsweg

**Bedeutung:** Panel Assistant kann keine App-Updates installieren; das Panel bleibt bei seiner aktuellen App-Version, während die anderen Funktionen weiterarbeiten.

**Ursache:** Das Panel bietet keinen nutzbaren Update-Zugangsweg mehr, etwa nach Firmwareänderungen oder einem Zurücksetzen.

**So behebst du es:** Folge der [Anleitung für ein Panel, das sich nicht aktualisieren lässt](/de/manage/updates-and-recovery/#ein-panel-das-sich-nicht-aktualisieren-lässt). Die Wiederherstellung hängt von Modell und Firmware ab: Stelle Debugging-Zugriff wieder her oder verbinde dich erneut über USB nur, wenn die Anleitung es verlangt. Die Reparatur verschwindet, sobald Home Assistant einen funktionierenden Update-Zugangsweg hat.

<a id="merged-panel-identity"></a>

## Zusammengeführte Panelidentität

**Bedeutung:** Mehrere Einträge beanspruchen dieselbe Identität und verhindern eine sichere native Zuordnung.

**Ursache:** Geklonte oder historisch gemeinsam verwendete Kennungen machen eine Sitzung mehrdeutig; die Integration weigert sich, ein Panel auszuwählen.

**So behebst du es:** Aktualisiere die App auf jedem betroffenen physischen Panel, sodass jedes seine eigene Identität meldet. Lösche dann das zusammengeführte Gerät in Home Assistant und lasse die Panels sich erneut registrieren. Prüfe durch frühere Versionen deaktivierte Entitäten; sie werden nicht automatisch wiederhergestellt.

<a id="installer-failure"></a>

## Installationsfehler

**Bedeutung:** Die Installation oder das Update wurde nicht abgeschlossen.

**Ursache:** Der Fehler passte zu keinem genaueren Reparaturgrund.

**So behebst du es:** Öffne den Supportbericht, um den Ablauf zu sehen, und verwende Erneut versuchen, nachdem die gemeldete Ursache behoben wurde.

<a id="installer-failure-authorization-failed"></a>

## Installationsfehler: Autorisierung fehlgeschlagen

**Bedeutung:** Die Installation konnte keine Verbindung zu Android auf dem Panel herstellen.

**Ursache:** Das Panel hat Home Assistants ADB-Verbindung nicht angenommen.

**So behebst du es:** Prüfe Debugging und Freigabeaufforderung des Panels anhand von Panel vorbereiten und verwende dann Erneut versuchen in der Reparatur.

<a id="installer-failure-preflight-rejected"></a>

## Installationsfehler: Vorprüfung abgelehnt

**Bedeutung:** Die angeforderte App wurde nicht installiert.

**Ursache:** Die Prüfungen des Installers haben das Panel vor der Installation abgelehnt.

**So behebst du es:** Öffne den Supportbericht, korrigiere die gemeldete Prüfung und verwende Erneut versuchen, wenn Panel und ausgewählte Veröffentlichung weiterhin übereinstimmen.

<a id="installer-failure-artifact-rejected"></a>

## Installationsfehler: Artefakt abgelehnt

**Bedeutung:** Die angeforderte App wurde nicht installiert.

**Ursache:** Die Veröffentlichung konnte nicht authentifiziert werden oder ihre lokalen Bereitstellungsprüfungen schlugen fehl, einschließlich eines unsicheren oder belegten Bereitstellungspfads.

**So behebst du es:** Öffne den Supportbericht, um die abgelehnte Veröffentlichung oder Bereitstellungsprüfung zu erkennen, und wiederhole den Versuch nach Behebung der Ursache über die Reparatur.

<a id="installer-failure-transport-failed"></a>

## Installationsfehler: Übertragung fehlgeschlagen

**Bedeutung:** Home Assistant konnte Übertragung oder Installation der App nicht abschließen.

**Ursache:** Ein Übertragungsvorgang schlug fehl; dies kann ein Verbindungsproblem oder eine abgelehnte Übertragungs- oder Installationsoperation sein.

**So behebst du es:** Stelle die Panelverbindung wieder her und verwende dann Erneut versuchen in der Reparatur, damit Panel Assistant vor dem Fortfahren den aktuellen Zustand prüft.

<a id="installer-failure-install-failed"></a>

## Installationsfehler: Installation fehlgeschlagen

**Bedeutung:** Android hat die angeforderte Installation abgelehnt.

**Ursache:** Die Paketinstallation auf dem Panel schlug fehl; der Supportbericht enthält das Ergebnis.

**So behebst du es:** Lies den Supportbericht und behebe den gemeldeten Android-Fehler; verwende dann Erneut versuchen in der Reparatur.

<a id="installer-failure-launch-failed"></a>

## Installationsfehler: Start fehlgeschlagen

**Bedeutung:** Die App ist installiert, wurde aber nicht gestartet.

**Ursache:** Der Installer konnte Panel Assistant nach der Installation nicht starten.

**So behebst du es:** Öffne Panel Assistant aus der App-Liste des Panels und verwende dann Erneut versuchen in der Reparatur, um den Versuch zu prüfen und abzuschließen. Lässt sie sich nicht öffnen, nutze den Supportbericht für Hilfe.

<a id="installer-failure-health-check-failed"></a>

## Installationsfehler: Zustandsprüfung fehlgeschlagen

**Bedeutung:** Die App wurde gestartet, ihr ordnungsgemäßer Zustand aber noch nicht bestätigt.

**Ursache:** Der Installer erhielt die erforderliche Bestätigung des ordnungsgemäßen Zustands nicht.

**So behebst du es:** Prüfe die App auf dem Panel und verwende dann Erneut versuchen in der Reparatur, um ihren Zustand zu prüfen. Bleibt sie fehlerhaft, nutze den Supportbericht für Hilfe.

<a id="installer-failure-ambiguous-mutation"></a>

## Installationsfehler: Änderung unklar

**Bedeutung:** Panel Assistant kann nicht feststellen, ob der fehlgeschlagene Versuch das Panel verändert hat.

**Ursache:** Das Installationsergebnis belegte den endgültigen Paketzustand des Panels nicht.

**So behebst du es:** Prüfe, was sich auf dem physischen Panel befindet, und öffne den Supportbericht der Reparatur. Verwende ihre abgesicherte Aktion Erneut versuchen erst nach Prüfung des gemeldeten Zustands; deinstalliere nicht, lösche keine App-Daten und setze das Panel nicht zurück, um die Meldung zu entfernen.

<a id="installer-failure-verification-required"></a>

## Installationsfehler: Prüfung erforderlich

**Bedeutung:** Eine weitere Installation wird zurückgehalten, bis das Panel geprüft werden kann.

**Ursache:** Der vorherige Versuch benötigt vor jeder weiteren Installation eine Prüfung.

**So behebst du es:** Prüfe Panel und Supportbericht und verwende dann Erneut versuchen in der Reparatur, um den aktuellen Zustand erneut zu prüfen. Deinstalliere nicht, lösche keine App-Daten und setze das Panel nicht zurück, um die Meldung zu entfernen.

<a id="installer-failure-update"></a>

## Installationsfehler: Update

**Bedeutung:** Home Assistant konnte den Abschluss des Updates nicht bestätigen. Die Panel-App kann bereits installiert sein, während das Update ihrer Browser-Engine noch nicht abgeschlossen ist.

**Ursache:** Das App-Update oder das Update der Browser-Engine schlug fehl oder ließ sich nicht prüfen. Die Reparatur bewahrt den Bericht für den gesamten Versuch.

**So behebst du es:** Lies den Supportbericht, stelle die gemeldete Verbindungs- oder Installationsvoraussetzung wieder her und wähle **Erneut versuchen**. Panel Assistant fährt mit der Browser-Engine-Stufe fort, ohne die App erneut zu installieren, wenn nur diese Stufe offen ist und die angeforderte App-Version nachweislich installiert ist. Wird **Updates erlauben** angeboten, bestätige damit zuerst Home Assistant auf dem Panel. Siehe die [WebView-Anleitung](/de/hardware/guides/update-the-webview/), wenn die Browser-Engine nicht aktualisiert werden kann.

<a id="installer-failure-retry-hold"></a>

## Installationsfehler: Wiederholungsversuch angehalten

**Bedeutung:** Der Wiederholungsversuch ist angehalten und wurde nicht zur Fortsetzung autorisiert.

**Ursache:** Eine Sicherheitsprüfung oder ein unerwarteter Wiederholungsfehler stoppte diesen Versuch. Der gespeicherte Bericht dokumentiert die Beobachtung; ein Anhalten erteilt keine Erlaubnis zur Neuinstallation.

**So behebst du es:** Lies den gemeldeten Wiederholungsfehler und Supportbericht, prüfe, ob das beabsichtigte Panel und die Veröffentlichung weiterhin übereinstimmen, und verwende nach Behebung der Ursache Erneut versuchen. Fehler löschen entfernt nur die Reparatur und ihren gespeicherten Bericht.

<a id="panel-address-unreachable"></a>

## Paneladresse nicht erreichbar

**Bedeutung:** Die Steuerung bleibt über die aktive Verbindung verfügbar, aber HTTP-Operationen haben keine verifizierte erreichbare Adresse.

**Ursache:** Die gespeicherte Adresse antwortet nicht mehr; die automatische Wiederherstellung hatte keinen nutzbaren Kandidaten oder konnte keinen prüfen.

**So behebst du es:** Stelle Netzwerk- und HTTP-Erreichbarkeit des Panels wieder her oder füge dasselbe Panel unter seiner aktuellen Adresse hinzu; umgehe die Identitätsprüfung nicht.

<a id="panel-address-unverified"></a>

## Paneladresse ungeprüft

**Bedeutung:** Die Steuerung bleibt über die aktive Verbindung verfügbar, aber HTTP-Operationen haben keine verifizierte erreichbare Adresse.

**Ursache:** Die gespeicherte Adresse antwortet nicht mehr; die automatische Wiederherstellung hatte keinen nutzbaren Kandidaten oder konnte keinen prüfen.

**So behebst du es:** Stelle Netzwerk- und HTTP-Erreichbarkeit des Panels wieder her oder füge dasselbe Panel unter seiner aktuellen Adresse hinzu; umgehe die Identitätsprüfung nicht.

<a id="panel-identity-mismatch"></a>

## Abweichende Panelidentität

**Bedeutung:** Panelstatus und Steuerung werden an einem Endpunkt mit anderer Identität verweigert.

**Ursache:** Eine Adresse antwortet nun als andere Installation oder gespeicherte Identitätsbelege lassen sich nicht sicher abgleichen.

**So behebst du es:** Prüfe physisches Panel und Adresse; füge das aktuell bekannte Panel nach einem Umzug erneut hinzu. Bestätige niemals eine andere Identität nur deshalb, weil sie die alte Adresse verwendet.

<a id="panel-link-shared"></a>

## Gemeinsame Panelverknüpfung

**Bedeutung:** Ein neu installiertes Panel kann nicht sicher einer vorhandenen Einrichtung zugeordnet werden.

**Ursache:** Mehrere Einträge haben dieselbe alte Geräteverknüpfung gespeichert; die Erreichbarkeit der Adresse selbst ist nicht das Problem.

**So behebst du es:** Behalte aktive andere Panels; entferne nur ungenutzte Einträge oder füge das neu installierte Panel separat hinzu.

<a id="panel-identity-confirmation"></a>

## Panelidentität bestätigen

**Bedeutung:** Vorhandene Paneleinrichtungen warten auf deine Bestätigung, nachdem die Panels neue Geräteidentitäten melden.

**Ursache:** Panel Assistant konnte nicht automatisch belegen, dass jede neue Identität zu ihrer vorherigen Einrichtung gehört.

**So behebst du es:** Prüfe jeden Panelnamen und jede Adresse in der Liste. Wähle Absenden nur, wenn jedes aufgeführte Panel zu seiner vorhandenen Einrichtung gehört. Das Öffnen des Dialogs ändert nichts.

<a id="installer-failure-adb-authorization"></a>

## Installationsfehler: ADB-Autorisierung

**Bedeutung:** Das fehlgeschlagene Update kann erst fortgesetzt werden, wenn dieses Panel Home Assistant erlaubt.

**Ursache:** Die ADB-Vertrauensfreigabe ist weiterhin erforderlich; der Bericht des fehlgeschlagenen Updates bleibt verfügbar.

**So behebst du es:** Wähle in der Reparatur Updates erlauben und Absenden, aktiviere dann auf dem genannten Panel Von diesem Computer immer zulassen und tippe auf Zulassen. Kehre zur Reparatur zurück und verwende Erneut versuchen für das fehlgeschlagene Update.

<a id="adb-update-authorization"></a>

## ADB-Update-Autorisierung

**Bedeutung:** Home Assistant kann dieses Panel erst über ADB aktualisieren, wenn das Panel dies erlaubt.

**Ursache:** Der Update-Zugangsweg benötigt eine ausdrückliche Vertrauensfreigabe auf dem Panel.

**So behebst du es:** Öffne die Reparatur und wähle Absenden, aktiviere dann auf dem genannten Panel Von diesem Computer immer zulassen und tippe auf Zulassen. Android kann Home Assistant als Computer bezeichnen; der Ablauf wird nach der Freigabe fortgesetzt.

<a id="another-home-assistant"></a>

## Anderer Home Assistant

**Bedeutung:** Das Hinzufügen des Panels hier ändert seinen gespeicherten Server oder sein Konto nicht.

**Ursache:** Die gespeicherte Home Assistant-Adresse des Panels bezeichnet einen anderen Server als diesen.

**So behebst du es:** Soll sich dieses Panel hier verbinden, folge dem Reparaturlink zu Konfiguration, gib diese Home Assistant-Adresse ein, speichere, verbinde dich erneut und melde dich mit dem gewünschten Panelkonto an. Gehört es zum anderen Server, behalte seine Einstellungen und ignoriere diese Reparatur. Kann die Seitenleiste es nicht erreichen, öffne Konfiguration direkt im Netzwerk des Panels.
