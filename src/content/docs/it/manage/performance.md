---
title: Prestazioni
description: Perché un pannello a parete può sembrare lento con una plancia che funziona bene su un telefono, come misurarlo e i rimedi in ordine di impatto.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Un pannello Android economico può sembrare lento, scattare durante lo scorrimento, diventare vuoto o smettere di aggiornarsi anche se la stessa plancia funziona bene su telefono o computer. Parti dal lavoro che Home Assistant invia al pannello, poi misura ciò che resta dei limiti della plancia e dell'hardware prima di presumere che il pannello debba essere sostituito.

:::tip
Una causa comune è il numero di stati e aggiornamenti delle entità Home Assistant che raggiungono la plancia. [La gara](/it/manage/drag-race/) ne mostra il costo su due pannelli identici, filmati affiancati. Un'installazione grande può costringere un pannello poco potente a elaborare migliaia di entità che non visualizza mai. Con il [renderer integrato](/it/manage/built-in-renderer/), il primo rimedio da provare è il filtro entità.
:::

## Misura prima di modificare qualsiasi cosa

Usa **Visita** nella pagina del dispositivo del pannello in Home Assistant per aprire l'interfaccia web (per esempio `http://<panel-ip>:8888/` con la porta predefinita). Registra la stessa vista della plancia per un periodo simile prima e dopo ogni modifica, così il confronto ha significato.

- **Reattività della plancia**: latenza reale delle interazioni, interazione più lenta suddivisa in tempo di input, gestore e presentazione, blocco del thread principale, tempo per diventare interattiva e ricaricamenti inattesi del renderer.
- **Flusso degli stati di Home Assistant**: aggiornamenti di stato al secondo, velocità del payload JSON non compresso, dimensione dell'idratazione iniziale, tempo prima che il thread principale ceda il controllo e le tre entità che contribuiscono maggiormente nell'ultima ora, classificate per frequenza degli aggiornamenti e volume del payload.
- **Prestazioni** e **Processi principali**: CPU, GPU, RAM, frequenza, temperatura e processi più occupati.
- **Flusso fotocamera**, su un pannello che offre una fotocamera: sottoscrittori che mantengono aperta la sessione, codificatore usato, frequenza fotogrammi richiesta accanto a quella fornita e bitrate fornito accanto al limite del codificatore. Una frequenza molto inferiore alla richiesta viene riportata senza attribuirne la causa: ritmo di acquisizione in una stanza buia, percorso di codifica e contesa dell'hardware video sono tutti candidati e la scheda non sceglie arbitrariamente. La richiesta non viene mai ridotta in silenzio; quando la sessione non può fornire al flusso la frequenza richiesta, la scheda mostra la richiesta accanto alla frequenza assegnata al codificatore. La scheda non indica deliberatamente un valore CPU, perché una codifica hardware lavora nell'hardware codec e nel compositore oltre che nell'app e nessun singolo processo rappresenta il costo della fotocamera. Leggi il carico complessivo in Prestazioni e Processi principali.
- **Pagina Entità**: ciò a cui il renderer integrato è attualmente sottoscritto, ciò che l'apprendimento automatico ha trovato e quali regole della plancia richiedono ancora una decisione.
- **Rapporto diagnostico** (`/diag`): rapporto da copiare in una segnalazione quando la causa rimane poco chiara.

Il renderer integrato raccoglie direttamente queste misure del browser e non richiede root né debug WebView. Con un'app plancia separata, l'app del pannello può mostrare CPU del renderer e dati di rendering Android quando root o helper sono disponibili, ma non può misurare la latenza reale delle interazioni di quell'app.

Il valore del thread principale per gli eventi di stato inizia quando viene distribuito un messaggio Home Assistant pertinente e termina quando il browser cede il controllo dopo tutti i gestori e microtask. Include il piccolo costo dell'osservatore dell'app e qualsiasi altro lavoro nello stesso task del messaggio: non viene quindi deliberatamente etichettato come tempo dedicato soltanto a Home Assistant. La velocità del payload è il JSON non compresso elaborato dal frontend, non il traffico di rete compresso.

Usa il grafico allineato per cercare correlazioni. Picchi delle interazioni coincidenti con molto traffico di stato e occupazione degli eventi di stato indicano la dimensione del flusso. Un gestore lento con flusso tranquillo indica JavaScript della plancia. Ritardo di presentazione e frame di rendering lunghi indicano layout, animazioni, fotocamera o lavoro multimediale. Ricaricamenti ripetuti indicano memoria o instabilità del renderer. Leggi insieme le misure: una singola istantanea CPU non può identificare da sola la causa.

La riga **Causa probabile** applica queste regole con prudenza e riporta il proprio grado di certezza. Quando le evidenze non supportano una causa dominante, lo dichiara.

### Confrontare filtrato e non filtrato dall'esterno del pannello

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

### Debug remoto WebView facoltativo

Le schede prestazioni integrate non richiedono DevTools. Usa la scheda **Debug remoto WebView** soltanto quando devi ispezionare in profondità il codice della pagina.

Per un'app plancia separata, attiva prima la sua impostazione di debug remoto WebView e riavvia la plancia; senza di essa il relay non trova la WebView dell'app. Il relay di rete richiede root.

### Escludere il difetto del watchdog Zigbee originale NSPanel Pro

Il vecchio firmware Sonoff NSPanel Pro originale contenente un'assegnazione ricorsiva `export LD_LIBRARY_PATH=/vendor/bin/siliconlabs_host/:${LD_LIBRARY_PATH}` può rendere lo stesso `guard_process.sh` del produttore il problema di prestazioni. Un'[indagine della comunità](https://github.com/panel-assistant/android/issues/34) ha confermato il difetto su un NSPanel Pro 120 con firmware originale 3.8.0 e lo ha segnalato su tutti i 16 pannelli del segnalante. Lo script antepone la propria directory ogni cinque secondi. Dopo circa dieci ore la stringa di ambiente supera il limite Linux per stringa nell'avvio di un programma, i comandi esterni iniziano a fallire con `E2BIG`, `sleep` smette di ritardare il ciclo e il watchdog può saturare un core CPU. A quel punto può anche non riuscire a riavviare un `zgateway` morto, lasciando Zigbee non disponibile. I firmware da 1.x a 3.x potrebbero essere coinvolti ovunque esista la stessa riga, ma non è stato verificato indipendentemente.

Cerca questo schema quando il pannello segnala carico di sistema periodico su un NSPanel Pro originale altrimenti inattivo:

- `guard_process.sh` rimane vicino al 100% di un core CPU e la dimensione del processo cresce molto oltre il valore sano di circa 9 MB;
- `zgateway` manca o non recupera più; e
- riavviare aiuta, ma il carico ritorna circa dieci ore dopo.

Un riavvio reimposta soltanto per un po' l'ambiente che si accumula. La segnalazione collegata contiene una soluzione con root e ADB fornita dal segnalante, che il progetto non ha convalidato indipendentemente. Non applicarla salvo che l'assegnazione ricorsiva esatta compaia una volta nello script del produttore. Qualsiasi riparazione deve prima verificare un backup non vuoto e conservare proprietario, modalità e metadati SELinux. Fermati prima di modificare qualsiasi cosa in caso di corrispondenza inattesa; dopo la modifica annulla se riavvio o verifica falliscono, riporta `/vendor` in sola lettura e controlla sia `zgateway` sia la sua disponibilità in Home Assistant. Un aggiornamento firmware che riscrive `/vendor` rimuove la modifica locale; il difetto ritorna soltanto se il nuovo firmware contiene ancora l'assegnazione. L'ispezione della comunità dei firmware 4.0.12 e 4.6.0 non l'ha trovata.

Questo difetto è distinto da un `zgateway` stabile impegnato in un ciclo su una radio che non risponde. Il sensore di stato Zigbee separa CPU di guard e gateway, evidenze di associazione e cronologia dei riavvii. Avvisa dell'assegnazione ricorsiva esatta ma non modifica direttamente gli script del produttore. Un gateway configurato che esplicitamente non si è associato a una rete e rimane sopra il 50% di un core per cinque campioni di un minuto dopo il periodo di grazia di 15 minuti viene spento e contenuto automaticamente; un router associato con CPU elevata genera soltanto un avviso.

## Rimedi, in ordine di impatto

### 1. Filtrare la sottoscrizione alle entità del renderer integrato

Il frontend Home Assistant si sottoscrive normalmente allo stato di ogni entità visibile all'utente connesso. Il pannello deve ricevere ed elaborare tutti quegli stati anche quando la plancia ne usa soltanto pochi. Il renderer integrato può aggiungere l'insieme appreso della plancia alla sottoscrizione, così Home Assistant filtra il flusso prima di serializzarlo e inviarlo. Il pannello mantiene la normale connessione autenticata a Home Assistant; non sono coinvolti proxy o server aggiuntivi.

Il filtro entità si applica soltanto al renderer integrato. La configurazione guidata chiede se attivarlo prima del primo caricamento; su un pannello già configurato:

1. Usa **Visita** nella pagina del dispositivo del pannello in Home Assistant, poi apri **Configura**, quindi **Dashboard**, seleziona **Renderer integrato (ha-paneld)** e attiva **Filtro entità**.
2. Apri la scheda **Entità** e seleziona **Esegui ora la scansione della plancia**.
3. Visita ogni scheda della plancia e usa controlli, finestre a comparsa e contenuti condizionali, così le dipendenze durante l'esecuzione possono essere osservate.
4. Controlla le entità attuali, suggerite ed escluse. Fissa tutto ciò che serve indirettamente a una scheda personalizzata o a un modello.
5. Risolvi i controlli del filtro. Restringi dove possibile una regola ampia o dinamica, oppure scegli esplicitamente e accetta l'avviso mostrato.
6. Applica l'insieme, lascia ricaricare la plancia e confronta le stesse viste con le schede prestazioni della scheda Dashboard.

L'apprendimento automatico non può dimostrare ogni dipendenza di una scheda personalizzata o modello dinamico. Un'entità mancante può lasciare una scheda non aggiornata o non disponibile: controlla quindi prima il risultato su un pannello da cui non dipendi e lascia disattivato il filtro finché il candidato non è credibile. La sottoscrizione senza filtro rimane disponibile come via di ritorno: disattiva **Filtro entità** e ricarica la plancia.

Se vecchie evidenze apprese o scelte manuali non descrivono più la plancia, usa **Reimposta dati appresi** nella pagina Entità. Dopo la conferma cancella appartenenza appresa, elementi fissati, esclusioni e decisioni di sicurezza ignorate, conserva il filtro attivo noto come funzionante e avvia una nuova scansione. Il filtro rimane come alternativa mentre il candidato viene ricostruito.

### 2. Alleggerire la plancia stessa

- Dividi una plancia densa in viste mirate ed evita di caricare schede che il pannello non richiede mai.
- Preferisci schede integrate quando una scheda personalizzata anima continuamente, costruisce un albero del documento grande o esegue spesso JavaScript.
- Osserva elaborazione delle interazioni, frame di animazione lunghi e ricaricamenti del renderer. Se una vista li domina, semplificala oppure usa `button.<panel>_reload` come recupero temporaneo mentre trovi la scheda costosa.
- Prova separatamente schede di telecamere e grafici. Decodifica, interrogazioni della cronologia e rendering possono dominare anche quando il filtro funziona correttamente.

### 3. Ridurre gli aggiornamenti inutili alla sorgente

Il filtro protegge il pannello dalle entità che non mostra, ma non rende meno costosa un'entità necessaria. Se la plancia mostra davvero un misuratore di potenza, un sensore di distanza Bluetooth, un modello che cambia rapidamente o un'entità diagnostica rumorosa, riduci la frequenza di aggiornamento della sorgente dove l'integrazione lo consente. Può ridurre anche il lavoro di recorder e database per l'intera installazione Home Assistant.

Tra i controlli utili ci sono filtri throttle e delta ESPHome, intervalli di segnalazione Zigbee, impostazioni `scan_interval` delle integrazioni e aggiornamenti meno frequenti dei modelli. Verifica che la modifica non renda meno utile un'automazione o una vista della cronologia prima di applicarla ovunque.

### 4. Adattare la plancia restante all'hardware

I pannelli PX30 e RK3566 possono eseguire bene una plancia mirata, ma hanno prestazioni a thread singolo limitate e solitamente soltanto 2 GB di RAM. Il filtro elimina lavoro di stato inutile; non può rendere gratuiti un flusso video troppo grande, un'animazione complessa o un grafico della cronologia enorme. Progetta per le dimensioni logiche dello schermo e prova la vista più pesante anziché giudicare soltanto la scheda iniziale. Le [pagine hardware](/it/hardware/) confrontano i pannelli supportati.

## Lista di controllo

- [ ] Il renderer integrato è selezionato ovunque non servano notifiche native
- [ ] Il filtro automatico è attivo, analizzato, esaminato e applicato esplicitamente
- [ ] Ogni scheda, finestra a comparsa e percorso condizionale è stato usato durante l'apprendimento
- [ ] Le dipendenze di schede personalizzate e modelli sono fissate o altrimenti considerate
- [ ] I controlli del filtro sono stati risolti deliberatamente, non ignorati per errore
- [ ] Le stesse viste sono state confrontate prima e dopo il filtro con le schede prestazioni di Dashboard
- [ ] Se la pagina si blocca senza filtro, entrambe le esecuzioni sono state raccolte e convalidate con lo script di misura
- [ ] Schede pesanti, flussi video e grafici sono stati provati separatamente
- [ ] Le entità necessarie ad alta frequenza sono state regolate alla sorgente dove appropriato
- [ ] Su uno stack Zigbee NSPanel Pro originale è stato controllato `guard_process.sh`
- [ ] Ricaricamento e disattivazione del filtro sono stati provati entrambi come percorsi di recupero

## Riferimento

### Perché un'installazione Home Assistant grande può rallentare un pannello

Il frontend Home Assistant mantiene una sottoscrizione WebSocket con lo stato attuale e ogni aggiornamento successivo delle entità disponibili all'utente. Senza un insieme ristretto, il renderer riceve molti più dati di quelli usati da una plancia a parete mirata. Il thread principale JavaScript deve analizzare i messaggi, aggiornare il modello di stato del frontend e capire se qualcosa di visibile è cambiato.

I pannelli economici sono particolarmente sensibili perché JavaScript, layout e disegno dipendono molto da un solo thread del renderer. Core CPU aggiuntivi aiutano con altro lavoro ma non eliminano quel ritardo, e la RAM limitata rende la garbage collection sempre più invasiva mentre cresce la memoria della WebView.

### Sintomi comuni

| Sintomo                                                                                       | Causa probabile                                                                                    |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Tocchi ritardati, navigazione lenta o scorrimento a scatti                                    | Lavoro del thread principale del renderer da un flusso di entità grande, schede pesanti o entrambi |
| Una vista è molto peggiore delle altre                                                        | Schede costose, decodifica video, cronologia o albero del documento grande in quella vista         |
| L'intera vista diventa vuota mentre l'interfaccia circostante rimane                          | Pressione sulla memoria WebView o errore del renderer                                              |
| La plancia peggiora gradualmente nel corso dei giorni                                         | Crescita della memoria, frammentazione o una scheda che accumula lavoro                            |
| Le entità smettono di aggiornarsi e poi arrivano tutte insieme                                | Interruzione WebSocket, riconnessione o renderer che non riesce a tenere il passo                  |
| Pannelli simili si comportano diversamente                                                    | Diversi contenuti, sottoscrizione alle entità, versione WebView, tempo di attività o calore        |
| Un NSPanel Pro originale scatta circa dieci ore dopo l'avvio e `guard_process.sh` usa un core | L'assegnazione ricorsiva nel watchdog Zigbee del produttore, che porta a `E2BIG`                   |

La garbage collection sospende di tanto in tanto JavaScript per recuperare memoria inutilizzata. Vicino al limite di memoria, le pause diventano più lunghe e frequenti, privando il rendering delle risorse anche quando il processo Android stesso non si è arrestato.
