---
title: Installare tramite USB
description: Metti in funzione un pannello nuovo dal browser con un cavo USB, prima di montarlo a parete.
sourceCommit: ddee491d1892568fda8e9bb47f003b2333e3b666
---

L'installazione tramite USB è pensata per un pannello ancora nella confezione, oppure per uno il cui software del produttore rende difficile l'accesso tramite rete. Collega il pannello al computer che stai usando: il browser installa l'app del pannello direttamente attraverso il cavo. Non viene trasmesso nulla sulla tua rete e il server Home Assistant non ha mai bisogno di vedere il pannello. La maggior parte delle persone usa questo metodo una sola volta, prima di montare il pannello.

## Si comincia dentro Home Assistant

Un amministratore apre l'installatore USB dalla pagina di Panel Assistant nella barra laterale di Home Assistant. Home Assistant verifica la versione rilasciata e la passa all'installatore, che si apre in una propria finestra sicura. Per questo non c'è un pulsante di installazione su questo sito: la pagina che esegue l'installazione accetta soltanto una versione rilasciata proveniente dal tuo Home Assistant, quindi sul pannello non arriva nulla che Home Assistant non abbia verificato.

## Cosa serve

- L'[integrazione](/it/home-assistant/custom-integration/) installata e un account amministratore.
- Un browser basato su Chromium, come Chrome o Edge. Firefox e Safari non possono comunicare con i dispositivi USB.
- Un cavo USB dal pannello al computer o al telefono su cui è in esecuzione quel browser. Non al server Home Assistant.
- Il debug USB attivato nelle opzioni sviluppatore del pannello e qualcuno davanti al pannello che approvi la richiesta di autorizzazione quando appare. Le [pagine sull'hardware](/it/hardware/) mostrano come accedere alle opzioni sviluppatore su ciascun modello.

## Come funziona

1. Scegli una versione nella pagina di Panel Assistant. Sono elencate soltanto le versioni rilasciate di ha-paneld che Home Assistant può verificare per l'installazione: l'ultima versione stabile, insieme alle eventuali versioni candidate recenti, indicate come versioni di prova.
2. La finestra dell'installatore verifica la versione rilasciata e ti chiede di selezionare il pannello nella finestra di selezione USB del browser.
3. Approva la richiesta di debug USB sullo schermo del pannello.
4. Conferma. Nulla cambia sul pannello finché non confermi, e l'installatore verifica prima che il pannello sia davvero privo di un'installazione precedente: rifiuta di installare sopra un'installazione esistente per non mettere a rischio i dati del pannello.
5. Mantieni il cavo collegato e la scheda connessa fino a quando l'installatore segnala il completamento, poi termina la configurazione guidata sul pannello stesso.

Se il cavo si scollega o la finestra si chiude durante l'operazione, ricollega il cavo, trasferisci di nuovo la stessa versione rilasciata da Home Assistant e riconnetti lo stesso pannello. L'installatore conserva i progressi nel browser, controlla ogni passaggio interrotto prima di fare qualsiasi altra cosa e riprende da lì invece di ricominciare da capo.

## Dopo l'installazione

L'app è in esecuzione sul pannello, che è pronto per essere aggiunto a Home Assistant come dispositivo. L'installatore USB non aggiorna un pannello su cui l'app è già presente; per questo, consulta [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/).
