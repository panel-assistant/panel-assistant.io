---
title: Il renderer integrato
description: Come l'app del pannello disegna direttamente la plancia Home Assistant, recupera dagli errori e filtra le entità ricevute.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

L'app del pannello disegna la plancia Home Assistant nella propria WebView anziché affidarla a un'app plancia separata. Questo permette di tornare rapidamente alla plancia dopo il riavvio dell'app: può riaprire l'ultima plancia verificata da Home Assistant per lo stesso server, account e impostazione della plancia iniziale mentre controlla in background l'elenco attuale delle plance. Se Home Assistant segnala che la plancia è stata rimossa o che il valore predefinito dell'account è cambiato, il pannello passa alla scelta attuale.

Una volta avviata la plancia, l'app può rilevare una connessione bloccata, liberare la memoria accumulata dalla WebView e contenere gli arresti anomali del renderer. La connessione integrata rende inoltre possibile filtrare le entità della plancia. Il pannello rimane un dispositivo con una sola app da installare e aggiornare.

Il renderer integrato è di gran lunga il modo preferito per mostrare la plancia ed è quello scelto dalla configurazione guidata. Un'app plancia separata rimane supportata come opzione, per esempio quando un pannello richiede più di un server Home Assistant o notifiche native (vedi [Limiti](#limiti)). Il controllo vocale Assist non dipende da nessuna delle due app plancia: su un pannello con microfono, lo fornisce l'[assistente vocale](/it/manage/voice-assistant/) del pannello qualunque app sia in esecuzione.

## Avvio e recupero

Il renderer usa l'interfaccia documentata `?external_auth=1` di Home Assistant, così l'app sa quando la plancia si è connessa anziché trattare la pagina come una scatola nera. Il renderer:

- Riapre l'ultima plancia verificata dopo un riavvio dell'app mentre aggiorna in background l'elenco delle plance di Home Assistant. Prima viene comunque eseguito un breve controllo di compatibilità. La plancia memorizzata è legata al server Home Assistant, all'account e alla plancia configurata; una plancia o scheda impostata esplicitamente ha sempre la precedenza.
- Congela la pagina quando lo schermo è spento e la riprende al risveglio, risparmiando circa il 70% della CPU del renderer durante la notte.
- Ricarica una plancia aperta ma mai connessa. I tentativi rallentano dopo errori ripetuti e il pannello mostra una chiara schermata **Riconnessione a Home Assistant…** anziché una pagina di errore del browser.
- Ripete i controlli recuperabili con ritardi crescenti. Un accesso rifiutato definitivamente ferma i tentativi e mostra le istruzioni per l'accesso dal browser. Una versione di Home Assistant non supportata o una WebView incompatibile indica l'aggiornamento necessario e lo attende.
- Libera la memoria accumulata con ricaricamenti invisibili a schermo spento.
- Contiene gli arresti anomali del renderer e ne limita la frequenza. Una pagina che continua ad arrestarsi torna al launcher amministrativo anziché riavviarsi tutta la notte.
- Quando Home Assistant annuncia che si sta arrestando o va offline, mostra un avviso nativo sul pannello e lo rimuove soltanto quando Home Assistant è dimostrabilmente tornato disponibile.

Trascina verso il basso dal bordo superiore dello schermo per aggiornare, oppure fallo due volte per una ricarica completa. Il renderer supporta anche un ritorno facoltativo alla plancia iniziale dopo inattività, la riproduzione automatica dei flussi delle telecamere e HTTPS con un'autorità di certificazione privata installata dall'utente. **Nascondi barre di sistema Android** offre una plancia da bordo a bordo; scorri da un bordo dello schermo per mostrare di nuovo le barre. Sui pannelli che usano la barra di navigazione software dell'app, **Dashboard** porta il renderer in primo piano senza ricaricarlo e **Ricarica** è un'azione di recupero separata.

**Zoom (%)** regola la dimensione a cui il renderer disegna la plancia, con 100% come valore predefinito. Il renderer aggiunge una voce **Impostazioni app** alla barra laterale di Home Assistant che apre la configurazione del pannello. Al primo avvio nasconde la barra laterale fissa e mantiene attiva la connessione durante l'inattività; puoi aprire la barra laterale o cambiare questi valori in seguito. L'opzione separata **Nascondi navigazione Home Assistant (nativa)** chiede al frontend di rimuovere la navigazione mentre è attiva la modalità chiosco nativa. Se la plancia ha semplicemente la dimensione sbagliata, vedi [dimensioni dello schermo](/it/manage/display-sizing/).

## Requisiti e compatibilità

Il renderer integrato richiede entrambi:

- **Home Assistant 2026.4.2 o successivo**; e
- una Android System WebView che supporti il listener WebMessage sicuro usato dall'interfaccia host nativa di Home Assistant.

Alla maggior parte delle persone basta una Android System WebView aggiornata. L'app controlla la capacità della WebView e verifica la compatibilità di Home Assistant prima di caricare la plancia.

Se il pannello mostra **È necessario aggiornare Home Assistant**, aggiorna Home Assistant e seleziona **Riprova**. Nulla sul pannello può sostituire quell'aggiornamento.

Se mostra **Il visualizzatore web di questo pannello è troppo vecchio**, segui [aggiornare la WebView](/it/hardware/guides/update-the-webview/). Nella versione 1.0.0-rc2 non ancora pubblicata, un aggiornamento dell'app del pannello avviato da Home Assistant può anche installare una WebView compatibile verificata quando il pannello lo consente. Gli altri pannelli richiedono il metodo descritto nella guida. Dopo aver aggiornato la WebView, seleziona **Riprova**.

Il renderer integrato non ripiega mai su un bridge meno isolato. Un altro renderer può aiutare quando Home Assistant stesso non può essere aggiornato, ma qualsiasi app plancia sul pannello usa la stessa WebView di sistema: nessuna può aggirarne una obsoleta.

## Configurazione

Su un pannello nuovo o ripristinato, seleziona **Configurazione** sul pannello stesso oppure apri la pagina di configurazione da un portatile o telefono (per esempio `http://<panel>:8888/setup` con la porta predefinita). La procedura guidata sceglie il renderer, accede a Home Assistant, seleziona il valore predefinito dell'account, una plancia o una scheda specifica e chiede del filtro delle entità prima di caricare la prima plancia. L'autorizzazione avviene nel browser dell'amministratore, quindi non si digitano credenziali sul pannello.

Su un pannello già configurato, usa **Visita** nella pagina del dispositivo del pannello in Home Assistant, poi apri **Configura**. In **Connessione a Home Assistant**, inserisci l'URL di Home Assistant e scegli **Accesso dal browser**, poi seleziona **Renderer integrato** come app plancia.

## Aspetto della plancia e blocco Android

Le impostazioni avanzate della pagina Configura includono tre controlli indipendenti, ciascuno relativo a un livello diverso:

| Opzione di Configura                                                                        | Cosa cambia                                                                                                                                                                                                                                                        | Cosa **non** cambia                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nascondi navigazione Home Assistant (nativa)** (disattivata per impostazione predefinita) | Dopo la connessione a Home Assistant, chiede al frontend di nascondere la navigazione. Solo renderer integrato.                                                                                                                                                    | Non blocca Android, non nasconde le barre di sistema Android e non inserisce o modifica il CSS della plancia. Se Home Assistant rifiuta o non supporta la richiesta, la plancia rimane invariata. |
| **Nascondi barre di sistema Android** (attivata per impostazione predefinita)               | Nasconde le barre di stato e navigazione Android per una plancia da bordo a bordo. Scorri da un bordo per mostrarle. Solo renderer integrato.                                                                                                                      | Non impedisce di uscire dall'app e non nasconde menu e navigazione di Home Assistant.                                                                                                             |
| **Blocca Android sulla plancia (sperimentale)** (disattivata per impostazione predefinita)  | Con root, nasconde le barre di sistema Android e torna alla plancia selezionata entro circa tre secondi quando si apre un'altra app o la schermata delle app recenti. Scoraggia l'uso occasionale; non è una barriera di sicurezza contro una persona determinata. | Non cambia l'aspetto della plancia. Non ha effetto senza root. Dopo un riavvio c'è una finestra sbloccata di 60 secondi per il recupero, poi il blocco salvato si applica di nuovo.               |

Per una plancia più pulita, attiva **Nascondi navigazione Home Assistant (nativa)** quando nessuno ha bisogno della navigazione Home Assistant sul pannello; **Nascondi barre di sistema Android** è già attiva. Attiva **Blocca Android sulla plancia** soltanto quando serve scoraggiare l'uscita occasionale dall'app e soltanto dopo aver provato le vie d'uscita: la pagina Configura, l'interruttore Home Assistant, `adb`, sette tocchi rapidi nell'angolo superiore sinistro o la finestra sbloccata dopo un riavvio.

## Filtro delle entità

:::caution
L'apprendimento automatico non può dimostrare ogni dipendenza di una scheda personalizzata o di un modello dinamico, e un insieme incompleto di entità può lasciare schede mancanti o non aggiornate. Controlla l'insieme appreso dopo aver modificato una plancia e tieni a portata di mano il modo di disattivare il filtro.
:::

Il filtro si applica soltanto al renderer integrato. Modifica la sottoscrizione del frontend a Home Assistant, così Home Assistant filtra gli stati prima di serializzarli e inviarli al pannello. Le altre app plancia non vengono coinvolte. [Prestazioni](/it/manage/performance/) spiega perché di solito è il miglioramento più importante su un pannello lento.

### Procedura automatica

1. Usa **Visita** nella pagina del dispositivo del pannello in Home Assistant, poi apri **Configura**, quindi **Dashboard**, seleziona **Renderer integrato** e attiva **Filtro entità**.
2. Apri la scheda **Entità** e seleziona **Esegui ora la scansione della plancia**.
3. Visita ogni scheda della plancia e usa controlli, finestre a comparsa e contenuti condizionali, così il pannello può osservarne le dipendenze durante l'esecuzione.
4. Controlla gli elenchi delle entità attuali, suggerite ed escluse. Fissa le entità usate indirettamente da schede o modelli personalizzati e risolvi i controlli del filtro mostrati sopra le tabelle.
5. Seleziona **Applica l'insieme di regole** quando il candidato è pronto. Il pannello mostra il vecchio e il nuovo numero di entità prima di chiedere conferma, poi ricarica la plancia con la sottoscrizione filtrata.

![La scheda Entità dell'interfaccia web del pannello, con il filtro della sottoscrizione alle entità, le entità attualmente sottoscritte e quelle suggerite](/screenshots/ui-entities-dark.png)

La pagina Entità spiega perché ogni entità è stata trovata, registra le selezioni manuali e le esclusioni e mantiene visibili le regole ampie o dinamiche che riconosce finché non le correggi o scegli esplicitamente come procedere. Possono comunque esistere comportamenti che non riconosce: prova quindi ogni scheda della plancia dopo aver attivato il filtro. Se manca qualcosa, disattiva **Filtro entità** nella pagina Configura e ricarica prima di rivedere il candidato.

### Quando il pannello trattiene la plancia

Con il filtro automatico attivo, il renderer integrato non apre mai Home Assistant senza filtro. Finché un'analisi non produce un insieme di cui può garantire l'adeguatezza, il pannello mostra una schermata nativa di attesa invece della plancia, per uno di tre motivi. Mentre la prima analisi è in corso o è fallita, il pannello la ripete con intervalli crescenti, perché la causa abituale è che Home Assistant non è ancora disponibile. Se Home Assistant rifiuta la credenziale del pannello, la schermata indica l'accesso. Se l'analisi è terminata ma ha trovato una regola che non può delimitare, come una plancia generata da una strategia o un selettore senza limiti, la schermata chiede una decisione: ignorare le regole segnalate e continuare, disattivare il filtro o esaminarle nella pagina Entità. Puoi decidere dal pannello o da qualsiasi dispositivo sulla rete: usa **Visita** nella pagina del dispositivo del pannello in Home Assistant, poi apri **Entità** (per esempio `http://<panel>:8888/entities` con la porta predefinita). La schermata di attesa mostra anche l'indirizzo.

Un'attesa che richiede una decisione è stabile, quindi il pannello non ripete l'analisi del catalogo mentre aspetta. Chiede a Home Assistant se la plancia è cambiata cinque minuti dopo che l'attesa si stabilizza e poi al massimo ogni ora; ripete l'analisi soltanto quando la configurazione della plancia o il valore predefinito dell'account sono davvero cambiati, quando viene presa la decisione o quando cambiano le impostazioni Home Assistant del pannello.

Un aggiornamento dell'app può far ricontrollare una plancia già filtrata. Se questo controllo segnala una regola su una plancia che il pannello stava già usando con un filtro, il pannello registra la regola come ignorata, ripristina l'insieme di entità in uso e apre la plancia anziché trattenerla; la regola rimane visibile nella pagina Entità e può essere riattivata lì. Questo vale soltanto per un controllo causato da un aggiornamento, soltanto se esiste un filtro precedentemente accettato e soltanto se l'insieme ripristinato non è vuoto. Le regole che il pannello non può mai ignorare, come una plancia troppo grande da analizzare, continuano a trattenere il renderer.

### Modelli e selezioni manuali

L'app non esegue i modelli della plancia, quindi non può sapere quali entità restituisca un modello e non prova a indovinarlo. Tratta diversamente i due tipi di entità coinvolte da un modello.

Le entità che un modello si limita a **leggere**, come uno stato controllato in una condizione, non richiedono nulla. Home Assistant elabora direttamente il modello e invia il risultato al pannello tramite una sottoscrizione separata che il filtro non tocca. È previsto che queste entità siano assenti dagli elenchi della pagina Entità: aggiungerle allargherebbe soltanto la sottoscrizione senza alcun vantaggio.

Le entità **restituite** da un modello sono diverse. Diventano schede della plancia che leggono il proprio stato tramite la sottoscrizione filtrata e devono quindi farne parte. Il pannello non può scoprirle senza eseguire il modello e scegliere di proseguire dopo un controllo di rilevamento delle entità non le aggiunge: quella scelta consente soltanto agli aggiornamenti automatici di continuare senza di esse.

Per aggiungerne una, digita una parte del nome o dell'ID nel campo di ricerca in cima alla pagina Entità. La ricerca copre l'intero catalogo Home Assistant, non soltanto le entità già trovate, e mostra quante corrispondenze contiene ogni tabella. Imposta ogni entità necessaria su **Fissata**. Una selezione manuale rimane finché non la rimuovi, anche dopo modifiche della plancia e nuove analisi.

### Reimpostare i dati appresi

Usa **Reimposta dati appresi** nella pagina Entità quando vecchie informazioni della plancia o decisioni manuali precedenti rendono il candidato fuorviante. Dopo la conferma, cancella appartenenza ed evidenze apprese della plancia, selezioni manuali ed esclusioni e decisioni di sicurezza ignorate. Conserva il filtro attivo noto come funzionante e il catalogo Home Assistant usato per i nomi dei candidati e avvia una nuova analisi quando l'apprendimento è attivo. Il reset ricostruisce quindi il candidato anziché riallargare subito la sottoscrizione a tutti gli stati Home Assistant.

## Temi

**Tema della plancia** (Configura, poi Renderer integrato) decide chi sceglie tra chiaro e scuro:

- **Segui Home Assistant** (valore predefinito) lascia la scelta a Home Assistant. Il pannello fornisce soltanto un punto di partenza: su Android 13 e successivi segue in tempo reale l'impostazione di sistema, su Android 10–12 segue l'impostazione di sistema al caricamento della plancia e su Android 9 e precedenti lo determina l'interruttore **Modalità scura** (Configura, poi Schermo). Un tema scelto in Home Assistant prevale su questo punto di partenza.
- **Ambiente** sceglie chiaro o scuro dal modello della stanza usato dalla luminosità automatica. La luminosità automatica deve essere attiva; finché non arrivano letture utilizzabili segue Home Assistant. Un cambiamento richiede un minuto intero di luce o buio continuo.
- **Scuro** e **Chiaro** fanno scegliere al pannello. Servono per una plancia chiosco con barra laterale nascosta, dove la pagina del profilo Home Assistant non è raggiungibile dal pannello.

Forzare un tema modifica soltanto la parte chiara o scura della scelta. Un tema con nome e i suoi colori rimangono esattamente com'erano, e tornare a Segui Home Assistant ripristina la parte chiara o scura precedente, oppure Auto se non era impostata. Il pannello non cambia mai il tema memorizzato nell'account Home Assistant, quindi un pannello impostato su Scuro non può scurire il telefono.

C'è un caso che non può sovrascrivere. Se questo utente Home Assistant ha scelto esplicitamente Chiaro o Scuro anziché Auto, la scelta prevale ancora, perché sovrascriverla significherebbe cambiare un'impostazione condivisa con ogni altro dispositivo su cui l'utente accede. Imposta il tema dell'utente su Auto oppure assegna al pannello un proprio utente Home Assistant, e la scelta del pannello si applicherà. Quando succede, il pannello lo indica: la scheda **Diagnostica runtime** nell'interfaccia web segnala che il tema Home Assistant prevale sul Tema della plancia e la riga `[renderer]` del rapporto `/diag` contiene `theme_overridden=true`.

L'interfaccia web del pannello è separata da tutto questo e segue sempre il browser in cui la visualizzi.

## Usare invece un'app plancia separata

Se un pannello richiede una delle capacità elencate in [Limiti](#limiti), apri la pagina Configura e seleziona l'altra app plancia installata in **App della plancia**. Il passaggio è immediato. Non scegliere **Auto**, perché Auto usa il renderer integrato ogni volta che è pronto.

## Limiti

- **Nessun supporto per più di un server Home Assistant o per notifiche native.** Mantieni un'app plancia separata sul pannello quando queste capacità sono importanti. Il controllo vocale Assist non rientra in questo elenco: proviene dall'[assistente vocale](/it/manage/voice-assistant/) del pannello su un pannello con microfono, qualunque sia l'app plancia attiva.
- **Nessuna funzione multimediale aggiuntiva a schermo intero**, come un selettore di file o la riproduzione in stile casting. Sono fuori ambito.
- Serve comunque una **WebView di sistema aggiornata** per visualizzare il frontend Home Assistant. Una WebView obsoleta genera un avviso di stato nell'interfaccia web; aggiornala con il [metodo per il tuo pannello](/it/hardware/guides/update-the-webview/).
- L'accesso dal browser e l'installazione avanzata non interattiva funzionano entrambi senza root.
