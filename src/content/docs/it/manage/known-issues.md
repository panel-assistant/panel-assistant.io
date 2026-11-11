---
title: Problemi noti in 1.0.2
description: Limitazioni note di Panel Assistant 1.0.2 e della corrispondente app del pannello, e come affrontarle.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0.2 e la corrispondente app del pannello sono versioni stabili. Questa pagina elenca le limitazioni note e come affrontarle. Leggi prima [Aggiornare alla versione 1.0](/it/manage/upgrade-to-1-0/): spiega quali condizioni devono essere soddisfatte prima di installare e perché un pannello con la versione 1.0 non può tornare alla 0.9. Segnala qualsiasi altro problema nel [registro delle segnalazioni](https://github.com/panel-assistant/ha-integration/issues), indicando il modello del pannello e cosa hai osservato.

## Un pannello ancora con l'app 0.9 potrebbe richiedere il ripristino della connessione ADB

La Riparazione che indica che un pannello necessita dell'app 1.0 significa che la sua app non può ancora comunicare con Panel Assistant 1.0. Se Home Assistant indica anche che il pannello non può ricevere aggiornamenti dell'app, segui quella Riparazione per ripristinare il percorso di aggiornamento. Per un pannello con il debug di rete disattivato, collegalo al computer e avvia il programma di installazione USB da Home Assistant, come descritto in [Un pannello che non può essere aggiornato](/it/manage/updates-and-recovery/#un-pannello-che-non-può-essere-aggiornato). Su un pannello che ha già l'app, il programma di installazione USB può riconnetterlo senza reinstallarlo: se richiesto, seleziona **Consenti sempre da questo computer** e tocca **Consenti** sul pannello. Il programma di installazione riattiva il debug di rete, così Home Assistant può aggiornare l'app.

## La barra laterale non può aprire un pannello finché non esegue l'app 1.0

Nella versione 1.0, la barra laterale Panel Assistant mostra le pagine di un pannello tramite la connessione del pannello stesso a Home Assistant. Un pannello ancora con l'app 0.9 non può aprirvi le proprie pagine. Aggiorna prima l'app del pannello.

## La voce è attiva all'avvio quando il profilo del dispositivo dichiara un microfono

La voce è attiva per impostazione predefinita quando il profilo del dispositivo del pannello dichiara un microfono, a meno che tu non l'abbia già disattivata. Se non vuoi che il pannello ascolti una parola di attivazione, disattiva **Assistente vocale** sotto **Voce** nella pagina **Configura** del pannello.

## Un PIN di blocco schermo potrebbe essere necessario dopo lo spegnimento completo dello schermo

Sui pannelli il cui percorso di spegnimento dello schermo usa il timeout dello schermo di Android o l'amministrazione del dispositivo, un PIN di blocco schermo configurato potrebbe essere richiesto al risveglio dello schermo. Rimuovi il PIN se il pannello deve tornare direttamente alla propria plancia.

## Due entità sono state rimosse

L'entità immagine separata per le istantanee della fotocamera è stata rimossa; usa l'entità fotocamera del pannello. Su un pannello con altoparlante, il numero separato del volume è stato rimosso; usa il volume del lettore multimediale con `media_player.volume_set`. Una Riparazione elenca le automazioni e gli script che usano ancora il numero del volume. Non esiste una Riparazione corrispondente per l'immagine istantanea rimossa: controllane quindi autonomamente gli utilizzi.

## Ripristinare un backup su un pannello senza root può saltare alcune impostazioni

Un backup delle impostazioni creato su un pannello con root può contenere impostazioni che un pannello senza root non può applicare. Il ripristino elenca le impostazioni non disponibili che salta e applica quelle supportate. Controlla il risultato del ripristino per individuare impostazioni saltate o errori.
