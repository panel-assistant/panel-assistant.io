---
title: Upgrade auf 1.0
description: Home Assistant und deine Panels von Panel Assistant 0.9 auf 1.0 umstellen und was eine Rückkehr bedeutet.
sourceCommit: 45ad784a56e8c07917f0c76636d2b389a610b982
---

Panel Assistant 1.0 und die Panel-App 1.0 gehören zusammen. Die Integration 1.0 kommuniziert nur mit der Panel-App 1.0, und die Panel-App 1.0 kommuniziert nur mit der Integration 1.0. Keine von beiden funktioniert also mit einem Gegenstück der Version 0.9. Du aktualisierst zuerst die Integration und dann jedes Panel über Home Assistant. **Ein Panel mit der App 1.0 kann nicht zu 0.9 zurückkehren.** Lies die ganze Seite, bevor du beginnst. Die [Versionshinweise zu 1.0.0](/de/release-notes/#panel-assistant-100) listen alle Änderungen auf.

## Bevor du beginnst

**Schließe alles ab, was 0.9.0 noch erledigen muss.** Verwende Panel Assistant **0.9.0** und öffne **Einstellungen**, **Reparaturen**. Panel Assistant 1.0 kann weder ein Panel von MQTT wegführen noch ein Panel mit der alten ha-paneld-App umstellen und lässt daher beide unverändert. Wenn 0.9.0 eines davon für eines deiner Panels auflistet, befolge seine Reparatur, bis das Panel umgestellt ist. [Panel von MQTT umstellen](/de/home-assistant/move-from-mqtt/) erklärt den MQTT-Teil. Wenn du eine ältere Version als Panel Assistant 0.9.0 verwendest, aktualisiere zuerst auf 0.9.0 und lass sie ihre Arbeit abschließen.

**Erstelle eine Home Assistant-Sicherung.** Erstelle unter **Einstellungen**, **System**, **Backups** eine Sicherung und bewahre sie auf, bis jedes Panel mit 1.0 läuft und du damit zufrieden bist. Sie ist dein Rückweg für die Home Assistant-Seite.

**Bewahre eine Sicherung jedes Panels auf.** Öffne in der Weboberfläche jedes Panels **Installation**, dann **Sicherung**, und bewahre die heruntergeladene `.hpb`-Datei auf. Panel Assistant sichert die Einstellungen des Panels auch vor jedem Update. Deine eigene Kopie ist jedoch diejenige, die du selbst wiederherstellen kannst.

## 1. Integration aktualisieren

Ab Home Assistant **2026.11** installierst du das Panel Assistant-Update unter **Einstellungen**, **Updates**. Auf unterstützten älteren Versionen, **2026.8.3 bis 2026.10**, lädst du das Update in HACS herunter. Starte Home Assistant anschließend gemäß der Neustart-Reparatur oder HACS-Aufforderung neu, um die neue Integration zu laden. [Integration installieren](/de/home-assistant/custom-integration/#updates) erklärt Updates über Marketplace und HACS.

## 2. Reparaturen prüfen

Öffne nach dem Neustart erneut **Einstellungen**, **Reparaturen**.

- **„… benötigt App …“** ist bei jedem Panel zu erwarten, auf dem noch eine App 0.9 läuft. Bis zum Update kann Home Assistant dieses Panel weder sehen noch steuern, und seine Entitäten erscheinen als nicht verfügbar. Das Panel selbst funktioniert mit seinen Einstellungen und seinem Verlauf weiter.
- **„… kann keine App-Updates empfangen“** bedeutet, dass Panel Assistant keine Möglichkeit hat, auf diesem Panel zu installieren. Das folgt meist auf eine Änderung am Panel selbst, etwa ein Firmware-Update oder ein Zurücksetzen. Verbinde das Panel erneut über USB mit Panel Assistant, wie unter **Mehr erfahren** in der Reparatur beschrieben. Danach wird das Update verfügbar. Es wird nichts entfernt: Auf einem Panel, das die App bereits hat, installiert der USB-Installer nichts und macht es nur wieder für Panel Assistant erreichbar.
- **„… wurde nie von MQTT umgestellt“** oder **„… verwendet noch die alte App“** bedeutet, dass eine Umstellung unter 0.9.0 nicht abgeschlossen wurde. Siehe [Wenn ein Umzug nicht abgeschlossen wurde](#wenn-ein-umzug-nicht-abgeschlossen-wurde).

## 3. Erst ein Panel aktualisieren, dann die übrigen

Die Update-Entität jedes Panels in Home Assistant bietet die neueste Panel-App 1.0 an. Installiere sie zuerst auf einem Panel und verwende es eine Weile, bevor du sie auf den anderen installierst, denn dieses Panel kann nicht zurückkehren. Panel Assistant sichert die Einstellungen des Panels, installiert das Update und bestätigt, dass das Panel wieder fehlerfrei erreichbar ist, wie unter [Updates und Wiederherstellung](/de/manage/updates-and-recovery/) beschrieben. Die Einstellungen werden aus der Panel-App 0.9 übernommen.

## Zurückkehren

Es gibt zwei unterschiedliche Hälften.

**Ein Panel mit der App 1.0 bleibt auf 1.0.** Die Panel-App verweigert die Installation einer älteren Version über sich selbst, Panel Assistant bietet niemals eine an, und eine Integration 0.9 kann nicht mit ihr kommunizieren. Wenn ein Panel mit 1.0 Probleme macht, sieh in der [Fehlerbehebung](/de/manage/troubleshooting/) nach und melde es anschließend mit einem [Supportbericht](/de/home-assistant/support-report/), damit es in einer zukünftigen Version behoben werden kann.

**Die Integration kann zurückkehren, solange kein Panel mit 1.0 läuft.** Stelle die Home Assistant-Sicherung wieder her, die du vor Beginn erstellt hast. Dadurch werden auch alle anderen Änderungen rückgängig gemacht, die seit ihrer Erstellung in Home Assistant vorgenommen wurden. Deine Panels verwenden noch die App 0.9 und verbinden sich wieder mit 0.9.0. Sobald ein Panel die App 1.0 verwendet, ist es nach dem Wiederherstellen der Sicherung von Home Assistant aus nicht erreichbar, bis die Integration wieder auf 1.0 ist.

Kehre nicht zurück, indem du über Marketplace oder HACS 0.9.0 über 1.0 installierst. Das Update auf 1.0 entfernt eine Einstellung, auf die 0.9.0 angewiesen ist. Ohne sie übergibt 0.9.0 bereits umgestellte Panels wieder an MQTT, wo die Panel-App 1.0 nicht mehr antwortet. Stelle stattdessen die Sicherung wieder her.

## Wenn ein Umzug nicht abgeschlossen wurde

Wenn 1.0 meldet, dass ein Panel nie von MQTT umgestellt wurde oder noch die alte App verwendet, befolge die sicheren Wiederherstellungsschritte der Reparatur, um die Umstellung mit Panel Assistant 0.9.0 abzuschließen und anschließend zu 1.0 zurückzukehren. Installiere 0.9.0 nicht über Marketplace oder HACS über 1.0. Solange noch keines deiner Panels die App 1.0 verwendet, kehre aus dem oben genannten Grund durch Wiederherstellen der vor dem Update erstellten Home Assistant-Sicherung zu 0.9.0 zurück. Schließe dann die Umstellung unter 0.9.0 ab und beginne diese Seite erneut. Wenn andere Panels bereits die App 1.0 verwenden oder du keine Sicherung von vor dem Update hast, frage auf [Discord](https://panel-assistant.io/go/discord) oder in den [Issues](https://github.com/panel-assistant/ha-integration/issues), bevor du etwas änderst.

Für ein Panel, das noch MQTT verwendet, bietet die Reparatur auch einen Neuanfang an: Lösche das Gerät des Panels unter der MQTT-Integration und füge das Panel erneut hinzu. Dadurch entstehen neue Entitäten, und sein gesamter Verlauf geht verloren.
