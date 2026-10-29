---
title: Profili dei pannelli della comunità
description: Profili forniti dalla comunità per pannelli non inclusi nell'app, come importarli in sicurezza e come abilitare una fotocamera non dichiarata dal profilo.
sidebar:
  label: Panoramica
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Questo è un catalogo di profili forniti dalla comunità che non sono inclusi in ha-paneld. Elencare qui un profilo non significa affermare che ha-paneld funzioni sull'hardware commerciale indicato così come viene venduto. Ogni profilo può descrivere uno specifico flashing, una modifica del firmware o una singola installazione segnalata anziché il software originale del produttore.

I profili della comunità non vengono mai selezionati automaticamente. Scarica il singolo file YAML, esaminane la fonte, il firmware testato e i limiti, e usa la pagina **Profili** del pannello per importarlo. L'importazione e la convalida sono solo un'anteprima; non salvano né attivano il profilo.

Prima di salvare, esigi che l'anteprima riporti che ogni predicato in un gruppo completo di corrispondenza concordi con i dati immutabili del dispositivo. Un nome corrispondente da solo non basta. L'attivazione verifica rigorosamente quell'identità e rifiuta acquisizioni non sicure del touchscreen, ma non controlla preventivamente ogni percorso privilegiato dal vivo. Dopo il riavvio controllato, i driver in esecuzione specifici delle funzionalità verificano le proprie interfacce e autorizzazioni quando vengono inizializzati o usati; le funzionalità non disponibili rimangono tali, e la salute all'avvio determina se il candidato rimane attivo o viene annullato. Non considerare mai un'importazione o un'attivazione riuscita come prova che ogni funzionalità dichiarata funzioni.

## Provare un profilo della comunità in sicurezza

1. Apri la pagina del dispositivo del pannello in Home Assistant, seleziona **Visita**, poi apri **Profili**. Esporta la revisione attiva e crea un backup completo aggiornato del pannello. Se ti connetti direttamente, usa la porta HTTP indicata dal pannello (`http://<panel-ip>:8888/profiles` con la porta predefinita).
2. Scarica ed esamina lo YAML. Conferma che il firmware esatto e le modifiche presupposte descrivano il pannello davanti a te.
3. Incolla o carica lo YAML in **Profili**, poi convalidalo. Non proseguire se la corrispondenza di identità è incompleta, manca un driver compilato necessario o viene segnalata una mappatura di input non sicura. La convalida non prova le autorizzazioni hardware dal vivo.
4. Salva il contenuto convalidato come revisione locale inattiva. Il salvataggio continua a non modificare il profilo in esecuzione.
5. Provalo e attivalo solo mentre qualcuno può vedere e toccare il pannello, seguendo la [lista di controllo dei test dei profili](/it/reference/profiles/testing/). L'attivazione è legata all'ID del profilo, alla revisione e all'hash esatti del contenuto.
6. Dopo il riavvio, esamina i risultati dal vivo delle funzionalità e conferma la revisione attiva, i controlli attesi e le entità Home Assistant. Un percorso non disponibile deve rimanere non disponibile anziché essere considerato riuscito. Prova **Ripristina la revisione precedente** prima di affidarti al profilo senza supervisione; una salute all'avvio non valida dovrebbe riportare automaticamente all'ultima revisione funzionante nota.

Tornare a **Usa selezione automatica** seleziona solo un profilo incluso o il fallback prudente Generic. Non riattiverà automaticamente una revisione della comunità.

## Abilitare la fotocamera su un pannello il cui profilo non la dichiara

La fotocamera viene proposta su ogni pannello che ne possiede una: una fotocamera dichiarata dal profilo con `hardware.camera`, oppure una fotocamera enumerata da Android su un pannello il cui profilo non dice nulla. Una scheda con hardware fotocamera funzionante quindi di solito non necessita di alcuna voce nel profilo, e il gruppo Fotocamera appare in **Configura** senza che nessuno modifichi YAML.

Tre condizioni possono comunque lasciarla assente, e la scheda Fotocamera in **Configura** indica quale si applica anziché scomparire:

- **Il profilo la sopprime.** `hardware.camera: false` è un terzo stato intenzionale, diverso dall'omissione della chiave: indica che il dispositivo enumerato non è una fotocamera ambientale utilizzabile, ad esempio un ingresso di acquisizione HDMI. Rimuovi la riga o impostala a `true` per proporre la fotocamera.
- **Android non ha enumerato alcuna fotocamera.** Se il pannello ne possiede una, dichiara `hardware.camera: true` nel profilo. Una dichiarazione ha priorità su un'enumerazione vuota, quindi questa è la correzione anche quando il servizio fotocamera è presente ma l'enumerazione è inaffidabile.
- **L'enumerazione non ha ancora risposto.** Questo non dice nulla sull'hardware. Attendi qualche secondo e ricarica Configura; non serve modificare nulla.

Dichiarare una fotocamera non esposta dalla scheda è sicuro e non dannoso. Un controllo leggero a runtime legge l'elenco degli identificatori delle fotocamere Android per segnalare le funzionalità; una fotocamera dichiarata viene comunque proposta, e una scheda che ne è priva rifiuta l'apertura con un errore classificato `no_camera_id` la cui azione indica che il profilo è errato. Non destabilizza il pannello.

Un requisito accompagna questa opzione. L'uso della fotocamera viene negato se il pannello non può mostrare alla stanza che è aperta, e mentre lo schermo è spento ciò richiede un percorso di indicazione indipendente dallo schermo. Per acquisire con lo schermo spento, fornisci un percorso funzionante di indicazione LED. Mentre lo schermo è acceso, l'indicatore sullo schermo può soddisfare il requisito senza LED. Imposta `hardware.camera_lens_offset_px` affinché quell'indicatore sia sotto l'obiettivo anziché accanto.

Tutto il resto della fotocamera rimane invariato rispetto all'opzione: rimane spenta finché non viene abilitata, l'interruttore non è mai un valore predefinito suggerito e l'attivazione tramite l'entità fotocamera di Home Assistant chiede approvazione sullo schermo del pannello in ogni modalità di sicurezza. L'impostazione Fotocamera in Configura è un percorso separato di configurazione del proprietario.

## Catalogo

- [`community-cronos-lineageos18.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml): una bozza per Amazon Echo Show 5 Gen 2 di un collaboratore, su cui è stato installato LineageOS 18.1 tramite flashing. Fire OS originale non può eseguire ha-paneld; sblocco, flashing e ripristino non sono supportati, e il profilo non è stato convalidato su hardware dal progetto. Vedi le [note sulle evidenze specifiche del profilo](/it/reference/profiles/community/echo-show-5-gen2/).
- [`community-lenovo-thinksmart-view-lineageos.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-lenovo-thinksmart-view-lineageos.yaml): una bozza per Lenovo ThinkSmart View di un collaboratore, su cui è stato installato LineageOS 8.1 tramite flashing. Seleziona la sospensione Android perché luminosità zero rimane visibilmente accesa, registra che il tocco non risveglia il pannello e annota la conferma del collaboratore che Home Assistant può attenuarlo, spegnerlo completamente e risvegliarlo. Vedi le [note sulle evidenze specifiche del profilo](/it/reference/profiles/community/lenovo-thinksmart-view/).
- [`community-sunworld-yc-sm55p-p76s01.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-sunworld-yc-sm55p-p76s01.yaml): una bozza per Sunworld YC-SM55P da 5.5 pollici di un collaboratore, sulla scheda Portworld P76S01. Il profilo registra l'identità RK3576S supportata dal firmware e percorsi di controllo Android prudenti, ma lascia disabilitati i sensori opzionali e l'hardware della fotocamera fino ai test fisici. La sua identità di build Rockchip generica non è sicura per la selezione automatica. Vedi le [note sulle evidenze specifiche del profilo](/it/reference/profiles/community/sunworld-yc-sm55p/).

Per il formato dei profili, il confine di fiducia e i requisiti per contribuire, vedi la [guida ai profili a runtime](/it/reference/profiles/), il [riferimento del formato](/it/reference/profiles/format/), la [lista di controllo dei test](/it/reference/profiles/testing/) e la [guida alla condivisione](/it/reference/profiles/sharing/).
