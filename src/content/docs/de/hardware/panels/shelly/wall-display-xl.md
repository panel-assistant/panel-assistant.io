---
title: Shelly Wall Display XL
description: Hardwaredaten zum Shelly Wall Display XL, einem 10,1-Zoll-Panel mit RK3566 und Android 11, Codename Blake.
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 Zoll
support: Ungetestet
root: Bei diesem Modell nicht nachgewiesen
webview: 'Nicht nachgewiesen (der WallDisplayV2-Zweig enthält kein OTA-WebView-Paket)'
released: '2025-09 (geschätzt)'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL, Vorderseite
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL, gerade Ansicht des Bildschirms
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL, Seitenansicht mit der Einbautiefe
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Kein Gerät dieses Modells wurde getestet.** Auf der [Seite zur Wall Display-Familie](/de/hardware/panels/shelly/) findest du Quellen, den OTA-Mechanismus der Firmware, das Zugangsmodell und Sicherheitshinweise für die gesamte Reihe.
:::

Das Wall Display XL, Firmware-Codename **Blake**, ist ein 10,1-Zoll-Panel mit Rockchip RK3566 (Cortex-A55) und Android 11 – das größte und leistungsfähigste Modell der [Shelly Wall Display-Familie](/de/hardware/panels/shelly/). Es gehört zum modernen **WallDisplayV2**-OTA-Zweig (arm64-v8a), gemeinsam mit [X1i](/de/hardware/panels/shelly/wall-display-x1i/), [X2i](/de/hardware/panels/shelly/wall-display-x2i/), Maverick und Dayna, und hat Zugriff auf den integrierten AppStore.

## Erster Debugging-Zugang

**Netzwerk-ADB auf TCP-Port 5555 ohne Computer: bei diesem Modell nicht nachgewiesen.** Auch das erste USB-Debugging und das Entsperren über das Herstellermenü sind hier nicht verifiziert. Das [X2i-Verfahren](/de/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) ist nur am X2i bestätigt; gemeinsame Firmware beweist nicht, dass es hier funktioniert. Frage Shelly nach dem Verfahren für dein Modell und deine Firmware. Nutze das [USB-Installationsprogramm](/de/install/install-over-usb/) erst, wenn USB-Debugging und eine USB-Datenverbindung verfügbar sind. Ein rootfähiger Build allein aktiviert kein Debugging.

## Auch erhältlich als

Shelly Wall Display XL, Firmware-Codename Blake.

|            |                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                                                                                                                                                             |
| Bildschirm | 10.1 in                                                                                                                                                                                                                                                                                                                                                                                     |
| Android    | 11                                                                                                                                                                                                                                                                                                                                                                                          |
| ABI        | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                                   |
| Sensoren   | Umgebungslicht dokumentiert; ein Bewegungssensor (offiziell, genaue Technologie nicht verifiziert); Bereitstellung über die Android-API nicht verifiziert                                                                                                                                                                                                                                   |
| Relais     | 1 Ausgang                                                                                                                                                                                                                                                                                                                                                                                   |
| Root       | Bei diesem Modell nicht nachgewiesen; das moderne OTA deklariert keinen Build-Typ. Bei einem mit Werksfirmware 2.5.4 getesteten [Wall Display X2i](/de/hardware/panels/shelly/wall-display-x2i/) lassen sich Entwickleroptionen und USB-Debugging über die Einstellungen-App freischalten; adb verbindet sich dann weiterhin ohne Root. Ob das auch für dieses Modell gilt, ist ungetestet. |
| Erschienen | Etwa September 2025 (geschätzt); Shelly brachte das XL in Europa um den 10. September 2025 auf den Markt ([Bericht zur Markteinführung, Notebookcheck, September 2025](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html))                                                                                                                    |

:::caution
Der integrierte Home Assistant-Browser des XL hatte Darstellungs- und Layoutprobleme mit Home Assistant-Frontend 2025.12 und einer Vorabversion von 2026.1 (erfasst in [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) und `#28746`; Core-Kompatibilität in [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). Eine App mit dem System-WebView auf demselben Gerät stellte alles korrekt dar. Das zeigt, dass das Problem am WebView des integrierten Browsers lag und nicht an der Hardware.
:::

Ab Panel Assistant 1.0 verwendet das XL das gemeinsame Shelly-Profil. Es übernimmt die am [X2i](/de/hardware/panels/shelly/wall-display-x2i/) gewonnenen Erkenntnisse über diese Firmware: vollständiges Ausschalten des Bildschirms ohne Root sowie Zurück und Home ohne Übersicht der letzten Apps. Die eigenen Sensoren werden beim Start von Panel Assistant auf dem Panel geprüft. Noch wurde kein XL bestätigt; ein Bericht eines Besitzers ist daher willkommen. Siehe [Was das X2i für den Rest der Reihe bedeutet](/de/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Auf der [Seite zur Wall Display-Familie](/de/hardware/panels/shelly/) findest du die vollständige Begründung des Zugangsmodells, die OTA-Update-Endpunkte (`WallDisplayV2`-Zweig) und den Versionsverlauf der Firmware.

## Quelle

[Shelly Wall Display XL Wissensdatenbank](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
