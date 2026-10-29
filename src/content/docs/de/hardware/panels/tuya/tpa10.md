---
title: Tuya TPA10
description: Hardwaredaten des Tuya TPA10, eines 10,1-Zoll-Panels mit Rockchip rk3566, RGB-LED, fünf Tasten, Kamera und Sensoren für Temperatur, Feuchtigkeit und Näherung.
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10,1 Zoll, 1920 × 1200
support: Vollständig
root: su vorhanden; Helfer für LED, Klima, fünfte Taste
webview: Chrome 83; Austausch mit Root zu LineageOS 150
released: '2023-08 (geschätzt)'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10, Vorderseite mit seitlicher Tastenleiste
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Tuya TPA10, flache Vorderansicht mit seitlicher Tastenleiste und Rahmenkante
photoCredit: 'Foto: Tuya'
sold_as:
  - brand: Tuya
    name: 'TPA10-M2'
    note: 'Tuyas Katalogbezeichnung'
  - brand: Tuya
    name: 'Control Panel MAX'
    note: 'Bezeichnung im Handel und FCC-Eintrag'
evidence: [bench, mostly-open, firmware, documented, owners]
sidebar:
  label: TPA10
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Für dieses Panel wurden keine Firmware-Versionshinweise des Herstellers gefunden. Die Firmwareangaben auf dieser Seite sind Beobachtungen am untersuchten Gerät.

Ein großzügiges rk3566-Panel mit **10,1 Zoll und 1920×1200**, einer einzelnen RGB-LED an der Vorderseite, monochromer Tastenbeleuchtung, umfangreicher Sensorik (Time-of-Flight-Näherung, Temperatur und Feuchtigkeit, Umgebungslicht), Kamera und fünf physischen Tasten. Es hat kein Zigbee, NFC oder IR. An einem laufenden Gerät per Reverse Engineering untersucht (Android 11, gerootet, `su` vorhanden).

## Auch verkauft als

Tuya TPA10, TPA10, TPA10-M2 (M2A, M2E, M2U, M2X), TPA10 Control Panel MAX, Control Panel MAX, Panel MAX, rk3566-Tuya-Panel, SmartOS Xinch (Herstellerpakete `com.smartos.xinch.setting`, `com.smartos.xinch.hardware`, `com.smartos.xinch.platform.ethernet`), `com.tuya.devicetest`.

:::tip
Die wichtigsten Fakten: ADB ist **passwortgeschützt**, verwende daher die USB-Hintertür über die Diagnose-App. Die LED und die nur mit Root zugänglichen Sensoren benötigen den **Root-Hilfsdaemon `hapaneld-helper`**. Schreiben von `custom_animation` für die vordere LED kann **das Panel neu starten** (siehe Warnung unten). Aktualisiere **zuerst WebView**; siehe [WebView: zuerst aktualisieren](#webview-update-this-first).
:::

|                  |                                                                                                                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC              | Rockchip **rk3566**                                                                                                                                                                                                  |
| Display          | **1920×1200** (16:10 Querformat), etwa 10,1 Zoll, **etwa 226 physische ppi**, 56 Hz. Androids werkseitige logische Basisdichte beträgt **240 dpi** (häufig für die Dashboardgröße überschrieben; empfohlen sind 212) |
| Android          | 11 (API 30)                                                                                                                                                                                                          |
| ABI              | armeabi-v7a (32-Bit-Userspace)                                                                                                                                                                                       |
| Funk             | WLAN, Bluetooth und BLE sowie eine Herstellerfunktion `com.smartos.xinch.platform.ethernet` (kabelgebunden, PoE). **Kein Zigbee, NFC, IR oder Mobilfunk.**                                                           |
| Root             | `su` verfügbar; LED und sysfs-Sensoren gehören `system:system`, daher ist ein **Root-Hilfsdaemon erforderlich** (siehe unten).                                                                                       |
| Veröffentlichung | Etwa August 2023 (geschätzt); FCC-ID 2A789-TPA10, geführt als „Control Panel MAX“, wurde ungefähr am 22. August 2023 genehmigt ([FCC-Zulassungsdatensatz 2A789-TPA10](https://fccid.io/2A789-TPA10))                 |

:::tip
Du willst die Firmware eines Panels ohne Tasten ändern? Lies zuerst [Firmware sichern und wiederherstellen](/de/hardware/guides/firmware-backup-and-restore/). Das TPA10 (rk3566, Android 11, 7,28 GB eMMC `mmcblk2`) hat einen überprüften, softwareseitig gestarteten Loader-Zugangsweg über `adb reboot loader` und `rkdeveloptool`. Die versenkte [Lochtaste](#buttons) ist keine Linux-Eingabe; ihr Verhalten beim Werksreset oder Maskrom-Einstieg wurde nicht sicher bestätigt. Verlasse dich daher nicht auf sie als Wiederherstellungsweg.
:::

## ADB- und Root-Zugriff erhalten

Das TPA10 wird mit **passwortgeschütztem** ADB und ausgeschaltetem Netzwerk-ADB ausgeliefert. Der zuverlässige Erstzugang ist die USB-Hintertür der Diagnose-App, ohne Passwortberechnung. `su` ist bereits vorhanden; sobald du ADB-Zugriff hast, hast du Root. Zusammengefasst aus [seaky/nspanel_pro_tools_apk Issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123).

**Erster Zugangsweg.** Es gibt keinen überprüften Weg, Netzwerk-ADB auf TCP-Port 5555 ohne Computer zu aktivieren. Verwende zuerst USB nach dem folgenden Diagnose-App-Verfahren; die späteren Root-Befehle machen Netzwerk-ADB erst nach dieser ersten Verbindung dauerhaft.

**1. Entwickleroptionen aktivieren.** Einstellungen, _Info_, siebenmal auf Build- oder Versionsnummer tippen.

**2. Erstzugang über die USB-Hintertür der Diagnose-App (empfohlen).** Die Entwickleroptionen bieten eine Tuya-Engineering-**Diagnose-App** mit ausschließlich chinesischer Oberfläche. Solange diese App geöffnet ist, ist ADB über den **USB**-Port _ohne_ Passwort erlaubt; die Sitzung hat bereits Root. Verbinde USB und führe aus:

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

ADB-Root des TPA10 funktioniert über USB zuverlässiger als über das Netzwerk.

**3. ADB dauerhaft aktivieren (Root, ohne Passwort, der zuverlässige Weg).** Mit der Diagnose-App im Vordergrund hast du eine gerootete ADB-Sitzung (`su` ist vorhanden; auch `adb root` funktioniert, weil es ein `userdebug`-Build ist). Mache damit ADB dauerhaft verfügbar, sodass du Test-App und Passwort nicht mehr brauchst. Dies übersteht das Schließen der Diagnose-App **und** einen vollständigen Neustart, überprüft an einem laufenden Gerät. Übertrage es und führe es als Root aus:

```bash
# persist-adb.sh — run via the diagnostics-app backdoor:
#   adb push persist-adb.sh /data/local/tmp/ && adb shell su 0 sh /data/local/tmp/persist-adb.sh
settings put global adb_enabled 1                   # USB debugging, persisted in /data
settings put global development_settings_enabled 1  # keep Developer options visible
setprop persist.adb.tcp.port 5555                   # network adb on :5555 — persist.* survives reboot

# Pre-authorise each controlling machine so NO on-screen "Allow USB debugging" is needed after reboot.
# Append the contents of every workstation's ~/.android/adbkey.pub (one key per line):
mkdir -p /data/misc/adb
cat >> /data/misc/adb/adb_keys <<'KEYS'
PASTE-EACH-adbkey.pub-LINE-HERE
KEYS
chmod 640 /data/misc/adb/adb_keys
chown system:shell /data/misc/adb/adb_keys 2>/dev/null
restorecon /data/misc/adb/adb_keys 2>/dev/null

setprop ctl.restart adbd                            # apply now (and it auto-starts every boot)
echo "adb persisted: adb_enabled=$(settings get global adb_enabled) tcp=$(getprop persist.adb.tcp.port)"
```

Für den Netzwerkweg muss das Panel im WLAN sein. Danach funktioniert `adb connect <panel-ip>:5555` von jedem vorab autorisierten Rechner aus, auch über Neustarts hinweg und bei geschlossenen Hersteller-Apps. Löschen von `/data` oder ein Werksreset entfernt `adb_keys` und `adb_enabled`; führe das Skript danach erneut aus.

:::caution
**Das Passwort für „Enable ADB“ in den Entwickleroptionen ist kein nutzbarer Zugangsweg; versuche daher nicht, es zu berechnen.** Das Community-Rezept in [Issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) lässt sich nicht reproduzieren. Das Dekompilieren von `checkDevPassword` in `com.smartos.xinch.setting` bestätigt seine _Form_: `base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))`, dann `takeLast(6)`, ohne Beachtung der Groß-/Kleinschreibung (oder `takeLast(ro.tuya.uuid,6)`, wenn `deviceId` leer ist). Die verwendete `deviceId` ließ sich aber keiner lesbaren Kennung zuordnen: `ro.serialno`, `android_id` und `ro.tuya.key` wurden an einem laufenden Gerät sämtlich abgelehnt. Der Logger der App ist **nicht** logcat, daher lässt sich der erwartete Wert auch nicht am Gerät auslesen. Das Beispiel im Issue enthält außerdem einen Tippfehler (`11a` plus `xia` als `11xia`; richtig ist `11axia`). Verwende die obige Root-Methode, die das Passwort bedeutungslos macht.
:::

:::danger
Deaktiviere die Herstellerpakete `com.smartos.xinch.*` erst als **allerletzten Schritt**, nachdem du zuverlässiges ADB _und_ einen Ersatz für die Hardwaretasten bestätigt hast. Das Deaktivieren der Hardware- oder Einstellungs-Apps vor zuverlässigem ADB kann dich aussperren. Die Fernnavigationsaktionen der Panel-App (Zurück, Startbildschirm) sowie ihre Entitäten für Tastenbeleuchtung und LED ersetzen die Funktionen der Hersteller-App.
:::

:::note
Die Apps des Herstellers auf dem Gerät waren _keine_ nützliche Reverse-Engineering-Quelle. `com.tuya.devicetest` ist odexiert (kein dex im APK); `com.smartos.xinch.hardware` enthält das Tuya-**AVS-(Alexa)-SDK** (`libLibSampleApp.so`, 17 MB) und einen Tastenleser (`libjnimain.so`). Maßgeblich sind die selbstdokumentierenden sysfs-Knoten des Geräts selbst.
:::

<a id="webview-update-this-first"></a>

## WebView: zuerst aktualisieren

Das ursprüngliche WebView ist **Chrome 83**, viel zu alt für ein aktuelles Home Assistant-Frontend. Das Dashboard bleibt daher leer oder fehlerhaft, bis du es ersetzt. Empfohlen ist **LineageOS System WebView 150** (`armeabi-v7a`), eine aktuelle, gepflegte, unveränderte Chromium-Engine. Ziehe es Cromite vor: Cromite ändert Chromiums Autoplay-Inhaltseinstellung auf _blockieren_, wodurch Home Assistant-Kamerakarten (WebRTC) erst nach Antippen starten. LineageOS erlaubt Autoplay, sodass Kamerastreams selbstständig starten.

Das TPA10 hat in WebView begrenzte Reserven für Videodecodierung. Mehrere sichtbare 720p-WebRTC-Karten können Frames verlieren oder einen Stream auf sein erstes Bild warten lassen, obwohl ein einzelner Stream funktioniert. Verwende dann niedrig aufgelöste Substreams, weniger gleichzeitig automatisch startende Karten oder Schnappschüsse, die bei Antippen zu Livevideo wechseln.

Lade es vom Mirror herunter (stabile URL):

```
https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

### Warum eine einfache Installation nicht funktioniert

WebView ist als `com.android.webview` paketiert und muss daher den Systemanbieter **ersetzen**; beide naheliegenden Wege scheitern auf diesem Android-11-Panel:

- `adb install -r` wird mit `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match` abgelehnt. Android erlaubt ein Update von `com.android.webview` nur mit einem APK, das mit **demselben Schlüssel** wie die installierte Version signiert ist; jeder WebView-Anbieter verwendet einen anderen Schlüssel. Aus demselben Grund **kann ein einfacher Sideload diesen ersten Austausch nicht leisten**: Er installiert über `pm install`, was das Panel blockiert. Der folgende Austausch ist ein **einmaliger** manueller Schritt. Sobald LineageOS installiert ist, lassen sich spätere LineageOS-Versionen mit `adb install -r` installieren, da sie denselben Signierer verwenden.
- Die Freigabeliste des ROM akzeptiert nur `com.android.webview`, nicht die Variante `com.google.android.webview`; ein Google-Build wird daher installiert, aber niemals ausgewählt.

### Funktionierendes Root-Verfahren: Datei ersetzen und Signatursperre aufheben

Das Panel hat eine Signatursperre, lässt sich aber rooten: Die App kann kein `su` ausführen, eine Shell dagegen schon (`adb shell su root <cmd>`). Das Verfahren legt das neue APK am _System_-WebView-Platz ab und löscht seinen Eintrag aus der Paketdatenbank. PackageManager registriert es dadurch beim Neustart **neu** und liest konfliktfrei die eigene Signatur des neuen APK.

```bash
IP=<panel-ip>:5555
adb connect $IP
adb -s $IP shell su root id                           # confirm it prints uid=0(root)

# 1. push the new WebView, and back up the current WebView + package database first:
adb -s $IP push lineageos-webview-150.0.7871.63-arm.apk /data/local/tmp/wv-new.apk
adb -s $IP shell su root sh -c 'cp /product/app/webview/webview.apk /data/local/tmp/webview.bak;
                                cp /data/system/packages.xml /data/local/tmp/packages.xml.bak'

# 2. replace the system WebView APK (remount /product read-write first — verity must already be off;
#    a never-modified panel needs a one-time `adb root && adb disable-verity && adb reboot` beforehand):
adb -s $IP shell su root sh -c 'mount -o rw,remount /product;
    cp /data/local/tmp/wv-new.apk /product/app/webview/webview.apk;
    chmod 644 /product/app/webview/webview.apk; chown root:root /product/app/webview/webview.apk;
    restorecon /product/app/webview/webview.apk'

# 3. remove the single <package name="com.android.webview" …>…</package> element from packages.xml.
#    Do NOT hand-edit it — pull it, let a parser remove exactly that element, then push it back:
adb -s $IP shell su root sh -c 'cp /data/system/packages.xml /data/local/tmp/pkgs.xml; chmod 644 /data/local/tmp/pkgs.xml'
adb -s $IP pull /data/local/tmp/pkgs.xml packages.xml
python3 - <<'PY'
import xml.etree.ElementTree as ET
d = open('packages.xml', encoding='utf-8').read()
m = '<package name="com.android.webview"'
assert d.count(m) == 1, 'expected exactly one com.android.webview package'
s  = d.find(m); ls = d.rfind('\n', 0, s) + 1                      # start of that line
e  = d.find('</package>', s) + len('</package>'); le = d.find('\n', e) + 1  # end of its closing line
new = d[:ls] + d[le:]
ET.fromstring(new)                                                # abort if the result isn't valid XML
open('packages.xml', 'w', encoding='utf-8').write(new)
print('removed com.android.webview; XML still valid')
PY
adb -s $IP push packages.xml /data/local/tmp/pkgs.new
adb -s $IP shell su root sh -c 'cp /data/local/tmp/pkgs.new /data/system/packages.xml;
    chown system:system /data/system/packages.xml; chmod 660 /data/system/packages.xml;
    restorecon /data/system/packages.xml'

# 4. reboot — PackageManager registers the new WebView fresh:
adb -s $IP reboot
```

**Falls etwas schiefgeht**, stelle mit den Sicherungen aus Schritt 1 wieder her: Kopiere `/data/local/tmp/webview.bak` zurück über `/product/app/webview/webview.apk` und `/data/local/tmp/packages.xml.bak` zurück über `/data/system/packages.xml` (mit denselben `chown`, `chmod` und `restorecon`), und starte neu.

:::danger
**Die gemeldete WebView-Version ist nach diesem Verfahren falsch; vertraue ihr nicht.** `Einstellungen, WebView` und `adb shell dumpsys webviewupdate` zeigen weiterhin **`83.0.4103.120`**, weil ein manuell installiertes SystemWebView **die ursprünglichen OEM-Werte für `versionName` und `versionCode` übernimmt**, um die Mindestversionsprüfung des Panels zu passieren und ausgewählt zu werden. Die _tatsächliche_ Engine ist 150. Prüfe sie über:

- **User-Agent:** Öffne auf dem Panel eine beliebige „What's my user agent“-Seite; der UA enthält `Chrome/150.0.7871.63`.
- **Die Panel-App:** Die Statusseite und `/diag` des Panels zeigen über dessen gemeldeten HTTP-Port (standardmäßig 8888) `engine Chromium 150.0.7871.63`, weil sie den UA statt der übernommenen Paketversion lesen.

Ein einfacher ADB-Sideload funktioniert auf diesem signaturgesperrten Panel **nicht**. Cromite 147 bleibt im Mirror als Rückfalloption, mit demselben Verfahren und einem anderen APK.
:::

## LED

### RGB-LED: `avsux`-Treiber (Root-Hilfsdaemon)

Die vordere RGB-LED ist eine **einzelne** LED (`avsux_info` meldet `led type:[single] nums:[1]`) am Plattformtreiber `leds_pwm_avs` (Gerät `avsux`), bereitgestellt unter `/sys/class/leds/avs-pwm-led/`.

:::danger
Es wurde beobachtet, dass das Schreiben von `custom_animation` nach `avsux_select` **das Panel neu startet**. Verwende `avsux_animation` für Farben und behandle `avsux_select` und `custom_animation` außer bei Tests als schreibgeschützt.
:::

Es gibt **keinen für Apps zugänglichen `/dev`-Knoten** für die LED (vergleiche `/dev/ledjni` des [WF1589T](/de/hardware/panels/electron/wf1589t/)); die sysfs-Attribute gehören `system:system`, sodass eine `untrusted_app` nicht schreiben kann. Die Panel-App verwendet deshalb einen kleinen **Root-Hilfsdaemon** (`/system/bin/hapaneld-helper`, als Root mit Unix-Socket); `SocketLedController` ist der Client. Siehe die [Helferdokumentation](https://github.com/panel-assistant/android/blob/main/helper/README.md).

#### sysfs-Attribute von `avs-pwm-led`

| Attribut          | Berechtigungen     | Verwendung                                                |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | Gesamtpegel 0 bis 255                                     |
| `avsux_animation` | `system:system` rw | Sicherer Farb- oder Animationsschreibzugriff              |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | Listet benannte Animationen (`bootanime`, `idle`)         |
| `avsux_info`      | r                  | Metadaten (LED-Anzahl und -Typ)                           |

### Tastenbeleuchtung

`/sys/class/leds/button-backlight/brightness` ist ein **monochromer** PWM-Ausgang, 0 bis 255 (Standardtreiber `leds_pwm`, Gerät `pwmleds`). Er gehört `system:system` mit 0664 und wird daher über denselben `hapaneld-helper`-Daemon gesteuert.

## Sensoren

Näherung und Umgebungslicht sind direkt über `SensorManager` für Apps zugänglich. Temperatur und Feuchtigkeit sind nur mit Root zugänglich (Eingabesubsystem und I²C) und benötigen den Hilfsdaemon.

:::tip
Der CHT8305 macht dieses Panel zu einem nutzbaren **Raumtemperatur- und Luftfeuchtigkeitssensor** für Home Assistant. Der Hilfsdaemon liest ihn mit seinem Verb `CHT8305`: einem punktuellen `EVIOCGABS`-Lesezugriff auf die Eingabeachse `ABS_THROTTLE` des Treibers, der die Eingabegeräte `temperature` und `humidity` nach Namen findet. Die Panel-App bietet dann in Home Assistant die optionalen Sensoren **Raumtemperatur** und **Raumluftfeuchtigkeit** (Konfiguration, Diagnose; standardmäßig aus). Die erweiterte Einstellung **Raumtemperaturversatz** oder `sensors.room_temp_offset_c` im Profil korrigiert die Eigenwärme des Panels.
:::

Der Time-of-Flight-Sensor des TPA10 macht Näherung tatsächlich distanzbasiert, die Android-HAL quantisiert sie aber. Die geführte Näherungseinrichtung auf dem Panel erfasst und speichert die freien und nahen Endpunkte und die Richtung des aktiven Sensors. Danach meldet das Panel dieselbe normalisierte Skala wie jedes unterstützte Panel, statt sich auf einen festen gerätespezifischen Grenzwert zu verlassen.

### Sensorchips und Zugriffswege

| Sensor                      | Chip                                                                          | Zugriff                                                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Näherung (Time of Flight)   | Vishay **VI5300** (i2c-3 `0x6c`, `proximity_vi5300`, 30-ms-Abfrage)           | Android-`SensorManager` `TYPE_PROXIMITY`, ohne Root. Die Rohdistanz in mm am I²C-Knoten des Treibers (`…/i2c-3/3-006c`) benötigt Root. |
| Temperatur und Feuchtigkeit | **CHT8305** (`temperature_cht8305` an 3-0040, `humidity_cht8305` an 3-0040-1) | **Nicht** in `SensorManager`; Meldung über das **Eingabesubsystem** an I²C, nur Root.                                                  |
| Umgebungslicht              | **CG5256** (`light_cg5256`)                                                   | Android-`SensorManager`-Lichtsensor, ohne Root.                                                                                        |

<a id="buttons"></a>

## Tasten

Das TPA10 hat **drei Klassen** physischer Tasten, am Gerät mit `getevent` bestätigt:

- **Die vier seitlichen Tasten:** `adc-keys`, standardmäßige KeyEvents auf `F1` bis `F4`, ohne Sonderweg vom Bedienungshilfen-Tastenfilter der Panel-App erfasst.
- **Die fünfte (orange) Taste:** ein `EV_SW`-_Schalter_, keine Taste, über den evdev-Leser des Root-Hilfsdaemons gelesen und als Ereignis an Home Assistant gesendet.
- **Die Lochtaste** (versenkt neben dem USB-C-Port): keine Android-Eingabe und daher für Home Assistant nicht verfügbar.

### Einzelheiten pro Taste

**1. Die vier seitlichen Tasten sind `adc-keys` und senden standardmäßige KeyEvents.** Sie liegen am **SARADC** des rk3566 (`fe720000.saradc`), Gerät `adc-keys1` (`/dev/input/event7`), Scancodes `59` bis `62`. Das ursprüngliche `Generic.kl` ordnet sie **`F1` bis `F4`** zu, die zu Android-`KEYCODE_F1` bis `KEYCODE_F4` werden; die Panel-App erfasst sie über ihren Bedienungshilfen-Tastenfilter. Auf einem Gerät mit `su` lassen sie sich durch Bearbeiten von `/system/usr/keylayout/Generic.kl` neu zuordnen (beispielsweise auf `BRIGHTNESS_*` oder `VOLUME_*`).

**2. Die fünfte (orange) Taste ist ein Schalter, keine Taste.** An `gpio-keys` (`/dev/input/event8`) meldet sie **`EV_SW` `SW_MUTE_DEVICE`** (Schaltercode `14`), ein _einrastendes_ Ereignis, **kein** `EV_KEY`. Deshalb existiert kein Keylayout-Eintrag, und Android-Bedienungshilfen sehen sie nie. Sie schaltet die Mikrofone physisch stumm, unabhängig von der Übermittlung der Bedienungshilfen-Tastenereignisse. Die Panel-App liest sie über den evdev-Leser des Root-Hilfsdaemons (`WATCH /dev/input/event8`, `sw=true`) und sendet bei jedem Umschalten ein Home Assistant-Ereignis (`KEYCODE_MUTE`), durchgängig validiert. Dies ist **Originalverhalten**, zum Zeitpunkt der Erstellung nirgendwo sonst dokumentiert.

**3. Die Lochtaste (versenkt neben dem USB-C-Port) ist keine Android-Eingabe.** Sie fehlt in `getevent`, `gpio-keys` und `dmesg`, sodass Home Assistant sie nicht nutzen kann. Ihre elektrische Funktion wurde nicht sicher bestätigt. Position und rk3566-Plattform deuten auf eine Reset- oder Bootmodus-Funktion hin; es gibt aber keine überprüfte Haltedauer, kein bestätigtes Werksreset-Verhalten und kein Maskrom-Einstiegsverfahren. Drücke oder halte sie nicht in der Annahme, sie böte einen wiederherstellbaren Flash-Zugangsweg. Verwende den überprüften softwareseitigen Loader-Zugang, solange Android noch startet, und beachte die Grenzen unter [Firmware sichern und wiederherstellen](/de/hardware/guides/firmware-backup-and-restore/).

## Kamera

GalaxyCore **GC05A2 / GC5035**, ein Sensor mit 2592×1944. Android meldet über den Provider `legacy/0` (`device@3.3`) eine Kamera mit Hardwarestufe `LIMITED`, nur `BACKWARD_COMPATIBLE`, `Facing: Back`, ohne Blitz und Autofokus.

:::note
Die eigenen Funktionsflags der Firmware sind falsch: Das Panel deklariert `android.hardware.camera.front`, während die HAL `Facing: Back` meldet. Entscheide anhand des Geräteprofils und der tatsächlich von `CameraManager` aufgelisteten Geräte, niemals anhand von `hasSystemFeature`.
:::

1280×720 wird in allen drei Formaten angeboten: `IMPLEMENTATION_DEFINED`, `YUV_420_888` und `BLOB`; Vorschau- und Einzelbildformate sind damit verfügbar. Die HAL meldet für eine 720p-`BLOB`-Aufnahme bei 30 fps eine Verzögerung von einem Frame. Diese Herstellerangabe zur Einzelbildaufnahme misst nicht die Kosten des H.264-Streams der Panel-App. `android.control.aeAvailableTargetFpsRanges` bietet nur `[15 30]` und `[30 30]`: Es gibt keinen festen 15-fps-Sensormodus; ein 15-fps-Stream entsteht daher durch zeitliche Steuerung des Encoders, nicht des Sensors.

Der einzige Hardware-H.264-Encoder ist `OMX.rk.video_encoder.avc`, bereitgestellt von der OMX-IL-HAL (dieses Panel hat einen `media.codec`-Prozess und keinen Codec2-Herstellerdienst). Er deklariert `176x144` bis `1920x1088` bei `16x8`-Ausrichtung, einen gemeldeten Bitratenbereich von 1 bps bis 10 Mbps und vier gleichzeitige Instanzen. Es gibt **keinen Hardware-HEVC-Encoder**; der einzige HEVC-Eintrag ist der Softwareencoder `c2.android.hevc.encoder`, ausgeliefert mit `enabled="false"`.

:::caution
Behandle die Herstellerwerte aus `media_codecs_performance.xml` als Vorlage, nicht als Messung: Hardware- und Software-AVC-Encoder melden bei 720×480 und 1280×720 identische `measured-frame-rate`-Werte, was keine echte Messung sein kann. Gehe von 720p aus, bis du auf deinem eigenen Panel anderes gemessen hast.
:::

Ein Panel, das Kamerakarten anzeigt, ist nicht untätig. Auf einem gemessenen Dashboard hielt die Panel-App zwei aktive `OMX.rk.video_decoder.avc`-Instanzen; eine Encodierung konkurriert daher auf derselben Rockchip-VPU mit bereits laufenden Decodierungen.

Die Panel-App kann diese Kamera als **standardmäßig ausgeschaltete** Funktion bereitstellen. Der Schalter **Kamera** auf der Kamerakarte unter **Konfiguration** aktiviert sie, mit Standardwerten für **Auflösung**, **Bildrate** und **Bitrate** (720p, 15 fps, 2000 kbps) und einer **Belichtung**skorrektur. Sie stellt unter `rtsp://<panel>:8554/live` einen H.264-Stream bereit, mit Raumton, wenn Mikrofonzugriff verfügbar und erlaubt ist. Home Assistant bezieht darüber Standbilder über die Kameraentität des Panels. Solange die Kamera geöffnet ist, zeigt das Panel eine rote Anzeige, die Seiteninhalt nicht verdecken kann. Siehe die [Steuerungsreferenz](/de/reference/api/) zur Kameraentität.

:::caution
Füge keine Home Assistant-Kamerakarte für **dieses** Panel auf dem eigenen Dashboard **dieses** Panels hinzu. Das Panel würde seine eigene Encodierung auf derselben Videoeinheit in einer Schleife decodieren, ohne Nutzen.
:::

## Weitere Chips

Kamera GalaxyCore **GC05A2 / GC5035**; Audio-Codec **ES7202** (Aufnahme-ADC; Sprache aus Panelnähe und Assist wurden nach Aufhebung der Stummschaltung mit der orangefarbenen Hardwaretaste über Android-Aufnahme verifiziert; Fernfeldaufnahme und Verhalten bei Hintergrundmusik bleiben unqualifiziert); Goodix-Touch; `rk808` und `rk860` als PMIC.

## Zugriffsmodell im Überblick

- **LED und Tastenbeleuchtung:** nur Root (`system:system`-sysfs), über `hapaneld-helper`.
- **Näherung und Umgebungslicht:** direkt für Apps (`SensorManager`).
- **Temperatur, Feuchtigkeit:** nur Root (Eingabesubsystem und I²C), über den Hilfsdaemon.
- **Tasten:** Die vier seitlichen Tasten sind direkt für Apps zugänglich (KeyEvents über Bedienungshilfen); die fünfte orange Taste ist ein `EV_SW`-Schalter, gelesen über die evdev-Beobachtung von `hapaneld-helper`; die Lochtaste ist keine Eingabe.
