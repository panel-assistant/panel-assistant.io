---
title: Entwicklungsumgebung
description: Die Werkzeuge zum Bauen der Panel-App, die Wege über Docker und Devcontainer und was ein Fork über Signierung wissen muss.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
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
