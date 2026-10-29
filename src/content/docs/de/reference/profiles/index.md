---
title: Laufzeitprofile für Panels
description: Wie Panel-Profile ein Android-Wandpanelmodell beschreiben und wie du sie über die Weboberfläche des Panels schreibst, testest und aktivierst.
sidebar:
  label: Übersicht
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel-Profile beschreiben die Besonderheiten eines Android-Wandpanelmodells: wie ha-paneld es erkennt, welche kompilierten Hardwaretreiber es nutzen darf, bekannte Display- und Sensoreigenschaften und firmwareabhängige Varianten. Profile sind menschenlesbare YAML-Dateien. Sie lassen sich in einer laufenden ha-paneld-Installation prüfen, exportieren, bearbeiten, importieren und aktivieren, ohne die Android-App neu zu bauen.

Diese Seite ist die praktische Anleitung zum Erstellen. Die [Format- und Kompatibilitätsreferenz](/de/reference/profiles/format/) beschreibt das Dokumentmodell. Lies vor dem Aktivieren von Hardwaresteuerungen [Tests und Fehlerbehebung](/de/reference/profiles/testing/) und vor dem Veröffentlichen eines Profils die [Anleitung zum Teilen und Beitragen](/de/reference/profiles/sharing/). Außerdem gibt es einen klar getrennten Katalog von [Community-Profilen](/de/reference/profiles/community/); diese Dateien werden manuell importiert und sind keine mitgelieferte Unterstützung.

Die mit der App ausgelieferten Profile liegen im ha-paneld-Repository unter [`app/src/main/assets/device-profiles`](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles).

![Die Profilseite des Panels zeigt das YAML einer mitgelieferten Revision im Editor, mit Prüfhinweisen zu Empfehlungen für Paketdeaktivierung, Root-Pfaden und WebView-Artefaktmetadaten sowie darunter den beobachteten Gerätedaten](/screenshots/ui-profile-dark.png)

## Was ein Profil tun kann

Ein Profil kann aus bereits von ha-paneld bereitgestellten Treibern und Transformationen auswählen und deren typisierte Parameter liefern. Es kann Hardwaredaten, Zuordnungsregeln, Firmwarevarianten, Displayempfehlungen, mögliche Funktionen und die auf dem Panel möglicherweise nützliche Android-Berechtigungsstufe beschreiben.

Ein Profil kann keinen ausführbaren Code, keine Shell-Befehle, Helper-Daemon-Verben, Kernel-ioctls, nativen Bibliotheken oder neuen Hardwareprotokolle hinzufügen. Benötigt ein Panel einen Mechanismus, den Profileditor oder Formatreferenz nicht aufführen, muss dieser zuerst in ha-paneld selbst implementiert und geprüft werden. Diese Grenze hält ausgetauschte YAML-Dateien prüfbar und verhindert, dass ein Profil zu einem beliebigen Root-Skript wird.

Profile erteilen auch keine Berechtigungen. Ein privilegierter Treiber bleibt nicht verfügbar, solange sein erforderlicher tatsächlicher Zugangsweg nicht erfolgreich ist. Siehe [Berechtigungen: Standard-Android und privilegierte Wege](#berechtigungen-standard-android-und-privilegierte-wege).

## Schnellstart ohne Entwicklungsumgebung

Du brauchst nur eine profilfähige ha-paneld-Installation und einen Webbrowser. Die Profilseite enthält einen YAML-Editor mit Validierungsrückmeldungen; der Export in einen separaten Texteditor ist optional. Android Studio, Gradle, das Android SDK oder ein Repository-Checkout sind nicht erforderlich.

1. Öffne die Geräteseite des Panels in Home Assistant, wähle **Besuchen** und öffne dann **Profile**. Verwende bei einer direkten Verbindung den vom Panel gemeldeten HTTP-Port (`http://<panel-ip>:8888/profiles` beim Standardport).
2. Wenn ha-paneld das Panel bereits erkennt, exportiere die genaue aktive Profilrevision und nutze sie als Referenz. Mitgelieferte Profile sind unveränderlich; die erste Bearbeitung erstellt deshalb eine eigenständige lokale Abspaltung, statt die mit der App ausgelieferte Kopie zu verändern.
3. Wenn das Panel **Generic** verwendet, lade seinen passiven Geräteentwurf herunter. Der Entwurf enthält den Fingerabdruck des Panels und ausdrücklich unbekannte/TODO-Werte; er errät keine privilegierte Hardware und führt keine aktive Prüfung aus.
4. Gib dem Profil eine stabile kleingeschriebene ID und eine Version, vervollständige Herkunfts- und Kompatibilitätsmetadaten und beginne mit exakten Zuordnungsregeln. Nutze das [Beispiel unten](#beispiele) und die [Formatreferenz](/de/reference/profiles/format/).
5. Importiere das YAML auf der Profilseite. Import und Validierung dienen nur der Vorschau: Sie speichern oder aktivieren nichts.
6. Lies jede Validierungsmeldung und vergleiche den Kandidaten mit dem aktiven Profil. Achte besonders auf Fingerabdruckübereinstimmung, Treiber, Hardwarepfade, neue oder entfernte Home Assistant-Entitäten und Berechtigungsanforderungen.
7. Speichere den validierten Kandidaten. Das Speichern erstellt eine unveränderliche, inaktive lokale Revision. Es verändert das laufende Panel weiterhin nicht.
8. Teste schrittweise anhand der [Testcheckliste](/de/reference/profiles/testing/). Aktiviere nur, während jemand das Panel sehen und berühren kann, wenn das Profil Bildschirm, Eingaben, LED, Relais, Pakete oder anderes privilegiertes Verhalten ändert.
9. Die Aktivierung erfordert eine ausdrückliche Bestätigung, die an die genaue Profil-ID, Revision und den Inhaltshash gebunden ist. ha-paneld startet seinen Dienst neu, damit alle Steuerungen dasselbe aufgelöste Profil erhalten.
10. Bestätige nach dem Neustart, dass die Profilseite die erwartete Revision als **aktiv** meldet, prüfe Funktionen und Home Assistant-Entitäten und teste das Zurückrollen. Schlägt die Startvalidierung fehl, kehrt ha-paneld zur **letzten funktionierenden** Revision zurück und meldet den fehlgeschlagenen Kandidaten als **automatisch zurückgerollt**.

Bewahre das exportierte YAML als austauschbare Quelle auf. Ein Bildschirmfoto einer grünen Profilseite ist ein nützlicher Nachweis, ersetzt aber weder die Datei noch ihre Herkunft oder die schrittweisen Hardwareergebnisse.

## Beispiele

Das Beispiel [`minimal-community.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml) verwendet das von der Profilseite akzeptierte öffentliche Schema. Es ist Lehrmaterial und keine Aussage darüber, dass die fiktive Hardware existiert. Es ist ein vorsichtiger Ausgangspunkt mit Standard-Android und aktiviert weder Herstellerprotokolle noch Root-/Helper-Pfade, Relais, evdev-Eingaben, Update-Artefakte, Paketsollzustände oder Bereitstellungsrezepte.

Importiere das Beispiel über **Profile**, prüfe die Validierungsvorschau und speichere es nur als inaktive lokale Revision. Ändere ID, Herkunft, genauen Fingerabdruck, getestete Firmware und Einschränkungen, bevor du es als Grundlage für ein echtes Panel nutzt. Eine importierte Übereinstimmung ist nur ein Vorschaunachweis; lokale und Community-Profile werden niemals automatisch ausgewählt.

Exportiere für vollständige Produktionsbeispiele eines der unveränderlichen mitgelieferten Profile aus einem laufenden Panel oder lies die [mitgelieferten YAML-Dateien](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles). Diese Profile nutzen dasselbe Schema, können aber privilegierte kompilierte Treiber und vom Kern verwaltete Artefakte auswählen, die ohne Hardwarenachweise nicht kopiert werden sollten.

## Der Profillebenszyklus

ha-paneld behandelt Profilinhalte als unveränderliche Revisionen statt als direkt bearbeitbares Einstellungsobjekt. Das macht Vergleiche reproduzierbar und verhindert, dass ein veränderter Upload unter einer früheren Vorschau aktiviert wird.

- **Mitgeliefert**: Mit ha-paneld ausgeliefert und unveränderlich. Ein mitgeliefertes Profil kann exportiert oder abgespalten werden.
- **Lokale inaktive Revision**: Auf diesem Panel importiert oder erstellt, validiert und gespeichert, aber nicht von laufenden Steuerungen verwendet.
- **Ausstehend**: Die genaue Revision wurde zur Aktivierung angenommen und der Dienst startet neu.
- **Aktiv**: Die Revision, mit der die aktuellen Sensoren, Hardwaresteuerungen, das Funktionsmodell der Oberfläche und die Home Assistant-Erkennung aufgebaut wurden.
- **Letzte funktionierende Revision**: Die vorherige bewährte Auswahl, die nach erfolgreichem Start einer neuen Revision für Wiederherstellung und manuelles Zurückrollen aufbewahrt wird.
- **Automatisch zurückgerollt**: Ein Kandidat, dessen Aktivierung fehlschlug und der automatisch durch die letzte funktionierende Revision ersetzt wurde.

Speichern, Aktivieren und Löschen verwenden Revisionshashes und Generationsprüfungen. Hat ein anderer Browser oder Administrator den Katalog nach dem Öffnen einer Seite geändert, wird die veraltete Aktion verweigert. Lade neu, vergleiche erneut und handle anhand des neuen Zustands.

Das Löschen einer inaktiven lokalen Revision ändert das aktive Panel nicht. Eine aktive oder letzte funktionierende Revision darf erst entfernt werden, wenn ein anderer gültiger Wiederherstellungsweg existiert.

**Automatik verwenden** führt ein festgelegtes Panel beim nächsten kontrollierten Neustart zur Fingerabdruckzuordnung mitgelieferter Profile zurück. Importierte und Community-Revisionen nehmen nie an dieser automatischen Auswahl teil; sie bleiben nur für die ausdrückliche festgelegte Aktivierung verfügbar.

## Mit Generic beginnen

`Generic` ist der vorsichtige Fallback für ein unbekanntes Panel. Er verwendet normale Android-Funktionsprüfungen und sichere Laufzeitprüfungen, erfindet aber bewusst keine Herstellerhardware, evdev-Tasten, Relais, Funkmodule, Klimachips, Update-Artefakte oder Paketaktionen.

Damit ist Generic der richtige Ausgangspunkt für Community-Profile:

1. Lade den **Geräteentwurf** von der Profilseite herunter. Er erfasst das genaue Build-Modell, das Build-Gerät und die ha-paneld verfügbaren Produktversionsnachweise sowie den neuesten begrenzten und bereinigten passiven Bericht.
2. Bereinige und prüfe ihn vor dem Teilen. Der erzeugte Bericht ist für Support gedacht, aber der Autor bleibt dafür verantwortlich, Panelnamen, Adressen, Home Assistant-Details, Zugangsdaten und Dashboard-Inhalte zu entfernen.
3. Ergänze zuerst Identität und Herkunft. Nutze eine stabile kleingeschriebene ID mit Autoren-/Organisationspräfix, etwa `org.example.wallpanel-x1`, sowie eine anfängliche Profilversion, Angaben zu Autor/Quelle/Lizenz, einen Reifegrad, den getesteten Firmwarebereich und bekannte Einschränkungen.
4. Ergänze enge, exakte Fingerabdruckregeln. Ein Herstellermodell oder Produktversionspräfix ist meist sicherer als ein breiter SoC-Alias wie `px30`, `rk3326`, `rk3566` oder `rk3576`, den auch andere Panels verwenden können.
5. Lass unbekannte Funktionsabschnitte weg oder kennzeichne sie ausdrücklich als unbekannt. Ein Dateiname, Verkaufsangebot oder in die Firmware einkompilierter Kerneltreiber beweist weder vorhandene Hardware noch deren Erreichbarkeit aus einer Android-App.
6. Ergänze jeweils eine durch Nachweise belegte Funktion, validiere, vergleiche und teste sie, bevor du fortfährst.

Der Entwurf ist absichtlich rein lesend und passiv. Mache aus erkundenden Shell-Befehlen oder einmaligen Root-Experimenten keine Profilfelder. Wenn eine neue aktive Prüfung oder ein Treiber tatsächlich erforderlich ist, schlage sie als begrenzte ha-paneld-Implementierung mit eigener Validierung und eigenen Tests vor.

## Ein Panel sicher zuordnen

Die Zuordnung ist eine Sicherheitsentscheidung, nicht nur eine Komfortfunktion. Eine falsche Zuordnung kann einen ungeeigneten Treiber auswählen oder Funktionen beanspruchen, die zu einem anderen Produkt mit derselben Referenzplatine gehören.

Bevorzuge genaue Produktidentität in dieser Reihenfolge:

1. ein für das Produkt eindeutiges Herstellermodell oder einen Geräte-Codenamen;
2. ein exaktes Produktversionsformat oder einen eng verankerten Präfix;
3. eine Kombination unabhängiger Build-Felder;
4. einen breiten SoC-/Referenzplattform-Alias nur als bewussten Kompatibilitätsfallback.

Weise jeder exakten Gruppe eine höhere Zweigpriorität als ihrem breiten Fallback zu. ha-paneld vergleicht zuerst die Priorität der passenden Gruppe und dann die Profilpriorität; ein exakter Gleichstand mitgelieferter Profile führt sicher zu Generic. Prioritäten bilden eine bewusste Zweigreihenfolge ab, ersetzen aber keinen engen Fingerabdruck.

Community- und importierte Revisionen nehmen nie an der automatischen Auswahl teil, selbst bei exakter Übereinstimmung. Die Zuordnung ist ein Vorschaunachweis, der dem Administrator hilft zu entscheiden, ob die Datei dieses Panel beschreibt. Eine lokale Revision kann die mitgelieferte Erkennung nur durch ausdrückliche Aktivierung übersteuern; danach legt das Panel seine genaue Profil-ID, Revision und den Hash fest. Ein späterer Import kann das laufende Ergebnis daher nicht stillschweigend verändern.

Nutze ein benanntes, vom Kern verwaltetes Strategiefeld für einen unterstützten Unterschied innerhalb einer Hardwarefamilie, etwa eine Produktbezeichnung oder Dichteregel. Das Format enthält keine allgemeine Ausdruckssprache oder beliebige Variantenpatches. Näherungsskalierung, Polarität und binäres Verhalten gegenüber Entfernungsmesswerten sind bewusst keine Profilstrategien: Die Laufzeit lernt sie aus tatsächlichen Nachweisen. Nutze getrennte Profile, wenn die verfügbaren benannten Strategien einen echten Unterschied bei Erfassung, Treiber, Berechtigungsgrenze oder Wiederherstellung nicht beschreiben können.

## Berechtigungen: Standard-Android und privilegierte Wege

Profile beschreiben mögliche Mechanismen; tatsächliche Prüfungen entscheiden, ob das laufende Panel sie nutzen kann.

### Standard-Android

Beginne hier. Dashboard-Darstellung, Panel Assistant-Kopplung und normale Android-Sensoren, Helligkeit, Audio, Navigation und die lokale Weboberfläche benötigen kein Root. Ein neues Profil sollte seine Identität und sein Standard-Android-Verhalten belegen, bevor es einen privilegierten Treiber ergänzt.

### Hersteller-Root oder der ha-paneld-Helper

Ein kompilierter Treiber kann einen funktionierenden Hersteller-`su`-Weg oder den separat installierten Root-Helper von ha-paneld erfordern. Die Deklaration dieser Anforderung schafft den Weg nicht, installiert den Helper nicht und erweitert seine Positivliste nicht. Der Helper akzeptiert nur kompilierte, begrenzte Befehle und authentifiziert seine Gegenstelle; ein Profil liefert validierte Parameter für diese Befehle, niemals Befehlstext.

Empfiehl nicht, ein ohne Root geliefertes Gerät nur für ein Profil zu rooten. Dokumentiere den eingeschränkten Funktionsumfang ehrlich. Die Hardwareseite erklärt [Root-Zugriff](/de/hardware/guides/root-access/).

## Ein installiertes Profil aktualisieren

Profilinhaltsversionen und Dokumentschemaversionen lösen unterschiedliche Probleme. Erhöhe die Profilversion, wenn sich Hardwarewissen oder Verhalten ändern. Die Schemaversion ändert sich nur, wenn ha-paneld die Dokumentsprache ändert.

Vergleiche ein Update vor dem Speichern mit der aktiven Revision und lies den Kompatibilitätsbericht. Auch ein ha-paneld-Update validiert installierte Profile vor der Nutzung erneut. Eine Datei, die einen neueren Kern, einen nicht verfügbaren Treiber oder ein nicht unterstütztes zukünftiges Schema benötigt, bleibt installiert, kann aber nicht aktiv werden; das aktuelle letzte funktionierende Profil läuft weiter.

Behandle Änderungen an Zuordnung, privilegierten Treibern, Pfaden, Firmwarevarianten, Paketsollzuständen, Rezeptauswahl oder vom Kern verwalteten Update-Artefakten als verhaltensrelevant, selbst bei kleinem YAML-Diff. Wiederhole die betreffenden Teststufen und erhöhe die Profilversion.

## Nächste Schritte

- [Profilformat und Kompatibilität](/de/reference/profiles/format/)
- [Tests und Fehlerbehebung](/de/reference/profiles/testing/)
- [Profile teilen und beitragen](/de/reference/profiles/sharing/)
- [Geräteprofilarchitektur](/de/reference/profiles/architecture/)
- [Sicherheitslage](/de/reference/security/)
- [Panel-Hardware](/de/hardware/)
