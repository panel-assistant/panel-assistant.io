---
title: Problemi noti
description: Limitazioni note di Panel Assistant e della corrispondente app del pannello, e come affrontarle.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Questa pagina elenca le limitazioni note e come affrontarle. Segnala qualsiasi altro problema nel [registro delle segnalazioni](https://github.com/panel-assistant/ha-integration/issues), indicando il modello del pannello e cosa hai osservato.

## La voce è attiva all'avvio quando il profilo del dispositivo dichiara un microfono

La voce è attiva per impostazione predefinita quando il profilo del dispositivo del pannello dichiara un microfono, a meno che tu non l'abbia già disattivata. Se non vuoi che il pannello ascolti una parola di attivazione, disattiva **Assistente vocale** sotto **Voce** nella pagina **Configura** del pannello.

## Un PIN di blocco schermo potrebbe essere necessario dopo lo spegnimento completo dello schermo

Sui pannelli il cui percorso di spegnimento dello schermo usa il timeout dello schermo di Android o l'amministrazione del dispositivo, un PIN di blocco schermo configurato potrebbe essere richiesto al risveglio dello schermo. Rimuovi il PIN se il pannello deve tornare direttamente alla propria plancia.

## Due entità sono state rimosse

L'entità immagine separata per le istantanee della fotocamera è stata rimossa; usa l'entità fotocamera del pannello. Su un pannello con altoparlante, il numero separato del volume è stato rimosso; usa il volume del lettore multimediale con `media_player.volume_set`. Una Riparazione elenca le automazioni e gli script che usano ancora il numero del volume. Non esiste una Riparazione corrispondente per l'immagine istantanea rimossa: controllane quindi autonomamente gli utilizzi.

## Ripristinare un backup su un pannello senza root può saltare alcune impostazioni

Un backup delle impostazioni creato su un pannello con root può contenere impostazioni che un pannello senza root non può applicare. Il ripristino elenca le impostazioni non disponibili che salta e applica quelle supportate. Controlla il risultato del ripristino per individuare impostazioni saltate o errori.
