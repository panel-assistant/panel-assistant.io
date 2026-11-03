---
title: Ein Panel von MQTT umstellen
description: Die Entitäten eines Panels von der MQTT-Integration in Home Assistant an Panel Assistant übergeben und dabei ihre Entitäts-IDs, ihren Verlauf und ihre Anpassungen beibehalten.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Panel Assistant 1.0 verwendet die native Verbindung von Home Assistant und unterstützt MQTT nicht. Wenn die Entitäten deines Panels noch MQTT verwenden, führe zuerst Panel Assistant **0.9.0** aus, damit es die Umstellung abschließen kann und dabei Entitäts-IDs, Verlauf und Anpassungen erhalten bleiben. Wenn du bereits auf 1.0 aktualisiert hast, befolge [Wenn eine Umstellung nicht abgeschlossen wurde](/de/manage/upgrade-to-1-0/#wenn-ein-umzug-nicht-abgeschlossen-wurde), bevor du die Version wechselst.

Die folgende Schritt-für-Schritt-Anleitung ist eine historische Anleitung für Panel Assistant 0.3 bis 0.8. Die darin beschriebene Auswahl **Steuerung** ist in 1.0 nicht vorhanden.

Du stellst jeweils ein Panel um, und jede Umstellung lässt sich rückgängig machen. Die Entitäten des Panels behalten ihre Entitäts-IDs, ihren Verlauf sowie alle Namen, Symbole oder Bereiche, die du ihnen zugewiesen hast. Dashboards und Automatisierungen, die sie verwenden, funktionieren daher weiterhin.

:::caution[Vorabzugang]
Die Umstellung ist neu. Probiere sie zuerst mit einem Panel aus und erzähle uns auf [Discord](https://panel-assistant.io/go/discord) oder in den [Issues](https://github.com/panel-assistant/ha-integration/issues), wie es gelaufen ist.
:::

## Bevor du beginnst

- **Panel Assistant 0.3.0 bis 0.8** in Home Assistant, über HACS installiert, wie unter [Integration installieren](/de/home-assistant/custom-integration/) beschrieben.
- **ha-paneld 0.9.8-rc1 oder neuer** auf dem Panel. Installiere ein angebotenes Update über die Panel Assistant-Update-Entität des Panels in Home Assistant. Wenn du eine Vorabversion benötigst, die dort nicht angeboten wird, wähle sie im Tab **Install** der Weboberfläche des Panels aus und starte die Installation selbst.
- **Das Panel ist bei Home Assistant angemeldet**. Das ist der Fall, wenn es dein Dashboard anzeigt.
- **Lass deine MQTT-Einrichtung unverändert.** Das Panel verwendet den Broker während der Migration weiterhin, und daran muss nichts geändert werden.

## 1. Panel Assistant-Entitäten aktivieren

Füge dies zu `configuration.yaml` hinzu und starte anschließend Home Assistant neu:

```yaml
panel_assistant:
  native_entities: true
```

Noch wird nichts migriert. Jedes Panel, das Panel Assistant kennt, erhält auf seinem Panel Assistant-Gerät neben den MQTT-Entitäten einen zweiten Satz Entitäten, damit sich die beiden vergleichen lassen. Wenn du ein Panel migrierst, nehmen seine MQTT-Entitäten den Platz dieses zweiten Satzes ein.

## 2. Das Panel zu Panel Assistant hinzufügen

Überspringe diesen Schritt, wenn das Panel in **Einstellungen**, **Geräte & Dienste** bereits unter Panel Assistant erscheint.

Wähle **Integration hinzufügen**, dann **Panel Assistant**, dann **Panel hinzufügen** und gib den Hostnamen oder die Adresse des Panels ein. Panel Assistant erkennt, dass ha-paneld bereits läuft, und bietet **Mit Home Assistant verbinden** an. Auf dem Panel wird nichts neu installiert.

## 3. Den Benutzer des Panels bestätigen

Wenn sich das Panel zum ersten Mal verbindet, zeigt Home Assistant eine Reparatur an: **Home Assistant-Benutzer für** dein Panel **bestätigen**. Öffne sie unter **Einstellungen**, **Reparaturen**, prüfe, ob der genannte Benutzer das Konto ist, mit dem sich das Panel anmeldet, und bestätige.

Das Panel versucht es selbstständig erneut. Daher kann es bis zu 15 Minuten dauern, bis die Reparatur erscheint, und nach deiner Bestätigung kann es noch einmal genauso lange dauern, bis sich das Panel verbindet.

## 4. Das Panel migrieren

Öffne unter **Geräte und Dienste** den Panel Assistant-Eintrag des Panels, wähle **Konfigurieren**, setze **Steuerung** auf **Panel Assistant** und speichere.

Der Eintrag wird neu geladen und das Panel verbindet sich erneut. Seine MQTT-Entitäten wechseln zu Panel Assistant. Sobald das Panel die Migration bestätigt hat, wird das MQTT-Gerät des Panels entfernt. Rechne damit, dass die Entitäten für einige Sekunden als nicht verfügbar angezeigt werden und etwa 30 Sekunden später noch einmal, während sich alles einpendelt. Das Aktivitätsprotokoll des Geräts füllt sich mit Zustandsänderungen, da jede Entität ihren Zustand meldet; das ist zu erwarten.

Ab jetzt läuft das Ändern einer Einstellung oder das Drücken einer Schaltfläche an den Entitäten des Panels über Panel Assistant. Bevor ein Panel migriert wird, melden dieselben Steuerelemente zurück, dass das Panel über MQTT gesteuert wird.

### Was nicht migriert wird

Zwei MQTT-Schaltflächen haben keine Entsprechung in Panel Assistant: **Update ha-paneld** und **Update Companion app**. Daher werden sie zusammen mit einer eventuell noch vorhandenen MQTT-Update-Entität für ha-paneld entfernt. Verwende die Panel Assistant-Update-Entität des Panels, um die Panel-App zu aktualisieren.

Wenn du einer davon einen eigenen Namen, ein eigenes Symbol oder einen eigenen Bereich zugewiesen oder sie ausgeblendet oder deaktiviert hast, entfernt Panel Assistant sie nicht für dich. Stattdessen wird sie in einer Reparatur aufgeführt, und das Panel behält seine MQTT-Entitäten, bis du diese Entität löschst oder diese Einstellungen zurücksetzt.

## Ein Panel zurückmigrieren

Öffne erneut **Konfigurieren** und setze **Steuerung** auf **MQTT, mit nativen Berichten zum Vergleich** oder auf **MQTT**. Die Entitäten wechseln mit denselben Entitäts-IDs und demselben Verlauf zurück zur MQTT-Integration, und das Panel kündigt sein MQTT-Gerät erneut an.

Migriere ein Panel immer auf diese Weise zurück. Lösche den Panel Assistant-Eintrag eines Panels nicht, solange Panel Assistant es steuert: Home Assistant entfernt beim Löschen die Entitäten dieses Eintrags. Obwohl Panel Assistant sie vorher zurückgibt, kann eine angepasste Entität dabei ihren Namen, ihr Symbol oder ihren Bereich verlieren.

## Bekannte Einschränkungen

- **Einige Sensoren bleiben nicht verfügbar.** Ein Panel kann Entitäten für Sensoren anbieten, die seine Hardware nicht meldet, etwa für Nähe, Temperatur oder Luftfeuchtigkeit. Dies sind neue Panel Assistant-Entitäten, keine migrierten. Daher geht durch ihre Deaktivierung nichts verloren.
- **Älteres ha-paneld auf einem migrierten Panel.** Wenn ein migriertes Panel später auf eine Version unter 0.9.8-rc1 zurückgestuft wird, kündigt es seine MQTT-Entitäten erneut an. Panel Assistant deaktiviert die Duplikate und erstellt eine Reparatur, **ha-paneld aktualisieren**, die verschwindet, sobald das Panel aktualisiert wurde.
- **Neustartmeldungen.** Während Home Assistant neu startet, erfährt ein Panel, dessen Konto kein Administrator ist, weiterhin über MQTT davon. Das ist ein weiterer Grund, den Broker vorerst weiterlaufen zu lassen.
