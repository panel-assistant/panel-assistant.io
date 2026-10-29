---
title: Sonoff NSPanel Pro 86P
description: Hardwaredaten zum Sonoff NSPanel Pro 86P, einem quadratischen 480×480-Rockchip-PX30-Panel mit integriertem Zigbee-Funk.
vendor: Sonoff
model: NSPanel Pro 86P
soc: Rockchip PX30
android: '8.1'
screen: 4 Zoll, 480 × 480, nur Hochformat
support: Vollständig
root: userdebug, kein adb-Passwort; su zum Ausschalten der Hintergrundbeleuchtung
webview: Chromium 107 auf 3.5.1; LineageOS 138 manuell installieren
released: '2022-09 (geschätzt)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-front.jpg'
    alt: Sonoff NSPanel Pro 86P, Vorderseite, an der Wand montiert
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-black-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, schwarze Ausführung, schräge Ansicht mit Einbautiefe
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-white-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, weiße Ausführung, schräge Ansicht mit Einbautiefe
photoCredit: 'Foto: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 86P
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Das **86P** ist die quadratische Variante der [Sonoff NSPanel Pro](/de/hardware/panels/sonoff/)-Reihe, benannt nach der EU-86-mm-Unterputzdose. Diese Seite enthält nur die eigenen technischen Daten und die Unterschiede zum [120P](/de/hardware/panels/sonoff/nspanel-pro-120p/). Alles Weitere (Root-Verfahren, WebView-Update, LED, Sensoren, Zigbee-Gateway, Firmwarebesonderheiten) ist einmal auf der [Familienseite](/de/hardware/panels/sonoff/) dokumentiert, auf die die Abschnitte dieser Seite zurückverweisen.

## Auch erhältlich als

NSPanel Pro 86, NSPanel Pro 86P, NSPanel120P (86P-Angebote verwenden diese Zeichenfolge gelegentlich ebenfalls), NSPanel Pro Gen1, px30_evb, SN-RKPX30-NSP-01, nspanel-pro. Nicht mit dem NSPanel Pro Gen2 oder den Tuya-S6E- und -T6E-Platinen verwechseln; dies ist andere Hardware.

|            |                                                                                                                                                                                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Rockchip **PX30**                                                                                                                                                                                                                                                                                             |
| CPU        | 4× **Cortex-A35** mit bis zu **1.512 GHz** (im Leerlauf 408 MHz)                                                                                                                                                                                                                                              |
| GPU        | **Mali-G31** (am Gerät bestätigt)                                                                                                                                                                                                                                                                             |
| Bildschirm | **480×480 quadratisch** (1:1), etwa 4 Zoll, 160 dpi (mdpi, gut auf etwa 170 physische ppi abgestimmt), 60 Hz, eine **480×480 dp** große Fläche                                                                                                                                                                |
| RAM        | **2 GB** (etwa 1960 MB nutzbar)                                                                                                                                                                                                                                                                               |
| Speicher   | eMMC; `/data` etwa 3.5 GB                                                                                                                                                                                                                                                                                     |
| Android    | 8.1 (API 27)                                                                                                                                                                                                                                                                                                  |
| ABI        | arm64-v8a                                                                                                                                                                                                                                                                                                     |
| Funk       | **Zigbee 3.0** (Silicon Labs EFR32-Koordinator, siehe [Familienseite](/de/hardware/panels/sonoff/#zigbee-gateway)), WLAN, Bluetooth. Kein NFC, IR, Ethernet oder Mobilfunk.                                                                                                                                   |
| Erschienen | Etwa September 2022 (geschätzt); Vorbestellungen begannen im August 2022, der Versand war ab 20. September 2022 geplant ([Bericht zur Vorbestellung, CNX Software, August 2022](https://www.cnx-software.com/2022/08/12/sonoff-nspanel-pro-android-control-panel-doubles-as-wifi-zigbee-smart-home-gateway/)) |

`ro.product.model` und `ro.product.device` melden beide `px30_evb`, einen gemeinsamen Rockchip-Platinennamen und _keine_ zuverlässige Unterscheidung zwischen 86P und 120P; `ro.product.version` meldet die 86P-spezifische Form `NSPanel86P_x.y.z` oder bei manchen Firmwareversionen `s6_android_x.y.z`. OTA wird bis einschließlich **4.0.12** als vollständiges ROM ausgeliefert; spätere indexierte Versionen werden als Diffs oder reine App-Updates ausgeliefert (siehe [Firmwareseite](/de/hardware/firmware/nspanel-pro/)). Die Näherungsfirmware des 86P **erhielt mit 4.0.12 wieder Entfernungsmesswerte** (das 120P blieb unter 4.x binär); siehe [Sensoren](/de/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) auf der Familienseite.

:::note
Der Cortex-A35 ist ein Effizienzkern mit deutlich geringerem Durchsatz pro Takt als der A55 (TPA10) oder A72 (WF1589T). Mit 2 GB RAM liegt die NSPanel Pro-Reihe bei der Leistung **auf Einstiegsniveau** unter den vollständig unterstützten Panels; siehe [Leistungsvergleich](/de/hardware/#performance-comparison).
:::

## Erster Debugging-Zugang

Netzwerk-ADB auf TCP-Port 5555 ohne Computer hängt von der installierten Firmware ab; ein universeller Schalter ist nicht nachgewiesen. Folge den [Schritten für den ersten ADB-Zugang zum NSPanel Pro](/de/hardware/panels/sonoff/#gaining-adb-and-root-access), einschließlich des firmwarespezifischen USB-Verfahrens, wenn kein Netzwerkzugang verfügbar ist. Die späteren Root-Schritte erfordern eine bestehende Debugging-Verbindung.
