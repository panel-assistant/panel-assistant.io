---
title: Modalità di sicurezza
description: Il comportamento predefinito del pannello su una rete fidata e la modalità rafforzata, che richiede a qualcuno presente al pannello di approvare le azioni remote ad alto impatto.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

L'interfaccia web del pannello, la sua API e i suoi controlli di Home Assistant sono progettati per una rete domestica fidata. La **modalità permissiva** è quella predefinita: automazioni, strumenti di installazione e azioni del browser funzionano senza una richiesta aggiuntiva. Un'azione è deliberatamente esclusa da questa regola. Accendere la fotocamera tramite la sua entità Home Assistant richiede l'approvazione sul pannello in ogni modalità, inclusa quella permissiva. L'impostazione Fotocamera in Configura è un percorso separato di configurazione del proprietario. Spegnerla non richiede mai l'approvazione.

Per un pannello su una rete condivisa con dispositivi meno fidati, la **modalità rafforzata** facoltativa aggiunge l'approvazione in presenza per determinate operazioni di rete ad alto impatto. È un limite di sicurezza aggiuntivo, non un sostituto di una rete separata o di un firewall, né un'autenticazione generale per l'API. Gli endpoint di sola lettura e i controlli ordinari del pannello rimangono disponibili secondo il normale modello di rete fidata.

**In modalità rafforzata, le richieste dirette via LAN protette richiedono l'accesso fisico al pannello. Non possono procedere finché qualcuno non le approva sullo schermo del pannello e questa approvazione non può essere data da remoto.**

Gli amministratori che usano la barra laterale autenticata di Panel Assistant possono eseguire determinate azioni ordinarie di gestione senza la richiesta fisica: configurazione del display e dell'alimentazione, presa d'atto della sicurezza dell'alimentazione, attivazione del profilo, riproduzione di contenuti multimediali, limitazione dei pacchetti del produttore e ricaricamento della plancia. Installazione, disinstallazione, backup, ripristini, riavvio e altre operazioni protette richiedono comunque l'approvazione sul pannello. Le richieste dirette via LAN non beneficiano di questa eccezione.

L'interfaccia web contrassegna le azioni interessate con un piccolo scudo in entrambe le modalità, così puoi vedere quali procedure superano il limite dell'approvazione prima di attivare la modalità rafforzata.

## Attivare la modalità rafforzata

Questa impostazione può essere modificata solo sul pannello stesso:

1. Apri la schermata **Configura** dell'app del pannello sul pannello.
2. Apri il menu aggiuntivo della barra degli strumenti e scegli **Modalità di sicurezza**.
3. Scegli **Abilita modalità rafforzata**.

ADB di rete e il debug wireless di Android devono prima essere entrambi disattivati, perché ciascuno consente a un client ADB remoto di inserire comandi di input nella schermata di approvazione. Prima di confermare la modifica, l'app del pannello controlla tutte le proprietà Android supportate relative ad ADB di rete, ADB di rete persistente, indirizzi espliciti di ascolto ADB e stato del debug wireless. Arresta inoltre qualsiasi relay di rete attivo degli strumenti di sviluppo della WebView e verifica che il suo processo e il suo servizio in ascolto non siano più presenti. Se non può accertare che questi percorsi di controllo remoto siano inattivi, si rifiuta di attivare la modalità rafforzata. Disattiva ADB e il debug wireless nelle opzioni sviluppatore di Android e riprova. Se la verifica del relay non riesce, riavvia il pannello prima di riprovare.

L'impostazione appartiene esclusivamente al pannello. Non è inclusa nelle esportazioni della configurazione o nei backup completi e non può essere modificata tramite l'API, da Home Assistant, con un ripristino, importando una configurazione o con un aggiornamento eseguito su più pannelli. Un pannello esistente rimane quindi in modalità permissiva a meno che qualcuno non attivi la modalità rafforzata sul pannello.

Usa lo stesso menu per tornare alla modalità permissiva. Questa operazione cancella tutte le richieste di approvazione in sospeso.

## Approvare una richiesta di rete

Quando la modalità rafforzata intercetta una richiesta protetta all'API, il primo tentativo restituisce HTTP `202 Accepted` con una risposta `approval-required`, per esempio:

```json
{
  "ok": false,
  "error": "approval-required",
  "approval_id": "…",
  "message": "Approve this request physically on the panel, then retry it; it cannot be approved remotely."
}
```

Per completare l'operazione:

1. Sul pannello, apri **Configura**, il menu aggiuntivo della barra degli strumenti, **Modalità di sicurezza**, poi **Esamina approvazioni**.
2. Controlla l'operazione, il suo riepilogo e il dispositivo che l'ha richiesta, poi approvala o negala.
3. Entro dieci minuti dalla richiesta originale, invia nuovamente la stessa identica richiesta dallo stesso dispositivo.

Un'approvazione è vincolata all'operazione, al dispositivo richiedente e al contenuto protetto della richiesta e può essere usata una sola volta. Modificare la richiesta, inviarla da un altro indirizzo, attendere più di dieci minuti o riavviare l'app del pannello richiede una nuova approvazione. Solo il nuovo tentativo corrispondente consuma un'approvazione; non è un'esenzione generale temporanea.

I comandi nativi delle entità e delle automazioni di Home Assistant riportano l'origine di trasporto di Panel Assistant, anziché l'identità del singolo utente. Le loro approvazioni sono vincolate a quell'origine e al comando esatto. Questo differisce dall'eccezione per la barra laterale autenticata dell'amministratore descritta sopra.

Le richieste via loopback provenienti da software già in esecuzione sul pannello non richiedono approvazione di rete. La modalità rafforzata considera fidate le app Android locali e non isola un'app sul pannello da un'altra, quindi non tenere sul pannello app non fidate.

## Operazioni protette

In modalità rafforzata, un client di rete diretto necessita dell'approvazione sul pannello prima di poter:

- installare un'app caricata oppure una copia gestita dell'app del pannello o di un'app separata per la plancia;
- disinstallare un'app oppure modificare se un pacchetto del produttore è abilitato, in esecuzione o autorizzato a sovrapporsi allo schermo;
- esportare un backup completo o un pacchetto di configurazione contenente segreti;
- importare una configurazione, ripristinare una revisione di configurazione salvata o ripristinare un backup del pannello;
- attivare un profilo hardware o tornare a un profilo precedente;
- riprodurre contenuti multimediali recuperati da un URL remoto;
- ricaricare il renderer della plancia o riavviare il pannello;
- scaricare un'app da un link, operazione approvata separatamente dall'installazione: il download è vincolato allo SHA-256 di quell'esatto URL e non viene aperta alcuna connessione finché non viene approvato, quindi l'installazione da un link in modalità rafforzata richiede due approvazioni;
- far avanzare la manutenzione di ripristino del database;
- riparare la configurazione di un'app separata per la plancia o cancellare i dati di navigazione del renderer integrato;
- modificare la densità del display di sistema o la scala del carattere;
- disattivare, dalla pagina Configura o da Home Assistant, le protezioni configurate di mantenimento attivo o di prevenzione dell'attenuazione per inattività che mantengono il pannello raggiungibile;
- riparare le impostazioni di sicurezza dell'alimentazione del pannello; oppure
- nascondere un preciso avviso invariato relativo a un'impostazione di sicurezza dell'alimentazione che può essere corretta solo manualmente. Questo modifica soltanto ciò che viene mostrato; la valutazione sottostante, la diagnostica e il risultato del programma di installazione rimangono invariati.

Accendere la fotocamera del pannello tramite la sua entità Home Assistant richiede l'approvazione sul pannello in entrambe le modalità. Accenderla da Configura rimane un'impostazione separata del proprietario; sono comunque necessari l'autorizzazione Android per la fotocamera e un indicatore funzionante di fotocamera in uso.

Un salvataggio remoto di Configura in modalità rafforzata deve salvare una riduzione della sicurezza dell'alimentazione separatamente dalle modifiche ai pacchetti del produttore, perché richiedono tipi di approvazione diversi. I salvataggi combinati in modalità permissiva o via loopback vengono eseguiti direttamente.

La modalità rafforzata rifiuta l'iniezione di tocchi da qualsiasi origine diversa dal loopback, quindi una richiesta non può approvare sé stessa. Si rifiuta inoltre di attivare ADB di rete, il debug wireless di Android o il relay degli strumenti di sviluppo della WebView. Riporta il pannello in modalità permissiva sul pannello stesso prima di usare uno qualsiasi di questi strumenti.

Il limite dell'approvazione non rende autenticato il resto dell'API sulla porta 8888. Le letture della diagnostica e dello stato e i controlli ordinari mantengono il normale comportamento previsto per una rete fidata. Mantieni l'API del pannello lontana dalle reti non fidate anche con la modalità rafforzata attiva; il [riferimento sulla sicurezza](/it/reference/security/) descrive l'intero modello di sicurezza.

Gli aggiornamenti iniziano quando installi tramite Panel Assistant o scegli tu stesso un'installazione. L'app del pannello non ha criteri di installazione pianificata né un canale di aggiornamento salvato. Le installazioni avviate dal proprietario dalla scheda **Installa** rimangono disponibili, con approvazione sul pannello per le richieste remote protette in modalità rafforzata.

## Cambiare l'indirizzo di Home Assistant

Cambiare l'**URL di Home Assistant** cancella le credenziali di accesso precedenti, a meno che non vengano fornite nuove credenziali nello stesso salvataggio. Questo vale in entrambe le modalità di sicurezza. I salvataggi ordinari che mantengono lo stesso indirizzo conservano i valori segreti memorizzati quando quei campi vengono lasciati vuoti.
