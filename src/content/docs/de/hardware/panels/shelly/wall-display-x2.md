---
title: Shelly Wall Display X2
description: Hardwaredaten zum Shelly Wall Display X2, einem 6,9-Zoll-Panel mit SC7731E und Android 8.1, Codename Pegasus.
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 Zoll, 1440 × 720
support: Ungetestet
root: Bei diesem Modell nicht nachgewiesen
webview: 'Nicht nachgewiesen (der WallDisplay-Zweig enthält kein OTA-WebView-Paket für dieses Modell)'
released: '2025-01 (geschätzt)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, Vorderseite
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Kein Gerät dieses Modells wurde getestet.** Panel Assistant ordnet es dem mitgelieferten älteren Shelly-Profil zu, das noch auf keinem X2 ausgeführt wurde. Auf der [Seite zur Wall Display-Familie](/de/hardware/panels/shelly/) findest du Quellen, den OTA-Mechanismus der Firmware, das Zugangsmodell und Sicherheitshinweise für die gesamte Reihe.
:::

Das Wall Display X2, Firmware-Codename **Pegasus**, ist ein 6,9-Zoll-Panel mit 1440×720 Pixeln, Spreadtrum/UNISOC SC7731E (Cortex-A7) und Android 8.1. Es gehört wie das [Original](/de/hardware/panels/shelly/wall-display/) zum älteren **WallDisplay**-OTA-Zweig (armeabi-v7a).

## Erster Debugging-Zugang

**Netzwerk-ADB auf TCP-Port 5555 ohne Computer: bei diesem Modell nicht nachgewiesen.** Auch das erste USB-Debugging und das Entsperren über das Herstellermenü sind hier nicht verifiziert. Das [X2i-Verfahren](/de/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) ist nur am X2i bestätigt; gemeinsame Firmware beweist nicht, dass es hier funktioniert. Frage Shelly nach dem Verfahren für dein Modell und deine Firmware. Nutze das [USB-Installationsprogramm](/de/install/install-over-usb/) erst, wenn USB-Debugging und eine USB-Datenverbindung verfügbar sind. Ein rootfähiger Build allein aktiviert kein Debugging.

## Auch erhältlich als

Shelly Wall Display X2, SAWD-2A1XX10EU1, Firmware-Codename Pegasus, Geräte-ID e500_7731e_32u_o.

|            |                                                                                                                                                                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                                           |
| Bildschirm | **1440×720**, 6.9 in                                                                                                                                                                                                                               |
| Android    | 8.1                                                                                                                                                                                                                                                |
| ABI        | armeabi-v7a                                                                                                                                                                                                                                        |
| Sensoren   | Temperatur, Feuchtigkeit, Umgebungslicht und Näherung dokumentiert; Bereitstellung über die Android-API nicht verifiziert                                                                                                                          |
| Relais     | 1 Ausgang                                                                                                                                                                                                                                          |
| Root       | Bei diesem Modell nicht nachgewiesen; speziell für dieses Modell liegt kein OTA-Nachweis zum Build-Typ vor                                                                                                                                         |
| Erschienen | Etwa Januar 2025 (geschätzt); mit Shellys Gen4-Reihe auf der CES 2025 angekündigt ([Shellys eigene CES-2025-Presseseite](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)) |

Auf der [Seite zur Wall Display-Familie](/de/hardware/panels/shelly/) findest du die vollständige Begründung des Zugangsmodells, die OTA-Update-Endpunkte (`WallDisplay`-Zweig) und den Versionsverlauf der Firmware.

## Quelle

[Shelly Wall Display X2 Wissensdatenbank](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
