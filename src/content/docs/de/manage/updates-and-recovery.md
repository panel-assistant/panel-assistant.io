---
title: Updates und Wiederherstellung
description: Die App auf einem Panel aktuell halten und was sich wiederherstellen lässt, wenn etwas schiefgeht.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

## Ein Panel aktualisieren

**Aus Home Assistant.** Jedes Panel hat eine Update-Entität. Wenn eine neuere Version veröffentlicht wird, bietet die Entität sie an, und ein Tastendruck startet die Installation. Panel Assistant installiert das Update und bestätigt, dass das Panel wieder ordnungsgemäß läuft. Diesen Weg solltest du nutzen.

Ein Update beginnt, wenn Panel Assistant oder du es ausdrücklich anforderst. Die Panel-App installiert keine geplanten Updates. Auf der Registerkarte **Installieren** ihrer Weboberfläche kannst du ebenfalls eine Version der Panel-App auswählen und installieren, auch eine Vorabversion. Die Auswahl gilt für die Installation, die du startest. Es gibt keinen gespeicherten Update-Kanal.

Android System WebView wird separat gepflegt, je nach Panel über den Play Store, die Herstellerfirmware oder eine manuelle Installation. Siehe [System-WebView aktualisieren](/de/hardware/guides/update-the-webview/).

### Panels, die ADB benötigen

Wenn du ein Update aus Home Assistant installierst, verwendet Panel Assistant automatisch ADB für Panels, die das Update nicht selbst installieren können. Wenn das Panel die Verbindung ohne Antippen auf dem Bildschirm annimmt, umfasst deine ursprüngliche Zustimmung zur Installation von Panel Assistant auch das Erstellen und Speichern eines ADB-Schlüssels für zukünftige Updates. Wenn das Panel eine Bestätigung auf seinem Bildschirm verlangt, zeigt Home Assistant eine Reparatur an, die das Panel nennt und die Autorisierung startet. Folge der Reparatur, um die Aufforderung auf diesem Panel zu bestätigen.

### Ein Panel, das sich nicht aktualisieren lässt

Manche Panels lassen sich nur über ADB aktualisieren, weil sie Apps nicht selbst installieren können. Bei ihnen ist ADB keine Komfortfunktion, sondern der gesamte Update-Weg. Wenn es nicht mehr funktioniert, läuft das Panel normal weiter und bleibt dabei unbemerkt bei seiner bisherigen Version. Home Assistant zeigt in diesem Fall eine Reparatur an, die das Panel nennt.

Die übliche Ursache ist eine Änderung auf dem Panel und nicht in Home Assistant. Ein Update der Herstellerfirmware, ein Zurücksetzen auf Werkseinstellungen oder eine Herstelleroption, die die mitgelieferte Software wiederherstellt, können die Entwickleroptionen von Android wieder ausschalten. Damit wird auch ADB abgeschaltet. Es gibt in diesem Moment keine Warnung, weil aus Sicht des Panels nichts falsch läuft.

Wenn du die Entwickleroptionen und USB-Debugging wieder aktivierst, stellst du bei den meisten Panels den Update-Weg wieder her. Die Schritte sind dieselben wie bei der ersten Vorbereitung dieses Panels: siehe [Panel vorbereiten](/de/install/prepare-a-panel/#1-developer-options-and-debugging-are-on). Wie du diese Einstellungen erreichst, unterscheidet sich je nach Panel. Manche Hersteller verstecken sie hinter einer Folge von Berührungen auf einer Infoseite.

Wenn die Reparatur bestehen bleibt oder das Panel das Netzwerk-Debugging selbst ausschaltet, etwa ein Meta Portal nach einem Neustart oder ein Shelly Wall Display nach einem Zurücksetzen, schließe das Panel per USB an deinen Computer an und starte das USB-Installationsprogramm aus Home Assistant, wie unter [Über USB installieren](/de/install/install-over-usb/#der-ausgangspunkt-ist-home-assistant) beschrieben. Du musst vorher nichts entfernen: Auf einem Panel, auf dem die App bereits vorhanden ist, installiert das Installationsprogramm nichts. Wenn das Panel fragt, aktiviere **Von diesem Computer immer zulassen** und tippe auf **Zulassen**. Das Installationsprogramm schaltet dann das Netzwerk-Debugging wieder ein und meldet, dass Panel Assistant das Panel wieder erreichen kann. Home Assistant bietet von dort aus das Update des Panels an. Das Update behält seine Einstellungen und seinen Verlauf bei.

Wenn Home Assistant für das Panel außerdem **Updates auf … erlauben** anzeigt, ist es erreichbar, hat diesen Home Assistant aber noch nicht akzeptiert. Öffne diese Reparatur oder gehe zu **Einstellungen**, **Geräte & Dienste**, **Panel Assistant**, wähle für das Panel **Konfigurieren** und dann **Updates erlauben**. Tippe anschließend auf dem Panel auf **Zulassen**, wenn es danach fragt.

## Was ein Update schützt

Panel Assistant prüft das Panel, bevor es etwas ändert, und sichert vor jedem Update die Einstellungen des Panels. Die letzten fünf Sicherungen pro Panel werden aufbewahrt.

Erstelle vor einer Änderung, bei der du unsicher bist, selbst eine Sicherung: Öffne in der Weboberfläche des Panels **Installieren**, dann **Sicherung**, und bewahre die heruntergeladene `.hpb`-Datei auf.

## Wiederherstellung

Wenn ein Dashboard nach einem Update nicht lädt, liegt das meist an der System-WebView oder am Dashboard selbst. Das Panel hat dafür sein eigenes Verhalten für [Start und Wiederherstellung](/de/manage/built-in-renderer/#startup-and-recovery). [Fehlerbehebung](/de/manage/troubleshooting/) beschreibt die üblichen Ursachen. Ein Panel mit der Panel-App 1.0 kann nicht zu einer früheren Version zurückkehren. [Upgrade auf 1.0](/de/manage/upgrade-to-1-0/#going-back) erklärt, was möglich ist.

Die Wiederherstellung unterhalb der App-Ebene ist eine andere Sache. Panel Assistant rührt die Firmware eines Panels niemals an. Bei manchen gerooteten Panels lassen sich jedoch die Firmwarepartitionen von Hand sichern und wiederherstellen. Das ist unter [Firmware sichern und wiederherstellen](/de/hardware/guides/firmware-backup-and-restore/) dokumentiert.

:::danger
Die Wiederherstellung der Firmware ist experimentell und wurde nicht an einem unbrauchbar gewordenen Gerät getestet. Betrachte Arbeiten an den Partitionen eines Panels als etwas, das es unbenutzbar machen kann, und lies das Dokument vollständig, bevor du beginnst.
:::
