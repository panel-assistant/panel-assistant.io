---
title: Sonoff NSPanel Pro
description: Dati hardware degli originali Sonoff NSPanel Pro 86P e 120P, pannelli Rockchip PX30 con radio Zigbee integrata.
vendor: Sonoff
panelIndex: true
sidebar:
  label: Panoramica
  order: 0
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
---

La linea NSPanel Pro originale comprende due pannelli fisicamente diversi, **[86P](/it/hardware/panels/sonoff/nspanel-pro-86p/)** e **[120P](/it/hardware/panels/sonoff/nspanel-pro-120p/)**, denominati secondo le scatole da incasso europee da 86 mm e 120 mm. Entrambi integrano un **coordinatore Zigbee 3.0**, senza NFC o IR, e hanno la CPU meno potente tra i pannelli pienamente supportati. Condividono quasi tutto quanto documentato in questa pagina (procedura root, WebView, LED, sensori, gateway Zigbee); la pagina di ciascuna variante riporta solo le proprie specifiche e le poche differenze. Il reverse engineering di questa pagina è stato svolto principalmente su un **86P** funzionante (Android 8.1, root, `su` toolbox), con verifiche separate sul 120P dove indicato.

## Venduto anche come

Sonoff NSPanel Pro 86, NSPanel Pro 120, NSPanel Pro 86P, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, px30_evb, SN_3326S, SN-RKPX30-NSP-01, nspanel-pro, nspanel-pro-ver120. Da non confondere con NSPanel Pro Gen2 o le schede Tuya S6E e T6E, che sono hardware distinti.

:::tip
Le informazioni essenziali: il pannello viene fornito come **`userdebug` senza password adb**, quindi `adb root` funziona direttamente. Il **LED non è caratterizzato** (non è stato trovato alcun nodo RGB controllabile). Luce e prossimità sono **accessibili direttamente all'app**. La **radio Zigbee EFR32** integrata si gestisce tramite un broker locale, senza riflash. Installazione e aggiornamenti dell’app del pannello avviati da Home Assistant possono installare il WebView verificato; vedi [WebView: aggiorna prima questo](#webview-aggiorna-prima-questo).
:::

|               |                                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC           | Rockchip **PX30 / rk3326**                                                                                                                 |
| CPU           | 4× **Cortex-A35** fino a **1,512 GHz** (408 MHz a riposo)                                                                                  |
| GPU           | **Mali-G31** (confermata sul dispositivo)                                                                                                  |
| Schermo       | **480×480 quadrato** (1:1), circa 4 in, 160 dpi (mdpi, ben proporzionati ai circa 170 ppi fisici), 60 Hz, superficie **480×480 dp**        |
| RAM           | **2 GB** (circa 1960 MB utilizzabili)                                                                                                      |
| Archiviazione | eMMC; `/data` circa 3,5 GB                                                                                                                 |
| Android       | 8.1 (API 27)                                                                                                                               |
| ABI           | arm64-v8a                                                                                                                                  |
| Radio         | **Zigbee 3.0** (coordinatore Silicon Labs EFR32 su UART `ttyS5`, vedi sotto), Wi-Fi, Bluetooth. Niente NFC, IR, Ethernet o rete cellulare. |

:::note
Il Cortex-A35 è un core ad alta efficienza con prestazioni per ciclo nettamente inferiori ad A55 (TPA10) o A72 (WF1589T). Con 2 GB di RAM, NSPanel Pro offre le **prestazioni di base** tra i pannelli pienamente supportati; vedi il [confronto delle prestazioni](/it/hardware/#performance-comparison).
:::

:::tip
Stai cambiando firmware su un pannello senza pulsanti? Leggi prima [Backup e ripristino del firmware](/it/hardware/guides/firmware-backup-and-restore/). NSPanel Pro usa gli [strumenti specifici di seaky per il modello](/it/hardware/guides/firmware-backup-and-restore/#per-panel-notes) anziché `rkdeveloptool`.
:::

## Varianti: 86P e 120P

La tabella delle specifiche sopra e gran parte di questa pagina provengono da un **86P**; il **120P** ha una scheda diversa. Vedi le pagine [86P](/it/hardware/panels/sonoff/nspanel-pro-86p/) e [120P](/it/hardware/panels/sonoff/nspanel-pro-120p/) per la tabella specifica e la foto di ciascuna variante.

|                      | NSPanel Pro **86P**                                                                                                                                                                  | NSPanel Pro **120P**                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC                  | Rockchip **PX30**                                                                                                                                                                    | Rockchip **RK3326-S** (stessa famiglia PX30/RK3326; `ro.board.platform=rk3326`, albero dispositivi `rockchip,px30`)                          |
| Schermo              | **480×480** quadrato, circa 160 dpi, solo verticale                                                                                                                                  | **750×1334** verticale, **240 dpi** (override 250); orizzontale disponibile; circa 1 cm più stretto e più lungo dell'86P                     |
| ID build             | entrambi riportano `ro.product.model/device/name = px30_evb`, nome di scheda Rockchip condiviso e _non_ un modo affidabile di distinguere le varianti                                | come 86P                                                                                                                                     |
| `ro.product.version` | formato `NSPanel86P_x.y.z` o `s6_android_x.y.z`                                                                                                                                      | `NSPanel120P_x.y.z` (canale OTA `nspanel-pro-ver120`, ROM completa `SN_3326S_750X1334_…`)                                                    |
| Forma OTA            | ROM completa fino a **4.0.12**; le versioni indicizzate successive sono differenziali o aggiornamenti della sola app (vedi la [pagina firmware](/it/hardware/firmware/nspanel-pro/)) | come 86P                                                                                                                                     |
| Firmware prossimità  | **4.0.12 ha ripristinato letture graduate**                                                                                                                                          | è rimasto **binario** su 4.x (i kernel differiscono per modello; vedi [Sensori](#sensori-luce-e-prossimità-accessibili-direttamente-allapp)) |

Entrambi condividono radio Zigbee EFR32, Android 8.1 (AOSP), arm64-v8a e le procedure root e recupero sotto. Verificato su un 120P funzionante (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, densità 240, `ro.board.platform=rk3326`.

:::note
Questa pagina non consiglia una versione firmware nel testo; la fonte autorevole è l'[indice firmware](/it/hardware/firmware/) generato. La procedura di flash è verificata sull'hardware fino a **4.4.0**. Le versioni indicizzate successive sono verificate solo sul CDN, mai installate su hardware. Al 2026-08-14, il [changelog pubblico Sonoff](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq) documenta versioni fino a **4.6.0**; 4.6.2 e 4.8.0 sono state individuate solo interrogando il CDN, mentre 4.7.0 è discussa solo in un [thread di feedback degli utenti eWeLink](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789), una discussione e non un annuncio di rilascio. **4.5.3** è un differenziale ROM sul 120P ma un aggiornamento della sola app sull'86P, e **4.6.2** è un aggiornamento della sola app senza differenziale ROM su entrambi i canali: un aggiornamento non è sempre un unico salto. L'assenza dall'indice significa che la build non è stata trovata interrogando il CDN; il contenuto del CDN non è elencabile, quindi l'assenza non dimostra mai che una build non esista.

**Segnalazioni della comunità descrivono cicli di riavvio su 4.5.1 e 4.5.2**, a intervalli di circa 10–60 minuti su entrambi i modelli. Per 4.7.0, il thread contiene segnalazioni di problemi di connettività dei sottodispositivi dopo l'aggiornamento, alcuni risolti riavviando e altri descritti come persistenti. Non sono stati riprodotti o quantificati: considerali segnalazioni utente non verificate, non una regressione accertata. Verifica ogni versione più recente su un pannello prima di distribuirla a diversi; **4.0.12** resta il punto di riferimento prudente con ROM completa da mantenere.
:::

### Particolarità del firmware per versione

Comportamenti che cambiano tra versioni firmware eWeLink, dalle più vecchie. `ro.product.version` è l'ID **interno** (`NSPanel86P_x.y.z` o `s6_android_x.y.z` sull'86P, `NSPanel120P_x.y.z` sul 120P), _non_ il numero commerciale o OTA mostrato dall'app eWeLink (4.0.12, 4.5.x). Rilevamento e logica legata alla versione devono leggere `ro.product.version`, non la stringa commerciale.

| Firmware                               | Particolarità o comportamento                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Cosa fare                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vecchio (prima di 1.3.2)**           | Nessun interruttore adb nell'app; opzioni sviluppatore irraggiungibili dall'interfaccia                                                                                                                                                                                                                                                                                                                                                                                                                                       | Abilita adb dalla **porta OTG** interna (apri la custodia); vedi [Ottenere accesso adb e root](#ottenere-accesso-adb-e-root).                                                                                                                                                                                                                              |
| **1.3.2 e successive**                 | L'abilitazione adb è stata spostata nell'app eWeLink                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | eWeLink, _Impostazioni dispositivo_, tocca **ID dispositivo** otto volte, modalità sviluppatore, adb.                                                                                                                                                                                                                                                      |
| **1.4 e successive**                   | Modalità sviluppatore **rimossa** dall'interfaccia                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Abilita adb tramite **cinque cicli di alimentazione** durante l'animazione di avvio Sonoff; vedi [Ottenere accesso adb e root](#ottenere-accesso-adb-e-root).                                                                                                                                                                                              |
| **3.5.1 (86P, verificata)**            | WebView di sistema originale è **Chromium 107.0.5304.105**, troppo vecchio per una plancia Home Assistant moderna; altri firmware possono differire                                                                                                                                                                                                                                                                                                                                                                           | Usa l’aggiornamento WebView gestito o l’alternativa manuale adb; vedi [WebView: aggiorna prima questo](#webview-aggiorna-prima-questo). Anche il banner di salute dell'app segnala versioni WebView inferiori a Chromium 110.                                                                                                                              |
| **3.7.1 (120P, su hardware)**          | Build di riferimento iniziale                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `wm size` 750×1334, densità 240, `ro.board.platform=rk3326`.                                                                                                                                                                                                                                                                                               |
| **4.0.0** (distribuita dal 2025-09-19) | Il firmware originale include lo store F-Droid; interfaccia nettamente più veloce                                                                                                                                                                                                                                                                                                                                                                                                                                             | Conferma che le versioni **APP** _e_ **OS** siano entrambe 4.0.0 o successive.                                                                                                                                                                                                                                                                             |
| **4.0.12**                             | Letture di prossimità graduate ripristinate sull'**86P**; il **120P resta binario** (i kernel differiscono per modello)                                                                                                                                                                                                                                                                                                                                                                                                       | Il riferimento stabile prudente. La forma dell'input grezzo dipende da modello e firmware, e la configurazione guidata calibra e normalizza entrambe le forme; vedi [Sensori](#sensori-luce-e-prossimità-accessibili-direttamente-allapp).                                                                                                                 |
| **4.5.1 e 4.5.2**                      | **Diffuse segnalazioni della comunità di cicli di riavvio** (circa 10–60 minuti, entrambi i modelli); 4.5.2 è uno strato della sola app su 4.5.1                                                                                                                                                                                                                                                                                                                                                                              | Superate da versioni successive. Mantieni **4.0.12** per la massima stabilità oppure prova prima una versione più recente su un pannello.                                                                                                                                                                                                                  |
| **4.5.3**                              | Rilevamento automatico Matter e ottimizzazioni della gestione schermo; differenziale ROM sul 120P ma sola app sull'86P                                                                                                                                                                                                                                                                                                                                                                                                        | Nessuna prova di cicli di riavvio specifica per 4.5.3; superata da versioni successive.                                                                                                                                                                                                                                                                    |
| **4.6.0** (giugno 2026)                | **Local Web Portal** (`nspanelpro.local`: configurazione LAN, esportazione MQTT Discovery a Home Assistant, Matter Bridge); l'ispezione del CDN ha trovato differenziali da 4.0.12, 4.4.0 e 4.5.1                                                                                                                                                                                                                                                                                                                             | Documentata nel changelog pubblico Sonoff. **4.6.2** è indicizzata come aggiornamento della sola app senza differenziale ROM su entrambi i canali; non è stata trovata alcuna 4.6.1.                                                                                                                                                                       |
| **4.7.0** (luglio 2026)                | Discussa in un thread di feedback eWeLink ma **assente dal changelog pubblico Sonoff**; riguarda pannelli Gen1 e Gen2; utenti segnalano l'aggiunta del supporto al relè Basic gen-5 (BASIC-1GS); l'ispezione del CDN ha trovato differenziali in ingresso da 4.0.12, 4.4.0, 4.5.1 e 4.6.0 per entrambi i modelli, più 4.5.3 solo sul 120P                                                                                                                                                                                     | Segnalazioni della comunità di problemi di connettività dei sottodispositivi, alcuni risolti riavviando e altri descritti come persistenti; non verificate. Verifica su un pannello prima di distribuirla ulteriormente.                                                                                                                                   |
| **4.8.0** (agosto 2026)                | **Nessun annuncio di rilascio o changelog trovato**; individuata interrogando il CDN. Un intervento dello staff eWeLink del 2026-07-16 nel [thread della roadmap](https://forum.ewelink.cc/t/nspanel-pro-roadmap-and-co-created-future/206240) la prevedeva per agosto e confermava una funzione: un'opzione per aggiornare automaticamente il pannello tramite l'app eWeLink. L'ispezione del CDN ha trovato differenziali in ingresso da 4.0.12, 4.4.0, 4.5.1, 4.6.0 e 4.7.0 su entrambi i modelli, più 4.5.3 solo sul 120P | Altri contenuti sconosciuti e nessun thread di feedback trovato: non ci sono segnalazioni sulla stabilità in nessuna direzione. Considerala non valutata. **Se l'opzione di aggiornamento automatico è attiva all'origine, un pannello potrebbe aggiornare il firmware senza supervisione**, quindi controllala prima di affidarti a una versione fissata. |

:::note
Queste sono particolarità degli originali 86P e 120P. NSPanel Pro **Gen2** (RK3326-**S**, due relè, EFR32**MG24**) è un hardware diverso. Sonoff distribuisce Gen1 e Gen2 nella stessa linea di versioni firmware (4.7.0 riguarda entrambi): non dedurre una linea separata né presumere che tutte le note del modello originale si applichino. Il profilo NSPanel Pro originale corrisponde a qualsiasi pannello che riporti un nome scheda PX30 o RK3326, quindi anche a un Gen2 che ne riporti uno finché non avrà un proprio profilo; quel profilo non è stato provato su Gen2 e non espone i suoi relè.
:::

Le schede della stessa famiglia Tuya **S6E** e **T6E** (varianti con relè; S6E è un T6E con due relè), **[Smatek S9E](/it/hardware/panels/smatek/s9e/)** e **[Tuya TPA10](/it/hardware/panels/tuya/tpa10/)** (RK3566, Cortex-A55, Android 11) sono dispositivi distinti e non eseguono il firmware NSPanel Pro.

:::danger
Il rilevamento non può basarsi su `ro.product.model`, perché entrambe le varianti riportano `px30_evb`. Usa `ro.product.version`, le dimensioni schermo o `ro.board.platform` per distinguere 86P e 120P. Anche la prossimità differisce tra modelli e firmware: la configurazione guidata calibra le letture attuali e salva il risultato anziché scegliere un classificatore specifico del firmware.
:::

## Ottenere accesso adb e root

A differenza del TPA10, NSPanel Pro **non ha password adb**. Viene fornito come build `userdebug` con chiavi di test (`ro.debuggable=1`), quindi `adb root` funziona e `/system` può essere rimontato. L'unica difficoltà è _raggiungere_ le opzioni sviluppatore, nascoste diversamente dal firmware eWeLink a seconda della versione. Sintesi delle guide di blakadder ([sideload](https://blakadder.com/nspanel-pro-sideload/), [segreti](https://blakadder.com/nspanel-pro-secrets/)).

**Percorso iniziale (86P e 120P).** La possibilità di abilitare ADB di rete sulla porta TCP 5555 senza computer dipende dal firmware; non è stato accertato un interruttore universale sul pannello. Il percorso modalità sviluppatore eWeLink sotto è documentato per i firmware indicati, ma non dimostra TCP5555 su ogni build successiva. Se ADB di rete non è disponibile, usa il percorso USB documentato per il tuo firmware. I comandi root non abilitano l'accesso iniziale.

**1. Abilita adb.** Il percorso dipende dal firmware:

- **Firmware vecchio:** apri la custodia (rimuovi le viti posteriori e scollega il connettore touch) per esporre la porta USB OTG, poi collega un computer; adb funziona direttamente tramite USB.
- **Firmware 1.3.2 e successivo:** nell'**app eWeLink**, apri _Impostazioni dispositivo_ del pannello e tocca **ID dispositivo** otto volte per abilitare la modalità sviluppatore, ripristinando adb.
- **Firmware 1.4 e successivo** (modalità sviluppatore rimossa): interrompi e ripristina l'alimentazione **cinque volte** durante l'animazione di avvio Sonoff per forzare un avvio di recupero, e in quella finestra esegui `adb install ultra-small-launcher.apk`. Dopo il riavvio, imposta quel launcher come predefinito, poi tocca sette volte _Impostazioni, Sistema, Informazioni sul tablet, Numero build_ per riabilitare le opzioni sviluppatore e attivare il debug USB.

**2. Passa ad adb di rete**, per poter tenere chiusa la custodia:

```bash
adb tcpip 5555
adb shell ip -o a            # find the panel IP
adb connect <panel-ip>:5555
adb shell su 0 setprop persist.adb.tcp.port 5555   # survive reboot (service prop resets)
```

**3. Root.** Essendo una build `userdebug`, `adb root` fornisce subito una shell adbd root. L'app del pannello chiama `su` dalla propria sandbox: installa quindi un `su` persistente in `/system`. **SuperSU `su` 2.76** in `/system/xbin/su` è la build provata:

```bash
adb root
adb disable-verity          # only if remount is refused; this reboots the panel
adb remount                 # or: adb shell mount -o remount,rw /system
adb push su /system/xbin/su
adb shell chmod 06755 /system/xbin/su
```

:::danger
Disabilita le app eWeLink (`com.eWeLinkNSPro.dev`, `com.eWeLinkControlPanel`) solo **dopo** aver confermato l'affidabilità di adb e `su` e avere un altro modo per andare a Home e Indietro; le azioni di navigazione dell'app del pannello lo permettono. Lo stack **gateway Zigbee** eWeLink è indipendente da queste app e continua a funzionare; gestiscilo con l'[interruttore router Zigbee](#gateway-zigbee) anziché rimuoverlo.
:::

## WebView: aggiorna prima questo

Un 86P appena riflashato al firmware `3.5.1` (build `164637`) è stato verificato con `com.android.webview` **107.0.5304.105** (Chromium 107), troppo vecchio per visualizzare una plancia Home Assistant attuale. Altri firmware e modelli possono differire: controlla il fornitore installato prima di decidere se aggiornare. I differenziali OTA archiviati non includono un APK WebView, quindi questa versione è stata letta dall'unità funzionante con `dumpsys webviewupdate`. Quell’unità esegue Chromium **138** dopo un aggiornamento adb. Installazione e aggiornamenti dell’app del pannello avviati da Home Assistant possono installare un WebView verificato compatibile. Se il tentativo resta incompleto, scegli **Riprova** nella Riparazione di aggiornamento del pannello per continuarlo. L’alternativa manuale è un aggiornamento adb; vedi [Aggiornare WebView di sistema](/it/hardware/guides/update-the-webview/#alternativa-manuale).

## LED

Su questa unità non sono stati trovati né un nodo RGB `/sys/class/leds` né `/dev/ledjni`, quindi su NSPanel Pro **non è caratterizzato alcun LED RGB controllabile dall'app o tramite sysfs** (confronta il nodo `avsux` del TPA10 e `/dev/ledjni` del WF1589T). Luminosità e retroilluminazione schermo usano i percorsi Android standard.

## Sensori: luce e prossimità accessibili direttamente all'app

A differenza del TPA10, dove temperatura e umidità richiedono root, NSPanel Pro espone il sensore combinato Sensortek tramite `SensorManager` standard: `android.sensor.light`, `android.sensor.proximity` e `android.sensor.accelerometer`, tutti leggibili da un'app normale senza root. Qui l'app del pannello legge direttamente luce e prossimità. Non sono montati sensori di temperatura o umidità.

:::note
**Le letture di prossimità dipendono da firmware e modello.** Il sensore è un Sensortek STK3A5x in un'apertura del PCB superiore dietro il vetro. Il valore a riposo varia molto tra unità (circa 1000 su una, circa 4000 su un'altra); conta solo la variazione _relativa_, quindi un valore alto a riposo è normale, non un guasto. Fino a circa firmware **3.3** riporta una lettura graduata ogni circa 50 ms; tra circa **3.3 e 3.4** il driver kernel l'ha resa binaria, 0 o 1. **4.0.12 ha ripristinato letture graduate solo sull'86P**; il **120P è rimasto binario**. La configurazione guidata calibra entrambi i segnali e salva il risultato, poi il pannello normalizza l'intervallo utile tra i tuoi pannelli: i profili non codificano soglie per firmware né classificatori graduati e binari. (Fonti: segnalazioni degli strumenti seaky [142](https://github.com/seaky/nspanel_pro_tools_apk/issues/142), [144](https://github.com/seaky/nspanel_pro_tools_apk/issues/144), [171](https://github.com/seaky/nspanel_pro_tools_apk/issues/171) e [262](https://github.com/seaky/nspanel_pro_tools_apk/issues/262).)
:::

### Dispositivi I²C associati

| Indirizzo I²C       | Driver o nome               | Descrizione                                                      |
| ------------------- | --------------------------- | ---------------------------------------------------------------- |
| `0-0020`            | `rk809`                     | PMIC                                                             |
| `1-001a` / `1-005a` | `CST226` / `CST226SE`       | Controller touch capacitivo Hynitron                             |
| `2-003c`            | `tp`                        | pannello touch                                                   |
| `2-0046`            | `ls_stk3a5x` e `ps_stk3a5x` | Sensortek **STK3A5x** combinato luce ambiente e prossimità       |
| `2-0047`            | `ls_stk3x3x` e `ps_stk3x3x` | Sensortek **STK3x3x** luce e prossimità (componente alternativo) |

## Gateway Zigbee

NSPanel Pro integra una **radio Silicon Labs EFR32 Zigbee 3.0** su UART `/dev/ttyS5`, gestita dallo stack host del produttore (`/vendor/bin/siliconlabs_host/zgateway`) tramite un broker MQTT locale. Le app eWeLink usano lo stesso stack, per questo il pannello viene fornito come hub Zigbee eWeLink.

L'app del pannello lo gestisce direttamente. `switch.<panel>_zigbee_router` trasforma il pannello in un **router** Zigbee che estende la mesh esistente (avvia il gateway e assicura il ruolo Repeater) e lo spegne di nuovo (fermando il gateway e liberando la radio). Funziona tramite il broker locale, senza credenziali e senza gestire direttamente `ttyS5`. Il pannello compare quindi come un normale router nel coordinatore ZHA o Zigbee2MQTT.

:::note
Cambiare ruolo **non è un riflash**: non ci sono passaggi `.gbl` o bootloader, viene solo impostato il tipo di nodo EZSP. Per interventi sul firmware a livello di partizione, vedi [Backup e ripristino del firmware](/it/hardware/guides/firmware-backup-and-restore/).
:::

:::note
**Non è documentato o caratterizzato alcun Thread Border Router.** Lo stack installato del produttore usa EFR32 come NCP Zigbee. Il chip EFR32MG21 supporta più protocolli, ma questo non dimostra firmware Thread o un border router sul pannello; Sonoff documenta invece un Matter Bridge.

**Il firmware 4.x ha rielaborato lo stack Zigbee.** L'ispezione della comunità ha trovato un fork Zigbee2MQTT, una password MQTT sul dispositivo diversa e una sequenza di avvio cambiata. [Sonoff documenta il passaggio tra coordinatore e router](https://sonoff.tech/blogs/news/nspanel-pro-v4-3-0-central-heating-redefining-whole-home-temperature-automation) nel firmware attuale, ma il controllo tramite broker locale dell'app del pannello è stato realizzato per 3.x e precedenti e **potrebbe richiedere adattamenti su 4.x**. (Fonti della comunità: segnalazioni strumenti seaky [241](https://github.com/seaky/nspanel_pro_tools_apk/issues/241), [244](https://github.com/seaky/nspanel_pro_tools_apk/issues/244) e [255](https://github.com/seaky/nspanel_pro_tools_apk/issues/255), e [segnalazione roottool 3](https://github.com/seaky/nspanel_pro_roottool_apk/issues/3).)
:::

:::caution
**Un difetto nel watchdog Zigbee storico del produttore è confermato da un segnalatore su NSPanel Pro 120 con firmware originale 3.8.0.** Il firmware contenente l'assegnazione ricorsiva `LD_LIBRARY_PATH` descritta nella [segnalazione](https://github.com/panel-assistant/android/issues/34) può col tempo far fallire con `E2BIG` ogni comando esterno avviato dal watchdog, consumare un core CPU e smettere di recuperare un `zgateway` bloccato. Un riavvio risolve il problema solo temporaneamente. Vedi [Ottimizzazione delle prestazioni](/it/manage/performance/) per le prove e i requisiti di una correzione sicura. La soluzione temporanea del segnalatore non è stata validata indipendentemente. L'ispezione della comunità di 4.0.12 e 4.6.0 non ha trovato l'assegnazione vulnerabile.
:::

### Requisiti: firmware 2.2.0 o successivo

Lo stack host è il gateway eWeLink e Sonoff **del produttore**, con versione corrispondente al firmware del pannello (per esempio `sonoff-v3.5.4`). La **modalità router** Zigbee è arrivata con **NSPanel Pro firmware 2.2.0** (2023; app eWeLink, _Impostazioni dispositivo, Funzioni sperimentali, Modalità Zigbee_), e il supporto ripetitore dello stack host locale nel pacchetto gateway 1.1.9. In pratica:

- **Gateway presente** (firmware 2.2.0 o successivo, oppure caricato manualmente): l'app del pannello lo rileva e pubblica `switch.<panel>_zigbee_router`. Attivalo e il pannello si associa al coordinatore come router.
- **Nessun gateway** (firmware molto vecchio, mai configurato): l'interruttore **non compare**, perché dipende dall'esistenza dello script di avvio del gateway. Aggiorna il firmware a 2.2.0 o successivo.

L'app del pannello **controlla** il gateway; non lo include né installa, perché è un binario eWeLink. Il firmware 4.x aggiunge un bridge Matter e può esportare dispositivi Zigbee a Home Assistant tramite MQTT Discovery, come alternative al ruolo router.

### Salute del gateway e contenimento automatico

Su un pannello Zigbee, `sensor.<panel>_zigbee_gateway_health` riporta lo stack del produttore indipendentemente dall'interruttore router: un gateway originale non configurato resta visibile senza concedere all'app il permesso di fermarlo.

Quando l'interruttore router è stato attivato esplicitamente, l'app concede 15 minuti per avvio e associazione, poi controlla una volta al minuto due segnali di funzionamento incontrollato: una rete esplicitamente non valida o non associata insieme a oltre il 50% di un core CPU per cinque campioni consecutivi, oppure almeno tre cambi di ID processo del gateway in dieci minuti. Un router associato con CPU elevata persistente produce solo un avviso e continua a funzionare. Layout 4.x sconosciuti o prove di associazione specifiche del firmware mancanti portano in sicurezza a `unknown`.

Attivare l'interruttore router Zigbee richiede esplicitamente la modalità Repeater anche quando il gateway del produttore è già in esecuzione: attivarlo mentre il coordinatore ZHA o Zigbee2MQTT consente associazioni equivale a un nuovo tentativo di associazione senza avviare un secondo supervisore gateway.

La scheda Configura mostra l'azione **Richiedi associazione** subito sotto l'interruttore router Zigbee; l'interruttore resta l'unico controllo di accensione e spegnimento. Abilita il permesso di associazione in ZHA o Zigbee2MQTT, poi richiedi l'associazione e conferma che il permesso sia aperto. L'azione riafferma la modalità Repeater, avvia un nuovo periodo di tolleranza di 15 minuti e interroga lo stato di salute; non riavvia il pannello. Il pulsante non è disponibile quando il router è disabilitato, già associato o in attesa dopo una richiesta recente.

Dopo il periodo di tolleranza, un gateway abilitato ancora non associato produce un avviso persistente nella Dashboard e nella scheda Installa, collegato a quell'azione Configura. Non lasciarlo in quello stato: i tentativi ripetuti possono consumare molta CPU. Associa il pannello come router oppure disattiva l'interruttore router Zigbee.

Se un gateway storico configurato soddisfa una regola di funzionamento incontrollato, l'app disattiva persistentemente l'interruttore router e tenta un contenimento limitato. Il contenimento nativo del produttore può riguardare solo il guardiano Sonoff, `zgateway` e il broker locale corrispondente. Se un processo non può essere fermato, viene rimosso dove possibile chi lo riavvia e il lavoro gateway superstite viene declassato a nice 19 e al cpuset Android in background. Riattivare più tardi l'interruttore avvia un nuovo periodo di tolleranza e tentativo.

Gli attributi di salute comprendono firmware e versione prodotto, layout gateway e versione pacchetto, stato di associazione e ruolo, CPU arrotondata di gateway e guardiano, numero di riavvii recenti e risultato del contenimento. Non includono mai la chiave della rete Zigbee, credenziali grezze del broker locale, indirizzo MAC della radio o `netinfo` grezzo del gateway.

### Migrazione da NSPanelTools

Se NSPanelTools ha installato il gateway Sonoff su un pannello più vecchio, lo stack host in `/vendor` sopravvive alla rimozione di NSPanelTools. Rimuovi NSPanelTools prima di abilitare i controlli schermo e sensori di Panel Assistant per evitare azioni duplicate. Panel Assistant può controllare il gateway esistente; lasciando attivo l'interruttore router Zigbee, avvia il gateway all'accensione anche se il precedente hook di avvio è stato rimosso.

### Interni dello stack host EZSP

Nello stack storico nativo del produttore (3.x e precedenti), la radio esegue **firmware EZSP NCP** (EFR32MG21, EZSP v8). `zgateway` è un binario _host_ EZSP in `/vendor/bin/siliconlabs_host/`, mantenuto attivo dal proprio supervisore `guard_process.sh` (ciclo di 5 secondi, avviato all'accensione) e controllato tramite un **broker mosquitto locale** su `127.0.0.1:1883`. Il broker è anonimo: la riga `password_file` è commentata in `mosquitto.conf`. Lo stack 4.x differisce come descritto sopra.

- Stato del ruolo: `zigbee/system/network-role/information` restituisce `{"role":"Repeater"|"Coordinator"}`
- Cambio di ruolo: pubblica `{"role":"Repeater"}` su `zigbee/system/network-role/switch`

"Repeater" è la modalità router, che estende una mesh esistente; il ruolo persiste nella memoria non volatile dell'NCP. Il `zgateway` del produttore sopravvive alla rimozione delle _app_ eWeLink, perché risiede in `/vendor`, non in un APK.

Per un coordinatore Zigbee2MQTT o ZHA completo e autonomo _sul pannello_, vedi invece [seaky/nspanel_pro_zigbee](https://github.com/seaky/nspanel_pro_zigbee), che sostituisce lo stack host. È più pesante e non è ciò che fa l'app del pannello.

## Riepilogo del modello di accesso

- **Luce, prossimità, accelerometro:** accesso diretto dell'app (`SensorManager`).
- **Luminosità schermo, sospensione, navigazione, sintesi vocale:** percorsi Android standard (`su` per spegnere davvero la retroilluminazione).
- **LED:** nessuno caratterizzato.
- **Zigbee:** radio EFR32 gestita tramite il broker locale del gateway sul dispositivo (`switch.<panel>_zigbee_router`).
- **Radio:** Zigbee 3.0, Wi-Fi e Bluetooth.

## Prestazioni attese

NSPanel Pro ha **CPU e RAM limitate** per plance ricche:

- A riposo funziona a 408 MHz con circa 500 MB di RAM usata; una plancia pesante sollecita entrambe.
- **2 GB di RAM sono il vincolo principale.** WebView della plancia, Android e app in background competono per la memoria; plance grandi con molte schede, immagini grandi, grafici storici lunghi o schede personalizzate onerose causano ricaricamenti WebView e scatti.
- I core A35 rendono transizioni e animazioni visibilmente più lente rispetto ai pannelli A55 o A72.

Con il renderer integrato, inizia dal filtro automatico delle entità della plancia descritto in [Ottimizzazione delle prestazioni](/it/manage/performance/), affinché il pannello non elabori stati che la plancia non mostra mai. Poi usa le schede delle prestazioni nella scheda Dashboard per trovare le viste ancora pesanti, pressione sulla memoria o limiti termici prima di semplificare la plancia.
