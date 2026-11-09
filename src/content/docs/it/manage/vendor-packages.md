---
title: Pacchetti del produttore
description: Impedire a un'app invasiva del produttore di riavviarsi all'avvio e sovrapporsi alla plancia, in modo reversibile e solo per i pacchetti che scegli.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Un aggiornamento del firmware può lasciare sul pannello un'app del produttore che si riavvia all'accensione e disegna un widget mobile sopra la plancia. Sul Sonoff NSPanel Pro 120, ad esempio, un aggiornamento del firmware ha lasciato `com.eWeLinkControlPanel` in avvio automatico, con un widget di controllo sovrapposto a qualsiasi contenuto mostrato dal pannello. L'app del pannello può neutralizzare pacchetti di questo tipo, ma solo quelli che indichi.

## Cosa fa

Per ogni pacchetto che limiti, l'app del pannello applica tre azioni privilegiate e reversibili, ripetendole a ogni avvio:

| Passaggio                             | Meccanismo                                  | Effetto                                                                                    |
| ------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Arresto forzato                       | `am force-stop <pkg>`                       | Arresta subito l'app, facendo scomparire immediatamente il widget.                         |
| Disabilitazione dell'avvio automatico | `pm disable-user --user 0 <pkg>`            | Impedisce il riavvio dell'app alla prossima accensione. Reversibile con `pm enable <pkg>`. |
| Blocco delle sovrapposizioni          | `appops set <pkg> SYSTEM_ALERT_WINDOW deny` | Rimuove il permesso di disegnare una finestra mobile sopra la plancia.                     |

Tutte e tre sono azioni privilegiate, quindi la funzione richiede **root o l'[helper root](https://github.com/panel-assistant/android/blob/main/helper/README.md)**. Funziona quindi anche sui pannelli che isolano il root, come il [Tuya TPA10](/it/hardware/panels/tuya/tpa10/), dove le azioni passano tramite i comandi `STOP`, `DISABLE` e `OVERLAY` dell'helper.

## Come usarla

Si gestisce **nell'interfaccia web del pannello stesso**, nella scheda **Installa**, non da Home Assistant. È un'operazione da eseguire una volta durante la configurazione del pannello o dopo un aggiornamento del firmware, non qualcosa da attivare quotidianamente, quindi non appartiene a una plancia.

Usa **Visita** nella pagina del dispositivo del pannello in Home Assistant, apri **Installa** e trova la scheda **Pacchetti del produttore** (ad esempio, `http://<panel-ip>:8888/install` con la porta predefinita).

Premi **Trova un pacchetto…** per aprire un elenco delle app sul pannello che potresti voler controllare, raggruppate per facilitare la scelta:

- **Consigliati per questo pannello**: le app invasive del firmware note per il tuo hardware, le prime scelte sicure. Su un pannello con un profilo hardware noto, come NSPanel Pro, qui compare `com.eWeLinkControlPanel`. Ogni voce contiene **tag** (ad esempio `vendor` per le app del produttore del pannello, `chipset` per le app di fabbrica e di test del produttore del chip, `overlay`, `boot`) e una breve **nota** dell'autore del profilo che spiega di cosa si tratta e perché è segnalata: puoi così distinguere un'app Sonoff con sovrapposizioni da un'innocua app di test Rockchip rimasta nell'immagine.
- **Altre app**: app sul pannello che non fanno parte dei componenti di base di Android. Su un pannello senza un profilo noto, è qui che puoi cercare i componenti aggiuntivi del produttore con una voce nel launcher o l'autorizzazione a mostrare contenuti in sovrapposizione. Se un pacchetto non è elencato, puoi inserirne direttamente il nome.
- **Maggiore utilizzo della CPU**: ciò che usa più CPU in questo momento. Limita solo app che riconosci.

Ogni voce ha un pulsante **Controlla**, e puoi anche digitare direttamente il nome di un pacchetto nella casella se lo conosci. **Controlla** agisce immediatamente, senza un salvataggio separato, e viene riapplicato a ogni avvio. Un pacchetto limitato o già disabilitato mostra invece **Riabilita**, che annulla l'operazione. La scheda elenca i pacchetti che hai selezionato per limitarli, ciascuno con un pulsante **Riabilita**.

Nessun pacchetto viene limitato finché non premi un pulsante Controlla. Senza root o l'helper, la scheda rimane visibile ma bloccata, con una spiegazione dell'accesso mancante.

## Sicurezza

- **Reversibile.** La disabilitazione viene annullata con `pm enable <pkg>`, oppure da un aggiornamento di quell'app o del firmware. Qui nulla è distruttivo: nessuna disinstallazione e nessuna cancellazione dei dati.
- **I pacchetti critici vengono rifiutati.** L'app del pannello non arresterà né disabiliterà mai l'interfaccia di sistema, Impostazioni, la telefonia, il framework Android o sé stessa, anche se ne indichi uno. Sia l'app sia l'helper privilegiato impongono questo vincolo, quindi un errore di battitura non può rendere inutilizzabile il pannello.
- **Vengono modificati solo i pacchetti installati che indichi.** Rimuovere dall'elenco desiderato un pacchetto gestito dall'app del pannello lo riabilita e ripristina il permesso di sovrapposizione salvato. Anche **Riabilita** annulla la limitazione.

:::caution
Stai scegliendo pacchetti da disabilitare, quindi limitati al software del produttore che riconosci. Disabilitare qualcosa da cui dipende il pannello, come un launcher del produttore che usi davvero o un metodo di inserimento, può rendere difficile navigare nel pannello finché non lo riabiliti tramite `adb`. In caso di dubbio, non modificarlo.
:::
