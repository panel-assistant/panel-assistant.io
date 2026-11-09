---
title: La gara di velocità
description: Due pannelli a parete identici, la stessa plancia, gli stessi tocchi nello stesso istante. Uno esegue l'app Home Assistant Companion come fornita sul pannello; l'altro esegue Panel Assistant. Misure, filmati e perché la latenza conta più del cronometro.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Due pannelli Sonoff NSPanel Pro 86 affiancati sulla stessa istanza Home Assistant, ognuno con una copia identica della stessa plancia. Uno script tocca entrambi gli schermi nello stesso istante, pagina dopo pagina, e un orologio sotto ogni pannello si ferma quando quello schermo ha risposto. Il pannello a sinistra esegue l'app Home Assistant Companion sul motore web fornito dal firmware del pannello. Quello a destra esegue Panel Assistant sul motore web che installa autonomamente. Poi i pannelli si scambiano i ruoli e la gara viene ripetuta, così la velocità propria di nessun pannello può influenzare il risultato.

## Rendering: circa il doppio della velocità

![Filmato A: il primo pannello con l'app Companion, il secondo con Panel Assistant, in gara nello stesso istante](/screenshots/drag-race-film-a.gif)

Sette tocchi: tre cambi di pagina, un ritorno alla pagina iniziale e tre tocchi su una scheda luce. Tre prove per ciascuna disposizione; i filmati mostrano la prova mediana e i pannelli si scambiano i ruoli tra i due filmati.

|                                                              | App Companion, motore web del firmware | Panel Assistant, il proprio motore web |
| ------------------------------------------------------------ | -------------------------------------- | -------------------------------------- |
| Prima disposizione, mediana di tre prove                     | 11.7 s                                 | 6.4 s                                  |
| Seconda disposizione, pannelli scambiati                     | 14.3 s                                 | 6.1 s                                  |
| Processore usato dai processi di disegno                     | Da 1.3 a 1.5 core                      | Da 0.4 a 0.6 core                      |
| Frequenza dei fotogrammi della pagina della plancia a riposo | 5 fotogrammi al secondo                | 59 fotogrammi al secondo               |
| Entità monitorate dalla pagina                               | 4,118                                  | 54                                     |

La pagina della plancia con Panel Assistant monitora solo le entità che mostra. Con l'app Companion riceve ogni cambiamento di stato della casa, migliaia di entità, e passa la maggior parte del tempo a elaborarli. Ecco perché la stessa pagina viene disegnata a cinque fotogrammi al secondo su un pannello e sessanta sull'altro, e perché i processi di disegno consumano due volte e mezzo il processore.

![Filmato B: i pannelli scambiati, il secondo con l'app Companion, il primo con Panel Assistant](/screenshots/drag-race-film-b.gif)

## Latenza: il vero problema

Il doppio della velocità sul cronometro è un miglioramento modesto. Non è ciò che noti sulla parete. Quello che noti è il momento in cui premi un pulsante e non succede nulla.

Premi. Ti aspetti che qualcosa cambi. Dopo oltre mezzo secondo senza reazione pensi di aver mancato il pulsante e premi di nuovo. Ora arrivano entrambe le pressioni: la luce si accende e si spegne subito, oppure arriva la pagina che avevi chiesto e viene sostituita da quella richiesta dalla seconda pressione. Hai fatto tutto correttamente e hai ottenuto l'opposto di ciò che volevi. Un pannello così non è lento: è inutilizzabile e, dopo una settimana, nessuno in casa si fida più.

![La doppia pressione: lo stesso tocco sulla stessa luce su entrambi i pannelli, con la regola umana di toccare nuovamente dopo un secondo senza reazione](/screenshots/drag-race-double-press.gif)

Gli stessi due pannelli, la stessa scheda luce, la luce spenta su entrambi. Un dito tocca la luce e segue la regola che segue chiunque: se dopo un secondo non è cambiato nulla, tocca di nuovo, fino a tre volte.

|                                              | App Companion, motore web del firmware                                        | Panel Assistant, il proprio motore web |
| -------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------- |
| Luce visibilmente accesa dopo il primo tocco | 15.2 s, dopo tre tocchi                                                       | 0.3 s, dopo un tocco                   |
| Le altre due riprese                         | 7 s dopo un tocco; pagina ancora in caricamento, tre tocchi, nessun risultato | 0.3 s dopo un tocco, ogni volta        |

Quindici secondi non sono un pannello lento. Sono un pannello a cui hai rinunciato e da cui ti sei allontanato, e la luce si accende alle tue spalle. La pagina con l'app Companion non era guasta: era impegnata a elaborare il flusso di stati di tutta la casa su un pannello a quattro core, e il tocco aspettava il proprio turno dietro quel lavoro. La pagina di Panel Assistant doveva occuparsi solo delle proprie entità, quindi il tocco è stato gestito subito.

## Come sono state effettuate le misure

- Due pannelli Sonoff NSPanel Pro 86 (Rockchip PX30 a quattro core, schermi 480 per 480) su un'unica istanza Home Assistant di produzione con circa 4,100 entità e circa 20 cambiamenti di stato al secondo.
- Due copie di una plancia, identiche tranne per la luce associata a una scheda, così che i due pannelli non si contendano mai una singola entità.
- L'app Companion 2026.6.5 sul motore web del firmware, Chromium 107, che è ciò che esegue ancora la maggior parte dei pannelli installati. Panel Assistant su Chromium 138, il motore web compatibile usato per queste prove.
- Tocchi iniettati come eventi grezzi dello schermo nello stesso istante su entrambi i pannelli. Ogni passaggio registrato dal pannello stesso; il cronometro parte dal tocco e si ferma quando lo schermo smette di cambiare. Un passaggio che sta ancora cambiando quando termina il suo filmato invalida la prova.
- Tre prove per ciascuna disposizione, con la prova mediana filmata. Una scheda musicale che scaricava testi da internet è stata rimossa dalla gara, poiché nessuna app del pannello può velocizzare un servizio esterno, e la pagina della fotocamera dal vivo è stata esclusa perché il suo tempo riguarda l'avvio dello streaming invece del lavoro sulla plancia.

Puoi esaminare l'utilizzo della CPU, la reattività della dashboard e il flusso degli stati di Home Assistant del tuo pannello in **Prestazioni** nella sua interfaccia web; vedi [Prestazioni](/it/manage/performance/) per come leggere queste misure.
