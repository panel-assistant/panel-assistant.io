---
title: Dimensionamento del display
description: Adattare le dimensioni di una plancia Home Assistant su un pannello al suo aspetto in un browser desktop, regolando densità e dimensione del testo.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Una plancia Home Assistant progettata in un browser desktop viene spesso visualizzata con dimensioni errate su un pannello Android a parete: schede troppo grandi con bordi tagliati, oppure troppo piccole. Un telefono di solito mantiene dimensioni sostanzialmente coerenti con il desktop, ma spesso i pannelli no, perché i produttori impostano una densità di sistema e una scala del carattere poco adatte al display fisico. L'app del pannello offre due controlli, **densità (DPI)** e **dimensione del testo (scala del carattere)**, in **Installa**, poi **Dimensionamento del display**, per riallineare la disposizione e il testo. Solitamente servono entrambi.

:::caution[Sperimentale]
I controlli funzionano, ma i valori corretti per ciascun pannello non sono ancora definiti. Considera densità e dimensione del testo come qualcosa con cui sperimentare, anziché una funzionalità definitiva. Sono gradite segnalazioni sui valori che funzionano bene per un determinato pannello.
:::

## Come usarlo

La scheda **Dimensionamento del display** nella scheda **Installa** del pannello imposta una densità logica e una dimensione del testo personalizzate, le applica immediatamente oppure ripristina la densità di base di fabbrica di Android. Entrambe le impostazioni vengono mantenute dopo un riavvio, perché sono impostazioni di sistema di Android.

:::note
Questo richiede un metodo di accesso privilegiato approvato: normalmente il `su` del produttore o l'[helper root](https://github.com/panel-assistant/android/blob/main/helper/README.md). Anche un pannello compatibile senza root, il cui accesso avanzato facoltativo sia già stato approvato sul pannello, può effettuare queste precise modifiche al display. Quando nessun metodo supportato è pronto, la scheda rimane visibile ma bloccata.
:::

Per regolarlo, apri la stessa plancia in un browser desktop come riferimento. Riduci la densità finché la disposizione corrisponde (entrano più schede), poi ritocca la dimensione del testo finché anche il testo corrisponde. I valori adatti dipendono dall'installazione (la risoluzione del pannello, la distanza a cui si trovano le persone, il modo in cui è progettata la plancia), anziché dal modello: per questo non vengono forniti valori standard.

## I due controlli

| Controllo                                      | Cosa modifica                                                                                                                                                                                                                                                    | Meccanismo                           |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Densità (DPI)**                              | L'intera disposizione. L'area di visualizzazione effettiva in dp è `physical px ÷ (density / 160)`. Una densità più bassa permette di visualizzare più elementi, avvicinandosi all'area di visualizzazione più ampia di un desktop; una più alta li ingrandisce. | `wm density <n>`                     |
| **Dimensione del testo (scala del carattere)** | Il testo nella plancia. La scala del carattere di sistema di Android diventa il `textZoom` della WebView (`textZoom = scale × 100`).                                                                                                                             | `settings put system font_scale <f>` |

L'output di `wm density` di Android chiama il valore di base di fabbrica `Physical density`. Questa etichetta è fuorviante: è la densità usata da Android per la disposizione quando si rimuove un'impostazione personalizzata, non una misura dei pixel per pollice del display. L'app del pannello la indica come **base di fabbrica** e mostra un PPI fisico solo per i profili hardware le cui dimensioni dello schermo sono state verificate indipendentemente.

Modificare soltanto la densità ridimensiona la disposizione, ma può lasciare il testo di dimensioni errate rispetto al desktop; la scala del carattere corregge il testo. Regolare entrambi i valori insieme è ciò che allinea un pannello al browser in cui è stata progettata la plancia.
