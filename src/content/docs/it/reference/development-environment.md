---
title: Ambiente di sviluppo
description: Gli strumenti per compilare l'app del pannello, i percorsi Docker e devcontainer e cosa deve sapere un fork riguardo alla firma.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Non serve compilare ha-paneld per usarlo: l'installazione di un pannello scarica una versione firmata. Questa pagina è per chi contribuisce e per chi mantiene un fork. Per una visita guidata del sorgente, vedi il [percorso nel codice su DeepWiki](https://deepwiki.com/panel-assistant/android).

## Strumenti

L'app del pannello è un'app Android scritta in Kotlin e compilata con Gradle. Richiede **JDK 17** e un Android SDK con **platform 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 e CMake 3.22.1** (CMake e NDK compilano il driver LED nativo). Il wrapper Gradle fissa la versione di Gradle e le versioni delle dipendenze sono in [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml).

Con questi strumenti installati localmente:

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

Se preferisci installare solo Docker, [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) crea un'immagine con versioni fissate degli stessi strumenti ed esegue Gradle al suo interno. L'APK viene salvato nella tua directory di lavoro, l'immagine viene conservata nella cache dopo la prima compilazione e le cache Gradle persistono in un volume Docker con nome.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Se esegui lo script da un container che comunica con un daemon Docker esterno, leggi la nota `HOST_WORKDIR` in `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) fissa gli stessi strumenti Android per VS Code, così SDK e NDK non vengono installati sulla tua macchina. Apri il repository in VS Code, scegli **Riapri nel contenitore**, poi esegui i comandi Gradle sopra. Il JDK del devcontainer è più recente di JDK 17, quindi considera una compilazione con JDK 17 come riferimento per il comportamento legato alla versione Java.

## L'helper root

Gradle compila e verifica automaticamente entrambi gli helper root specifici per ABI prima di compilare l'app. L'app e gli helper incorporano la stessa identità, derivata da ogni file sorgente, header e definizione di comando dell'helper: una compilazione locale dell'app non può quindi dipendere silenziosamente da codice privilegiato obsoleto.

## Firma

Non serve configurare la firma per compilare ed eseguire ha-paneld. Un checkout senza configurazione della firma usa il `debug.keystore` incluso nel repository per le build di debug. Se `keystore.properties` fornisce una configurazione della firma, le build di debug usano invece quella chiave. Le versioni ufficiali sono firmate con la chiave di rilascio privata del progetto, che non è mai presente nel repository.

Android rifiuta di aggiornare un'app installata con un APK firmato con una chiave diversa. Passare un pannello tra una versione ufficiale, la tua chiave di rilascio e una build di debug richiede quindi prima la disinstallazione. Prima di farlo, crea un backup `.hpb` completo e cifrato da **Installa → Backup** e verifica che il file sia stato salvato; altrimenti la disinstallazione rimuove profili, stato appreso e cronologia. Panel Assistant rende l'app del pannello un amministratore del dispositivo e Android rifiuta di disinstallare un amministratore del dispositivo, quindi prima revocagli quel ruolo. Rimuovi l'app con l'opzione **Rimuovi Panel Assistant da questo pannello** del pannello (**Rimuovi da questo pannello** nella versione 1.0.0-rc2 non ancora rilasciata), sotto **Configura** in Home Assistant, oppure revoca il ruolo di amministratore del dispositivo e disinstalla tramite ADB:

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

Se `pm uninstall` risponde ancora `DELETE_FAILED_DEVICE_POLICY_MANAGER`, attendi un secondo e rieseguilo. Installa l'altra build, poi ripristina il backup da **Installa → Ripristino**. Vedi [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/).

Per firmare in modo coerente le tue build, copia [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) in `keystore.properties` e compilalo; con il file presente, `assembleRelease` è firmato per il rilascio. Un fork che pubblica versioni con tag tramite GitHub Actions fornisce invece la stessa chiave come segreti del repository.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Non aggiungere mai al repository `keystore.properties` o il file `.jks` (entrambi sono esclusi da git). Esegui il backup del keystore e della sua password: se li perdi, non potrai mai più pubblicare un aggiornamento in loco per le tue build.
:::
