---
title: Profielformaat en compatibiliteit
description: Een toegelicht overzicht van schema-2-paneelprofielen, met de validatie-, koppelings- en compatibiliteitsregels die de paneel-app afdwingt.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Runtime-paneelprofielen zijn YAML-documenten met een gesloten schema met versienummer. Op de pagina Profielen van een paneel dat profielen ondersteunt zijn een machineleesbare auteursdescriptor en drivercatalogus beschikbaar; deze pagina biedt een toegelicht overzicht. Gebruik de pagina Profielen voor de volledige velden en drivervocabulaire van de geïnstalleerde build. Deze pagina beschrijft het documentmodel en de compatibiliteitsregels, maar vervangt validatie door de beoogde ha-paneld-versie niet.

## Documentmodel

Elk profiel bevat deze conceptuele onderdelen:

| Gedeelte                 | Doel                                                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema                   | Selecteert de profieldocumenttaal die ha-paneld begrijpt.                                                                                           |
| Identiteit               | Stabiel profiel-ID en onafhankelijk geversioneerde profielinhoud.                                                                                   |
| Metadata                 | Leesbare naam, auteur, bron, uitsluitend getoonde links, licentie, volwassenheid, geteste firmware en bekende beperkingen.                          |
| Vereisten                | Minimaal compatibele ha-paneld-kern en de gecompileerde drivers/functies die het document vereist.                                                  |
| Matching                 | Begrensde regels voor de paneelfingerprint.                                                                                                         |
| Mogelijkheden en drivers | Hardwaregegevens plus geselecteerde gecompileerde drivers en getypeerde parameters.                                                                 |
| Benoemde strategieën     | Optionele regels van de kern voor de kleine set ondersteunde firmware-/modelafhankelijke waarden.                                                   |
| Inrichtingsintentie      | Toegangsrichtlijnen, software-/schermaanbevelingen, gewenste pakkettoestand en geselecteerde recepten van de kern; nooit een toestemmingsverlening. |

Hoofdvelden zijn `schema`, `id`, `version`, `display_name`, `soc_class`, `soc`, `metadata`, `requires`, `match`, `platform`, `hardware`, `sensors`, `identity`, `input`, `cpu`, `display` en `provisioning`. Veldnamen gebruiken kleine letters in `snake_case`; waarden zijn hoofdlettergevoelig tenzij de veldbeschrijving anders vermeldt. Zie het [minimale communityvoorbeeld](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml).

De exacte toegestane enumwaarden en vocabulaire voor drivers en artefacten worden bepaald door het schema en de drivercatalogus die de draaiende versie aanbiedt. Valideer met dezelfde release die het profiel zal activeren.

## Gesloten schema

Onbekende velden zijn fouten. Zo worden spelfouten gevonden die anders ongemerkt een veiligheidseigenschap zouden verwijderen of een functie ongeconfigureerd zouden laten. Schema 2 heeft geen vrij uitbreidingsgedeelte. Zet auteur, HTTPS-bron, licentie in SPDX-stijl, volwassenheid `draft`/`experimental`/`verified`, geteste firmware en beperkingen in `metadata`; die waarden kunnen geen koppeling, drivers, toegang of runtimegedrag bepalen.

Dubbele YAML-sleutels, aliassen en recursieve sleutels zijn fouten. Er is precies één YAML-document toegestaan. YAML-tags kunnen geen applicatie- of Java-objecten aanmaken en profielen kunnen geen predicaten met reguliere expressies bevatten. De lader accepteert maximaal 20 nestniveaus, 20.000 parsergebeurtenissen, 512 vermeldingen in één map of lijst en 16.384 tekens in één tekenreeks. Houd documenten eenvoudig en expliciet, ook als een YAML-editor uitgebreidere syntaxis ondersteunt.

Elke YAML-revisie is beperkt tot 128 KiB. De lokaal geïmporteerde catalogus is ook begrensd: 128 revisies in totaal, 16 revisies voor één profiel-ID en 4 MiB aan YAML. Exporteer en verwijder verouderde inactieve revisies voordat je meer opslaat; actieve, wachtende en laatst werkende revisies blijven beschermd. Deze grenzen voorkomen dat het uitwisselen van profielen de paneelopslag uitput of bij het opstarten een onbegrensde catalogus moet worden geparseerd.

Verplichte velden mogen niet null zijn. Bij optionele velden behandelt de huidige lezer null doorgaans als afwezig, maar auteurs moeten onbekende waarden weglaten om hun bedoeling duidelijk te houden. Lege tekenreeksen, lege lijsten/maps, nullen en false zijn echte waarden en kunnen verschillen van weglaten of een gedocumenteerde standaardwaarde.

## Identiteit en versies

Gebruik een stabiele, onderscheidende profiel-ID van 1 tot 128 kleine ASCII-letters of cijfers, met punten en koppeltekens alleen binnenin. Opeenvolgende punten zijn niet toegestaan. Gebruik bij voorkeur een auteurs- of organisatievoorvoegsel wanneer een algemene modelnaam kan botsen, bijvoorbeeld `org.example.wallpanel-x1`. Zet geen firmwarenummer in de ID wanneer één profiel met zijn benoemde strategieën de hardwarefamilie kan dekken.

De inhoudsversie van het profiel is van de auteur en verandert wanneer de kennis of het gedrag van het profiel verandert. Gebruik semantische versienummering als het profiel wordt gedeeld:

- patch: verduidelijkingen of metadata die koppeling of runtimegedrag niet veranderen;
- minor: aanvullende kennis over functies, een nieuwe compatibele firmwarevariant of een veiligere aanbeveling;
- major: gewijzigde koppelingsidentiteit, driverkeuze, benodigde rechten of een andere wijziging die een bewuste migratie verdient.

De schemaversie is van ha-paneld. Auteurs mogen die niet verhogen om hun eigen profiel van een versienummer te voorzien.

## Toegelicht overzicht van schema-2-velden

“Verplicht” betekent dat de sleutel met het genoemde type aanwezig moet zijn. “Optioneel; standaard …” betekent dat weglaten (of null voor een optioneel veld) die waarde oplevert. Onbekende sleutels zijn op elk niveau fouten. Alle gehele getallen moeten in een getekende 32-bitswaarde passen voordat het smallere veldbereik wordt gecontroleerd; alle getallen moeten eindig blijven bij omzetting naar een 32-bitsfloat waar het veld een getal gebruikt.

### Hoofdvelden

| Veld           | Aanwezigheid                 | Type en validatie                                                                                                                                                                                                                                  |
| -------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`       | Verplicht                    | Geheel getal; exact `2`. Schema 1 wordt niet geaccepteerd.                                                                                                                                                                                         |
| `id`           | Verplicht                    | Tekenreeks, 1 tot 128 tekens; kleine ASCII-letters/cijfers, met `.` of `-` alleen binnenin; `..` is verboden.                                                                                                                                      |
| `version`      | Verplicht                    | Profielinhoudsversie: exact drie door punten gescheiden componenten, elk `0` of 1 tot 9 cijfers zonder voorloopnul; optionele door punten gescheiden prerelease-identificatoren met ASCII-letters, cijfers en `-`; geen suffix voor buildmetadata. |
| `display_name` | Verplicht                    | Niet-lege tekenreeks, 1 tot 100 tekens. Waarden mogen niet uitsluitend uit witruimte bestaan.                                                                                                                                                      |
| `soc_class`    | Verplicht                    | Niet-lege tekenreeks, 1 tot 100 tekens. Waarden mogen niet uitsluitend uit witruimte bestaan.                                                                                                                                                      |
| `soc`          | Optioneel; standaard afwezig | Gestructureerde SoC-gegevens met profielbewijs; velden hieronder.                                                                                                                                                                                  |
| `metadata`     | Verplicht                    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `requires`     | Verplicht                    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `match`        | Verplicht                    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `platform`     | Verplicht                    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `hardware`     | Verplicht                    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `sensors`      | Optioneel; standaard `{}`    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `identity`     | Optioneel; standaard `{}`    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `input`        | Optioneel; standaard `{}`    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `cpu`          | Optioneel; standaard `{}`    | Mapping; velden hieronder.                                                                                                                                                                                                                         |
| `display`      | Optioneel; standaard `{}`    | Fysieke schermgegevens; velden hieronder.                                                                                                                                                                                                          |
| `provisioning` | Verplicht                    | Mapping voor inrichtingsintentie; velden hieronder.                                                                                                                                                                                                |

### `metadata` en `requires`

| Veld                        | Aanwezigheid                 | Type en validatie                                                                                                                                                                                                                                                                                     |
| --------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata.author`           | Verplicht                    | Niet-lege tekenreeks, 1 tot 100 tekens. Waarden mogen niet uitsluitend uit witruimte bestaan.                                                                                                                                                                                                         |
| `metadata.source`           | Optioneel; standaard afwezig | Absolute HTTPS-URL, maximaal 500 tekens, met een niet-lege host en zonder gebruikersinformatiecomponent.                                                                                                                                                                                              |
| `metadata.links`            | Optioneel; standaard `[]`    | Lijst met maximaal acht uitsluitend getoonde externe links. ha-paneld haalt ze nooit op, laadt ze niet vooraf en gebruikt ze niet voor inrichting. URL’s en labels moeten uniek zijn en een link mag `metadata.source` niet herhalen.                                                                 |
| `metadata.links[].label`    | Verplicht per item           | Niet-leeg weergavelabel dat niet uitsluitend uit witruimte bestaat, 1 tot 48 tekens, zonder besturings- of bidirectionele opmaaktekens. De profielinterface toont ook de doelhostnaam in een geïsoleerd tekstsegment.                                                                                 |
| `metadata.links[].url`      | Verplicht per item           | Absolute HTTPS-URL met dezelfde regels voor 500 tekens, host en ontbrekende gebruikersinformatie als `metadata.source`.                                                                                                                                                                               |
| `metadata.license`          | Verplicht                    | SPDX-achtige tekenreeks met één of meer identificatoren van 1 tot 64 tekens die voldoen aan `[A-Za-z0-9][A-Za-z0-9.+-]*`, alleen gescheiden door `AND` of `OR`. Haakjes, `WITH` en vrije tekst worden niet geaccepteerd.                                                                              |
| `metadata.maturity`         | Verplicht                    | `draft`, `experimental` of `verified`.                                                                                                                                                                                                                                                                |
| `metadata.tested_firmware`  | Optioneel; standaard `[]`    | Lijst met maximaal 32 niet-lege tekenreeksen van elk maximaal 120 tekens. Waarden mogen niet uitsluitend uit witruimte bestaan.                                                                                                                                                                       |
| `metadata.limitations`      | Optioneel; standaard `[]`    | Lijst met maximaal 32 niet-lege tekenreeksen van elk maximaal 500 tekens. Waarden mogen niet uitsluitend uit witruimte bestaan.                                                                                                                                                                       |
| `requires.min_core_version` | Optioneel; standaard afwezig | Releaseversie met punten, maximaal 64 tekens: 1 tot 4 numerieke componenten van elk 1 tot 6 cijfers, met een optioneel door punten gescheiden prereleasesuffix van alfanumerieke ASCII-tekens/`-`. De actieve kern moet gelijk of nieuwer zijn volgens de vergelijking, inclusief prereleasevolgorde. |
| `requires.drivers`          | Verplicht                    | Lijst met kerndriver-ID’s. Onbekende ID’s zijn fouten; een driver die een ingevulde mogelijkheid vereist moet vermeld zijn. Een verder ongebruikte driver geeft een waarschuwing.                                                                                                                     |

### `soc`

`soc_class` blijft het verplichte brede familielabel. Het optionele gestructureerde blok legt feiten vast die Android doorgaans niet betrouwbaar kan bepalen, zoals of een nominaal quad-corepaneel Cortex-A35- of Cortex-A55-kernen gebruikt. Deze waarden verschijnen op het Dashboard en de pagina Profielen, maar worden weggelaten uit het beknopte openbare `/diag`-rapport. Voeg alleen feiten toe die worden ondersteund door een openbare bron of hardwarebewijs; laat onbekende velden weg in plaats van te gokken.

| Veld                           | Aanwezigheid                    | Type en validatie                                                                                                                                                                  |
| ------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `soc.model`                    | Verplicht als `soc` aanwezig is | Niet-lege modelnaam, 1 tot 100 tekens, zonder C0- of DEL-besturingstekens. Waarden mogen niet uitsluitend uit witruimte bestaan.                                                   |
| `soc.introduced_year`          | Optioneel; standaard afwezig    | Geheel getal van 1970 tot 2100. Gebruik het openbare introductiejaar van de SoC, niet het releasejaar van het paneel.                                                              |
| `soc.cpu_cores`                | Optioneel; standaard `[]`       | Maximaal acht architectuurclusters en 256 kernen in totaal. Een lege lijst betekent dat het model bekend is, maar de CPU-topologie onvoldoende is onderbouwd.                      |
| `soc.cpu_cores[].architecture` | Verplicht per item              | Niet-lege kernarchitectuur, 1 tot 64 tekens, zonder besturingstekens; architecturen moeten hoofdletterongevoelig uniek zijn. Waarden mogen niet uitsluitend uit witruimte bestaan. |
| `soc.cpu_cores[].count`        | Verplicht per item              | Geheel getal van 1 tot 128.                                                                                                                                                        |

### `match`

`match.any` is OF tussen groepen; de lijst `all` van één groep is EN tussen predicaten; de lijst `values` van één predicaat is OF. Vergelijkingen zijn hoofdlettergevoelig met buildgegevens die ha-paneld al naar kleine letters heeft omgezet.

| Veld                       | Aanwezigheid | Type en validatie                                                                                                                                                                 |
| -------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `match.priority`           | Verplicht    | Geheel getal van 0 tot 1000; beslist tussen gelijke profielen na de prioriteit van de gematchte groep.                                                                            |
| `match.fallback`           | Verplicht    | Booleaans. `true` is alleen geldig voor het gebundelde profiel met ID `generic`; geïmporteerde/communityprofielen kunnen geen terugvalprofielen zijn.                             |
| `match.any`                | Verplicht    | Lijst met maximaal 64 groepsobjecten. Een profiel dat geen terugvalprofiel is vereist minstens één groep; gebundeld Generiek mag een lege lijst gebruiken.                        |
| `match.any[].priority`     | Verplicht    | Geheel getal van 0 tot 1000; takspecificiteit wordt vóór profielprioriteit gebruikt.                                                                                              |
| `match.any[].all`          | Verplicht    | Lijst met 1 tot 8 predicaatobjecten.                                                                                                                                              |
| `match.any[].all[].field`  | Verplicht    | `model`, `device` of `product_version`.                                                                                                                                           |
| `match.any[].all[].op`     | Verplicht    | `equals`, `starts_with` of `contains`.                                                                                                                                            |
| `match.any[].all[].values` | Verplicht    | Lijst met 1 tot 32 niet-lege tekenreeksen in kleine letters; elk maximaal 100 tekens en zonder C0- of DEL-besturingstekens. Waarden mogen niet uitsluitend uit witruimte bestaan. |

### `platform` en `hardware`

| Veld                                     | Aanwezigheid                    | Type en validatie                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform.su_form`                       | Verplicht                       | `none`, `android` of `toolbox`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `platform.app_can_su`                    | Verplicht                       | Booleaans. Moet `false` zijn als `su_form` gelijk is aan `none`; een vorm `android` of `toolbox` kan nog steeds met `false` worden gedeclareerd voor een app die door zijn sandbox wordt begrensd.                                                                                                                                                                                                                                                                                                        |
| `platform.has_recents`                   | Optioneel; standaard `true`     | Booleaans.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `platform.has_native_navbar`             | Optioneel; standaard afwezig    | Laat weg om de zichtbaarheid van de navigatiebalk van de firmware te onderzoeken. Expliciet `true` of `false` overschrijft die controle.                                                                                                                                                                                                                                                                                                                                                                  |
| `platform.launcher.vendor_home_packages` | Optioneel; standaard leeg       | Lijst met maximaal 8 Android-pakketnamen, zonder duplicaten. Fabrikantapps die zich als Android-startscherm registreren maar geen appoverzicht zijn, zoals een bedieningsapp van de fabrikant. De knop Launcher in de navigatiebalk slaat ze over en opent, als niets anders geschikt is, de Paneellauncher, die ze nog wel als apps vermeldt.                                                                                                                                                            |
| `hardware.led`                           | Verplicht                       | Mapping met de onderstaande ledvelden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `hardware.led.mechanism`                 | Verplicht                       | `none`, `autodetect`, `rk3576-ioctl`, `rk3576-ioctl-daemon` of `sysfs-daemon`. Mechanismen die alleen via een daemon werken worden afgewezen als `platform.app_can_su` gelijk is aan `true`.                                                                                                                                                                                                                                                                                                              |
| `hardware.led.transfer`                  | Optioneel; standaard `identity` | Selecteert een gecompileerde overdrachtscurve. Voorbeelden zijn `identity`, `rk3576-four-bit`, `perceptual`, `gamma` en gemeten `points`; gebruik het aangeboden schema voor parameters.                                                                                                                                                                                                                                                                                                                  |
| `hardware.screen_off`                    | Verplicht                       | Selecteert een gecompileerde scherm-uit-driver, zoals `brightness-zero`, `su-blpower`, `daemon-blpower`, `keyevent`, `screen-timeout`, `device-admin` of `vendor-rpc`. Vereisten voor rechten en lokale activering hangen af van de gekozen route; gebruik het aangeboden schema en verifieer de route op hardware.                                                                                                                                                                                       |
| `hardware.has_button_backlight`          | Optioneel; standaard `false`    | Booleaans; selecteert bij true de begrensde knopverlichtingsmogelijkheid via de helper.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `hardware.local_wake`                    | Optioneel; standaard afwezig    | Lijst met unieke waarden uit `touch`, `proximity` en `button`: de manieren om een volledig donker paneel op het paneel zelf te activeren. `touch` betekent dat elke aanraking het activeert, `proximity` dat een handgebaar het activeert zodra nabijheid is gekalibreerd, en `button` dat een hardwareknop het activeert. Laat weg als dit onbekend is; een lege lijst declareert dat alleen Home Assistant het paneel activeert. Home Assistant kan het altijd activeren en wordt daarom nooit vermeld. |
| `hardware.zigbee_gateway_dir`            | Optioneel; standaard afwezig    | Exact toegestaan pad `/vendor/bin/siliconlabs_host`; geen ander pad wordt geaccepteerd.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `hardware.relay_base`                    | Optioneel; standaard afwezig    | Eén exact toegestaan pad: `/sys/class/relay`, `/sys/class/st_relay` of `/sys/class/strelay`.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `hardware.relay_base_fallbacks`          | Optioneel; standaard `[]`       | Lijst met maximaal drie paden uit dezelfde relaistoelatingslijst. Vermeldingen moeten uniek zijn en mogen `relay_base` niet herhalen.                                                                                                                                                                                                                                                                                                                                                                     |
| `hardware.button_led_gpio_base`          | Optioneel; standaard afwezig    | Geheel getal van 0 tot 4092, voor de eerste GPIO in een blok van vier GPIO’s.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `hardware.camera`                        | Optioneel; standaard afwezig    | Booleaans met drie toestanden: weglaten staat Android-opsomming toe, `true` declareert een kandidaat ook als opsomming mislukt, en `false` onderdrukt de camera. Opnemen vereist altijd een aangehechte schermindicator; met het scherm uit is ook actieve ledindicatie vereist. Zonder indicatie bij uitgeschakeld scherm stopt opnemen zodra het scherm uit gaat.                                                                                                                                       |
| `hardware.microphone`                    | Optioneel; standaard afwezig    | `true` declareert een bewezen microfoon, `false` onderdrukt die en weglaten gebruikt Androids opsomming van ingebouwde microfoons, gevolgd door een opnamecontrole vóór luisteren. Onafhankelijk van camera-aanwezigheid.                                                                                                                                                                                                                                                                                 |
| `hardware.camera_lens_offset_px`         | Optioneel                       | Geheel getal; schermpixels vanaf de bovenkant van het actieve schermgebied tot het midden van de cameralens. Het lampje voor cameragebruik wordt als een boog rond de lens getekend en hiermee gepositioneerd; het is een meting van de omlijsting die tussen printplaten verschilt. Laat weg als je het niet hebt gemeten; het lampje gebruikt dan een standaardwaarde.                                                                                                                                  |
| `hardware.touch_click_gain`              | Optioneel; standaard `0.2`      | Getal van 0.05 tot en met 1.0; schaalt het volume van aanraakklikfeedback voor een printplaat waarvan de klik met de systeemstandaard te hard of zacht is.                                                                                                                                                                                                                                                                                                                                                |

### `sensors` en `identity`

| Veld                            | Aanwezigheid                        | Type en validatie                                                                                                                                                                                               |
| ------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sensors.proximity_technology`  | Optioneel; standaard afwezig        | Niet-lege tekenreeks, 1 tot 100 tekens, zonder C0- of DEL-besturingstekens. Declareert bij aanwezigheid het gebruik van een Android-nabijheidssensor. Waarden mogen niet uitsluitend uit witruimte bestaan.     |
| `sensors.proximity_gpio`        | Optioneel; standaard afwezig        | Geheel getal van 0 tot 4095 voor de ondersteunde binaire GPIO-route met root.                                                                                                                                   |
| `sensors.light_technology`      | Optioneel; standaard afwezig        | Niet-lege tekenreeks, 1 tot 100 tekens, zonder C0- of DEL-besturingstekens. Declareert bij aanwezigheid het gebruik van een Android-omgevingslichtsensor. Waarden mogen niet uitsluitend uit witruimte bestaan. |
| `sensors.vi530x`                | Optioneel; standaard `false`        | Booleaans; biedt een door de helper gestarte VI530x-time-of-flight-afstandsbron, gestart via ioctl en daarna bevraagd. Vereist de geauthenticeerde helper.                                                      |
| `sensors.cht8305`               | Optioneel; standaard `false`        | Booleaans; schakelt een exacte door de kern ondersteunde CHT8305-compatibele kamerklimaatinvoer in via de geauthenticeerde helperroute.                                                                         |
| `sensors.room_temp_offset_c`    | Optioneel; standaard `0.0`          | Eindig getal van -30 tot en met 30 °C.                                                                                                                                                                          |
| `identity.manufacturer`         | Optioneel; standaard afwezig        | Niet-lege tekenreeks, 1 tot 100 tekens, zonder C0- of DEL-besturingstekens; afwezig betekent afleiden tijdens uitvoering. Waarden mogen niet uitsluitend uit witruimte bestaan.                                 |
| `identity.model`                | Optioneel; standaard afwezig        | Niet-lege tekenreeks, 1 tot 100 tekens, zonder C0- of DEL-besturingstekens; afwezig betekent afleiden tijdens uitvoering. Waarden mogen niet uitsluitend uit witruimte bestaan.                                 |
| `identity.model_label_strategy` | Optioneel; standaard `display-name` | `display-name` of `nspanel-product-version`.                                                                                                                                                                    |

Een opgeslagen schema-2-revisie kan `proximity_near_below`, `proximity_near_raw`, `proximity_far_raw` of `proximity_graded_strategy` bevatten. De lader accepteert deze vervallen sleutels alleen als compatibiliteitsmarkeringen: ze worden bij het laden genegeerd en bij serialisatie van een profieldocument weggelaten. Bij export van een onveranderlijke opgeslagen revisie blijven de oorspronkelijke bytes behouden. De runtime gebruikt gekalibreerde sensorprofielstandaarden of opgeslagen begeleide instellingen en controleert de werkelijke bron voordat genormaliseerde waarden worden gerapporteerd.

### `input`, `cpu` en `display`

| Veld                               | Aanwezigheid                 | Type en validatie                                                                                                                                                                 |
| ---------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input.evdev_buttons`              | Optioneel; standaard `[]`    | Lijst met maximaal 32 evdev-koppelingsobjecten. Dubbele paren `(sw, code)` worden afgewezen, ook als hun nodes verschillen.                                                       |
| `input.evdev_buttons[].node`       | Verplicht per item           | Tekenreeks passend bij `/dev/input/eventN`, waarbij `N` 1 tot 3 decimale cijfers is. Geen ander apparaatpad wordt geaccepteerd.                                                   |
| `input.evdev_buttons[].code`       | Verplicht per item           | Gehele Linux-invoer-/schakelcode van 1 tot 767.                                                                                                                                   |
| `input.evdev_buttons[].grab`       | Verplicht per item           | Booleaans; true vraagt exclusieve `EVIOCGRAB`.                                                                                                                                    |
| `input.evdev_buttons[].event_type` | Verplicht per item           | Tekenreeks van maximaal 64 tekens die voldoet aan `KEYCODE_[A-Z0-9_]+`.                                                                                                           |
| `input.evdev_buttons[].sw`         | Optioneel; standaard `false` | Booleaans; false selecteert `EV_KEY`, true selecteert `EV_SW`.                                                                                                                    |
| `cpu.governors`                    | Optioneel; standaard afwezig | Mapping waarvan alleen de sleutels `Performance`, `Efficiency` en `Auto` zijn toegestaan. Elke waarde is een governornaam van 1 tot 32 tekens die voldoet aan `[a-z][a-z0-9_-]*`. |
| `display.physical_ppi`             | Optioneel; standaard afwezig | Geheel getal van 50 tot 1000.                                                                                                                                                     |

### `provisioning`

| Veld                                          | Aanwezigheid                         | Type en validatie                                                                                                                                                                                        |
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provisioning.access`                         | Optioneel; standaard `{}`            | Mapping voor toegangsaanbevelingen.                                                                                                                                                                      |
| `provisioning.access.shizuku`                 | Afgeschaft compatibiliteitsveld      | Oude waarden worden geaccepteerd en genegeerd. Ze bieden geen toegangsroute tijdens uitvoering.                                                                                                          |
| `provisioning.software`                       | Optioneel; standaard `{}`            | Mapping voor softwarebeleid van de kern.                                                                                                                                                                 |
| `provisioning.software.webview.artifact`      | Optioneel; standaard afwezig         | ID van de kern `lineageos-138-arm`, `lineageos-150-arm` of `lineageos-150-arm64`. Een profiel kan de URL, versie of ondertekenaarhash niet opgeven.                                                      |
| `provisioning.software.companion.max_version` | Optioneel; standaard afwezig         | Releaseversie met punten met dezelfde syntaxis en limiet van 64 tekens als `requires.min_core_version`.                                                                                                  |
| `provisioning.display.density`                | Optioneel; standaard afwezig         | Geheel getal van 80 tot 640 dpi, of de benoemde strategie `nspanel-variant`.                                                                                                                             |
| `provisioning.display.font_scale`             | Optioneel; standaard afwezig         | Eindig getal van 0.5 tot en met 1.5.                                                                                                                                                                     |
| `provisioning.packages`                       | Optioneel; standaard `[]`            | Lijst met 0 tot 128 objecten voor de gewenste pakkettoestand.                                                                                                                                            |
| `provisioning.packages[].package`             | Verplicht per item                   | Unieke Android-pakketnaam die voldoet aan `[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+`.                                                                                                                     |
| `provisioning.packages[].desired_state`       | Verplicht per item                   | `disabled`. Dit beschrijft de doeltoestand en is geen toestemming voor uitvoering.                                                                                                                       |
| `provisioning.packages[].importance`          | Verplicht per item                   | `recommended` of `optional`. Belang bepaalt alleen de presentatie en betekent nooit standaard toepassen.                                                                                                 |
| `provisioning.packages[].tags`                | Optioneel; standaard `[]`            | Lijst met maximaal acht tags. Elk bestaat uit 1 tot 24 tekens, begint met een kleine ASCII-letter en bevat daarna alleen kleine letters, cijfers of `-`.                                                 |
| `provisioning.packages[].note`                | Optioneel; standaard lege tekenreeks | Tekenreeks van maximaal 500 tekens. Notities zijn aanvullende uitleg, geen procedures.                                                                                                                   |
| `provisioning.recipes`                        | Optioneel; standaard `[]`            | Lijst met maximaal 32 geselecteerde recepten van de kern.                                                                                                                                                |
| `provisioning.recipes[].id`                   | Verplicht per item                   | Uniek geregistreerd ID. Schema 2 kent `nspanel-pro.watchdog-e2big-repair` en `tpa10.vendor-stack-minimize`. Receptvermeldingen kunnen geen argumenten, opdrachten, URL’s of workflowdefinities bevatten. |

In de nog niet uitgebrachte versie 1.0.0-rc2 verwijzen de drie WebView-ID's naar de volgende door de kern beheerde builds en compatibiliteitsmetadata:

| Artefact-ID           | Build van de kern                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `lineageos-138-arm`   | LineageOS System WebView `138.0.7204.63`; ARM ABIs `armeabi-v7a` en `arm64-v8a`; Android 8–9.           |
| `lineageos-150-arm`   | LineageOS System WebView `150.0.7871.63`; ARM ABI `armeabi-v7a`; Android 10 of nieuwer.                 |
| `lineageos-150-arm64` | LineageOS System WebView `150.0.7871.63`; ARM ABIs `armeabi-v7a` en `arm64-v8a`; Android 10 of nieuwer. |

Het WebView-artefactveld selecteert een build waarvan download, controlesom, pakket, versie en ondertekenaar in de kern zijn ingebouwd. In de nog niet uitgebrachte versie 1.0.0-rc2 kan een vanuit Home Assistant gestarte update van de paneel-app ook een compatibele WebView installeren. Blijft die update onvoltooid, gebruik dan de bijbehorende update-Repair om opnieuw te proberen. Importeren of activeren van een profiel start geen update. Zie [De WebView bijwerken](/nl/hardware/guides/update-the-webview/).

### Voorwaardelijke driververeisten

Elke driver die door ingevulde velden wordt geselecteerd moet in `requires.drivers` staan. De aangeboden drivercatalogus vermeldt voor elke driver de vereiste bevoegdheden; verschillende Android- en fabrikantserviceroutes werken zonder root.

| Profielvoorwaarde                                                         | Vereiste driver           |
| ------------------------------------------------------------------------- | ------------------------- |
| `platform.su_form: android` en `platform.app_can_su: true`                | `access.android-su`       |
| `platform.su_form: toolbox` en `platform.app_can_su: true`                | `access.toolbox-su`       |
| `hardware.led.mechanism: autodetect`                                      | `led.autodetect`          |
| `hardware.led.mechanism: rk3576-ioctl`                                    | `led.rk3576-ioctl`        |
| `hardware.led.mechanism: rk3576-ioctl-daemon`                             | `led.rk3576-ioctl-daemon` |
| `hardware.led.mechanism: sysfs-daemon`                                    | `led.sysfs-daemon`        |
| `hardware.screen_off: brightness-zero`                                    | `screen.brightness-zero`  |
| `hardware.screen_off: su-blpower`                                         | `screen.su-blpower`       |
| `hardware.screen_off: daemon-blpower`                                     | `screen.daemon-blpower`   |
| `hardware.screen_off: keyevent`                                           | `screen.keyevent`         |
| `hardware.zigbee_gateway_dir` is aanwezig                                 | `radio.siliconlabs-host`  |
| `hardware.relay_base` is aanwezig, of `relay_base_fallbacks` is niet leeg | `relay.sysfs`             |
| `hardware.button_led_gpio_base` is aanwezig                               | `relay.gpio-button-led`   |
| `hardware.has_button_backlight: true`                                     | `input.button-backlight`  |
| `sensors.proximity_technology` of `sensors.light_technology` is aanwezig  | `sensor.android`          |
| `sensors.proximity_gpio` is aanwezig                                      | `sensor.gpio-proximity`   |
| `sensors.cht8305: true`                                                   | `sensor.cht8305-daemon`   |
| `sensors.vi530x: true`                                                    | `sensor.vi530x-daemon`    |
| `input.evdev_buttons` is niet leeg                                        | `input.evdev`             |
| `provisioning.software.webview.artifact` is aanwezig                      | `update.webview`          |

### Syntaxis- en opslagquota

| Reikwijdte                      | Limiet                                                 |
| ------------------------------- | ------------------------------------------------------ |
| Eén ruwe YAML-revisie           | 128 KiB aan UTF-8-bytes.                               |
| Aantal YAML-documenten          | Exact één; lege invoer is ongeldig.                    |
| YAML-aliassen                   | Nul.                                                   |
| Nesting                         | Maximaal 20 collectieniveaus.                          |
| Parserwerk                      | Maximaal 20.000 parsergebeurtenissen.                  |
| Elke afzonderlijke map of lijst | Maximaal 512 vermeldingen vóór strengere veldlimieten. |
| Elke afzonderlijke tekenreeks   | Maximaal 16.384 tekens vóór strengere veldlimieten.    |
| Geïmporteerde catalogus         | Maximaal 128 toegelaten revisies.                      |
| Eén geïmporteerd profiel-ID     | Maximaal 16 toegelaten revisies.                       |
| Opslag voor geïmporteerde YAML  | Maximaal 4 MiB totaal.                                 |

## Vereisten

Een profiel declareert het minimale kerngedrag en de ingebouwde drivers die het nodig heeft. Validatie weigert het profiel wanneer een vereiste niet beschikbaar is. Een niet-beschikbare vereiste verschilt van een mislukte controle op het paneel: het eerste betekent dat deze ha-paneld-build het gevraagde mechanisme niet kent; het tweede dat het mechanisme in de kern bestaat maar op dit paneel niet bereikbaar was.

Maak vereisten niet preventief ruimer. Een ongebruikte driver met verhoogde rechten vereisen maakt het profiel moeilijker uitvoerbaar en controleerbaar zonder functies toe te voegen.

## Koppelingsregels

Koppelingsregels werken alleen op de onveranderlijke gegevens `model`, `device` en `product_version` die ha-paneld aanbiedt. Een lijst `match.any` is OF; predicaten in de lijst `all` van één groep zijn EN. Predicaten ondersteunen `equals`, `starts_with` en `contains` met verwachte waarden in kleine letters, nooit reguliere expressies.

Elke groep heeft een takprioriteit `priority` van 0 tot 1000. Het overeenkomende gebundelde profiel met de hoogste prioriteit van een overeenkomende groep wint; `match.priority` op profielniveau breekt een resterende gelijke stand, en bij een volledig gelijke stand wordt veilig teruggevallen op Generic. Gebruik hogere groepsprioriteiten voor exacte productidentiteiten en lagere voor brede compatibiliteitsterugvallen. Een regel die alleen overeenkomt met `px30`, `rk3326`, `rk3566`, `rk3576` of een vergelijkbaar hergebruikte referentienaam is onvoldoende bewijs voor hardwaregebonden bediening.

Koppeling kiest een kandidaatprofiel; ze bewijst geen functie. Drivers controleren nog steeds de werkelijke beschikbaarheid en bij tegenspraak tussen bewijs en declaratie geldt het voorzichtige resultaat.

## Benoemde modelstrategieën

Het schema heeft geen algemene expressietaal of willekeurig voorwaardelijk patchgedeelte. De benoemde strategieën zijn bewust klein en worden door de kern beheerd:

- `identity.model_label_strategy: nspanel-product-version` decodeert de NSPanel-variant en het firmwarelabel;
- `provisioning.display.density: nspanel-variant` selecteert de gedocumenteerde dichtheid voor 86P/120P;
- de standaard `display-name` en vaste gehele waarden vermijden die omzettingen.

`hardware.relay_base_fallbacks` is gewone begrensde data voor bekende ondersteunde hernoemingen van relaisklassen, geen expressie of willekeurige zoekactie naar paden.

Strategieën zijn ingebouwde, begrensde omzettingen die in het schema worden benoemd, geen scripts uit het profiel. Ze kunnen geen I/O of drivers aanroepen. Het aangeboden schema beschrijft de ondersteunde strategieën en hun invoer.

Maak afzonderlijke profielen wanneer geen benoemde strategie het verschil dekt, of wanneer producten andere ingebouwde drivers, bevoegdheidsniveaus, herstelverwachtingen of onafhankelijk onderhouden bewijs nodig hebben.

## Functies en ingebouwde drivers

Een functiedeclaratie bevat hardwarefeiten en waar nodig een driver-ID met getypeerde parameters. Driver-ID's benoemen implementaties die in ha-paneld zijn ingebouwd. De driver valideert paden, bereiken, gebeurteniscodes, pakketnamen en andere beveiligingsgevoelige invoer. Paden met verhoogde rechten worden gekozen uit toestemmingslijsten in de kern. De behouden metadata `provisioning.software.webview.artifact` benoemen een URL, versie, artefactcontrolesom en ondertekenaarhash die in de kern zijn ingebouwd en daarmee gecontroleerd; een profiel kan die vertrouwensbasis niet herdefiniëren. In de nog niet uitgebrachte versie 1.0.0-rc2 controleert een door de eigenaar gestarte update de geïnstalleerde provider en diens compatibiliteit voordat het artefact wordt gebruikt; het profiel kan geen andere download of vertrouwensbasis leveren.

Profielen kunnen niet het volgende leveren:

- shellopdrachten of argumentarrays;
- opdrachtnamen voor hulpdaemons;
- willekeurige lees- of schrijfbewerkingen op het bestandssysteem;
- native bibliotheken, ioctl-nummers of bytepayloads;
- APK-URL's, ondertekenaarhashes of nieuwe update-artefacten;
- uitvoerbare expressies met toegang tot netwerk, bestandssysteem, processen, reflectie of klok;
- aanmeldgegevens, Home Assistant-tokens of MQTT-configuratie.

Een gedeclareerde functie is een kandidaat totdat de driver die bevestigt. De interface en diagnostiek zouden onderscheid moeten maken tussen **gedeclareerd**, **beschikbaar**, **niet beschikbaar** en **bevoegdheid ontbreekt**, in plaats van de YAML als bewijs te behandelen.

## Compatibiliteitsgedrag

ha-paneld behandelt compatibiliteitsfouten als problemen van inactieve profielen, niet als fouten bij het opstarten van het paneel:

- Schema `2` is de enige geaccepteerde documenttaal. Opgeslagen schema-1-revisies blijven zichtbaar, exporteerbaar en verwijderbaar maar kunnen niet worden geactiveerd; een geselecteerde incompatibele revisie valt terug op een compatibele laatst werkende schema-2-revisie, een overeenkomend gebundeld profiel of het gebundelde `generic.yaml`.
- Een onbekende vereiste driver of omzetting verhindert activering.
- Geïnstalleerde lokale revisies worden na een appupdate opnieuw gevalideerd.
- De oorspronkelijke YAML en diens inhoudshash blijven na validatie en normalisatie herkenbaar.
- Bij een activeringsfout wordt teruggekeerd naar de laatst werkende revisie.
- Als geen paneelgebonden profiel kan draaien, start ha-paneld met het voorzichtige gedrag van het gebundelde `generic.yaml`. Ontbreekt die gebundelde terugval of is die beschadigd, dan houdt een noodcontract zonder functies de lokale beheerinterface beschikbaar zonder paneelhardware te veronderstellen.

Inhoudshashes en afzonderlijk gepubliceerde handtekeningen beantwoorden verschillende vragen. De revisiehash van ha-paneld koppelt opslaan en activeren aan de onderzochte bytes. Een externe handtekening kan helpen een uitgever te identificeren, maar is geen bevoegdheidssignaal dat de profiellader interpreteert. Geen van beide geeft root of toestemming om validatie en bevestiging te omzeilen.

## Koppelingsvolgorde

Het resolutiebeleid beschermt bekende producten tegen impliciete activering van communitybestanden:

1. een expliciete, geldige beheerderskeuze vastgezet op een exacte gebundelde of lokale revisie;
2. automatische exacte koppeling met gebundelde profielen;
3. automatische gebundelde compatibiliteitsterugvallen;
4. Generic.

Lokale/communitykoppelingsregels worden alleen beoordeeld voor voorvertoning en vergelijking. Ze doen nooit mee aan automatische selectie, dus importeren of opslaan van een bestand kan gebundelde detectie niet overschrijven. Activeren vereist altijd een expliciete vastgezette keuze.

## Compatibiliteitschecklist voor auteurs

Controleer voordat je een nieuwe revisie deelt:

- schema `2` en elk veld valideren op de oudste kernversie die het bestand claimt;
- elke vereiste driver is in die versie aanwezig;
- exacte fingerprint-testgegevens dekken elk geclaimd model en elke firmwarefamilie;
- bijna-overeenkomende testgegevens komen niet overeen met een ander product met dezelfde SoC;
- elke grens van een benoemde strategie is waar van toepassing direct onder, op en boven de overgang getest;
- elke exacte koppelingsgroep heeft een hogere takprioriteit dan zijn brede terugval, met testgegevens voor botsingen tussen profielen;
- het profiel werkt met niet-beschikbare optionele hardware en ontbrekende bevoegdheden zonder opstarten te blokkeren;
- de vorige actieve revisie blijft bruikbaar als terugvaldoel.
