---
title: Sonoff NSPanel Pro
description: Hardware-Fakten zum ursprünglichen Sonoff NSPanel Pro 86P und 120P, einem Rockchip-PX30-Panel mit eingebautem Zigbee-Funkmodul.
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
vendor: Sonoff
panelIndex: true
sidebar:
  label: Übersicht
  order: 0
---

Die ursprüngliche NSPanel Pro-Reihe umfasst zwei baulich unterschiedliche Panels, **[86P](/de/hardware/panels/sonoff/nspanel-pro-86p/)** und **[120P](/de/hardware/panels/sonoff/nspanel-pro-120p/)**, benannt nach den europäischen 86-mm- und 120-mm-Unterputzdosen. Beide haben einen eingebauten **Zigbee-3.0-Koordinator**, kein NFC oder IR und die schwächste CPU der vollständig unterstützten Panels. Sie teilen fast alles auf dieser Seite (Root-Verfahren, WebView, LED, Sensoren, Zigbee-Gateway); die jeweilige Variantenseite enthält nur ihre eigene Spezifikation und die wenigen abweichenden Fakten. Diese Seite wurde hauptsächlich an einem laufenden **86P** (Android 8.1, gerootet, toolbox `su`) per Reverse Engineering erarbeitet; das 120P wurde an den angegebenen Stellen separat am Gerät geprüft.

<a id="also-sold-as"></a>

## Auch verkauft als

Sonoff NSPanel Pro 86, NSPanel Pro 120, NSPanel Pro 86P, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, px30_evb, SN_3326S, SN-RKPX30-NSP-01, nspanel-pro, nspanel-pro-ver120. Nicht zu verwechseln mit dem NSPanel Pro Gen2 oder den Tuya-S6E- und T6E-Platinen, die eigenständige Hardware sind.

:::tip
Die wichtigsten Fakten: Das Panel wird als **`userdebug` ohne adb-Passwort** ausgeliefert, daher funktioniert `adb root` direkt. Die **LED ist nicht charakterisiert** (kein steuerbarer RGB-Knoten gefunden). Licht- und Näherungssensor sind **direkt für die App zugänglich**. Das eingebaute **EFR32-Zigbee-Funkmodul** wird über einen lokalen Broker verwaltet, ohne erneutes Flashen. Über Home Assistant gestartete Installationen und Panel-App-Updates können die verifizierte WebView installieren; siehe [WebView: zuerst aktualisieren](#webview-update-this-first).
:::

|          |                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **PX30 / rk3326**                                                                                                            |
| CPU      | 4× **Cortex-A35** mit bis zu **1.512 GHz** (im Leerlauf 408 MHz)                                                                      |
| GPU      | **Mali-G31** (am Gerät bestätigt)                                                                                                     |
| Display  | **480×480 quadratisch** (1:1), etwa 4 Zoll, 160 dpi (mdpi, gut passend zu etwa 170 physischen ppi), 60 Hz, eine **480×480-dp**-Fläche |
| RAM      | **2 GB** (etwa 1960 MB nutzbar)                                                                                                       |
| Speicher | eMMC; `/data` etwa 3.5 GB                                                                                                             |
| Android  | 8.1 (API 27)                                                                                                                          |
| ABI      | arm64-v8a                                                                                                                             |
| Funk     | **Zigbee 3.0** (Silicon Labs EFR32 Koordinator an UART `ttyS5`, siehe unten), WLAN, Bluetooth. Kein NFC, IR, Ethernet oder Mobilfunk. |

:::note
Der Cortex-A35 ist ein Effizienzkern mit deutlich geringerem Durchsatz pro Takt als der A55 (TPA10) oder A72 (WF1589T). Mit 2 GB RAM bietet das NSPanel Pro die **Einstiegsleistung** der vollständig unterstützten Panels; siehe [Leistungsvergleich](/de/hardware/#performance-comparison).
:::

:::tip
Du wechselst die Firmware eines Panels ohne Tasten? Lies zuerst [Firmware sichern und wiederherstellen](/de/hardware/guides/firmware-backup-and-restore/). Das NSPanel Pro verwendet [seakys modellspezifische Werkzeuge](/de/hardware/guides/firmware-backup-and-restore/#per-panel-notes) statt `rkdeveloptool`.
:::

<a id="variants-86p-and-120p"></a>

## Varianten: 86P und 120P

Die obige Spezifikationstabelle und der Großteil dieser Seite wurden an einem **86P** erfasst; das **120P** hat eine andere Platine. Die Seiten für [86P](/de/hardware/panels/sonoff/nspanel-pro-86p/) und [120P](/de/hardware/panels/sonoff/nspanel-pro-120p/) enthalten die jeweilige Spezifikationstabelle und ein Foto.

|                      | NSPanel Pro **86P**                                                                                                                                                             | NSPanel Pro **120P**                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| SoC                  | Rockchip **PX30**                                                                                                                                                               | Rockchip **RK3326-S** (gleiche PX30/RK3326-Familie; `ro.board.platform=rk3326`, Gerätebaum `rockchip,px30`)                             |
| Display              | **480×480** quadratisch, etwa 160 dpi, nur Hochformat                                                                                                                           | **750×1334** Hochformat, **240 dpi** (Überschreibung 250); Querformat verfügbar; etwa 1 cm schmaler und länger als das 86P              |
| Build-IDs            | beide melden `ro.product.model/device/name = px30_evb`, ein gemeinsamer Rockchip-Platinenname und _keine_ zuverlässige Möglichkeit, die Varianten zu unterscheiden              | wie 86P                                                                                                                                 |
| `ro.product.version` | `NSPanel86P_x.y.z` oder `s6_android_x.y.z`-Form                                                                                                                                 | `NSPanel120P_x.y.z` (OTA-Kanal `nspanel-pro-ver120`, vollständiges ROM `SN_3326S_750X1334_…`)                                           |
| OTA-Form             | vollständiges ROM bis **4.0.12**; später indizierte Versionen werden als Diffs oder reine App-Updates ausgeliefert (siehe [Firmware-Seite](/de/hardware/firmware/nspanel-pro/)) | wie 86P                                                                                                                                 |
| Näherungs-Firmware   | **4.0.12 stellte abgestufte** Messwerte wieder her                                                                                                                              | blieb unter 4.x **binär** (die Kernel unterscheiden sich je nach Modell; siehe [Sensoren](#sensors-light-and-proximity-are-app-direct)) |

Beide teilen das EFR32-Zigbee-Funkmodul, Android 8.1 (AOSP), arm64-v8a sowie die unten beschriebenen Root- und Wiederherstellungsverfahren. An einem 120P (Firmware `NSPanel120P_3.7.1`) am Gerät geprüft: `wm size` 750×1334, Dichte 240, `ro.board.platform=rk3326`.

:::note
Diese Seite empfiehlt im Fließtext keine Firmware-Version; maßgeblich ist der generierte [Firmware-Index](/de/hardware/firmware/). Das Flash-Verfahren ist bis einschließlich **4.4.0** an Hardware geprüft. Später indizierte Versionen wurden nur gegen das CDN geprüft und nie am Gerät geflasht. Mit Stand 2026-08-14 dokumentiert [Sonoffs öffentliches Änderungsprotokoll](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq) Versionen bis **4.6.0**; 4.6.2 und 4.8.0 wurden nur durch CDN-Abfragen gefunden. 4.7.0 wird nur in einem [eWeLink-Nutzerfeedback-Thread](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789) besprochen, also einer Diskussion und keiner Veröffentlichungsankündigung. **4.5.3** ist auf dem 120P ein ROM-Diff, auf dem 86P jedoch nur ein App-Update; **4.6.2** ist auf beiden Kanälen nur ein App-Update ohne ROM-Diff. Ein Upgrade erfolgt daher nicht immer in einem einzigen Schritt. Fehlt ein Build im Index, wurde er bei den Abfragen nicht gefunden; das CDN lässt sich nicht auflisten, daher beweist das Fehlen nie, dass ein Build nicht existiert.

**Community-Berichte beschreiben Neustartschleifen unter 4.5.1 und 4.5.2**, auf beiden Modellen in Abständen von etwa 10 bis 60 Minuten. Für 4.7.0 enthält der Feedback-Thread Berichte über Verbindungsprobleme mit Untergeräten nach dem Update, teils durch einen Neustart behoben, teils als anhaltend beschrieben. Diese wurden nicht reproduziert oder quantifiziert; behandle sie daher als ungeprüfte Nutzerberichte und nicht als bekannte Regression. Prüfe jede neuere Version an einem Panel, bevor du sie auf mehrere ausrollst; **4.0.12** bleibt der konservative Kontrollpunkt mit vollständigem ROM zum Festlegen einer Version.
:::

<a id="firmware-quirks-by-version"></a>

### Firmware-Besonderheiten nach Version

Verhalten, das sich zwischen eWeLink-Firmware-Versionen ändert, beginnend mit der ältesten. `ro.product.version` ist die **interne** ID (`NSPanel86P_x.y.z` oder `s6_android_x.y.z` auf dem 86P, `NSPanel120P_x.y.z` auf dem 120P), _nicht_ die Marketing- oder OTA-Nummer der eWeLink-App (4.0.12, 4.5.x). Erkennung und versionsabhängige Logik müssen `ro.product.version` lesen, nicht die Marketing-Zeichenfolge.

| Firmware                             | Besonderheit oder Verhalten                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Vorgehen                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Älter (vor 1.3.2)**                | Kein adb-Schalter in der App; Entwickleroptionen über die Oberfläche nicht erreichbar                                                                                                                                                                                                                                                                                                                                                                                                                                        | Aktiviere adb über den internen **OTG-Port** (Gehäuse öffnen); siehe [adb- und Root-Zugriff erhalten](#gaining-adb-and-root-access).                                                                                                                                                                                                                                                            |
| **Ab 1.3.2**                         | adb-Aktivierung in die eWeLink-App verlegt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | eWeLink, _Device Settings (Geräteeinstellungen)_, achtmal auf **Device ID (Geräte-ID)** tippen, Entwicklermodus, adb.                                                                                                                                                                                                                                                                           |
| **Ab 1.4**                           | Entwicklermodus aus der Oberfläche **entfernt**                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Aktiviere adb durch **fünfmaliges Aus- und Einschalten** während der Sonoff-Startanimation; siehe [adb- und Root-Zugriff erhalten](#gaining-adb-and-root-access).                                                                                                                                                                                                                               |
| **3.5.1 (86P, geprüft)**             | Das vorinstallierte System-WebView ist **Chromium 107.0.5304.105**, viel zu alt für ein modernes Home Assistant-Dashboard; andere Firmware kann abweichen                                                                                                                                                                                                                                                                                                                                                                    | Nutze das verwaltete WebView-Update oder die manuelle adb-Rückfalloption; siehe [WebView: zuerst aktualisieren](#webview-update-this-first). Der Zustandsbanner der Panel-App meldet ebenfalls WebView-Versionen unter Chromium 110.                                                                                                                                                            |
| **3.7.1 (120P, am Gerät)**           | Referenz-Build als Ausgangsbasis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `wm size` 750×1334, Dichte 240, `ro.board.platform=rk3326`.                                                                                                                                                                                                                                                                                                                                     |
| **4.0.0** (ausgerollt ab 2025-09-19) | Original-Firmware enthält den F-Droid-App-Store; deutlich schnellere Oberfläche                                                                                                                                                                                                                                                                                                                                                                                                                                              | Prüfe, dass sowohl **APP** _als auch_ **OS** die Version 4.0.0 oder neuer anzeigen.                                                                                                                                                                                                                                                                                                             |
| **4.0.12**                           | Abgestufte Näherungswerte auf dem **86P** wiederhergestellt; das **120P bleibt binär** (die Kernel unterscheiden sich je nach Modell)                                                                                                                                                                                                                                                                                                                                                                                        | Die konservative stabile Festlegung. Die Rohdatenform hängt von Modell und Firmware ab; die geführte Näherungseinrichtung kalibriert und normalisiert beide Formen. Siehe [Sensoren](#sensors-light-and-proximity-are-app-direct).                                                                                                                                                              |
| **4.5.1 und 4.5.2**                  | **Verbreitete Community-Berichte über Neustartschleifen** (etwa 10 bis 60 Minuten, beide Modelle); 4.5.2 ist eine reine App-Schicht auf 4.5.1                                                                                                                                                                                                                                                                                                                                                                                | Durch spätere Versionen abgelöst. Lege für maximale Stabilität **4.0.12** fest oder teste eine neuere Version zuerst an einem Panel.                                                                                                                                                                                                                                                            |
| **4.5.3**                            | Automatische Matter-Erkennung und Optimierungen der Bildschirmverwaltung; ROM-Diff auf dem 120P, aber nur App-Update auf dem 86P                                                                                                                                                                                                                                                                                                                                                                                             | Keine speziell 4.5.3 betreffenden Nachweise für Neustartschleifen; durch spätere Versionen abgelöst.                                                                                                                                                                                                                                                                                            |
| **4.6.0** (Juni 2026)                | **Lokales Webportal** (`nspanelpro.local`: LAN-Einrichtung, MQTT-Discovery-Export nach Home Assistant, Matter Bridge); CDN-Untersuchung fand Diffs von 4.0.12, 4.4.0 und 4.5.1                                                                                                                                                                                                                                                                                                                                               | In Sonoffs öffentlichem Änderungsprotokoll dokumentiert. **4.6.2** ist auf beiden Kanälen als reines App-Update ohne ROM-Diff indiziert; 4.6.1 wurde nicht gefunden.                                                                                                                                                                                                                            |
| **4.7.0** (Juli 2026)                | In einem eWeLink-Nutzerfeedback-Thread besprochen, aber **nicht in Sonoffs öffentlichem Änderungsprotokoll**; deckt Gen1- und Gen2-Panels ab; Nutzer melden ergänzte Unterstützung für Basic-gen-5-Relais (BASIC-1GS); CDN-Untersuchung fand eingehende Diffs von 4.0.12, 4.4.0, 4.5.1 und 4.6.0 auf beiden Modellen, zusätzlich 4.5.3 nur auf dem 120P                                                                                                                                                                      | Community-Berichte über Verbindungsprobleme mit Untergeräten, teils durch Neustart behoben, teils als anhaltend beschrieben; ungeprüft. Vor weiterem Ausrollen an einem Panel prüfen.                                                                                                                                                                                                           |
| **4.8.0** (August 2026)              | **Keine Veröffentlichungsankündigung und kein Änderungsprotokoll gefunden**; durch CDN-Abfragen entdeckt. Ein eWeLink-Mitarbeiterbeitrag vom 2026-07-16 im [Roadmap-Thread](https://forum.ewelink.cc/t/nspanel-pro-roadmap-and-co-created-future/206240) plante es für August und bestätigte eine Funktion: eine Option zur automatischen Panel-Aktualisierung über die eWeLink-App. CDN-Untersuchung fand eingehende Diffs von 4.0.12, 4.4.0, 4.5.1, 4.6.0 und 4.7.0 auf beiden Modellen, zusätzlich 4.5.3 nur auf dem 120P | Weitere Inhalte unbekannt; kein Feedback-Thread gefunden, daher keine Aussage zur Stabilität in die eine oder andere Richtung. Behandle die Version als unbewertet statt als unbedenklich. **Wird die automatische Aktualisierung aktiviert ausgeliefert, könnte ein Panel unbeaufsichtigt Firmware übernehmen**; prüfe diese Einstellung, bevor du dich auf eine festgelegte Version verlässt. |

:::note
Dies sind Besonderheiten des ursprünglichen 86P und 120P. Das NSPanel Pro **Gen2** (RK3326-**S**, zwei Relais, EFR32**MG24**) ist ein anderes Hardware-Ziel. Sonoff liefert Gen1 und Gen2 auf derselben Firmware-Versionslinie aus (4.7.0 deckt beide ab); leite daher keine separate Firmware-Linie ab und übertrage nicht jeden Hinweis zum Originalmodell. Das Profil des ursprünglichen NSPanel Pro passt auf jedes Panel mit PX30- oder RK3326-Platinenname, also auch auf ein Gen2 mit diesem Namen, bis es ein eigenes Profil hat. Dieses Profil wurde nicht auf einem Gen2 getestet und stellt dessen Relais nicht bereit.
:::

Verwandte Platinen der Tuya-Familie, **S6E** und **T6E** (Relaisvarianten; S6E ist ein T6E mit zwei Relais), das [**Smatek S9E**](/de/hardware/panels/smatek/s9e/) und das [**Tuya TPA10**](/de/hardware/panels/tuya/tpa10/) (RK3566, Cortex-A55, Android 11), sind eigenständige Ziele und führen keine NSPanel Pro-Firmware aus.

:::danger
Die Erkennung darf sich nicht auf `ro.product.model` stützen, weil beide Varianten `px30_evb` melden. Unterscheide 86P und 120P anhand von `ro.product.version`, Display-Kennwerten oder `ro.board.platform`. Auch das Näherungsverhalten unterscheidet sich nach Modell und Firmware. Die geführte Näherungseinrichtung kalibriert daher die aktuellen Messwerte und speichert das Ergebnis, statt einen firmwarespezifischen Klassifikator auszuwählen.
:::

<a id="gaining-adb-and-root-access"></a>

## adb- und Root-Zugriff erhalten

Anders als das TPA10 hat das NSPanel Pro **kein adb-Passwort**. Es wird als `userdebug`-Build mit Testschlüsseln (`ro.debuggable=1`) ausgeliefert, daher funktioniert `adb root` und `/system` kann neu eingehängt werden. Schwierig ist nur der _Zugang_ zu den Entwickleroptionen, die die eWeLink-Firmware je nach Version anders versteckt. Zusammengefasst aus blakadders Anleitungen ([Sideloading](https://blakadder.com/nspanel-pro-sideload/), [Geheimnisse](https://blakadder.com/nspanel-pro-secrets/)).

**Erster Zugangsweg (86P und 120P).** Ob sich Netzwerk-ADB auf TCP-Port 5555 ohne Computer aktivieren lässt, hängt von der Firmware ab; ein allgemeingültiger Schalter auf dem Panel ist nicht nachgewiesen. Der folgende eWeLink-Entwicklermodus-Weg ist für die genannte Firmware dokumentiert, belegt aber TCP5555 nicht für jeden späteren Build. Ist Netzwerk-ADB nicht verfügbar, verwende den dokumentierten USB-Weg für deine Firmware. Root-Befehle ermöglichen nicht den ersten Zugang.

**1. adb aktivieren.** Der Weg hängt von der Firmware ab:

- **Ältere Firmware:** Öffne das Gehäuse (hintere Schrauben entfernen und Touch-Stecker lösen), um den OTG-USB-Port freizulegen, und schließe einen Host an; adb funktioniert direkt über USB.
- **Firmware ab 1.3.2:** Öffne in der **eWeLink-App** die _Device Settings (Geräteeinstellungen)_ des Panels und tippe achtmal auf **Device ID (Geräte-ID)**, um den Entwicklermodus und damit adb wieder zu aktivieren.
- **Firmware ab 1.4** (Entwicklermodus entfernt): Schalte das Panel während der Sonoff-Startanimation **fünfmal** aus und ein, um einen Wiederherstellungsstart zu erzwingen, und führe in diesem Zeitfenster `adb install ultra-small-launcher.apk` aus. Lege diesen Launcher nach dem Neustart als Standard fest und tippe dann unter _Settings, System, About tablet, Build number (Einstellungen, System, Über das Tablet, Build-Nummer)_ siebenmal, um Entwickleroptionen wieder zu aktivieren und USB-Debugging einzuschalten.

**2. Zu Netzwerk-adb wechseln**, damit das Gehäuse geschlossen bleiben kann:

```bash
adb tcpip 5555
adb shell ip -o a            # find the panel IP
adb connect <panel-ip>:5555
adb shell su 0 setprop persist.adb.tcp.port 5555   # survive reboot (service prop resets)
```

**3. Root.** Da der Build `userdebug` ist, liefert `adb root` sofort eine adbd-Shell mit Root-Rechten. Die Panel-App ruft `su` aus ihrer Sandbox auf; installiere daher ein dauerhaftes `su` in `/system`. Getestet wurde **SuperSU `su` 2.76** unter `/system/xbin/su`:

```bash
adb root
adb disable-verity          # only if remount is refused; this reboots the panel
adb remount                 # or: adb shell mount -o remount,rw /system
adb push su /system/xbin/su
adb shell chmod 06755 /system/xbin/su
```

:::danger
Deaktiviere die eWeLink-Apps (`com.eWeLinkNSPro.dev`, `com.eWeLinkControlPanel`) erst, **nachdem** adb und `su` zuverlässig funktionieren und du einen anderen Weg zum Startbildschirm und zurück hast; die Navigationsaktionen der Panel-App decken das ab. Der **Zigbee-Gateway**-Stack von eWeLink ist von diesen Apps unabhängig und läuft weiter; verwalte ihn über den [Zigbee-Router-Schalter](#zigbee-gateway), statt ihn zu entfernen.
:::

<a id="webview-update-this-first"></a>

## WebView: zuerst aktualisieren

An einem frisch auf Firmware `3.5.1` (Build `164637`) geflashten 86P wurde `com.android.webview` **107.0.5304.105** (Chromium 107) festgestellt, zu alt für ein aktuelles Home Assistant-Dashboard. Andere Firmware und Modelle können abweichen. Prüfe daher den installierten Anbieter, bevor du über ein Update entscheidest. Die archivierten OTA-Diff-Pakete enthalten kein WebView-APK; diese Version wurde deshalb am laufenden Gerät mit `dumpsys webviewupdate` gelesen. Dieses Gerät nutzt nach einem adb-Update Chromium **138**. Über Home Assistant gestartete Installationen und Panel-App-Updates können eine verifizierte kompatible WebView installieren. Bleibt dieser Versuch unvollständig, wähle **Erneut versuchen** in der Update-Reparatur des Panels, um ihn fortzusetzen. Die manuelle Rückfalloption ist ein adb-Update; siehe [System-WebView aktualisieren](/de/hardware/guides/update-the-webview/#manual-fallback).

<a id="led"></a>

## LED

Auf diesem Gerät wurden weder ein RGB-Knoten unter `/sys/class/leds` noch `/dev/ledjni` gefunden. Damit ist auf dem NSPanel Pro **keine per App oder sysfs steuerbare RGB-LED charakterisiert** (vergleiche den `avsux`-Knoten des TPA10 und `/dev/ledjni` des WF1589T). Bildschirmhelligkeit und Hintergrundbeleuchtung verwenden die Android-Standardpfade.

<a id="sensors-light-and-proximity-are-app-direct"></a>

## Sensoren: Licht und Nähe direkt für die App zugänglich

Anders als beim TPA10, wo Temperatur und Luftfeuchtigkeit Root erfordern, stellt das NSPanel Pro seinen Sensortek-Kombisensor über den Standard-`SensorManager` bereit: `android.sensor.light`, `android.sensor.proximity` und `android.sensor.accelerometer`, alle ohne Root für normale Apps lesbar. Die Panel-App liest Licht und Nähe hier direkt. Ein Temperatur- oder Luftfeuchtigkeitssensor ist nicht verbaut.

:::note
**Näherungswerte hängen sowohl von der Firmware als auch vom Modell ab.** Der Sensor ist ein Sensortek STK3A5x in einer Aussparung der oberen Platine hinter dem Deckglas. Der Ruhewert variiert stark zwischen Geräten (bei einem etwa 1000, bei einem anderen etwa 4000); nur die _relative_ Änderung zählt. Ein hoher Ruhewert ist daher normal und kein Fehler. Bis etwa Firmware **3.3** meldet er abgestufte Werte im Abstand von etwa 50 ms; etwa zwischen **3.3 und 3.4** stellte der Kernel-Treiber auf binär 0 oder 1 um. **4.0.12 stellte abgestufte Werte nur auf dem 86P wieder her**; das **120P blieb binär**. Die geführte Näherungseinrichtung kalibriert beide Signalformen und speichert das Ergebnis. Danach normalisiert das Panel den nutzbaren Bereich über deine Panels hinweg. Profile enthalten daher keine firmwarespezifischen Schwellenwerte oder Klassifikatoren für abgestufte und binäre Werte. (Quellen: seakys Tools-Issues [142](https://github.com/seaky/nspanel_pro_tools_apk/issues/142), [144](https://github.com/seaky/nspanel_pro_tools_apk/issues/144), [171](https://github.com/seaky/nspanel_pro_tools_apk/issues/171) und [262](https://github.com/seaky/nspanel_pro_tools_apk/issues/262).)
:::

<a id="bound-i²c-devices"></a>

### Gebundene I²C-Geräte

| I²C-Adresse         | Treiber oder Name             | Bedeutung                                                       |
| ------------------- | ----------------------------- | --------------------------------------------------------------- |
| `0-0020`            | `rk809`                       | PMIC                                                            |
| `1-001a` / `1-005a` | `CST226` / `CST226SE`         | Kapazitiver Hynitron-Touch-Controller                           |
| `2-003c`            | `tp`                          | Touchpanel                                                      |
| `2-0046`            | `ls_stk3a5x` und `ps_stk3a5x` | Sensortek **STK3A5x**-Kombisensor für Umgebungslicht und Nähe   |
| `2-0047`            | `ls_stk3x3x` und `ps_stk3x3x` | Sensortek **STK3x3x** für Licht und Nähe (alternatives Bauteil) |

<a id="zigbee-gateway"></a>

## Zigbee-Gateway

Das NSPanel Pro hat ein eingebautes **Silicon Labs EFR32-Zigbee-3.0-Funkmodul** am UART `/dev/ttyS5`. Der Host-Stack des Herstellers (`/vendor/bin/siliconlabs_host/zgateway`) steuert es über einen lokalen MQTT-Broker. Die eWeLink-Apps nutzen denselben Stack, weshalb das Panel als eWeLink-Zigbee-Hub ausgeliefert wird.

Die Panel-App verwaltet es direkt. `switch.<panel>_zigbee_router` macht das Panel zu einem Zigbee-**Router**, der dein bestehendes Mesh erweitert (startet das Gateway und stellt die Repeater-Rolle sicher), und schaltet es wieder aus (stoppt das Gateway und gibt das Funkmodul frei). Dies erfolgt über den lokalen Broker, ohne Zugangsdaten und ohne direkten Zugriff auf `ttyS5`. Das Panel erscheint dann als normaler Router an deinem ZHA- oder Zigbee2MQTT-Koordinator.

:::note
Der Rollenwechsel ist **kein erneutes Flashen**: Es gibt keinen `.gbl`- oder Bootloader-Schritt; nur der EZSP-Knotentyp wird gesetzt. Für Firmware-Arbeiten auf Partitionsebene siehe [Firmware sichern und wiederherstellen](/de/hardware/guides/firmware-backup-and-restore/).
:::

:::note
**Ein Thread Border Router ist weder dokumentiert noch charakterisiert.** Der installierte Hersteller-Stack nutzt den EFR32 als Zigbee-NCP. Der EFR32MG21-Chip unterstützt mehrere Protokolle; das belegt jedoch weder Thread-Firmware noch einen Border Router auf dem Panel. Sonoff dokumentiert stattdessen eine Matter Bridge.

**Firmware 4.x hat den Zigbee-Stack überarbeitet.** Untersuchungen der Community fanden einen Zigbee2MQTT-Fork, ein geändertes lokales MQTT-Passwort und eine andere Startfolge. [Sonoff dokumentiert das Umschalten zwischen Koordinator und Router](https://sonoff.tech/blogs/news/nspanel-pro-v4-3-0-central-heating-redefining-whole-home-temperature-automation) in aktueller Firmware. Der Steuerpfad der Panel-App über den lokalen Broker wurde jedoch für 3.x und früher entwickelt und **muss unter 4.x möglicherweise angepasst werden**. (Community-Quellen: seakys Tools-Issues [241](https://github.com/seaky/nspanel_pro_tools_apk/issues/241), [244](https://github.com/seaky/nspanel_pro_tools_apk/issues/244) und [255](https://github.com/seaky/nspanel_pro_tools_apk/issues/255) sowie [roottool-Issue 3](https://github.com/seaky/nspanel_pro_roottool_apk/issues/3).)
:::

:::caution
**Ein Fehler im älteren Zigbee-Watchdog des Herstellers wurde von einem Melder auf einem NSPanel Pro 120 mit Original-Firmware 3.8.0 bestätigt.** Firmware mit der rekursiven `LD_LIBRARY_PATH`-Zuweisung aus [dessen Issue](https://github.com/panel-assistant/android/issues/34) kann schließlich jeden externen Befehl des Watchdogs mit `E2BIG` scheitern lassen, einen CPU-Kern auslasten und die Wiederherstellung eines ausgefallenen `zgateway` verhindern. Ein Neustart behebt das Problem nur vorübergehend. Siehe [Leistung optimieren](/de/manage/performance/) für Nachweise und Anforderungen an eine sichere Reparatur. Der Workaround des Melders wurde nicht unabhängig validiert. Community-Untersuchungen von 4.0.12 und 4.6.0 fanden die anfällige Zuweisung nicht.
:::

<a id="requirements-firmware-220-or-later"></a>

### Voraussetzungen: Firmware ab 2.2.0

Der Host-Stack ist das **herstellereigene** eWeLink- und Sonoff-Gateway, dessen Version zur Panel-Firmware passt (zum Beispiel `sonoff-v3.5.4`). Der Zigbee-**Routermodus** kam mit **NSPanel Pro-Firmware 2.2.0** (2023; eWeLink-App, _Device Settings, Pilot Features, Zigbee Mode (Geräteeinstellungen, Pilotfunktionen, Zigbee-Modus)_), die lokale Repeater-Unterstützung des Host-Stacks mit Gateway-Paket 1.1.9. In der Praxis:

- **Gateway vorhanden** (Firmware ab 2.2.0 oder per Sideload installiert): Die Panel-App erkennt es und stellt `switch.<panel>_zigbee_router` bereit. Schalte es ein, damit das Panel deinem Koordinator als Router beitritt.
- **Kein Gateway** (sehr alte Firmware, nie eingerichtet): Der Schalter **erscheint nicht**, weil er das vorhandene Startskript des Gateways voraussetzt. Aktualisiere die Firmware auf 2.2.0 oder neuer.

Die Panel-App **steuert** das Gateway; sie liefert oder installiert es nicht, weil es eine eWeLink-Binärdatei ist. Firmware 4.x ergänzt eine Matter Bridge und kann Zigbee-Geräte als Alternative zur Router-Rolle per MQTT Discovery nach Home Assistant exportieren.

<a id="gateway-health-and-automatic-containment"></a>

### Gateway-Zustand und automatische Eindämmung

Auf einem Zigbee-fähigen Panel meldet `sensor.<panel>_zigbee_gateway_health` den Zustand des Hersteller-Stacks unabhängig vom Router-Schalter. So bleibt ein nicht konfiguriertes Original-Gateway sichtbar, ohne der Panel-App das Stoppen zu erlauben.

Wenn der Router-Schalter ausdrücklich eingeschaltet wurde, gewährt die Panel-App 15 Minuten für Start und Kopplung. Danach prüft sie einmal pro Minute auf zwei Muster außer Kontrolle geratener Prozesse: ein ausdrücklich ungültiges oder nicht verbundenes Netzwerk zusammen mit mehr als 50 % eines CPU-Kerns bei fünf aufeinanderfolgenden Messungen oder mindestens drei Änderungen der Gateway-Prozess-ID innerhalb von zehn Minuten. Ein beigetretener Router mit dauerhaft hoher CPU-Auslastung erzeugt nur eine Warnung und läuft weiter. Unbekannte 4.x-Strukturen oder fehlende firmwarespezifische Beitrittsnachweise führen sicher zu `unknown`.

Das Einschalten des Zigbee-Router-Schalters fordert ausdrücklich den Repeater-Modus an, auch wenn das Hersteller-Gateway schon läuft. Wenn dein ZHA- oder Zigbee2MQTT-Koordinator dabei Beitritte erlaubt, wirkt es daher als neuer Beitrittsversuch, ohne einen zweiten Gateway-Supervisor zu starten.

Der Tab **Konfiguration** zeigt direkt unter dem Zigbee-Router-Schalter die Aktion **Beitritt anfordern**; der Schalter bleibt die einzige Ein-/Aus-Steuerung. Erlaube Beitritte in ZHA oder Zigbee2MQTT, fordere dann den Beitritt an und bestätige, dass Beitritte erlaubt sind. Die Aktion setzt den Repeater-Modus erneut, startet eine neue 15-minütige Schonfrist und fragt den Zustand ab; sie startet das Panel weder neu noch führt sie einen Neustart aus. Die Schaltfläche ist nicht verfügbar, wenn der Router deaktiviert oder bereits beigetreten ist oder nach einer kürzlichen Anforderung noch wartet.

Nach der Schonfrist erzeugt ein aktiviertes, weiterhin nicht beigetretenes Gateway eine dauerhafte Warnung auf dem Dashboard und im Tab **Installation**, verknüpft mit dieser Aktion unter **Konfiguration**. Lass es nicht in diesem Zustand, denn wiederholte Beitrittsversuche können erhebliche CPU-Last erzeugen. Lass das Panel entweder als Router beitreten oder schalte den Zigbee-Router-Schalter aus.

Erfüllt ein konfiguriertes älteres Gateway eine Regel für außer Kontrolle geratene Prozesse, schaltet die Panel-App den Router-Schalter dauerhaft aus und versucht eine begrenzte Eindämmung. Die herstellerspezifische Eindämmung kann nur den Sonoff-Wächter, `zgateway` und den zugehörigen lokalen Broker betreffen. Lässt sich ein Prozess nicht stoppen, wird sein Neustarter soweit möglich entfernt; überlebende Gateway-Arbeit wird auf nice 19 und Androids Hintergrund-cpuset herabgestuft. Späteres Einschalten des Router-Schalters startet eine neue Schonfrist und einen neuen Versuch.

Die Zustandsattribute umfassen Firmware- und Produktversion, Gateway-Struktur und Paketversion, Beitritts- und Rollenstatus, gerundete CPU-Last von Gateway und Wächter, Zahl jüngster Neustarts und Eindämmungsergebnis. Sie enthalten nie den Zigbee-Netzwerkschlüssel, rohe Zugangsdaten des lokalen Brokers, die MAC-Adresse des Funkmoduls oder rohe Gateway-`netinfo`.

<a id="migrating-from-nspaneltools"></a>

### Von NSPanelTools wechseln

Hat NSPanelTools das Sonoff-Gateway auf einem älteren Panel installiert, bleibt der Host-Stack in `/vendor` nach dem Entfernen von NSPanelTools erhalten. Entferne NSPanelTools, bevor du Bildschirm- und Sensorsteuerungen von Panel Assistant aktivierst, um doppelte Aktionen zu vermeiden. Panel Assistant kann das vorhandene Gateway steuern; bleibt der Zigbee-Router-Schalter eingeschaltet, startet es das Gateway beim Booten auch dann, wenn der frühere Boot-Hook entfernt wurde.

<a id="ezsp-host-stack-internals"></a>

### Interna des EZSP-Host-Stacks

Auf dem älteren herstellereigenen Stack (3.x und früher) läuft auf dem Funkmodul **EZSP-NCP-Firmware** (EFR32MG21, EZSP v8). `zgateway` ist eine EZSP-_Host_-Binärdatei in `/vendor/bin/siliconlabs_host/`, die ihr eigener Supervisor `guard_process.sh` am Leben hält (5-Sekunden-Schleife, beim Booten gestartet). Gesteuert wird sie über einen **lokalen mosquitto-Broker** auf `127.0.0.1:1883`. Der Broker ist anonym: Die Zeile `password_file` ist in `mosquitto.conf` auskommentiert. Der 4.x-Stack unterscheidet sich wie oben beschrieben.

- Rollenstatus: `zigbee/system/network-role/information` liefert `{"role":"Repeater"|"Coordinator"}`
- Rollenwechsel: Veröffentliche `{"role":"Repeater"}` auf `zigbee/system/network-role/switch`

„Repeater“ ist der Routermodus, der ein bestehendes Mesh erweitert; die Rolle bleibt im nichtflüchtigen Speicher des NCP erhalten. Das Hersteller-`zgateway` übersteht das Entfernen der eWeLink-_Apps_, weil es in `/vendor` und nicht in einem APK liegt.

Für einen vollständigen eigenständigen Zigbee2MQTT- oder ZHA-Koordinator _auf dem Panel_ siehe stattdessen [seaky/nspanel_pro_zigbee](https://github.com/seaky/nspanel_pro_zigbee), das den Host-Stack ersetzt. Dies benötigt mehr Ressourcen und entspricht nicht der Arbeitsweise der Panel-App.

<a id="access-model-summary"></a>

## Zusammenfassung des Zugriffsmodells

- **Licht, Nähe, Beschleunigungssensor:** direkt für die App zugänglich (`SensorManager`).
- **Bildschirmhelligkeit, Ruhezustand, Navigation, Sprachausgabe:** Android-Standardpfade (`su` zum vollständigen Ausschalten der Hintergrundbeleuchtung).
- **LED:** keine charakterisiert.
- **Zigbee:** EFR32-Funkmodul, über den lokalen Broker des Gateways auf dem Gerät verwaltet (`switch.<panel>_zigbee_router`).
- **Funk:** Zigbee 3.0, WLAN und Bluetooth.

<a id="performance-expectations"></a>

## Leistungserwartungen

Das NSPanel Pro hat für aufwendige Dashboards **begrenzte CPU- und RAM-Ressourcen**:

- Im Leerlauf läuft es mit 408 MHz und etwa 500 MB belegtem RAM; ein aufwendiges Dashboard belastet beides stark.
- **2 GB RAM sind die entscheidende Grenze.** Dashboard-WebView, Android und Hintergrund-Apps konkurrieren darum. Große Dashboards mit vielen Karten, großen Bildern, langen Verlaufsdiagrammen oder aufwendigen benutzerdefinierten Karten verursachen WebView-Neuladen und Ruckeln.
- Die A35-Kerne machen Seitenwechsel und Animationen sichtbar langsamer als auf A55- oder A72-Panels.

Beginne beim eingebauten Renderer mit dem unter [Leistung optimieren](/de/manage/performance/) beschriebenen automatischen Dashboard-Entitätsfilter, damit das Panel keine Zustände verarbeitet, die sein Dashboard nie zeigt. Nutze dann die Leistungskarten im Tab **Dashboard**, um verbleibende aufwendige Ansichten, Speicherdruck oder thermische Grenzen zu finden, bevor du das Dashboard vereinfachst.
