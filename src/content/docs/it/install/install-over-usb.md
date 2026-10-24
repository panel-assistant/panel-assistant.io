---
title: Installare tramite USB
description: Metti in funzione un pannello nuovo dal browser con un cavo USB, prima di montarlo a parete.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

L'installazione via USB è pensata per un pannello ancora nella scatola o il cui software del produttore rende difficile l'accesso alla rete. Collega il pannello al computer che stai usando e il browser installa l'app del pannello direttamente attraverso il cavo. Il pannello non necessita di ADB di rete. Il browser deve rimanere connesso a Home Assistant, che fornisce la versione verificata. La maggior parte delle persone usa questa procedura una sola volta, prima di montare il pannello.

## Si comincia dentro Home Assistant

Il programma di installazione USB viene avviato da un amministratore da Home Assistant: vai su **Impostazioni**, **Dispositivi e servizi**, **Aggiungi integrazione**, scegli **Panel Assistant**, poi **Installa tramite USB su questo computer**. Il link **Aggiungi pannello** nella pagina Panel Assistant della barra laterale apre la stessa scelta. Home Assistant verifica la versione rilasciata e la passa all’installatore, che si apre in una propria finestra sicura. Per questo non c'è un pulsante di installazione su questo sito: la pagina che esegue l'installazione accetta soltanto una versione rilasciata proveniente dal tuo Home Assistant, quindi sul pannello non arriva nulla che Home Assistant non abbia verificato.

## Cosa serve

- L'[integrazione](/it/home-assistant/custom-integration/) installata e un account amministratore.
- Un browser basato su Chromium, come Chrome o Edge. Firefox e Safari non possono comunicare con i dispositivi USB.
- Un cavo USB dal pannello al computer o al telefono su cui è in esecuzione quel browser. Non al server Home Assistant.
- Il debug USB attivato nelle opzioni sviluppatore del pannello. Se il pannello mostra una richiesta di autorizzazione quando lo colleghi, qualcuno davanti al pannello deve accettarla; alcuni pannelli non la mostrano mai. Le [pagine sull'hardware](/it/hardware/) mostrano come accedere alle opzioni sviluppatore su ciascun modello.

## Come funziona

1. Seleziona **Apri il programma di installazione USB**. Nella pagina che si apre, mantieni la versione consigliata e premi **Continua**. Home Assistant offre le versioni compatibili più recenti che riesce a verificare. Le versioni di prova sono contrassegnate e vengono offerte quando l'integrazione in esecuzione le consente.
2. Il programma di installazione si apre in una nuova finestra e verifica la versione rilasciata. Premi **Trova il mio pannello** e scegli il pannello nell’elenco del browser.
3. Se il pannello chiede di consentire il debug USB, seleziona **Consenti sempre da questo computer** e approva sullo schermo del pannello. Alcuni pannelli non lo chiedono e il programma di installazione prosegue direttamente.
4. Conferma. Nulla cambia sul pannello finché non lo fai. Il programma di installazione si rifiuta di sovrascrivere un'installazione esistente diversa; se la build esatta selezionata è già installata, ne completa la configurazione.
5. Mantieni il cavo e la finestra collegati fino a quando l’installatore segnala il completamento. La stessa finestra passa poi alla procedura guidata di configurazione del pannello, dove completi la configurazione. La procedura guidata è fornita dal pannello, quindi il computer deve trovarsi sulla sua stessa rete.

Se il cavo si scollega durante l’operazione, ricollegalo, attendi che il pannello si avvii, premi il pulsante nella schermata di errore del programma di installazione e poi **Trova il mio pannello**. Se la finestra del programma di installazione è stata chiusa, ricomincia da Home Assistant e scegli la stessa versione. In entrambi i casi, l’installatore conserva i progressi nel browser, controlla ogni passaggio interrotto prima di fare qualsiasi altra cosa e riprende da lì invece di ricominciare da capo.

## Dopo l'installazione

Il pannello sta eseguendo l’app. Un pannello appena tolto dalla scatola non è ancora sulla tua rete: collegalo al Wi-Fi nell’app Impostazioni del pannello, prima o dopo l’installazione, perché sia la procedura guidata di configurazione sia la connessione a Home Assistant ne hanno bisogno. Se il pannello non appare in Home Assistant dopo aver completato la configurazione, vai su **Impostazioni**, **Dispositivi e servizi**, **Aggiungi integrazione**, scegli **Panel Assistant**, poi **Aggiungi un pannello della tua rete** e inserisci l’indirizzo del pannello. Il programma di installazione USB non aggiorna un pannello su cui l'app è già presente; per questo, vedi [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/).
