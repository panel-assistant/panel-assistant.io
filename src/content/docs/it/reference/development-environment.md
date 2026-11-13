---
title: Ambiente di sviluppo
description: Gli strumenti per compilare l'app del pannello, i percorsi Docker e devcontainer e cosa deve sapere un fork riguardo alla firma.
sourceCommit: 396e908e6370b88a9fd555abcb67b0816c4cd6f4
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

Se preferisci installare solo Docker, [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) crea un'immagine Docker ed esegue Gradle al suo interno. Il relativo Dockerfile elenca i pacchetti SDK inclusi nell'immagine. L'APK viene salvato nella tua directory di lavoro, l'immagine viene conservata nella cache dopo la prima compilazione e le cache Gradle persistono in un volume Docker con nome.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Se esegui lo script da un container che comunica con un daemon Docker esterno, leggi la nota `HOST_WORKDIR` in `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) fissa gli stessi strumenti Android per VS Code, così SDK e NDK non vengono installati sulla tua macchina. Apri il repository in VS Code, scegli **Riapri nel contenitore**, poi esegui i comandi Gradle sopra. Il JDK del devcontainer è più recente di JDK 17, quindi considera una compilazione con JDK 17 come riferimento per il comportamento legato alla versione Java.

## L'helper root

Gradle compila e verifica automaticamente entrambi gli helper root specifici per ABI prima di compilare l'app. L'app e gli helper incorporano la stessa identità, derivata da ogni file sorgente, header e definizione di comando dell'helper: una compilazione locale dell'app non può quindi dipendere silenziosamente da codice privilegiato obsoleto.

## Misurare le prestazioni della plancia da un computer

La pagina di stato del pannello copre le prestazioni per l’uso quotidiano; vedi [Prestazioni](/it/manage/performance/). Per un confronto registrato della plancia con e senza filtro entità, misurato dall’esterno del pannello, il repository include uno script di raccolta.

Se la plancia senza filtro sovraccarica la propria WebView, i valori nella pagina possono smettere di cambiare. Uno script di raccolta eseguito da un computer interroga invece l'interfaccia prestazioni dell'app stessa, che appartiene all'API REST deprecata (vedi il [riferimento dei controlli](/it/reference/api/#lapi-rest-è-deprecata)): la CPU dell'intero pannello rimane quindi osservabile e, dove root o helper sono disponibili, anche una misura nativa del thread del renderer Chromium. Registra inoltre l'età dell'ultimo gruppo di misure del browser; oltre 15 secondi viene riportato come bloccato anziché attuale.

Il programma di raccolta non cambia la configurazione. Non attiva, disattiva o riscrive mai il filtro entità; la prima richiesta può creare una chiave privata di installazione nello stato interno dell'app. Seleziona la stessa vista e lo stesso carico per entrambe le esecuzioni, cambia il filtro nell'interfaccia web, attendi il ricaricamento, poi esegui un comando da un checkout del [repository ha-paneld](https://github.com/panel-assistant/android) per ogni stato:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Confronta i due risultati:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Ogni esecuzione dura per impostazione predefinita tre minuti, con 30 secondi di riscaldamento e interrogazioni ogni 10 secondi. `--pair-with` riusa un ID di confronto opaco del primo risultato, così il confronto può rifiutare un pannello fisico diverso, un diverso Home Assistant o plancia configurati o un'impostazione cambiata che influenza la misura, senza registrare quei valori privati. Non può rilevare una diversa vista scelta manualmente nella stessa plancia: mantieni quindi uguali vista visibile e carico.

Il programma rifiuta un'esecuzione se la modalità prevista non è attiva, cambiano revisione del filtro o generazione del renderer, build o configurazione cambiano durante la raccolta, il filtro ripiega su un'alternativa oppure rimangono meno di tre campioni, meno di tre campioni CPU dell'intero pannello o meno di tre campioni CPU nativi del renderer. Scrive comunque il risultato rifiutato con le ragioni esatte e non sovrascrive mai un file di uscita esistente.

Il JSON omette URL e ID del pannello, URL Home Assistant e percorso della plancia, ID delle entità, nomi dei processi e hash del filtro. Il pannello calcola le impronte opache con una chiave privata casuale di installazione a 256 bit che non lo lascia mai; le impronte sono uniche per una coppia di confronto, così misure separate non possono essere collegate attraverso esse o usate per indovinare il nome del pannello. Un pannello che non può memorizzare la chiave rifiuta la misura. Il numero di entità senza filtro è l'ultimo numero sincronizzato dal catalogo, non un conteggio dal vivo recuperato dalla WebView sovraccarica, e viene riportato non disponibile quando il catalogo è vuoto. I contatori di traffico di rete e browser sono normalizzati agli intervalli realmente osservati, così un'interrogazione mancata non altera il confronto. Tempi e velocità di traffico del browser vengono omessi dai riepiloghi quando obsoleti, mentre CPU, memoria, rete e dati del renderer dall'app continuano a essere raccolti.

## Firma

Non serve configurare la firma per compilare ed eseguire ha-paneld. Un checkout senza configurazione della firma usa il `debug.keystore` incluso nel repository per le build di debug. Se `keystore.properties` fornisce una configurazione della firma, le build di debug usano invece quella chiave. Le versioni ufficiali sono firmate con la chiave di rilascio privata del progetto, che non è mai presente nel repository.

Android rifiuta di aggiornare un'app installata con un APK firmato con una chiave diversa. Passare un pannello tra una versione ufficiale, la tua chiave di rilascio e una build di debug richiede quindi prima la disinstallazione. Prima di farlo, crea un backup `.hpb` completo e cifrato da **Installa → Backup** e verifica che il file sia stato salvato; altrimenti la disinstallazione rimuove profili, stato appreso e cronologia. Panel Assistant rende l'app del pannello un amministratore del dispositivo e Android rifiuta di disinstallare un amministratore del dispositivo, quindi prima revocagli quel ruolo. Rimuovi l'app con l'opzione **Rimuovi da questo pannello** del pannello, sotto **Configura** in Home Assistant, oppure revoca il ruolo di amministratore del dispositivo e disinstalla tramite ADB:

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
