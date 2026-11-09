---
title: Sicurezza dell'installazione
description: Cosa controlla Panel Assistant prima di modificare un pannello, perché è sicuro ripetere un’installazione interrotta e cosa salva prima di un aggiornamento.
sourceCommit: 761d6a72fee28ab8639a6dca9fa60452d2cb5ff7
---

Panel Assistant installa e aggiorna i pannelli da Home Assistant ed è progettato perché un’installazione dia lo stesso risultato sia eseguendola una sola volta sia ripetendola dopo un’interruzione. Questa pagina descrive cosa controlla e cosa conserva.

## Controlli prima di qualsiasi modifica

Entrambi i programmi di installazione esaminano il pannello prima di modificarlo. Quello di rete controlla cosa è già presente e ti chiede di confermare l’installazione; un pannello che esegue già l’app del pannello viene adottato anziché reinstallato. Il programma di installazione USB non sovrascrive un’altra installazione esistente: se è già installata esattamente la build selezionata, ne completa la configurazione; se è installata un’altra build, la ricollega a Panel Assistant senza installare un aggiornamento.

La versione proviene dal tuo Home Assistant. Home Assistant la controlla prima di passarla al programma di installazione: al pannello non arriva nulla che Home Assistant non abbia verificato. [Installare via USB](/it/install/install-over-usb/) e [Aggiungere un pannello](/it/install/installing-ha-paneld/) descrivono i due percorsi.

## Si può ripetere in sicurezza

Un’installazione che si ferma a metà può essere ripetuta. Via USB, il programma di installazione conserva l’avanzamento nel browser, controlla il passaggio interrotto prima di fare altro e riprende da lì anziché ricominciare. Via rete, aggiungere di nuovo il pannello con lo stesso indirizzo fa sì che Home Assistant lo ricontrolli prima di modificare qualsiasi cosa; se l’app del pannello è già installata, Home Assistant la collega senza installare nulla.

Quando Home Assistant non riesce a stabilire fin dove sia arrivata l’installazione, si ferma anziché tirare a indovinare e lo indica nel messaggio. La [risoluzione dei problemi](/it/manage/troubleshooting/#uninstallazione-di-rete-si-è-interrotta) spiega ogni messaggio e cosa fare dopo.

## Backup prima di ogni aggiornamento

Panel Assistant salva le impostazioni del pannello prima di ogni aggiornamento e conserva gli ultimi cinque backup per ciascun pannello. Dopo l’aggiornamento conferma che il pannello sia tornato a funzionare correttamente.

Prima di una modifica di cui non sei sicuro, e sempre prima di rimuovere l’app o cancellarne i dati, esegui tu stesso un backup completo: nell’interfaccia web del pannello apri **Installa**, poi **Backup**, e verifica che il file `.hpb` scaricato non sia vuoto. Contiene le impostazioni, lo stato persistente del pannello, il catalogo dei profili e un accesso idoneo conservato da un’app per le plance separata. Il catalogo delle entità apprese e le cronologie di prossimità e ambiente vengono appresi di nuovo anziché ripristinati. Ripristina il backup da **Installa**, poi **Ripristina**, nella stessa pagina.

## Cosa Panel Assistant lascia intatto

Panel Assistant non riscrive il firmware di un pannello né gli dà accesso root, e non tocca mai il suo firmware. Il backup e il ripristino del firmware su alcuni pannelli con root sono un’operazione manuale separata, descritta in [backup e ripristino del firmware](/it/hardware/guides/firmware-backup-and-restore/). [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/) descrive cosa si può recuperare quando qualcosa va storto.
