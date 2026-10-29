---
title: Smatek S9E
description: Hardwaregegevens van de Smatek S9E, een 10,1-inch Rockchip RK3566-inbouwpaneel met twee netspanningsrelais, vier knoppen met ledverlichting, radarnabijheid, Zigbee, Ethernet en RS485.
vendor: Smatek
model: S9E
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Getest door de gemeenschap
root: Relais, knopleds, nabijheid (werkende app-su gemeld)
webview: Chromium 83 op 2024-07; 131 op 2025-12
released: 'niet vóór 2021 (schatting, RK3566-SoC)'
photos:
  - src: 'asset:hardware-smatek-s9e-front.jpg'
    alt: Smatek S9E, voor- en achterkant met relais- en aansluitbedrading
photoCredit: 'Foto: Smatek'
sold_as_note: 'Zigbee-versie (Tuya) met twee netspanningsrelais, AC 100-240 V'
sold_as:
  - brand: Smatek
    name: 'S9E-NZ'
    note: 'Android-versie zonder Zigbee-gateway: RS485, vier knoppen, AC 100-240 V'
  - brand: Smatek
    name: 'S9PE-NZ'
    note: 'Als de S9E-NZ, gevoed via Ethernet (PoE) of DC 9-24 V in plaats van netspanning'
evidence: [firmware, documented, platform, owners]
sidebar:
  label: S9E
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Voor de hier gedocumenteerde versies zijn geen firmwareversienotities van de leverancier gevonden. De versievergelijking hieronder komt uit onderzoek van de aangeleverde images, niet uit een leverancierschangelog.

:::note
Anders dan de volledig ondersteunde panelen is de S9E **niet** via reverse-engineering onderzocht op een beschikbaar exemplaar. Specificaties komen uit Smateks vermelding en bedieningspaden uit [seaky/nspanel_pro_tools_apk issue 98](https://github.com/seaky/nspanel_pro_tools_apk/issues/98), het Home Assistant-gemeenschapsonderwerp en melders. Een eigenaar heeft de relais en knopleds vanuit Home Assistant geschakeld op firmware 1.1.0 ([issue 93](https://github.com/panel-assistant/android/issues/93)); behandel andere details van bedieningspaden als onbevestigd totdat ze zijn gevalideerd.
:::

Een 10,1-inch **1920×1200** RK3566-inbouwpaneel, dezelfde SoC-familie als de TPA10, met **twee ingebouwde netspanningsrelais**, vier knoppen met ledverlichting, een radarnabijheidssensor en **Zigbee, Ethernet en RS485**.

## Eerste toegang voor foutopsporing

**Netwerk-ADB op TCP-poort 5555 zonder computer: niet vastgesteld.** Een eigenaar die Panel Assistant draait of een firmwarebuild die root biedt, bewijst niet hoe een nieuw paneel foutopsporing inschakelt.

**Ook de eerste USB-foutopsporingsprocedure is niet vastgesteld.** Vraag de leverancier om foutopsporingsinstructies voor jouw exacte firmware en bevestiging van een USB-datapoort. Als deze USB-foutopsporing biedt, gebruik dan het [USB-installatieprogramma](/nl/install/install-over-usb/); neem niet aan dat een laadpoort ADB biedt. Hier is geen geverifieerde fabrieksmenureeks beschikbaar.

Rootcontroles vereisen een al werkende ADB-verbinding. Roottoegang en eerste toegang voor foutopsporing zijn afzonderlijke vragen.

## Ook verkocht als

Smatek S9E, Smatek S9, S9E-NZ (zonder Zigbee-gateway), S9PE, S9PE-NZ (PoE-variant), `Build.MODEL` S9, `Build.DEVICE` rk3566_r, `ro.product.version` S9_Android_1.0.2 en S9_Android_1.1.0.

:::tip
De belangrijkste gegevens: het deelt het **RK3566**-platform van de TPA10, dus functies vanuit de app werken waarschijnlijk zonder S9E-specifieke code. De **relais schakelen netspanningsbelastingen** (root-sysfs, werkend gemeld door een eigenaar op 1.1.0). De knoppen geven KeyEvents **`F1` tot `F4`** af (rechtstreeks naar de app, zonder root). Controleer eerst WebView: firmware 2024-07 bevat **Chromium 83**.
:::

|               |                                                                                                                                                                                                                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC           | Rockchip **RK3566** (quad Cortex-A55), dezelfde SoC-familie als de TPA10                                                                                                                                                                                                                                                                  |
| RAM en opslag | **2 GB** RAM, **16 GB** eMMC                                                                                                                                                                                                                                                                                                              |
| Scherm        | **10,1 inch**, **1920×1200** multi-touch                                                                                                                                                                                                                                                                                                  |
| Android       | 11                                                                                                                                                                                                                                                                                                                                        |
| Verbindingen  | Wifi, Bluetooth, **Zigbee**, **RJ45 Ethernet**, **RS485** (er bestaat ook een PoE-variant, de **S9PE**)                                                                                                                                                                                                                                   |
| Sensoren      | nabijheids**radar**, omgevings**licht**, **temperatuur en luchtvochtigheid**                                                                                                                                                                                                                                                              |
| Invoer        | **4 fysieke knoppen** met afzonderlijke leds                                                                                                                                                                                                                                                                                              |
| Relais        | **2 ingebouwde netspanningsrelais**                                                                                                                                                                                                                                                                                                       |
| Root          | de leveranciersapp gebruikt `execRootCmd`, dus root is beschikbaar; sommige exemplaren worden geleverd met ontgrendelde ontwikkelaarsmodus. Een eigenaarsrapport toont dat `su` vanuit een gewone appsandbox bereikbaar is op 1.1.0; dat bepaalt of de paneel-app de sysfs-nodes rechtstreeks bedient of de roothelperdaemon nodig heeft. |
| Uitgebracht   | Niet met zekerheid gedateerd; de RK3566-SoC-familie kwam pas rond 2021 op de markt, de beste gevonden ondergrens voor dit paneel ([verslag over RK3566-datasheet, CNX Software, december 2020](https://www.cnx-software.com/2020/12/16/rockchip-rk3566-and-rk3568-datasheets-and-features-comparison/))                                   |

:::danger
De onderstaande bediening schrijft **als root naar sysfs** en de relais schakelen **netspanningsbelastingen**. De ondersteuning is geïmplementeerd vanuit de gemelde paden en een eigenaar meldt werkende relais en knopleds op 1.1.0; het `st_relay`-pad van 1.0.2 is **niet bevestigd**, dus valideer dit op je S9E voordat je erop vertrouwt.
:::

:::tip
Omdat de S9E het **RK3566**-platform van de TPA10 deelt, werken de bestaande functies vanuit de paneel-app waarschijnlijk zonder S9E-specifieke code en kunnen temperatuur, luchtvochtigheid en licht via `SensorManager` verschijnen. Op de oudere firmware is de meegeleverde **WebView zeer oud (Chromium 83)**, dus werk deze eerst bij: Magisk OpenWebView, de firmware van 2025-03-24 of een handmatig geïnstalleerde SystemWebView. De firmware van 2025-12 bevat al Chromium 131. Zie [De systeem-WebView bijwerken](/nl/hardware/guides/update-the-webview/).
:::

:::tip
De S9E heeft vier functieknoppen aan de voorkant maar geen gedocumenteerde herstelcombinatie van aan-uit- en volumeknoppen. De partitietabel, rootroute en herstelprocedure zijn niet op werkende hardware vastgelegd, dus pas de [firmwareback-upgids](/nl/hardware/guides/firmware-backup-and-restore/) voor TPA10 en WF1589T niet ongewijzigd toe.
:::

## Firmwareversies

Twee standaardimages zijn geanalyseerd. Het zijn blokgebaseerde OTA-`.zip`-bestanden in AOSP-formaat met dynamische partities: pak `.new.dat.br` uit met `brotli -d`, pak het superimage uit met `lpunpack` en doorzoek daarna `build.prop` en de init-`.rc`-bestanden met `strings`. Beide melden `Build.MODEL` **`S9`** en `Build.DEVICE` **`rk3566_r`**, Android 11; de buildcode van de leverancier staat in **`ro.product.version`**:

| Image                              | `ro.product.version` | Build                        | Relaisklasse          |
| ---------------------------------- | -------------------- | ---------------------------- | --------------------- |
| `S9_1920x1200_20240712_Android_US` | `S9_Android_1.0.2`   | `eng.*.20240712`             | `/sys/class/st_relay` |
| `S9_1920x1200_20251202_Android_US` | `S9_Android_1.1.0`   | `eng.xiaolp.20251202.160404` | `/sys/class/strelay`  |

:::caution
**De sysfs-relaisklasse is tussen firmwareversies hernoemd.** Alleen het **eerste** image (1.0.2) gebruikt `/sys/class/st_relay`; **alle nieuwere** images (1.1.0 en later) gebruiken `/sys/class/strelay`, bevestigd door [een melder](https://github.com/panel-assistant/android/issues/3) en overeenkomend met het firmwareverschil. De paneel-app controleert beide klassenamen en gebruikt wat het paneel aanbiedt; zie [Relais](#relais-strelay-of-st_relay-klasse-root).
:::

Beide images zijn door de melder gedeeld vanuit Smatek: `S9_1920x1200_20240712_Android_US` (**1.0.2**) en `S9_1920x1200_20251202_Android_US` (**1.1.0**). De oorspronkelijke Smatek-downloadlinks op `docs.smatek.store:10001` zijn niet meer bereikbaar; vraag Smatek-ondersteuning of de melder om een kopie.

Vergelijking van de twee images toont dat **alleen `ro.product.version` en de relaisklasse verschillen.** Elk ander hieronder gedocumenteerd bedieningspad (knopkeycodes, GPIO's van knopleds, nabijheids-GPIO, sensorbedrading) is op beide identiek, dus detectie op `ro.product.version` beginnend met `S9` dekt de hele reeks.

## Relais: `strelay` of `st_relay` klasse (root)

De paneel-app biedt de twee netspanningsrelais aan als `switch.<panel>_relay1` en `switch.<panel>_relay2`, alleen op een paneel dat de sysfs-relaisklasse heeft.

:::note
**De klassenaam hangt af van de firmware** (zie [Firmwareversies](#firmwareversies)): `st_relay` op het eerste 1.0.2-image, `strelay` op 1.1.0 en later. De paneel-app controleert **beide** namen en gebruikt wat het paneel aanbiedt.
:::

```bash
# firmware 1.1.0+ (most panels in the field)
echo 1 > /sys/class/strelay/relay1    # on
echo 0 > /sys/class/strelay/relay1    # off
echo 1 > /sys/class/strelay/relay2

# firmware 1.0.2 (initial release)
echo 1 > /sys/class/st_relay/relay1
```

## Knoppen: KeyEvents `F1` tot `F4` (rechtstreeks naar de app)

De vier knoppen geven standaard-Android-keycodes **131 tot 134**, `KEYCODE_F1` tot `KEYCODE_F4`, af. De toegankelijkheidsopvang van de paneel-app meldt deze aan `event.<panel>_button` (gebeurtenistypen `KEYCODE_F1` tot `KEYCODE_F4`); koppel er dashboardacties aan in Home Assistant. De gebeurtenissen vereisen geen root.

## Led: GPIO-achtergrondverlichting per knop

Elke knop heeft een led op `/sys/class/gpio/gpio<16+keycode>/value`, dus GPIO **147 tot 150** voor knoppen F1 tot F4. Elke led is aan of uit en monochroom. De paneel-app biedt ze aan als `light.<panel>_button_led1` tot `light.<panel>_button_led4` (geschakeld via `su`), geteld vanaf `hardware.button_led_gpio_base` van het profiel. De leds staan **niet** onder `/sys/class/leds`, dat op de S9E alleen de SD-kaartled `mmc2::` bevat; het zijn ruwe GPIO's.

:::note
**Firmwareanalyse:** de init-scripts exporteren **alleen `gpio113`**. De knopledpinnen **gpio147 tot gpio150 worden niet bij het opstarten geëxporteerd**, dus de nodes `/sys/class/gpio/gpioNNN/value` bestaan pas na export. De paneel-app exporteert elke pin op verzoek en stelt deze vóór de eerste schrijfopdracht als uitgang in. Daarom werken de leds hoewel ze niet bij het opstarten worden geëxporteerd.
:::

```bash
echo 147 > /sys/class/gpio/export        # one-time, if the node is absent
echo 1 > /sys/class/gpio/gpio147/value   # button F1 LED on
```

:::tip
De firmware bevat ook een **RGB-statusled** (`led_r`, `led_g`, `led_b`), een **trilmotor** en **Ethernet-activiteitsleds**. De paneel-app biedt geen daarvan aan.
:::

## Sensoren: nabijheid komt van GPIO 18, niet van `SensorManager`

:::caution
Een nabijheidssensor is _geregistreerd_ in `SensorManager` en adverteert `Proximity=yes · Binary · 0/1 cm`, maar op de S9E **levert deze nooit gebeurtenissen**. Livelezingen van een melder in [een vervolgrapport](https://github.com/panel-assistant/android/issues/5) stelden vast dat het Android-pad stil blijft. De lichtsensor op hetzelfde paneel werkt (ongeveer 46 lx), dus het probleem is specifiek voor nabijheid; het echte signaal wordt uit `gpio18` gelezen.
:::

Het echte signaal is een **root-GPIO-lezing op GPIO 18**. De kernel registreert een spook-Android-sensor die nooit reageert, dus de waarde moet uit sysfs worden gelezen:

```bash
cat /sys/class/gpio/gpio18/value   # 1 = near, 0 = far  (no export needed — reporter-confirmed)
```

Het S9E-profiel vermeldt daarom `sensors.proximity_gpio: 18` in plaats van de dode `SensorManager`-bron te gebruiken. De roothelper houdt de waardedescriptor open en streamt veranderingen direct waar de kernel GPIO-flanken ondersteunt; anders controleert deze dezelfde descriptor tweemaal per seconde. Verlies van de descriptor wordt expliciet gemeld, zodat Home Assistant de sensor als niet beschikbaar toont totdat de herstelde helperstream de actuele waarde levert. Het signaal gebruikt dezelfde begeleide instelling en opgeslagen kalibratie als Android-sensoren; gekalibreerde aanwezigheids- en gebarenuitvoer komen beschikbaar nadat het instellen is geslaagd. Een melder bevestigde dat gpio18 **0 veraf, 1 dichtbij** leest en de begeleide instelling meet de eindpunten in plaats van te vertrouwen op gegokte polariteit. Omgevingslicht, temperatuur en luchtvochtigheid verschijnen zoals verwacht via `SensorManager`.

## Samenvatting van het toegangsmodel

- **Relais:** `switch.<panel>_relay1` en `switch.<panel>_relay2` via de sysfs-relaisklasse (root); zowel `strelay` als `st_relay` worden gecontroleerd.
- **Knoppen:** `event.<panel>_button` (`KEYCODE_F1` tot `KEYCODE_F4`), rechtstreeks naar de app via toegankelijkheid.
- **Knopleds:** `light.<panel>_button_led1` tot `light.<panel>_button_led4` via `su` (GPIO 147 tot 150, op verzoek geëxporteerd).
- **Nabijheid:** een gekalibreerde `binary_sensor.<panel>_proximity` en een genormaliseerde `sensor.<panel>_proximity_level` uit de opengehouden `gpio18`-gebeurtenisstream van de roothelper. De `SensorManager`-nabijheidssensor registreert zich maar reageert nooit en wordt daarom omzeild.
- **Licht:** `sensor.<panel>_illuminance` via `SensorManager`, dat **werkt**.

## Bronnen

- [Het Smatek S9E-rapport op GitHub](https://github.com/panel-assistant/android/issues/3): de `/diag` van de melder (detectieteksten, `SensorManager`-nabijheid), de hernoeming van de relaisklasse van `st_relay` naar `strelay` en de twee firmwareimages.
- Smatek S9E-standaardfirmware gedeeld door die melder: 1.0.2 (20240712) en 1.1.0 (20251202), de twee geanalyseerde images. De oorspronkelijke Smatek-downloadlinks (`docs.smatek.store:10001`) zijn niet meer bereikbaar.
- [seaky/nspanel_pro_tools_apk issue 98, "Add Smatek S9E Support"](https://github.com/seaky/nspanel_pro_tools_apk/issues/98): de bedieningspaden voor relais (`st_relay`), knoppen (keycodes 131 tot 134), knopleds (GPIO 147 tot 150) en nabijheid (GPIO 18).
- [Home Assistant-gemeenschap: "Smatek S9E Touch Panel"](https://community.home-assistant.io/t/smatek-s9e-touch-panel/828244): WebView-update, GPIO 18-nabijheidsscripts, integratienotities.
- [Smatek S9E-productpagina](https://smatek.com/product/10-1-inch-smart-control-panel-s9e/) en [S9PE-NZ PoE-variant](https://smatek.com/product/10-1-inch-android-panel-s9e-nz/): SoC, RAM en opslag, scherm, sensoren, verbindingen.
- [Smatek S9E-specificatieblad (PDF)](https://smatek.com/wp-content/uploads/2025/03/Smatek-S9E-10-Super-Smart-Control-Panelin-wall-SPEC.pdf): een scan met alleen afbeeldingen waaruit geen tekst kan worden gehaald, maar wel het brondatablad.
