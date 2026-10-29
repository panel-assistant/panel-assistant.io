---
title: Riferimenti
description: Riferimenti tecnici per l'app del pannello, con le sue entità Home Assistant, i profili dei dispositivi, la sicurezza e la compilazione.
sidebar:
  label: Panoramica
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Queste pagine documentano il funzionamento interno dell'app del pannello: le interfacce che espone, il formato dei profili che descrive ogni modello di pannello e le decisioni di sicurezza alla base di entrambi. Non sono necessarie per installare o usare Panel Assistant.

## Interfacce

- [Riferimenti per il controllo e Home Assistant](/it/reference/api/): le entità e i servizi per automatizzare un pannello e le pagine e gli endpoint del pannello sulla sua porta HTTP (8888 per impostazione predefinita).
- [Sicurezza](/it/reference/security/): il modello di fiducia, la superficie di attacco e le decisioni prese.

## Profili dei dispositivi

- [Profili dei pannelli a runtime](/it/reference/profiles/): cos'è un profilo e come scriverlo, provarlo e attivarlo.
- [Formato e compatibilità dei profili](/it/reference/profiles/format/): il riferimento completo dei campi dello schema 2.
- [Test e risoluzione dei problemi dei profili](/it/reference/profiles/testing/): una sequenza graduale di test hardware e passaggi di ripristino.
- [Condividere e contribuire profili](/it/reference/profiles/sharing/): provenienza, scambio sicuro e requisiti per l'inclusione.
- [Architettura dei profili dei dispositivi](/it/reference/profiles/architecture/): come l'app risolve, abbina e attiva i profili.
- [Profili della comunità](/it/reference/profiles/community/): profili per pannelli che l'app non include.
  - [Echo Show 5 Gen 2 (LineageOS)](/it/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/it/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/it/reference/profiles/community/sunworld-yc-sm55p/)

## Il codice

- [Ambiente di sviluppo](/it/reference/development-environment/): gli strumenti, gli script di compilazione e cosa deve sapere un fork riguardo alla firma.
- [Visita guidata del codice su DeepWiki](https://deepwiki.com/panel-assistant/android): un percorso guidato nel codice sorgente di ha-paneld.
