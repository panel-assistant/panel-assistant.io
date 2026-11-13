---
title: Prepara il pannello
description: Cosa serve a un pannello prima che Panel Assistant possa installarsi, e l'aggiornamento WebView che determina se la prima plancia viene visualizzata correttamente.
sourceCommit: 909b9380c8cfacc743c099e74e56e8ef2524d3b8
---

Una condizione deve essere soddisfatta prima di aggiungere un pannello, e una seconda determina se la prima plancia viene visualizzata correttamente. Il percorso dipende dal modello e dal firmware.

## 1. Opzioni sviluppatore e debug sono attivi

Il programma di installazione comunica con il pannello tramite l'interfaccia di debug di Android, che i produttori possono disabilitare o limitare. Si attiva sul pannello stesso, nelle sue Impostazioni; non occorre installare nulla sul computer. Sulla maggior parte dei pannelli, apri **Impostazioni**, poi **Informazioni**, e tocca **Numero build** sette volte finché il pannello non indica che sei uno sviluppatore; **Opzioni sviluppatore** appare quindi nelle Impostazioni. Alcuni produttori nascondono o rinominano queste voci: le [pagine hardware](/it/hardware/) indicano i passaggi noti e segnalano le procedure non verificate. Nelle opzioni sviluppatore, attiva **Debug USB** per il [percorso USB](/it/install/install-over-usb/), oppure **ADB di rete sulla porta TCP 5555** per il percorso di rete. Non tutti i pannelli hanno un interruttore per ADB di rete; la pagina hardware del tuo modello indica se è presente e, se non lo è, usa il percorso USB una volta disponibile il debug USB. Se anche l’accesso USB non è verificato, chiedi al fornitore le istruzioni per il tuo modello e firmware prima di scegliere un programma di installazione. L’accesso root è una questione separata e Panel Assistant non ne ha bisogno per l’installazione. La funzione Debug wireless di Android con associazione è un metodo di connessione diverso e non è supportata da questo programma di installazione.

Se il pannello chiede di autorizzare la connessione, qualcuno deve accettare la richiesta sullo schermo del pannello stesso; non può essere accettata da remoto.

Il pannello non necessita di un indirizzo fisso: Panel Assistant segue il pannello quando cambia indirizzo.

## 2. Il WebView di sistema è aggiornato

La plancia viene disegnata dal WebView di sistema del pannello, chiamato anche motore del browser. Un WebView vecchio può lasciare la plancia vuota o disegnata solo in parte.

Sia il programma di installazione di rete sia quello USB possono richiedere un aggiornamento verificato e compatibile del motore del browser sui pannelli supportati. Se l'aggiornamento non riesce a completarsi, la configurazione e l'associazione rimangono disponibili. Un tentativo incompleto può essere proseguito dalla Riparazione relativa all'aggiornamento del pannello in Home Assistant: scegli **Riprova**. Controlla il lavoro esistente prima di richiedere un nuovo tentativo; gli aggiornamenti non riusciti non vengono ritentati in modo pianificato.

La procedura guidata avvisa quando il motore del browser integrato è troppo vecchio. Puoi completare la configurazione e l'associazione, ma la plancia potrebbe comunque non essere visualizzata. Se il pannello non riesce a installare l'aggiornamento, segui [Aggiornare il WebView di sistema](/it/hardware/guides/update-the-webview/).

## Prima di modificare qualcosa di irreversibile

Panel Assistant non esegue di per sé il flashing né ottiene il root. Su alcuni pannelli è possibile ottenere il root o eseguire il flashing manualmente; alcune di queste operazioni sono recuperabili e altre no. Se intendi seguire quel percorso, leggi prima [Backup e ripristino del firmware](/it/hardware/guides/firmware-backup-and-restore/) e consulta [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/) per sapere cosa può essere salvato in un backup e cosa no.
