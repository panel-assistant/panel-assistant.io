---
title: Smatek S9E
description: Hardwaredaten des Smatek S9E, eines 10,1-Zoll-Unterputzpanels mit Rockchip RK3566, zwei Netzspannungsrelais, vier LED-beleuchteten Tasten, Radar-Näherungssensor, Zigbee, Ethernet und RS485.
vendor: Smatek
model: S9E
soc: Rockchip RK3566
android: '11'
screen: 10,1 Zoll, 1920 × 1200
support: Von der Community getestet
root: Relais, Tasten-LEDs, Näherung (su aus Apps laut Bericht funktionsfähig)
webview: Chromium 83 in 2024-07; 131 in 2025-12
released: 'nicht vor 2021 (geschätzt, RK3566-SoC)'
photos:
  - src: 'asset:hardware-smatek-s9e-front.jpg'
    alt: Smatek S9E, Vorder- und Rückseite mit Relais und Anschlussverdrahtung
photoCredit: 'Foto: Smatek'
sold_as_note: 'Zigbee-Version (Tuya) mit zwei Netzspannungsrelais, AC 100-240 V'
sold_as:
  - brand: Smatek
    name: 'S9E-NZ'
    note: 'Android-Version ohne Zigbee-Gateway: RS485, vier Tasten, AC 100-240 V'
  - brand: Smatek
    name: 'S9PE-NZ'
    note: 'Wie S9E-NZ, Stromversorgung über Ethernet (PoE) oder DC 9-24 V statt Netzspannung'
evidence: [firmware, documented, platform, owners]
sidebar:
  label: S9E
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Für die hier dokumentierten Versionen wurden keine Firmware-Versionshinweise des Herstellers gefunden. Der folgende Versionsvergleich beruht auf der Untersuchung der bereitgestellten Images, nicht auf einem Änderungsprotokoll des Herstellers.

:::note
Anders als die vollständig unterstützten Panels wurde das S9E **nicht** an einem vorliegenden Gerät per Reverse Engineering untersucht. Die Spezifikationen stammen von Smateks Produktseite, die Steuerungswege aus [seaky/nspanel_pro_tools_apk Issue 98](https://github.com/seaky/nspanel_pro_tools_apk/issues/98), dem Home Assistant-Community-Thread und Berichten. Ein Besitzer hat mit Firmware 1.1.0 die Relais und Tasten-LEDs aus Home Assistant geschaltet ([Issue 93](https://github.com/panel-assistant/android/issues/93)); behandle andere Einzelheiten der Steuerungswege bis zur Validierung als unbestätigt.
:::

Ein 10,1-Zoll-RK3566-Unterputzpanel mit **1920×1200**, derselben SoC-Familie wie das TPA10, **zwei eingebauten Netzspannungsrelais**, vier LED-beleuchteten Tasten, einem Radar-Näherungssensor und **Zigbee, Ethernet und RS485**.

## Erster Debugging-Zugang

**ADB über das Netzwerk auf TCP-Port 5555 ohne Computer: nicht nachgewiesen.** Weder Panels, auf denen Panel Assistant bereits läuft, noch ein Firmware-Build, der Root bietet, zeigen, wie das Debugging auf einem neuen Panel erstmals aktiviert wird.

**Auch das Verfahren für den ersten USB-Debugging-Zugang ist nicht nachgewiesen.** Frage den Lieferanten nach Debugging-Anweisungen für deine genaue Firmware und einer Bestätigung eines USB-Datenanschlusses. Bietet sie USB-Debugging, verwende den [USB-Installer](/de/install/install-over-usb/); gehe nicht davon aus, dass ein Ladeanschluss ADB bereitstellt. Hier liegt keine überprüfte Tastensequenz für ein Werksmenü vor.

Root-Prüfungen benötigen eine bereits funktionierende ADB-Verbindung. Root-Zugriff und der erste Debugging-Zugang sind getrennte Fragen.

## Auch verkauft als

Smatek S9E, Smatek S9, S9E-NZ (ohne Zigbee-Gateway), S9PE, S9PE-NZ (PoE-Variante), `Build.MODEL` S9, `Build.DEVICE` rk3566_r, `ro.product.version` S9_Android_1.0.2 und S9_Android_1.1.0.

:::tip
Die wichtigsten Fakten: Es teilt die **RK3566**-Plattform des TPA10, daher funktionieren App-Funktionen wahrscheinlich ohne S9E-spezifischen Code. Die **Relais schalten Netzspannungslasten** (Root-sysfs, von einem Besitzer unter 1.1.0 als funktionsfähig gemeldet). Die Tasten liefern KeyEvents **`F1` bis `F4`** (direkt an die App, ohne Root). Prüfe zuerst WebView: Die Firmware von 2024-07 enthält **Chromium 83**.
:::

|                  |                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC              | Rockchip **RK3566** (vier Cortex-A55-Kerne), dieselbe SoC-Familie wie das TPA10                                                                                                                                                                                                                                                                |
| RAM und Speicher | **2 GB** RAM, **16 GB** eMMC                                                                                                                                                                                                                                                                                                                   |
| Display          | **10,1 Zoll**, **1920×1200** Multitouch                                                                                                                                                                                                                                                                                                        |
| Android          | 11                                                                                                                                                                                                                                                                                                                                             |
| Verbindungen     | WLAN, Bluetooth, **Zigbee**, **RJ45-Ethernet**, **RS485** (auch eine PoE-Variante, das **S9PE**, ist erhältlich)                                                                                                                                                                                                                               |
| Sensoren         | Näherungs-**Radar**, Umgebungs-**Licht**, **Temperatur und Feuchtigkeit**                                                                                                                                                                                                                                                                      |
| Eingaben         | **4 physische Tasten** mit einzelnen LEDs                                                                                                                                                                                                                                                                                                      |
| Relais           | **2 eingebaute Netzspannungsrelais**                                                                                                                                                                                                                                                                                                           |
| Root             | Die Hersteller-App verwendet `execRootCmd`, daher ist Root verfügbar; manche Geräte werden mit entsperrtem Entwicklermodus ausgeliefert. Ein Besitzerbericht zeigt, dass `su` unter 1.1.0 aus einer normalen App-Sandbox erreichbar ist; das entscheidet, ob die Panel-App die sysfs-Knoten direkt steuert oder den Root-Hilfsdaemon benötigt. |
| Veröffentlichung | Nicht sicher datiert; die RK3566-SoC-Familie kam erst ungefähr 2021 auf den Markt, die beste gefundene zeitliche Untergrenze für dieses Panel ([Bericht zum RK3566-Datenblatt, CNX Software, Dezember 2020](https://www.cnx-software.com/2020/12/16/rockchip-rk3566-and-rk3568-datasheets-and-features-comparison/))                           |

:::danger
Die folgenden Steuerungsschnittstellen sind **Root-sysfs**-Schreibzugriffe, und die Relais schalten **Netzspannungslasten**. Die Unterstützung wurde anhand der gemeldeten Pfade implementiert; ein Besitzer meldet funktionierende Relais und Tasten-LEDs unter 1.1.0. Der `st_relay`-Pfad von 1.0.2 ist **unbestätigt**; validiere ihn auf deinem S9E, bevor du dich darauf verlässt.
:::

:::tip
Da das S9E dieselbe **RK3566**-Plattform wie das TPA10 nutzt, funktionieren die bestehenden appseitigen Funktionen der Panel-App wahrscheinlich ohne S9E-spezifischen Code, und Temperatur, Luftfeuchtigkeit und Licht sind möglicherweise über `SensorManager` verfügbar. Bei der älteren Firmware ist die mitgelieferte **WebView sehr alt (Chromium 83)**, daher wäre eine neuere Engine hilfreich. Auf diesem Modell wurde kein Verfahren zum Austausch verifiziert; Root und ein userdebug-Build allein belegen keine Kompatibilität. Die Firmware von 2025-12 wird mit Chromium 131 ausgeliefert, das keine Chromium-Sicherheitskorrekturen mehr erhält. Siehe [System-WebView aktualisieren](/de/hardware/guides/update-the-webview/).
:::

:::tip
Das S9E hat vier Funktionstasten an der Vorderseite, aber keine dokumentierte Wiederherstellungskombination aus Ein/Aus- und Lautstärketasten. Partitionstabelle, Root-Zugangsweg und Wiederherstellungsverfahren wurden noch nicht an echter Hardware erfasst. Übertrage daher die [Firmware-Sicherungsanleitung](/de/hardware/guides/firmware-backup-and-restore/) für TPA10 und WF1589T nicht unverändert darauf.
:::

## Firmwareversionen

Zwei Original-Images wurden analysiert. Es sind blockbasierte OTA-`.zip`-Dateien im AOSP-Format für dynamische Partitionen: Entpacke `.new.dat.br` mit `brotli -d`, das Super-Image mit `lpunpack` und durchsuche anschließend `build.prop` und die Init-`.rc`-Dateien mit `strings`. Beide melden `Build.MODEL` **`S9`** und `Build.DEVICE` **`rk3566_r`**, Android 11; der Hersteller-Buildcode steht in **`ro.product.version`**:

| Image                              | `ro.product.version` | Build                        | Relaisklasse          |
| ---------------------------------- | -------------------- | ---------------------------- | --------------------- |
| `S9_1920x1200_20240712_Android_US` | `S9_Android_1.0.2`   | `eng.*.20240712`             | `/sys/class/st_relay` |
| `S9_1920x1200_20251202_Android_US` | `S9_Android_1.1.0`   | `eng.xiaolp.20251202.160404` | `/sys/class/strelay`  |

:::caution
**Die sysfs-Klasse der Relais wurde zwischen den Firmwareversionen umbenannt.** Nur das **erste** Image (1.0.2) verwendet `/sys/class/st_relay`; **alle neueren** Images (1.1.0 und später) verwenden `/sys/class/strelay`, bestätigt durch [einen Bericht](https://github.com/panel-assistant/android/issues/3) und den Firmwarevergleich. Die Panel-App prüft beide Klassennamen und verwendet den vom Panel angebotenen; siehe [Relais](#relays-strelay-or-st_relay-class-root).
:::

Beide Images wurden vom Berichterstatter von Smatek weitergegeben: `S9_1920x1200_20240712_Android_US` (**1.0.2**) und `S9_1920x1200_20251202_Android_US` (**1.1.0**). Die ursprünglichen Smatek-Downloadlinks unter `docs.smatek.store:10001` sind nicht mehr erreichbar; frage Smatek-Support oder den Berichterstatter nach einer Kopie.

Der Vergleich zeigt, dass **sich nur `ro.product.version` und die Relaisklasse unterscheiden.** Alle anderen unten dokumentierten Steuerungspfade (Tastencodes, Tasten-LED-GPIOs, Näherungs-GPIO, Sensorverdrahtung) sind in beiden identisch. Eine Erkennung anhand eines mit `S9` beginnenden `ro.product.version` deckt daher die ganze Reihe ab.

<a id="relays-strelay-or-st_relay-class-root"></a>

## Relais: `strelay`- oder `st_relay`-Klasse (Root)

Die Panel-App stellt die beiden Netzspannungsrelais als `switch.<panel>_relay1` und `switch.<panel>_relay2` bereit, nur auf Panels mit der Relais-sysfs-Klasse.

:::note
**Der Klassenname hängt von der Firmware ab** (siehe [Firmwareversionen](#firmwareversionen)): `st_relay` im ersten 1.0.2-Image, `strelay` unter 1.1.0 und später. Die Panel-App prüft **beide** Namen und verwendet den vom Panel angebotenen.
:::

```bash
# firmware 1.1.0+ (most panels in the field)
echo 1 > /sys/class/strelay/relay1    # on
echo 0 > /sys/class/strelay/relay1    # off
echo 1 > /sys/class/strelay/relay2

# firmware 1.0.2 (initial release)
echo 1 > /sys/class/st_relay/relay1
```

## Tasten: KeyEvents `F1` bis `F4` (direkt an die App)

Die vier Tasten liefern die standardmäßigen Android-Tastencodes **131 bis 134**, `KEYCODE_F1` bis `KEYCODE_F4`. Die Erfassung über die Bedienungshilfe der Panel-App meldet sie an `event.<panel>_button` (Ereignistypen `KEYCODE_F1` bis `KEYCODE_F4`); verknüpfe damit Dashboard-Aktionen in Home Assistant. Die Ereignisse benötigen kein Root.

## LED: GPIO-Hintergrundbeleuchtung pro Taste

Jede Taste hat eine LED unter `/sys/class/gpio/gpio<16+keycode>/value`, also GPIO **147 bis 150** für F1 bis F4. Jede ist monochrom und nur ein- oder ausgeschaltet. Die Panel-App stellt sie als `light.<panel>_button_led1` bis `light.<panel>_button_led4` bereit (über `su` geschaltet), gezählt ab `hardware.button_led_gpio_base` im Profil. Die LEDs liegen **nicht** unter `/sys/class/leds`, das auf dem S9E nur die SD-Karten-LED `mmc2::` enthält; es sind rohe GPIOs.

:::note
**Firmwareanalyse:** Die Init-Skripte exportieren **nur `gpio113`**. Die Tasten-LED-Pins **gpio147 bis gpio150 werden beim Booten nicht exportiert**; ihre Knoten `/sys/class/gpio/gpioNNN/value` existieren daher erst nach dem Export. Die Panel-App exportiert jeden Pin bei Bedarf und setzt ihn vor dem ersten Schreiben als Ausgang. Deshalb funktionieren die LEDs trotz des fehlenden Exports beim Booten.
:::

```bash
echo 147 > /sys/class/gpio/export        # one-time, if the node is absent
echo 1 > /sys/class/gpio/gpio147/value   # button F1 LED on
```

:::tip
Die Firmware enthält außerdem eine **RGB-Status-LED** (`led_r`, `led_g`, `led_b`), einen **Vibrationsmotor** und **Ethernet-Aktivitäts-LEDs**. Die Panel-App stellt keine davon bereit.
:::

## Sensoren: Näherung kommt von GPIO 18, nicht aus `SensorManager`

:::caution
Ein Näherungssensor ist in `SensorManager` _registriert_ und meldet `Proximity=yes · Binary · 0/1 cm`, liefert auf dem S9E aber **niemals Ereignisse**. Live-Messwerte aus [einem Folgebericht](https://github.com/panel-assistant/android/issues/5) belegen, dass der Android-Pfad stumm bleibt. Der Lichtsensor desselben Panels funktioniert (etwa 46 lx); das Problem betrifft also nur die Näherung. Das echte Signal wird aus `gpio18` gelesen.
:::

Das echte Signal ist ein **Root-GPIO-Lesezugriff auf GPIO 18**. Der Kernel registriert einen Phantom-Android-Sensor, der nie auslöst; der Wert muss daher aus sysfs gelesen werden:

```bash
cat /sys/class/gpio/gpio18/value   # 1 = near, 0 = far  (no export needed — reporter-confirmed)
```

Das S9E-Profil deklariert deshalb `sensors.proximity_gpio: 18`, statt die tote `SensorManager`-Quelle zu verwenden. Der Root-Helfer hält den Wertdeskriptor geöffnet und streamt Änderungen sofort, wenn der Kernel GPIO-Flanken unterstützt; andernfalls prüft er denselben Deskriptor zweimal pro Sekunde. Der Verlust des Deskriptors wird ausdrücklich gemeldet, sodass Home Assistant den Sensor als nicht verfügbar anzeigt, bis der wiederhergestellte Helferstream seinen aktuellen Wert liefert. Das Signal verwendet dieselbe geführte Einrichtung und gespeicherte Kalibrierung wie Android-Sensoren; kalibrierte Anwesenheits- und Gestenausgaben werden nach erfolgreicher Einrichtung verfügbar. Ein Bericht bestätigte für gpio18 **0 fern, 1 nah**; die geführte Einrichtung misst die Endpunkte, statt eine Polarität zu erraten. Umgebungslicht, Temperatur und Feuchtigkeit erscheinen wie erwartet über `SensorManager`.

## Zugriffsmodell im Überblick

- **Relais:** `switch.<panel>_relay1` und `switch.<panel>_relay2` über die Relais-sysfs-Klasse (Root); sowohl `strelay` als auch `st_relay` werden geprüft.
- **Tasten:** `event.<panel>_button` (`KEYCODE_F1` bis `KEYCODE_F4`), direkt an die App über die Bedienungshilfe.
- **Tasten-LEDs:** `light.<panel>_button_led1` bis `light.<panel>_button_led4` über `su` (GPIO 147 bis 150, bei Bedarf exportiert).
- **Näherung:** ein kalibrierter `binary_sensor.<panel>_proximity` und ein normalisierter `sensor.<panel>_proximity_level` aus dem offengehaltenen `gpio18`-Ereignisstream des Root-Helfers. Der `SensorManager`-Näherungssensor ist registriert, löst aber nie aus und wird daher umgangen.
- **Licht:** `sensor.<panel>_illuminance` über `SensorManager`, der **funktioniert**.

## Quellen

- [Smatek-S9E-Bericht auf GitHub](https://github.com/panel-assistant/android/issues/3): `/diag` des Berichterstatters (Erkennungszeichenfolgen, `SensorManager`-Näherung), Umbenennung der Relaisklasse von `st_relay` zu `strelay` und die beiden Firmware-Images.
- Vom Berichterstatter geteilte Smatek-S9E-Originalfirmware: 1.0.2 (20240712) und 1.1.0 (20251202), die beiden analysierten Images. Die ursprünglichen Smatek-Downloadlinks (`docs.smatek.store:10001`) sind nicht mehr erreichbar.
- [seaky/nspanel_pro_tools_apk Issue 98, „Add Smatek S9E Support“](https://github.com/seaky/nspanel_pro_tools_apk/issues/98): Steuerungspfade für Relais (`st_relay`), Tasten (Tastencodes 131 bis 134), Tasten-LEDs (GPIO 147 bis 150) und Näherung (GPIO 18).
- [Home Assistant-Community: „Smatek S9E Touch Panel“](https://community.home-assistant.io/t/smatek-s9e-touch-panel/828244): WebView-Update, GPIO-18-Näherungsskripte, Integrationshinweise.
- [Smatek-S9E-Produktseite](https://smatek.com/product/10-1-inch-smart-control-panel-s9e/) und [S9PE-NZ-PoE-Variante](https://smatek.com/product/10-1-inch-android-panel-s9e-nz/): SoC, RAM und Speicher, Display, Sensoren, Verbindungen.
- [Smatek-S9E-Datenblatt (PDF)](https://smatek.com/wp-content/uploads/2025/03/Smatek-S9E-10-Super-Smart-Control-Panelin-wall-SPEC.pdf): ein reiner Bildscan ohne extrahierbaren Text, aber das ursprüngliche Datenblatt.
