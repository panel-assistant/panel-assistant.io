---
title: Profili dei pannelli a runtime
description: Come i profili descrivono un modello di pannello a parete Android e come scriverne, provarne e attivarne uno dall'interfaccia web del pannello.
sidebar:
  label: Panoramica
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

I profili dei pannelli descrivono le particolarità di un modello di pannello a parete Android: come ha-paneld lo riconosce, quali driver hardware compilati può usare, le caratteristiche note di schermo e sensori e le eventuali varianti dipendenti dal firmware. I profili sono file YAML leggibili. Possono essere esaminati, esportati, modificati, importati e attivati da un'installazione ha-paneld in esecuzione senza ricompilare l'app Android.

Questa pagina è la guida pratica alla creazione. Vedi il [riferimento del formato e della compatibilità](/it/reference/profiles/format/) per il modello del documento, [Test e risoluzione dei problemi](/it/reference/profiles/testing/) prima di attivare i controlli hardware e la [guida alla condivisione e ai contributi](/it/reference/profiles/sharing/) prima di pubblicare un profilo. Esiste anche un catalogo chiaramente separato di [profili della comunità](/it/reference/profiles/community/); quei file sono importazioni manuali, non supporto incluso.

I profili inclusi nell'app si trovano nel repository ha-paneld sotto [`app/src/main/assets/device-profiles`](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles).

![La pagina Profilo del pannello mostra nell'editor lo YAML di una revisione inclusa, con indicatori di revisione per le raccomandazioni di disabilitazione dei pacchetti, i percorsi root e i metadati degli artefatti WebView, e sotto i dati osservati del dispositivo](/screenshots/ui-profile-dark.png)

## Cosa può fare un profilo

Un profilo può selezionare driver e trasformazioni già forniti da ha-paneld e specificarne i parametri tipizzati. Può descrivere dati hardware, regole di corrispondenza, varianti del firmware, raccomandazioni per lo schermo, funzionalità candidate e il livello di autorizzazione Android che può essere utile sul pannello.

Un profilo non può aggiungere codice eseguibile, comandi shell, comandi del daemon helper, ioctl del kernel, librerie native o un nuovo protocollo hardware. Se un pannello necessita di un meccanismo non elencato dall'editor dei profili o dal riferimento del formato, quel meccanismo deve prima essere implementato e revisionato in ha-paneld stesso. Questo confine mantiene ispezionabile un file YAML scambiato e impedisce che un profilo diventi uno script root arbitrario.

I profili non concedono nemmeno autorizzazioni. Un driver privilegiato rimane non disponibile a meno che il percorso dal vivo richiesto non funzioni. Vedi [Autorizzazioni: Android standard e percorsi privilegiati](#autorizzazioni-android-standard-e-percorsi-privilegiati).

## Avvio rapido senza ambiente di sviluppo

Servono solo un'installazione ha-paneld che supporti i profili e un browser web. La pagina Profili include un editor YAML con riscontro della convalida; esportare in un editor di testo separato è facoltativo. Non servono Android Studio, Gradle, Android SDK o un checkout del repository.

1. Apri la pagina del dispositivo del pannello in Home Assistant, seleziona **Visita**, poi apri **Profili**. Se ti connetti direttamente, usa la porta HTTP indicata dal pannello (`http://<panel-ip>:8888/profiles` con la porta predefinita).
2. Se ha-paneld riconosce già il pannello, esporta l'esatta revisione del profilo attivo e usala come riferimento. I profili inclusi sono immutabili, quindi la prima modifica crea un fork locale autonomo invece di modificare la copia fornita con l'app.
3. Se il pannello usa **Generic**, scarica la sua bozza passiva del dispositivo. La bozza include l'impronta del pannello e valori espliciti sconosciuti/TODO; non ipotizza hardware privilegiato né esegue un controllo attivo.
4. Assegna al profilo un ID stabile in minuscolo e una versione, completa i metadati di provenienza e compatibilità e inizia con regole di corrispondenza esatte. Usa l'[esempio sotto](#esempi) e il [riferimento del formato](/it/reference/profiles/format/).
5. Importa lo YAML nella pagina Profili. L'importazione e la convalida sono solo un'anteprima: non salvano né attivano nulla.
6. Leggi ogni messaggio di convalida e confronta il candidato con il profilo attivo. Presta particolare attenzione a corrispondenza dell'impronta, driver, percorsi hardware, entità Home Assistant nuove o rimosse e requisiti di autorizzazione.
7. Salva il candidato convalidato. Il salvataggio crea una revisione locale immutabile e inattiva. Continua a non modificare il pannello in esecuzione.
8. Provalo per fasi usando la [lista di controllo dei test](/it/reference/profiles/testing/). Attivalo solo mentre qualcuno può vedere e toccare il pannello se il profilo cambia il comportamento di schermo, input, LED, relè, pacchetti o altre funzioni privilegiate.
9. L'attivazione richiede una conferma esplicita legata all'ID del profilo, alla revisione e all'hash esatti del contenuto. ha-paneld riavvia il proprio servizio affinché ogni controller riceva lo stesso profilo risolto.
10. Dopo il riavvio, conferma che la pagina Profili riporti la revisione attesa come **Attivo**, esamina le funzionalità e le entità Home Assistant e prova il ripristino della revisione precedente. Se la convalida all'avvio fallisce, ha-paneld torna all'**ultima revisione funzionante nota** e segnala il candidato non riuscito come **annullato automaticamente**.

Conserva lo YAML esportato come sorgente scambiabile. Uno screenshot della pagina Profili verde è una prova utile, ma non sostituisce il file, la sua provenienza o i risultati dei test hardware per fasi.

## Esempi

L'esempio [`minimal-community.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml) usa lo schema pubblico accettato dalla pagina Profili. È materiale didattico, non un'affermazione che l'hardware fittizio esista. È un punto di partenza prudente basato su Android standard che non abilita protocolli del produttore, percorsi root/helper, relè, input evdev, artefatti di aggiornamento, stato desiderato dei pacchetti o ricette di provisioning.

Importa l'esempio tramite **Profili**, esamina l'anteprima di convalida e salvalo solo come revisione locale inattiva. Cambia ID, provenienza, impronta esatta, firmware testato e limiti prima di usarlo come base per un pannello reale. Una corrispondenza importata è solo una prova di anteprima; i profili locali e della comunità non vengono mai selezionati automaticamente.

Per esempi completi di produzione, esporta uno dei profili inclusi immutabili da un pannello in esecuzione, oppure leggi i [file YAML inclusi](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles). Quei profili esercitano lo stesso schema, ma possono selezionare driver compilati privilegiati e artefatti gestiti dal core che non dovrebbero essere copiati senza prove hardware.

## Il ciclo di vita del profilo

ha-paneld tratta il contenuto dei profili come revisioni immutabili anziché come un oggetto modificabile di impostazioni dal vivo. Questo rende i confronti riproducibili e impedisce che un caricamento modificato venga attivato sotto un'anteprima precedente.

- **Integrato**: fornito con ha-paneld e immutabile. Un profilo incluso può essere esportato o usato per creare un fork.
- **Revisione locale inattiva**: importata o creata su questo pannello, convalidata e salvata, ma non usata dai controller in esecuzione.
- **In attesa**: l'esatta revisione è stata accettata per l'attivazione e il servizio si sta riavviando.
- **Attivo**: la revisione usata per costruire i sensori attuali, i controller hardware, il modello delle funzionalità dell'interfaccia e la superficie di rilevamento Home Assistant.
- **Ultima funzionante nota**: la selezione precedente comprovata, conservata come destinazione di recupero e ripristino manuale dopo che una nuova revisione completa l'avvio.
- **Annullata automaticamente**: un candidato la cui attivazione è fallita e che è stato sostituito automaticamente dall'ultima revisione funzionante nota.

Il salvataggio vincola una revisione immutabile all’esatto YAML della relativa anteprima di convalida. L’attivazione e l’eliminazione controllano anche la generazione del catalogo; se un altro browser o amministratore ha modificato il catalogo, queste operazioni basate su uno stato obsoleto vengono rifiutate. Aggiorna la pagina e confronta di nuovo prima di agire sul nuovo stato.

Eliminare una revisione locale inattiva non cambia il pannello attivo. Una revisione attiva o l'ultima funzionante nota non deve essere rimossa finché non esiste un altro percorso di ripristino valido.

**Usa selezione automatica** riporta un pannello con selezione fissata alla corrispondenza delle impronte incluse al prossimo riavvio controllato. Le revisioni importate e della comunità non partecipano mai a quella scelta automatica; rimangono disponibili solo per l'attivazione esplicita fissata.

## Partire da Generic

`Generic` è il fallback prudente per un pannello non riconosciuto. Usa normali controlli delle funzionalità Android e verifiche sicure a runtime, ma intenzionalmente non inventa hardware del produttore, pulsanti evdev, relè, radio, chip climatici, artefatti di aggiornamento o azioni sui pacchetti.

Questo rende Generic il posto giusto da cui iniziare a creare un profilo della comunità:

1. Scarica la **bozza del dispositivo** dalla pagina Profiles. Raccoglie i dati esatti sul modello della build, sul dispositivo della build e sulla versione del prodotto disponibili a ha-paneld, oltre a una selezione di osservazioni passive. Esamina il rapporto passivo separato, di portata limitata e ripulito dai dati sensibili, nella pagina Profiles prima di condividere i tuoi riscontri.
2. Oscura i dati sensibili e revisiona prima di condividere. Il rapporto generato è progettato per il supporto, ma l'autore rimane responsabile della rimozione di nomi dei pannelli, indirizzi, dettagli Home Assistant, credenziali e contenuti delle plance.
3. Aggiungi prima identità e provenienza. Usa un ID stabile in minuscolo con prefisso dell'autore/organizzazione, come `org.example.wallpanel-x1`, più una versione iniziale del profilo, informazioni su autore/fonte/licenza, livello di maturità, intervallo di firmware testato e limiti noti.
4. Aggiungi regole di impronta ristrette ed esatte. Un modello del produttore o un prefisso di versione del prodotto è di solito più sicuro di un alias SoC ampio come `px30`, `rk3326`, `rk3566` o `rk3576`, che pannelli non correlati possono condividere.
5. Lascia assenti o esplicitamente sconosciute le sezioni delle funzionalità ignote. Un nome file, un annuncio commerciale o un driver kernel compilato nel firmware non prova che l'hardware esista dal vivo o che un'app Android possa raggiungerlo.
6. Aggiungi una funzionalità supportata da prove alla volta, convalidala, confrontala e provala prima di proseguire.

La bozza è intenzionalmente di sola lettura e passiva. Non trasformare comandi shell esplorativi o esperimenti root occasionali in campi del profilo. Quando è necessario un nuovo controllo attivo o driver, proponilo come implementazione ha-paneld circoscritta con convalida e test propri.

## Associare un pannello in sicurezza

La corrispondenza è una decisione di sicurezza, non solo una comodità. Una corrispondenza errata può selezionare un driver inadatto o dichiarare funzionalità appartenenti a un altro prodotto che usa la stessa scheda di riferimento.

Preferisci l'identità esatta del prodotto in questo ordine:

1. un modello del produttore o nome in codice del dispositivo univoco per il prodotto;
2. un formato esatto della versione del prodotto o un prefisso strettamente ancorato;
3. una combinazione di campi di build indipendenti;
4. un alias ampio del SoC/piattaforma di riferimento solo come fallback di compatibilità intenzionale.

Assegna a ogni gruppo esatto una priorità di ramo maggiore rispetto al suo fallback ampio. ha-paneld confronta prima la priorità del gruppo corrispondente, poi quella del profilo; una parità esatta tra profili inclusi ripiega in sicurezza su Generic. Le priorità riproducono un ordine deliberato dei rami, ma non sostituiscono un'impronta ristretta.

Le revisioni della comunità e importate non partecipano mai alla selezione automatica, anche quando la loro corrispondenza è esatta. La corrispondenza è una prova di anteprima che aiuta l'amministratore a decidere se il file descrive questo pannello. Una revisione locale può sostituire il rilevamento incluso solo tramite un'attivazione esplicita, dopo la quale il pannello fissa ID, revisione e hash esatti del profilo. Un'importazione successiva non può quindi cambiare implicitamente il risultato in esecuzione.

Usa un campo strategia con nome gestito dal core per una differenza supportata nella stessa famiglia hardware, come un'etichetta di prodotto o una regola di densità. Il formato non contiene un linguaggio di espressioni generale né modifiche arbitrarie delle varianti. Scala, polarità e comportamento binario/con distanza della prossimità non sono intenzionalmente strategie di profilo: il runtime li apprende dalle prove dal vivo. Usa profili separati quando le strategie con nome disponibili non possono descrivere una differenza reale di acquisizione, driver, confine di privilegio o recupero.

## Autorizzazioni: Android standard e percorsi privilegiati

I profili descrivono meccanismi candidati; i controlli dal vivo decidono se il pannello in esecuzione può usarli.

### Android standard

Parti da qui. Il rendering delle plance, l'associazione con Panel Assistant e i normali sensori Android, luminosità, audio, navigazione e interfaccia web locale non richiedono root. Un nuovo profilo dovrebbe dimostrare la propria identità e il comportamento Android standard prima di aggiungere un driver privilegiato.

### Root del produttore o helper ha-paneld

Un driver compilato può richiedere un percorso `su` funzionante del produttore o l'helper root di ha-paneld installato separatamente. Dichiarare quel requisito non crea il percorso, non installa l'helper né amplia il suo elenco di comandi consentiti. L'helper accetta solo comandi compilati e circoscritti e autentica il proprio interlocutore; un profilo fornisce parametri convalidati a quei comandi, mai testo di comando.

Non raccomandare di ottenere il root su un dispositivo fornito senza root solo per soddisfare un profilo. Documenta onestamente le funzionalità ridotte. Vedi [Accesso root](/it/hardware/guides/root-access/) per la parte hardware.

## Aggiornare un profilo installato

Le versioni del contenuto dei profili e quelle dello schema dei documenti risolvono problemi diversi. Incrementa la versione del profilo quando cambiano le conoscenze hardware o il comportamento. La versione dello schema cambia solo quando ha-paneld modifica il linguaggio del documento.

Prima di salvare un aggiornamento, confrontalo con la revisione attiva e leggi il rapporto di compatibilità. Anche un aggiornamento ha-paneld convalida nuovamente i profili installati prima dell'uso. Un file che richiede un core più recente, un driver non disponibile o uno schema futuro non supportato rimane installato ma non può diventare attivo; l'ultimo profilo funzionante noto attuale continua a essere eseguito.

Considera una modifica alla corrispondenza, a un driver privilegiato, a un percorso, a una variante del firmware, allo stato desiderato dei pacchetti, alla selezione di ricette o a un artefatto di aggiornamento gestito dal core come significativa per il comportamento anche quando la differenza YAML è piccola. Ripeti le fasi di test pertinenti e incrementa la versione del profilo.

## Passaggi successivi

- [Formato e compatibilità dei profili](/it/reference/profiles/format/)
- [Test e risoluzione dei problemi](/it/reference/profiles/testing/)
- [Condividere e contribuire profili](/it/reference/profiles/sharing/)
- [Architettura dei profili dei dispositivi](/it/reference/profiles/architecture/)
- [Sicurezza](/it/reference/security/)
- [Hardware dei pannelli](/it/hardware/)
