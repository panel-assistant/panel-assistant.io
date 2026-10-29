---
title: adb- und Root-Zugriff erhalten
description: Wie jedes dokumentierte Wandpanel adb und Root erreicht, wofür die Panel-App Root verwendet und wo die genaue Anleitung für jedes Modell steht.
sidebar:
  label: adb- und Root-Zugriff
  order: 1
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Jedes Panel erreicht adb und gegebenenfalls Root auf einem anderen Weg. Diese Seite gibt einen Überblick. Die genauen Schritte für die jeweilige Firmware stehen auf der Seite des Panels.

## Wofür Root benötigt wird

Die Panel-App lässt sich ohne Root installieren und verwenden. Root ist nur für Hardware wichtig, die Android einer gewöhnlichen App nicht zugänglich macht:

- **Sysfs- und Eingabeknoten im Besitz von `system`.** Auf manchen Panels sind LED, Tastenbeleuchtung und Klimasensoren Dateien mit dem Eigentümer `system:system`, die eine App in ihrer Sandbox weder schreiben noch lesen kann. Die Panel-App kommuniziert dann über einen Unix-Socket mit einem kleinen Root-Hilfsdienst, `hapaneld-helper`. Siehe die [Helper-Dokumentation](https://github.com/panel-assistant/android/blob/main/helper/README.md).
- **Echtes Ausschalten der Hintergrundbeleuchtung, Neustart und CPU-Governor-Steuerung.** Ohne Root-Zugriffsweg fallen diese auf das zurück, was Android erlaubt, etwa Helligkeit null statt Abschalten der Hintergrundbeleuchtung.
- **Relais und GPIO-Leitungen**, wenn ein Panel sie nur über Root-Sysfs bereitstellt.

Die Panel-App prüft jeden privilegierten Zugriffsweg bei seiner Verwendung. Ein Panel ohne Root erhält daher weiterhin Dashboard, Standardsensoren, Helligkeit und Navigation. Eine Funktion, die Root benötigt, wird als nicht verfügbar angezeigt, statt fehlzuschlagen.

## Wege nach Panel

- **[Sonoff NSPanel Pro](/de/hardware/panels/sonoff/#gaining-adb-and-root-access).** Ein `userdebug`-Build mit Testschlüsseln und **ohne adb-Passwort**. Die einzige Hürde ist der Zugang zum Entwicklermodus, der je nach eWeLink-Firmware variiert. Danach folgen `adb root`, erneutes Einhängen und die Installation eines dauerhaften `su`.
- **[Tuya TPA10](/de/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access).** adb ist **passwortgeschützt**. Der zuverlässige Weg ist die Hintertür der USB-Diagnose-App. `su` ist bereits vorhanden. Ein kurzes Skript sorgt anschließend dafür, dass Netzwerk-adb Neustarts übersteht.
- **[Electron WF1589T](/de/hardware/panels/electron/wf1589t/#gaining-adb-and-root-access).** Ein `userdebug`-Build mit Google Play. `adb root` funktioniert direkt. Die LED ist direkt aus der App zugänglich, daher wird Root selten benötigt.
- **[Electron WF2489T (ZHICAI SMT1019)](/de/hardware/panels/electron/wf2489t/#root-access-by-firmware-build).** Der Produktionsbuild für den Handel hat kein Root. Der `userdebug`-Build des Lieferanten ist gerootet, muss aber erneut eingehängt werden, bevor der Helper dauerhaft installiert werden kann.
- **[SMT156](/de/hardware/panels/electron/smt156/).** Auf der gemeldeten Installation ist kein aus Apps zugängliches `su` vorhanden. USB-`adb root`, der Engineering-Modus des Herstellers und dauerhafte Entsperrwege wurden nicht getestet.
- **[Smatek S9E](/de/hardware/panels/smatek/s9e/).** Die Hersteller-App führt Root-Befehle aus, und manche Geräte werden mit entsperrtem Entwicklermodus ausgeliefert. Für Firmware 1.1.0 wurde `su` auf App-Ebene gemeldet. Der Zugang hängt weiterhin vom Gerät und der Firmware ab.
- **[Shelly Wall Display](/de/hardware/panels/shelly/).** Auf einem [Wall Display X2i](/de/hardware/panels/shelly/wall-display-x2i/), getestet mit Werksfirmware 2.5.4, lassen sich Entwickleroptionen und USB-Debugging über die Einstellungen-App freischalten. adb verbindet sich dann ohne Autorisierungsabfrage. Root ist nicht vorhanden: Es gibt kein `su`, und `adb root` ist nicht verfügbar. Für die Installation und den täglichen Gebrauch der Panel-App wird dort kein Root benötigt, für die privilegierten Funktionen dieser Seite jedoch schon. Die anderen Modelle wurden nicht getestet. Die ältere Firmware verwendet einen `userdebug`-Basisbuild, daher könnte `adb root` dort funktionieren, wenn eine adb-Verbindung hergestellt werden kann.

## Bevor du etwas änderst

- Sorge für zuverlässig funktionierendes adb, idealerweise über das Netzwerk und mit vorab autorisiertem Schlüssel deines Rechners, bevor du eine Hersteller-App deaktivierst. Wenn du zuerst einen Hersteller-Launcher, eine Einstellungs- oder Hardware-App deaktivierst, kannst du den Zugang zum Panel verlieren.
- Bewahre eine Navigationsmöglichkeit. Auf einem Panel ohne Tasten ersetzen die Navigationsaktionen der Panel-App die Herstellerfunktionen „Zurück“ und „Zuletzt verwendet“.
- Stoppe den Hersteller-Updater, falls vorhanden. Ein OTA-Update kann sonst deine Änderungen rückgängig machen. Siehe [Unerwünschte Updates stoppen](/de/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Erstelle vor Firmwareänderungen auf einem gerooteten Rockchip-Panel eine Partitionssicherung. Siehe [Firmware sichern und wiederherstellen](/de/hardware/guides/firmware-backup-and-restore/).
- Manche Wege benötigen `adb disable-verity`, was das Panel neu startet. Ein PIN-geschütztes Panel kann seine Apps nach einem Neustart erst wieder starten, wenn jemand die PIN eingibt. Sei daher vor Ort am Panel.
