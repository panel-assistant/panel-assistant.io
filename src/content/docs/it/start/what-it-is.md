---
title: Come funziona
description: Cosa porta Panel Assistant su un pannello, cosa rimane in Home Assistant e perché può essere completamente open source.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Panel Assistant ha due parti. Una risiede in Home Assistant ed è ciò che vedi e usi. L’altra risiede su ogni pannello ed è ciò che lo rende veloce.

## In Home Assistant: l’integrazione

L'integrazione è ciò che installi tramite HACS. È il punto in cui si aggiunge un pannello, in cui ogni pannello appare come un dispositivo con il proprio stato e la propria diagnostica e in cui gli amministratori possono scegliere un pannello nella barra laterale di Panel Assistant e usare la sua interfaccia web all'interno di Home Assistant.

È anche il programma di installazione. Forniscigli l’indirizzo di un pannello nuovo, oppure collega un pannello nuovo al tuo portatile: controlla cosa c’è, installa l’app del pannello, la avvia e solo dopo crea il dispositivo. Se un pannello sta già eseguendo l’app, lo adotta invece.

## Sul pannello: l’app

Un pannello a parete è un piccolo computer Android, e il motivo per cui la maggior parte sembra lenta è il software fornito in dotazione. Panel Assistant sostituisce la parte di quel software che conta con la propria app, che fa tre cose.

- **Visualizza la tua plancia.** L'app carica autonomamente la tua plancia Home Assistant esistente. Con il filtro delle entità abilitato, apprende quali entità usa la plancia e richiede a Home Assistant solo quelle. Su un pannello economico, questo fa gran parte della differenza tra una risposta lenta e una senza ritardi.
- **Gestisce l'hardware del pannello.** Lo schermo, la sua luminosità e la sospensione, i LED, i pulsanti, i relè, i sensori di prossimità e di luce e qualsiasi altro componente presente nel modello sono controllati direttamente e appaiono in Home Assistant come entità del dispositivo del pannello. Ogni modello è descritto da un profilo hardware: testo semplice che puoi leggere, modificare e convalidare nel browser sul pannello, senza strumenti di sviluppo. Un pannello Android ARM compatibile che il progetto non ha mai incontrato parte dal prudente profilo Generic, che gli offre la plancia, i sensori, la luminosità, l'audio e la navigazione disponibili su qualsiasi dispositivo Android, e acquisisce le altre funzioni man mano che il profilo viene completato. Il pannello in funzione verifica ogni capacità dichiarata prima di usarla, quindi una funzione mancante viene mostrata come bloccata e spiegata, invece di lasciarla non funzionante, e un profilo che fallisce all'avvio viene sostituito dall'ultimo che funzionava.
- **Si comporta come un elettrodomestico.** L’app prende il posto del launcher del produttore, offre a un pannello senza pulsanti un modo per navigare sullo schermo, rende disponibile la propria pagina di stato sulla tua rete e si ripristina autonomamente quando qualcosa va storto, così puoi montare un pannello una volta e lasciarlo funzionare senza intervenire.

Quell’app si chiama ha-paneld. Il nome deriva dalla sua storia come servizio di supporto in background da cui dipendevano altri software per dashboard, e da allora è cresciuta fino a coprire l’intera parte del prodotto che risiede sul pannello. Troverai questo nome nella documentazione di riferimento e nella pagina di stato del pannello. Vale la pena conoscerlo per evitare sorprese, ma non devi mai digitarlo né pensarci per usare Panel Assistant.

## Perché può essere open source

La maggior parte dei produttori di pannelli distribuisce il supporto hardware sotto forma di librerie chiuse che solo la propria app è autorizzata a usare. ha-paneld non le usa. Controlla direttamente l’hardware di ogni pannello tramite i propri profili per modello, un lavoro impegnativo che spiega perché il progetto dispone di supporto hardware. È anche il motivo per cui l’intero prodotto può essere distribuito gratuitamente: non contiene codice del produttore, quindi nulla impedisce che sia gratuito e open source con licenze permissive, per pannelli di qualsiasi marca.

Per lo stesso motivo, il supporto hardware è l’ambito in cui il progetto ha più bisogno di aiuto. Ogni pannello che si fa conoscere, funzionante o meno, migliora il profilo successivo. Vedi [Scegli un pannello](/it/install/supported-panels/) per conoscere lo stato attuale del supporto.

## Dove si trovano le parti

| Parte                         | Cos’è                                                                                                 | Dove                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Panel Assistant               | L’integrazione Home Assistant: programma di installazione, dispositivi e pagina con tutti i pannelli. | [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) |
| ha-paneld                     | L’app sul pannello: dashboard, hardware, launcher e pagina di stato.                                  | [panel-assistant/android](https://github.com/panel-assistant/android)               |
| Profili hardware              | Le descrizioni per modello che indicano all’app cosa ha un pannello e come controllarlo.              | [Riferimento hardware](/it/hardware/)                                               |
| Documentazione di riferimento | L’API, i profili hardware e il modello di sicurezza in dettaglio.                                     | [Riferimento](/it/reference/api/)                                                   |

## Cosa non è

È pensato per pannelli a parete dedicati. Tablet e telefoni possono eseguirlo, ma qualsiasi dispositivo con una batteria ha bisogno di un cavo, e il progetto presuppone un pannello alimentato dalla rete elettrica, configurato una volta e poi lasciato funzionare senza interventi. Non è uno strumento per creare dashboard; mostra quelle che hai già. E non è finito: la direzione è il supporto hardware universale e la gestione di tutti i pannelli senza interventi.
