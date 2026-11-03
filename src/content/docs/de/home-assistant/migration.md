---
title: Panel Assistant ist erforderlich
description: Was du tun kannst, wenn ein Panel meldet, dass Panel Assistant erforderlich ist, und wie du von einer Panel-App der Version 0.9 zu Panel Assistant 1.0 gelangst.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Auf einem Panel, das **Panel Assistant ist erforderlich** zusammen mit der Adresse dieser Seite anzeigt, läuft eine Panel-App der Version 0.9, die sich noch nicht mit der Integration von Panel Assistant in Home Assistant verbunden hat. Deine Dashboard-Auswahl und deine Panel-Einstellungen sind weiterhin auf dem Panel vorhanden. Du musst es weder neu installieren noch zurücksetzen.

Panel Assistant 1.0 kann kein Panel übernehmen, auf dem noch die alte ha-paneld-App läuft oder dessen Hardware-Entitäten noch MQTT verwenden. Ein solches Panel gelangt über Panel Assistant 0.9.0 zu 1.0, wobei 0.9.0 es zuerst umstellt:

1. [Installiere die Integration von Panel Assistant über HACS](/de/home-assistant/custom-integration/). Wenn auf deinem Panel noch die alte App läuft oder es MQTT verwendet, wähle vor dem ersten Neustart die Version **0.9.0**; wenn du bereits Panel Assistant 1.0 hast, befolge vor einem Versionswechsel die Hinweise unter [Wenn eine Umstellung nicht abgeschlossen wurde](/de/manage/upgrade-to-1-0/#wenn-ein-umzug-nicht-abgeschlossen-wurde). Starte Home Assistant neu, wenn HACS dich dazu auffordert.
2. Wenn dein Panel bereits unter **Einstellungen → Geräte und Dienste → Panel Assistant** erscheint, musst du nichts erneut hinzufügen. Andernfalls füge dort dein **vorhandenes Panel** mit seinem Hostnamen oder seiner Adresse hinzu; dies ist keine neue Panel-Installation.
3. Öffne **Einstellungen → Reparaturen**. Wenn Panel Assistant meldet, dass auf dem Panel noch die alte ha-paneld-App läuft, führe die zugehörige Reparatur durch, um das Panel auf die App von Panel Assistant umzustellen. Wenn die Hardware-Entitäten des Panels noch MQTT verwenden, erklärt [Ein Panel von MQTT umstellen](/de/home-assistant/move-from-mqtt/) diese Übergabe, die von 0.9.0 abgeschlossen wird.
4. Wenn du 0.9.0 installiert hast, aktualisiere auf 1.0, sobald es für keines deiner Panels eine Umstellung auflistet, wie unter [Upgrade auf 1.0](/de/manage/upgrade-to-1-0/) beschrieben.

Hilfe beim Ermitteln der Adresse deines Panels oder beim Prüfen seiner Verbindung findest du unter [Ein Panel verbinden](/de/home-assistant/connect-a-panel/) und [Fehlerbehebung](/de/manage/troubleshooting/).
