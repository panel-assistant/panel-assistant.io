---
title: Luminosità adattiva
description: Lascia che il pannello apprenda la luce nella stanza in cui si trova e imposti autonomamente la luminosità dello schermo, senza automazioni di Home Assistant.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

La luminosità adattiva è un regolatore opzionale sul pannello che apprende il normale andamento della luce ambientale circostante e regola lo schermo senza un'automazione di Home Assistant. È disattivata per impostazione predefinita e il normale controllo della luminosità, manuale o tramite Home Assistant, è disponibile sia quando la luminosità adattiva è attiva sia quando è disattivata.

![La scheda Configura dell'interfaccia web del pannello, con il riquadro Schermo che mostra la sorgente di luce ambientale, Luminosità auto, Livello minimo, Sensibilità e il grafico dell'apprendimento giornaliero della luce ambientale](/screenshots/ui-configure-dark.png)

## Scegli la sorgente di luce

Apri **Configura**, poi **Schermo** e scegli **Fonte luce ambientale**:

- Lascia il campo vuoto per usare il sensore di luce del pannello stesso, quando sia il profilo hardware attivo sia la verifica in tempo reale delle funzionalità del pannello ne rendono disponibile uno.
- Seleziona una singola entità di illuminamento di Home Assistant quando il pannello non dispone di un proprio sensore adatto, oppure quando un sensore situato altrove nella stanza rappresenta meglio la luce che le persone vedono effettivamente.

Una sorgente di Home Assistant viene letta tramite un'unica sottoscrizione a quella sola entità anziché all'intero flusso degli stati. Se nessuna delle due sorgenti è disponibile, l'app del pannello mantiene indisponibile il controllo adattivo anziché fare supposizioni in base all'ora del giorno.

Quando la sorgente è un'entità di illuminamento di Home Assistant, il pannello può inizializzare il proprio andamento appreso con un massimo di sette giorni della cronologia esistente di quell'entità. Questo offre alla luminosità automatica un utile punto di partenza, senza dover attendere che si accumulino nuove letture. È necessario che l'entità venga registrata e che il servizio di cronologia di Home Assistant sia disponibile; se non viene restituita alcuna cronologia utilizzabile, l'apprendimento inizia semplicemente dalle nuove letture.

## Attivala e regolala

Attiva **Luminosità auto** nello stesso riquadro Schermo. Il regolatore conserva sul pannello fino a sette giorni di cronologia della luce ambientale e apprende l'andamento normale per ogni momento della giornata. Un breve aumento rispetto a tale andamento, come l'accensione di una luce nella stanza, può portare il livello proposto al di sopra del livello di riferimento.

**Livello minimo** imposta il livello più basso che il controllo automatico proporrà e ridimensiona l'intervallo appreso tra **Livello minimo** e **Livello massimo**. Può variare dal 4% al 99%. Il limite inferiore del 4% corrisponde al minimo della retroilluminazione stessa (che non si spegne mai), quindi un valore inferiore sposterebbe il comando senza modificare lo schermo. Non limita la luminosità manuale, che può comunque essere impostata a un valore inferiore.

**Livello massimo** fissa il limite superiore della luminosità automatica, dal 5% al 100%, al di sopra del minimo selezionato. Non limita la luminosità manuale.

**Sensibilità** indica quanta parte della differenza rispetto all'andamento appreso viene applicata allo schermo, una volta che il regolatore ha stabilito che la differenza è reale. Allo 0% ignora la differenza e usa soltanto l'andamento appreso. Valori più bassi producono una risposta più stabile e il valore predefinito del 50% lascia lo stesso margine di regolazione in entrambe le direzioni. Non è un comando che segue direttamente la luce: un breve aumento della luce provoca una reazione solo dopo essere durato abbastanza o essere cresciuto abbastanza bruscamente da essere considerato significativo. Durante il riscaldamento iniziale, lo schermo segue la luce misurata smussata indipendentemente dalla Sensibilità; l'impostazione entra in vigore mentre il modello continua ad apprendere.

Il grafico di sette giorni mostra in anteprima l'intervallo osservato, il livello di riferimento appreso e il livello proposto, prima dell'attivazione del regolatore o mentre è attivo. Le modifiche non salvate a Livello minimo, Livello massimo e Sensibilità vengono mostrate nell'anteprima senza riscrivere la cronologia memorizzata.

La cronologia è associata alla sorgente selezionata e a un contesto approssimativo della stanza e dell'orario ricavato dalla posizione e dal fuso orario di Home Assistant. Un cambiamento sostanziale della posizione, del fuso orario o della sorgente avvia una cronologia separata, anziché applicare silenziosamente quanto appreso in un altro contesto.

## Modifiche manuali e ripristino

Una modifica manuale della luminosità registra una preferenza temporanea per quattro ore, in modo che il regolatore non contrasti immediatamente la persona che l'ha modificata. Le modifiche automatiche iniziano con un'influenza del 20% e riacquistano il pieno controllo mentre la preferenza si attenua gradualmente nell'arco di quattro ore. Seleziona **Riprendi modalità del tutto automatica** per terminare subito la preferenza anziché attendere l'attenuazione.

Seleziona **Reimposta cronologia appresa** dopo aver spostato il pannello, averne cambiato la sorgente di luce o quando l'ultima settimana non rappresenta più la stanza. Dopo la conferma, questa azione elimina i sette giorni di cronologia della luce ambientale per la sorgente e il contesto attuali e riavvia l'apprendimento. Non modifica la sorgente selezionata né l'impostazione Luminosità auto.

La luminosità adattiva usa la normale impostazione della luminosità dello schermo di Android e non richiede il root. La lettura del sensore di luce di un determinato pannello può comunque dipendere dal modo in cui si accede a quel sensore su quell'hardware; a determinarlo sono il profilo attivo e la verifica in tempo reale delle funzionalità.

## Controllo tramite Home Assistant

Quando il pannello lo rende disponibile, `switch.<panel>_auto_brightness` attiva e disattiva lo stesso regolatore. La luminosità dello schermo rimane su `light.<panel>_screen`, quindi una modifica della luminosità da Home Assistant crea la stessa preferenza temporanea di una modifica effettuata sul pannello. Usa **Riprendi modalità del tutto automatica** nella pagina Configura per tornare direttamente al livello appreso.
