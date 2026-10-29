---
title: Smatek S9E
description: Dati hardware dello Smatek S9E, pannello da incasso Rockchip RK3566 da 10,1 pollici con due relè di rete, quattro pulsanti retroilluminati a LED, prossimità radar, Zigbee, Ethernet e RS485.
vendor: Smatek
model: S9E
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Provato dalla comunità
root: Relè, LED dei pulsanti, prossimità (su dall'app segnalato funzionante)
webview: Chromium 83 su 2024-07; 131 su 2025-12
released: 'non prima del 2021 (stima, SoC RK3566)'
photos:
  - src: 'asset:hardware-smatek-s9e-front.jpg'
    alt: Smatek S9E, davanti e dietro, con cablaggio dei relè e dei morsetti
photoCredit: 'Foto: Smatek'
sold_as_note: 'Versione Zigbee (Tuya) con due relè di rete, AC 100-240 V'
sold_as:
  - brand: Smatek
    name: 'S9E-NZ'
    note: 'Versione Android senza gateway Zigbee: RS485, quattro pulsanti, AC 100-240 V'
  - brand: Smatek
    name: 'S9PE-NZ'
    note: 'Come S9E-NZ, alimentato tramite Ethernet (PoE) o DC 9-24 V anziché dalla rete elettrica'
evidence: [firmware, documented, platform, owners]
sidebar:
  label: S9E
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Non sono state trovate note di rilascio del produttore per le versioni documentate qui. Il confronto delle versioni sotto deriva dall'ispezione delle immagini fornite, non da un registro delle modifiche del produttore.

:::note
A differenza dei pannelli pienamente supportati, l'S9E **non** è stato analizzato tramite reverse engineering su un'unità disponibile. Le specifiche provengono dall'inserzione Smatek e i percorsi di controllo da [seaky/nspanel_pro_tools_apk issue 98](https://github.com/seaky/nspanel_pro_tools_apk/issues/98), dalla discussione della comunità Home Assistant e dai segnalanti. Un proprietario ha azionato relè e LED dei pulsanti da Home Assistant sul firmware 1.1.0 ([issue 93](https://github.com/panel-assistant/android/issues/93)); considera non confermati gli altri dettagli dei percorsi di controllo finché non vengono convalidati.
:::

Un pannello da incasso RK3566 **1920×1200** da 10,1 pollici, della stessa famiglia SoC del TPA10, con **due relè di rete integrati**, quattro pulsanti retroilluminati a LED, sensore di prossimità radar e **Zigbee, Ethernet e RS485**.

## Accesso iniziale al debug

**ADB di rete sulla porta TCP 5555 senza computer: non stabilito.** Un proprietario che esegue Panel Assistant o una build firmware che offre root non dimostra come un pannello nuovo attivi il debug.

**Nemmeno la procedura iniziale di debug USB è stabilita.** Chiedi al fornitore le istruzioni di debug per il firmware esatto e la conferma di una porta USB dati. Se offre debug USB, usa il [programma di installazione USB](/it/install/install-over-usb/); non presumere che una porta di ricarica fornisca ADB. Qui non è disponibile una sequenza verificata del menu di fabbrica.

I controlli root richiedono una connessione ADB già funzionante. Accesso root e accesso iniziale al debug sono questioni separate.

## Venduto anche come

Smatek S9E, Smatek S9, S9E-NZ (senza gateway Zigbee), S9PE, S9PE-NZ (variante PoE), `Build.MODEL` S9, `Build.DEVICE` rk3566_r, `ro.product.version` S9_Android_1.0.2 e S9_Android_1.1.0.

:::tip
I dati più utili: condivide la piattaforma **RK3566** del TPA10, quindi le funzioni lato app probabilmente funzionano senza codice specifico S9E. I **relè commutano carichi di rete** (sysfs root, segnalati funzionanti da un proprietario su 1.1.0). I pulsanti emettono KeyEvent **da `F1` a `F4`** (diretti all'app, senza root). Controlla prima la WebView: il firmware 2024-07 include **Chromium 83**.
:::

|               |                                                                                                                                                                                                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC           | Rockchip **RK3566** (quattro Cortex-A55), la stessa famiglia SoC del TPA10                                                                                                                                                                                                                                                               |
| RAM e memoria | **2 GB** RAM, **16 GB** eMMC                                                                                                                                                                                                                                                                                                             |
| Schermo       | **10,1 pollici**, **1920×1200** multi-touch                                                                                                                                                                                                                                                                                              |
| Android       | 11                                                                                                                                                                                                                                                                                                                                       |
| Connettività  | Wi-Fi, Bluetooth, **Zigbee**, **RJ45 Ethernet**, **RS485** (esiste anche una variante PoE, **S9PE**)                                                                                                                                                                                                                                     |
| Sensori       | **radar** di prossimità, **luce** ambientale, **temperatura e umidità**                                                                                                                                                                                                                                                                  |
| Ingressi      | **4 pulsanti fisici** con LED individuali                                                                                                                                                                                                                                                                                                |
| Relè          | **2 relè di rete integrati**                                                                                                                                                                                                                                                                                                             |
| Root          | L'app del produttore usa `execRootCmd`, quindi root è disponibile; alcune unità vengono fornite con modalità sviluppatore sbloccata. La segnalazione di un proprietario mostra `su` raggiungibile da una normale sandbox dell'app su 1.1.0; questo determina se l'app pilota direttamente i nodi sysfs o richiede il demone helper root. |
| Uscita        | Data non certa; la famiglia SoC RK3566 è arrivata sul mercato soltanto intorno al 2021, il miglior limite inferiore trovato per questo pannello ([copertura delle schede tecniche RK3566, CNX Software, dicembre 2020](https://www.cnx-software.com/2020/12/16/rockchip-rk3566-and-rk3568-datasheets-and-features-comparison/))          |

:::danger
Le superfici di controllo sotto sono scritture **sysfs root** e i relè commutano **carichi di rete elettrica**. Il supporto è implementato dai percorsi segnalati e un proprietario riporta relè e LED dei pulsanti funzionanti su 1.1.0; il percorso `st_relay` di 1.0.2 è **non confermato**, quindi convalidalo sul tuo S9E prima di farvi affidamento.
:::

:::tip
Poiché l'S9E condivide la piattaforma **RK3566** del TPA10, le funzioni lato app esistenti probabilmente funzionano senza codice specifico S9E e temperatura, umidità e luce potrebbero emergere tramite `SensorManager`. Sul firmware più vecchio la **WebView inclusa è molto vecchia (Chromium 83)**: aggiornala prima, con Magisk OpenWebView, firmware 2025-03-24 o SystemWebView installata esternamente. Il firmware 2025-12 include già Chromium 131. Vedi [Aggiornare la WebView di sistema](/it/hardware/guides/update-the-webview/).
:::

:::tip
L'S9E ha quattro pulsanti funzione frontali ma nessuna combinazione documentata di accensione e volume per il recupero. Tabella delle partizioni, percorso root e procedura di recupero non sono stati acquisiti sull'hardware reale: non applicare quindi senza modifiche la [guida di backup del firmware](/it/hardware/guides/firmware-backup-and-restore/) per TPA10 e WF1589T.
:::

## Versioni firmware

Sono state analizzate due immagini originali. Sono file OTA `.zip` basati su blocchi nel formato AOSP a partizioni dinamiche: decomprimi `.new.dat.br` con `brotli -d`, estrai l'immagine super con `lpunpack`, poi cerca in `build.prop` e nei file init `.rc` con `strings`. Entrambe riportano `Build.MODEL` **`S9`** e `Build.DEVICE` **`rk3566_r`**, Android 11; il codice della build del produttore è in **`ro.product.version`**:

| Immagine                           | `ro.product.version` | Build                        | Classe dei relè       |
| ---------------------------------- | -------------------- | ---------------------------- | --------------------- |
| `S9_1920x1200_20240712_Android_US` | `S9_Android_1.0.2`   | `eng.*.20240712`             | `/sys/class/st_relay` |
| `S9_1920x1200_20251202_Android_US` | `S9_Android_1.1.0`   | `eng.xiaolp.20251202.160404` | `/sys/class/strelay`  |

:::caution
**La classe sysfs dei relè è stata rinominata tra le versioni firmware.** Soltanto l'immagine **iniziale** (1.0.2) usa `/sys/class/st_relay`; **tutte le successive** (1.1.0 e oltre) usano `/sys/class/strelay`, confermato da [un segnalante](https://github.com/panel-assistant/android/issues/3) e dal confronto dei firmware. L'app verifica entrambi i nomi e usa quello esposto dal pannello; vedi [Relè](#relè-classe-strelay-o-st_relay-root).
:::

Entrambe le immagini sono state condivise dal segnalante da Smatek: `S9_1920x1200_20240712_Android_US` (**1.0.2**) e `S9_1920x1200_20251202_Android_US` (**1.1.0**). I collegamenti originali Smatek su `docs.smatek.store:10001` non sono più raggiungibili; contatta l'assistenza Smatek o il segnalante per una copia.

Il confronto mostra che **differiscono soltanto `ro.product.version` e la classe dei relè.** Ogni altro percorso di controllo documentato sotto (codici dei pulsanti, GPIO dei LED dei pulsanti, GPIO di prossimità, collegamenti dei sensori) è identico, quindi il rilevamento basato su `ro.product.version` che inizia con `S9` copre l'intera linea.

## Relè: classe `strelay` o `st_relay` (root)

L'app espone i due relè di rete come `switch.<panel>_relay1` e `switch.<panel>_relay2`, soltanto su un pannello che possiede la classe sysfs dei relè.

:::note
**Il nome della classe dipende dal firmware** (vedi [Versioni firmware](#versioni-firmware)): `st_relay` sull'immagine iniziale 1.0.2, `strelay` su 1.1.0 e successive. L'app verifica **entrambi** i nomi e usa quello esposto dal pannello.
:::

```bash
# firmware 1.1.0+ (most panels in the field)
echo 1 > /sys/class/strelay/relay1    # on
echo 0 > /sys/class/strelay/relay1    # off
echo 1 > /sys/class/strelay/relay2

# firmware 1.0.2 (initial release)
echo 1 > /sys/class/st_relay/relay1
```

## Pulsanti: KeyEvent da `F1` a `F4` (diretti all'app)

I quattro pulsanti emettono i codici tasto Android standard **da 131 a 134**, da `KEYCODE_F1` a `KEYCODE_F4`. L'acquisizione tramite accessibilità dell'app li riporta in `event.<panel>_button` (tipi di evento da `KEYCODE_F1` a `KEYCODE_F4`); associa loro azioni della plancia in Home Assistant. Gli eventi non richiedono root.

## LED: retroilluminazione GPIO per pulsante

Ogni pulsante ha un LED in `/sys/class/gpio/gpio<16+keycode>/value`, cioè GPIO **da 147 a 150** per i pulsanti da F1 a F4. Ognuno è acceso o spento, monocromatico. L'app li espone da `light.<panel>_button_led1` a `light.<panel>_button_led4` (commutati tramite `su`), contati dal valore `hardware.button_led_gpio_base` del profilo. I LED **non** sono sotto `/sys/class/leds`, che sull'S9E contiene soltanto il LED della scheda SD `mmc2::`; sono GPIO grezzi.

:::note
**Analisi del firmware:** gli script init esportano **soltanto `gpio113`**. I pin LED dei pulsanti **da gpio147 a gpio150 non vengono esportati all'avvio**, quindi i nodi `/sys/class/gpio/gpioNNN/value` non esistono fino all'esportazione. L'app esporta ogni pin su richiesta e lo imposta come uscita prima della prima scrittura: ecco perché i LED funzionano pur non essendo esportati all'avvio.
:::

```bash
echo 147 > /sys/class/gpio/export        # one-time, if the node is absent
echo 1 > /sys/class/gpio/gpio147/value   # button F1 LED on
```

:::tip
Il firmware include anche un **LED di stato RGB** (`led_r`, `led_g`, `led_b`), un **motore di vibrazione** e **LED di attività Ethernet**. L'app non espone nessuno di essi.
:::

## Sensori: la prossimità proviene da GPIO 18, non da `SensorManager`

:::caution
Un sensore di prossimità è _registrato_ in `SensorManager` e dichiara `Proximity=yes · Binary · 0/1 cm`, ma sull'S9E **non genera mai eventi**. Le letture reali di un segnalante, in [una segnalazione successiva](https://github.com/panel-assistant/android/issues/5), hanno stabilito che il percorso Android rimane silenzioso. Il sensore di luce sullo stesso pannello funziona (circa 46 lx), quindi il problema è specifico della prossimità; il segnale reale viene letto da `gpio18`.
:::

Il segnale reale è una **lettura GPIO root su GPIO 18**. Il kernel registra un sensore Android fantasma che non scatta mai, quindi il valore deve essere letto da sysfs:

```bash
cat /sys/class/gpio/gpio18/value   # 1 = near, 0 = far  (no export needed — reporter-confirmed)
```

Il profilo S9E dichiara quindi `sensors.proximity_gpio: 18` anziché usare la sorgente `SensorManager` inattiva. L'helper root mantiene aperto il descrittore del valore e trasmette subito le variazioni dove il kernel supporta i fronti GPIO; altrimenti ricontrolla lo stesso descrittore due volte al secondo. La perdita del descrittore viene segnalata esplicitamente, così Home Assistant mostra il sensore non disponibile finché il flusso dell'helper recuperato non fornisce il valore attuale. Il segnale usa la stessa configurazione guidata e calibrazione salvata dei sensori Android; presenza calibrata e gesti diventano disponibili dopo che la configurazione riesce. Un segnalante ha confermato che gpio18 legge **0 lontano, 1 vicino** e la configurazione guidata misura gli estremi anziché affidarsi a una polarità indovinata. Luce ambientale, temperatura e umidità emergono da `SensorManager` come previsto.

## Riepilogo del modello di accesso

- **Relè:** `switch.<panel>_relay1` e `switch.<panel>_relay2` tramite la classe sysfs dei relè (root); vengono verificati sia `strelay` sia `st_relay`.
- **Pulsanti:** `event.<panel>_button` (da `KEYCODE_F1` a `KEYCODE_F4`), diretti all'app tramite accessibilità.
- **LED dei pulsanti:** da `light.<panel>_button_led1` a `light.<panel>_button_led4` tramite `su` (GPIO da 147 a 150, esportati su richiesta).
- **Prossimità:** `binary_sensor.<panel>_proximity` calibrato e `sensor.<panel>_proximity_level` normalizzato dal flusso di eventi `gpio18` mantenuto dall'helper root. Il sensore di prossimità `SensorManager` si registra ma non scatta mai, quindi viene aggirato.
- **Luce:** `sensor.<panel>_illuminance` tramite `SensorManager`, che **funziona**.

## Fonti

- [La segnalazione Smatek S9E su GitHub](https://github.com/panel-assistant/android/issues/3): `/diag` del segnalante (stringhe di rilevamento, prossimità `SensorManager`), rinomina della classe dei relè da `st_relay` a `strelay` e le due immagini firmware.
- Firmware originale Smatek S9E condiviso dal segnalante: 1.0.2 (20240712) e 1.1.0 (20251202), le due immagini analizzate. I collegamenti originali Smatek (`docs.smatek.store:10001`) non sono più raggiungibili.
- [seaky/nspanel_pro_tools_apk issue 98, «Add Smatek S9E Support»](https://github.com/seaky/nspanel_pro_tools_apk/issues/98): percorsi di controllo di relè (`st_relay`), pulsanti (codici da 131 a 134), LED dei pulsanti (GPIO da 147 a 150) e prossimità (GPIO 18).
- [Comunità Home Assistant: «Smatek S9E Touch Panel»](https://community.home-assistant.io/t/smatek-s9e-touch-panel/828244): aggiornamento WebView, script di prossimità GPIO 18, note sull'integrazione.
- [Pagina prodotto Smatek S9E](https://smatek.com/product/10-1-inch-smart-control-panel-s9e/) e [variante PoE S9PE-NZ](https://smatek.com/product/10-1-inch-android-panel-s9e-nz/): SoC, RAM e memoria, schermo, sensori, connettività.
- [Scheda tecnica Smatek S9E (PDF)](https://smatek.com/wp-content/uploads/2025/03/Smatek-S9E-10-Super-Smart-Control-Panelin-wall-SPEC.pdf): scansione solo immagine da cui non è possibile estrarre testo, ma è la scheda tecnica originale.
