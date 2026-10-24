---
title: Risoluzione dei problemi
description: I problemi più comuni di un pannello a parete e dove cercare per prima cosa.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Inizia dal dispositivo del pannello in Home Assistant, che ha un sensore di stato e consente di scaricare la diagnostica, e dalla pagina di stato del pannello al suo indirizzo sulla porta 8888, il cui rapporto `/diag` risponde alla maggior parte delle domande qui sotto senza dover fare supposizioni.

Quando devi vedere cosa sta facendo il pannello in tempo reale, la scheda **Registri** di quella pagina trasmette in diretta il registro dell'app del pannello, con token e password oscurati.

![La scheda Registri dell'interfaccia web del pannello, che trasmette in diretta il registro dell'app del pannello con una casella di filtro e i comandi Segui e Pausa](/screenshots/ui-logs-dark.png)

## La plancia è vuota, disegnata solo in parte o piena di errori degli script

Controlla prima la WebView di sistema. È di gran lunga il problema più comune al primo avvio e una WebView vecchia produce esattamente questi sintomi, che sembrano un guasto dell'app del pannello. La procedura è in [Aggiornamento della WebView di sistema](/it/hardware/guides/update-the-webview/).

Se la WebView è aggiornata, la sezione [avvio e ripristino](/it/manage/built-in-renderer/#startup-and-recovery) spiega cosa fa il pannello quando una plancia non si carica e come scoprirne il motivo.

## La plancia è lenta

In parte dipende dal pannello e in parte dalla plancia. [Prestazioni](/it/manage/performance/) spiega cosa può misurare la pagina di stato del pannello e cosa tende ad aiutare, mentre il [riferimento hardware](/it/hardware/) classifica i pannelli supportati per capire se stai chiedendo troppo all'hardware.

## Il programma di installazione non riesce a raggiungere il pannello

Via rete: conferma l'indirizzo del pannello e che ADB di rete sulla porta TCP 5555 sia ancora attivo, perché alcuni pannelli lo disattivano dopo un riavvio. Se il pannello mostra una richiesta di autorizzazione, accettala sul suo schermo. Via USB: assicurati di usare un browser basato su Chromium, che il cavo sia collegato al computer su cui è in esecuzione il browser e che il debug USB sia attivo. Il modo per raggiungere le opzioni sviluppatore e attivare il debug varia a seconda del modello ed è descritto in [Prepara il pannello](/it/install/prepare-a-panel/) e nelle [pagine hardware](/it/hardware/). Se il pannello non accetta proprio una connessione di rete, [installa via USB](/it/install/install-over-usb/): il pannello non necessita di ADB di rete, mentre il browser rimane connesso a Home Assistant per ottenere la versione verificata.

## Un’installazione di rete si è interrotta

Quando Home Assistant interrompe un’installazione di rete, il messaggio indica fino a che punto è arrivata. Trova qui sotto la frase che corrisponde al tuo caso. In ogni caso, non disinstallare Panel Assistant, non cancellarne i dati e non ripristinare il pannello: lo stato del pannello permette di capire dove si è fermata l’installazione.

### Nessun APK è stato installato

Se il messaggio dice che non è stato installato alcun APK o che non è stata apportata alcuna modifica al pannello, l’installazione si è fermata prima di cambiare qualcosa. Controlla che il pannello sia acceso e connesso alla tua rete allo stesso indirizzo, poi aggiungi nuovamente l’integrazione Panel Assistant e inserisci lo stesso indirizzo. Home Assistant controlla nuovamente il pannello prima di modificare qualsiasi cosa. Se l’installazione si ferma nello stesso punto una seconda volta, guarda il pannello e segui la sezione successiva se Panel Assistant è presente.

### Installato ma non avviato o verificato

Se il messaggio dice che l’APK è installato ma Panel Assistant non si è avviato o non ha superato il controllo, l’app è sul pannello e manca solo l’ultimo passaggio. Apri Panel Assistant dall’elenco delle app del pannello e attendi la schermata di configurazione. Poi aggiungi nuovamente l’integrazione Panel Assistant con lo stesso indirizzo: quando l’app risponde, Home Assistant propone di connetterla ("Panel Assistant è installato ma non connesso") e non installa nulla. Se Home Assistant dice che l’app installata non è la versione che hai scelto, scegli la versione installata, che trovi nelle Impostazioni Android del pannello in App › Panel Assistant. Se Panel Assistant non si apre o la schermata di configurazione non appare mai, non riprovare l’installazione automatica: chiedi aiuto come descritto nella sezione successiva.

### L’installazione potrebbe aver modificato il pannello

Se il messaggio dice che l’installazione potrebbe aver modificato il pannello, che Home Assistant non ha potuto verificare il risultato o che non può accertare che sia sicuro continuare, Home Assistant non ha potuto stabilire fino a che punto è arrivato il pannello, quindi si ferma anziché fare supposizioni. Non riprovare ancora l’installazione automatica. Guarda prima il pannello: se appare la schermata di configurazione o la plancia di Panel Assistant, oppure se l’app si apre dall’elenco delle app del pannello, segui la sezione precedente per connetterla. Se Panel Assistant non è sul pannello, chiedi nelle [segnalazioni dell’integrazione](https://github.com/panel-assistant/ha-integration/issues) e includi il modello del pannello, la versione che hai scelto, il messaggio completo e le righe del registro di Home Assistant relative all’installazione (cerca `panel_assistant` nel registro).

## L'hardware del pannello non appare in Home Assistant

Se alcune entità appaiono e altre no, di solito la causa è il profilo hardware del modello, anziché un problema di connessione. Le [pagine hardware](/it/hardware/) indicano cosa espone ciascun pannello.

## Un altro problema

Se la risposta non si trova in questo sito o nella documentazione di riferimento a cui rimanda, chiedi nelle [segnalazioni dell'integrazione](https://github.com/panel-assistant/ha-integration/issues) o, per qualsiasi questione relativa all'app del pannello, nelle [segnalazioni di ha-paneld](https://github.com/panel-assistant/android/issues). Includi il modello del pannello, la versione riportata nella pagina del dispositivo del pannello e il file di diagnostica scaricato, perché qualsiasi risposta partirà da questi tre elementi. La diagnostica è già oscurata, ma leggila per intero prima di pubblicarla e rimuovi qualsiasi informazione residua che identifichi il pannello, la tua rete o la tua configurazione di Home Assistant.
