---
title: Panel-Profile aus der Community
description: Profile aus der Community für Panels ohne mitgeliefertes Profil, ihr sicherer Import und das Aktivieren einer Kamera, die ein Profil nicht deklariert.
sidebar:
  label: Übersicht
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Dies ist ein Katalog von Profilen aus der Community, die nicht mit ha-paneld ausgeliefert werden. Die Aufnahme eines Profils ist keine Aussage darüber, dass ha-paneld auf der genannten Handelshardware im Auslieferungszustand läuft. Jedes Profil kann sich auf eine bestimmte neu aufgespielte Firmware, Firmwareänderung oder einzelne gemeldete Installation beziehen, statt auf die Originalsoftware des Herstellers.

Community-Profile werden niemals automatisch ausgewählt. Lade die einzelne YAML-Datei herunter, prüfe ihre Quelle, getestete Firmware und Einschränkungen und importiere sie über die Seite **Profile** des Panels. Import und Validierung dienen nur der Vorschau; sie speichern oder aktivieren das Profil nicht.

Verlange vor dem Speichern, dass die Vorschau bestätigt, dass jedes Prädikat einer vollständigen Übereinstimmungsgruppe mit den unveränderlichen Gerätedaten des Panels übereinstimmt. Ein passender Name allein reicht nicht. Die Aktivierung prüft diese Identität zwingend und lehnt unsichere exklusive Touchscreen-Zugriffe ab, prüft jedoch nicht jeden tatsächlichen Berechtigungsweg vorab. Nach dem kontrollierten Neustart prüfen die laufenden Treiber der jeweiligen Funktion ihre Schnittstellen und Berechtigungen bei der Initialisierung oder Nutzung; nicht verfügbare Funktionen bleiben nicht verfügbar. Die Startzustandsprüfung entscheidet, ob der Kandidat aktiv bleibt oder zurückgerollt wird. Behandle einen erfolgreichen Import oder eine erfolgreiche Aktivierung niemals als Beweis dafür, dass jede deklarierte Funktion arbeitet.

## Ein Community-Profil sicher ausprobieren

1. Öffne die Geräteseite des Panels in Home Assistant, wähle **Besuchen** und öffne dann **Profile**. Exportiere die aktive Revision und erstelle eine aktuelle vollständige Panelsicherung. Verwende bei einer direkten Verbindung den vom Panel gemeldeten HTTP-Port (`http://<panel-ip>:8888/profiles` beim Standardport).
2. Lade das YAML herunter und prüfe es. Bestätige, dass seine genauen Annahmen zu Firmware und Änderungen das Panel vor dir beschreiben.
3. Füge das YAML unter **Profile** ein oder lade es hoch und validiere es. Fahre nicht fort, wenn die Identitätsübereinstimmung unvollständig ist, ein erforderlicher kompilierter Treiber fehlt oder eine unsichere Eingabezuordnung gemeldet wird. Die Validierung beweist keine tatsächliche Hardwareberechtigung.
4. Speichere den validierten Inhalt als inaktive lokale Revision. Auch das Speichern ändert das laufende Profil nicht.
5. Teste und aktiviere es nur, während jemand das Panel sehen und berühren kann. Folge der [Checkliste für Profiltests](/de/reference/profiles/testing/). Die Aktivierung ist an die genaue Profil-ID, Revision und den Inhaltshash gebunden.
6. Prüfe nach dem Neustart die tatsächlichen Funktionsergebnisse und bestätige die aktive Revision, erwarteten Bedienelemente und Home Assistant-Entitäten. Ein nicht verfügbarer Weg muss nicht verfügbar bleiben, statt als erfolgreich zu gelten. Probiere **Rollback** aus, bevor du dich unbeaufsichtigt auf das Profil verlässt; eine fehlgeschlagene Startzustandsprüfung sollte automatisch zur letzten funktionierenden Revision zurückkehren.

Die Rückkehr zu **Automatik verwenden** wählt nur ein mitgeliefertes Profil oder den vorsichtigen Generic-Fallback aus. Eine Community-Revision wird nicht automatisch erneut aktiviert.

## Die Kamera eines Panels aktivieren, dessen Profil keine deklariert

Die Kamera wird auf jedem Panel angeboten, das eine hat: entweder eine vom Profil über `hardware.camera` deklarierte Kamera oder eine von Android aufgelistete Kamera auf einem Panel, dessen Profil nichts dazu sagt. Eine Platine mit funktionierender Kamerahardware benötigt daher normalerweise überhaupt keinen Profileintrag. Die Gruppe Kamera erscheint unter **Konfiguration**, ohne dass jemand YAML bearbeiten muss.

Drei Dinge können sie dennoch fehlen lassen. Die Karte Kamera unter **Konfiguration** nennt den jeweiligen Grund, statt zu verschwinden:

- **Das Profil unterdrückt sie.** `hardware.camera: false` ist ein bewusster dritter Zustand und nicht dasselbe wie das Weglassen des Schlüssels: Er besagt, dass das aufgelistete Gerät keine nutzbare Raumkamera ist, etwa bei einem HDMI-Aufnahmeeingang. Entferne die Zeile oder setze sie auf `true`, um die Kamera anzubieten.
- **Android hat keine Kamera aufgelistet.** Wenn das Panel eine hat, deklariere `hardware.camera: true` in seinem Profil. Eine Deklaration hat Vorrang vor einer leeren Auflistung. Das hilft daher auch, wenn der Kameradienst vorhanden, die Auflistung aber unzuverlässig ist.
- **Die Auflistung hat noch nicht geantwortet.** Das ist keine Aussage über die Hardware. Warte einige Sekunden und lade Konfiguration neu; du musst nichts bearbeiten.

Eine Kamera zu deklarieren, die die Platine nicht bereitstellt, ist sicher und schadet nicht. Eine kleine Laufzeitprüfung liest Androids Liste der Kamera-IDs für die Funktionsmeldung. Eine deklarierte Kamera wird weiterhin angeboten; eine Platine ohne Kamera lehnt das Öffnen mit einem klassifizierten Fehler `no_camera_id` ab, dessen Handlungshinweis auf ein falsches Profil verweist. Das destabilisiert das Panel nicht.

Eine Anforderung gehört zum Schalter. Die Kameranutzung wird sicher verweigert, wenn das Panel dem Raum nicht anzeigen kann, dass sie geöffnet ist. Bei ausgeschaltetem Bildschirm erfordert das einen Anzeigeweg außerhalb des Displays. Stelle für Aufnahmen bei ausgeschaltetem Bildschirm eine funktionierende LED-Anzeige bereit. Bei eingeschaltetem Bildschirm kann die Bildschirmanzeige die Anforderung ohne LED erfüllen. Setze `hardware.camera_lens_offset_px` so, dass diese Anzeige unter der Linse statt daneben sitzt.

Alles andere an der Kamera bleibt durch das Flag unverändert: Sie bleibt aus, bis sie aktiviert wird, der Schalter ist nie als Standard vorgeschlagen, und das Einschalten über die Home Assistant-Kameraentität fordert in jedem Sicherheitsmodus eine Bestätigung auf dem Bildschirm des Panels an. Die Kameraeinstellung unter Konfiguration ist ein separater Konfigurationsweg für den Besitzer.

## Katalog

- [`community-cronos-lineageos18.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml): Ein Entwurf für den Amazon Echo Show 5 Gen 2 eines Mitwirkenden mit neu aufgespieltem LineageOS 18.1. Unter dem originalen Fire OS kann ha-paneld nicht laufen; Entsperren, Neuaufspielen und Wiederherstellung werden nicht unterstützt, und das Projekt hat das Profil nicht auf Hardware validiert. Siehe die [profilspezifischen Nachweise](/de/reference/profiles/community/echo-show-5-gen2/).
- [`community-lenovo-thinksmart-view-lineageos.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-lenovo-thinksmart-view-lineageos.yaml): Ein Entwurf für den Lenovo ThinkSmart View eines Mitwirkenden mit neu aufgespieltem LineageOS 8.1. Er wählt Android-Ruhezustand, weil Helligkeit null sichtbar beleuchtet bleibt, hält fest, dass Berührung das Panel nicht weckt, und vermerkt die Bestätigung des Mitwirkenden, dass Home Assistant es dimmen, vollständig ausschalten und wieder wecken kann. Siehe die [profilspezifischen Nachweise](/de/reference/profiles/community/lenovo-thinksmart-view/).
- [`community-sunworld-yc-sm55p-p76s01.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-sunworld-yc-sm55p-p76s01.yaml): Ein Entwurf für das 5,5-Zoll-Sunworld YC-SM55P eines Mitwirkenden auf der Portworld P76S01-Platine. Das Profil hält die durch Firmware belegte RK3576S-Identität und vorsichtige Android-Steuerungswege fest, lässt optionale Sensoren und Kamerahardware aber bis zu physischen Tests deaktiviert. Seine generische Rockchip-Build-Identität eignet sich nicht zur sicheren automatischen Auswahl. Siehe die [profilspezifischen Nachweise](/de/reference/profiles/community/sunworld-yc-sm55p/).

Profilformat, Vertrauensgrenze und Anforderungen für Beiträge erklären die [Anleitung zu Laufzeitprofilen](/de/reference/profiles/), die [Formatreferenz](/de/reference/profiles/format/), die [Testcheckliste](/de/reference/profiles/testing/) und die [Anleitung zum Teilen](/de/reference/profiles/sharing/).
