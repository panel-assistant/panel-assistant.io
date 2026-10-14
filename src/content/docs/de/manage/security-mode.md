---
title: Sicherheitsmodus
description: Das Standardverhalten des Panels in einem vertrauenswürdigen Netzwerk und der Gehärtete Modus, in dem jemand am Panel entfernte Aktionen mit weitreichenden Auswirkungen genehmigen muss.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Die Weboberfläche des Panels, seine API und seine Home Assistant-Steuerelemente sind für ein vertrauenswürdiges Heimnetzwerk ausgelegt. Der **Entspannte Modus** ist der Standard: Automatisierungen, Installationswerkzeuge und Browseraktionen funktionieren ohne zusätzliche Aufforderung. Eine Aktion ist bewusst von dieser Regel ausgenommen. Das Einschalten der Kamera über ihre Home Assistant-Entität erfordert in jedem Modus eine Genehmigung am Panel, auch im Entspannten Modus. Die Kameraeinstellung unter „Konfigurieren“ ist ein separater Konfigurationsweg für den Eigentümer. Das Ausschalten verlangt niemals eine Genehmigung.

Für ein Panel in einem Netzwerk, das mit weniger vertrauenswürdigen Geräten geteilt wird, ergänzt der optionale **Gehärtete Modus** eine persönliche Genehmigung für ausgewählte Netzwerkvorgänge mit weitreichenden Auswirkungen. Er bildet eine zusätzliche Sicherheitsgrenze, ersetzt aber weder ein separates Netzwerk noch eine Firewall und bietet keine allgemeine Authentifizierung der API. Endpunkte mit reinem Lesezugriff und gewöhnliche Panelsteuerungen bleiben im Rahmen des üblichen Modells für vertrauenswürdige Netzwerke verfügbar.

**Im Gehärteten Modus erfordern geschützte direkte LAN-Anfragen physischen Zugang zum Panel. Sie können erst ausgeführt werden, wenn jemand sie auf dem Bildschirm des Panels genehmigt. Diese Genehmigung kann nicht aus der Ferne erteilt werden.**

Administratoren, die die authentifizierte Panel Assistant-Seitenleiste verwenden, können ausgewählte gewöhnliche Verwaltungsaktionen ohne die Aufforderung am Gerät ausführen: Anzeige- und Stromversorgungskonfiguration, Bestätigung zur Stromversorgungssicherheit, Profilaktivierung, Medienwiedergabe, Einschränkung von Herstellerpaketen und Neuladen des Dashboards. Installation, Deinstallation, Sicherungen, Wiederherstellungen, Neustart und andere geschützte Vorgänge erfordern weiterhin eine Genehmigung am Panel. Diese Ausnahme gilt nicht für direkte LAN-Anfragen.

Die Weboberfläche kennzeichnet betroffene Aktionen in beiden Modi mit einem kleinen Schild. So kannst du schon vor dem Einschalten des Gehärteten Modus sehen, welche Abläufe die Genehmigungsgrenze überschreiten.

## Gehärteten Modus einschalten

Diese Einstellung kann nur auf dem Panel selbst geändert werden:

1. Öffne auf dem Panel den Bildschirm **Konfigurieren** der Panel-App.
2. Öffne das Menü für weitere Optionen in der Symbolleiste und wähle **Sicherheitsmodus**.
3. Wähle **Gehärteten Modus aktivieren**.

Netzwerk-ADB und das drahtlose Debugging von Android müssen zunächst beide ausgeschaltet sein, denn jeder dieser Wege ermöglicht einem entfernten ADB-Client, Eingaben auf dem Genehmigungsbildschirm einzuschleusen. Bevor sie die Änderung übernimmt, prüft die Panel-App jede unterstützte Android-Eigenschaft für Netzwerk-ADB, dauerhaftes Netzwerk-ADB, explizite ADB-Listen-Adressen und den Zustand des drahtlosen Debuggings. Sie beendet außerdem jedes aktive Relay für WebView-Entwicklerwerkzeuge im Netzwerk und prüft, dass dessen Prozess und Listener nicht mehr vorhanden sind. Wenn sie nicht feststellen kann, dass diese Fernsteuerungswege inaktiv sind, weigert sie sich, den Gehärteten Modus einzuschalten. Schalte ADB und drahtloses Debugging in den Entwickleroptionen von Android aus und versuche es erneut. Wenn die Überprüfung des Relays fehlschlägt, starte das Panel vor einem erneuten Versuch neu.

Diese Einstellung gehört allein dem Panel. Sie ist weder in Konfigurationsexporten noch in vollständigen Sicherungen enthalten und kann nicht über die API, aus Home Assistant, durch eine Wiederherstellung, durch das Importieren einer Konfiguration oder durch ein Update über mehrere Panels hinweg geändert werden. Ein bestehendes Panel bleibt deshalb im Entspannten Modus, solange niemand den Gehärteten Modus am Panel einschaltet.

Verwende dasselbe Menü, um zum Entspannten Modus zurückzukehren. Dabei werden alle ausstehenden Genehmigungsanfragen gelöscht.

## Eine Netzwerkanfrage genehmigen

Wenn der Gehärtete Modus eine geschützte Anfrage an die API abfängt, gibt der erste Versuch HTTP `202 Accepted` mit einer Antwort vom Typ `approval-required` zurück, zum Beispiel:

```json
{
  "ok": false,
  "error": "approval-required",
  "approval_id": "…",
  "message": "Approve this request physically on the panel, then retry it; it cannot be approved remotely."
}
```

So schließt du den Vorgang ab:

1. Öffne auf dem Panel **Konfigurieren**, das Menü für weitere Optionen in der Symbolleiste, **Sicherheitsmodus** und dann **Genehmigungen prüfen**.
2. Prüfe den Vorgang, seine Zusammenfassung und das anfragende Gerät. Genehmige ihn dann oder lehne ihn ab.
3. Sende innerhalb von zehn Minuten nach der ursprünglichen Anfrage dieselbe Anfrage erneut vom selben Gerät.

Eine Genehmigung ist an den Vorgang, das anfragende Gerät und den geschützten Inhalt der Anfrage gebunden und kann einmal verwendet werden. Wenn du die Anfrage änderst, sie von einer anderen Adresse sendest, länger als zehn Minuten wartest oder die Panel-App neu startest, ist eine neue Genehmigung erforderlich. Nur der passende erneute Versuch verbraucht eine Genehmigung. Sie ist keine vorübergehende allgemeine Umgehung.

Native Entitäts- und Automatisierungsbefehle von Home Assistant tragen die Transportherkunft von Panel Assistant statt der Identität des einzelnen Benutzers. Ihre Genehmigungen sind an diese Herkunft und den genauen Befehl gebunden. Das unterscheidet sich von der oben beschriebenen Ausnahme für die authentifizierte Administrator-Seitenleiste.

Anfragen über Loopback von Software, die bereits auf dem Panel läuft, benötigen keine Netzwerkgenehmigung. Der Gehärtete Modus behandelt lokale Android-Apps als vertrauenswürdig und isoliert die Apps auf dem Panel nicht voneinander. Halte daher nicht vertrauenswürdige Apps vom Panel fern.

## Geschützte Vorgänge

Im Gehärteten Modus benötigt ein direkter Netzwerkclient eine Genehmigung am Panel, bevor er Folgendes tun kann:

- eine hochgeladene App oder eine verwaltete Kopie der Panel-App oder einer separaten Dashboard-App installieren;
- eine App deinstallieren oder ändern, ob ein Herstellerpaket aktiviert ist, läuft oder den Bildschirm überlagern darf;
- eine vollständige Sicherung oder ein Konfigurationspaket exportieren, das Geheimnisse enthält;
- eine Konfiguration importieren, eine gespeicherte Konfigurationsversion oder eine Panelsicherung wiederherstellen;
- ein Hardwareprofil aktivieren oder auf ein früheres Profil zurücksetzen;
- Medien wiedergeben, die von einer entfernten URL abgerufen werden;
- den Dashboard-Renderer neu laden oder das Panel neu starten;
- eine App über einen Link herunterladen. Der Download wird getrennt von der Installation genehmigt: Er ist an den SHA-256-Wert genau dieser URL gebunden, und es wird keine Verbindung geöffnet, bis er genehmigt ist. Deshalb verlangt die Installation über einen Link im Gehärteten Modus zweimal eine Genehmigung;
- Wartungsschritte zur Datenbankwiederherstellung vorantreiben;
- die Konfiguration einer separaten Dashboard-App reparieren oder die Browserdaten des integrierten Renderers löschen;
- die System-Anzeigedichte oder Schriftskalierung ändern;
- die konfigurierten Schutzfunktionen zum Wachhalten oder zum Verhindern des Dimmens bei Inaktivität, die das Panel erreichbar halten, über die Seite „Konfigurieren“ oder Home Assistant ausschalten;
- die Sicherheitseinstellungen für die Stromversorgung des Panels reparieren; oder
- einen bestimmten, unveränderten Warnhinweis zu einer Sicherheitseinstellung für die Stromversorgung ausblenden, die nur von Hand korrigiert werden kann. Dadurch ändert sich nur die Anzeige. Die zugrunde liegende Bewertung, die Diagnosedaten und das Installationsergebnis bleiben gleich.

Das Einschalten der Panelkamera über ihre Home Assistant-Entität erfordert in beiden Modi eine Genehmigung am Panel. Das Einschalten unter „Konfigurieren“ bleibt eine separate Eigentümereinstellung. Die Kameraberechtigung von Android und eine funktionierende Anzeige für die Kameranutzung sind weiterhin erforderlich.

Beim Speichern aus der Ferne über „Konfigurieren“ im Gehärteten Modus muss eine Verringerung der Stromversorgungssicherheit getrennt von Änderungen an Herstellerpaketen gespeichert werden, da dafür unterschiedliche Arten von Genehmigung erforderlich sind. Gemeinsame Speichervorgänge im Entspannten Modus oder über Loopback werden direkt ausgeführt.

Der Gehärtete Modus lehnt das Einschleusen von Berührungen von überall außer Loopback ab, damit eine Anfrage sich nicht selbst genehmigen kann. Er weigert sich außerdem, Netzwerk-ADB, das drahtlose Debugging von Android oder das Relay für WebView-Entwicklerwerkzeuge einzuschalten. Schalte das Panel am Panel selbst wieder in den Entspannten Modus, bevor du einen dieser Wege nutzt.

Die Genehmigungsgrenze macht den übrigen Teil der API auf Port 8888 nicht zu einer authentifizierten API. Diagnose- und Statusabfragen sowie gewöhnliche Steuerelemente behalten ihr übliches Verhalten für vertrauenswürdige Netzwerke bei. Halte die API des Panels auch bei eingeschaltetem Gehärtetem Modus von nicht vertrauenswürdigen Netzwerken fern. Die [Sicherheitsreferenz](/de/reference/security/) beschreibt das gesamte Sicherheitskonzept.

Updates beginnen, wenn du über Panel Assistant installierst oder selbst eine Installation auswählst. Die Panel-App hat weder eine Richtlinie für geplante Installationen noch einen gespeicherten Update-Kanal. Vom Eigentümer gestartete Installationen über die Registerkarte **Installieren** bleiben verfügbar. Im Gehärteten Modus benötigen geschützte entfernte Anfragen dabei eine Genehmigung am Panel.

## Die Home Assistant-Adresse ändern

Wenn du die **Home Assistant-URL** änderst, werden die bisherigen Anmeldedaten gelöscht, sofern du nicht beim selben Speichern neue Anmeldedaten angibst. Das gilt in beiden Sicherheitsmodi. Gewöhnliche Speichervorgänge, bei denen die Adresse gleich bleibt, behalten gespeicherte geheime Werte bei, wenn diese Felder leer bleiben.
