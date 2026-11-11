---
title: Riparazioni
description: Significato di ogni Riparazione di Panel Assistant, perché compare e come risolverla.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Apri **Impostazioni → Sistema → Riparazioni** in Home Assistant e scegli il messaggio di Panel Assistant. Il primo link apre l'impostazione o i passaggi di recupero pertinenti. Usa **Ulteriori informazioni** per la spiegazione seguente.

Conserva il rapporto di assistenza salvato mentre controlli un'installazione o un aggiornamento non riusciti. L'azione **Cancella errore** elimina quel rapporto; non modifica il pannello.

Usa **Riprova**, con le sue verifiche di sicurezza, nella Riparazione esistente solo dopo aver controllato il rapporto e il pannello. Non avviare una nuova installazione automatica, una disinstallazione o un ripristino mentre lo stato dell'installazione è sconosciuto. Vedi [recupero dell'installazione](/it/manage/troubleshooting/#uninstallazione-di-rete-si-è-interrotta) e [rapporti di assistenza](/it/home-assistant/support-report/).

## Trova la tua Riparazione

- [Rimuovi Panel Assistant da &lt;pannello&gt;](#rimuovi-panel-assistant-da-pannello)
- [App del pannello troppo vecchia](#app-del-pannello-troppo-vecchia)
- [La vecchia app richiede 0.9.0](#la-vecchia-app-richiede-090)
- [Il pannello MQTT richiede 0.9.0](#il-pannello-mqtt-richiede-090)
- [Autorizzazioni del pannello](#autorizzazioni-del-pannello)
- [Configurazione della prossimità del pannello](#configurazione-della-prossimità-del-pannello)
- [Plancia non filtrata](#plancia-non-filtrata)
- [Microfono vocale silenzioso](#microfono-vocale-silenzioso)
- [Microfono vocale senza audio](#microfono-vocale-senza-audio)
- [Microfono vocale senza audio con dettagli](#microfono-vocale-senza-audio-con-dettagli)
- [Parola di attivazione conservata](#parola-di-attivazione-conservata)
- [Parola di attivazione rifiutata](#parola-di-attivazione-rifiutata)
- [Entità numerica del volume rimossa](#entità-numerica-del-volume-rimossa)
- [Riavvio necessario](#riavvio-necessario)
- [Utente del pannello non corrispondente](#utente-del-pannello-non-corrispondente)
- [Nessun percorso di aggiornamento](#nessun-percorso-di-aggiornamento)
- [Identità del pannello unite](#identità-del-pannello-unite)
- [Installazione non riuscita](#installazione-non-riuscita)
- [Installazione non riuscita: autorizzazione fallita](#installazione-non-riuscita-autorizzazione-fallita)
- [Installazione non riuscita: controlli preliminari respinti](#installazione-non-riuscita-controlli-preliminari-respinti)
- [Installazione non riuscita: artefatto respinto](#installazione-non-riuscita-artefatto-respinto)
- [Installazione non riuscita: trasporto fallito](#installazione-non-riuscita-trasporto-fallito)
- [Installazione non riuscita: installazione fallita](#installazione-non-riuscita-installazione-fallita)
- [Installazione non riuscita: avvio fallito](#installazione-non-riuscita-avvio-fallito)
- [Installazione non riuscita: controllo di salute fallito](#installazione-non-riuscita-controllo-di-salute-fallito)
- [Installazione non riuscita: modifica ambigua](#installazione-non-riuscita-modifica-ambigua)
- [Installazione non riuscita: verifica necessaria](#installazione-non-riuscita-verifica-necessaria)
- [Installazione non riuscita: aggiornamento](#installazione-non-riuscita-aggiornamento)
- [Installazione non riuscita: nuovo tentativo sospeso](#installazione-non-riuscita-nuovo-tentativo-sospeso)
- [Indirizzo del pannello irraggiungibile](#indirizzo-del-pannello-irraggiungibile)
- [Indirizzo del pannello non verificato](#indirizzo-del-pannello-non-verificato)
- [Identità del pannello non corrispondente](#identità-del-pannello-non-corrispondente)
- [Collegamento del pannello condiviso](#collegamento-del-pannello-condiviso)
- [Conferma dell'identità del pannello](#conferma-dellidentità-del-pannello)
- [Installazione non riuscita: autorizzazione ADB](#installazione-non-riuscita-autorizzazione-adb)
- [Autorizzazione aggiornamento ADB](#autorizzazione-aggiornamento-adb)
- [Un altro Home Assistant](#un-altro-home-assistant)

## Rimuovi Panel Assistant da &lt;pannello&gt;

**Cosa significa:** Qualcuno ha premuto **Rimuovi da questo pannello** nella pagina del dispositivo di questo pannello. Il pulsante non rimuove nulla; la Riparazione resta disponibile fino al completamento della rimozione.

**Perché accade:** Panel Assistant ti chiede conferma prima di ripristinare la schermata iniziale e le app del produttore, disinstallare ha-paneld ed eliminare il pannello da Home Assistant.

**Come risolvere:** Leggi [cosa comporta la rimozione e come reinstallare](/it/manage/removal-risks/) prima di selezionare **Invia** una volta per confermare. Se è stato un errore, chiudi la finestra di dialogo senza inviare e lascia la Riparazione non confermata.

<a id="panel-app-too-old"></a>

## App del pannello troppo vecchia

**Cosa significa:** Home Assistant non può vedere o controllare il pannello tramite il protocollo di connessione attuale.

**Perché accade:** L'app del pannello non segnala alcun protocollo di connessione supportato, oppure il suo intervallo di protocolli non si sovrappone a quello che questo Panel Assistant può fornire.

**Come risolvere:** Apri gli aggiornamenti di Home Assistant e installa un aggiornamento compatibile dell'app per questo pannello, se disponibile. Attendi che si riconnetta. Se non viene offerto alcun aggiornamento, usa la guida al recupero degli aggiornamenti; non tornare a una versione precedente alla cieca.

<a id="old-app-needs-090"></a>

## La vecchia app richiede 0.9.0

**Cosa significa:** Panel Assistant 1.0 non può installare o aggiornare questo pannello con la vecchia app.

**Perché accade:** Il passaggio dalla vecchia app ha-paneld è stato rimosso in 1.0.

**Come risolvere:** Non riscaricare Panel Assistant 0.9.0 sopra un'installazione 1.0 in esecuzione: un'impostazione rimossa da 1.0 può far sì che 0.9.0 riporti i pannelli migrati a MQTT. Solo se nessun pannello ha ancora l'app 1.0, ripristina un backup di Home Assistant precedente all'aggiornamento, completa tutti i passaggi in 0.9.0, poi torna a 1.0. Se un pannello ha già l'app 1.0, o non esiste un backup adatto, chiedi assistenza prima di cambiare versione. Vedi la [guida al recupero dell'aggiornamento a 1.0](/it/manage/upgrade-to-1-0/).

<a id="mqtt-panel-needs-090"></a>

## Il pannello MQTT richiede 0.9.0

**Cosa significa:** Panel Assistant non può connettere questo pannello MQTT non ancora migrato senza separarne entità e cronologia.

**Perché accade:** Panel Assistant 1.0 non esegue più la migrazione da MQTT.

**Come risolvere:** Non riscaricare Panel Assistant 0.9.0 sopra un'installazione 1.0 in esecuzione: un'impostazione rimossa da 1.0 può far sì che 0.9.0 riporti i pannelli migrati a MQTT. Solo se nessun pannello ha ancora l'app 1.0, ripristina un backup di Home Assistant precedente all'aggiornamento, completa tutti i passaggi in 0.9.0, poi torna a 1.0. Se un pannello ha già l'app 1.0, o non esiste un backup adatto, chiedi assistenza prima di cambiare versione. Vedi la [guida al recupero dell'aggiornamento a 1.0](/it/manage/upgrade-to-1-0/).

<a id="panel-permissions"></a>

## Autorizzazioni del pannello

**Cosa significa:** Alcune funzioni del pannello non possono funzionare perché Android non ha concesso le relative autorizzazioni. La plancia resta disponibile.

**Perché accade:** Un'installazione precedente o un'autorizzazione Android modificata possono lasciare mancante un'autorizzazione necessaria. L'autorizzazione alla fotocamera è rilevante quando la fotocamera è attiva; quella al microfono quando sono attivi la fotocamera o la voce. Se lo stato della funzione è sconosciuto, l'avviso rimane finché non può essere verificato.

**Come risolvere:** Sul pannello fisico apri Impostazioni Android → App → Panel Assistant. Consenti fotocamera, microfono e notifiche dove elencati. In Accesso speciale alle app consenti Modifica impostazioni di sistema e Visualizzazione sopra altre app, poi abilita Panel Assistant in Accessibilità. Se la navigazione è Scorri per mostrarla o Sempre attiva e manca l'autorizzazione di sovrapposizione, scorri verso l'alto dal bordo inferiore della plancia per aprire Visualizzazione sopra altre app, concedila, torna indietro e scorri di nuovo. Torna alla Riparazione e premi Invia. Home Assistant deve verificare nuovamente ogni autorizzazione pertinente; una lettura non riuscita o il solo aggiornamento dell'app non possono chiudere la Riparazione.

<a id="panel-proximity-setup"></a>

## Configurazione della prossimità del pannello

**Cosa significa:** Il risveglio con un gesto non è disponibile perché il pannello non ha salvato la calibrazione della prossimità.

**Perché accade:** Il pannello segnala calibration_required. La calibrazione misura questa installazione e richiede una persona davanti al pannello; avviare la configurazione non ne dimostra il completamento.

**Come risolvere:** Apri la pagina Configura del pannello in Presenza e riattivazione e scegli Configura prossimità sul pannello. Segui le istruzioni fisiche sul pannello, per circa un minuto. Quando indica che la calibrazione è stata salvata, torna alla Riparazione e premi Invia. Home Assistant legge lo stato aggiornato prima di completare; se la configurazione è ancora in corso o il pannello non è leggibile, completa la configurazione o ripristina la connessione e invia di nuovo. Anche l'azione Apri configurazione di prossimità nella Dashboard avvia la procedura sul pannello.

<a id="dashboard-unfiltered"></a>

## Plancia non filtrata

**Cosa significa:** Il pannello mostra la plancia con tutte le entità di Home Assistant anziché solo quelle che la plancia utilizza.

**Perché accade:** Mentre impara quali entità usa la plancia, il pannello attende dietro una schermata che spiega cosa sta aspettando. Se l'attesa supera 90 secondi, mostra la plancia non filtrata per non lasciarti senza plancia. Le cause comuni sono una scansione a cui Home Assistant non ha risposto, un accesso rifiutato da Home Assistant, regole della plancia che richiedono una tua decisione e un motore del browser troppo vecchio per filtrare. Il pannello continua a tentare dietro la plancia.

**Come risolvere:** Apri il pannello nella barra laterale di Panel Assistant, poi Entità, per vedere cosa sta aspettando. Rispondi lì alla richiesta di decisione sulle regole segnalate, oppure accedi di nuovo da Configura se Home Assistant ha rifiutato l'accesso. Se Panel Assistant offre un motore del browser più recente per il pannello, installalo. Il pannello torna automaticamente alla plancia filtrata e la Riparazione scompare.

<a id="voice-microphone-silent"></a>

## Microfono vocale silenzioso

**Cosa significa:** Il pannello non ascolta una parola di attivazione perché la verifica di acquisizione del microfono ha registrato solo silenzio.

**Perché accade:** La verifica ha rilevato solo silenzio o un rumore di fondo costante.

**Come risolvere:** Apri il pannello nella barra laterale di Panel Assistant, poi Configura → Assistente vocale. Disattivalo e riattivalo per eseguire un'altra verifica. Se continua a non riuscire, cambia Sorgente audio nella stessa scheda Voce; il suo link diretto mostra l'impostazione avanzata. Una verifica riuscita elimina la Riparazione. Anche disattivare la voce la ritira, perché l'ascolto non è più richiesto.

<a id="voice-microphone-no-audio"></a>

## Microfono vocale senza audio

**Cosa significa:** Il pannello non ascolta una parola di attivazione perché la verifica di acquisizione del microfono non ha ricevuto audio.

**Perché accade:** L'acquisizione Android non ha fornito audio, senza un errore più specifico.

**Come risolvere:** Apri il pannello nella barra laterale di Panel Assistant, poi Configura → Assistente vocale. Disattivalo e riattivalo per eseguire un'altra verifica. Se continua a non riuscire, cambia Sorgente audio nella stessa scheda Voce; il suo link diretto mostra l'impostazione avanzata. Una verifica riuscita elimina la Riparazione. Anche disattivare la voce la ritira, perché l'ascolto non è più richiesto.

<a id="voice-microphone-no-audio-detail"></a>

## Microfono vocale senza audio con dettagli

**Cosa significa:** Il pannello non ascolta una parola di attivazione perché la verifica di acquisizione del microfono non ha ricevuto audio.

**Perché accade:** L'acquisizione Android non ha restituito audio; il dettaglio segnalato dal pannello spiega l'errore di acquisizione.

**Come risolvere:** Apri il pannello nella barra laterale di Panel Assistant, poi Configura → Assistente vocale. Disattivalo e riattivalo per eseguire un'altra verifica. Se continua a non riuscire, cambia Sorgente audio nella stessa scheda Voce; il suo link diretto mostra l'impostazione avanzata. Una verifica riuscita elimina la Riparazione. Anche disattivare la voce la ritira, perché l'ascolto non è più richiesto.

<a id="wake-word-kept"></a>

## Parola di attivazione conservata

**Cosa significa:** Il pannello ha conservato il proprio modello con l'id della parola di attivazione condivisa, quindi non usa il modello condiviso.

**Perché accade:** Il modello installato ha uno SHA-256 diverso dal modello condiviso e non è una precedente copia condivisa. Panel Assistant conserva un modello importato indipendentemente anziché sovrascriverlo.

**Come risolvere:** Apri il pannello in Panel Assistant, Configura, Parole di attivazione. Se vuoi il modello condiviso su quel pannello, importa il relativo manifesto .json e modello .tflite. Non modificare il modello attuale se era intenzionale; la condivisione automatica non lo sostituisce mai. L'importazione dalla barra laterale rende anche il modello importato la copia condivisa; la condivisione non attiva le parole di attivazione.

L'importazione dalla barra laterale sostituisce la copia condivisa e può aggiornare altri pannelli. Vedi [parole di attivazione personalizzate](/it/manage/custom-wake-words/).

<a id="wake-word-refused"></a>

## Parola di attivazione rifiutata

**Cosa significa:** La parola di attivazione condivisa non è stata installata su questo pannello; le altre parole di attivazione installate restano disponibili.

**Perché accade:** Il pannello ha rifiutato il modello importato e segnalato un motivo. Un modello può avere un manifesto non valido, superare i limiti, non superare la verifica del motore delle parole di attivazione o non essere salvato. Un modello accettato da un pannello può essere rifiutato da un altro.

**Come risolvere:** Apri il pannello in Panel Assistant, Configura, Parole di attivazione. Usa il motivo segnalato per correggere o addestrare di nuovo il modello microWakeWord, poi importa lì il relativo manifesto .json e file .tflite. L'importazione mostra la risposta del pannello e conserva l'ultimo modello valido in caso di rifiuto. La condivisione non attiva la parola di attivazione; selezionala se vuoi che il pannello la ascolti. I comandi non supportati delle vecchie app e i timeout della connessione producono avvisi anziché questa Riparazione.

L'importazione dalla barra laterale sostituisce la copia condivisa e può aggiornare altri pannelli. Vedi [parole di attivazione personalizzate](/it/manage/custom-wake-words/).

<a id="volume-number-removed"></a>

## Entità numerica del volume rimossa

**Cosa significa:** Automazioni o script fanno ancora riferimento a un'entità numerica separata per il volume, rimossa da un pannello che ora ha un lettore multimediale. Queste azioni vanno aggiornate.

**Perché accade:** Il volume è ora gestito dal lettore multimediale del pannello. Dopo l'avvio di Home Assistant, Panel Assistant rimuove solo la precedente entità numerica del volume di quel pannello e indica le automazioni e gli script che vi fanno ancora riferimento.

**Come risolvere:** Apri Automazioni o Script e trova quelli elencati nella Riparazione. Sostituisci le azioni number.set_value rivolte all'entità rimossa con media_player.volume_set rivolte al lettore multimediale del pannello; imposta volume_level tra 0 e 1, per esempio 0.5 per il 50%. Aggiorna gli altri riferimenti in base al loro scopo. Salva, verifica il funzionamento dell'automazione o dello script, poi ignora la Riparazione. Panel Assistant non li riscrive automaticamente.

<a id="restart-required"></a>

## Riavvio necessario

**Cosa significa:** Home Assistant sta ancora eseguendo la versione precedente di Panel Assistant.

**Perché accade:** La versione/build dell'integrazione installata differisce dal codice già caricato in Home Assistant.

**Come risolvere:** Apri la Riparazione, controlla le versioni installata e in esecuzione, poi premi Invia quando sei pronto a riavviare Home Assistant e caricare la versione installata.

<a id="panel-user-mismatch"></a>

## Utente del pannello non corrispondente

**Cosa significa:** Una richiesta di account del pannello attende la tua conferma.

**Perché accade:** Un utente autenticato in Home Assistant ha chiesto di connettersi come questo pannello. La prima associazione o una modifica dell'account salvato richiedono la tua approvazione.

**Come risolvere:** Apri la Riparazione e confronta pannello e utente indicati con l'account che hai configurato intenzionalmente. Seleziona Invia solo se riconosci la richiesta. Se il pannello ha già un account diverso, confermare la modifica interrompe l'accettazione di quell'account. Per una richiesta inattesa, chiudi la finestra e ignora il problema: qualsiasi utente autenticato può richiedere una connessione al pannello.

<a id="no-update-route"></a>

## Nessun percorso di aggiornamento

**Cosa significa:** Panel Assistant non può installare aggiornamenti dell'app; il pannello mantiene la versione attuale e le altre funzioni continuano a funzionare.

**Perché accade:** Il pannello non offre più un percorso di aggiornamento utilizzabile, per esempio dopo modifiche del firmware o un ripristino.

**Come risolvere:** Segui [la guida per un pannello che non può essere aggiornato](/it/manage/updates-and-recovery/#un-pannello-che-non-può-essere-aggiornato). Il recupero dipende dal modello e dal firmware: ripristina l'accesso di debug o riconnetti tramite USB solo quando la guida lo richiede. La Riparazione scompare quando Home Assistant dispone di un percorso di aggiornamento funzionante.

<a id="merged-panel-identity"></a>

## Identità del pannello unite

**Cosa significa:** Più voci rivendicano un'unica identità, impedendo un'assegnazione nativa sicura.

**Perché accade:** Identificatori clonati o condivisi in passato rendono ambigua una sessione; l'integrazione si rifiuta di scegliere un pannello.

**Come risolvere:** Aggiorna l'app su ogni pannello fisico interessato affinché ciascuno riporti la propria identità. Poi elimina il dispositivo unificato in Home Assistant e lascia che i pannelli si registrino di nuovo. Controlla le entità disabilitate da una versione precedente; non vengono ripristinate automaticamente.

<a id="installer-failure"></a>

## Installazione non riuscita

**Cosa significa:** L'installazione o l'aggiornamento non sono terminati.

**Perché accade:** L'errore non corrisponde a un motivo di Riparazione più specifico.

**Come risolvere:** Apri il Rapporto di assistenza per vedere cosa è successo, poi usa Riprova dopo aver risolto la causa segnalata.

<a id="installer-failure-authorization-failed"></a>

## Installazione non riuscita: autorizzazione fallita

**Cosa significa:** L'installazione non ha potuto connettersi ad Android sul pannello.

**Perché accade:** Il pannello non ha accettato la connessione ADB di Home Assistant.

**Come risolvere:** Controlla il debug del pannello e la richiesta di approvazione seguendo Prepara un pannello, poi usa Riprova nella Riparazione.

<a id="installer-failure-preflight-rejected"></a>

## Installazione non riuscita: controlli preliminari respinti

**Cosa significa:** L'app richiesta non è stata installata.

**Perché accade:** I controlli dell'installatore hanno respinto il pannello prima dell'installazione.

**Come risolvere:** Apri il Rapporto di assistenza, correggi il controllo segnalato, poi usa Riprova se pannello e versione selezionata corrispondono ancora.

<a id="installer-failure-artifact-rejected"></a>

## Installazione non riuscita: artefatto respinto

**Cosa significa:** L'app richiesta non è stata installata.

**Perché accade:** Non è stato possibile autenticare la versione oppure sono falliti i controlli locali di preparazione, incluso un percorso di preparazione non sicuro o occupato.

**Come risolvere:** Apri il Rapporto di assistenza per identificare la versione o il controllo di preparazione respinto, poi riprova tramite la Riparazione dopo averne risolto la causa.

<a id="installer-failure-transport-failed"></a>

## Installazione non riuscita: trasporto fallito

**Cosa significa:** Home Assistant non ha potuto completare il trasferimento o l'installazione dell'app.

**Perché accade:** Un'operazione di trasporto è fallita; può trattarsi di un problema di connessione o di un'operazione di trasferimento o installazione respinta.

**Come risolvere:** Ripristina la connessione del pannello, poi usa Riprova nella Riparazione affinché Panel Assistant controlli lo stato attuale prima di continuare.

<a id="installer-failure-install-failed"></a>

## Installazione non riuscita: installazione fallita

**Cosa significa:** Android ha rifiutato l'installazione richiesta.

**Perché accade:** L'installazione del pacchetto sul pannello è fallita; il Rapporto di assistenza contiene il risultato.

**Come risolvere:** Leggi il Rapporto di assistenza e risolvi l'errore Android segnalato, poi usa Riprova nella Riparazione.

<a id="installer-failure-launch-failed"></a>

## Installazione non riuscita: avvio fallito

**Cosa significa:** L'app è installata ma non si è avviata.

**Perché accade:** L'installatore non ha potuto avviare Panel Assistant dopo l'installazione.

**Come risolvere:** Apri Panel Assistant dall'elenco delle app del pannello, poi usa Riprova nella Riparazione per verificare e completare il tentativo. Se non si apre, usa il Rapporto di assistenza per chiedere aiuto.

<a id="installer-failure-health-check-failed"></a>

## Installazione non riuscita: controllo di salute fallito

**Cosa significa:** L'app si è avviata ma non è stata confermata come funzionante.

**Perché accade:** L'installatore non ha ricevuto la risposta di funzionamento richiesta.

**Come risolvere:** Controlla l'app sul pannello, poi usa Riprova nella Riparazione per verificarne lo stato. Se continua a non funzionare correttamente, usa il Rapporto di assistenza per chiedere aiuto.

<a id="installer-failure-ambiguous-mutation"></a>

## Installazione non riuscita: modifica ambigua

**Cosa significa:** Panel Assistant non può determinare se il tentativo fallito ha modificato il pannello.

**Perché accade:** Il risultato dell'installazione non ha dimostrato lo stato finale dei pacchetti sul pannello.

**Come risolvere:** Controlla cosa è presente sul pannello fisico e apri il Rapporto di assistenza della Riparazione. Usa l'azione Riprova con le sue verifiche di sicurezza solo dopo aver controllato lo stato segnalato; non disinstallare, cancellare i dati dell'app o ripristinare il pannello per eliminare il messaggio.

<a id="installer-failure-verification-required"></a>

## Installazione non riuscita: verifica necessaria

**Cosa significa:** Un'altra installazione è bloccata finché non è possibile controllare il pannello.

**Perché accade:** Il tentativo precedente richiede una verifica prima di qualsiasi ulteriore installazione.

**Come risolvere:** Controlla il pannello e il Rapporto di assistenza, poi usa Riprova nella Riparazione per ricontrollarne lo stato attuale. Non disinstallare, cancellare i dati dell'app o ripristinare il pannello per eliminare il messaggio.

<a id="installer-failure-update"></a>

## Installazione non riuscita: aggiornamento

**Cosa significa:** Home Assistant non ha potuto confermare il completamento dell'aggiornamento. L'app del pannello potrebbe essere già installata mentre l'aggiornamento del motore del browser resta incompleto.

**Perché accade:** L'aggiornamento dell'app o del motore del browser è fallito o non è stato verificabile. La Riparazione conserva il rapporto dell'intero tentativo.

**Come risolvere:** Leggi il Rapporto di assistenza, ripristina la connessione o il requisito di installazione segnalato, poi scegli **Riprova**. Se resta incompleto solo l'aggiornamento del motore del browser e Panel Assistant conferma che la versione richiesta dell'app è installata, continua quella fase senza reinstallare l'app. Se viene offerto **Consenti aggiornamenti**, usalo prima per approvare Home Assistant sul pannello. Vedi la [guida WebView](/it/hardware/guides/update-the-webview/) se il motore del browser non può essere aggiornato.

<a id="installer-failure-retry-hold"></a>

## Installazione non riuscita: nuovo tentativo sospeso

**Cosa significa:** Il nuovo tentativo è sospeso e non è stato autorizzato a continuare.

**Perché accade:** Un controllo di sicurezza o un errore inatteso del nuovo tentativo hanno interrotto questa operazione. Il rapporto salvato registra quanto osservato; una sospensione non concede il permesso di reinstallare.

**Come risolvere:** Leggi l'errore del nuovo tentativo e il Rapporto di assistenza, controlla che il pannello previsto e la versione corrispondano ancora, poi usa Riprova dopo aver risolto la causa. Cancellare l'errore elimina solo la Riparazione e il rapporto salvato.

<a id="panel-address-unreachable"></a>

## Indirizzo del pannello irraggiungibile

**Cosa significa:** I controlli restano disponibili tramite la connessione attiva, ma le operazioni HTTP non dispongono di un indirizzo raggiungibile verificato.

**Perché accade:** L'indirizzo salvato ha smesso di rispondere; il recupero automatico non aveva un candidato utilizzabile o non ha potuto verificarlo.

**Come risolvere:** Ripristina la raggiungibilità del pannello tramite rete/HTTP, oppure aggiungi lo stesso pannello al suo indirizzo attuale; non aggirare il controllo dell'identità.

<a id="panel-address-unverified"></a>

## Indirizzo del pannello non verificato

**Cosa significa:** I controlli restano disponibili tramite la connessione attiva, ma le operazioni HTTP non dispongono di un indirizzo raggiungibile verificato.

**Perché accade:** L'indirizzo salvato ha smesso di rispondere; il recupero automatico non aveva un candidato utilizzabile o non ha potuto verificarlo.

**Come risolvere:** Ripristina la raggiungibilità del pannello tramite rete/HTTP, oppure aggiungi lo stesso pannello al suo indirizzo attuale; non aggirare il controllo dell'identità.

<a id="panel-identity-mismatch"></a>

## Identità del pannello non corrispondente

**Cosa significa:** Stato e controlli del pannello vengono rifiutati su un endpoint con un'identità diversa.

**Perché accade:** Un indirizzo risponde ora come un'altra installazione, oppure le prove di identità salvate non possono essere riconciliate in sicurezza.

**Come risolvere:** Controlla il pannello fisico e l'indirizzo; aggiungi di nuovo il pannello noto attuale se è stato spostato. Non approvare mai un'identità diversa solo perché usa il vecchio indirizzo.

<a id="panel-link-shared"></a>

## Collegamento del pannello condiviso

**Cosa significa:** Un pannello reinstallato non può essere assegnato in sicurezza a una configurazione esistente.

**Perché accade:** Più voci hanno registrato lo stesso collegamento dispositivo precedente; il problema non è la raggiungibilità dell'indirizzo.

**Come risolvere:** Conserva gli altri pannelli attivi; rimuovi solo le voci inutilizzate oppure aggiungi separatamente il pannello reinstallato.

<a id="panel-identity-confirmation"></a>

## Conferma dell'identità del pannello

**Cosa significa:** Le configurazioni esistenti dei pannelli attendono la tua conferma dopo che i pannelli hanno segnalato nuove identità dispositivo.

**Perché accade:** Panel Assistant non ha potuto dimostrare automaticamente che ogni nuova identità appartiene alla configurazione precedente.

**Come risolvere:** Controlla ogni nome e indirizzo del pannello nell'elenco. Seleziona Invia solo se tutti i pannelli elencati appartengono alle rispettive configurazioni esistenti. Aprire la finestra non cambia nulla.

<a id="installer-failure-adb-authorization"></a>

## Installazione non riuscita: autorizzazione ADB

**Cosa significa:** L'aggiornamento fallito non può continuare finché questo pannello non autorizza Home Assistant.

**Perché accade:** È ancora richiesta l'approvazione di attendibilità ADB; il rapporto dell'aggiornamento fallito resta disponibile.

**Come risolvere:** Scegli Consenti aggiornamenti nella Riparazione e premi Invia, poi seleziona Consenti sempre da questo computer e tocca Consenti sul pannello indicato. Torna alla Riparazione e usa Riprova per l'aggiornamento fallito.

<a id="adb-update-authorization"></a>

## Autorizzazione aggiornamento ADB

**Cosa significa:** Home Assistant non può usare ADB per aggiornare questo pannello finché il pannello non lo autorizza.

**Perché accade:** Il percorso di aggiornamento richiede un'esplicita approvazione di attendibilità sul pannello.

**Come risolvere:** Apri la Riparazione e premi Invia, poi sul pannello indicato seleziona Consenti sempre da questo computer e tocca Consenti. Android può chiamare Home Assistant un computer; il flusso continua dopo l'approvazione.

<a id="another-home-assistant"></a>

## Un altro Home Assistant

**Cosa significa:** Aggiungere il pannello qui non cambia il server o l'account salvati.

**Perché accade:** L'indirizzo Home Assistant salvato sul pannello identifica un server diverso da questo.

**Come risolvere:** Se vuoi che il pannello si connetta qui, segui il link della Riparazione a Configura, inserisci questo indirizzo Home Assistant, salva, poi riconnettiti e accedi con l'account che vuoi usare sul pannello. Se deve restare sull'altro server, non modificarne le impostazioni e ignora la Riparazione. Se la barra laterale non riesce a raggiungerlo, apri Configura direttamente sulla rete del pannello.
