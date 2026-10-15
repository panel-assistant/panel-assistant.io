---
title: Installare tramite USB
description: Metti in funzione un pannello nuovo dal browser con un cavo USB, prima di montarlo a parete.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

L'installazione via USB è pensata per un pannello ancora nella scatola o il cui software del produttore rende difficile l'accesso alla rete. Collega il pannello al computer che stai usando e il browser installa l'app del pannello direttamente attraverso il cavo. Il pannello non necessita di ADB di rete. Il browser deve rimanere connesso a Home Assistant, che fornisce la versione verificata. La maggior parte delle persone usa questa procedura una sola volta, prima di montare il pannello.

## Si comincia dentro Home Assistant

Un amministratore apre l'installatore USB dalla pagina di Panel Assistant nella barra laterale di Home Assistant. Home Assistant verifica la versione rilasciata e la passa all'installatore, che si apre in una propria finestra sicura. Per questo non c'è un pulsante di installazione su questo sito: la pagina che esegue l'installazione accetta soltanto una versione rilasciata proveniente dal tuo Home Assistant, quindi sul pannello non arriva nulla che Home Assistant non abbia verificato.

## Cosa serve

- L'[integrazione](/it/home-assistant/custom-integration/) installata e un account amministratore.
- Un browser basato su Chromium, come Chrome o Edge. Firefox e Safari non possono comunicare con i dispositivi USB.
- Un cavo USB dal pannello al computer o al telefono su cui è in esecuzione quel browser. Non al server Home Assistant.
- Il debug USB attivato nelle opzioni sviluppatore del pannello e qualcuno davanti al pannello che approvi la richiesta di autorizzazione quando appare. Le [pagine sull'hardware](/it/hardware/) mostrano come accedere alle opzioni sviluppatore su ciascun modello.

## Come funziona

1. Scegli una versione nella pagina di Panel Assistant. Home Assistant offre le versioni compatibili più recenti che riesce a verificare. Le versioni di prova sono contrassegnate e vengono offerte quando l'integrazione in esecuzione le consente.
2. La finestra dell'installatore verifica la versione rilasciata e ti chiede di selezionare il pannello nella finestra di selezione USB del browser.
3. Approva la richiesta di debug USB sullo schermo del pannello.
4. Conferma. Nulla cambia sul pannello finché non lo fai. Il programma di installazione si rifiuta di sovrascrivere un'installazione esistente diversa; se la build esatta selezionata è già installata, ne completa la configurazione.
5. Mantieni il cavo collegato e la scheda connessa fino a quando l'installatore segnala il completamento, poi termina la configurazione guidata sul pannello stesso.

Se il cavo si scollega o la finestra si chiude durante l'operazione, ricollega il cavo, trasferisci di nuovo la stessa versione rilasciata da Home Assistant e riconnetti lo stesso pannello. L'installatore conserva i progressi nel browser, controlla ogni passaggio interrotto prima di fare qualsiasi altra cosa e riprende da lì invece di ricominciare da capo.

## Dopo l'installazione

Il pannello sta eseguendo l'app e il programma di installazione prova ad aggiungerlo automaticamente a Home Assistant. Se Home Assistant non è riuscito a raggiungerlo, aggiungilo quando il pannello sarà sulla rete di Home Assistant. Il programma di installazione USB non aggiorna un pannello su cui l'app è già presente; per questo, vedi [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/).
