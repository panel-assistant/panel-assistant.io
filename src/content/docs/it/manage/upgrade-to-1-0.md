---
title: Aggiornare alla versione 1.0
description: Passare con Home Assistant e i pannelli da Panel Assistant 0.9 a 1.0, e cosa significa tornare indietro.
sourceCommit: 45ad784a56e8c07917f0c76636d2b389a610b982
---

Panel Assistant 1.0 e l'app del pannello 1.0 si aggiornano insieme. L'integrazione 1.0 comunica solo con l'app del pannello 1.0, e l'app del pannello 1.0 comunica solo con l'integrazione 1.0: nessuna delle due funziona quindi con una controparte 0.9. Aggiorni prima l'integrazione, poi ogni pannello da Home Assistant, e **un pannello che esegue l'app 1.0 non può tornare alla 0.9**. Leggi tutta la pagina prima di iniziare. Le [note di rilascio della 1.0.0](/it/release-notes/#panel-assistant-100) elencano tutte le modifiche.

## Prima di iniziare

**Completa tutto ciò che deve fare la versione 0.9.0.** Esegui Panel Assistant **0.9.0** e apri **Impostazioni**, **Riparazioni**. Panel Assistant 1.0 non può più migrare un pannello da MQTT o un pannello che esegue ancora la vecchia app ha-paneld, quindi lascia entrambi invariati. Se la versione 0.9.0 segnala una di queste condizioni per un tuo pannello, segui la relativa Riparazione finché il pannello non è stato migrato; [Migrare un pannello da MQTT](/it/home-assistant/move-from-mqtt/) spiega la parte MQTT. Se esegui una versione di Panel Assistant precedente alla 0.9.0, aggiorna prima alla 0.9.0 e lasciale completare il lavoro.

**Crea un backup di Home Assistant.** In **Impostazioni**, **Sistema**, **Backup**, crea un backup e conservalo finché ogni pannello non esegue la versione 1.0 e sei soddisfatto del funzionamento. È il tuo modo di tornare indietro per la parte Home Assistant.

**Conserva un backup di ogni pannello.** Nell'interfaccia web di ogni pannello, apri **Installa**, poi **Backup**, e conserva il file `.hpb` scaricato. Panel Assistant salva anche le impostazioni del pannello prima di ogni aggiornamento, ma la tua copia è quella che puoi ripristinare autonomamente.

## 1. Aggiorna l'integrazione

Su Home Assistant **2026.11 o successivo**, installa l’aggiornamento di Panel Assistant da **Impostazioni**, **Aggiornamenti**. Sulle versioni precedenti supportate, da **2026.8.3 a 2026.10**, scarica l’aggiornamento in HACS. Poi riavvia Home Assistant per caricare la nuova integrazione, seguendo la Riparazione di riavvio o la richiesta di HACS. [Installa l’integrazione](/it/home-assistant/custom-integration/#updates-and-pre-releases) spiega come ricevere pre-release più recenti sia in Marketplace sia in HACS.

## 2. Controlla le Riparazioni

Dopo il riavvio, apri nuovamente **Impostazioni**, **Riparazioni**.

- **«… richiede l'app 1.0.0-rc1»** è previsto per ogni pannello che esegue ancora un'app 0.9. Finché non viene aggiornato, Home Assistant non può vedere o controllare quel pannello e le sue entità risultano non disponibili. Il pannello stesso continua a funzionare, con le proprie impostazioni e la propria cronologia.
- **«… non può ricevere aggiornamenti dell'app»** significa che Panel Assistant non dispone di un modo per installare su quel pannello, solitamente dopo una modifica sul pannello stesso, come un aggiornamento del firmware o un ripristino. Riconnetti il pannello a Panel Assistant tramite USB, come descritto in **Scopri di più** nella Riparazione, e l'aggiornamento diventa disponibile. Non viene rimosso nulla: su un pannello che ha già l'app, il programma di installazione USB non installa nulla e consente soltanto a Panel Assistant di raggiungerlo nuovamente.
- **«… non è mai stato migrato da MQTT»** o **«… esegue ancora la vecchia app»** significa che una migrazione non è stata completata nella versione 0.9.0. Vedi [Se una migrazione non è stata completata](#se-una-migrazione-non-è-stata-completata).

## 3. Aggiorna un pannello, poi gli altri

Quando viene pubblicata la versione dell'app del pannello 1.0, l'entità di aggiornamento di ogni pannello in Home Assistant la propone. Installala prima su un pannello e usalo per un po' prima di installarla sugli altri, perché quel pannello non può tornare indietro. Panel Assistant esegue il backup delle impostazioni del pannello, installa l'aggiornamento e conferma che il pannello sia tornato a funzionare correttamente, come descritto in [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/). Le impostazioni vengono mantenute dall'app del pannello 0.9.

## Tornare indietro

Ci sono due parti, e sono diverse.

**Un pannello con l'app 1.0 rimane alla 1.0.** L'app del pannello rifiuta di installare una versione precedente su sé stessa, Panel Assistant non ne propone mai una e un'integrazione 0.9 non può comunicare con essa. Se un pannello 1.0 non funziona correttamente, consulta [Risoluzione dei problemi](/it/manage/troubleshooting/), poi segnala il problema con un [rapporto di supporto](/it/home-assistant/support-report/) perché possa essere corretto nella release candidate successiva.

**L'integrazione può tornare indietro finché nessun pannello esegue la versione 1.0.** Ripristina il backup di Home Assistant creato prima di iniziare. Questo annulla anche qualsiasi altra modifica effettuata in Home Assistant dalla creazione del backup. I pannelli sono ancora sulla propria app 0.9 e si riconnettono alla 0.9.0. Quando un qualsiasi pannello esegue l'app 1.0, il ripristino del backup rende quel pannello irraggiungibile da Home Assistant finché l'integrazione non torna alla versione 1.0.

Non tornare indietro installando la 0.9.0 sulla 1.0 tramite Marketplace o HACS. L'aggiornamento 1.0 rimuove un'impostazione su cui si basa la 0.9.0 e, senza di essa, la 0.9.0 rimanda a MQTT i pannelli già migrati, dove l'app del pannello 1.0 non risponde più. Ripristina invece il backup.

## Se una migrazione non è stata completata

Se la versione 1.0 ti dice che un pannello non è mai stato migrato da MQTT o esegue ancora la vecchia app, segui i passaggi di ripristino sicuro della Riparazione per completare la migrazione con Panel Assistant 0.9.0 e poi tornare alla 1.0. Non installare la 0.9.0 sulla 1.0 tramite Marketplace o HACS. Finché nessuno dei pannelli esegue ancora l'app 1.0, torna alla 0.9.0 ripristinando il backup di Home Assistant creato prima dell'aggiornamento, per il motivo indicato sopra. Poi completa la migrazione nella 0.9.0 e ricomincia questa pagina. Se altri pannelli eseguono già l'app 1.0, o non hai un backup precedente all'aggiornamento, chiedi su [Discord](https://panel-assistant.io/go/discord) o nelle [segnalazioni](https://github.com/panel-assistant/ha-integration/issues) prima di cambiare qualsiasi cosa.

Per un pannello ancora su MQTT, la Riparazione offre anche di ricominciare da zero: elimina il dispositivo del pannello nell'integrazione MQTT e aggiungi nuovamente il pannello. Questo crea nuove entità e non conserva alcuna cronologia.
