---
title: Profilformat und Kompatibilität
description: Kommentierter Überblick über Schema-2-Panelprofile mit den Validierungs-, Abgleich- und Kompatibilitätsregeln der Panel-App.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panelprofile zur Laufzeit sind YAML-Dokumente mit einem geschlossenen, versionierten Schema. Eine maschinenlesbare Bearbeitungsbeschreibung und ein Treiberkatalog sind auf der Profilseite eines profilfähigen Panels verfügbar; diese Seite ist ein kommentierter Überblick. Verwende für sämtliche Felder und Treiberbegriffe deines installierten Builds die Profilseite. Sie erklärt Dokumentmodell und Kompatibilitätsregeln, ersetzt aber nicht die Validierung durch die Zielversion von ha-paneld.

## Dokumentmodell

Jedes Profil enthält diese konzeptionellen Abschnitte:

| Abschnitt               | Zweck                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema                  | Wählt die von ha-paneld verstandene Profildokumentsprache.                                                                                  |
| Identität               | Stabile Profil-ID und unabhängig versionierter Profilinhalt.                                                                                |
| Metadaten               | Lesbarer Name, Autor, Quelle, reine Anzeigelinks, Lizenz, Reifegrad, getestete Firmware und bekannte Einschränkungen.                       |
| Anforderungen           | Minimaler kompatibler ha-paneld-Core und vom Dokument benötigte einkompilierte Treiber/Funktionen.                                          |
| Abgleich                | Begrenzte Regeln zum Panelfingerabdruck.                                                                                                    |
| Fähigkeiten und Treiber | Hardwaredaten mit Auswahl einkompilierter Treiber und typisierten Parametern.                                                               |
| Benannte Strategien     | Optionale Core-Regeln für die kleine Menge unterstützter firmware-/modellabhängiger Werte.                                                  |
| Bereitstellungsabsicht  | Zugriffshinweise, Software-/Displayempfehlungen, gewünschte Paketzustände und ausgewählte Core-Rezepte; niemals eine Berechtigungsfreigabe. |

Zu den Wurzelfeldern gehören `schema`, `id`, `version`, `display_name`, `soc_class`, `soc`, `metadata`, `requires`, `match`, `platform`, `hardware`, `sensors`, `identity`, `input`, `cpu`, `display` und `provisioning`. Feldnamen sind kleingeschriebenes `snake_case`; Werte unterscheiden Groß-/Kleinschreibung, sofern die Feldbeschreibung nichts anderes sagt. Siehe das [minimale Community-Beispiel](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml).

Die exakten erlaubten Enum-Werte und Treiber-/Artefaktbegriffe definiert das von der laufenden Version bereitgestellte Schema samt Treiberkatalog. Validiere gegen dieselbe Veröffentlichung, die das Profil aktivieren wird.

## Geschlossenes Schema

Unbekannte Felder sind Fehler. Das fängt Tippfehler ab, die sonst unbemerkt eine Sicherheitseigenschaft entfernen oder eine Fähigkeit unkonfiguriert lassen würden. Schema 2 hat keinen frei gestaltbaren Erweiterungsbereich. Autor, HTTPS-Quelle, SPDX-artige Lizenz, Reifegrad `draft`/`experimental`/`verified`, getestete Firmware und Einschränkungen gehören in `metadata`; diese Werte können weder Abgleich noch Treiber, Zugriff oder Laufzeitverhalten definieren.

Doppelte YAML-Schlüssel, Aliase und rekursive Schlüssel sind Fehler. Genau ein YAML-Dokument ist erlaubt. YAML-Tags können keine Anwendungs- oder Java-Objekte konstruieren, und Profile dürfen keine Prädikate mit regulären Ausdrücken enthalten. Der Loader akzeptiert höchstens 20 Verschachtelungsebenen, 20.000 Parserereignisse, 512 Einträge in einer einzelnen Zuordnung oder Liste und 16.384 Zeichen in einer einzelnen Zeichenfolge. Halte Dokumente einfach und explizit, auch wenn ein YAML-Editor aufwendigere Syntax unterstützt.

Jede YAML-Revision ist auf 128 KiB begrenzt. Der lokal importierte Katalog ist außerdem auf insgesamt 128 Revisionen, 16 Revisionen pro Profil-ID und 4 MiB YAML begrenzt. Exportiere und lösche veraltete inaktive Revisionen, bevor du weitere speicherst; aktive, ausstehende und zuletzt funktionierende Revisionen bleiben geschützt. Diese Grenzen verhindern, dass der Austausch von Profilen den Panelspeicher erschöpft oder beim Start einen unbegrenzten Katalog parsen lässt.

Erforderliche Felder dürfen nicht null sein. Bei optionalen Feldern behandelt der aktuelle Leser null im Allgemeinen wie Fehlen; Autoren sollten unbekannte Werte aber auslassen, um die Absicht klarzuhalten. Leere Zeichenfolgen, Listen/Zuordnungen, Nullen und false sind echte Werte und können sich vom Auslassen oder einem dokumentierten Standard unterscheiden.

## Identität und Versionen

Verwende eine stabile, unterscheidbare Profil-ID mit 1 bis 128 ASCII-Kleinbuchstaben oder Ziffern sowie Punkten und Bindestrichen nur im Inneren. Aufeinanderfolgende Punkte sind nicht erlaubt. Bevorzuge ein Autoren- oder Organisationspräfix, wenn ein allgemeiner Modellname kollidieren könnte, etwa `org.example.wallpanel-x1`. Nimm keine Firmwarenummer in die ID auf, wenn ein Profil und seine benannten Strategien die Hardwarefamilie abdecken können.

Die Profilinhaltsversion gehört dem Autor und ändert sich, wenn sich Wissen oder Verhalten des Profils ändern. Verwende semantische Versionierung, wenn das Profil geteilt wird:

- Patch: Klarstellungen oder Metadaten ohne Änderung von Abgleich oder Laufzeitverhalten;
- Minor: zusätzliches Fähigkeitswissen, eine neue kompatible Firmwarevariante oder eine sicherere Empfehlung;
- Major: geänderte Abgleichidentität, Treiberauswahl, Privilegienanforderungen oder eine andere Änderung, die einen bewussten Umzug verdient.

Die Schemaversion gehört ha-paneld. Autoren dürfen sie nicht erhöhen, um ihr eigenes Profil zu versionieren.

## Kommentierter Feldüberblick für Schema 2

„Erforderlich“ bedeutet, dass der Schlüssel mit dem angegebenen Typ vorhanden sein muss. „Optional; Standardwert …“ bedeutet, dass Auslassen (oder null bei optionalem Feld) diesen Wert erzeugt. Unbekannte Schlüssel sind auf jeder Ebene Fehler. Alle Ganzzahlen müssen vor der engeren Feldbereichsprüfung in einen vorzeichenbehafteten 32-Bit-Wert passen; alle Zahlen müssen bei der Umwandlung in eine 32-Bit-Fließkommazahl endlich bleiben, wenn das Feld eine Zahl verwendet.

### Wurzelfelder

| Feld           | Vorkommen                               | Typ und Validierung                                                                                                                                                                                                                    |
| -------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`       | Erforderlich                            | Ganzzahl; genau `2`. Schema 1 wird nicht akzeptiert.                                                                                                                                                                                   |
| `id`           | Erforderlich                            | Zeichenfolge mit 1 bis 128 Zeichen; ASCII-Kleinbuchstaben/Ziffern, `.` oder `-` nur im Inneren; `..` ist verboten.                                                                                                                     |
| `version`      | Erforderlich                            | Profilinhaltsversion: genau drei durch Punkte getrennte Komponenten, jeweils `0` oder 1 bis 9 Ziffern ohne führende Null; optionale, punktgetrennte Vorabkennungen aus ASCII-Buchstaben, Ziffern und `-`; kein Build-Metadaten-Suffix. |
| `display_name` | Erforderlich                            | Nicht leere und nicht ausschließlich aus Leerraum bestehende Zeichenfolge mit 1 bis 100 Zeichen.                                                                                                                                       |
| `soc_class`    | Erforderlich                            | Nicht leere und nicht ausschließlich aus Leerraum bestehende Zeichenfolge mit 1 bis 100 Zeichen.                                                                                                                                       |
| `soc`          | Optional; standardmäßig nicht vorhanden | Strukturierte, durch Profilbelege gestützte SoC-Daten; Felder unten.                                                                                                                                                                   |
| `metadata`     | Erforderlich                            | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `requires`     | Erforderlich                            | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `match`        | Erforderlich                            | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `platform`     | Erforderlich                            | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `hardware`     | Erforderlich                            | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `sensors`      | Optional; Standardwert `{}`             | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `identity`     | Optional; Standardwert `{}`             | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `input`        | Optional; Standardwert `{}`             | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `cpu`          | Optional; Standardwert `{}`             | Zuordnung; Felder unten.                                                                                                                                                                                                               |
| `display`      | Optional; Standardwert `{}`             | Physische Displaydaten; Felder unten.                                                                                                                                                                                                  |
| `provisioning` | Erforderlich                            | Zuordnung der Bereitstellungsabsicht; Felder unten.                                                                                                                                                                                    |

### `metadata` und `requires`

| Feld                        | Vorkommen                               | Typ und Validierung                                                                                                                                                                                                                                                                          |
| --------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata.author`           | Erforderlich                            | Nicht leere und nicht ausschließlich aus Leerraum bestehende Zeichenfolge mit 1 bis 100 Zeichen.                                                                                                                                                                                             |
| `metadata.source`           | Optional; standardmäßig nicht vorhanden | Absolute HTTPS-URL, höchstens 500 Zeichen, mit nicht leerem Host und ohne Benutzerinformationskomponente.                                                                                                                                                                                    |
| `metadata.links`            | Optional; Standardwert `[]`             | Liste mit höchstens acht externen Links nur zur Anzeige. ha-paneld ruft sie niemals ab, lädt sie nicht vor und verwendet sie nicht zur Bereitstellung. URLs und Beschriftungen müssen eindeutig sein; kein Link darf `metadata.source` wiederholen.                                          |
| `metadata.links[].label`    | Pro Eintrag erforderlich                | Nicht leere und nicht ausschließlich aus Leerraum bestehende Anzeigebeschriftung, 1 bis 48 Zeichen, ohne Steuer- oder bidirektionale Formatierungszeichen. Die Profiloberfläche zeigt auch den Zielhostnamen in einem isolierten Textabschnitt.                                              |
| `metadata.links[].url`      | Pro Eintrag erforderlich                | Absolute HTTPS-URL mit denselben Regeln zu 500 Zeichen, Host und fehlender Benutzerinformation wie `metadata.source`.                                                                                                                                                                        |
| `metadata.license`          | Erforderlich                            | SPDX-artige Zeichenfolge aus einer oder mehreren Kennungen mit 1 bis 64 Zeichen gemäß `[A-Za-z0-9][A-Za-z0-9.+-]*`, nur durch `AND` oder `OR` getrennt. Klammern, `WITH` und beliebiger Fließtext sind nicht zulässig.                                                                       |
| `metadata.maturity`         | Erforderlich                            | `draft`, `experimental` oder `verified`.                                                                                                                                                                                                                                                     |
| `metadata.tested_firmware`  | Optional; Standardwert `[]`             | Liste mit höchstens 32 nicht leeren und nicht ausschließlich aus Leerraum bestehenden Zeichenfolgen, jeweils höchstens 120 Zeichen.                                                                                                                                                          |
| `metadata.limitations`      | Optional; Standardwert `[]`             | Liste mit höchstens 32 nicht leeren und nicht ausschließlich aus Leerraum bestehenden Zeichenfolgen, jeweils höchstens 500 Zeichen.                                                                                                                                                          |
| `requires.min_core_version` | Optional; standardmäßig nicht vorhanden | Punktgetrennte Veröffentlichungsversion, höchstens 64 Zeichen: 1 bis 4 numerische Komponenten mit jeweils 1 bis 6 Ziffern und optionalem punktgetrenntem Vorab-Suffix aus alphanumerischen ASCII-Zeichen/`-`. Der laufende Core muss einschließlich Vorabreihenfolge gleich oder neuer sein. |
| `requires.drivers`          | Erforderlich                            | Liste von Core-Treiber-IDs. Unbekannte IDs sind Fehler; ein von einer ausgefüllten Fähigkeit benötigter Treiber muss aufgeführt sein. Ein ansonsten ungenutzter Treiber erzeugt eine Warnung.                                                                                                |

### `soc`

`soc_class` bleibt die erforderliche grobe Familienbezeichnung. Der optionale strukturierte Block hält Fakten fest, die Android im Allgemeinen nicht zuverlässig erkennen kann, etwa ob ein nominelles Vierkernpanel Cortex-A35- oder Cortex-A55-Kerne verwendet. Diese Werte erscheinen auf Dashboard und Profilseite, fehlen aber im knappen öffentlichen `/diag`-Bericht. Ergänze nur durch öffentliche Quellen oder Hardwarebelege gestützte Fakten; lasse Unbekanntes aus, statt zu raten.

| Feld                           | Vorkommen                               | Typ und Validierung                                                                                                                                                                               |
| ------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `soc.model`                    | Erforderlich, wenn `soc` vorhanden ist  | Nicht leerer und nicht ausschließlich aus Leerraum bestehender Modellname, 1 bis 100 Zeichen, ohne C0- oder DEL-Steuerzeichen.                                                                    |
| `soc.introduced_year`          | Optional; standardmäßig nicht vorhanden | Ganzzahl 1970 bis 2100. Verwende das öffentliche Einführungsjahr des SoC, nicht das Erscheinungsjahr des Panels.                                                                                  |
| `soc.cpu_cores`                | Optional; Standardwert `[]`             | Höchstens acht Architekturcluster und insgesamt 256 Kerne. Eine leere Liste bedeutet, dass das Modell bekannt ist, die CPU-Topologie aber nicht ausreichend belegt ist.                           |
| `soc.cpu_cores[].architecture` | Pro Eintrag erforderlich                | Nicht leere und nicht ausschließlich aus Leerraum bestehende Kernarchitektur, 1 bis 64 Zeichen, ohne Steuerzeichen; Architekturen müssen ohne Beachtung der Groß-/Kleinschreibung eindeutig sein. |
| `soc.cpu_cores[].count`        | Pro Eintrag erforderlich                | Ganzzahl 1 bis 128.                                                                                                                                                                               |

### `match`

`match.any` verknüpft Gruppen mit ODER; die `all`-Liste einer Gruppe verknüpft Prädikate mit UND; die `values`-Liste eines Prädikats mit ODER. Vergleiche unterscheiden Groß-/Kleinschreibung und beziehen sich auf Builddaten, die ha-paneld bereits kleingeschrieben hat.

| Feld                       | Vorkommen    | Typ und Validierung                                                                                                                                                                    |
| -------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `match.priority`           | Erforderlich | Ganzzahl 0 bis 1000; entscheidet Gleichstände nach der Priorität der passenden Gruppe.                                                                                                 |
| `match.fallback`           | Erforderlich | Boolesch. `true` ist nur für das mitgelieferte Profil mit ID `generic` gültig; importierte/Community-Profile dürfen keine Rückfallprofile sein.                                        |
| `match.any`                | Erforderlich | Liste mit höchstens 64 Gruppenobjekten. Ein Nicht-Rückfallprofil benötigt mindestens eine Gruppe; das mitgelieferte Generic darf eine leere Liste verwenden.                           |
| `match.any[].priority`     | Erforderlich | Ganzzahl 0 bis 1000; Zweigspezifität, die vor der Profilpriorität ausgewertet wird.                                                                                                    |
| `match.any[].all`          | Erforderlich | Liste mit 1 bis 8 Prädikatobjekten.                                                                                                                                                    |
| `match.any[].all[].field`  | Erforderlich | `model`, `device` oder `product_version`.                                                                                                                                              |
| `match.any[].all[].op`     | Erforderlich | `equals`, `starts_with` oder `contains`.                                                                                                                                               |
| `match.any[].all[].values` | Erforderlich | Liste mit 1 bis 32 nicht leeren und nicht ausschließlich aus Leerraum bestehenden kleingeschriebenen Zeichenfolgen; jeweils höchstens 100 Zeichen und ohne C0- oder DEL-Steuerzeichen. |

### `platform` und `hardware`

| Feld                                     | Vorkommen                               | Typ und Validierung                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `platform.su_form`                       | Erforderlich                            | `none`, `android` oder `toolbox`.                                                                                                                                                                                                                                                                                                                                                                                  |
| `platform.app_can_su`                    | Erforderlich                            | Boolesch. Muss bei `su_form` gleich `none` `false` sein; `android` oder `toolbox` darf für eine durch die Sandbox abgeschottete App trotzdem mit `false` deklariert werden.                                                                                                                                                                                                                                        |
| `platform.has_recents`                   | Optional; Standardwert `true`           | Boolesch.                                                                                                                                                                                                                                                                                                                                                                                                          |
| `platform.has_native_navbar`             | Optional; standardmäßig nicht vorhanden | Auslassen, um die Sichtbarkeit der Firmware-Navigationsleiste zu prüfen. Ein explizites `true` oder `false` überschreibt diese Prüfung.                                                                                                                                                                                                                                                                            |
| `platform.launcher.vendor_home_packages` | Optional; standardmäßig leer            | Liste mit höchstens 8 Android-Paketnamen ohne Duplikate. Hersteller-Apps, die sich als Android-Startbildschirm registrieren, aber keine App-Übersichten sind, etwa eine Hersteller-Steuerungs-App. Die Launcher-Schaltfläche der Navigationsleiste überspringt sie und öffnet, falls sonst nichts passt, den Panel-Launcher, der sie weiterhin als Apps auflistet.                                                 |
| `hardware.led`                           | Erforderlich                            | Zuordnung mit den folgenden LED-Feldern.                                                                                                                                                                                                                                                                                                                                                                           |
| `hardware.led.mechanism`                 | Erforderlich                            | `none`, `autodetect`, `rk3576-ioctl`, `rk3576-ioctl-daemon` oder `sysfs-daemon`. Nur über Daemon verfügbare Mechanismen werden abgelehnt, wenn `platform.app_can_su` `true` ist.                                                                                                                                                                                                                                   |
| `hardware.led.transfer`                  | Optional; Standardwert `identity`       | Wählt eine einkompilierte Übertragungskurve. Beispiele sind `identity`, `rk3576-four-bit`, `perceptual`, `gamma` und gemessene `points`; Parameter stehen im bereitgestellten Schema.                                                                                                                                                                                                                              |
| `hardware.screen_off`                    | Erforderlich                            | Wählt einen einkompilierten Bildschirm-Aus-Treiber, etwa `brightness-zero`, `su-blpower`, `daemon-blpower`, `keyevent`, `screen-timeout`, `device-admin` oder `vendor-rpc`. Berechtigungs- und lokale Aufweckvoraussetzungen hängen vom gewählten Weg ab; verwende das bereitgestellte Schema und prüfe den Weg an Hardware.                                                                                       |
| `hardware.has_button_backlight`          | Optional; Standardwert `false`          | Boolesch; wählt bei true die begrenzte, helfergestützte Tastenbeleuchtungsfähigkeit.                                                                                                                                                                                                                                                                                                                               |
| `hardware.local_wake`                    | Optional; standardmäßig nicht vorhanden | Liste eindeutiger Werte aus `touch`, `proximity` und `button`: Wege, ein vollständig dunkles Panel am Panel selbst aufzuwecken. `touch` bedeutet jede Berührung, `proximity` ein Winken nach Näherungskalibrierung und `button` eine Hardwaretaste. Bei Unkenntnis auslassen; eine leere Liste deklariert, dass nur Home Assistant aufweckt. Home Assistant kann es immer aufwecken und wird daher nie aufgeführt. |
| `hardware.zigbee_gateway_dir`            | Optional; standardmäßig nicht vorhanden | Exakter freigegebener Pfad `/vendor/bin/siliconlabs_host`; kein anderer Pfad wird akzeptiert.                                                                                                                                                                                                                                                                                                                      |
| `hardware.relay_base`                    | Optional; standardmäßig nicht vorhanden | Ein exakter freigegebener Pfad: `/sys/class/relay`, `/sys/class/st_relay` oder `/sys/class/strelay`.                                                                                                                                                                                                                                                                                                               |
| `hardware.relay_base_fallbacks`          | Optional; Standardwert `[]`             | Liste mit höchstens drei Pfaden aus derselben Relais-Freigabeliste. Einträge müssen eindeutig sein und dürfen `relay_base` nicht wiederholen.                                                                                                                                                                                                                                                                      |
| `hardware.button_led_gpio_base`          | Optional; standardmäßig nicht vorhanden | Ganzzahl 0 bis 4092, die den ersten GPIO eines Viererblocks bezeichnet.                                                                                                                                                                                                                                                                                                                                            |
| `hardware.camera`                        | Optional; standardmäßig nicht vorhanden | Boolesch mit drei Zuständen: Auslassen erlaubt Android-Aufzählung, `true` deklariert einen Kandidaten auch bei fehlgeschlagener Aufzählung und `false` unterdrückt die Kamera. Aufnahmen benötigen immer eine eingebundene Bildschirmanzeige; bei ausgeschaltetem Display zusätzlich eine aktive LED-Anzeige. Ohne Anzeige bei ausgeschaltetem Display stoppt die Aufnahme beim Ausschalten des Displays.          |
| `hardware.microphone`                    | Optional; standardmäßig nicht vorhanden | `true` deklariert ein nachgewiesenes Mikrofon, `false` unterdrückt es; Auslassen verwendet Androids Aufzählung eingebauter Mikrofone, gefolgt von einer Aufnahmeprüfung vor dem Zuhören. Unabhängig vom Vorhandensein einer Kamera.                                                                                                                                                                                |
| `hardware.camera_lens_offset_px`         | Optional                                | Ganzzahl; Bildschirmpixel von der Oberkante der aktiven Displayfläche bis zum Mittelpunkt der Kameralinse. Die Kameraaktivitätsanzeige wird als um die Linse zentrierter Bogen gezeichnet; dieses Maß positioniert sie. Es ist ein Rahmenmaß und unterscheidet sich je Board. Bei fehlender Messung auslassen; die Anzeige verwendet dann einen Standardwert.                                                      |
| `hardware.touch_click_gain`              | Optional; Standardwert `0.2`            | Zahl von 0.05 bis 1.0; skaliert die Lautstärke der Berührungs-Klickrückmeldung für ein Board, dessen Klick beim Systemstandard zu laut oder zu leise ist.                                                                                                                                                                                                                                                          |

### `sensors` und `identity`

| Feld                            | Vorkommen                               | Typ und Validierung                                                                                                                                                                                        |
| ------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sensors.proximity_technology`  | Optional; standardmäßig nicht vorhanden | Nicht leere und nicht ausschließlich aus Leerraum bestehende Zeichenfolge, 1 bis 100 Zeichen, ohne C0- oder DEL-Steuerzeichen. Deklariert bei Vorhandensein die Nutzung des Android-Näherungssensors.      |
| `sensors.proximity_gpio`        | Optional; standardmäßig nicht vorhanden | Ganzzahl 0 bis 4095 für den unterstützten Root-gestützten binären GPIO-Weg.                                                                                                                                |
| `sensors.light_technology`      | Optional; standardmäßig nicht vorhanden | Nicht leere und nicht ausschließlich aus Leerraum bestehende Zeichenfolge, 1 bis 100 Zeichen, ohne C0- oder DEL-Steuerzeichen. Deklariert bei Vorhandensein die Nutzung des Android-Umgebungslichtsensors. |
| `sensors.vi530x`                | Optional; Standardwert `false`          | Boolesch; stellt eine vom Helfer gestartete VI530x-Time-of-Flight-Distanzquelle bereit, über ioctl gestartet und danach abgefragt. Benötigt den authentifizierten Helfer.                                  |
| `sensors.cht8305`               | Optional; Standardwert `false`          | Boolesch; aktiviert eine exakt vom Core unterstützte CHT8305-kompatible Raumklima-Eingabe über den authentifizierten Helferweg.                                                                            |
| `sensors.room_temp_offset_c`    | Optional; Standardwert `0.0`            | Endliche Zahl von -30 bis 30 °C.                                                                                                                                                                           |
| `identity.manufacturer`         | Optional; standardmäßig nicht vorhanden | Nicht leere und nicht ausschließlich aus Leerraum bestehende Zeichenfolge, 1 bis 100 Zeichen, ohne C0- oder DEL-Steuerzeichen; bei Fehlen zur Laufzeit abgeleitet.                                         |
| `identity.model`                | Optional; standardmäßig nicht vorhanden | Nicht leere und nicht ausschließlich aus Leerraum bestehende Zeichenfolge, 1 bis 100 Zeichen, ohne C0- oder DEL-Steuerzeichen; bei Fehlen zur Laufzeit abgeleitet.                                         |
| `identity.model_label_strategy` | Optional; Standardwert `display-name`   | `display-name` oder `nspanel-product-version`.                                                                                                                                                             |

Eine gespeicherte Schema-2-Revision darf `proximity_near_below`, `proximity_near_raw`, `proximity_far_raw` oder `proximity_graded_strategy` enthalten. Der Loader akzeptiert diese stillgelegten Schlüssel nur als Kompatibilitätsreste: Beim Laden werden sie ignoriert, beim Serialisieren eines Profildokuments ausgelassen. Der Export einer unveränderlichen gespeicherten Revision bewahrt ihre ursprünglichen Bytes. Die Laufzeit verwendet kalibrierte Sensorprofil-Standardwerte oder die gespeicherte geführte Einrichtung und prüft die aktive Quelle vor der Meldung normalisierter Werte.

### `input`, `cpu` und `display`

| Feld                               | Vorkommen                               | Typ und Validierung                                                                                                                                                      |
| ---------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `input.evdev_buttons`              | Optional; Standardwert `[]`             | Liste mit höchstens 32 evdev-Zuordnungsobjekten. Doppelte `(sw, code)`-Paare werden auch bei unterschiedlichen Knoten abgelehnt.                                         |
| `input.evdev_buttons[].node`       | Pro Eintrag erforderlich                | Zeichenfolge gemäß `/dev/input/eventN`, wobei `N` 1 bis 3 Dezimalziffern ist. Kein anderer Gerätepfad wird akzeptiert.                                                   |
| `input.evdev_buttons[].code`       | Pro Eintrag erforderlich                | Ganzzahliger Linux-Eingabe-/Schaltercode 1 bis 767.                                                                                                                      |
| `input.evdev_buttons[].grab`       | Pro Eintrag erforderlich                | Boolesch; true fordert exklusives `EVIOCGRAB` an.                                                                                                                        |
| `input.evdev_buttons[].event_type` | Pro Eintrag erforderlich                | Zeichenfolge mit höchstens 64 Zeichen gemäß `KEYCODE_[A-Z0-9_]+`.                                                                                                        |
| `input.evdev_buttons[].sw`         | Optional; Standardwert `false`          | Boolesch; false wählt `EV_KEY`, true wählt `EV_SW`.                                                                                                                      |
| `cpu.governors`                    | Optional; standardmäßig nicht vorhanden | Zuordnung, deren einzige erlaubte Schlüssel `Performance`, `Efficiency` und `Auto` sind. Jeder Wert ist ein Governor-Name mit 1 bis 32 Zeichen gemäß `[a-z][a-z0-9_-]*`. |
| `display.physical_ppi`             | Optional; standardmäßig nicht vorhanden | Ganzzahl 50 bis 1000.                                                                                                                                                    |

### `provisioning`

| Feld                                          | Vorkommen                                  | Typ und Validierung                                                                                                                                                                                       |
| --------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provisioning.access`                         | Optional; Standardwert `{}`                | Zuordnung von Zugriffsempfehlungen.                                                                                                                                                                       |
| `provisioning.access.shizuku`                 | Stillgelegtes Kompatibilitätsfeld          | Alte Werte werden akzeptiert und ignoriert. Sie stellen keinen Laufzeit-Zugangsweg bereit.                                                                                                                |
| `provisioning.software`                       | Optional; Standardwert `{}`                | Zuordnung einer vom Core verwalteten Softwarerichtlinie.                                                                                                                                                  |
| `provisioning.software.webview.artifact`      | Optional; standardmäßig nicht vorhanden    | Vom Core verwaltete ID `lineageos-138-arm`, `lineageos-150-arm` oder `lineageos-150-arm64`. Ein Profil kann weder URL noch Version oder Signierer-Hash bereitstellen.                                     |
| `provisioning.software.companion.max_version` | Optional; standardmäßig nicht vorhanden    | Punktgetrennte Veröffentlichungsversion mit derselben Syntax und 64-Zeichen-Grenze wie `requires.min_core_version`.                                                                                       |
| `provisioning.display.density`                | Optional; standardmäßig nicht vorhanden    | Ganzzahl 80 bis 640 dpi oder die benannte Strategie `nspanel-variant`.                                                                                                                                    |
| `provisioning.display.font_scale`             | Optional; standardmäßig nicht vorhanden    | Endliche Zahl von 0.5 bis 1.5.                                                                                                                                                                            |
| `provisioning.packages`                       | Optional; Standardwert `[]`                | Liste mit 0 bis 128 Objekten für gewünschte Paketzustände.                                                                                                                                                |
| `provisioning.packages[].package`             | Pro Eintrag erforderlich                   | Eindeutiger Android-Paketname gemäß `[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+`.                                                                                                                            |
| `provisioning.packages[].desired_state`       | Pro Eintrag erforderlich                   | `disabled`. Dies beschreibt den Zielzustand und ist keine Ausführungszustimmung.                                                                                                                          |
| `provisioning.packages[].importance`          | Pro Eintrag erforderlich                   | `recommended` oder `optional`. Die Wichtigkeit steuert nur die Darstellung und bedeutet niemals standardmäßiges Anwenden.                                                                                 |
| `provisioning.packages[].tags`                | Optional; Standardwert `[]`                | Liste mit höchstens acht Tags. Jeweils 1 bis 24 Zeichen, beginnend mit einem ASCII-Kleinbuchstaben, danach nur Kleinbuchstaben, Ziffern oder `-`.                                                         |
| `provisioning.packages[].note`                | Optional; standardmäßig leere Zeichenfolge | Zeichenfolge mit höchstens 500 Zeichen. Hinweise sind ergänzende Erklärungen, keine Verfahren.                                                                                                            |
| `provisioning.recipes`                        | Optional; Standardwert `[]`                | Liste mit höchstens 32 vom Core verwalteten Rezeptauswahlen.                                                                                                                                              |
| `provisioning.recipes[].id`                   | Pro Eintrag erforderlich                   | Eindeutige registrierte ID. Schema 2 kennt `nspanel-pro.watchdog-e2big-repair` und `tpa10.vendor-stack-minimize`. Rezepteinträge dürfen keine Argumente, Befehle, URLs oder Ablaufdefinitionen enthalten. |

In der unveröffentlichten Version 1.0.0-rc2 verweisen die drei WebView-IDs auf folgende vom Core verwaltete Builds und Kompatibilitätsmetadaten:

| Artefakt-ID           | Vom Core verwalteter Build                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| `lineageos-138-arm`   | LineageOS System WebView `138.0.7204.63`; ARM ABIs `armeabi-v7a` und `arm64-v8a`; Android 8–9.           |
| `lineageos-150-arm`   | LineageOS System WebView `150.0.7871.63`; ARM ABI `armeabi-v7a`; Android 10 oder neuer.                  |
| `lineageos-150-arm64` | LineageOS System WebView `150.0.7871.63`; ARM ABIs `armeabi-v7a` und `arm64-v8a`; Android 10 oder neuer. |

Das WebView-Artefaktfeld wählt einen Build, dessen Download, Prüfsumme, Paket, Version und Signierer in den Core einkompiliert sind. In der unveröffentlichten Version 1.0.0-rc2 kann ein aus Home Assistant gestartetes Panel-App-Update auch ein kompatibles WebView installieren. Bleibt dieses Update unvollständig, verwende seine Update-Reparatur für einen erneuten Versuch. Das Importieren oder Aktivieren eines Profils startet kein Update. Siehe [WebView aktualisieren](/de/hardware/guides/update-the-webview/).

### Bedingte Treiberanforderungen

Jeder durch ausgefüllte Felder ausgewählte Treiber muss in `requires.drivers` stehen. Der bereitgestellte Treiberkatalog nennt die Berechtigungsanforderungen jedes Treibers; mehrere Android- und Herstellerdienst-Wege funktionieren ohne Root.

| Profilbedingung                                                                 | Erforderlicher Treiber    |
| ------------------------------------------------------------------------------- | ------------------------- |
| `platform.su_form: android` und `platform.app_can_su: true`                     | `access.android-su`       |
| `platform.su_form: toolbox` und `platform.app_can_su: true`                     | `access.toolbox-su`       |
| `hardware.led.mechanism: autodetect`                                            | `led.autodetect`          |
| `hardware.led.mechanism: rk3576-ioctl`                                          | `led.rk3576-ioctl`        |
| `hardware.led.mechanism: rk3576-ioctl-daemon`                                   | `led.rk3576-ioctl-daemon` |
| `hardware.led.mechanism: sysfs-daemon`                                          | `led.sysfs-daemon`        |
| `hardware.screen_off: brightness-zero`                                          | `screen.brightness-zero`  |
| `hardware.screen_off: su-blpower`                                               | `screen.su-blpower`       |
| `hardware.screen_off: daemon-blpower`                                           | `screen.daemon-blpower`   |
| `hardware.screen_off: keyevent`                                                 | `screen.keyevent`         |
| `hardware.zigbee_gateway_dir` ist vorhanden                                     | `radio.siliconlabs-host`  |
| `hardware.relay_base` ist vorhanden, oder `relay_base_fallbacks` ist nicht leer | `relay.sysfs`             |
| `hardware.button_led_gpio_base` ist vorhanden                                   | `relay.gpio-button-led`   |
| `hardware.has_button_backlight: true`                                           | `input.button-backlight`  |
| `sensors.proximity_technology` oder `sensors.light_technology` ist vorhanden    | `sensor.android`          |
| `sensors.proximity_gpio` ist vorhanden                                          | `sensor.gpio-proximity`   |
| `sensors.cht8305: true`                                                         | `sensor.cht8305-daemon`   |
| `sensors.vi530x: true`                                                          | `sensor.vi530x-daemon`    |
| `input.evdev_buttons` ist nicht leer                                            | `input.evdev`             |
| `provisioning.software.webview.artifact` ist vorhanden                          | `update.webview`          |

### Syntax- und Speichergrenzen

| Bereich                       | Grenze                                            |
| ----------------------------- | ------------------------------------------------- |
| Eine rohe YAML-Revision       | 128 KiB UTF-8-Bytes.                              |
| YAML-Dokumentanzahl           | Genau eines; leere Eingabe ist ungültig.          |
| YAML-Aliase                   | Null.                                             |
| Verschachtelung               | Höchstens 20 Sammlungsebenen.                     |
| Parserarbeit                  | Höchstens 20.000 Parserereignisse.                |
| Einzelne Zuordnung oder Liste | Höchstens 512 Einträge vor engeren Feldgrenzen.   |
| Einzelne Zeichenfolge         | Höchstens 16.384 Zeichen vor engeren Feldgrenzen. |
| Importierter Katalog          | Höchstens 128 zugelassene Revisionen.             |
| Eine importierte Profil-ID    | Höchstens 16 zugelassene Revisionen.              |
| Importierter YAML-Speicher    | Insgesamt höchstens 4 MiB.                        |

## Anforderungen

Ein Profil deklariert das mindestens benötigte Core-Verhalten und seine einkompilierten Treiber. Fehlt eine Anforderung, lehnt die Validierung sicher ab. Eine nicht verfügbare Anforderung unterscheidet sich von einer fehlgeschlagenen Live-Prüfung: Erstere bedeutet, dass dieser ha-paneld-Build den angeforderten Mechanismus nicht kennt; Letztere, dass er im Core vorhanden, aber auf diesem Panel nicht erreichbar war.

Erweitere Anforderungen nicht vorsorglich. Ein ungenutzter privilegierter Pflicht-Treiber erschwert Ausführung und Prüfung des Profils, ohne eine Fähigkeit hinzuzufügen.

## Abgleichregeln

Abgleichregeln arbeiten nur auf den unveränderlichen, von ha-paneld bereitgestellten Fakten `model`, `device` und `product_version`. Eine `match.any`-Liste ist ODER; Prädikate in der `all`-Liste einer Gruppe sind UND. Prädikate unterstützen `equals`, `starts_with` und `contains` über kleingeschriebene Erwartungswerte, niemals reguläre Ausdrücke.

Jede Gruppe hat eine Zweig-`priority` von 0 bis 1000. Das passende mitgelieferte Profil mit der höchsten passenden Gruppenpriorität gewinnt; `match.priority` auf Profilebene löst verbleibende Gleichstände, bei exaktem Gleichstand wird sicher auf Generic zurückgefallen. Verwende höhere Gruppenprioritäten für genaue Produktidentitäten und niedrigere für breite Kompatibilitätsrückfälle. Eine Regel, die nur `px30`, `rk3326`, `rk3566`, `rk3576` oder einen ähnlich wiederverwendeten Referenznamen abgleicht, ist kein ausreichender Beleg für hardwarespezifische Steuerungen.

Der Abgleich wählt einen Profilkandidaten; er beweist keine Fähigkeit. Treiber führen weiterhin ihre Live-Verfügbarkeitsprüfungen aus; widersprechen sich Belege und Deklaration, gewinnt das konservative Ergebnis.

## Benannte Modellstrategien

Das Schema hat weder eine allgemeine Ausdruckssprache noch einen beliebigen bedingten Patchbereich. Seine benannten Strategien sind bewusst klein und vom Core verwaltet:

- `identity.model_label_strategy: nspanel-product-version` decodiert NSPanel-Variante und Firmwarebezeichnung;
- `provisioning.display.density: nspanel-variant` wählt die dokumentierte 86P/120P-Dichte;
- der Standard `display-name` und feste Ganzzahlwerte vermeiden diese Umwandlungen.

`hardware.relay_base_fallbacks` sind gewöhnliche begrenzte Daten für bekannte unterstützte Umbenennungen der Relaisklasse, kein Ausdruck und keine beliebige Pfadsuche.

Strategien sind einkompilierte, begrenzte und im Schema benannte Umwandlungen, keine Skripte aus dem Profil. Sie können weder Ein-/Ausgabe noch Treiber aufrufen. Das bereitgestellte Schema beschreibt unterstützte Strategien und ihre Eingaben.

Erstelle separate Profile, wenn keine benannte Strategie den Unterschied abdeckt oder wenn Produkte verschiedene einkompilierte Treiber, Berechtigungsstufen, Wiederherstellungserwartungen oder unabhängig gepflegte Belege benötigen.

## Fähigkeiten und einkompilierte Treiber

Eine Fähigkeitsdeklaration enthält Hardwaredaten und bei Bedarf eine Treiber-ID mit typisierten Parametern. Treiber-IDs bezeichnen in ha-paneld einkompilierte Implementierungen. Der Treiber validiert Pfade, Bereiche, Ereigniscodes, Paketnamen und andere sicherheitsrelevante Eingaben. Privilegierte Pfade werden aus Core-Freigabelisten ausgewählt. Die beibehaltenen Metadaten `provisioning.software.webview.artifact` benennen URL, Version, Artefaktprüfsumme und Signierer-Hash, die in den Core einkompiliert und mit ihm geprüft werden; ein Profil kann diesen Vertrauensanker nicht neu definieren. In der unveröffentlichten Version 1.0.0-rc2 prüft ein vom Besitzer gestartetes Update installierten Anbieter und Kompatibilität vor Verwendung des Artefakts; das Profil kann keinen anderen Download oder Vertrauensanker liefern.

Profile dürfen Folgendes nicht liefern:

- Shellbefehle oder Argumentarrays;
- Befehlsnamen des Hilfsdaemons;
- beliebige Dateisystem-Lese-/Schreiboperationen;
- native Bibliotheken, ioctl-Nummern oder Byte-Nutzdaten;
- APK-URLs, Signierer-Hashes oder neue Update-Artefakte;
- ausführbare Ausdrücke mit Netzwerk-, Dateisystem-, Prozess-, Reflection- oder Uhrzugriff;
- Zugangsdaten, Home Assistant-Tokens oder MQTT-Konfiguration.

Eine deklarierte Fähigkeit ist ein Kandidat, bis der Treiber sie bestätigt. Oberfläche und Diagnose sollten **deklariert**, **verfügbar**, **nicht verfügbar** und **Berechtigung fehlt** unterscheiden, statt YAML als Beweis zu behandeln.

## Kompatibilitätsverhalten

ha-paneld behandelt Kompatibilitätsfehler als Probleme inaktiver Profile, nicht als Panelstartfehler:

- Schema `2` ist die einzige akzeptierte Dokumentsprache. Gespeicherte Schema-1-Revisionen bleiben auflistbar, exportierbar und löschbar, lassen sich aber nicht aktivieren; eine ausgewählte inkompatible Revision fällt auf eine kompatible zuletzt funktionierende Schema-2-Revision, ein passendes mitgeliefertes Profil oder das mitgelieferte `generic.yaml` zurück.
- Ein unbekannter erforderlicher Treiber oder eine unbekannte Umwandlung verhindert die Aktivierung.
- Installierte lokale Revisionen werden nach einem App-Update erneut validiert.
- Das ursprüngliche YAML und sein Inhaltshash bleiben nach Validierung und Normalisierung identifizierbar.
- Ein Aktivierungsfehler kehrt zur zuletzt funktionierenden Revision zurück.
- Kann kein panelspezifisches Profil ausgeführt werden, startet ha-paneld mit dem konservativen Verhalten des mitgelieferten `generic.yaml`. Fehlt auch dieser Rückfall oder ist er beschädigt, hält ein Notfallvertrag ohne Fähigkeiten die lokale Verwaltungsoberfläche verfügbar, ohne Panelhardware zu behaupten.

Inhaltshashes und separat veröffentlichte Signaturen beantworten verschiedene Fragen. Der Revisionshash von ha-paneld bindet Speichern und Aktivieren an die geprüften Bytes. Eine externe Signatur kann den Herausgeber identifizieren helfen, ist aber kein vom Profillader interpretiertes Berechtigungssignal. Keines von beiden gewährt Root oder die Erlaubnis, Validierung und Bestätigung zu umgehen.

## Vorrang beim Abgleich

Die Auflösungsrichtlinie schützt bekannte Produkte davor, dass Community-Dateien stillschweigend aktiv werden:

1. eine explizite gültige Administratorauswahl, an eine genaue mitgelieferte oder lokale Revision gebunden;
2. automatischer exakter Abgleich mitgelieferter Profile;
3. automatische mitgelieferte Kompatibilitätsrückfälle;
4. Generic.

Lokale/Community-Abgleichregeln werden nur für Vorschau und Vergleich ausgewertet. Sie gehen niemals in die automatische Auswahl ein; Importieren oder Speichern kann daher die mitgelieferte Erkennung nicht überschreiben. Ihre Aktivierung erfordert immer eine explizite gebundene Auswahl.

## Kompatibilitätscheckliste für Autoren

Bestätige vor dem Teilen einer neuen Revision:

- Schema `2` und jedes Feld validieren auf der ältesten von der Datei beanspruchten Core-Version;
- jeder erforderliche Treiber ist in dieser Version vorhanden;
- exakte Fingerabdruck-Testfälle decken jedes beanspruchte Modell und jede Firmwarefamilie ab;
- ein knapp abweichender Testfall trifft kein anderes Produkt mit demselben SoC;
- jede Grenze einer benannten Strategie wurde, soweit zutreffend, unmittelbar unter, an und über dem Übergang getestet;
- jede exakte Abgleichgruppe hat eine höhere Zweigpriorität als ihr breiter Rückfall, mit Testfällen für profilübergreifende Kollisionen;
- das Profil funktioniert bei nicht verfügbarer optionaler Hardware und fehlender Berechtigung, ohne den Start zu blockieren;
- die vorherige aktive Revision bleibt ein nutzbares Rückkehrziel.
