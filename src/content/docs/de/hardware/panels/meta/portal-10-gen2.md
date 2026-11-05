---
title: Meta Portal 10" (2nd gen)
description: Hardwaredaten und Kaufhinweise zum Meta Portal 10 Zoll (2nd gen), Modell WD50JM, einem Qualcomm-QCS605-Smart-Display mit Android 10, gemessen an einem physischen Gerät mit Panel Assistant ohne Root.
vendor: Meta
model: Portal 10" (2nd gen), WD50JM
soc: Qualcomm QCS605
android: '10'
screen: 10.1 Zoll, 1280 × 800
support: Vorläufig
root: Kein Root; Metas ADB-Schalter reicht für die Einrichtung
webview: Metas eigenes Chromium-131-WebView
released: '2019'
evidence: [bench, firmware, documented]
sidebar:
  label: Portal 10" (2nd gen)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Alles auf dieser Seite wurde an einem im Handel gekauften Portal 10" (2nd gen) gemessen**, mit Metas Firmware `QKQ1.210213.001.3051355900018050` (Android 10, Sicherheitspatch 2020-08-05) und Panel Assistant ohne Root. Portal-Unterstützung erfordert Version 1.0 oder neuer der Panel-App. Nichts davon wurde an einem anderen Portal-Modell geprüft; die [Meta Portal-Familienseite](/de/hardware/panels/meta/) erklärt den Umgang mit den anderen Modellen.
:::

Das Portal 10" (2nd gen), Modell **WD50JM**, ist ein 10,1-Zoll-Smart-Display im Querformat mit Qualcomm QCS605, etwa 3 GB RAM, einer 13-MP-Kamera mit eigener Kameraleuchte, zwei Mikrofonen, einem Lautsprecher und einem physischen Privatsphäreschieber. Metas [ADB-Schalter](#enabling-adb) ist alles, was Panel Assistant benötigt: Die Panel-App wird über USB installiert, erkennt das Portal und lädt sein eigenes Hardwareprofil. Dashboard, Kamera, Mikrofon, Aktivierungswort, gesprochene Antworten, Lichtsensor und echtes Bildschirm-Aus funktionieren ohne Root.

Es ist ein gutes Panel mit ungewöhnlichen Bedingungen, meist von Meta. Die vor dem Kauf wichtigen Punkte stehen unter [Vor dem Kauf](#before-you-buy).

:::tip
Die wichtigsten Fakten: **Lass das Meta-Konto angemeldet**, denn der ADB-Schalter ist durch dessen PIN geschützt. **Der ADB-Schalter sieht ein- und ausgeschaltet gleich aus**; prüfe seinen Zustand daher am Computer. **Rechne damit, ADB nach einem Neustart erneut einschalten zu müssen.** Das von Panel Assistant für Updates genutzte Netzwerk-Debugging übersteht niemals einen Neustart. Zum Zurücksetzen auf Werkseinstellungen halte **beide Lautstärketasten beim Anschließen der Stromversorgung gedrückt, ohne USB-Verbindung zu einem Computer**.
:::

## Auch erhältlich als

Meta Portal, Facebook Portal, Portal (2nd gen), Portal 10", Modell WD50JM. Android meldet Modell `Portal`, Gerät und Platine `omni`, Produkt `omni_prod`, Hersteller und Marke `Facebook`, Hardwareplattform `atlas`.

|              |                                                                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC          | Qualcomm **QCS605**, 8 Kerne                                                                                                                              |
| RAM          | Etwa **3 GB** (Android meldet 2.85 GB)                                                                                                                    |
| Speicher     | 6.7 GB für Apps und Daten, etwa 3.9 GB nach der Einrichtung frei; kein Speicherkartensteckplatz                                                           |
| Bildschirm   | **1280×800** im Querformat, 10.1 Zoll, **etwa 149 ppi**, bei Androids Basisdichte von 160 dpi. FocalTech-Touchcontroller mit Aufwecken durch Doppeltippen |
| Android      | 10 (API 29), Produktionsbuild `user`, SELinux erzwingend; arm64-v8a                                                                                       |
| WebView      | Metas eigener WebView-Build, Chromium **131**, durch Metas Hintergrund-Updater aktuell gehalten. Keine WebView-Arbeiten erforderlich                      |
| Sensoren     | **Beschleunigungssensor** und Neigung; **Umgebungslicht mit Farbe**. **Kein Näherungssensor**                                                             |
| Kamera       | **13-MP**-Sensor oben links im Rahmen, mit **grüner Kameraleuchte** daneben. Apps wie der Panel-App werden 1280×720 angeboten                             |
| Audio        | **Zwei Mikrofone**, ein Lautsprecher                                                                                                                      |
| Privatsphäre | **Schieber mit drei Positionen**: Kamera und Mikrofone an; Kamera abgedeckt; Kamera abgedeckt und Mikrofone aus                                           |
| Tasten       | Lauter und leiser. Kein Ein-/Ausschalter                                                                                                                  |
| Funk         | WLAN, Bluetooth mit **Bluetooth Low Energy**                                                                                                              |
| Anschlüsse   | **USB-C**, für ADB genutzt                                                                                                                                |
| Root         | Keiner. Kein `su`, keine bekannte Bootloader-Entsperrung. ADB kommt aus Metas eigener Debug-Einstellung                                                   |
| Erschienen   | 2019 (im September angekündigt, ab Oktober erhältlich)                                                                                                    |

<a id="before-you-buy"></a>

## Vor dem Kauf

Keiner dieser Punkte ist ein Grund, kein Portal zu kaufen, aber jeden kennt man besser im Voraus.

- **Du brauchst ein Facebook-Konto.** Metas Einrichtung erreicht die Einstellungen nicht ohne Anmeldung. Sie bietet Facebook oder WhatsApp an; der WhatsApp-QR-Code erschien bei uns nie, die Facebook-Anmeldung funktionierte. Ein neues Konto für das Panel reicht aus.
- **Das Konto muss angemeldet bleiben.** Das Einschalten von ADB fragt nach der während der Einrichtung erstellten PIN des Meta-Kontos. Ohne angemeldetes Konto fanden wir keinen Weg, ADB wieder einzuschalten. Auch Metas Zurücksetzen auf Werkseinstellungen am Bildschirm funktionierte nicht mehr; nur der [Hardware-Reset](#recovery-factory-reset) brachte das Portal zurück. Entferne das Konto nicht und deaktiviere Metas Einrichtungs-App nicht.
- **ADB bleibt nicht eingeschaltet.** Berichten zufolge schaltet sich Metas ADB-Einstellung bei jedem Neustart aus; rechne also damit, sie wieder einschalten zu müssen. Die von Panel Assistant für Updates genutzte Netzwerk-Debugging-Verbindung ging bei jedem von uns getesteten Neustart verloren. Das hat Folgen für [Updates](#updates).
- **Lehne den Firmwaredownload während der Einrichtung möglichst ab.** Metas Einrichtung bietet einen Updatedownload an. Wir lehnten ihn ab; alles auf dieser Seite wurde daher mit dem oben genannten Firmwarebuild getestet. Ob spätere Meta-Firmware den ADB-Zugang verändert, ist unbekannt. Meta veröffentlicht keinen Weg zurück.
- **Meta stellt Portal schrittweise ein.** Meta verkaufte ab 2022 keine Portals mehr und hat seitdem Funktionen zurückgezogen. Rechne damit, dass weitere eigene Meta-Dienste und möglicherweise Anmeldeverfahren ausfallen. Die Panel-App ist von keinem davon abhängig.
- **Ein Computer mit Chromium-basiertem Browser und ein USB-C-Datenkabel** werden zur Installation benötigt, wie bei jedem [über USB](/de/install/install-over-usb/) installierten Panel.

<a id="enabling-adb"></a>

## ADB aktivieren

Meta dokumentiert das Verfahren für jedes Portal ([Meta, Portal-Einrichtung für Android-Apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)):

1. Öffne auf dem Portal **Settings › Debug**.
2. Tippe auf **ADB Enabled** und gib auf Nachfrage die PIN des Meta-Kontos ein.
3. Verbinde das Portal über USB-C mit dem Computer.
4. Tippe beim ersten Mal auf dem Portal auf **Allow**, um dem Computer zu vertrauen.

:::caution
**Der Eintrag ADB Enabled sieht bei ein- und ausgeschaltetem ADB genau gleich aus, und jede Berührung schaltet um.** Nichts auf dem Portal-Bildschirm zeigt den Zustand an. Der einzige Nachweis ist am Computer: Das Portal erscheint in der USB-Geräteliste des Browsers oder in `adb devices`. Falls nicht, tippe den Eintrag einmal erneut an und prüfe wieder, statt mehrmals zu tippen.
:::

Es gibt keinen verifizierten Weg, Netzwerk-ADB auf TCP-Port 5555 ohne Computer zu aktivieren. Nutze zuerst den USB-Weg oben; Metas ADB-Schalter allein ist kein verifizierter Weg für eine Netzwerkinstallation. Das USB-Installationsprogramm bereitet Netzwerk-Debugging für spätere Updates vor. Root ist nicht erforderlich.

<a id="installing-panel-assistant"></a>

## Panel Assistant installieren

Installiere die Panel-App aus Home Assistant mit dem [USB-Installationsprogramm](/de/install/install-over-usb/), während das Portal über USB-C mit deinem Computer verbunden und ADB wie oben eingeschaltet ist. Panel Assistant ist erforderlich: Darüber wird die App installiert, verbunden und aktualisiert. Auf dem getesteten Portal wurde die Installation normal abgeschlossen, die App zeigte die Dashboard-Einrichtungsseite und wählte beim ersten Start selbst das Profil Portal 10" (2nd gen).

Bei einem Portal bereitet Panel Assistant das Panel während der Installation auch vor: Es legt die Panel-App als Startbildschirm fest, erteilt die Mikrofonberechtigung und schaltet Metas Bildschirmschoner und die Hochwischleiste aus. Nichts davon lässt sich in Metas eigener Einstellungen-App ändern. Die Kameraberechtigung wird beim ersten Einschalten der Kamera auf dem Portal-Bildschirm angefragt.

Eine Einstellung wählst du selbst: den **Dashboard-Zoom**. Bei der nativen Dichte des Portals wird das Dashboard größer als auf anderen Querformatpanels dargestellt. Das Panelprofil setzt **Zoomstufe (%)** standardmäßig auf **85**, wodurch Androids eigene Seiten scharf bleiben. Ändere dies bei Bedarf in den Einstellungen des [integrierten Renderers](/de/manage/built-in-renderer/).

[Füge das Panel](/de/install/installing-ha-paneld/) danach wie üblich in Panel Assistant hinzu.

## Was funktioniert

- **Das Dashboard**, flüssig in Metas eigenem aktuellem WebView.
- **Kamera.** Wie auf jedem Panel standardmäßig aus und über die Karte **Kamera** in Konfiguration eingeschaltet. Sie stellt dann einen 1280×720-Stream und Standbilder für Home Assistant bereit. Während der Nutzung leuchtet die grüne Kameraleuchte des Portals.
- **Mikrofone, Aktivierungswort und gesprochene Antworten.** Das Aktivierungswort wurde erkannt und die Sprachpipeline von Home Assistant antwortete über den Portal-Lautsprecher. Siehe [Sprachassistent](/de/manage/voice-assistant/).
- **Umgebungslicht**, einschließlich Farbe, als normaler Android-Sensor für adaptive Helligkeit und Home Assistant.
- **Echtes Ausschalten des Bildschirms ohne Root.** Die Panel-App schaltet den Bildschirm über das Android-eigene Zeitlimit für den Ruhemodus aus. Dadurch wird die Hintergrundbeleuchtung vollständig dunkel, statt nur auf die niedrigste Stufe zu wechseln. Auf einem Portal reicht es nicht aus, die Helligkeit auf null zu senken: Das Bild bleibt sichtbar. Wenn das Zeitlimit nicht greift, versucht die App zunächst, den Bildschirm über die Geräteadministrator-Funktion von Android zu sperren. Wenn keine der beiden Methoden funktioniert, dimmt sie den Bildschirm.
- **Aufwecken**: Doppeltippen auf den Bildschirm weckt ihn, ebenso Metas eigene Bewegungserkennung, wenn sich jemand in der Nähe bewegt.
- **Die Launcher-Schaltfläche** in der Navigation der Panel-App führt zum eigenen App-Launcher. Das Profil weist sie an, Metas Launcher zu überspringen, der eine Uhr statt einer App-Liste zeigt.

## Aktuelle Einschränkungen

- **Automatischer Ruhezustand ist standardmäßig aus; wir empfehlen, ihn ausgeschaltet zu lassen.** Das Portal hat keinen Näherungssensor, sodass die Panel-App nicht erkennen kann, ob jemand davor ist. Ruhezustand nach einer Zeit ohne Berührung schaltete den Bildschirm vor einer am Panel sitzenden Person aus, woraufhin Metas Bewegungserkennung ihn immer wieder aufweckte. Diese reagiert auf jede Bewegung, auch Vorbeigehen, weckte den Bildschirm gelegentlich bei leerem Raum und ist für andere Apps nicht lesbar. Die Panel-App kann sie daher nicht als Anwesenheitssignal nutzen. Du kannst den Bildschirm weiterhin über Home Assistant aus- und einschalten.
- **Zwei Kameraanzeigen.** Die Panel-App zeichnet ihre eigene Kamera-an-Anzeige oben mittig auf den Bildschirm, während Linse und grüne Kameraleuchte des Portals oben links sitzen. Die Bildschirmanzeige ist hier redundant und lässt sich nicht ausschalten.
- **Metas Lautstärkeregler ändert die Medienlautstärke nicht**, die gesprochene Antworten und Durchsagen nutzen. Die Medienlautstärke kann anfangs null sein, wodurch die erste Antwort stumm bleibt. Stelle sie über **Panel-Lautstärke** am Panel oder dessen Lautstärkeentität in Home Assistant ein; Metas Regler ändert sie nicht.
- **Androids Einstellungen sind weitgehend unerreichbar.** Meta ersetzt Androids Einstellungen-App durch eine eigene reduzierte Version. Panel Assistant setzt bei der Installation, was die Panel-App braucht; andere Android-Einstellungen können am Panel selbst nicht geändert werden.

:::danger
**Deaktiviere Metas Einrichtungs-App (`com.facebook.alohaapps.devicesetup`) nicht und entferne das Meta-Konto nicht.** Mit entferntem Konto und deaktivierter App verlor das getestete Portal sowohl den ADB-Schalter als auch Metas Zurücksetzen auf Werkseinstellungen am Bildschirm. Nur der [Hardware-Reset](#recovery-factory-reset) stellte es wieder her. Lass Metas Konto, Einstellungen und Einrichtungs-Apps unverändert.
:::

## Updates

Ein Portal kann App-Updates nicht selbst installieren, weil dafür Root erforderlich ist. Panel Assistant aktualisiert es daher über Netzwerk-Debugging. Das Portal schaltet dieses bei jedem Neustart aus, auch nach einem Stromausfall. Dann arbeitet das Panel mit seiner bisherigen Version weiter und Home Assistant zeigt eine Reparatur, wie unter [Updates und Wiederherstellung](/de/manage/updates-and-recovery/#ein-panel-das-sich-nicht-aktualisieren-lässt) beschrieben.

Damit Panel Assistant es wieder aktualisieren kann, schalte [ADB](#enabling-adb) ein, verbinde das Portal per USB mit deinem Computer und starte das USB-Installationsprogramm aus Home Assistant, wie unter [Ein Panel, das sich nicht aktualisieren lässt](/de/manage/updates-and-recovery/#ein-panel-das-sich-nicht-aktualisieren-lässt) beschrieben. Das Installationsprogramm installiert auf einem Portal mit vorhandener App nichts; es schaltet Netzwerk-Debugging wieder ein, damit Panel Assistant aktualisieren kann. Prüfe nach dem Update, dass das Portal das Dashboard weiterhin als [Startbildschirm](#installing-panel-assistant) öffnet.

## Privatsphäre

Ein Portal bleibt ein Meta-Gerät mit Meta-Software. Die Panel-App ändert das nicht. Es folgen Messungen am getesteten Gerät, keine vollständige Prüfung.

**Metas Software.** In etwa 25 Minuten nach einem Zurücksetzen auf Werkseinstellungen luden alle Meta-Apps zusammen etwa 3 MB hoch. Metas Kameraanalyse- und Anwesenheitsdienste sendeten jeweils weniger als 0.05 MB. Kontinuierlicher Videoupload wäre erheblich größer; in diesem Zeitfenster wurde daher kein Videoupload beobachtet. Dies ist ein kurzer Test und schließt gelegentliche Uploads nicht aus. Mehrere Meta-Dienste halten Verbindungen zu Meta-Servern offen. Metas Systemsoftware protokolliert Analyseereignisse, darunter jede Nutzung des Privatsphäreschiebers und den Zustand der Kameraleuchte.

**Metas Kameraanalyse schaltet die grüne Leuchte nicht ein.** Metas eigene Bewegungs- und Anwesenheitserkennung beobachtet den Raum über einen separaten reduzierten Kamerastream, der dauerhaft ohne Kameraleuchte läuft. Die grüne Leuchte meldet nur den von anderen Apps genutzten Kamerastream. Die Panel-App kann Metas Analysestream nicht öffnen; wenn sie die Kamera nutzt, leuchtet daher immer die grüne Leuchte.

**Der Privatsphäreschieber funktioniert für die Panel-App.** In der Kameraposition meldet Android die Kamera als nicht verfügbar und die Kamera der Panel-App liefert keine Bilder mehr. In der Mikrofon-aus-Position hörte der Sprachassistent der Panel-App nichts. In 1.0 verfolgt die Panel-App Metas Privatsphäreereignis zusammen mit Androids Stummschaltzustand und kann Mikrofonstummschaltung anzeigen. Physische Schieberübergänge und der Start mit eingeschaltetem Mikrofon wurden für diesen Meldeweg noch nicht qualifiziert.

**Die Panel-App.** Die Kamera bleibt aus, bis sie aktiviert wird. Im aktivierten Zustand steht ihr Stream Clients in deinem lokalen Netzwerk zur Verfügung, mit Raumton, sofern Mikrofonzugriff erlaubt ist. Assist und die Home Assistant-Entitäten verwenden deine eigene Home Assistant-Verbindung.

<a id="recovery-factory-reset"></a>

## Wiederherstellung: Werkseinstellungen

Der Hardware-Reset des Portals funktioniert ohne Meta-Apps, funktionierenden Bildschirm oder ADB:

1. Trenne die Stromversorgung und **jedes USB-Kabel zu einem Computer**.
2. Halte **beide Lautstärketasten** gedrückt und schließe die Stromversorgung wieder an. Halte sie weiter, bis das Portal den Löschvorgang anzeigt.

Das Zurücksetzen löscht alles, einschließlich Panel-App und ihrer Einstellungen. Durchlaufe danach Metas Einrichtung erneut, [aktiviere ADB](#enabling-adb) und [installiere Panel Assistant](#installing-panel-assistant).

:::caution
**Mit angeschlossenem USB-Kabel zu einem Computer setzt dieselbe Tastenkombination das Portal nicht zurück.** Sie startet stattdessen Qualcomms Notfall-Downloadmodus, der am Computer als Qualcomm-USB-Gerät erscheint. In diesem Modus wird nichts geändert. Trenne zum Verlassen die Stromversorgung, entferne das USB-Kabel und versuche es erneut.
:::

## Firmware

Der [Firmwarekatalog für Portal 10" (2nd gen)](/de/hardware/firmware/builds/meta-portal-10-gen2/) enthält indexierte Builds, ursprüngliche Meta-Download-URLs und Internet-Archive-Kopien.

## Quelle

[Meta for Developers: Portal-Einrichtung für Android-Apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): das ADB-Verfahren und die Liste unterstützter Modelle.
