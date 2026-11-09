---
title: Sicurezza dell'installazione
description: I controlli del vecchio programma di installazione da riga di comando, i backup eseguiti prima di modificare un pannello e i casi in cui si fermava.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Questa pagina descrive i controlli del vecchio [programma di installazione da riga di comando](/it/install/installing-ha-paneld/), usato prima di ha-paneld v0.9.9. Ora Panel Assistant installa e aggiorna i pannelli: controlla il pannello prima di modificare qualsiasi cosa e salva le impostazioni prima di ogni aggiornamento, come descritto in [aggiornamenti e ripristino](/it/manage/updates-and-recovery/).

## Confini di fiducia e credenziali

I file delle credenziali tengono i segreti fuori dalla cronologia della shell e dalle righe di comando dei processi figli sul computer che esegue il programma di installazione. Non aggiungono crittografia all'API di gestione del pannello. L'API del pannello (per esempio `http://<panel>:8888` con la porta predefinita) segue il modello di rete fidata del progetto: le credenziali del broker e i token di Home Assistant attraversano quindi quella connessione tramite HTTP non cifrato. Esegui il programma solo su una rete fidata e segmentata. Il [riferimento sulla sicurezza](/it/reference/security/) descrive il modello.

L'accesso con nome utente e password di Home Assistant funziona diversamente. La password passa dal computer all'endpoint di accesso di Home Assistant e non raggiunge mai il pannello. Usa un URL Home Assistant `https://` per cifrare l'accesso durante il trasferimento; un URL `http://` invia la password senza cifratura. Il pannello riceve soltanto il token di aggiornamento risultante, che può essere revocato.

Le esportazioni della configurazione contengono segreti e vengono scritte con permessi riservati al proprietario: trattale come credenziali. Anche le copie automatiche delle impostazioni e del database create prima di un aggiornamento finiscono in una directory accessibile soltanto al proprietario, come file con modalità 600.

## Autenticazione delle versioni e dei pacchetti

Il programma di installazione che non richiede un checkout scarica l'app e il programma di provisioning della versione corrispondente. Prima di modificare il pannello, autentica l'app pubblicata e i binari dell'helper confrontandoli con i record SHA-256 firmati con la chiave di rilascio. Controlla inoltre il pacchetto e il firmatario dell'app con Android Build-Tools. Questi strumenti sono facoltativi per una prima installazione su un pannello che non ha ancora l'app, dove Android verifica direttamente la firma durante l'installazione, e obbligatori per aggiornare un pannello che la possiede: il programma confronta il firmatario installato con quello nuovo prima di modificare qualsiasi cosa e, nel dubbio, rifiuta di procedere. Un firmatario diverso farebbe altrimenti ritirare l'helper in esecuzione prima del fallimento dell'installazione. Il programma sceglie l'helper corrispondente all'ABI dichiarata dal pannello.

Un'app compilata localmente segue un percorso separato per sviluppatori. Deve comunque contenere il pacchetto ha-paneld con esattamente un firmatario valido, ma può usare la chiave di firma coerente di chi la compila. `--require-release-signer` rende il controllo più restrittivo quando il file locale dovrebbe essere una build ufficiale. `--allow-unsigned-helper` è una conferma separata per i binari dell'helper controllati da chi compila localmente anziché autenticati come file di rilascio.

## Backup e ripristino

Tre file diversi svolgono tre funzioni di ripristino diverse:

- Un'**esportazione JSON della configurazione** contiene impostazioni e segreti. `--export FILE` ne crea una esplicitamente e il programma tenta anche di creare automaticamente un'esportazione riservata al proprietario prima di un aggiornamento ordinario. Non contiene il catalogo dei profili di esecuzione, la selezione del profilo, lo stato delle entità appreso, le cronologie o un accesso a Home Assistant conservato da un'app plancia separata.
- Un **backup `.hpb`** creato da **Installa**, poi **Backup**, nell'interfaccia web del pannello è il backup supportato più completo. Include impostazioni, stato persistente del pannello, catalogo dei profili e un accesso idoneo conservato da un'app plancia separata. Il catalogo delle entità appreso e le cronologie di prossimità e luce ambientale vengono appresi di nuovo anziché ripristinati. Ripristina un `.hpb` tramite **Installa**, poi **Ripristino**, nella stessa pagina. `--restore FILE` del programma accetta JSON di configurazione, non backup `.hpb`.
- Un **`…break-glass.db`** automatico è una copia di ultima istanza del database interno del pannello. Nulla lo ripristina automaticamente ed è valido soltanto per lo stesso pannello e la stessa versione dell'app da cui proviene.

Quando `--export FILE` viene combinato con opzioni di installazione o configurazione, l'esportazione verificata viene scritta prima di qualsiasi modifica al pannello. Se non può essere prodotta e verificata, l'esecuzione si ferma. Esegui prima `--export FILE` come comando separato se vuoi l'esportazione senza installare nulla.

L'esportazione automatica delle impostazioni prima di un aggiornamento ordinario è un tentativo senza garanzia di riuscita. Se non può crearla, il programma rimuove il file parziale, registra che non esiste un'esportazione delle impostazioni e continua a sostituire l'app.

Prima di disinstallare, cancellare i dati dell'app o eseguire qualsiasi altro ripristino distruttivo, crea un backup separato da **Installa**, poi **Backup**, e verifica che il `.hpb` scaricato non sia vuoto. Queste operazioni distruggono i dati dell'app. Un normale `adb install -r` li conserva.

`--reset-config` funziona deliberatamente in modo diverso. **Il reset è irreversibile e non crea alcun backup.** Richiede una conferma specifica, poi rimuove tutti i dati dell'app del pannello. L'app, l'helper e le altre app Android rimangono installati.

## Istantanea automatica del database

Prima di ogni aggiornamento ordinario, il programma tenta di acquisire il database del pannello, che contiene configurazione, catalogo delle entità, cronologie di prossimità e luce ambientale e cronologia delle revisioni conservata sul pannello. L'istantanea aiuta a recuperare dopo una successiva disinstallazione o altra riparazione distruttiva; la normale sostituzione dell'app sul posto eseguita da Android lascia il database originale dov'è.

Il programma invia all'app in esecuzione una richiesta di preparazione all'aggiornamento, soltanto tramite ADB. L'app smette di accettare nuovo lavoro, completa le scritture in sospeso, sospende chi scrive nel database, salva il proprio stato, esegue il checkpoint del write-ahead log SQLite e chiude il database. Conferma quella specifica richiesta soltanto dopo aver registrato il vecchio processo, la versione dell'app, il numero di byte, un SHA-256 verificabile dal computer, la versione dello schema e il numero di righe di stato.

Il programma copia il database chiuso direttamente dalla memoria privata dell'app, senza preparare una seconda copia sul pannello. La copia sul computer viene accettata soltanto se dimensione e SHA-256, sempre controllato, corrispondono alla conferma e se i controlli locali SQLite di integrità, schema e righe vengono superati.

Se l'app non restituisce la conferma esatta, per esempio perché la richiesta è scaduta o la risposta è malformata, il programma ricorre una sola volta a `.backup` di SQLite sul database attivo. Produce lo stesso database autonomo in un unico file, senza write-ahead log o journal accanto. Un pannello senza un percorso root non può esporre il proprio database privato, quindi potrebbe essere disponibile soltanto l'esportazione delle impostazioni.

Per un aggiornamento ordinario sul posto, il backup del database è un tentativo senza garanzia di riuscita. Una copia fallita o incoerente viene rimossa, il programma stampa un avviso ben visibile e la sostituzione dell'app può procedere lasciando intatti i dati originali. Una copia non valida non viene mai conservata né indicata come backup riuscito.

Non esiste una soglia fissa di spazio libero per questo backup. Il percorso normale non prepara nulla sul pannello e l'unico tentativo alternativo lascia che sia l'acquisizione reale a mostrare se lo spazio basta. La scarsità di spazio, un controllo di integrità del database fallito, un endpoint di stato irraggiungibile, una risposta malformata o uno stato sconosciuto vengono segnalati prima e dopo l'installazione. Nessuno blocca una normale sostituzione dell'app, perché la nuova build potrebbe essere l'unico tentativo di recupero utile per una vecchia build non funzionante o irraggiungibile. Un `--verify` autonomo segnala queste condizioni come errore quando serve un esito rigoroso di successo o fallimento.

## Fuso orario e controlli della prima installazione

Prima di modificare il pannello, il programma confronta il fuso orario del pannello con quello del computer. Una differenza produce un avviso, non un arresto, perché un pannello può legittimamente usare un fuso diverso. Il confronto usa i nomi dei fusi anziché lo scarto UTC attuale e risolve gli alias noti tramite il database dei fusi orari del computer. Individua i pannelli lasciati sul fuso predefinito di fabbrica, che altrimenti registrerebbero i log ed eseguirebbero le pianificazioni all'ora locale sbagliata.

Il controllo rimane silenzioso se non riesce a stabilire uno dei due valori. Una risposta mancante, un nome di fuso non valido o un alias sconosciuto al database del computer non fanno fallire né modificano l'installazione.

Un pannello nuovo non ha un endpoint di stato dell'app del pannello, e lo stesso vale per alcune installazioni guaste. Il programma chiede al gestore dei pacchetti Android se ha-paneld è installato prima di decidere in quale caso si trova. Una risposta certa «non installato» avvia una normale prima installazione. Una richiesta al gestore dei pacchetti o ad ADB senza risposta ferma l'esecuzione prima di modificare il pannello.

## Aggiornamenti dell'helper root

Le versioni pubblicate includono binari sigillati dell'helper `armeabi-v7a` e `arm64-v8a`. Su un pannello con `su` del produttore o ADB root, il programma autentica il binario selezionato con la chiave di rilascio, lo verifica di nuovo dopo averlo preparato e lo installa o aggiorna atomicamente. Controlla le capacità del protocollo e l'identità di build riproducibile necessarie all'app prima di sostituirla.

L'helper precedente di proprietà root e il suo servizio rimangono disponibili finché l'installazione dell'app non riesce. Un errore nell'installazione o nell'avvio dell'helper, oppure un'identità o capacità errata, ripristina la coppia precedente funzionante prima che l'app venga sostituita. Se la connessione ADB cade mentre Android installa l'app, il programma conserva il registro di recupero. Eseguire di nuovo lo stesso comando autentica l'app installata e l'helper in esecuzione, poi completa o annulla l'aggiornamento interrotto.

Le istantanee di recupero appartengono a root, sono autenticate dal digest registrato e vengono sincronizzate sulla memoria prima di ritirare i file attivi. Il programma rifiuta di iniziare mentre esiste una transazione incompleta dell'helper e indica il comando da eseguire di nuovo.

Il programma preferisce un servizio init su `/system` scrivibile quando può verificare che lo spazio sia sufficiente. Se `/system` è di sola lettura, usa un esecutore Magisk, KernelSU o APatch verificato in `/data/adb/service.d`. Un pannello con `/system` scrivibile ma pieno può mantenere l'helper e i file di recupero in `/data/adb/hapaneld` e collocare soltanto il servizio di avvio in `/vendor/etc/init`; gli aggiornamenti successivi mantengono questa disposizione verificata. Il programma si ferma prima di sostituire l'app quando non può stabilire la capacità di memoria, chi controlla l'avvio o lo stato di una transazione esistente.

L'app contiene l'helper corrispondente come alternativa. Se un pannello con installazione `su` diretta viene aggiornato dalla scheda Installa o dall'entità di aggiornamento Home Assistant prima di essere passato di nuovo dal programma di installazione, il primo avvio dell'app controlla il protocollo dell'helper necessario e può avviare una copia di proprietà root da `/data/local`. Un pannello con root che isola root non può consentire in sicurezza a un vecchio helper di sostituire sé stesso: si blocca quindi in sicurezza e chiede di eseguire il programma di installazione autenticato da un computer.

## Cosa può fermare un'esecuzione

Il programma si ferma con un risultato diverso da zero quando non può stabilire in sicurezza qualcosa di necessario per l'operazione richiesta. Esempi sono una richiesta sui pacchetti senza risposta, un'app con pacchetto o firmatario errato, una transazione dell'helper non recuperabile, un'esportazione della configurazione richiesta che non può essere verificata o un autocontrollo obbligatorio dopo l'installazione che fallisce.

Altri risultati sono avvisi, perché fermarsi renderebbe più difficile il recupero. Un backup automatico del database non disponibile, un avviso sullo stato della memoria o una richiesta di stato fallita prima dell'aggiornamento non impediscono da soli una normale sostituzione dell'app sul posto. Il programma dichiara chiaramente questo limite anziché presentare un file di recupero parziale o non valido come un successo.

### Interpretare un rifiuto

Ogni rifiuto indica una condizione e non modifica nulla sul pannello salvo dichiarare il contrario. Il testo mira a indicare cosa riparare, perché i rimedi differiscono nettamente.

- **Il database canonico continuava a cambiare durante la lettura.** L'app del pannello scriveva ancora nel database mentre il programma cercava di acquisire una copia coerente. Il pannello è occupato, non danneggiato. La copia viene ritentata automaticamente, quindi questo messaggio significa che l'app ha continuato a scrivere durante tutti i tentativi; di solito basta rieseguire il programma quando il pannello è meno occupato.
- **Il database canonico non poteva essere letto**, oppure **non è un file regolare.** È il caso opposto e riguarda i dati memorizzati anziché l'app: il file manca, non è un file o non può essere aperto. Recupera il database prima di riprovare.
- **Il database canonico manca mentre l'app è installata.** L'app è presente ma il suo archivio no: un aggiornamento ordinario non può risolverlo. Ripristina un backup anziché riprovare.
- **La destinazione di installazione è di sola lettura.** La directory in cui viene installato l'helper privilegiato si trova su un filesystem montato in sola lettura. Rimontarlo in scrittura non richiede un riavvio sulla maggior parte dei pannelli. Il programma riporta il filesystem misurato: controlla quella riga prima di presumere quale partizione sia coinvolta.
- **La destinazione di installazione non ha spazio o inode liberi.** Entrambi i messaggi riportano le misurazioni e distinguono le due condizioni perché un pannello può esaurirne una pur avendo abbondanza dell'altra.
- **Un aggiornamento precedente incompleto non poteva essere riconciliato.** Una precedente esecuzione ha lasciato un record di recupero che il programma non riesce a conciliare con ciò che è ora installato. Non viene modificato nulla. Occorre esaminare il record di recupero anziché riprovare, perché un nuovo tentativo arriverebbe alla stessa conclusione.
- **L'app è ancora installata dopo un certo tempo dal provisioning della successiva.** La nuova app è stata installata ma la vecchia non è stata rimossa entro il tempo di attesa del programma. Il pannello funziona; è la rimozione a non essere stata completata.

Un rifiuto che cita un rollback dichiara se è stato verificato. «Rollback eseguito e verificato» significa che il pannello è com'era prima dell'esecuzione. «Impossibile verificare il rollback» significa che occorre controllare l'helper privilegiato prima di affidarsi alle operazioni privilegiate, anche se l'app stessa non è stata sostituita.
