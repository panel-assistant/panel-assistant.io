---
title: Connetti un pannello
description: Mostrare la tua plancia sul pannello e come l'hardware del pannello stesso appare in Home Assistant.
sourceCommit: 72865c3dcae1e1938e0e4d130db4f6f429002ee5
---

Un pannello aggiunto a Home Assistant si connette in due modi. Uno mostra una plancia sullo schermo. L'altro porta l'hardware del pannello stesso al suo interno come entità.

## La plancia sullo schermo

Scegli la plancia nella procedura guidata di configurazione del pannello quando lo aggiungi. Per cambiarla in seguito, seleziona **Visita** nella pagina del dispositivo del pannello in Home Assistant per aprire la sua pagina di stato, e scegline un’altra. Il pannello carica autonomamente quella plancia. Con il [filtro delle entità abilitato](/it/manage/performance/), apprende quali entità usa la plancia e richiede a Home Assistant solo quelle. I dettagli su come viene caricata la plancia e su cosa fa il pannello se il caricamento non riesce si trovano nella pagina del [renderer integrato](/it/manage/built-in-renderer/).

## L'hardware del pannello in Home Assistant

Lo schermo, i LED, i pulsanti, i sensori e i relè presenti nel tuo modello appaiono in Home Assistant come entità del dispositivo del pannello, così un pulsante fisico può attivare un'automazione e un LED può mostrare lo stato di qualsiasi cosa. Le entità disponibili dipendono dal profilo hardware del modello; le [pagine hardware](/it/hardware/) indicano cosa espone ciascun pannello.

## La pagina di stato del pannello

Seleziona **Visita** nella pagina del dispositivo del pannello in Home Assistant per aprire la sua pagina di stato. Ogni pannello fornisce questa pagina sulla tua rete locale, usando per impostazione predefinita la porta **8888** (ad esempio, `http://<panel>:8888/`). È dove scegli la plancia, vedi cosa sta facendo il pannello e leggi il suo rapporto diagnostico. È progettata per una rete domestica fidata, quindi tratta l'accesso a questa pagina come l'accesso al pannello stesso. Il [riferimento API](/it/reference/api/) e la [modalità di sicurezza](/it/manage/security-mode/) ne descrivono le funzionalità e il modello di fiducia.
