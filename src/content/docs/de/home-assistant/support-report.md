---
title: Einen Supportbericht verstehen
description: Einen Fehler bei der Installation oder Aktualisierung mit Panel Assistant nachvollziehen und den Bericht teilen, wenn Sie Hilfe benötigen.
sourceCommit: ddee491d1892568fda8e9bb47f003b2333e3b666
---

Wenn eine Installation oder Aktualisierung fehlschlägt, öffnen Sie den zugehörigen Eintrag unter **Einstellungen → Reparaturen** in Home Assistant und wählen Sie **Supportbericht**. Der Bericht enthält die genauen Feldnamen und Werte in einem kopierbaren Textblock. Er beginnt mit `panel_assistant.version` und `panel_assistant.build`, gefolgt von `home_assistant.version` und der Repair ID in `repair.issue_id`. Gespeicherte Ereignisse erscheinen unter `events[N]`, wobei `N` bei 0 beginnt.

Lesen Sie den Bericht, bevor Sie ihn teilen. Er kann eine Panel-Adresse, Gerätekennungen, Details zur Veröffentlichung und eine Ausnahme-Trace enthalten. Entfernen Sie alles, was Sie nicht in einem öffentlichen Issue veröffentlichen möchten. Behalten Sie nach Möglichkeit den Fehlergrund und die zugehörigen Details bei; sie helfen zu erklären, was passiert ist.

Wenn Sie Hilfe bei einer fehlgeschlagenen Installation oder Aktualisierung benötigen, [öffnen Sie ein Issue für die Home Assistant-Integration](https://panel-assistant.io/go/report-issue) und fügen Sie den Bericht in den Beschreibungstext ein. Ergänzen Sie, was Sie getan haben, was Sie erwartet haben und was auf dem Panel passiert ist. Wenn das Panel erreichbar ist, kann sein [Diagnose-Download](/de/manage/troubleshooting/) weitere Hinweise liefern.

## Die Felder verstehen

- `events[N]` führt gespeicherte Ereignisse der Reihe nach auf, beginnend mit `events[0]`. Ein späteres Ereignis kann eine zurückgehaltene Wiederholung beschreiben statt des ursprünglichen Fehlers.
- `kind` gibt an, ob das Ereignis aus einem Versuch vom Typ `install`, `update` oder `retry_hold` stammt. `at` ist, sofern vorhanden, die gespeicherte Uhrzeit.
- `panel` ist der Anzeigename oder die Adresse des Panels; `address` ist das Netzwerkziel, das Home Assistant verwendet hat. `entry_id` kennzeichnet den Home Assistant-Integrationseintrag. `job_id` kennzeichnet einen Installationsversuch.
- `reason` enthält das gespeicherte Ergebnis oder die Fehlermeldung. Bei einer Installation gibt `receipt.result_code` das allgemeine Ergebnis an, und `receipt.failure_stage` nennt den Schritt, der beim Fehlschlag aktiv war. Ein `receipt.result_subcode` grenzt, sofern vorhanden, die Diagnose ein; sein Wert kann sich zwischen Veröffentlichungen ändern.
- `target_version` und `artifact.*` beschreiben die für eine Aktualisierung ausgewählte Veröffentlichung. `receipt.*` enthält den Installationsbeleg einschließlich Angaben zum Ziel und zu den Schritten. `exception` ist eine technische Trace; ihre letzten Zeilen weisen häufig auf den unmittelbaren Fehler hin.

Das Installationsergebnis `authorization_failed` bedeutet, dass Home Assistant keine Berechtigung für die Arbeit mit dem Panel erhalten konnte. `preflight_rejected` bedeutet, dass das Panel die Prüfungen vor der Installation nicht bestanden hat. `artifact_rejected` bedeutet, dass die ausgewählte App-Datei nicht akzeptiert wurde. `transport_failed` bedeutet, dass die Kommunikation mit dem Panel fehlgeschlagen ist. `install_failed` und `launch_failed` benennen den Installationsschritt beziehungsweise den App-Start. `health_check_failed` bedeutet, dass die App die Prüfung nach der Installation nicht bestanden hat. `ambiguous_mutation` oder `verification_required` bedeutet, dass Home Assistant den Zustand des Panels nicht nachweisen konnte; prüfen Sie das Panel vor einem weiteren Versuch. Bei einer Aktualisierung oder Wiederholung kann `reason` stattdessen eine beschreibende Fehlermeldung enthalten.

## Einen KI-Assistenten um Hilfe beim Lesen bitten

Kopieren Sie diesen Prompt und fügen Sie anschließend Ihren geprüften Bericht direkt dahinter ein. Ein Assistent kann die Hinweise erklären und Prüfungen vorschlagen, aber aus dem Bericht allein kann er den aktuellen Zustand des Panels nicht erkennen.

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report is a copyable text block with exact dotted field names and values. It starts with panel_assistant.version and panel_assistant.build, followed by home_assistant.version and the Repair ID in repair.issue_id. Saved install, update, or retry-hold events appear under events[N], starting at events[0]. Each event preserves its original fields and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
