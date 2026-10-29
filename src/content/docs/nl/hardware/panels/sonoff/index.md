---
title: Sonoff NSPanel Pro
description: Hardwaregegevens van de oorspronkelijke Sonoff NSPanel Pro 86P en 120P, Rockchip PX30-panelen met een ingebouwde Zigbee-radio.
vendor: Sonoff
panelIndex: true
sidebar:
  label: Overzicht
  order: 0
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
---

De oorspronkelijke NSPanel Pro-reeks bestaat uit twee fysiek verschillende panelen, de **[86P](/nl/hardware/panels/sonoff/nspanel-pro-86p/)** en de **[120P](/nl/hardware/panels/sonoff/nspanel-pro-120p/)**, genoemd naar de EU-inbouwdozen van 86 mm en 120 mm. Beide hebben een ingebouwde **Zigbee 3.0-coördinator**, geen NFC of IR en de CPU met het laagste vermogen van de volledig ondersteunde panelen. Ze delen bijna alles op deze pagina (rootprocedure, WebView, led, sensoren, Zigbee-gateway); de eigen pagina van elke variant bevat alleen de eigen specificaties en de weinige afwijkende gegevens. Deze pagina is voornamelijk via reverse-engineering opgesteld op een werkende **86P** (Android 8.1, geroot, toolbox-`su`), met afzonderlijke liveverificatie op de 120P waar vermeld.

## Ook verkocht als

Sonoff NSPanel Pro 86, NSPanel Pro 120, NSPanel Pro 86P, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, px30_evb, SN_3326S, SN-RKPX30-NSP-01, nspanel-pro, nspanel-pro-ver120. Niet te verwarren met de NSPanel Pro Gen2 of de Tuya S6E- en T6E-printplaten, die andere hardware zijn.

:::tip
De belangrijkste gegevens: het paneel wordt geleverd als **`userdebug` zonder adb-wachtwoord**, dus `adb root` werkt direct. De **led is niet in kaart gebracht** (er is geen bedienbare RGB-node gevonden). Licht en nabijheid zijn **rechtstreeks vanuit de app toegankelijk**. De ingebouwde **EFR32-Zigbee-radio** wordt beheerd via een lokale broker, niet door opnieuw te flashen. In de nog niet uitgebrachte versie 1.0.0-rc2 kunnen installaties en updates van de paneel-app die vanuit Home Assistant worden gestart de geverifieerde WebView installeren; zie [WebView: werk deze eerst bij](#webview-update-this-first).
:::

|         |                                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **PX30 / rk3326**                                                                                                                  |
| CPU     | 4× **Cortex-A35** tot **1.512 GHz** (408 MHz in rust)                                                                                       |
| GPU     | **Mali-G31** (op apparaat bevestigd)                                                                                                        |
| Scherm  | **480×480 vierkant** (1:1), ongeveer 4 in, 160 dpi (mdpi, passend bij ongeveer 170 fysieke ppi), 60 Hz, een canvas van **480×480 dp**       |
| RAM     | **2 GB** (ongeveer 1960 MB bruikbaar)                                                                                                       |
| Opslag  | eMMC; `/data` ongeveer 3.5 GB                                                                                                               |
| Android | 8.1 (API 27)                                                                                                                                |
| ABI     | arm64-v8a                                                                                                                                   |
| Radio's | **Zigbee 3.0** (Silicon Labs EFR32-coördinator op UART `ttyS5`, zie hieronder), Wi-Fi, Bluetooth. Geen NFC, IR, Ethernet of mobiel netwerk. |

:::note
De Cortex-A35 is een efficiëntiekern met duidelijk minder verwerkingscapaciteit per klokcyclus dan de A55 (TPA10) of A72 (WF1589T). Met 2 GB RAM biedt de NSPanel Pro **instapprestaties** binnen de volledig ondersteunde panelen; zie de [prestatievergelijking](/nl/hardware/#performance-comparison).
:::

:::tip
Firmware wijzigen op een paneel zonder knoppen? Lees eerst [Firmwareback-up en -herstel](/nl/hardware/guides/firmware-backup-and-restore/). De NSPanel Pro gebruikt [de modelspecifieke hulpmiddelen van seaky](/nl/hardware/guides/firmware-backup-and-restore/#per-panel-notes) in plaats van `rkdeveloptool`.
:::

## Varianten: 86P en 120P

De bovenstaande specificatietabel en het grootste deel van deze pagina zijn vastgelegd op een **86P**; de **120P** heeft een andere printplaat. Zie de pagina's van de [86P](/nl/hardware/panels/sonoff/nspanel-pro-86p/) en [120P](/nl/hardware/panels/sonoff/nspanel-pro-120p/) voor de eigen specificatietabel en foto van elke variant.

|                      | NSPanel Pro **86P**                                                                                                                                                   | NSPanel Pro **120P**                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| SoC                  | Rockchip **PX30**                                                                                                                                                     | Rockchip **RK3326-S** (dezelfde PX30/RK3326-familie; `ro.board.platform=rk3326`, apparaatboom `rockchip,px30`)          |
| Scherm               | **480×480** vierkant, ongeveer 160 dpi, alleen staand                                                                                                                 | **750×1334** staand, **240 dpi** (override 250); liggend beschikbaar; ongeveer 1 cm smaller en langer dan de 86P        |
| Build-ID's           | beide melden `ro.product.model/device/name = px30_evb`, een gedeelde Rockchip-printplaatnaam en _geen_ betrouwbare manier om de varianten te onderscheiden            | als 86P                                                                                                                 |
| `ro.product.version` | vorm `NSPanel86P_x.y.z` of `s6_android_x.y.z`                                                                                                                         | `NSPanel120P_x.y.z` (OTA-kanaal `nspanel-pro-ver120`, volledige ROM `SN_3326S_750X1334_…`)                              |
| OTA-vorm             | volledige ROM tot en met **4.0.12**; latere geïndexeerde releases zijn diffs of uitsluitend app-updates (zie de [firmwarepagina](/nl/hardware/firmware/nspanel-pro/)) | als 86P                                                                                                                 |
| Nabijheidsfirmware   | **4.0.12 herstelde bereikmetingen**                                                                                                                                   | bleef **binair** op 4.x (de kernels verschillen per model; zie [Sensoren](#sensors-light-and-proximity-are-app-direct)) |

Beide delen de EFR32-Zigbee-radio, Android 8.1 (AOSP), arm64-v8a en de hieronder beschreven root- en herstelroutes. Live geverifieerd op een 120P (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, dichtheid 240, `ro.board.platform=rk3326`.

:::note
Deze pagina beveelt in de tekst geen firmwareversie aan; de gegenereerde [firmware-index](/nl/hardware/firmware/) is gezaghebbend. De flashprocedure is op hardware geverifieerd tot en met **4.4.0**. Latere geïndexeerde releases zijn alleen tegen het CDN geverifieerd, nooit live geflasht. Op 2026-08-14 documenteert [Sonoffs openbare wijzigingslogboek](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq) releases tot **4.6.0**; 4.6.2 en 4.8.0 zijn alleen gevonden door het CDN te bevragen en 4.7.0 wordt alleen besproken in een [eWeLink-feedbackdraad van gebruikers](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789), een discussie en geen releaseaankondiging. Release **4.5.3** is een ROM-diff op de 120P maar uitsluitend een app-update op de 86P, en **4.6.2** is uitsluitend een app-update zonder ROM-diff op beide kanalen. Een upgrade kan dus meerdere stappen vergen. Ontbreken in de index betekent dat de build niet is gevonden door bevraging; het CDN kan niet worden opgesomd, dus ontbreken bewijst nooit dat een build niet bestaat.

**Communitymeldingen beschrijven herstartlussen op 4.5.1 en 4.5.2**, met intervallen van ongeveer 10 tot 60 minuten op beide modellen. Voor 4.7.0 bevat de feedbackdraad meldingen van verbindingsproblemen met subapparaten na bijwerken; sommige werden opgelost door een herstart, andere worden als aanhoudend beschreven. Die zijn niet gereproduceerd of gekwantificeerd, dus behandel ze als ongeverifieerde gebruikersmeldingen in plaats van een bekende regressie. Verifieer een nieuwere release op één paneel voordat je die op meerdere uitrolt; **4.0.12** blijft het conservatieve volledige-ROM-controlepunt om op vast te zetten.
:::

### Firmware-eigenaardigheden per versie

Gedrag dat verandert tussen eWeLink-firmwareversies, oudste eerst. `ro.product.version` is het **interne** ID (`NSPanel86P_x.y.z` of `s6_android_x.y.z` op de 86P, `NSPanel120P_x.y.z` op de 120P), _niet_ het marketing- of OTA-nummer dat de eWeLink-app toont (4.0.12, 4.5.x). Detectie en versiegebonden logica moeten `ro.product.version` lezen, niet de marketingtekst.

| Firmware                               | Eigenaardigheid of gedrag                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Wat te doen                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Ouder (vóór 1.3.2)**                 | Geen adb-schakelaar in de app; ontwikkelaarsopties onbereikbaar vanuit de interface                                                                                                                                                                                                                                                                                                                                                                                                                 | Schakel adb in via de interne **OTG-poort** (behuizing openen); zie [Adb- en roottoegang verkrijgen](#gaining-adb-and-root-access).                                                                                                                                                                                                                                                  |
| **1.3.2 en later**                     | Adb inschakelen verplaatst naar de eWeLink-app                                                                                                                                                                                                                                                                                                                                                                                                                                                      | eWeLink, _Device Settings_, tik acht keer op **Device ID**, ontwikkelaarsmodus, adb.                                                                                                                                                                                                                                                                                                 |
| **1.4 en later**                       | Ontwikkelaarsmodus **verwijderd** uit de interface                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Schakel adb in via de **vijf stroomcycli** tijdens de Sonoff-opstartanimatie; zie [Adb- en roottoegang verkrijgen](#gaining-adb-and-root-access).                                                                                                                                                                                                                                    |
| **3.5.1 (86P, geverifieerd)**          | Standaard-systeem-WebView is **Chromium 107.0.5304.105**, veel te oud voor een modern Home Assistant-dashboard; andere firmware kan afwijken                                                                                                                                                                                                                                                                                                                                                        | Gebruik de beheerde WebView-update van de nog niet uitgebrachte versie 1.0.0-rc2 of de handmatige terugvaloptie via adb; zie [WebView: werk deze eerst bij](#webview-update-this-first). De statusbanner van de paneelapp markeert ook WebView-versies onder Chromium 110.                                                                                                           |
| **3.7.1 (120P, live)**                 | Basisreferentiebuild                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `wm size` 750×1334, dichtheid 240, `ro.board.platform=rk3326`.                                                                                                                                                                                                                                                                                                                       |
| **4.0.0** (uitgerold vanaf 2025-09-19) | Standaardfirmware bevat de F-Droid-appwinkel; merkbaar snellere interface                                                                                                                                                                                                                                                                                                                                                                                                                           | Controleer of zowel **APP** _als_ **OS** versie 4.0.0 of later aangeven.                                                                                                                                                                                                                                                                                                             |
| **4.0.12**                             | Bereikmetingen voor nabijheid hersteld op de **86P**; de **120P blijft binair** (de kernels verschillen per model)                                                                                                                                                                                                                                                                                                                                                                                  | De conservatieve stabiele vastgezette versie. De ruwe invoervorm hangt af van model en firmware; begeleide nabijheidsconfiguratie kalibreert en normaliseert beide vormen; zie [Sensoren](#sensors-light-and-proximity-are-app-direct).                                                                                                                                              |
| **4.5.1 en 4.5.2**                     | **Wijdverspreide communitymeldingen van herstartlussen** (ongeveer 10 tot 60 minuten, beide modellen); 4.5.2 is uitsluitend een applaag op 4.5.1                                                                                                                                                                                                                                                                                                                                                    | Vervangen door latere releases. Zet vast op **4.0.12** voor maximale stabiliteit of test een nieuwere release eerst op één paneel.                                                                                                                                                                                                                                                   |
| **4.5.3**                              | Automatische Matter-ontdekking en optimalisaties voor schermbeheer; ROM-diff op de 120P maar uitsluitend app-update op de 86P                                                                                                                                                                                                                                                                                                                                                                       | Geen herstartlusbewijs specifiek voor 4.5.3; vervangen door latere releases.                                                                                                                                                                                                                                                                                                         |
| **4.6.0** (juni 2026)                  | **Local Web Portal** (`nspanelpro.local`: LAN-configuratie, MQTT Discovery-export naar Home Assistant, Matter Bridge); CDN-inspectie vond diffs vanaf 4.0.12, 4.4.0 en 4.5.1                                                                                                                                                                                                                                                                                                                        | Gedocumenteerd in Sonoffs openbare wijzigingslogboek. **4.6.2** is geïndexeerd als uitsluitend app-update zonder ROM-diff op beide kanalen; er is geen 4.6.1 gevonden.                                                                                                                                                                                                               |
| **4.7.0** (juli 2026)                  | Besproken in een eWeLink-feedbackdraad maar **ontbreekt in Sonoffs openbare wijzigingslogboek**; omvat Gen1- en Gen2-panelen; gebruikers melden toegevoegde ondersteuning voor Basic gen-5-relais (BASIC-1GS); CDN-inspectie vond inkomende diffs vanaf 4.0.12, 4.4.0, 4.5.1 en 4.6.0 op beide modellen, plus 4.5.3 uitsluitend op de 120P                                                                                                                                                          | Communitymeldingen van verbindingsproblemen met subapparaten, deels opgelost door herstart en deels als aanhoudend beschreven; ongeverifieerd. Verifieer op één paneel voordat je verder uitrolt.                                                                                                                                                                                    |
| **4.8.0** (augustus 2026)              | **Geen releaseaankondiging of wijzigingslogboek gevonden**; gevonden door het CDN te bevragen. Een eWeLink-medewerker plande deze op 2026-07-16 in de [roadmapdraad](https://forum.ewelink.cc/t/nspanel-pro-roadmap-and-co-created-future/206240) voor augustus en bevestigde één functie: een optie om het paneel automatisch bij te werken via de eWeLink-app. CDN-inspectie vond inkomende diffs vanaf 4.0.12, 4.4.0, 4.5.1, 4.6.0 en 4.7.0 op beide modellen, plus 4.5.3 uitsluitend op de 120P | Inhoud verder onbekend en geen feedbackdraad gevonden, dus er zijn geen meldingen over de stabiliteit in welke richting dan ook. Behandel deze als niet beoordeeld in plaats van probleemloos. **Als automatisch bijwerken standaard aan staat, kan een paneel zonder toezicht firmware installeren**; controleer die instelling dus voordat je vertrouwt op een vastgezette versie. |

:::note
Dit zijn eigenaardigheden van de oorspronkelijke 86P en 120P. De NSPanel Pro **Gen2** (RK3326-**S**, twee relais, EFR32**MG24**) is een ander hardwaredoel. Sonoff levert Gen1 en Gen2 op dezelfde firmwareversielijn (4.7.0 omvat beide), dus leid geen afzonderlijke firmwarelijn af en neem niet aan dat elke opmerking over het oorspronkelijke model ook daar geldt. Het oorspronkelijke NSPanel Pro-profiel matcht elk paneel dat een PX30- of RK3326-printplaatnaam meldt. Een Gen2 die dat meldt, matcht dus dit profiel totdat de Gen2 een eigen profiel heeft; dit profiel is niet getest op een Gen2 en biedt zijn relais niet aan.
:::

Verwante Tuya-printplaten, de **S6E** en **T6E** (relaisvarianten; de S6E is een T6E met twee relais), de [**Smatek S9E**](/nl/hardware/panels/smatek/s9e/) en de [**Tuya TPA10**](/nl/hardware/panels/tuya/tpa10/) (RK3566, Cortex-A55, Android 11), zijn afzonderlijke doelen en draaien geen NSPanel Pro-firmware.

:::danger
Detectie kan niet vertrouwen op `ro.product.model`, omdat beide varianten `px30_evb` melden. Gebruik `ro.product.version`, schermmetingen of `ro.board.platform` om de 86P en 120P te onderscheiden. Nabijheidsgedrag verschilt ook tussen modellen en firmware. Daarom kalibreert begeleide nabijheidsconfiguratie de huidige metingen en slaat het resultaat op in plaats van een firmwarespecifieke classificator te kiezen.
:::

<a id="gaining-adb-and-root-access"></a>

## Adb- en roottoegang verkrijgen

In tegenstelling tot de TPA10 heeft de NSPanel Pro **geen adb-wachtwoord**. Hij wordt geleverd als `userdebug`-build met testsleutels (`ro.debuggable=1`), dus `adb root` werkt en `/system` kan opnieuw worden aangekoppeld. De enige moeilijkheid is de ontwikkelaarsopties _bereiken_, die eWeLink-firmware per versie anders verbergt. Samengevat uit de handleidingen van blakadder ([sideloaden](https://blakadder.com/nspanel-pro-sideload/), [geheimen](https://blakadder.com/nspanel-pro-secrets/)).

**Eerste route (86P en 120P).** Of netwerk-ADB op TCP-poort 5555 zonder computer kan worden ingeschakeld hangt af van de firmware; een universele schakelaar op het paneel is niet vastgesteld. De eWeLink-ontwikkelaarsmodusroute hieronder is gedocumenteerd voor de vermelde firmware, maar bewijst TCP5555 niet op elke latere build. Gebruik bij ontbrekende netwerk-ADB de gedocumenteerde USB-route voor jouw firmware. Rootopdrachten geven geen eerste toegang.

**1. Adb inschakelen.** De route hangt af van de firmware:

- **Oudere firmware:** open de behuizing (verwijder de achterste schroeven en maak de aanraakconnector los) om de OTG-USB-poort bloot te leggen en sluit een host aan; adb werkt rechtstreeks via USB.
- **Firmware 1.3.2 en later:** open in de **eWeLink-app** de _Device Settings_ van het paneel en tik acht keer op **Device ID** om ontwikkelaarsmodus in te schakelen, wat adb herstelt.
- **Firmware 1.4 en later** (ontwikkelaarsmodus verwijderd): schakel tijdens de Sonoff-opstartanimatie **vijf keer** de stroom uit en in om een herstelstart af te dwingen en voer in dat tijdvenster `adb install ultra-small-launcher.apk` uit. Stel na de herstart die launcher als standaard in en tik zeven keer op _Instellingen, Systeem, Over tablet, Buildnummer_ om ontwikkelaarsopties opnieuw in te schakelen en USB-foutopsporing aan te zetten.

**2. Overschakelen naar netwerk-adb**, zodat de behuizing dicht kan blijven:

```bash
adb tcpip 5555
adb shell ip -o a            # find the panel IP
adb connect <panel-ip>:5555
adb shell su 0 setprop persist.adb.tcp.port 5555   # survive reboot (service prop resets)
```

**3. Root.** Omdat de build `userdebug` is, geeft `adb root` direct een adbd-shell met root. De paneelapp roept `su` vanuit zijn sandbox aan, dus installeer een blijvende `su` in `/system`. **SuperSU `su` 2.76** op `/system/xbin/su` is de geteste build:

```bash
adb root
adb disable-verity          # only if remount is refused; this reboots the panel
adb remount                 # or: adb shell mount -o remount,rw /system
adb push su /system/xbin/su
adb shell chmod 06755 /system/xbin/su
```

:::danger
Schakel de eWeLink-apps (`com.eWeLinkNSPro.dev`, `com.eWeLinkControlPanel`) pas uit **nadat** adb en `su` betrouwbaar werken en je een andere manier hebt om naar start en terug te gaan; de navigatieacties van de paneelapp bieden dat. De eWeLink-**Zigbee-gatewaystack** is onafhankelijk van deze apps en blijft draaien; beheer die met de [Zigbee-routerschakelaar](#zigbee-gateway) in plaats van die te verwijderen.
:::

<a id="webview-update-this-first"></a>

## WebView: werk deze eerst bij

Een 86P die vers was geflasht met firmware `3.5.1` (build `164637`) is geverifieerd met `com.android.webview` **107.0.5304.105** (Chromium 107), te oud voor een actueel Home Assistant-dashboard. Andere firmware en modellen kunnen afwijken, dus controleer de geïnstalleerde provider voordat je besluit bij te werken. De gearchiveerde OTA-diffpakketten bevatten geen WebView-APK. Deze versie is daarom met `dumpsys webviewupdate` van het werkende exemplaar gelezen. Dat exemplaar draait Chromium **138** na een adb-update. In de nog niet uitgebrachte versie 1.0.0-rc2 kunnen installaties en updates van de paneel-app die vanuit Home Assistant worden gestart een geverifieerde compatibele WebView installeren. Als die poging onvoltooid blijft, kies je **Opnieuw proberen** in de update-Repair van het paneel om verder te gaan. De handmatige terugvaloptie is een update via adb; zie [De systeem-WebView bijwerken](/nl/hardware/guides/update-the-webview/#handmatige-terugvaloptie).

## LED

Er is op dit exemplaar geen RGB-node onder `/sys/class/leds` en geen `/dev/ledjni` gevonden. Er is dus **geen vanuit de app of sysfs bedienbare RGB-led in kaart gebracht** op de NSPanel Pro (vergelijk de `avsux`-node van de TPA10 en `/dev/ledjni` van de WF1589T). Schermhelderheid en achtergrondverlichting gebruiken de standaard-Android-paden.

<a id="sensors-light-and-proximity-are-app-direct"></a>

## Sensoren: licht en nabijheid rechtstreeks vanuit de app

In tegenstelling tot de TPA10, waar temperatuur en vochtigheid root vereisen, biedt de NSPanel Pro zijn gecombineerde Sensortek-sensor aan via de standaard-`SensorManager`: `android.sensor.light`, `android.sensor.proximity` en `android.sensor.accelerometer`, alle leesbaar door een gewone app zonder root. De paneelapp leest hier licht en nabijheid rechtstreeks. Er is geen temperatuur- of vochtigheidssensor aanwezig.

:::note
**Nabijheidsmetingen hangen af van zowel firmware als model.** De sensor is een Sensortek STK3A5x in een uitsparing in de bovenste printplaat achter het dekglas. De rustbasislijn varieert sterk tussen exemplaren (bij het ene ongeveer 1000, bij het andere ongeveer 4000); alleen de _relatieve_ verandering telt. Een hoge rustbasislijn is dus normaal, geen fout. Tot ongeveer firmware **3.3** meldt hij een bereikmeting met intervallen van ongeveer 50 ms; van ongeveer **3.3 tot 3.4** schakelde de kerneldriver over op binair 0 of 1. **4.0.12 herstelde bereikmetingen uitsluitend op de 86P**; de **120P bleef binair**. Begeleide nabijheidsconfiguratie kalibreert beide signalen en slaat het resultaat op. Daarna normaliseert het paneel het bruikbare bereik over je panelen, zodat profielen geen drempels per firmware of bereik- en binaire classificatoren bevatten. (Bronnen: issues van seaky's tools [142](https://github.com/seaky/nspanel_pro_tools_apk/issues/142), [144](https://github.com/seaky/nspanel_pro_tools_apk/issues/144), [171](https://github.com/seaky/nspanel_pro_tools_apk/issues/171) en [262](https://github.com/seaky/nspanel_pro_tools_apk/issues/262).)
:::

### Gebonden I²C-apparaten

| I²C-adres           | Driver of naam               | Wat het is                                                       |
| ------------------- | ---------------------------- | ---------------------------------------------------------------- |
| `0-0020`            | `rk809`                      | PMIC                                                             |
| `1-001a` / `1-005a` | `CST226` / `CST226SE`        | Hynitron capacitieve aanraakcontroller                           |
| `2-003c`            | `tp`                         | aanraakpaneel                                                    |
| `2-0046`            | `ls_stk3a5x` en `ps_stk3a5x` | Sensortek **STK3A5x** gecombineerd omgevingslicht en nabijheid   |
| `2-0047`            | `ls_stk3x3x` en `ps_stk3x3x` | Sensortek **STK3x3x** licht en nabijheid (alternatief onderdeel) |

<a id="zigbee-gateway"></a>

## Zigbee-gateway

De NSPanel Pro heeft een ingebouwde **Silicon Labs EFR32 Zigbee 3.0-radio** op UART `/dev/ttyS5`, bestuurd door de hoststack van de fabrikant (`/vendor/bin/siliconlabs_host/zgateway`) via een lokale MQTT-broker. De eWeLink-apps gebruiken dezelfde stack; daarom wordt het paneel geleverd als eWeLink-Zigbee-hub.

De paneelapp beheert die rechtstreeks. `switch.<panel>_zigbee_router` verandert het paneel in een Zigbee-**router** die je bestaande mesh uitbreidt (start de gateway en verzekert de rol Repeater), en schakelt die weer uit (stopt de gateway en geeft de radio vrij). Dit werkt via de lokale broker, zonder aanmeldgegevens en zonder rechtstreeks `ttyS5` te bedienen. Het paneel verschijnt dan als een normale router in je ZHA- of Zigbee2MQTT-coördinator.

:::note
Van rol wisselen is **geen flashbewerking**: er is geen `.gbl`- of bootloaderstap; het stelt alleen het EZSP-knooppunttype in. Zie [Firmwareback-up en -herstel](/nl/hardware/guides/firmware-backup-and-restore/) voor firmwarewerk op partitieniveau.
:::

:::note
**Er is geen Thread Border Router gedocumenteerd of in kaart gebracht.** De geïnstalleerde fabrikantstack gebruikt de EFR32 als Zigbee-NCP. De EFR32MG21-chip ondersteunt meerdere protocollen, maar dat bewijst geen Thread-firmware of borderrouter op het paneel; Sonoff documenteert in plaats daarvan een Matter Bridge.

**Firmware 4.x heeft de Zigbee-stack herwerkt.** Community-inspectie vond een Zigbee2MQTT-fork, een gewijzigd MQTT-wachtwoord op het apparaat en een andere opstartvolgorde. [Sonoff documenteert wisselen tussen coördinator en router](https://sonoff.tech/blogs/news/nspanel-pro-v4-3-0-central-heating-redefining-whole-home-temperature-automation) in actuele firmware, maar de lokale-brokerbediening van de paneelapp is gebouwd voor 3.x en eerder en **moet mogelijk worden aangepast voor 4.x**. (Communitybronnen: issues van seaky's tools [241](https://github.com/seaky/nspanel_pro_tools_apk/issues/241), [244](https://github.com/seaky/nspanel_pro_tools_apk/issues/244) en [255](https://github.com/seaky/nspanel_pro_tools_apk/issues/255), en [roottool issue 3](https://github.com/seaky/nspanel_pro_roottool_apk/issues/3).)
:::

:::caution
**Een melder bevestigt een defect in de oude Zigbee-watchdog van de fabrikant op NSPanel Pro 120-standaardfirmware 3.8.0.** Firmware met de recursieve `LD_LIBRARY_PATH`-toewijzing uit [het issue van de melder](https://github.com/panel-assistant/android/issues/34) kan uiteindelijk elke externe opdracht van de watchdog laten mislukken met `E2BIG`, één CPU-kern verbruiken en het herstellen van een uitgevallen `zgateway` stoppen. Herstarten wist het probleem slechts tijdelijk. Zie [Prestaties afstemmen](/nl/manage/performance/) voor het bewijs en de vereisten voor veilig herstel. De tijdelijke oplossing van de melder is niet onafhankelijk gevalideerd. Community-inspectie van 4.0.12 en 4.6.0 vond de kwetsbare toewijzing niet.
:::

### Vereisten: firmware 2.2.0 of later

De hoststack is de **eigen** eWeLink- en Sonoff-gateway van de fabrikant, met een versie passend bij de paneelfirmware (bijvoorbeeld `sonoff-v3.5.4`). Zigbee-**routermodus** kwam in **NSPanel Pro-firmware 2.2.0** (2023; eWeLink-app, _Device Settings, Pilot Features, Zigbee Mode_) en lokale hoststack-ondersteuning voor repeater in gatewaypakket 1.1.9. In de praktijk:

- **Gateway aanwezig** (firmware 2.2.0 of later, of gesideload): de paneelapp detecteert die en publiceert `switch.<panel>_zigbee_router`. Zet die aan en het paneel sluit zich als router aan bij je coördinator.
- **Geen gateway** (zeer oude firmware, nooit ingericht): de schakelaar **verschijnt niet**, omdat die afhankelijk is van het startscript van de gateway. Werk de firmware bij naar 2.2.0 of later.

De paneelapp **bedient** de gateway; hij levert of installeert die niet, omdat het een eWeLink-binary is. Firmware 4.x voegt een Matter-bridge toe en kan Zigbee-apparaten via MQTT Discovery naar Home Assistant exporteren, als alternatieven voor de routerrol.

### Gatewaystatus en automatische begrenzing

Op een paneel met Zigbee rapporteert `sensor.<panel>_zigbee_gateway_health` de fabrikantstack onafhankelijk van de routerschakelaar. Een niet-geconfigureerde standaardgateway blijft dus zichtbaar zonder de paneelapp toestemming te geven die te stoppen.

Als de routerschakelaar expliciet is aangezet, geeft de paneelapp 15 minuten respijt voor opstarten en koppelen. Daarna controleert hij elke minuut op twee ontsporingssignaturen: een expliciet ongeldig of niet-aangesloten netwerk samen met meer dan 50% van één CPU-kern gedurende vijf opeenvolgende metingen, of minstens drie wijzigingen van het gatewayproces-ID binnen tien minuten. Een aangesloten router met aanhoudend hoog CPU-gebruik geeft alleen een waarschuwing en blijft draaien. Onbekende 4.x-indelingen of ontbrekend firmwarespecifiek aansluitbewijs vallen veilig terug op `unknown`.

De Zigbee-routerschakelaar aanzetten vraagt expliciet de rol Repeater, ook als de fabrikantgateway al draait. Inschakelen terwijl je ZHA- of Zigbee2MQTT-coördinator aansluiten toestaat werkt dus als een nieuwe aansluitpoging zonder een tweede gatewaysupervisor te starten.

Het tabblad Configureren toont een actie **Koppelen aanvragen** direct onder de Zigbee-routerschakelaar; de schakelaar blijft de enige aan/uit-bediening. Sta aansluiten toe in ZHA of Zigbee2MQTT, vraag dan aansluiting aan en bevestig dat aansluiten is toegestaan. De actie stelt de rol Repeater opnieuw in, start een nieuwe respijtperiode van 15 minuten en bevraagt de status; het paneel wordt niet herstart. De knop is onbeschikbaar als de router is uitgeschakeld, al is aangesloten of afkoelt na een recente aanvraag.

Na de respijtperiode geeft een ingeschakelde gateway die nog niet is aangesloten een blijvende waarschuwing op het dashboard en het tabblad Installeren, gekoppeld aan die configuratieactie. Laat die niet in die toestand: herhaalde aansluitpogingen kunnen veel CPU verbruiken. Sluit het paneel aan als router of zet de Zigbee-routerschakelaar uit.

Als een geconfigureerde oude gateway aan een ontsporingsregel voldoet, zet de paneelapp de routerschakelaar blijvend uit en probeert één begrensde indamming. Fabrikantspecifieke indamming kan alleen de Sonoff-guard, `zgateway` en de bijbehorende lokale broker treffen. Als een proces niet kan worden gestopt, wordt waar mogelijk de herstarter verwijderd en wordt overblijvend gatewaywerk verlaagd naar nice 19 en de Android-achtergrond-cpuset. De routerschakelaar later aanzetten start één nieuwe respijtperiode en poging.

De statusattributen bevatten firmware- en productversie, gateway-indeling en pakketversie, aansluit- en rolstatus, afgerond CPU-gebruik van gateway en guard, recent aantal herstarts en indammingsresultaat. Ze bevatten nooit de Zigbee-netwerksleutel, ruwe aanmeldgegevens voor de lokale broker, het MAC-adres van de radio of ruwe gateway-`netinfo`.

### Overstappen vanaf NSPanelTools

Als NSPanelTools de Sonoff-gateway op een ouder paneel heeft geïnstalleerd, blijft de hoststack in `/vendor` bestaan na het verwijderen van NSPanelTools. Verwijder NSPanelTools voordat je de scherm- en sensorbediening van Panel Assistant inschakelt om dubbele acties te voorkomen. Panel Assistant kan de bestaande gateway bedienen; als de Zigbee-routerschakelaar aan blijft, start het de gateway bij opstarten, ook als de vorige opstart-hook is verwijderd.

### Interne werking van de EZSP-hoststack

Op de oude native fabrikantstack (3.x en eerder) draait de radio **EZSP-NCP-firmware** (EFR32MG21, EZSP v8). `zgateway` is een EZSP-_hostbinary_ in `/vendor/bin/siliconlabs_host/`, in leven gehouden door zijn eigen supervisor `guard_process.sh` (een lus van 5 seconden, gestart bij opstarten) en bestuurd via een **lokale mosquitto-broker** op `127.0.0.1:1883`. De broker is anoniem: de regel `password_file` is uitgecommentarieerd in `mosquitto.conf`. De 4.x-stack verschilt zoals hierboven beschreven.

- Rolstatus: `zigbee/system/network-role/information` geeft `{"role":"Repeater"|"Coordinator"}` terug
- Rolwissel: publiceer `{"role":"Repeater"}` naar `zigbee/system/network-role/switch`

"Repeater" is routermodus, die een bestaande mesh uitbreidt; de rol blijft bewaard in het niet-vluchtige geheugen van de NCP. De fabrikant-`zgateway` overleeft het verwijderen van de eWeLink-_apps_, omdat die in `/vendor` staat en niet in een APK.

Zie voor een volledige zelfstandige Zigbee2MQTT- of ZHA-coördinator _op het paneel_ [seaky/nspanel_pro_zigbee](https://github.com/seaky/nspanel_pro_zigbee), dat de hoststack vervangt. Dit is zwaarder en is niet wat de paneelapp doet.

## Samenvatting van het toegangsmodel

- **Licht, nabijheid, versnellingsmeter:** rechtstreeks vanuit de app (`SensorManager`).
- **Schermhelderheid, slaapstand, navigatie, tekst-naar-spraak:** standaard-Android-paden (`su` voor echt uitschakelen van de achtergrondverlichting).
- **Led:** geen in kaart gebracht.
- **Zigbee:** EFR32-radio beheerd via de lokale broker van de gateway op het apparaat (`switch.<panel>_zigbee_router`).
- **Radio's:** Zigbee 3.0, Wi-Fi en Bluetooth.

## Verwachte prestaties

De NSPanel Pro heeft **beperkte CPU en RAM** voor uitgebreide dashboards:

- In rust draait hij op 408 MHz met ongeveer 500 MB RAM in gebruik; een zwaar dashboard belast beide sterk.
- **2 GB RAM is de beperkende factor.** De dashboard-WebView, Android en achtergrondapps concurreren erom. Grote dashboards met veel kaarten, grote afbeeldingen, lange geschiedenisgrafieken of zware aangepaste kaarten veroorzaken WebView-herladingen en haperingen.
- De A35-kernen maken paginaovergangen en animaties zichtbaar langzamer dan op A55- of A72-panelen.

Begin met de ingebouwde renderer met het automatische dashboardentiteitsfilter uit [Prestaties afstemmen](/nl/manage/performance/), zodat het paneel geen statussen verwerkt die zijn dashboard nooit toont. Gebruik daarna de prestatiekaarten op het tabblad Dashboard om resterende zware weergaven, geheugendruk of thermische beperkingen te vinden voordat je het dashboard vereenvoudigt.
