---
title: Trasferisci un pannello da MQTT
description: Trasferimento delle entità di un pannello dall'integrazione MQTT di Home Assistant a Panel Assistant, mantenendone gli ID entità, la cronologia e le personalizzazioni.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Panel Assistant 1.0 usa la connessione nativa di Home Assistant e non supporta MQTT. Se le entità del tuo pannello usano ancora MQTT, esegui prima Panel Assistant **0.9.0** affinché possa completare il trasferimento mantenendo gli ID entità, la cronologia e le personalizzazioni. Se hai già aggiornato alla versione 1.0, segui [se un trasferimento non è stato completato](/it/manage/upgrade-to-1-0/#se-una-migrazione-non-è-stata-completata) prima di cambiare versione.

La procedura seguente è una guida storica per le versioni da 0.3 a 0.8 di Panel Assistant. L'opzione **Controllo** non è presente nella versione 1.0.

Trasferisci un pannello alla volta e ogni trasferimento è reversibile. Le entità del pannello mantengono i propri ID entità, la cronologia e qualsiasi nome, icona o area che hai assegnato loro, quindi le plance e le automazioni che le usano continuano a funzionare.

:::caution[Accesso anticipato]
Il trasferimento è una novità. Provalo prima su un pannello e raccontaci com'è andata su [Discord](https://panel-assistant.io/go/discord) o nelle [segnalazioni](https://github.com/panel-assistant/ha-integration/issues).
:::

## Prima di iniziare

- **Panel Assistant dalla versione 0.3.0 alla 0.8** in Home Assistant, installato tramite HACS come descritto in [Installa l'integrazione](/it/home-assistant/custom-integration/).
- **ha-paneld 0.9.8-rc1 o successivo** sul pannello. Installa uno degli aggiornamenti proposti dall'entità di aggiornamento Panel Assistant del pannello in Home Assistant. Se ti serve una versione preliminare che non viene proposta lì, selezionala nella scheda **Installa** dell'interfaccia web del pannello e avvia tu l'installazione.
- **Il pannello ha effettuato l'accesso a Home Assistant**, condizione soddisfatta se mostra la tua plancia.
- **Lascia invariata la tua configurazione MQTT.** Il pannello continua a usare il broker durante il trasferimento e non occorre modificare nulla sul broker.

## 1. Attiva le entità di Panel Assistant

Aggiungi questo a `configuration.yaml`, poi riavvia Home Assistant:

```yaml
panel_assistant:
  native_entities: true
```

Per ora non viene trasferito nulla. Ogni pannello noto a Panel Assistant ottiene un secondo gruppo di entità sul proprio dispositivo Panel Assistant, accanto a quelle MQTT, in modo da poter confrontare i due gruppi. Quando trasferisci un pannello, le sue entità MQTT prendono il posto di questo secondo gruppo.

## 2. Aggiungi il pannello a Panel Assistant

Salta questo passaggio se il pannello compare già sotto Panel Assistant in **Impostazioni**, **Dispositivi e servizi**.

Scegli **Aggiungi integrazione**, poi **Panel Assistant**, poi **Aggiungi un pannello** e inserisci il nome host o l'indirizzo del pannello. Panel Assistant rileva ha-paneld già in esecuzione e propone **Collega a Home Assistant**. Sul pannello non viene reinstallato nulla.

## 3. Conferma l'utente del pannello

Quando il pannello si connette per la prima volta, Home Assistant mostra una riparazione: **Conferma l'utente Home Assistant per** il tuo pannello. Aprila da **Impostazioni**, **Riparazioni**, verifica che l'utente indicato sia l'account con cui il pannello effettua l'accesso e conferma.

Il pannello riprova autonomamente, quindi la riparazione può impiegare fino a 15 minuti per comparire e, dopo la tua conferma, il pannello può impiegare altrettanto tempo per connettersi.

## 4. Trasferisci il pannello

Apri la voce Panel Assistant del pannello in **Dispositivi e servizi**, scegli **Configura**, imposta **Controllo** su **Panel Assistant** e salva.

La voce viene ricaricata e il pannello si riconnette. Le sue entità MQTT vengono trasferite a Panel Assistant e, una volta che il pannello ha confermato il trasferimento, il dispositivo MQTT del pannello viene rimosso. Durante l'assestamento, le entità risulteranno non disponibili per alcuni secondi e poi di nuovo circa 30 secondi dopo. Il registro attività del dispositivo si riempie di cambiamenti di stato man mano che ogni entità comunica il proprio stato; è un comportamento previsto.

Da questo momento in poi, la modifica di un'impostazione o la pressione di un pulsante nelle entità del pannello passa attraverso Panel Assistant. Prima che un pannello venga trasferito, gli stessi comandi rispondono che il pannello è controllato tramite MQTT.

### Cosa non viene trasferito

Due pulsanti MQTT non hanno un equivalente in Panel Assistant, **Update ha-paneld** e **Update Companion app**, quindi vengono rimossi insieme a qualsiasi entità MQTT di aggiornamento per ha-paneld rimasta. Usa l'entità di aggiornamento Panel Assistant del pannello per aggiornare l'app del pannello.

Se hai assegnato a una di queste entità un nome, un'icona o un'area personalizzati, oppure l'hai nascosta o disabilitata, Panel Assistant non la rimuoverà per te. Verrà invece elencata in una riparazione e il pannello manterrà le proprie entità MQTT finché non eliminerai quell'entità o non cancellerai quelle impostazioni.

## Riportare indietro un pannello

Apri di nuovo **Configura** e imposta **Controllo** su **MQTT, con rapporti nativi per il confronto** oppure su **MQTT**. Le entità tornano all'integrazione MQTT con gli stessi ID entità e la stessa cronologia e il pannello annuncia di nuovo il proprio dispositivo MQTT.

Riporta sempre indietro un pannello in questo modo. Non eliminare la voce Panel Assistant di un pannello mentre Panel Assistant lo controlla: Home Assistant cancella le entità di quella voce durante l'eliminazione e, sebbene Panel Assistant le restituisca prima, un'entità personalizzata può perdere il proprio nome, icona o area durante il processo.

## Limitazioni note

- **Alcuni sensori rimangono non disponibili.** Un pannello può offrire entità per sensori per i quali il suo hardware non comunica dati, come prossimità, temperatura o umidità. Sono nuove entità di Panel Assistant, non entità trasferite, quindi disabilitandole non si perde nulla.
- **Versione precedente di ha-paneld su un pannello trasferito.** Se su un pannello trasferito viene successivamente installata una versione precedente alla 0.9.8-rc1, il pannello annuncia di nuovo le proprie entità MQTT. Panel Assistant disabilita i duplicati e genera una riparazione, **Aggiorna ha-paneld**, che scompare una volta aggiornato il pannello.
- **Avvisi di riavvio.** Durante il riavvio di Home Assistant, un pannello il cui account non è un amministratore ne viene comunque informato tramite MQTT, un motivo in più per lasciare il broker in esecuzione per ora.
