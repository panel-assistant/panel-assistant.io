---
title: Tuya TPA10
description: Dati hardware del Tuya TPA10, un pannello Rockchip rk3566 da 10,1 pollici con LED RGB, cinque pulsanti, fotocamera e sensori di temperatura, umidità e prossimità.
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Completo
root: su presente; helper per LED, clima e quinto pulsante
webview: Chrome 83; sostituzione con LineageOS 150 tramite root
released: '2023-08 (stima)'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10, vista frontale con la striscia laterale dei pulsanti
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Tuya TPA10, vista frontale piatta con la striscia laterale dei pulsanti e il bordo della cornice
photoCredit: 'Foto: Tuya'
sold_as:
  - brand: Tuya
    name: 'TPA10-M2'
    note: 'Nome nel catalogo Tuya'
  - brand: Tuya
    name: 'Control Panel MAX'
    note: 'Nome commerciale e nella registrazione FCC'
evidence: [bench, mostly-open, firmware, documented, owners]
sidebar:
  label: TPA10
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Non sono state trovate note di rilascio del firmware del produttore per questo pannello. I dati sul firmware in questa pagina sono osservazioni del dispositivo esaminato.

Un ampio pannello rk3566 **10,1 in 1920×1200** con un singolo LED RGB frontale, retroilluminazione monocromatica dei pulsanti, numerosi sensori (prossimità a tempo di volo, temperatura e umidità, luce ambiente), fotocamera e cinque pulsanti fisici. Non ha Zigbee, NFC o IR. Analizzato tramite reverse engineering su un'unità funzionante (Android 11, con root e `su` presente).

## Venduto anche come

Tuya TPA10, TPA10, TPA10-M2 (M2A, M2E, M2U, M2X), TPA10 Control Panel MAX, Control Panel MAX, Panel MAX, pannello Tuya rk3566, SmartOS Xinch (pacchetti del produttore `com.smartos.xinch.setting`, `com.smartos.xinch.hardware`, `com.smartos.xinch.platform.ethernet`), `com.tuya.devicetest`.

:::tip
Le informazioni essenziali: adb è **protetto da password**, quindi usa l'accesso alternativo tramite l'app diagnostica USB. Il LED e i sensori riservati a root richiedono il **demone helper root `hapaneld-helper`**. Scrivere `custom_animation` sul LED frontale può **riavviare il pannello** (vedi l'avvertenza sotto). Aggiorna **prima WebView**; vedi [WebView: aggiorna prima questo](#webview-aggiorna-prima-questo).
:::

|         |                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **rk3566**                                                                                                                                                                                        |
| Schermo | **1920×1200** (16:10 orizzontale), circa 10,1 in, **circa 226 ppi fisici**, 56 Hz. Densità logica di base Android di fabbrica **240 dpi** (spesso modificata per dimensionare la plancia; consigliati 212) |
| Android | 11 (API 30)                                                                                                                                                                                                |
| ABI     | armeabi-v7a (spazio utente a 32 bit)                                                                                                                                                                       |
| Radio   | Wi-Fi, Bluetooth e BLE, più una funzione del produttore `com.smartos.xinch.platform.ethernet` (cablata, PoE). **Niente Zigbee, NFC, IR o rete cellulare.**                                                 |
| Root    | `su` disponibile; LED e sensori sysfs sono `system:system`, quindi **serve un demone helper root** (vedi sotto).                                                                                           |
| Uscita  | Circa agosto 2023 (stima); FCC ID 2A789-TPA10, registrato come "Control Panel MAX", approvato intorno al 22 agosto 2023 ([registrazione FCC ID 2A789-TPA10](https://fccid.io/2A789-TPA10))                 |

:::tip
Stai cambiando firmware su un pannello senza pulsanti? Leggi prima [Backup e ripristino del firmware](/it/hardware/guides/firmware-backup-and-restore/). Il TPA10 (rk3566, Android 11, eMMC `mmcblk2` da 7,28 GB) ha un percorso Loader verificato attivabile via software tramite `adb reboot loader` e `rkdeveloptool`. Il [pulsante nel forellino](#pulsanti) non è un ingresso Linux e il suo comportamento di ripristino di fabbrica o Maskrom non è stato confermato in sicurezza: non considerarlo un percorso di recupero.
:::

## Ottenere accesso adb e root

Il TPA10 viene fornito con adb **protetto da password** e adb di rete disattivato. Il percorso affidabile per il primo accesso è l'accesso alternativo tramite l'app diagnostica USB, senza calcoli di password. `su` è già presente, quindi una volta ottenuto adb hai root. Sintesi di [seaky/nspanel_pro_tools_apk, segnalazione 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123).

**Percorso iniziale.** Non esiste un modo verificato di abilitare ADB di rete sulla porta TCP 5555 senza un computer. Usa prima USB, seguendo la procedura dell'app diagnostica sotto; i successivi comandi root rendono persistente ADB di rete solo dopo quella prima connessione.

**1. Abilita Opzioni sviluppatore.** Impostazioni, _Informazioni_, tocca sette volte il numero build o versione.

**2. Primo accesso tramite l'app diagnostica USB (consigliato).** Opzioni sviluppatore espone un'**app diagnostica** di ingegneria Tuya con interfaccia solo in cinese. Mentre l'app è aperta, adb tramite la porta **USB** è consentito _senza_ password e la sessione ha già root. Collega USB ed esegui:

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

Il root adb del TPA10 è più affidabile tramite la porta USB che tramite rete.

**3. Rendi adb persistente (root, senza password, percorso affidabile).** Con l'app diagnostica in primo piano hai una sessione adb con root (`su` è presente e funziona anche `adb root`, essendo una build `userdebug`). Usala per rendere adb persistente, senza più bisogno dell'app di test o di una password. Sopravvive alla chiusura dell'app diagnostica **e** a un riavvio completo, verificato su un'unità funzionante. Trasferisci ed esegui come root:

```bash
# persist-adb.sh — run via the diagnostics-app backdoor:
#   adb push persist-adb.sh /data/local/tmp/ && adb shell su 0 sh /data/local/tmp/persist-adb.sh
settings put global adb_enabled 1                   # USB debugging, persisted in /data
settings put global development_settings_enabled 1  # keep Developer options visible
setprop persist.adb.tcp.port 5555                   # network adb on :5555 — persist.* survives reboot

# Pre-authorise each controlling machine so NO on-screen "Allow USB debugging" is needed after reboot.
# Append the contents of every workstation's ~/.android/adbkey.pub (one key per line):
mkdir -p /data/misc/adb
cat >> /data/misc/adb/adb_keys <<'KEYS'
PASTE-EACH-adbkey.pub-LINE-HERE
KEYS
chmod 640 /data/misc/adb/adb_keys
chown system:shell /data/misc/adb/adb_keys 2>/dev/null
restorecon /data/misc/adb/adb_keys 2>/dev/null

setprop ctl.restart adbd                            # apply now (and it auto-starts every boot)
echo "adb persisted: adb_enabled=$(settings get global adb_enabled) tcp=$(getprop persist.adb.tcp.port)"
```

Il pannello deve essere su Wi-Fi per il percorso di rete. Da quel momento, `adb connect <panel-ip>:5555` funziona da qualsiasi macchina preautorizzata, anche dopo riavvii, con le app del produttore chiuse. Cancellare `/data` o ripristinare le impostazioni di fabbrica elimina `adb_keys` e `adb_enabled`, quindi in seguito esegui di nuovo lo script.

:::caution
**La password "Abilita ADB" in Opzioni sviluppatore non è un percorso utilizzabile: non cercare di calcolarla.** La ricetta della comunità nella [segnalazione 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) non è riproducibile. La decompilazione di `checkDevPassword` in `com.smartos.xinch.setting` ne conferma la _struttura_: `base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))` poi `takeLast(6)`, senza distinzione tra maiuscole e minuscole (oppure `takeLast(ro.tuya.uuid,6)` quando `deviceId` è vuoto). Ma il `deviceId` usato non è stato associato ad alcun identificatore leggibile: `ro.serialno`, `android_id` e `ro.tuya.key` sono stati tutti rifiutati su un'unità funzionante. Il logger dell'app **non** è logcat, quindi neppure il valore atteso è leggibile sul dispositivo. Anche l'esempio svolto nella segnalazione contiene un refuso (`11a` più `xia` scritto come `11xia`; deve essere `11axia`). Usa il metodo root sopra, che rende irrilevante la password.
:::

:::danger
Disabilita i pacchetti del produttore `com.smartos.xinch.*` solo come **ultimissimo passaggio**, dopo aver confermato che adb è affidabile _e_ di avere un sostituto per i pulsanti hardware. Disabilitare le app hardware o delle impostazioni prima che adb sia affidabile può lasciarti senza accesso. Le azioni di navigazione remota dell'app del pannello (Indietro, Home) e le sue entità per retroilluminazione dei pulsanti e LED sostituiscono le funzioni dell'app del produttore.
:::

:::note
Le app del produttore sul dispositivo _non_ sono state una fonte utile per il reverse engineering. `com.tuya.devicetest` è odexed (nessun dex nell'APK) e `com.smartos.xinch.hardware` include l'**SDK AVS (Alexa)** Tuya (`libLibSampleApp.so`, 17 MB) e un lettore di tasti (`libjnimain.so`). La fonte autorevole sono i nodi sysfs autodescrittivi del dispositivo stesso.
:::

## WebView: aggiorna prima questo

WebView di serie è **Chrome 83**, troppo vecchio per il frontend attuale di Home Assistant: la plancia resta vuota o non funziona finché non lo sostituisci. La build consigliata è **LineageOS System WebView 150** (`armeabi-v7a`), un motore Chromium attuale, mantenuto e senza personalizzazioni. Preferiscilo a Cromite: Cromite modifica l'impostazione di riproduzione automatica di Chromium per _bloccarla_, impedendo l'avvio dei flussi delle schede fotocamera (WebRTC) di Home Assistant senza un tocco; LineageOS lascia consentita la riproduzione automatica, quindi i flussi partono da soli.

Il TPA10 ha margine limitato per la decodifica video in WebView. Più schede WebRTC 720p visibili possono perdere fotogrammi o lasciare un flusso in attesa del primo fotogramma anche se un singolo flusso funziona bene. In quel caso usa flussi secondari a risoluzione inferiore, meno schede con riproduzione automatica simultanea, oppure immagini statiche che passano al video dal vivo con un tocco.

Scaricalo dal mirror (URL stabile):

```
https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

### Perché una semplice installazione non funziona

WebView è distribuito come `com.android.webview`, quindi deve **sostituire** il fornitore di sistema, ed entrambi i percorsi più ovvi falliscono su questo pannello Android 11:

- `adb install -r` viene rifiutato con `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match`. Android consente di aggiornare `com.android.webview` solo con un APK firmato dalla **stessa chiave** di quello installato, e ogni fornitore WebView usa una chiave diversa. Per lo stesso motivo, **un semplice sideload non può eseguire questa prima sostituzione**: installa tramite `pm install`, che il pannello blocca. La sostituzione seguente è un passaggio manuale **una tantum**. Una volta installato LineageOS, le versioni LineageOS successive possono essere caricate con `adb install -r`, perché hanno lo stesso firmatario.
- L'elenco consentito della ROM accetta solo `com.android.webview`, non la variante `com.google.android.webview`: una build Google si installa ma non viene mai selezionata.

### Metodo funzionante con root: sostituire il file ed eliminare il vincolo della firma

Il pannello è vincolato alla firma ma consente root: l'app non può usare `su`, una shell sì (`adb shell su root <cmd>`). Il metodo inserisce il nuovo APK nella posizione WebView di _sistema_ ed elimina la sua voce dal database dei pacchetti, affinché PackageManager lo registri **da zero** al riavvio, leggendo la firma del nuovo APK senza conflitti.

```bash
IP=<panel-ip>:5555
adb connect $IP
adb -s $IP shell su root id                           # confirm it prints uid=0(root)

# 1. push the new WebView, and back up the current WebView + package database first:
adb -s $IP push lineageos-webview-150.0.7871.63-arm.apk /data/local/tmp/wv-new.apk
adb -s $IP shell su root sh -c 'cp /product/app/webview/webview.apk /data/local/tmp/webview.bak;
                                cp /data/system/packages.xml /data/local/tmp/packages.xml.bak'

# 2. replace the system WebView APK (remount /product read-write first — verity must already be off;
#    a never-modified panel needs a one-time `adb root && adb disable-verity && adb reboot` beforehand):
adb -s $IP shell su root sh -c 'mount -o rw,remount /product;
    cp /data/local/tmp/wv-new.apk /product/app/webview/webview.apk;
    chmod 644 /product/app/webview/webview.apk; chown root:root /product/app/webview/webview.apk;
    restorecon /product/app/webview/webview.apk'

# 3. remove the single <package name="com.android.webview" …>…</package> element from packages.xml.
#    Do NOT hand-edit it — pull it, let a parser remove exactly that element, then push it back:
adb -s $IP shell su root sh -c 'cp /data/system/packages.xml /data/local/tmp/pkgs.xml; chmod 644 /data/local/tmp/pkgs.xml'
adb -s $IP pull /data/local/tmp/pkgs.xml packages.xml
python3 - <<'PY'
import xml.etree.ElementTree as ET
d = open('packages.xml', encoding='utf-8').read()
m = '<package name="com.android.webview"'
assert d.count(m) == 1, 'expected exactly one com.android.webview package'
s  = d.find(m); ls = d.rfind('\n', 0, s) + 1                      # start of that line
e  = d.find('</package>', s) + len('</package>'); le = d.find('\n', e) + 1  # end of its closing line
new = d[:ls] + d[le:]
ET.fromstring(new)                                                # abort if the result isn't valid XML
open('packages.xml', 'w', encoding='utf-8').write(new)
print('removed com.android.webview; XML still valid')
PY
adb -s $IP push packages.xml /data/local/tmp/pkgs.new
adb -s $IP shell su root sh -c 'cp /data/local/tmp/pkgs.new /data/system/packages.xml;
    chown system:system /data/system/packages.xml; chmod 660 /data/system/packages.xml;
    restorecon /data/system/packages.xml'

# 4. reboot — PackageManager registers the new WebView fresh:
adb -s $IP reboot
```

**Se qualcosa va storto**, torna indietro con i backup del passaggio 1: ricopia `/data/local/tmp/webview.bak` su `/product/app/webview/webview.apk` e `/data/local/tmp/packages.xml.bak` su `/data/system/packages.xml` (con gli stessi `chown`, `chmod` e `restorecon`), poi riavvia.

:::danger
**La versione WebView riportata dopo questo metodo è errata: non fidartene.** `Impostazioni, WebView` e `adb shell dumpsys webviewupdate` mostrano ancora **`83.0.4103.120`**, perché un SystemWebView caricato manualmente **assume `versionName` e `versionCode` originali dell'OEM** per superare il controllo della versione minima del pannello ed essere selezionato. Il motore _effettivo_ è 150. Verificalo tramite:

- **User-Agent:** apri sul pannello una pagina che mostra il tuo user agent; lo UA contiene `Chrome/150.0.7871.63`.
- **L'app del pannello:** la pagina di stato del pannello e `/diag`, usando la porta HTTP indicata (8888 per impostazione predefinita), mostrano `engine Chromium 150.0.7871.63`, perché leggono lo UA, non la versione del pacchetto sostituita.

Un semplice sideload adb **non** funziona su questo pannello vincolato alla firma. Cromite 147 resta nel mirror come alternativa, usando la stessa procedura con un APK diverso.
:::

## LED

### LED RGB: driver `avsux` (demone helper root)

Il LED RGB frontale è un LED **singolo** (`avsux_info` riporta `led type:[single] nums:[1]`) sul driver di piattaforma `leds_pwm_avs` (dispositivo `avsux`), esposto in `/sys/class/leds/avs-pwm-led/`.

:::danger
È stato osservato che scrivere `custom_animation` in `avsux_select` **riavvia il pannello**. Usa `avsux_animation` per il colore e considera `avsux_select` e `custom_animation` di sola lettura, salvo durante test.
:::

Per il LED **non esiste alcun nodo `/dev` accessibile all'app** (confronta `/dev/ledjni` del [WF1589T](/it/hardware/panels/electron/wf1589t/)) e gli attributi sysfs sono `system:system`, quindi un'`untrusted_app` non può scriverli. L'app del pannello usa quindi un piccolo **demone helper root** (`/system/bin/hapaneld-helper`, eseguito come root su un socket Unix); `SocketLedController` è il client. Vedi la [documentazione dell'helper](https://github.com/panel-assistant/android/blob/main/helper/README.md).

#### Attributi sysfs `avs-pwm-led`

| Attributo         | Permessi           | Uso                                                       |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | livello complessivo da 0 a 255                            |
| `avsux_animation` | `system:system` rw | scrittura sicura di colore o animazione                   |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | elenca le animazioni denominate (`bootanime`, `idle`)     |
| `avsux_info`      | r                  | metadati (numero e tipo di LED)                           |

### Retroilluminazione dei pulsanti

`/sys/class/leds/button-backlight/brightness` è un'uscita PWM **monocromatica**, da 0 a 255 (driver standard `leds_pwm`, dispositivo `pwmleds`). È `system:system` 0664, quindi viene controllata dallo stesso demone `hapaneld-helper`.

## Sensori

Prossimità e luce ambiente sono accessibili direttamente all'app tramite `SensorManager`. Temperatura e umidità richiedono root (sottosistema input e I²C) e il demone helper.

:::tip
Il CHT8305 rende questo pannello utilizzabile come **sensore di temperatura e umidità ambiente** per Home Assistant. Il demone ausiliario lo legge con il proprio comando `CHT8305`, una lettura puntuale tramite `EVIOCGABS` dell'asse di input `ABS_THROTTLE` del driver, che identifica per nome i dispositivi di input `temperature` e `humidity`. L'app del pannello offre i sensori **Temperatura ambiente** e **Umidità ambiente** in Home Assistant. L'invio dei dati è abilitato per impostazione predefinita; i controlli si trovano in Configura, Sensori, nella vista Avanzate. L'impostazione avanzata **Correzione temperatura ambiente**, oppure `sensors.room_temp_offset_c` nel profilo, compensa il calore prodotto dal pannello stesso.
:::

Il sensore a tempo di volo del TPA10 rende la prossimità realmente basata sulla distanza, ma l'HAL Android la quantizza. La configurazione guidata sul pannello acquisisce e salva gli estremi libero e vicino e la direzione del sensore attivo; il pannello riporta poi la stessa scala normalizzata usata da ogni pannello supportato, anziché affidarsi a una soglia fissa specifica del dispositivo.

### Chip dei sensori e percorsi di accesso

| Sensore                    | Chip                                                                          | Accesso                                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Prossimità (tempo di volo) | Vishay **VI5300** (i2c-3 `0x6c`, `proximity_vi5300`, polling 30 ms)           | Android `SensorManager` `TYPE_PROXIMITY`, senza root. La distanza grezza in mm sul nodo I²C del driver (`…/i2c-3/3-006c`) richiede root. |
| Temperatura e umidità      | **CHT8305** (`temperature_cht8305` in 3-0040, `humidity_cht8305` in 3-0040-1) | **Non** in `SensorManager`; riporta tramite il **sottosistema input** su I²C, solo con root.                                             |
| Luce ambiente              | **CG5256** (`light_cg5256`)                                                   | Sensore di luce Android `SensorManager`, senza root.                                                                                     |

## Pulsanti

Il TPA10 ha **tre classi** di pulsanti fisici, confermate sul dispositivo con `getevent`:

- **I quattro pulsanti laterali:** `adc-keys`, KeyEvent standard associati da `F1` a `F4`, acquisiti dal filtro tasti di accessibilità dell'app del pannello senza percorsi speciali.
- **Il quinto pulsante (arancione):** un _interruttore_ `EV_SW`, non un tasto, letto dal lettore evdev del demone helper root e inviato a Home Assistant come evento.
- **Il pulsante nel forellino** (incassato, accanto alla porta USB-C): non è un ingresso Android, quindi non è disponibile per Home Assistant.

### Dettaglio dei pulsanti

**1. I quattro pulsanti laterali sono `adc-keys` e inviano KeyEvent standard.** Sono sul **SARADC** rk3566 (`fe720000.saradc`), dispositivo `adc-keys1` (`/dev/input/event7`), scancode da `59` a `62`. Il `Generic.kl` di serie li associa da **`F1` a `F4`**, che diventano da `KEYCODE_F1` a `KEYCODE_F4` Android; l'app del pannello li acquisisce tramite il filtro tasti di accessibilità. Su un'unità con `su` possono essere rimappati modificando `/system/usr/keylayout/Generic.kl` (per esempio a `BRIGHTNESS_*` o `VOLUME_*`).

**2. Il quinto pulsante (arancione) è un interruttore, non un tasto.** Su `gpio-keys` (`/dev/input/event8`) riporta **`EV_SW` `SW_MUTE_DEVICE`** (codice interruttore `14`), un evento _a stato mantenuto_, **non** un `EV_KEY`. Per questo non esiste una voce keylayout e l'accessibilità Android non lo vede mai. Disattiva fisicamente i microfoni, indipendentemente dall'invio dei tasti tramite accessibilità. L'app del pannello lo legge tramite il lettore evdev del demone helper root (`WATCH /dev/input/event8`, `sw=true`) e invia un evento Home Assistant (`KEYCODE_MUTE`) a ogni commutazione, verificato dall'inizio alla fine. È il comportamento **di serie**, non documentato altrove al momento della stesura.

**3. Il pulsante nel forellino (incassato, accanto alla porta USB-C) non è un ingresso Android.** È assente da `getevent`, `gpio-keys` e `dmesg`, quindi Home Assistant non può usarlo. Il suo ruolo elettrico non è stato confermato in sicurezza. Posizione e piattaforma rk3566 suggeriscono una funzione di reset o modalità di avvio, ma non esistono una durata di pressione, un comportamento di ripristino di fabbrica o una procedura di ingresso Maskrom verificati. Non premerlo né tenerlo premuto presumendo che offra un percorso di riflash recuperabile. Usa il percorso Loader verificato attivabile via software mentre Android si avvia ancora e rispetta i limiti in [Backup e ripristino del firmware](/it/hardware/guides/firmware-backup-and-restore/).

## Fotocamera

GalaxyCore **GC05A2 / GC5035**, sensore 2592×1944. Android riporta una fotocamera di livello hardware `LIMITED`, solo `BACKWARD_COMPATIBLE`, `Facing: Back`, senza flash e autofocus, tramite il fornitore `legacy/0` (`device@3.3`).

:::note
I flag delle funzionalità del firmware sono errati: il pannello dichiara `android.hardware.camera.front`, mentre l'HAL riporta `Facing: Back`. Basati sul profilo dispositivo e su ciò che `CameraManager` enumera effettivamente, mai su `hasSystemFeature`.
:::

1280×720 è offerto in tutti e tre i formati, `IMPLEMENTATION_DEFINED`, `YUV_420_888` e `BLOB`, quindi sono disponibili sia anteprima sia acquisizione di immagini statiche. L'HAL dichiara uno stallo di un fotogramma per un'acquisizione `BLOB` 720p a 30 fps. Quel dato del produttore sulle immagini statiche non misura il costo del flusso H.264 dell'app del pannello. `android.control.aeAvailableTargetFpsRanges` offre solo `[15 30]` e `[30 30]`: non esiste una modalità del sensore bloccata a 15 fps, quindi un flusso a 15 fps deriva dalla regolazione dell'encoder, non dal sensore.

L'unico encoder hardware H.264 è `OMX.rk.video_encoder.avc`, servito dall'HAL OMX IL (questo pannello ha un processo `media.codec` e nessun servizio Codec2 del produttore). Dichiara da `176x144` a `1920x1088` con allineamento `16x8`, un intervallo di bitrate riportato da 1 bps a 10 Mbps e quattro istanze simultanee. **Non esiste un encoder hardware HEVC**; l'unica voce HEVC è il software `c2.android.hevc.encoder`, distribuito con `enabled="false"`.

:::caution
Considera i dati del produttore in `media_codecs_performance.xml` come valori standard, non misurazioni: gli encoder AVC hardware e software riportano valori `measured-frame-rate` identici sia a 720×480 sia a 1280×720, cosa che non può essere una misurazione reale. Presumi 720p finché non hai misurato diversamente sul tuo pannello.
:::

Un pannello che mostra schede fotocamera non è inattivo. Su una plancia misurata l'app del pannello manteneva due istanze `OMX.rk.video_decoder.avc` attive, quindi una sessione di codifica compete con il lavoro di decodifica esistente sulla stessa VPU Rockchip.

L'app del pannello può offrire questa fotocamera come funzione **disattivata per impostazione predefinita**. L'interruttore **Videocamera** nella scheda Fotocamera in Configura la attiva, con valori predefiniti per **Risoluzione**, **Frequenza fotogrammi** e **Bitrate** (720p, 15 fps, 2000 kbps) e una compensazione di **Esposizione**. Offre un flusso H.264 su `rtsp://<panel>:8554/live`, con audio ambiente dove l'accesso al microfono è disponibile e consentito. Home Assistant ottiene immagini statiche da quel flusso tramite l'entità fotocamera del pannello. Quando la fotocamera è aperta, il pannello mostra un indicatore rosso che i contenuti della pagina non possono coprire. Vedi il [riferimento dei controlli](/it/reference/api/) per l'entità fotocamera.

:::caution
Non inserire una scheda fotocamera Home Assistant per **questo** pannello nella plancia dello **stesso** pannello. Il pannello decodificherebbe in ciclo la propria codifica, sullo stesso motore video, senza alcun beneficio.
:::

## Altri componenti

Fotocamera GalaxyCore **GC05A2 / GC5035**; codec audio **ES7202** (ADC di acquisizione; voce vicino al pannello e Assist sono stati verificati tramite acquisizione Android dopo aver riattivato l'audio con il pulsante hardware arancione; acquisizione a distanza e prestazioni con musica di sottofondo restano non qualificate); touch Goodix; PMIC `rk808` e `rk860`.

## Riepilogo del modello di accesso

- **LED e retroilluminazione pulsanti:** solo root (sysfs `system:system`), tramite `hapaneld-helper`.
- **Prossimità e luce ambiente:** accesso diretto dell'app (`SensorManager`).
- **Temperatura, umidità:** solo root (sottosistema input e I²C), tramite il demone helper.
- **Pulsanti:** i quattro laterali sono accessibili direttamente all'app (KeyEvent tramite accessibilità); il quinto arancione è un interruttore `EV_SW` letto dal monitor evdev di `hapaneld-helper`; il pulsante nel forellino non è un ingresso.
