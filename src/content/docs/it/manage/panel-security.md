---
title: Account del pannello e sicurezza della rete
description: Scegli l'account Home Assistant usato dal pannello e pianifica il suo accesso alla rete.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

## Quale account Home Assistant usa il pannello?

Quando aggiungi un nuovo pannello da Panel Assistant, il suo accesso tramite browser usa normalmente l'account Home Assistant già connesso sul computer. Se è il tuo account amministratore, il pannello accede come quell'amministratore. Panel Assistant non chiede la tua password e non crea un altro utente Home Assistant. Il pannello conserva il proprio accesso a Home Assistant per poter caricare la tua plancia e comunicare con Home Assistant come quell'utente.

Usare il tuo account abituale va bene, soprattutto se la tua installazione di Home Assistant ha un solo utente. Un utente **esistente** separato è utile se vuoi distinguere l'accesso del pannello dal tuo account amministratore. Un utente non amministratore può usare le plance senza avere accesso alle impostazioni di Home Assistant. Un account separato è facoltativo; Panel Assistant non ne crea uno durante la configurazione.

Home Assistant salva inoltre una plancia e un tema predefiniti per ciascun utente. Un utente del pannello può avere una plancia a parete e un aspetto propri senza modificare le scelte sul telefono o sul computer. Il renderer integrato usa quella plancia predefinita quando **Plancia iniziale** è impostata su **Auto**; una plancia selezionata nelle impostazioni del pannello ha la precedenza. L'impostazione **Tema della plancia** può richiedere la modalità chiara o scura, mentre una scelta esplicita del tema di Home Assistant mantiene la precedenza.

Puoi assegnare all'utente del pannello voci e ordine della barra laterale, lingua, fuso orario e formati di numeri, date e ore propri in **Home Assistant → Profilo utente → Generale**. Le preferenze della barra laterale contano quando la barra è visibile; il pannello nasconde la navigazione per impostazione predefinita. Nascondere una voce della barra laterale non ne limita l'accesso. Vedi la [guida al profilo utente di Home Assistant](https://www.home-assistant.io/docs/configuration/user-configuration/) per queste impostazioni dell'account.

### Cambiare l'accesso del pannello

In Home Assistant, apri **Panel Assistant**, seleziona il pannello, poi apri la sua scheda **Configura**. In **Accesso tramite browser**, scegli **Riconnetti** e **Copia link**. Apri quel link in una finestra privata del browser, accedi a Home Assistant come l'utente esistente che vuoi far usare al pannello e lascia che il browser ritorni al pannello. Una finestra privata aiuta quando il browser abituale è già connesso come amministratore. Puoi anche aprire **Configura** direttamente sul pannello e avviare lì l'accesso tramite browser. Se Home Assistant segnala poi una mancata corrispondenza dell'utente del pannello in **Impostazioni → Riparazioni**, conferma che il nuovo utente indicato sia quello che hai scelto.

Per completare l'accesso, il browser deve poter raggiungere sia Home Assistant sia l'indirizzo locale del pannello. Anche il pannello deve poter raggiungere Home Assistant. Se hai aperto Configura da remoto tramite Home Assistant ma il browser non può raggiungere l'indirizzo locale del pannello, completa l'accesso mentre sei connesso alla rete del pannello oppure direttamente sul pannello.

## Mettere il pannello su una rete separata

Un pannello può usare una VLAN senza accesso a internet se il firewall continua a consentire al pannello e a Home Assistant di raggiungersi a vicenda e un browser sulla tua rete può raggiungere il pannello quando qualcuno deve accedere. Il pannello usa l'indirizzo locale di Home Assistant per l'accesso e per la plancia. Anche Home Assistant deve poter raggiungere il pannello per la gestione e gli aggiornamenti.

Panel Assistant può scaricare un aggiornamento verificato dell'app del pannello sulla macchina di Home Assistant e inviarlo al pannello tramite la rete locale. Home Assistant necessita comunque di accedere alla fonte degli aggiornamenti. I controlli delle versioni del pannello e le installazioni avviate dal proprietario dalla sua scheda Installa usano GitHub e richiedono anch'essi l'accesso a internet. Questi controlli e download non funzionano su una VLAN senza accesso a internet. Android System WebView viene mantenuta separatamente tramite il Play Store, il firmware del produttore o un'installazione manuale, quindi pianifica anche come mantenerla aggiornata.

La separazione della rete limita quali dispositivi possono raggiungere l'interfaccia web e l'API del pannello. Non riduce i diritti di un account Home Assistant già connesso sul pannello. Se il pannello usa un account amministratore, quell'accesso rimane un accesso amministratore anche su una VLAN isolata. Scegli l'account e le regole del firewall in base a ciò di cui ti fidi sulla parete e sulla rete locale.

L'interfaccia web del pannello e i controlli ordinari presuppongono una rete locale fidata. La [modalità rafforzata](/it/manage/security-mode/) facoltativa richiede l'accesso fisico per determinate richieste dirette via LAN ad alto impatto. Alcune azioni ordinarie di gestione possono essere eseguite tramite la barra laterale autenticata di Panel Assistant da un amministratore di Home Assistant; altre operazioni protette richiedono comunque l'approvazione sullo schermo del pannello. Questa modalità non sostituisce la separazione della rete e non autentica ogni richiesta all'API.
