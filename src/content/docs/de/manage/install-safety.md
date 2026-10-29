---
title: Installationssicherheit
description: Die Prüfungen des eingestellten Befehlszeilen-Installers, seine Sicherungen vor Paneländerungen und wann er stoppte.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Diese Seite beschreibt die Prüfungen des eingestellten [Befehlszeilen-Installers](/de/manage/command-line-install/), der Panels vor ha-paneld v0.9.9 installierte. Heute installiert und aktualisiert Panel Assistant die Panels: Es prüft ein Panel vor jeder Änderung und sichert seine Einstellungen vor jedem Update, wie unter [Updates und Wiederherstellung](/de/manage/updates-and-recovery/) beschrieben.

## Vertrauens- und Zugangsdaten-Grenzen

Zugangsdaten-Dateien halten Geheimnisse aus dem Shell-Verlauf und den Befehlszeilen von Kindprozessen auf dem Computer des Installers heraus. Sie verschlüsseln die Verwaltungs-API des Panels nicht. Die API des Panels (zum Beispiel `http://<panel>:8888` beim Standardport) folgt dem Vertrauensmodell des Projekts für lokale Netzwerke. Broker-Zugangsdaten und Home Assistant-Tokens werden daher als unverschlüsseltes HTTP übertragen. Führe den Installer nur in einem vertrauenswürdigen, segmentierten Netzwerk aus. Die [Sicherheitsreferenz](/de/reference/security/) beschreibt das Modell.

Die Anmeldung mit Home Assistant-Benutzername und Passwort funktioniert anders. Das Passwort geht vom installierenden Computer an den Anmeldeendpunkt von Home Assistant und erreicht das Panel nie. Verwende eine Home Assistant-URL mit `https://`, damit die Anmeldung bei der Übertragung verschlüsselt ist. Eine `http://`-URL überträgt das Passwort unverschlüsselt. Das Panel erhält nur das daraus entstehende widerrufbare Refresh-Token.

Konfigurationsexporte enthalten Geheimnisse und werden mit Berechtigungen nur für den Eigentümer geschrieben. Behandle sie wie Zugangsdaten. Die automatischen Einstellungs- und Datenbankkopien vor einem Upgrade landen ebenfalls in einem nur dem Eigentümer zugänglichen Verzeichnis als Dateien mit Modus 600.

## Authentifizierung von Veröffentlichungen und Paketen

Der Installer ohne erforderlichen Checkout lädt die passende veröffentlichte App und den Provisioner herunter. Er authentifiziert die veröffentlichten App- und Helper-Binärdateien anhand von mit dem Release-Schlüssel signierten SHA-256-Einträgen, bevor er das Panel ändert. Außerdem prüft er Paket und Signierer der App mit den Android Build-Tools. Diese sind bei einer Erstinstallation ohne vorhandene Panel-App optional, da Android die Signatur bei der Installation selbst prüft. Bei einem Update einer vorhandenen App sind sie erforderlich: Der Installer vergleicht installierten und neuen Signierer vor jeder Änderung und lehnt ab, statt zu raten. Bei abweichenden Signierern würde sonst zunächst der laufende Helper außer Betrieb genommen und erst danach die Installation scheitern. Der Installer wählt den Helper passend zur vom Panel gemeldeten ABI.

Eine lokal gebaute App folgt einem separaten Entwicklerweg. Sie muss weiterhin das ha-paneld-Paket mit genau einem gültigen Signierer enthalten, darf aber den eigenen konsistenten Signierschlüssel des Erstellers verwenden. `--require-release-signer` verschärft diese Prüfung, wenn die lokale Datei ein offizieller Build sein soll. `--allow-unsigned-helper` ist eine separate Bestätigung für Helper-Binärdateien, die der lokale Ersteller kontrolliert, statt sie als veröffentlichte Dateien zu authentifizieren.

## Sicherungen und Wiederherstellung

Drei unterschiedliche Dateien dienen drei unterschiedlichen Wiederherstellungsaufgaben:

- Ein **JSON-Konfigurationsexport** enthält Einstellungen und Geheimnisse. `--export FILE` erstellt ihn ausdrücklich. Der Installer versucht außerdem vor einem gewöhnlichen Upgrade automatisch einen Export nur für den Eigentümer zu erstellen. Er enthält weder den Laufzeit-Profilkatalog noch die Profilauswahl, erlernte Entitätenzustände, Verläufe oder eine Home Assistant-Anmeldung einer separaten Dashboard-App.
- Eine **`.hpb`-Sicherung** aus **Installation**, dann **Sicherung** in der Weboberfläche des Panels ist die vollständigste unterstützte Sicherung. Sie enthält Einstellungen, dauerhaften Panelzustand, den Profilkatalog und eine geeignete Anmeldung einer separaten Dashboard-App. Der erlernte Entitätenkatalog sowie Nähe- und Umgebungslichtverläufe werden neu gelernt statt wiederhergestellt. Stelle eine `.hpb` auf derselben Seite über **Installation**, dann **Wiederherstellen** wieder her. `--restore FILE` des Installers akzeptiert Konfigurations-JSON, keine `.hpb`-Sicherungen.
- Eine automatische **`…break-glass.db`** ist eine Notfallkopie der internen Datenbank des Panels. Nichts stellt sie automatisch wieder her. Sie ist nur für dasselbe Panel und dieselbe App-Version gültig, aus der sie stammt.

Wenn `--export FILE` mit Installations- oder Konfigurationsoptionen kombiniert wird, wird der geprüfte Export vor jeder Änderung am Panel geschrieben. Kann er nicht erstellt und geprüft werden, stoppt der Lauf. Führe zuerst `--export FILE` als separaten Befehl aus, wenn du ohne Installation exportieren möchtest.

Der automatische Einstellungsexport vor einem gewöhnlichen Upgrade erfolgt nach Möglichkeit. Kann er nicht erstellt werden, entfernt der Installer die unvollständige Datei, hält fest, dass kein Einstellungsexport existiert, und fährt mit dem Ersetzen der App fort.

Erstelle vor einer Deinstallation, dem Löschen von App-Daten oder jeder anderen zerstörerischen Wiederherstellung separat über **Installation**, dann **Sicherung** eine Sicherung und prüfe, dass die heruntergeladene `.hpb` nicht leer ist. Diese Vorgänge zerstören die App-Daten. Ein gewöhnliches `adb install -r` erhält sie.

`--reset-config` funktioniert bewusst anders. **Das Zurücksetzen ist unumkehrbar und erstellt keine Sicherung.** Es verlangt eine eigene Bestätigung und entfernt anschließend alle Daten der Panel-App. Die App, der Helper und andere Android-Apps bleiben installiert.

## Automatischer Datenbank-Snapshot

Vor jedem gewöhnlichen Upgrade versucht der Installer, die Datenbank des Panels zu erfassen. Sie enthält Konfiguration, Entitätenkatalog, Nähe- und Umgebungslichtverläufe sowie den auf dem Panel gespeicherten Versionsverlauf. Der Snapshot hilft bei einer späteren Deinstallation oder anderen zerstörerischen Reparatur. Androids normales Ersetzen einer App an Ort und Stelle lässt die ursprüngliche Datenbank unverändert liegen.

Der Installer sendet der laufenden App genau eine Upgrade-Vorbereitungsanfrage, ausschließlich über ADB. Die App nimmt keine neuen Arbeiten mehr an, schließt ausstehende Schreibvorgänge ab, pausiert Datenbankschreiber, schreibt ihren Zustand, führt einen Checkpoint des SQLite-Write-ahead-Logs durch und schließt die Datenbank. Sie bestätigt genau diese Anfrage erst, nachdem sie alten Prozess, App-Version, Byteanzahl, einen am Computer prüfbaren SHA-256-Wert, Schemaversion und Anzahl der Zustandszeilen aufgezeichnet hat.

Der Installer kopiert die geschlossene Datenbank direkt aus dem privaten App-Speicher, ohne eine zweite Kopie auf dem Panel zwischenzuspeichern. Die Kopie auf dem Computer wird nur akzeptiert, wenn Größe und stets geprüfter SHA-256-Wert zur Bestätigung passen und die lokalen SQLite-Prüfungen von Integrität, Schema und Zeilen bestehen.

Liefert die App nicht die genaue Bestätigung, etwa wegen Zeitüberschreitung oder einer fehlerhaften Antwort, fällt der Installer einmal auf die SQLite-Live-Funktion `.backup` zurück. Diese erzeugt dieselbe einzelne, eigenständige Datenbank ohne danebenliegende Write-ahead-Log- oder Journaldateien. Ein Panel ohne Root-Zugriffsweg kann seine private Datenbank nicht bereitstellen. Dann ist möglicherweise nur der Einstellungsexport verfügbar.

Bei einem gewöhnlichen Upgrade an Ort und Stelle erfolgt die Datenbanksicherung nach Möglichkeit. Eine fehlgeschlagene oder inkonsistente Kopie wird entfernt, der Installer gibt eine deutliche Warnung aus, und das Ersetzen der App darf mit unberührten ursprünglichen App-Daten fortfahren. Eine ungültige Kopie wird niemals behalten oder als erfolgreiche Sicherung bezeichnet.

Es gibt keine feste Freispeichergrenze für diese Sicherung. Der normale Weg speichert nichts auf dem Panel zwischen. Beim einzigen Rückfallweg zeigt die tatsächliche Erfassung, ob genügend Platz vorhanden ist. Speicherknappheit, eine fehlgeschlagene Datenbank-Zustandsprüfung, ein unerreichbarer Statusendpunkt, eine fehlerhafte Antwort oder ein unbekannter Zustand werden vor und nach der Installation gemeldet. Keines davon blockiert das gewöhnliche Ersetzen der App, denn der neue Build kann der einzige sinnvolle Wiederherstellungsversuch für einen fehlerhaften oder unerreichbaren alten Build sein. Ein eigenständiges `--verify` meldet solche Zustände als Fehler, wenn du ein striktes Bestehen oder Scheitern benötigst.

## Zeitzonen- und Erstinstallationsprüfungen

Vor einer Paneländerung vergleicht der Installer die Zeitzone des Panels mit der des Computers. Eine Abweichung ist eine Warnung, kein Abbruchgrund, denn ein Panel darf eine andere Zeitzone verwenden. Der Vergleich verwendet Zonennamen statt des aktuellen UTC-Versatzes und löst bekannte Aliasse über die Zeitzonendatenbank des Computers auf. So erkennt er Panels, die noch auf einer Werkszeitzone stehen und sonst Protokolle und Zeitpläne zur falschen Ortszeit ausführen würden.

Kann einer der Werte nicht ermittelt werden, bleibt die Prüfung still. Eine fehlende Antwort, ein ungültiger Zonenname oder ein der Computerdatenbank unbekannter Alias lässt die Installation weder scheitern noch verändert er sie.

Ein sauberes Panel hat keinen Statusendpunkt für die Panel-App. Das gilt auch für manche beschädigten Installationen. Der Installer fragt Androids Paketmanager, ob ha-paneld installiert ist, bevor er zwischen beiden Fällen entscheidet. Ein eindeutiges „nicht installiert“ startet eine normale Erstinstallation. Antwortet die Paketmanager- oder ADB-Abfrage nicht, stoppt der Lauf vor jeder Paneländerung.

## Root-Helper-Upgrades

Veröffentlichungen enthalten versiegelte Helper-Binärdateien für `armeabi-v7a` und `arm64-v8a`. Auf einem Panel mit Hersteller-`su` oder Root-ADB authentifiziert der Installer die gewählte Binärdatei mit dem Release-Schlüssel, prüft sie nach dem Zwischenspeichern erneut und installiert oder aktualisiert sie atomar. Er prüft die Protokollfähigkeiten und die von der App benötigte reproduzierbare Build-Identität, bevor er die App ersetzt.

Der bisherige, Root gehörende Helper und sein Dienst bleiben verfügbar, bis die App-Installation erfolgreich ist. Scheitern Installation oder Start des Helpers oder stimmen Identität oder Fähigkeiten nicht, wird das bisherige funktionierende Paar wiederhergestellt, bevor die App ersetzt wird. Bricht die ADB-Verbindung während Androids App-Installation ab, behält der Installer sein Wiederherstellungsjournal. Derselbe Befehl authentifiziert beim erneuten Ausführen installierte App und laufenden Helper und schließt das unterbrochene Upgrade ab oder setzt es zurück.

Wiederherstellungs-Snapshots gehören Root, werden über ihre aufgezeichnete Prüfsumme authentifiziert und in den Speicher synchronisiert, bevor die aktiven Dateien außer Betrieb genommen werden. Der Installer verweigert den Start bei einer unvollständigen Helper-Transaktion und nennt den erneut auszuführenden Befehl.

Der Installer bevorzugt einen Init-Dienst auf einem beschreibbaren `/system`, wenn er ausreichend Platz nachweisen kann. Ist `/system` schreibgeschützt, nutzt er einen geprüften Magisk-, KernelSU- oder APatch-Runner unter `/data/adb/service.d`. Auf einem Panel mit beschreibbarem, aber vollem `/system` können Helper und Wiederherstellungsdateien unter `/data/adb/hapaneld` liegen und nur der Startdienst unter `/vendor/etc/init`. Spätere Updates behalten diese geprüfte Anordnung bei. Der Installer stoppt vor dem Ersetzen der App, wenn er Speicherkapazität, Zuständigkeit für den Start oder den Zustand einer vorhandenen Transaktion nicht feststellen kann.

Die App enthält den passenden Helper als Rückfalloption. Wenn ein Panel mit direkter `su`-Installation über den Tab „Installation“ oder die Home Assistant-Update-Entität aktualisiert wird, bevor es erneut den Installer durchlaufen hat, prüft der erste App-Start das benötigte Helper-Protokoll und kann eine Root gehörende Kopie aus `/data/local` starten. Ein gerootetes Panel mit Root-Sandbox kann einen alten Helper nicht sicher sich selbst ersetzen lassen. Es verweigert den Vorgang daher sicher und fordert die Ausführung des authentifizierten Installers von einem Computer aus.

## Was einen Lauf stoppen kann

Der Installer stoppt mit einem Ergebnis ungleich null, wenn er eine Voraussetzung des angeforderten Vorgangs nicht sicher feststellen kann. Beispiele sind eine unbeantwortete Paketabfrage, eine App mit falschem Paket oder Signierer, eine nicht wiederherstellbare Helper-Transaktion, ein nicht prüfbarer angeforderter Konfigurationsexport oder eine erforderliche fehlgeschlagene Selbstprüfung nach der Installation.

Andere Befunde sind Warnungen, weil ein Abbruch die Wiederherstellung erschweren würde. Eine nicht verfügbare automatische Datenbanksicherung, eine Speicherzustandswarnung oder ein fehlgeschlagener Statusaufruf vor dem Upgrade verhindert für sich genommen kein gewöhnliches Ersetzen der App an Ort und Stelle. Der Installer benennt diese Grenze klar, statt eine unvollständige oder ungültige Wiederherstellungsdatei als Erfolg darzustellen.

### Eine Ablehnung verstehen

Jede Ablehnung nennt eine Bedingung und ändert nichts am Panel, sofern sie nicht ausdrücklich etwas anderes sagt. Die Formulierung weist auf das zu reparierende Problem hin. Das ist wichtig, weil sich die Abhilfen stark unterscheiden.

- **Die kanonische Datenbank änderte sich während des Lesens weiter.** Die App schrieb noch in ihre Datenbank, während der Installer eine konsistente Kopie erstellen wollte. Das Panel ist beschäftigt, nicht beschädigt. Die Kopie wird automatisch erneut versucht. Diese Meldung bedeutet daher, dass die App bei jedem Versuch weitergeschrieben hat. Meist genügt es, den Installer bei ruhigerem Panel erneut auszuführen.
- **Die kanonische Datenbank konnte nicht gelesen werden** oder **ist keine reguläre Datei.** Das ist der entgegengesetzte Fall und betrifft die gespeicherten Daten statt die App: Die Datei fehlt, ist keine Datei oder lässt sich gar nicht öffnen. Stelle die Datenbank vor einem erneuten Versuch wieder her.
- **Die kanonische Datenbank fehlt bei installierter App.** Die App ist vorhanden, ihr Speicher jedoch nicht. Ein gewöhnliches Upgrade kann das nicht lösen. Stelle eine Sicherung wieder her, statt es erneut zu versuchen.
- **Das Installationsziel ist schreibgeschützt.** Das Installationsverzeichnis des privilegierten Helpers liegt auf einem schreibgeschützt eingehängten Dateisystem. Auf den meisten Panels benötigt das erneute beschreibbare Einhängen keinen Neustart. Der Installer nennt das gemessene Dateisystem. Prüfe diese Zeile, bevor du annimmst, welche Partition gemeint ist.
- **Das Installationsziel hat keinen Platz oder keine freien Inodes.** Beide Meldungen nennen die Messwerte. Die Fälle werden unterschieden, weil ein Panel von einem nichts mehr und vom anderen noch reichlich haben kann.
- **Ein unvollständiges früheres Upgrade konnte nicht abgeglichen werden.** Ein früherer Lauf hinterließ einen Wiederherstellungseintrag, den der Installer nicht mit der aktuellen Installation abgleichen kann. Nichts wird geändert. Der Eintrag muss untersucht werden, statt erneut zu versuchen, denn ein erneuter Versuch kommt zum selben Ergebnis.
- **Die App ist einige Zeit nach der Bereitstellung des Nachfolgers noch installiert.** Die neue App wurde installiert, aber die alte innerhalb der Wartezeit des Installers nicht entfernt. Das Panel funktioniert; nur die Entfernung wurde nicht abgeschlossen.

Eine Ablehnung mit Rücksetzung nennt, ob diese geprüft wurde. „Zurückgesetzt und geprüft“ bedeutet, dass das Panel im Zustand vor dem Lauf ist. „Rücksetzung konnte nicht geprüft werden“ bedeutet, dass der privilegierte Helper geprüft werden sollte, bevor du dich auf privilegierte Vorgänge verlässt, auch wenn die App selbst nicht ersetzt wurde.
