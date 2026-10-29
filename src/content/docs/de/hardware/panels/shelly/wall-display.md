---
title: Shelly Wall Display (original)
description: Hardwaredaten zum ursprünglichen Shelly Wall Display, einem 4-Zoll-Panel mit MT6580 und Android 7, Codename Stargate.
vendor: Shelly
model: Wall Display (original)
soc: MT6580
android: '7.0'
screen: 4 Zoll, 480 × 480
support: Untersucht
root: Nicht nachgewiesen; userdebug-Basisbuild, unbestätigt
webview: 'com.google.android.webview 119.0.6045.194 über offizielles ZIP'
released: '2023-09 (geschätzt)'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: Shelly Wall Display, ursprüngliches Modell mit H&T-Sensorzubehör
  - src: 'asset:hardware-shelly-wall-display-rear-label.jpg'
    alt: Shelly Wall Display, Rückseite mit Modelletikett und Unterputzdose
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display (original)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Nur untersucht: Kein Gerät dieses Modells wurde getestet.** Auf der [Seite zur Wall Display-Familie](/de/hardware/panels/shelly/) findest du Quellen, den OTA-Mechanismus der Firmware, das Zugangsmodell und Sicherheitshinweise für die gesamte Reihe.
:::

:::caution
**Wird mit Android 7.0 ausgeliefert** und liegt damit unter der von Panel Assistant unterstützten Android-Mindestversion.
:::

Das ursprüngliche Wall Display, Firmware-Codename **Stargate**, ist das Einstiegsmodell der [Shelly Wall Display-Familie](/de/hardware/panels/shelly/): ein 4-Zoll-Panel mit 480×480 Pixeln, MediaTek MT6580 und Android 7. Es gehört wie das [X2](/de/hardware/panels/shelly/wall-display-x2/) zum älteren **WallDisplay**-OTA-Zweig (armeabi-v7a).

## Erster Debugging-Zugang

**Netzwerk-ADB auf TCP-Port 5555 ohne Computer: bei diesem Modell nicht nachgewiesen.** Auch das erste USB-Debugging und das Entsperren über das Herstellermenü sind hier nicht verifiziert. Das [X2i-Verfahren](/de/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) ist nur am X2i bestätigt; gemeinsame Firmware beweist nicht, dass es hier funktioniert. Frage Shelly nach dem Verfahren für dein Modell und deine Firmware. Nutze das [USB-Installationsprogramm](/de/install/install-over-usb/) erst, wenn USB-Debugging und eine USB-Datenverbindung verfügbar sind. Ein rootfähiger Build allein aktiviert kein Debugging.

## Auch erhältlich als

Shelly Wall Display, SAWD-0A1XX10EU1, Firmware-Codename Stargate, Geräte-ID k400_mt6580_32_n.

|            |                                                                                                                                                                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | MediaTek **MT6580**                                                                                                                                                                                                                                                                                 |
| Bildschirm | **480×480 quadratisch**, 4 in                                                                                                                                                                                                                                                                       |
| Android    | 7.0                                                                                                                                                                                                                                                                                                 |
| ABI        | armeabi-v7a                                                                                                                                                                                                                                                                                         |
| Sensoren   | Temperatur, Feuchtigkeit und Umgebungslicht dokumentiert; Bereitstellung über die Android-API nicht verifiziert                                                                                                                                                                                     |
| Relais     | 1 Ausgang                                                                                                                                                                                                                                                                                           |
| WebView    | Nicht im regulären OTA; Shelly veröffentlicht ein separates ZIP zur Installation von `com.google.android.webview` **119.0.6045.194**                                                                                                                                                                |
| Root       | Bei diesem Modell nicht nachgewiesen. Das OTA deklariert einen `userdebug`-Basisbuild (`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`), daher könnte `adb root` funktionieren, **wenn** eine adb-Verbindung hergestellt werden kann. An einem Gerät ist dies jedoch nicht bestätigt.  |
| Erschienen | Etwa September 2023 (geschätzt); Shelly zeigte das Wall Display erstmals auf der IFA Berlin im September 2023 ([Bericht zu Shellys IFA-Berlin-2023-Angebot, Maison et Objet Domotique](https://www.maison-et-domotique.com/en/157856-shelly-11-new-products-in-wi-fi-bluetooth-and-zwave-ifa2023/)) |

Auf der [Seite zur Wall Display-Familie](/de/hardware/panels/shelly/) findest du die vollständige Begründung des Zugangsmodells, die OTA-Update-Endpunkte (`WallDisplay`-Zweig) und den Versionsverlauf der Firmware.

## Quelle

[Shelly Wall Display Wissensdatenbank](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
