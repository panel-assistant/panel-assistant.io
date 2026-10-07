---
title: Primi passi
description: Da un pannello Android a parete non configurato alla tua plancia di Home Assistant in pochi minuti, con Home Assistant che ti guida a ogni passaggio.
sourceCommit: a0f4f4fce9c24d9c344dbb001c39a8eef9bdd679
---

Se hai già configurato un pannello a parete o un kiosk, probabilmente ricordi com’è andata: installare app manualmente, cercare un motore del browser capace di mostrare una plancia, andare a tentativi con le impostazioni e non fidarti mai del tutto del prossimo riavvio. Configurare un pannello con Panel Assistant sarà una piacevole sorpresa. Puoi finire in pochi minuti e, anche se il pannello è già sulla parete, non dovrai alzarti dalla sedia. Va bene, forse una volta ;-)

La parte difficile di qualsiasi pannello è la prima ora. Panel Assistant se ne occupa per te, direttamente da Home Assistant. Se il pannello è già sulla tua rete, dai il suo indirizzo all’integrazione e farà il resto. Se è ancora nella scatola, collegalo al portatile con un cavo USB e installa direttamente dal browser, prima ancora di montarlo sulla parete. In entrambi i casi approvi una richiesta sul pannello e segui l’avanzamento.

## 1. Installa l’integrazione

Aggiungi Panel Assistant tramite HACS e riavvia Home Assistant. È l’unica cosa che installi a mano. Da qui in poi ti guida Home Assistant. Vedi [Installa l’integrazione](/it/home-assistant/custom-integration/).

## 2. Attiva il debug sul pannello

Apri le opzioni sviluppatore sul pannello e attiva il debug wireless, oppure il debug USB se lo colleghi con un cavo. È questo che permette a Home Assistant di installare per te. Le [pagine hardware](/it/hardware/) mostrano dove si trova l’interruttore su ogni modello e [Prepara il pannello](/it/install/prepare-a-panel/) contiene i dettagli.

## 3. Aggiungi il pannello

In Home Assistant, vai su **Impostazioni**, **Dispositivi e servizi**, **Aggiungi integrazione** e scegli **Panel Assistant**. Poi scegli come è collegato il pannello.

### Collegato al computer

Puoi configurare un pannello nuovo prima ancora di montarlo sulla parete. Collegalo al computer con un cavo USB e installa direttamente dal browser. Per farlo serve Chrome o Edge.

<div class="pa-steps" role="region" aria-label="Installazione tramite USB, passo dopo passo" tabindex="0">
<figure>
<figcaption><span>1</span> Scegli Installa tramite USB</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Il passaggio Configura un pannello in Home Assistant, con le opzioni Aggiungi un pannello della tua rete o Installa tramite USB su questo computer">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Il passaggio Configura un pannello in Home Assistant, con le opzioni Aggiungi un pannello della tua rete o Installa tramite USB su questo computer">
</figure>
<figure>
<figcaption><span>2</span> Collega il pannello</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="Il programma di installazione USB chiede di collegare il pannello e premere Trova il mio pannello">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="Il programma di installazione USB chiede di collegare il pannello e premere Trova il mio pannello">
</figure>
<figure>
<figcaption><span>3</span> Tocca Consenti sul pannello</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="Il programma di installazione USB attende mentre tocchi Consenti sullo schermo del pannello">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="Il programma di installazione USB attende mentre tocchi Consenti sullo schermo del pannello">
</figure>
<figure>
<figcaption><span>4</span> Premi Installa</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="Il programma di installazione USB è pronto a installare, con un unico pulsante Installa">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="Il programma di installazione USB è pronto a installare, con un unico pulsante Installa">
</figure>
<figure>
<figcaption><span>5</span> Segui l’installazione</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="La barra di avanzamento del programma di installazione USB mentre l’app viene installata">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="La barra di avanzamento del programma di installazione USB mentre l’app viene installata">
</figure>
<figure>
<figcaption><span>6</span> Fatto</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="Il programma di installazione USB conferma l’installazione e apre la configurazione del pannello">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="Il programma di installazione USB conferma l’installazione e apre la configurazione del pannello">
</figure>
</div>

### Sulla tua rete

Se il pannello è già sulla parete, a Home Assistant basta il suo indirizzo.

<div class="pa-steps" role="region" aria-label="Aggiunta di un pannello sulla tua rete, passo dopo passo" tabindex="0">
<figure>
<figcaption><span>1</span> Scegli Aggiungi un pannello della tua rete</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Il passaggio Configura un pannello in Home Assistant, con le opzioni Aggiungi un pannello della tua rete o Installa tramite USB su questo computer">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Il passaggio Configura un pannello in Home Assistant, con le opzioni Aggiungi un pannello della tua rete o Installa tramite USB su questo computer">
</figure>
<figure>
<figcaption><span>2</span> Inserisci l’indirizzo del pannello</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="Il passaggio Aggiungi un pannello, con l’indirizzo IP del pannello inserito">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="Il passaggio Aggiungi un pannello, con l’indirizzo IP del pannello inserito">
</figure>
<figure>
<figcaption><span>3</span> Scegli una versione</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="Il passaggio Scegli una versione, con la versione consigliata in cima all’elenco">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="Il passaggio Scegli una versione, con la versione consigliata in cima all’elenco">
</figure>
<figure>
<figcaption><span>4</span> Tocca Consenti sul pannello, ed è aggiunto</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="Il passaggio di conferma del completamento, che conferma l’aggiunta del pannello a Home Assistant">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="Il passaggio di conferma del completamento, che conferma l’aggiunta del pannello a Home Assistant">
</figure>
</div>

In entrambi i casi, la procedura guidata si occupa della parte complicata. Controlla cosa c’è già sul pannello, installa la versione corrente dell’app del pannello, la avvia e ne verifica il corretto funzionamento. Un pannello su cui l’app è già in esecuzione viene adottato, senza reinstallarla. Il pannello riconosce il proprio modello e carica il profilo hardware corrispondente, così schermo, pulsanti, LED e sensori arrivano in Home Assistant pronti all’uso. Vedi [Aggiungi un pannello](/it/install/installing-ha-paneld/).

## 4. Completa la procedura guidata del pannello

Home Assistant apre poi la procedura guidata di configurazione del pannello, che fa poche domande rapide, tra cui il nome del pannello e la dashboard da mostrare sulla parete. Il pannello carica solo le entità mostrate da quella dashboard, ed è questo a mantenerlo veloce. Vedi [Collega un pannello](/it/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="La procedura guidata di configurazione del pannello, passo dopo passo" tabindex="0">
<figure>
<figcaption><span>1</span> Dai un nome al pannello</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="La procedura guidata del pannello chiede un ID e un nome leggibile, con un’anteprima dei nomi delle entità che userà Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="La procedura guidata del pannello chiede un ID e un nome leggibile, con un’anteprima dei nomi delle entità che userà Home Assistant">
</figure>
<figure>
<figcaption><span>2</span> Scegli la dashboard e l’area</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="La procedura guidata con una dashboard e un’area di Home Assistant selezionate per il pannello">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="La procedura guidata con una dashboard e un’area di Home Assistant selezionate per il pannello">
</figure>
<figure>
<figcaption><span>3</span> Attiva il filtro delle entità</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="La procedura guidata consiglia il filtro delle entità per questo pannello e mostra il numero di entità di Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="La procedura guidata consiglia il filtro delle entità per questo pannello e mostra il numero di entità di Home Assistant">
</figure>
<figure>
<figcaption><span>4</span> Ci siamo quasi</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="La procedura guidata attende mentre il pannello prepara il suo insieme filtrato di entità e carica la dashboard">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="La procedura guidata attende mentre il pannello prepara il suo insieme filtrato di entità e carica la dashboard">
</figure>
<figure>
<figcaption><span>5</span> Tutto pronto</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="La procedura guidata conferma che il pannello è configurato e mostra la dashboard">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="La procedura guidata conferma che il pannello è configurato e mostra la dashboard">
</figure>
</div>

## Cosa ti serve

- Home Assistant 2026.8.3 o successivo, con HACS.
- Un pannello a parete con Android 8.0 o successivo. La maggior parte dei pannelli funziona con il profilo hardware generico; [Scegli un pannello](/it/install/supported-panels/) elenca i modelli con supporto hardware completo.
- Per l’opzione USB, un browser basato su Chromium come Chrome o Edge.

## Dove trovi i dettagli

Le pagine sotto **Mantienilo in funzione** approfondiscono ogni funzione dell’app del pannello. La sezione di riferimento documenta l’[API](/it/reference/api/), i [profili hardware](/it/reference/profiles/) e il [modello di sicurezza](/it/reference/security/), mentre le [pagine hardware](/it/hardware/) descrivono ogni pannello supportato.
