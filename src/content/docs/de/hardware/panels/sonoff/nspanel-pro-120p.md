---
title: Sonoff NSPanel Pro 120P
description: Hardwaredaten zum Sonoff NSPanel Pro 120P, einem 750×1334-Rockchip-RK3326-S-Panel im Hochformat mit integriertem Zigbee-Funk.
vendor: Sonoff
model: NSPanel Pro 120P
soc: Rockchip RK3326-S
android: '8.1'
screen: 4.7 Zoll, 750 × 1334, Hochformat, Querformat verfügbar
support: Vollständig
root: userdebug, kein adb-Passwort; su zum Ausschalten der Hintergrundbeleuchtung
webview: Chromium 107 auf 3.5.1; LineageOS 138 manuell installieren
released: '2024-08 (geschätzt)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-120p-front.jpg'
    alt: Sonoff NSPanel Pro 120P, weiße und schwarze Ausführung, Vorderseite, an der Wand montiert
photoCredit: 'Foto: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 120P
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Das **120P** ist die hohe Variante der [Sonoff NSPanel Pro](/de/hardware/panels/sonoff/)-Reihe, benannt nach der EU-120-mm-Unterputzdose. Diese Seite enthält nur die eigenen technischen Daten und die Unterschiede zum [86P](/de/hardware/panels/sonoff/nspanel-pro-86p/). Alles Weitere (Root-Verfahren, WebView-Update, LED, Sensoren, Zigbee-Gateway, Firmwarebesonderheiten) ist einmal auf der [Familienseite](/de/hardware/panels/sonoff/) dokumentiert, auf die die Abschnitte dieser Seite zurückverweisen.

## Auch erhältlich als

NSPanel Pro 120, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, SN_3326S, nspanel-pro-ver120. Nicht mit dem NSPanel Pro Gen2 oder den Tuya-S6E- und -T6E-Platinen verwechseln; dies ist andere Hardware.

|            |                                                                                                                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Rockchip **RK3326-S** (dieselbe PX30/RK3326-Familie wie das 86P; `ro.board.platform=rk3326`, Gerätebaum `rockchip,px30`)                                                                                                        |
| CPU        | 4× **Cortex-A35** mit bis zu **1.512 GHz** (im Leerlauf 408 MHz)                                                                                                                                                                |
| GPU        | **Mali-G31** (am Gerät bestätigt)                                                                                                                                                                                               |
| Bildschirm | **750×1334** im Hochformat, **240 dpi** (Überschreibung 250); Querformat verfügbar; etwa 1 cm schmaler und länger als das 86P                                                                                                   |
| RAM        | **2 GB** (etwa 1960 MB nutzbar)                                                                                                                                                                                                 |
| Speicher   | eMMC; `/data` etwa 3.5 GB                                                                                                                                                                                                       |
| Android    | 8.1 (API 27)                                                                                                                                                                                                                    |
| ABI        | arm64-v8a                                                                                                                                                                                                                       |
| Funk       | **Zigbee 3.0** (Silicon Labs EFR32-Koordinator, siehe [Familienseite](/de/hardware/panels/sonoff/#zigbee-gateway)), WLAN, Bluetooth. Kein NFC, IR, Ethernet oder Mobilfunk.                                                     |
| Erschienen | Etwa August 2024 (geschätzt); ab etwa 14. August 2024 auf Sonoffs Website erhältlich ([Bericht zur Markteinführung, haade.fr, August 2024](https://haade.fr/en/blog/special-discount-new-sonoff-nspanel-pro-120-on-itead-site)) |

`ro.product.model` und `ro.product.device` melden beide `px30_evb`, einen gemeinsamen Rockchip-Platinennamen und _keine_ zuverlässige Unterscheidung zwischen 120P und 86P; `ro.product.version` meldet die 120P-spezifische Form `NSPanel120P_x.y.z` (OTA-Kanal `nspanel-pro-ver120`, vollständiges ROM `SN_3326S_750X1334_…`). Ansonsten entspricht die OTA-Form dem 86P (siehe [Firmwareseite](/de/hardware/firmware/nspanel-pro/)). Die Näherungsfirmware des 120P **blieb unter 4.x binär** (das 86P erhielt mit 4.0.12 wieder Entfernungsmesswerte; die Kernel unterscheiden sich je Modell); siehe [Sensoren](/de/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) auf der Familienseite. Direkt an einem 120P verifiziert (Firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, Dichte 240, `ro.board.platform=rk3326`.

:::note
Der Cortex-A35 ist ein Effizienzkern mit deutlich geringerem Durchsatz pro Takt als der A55 (TPA10) oder A72 (WF1589T). Mit 2 GB RAM liegt die NSPanel Pro-Reihe bei der Leistung **auf Einstiegsniveau** unter den vollständig unterstützten Panels; siehe [Leistungsvergleich](/de/hardware/#performance-comparison).
:::

## Erster Debugging-Zugang

Netzwerk-ADB auf TCP-Port 5555 ohne Computer hängt von der installierten Firmware ab; ein universeller Schalter ist nicht nachgewiesen. Folge den [Schritten für den ersten ADB-Zugang zum NSPanel Pro](/de/hardware/panels/sonoff/#gaining-adb-and-root-access), einschließlich des firmwarespezifischen USB-Verfahrens, wenn kein Netzwerkzugang verfügbar ist. Die späteren Root-Schritte erfordern eine bestehende Debugging-Verbindung.
