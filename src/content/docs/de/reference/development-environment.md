---
title: Entwicklungsumgebung
description: Die Werkzeuge zum Bauen der Panel-App, die Wege über Docker und Devcontainer und was ein Fork über Signierung wissen muss.
sourceCommit: 396e908e6370b88a9fd555abcb67b0816c4cd6f4
---

Du musst ha-paneld nicht bauen, um es zu verwenden: Die Installation eines Panels lädt eine signierte Veröffentlichung herunter. Diese Seite richtet sich an Mitwirkende und alle, die einen Fork pflegen. Eine geführte Tour durch den Quellcode bietet der [Code-Rundgang auf DeepWiki](https://deepwiki.com/panel-assistant/android).

## Werkzeuge

Die Panel-App ist eine in Kotlin geschriebene und mit Gradle gebaute Android-App. Sie benötigt **JDK 17** und ein Android SDK mit **Plattform 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 und CMake 3.22.1** (CMake und das NDK bauen den nativen LED-Treiber). Der Gradle-Wrapper legt die Gradle-Version fest. Abhängigkeitsversionen stehen in [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml).

Wenn diese Werkzeuge lokal installiert sind:

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

Wenn du außer Docker nichts installieren möchtest, baut [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) ein Docker-Image und führt Gradle darin aus. Sein Dockerfile listet die im Image enthaltenen SDK-Pakete auf. Das APK landet in deinem Arbeitsverzeichnis. Das Image wird nach dem ersten Build zwischengespeichert, und Gradle-Caches bleiben in einem benannten Docker-Volume erhalten.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Wenn du das Skript in einem Container ausführst, der mit einem äußeren Docker-Daemon kommuniziert, lies den Hinweis zu `HOST_WORKDIR` in `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) legt dieselben Android-Werkzeuge für VS Code fest, sodass SDK und NDK deinen eigenen Rechner nicht berühren. Öffne das Repository in VS Code, wähle **Reopen in Container** und führe anschließend die obigen Gradle-Befehle aus. Das JDK des Devcontainers ist neuer als JDK 17. Behandle daher einen JDK-17-Build als maßgeblich für das Verhalten der Java-Version.

## Der Root-Helper

Gradle baut und prüft beide ABI-spezifischen Root-Helper automatisch vor dem App-Build. App und Helper betten dieselbe Identität ein, die aus jeder Helper-Quelldatei, jedem Header und jeder Befehlsdefinition abgeleitet wird. Ein lokaler App-Build kann dadurch nicht unbemerkt von veraltetem privilegiertem Code abhängen.

## Dashboardleistung von einem Computer aus messen

Die eigene Statusseite des Panels deckt die Leistung im Alltag ab; siehe [Leistung](/de/manage/performance/). Für einen aufgezeichneten Vergleich eines Dashboards mit und ohne Entitätenfilter, gemessen von außerhalb des Panels, enthält das Repository ein Erfassungsskript.

Überlastet das ungefilterte Dashboard seine eigene WebView, können die Werte auf der Seite stehen bleiben. Ein auf einem Computer ausgeführtes Erfassungsskript fragt stattdessen die eigene Leistungsschnittstelle der Panel-App ab. Sie gehört zur veralteten REST-API (siehe [Steuerungsreferenz](/de/reference/api/#the-rest-api-is-deprecated)). So bleibt die Gesamt-CPU des Panels beobachtbar und mit Root oder Helper auch eine native Messung des Chromium-Rendererthreads. Das Skript erfasst außerdem das Alter des letzten Browsermesswertpakets. Alles über 15 Sekunden wird als festgefahren statt als aktuell gemeldet.

Das Skript ändert deine Konfiguration nicht. Es schaltet den Entitätenfilter weder ein noch aus und schreibt ihn nicht um. Seine erste Anfrage kann einen privaten Installationsschlüssel im internen Zustand der Panel-App erzeugen. Wähle für beide Durchläufe dieselbe Dashboardansicht und Arbeitslast, ändere den Filter in der Weboberfläche, warte auf das Neuladen und führe pro Zustand einen Befehl aus einem Checkout des [ha-paneld-Repositorys](https://github.com/panel-assistant/android) aus:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Vergleiche die beiden Ergebnisse:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Jeder Durchlauf dauert standardmäßig drei Minuten mit 30 Sekunden Aufwärmzeit und Abfragen alle 10 Sekunden. `--pair-with` verwendet eine undurchsichtige Vergleichs-ID aus dem ersten Ergebnis wieder. So kann der Vergleich ein anderes physisches Panel, einen anderen konfigurierten Home Assistant oder ein anderes Dashboard sowie geänderte messungsrelevante Einstellungen ablehnen, ohne diese privaten Werte zu speichern. Eine von Hand ausgewählte andere Ansicht innerhalb desselben Dashboards kann er nicht erkennen. Halte daher sichtbare Ansicht und Arbeitslast gleich.

Das Skript lehnt einen Durchlauf ab, wenn der erwartete Modus nicht aktiv ist, sich Filterrevision oder Renderergeneration ändern, Build oder Konfiguration während der Erfassung wechseln, die Filterung zurückfällt oder weniger als drei Stichproben, drei Gesamt-CPU-Stichproben oder drei native Renderer-CPU-Stichproben verbleiben. Es schreibt das abgelehnte Ergebnis trotzdem mit den genauen Gründen und überschreibt nie eine vorhandene Ausgabedatei.

Das JSON lässt URL und ID des Panels, Home Assistant-URL und Dashboardpfad, Entitäts-IDs, Prozessnamen und Filterhash weg. Das Panel berechnet die undurchsichtigen Fingerabdrücke mit einem privaten zufälligen 256-Bit-Installationsschlüssel, der es niemals verlässt. Die Fingerabdrücke sind für jedes Vergleichspaar einzigartig. Separate Messungen lassen sich darüber weder verknüpfen noch zum Erraten eines Panelnamens verwenden. Kann ein Panel den Schlüssel nicht speichern, verweigert es die Messung. Die ungefilterte Entitätenanzahl ist die zuletzt synchronisierte Kataloganzahl, kein aus der überlasteten WebView ermittelter Live-Wert. Bei leerem Katalog wird sie als nicht verfügbar gemeldet. Netzwerk- und Browserverkehrszähler werden auf die tatsächlich beobachteten Intervalle normiert, damit eine verpasste Abfrage den Vergleich nicht verzerrt. Veraltete Browserzeit- und Verkehrsraten fehlen in den Zusammenfassungen. CPU-, Speicher-, Netzwerk- und Rendererwerte der Panel-App selbst werden weiter erfasst.

## Signierung

Du musst keine Signierung konfigurieren, um ha-paneld zu bauen und auszuführen. Ein Checkout ohne Signierungskonfiguration verwendet für Debug-Builds den eingecheckten `debug.keystore`. Wenn `keystore.properties` eine Signierungskonfiguration bereitstellt, verwenden Debug-Builds stattdessen diesen Schlüssel. Offizielle Veröffentlichungen werden mit dem privaten Release-Schlüssel des Projekts signiert, der sich niemals im Repository befindet.

Android verweigert das Aktualisieren einer installierten App mit einem APK, das mit einem anderen Schlüssel signiert ist. Ein Wechsel zwischen offizieller Veröffentlichung, eigenem Release-Schlüssel und Debug-Build erfordert daher zuerst eine Deinstallation. Erstelle vorher unter **Installation → Sicherung** eine vollständige verschlüsselte `.hpb`-Sicherung und prüfe, ob die Datei gespeichert wurde. Andernfalls entfernt die Deinstallation Profile, erlernten Zustand und Verlauf. Panel Assistant macht die Panel-App zum Geräteadministrator, und Android verweigert die Deinstallation eines Geräteadministrators. Gib diese Rolle daher zuerst frei. Entferne die App entweder über die Option **Von diesem Panel entfernen** unter **Konfigurieren** in Home Assistant oder gib die Geräteadministratorrolle frei und deinstalliere über ADB:

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

Wenn `pm uninstall` weiterhin `DELETE_FAILED_DEVICE_POLICY_MANAGER` meldet, warte eine Sekunde und führe den Befehl erneut aus. Installiere den anderen Build und stelle die Sicherung anschließend über **Installation → Wiederherstellen** wieder her. Siehe [Updates und Wiederherstellung](/de/manage/updates-and-recovery/).

Um eigene Builds einheitlich zu signieren, kopiere [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) nach `keystore.properties` und fülle die Datei aus. Wenn sie vorhanden ist, wird `assembleRelease` mit dem Release-Schlüssel signiert. Ein Fork, der getaggte Veröffentlichungen über GitHub Actions bereitstellt, hinterlegt denselben Schlüssel stattdessen als Repository-Secrets.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Committe niemals `keystore.properties` oder die `.jks`-Datei (beide sind in gitignore). Sichere den Keystore und sein Passwort: Gehen sie verloren, kannst du nie wieder ein Update über deine bestehenden Builds veröffentlichen.
:::
