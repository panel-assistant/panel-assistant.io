---
title: Formato dei profili e compatibilità
description: Panoramica commentata dei profili pannello con schema 2, con le regole di validazione, corrispondenza e compatibilità applicate dall'app.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

I profili pannello a runtime sono documenti YAML con uno schema chiuso e versionato. Un descrittore di creazione leggibile dalle macchine e un catalogo dei driver sono disponibili dalla pagina Profilo di un pannello che supporta i profili; questa pagina è una panoramica commentata. Per i campi completi e il vocabolario dei driver della build installata, usa la pagina Profilo. Spiega il modello del documento e le regole di compatibilità, ma non sostituisce la validazione da parte della versione ha-paneld di destinazione.

## Modello del documento

Ogni profilo contiene queste sezioni concettuali:

| Sezione                   | Scopo                                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema                    | Seleziona il linguaggio del documento profilo compreso da ha-paneld.                                                                                                    |
| Identità                  | ID stabile del profilo e contenuti versionati indipendentemente.                                                                                                        |
| Metadati                  | Nome leggibile, autore, fonte, link solo informativi, licenza, maturità, firmware provati e limitazioni note.                                                           |
| Requisiti                 | Core ha-paneld minimo compatibile e driver/funzioni compilati richiesti dal documento.                                                                                  |
| Corrispondenza            | Regole limitate sull'impronta del pannello.                                                                                                                             |
| Funzionalità e driver     | Dati hardware più selezioni di driver compilati e parametri tipizzati.                                                                                                  |
| Strategie denominate      | Regole opzionali gestite dal core per il piccolo insieme di valori supportati dipendenti da firmware/modello.                                                           |
| Intento di configurazione | Indicazioni di accesso, raccomandazioni software/schermo, stato desiderato dei pacchetti e ricette selezionate gestite dal core; mai una concessione di autorizzazioni. |

I campi radice includono `schema`, `id`, `version`, `display_name`, `soc_class`, `soc`, `metadata`, `requires`, `match`, `platform`, `hardware`, `sensors`, `identity`, `input`, `cpu`, `display` e `provisioning`. I nomi sono in `snake_case` minuscolo; i valori distinguono maiuscole e minuscole salvo diversa indicazione nella descrizione del campo. Vedi l'[esempio minimo della comunità](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml).

I valori enumerati ammessi e il vocabolario driver/artefatti esatti sono definiti dallo schema e dal catalogo driver forniti dalla versione in esecuzione. Valida con la stessa versione che attiverà il profilo.

## Schema chiuso

I campi sconosciuti sono errori. Questo rileva refusi che altrimenti eliminerebbero silenziosamente una proprietà di sicurezza o lascerebbero una funzione non configurata. Lo schema 2 non ha un'area di estensione libera. Inserisci autore, fonte HTTPS, licenza in stile SPDX, maturità `draft`/`experimental`/`verified`, firmware provati e limitazioni in `metadata`; questi valori non possono definire corrispondenze, driver, accesso o comportamento a runtime.

Chiavi YAML duplicate, alias e chiavi ricorsive sono errori. È consentito esattamente un documento YAML. I tag YAML non possono costruire oggetti dell'applicazione o Java e i profili non possono contenere predicati con espressioni regolari. Il caricatore accetta al massimo 20 livelli di annidamento, 20.000 eventi del parser, 512 elementi in una mappa o lista e 16.384 caratteri in una stringa. Mantieni i documenti semplici ed espliciti anche quando l'editor YAML supporta sintassi più elaborate.

Ogni revisione YAML è limitata a 128 KiB. Anche il catalogo locale importato è limitato: 128 revisioni totali, 16 per ID profilo e 4 MiB di YAML. Esporta ed elimina revisioni obsolete inattive prima di salvarne altre; quelle attive, in attesa e ultime funzionanti restano protette. Questi limiti impediscono che lo scambio di profili esaurisca l'archiviazione o costringa ad analizzare un catalogo illimitato all'avvio.

I campi obbligatori non possono essere null. Per quelli opzionali, il lettore attuale generalmente tratta null come assenza, ma gli autori dovrebbero omettere i valori sconosciuti per mantenere chiaro l'intento. Stringhe vuote, liste/mappe vuote, zeri e false sono valori reali e possono differire dall'omissione o da un valore predefinito documentato.

## Identità e versioni

Usa un ID profilo stabile e distinguibile di 1–128 lettere ASCII minuscole o cifre, con punti e trattini solo all'interno. I punti consecutivi non sono ammessi. Preferisci un prefisso autore o organizzazione quando un nome di modello generico potrebbe collidere, per esempio `org.example.wallpanel-x1`. Non inserire un numero firmware nell'ID quando un profilo e le sue strategie denominate possono coprire la famiglia hardware.

La versione dei contenuti appartiene all'autore e cambia quando cambiano le conoscenze o il comportamento del profilo. Usa il versionamento semantico se il profilo verrà condiviso:

- patch: chiarimenti o metadati che non cambiano corrispondenze o comportamento a runtime;
- minor: nuove conoscenze sulle funzionalità, una nuova variante firmware compatibile o una raccomandazione più sicura;
- major: identità di corrispondenza, selezione driver, esigenze di privilegi o altre modifiche che meritano una migrazione deliberata.

La versione dello schema appartiene a ha-paneld. Gli autori non devono incrementarla per versionare il proprio profilo.

## Panoramica commentata dei campi dello schema 2

“Obbligatorio” significa che la chiave deve essere presente con il tipo indicato. “Opzionale; predefinito …” significa che l'omissione (o null per un campo opzionale) produce quel valore. Le chiavi sconosciute a ogni livello sono errori. Tutti gli interi devono rientrare in un valore con segno a 32 bit prima del controllo dell'intervallo più ristretto del campo, e tutti i numeri devono restare finiti quando convertiti in float a 32 bit dove il campo usa un numero.

### Campi radice

| Campo          | Presenza                       | Tipo e validazione                                                                                                                                                                                                                                    |
| -------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`       | Obbligatorio                   | Intero; esattamente `2`. Lo schema 1 non è accettato.                                                                                                                                                                                                 |
| `id`           | Obbligatorio                   | Stringa, 1–128 caratteri; lettere/cifre ASCII minuscole, con `.` o `-` solo all'interno; `..` vietato.                                                                                                                                                |
| `version`      | Obbligatorio                   | Versione dei contenuti: esattamente tre componenti separati da punti, ciascuno `0` o 1–9 cifre senza zero iniziale; identificatori pre-release opzionali separati da punti composti da lettere ASCII, cifre e `-`; nessun suffisso di metadati build. |
| `display_name` | Obbligatorio                   | Stringa non vuota né di soli spazi, 1–100 caratteri.                                                                                                                                                                                                  |
| `soc_class`    | Obbligatorio                   | Stringa non vuota né di soli spazi, 1–100 caratteri.                                                                                                                                                                                                  |
| `soc`          | Opzionale; predefinito assente | Dati SoC strutturati e comprovati dal profilo; campi sotto.                                                                                                                                                                                           |
| `metadata`     | Obbligatorio                   | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `requires`     | Obbligatorio                   | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `match`        | Obbligatorio                   | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `platform`     | Obbligatorio                   | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `hardware`     | Obbligatorio                   | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `sensors`      | Opzionale; predefinito `{}`    | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `identity`     | Opzionale; predefinito `{}`    | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `input`        | Opzionale; predefinito `{}`    | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `cpu`          | Opzionale; predefinito `{}`    | Mappa; campi sotto.                                                                                                                                                                                                                                   |
| `display`      | Opzionale; predefinito `{}`    | Dati fisici dello schermo; campi sotto.                                                                                                                                                                                                               |
| `provisioning` | Obbligatorio                   | Mappa dell'intento di configurazione; campi sotto.                                                                                                                                                                                                    |

### `metadata` e `requires`

| Campo                       | Presenza                       | Tipo e validazione                                                                                                                                                                                                                                                               |
| --------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata.author`           | Obbligatorio                   | Stringa non vuota né di soli spazi, 1–100 caratteri.                                                                                                                                                                                                                             |
| `metadata.source`           | Opzionale; predefinito assente | URL HTTPS assoluto, massimo 500 caratteri, con host non vuoto e senza componente informazioni utente.                                                                                                                                                                            |
| `metadata.links`            | Opzionale; predefinito `[]`    | Lista di massimo otto link esterni solo informativi. ha-paneld non li recupera, precarica o usa mai per la configurazione. URL ed etichette devono essere unici e un link non può ripetere `metadata.source`.                                                                    |
| `metadata.links[].label`    | Obbligatorio per elemento      | Etichetta visibile non vuota né di soli spazi, 1–48 caratteri, senza controlli o caratteri di formattazione bidirezionale. L'interfaccia Profili mostra anche il nome host di destinazione in un segmento di testo isolato.                                                      |
| `metadata.links[].url`      | Obbligatorio per elemento      | URL HTTPS assoluto con le stesse regole di `metadata.source`: 500 caratteri, host presente e nessuna informazione utente.                                                                                                                                                        |
| `metadata.license`          | Obbligatorio                   | Stringa in stile SPDX composta da uno o più identificatori di 1–64 caratteri conformi a `[A-Za-z0-9][A-Za-z0-9.+-]*`, separati solo da `AND` o `OR`. Parentesi, `WITH` e testo libero non sono accettati.                                                                        |
| `metadata.maturity`         | Obbligatorio                   | `draft`, `experimental` o `verified`.                                                                                                                                                                                                                                            |
| `metadata.tested_firmware`  | Opzionale; predefinito `[]`    | Lista di massimo 32 stringhe non vuote né di soli spazi, ciascuna di massimo 120 caratteri.                                                                                                                                                                                      |
| `metadata.limitations`      | Opzionale; predefinito `[]`    | Lista di massimo 32 stringhe non vuote né di soli spazi, ciascuna di massimo 500 caratteri.                                                                                                                                                                                      |
| `requires.min_core_version` | Opzionale; predefinito assente | Versione di rilascio con punti, massimo 64 caratteri: 1–4 componenti numerici di 1–6 cifre ciascuno, con suffisso pre-release opzionale ASCII alfanumerico/`-` separato da punti. Il core in esecuzione deve risultare uguale o più recente, incluso l'ordine delle pre-release. |
| `requires.drivers`          | Obbligatorio                   | Lista di ID driver del core. Gli ID sconosciuti sono errori; un driver richiesto da una funzionalità valorizzata deve essere elencato. Un driver altrimenti inutilizzato produce un avviso.                                                                                      |

### `soc`

`soc_class` resta l'etichetta generale obbligatoria della famiglia. Il blocco strutturato opzionale registra dati che Android generalmente non identifica in modo affidabile, per esempio se un pannello nominalmente quad-core usi core Cortex-A35 o Cortex-A55. Questi valori compaiono nella Dashboard e nella pagina Profili ma non nel rapporto pubblico sintetico `/diag`. Aggiungi solo dati sostenuti da una fonte pubblica o prove hardware; ometti i campi sconosciuti senza indovinare.

| Campo                          | Presenza                             | Tipo e validazione                                                                                                                                             |
| ------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `soc.model`                    | Obbligatorio quando `soc` è presente | Nome modello non vuoto né di soli spazi, 1–100 caratteri, senza controlli C0 o DEL.                                                                            |
| `soc.introduced_year`          | Opzionale; predefinito assente       | Intero da 1970 a 2100. Usa l'anno di presentazione pubblica del SoC, non quello di uscita del pannello.                                                        |
| `soc.cpu_cores`                | Opzionale; predefinito `[]`          | Massimo otto cluster di architetture e 256 core totali. Una lista vuota significa che il modello è noto ma la topologia CPU non è sufficientemente comprovata. |
| `soc.cpu_cores[].architecture` | Obbligatorio per elemento            | Architettura del core non vuota né di soli spazi, 1–64 caratteri, senza controlli; le architetture devono essere uniche ignorando maiuscole/minuscole.         |
| `soc.cpu_cores[].count`        | Obbligatorio per elemento            | Intero da 1 a 128.                                                                                                                                             |

### `match`

`match.any` è OR tra gruppi; la lista `all` di un gruppo è AND tra predicati; la lista `values` di un predicato è OR. I confronti distinguono maiuscole e minuscole sui dati build che ha-paneld ha già convertito in minuscolo.

| Campo                      | Presenza     | Tipo e validazione                                                                                                                        |
| -------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `match.priority`           | Obbligatorio | Intero da 0 a 1000; risolve parità tra profili dopo la priorità del gruppo corrispondente.                                                |
| `match.fallback`           | Obbligatorio | Booleano. `true` è valido solo per il profilo integrato con ID `generic`; i profili importati/della comunità non possono essere fallback. |
| `match.any`                | Obbligatorio | Lista di massimo 64 oggetti gruppo. Un profilo non fallback richiede almeno un gruppo; Generic integrato può usare una lista vuota.       |
| `match.any[].priority`     | Obbligatorio | Intero da 0 a 1000; specificità del ramo usata prima della priorità del profilo.                                                          |
| `match.any[].all`          | Obbligatorio | Lista di 1–8 oggetti predicato.                                                                                                           |
| `match.any[].all[].field`  | Obbligatorio | `model`, `device` o `product_version`.                                                                                                    |
| `match.any[].all[].op`     | Obbligatorio | `equals`, `starts_with` o `contains`.                                                                                                     |
| `match.any[].all[].values` | Obbligatorio | Lista di 1–32 stringhe minuscole non vuote né di soli spazi; ciascuna massimo 100 caratteri e senza controlli C0 o DEL.                   |

### `platform` e `hardware`

| Campo                                    | Presenza                          | Tipo e validazione                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform.su_form`                       | Obbligatorio                      | `none`, `android` o `toolbox`.                                                                                                                                                                                                                                                                                                                                                                                            |
| `platform.app_can_su`                    | Obbligatorio                      | Booleano. Deve essere `false` quando `su_form` è `none`; una forma `android` o `toolbox` può comunque essere dichiarata con `false` per un'app confinata dalla sandbox.                                                                                                                                                                                                                                                   |
| `platform.has_recents`                   | Opzionale; predefinito `true`     | Booleano.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `platform.has_native_navbar`             | Opzionale; predefinito assente    | Ometti per verificare la visibilità della barra di navigazione del firmware. `true` o `false` espliciti sostituiscono quella verifica.                                                                                                                                                                                                                                                                                    |
| `platform.launcher.vendor_home_packages` | Opzionale; predefinito vuoto      | Lista di massimo 8 nomi di pacchetti Android, senza duplicati. App del produttore registrate come schermata Home Android ma che non sono elenchi di app, per esempio un'app di controllo del produttore. Il pulsante Launcher della barra di navigazione le salta e, se nient'altro è idoneo, apre Launcher pannello, che le elenca comunque come app.                                                                    |
| `hardware.led`                           | Obbligatorio                      | Mappa contenente i campi LED sotto.                                                                                                                                                                                                                                                                                                                                                                                       |
| `hardware.led.mechanism`                 | Obbligatorio                      | `none`, `autodetect`, `rk3576-ioctl`, `rk3576-ioctl-daemon` o `sysfs-daemon`. I meccanismi riservati al demone sono rifiutati quando `platform.app_can_su` è `true`.                                                                                                                                                                                                                                                      |
| `hardware.led.transfer`                  | Opzionale; predefinito `identity` | Seleziona una curva di trasferimento compilata. Esempi: `identity`, `rk3576-four-bit`, `perceptual`, `gamma` e `points` misurati; usa lo schema fornito per i parametri.                                                                                                                                                                                                                                                  |
| `hardware.screen_off`                    | Obbligatorio                      | Seleziona un driver compilato di spegnimento schermo, per esempio `brightness-zero`, `su-blpower`, `daemon-blpower`, `keyevent`, `screen-timeout`, `device-admin` o `vendor-rpc`. Requisiti di autorità e risveglio locale dipendono dal percorso scelto; usa lo schema fornito e verifica il percorso sull'hardware.                                                                                                     |
| `hardware.has_button_backlight`          | Opzionale; predefinito `false`    | Booleano; quando true seleziona la funzionalità limitata di retroilluminazione pulsanti tramite helper.                                                                                                                                                                                                                                                                                                                   |
| `hardware.local_wake`                    | Opzionale; predefinito assente    | Lista di valori unici tra `touch`, `proximity` e `button`: modi per risvegliare sul posto un pannello completamente buio. `touch` significa che qualsiasi tocco lo risveglia, `proximity` un gesto dopo la calibrazione, `button` un pulsante hardware. Ometti se sconosciuto; una lista vuota dichiara che solo Home Assistant risveglia il pannello. Home Assistant può sempre risvegliarlo, quindi non è mai elencato. |
| `hardware.zigbee_gateway_dir`            | Opzionale; predefinito assente    | Percorso consentito esatto `/vendor/bin/siliconlabs_host`; nessun altro accettato.                                                                                                                                                                                                                                                                                                                                        |
| `hardware.relay_base`                    | Opzionale; predefinito assente    | Un percorso consentito esatto: `/sys/class/relay`, `/sys/class/st_relay` o `/sys/class/strelay`.                                                                                                                                                                                                                                                                                                                          |
| `hardware.relay_base_fallbacks`          | Opzionale; predefinito `[]`       | Lista di massimo tre percorsi dallo stesso elenco consentito dei relè. Devono essere unici e non ripetere `relay_base`.                                                                                                                                                                                                                                                                                                   |
| `hardware.button_led_gpio_base`          | Opzionale; predefinito assente    | Intero da 0 a 4092, primo GPIO di un blocco di quattro GPIO.                                                                                                                                                                                                                                                                                                                                                              |
| `hardware.camera`                        | Opzionale; predefinito assente    | Booleano a tre stati: l'omissione consente l'enumerazione Android, `true` dichiara una candidata anche se l'enumerazione fallisce e `false` sopprime la fotocamera. L'acquisizione richiede sempre un indicatore collegato sullo schermo; a schermo spento richiede anche un'indicazione LED attiva. Senza indicazione a schermo spento, l'acquisizione si ferma quando lo schermo si spegne.                             |
| `hardware.microphone`                    | Opzionale; predefinito assente    | `true` dichiara un microfono comprovato, `false` lo sopprime e l'omissione usa l'enumerazione Android dei microfoni integrati seguita da una verifica di acquisizione prima dell'ascolto. Indipendente dalla presenza della fotocamera.                                                                                                                                                                                   |
| `hardware.camera_lens_offset_px`         | Opzionale                         | Intero; pixel dello schermo dal bordo superiore dell'area attiva al centro dell'obiettivo. L'indicatore fotocamera in uso è un arco centrato sull'obiettivo: questo valore lo posiziona; è una misura della cornice diversa tra schede. Ometti se non misurato e l'indicatore userà un valore predefinito.                                                                                                                |
| `hardware.touch_click_gain`              | Opzionale; predefinito `0.2`      | Numero da 0.05 a 1.0; regola il volume del clic di tocco su una scheda dove è troppo alto o basso al valore di sistema.                                                                                                                                                                                                                                                                                                   |

### `sensors` e `identity`

| Campo                           | Presenza                              | Tipo e validazione                                                                                                                                                           |
| ------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sensors.proximity_technology`  | Opzionale; predefinito assente        | Stringa non vuota né di soli spazi, 1–100 caratteri, senza controlli C0 o DEL. Quando presente dichiara l'uso del sensore di prossimità Android.                             |
| `sensors.proximity_gpio`        | Opzionale; predefinito assente        | Intero da 0 a 4095 per il percorso GPIO binario supportato tramite root.                                                                                                     |
| `sensors.light_technology`      | Opzionale; predefinito assente        | Stringa non vuota né di soli spazi, 1–100 caratteri, senza controlli C0 o DEL. Quando presente dichiara l'uso del sensore luce ambiente Android.                             |
| `sensors.vi530x`                | Opzionale; predefinito `false`        | Booleano; espone una sorgente di distanza VI530x a tempo di volo avviata dall'helper, avviata tramite ioctl e poi interrogata periodicamente. Richiede l'helper autenticato. |
| `sensors.cht8305`               | Opzionale; predefinito `false`        | Booleano; abilita un ingresso clima ambiente compatibile CHT8305 esatto supportato dal core tramite helper autenticato.                                                      |
| `sensors.room_temp_offset_c`    | Opzionale; predefinito `0.0`          | Numero finito da -30 a 30 °C.                                                                                                                                                |
| `identity.manufacturer`         | Opzionale; predefinito assente        | Stringa non vuota né di soli spazi, 1–100 caratteri, senza controlli C0 o DEL; l'assenza significa deduzione a runtime.                                                      |
| `identity.model`                | Opzionale; predefinito assente        | Stringa non vuota né di soli spazi, 1–100 caratteri, senza controlli C0 o DEL; l'assenza significa deduzione a runtime.                                                      |
| `identity.model_label_strategy` | Opzionale; predefinito `display-name` | `display-name` o `nspanel-product-version`.                                                                                                                                  |

Una revisione schema 2 salvata può contenere `proximity_near_below`, `proximity_near_raw`, `proximity_far_raw` o `proximity_graded_strategy`. Il caricatore accetta queste chiavi ritirate solo come segnaposto di compatibilità: vengono ignorate al caricamento e omesse quando un documento profilo viene serializzato. L'esportazione di una revisione salvata immutabile conserva i byte originali. Il runtime usa valori predefiniti calibrati del profilo sensore o la configurazione guidata salvata, e controlla la sorgente attiva prima di riportare valori normalizzati.

### `input`, `cpu` e `display`

| Campo                              | Presenza                       | Tipo e validazione                                                                                                                                             |
| ---------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input.evdev_buttons`              | Opzionale; predefinito `[]`    | Lista di massimo 32 oggetti di mappatura evdev. Coppie `(sw, code)` duplicate sono rifiutate anche se i nodi differiscono.                                     |
| `input.evdev_buttons[].node`       | Obbligatorio per elemento      | Stringa conforme a `/dev/input/eventN`, dove `N` è composto da 1–3 cifre decimali. Nessun altro percorso dispositivo è accettato.                              |
| `input.evdev_buttons[].code`       | Obbligatorio per elemento      | Intero codice input/interruttore Linux da 1 a 767.                                                                                                             |
| `input.evdev_buttons[].grab`       | Obbligatorio per elemento      | Booleano; true richiede `EVIOCGRAB` esclusivo.                                                                                                                 |
| `input.evdev_buttons[].event_type` | Obbligatorio per elemento      | Stringa di massimo 64 caratteri conforme a `KEYCODE_[A-Z0-9_]+`.                                                                                               |
| `input.evdev_buttons[].sw`         | Opzionale; predefinito `false` | Booleano; false seleziona `EV_KEY`, true seleziona `EV_SW`.                                                                                                    |
| `cpu.governors`                    | Opzionale; predefinito assente | Mappa le cui sole chiavi consentite sono `Performance`, `Efficiency` e `Auto`. Ogni valore è un nome governor di 1–32 caratteri conforme a `[a-z][a-z0-9_-]*`. |
| `display.physical_ppi`             | Opzionale; predefinito assente | Intero da 50 a 1000.                                                                                                                                           |

### `provisioning`

| Campo                                         | Presenza                             | Tipo e validazione                                                                                                                                                                                     |
| --------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `provisioning.access`                         | Opzionale; predefinito `{}`          | Mappa di raccomandazioni di accesso.                                                                                                                                                                   |
| `provisioning.access.shizuku`                 | Campo di compatibilità ritirato      | I vecchi valori sono accettati e ignorati. Non forniscono alcun percorso di accesso a runtime.                                                                                                         |
| `provisioning.software`                       | Opzionale; predefinito `{}`          | Mappa dei criteri software gestiti dal core.                                                                                                                                                           |
| `provisioning.software.webview.artifact`      | Opzionale; predefinito assente       | ID gestito dal core `lineageos-138-arm`, `lineageos-150-arm` o `lineageos-150-arm64`. Un profilo non può fornire URL, versione o hash del firmatario.                                                  |
| `provisioning.software.companion.max_version` | Opzionale; predefinito assente       | Versione di rilascio con punti con la stessa sintassi e limite di 64 caratteri di `requires.min_core_version`.                                                                                         |
| `provisioning.display.density`                | Opzionale; predefinito assente       | Intero da 80 a 640 dpi, oppure strategia denominata `nspanel-variant`.                                                                                                                                 |
| `provisioning.display.font_scale`             | Opzionale; predefinito assente       | Numero finito da 0.5 a 1.5.                                                                                                                                                                            |
| `provisioning.packages`                       | Opzionale; predefinito `[]`          | Lista di 0–128 oggetti stato desiderato dei pacchetti.                                                                                                                                                 |
| `provisioning.packages[].package`             | Obbligatorio per elemento            | Nome pacchetto Android unico conforme a `[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+`.                                                                                                                     |
| `provisioning.packages[].desired_state`       | Obbligatorio per elemento            | `disabled`. Descrive lo stato obiettivo e non è consenso all'esecuzione.                                                                                                                               |
| `provisioning.packages[].importance`          | Obbligatorio per elemento            | `recommended` o `optional`. L'importanza controlla solo la presentazione e non significa mai applicare per impostazione predefinita.                                                                   |
| `provisioning.packages[].tags`                | Opzionale; predefinito `[]`          | Lista di massimo otto tag. Ciascuno ha 1–24 caratteri, inizia con una lettera ASCII minuscola e contiene poi solo lettere minuscole, cifre o `-`.                                                      |
| `provisioning.packages[].note`                | Opzionale; predefinito stringa vuota | Stringa di massimo 500 caratteri. Le note sono spiegazioni supplementari, non procedure.                                                                                                               |
| `provisioning.recipes`                        | Opzionale; predefinito `[]`          | Lista di massimo 32 selezioni di ricette gestite dal core.                                                                                                                                             |
| `provisioning.recipes[].id`                   | Obbligatorio per elemento            | ID registrato unico. Lo schema 2 conosce `nspanel-pro.watchdog-e2big-repair` e `tpa10.vendor-stack-minimize`. Le voci non possono contenere argomenti, comandi, URL o definizioni di flussi di lavoro. |

Nella versione 1.0.0-rc2 non ancora pubblicata, i tre ID WebView corrispondono alle seguenti build e metadati di compatibilità gestiti dal core:

| ID artefatto          | Build gestita dal core                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `lineageos-138-arm`   | LineageOS System WebView `138.0.7204.63`; ABI ARM `armeabi-v7a` e `arm64-v8a`; Android 8–9.             |
| `lineageos-150-arm`   | LineageOS System WebView `150.0.7871.63`; ABI ARM `armeabi-v7a`; Android 10 o successivo.               |
| `lineageos-150-arm64` | LineageOS System WebView `150.0.7871.63`; ABI ARM `armeabi-v7a` e `arm64-v8a`; Android 10 o successivo. |

Il campo artefatto WebView seleziona una build il cui download, checksum, pacchetto, versione e firmatario sono compilati nel core. Nella versione 1.0.0-rc2 non ancora pubblicata, un aggiornamento dell'app del pannello avviato da Home Assistant può anche installare un WebView compatibile. Se resta incompleto, usa la relativa Riparazione di aggiornamento per riprovare. Importare o attivare un profilo non avvia un aggiornamento. Vedi [Aggiornare WebView](/it/hardware/guides/update-the-webview/).

### Requisiti condizionali dei driver

Ogni driver selezionato da campi valorizzati deve comparire in `requires.drivers`. Il catalogo fornito indica i requisiti di autorità di ciascun driver; diversi percorsi Android e servizi del produttore funzionano senza root.

| Condizione del profilo                                                  | Driver richiesto          |
| ----------------------------------------------------------------------- | ------------------------- |
| `platform.su_form: android` e `platform.app_can_su: true`               | `access.android-su`       |
| `platform.su_form: toolbox` e `platform.app_can_su: true`               | `access.toolbox-su`       |
| `hardware.led.mechanism: autodetect`                                    | `led.autodetect`          |
| `hardware.led.mechanism: rk3576-ioctl`                                  | `led.rk3576-ioctl`        |
| `hardware.led.mechanism: rk3576-ioctl-daemon`                           | `led.rk3576-ioctl-daemon` |
| `hardware.led.mechanism: sysfs-daemon`                                  | `led.sysfs-daemon`        |
| `hardware.screen_off: brightness-zero`                                  | `screen.brightness-zero`  |
| `hardware.screen_off: su-blpower`                                       | `screen.su-blpower`       |
| `hardware.screen_off: daemon-blpower`                                   | `screen.daemon-blpower`   |
| `hardware.screen_off: keyevent`                                         | `screen.keyevent`         |
| `hardware.zigbee_gateway_dir` presente                                  | `radio.siliconlabs-host`  |
| `hardware.relay_base` presente, oppure `relay_base_fallbacks` non vuoto | `relay.sysfs`             |
| `hardware.button_led_gpio_base` presente                                | `relay.gpio-button-led`   |
| `hardware.has_button_backlight: true`                                   | `input.button-backlight`  |
| `sensors.proximity_technology` o `sensors.light_technology` presente    | `sensor.android`          |
| `sensors.proximity_gpio` presente                                       | `sensor.gpio-proximity`   |
| `sensors.cht8305: true`                                                 | `sensor.cht8305-daemon`   |
| `sensors.vi530x: true`                                                  | `sensor.vi530x-daemon`    |
| `input.evdev_buttons` non vuoto                                         | `input.evdev`             |
| `provisioning.software.webview.artifact` presente                       | `update.webview`          |

### Limiti di sintassi e archiviazione

| Ambito                       | Limite                                                               |
| ---------------------------- | -------------------------------------------------------------------- |
| Una revisione YAML grezza    | 128 KiB di byte UTF-8.                                               |
| Numero di documenti YAML     | Esattamente uno; input vuoto non valido.                             |
| Alias YAML                   | Zero.                                                                |
| Annidamento                  | Massimo 20 livelli di raccolte.                                      |
| Lavoro del parser            | Massimo 20.000 eventi.                                               |
| Una mappa o lista            | Massimo 512 elementi prima dei limiti più restrittivi dei campi.     |
| Una stringa                  | Massimo 16.384 caratteri prima dei limiti più restrittivi dei campi. |
| Catalogo importato           | Massimo 128 revisioni ammesse.                                       |
| Un ID profilo importato      | Massimo 16 revisioni ammesse.                                        |
| Archiviazione YAML importato | Massimo 4 MiB totali.                                                |

## Requisiti

Un profilo dichiara il comportamento minimo del core e i driver compilati necessari. La validazione rifiuta in sicurezza quando un requisito non è disponibile. Un requisito indisponibile è diverso da una verifica sul dispositivo fallita: il primo significa che questa build ha-paneld non conosce il meccanismo richiesto; la seconda che il meccanismo esiste nel core ma non era raggiungibile su questo pannello.

Non ampliare preventivamente i requisiti. Richiedere un driver privilegiato inutilizzato rende il profilo più difficile da eseguire e revisionare senza aggiungere funzionalità.

## Regole di corrispondenza

Le regole operano solo sui dati immutabili `model`, `device` e `product_version` esposti da ha-paneld. Una lista `match.any` è OR; i predicati nella lista `all` di un gruppo sono AND. I predicati supportano `equals`, `starts_with` e `contains` su valori attesi minuscoli, mai espressioni regolari.

Ogni gruppo ha una `priority` di ramo da 0 a 1000. Vince il profilo integrato corrispondente con la priorità più alta del gruppo corrispondente; `match.priority` a livello profilo risolve le parità residue, e una parità esatta ripiega in sicurezza su Generic. Usa priorità di gruppo più alte per identità prodotto esatte e più basse per fallback di compatibilità ampi. Una regola che corrisponde solo a `px30`, `rk3326`, `rk3566`, `rk3576` o a un nome di riferimento altrettanto riutilizzato non è una prova sufficiente per controlli hardware specifici.

La corrispondenza sceglie un profilo candidato; non dimostra una funzionalità. I driver eseguono comunque verifiche di disponibilità sul dispositivo e prevale il risultato prudente quando prove e dichiarazioni divergono.

## Strategie denominate per modello

Lo schema non ha un linguaggio generico di espressioni o una sezione di modifiche condizionali arbitrarie. Le strategie denominate sono volutamente piccole e gestite dal core:

- `identity.model_label_strategy: nspanel-product-version` decodifica variante NSPanel ed etichetta firmware;
- `provisioning.display.density: nspanel-variant` seleziona la densità documentata 86P/120P;
- il valore predefinito `display-name` e gli interi fissi evitano tali trasformazioni.

`hardware.relay_base_fallbacks` è un insieme di dati ordinari e limitati per rinominazioni note e supportate della classe relè, non un'espressione o una ricerca di percorsi arbitraria.

Le strategie sono trasformazioni compilate e limitate nominate nello schema, non script del profilo. Non possono invocare I/O o driver. Lo schema fornito descrive quelle supportate e i loro ingressi.

Crea profili separati quando nessuna strategia denominata copre la differenza, o quando i prodotti richiedono driver compilati, livelli di autorità, aspettative di recupero o prove mantenute indipendentemente diversi.

## Funzionalità e driver compilati

Una dichiarazione di funzionalità contiene dati hardware e, dove necessario, un ID driver con parametri tipizzati. Gli ID nominano implementazioni compilate in ha-paneld. Il driver valida percorsi, intervalli, codici evento, nomi pacchetti e altri ingressi sensibili per la sicurezza. I percorsi privilegiati sono selezionati da elenchi consentiti del core. I metadati mantenuti `provisioning.software.webview.artifact` nominano URL, versione, checksum artefatto e hash firmatario compilati e verificati insieme al core; un profilo non può ridefinire quella radice di fiducia. Nella versione 1.0.0-rc2 non ancora pubblicata, un aggiornamento avviato dal proprietario controlla il fornitore installato e la compatibilità prima di usare quell'artefatto; il profilo non può fornire un download o una radice di fiducia diversi.

I profili non possono fornire:

- comandi shell o array di argomenti;
- nomi di comandi del demone helper;
- operazioni arbitrarie di lettura/scrittura del filesystem;
- librerie native, numeri ioctl o contenuti in byte;
- URL APK, hash firmatari o nuovi artefatti di aggiornamento;
- espressioni eseguibili con accesso a rete, filesystem, processi, reflection o orologio;
- credenziali, token Home Assistant o configurazione MQTT.

Una funzionalità dichiarata è candidata finché il driver non la conferma. Interfaccia e diagnostica dovrebbero distinguere **dichiarata**, **disponibile**, **non disponibile** e **autorità mancante**, senza trattare lo YAML come prova.

## Comportamento di compatibilità

ha-paneld tratta gli errori di compatibilità come problemi di profili inattivi, non come errori di avvio del pannello:

- Lo schema `2` è l'unico linguaggio accettato. Le revisioni schema 1 salvate restano elencabili, esportabili ed eliminabili ma non attivabili; una revisione selezionata incompatibile ripiega su un'ultima funzionante schema 2 compatibile, un profilo integrato corrispondente o `generic.yaml` integrato.
- Un driver o una trasformazione richiesta sconosciuti impediscono l'attivazione.
- Le revisioni locali installate vengono rivalidate dopo un aggiornamento dell'app.
- Lo YAML originale e il suo hash restano identificabili dopo validazione e normalizzazione.
- Un'attivazione fallita torna all'ultima revisione funzionante.
- Se nessun profilo specifico può funzionare, ha-paneld parte con il comportamento prudente di `generic.yaml` integrato. Se quel fallback manca o è corrotto, un contratto di emergenza senza funzionalità mantiene disponibile l'interfaccia di gestione locale senza dichiarare hardware del pannello.

Gli hash dei contenuti e le eventuali firme pubblicate separatamente rispondono a domande diverse. L'hash di revisione ha-paneld lega salvataggio e attivazione ai byte esaminati. Una firma esterna può identificare un editore, ma non è un segnale di autorità interpretato dal caricatore. Nessuno dei due concede root o il permesso di aggirare validazione e conferma.

## Precedenza delle corrispondenze

La politica di risoluzione protegge i prodotti noti dall'attivazione implicita di file della comunità:

1. selezione esplicita e valida dell'amministratore fissata a una revisione integrata o locale esatta;
2. corrispondenza esatta automatica integrata;
3. fallback di compatibilità automatici integrati;
4. Generic.

Le regole di corrispondenza locali/della comunità sono valutate solo per anteprima e confronto. Non entrano mai nella selezione automatica: importare o salvare un file non può sostituire il rilevamento integrato. L'attivazione richiede sempre una selezione esplicita fissata.

## Lista di compatibilità per gli autori

Prima di condividere una revisione, conferma:

- schema `2` e ogni campo validi sulla versione core più vecchia dichiarata dal file;
- ogni driver richiesto presente in quella versione;
- campioni di impronte esatte per ogni modello e famiglia firmware dichiarati;
- un campione quasi corrispondente che non riconosca un prodotto diverso con lo stesso SoC;
- ogni limite di strategia denominata provato subito sotto, alla soglia e subito sopra la transizione, dove applicabile;
- ogni gruppo esatto con priorità di ramo superiore al fallback ampio, con campioni di collisione tra profili;
- il profilo funzioni con hardware opzionale indisponibile e autorità mancante senza bloccare l'avvio;
- la revisione attiva precedente resti una destinazione di ripristino utilizzabile.
