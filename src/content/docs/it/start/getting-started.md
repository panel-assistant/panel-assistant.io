---
title: Primi passi
description: Da un pannello Android a parete non configurato alla tua plancia di Home Assistant in pochi minuti, con Home Assistant che ti guida a ogni passaggio.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Se hai già configurato un pannello a parete o un kiosk, probabilmente ricordi com’è andata: installare app manualmente, cercare un motore del browser capace di mostrare una plancia, andare a tentativi con le impostazioni e non fidarti mai del tutto del prossimo riavvio. Configurare un pannello con Panel Assistant sarà una piacevole sorpresa. Puoi finire in pochi minuti e, anche se il pannello è già sulla parete, non dovrai alzarti dalla sedia. Va bene, forse una volta ;-)

La parte difficile di qualsiasi pannello è la prima ora. Panel Assistant se ne occupa per te, dall'interno di Home Assistant. Se il pannello è già sulla tua rete, fornisci il suo indirizzo all'integrazione e questa fa il resto. Se è ancora nella scatola, collegalo al portatile con un cavo USB e installa direttamente dal browser, prima ancora di montarlo sulla parete. Se il pannello chiede di autorizzare il debug, accetta la richiesta sul suo schermo, poi segui l'installazione fino alla fine.

## 1. Installa l’integrazione

Aggiungi Panel Assistant tramite HACS e riavvia Home Assistant. È l’unica cosa che installi a mano. Da qui in poi ti guida Home Assistant. Vedi [Installa l’integrazione](/it/home-assistant/custom-integration/).

:::note
Panel Assistant 1.0 è in anteprima pubblica. Fino al rilascio, HACS installa la versione 0.9.0. Per installare invece l’anteprima, apri **Panel Assistant** in HACS, attiva **Mostra versioni beta** e scarica l’anteprima 1.0 più recente. Un pannello con l’app 1.0 non può tornare alla versione 0.9; [passare alla versione 1.0](/it/manage/upgrade-to-1-0/) spiega cosa cambia.
:::

## 2. Attiva il debug sul pannello

Apri le opzioni sviluppatore sul pannello: sulla maggior parte dei pannelli, apri **Impostazioni**, poi **Informazioni** e tocca **Numero build** sette volte. Quindi attiva il **debug USB** se colleghi il pannello via cavo, oppure **ADB di rete sulla porta TCP 5555** per l’installazione via rete. Non tutti i pannelli hanno un interruttore per ADB di rete; ogni [pagina hardware](/it/hardware/) indica se è presente e dove si trova e, se non c’è, usa l’installazione via USB. [Prepara il pannello](/it/install/prepare-a-panel/) fornisce i dettagli.

## 3. Aggiungi il pannello

In Home Assistant, vai su **Impostazioni**, **Dispositivi e servizi**, **Aggiungi integrazione** e scegli **Panel Assistant**. Poi scegli come è collegato il pannello.

### Collegato al computer

Puoi configurare un pannello nuovo prima ancora di montarlo sulla parete. Collegalo al computer con un cavo USB e installa direttamente dal browser. Per farlo serve Chrome o Edge. Dopo aver scelto **Installa tramite USB su questo computer**, seleziona **Apri il programma di installazione USB**, mantieni la versione consigliata e premi **Continua**; il programma di installazione si apre in una nuova finestra. Per completare la configurazione il pannello ha comunque bisogno del Wi-Fi: collegalo alla tua rete nella sua app Impostazioni, prima o dopo l’installazione.

<div class="pa-steps" role="region" aria-label="Installazione tramite USB, passo dopo passo" tabindex="0">
<figure>
<figcaption><span>1</span> Scegli Installa tramite USB</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="Il passaggio Configura un pannello in Home Assistant, con le opzioni Aggiungi un pannello della tua rete o Installa tramite USB su questo computer">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="Il passaggio Configura un pannello in Home Assistant, con le opzioni Aggiungi un pannello della tua rete o Installa tramite USB su questo computer">
</figure>
<figure>
<figcaption><span>2</span> Collega il pannello, premi Trova il mio pannello e scegli il pannello nell’elenco del browser</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-connect-dark.png" width="520" height="375" alt="Il programma di installazione USB chiede di collegare il pannello e premere Trova il mio pannello">
<img class="dark:sl-hidden" src="/screenshots/usb-connect-light.png" width="520" height="375" alt="Il programma di installazione USB chiede di collegare il pannello e premere Trova il mio pannello">
</figure>
<figure>
<figcaption><span>3</span> Consenti il debug sul pannello se richiesto</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-allow-dark.png" width="520" height="263" alt="Il programma di installazione USB attende mentre tocchi Consenti sullo schermo del pannello">
<img class="dark:sl-hidden" src="/screenshots/usb-allow-light.png" width="520" height="263" alt="Il programma di installazione USB attende mentre tocchi Consenti sullo schermo del pannello">
</figure>
<figure>
<figcaption><span>4</span> Premi Installa</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-confirm-dark.png" width="520" height="323" alt="Il programma di installazione USB è pronto a installare, con un unico pulsante Installa">
<img class="dark:sl-hidden" src="/screenshots/usb-confirm-light.png" width="520" height="323" alt="Il programma di installazione USB è pronto a installare, con un unico pulsante Installa">
</figure>
<figure>
<figcaption><span>5</span> Segui l’installazione</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-progress-dark.png" width="520" height="309" alt="La barra di avanzamento del programma di installazione USB mentre l’app viene installata">
<img class="dark:sl-hidden" src="/screenshots/usb-progress-light.png" width="520" height="309" alt="La barra di avanzamento del programma di installazione USB mentre l’app viene installata">
</figure>
<figure>
<figcaption><span>6</span> Fatto</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-done-dark.png" width="520" height="308" alt="Il programma di installazione USB conferma l’installazione e apre la configurazione del pannello">
<img class="dark:sl-hidden" src="/screenshots/usb-done-light.png" width="520" height="308" alt="Il programma di installazione USB conferma l’installazione e apre la configurazione del pannello">
</figure>
</div>

### Sulla tua rete

Se il pannello è già sulla parete, a Home Assistant basta il suo indirizzo.

<div class="pa-steps" role="region" aria-label="Aggiunta di un pannello sulla tua rete, passo dopo passo" tabindex="0">
<figure>
<figcaption><span>1</span> Scegli Aggiungi un pannello della tua rete</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="Il passaggio Configura un pannello in Home Assistant, con le opzioni Aggiungi un pannello della tua rete o Installa tramite USB su questo computer">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="Il passaggio Configura un pannello in Home Assistant, con le opzioni Aggiungi un pannello della tua rete o Installa tramite USB su questo computer">
</figure>
<figure>
<figcaption><span>2</span> Inserisci l’indirizzo del pannello</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-address-dark.png" width="580" height="377" alt="Il passaggio Aggiungi un pannello, con l’indirizzo IP del pannello inserito">
<img class="dark:sl-hidden" src="/screenshots/ha-address-light.png" width="580" height="377" alt="Il passaggio Aggiungi un pannello, con l’indirizzo IP del pannello inserito">
</figure>
<figure>
<figcaption><span>3</span> Scegli una versione</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-version-dark.png" width="580" height="304" alt="Il passaggio Scegli una versione, con la versione consigliata in cima all’elenco">
<img class="dark:sl-hidden" src="/screenshots/ha-version-light.png" width="580" height="304" alt="Il passaggio Scegli una versione, con la versione consigliata in cima all’elenco">
</figure>
<figure>
<figcaption><span>4</span> Consenti il debug sul pannello se lo richiede</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-authorize-dark.png" width="580" height="354" alt="Home Assistant attende che tu selezioni Consenti sempre da questo computer e tocchi Consenti sul pannello; poi prosegue automaticamente">
<img class="dark:sl-hidden" src="/screenshots/ha-authorize-light.png" width="580" height="354" alt="Home Assistant attende che tu selezioni Consenti sempre da questo computer e tocchi Consenti sul pannello; poi prosegue automaticamente">
</figure>
<figure>
<figcaption><span>5</span> Apri la pagina di configurazione del pannello</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-done-dark.png" width="580" height="248" alt="Home Assistant propone la pagina di configurazione del pannello e chiede di tornare e selezionare Fatto dopo averla completata">
<img class="dark:sl-hidden" src="/screenshots/ha-done-light.png" width="580" height="248" alt="Home Assistant propone la pagina di configurazione del pannello e chiede di tornare e selezionare Fatto dopo averla completata">
</figure>
</div>

Se il pannello chiede se consentire il debug, seleziona **Consenti sempre da questo computer** e tocca **Consenti** sul pannello; Home Assistant prosegue da solo. Poi conferma l’installazione.

In entrambi i casi, la procedura guidata si occupa della parte complicata. Controlla cosa c’è già sul pannello, installa la versione corrente dell’app del pannello, la avvia e ne verifica il corretto funzionamento. Un pannello su cui l’app è già in esecuzione viene adottato, senza reinstallarla. Il pannello riconosce il proprio modello e carica il profilo hardware corrispondente, così schermo, pulsanti, LED e sensori arrivano in Home Assistant pronti all’uso. Vedi [Aggiungi un pannello](/it/install/installing-ha-paneld/).

## 4. Completa la procedura guidata del pannello

Poi si passa alla procedura guidata di configurazione del pannello. È fornita dal pannello e si apre nel browser sul computer, non sullo schermo del pannello. Dopo un’installazione via rete, Home Assistant mostra **Completa la configurazione di questo pannello**: apri la pagina di configurazione del pannello, completa i passaggi, poi torna a Home Assistant e seleziona **Fatto**. Dopo un’installazione USB, la finestra del programma di installazione passa direttamente alla procedura guidata. Essendo fornita dal pannello, si carica solo in un browser sulla sua stessa rete.

La procedura guidata chiede un nome per il pannello, lo fa accedere a Home Assistant e chiede quale plancia mostrare e in quale area si trovi il pannello. Il pannello si connette con l’account Home Assistant con cui accedi, quindi se il browser è connesso con il tuo account, anche il pannello potrebbe connettersi con quello; per usare un account dedicato al pannello, accedi invece con quell’account. Con il filtro delle entità abilitato, il pannello carica solo le entità usate da quella plancia, ed è questo che lo mantiene veloce. Vedi [Connetti un pannello](/it/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="La procedura guidata di configurazione del pannello, passo dopo passo" tabindex="0">
<figure>
<figcaption><span>1</span> Dai un nome al pannello</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-name-dark.png" width="524" height="702" alt="La procedura guidata del pannello chiede un ID e un nome leggibile, con un’anteprima dei nomi delle entità che userà Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-name-light.png" width="524" height="702" alt="La procedura guidata del pannello chiede un ID e un nome leggibile, con un’anteprima dei nomi delle entità che userà Home Assistant">
</figure>
<figure>
<figcaption><span>2</span> Accedi a Home Assistant</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-sign-in-dark.png" width="524" height="688" alt="La procedura guidata propone l’accesso da questo browser o dal pannello, usando l’account Home Assistant con cui il pannello deve connettersi">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-sign-in-light.png" width="524" height="688" alt="La procedura guidata propone l’accesso da questo browser o dal pannello, usando l’account Home Assistant con cui il pannello deve connettersi">
</figure>
<figure>
<figcaption><span>3</span> Scegli la plancia e l’area</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-dashboard-dark.png" width="524" height="485" alt="La procedura guidata con una plancia e un’area di Home Assistant selezionate per il pannello">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-dashboard-light.png" width="524" height="485" alt="La procedura guidata con una plancia e un’area di Home Assistant selezionate per il pannello">
</figure>
<figure>
<figcaption><span>4</span> Attiva il filtro delle entità, se richiesto</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-filter-dark.png" width="524" height="636" alt="La procedura guidata consiglia il filtro delle entità per questo pannello e mostra il numero di entità di Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-filter-light.png" width="524" height="636" alt="La procedura guidata consiglia il filtro delle entità per questo pannello e mostra il numero di entità di Home Assistant">
</figure>
<figure>
<figcaption><span>5</span> Ci siamo quasi</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-almost-there-dark.png" width="524" height="339" alt="La procedura guidata attende mentre il pannello prepara il suo insieme filtrato di entità e carica la plancia">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-almost-there-light.png" width="524" height="339" alt="La procedura guidata attende mentre il pannello prepara il suo insieme filtrato di entità e carica la plancia">
</figure>
<figure>
<figcaption><span>6</span> Tutto pronto</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-done-dark.png" width="524" height="526" alt="La procedura guidata conferma che il pannello è configurato e mostra la plancia">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-done-light.png" width="524" height="526" alt="La procedura guidata conferma che il pannello è configurato e mostra la plancia">
</figure>
</div>

## Cosa ti serve

- Home Assistant 2026.8.3 o successivo, con HACS.
- Un pannello a parete ARM con Android 8.0 o successivo e accesso al debug. La maggior parte dei pannelli funziona con il profilo hardware generico e [Scegli un pannello](/it/install/supported-panels/) elenca i modelli con supporto hardware completo.
- Per l’opzione USB, un browser basato su Chromium come Chrome o Edge.

## Dove trovi i dettagli

Le pagine sotto **Mantienilo in funzione** approfondiscono ogni funzione dell’app del pannello. La sezione di riferimento documenta l’[API](/it/reference/api/), i [profili hardware](/it/reference/profiles/) e il [modello di sicurezza](/it/reference/security/), mentre le [pagine hardware](/it/hardware/) descrivono ogni pannello supportato.
