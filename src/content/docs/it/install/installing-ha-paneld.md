---
title: Aggiungi un pannello
description: Aggiungere un pannello da Home Assistant, tramite la rete o un cavo USB.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

L'aggiunta di un pannello si esegue da Home Assistant, senza riga di comando. Ci sono due percorsi, ed entrambi terminano con il pannello che appare come dispositivo.

Qualunque percorso tu scelga, segui prima [Prepara il pannello](/it/install/prepare-a-panel/).

## Tramite la rete

Per un pannello già presente sulla tua rete. Vai in **Impostazioni**, **Dispositivi e servizi**, aggiungi **Panel Assistant** e inserisci l'indirizzo del pannello. L'integrazione controlla cosa è presente sul pannello, ti chiede di approvare una richiesta di debug sullo schermo del pannello stesso se necessario, chiede conferma dell'installazione, installa l'app del pannello, la avvia e solo allora crea il dispositivo. Se il pannello esegue già l'app, la adotta invece di reinstallarla, ed è più veloce.

## Tramite USB

Per un pannello ancora nella scatola, o il cui software del produttore rende difficile l'accesso tramite rete. Collegalo al portatile e installa dal browser tramite il cavo USB. Il browser rimane connesso a Home Assistant, che fornisce la versione verificata; il pannello non necessita di ADB di rete. Avvia da **Impostazioni**, **Dispositivi e servizi**, **Aggiungi integrazione**, **Panel Assistant**, **Installa tramite USB su questo computer**; serve un browser basato su Chromium. Vedi [Installa tramite USB](/it/install/install-over-usb/).

Nella versione 1.0.0-rc2 non ancora rilasciata, entrambi i programmi di installazione possono anche richiedere un aggiornamento verificato e compatibile del motore del browser sui pannelli supportati. Un aggiornamento che non riesce a completarsi non impedisce la configurazione o l'associazione; per il ripristino, vedi [Prepara il pannello](/it/install/prepare-a-panel/).

## Cosa protegge il programma di installazione

Entrambi i percorsi controllano il pannello prima di modificare qualsiasi cosa. Il percorso di rete adotta un'app esistente invece di reinstallarla. USB non sovrascrive un'installazione esistente diversa; se è già installata esattamente la build selezionata, ne completa la configurazione. Un'installazione USB interrotta può essere ritentata con la stessa versione, controllando cosa è stato completato prima di proseguire. Per i backup prima di un aggiornamento dell'app, vedi [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/).

## Dopo l'installazione

Il pannello appare come dispositivo con un sensore di stato e diagnostica, e nella pagina Panel Assistant nella barra laterale. Poi completi la procedura guidata di configurazione del pannello, assegnandogli un nome e scegliendo la sua plancia. Finché la configurazione non è terminata, lo schermo del pannello mostra un codice QR e un pulsante **Configura**, così puoi completarla anche da un telefono o dal pannello stesso. Per cambiare plancia in seguito, apri la pagina del dispositivo del pannello in Home Assistant e seleziona **Visita**. Se apri direttamente l'indirizzo del pannello, usa la porta HTTP indicata; quella predefinita è 8888.

Prosegui con [Connetti un pannello](/it/home-assistant/connect-a-panel/).
