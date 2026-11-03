---
title: Prossimità adattiva e riattivazione con un gesto della mano
description: Come il pannello apprende il comportamento del proprio sensore di prossimità, cosa comunica a Home Assistant e come un gesto della mano riattiva lo schermo.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

I sensori di prossimità dei pannelli a parete Android non condividono un'unica scala utile. Alcuni riportano una distanza, altri riportano solo due valori, la polarità può essere invertita e le letture a riposo possono variare tra esemplari e versioni del firmware. L'app del pannello usa il modello calibrato del profilo del sensore attivo, oppure un modello che salvi tramite la configurazione guidata, per interpretarne il valore di base, il riferimento di vicinanza e la polarità.

![La configurazione guidata della prossimità del pannello, al passaggio 3 di 7, che ti chiede di camminare verso il pannello come faresti normalmente mentre esegue un conto alla rovescia](/screenshots/proximity-setup-screen-480.gif)

## Configurazione guidata

Apri **Configura**, poi **Presenza e riattivazione**, per vedere se il profilo del sensore attivo dispone di un modello utilizzabile. Se la configurazione è disponibile, avvia da lì la configurazione guidata della prossimità e segui le istruzioni sullo schermo del pannello stesso. La procedura misura il segnale a campo libero e i movimenti intenzionali della mano; esamina il risultato e salvalo sul pannello.

**Ripristina valori predefiniti del profilo** sostituisce la calibrazione salvata con i valori predefiniti del profilo del sensore, se disponibili. Un sensore senza un modello utilizzabile richiede la configurazione guidata prima che la riattivazione tramite prossimità sia pronta. La riattivazione tramite tocco rimane disponibile sui pannelli con un percorso di riattivazione tramite tocco convalidato.

## Entità di Home Assistant

Quando il modello appreso è affidabile e il profilo hardware attivo espone una sorgente di prossimità utilizzabile, il dispositivo del pannello in Home Assistant ottiene:

- `binary_sensor.<panel>_proximity`, presenza vicina o lontana determinata tramite apprendimento; e
- `sensor.<panel>_proximity_level`, un valore normalizzato da 0 (lontano) a 100 (vicino) sulla stessa scala per ogni pannello.

Entrambe le entità rimangono non disponibili quando i dati sono insufficienti o il sensore non funziona correttamente. Il pannello non riporta un valore apparentemente attendibile ricavato da un modello di cui non si fida. Un sensore che riporta solo due valori può comunque fornire il rilevamento della presenza e i gesti di riattivazione, e il livello viene riportato solo quando il segnale lo consente effettivamente.

## Riattivazione con un gesto della mano

**Riattivazione con un gesto della mano** usa l'avvicinamento della mano o lo schema di movimento della mano convalidato dal profilo del sensore o dalla configurazione guidata. Uno schema con una sola mano si attiva quando la mano si avvicina; uno schema con un doppio movimento della mano verifica i due movimenti abbinati prima della riattivazione. La configurazione e le brevi fluttuazioni a riposo non generano richieste di riattivazione.

Richiede una sorgente di prossimità attiva e un modello appreso pronto all'uso. La sorgente può essere un normale sensore Android o un percorso scelto dal profilo hardware. L'interfaccia web e la diagnostica del pannello mostrano il percorso effettivamente in uso e se è pronto; il fatto che un profilo dichiari un sensore non basta di per sé a renderlo disponibile.
