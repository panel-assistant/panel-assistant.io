---
title: Ontwikkelomgeving
description: De toolchain voor de paneel-app, de Docker- en devcontainerroutes en wat een fork moet weten over ondertekenen.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Je hoeft ha-paneld niet te bouwen om het te gebruiken: bij het installeren van een paneel wordt een ondertekende release opgehaald. Deze pagina is voor bijdragers en iedereen die een fork onderhoudt. Zie de [codeverkenning op DeepWiki](https://deepwiki.com/panel-assistant/android) voor een rondleiding door de broncode.

## Toolchain

De paneel-app is een Android-app, geschreven in Kotlin en gebouwd met Gradle. Hij vereist **JDK 17** en een Android SDK met **platform 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 en CMake 3.22.1** (CMake en de NDK bouwen het native ledstuurprogramma). De Gradle-wrapper legt de Gradle-versie vast en afhankelijkheidsversies staan in [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml).

Met die toolchain lokaal geïnstalleerd:

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

Wil je alleen Docker installeren, dan bouwt [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) een image met vastgelegde versies van dezelfde toolchain en voert Gradle daarin uit. De APK komt in je werkboom terecht, het image wordt na de eerste build gecachet en Gradle-caches blijven in een benoemd Docker-volume bewaard.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Voer je het script uit vanuit een container die met een buitenliggende Docker-daemon communiceert, lees dan de opmerking over `HOST_WORKDIR` in `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) legt dezelfde Android-toolchain vast voor VS Code, zodat de SDK en NDK je eigen machine niet raken. Open de repository in VS Code, kies **Reopen in Container** en voer de bovenstaande Gradle-opdrachten uit. De JDK van de devcontainer is nieuwer dan JDK 17, dus beschouw een JDK 17-build als leidend voor gedrag dat van de Java-versie afhangt.

## De root-helper

Gradle bouwt en verifieert automatisch beide ABI-specifieke root-helpers voordat het de app bouwt. De app en helpers bevatten dezelfde identiteit, afgeleid van elk helperbronbestand, elke header en elke opdrachtdefinitie. Zo kan een lokale app-build niet ongemerkt afhankelijk zijn van verouderde bevoorrechte code.

## Ondertekenen

Je hoeft ondertekening niet in te stellen om ha-paneld te bouwen en uit te voeren. Een checkout zonder ondertekeningsconfiguratie gebruikt de meegeleverde `debug.keystore` voor debugbuilds. Levert `keystore.properties` een ondertekeningsconfiguratie, dan gebruiken debugbuilds die sleutel. Officiële releases worden ondertekend met de privésleutel voor releases van het project, die nooit in de repository staat.

Android weigert een geïnstalleerde app bij te werken met een APK die met een andere sleutel is ondertekend. Wisselen tussen een officiële release, je eigen releasesleutel en een debugbuild vereist daarom eerst verwijderen. Maak daarvoor een volledige versleutelde `.hpb`-back-up via **Installeren → Back-up** en controleer of het bestand is opgeslagen; anders verwijdert het de profielen, geleerde toestand en geschiedenis. Panel Assistant maakt de paneel-app apparaatbeheerder, en Android weigert een apparaatbeheerder te verwijderen. Geef die bevoegdheid dus eerst vrij. Verwijder de app met de paneeloptie **Panel Assistant van dit paneel verwijderen** (**Van dit paneel verwijderen** in de nog niet uitgebrachte versie 1.0.0-rc2), onder **Configureren** in Home Assistant, of geef apparaatbeheer vrij en verwijder via ADB:

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

Antwoordt `pm uninstall` nog steeds met `DELETE_FAILED_DEVICE_POLICY_MANAGER`, wacht dan een seconde en voer het opnieuw uit. Installeer de andere build en herstel daarna de back-up via **Installeren → Herstellen**. Zie [Updates en herstel](/nl/manage/updates-and-recovery/).

Om je eigen builds consequent te ondertekenen, kopieer je [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) naar `keystore.properties` en vul je het in; als het bestand aanwezig is, wordt `assembleRelease` met de releasesleutel ondertekend. Een fork die getagde releases via GitHub Actions publiceert, levert dezelfde sleutel in plaats daarvan als repositorysecrets aan.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Commit nooit `keystore.properties` of het `.jks`-bestand (beide staan in gitignore). Maak een back-up van de keystore en het wachtwoord: raak je ze kwijt, dan kun je nooit meer een update over je eigen builds heen publiceren.
:::
