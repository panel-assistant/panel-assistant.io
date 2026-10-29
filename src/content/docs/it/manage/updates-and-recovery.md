---
title: Aggiornamenti e ripristino
description: Mantenere aggiornata l'app su un pannello e cosa è possibile ripristinare quando qualcosa va storto.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

## Aggiornare un pannello

**Da Home Assistant.** Ogni pannello ha un'entità di aggiornamento. Quando viene pubblicata una versione più recente, l'entità la propone e basta premere un pulsante per installarla; Panel Assistant installa l'aggiornamento e conferma che il pannello sia tornato a funzionare correttamente. Questa è la procedura da usare.

Un aggiornamento inizia quando Panel Assistant o tu lo richiedete esplicitamente. L'app del pannello non installa aggiornamenti pianificati. La scheda **Installa** della sua interfaccia web permette anche di scegliere e installare una versione dell'app del pannello, inclusa una versione preliminare. La scelta si applica all'installazione che avvii; non esiste un canale di aggiornamento salvato.

Nella versione 1.0.0-rc2 non ancora rilasciata, un aggiornamento dell'app del pannello avviato da Home Assistant può anche installare un System WebView verificato e compatibile sui pannelli supportati. Se la fase relativa al motore del browser rimane incompleta, usa l'azione **Riprova** della Riparazione relativa all'aggiornamento. Controlla il lavoro esistente prima di richiedere un nuovo tentativo; non esiste alcun tentativo pianificato. Gli altri pannelli necessitano ancora del Play Store, del firmware del produttore o del percorso manuale descritto in [Aggiornare il WebView di sistema](/it/hardware/guides/update-the-webview/).

In quella versione, un pannello con root supportato può mantenere ADB di rete disattivato mentre Panel Assistant lo gestisce tramite la connessione autenticata dell'app. Gli aggiornamenti dell'app e la manutenzione supportata usano quella connessione e il programma di installazione privilegiato del pannello. Il servizio di ripristino locale può riaprire ADB di rete se la connessione dell'app smette di essere rinnovata o il ripristino lo richiede.

### Pannelli che necessitano di ADB

Quando installi un aggiornamento da Home Assistant, Panel Assistant usa automaticamente ADB per i pannelli che non possono installare l'aggiornamento da soli. Se il pannello accetta la connessione senza un tocco sullo schermo, il tuo consenso iniziale a installare Panel Assistant comprende anche la creazione e la memorizzazione di una chiave ADB per gli aggiornamenti futuri. Se il pannello richiede l'approvazione sul suo schermo, Home Assistant crea una Riparazione che indica il pannello e avvia l'autorizzazione. Segui la Riparazione per approvare la richiesta su quel pannello.

### Un pannello che non può essere aggiornato

Alcuni pannelli possono essere aggiornati solo tramite ADB, perché non hanno modo di installare un'app da soli. Su questi pannelli, ADB non è una comodità: è l'unica via per aggiornarli e, se smette di funzionare, il pannello continua a funzionare normalmente rimanendo silenziosamente alla versione attuale. Quando accade, Home Assistant mostra una Riparazione che indica il pannello.

La causa abituale è una modifica effettuata sul pannello, anziché in Home Assistant. Un aggiornamento del firmware del produttore, un ripristino alle impostazioni di fabbrica o un'opzione del produttore che ripristina il software originale possono tutti disattivare le opzioni sviluppatore di Android, disattivando così anche ADB. Nulla ti avvisa in quel momento, perché dal punto di vista del pannello non c'è alcun problema.

Riattivare le opzioni sviluppatore e il debug USB ripristina la possibilità di aggiornamento sulla maggior parte dei pannelli e i passaggi sono gli stessi usati durante la preparazione iniziale del pannello: vedi [prepara un pannello](/it/install/prepare-a-panel/#1-opzioni-sviluppatore-e-debug-sono-attivi). I pannelli differiscono nel modo di raggiungere queste impostazioni e alcuni produttori le nascondono dietro una sequenza di tocchi in una schermata Informazioni.

Se la Riparazione rimane, o il pannello disattiva autonomamente il debug di rete, come un Meta Portal dopo un riavvio o un Shelly Wall Display dopo un ripristino, collega il pannello al computer tramite USB e avvia il programma di installazione USB da Home Assistant, come descritto in [installare tramite USB](/it/install/install-over-usb/#si-comincia-dentro-home-assistant). Non occorre rimuovere nulla: su un pannello che ha già l’app, il programma di installazione non installa nulla. Se il pannello lo chiede, seleziona **Consenti sempre da questo computer** e tocca **Consenti**; il programma di installazione riattiva quindi il debug di rete e indica che Panel Assistant può nuovamente raggiungere il pannello. Da lì Home Assistant propone l’aggiornamento del pannello, che conserva impostazioni e cronologia.

Se Home Assistant mostra anche **Consenti aggiornamenti su …** per il pannello, questo è raggiungibile ma non ha ancora accettato questo Home Assistant. Apri quella Riparazione, oppure vai su **Impostazioni**, **Dispositivi e servizi**, **Panel Assistant**, seleziona **Configura** per il pannello e scegli **Consenti aggiornamenti**, poi tocca **Consenti** sul pannello quando lo chiede.

## Cosa protegge un aggiornamento

Panel Assistant controlla il pannello prima di modificare qualsiasi cosa ed esegue il backup delle sue impostazioni prima di ogni aggiornamento, conservando gli ultimi cinque backup per ciascun pannello.

Prima di una modifica di cui non sei sicuro, crea tu stesso un backup: nell'interfaccia web del pannello apri **Installa**, poi **Backup**, e conserva il file `.hpb` scaricato.

## Ripristino

Una plancia che non si carica dopo un aggiornamento dipende solitamente dalla WebView di sistema o dalla plancia stessa e il pannello ha un proprio comportamento di [avvio e ripristino](/it/manage/built-in-renderer/#avvio-e-recupero) per questo caso. [Risoluzione dei problemi](/it/manage/troubleshooting/) descrive le cause abituali. Un pannello con l’app 1.0 non può tornare a una versione precedente; [passare alla versione 1.0](/it/manage/upgrade-to-1-0/#tornare-indietro) spiega cosa è possibile fare.

Il ripristino a un livello inferiore all'app è un'altra questione. Panel Assistant non interviene mai sul firmware di un pannello, ma su alcuni pannelli con root è possibile eseguire manualmente il backup e il ripristino delle partizioni del firmware, come descritto in [backup e ripristino del firmware](/it/hardware/guides/firmware-backup-and-restore/).

:::danger
Il ripristino del firmware è sperimentale e non è stato testato su un dispositivo reso inutilizzabile. Considera il lavoro sulle partizioni di un pannello come qualcosa che può renderlo inutilizzabile e leggi quel documento per intero prima di iniziare.
:::
