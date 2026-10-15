---
title: Capire un rapporto di assistenza
description: Leggi un errore di installazione o aggiornamento di Panel Assistant e condividi il rapporto quando chiedi aiuto.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Quando un'installazione di rete o un aggiornamento dell'app del pannello non riesce, apri la relativa voce in **Impostazioni → Riparazioni** in Home Assistant e scegli **Rapporto di supporto**. Il rapporto conserva i nomi e i valori esatti dei campi in un blocco di testo copiabile. Inizia con `panel_assistant.version` e `panel_assistant.build`, seguiti da `home_assistant.version` e dal Repair ID in `repair.issue_id`. Gli eventi salvati appaiono sotto `events[N]`, dove `N` parte da 0.

Per un'[installazione USB](/it/install/install-over-usb/) non riuscita, apri invece i dettagli di supporto del programma di installazione.

Leggi il rapporto prima di condividerlo. Può contenere l'indirizzo di un pannello, identificatori dei dispositivi, dettagli sulla versione rilasciata e una traccia dell'eccezione. Rimuovi tutto ciò che non vuoi pubblicare in una segnalazione pubblica. Se puoi, mantieni il motivo dell'errore e i dettagli correlati: aiutano a spiegare cosa è successo.

Per ricevere aiuto con un'installazione o un aggiornamento non riuscito, [apri una segnalazione per l'integrazione Home Assistant](https://panel-assistant.io/go/report-issue) e incolla il rapporto nel testo della segnalazione. Aggiungi cosa stavi facendo, cosa ti aspettavi e cosa è successo sul pannello. Se il pannello è raggiungibile, il [download della diagnostica](/it/manage/troubleshooting/) può fornire ulteriore contesto.

## Come leggere i campi

- `events[N]` elenca gli eventi salvati in ordine, a partire da `events[0]`. Un evento successivo può descrivere un nuovo tentativo tenuto in sospeso anziché l'errore originale.
- `kind` indica se l'evento proviene da un tentativo di tipo `install`, `update` o `retry_hold`. `at`, se presente, è l'ora registrata.
- `panel` è il nome visualizzato o l'indirizzo del pannello; `address` è la destinazione di rete usata da Home Assistant. `entry_id` identifica la voce dell'integrazione Home Assistant. `job_id` identifica un tentativo di installazione.
- `reason` è il risultato salvato o il messaggio di errore. Per un'installazione, `receipt.result_code` indica l'esito generale e `receipt.failure_stage` specifica quale passaggio era in corso al momento dell'errore. Un `receipt.result_subcode`, se presente, rende la diagnosi più precisa; il suo valore può cambiare tra una versione rilasciata e l'altra.
- `target_version` e `artifact.*` descrivono la versione rilasciata scelta per un aggiornamento. `receipt.*` contiene la ricevuta di installazione, inclusi i dettagli sulla destinazione e sui passaggi. `exception` è una traccia tecnica; le sue ultime righe spesso indicano l'errore immediato.

Un risultato di installazione `authorization_failed` significa che Home Assistant non ha potuto ottenere il permesso di operare sul pannello. `preflight_rejected` significa che il pannello non ha superato i controlli prima dell'installazione. `artifact_rejected` significa che il file dell'app selezionato non è stato accettato. `transport_failed` significa che la comunicazione con il pannello non è riuscita. `install_failed` e `launch_failed` indicano i passaggi di installazione e di avvio dell'app. `health_check_failed` significa che l'app non ha superato il controllo dopo l'installazione. `ambiguous_mutation` o `verification_required` significa che Home Assistant non ha potuto accertare lo stato del pannello; controlla il pannello prima di un altro tentativo. Un aggiornamento o un nuovo tentativo può invece mostrare un messaggio di errore descrittivo in `reason`.

## Chiedere a un assistente IA di aiutarti a leggerlo

Copia questa istruzione, poi incolla subito dopo il rapporto che hai controllato. Un assistente può spiegare le prove e suggerire verifiche, ma non può conoscere lo stato attuale del pannello dal solo rapporto.

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report is a copyable text block with exact dotted field names and values. It starts with panel_assistant.version and panel_assistant.build, followed by home_assistant.version and the Repair ID in repair.issue_id. Saved install, update, or retry-hold events appear under events[N], starting at events[0]. Each event preserves its original fields and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
