---
title: Firmware
description: Durchsuche indexierte Firmware-Builds von Sonoff und Shelly nach Modell und Version, mit Verfügbarkeitsverlauf und Archivlinks.
sourceCommit: f49bf12954ed3e89e5e32d635b4bbcb06095cf9b
sidebar:
  label: Übersicht
  order: 0
---

Hersteller von Wandpanels veröffentlichen fast nichts über ihre Firmware. Download-URLs sind nicht öffentlich aufgelistet, ändern sich ohne Ankündigung und verschwinden, wenn eine neuere Version erscheint. Auch Versionshinweise fehlen häufig. Der Firmware-Index erfasst die gefundenen Builds, damit ein bekannter Build weiterhin gefunden, überprüft und, sofern er archiviert wurde, wiederhergestellt werden kann, nachdem der Hersteller ihn entfernt hat.

## Was der Index erfasst

Für jedes Firmware-Objekt erfasst der Index das Modell, die Version, die Download-URL, die Größe, die Verfügbarkeitsprüfungen und eine Wayback-Aufnahme, sofern eine verzeichnet ist. [Durchsuche alle indexierten Builds nach Modell und Version](/de/hardware/firmware/builds/). Die Seiten werden aus den [zugrunde liegenden `.dat`-Dateien](https://github.com/panel-assistant/panel-assistant.io/tree/main/tools/firmware-index) und dem Datenverlauf des Monitors generiert.

:::note
Ein Eintrag existiert nur, weil eine Prüfabfrage den betreffenden Build gefunden hat. Die Inhalte der Hersteller-CDNs lassen sich nicht auflisten. Ein Build, der im Index fehlt, wurde daher nicht gefunden – das ist kein Beweis dafür, dass er nicht existiert.
:::

## Firmware nach Hersteller

- [Sonoff NSPanel Pro](/de/hardware/firmware/nspanel-pro/): das URL-Schema des CoolKit-CDN, die Überprüfung einer URL, der Update-Pfad und das an der Hardware verifizierte Flash-Verfahren. Seine [Builds für 86P und 120P](/de/hardware/firmware/builds/) sind separat aufgeführt.
- Shelly Wall Display: Die OTA-Zweige, Update-Endpunkte und das Dateiformat sind auf der [Seite zur Shelly Wall Display-Produktfamilie](/de/hardware/panels/shelly/#firmware-ota-mechanismus) beschrieben. Der [Build-Index](/de/hardware/firmware/builds/) ordnet die gemeinsam genutzten OTA-Zweige den jeweiligen dokumentierten Modellen zu.
- Smatek S9E: Die beiden analysierten Original-Firmware-Images und ihre Unterschiede sind auf der Seite [Smatek S9E](/de/hardware/panels/smatek/s9e/#firmwareversionen) beschrieben.

Bevor du die Firmware auf einem Panel änderst, lies [Firmware sichern und wiederherstellen](/de/hardware/guides/firmware-backup-and-restore/).

<span id="firmware-updates-and-capabilities"></span>

## Firmware-Updates und Funktionen

Die Bewertungen neuer Panel-Produktfamilien und Firmware-Veröffentlichungen der Hersteller durch Panel Assistant berücksichtigen sowohl Sicherheitskorrekturen als auch nützliche Zugriffsmöglichkeiten für Eigentümer, einschließlich potenzieller [Zugangswege über CVE-2026-43499](/de/hardware/guides/root-access/#mögliche-zugangswege-auf-anderer-firmware). Ein indexierter Download ist kein Beleg dafür, dass ein Build bewertet wurde.

Wenn nachgewiesen ist, dass ein Update einen Zugang schließt, der nützliche Funktionen von Panel Assistant ermöglicht, sollten die Hinweise zum jeweiligen Modell die genauen funktionierenden und betroffenen Builds, die verlorene Funktion, die Sicherheitsfolgen des Beibehaltens des älteren Builds und den verfügbaren Wiederherstellungsweg nennen. Das Aufschieben dieses konkreten Updates kann dann empfohlen werden, wenn der Nutzen der Funktion die damit verbundenen Sicherheitsnachteile für diese Konfiguration rechtfertigt. Dies ist keine Empfehlung, jede verwundbare Firmware beizubehalten oder ein Panel auf eine ältere Firmware zurückzusetzen.

Gleiche vor deiner Entscheidung dein genaues Modell und deinen Build mit diesen Hinweisen ab. Eine Korrektur im Upstream-Linux beweist nicht, dass ein Hersteller sie ausgeliefert hat; eine unveränderte Kernel-Version beweist nicht, dass sie fehlt. Ohne verifizierte, buildspezifische Belege solltest du sowohl den Erhalt der Funktionen als auch den Status der Verwundbarkeit als unbekannt betrachten.
