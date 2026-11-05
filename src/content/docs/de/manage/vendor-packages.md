---
title: Herstellerpakete
description: Eine aufdringliche Hersteller-App daran hindern, beim Start erneut zu starten und dein Dashboard zu überlagern – rückgängig machbar und nur für die von dir ausgewählten Pakete.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ein Firmware-Update kann eine Hersteller-App auf dem Panel hinterlassen, die bei jedem Start erneut startet und ein schwebendes Widget über dein Dashboard zeichnet. Auf dem Sonoff NSPanel Pro 120 sorgte ein Firmware-Update beispielsweise dafür, dass `com.eWeLinkControlPanel` beim Start ausgeführt wurde und ein Steuerungswidget über den jeweiligen Bildschirminhalt legte. Die Panel-App kann solche Pakete neutralisieren, aber nur diejenigen, die du angibst.

## Was die Funktion tut

Für jedes Paket, das du bändigst, führt die Panel-App drei rückgängig machbare, privilegierte Aktionen aus und wiederholt sie bei jedem Start:

| Schritt                                 | Mechanismus                                 | Wirkung                                                                                  |
| --------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Beenden erzwingen                       | `am force-stop <pkg>`                       | Stoppt die App sofort, sodass ihr Widget umgehend verschwindet.                          |
| Erneuten Start beim Booten deaktivieren | `pm disable-user --user 0 <pkg>`            | Verhindert ihren Start beim nächsten Booten. Mit `pm enable <pkg>` rückgängig zu machen. |
| Überlagerungen blockieren               | `appops set <pkg> SYSTEM_ALERT_WINDOW deny` | Entzieht die Berechtigung, ein schwebendes Fenster über das Dashboard zu zeichnen.       |

Alle drei Aktionen sind privilegiert. Die Funktion benötigt daher **Root oder den [Root-Helper](https://github.com/panel-assistant/android/blob/main/helper/README.md)**. Sie funktioniert damit auch auf Panels, die Root in einer Sandbox ausführen, etwa dem [Tuya TPA10](/de/hardware/panels/tuya/tpa10/). Dort erfolgen die Aktionen über die Helper-Befehle `STOP`, `DISABLE` und `OVERLAY`.

## Verwendung

Die Verwaltung erfolgt **in der eigenen Weboberfläche des Panels**, im Tab **Installation**, nicht in Home Assistant. Das erledigst du einmal bei der Einrichtung eines Panels oder nach einem Firmware-Update, statt es täglich umzuschalten. Daher gehört es nicht auf ein Dashboard.

Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen**, öffne **Installation** und suche die Karte **Herstellerpakete** (zum Beispiel `http://<panel-ip>:8888/install` beim Standardport).

Drücke **Paket suchen…**, um eine Liste von Apps auf dem Panel zu öffnen, die du möglicherweise steuern möchtest. Sie ist zur leichteren Auswahl gruppiert:

- **Für dieses Panel empfohlen**: die für deine Hardware bekannten aufdringlichen Firmware-Apps als sichere erste Wahl. Auf einem Panel mit bekanntem Hardwareprofil, etwa dem NSPanel Pro, steht hier `com.eWeLinkControlPanel`. Jeder Eintrag trägt **Tags** (zum Beispiel `vendor` für Apps des Panelherstellers, `chipset` für Werks- und Test-Apps des Chipherstellers, `overlay`, `boot`) und eine kurze **Anmerkung** des Profilautors dazu, was es ist und warum es markiert wurde. So kannst du eine Sonoff-Overlay-App von einer harmlosen Rockchip-Test-App im Firmware-Image unterscheiden.
- **Andere Apps**: Apps auf dem Panel, die nicht zum Kern von Android gehören. Auf einem Panel ohne bekanntes Profil kannst du hier nach Herstellererweiterungen mit einem Launcher-Eintrag oder einer Overlay-Berechtigung suchen. Wenn ein Paket nicht aufgeführt ist, kannst du seinen Namen direkt eingeben.
- **Höchste CPU-Auslastung**: die Apps, die gerade am meisten CPU verbrauchen. Bändige nur eine App, die du erkennst.

Jeder Eintrag hat eine Schaltfläche **Einschränken**. Wenn du den Paketnamen kennst, kannst du ihn auch direkt in das Feld eingeben. **Einschränken** wirkt sofort, ohne gesondertes Speichern, und wird bei jedem Start erneut angewendet. Ein gebändigtes oder bereits deaktiviertes Paket zeigt stattdessen **Wieder aktivieren** an, womit du es rückgängig machst. Die Karte selbst listet nur die von dir gebändigten Pakete samt Zustand auf: `active`, `disabled` oder `not installed`.

Nichts wird gebändigt, bevor du eine Einschränken-Schaltfläche drückst. Ohne Root oder Helper bleibt die Karte sichtbar, aber gesperrt, mit einer Erklärung des fehlenden Zugriffs.

## Sicherheit

- **Rückgängig machbar.** Die Deaktivierung wird mit `pm enable <pkg>` oder durch ein Update dieser App oder der Firmware aufgehoben. Hier wird nichts zerstört: keine Deinstallation und keine Datenlöschung.
- **Kritische Pakete werden abgelehnt.** Die Panel-App stoppt oder deaktiviert niemals die Systemoberfläche, Einstellungen, Telefonie, das Android-Framework oder sich selbst, auch wenn du eines davon angibst. Sowohl die App als auch der privilegierte Helper erzwingen dies, sodass ein Tippfehler das Panel nicht unbrauchbar machen kann.
- **Nur installierte Pakete, die du angibst, werden berührt.** Wenn du ein von der Panel-App verwaltetes Paket aus der gewünschten Liste entfernst, wird es wieder aktiviert und seine gespeicherte Overlay-Berechtigung wiederhergestellt. Auch **Wieder aktivieren** hebt das Bändigen auf.

:::caution
Du wählst Pakete zum Deaktivieren aus. Bleibe daher bei Herstellersoftware, die du erkennst. Wenn du etwas deaktivierst, von dem das Panel abhängt, etwa einen tatsächlich verwendeten Hersteller-Launcher oder eine Eingabemethode, kann die Navigation schwierig werden, bis du es über `adb` wieder aktivierst. Lass es im Zweifel unverändert.
:::
