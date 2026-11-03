---
title: Dimensionamento del display
description: Adattare le dimensioni di una plancia Home Assistant su un pannello al suo aspetto in un browser desktop, regolando densità e dimensione del testo.
sourceCommit: 33ce23572aefb327319703efb255e5129b71ecbf
---

Una plancia di Home Assistant progettata in un browser desktop viene spesso visualizzata con dimensioni errate su un pannello a parete con Android: le schede sono troppo grandi e hanno i bordi tagliati, oppure sono troppo piccole. Su un telefono la visualizzazione rimane di solito sostanzialmente in linea con quella desktop, ma sui pannelli spesso non è così, perché i produttori li forniscono con una densità di sistema e un fattore di scala dei caratteri poco adatti allo schermo fisico. L'app del pannello ti offre due controlli, **Densità logica (dpi)** e **Dimensioni del testo**, in **Installa** e poi in **Dimensioni dello schermo**, per riportare in linea la disposizione e il testo. Di solito servono entrambi.

:::caution[Sperimentale]
I controlli funzionano, ma i valori corretti per ciascun pannello non sono ancora definiti. Considera densità e dimensione del testo come qualcosa con cui sperimentare, anziché una funzionalità definitiva. Sono gradite segnalazioni sui valori che funzionano bene per un determinato pannello.
:::

## Come usarlo

Il riquadro **Dimensioni dello schermo** nella scheda **Installa** del pannello imposta una densità logica e dimensioni del testo personalizzate, le applica in tempo reale oppure ripristina la densità di base di fabbrica di Android. Entrambe le impostazioni vengono mantenute dopo un riavvio, perché sono impostazioni di sistema di Android.

:::note
Questo richiede un metodo di accesso privilegiato approvato: normalmente il `su` del produttore o l'[helper root](https://github.com/panel-assistant/android/blob/main/helper/README.md). Anche un pannello compatibile senza root, il cui accesso avanzato facoltativo sia già stato approvato sul pannello, può effettuare queste precise modifiche al display. Quando nessun metodo supportato è pronto, la scheda rimane visibile ma bloccata.
:::

Per regolarlo, apri la stessa plancia in un browser desktop come riferimento. Riduci la densità finché la disposizione corrisponde (entrano più schede), poi ritocca la dimensione del testo finché anche il testo corrisponde. I valori adatti dipendono dall’installazione oltre che dal modello: dalla risoluzione del pannello, dalla distanza a cui si trovano le persone e da come è progettata la plancia.

Alcuni modelli supportati includono una densità consigliata e, nella maggior parte di questi casi, anche una dimensione del testo. Quando Panel Assistant configura un pannello di questo tipo senza un metodo di accesso privilegiato, applica questi valori una sola volta tramite la connessione ADB; rimuovendo l’app tramite Panel Assistant vengono ripristinati i valori precedenti.

## I due controlli

| Controllo                | Cosa modifica                                                                                                                                                                                                                                                    | Meccanismo                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Densità logica (dpi)** | L'intera disposizione. L'area di visualizzazione effettiva in dp è `physical px ÷ (density / 160)`. Una densità più bassa permette di visualizzare più elementi, avvicinandosi all'area di visualizzazione più ampia di un desktop; una più alta li ingrandisce. | `wm density <n>`                     |
| **Dimensioni del testo** | Il testo nella plancia. La scala del carattere di sistema di Android diventa il `textZoom` della WebView (`textZoom = scale × 100`).                                                                                                                             | `settings put system font_scale <f>` |

L'output di `wm density` di Android chiama il valore di base di fabbrica `Physical density`. Questa etichetta è fuorviante: è la densità usata da Android per la disposizione quando si rimuove un'impostazione personalizzata, non una misura dei pixel per pollice del display. L'app del pannello la indica come **base di fabbrica** e mostra un PPI fisico solo per i profili hardware le cui dimensioni dello schermo sono state verificate indipendentemente.

Modificare soltanto la densità ridimensiona la disposizione, ma può lasciare il testo di dimensioni errate rispetto al desktop; la scala del carattere corregge il testo. Regolare entrambi i valori insieme è ciò che allinea un pannello al browser in cui è stata progettata la plancia.
