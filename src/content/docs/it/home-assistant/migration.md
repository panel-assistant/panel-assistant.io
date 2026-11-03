---
title: Panel Assistant è obbligatorio
description: Cosa fare quando un pannello indica che Panel Assistant è obbligatorio e come passare da un'app del pannello 0.9 a Panel Assistant 1.0.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Un pannello che mostra **Panel Assistant è obbligatorio** con l'indirizzo di questa pagina esegue un'app del pannello 0.9 che non si è ancora connessa all'integrazione Panel Assistant in Home Assistant. La plancia scelta e le impostazioni del pannello sono ancora sul pannello. Non è necessario reinstallarlo o ripristinarlo.

Panel Assistant 1.0 non può prendere in gestione un pannello che esegue ancora la vecchia app ha-paneld o le cui entità hardware usano ancora MQTT. Un pannello in queste condizioni passa alla versione 1.0 tramite Panel Assistant 0.9.0, che ne esegue prima la migrazione:

1. [Installa l'integrazione Panel Assistant tramite HACS](/it/home-assistant/custom-integration/). Se il tuo pannello esegue ancora la vecchia app o usa MQTT, scegli la versione **0.9.0** prima del primo riavvio; se hai già Panel Assistant 1.0, segui [se una migrazione non è stata completata](/it/manage/upgrade-to-1-0/#se-una-migrazione-non-è-stata-completata) prima di cambiare versione. Riavvia Home Assistant quando HACS te lo chiede.
2. Se il tuo pannello compare già in **Impostazioni → Dispositivi e servizi → Panel Assistant**, non c'è nulla da aggiungere di nuovo. Altrimenti, aggiungi lì il tuo **pannello esistente** usando il suo nome host o indirizzo; non si tratta dell'installazione di un nuovo pannello.
3. Apri **Impostazioni → Riparazioni**. Se Panel Assistant indica che il pannello esegue ancora la vecchia app ha-paneld, segui la relativa Riparazione per migrare il pannello all'app Panel Assistant. Se le entità hardware del pannello usano ancora MQTT, [migrare un pannello da MQTT](/it/home-assistant/move-from-mqtt/) spiega questo passaggio, che la versione 0.9.0 completa.
4. Se hai installato la versione 0.9.0, aggiorna alla 1.0 quando non elenca più alcuna migrazione per nessuno dei tuoi pannelli, come descritto in [aggiornamento alla versione 1.0](/it/manage/upgrade-to-1-0/).

Per assistenza nel trovare l'indirizzo del tuo pannello o verificarne la connessione, consulta [Connettere un pannello](/it/home-assistant/connect-a-panel/) e [Risoluzione dei problemi](/it/manage/troubleshooting/).
