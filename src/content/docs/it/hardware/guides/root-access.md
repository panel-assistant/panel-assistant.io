---
title: Ottenere l'accesso adb e root
description: Come ogni pannello a parete documentato accede ad adb e root, per cosa l'app del pannello usa il root e dove trovare la procedura esatta di ogni modello.
sidebar:
  label: Accesso adb e root
  order: 1
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ogni pannello accede ad adb, e al root quando disponibile, tramite un percorso diverso. Questa pagina offre il quadro generale; i passaggi esatti specifici del firmware sono nella pagina di ciascun pannello.

## A cosa serve il root

L'app del pannello si installa e funziona senza root. Il root serve solo per l'hardware che Android non espone a un'app ordinaria:

- **Nodi sysfs e di input di proprietà di `system`.** Su alcuni pannelli, i LED, la retroilluminazione dei pulsanti e i sensori climatici sono file `system:system`, che un'app isolata non può scrivere o leggere. L'app del pannello comunica quindi con un piccolo daemon helper root, `hapaneld-helper`, tramite un socket Unix. Vedi la [documentazione dell'helper](https://github.com/panel-assistant/android/blob/main/helper/README.md).
- **Spegnimento effettivo della retroilluminazione, riavvio e controllo del governor della CPU.** Senza un percorso root, queste funzioni ripiegano su ciò che Android consente, ad esempio luminosità zero invece di spegnere la retroilluminazione.
- **Relè e linee GPIO**, quando un pannello li espone solo tramite sysfs con root.

L'app del pannello controlla ogni percorso privilegiato quando lo usa: un pannello senza root dispone quindi comunque di plancia, sensori standard, luminosità e navigazione, e una funzionalità che richiede root viene mostrata come non disponibile invece di fallire.

## Percorsi per pannello

- **[Sonoff NSPanel Pro](/it/hardware/panels/sonoff/#ottenere-accesso-adb-e-root).** Una build `userdebug` con chiavi di test e **nessuna password adb**. L'unico ostacolo è raggiungere la modalità sviluppatore, che varia con il firmware eWeLink. Poi esegui `adb root`, rimonta e installa un `su` persistente.
- **[Tuya TPA10](/it/hardware/panels/tuya/tpa10/#ottenere-accesso-adb-e-root).** adb è **protetto da password**. Il percorso affidabile è la backdoor dell'app diagnostica tramite USB, e `su` è già presente. Un breve script rende poi adb di rete persistente tra i riavvii.
- **[Electron WF1589T](/it/hardware/panels/electron/wf1589t/#ottenere-accesso-adb-e-root).** Una build `userdebug` con Google Play. `adb root` funziona direttamente. Il LED è accessibile direttamente dall'app, quindi il root serve raramente.
- **[Electron WF2489T (ZHICAI SMT1019)](/it/hardware/panels/electron/wf2489t/#accesso-root-per-build-firmware).** La build di produzione venduta al pubblico non ha root. La build `userdebug` del fornitore ha root, ma richiede un remount prima che l'helper possa persistere.
- **[SMT156](/it/hardware/panels/electron/smt156/).** Nessun `su` accessibile all'app nell'installazione segnalata. Non sono stati testati `adb root` tramite USB, la modalità ingegneria del produttore e i percorsi di sblocco persistente.
- **[Smatek S9E](/it/hardware/panels/smatek/s9e/).** L'app del produttore esegue comandi root e alcune unità vengono fornite con la modalità sviluppatore sbloccata. È stato segnalato `su` a livello di app sul firmware 1.1.0; l'accesso dipende comunque dall'unità e dal firmware.
- **[Shelly Wall Display](/it/hardware/panels/shelly/).** Su un [Wall Display X2i](/it/hardware/panels/shelly/wall-display-x2i/) testato con firmware di fabbrica 2.5.4, le opzioni sviluppatore e il debug USB si sbloccano dall'app Impostazioni, adb si connette poi senza richiesta di autorizzazione e non c'è root: nessun `su`, e `adb root` non è disponibile. Installare l'app del pannello e usarla quotidianamente non richiede root su quel modello, ma le funzioni privilegiate in questa pagina sì. Gli altri modelli non sono stati testati; il firmware legacy usa come base una build `userdebug`, quindi `adb root` potrebbe funzionare se si riesce a stabilire una connessione adb.

## Prima di modificare qualsiasi cosa

- Fai funzionare adb in modo affidabile, idealmente in rete con la chiave della tua postazione già autorizzata, prima di disabilitare qualsiasi app del produttore. Disabilitare prima un launcher, l'app Impostazioni o un'app hardware del produttore può impedirti di accedere al pannello.
- Mantieni un modo per navigare. Su un pannello senza pulsanti, le azioni di navigazione dell'app del pannello sostituiscono Indietro e Recenti del produttore.
- Arresta il programma di aggiornamento del produttore, se presente, altrimenti un aggiornamento via rete può annullare le modifiche. Vedi [Bloccare gli aggiornamenti indesiderati](/it/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Crea un backup delle partizioni prima di modificare il firmware su un pannello Rockchip con root. Vedi [Backup e ripristino del firmware](/it/hardware/guides/firmware-backup-and-restore/).
- Alcuni percorsi richiedono `adb disable-verity`, che riavvia il pannello. Un pannello protetto da PIN non può riavviare le proprie app dopo un riavvio finché qualcuno non inserisce il PIN: devi quindi essere davanti al pannello.
