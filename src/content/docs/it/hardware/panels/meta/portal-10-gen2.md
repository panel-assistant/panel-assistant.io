---
title: Meta Portal 10" (2ª gen.)
description: Dati hardware e consigli di acquisto per Meta Portal da 10 pollici (2ª gen.), modello WD50JM, smart display Qualcomm QCS605 con Android 10, misurato su un'unità fisica con Panel Assistant senza root.
vendor: Meta
model: Portal 10" (2nd gen), WD50JM
soc: Qualcomm QCS605
android: '10'
screen: 10.1 in, 1280 × 800
support: Preliminare
root: Senza root; l'interruttore ADB di Meta basta per la configurazione
webview: WebView Chromium 131 di Meta
released: '2019'
evidence: [bench, firmware, documented]
sidebar:
  label: Portal 10" (2ª gen.)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Tutto in questa pagina è stato misurato su un Portal 10" (2ª gen.) commerciale** con firmware Meta `QKQ1.210213.001.3051355900018050` (Android 10, patch di sicurezza 2020-08-05), con Panel Assistant senza root. Il supporto Portal richiede la versione 1.0 o successiva dell'app del pannello. Nulla è stato controllato su un altro modello Portal; vedi la [pagina della famiglia Meta Portal](/it/hardware/panels/meta/) per come vengono gestiti gli altri.
:::

Il Portal 10" (2ª gen.), modello **WD50JM**, è uno smart display orizzontale da 10,1 pollici con Qualcomm QCS605 e circa 3 GB di RAM, fotocamera da 13 MP con una propria spia, due microfoni, altoparlante e cursore fisico per la privacy. L'[interruttore ADB](#attivare-adb) di Meta è tutto ciò che serve a Panel Assistant: l'app si installa tramite USB, riconosce il Portal e carica il proprio profilo hardware; plancia, fotocamera, microfono, parola di attivazione, risposte vocali, sensore di luce e vero spegnimento dello schermo funzionano tutti senza root.

È un buon pannello con una serie insolita di condizioni, perlopiù imposte da Meta. Quelle da conoscere prima di spendere sono in [Prima dell'acquisto](#prima-dellacquisto).

:::tip
I dati più utili: **mantieni connesso l'account Meta**, perché l'interruttore ADB è protetto dal suo PIN. **L'interruttore ADB ha lo stesso aspetto da acceso e spento**: controlla il computer per conoscerne lo stato. **Preparati a riattivare ADB dopo un riavvio**; il debug di rete usato da Panel Assistant per gli aggiornamenti non sopravvive mai a un riavvio. Per ripristinare le impostazioni di fabbrica, tieni premuti **entrambi i pulsanti del volume mentre colleghi l'alimentazione, senza computer collegato tramite USB**.
:::

## Venduto anche come

Meta Portal, Facebook Portal, Portal (2nd gen), Portal 10", modello WD50JM. Android riporta modello `Portal`, dispositivo e scheda `omni`, prodotto `omni_prod`, produttore e marchio `Facebook`, piattaforma hardware `atlas`.

|            |                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Qualcomm **QCS605**, 8 core                                                                                                                                 |
| RAM        | Circa **3 GB** (Android riporta 2,85 GB)                                                                                                                    |
| Memoria    | 6,7 GB per app e dati, circa 3,9 GB liberi dopo la configurazione; nessuno slot per schede di memoria                                                       |
| Schermo    | **1280×800** orizzontale, 10,1 pollici, **circa 149 ppi**, alla densità base Android di 160 dpi. Controller touch FocalTech con doppio tocco per riattivare |
| Android    | 10 (API 29), build di produzione `user`, SELinux enforcing; arm64-v8a                                                                                       |
| WebView    | Build WebView di Meta, Chromium **131**, mantenuta attuale dall'aggiornamento in background di Meta. Non serve intervenire sulla WebView                    |
| Sensori    | **Accelerometro** e inclinazione; **luce ambientale con colore**. **Nessun sensore di prossimità**                                                          |
| Fotocamera | Sensore **13 MP** in alto a sinistra sulla cornice, con **spia verde** accanto. Alle app come quella del pannello viene offerto 1280×720                    |
| Audio      | **Due microfoni**, un altoparlante                                                                                                                          |
| Privacy    | **Cursore a tre posizioni**: fotocamera e microfoni accesi; fotocamera coperta; fotocamera coperta e microfoni spenti                                       |
| Pulsanti   | Volume su e volume giù. Nessun pulsante di accensione                                                                                                       |
| Radio      | Wi-Fi, Bluetooth con **Bluetooth Low Energy**                                                                                                               |
| Connettori | **USB-C**, usato per ADB                                                                                                                                    |
| Root       | Assente. Nessun `su`, nessuno sblocco noto del bootloader. ADB proviene dall'impostazione Debug di Meta                                                     |
| Uscita     | 2019 (annunciato a settembre, in vendita a ottobre)                                                                                                         |

## Prima dell'acquisto

Nessuno di questi aspetti impedisce di acquistare un Portal, ma è più facile conoscerli in anticipo.

- **Serve un account Facebook.** La configurazione Meta non arriva alle Impostazioni senza accesso. Offre Facebook o WhatsApp; il codice QR WhatsApp non è mai apparso nella nostra prova e l'accesso Facebook ha funzionato. Va bene un account nuovo creato per il pannello.
- **L'account deve rimanere connesso.** Attivare ADB richiede il PIN dell'account Meta creato durante la configurazione. Senza account connesso non abbiamo trovato un modo di riattivare ADB e anche il ripristino di fabbrica sullo schermo Meta ha smesso di funzionare; soltanto il [reset hardware](#recupero-ripristino-di-fabbrica) ha recuperato il Portal. Non rimuovere l'account e non disabilitare l'app di configurazione Meta.
- **ADB non rimane attivo.** L'impostazione ADB Meta viene segnalata come disattivata automaticamente a ogni riavvio, quindi preparati a riattivarla; la connessione di debug di rete usata da Panel Assistant per gli aggiornamenti è andata persa a ogni riavvio provato. Questo ha conseguenze per gli [aggiornamenti](#aggiornamenti).
- **Rifiuta il download del firmware durante la configurazione, se puoi.** La configurazione Meta propone di scaricare un aggiornamento. Lo abbiamo rifiutato, quindi tutto in questa pagina è stato provato sulla build firmware indicata all'inizio. Non è noto se un firmware Meta successivo cambi l'accesso ADB e Meta non pubblica un modo per tornare indietro.
- **Meta sta dismettendo Portal.** Meta ha smesso di vendere Portal nel 2022 e da allora ha ritirato funzioni. Preparati a ulteriori servizi Meta, e forse metodi di accesso, che smetteranno di funzionare. L'app del pannello non dipende da nessuno di essi.
- **Servono un computer con browser basato su Chromium e un cavo USB-C dati** per installare, come su qualsiasi pannello installato [tramite USB](/it/install/install-over-usb/).

## Attivare ADB

Meta documenta la procedura per ogni Portal ([Meta, configurazione Portal per app Android](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)):

1. Sul Portal, apri **Impostazioni › Debug**.
2. Tocca **ADB Enabled** e inserisci il PIN dell'account Meta quando richiesto.
3. Collega il Portal al computer tramite USB-C.
4. La prima volta, tocca **Consenti** sul Portal per autorizzare il computer.

:::caution
**La voce ADB Enabled ha esattamente lo stesso aspetto con ADB acceso o spento e ogni tocco lo commuta.** Nulla sullo schermo del Portal ne indica lo stato. L'unica prova è sul computer: il Portal compare nell'elenco dei dispositivi USB del browser o in `adb devices`. Se non compare, tocca la voce un'altra volta e ricontrolla anziché toccarla ripetutamente.
:::

Non esiste un modo verificato di attivare ADB di rete sulla porta TCP 5555 senza computer. Usa prima il percorso USB sopra; attivare soltanto l'interruttore ADB di Meta non è un percorso verificato di installazione via rete. Il programma di installazione USB prepara il debug di rete per gli aggiornamenti successivi. Non serve root.

## Installare Panel Assistant

Installa l'app del pannello da Home Assistant con il [programma di installazione USB](/it/install/install-over-usb/), con il Portal collegato al computer tramite USB-C e ADB attivo come sopra. Panel Assistant è obbligatorio: è il mezzo per installare, collegare e aggiornare l'app. Sul Portal provato il programma si è completato normalmente, l'app si è aperta sulla configurazione della plancia e al primo avvio ha selezionato autonomamente il profilo Portal 10" (2ª gen.).

Per un Portal, Panel Assistant prepara inoltre il pannello durante l'installazione: imposta l'app come schermata iniziale, concede il permesso microfono e disattiva salvaschermo e barra di scorrimento verso l'alto di Meta, nessuno dei quali può essere modificato dalle Impostazioni di Meta. Il permesso fotocamera viene chiesto sullo schermo Portal la prima volta che la attivi.

Un'impostazione spetta a te: lo **zoom della plancia**. Alla densità nativa del Portal la plancia appare più grande che su altri pannelli orizzontali. Il profilo imposta **Zoom (%)** a **85** per impostazione predefinita, mantenendo nitide le schermate Android; cambialo nelle impostazioni del [renderer integrato](/it/manage/built-in-renderer/) se preferisci un'altra dimensione.

Poi [aggiungi il pannello](/it/install/installing-ha-paneld/) in Panel Assistant come al solito.

## Cosa funziona

- **La plancia**, fluida, nella WebView attuale di Meta.
- **Fotocamera.** Disattivata per impostazione predefinita, come su ogni pannello, e attivabile dalla scheda **Fotocamera** in Configura. Fornisce quindi un flusso 1280×720 e immagini fisse a Home Assistant; la spia verde del Portal si accende durante l'uso.
- **Microfoni, parola di attivazione e risposte vocali.** La parola di attivazione è stata riconosciuta e la pipeline vocale Home Assistant ha risposto tramite l'altoparlante Portal. Vedi [assistente vocale](/it/manage/voice-assistant/).
- **Luce ambientale**, incluso il colore, come normale sensore Android per luminosità adattiva e Home Assistant.
- **Un vero spegnimento dello schermo senza root.** L'app spegne lo schermo tramite il timeout di sospensione di Android: la retroilluminazione diventa completamente buia anziché scendere al minimo. Abbassare la luminosità a zero non basta su un Portal: l'immagine rimane visibile. Se il timeout non funziona, l'app ripiega sull'impostazione più fioca.
- **Riattivazione**: un doppio tocco sullo schermo lo riattiva, come il rilevamento del movimento Meta quando qualcuno si muove nelle vicinanze.
- **Il pulsante Launcher** nella navigazione dell'app porta al launcher dell'app stessa. Il profilo indica di saltare il launcher Meta, che è un quadrante di orologio anziché un elenco di app.

## Limitazioni attuali

- **La sospensione automatica è disattivata per impostazione predefinita e consigliamo di lasciarla così.** Il Portal non ha un sensore di prossimità, quindi l'app non può sapere se qualcuno gli è davanti. La sospensione dopo un periodo senza tocchi spegneva lo schermo sotto una persona seduta al pannello e il rilevamento del movimento Meta lo riattivava ripetutamente. Quel rilevamento reagisce a qualsiasi movimento, incluso qualcuno che passa, talvolta ha riattivato lo schermo senza nessuno nella stanza e non è leggibile da altre app, quindi l'app non può usarlo come segnale di presenza. Puoi comunque spegnere e accendere lo schermo da Home Assistant.
- **Due indicatori della fotocamera.** L'app disegna il proprio indicatore di fotocamera attiva in alto al centro, mentre obiettivo e spia verde Portal sono in alto a sinistra. L'indicatore sullo schermo è ridondante e non può essere disattivato.
- **Il cursore del volume Meta non cambia il volume multimediale**, usato da risposte vocali e annunci. Il volume multimediale può iniziare a zero, rendendo silenziosa la prima risposta. Impostalo con **Volume pannello** o con la sua entità del volume Home Assistant; il cursore Meta non lo modifica.
- **Le impostazioni Android sono perlopiù irraggiungibili.** Meta sostituisce l'app Impostazioni Android con una propria versione ridotta. Panel Assistant imposta ciò che serve all'app durante l'installazione; il resto delle impostazioni Android non può essere cambiato dal pannello stesso.

:::danger
**Non disabilitare l'app di configurazione Meta (`com.facebook.alohaapps.devicesetup`) e non rimuovere l'account Meta.** Con l'account rimosso e quell'app disabilitata, il Portal provato ha perso sia l'interruttore ADB sia il ripristino di fabbrica sullo schermo Meta; soltanto il [reset hardware](#recupero-ripristino-di-fabbrica) lo ha recuperato. Lascia intatti account, impostazioni e app di configurazione Meta.
:::

## Aggiornamenti

Un Portal non può installare autonomamente aggiornamenti dell'app, perché serve root. Panel Assistant lo aggiorna quindi tramite debug di rete, che il Portal disattiva a ogni riavvio, anche dopo un'interruzione di corrente. In quel caso il pannello continua a funzionare con la versione presente e Home Assistant mostra una Riparazione, come descritto in [Aggiornamenti e ripristino](/it/manage/updates-and-recovery/#un-pannello-che-non-può-essere-aggiornato).

Per consentire di nuovo gli aggiornamenti, attiva [ADB](#attivare-adb), collega il Portal al computer tramite USB e avvia il programma di installazione USB da Home Assistant, come descritto in [un pannello che non può essere aggiornato](/it/manage/updates-and-recovery/#un-pannello-che-non-può-essere-aggiornato). Il programma non installa nulla su un Portal che possiede già l'app: riattiva il debug di rete perché Panel Assistant possa aggiornarlo. Dopo l'aggiornamento, controlla che il Portal apra ancora la plancia come [schermata iniziale](#installare-panel-assistant).

## Privacy

Un Portal rimane un dispositivo Meta con software Meta e l'app del pannello non lo cambia. Quanto segue è ciò che abbiamo misurato sull'unità provata, non una verifica completa.

**Software Meta.** In circa 25 minuti dopo un reset di fabbrica, tutte le app Meta insieme hanno caricato circa 3 MB e i servizi di analisi della fotocamera e presenza Meta hanno inviato meno di 0,05 MB ciascuno. Un caricamento video continuo sarebbe molto più grande, quindi non è stato osservato in quella finestra; è una prova breve che non esclude caricamenti occasionali. Diversi servizi Meta mantengono connessioni aperte ai server Meta e il software di sistema registra eventi analitici, incluso ogni uso del cursore privacy e lo stato della spia della fotocamera.

**L'analisi della fotocamera Meta non accende la spia verde.** Il rilevamento Meta di movimento e presenza osserva la stanza tramite un flusso separato e ridotto che funziona continuamente senza accendere la spia. La spia verde indica soltanto il flusso usato dalle altre app. L'app del pannello non può aprire il flusso di analisi Meta, quindi ogni volta che usa la fotocamera la spia verde è accesa.

**Il cursore privacy funziona per l'app del pannello.** Nella posizione fotocamera, Android segnala la fotocamera non disponibile e quella dell'app smette di fornire immagini. Nella posizione microfono spento l'assistente vocale dell'app non ha sentito nulla. In 1.0 l'app segue l'evento privacy Meta insieme allo stato di disattivazione audio Android e può mostrare il microfono disattivato. Le transizioni fisiche del cursore e l'avvio con microfono acceso non sono ancora stati qualificati per questo percorso di segnalazione.

**L'app del pannello.** La fotocamera è spenta fino all'attivazione. Quando attiva, il flusso è disponibile ai client sulla rete locale, con audio ambiente dove è consentito l'accesso al microfono. Assist e le entità Home Assistant usano la tua connessione Home Assistant.

## Recupero: ripristino di fabbrica

Il reset hardware Portal funziona senza app Meta, schermo funzionante o ADB:

1. Scollega l'alimentazione e **scollega qualsiasi cavo USB verso un computer**.
2. Tieni premuti **entrambi i pulsanti del volume** e ricollega l'alimentazione, mantenendoli premuti finché il Portal non mostra che sta cancellando.

Il reset cancella tutto, inclusa l'app del pannello e le sue impostazioni. Poi ripeti la configurazione Meta, [attiva ADB](#attivare-adb) e [installa Panel Assistant](#installare-panel-assistant).

:::caution
**Con un cavo USB collegato a un computer, la stessa combinazione di pulsanti non ripristina il Portal.** Avvia invece la modalità di download di emergenza Qualcomm, che compare sul computer come dispositivo USB Qualcomm. In quella modalità non viene modificato nulla. Scollega l'alimentazione per uscirne, scollega il cavo USB e riprova.
:::

## Firmware

Vedi il [catalogo firmware Portal 10" (2ª gen.)](/it/hardware/firmware/builds/meta-portal-10-gen2/) per build indicizzate, URL originali di download Meta e copie Internet Archive.

## Fonte

[Meta for Developers: configurazione Portal per app Android](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): procedura ADB ed elenco dei modelli supportati.
