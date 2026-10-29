---
title: Shelly Wall Display X1i
description: Hardwaredaten zum Shelly Wall Display X1i, einem 4-Zoll-Panel mit RK3326-S und Android 11, Codename Cally.
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 Zoll, 720 × 720
support: Ungetestet
root: Bei diesem Modell nicht nachgewiesen
webview: 'Nicht nachgewiesen (der WallDisplayV2-Zweig enthält kein OTA-WebView-Paket)'
released: '2026-07 (geschätzt)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x1i-front.jpg'
    alt: Shelly Wall Display X1i, Vorderseite
  - src: 'asset:hardware-shelly-wall-display-x1i-silver.jpg'
    alt: Shelly Wall Display X1i, silberne Ausführung, Vorderseite
  - src: 'asset:hardware-shelly-wall-display-x1i-rear-label.jpg'
    alt: Shelly Wall Display X1i, Rückseite mit dem Modelletikett SAWD-6A1XX10EU0
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display X1i
  order: 3
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Kein Gerät dieses Modells wurde getestet.** Auf der [Seite zur Wall Display-Familie](/de/hardware/panels/shelly/) findest du Quellen, den OTA-Mechanismus der Firmware, das Zugangsmodell und Sicherheitshinweise für die gesamte Reihe.
:::

Das Wall Display X1i, Firmware-Codename **Cally**, ist ein 4-Zoll-Panel mit 720×720 Pixeln, Rockchip RK3326-S (Cortex-A35) und Android 11. Es gehört zum modernen **WallDisplayV2**-OTA-Zweig (arm64-v8a), gemeinsam mit [X2i](/de/hardware/panels/shelly/wall-display-x2i/), [XL](/de/hardware/panels/shelly/wall-display-xl/), Maverick und Dayna, und hat Zugriff auf den integrierten AppStore.

## Erster Debugging-Zugang

**Netzwerk-ADB auf TCP-Port 5555 ohne Computer: bei diesem Modell nicht nachgewiesen.** Auch das erste USB-Debugging und das Entsperren über das Herstellermenü sind hier nicht verifiziert. Das [X2i-Verfahren](/de/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) ist nur am X2i bestätigt; gemeinsame Firmware beweist nicht, dass es hier funktioniert. Frage Shelly nach dem Verfahren für dein Modell und deine Firmware. Nutze das [USB-Installationsprogramm](/de/install/install-over-usb/) erst, wenn USB-Debugging und eine USB-Datenverbindung verfügbar sind. Ein rootfähiger Build allein aktiviert kein Debugging.

## Auch erhältlich als

Shelly Wall Display X1i, Firmware-Codename Cally.

|            |                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Rockchip **RK3326-S**, Cortex-A35                                                                                                                                                                                                                                                                                                                                                           |
| Bildschirm | **720×720 quadratisch**, 4 in                                                                                                                                                                                                                                                                                                                                                               |
| Android    | 11                                                                                                                                                                                                                                                                                                                                                                                          |
| ABI        | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                                   |
| Sensoren   | Umgebungslicht und Näherung dokumentiert; kein Temperatur- oder Feuchtigkeitssensor; Bereitstellung über die Android-API nicht verifiziert                                                                                                                                                                                                                                                  |
| Relais     | Austauschbarer Sockel: standardmäßig 1 Ausgang, optionaler Sockel mit 2 Ausgängen                                                                                                                                                                                                                                                                                                           |
| Root       | Bei diesem Modell nicht nachgewiesen; das moderne OTA deklariert keinen Build-Typ. Bei einem mit Werksfirmware 2.5.4 getesteten [Wall Display X2i](/de/hardware/panels/shelly/wall-display-x2i/) lassen sich Entwickleroptionen und USB-Debugging über die Einstellungen-App freischalten; adb verbindet sich dann weiterhin ohne Root. Ob das auch für dieses Modell gilt, ist ungetestet. |
| Erschienen | Etwa Juli 2026 (geschätzt); Shelly kündigte das X1i am 15. Juli 2026 an ([Bericht zur Vorstellung, TechBuzz Ireland, Juli 2026](https://techbuzzireland.com/2026/07/15/shelly-expands-its-smart-home-portfolio-with-wall-display-x1i-and-blu-motion-zb/))                                                                                                                                   |

Ab Panel Assistant 1.0 verwendet das X1i das gemeinsame Shelly-Profil. Es übernimmt die am [X2i](/de/hardware/panels/shelly/wall-display-x2i/) gewonnenen Erkenntnisse über diese Firmware: vollständiges Ausschalten des Bildschirms ohne Root sowie Zurück und Home ohne Übersicht der letzten Apps. Die eigenen Sensoren werden beim Start von Panel Assistant auf dem Panel geprüft. Noch wurde kein X1i bestätigt; ein Bericht eines Besitzers ist daher willkommen. Siehe [Was das X2i für den Rest der Reihe bedeutet](/de/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Auf der [Seite zur Wall Display-Familie](/de/hardware/panels/shelly/) findest du die vollständige Begründung des Zugangsmodells, die OTA-Update-Endpunkte (`WallDisplayV2`-Zweig) und den Versionsverlauf der Firmware.

## Quelle

[Shelly Wall Display X1i Wissensdatenbank](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
