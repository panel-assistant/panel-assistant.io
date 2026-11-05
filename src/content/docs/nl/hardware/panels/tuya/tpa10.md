---
title: Tuya TPA10
description: Hardwaregegevens van de Tuya TPA10, een 10.1 inch Rockchip rk3566-paneel met een RGB-led, vijf knoppen, een camera en temperatuur-, vochtigheids- en nabijheidssensoren.
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Volledig
root: su aanwezig; helper voor led, klimaat, vijfde knop
webview: Chrome 83; vervanging door LineageOS 150 met root
released: '2023-08 (geschat)'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10, voorkant met de knoppenstrook aan de zijkant
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Tuya TPA10, recht van voren, met de knoppenstrook aan de zijkant en de rand van de omlijsting
photoCredit: 'Foto: Tuya'
sold_as:
  - brand: Tuya
    name: 'TPA10-M2'
    note: 'Naam in de Tuya-catalogus'
  - brand: Tuya
    name: 'Control Panel MAX'
    note: 'Naam in winkels en FCC-vermelding'
evidence: [bench, mostly-open, firmware, documented, owners]
sidebar:
  label: TPA10
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Er zijn geen firmware-releasenotities van de fabrikant voor dit paneel gevonden. De firmwaregegevens op deze pagina zijn waarnemingen aan het onderzochte apparaat.

Een ruim **10.1 in 1920×1200** rk3566-paneel met één RGB-led vooraan, monochrome knopverlichting, veel sensoren (time-of-flight-nabijheid, temperatuur en vochtigheid, omgevingslicht), een camera en vijf fysieke knoppen. Het heeft geen Zigbee, NFC of IR. Onderzocht via reverse-engineering op een werkend exemplaar (Android 11, geroot, `su` aanwezig).

<a id="also-sold-as"></a>

## Ook verkocht als

Tuya TPA10, TPA10, TPA10-M2 (M2A, M2E, M2U, M2X), TPA10 Control Panel MAX, Control Panel MAX, Panel MAX, rk3566 Tuya-paneel, SmartOS Xinch (fabrikantpakketten `com.smartos.xinch.setting`, `com.smartos.xinch.hardware`, `com.smartos.xinch.platform.ethernet`), `com.tuya.devicetest`.

:::tip
De belangrijkste gegevens: adb is **met een wachtwoord beveiligd**, dus gebruik de achterdeur via de USB-diagnoseapp. De led en sensoren die root vereisen hebben de **root-helperdaemon `hapaneld-helper`** nodig. Schrijven van `custom_animation` voor de voorste led kan **het paneel herstarten** (zie de waarschuwing hieronder). Werk **eerst de WebView bij**; zie [WebView: werk deze eerst bij](#webview-update-this-first).
:::

|             |                                                                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **rk3566**                                                                                                                                                                                             |
| Scherm      | **1920×1200** (16:10 liggend), ongeveer 10.1 in, **ongeveer 226 fysieke ppi**, 56 Hz. Android-logische basisdichtheid af fabriek **240 dpi** (vaak overschreven voor de dashboardgrootte; 212 wordt aanbevolen) |
| Android     | 11 (API 30)                                                                                                                                                                                                     |
| ABI         | armeabi-v7a (32-bits gebruikersruimte)                                                                                                                                                                          |
| Radio's     | Wi-Fi, Bluetooth en BLE, plus een fabrikantfunctie `com.smartos.xinch.platform.ethernet` (bekabeld, PoE). **Geen Zigbee, NFC, IR of mobiel netwerk.**                                                           |
| Root        | `su` beschikbaar; de led en sysfs-sensoren zijn `system:system`, dus een **root-helperdaemon is vereist** (zie hieronder).                                                                                      |
| Uitgebracht | Ongeveer augustus 2023 (geschat); FCC ID 2A789-TPA10, vermeld als "Control Panel MAX", werd rond 22 augustus 2023 toegekend ([FCC-toekenningsregistratie ID 2A789-TPA10](https://fccid.io/2A789-TPA10))         |

:::tip
Firmware wijzigen op een paneel zonder knoppen? Lees eerst [Firmwareback-up en -herstel](/nl/hardware/guides/firmware-backup-and-restore/). De TPA10 (rk3566, Android 11, 7.28 GB eMMC `mmcblk2`) heeft een geverifieerde softwarematig gestarte Loader-route via `adb reboot loader` en `rkdeveloptool`. De verzonken [gaatjesknop](#buttons) is geen Linux-invoer en zijn gedrag voor fabrieksreset of Maskrom is niet veilig bevestigd. Vertrouw er dus niet op als herstelroute.
:::

<a id="gaining-adb-and-root-access"></a>

## Adb- en roottoegang verkrijgen

De TPA10 wordt geleverd met **wachtwoordbeveiligde** adb en netwerk-adb uitgeschakeld. De betrouwbare route voor de eerste toegang is de achterdeur via de USB-diagnoseapp, zonder wachtwoordberekening. `su` is al aanwezig, dus zodra adb werkt heb je root. Samengevat uit [seaky/nspanel_pro_tools_apk issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123).

**Eerste route.** Er is geen geverifieerde manier om netwerk-ADB op TCP-poort 5555 in te schakelen zonder computer. Gebruik eerst USB volgens de onderstaande diagnoseapp-procedure; de latere rootopdrachten maken netwerk-ADB pas na die eerste verbinding blijvend.

**1. Ontwikkelaarsopties inschakelen.** Instellingen, _Over_, tik zeven keer op het build- of versienummer.

**2. Eerste toegang via de achterdeur van de USB-diagnoseapp (aanbevolen).** Ontwikkelaarsopties biedt een Tuya-**diagnoseapp** voor technici met uitsluitend een Chinese interface. Zolang die app open is, is adb via de **USB**-poort toegestaan _zonder_ wachtwoord en heeft de sessie al root. Sluit USB aan en voer uit:

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

Adb-root op de TPA10 is betrouwbaarder via de USB-poort dan via het netwerk.

**3. Adb blijvend maken (root, zonder wachtwoord, de betrouwbare route).** Met de diagnoseapp op de voorgrond heb je een adb-sessie met root (`su` is aanwezig en `adb root` werkt ook omdat dit een `userdebug`-build is). Gebruik die om adb blijvend te maken, zodat je de testapp of een wachtwoord nooit meer nodig hebt. Dit blijft werken na het sluiten van de diagnoseapp **en** een volledige herstart, geverifieerd op een werkend exemplaar. Stuur het script naar het paneel en voer het als root uit:

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

Het paneel moet op Wi-Fi zijn aangesloten voor de netwerkroute. Daarna werkt `adb connect <panel-ip>:5555` vanaf elke vooraf geautoriseerde machine, ook na herstarts en met de fabrikantapps gesloten. Wissen van `/data` of een fabrieksreset wist `adb_keys` en `adb_enabled`, dus voer het script daarna opnieuw uit.

:::caution
**Het wachtwoord bij "Enable ADB" in Ontwikkelaarsopties is geen bruikbare route; probeer het dus niet te berekenen.** Het communityrecept in [issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) is niet reproduceerbaar. Decompilatie van `checkDevPassword` in `com.smartos.xinch.setting` bevestigt de _vorm_: `base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))` en dan `takeLast(6)`, hoofdletterongevoelig (of `takeLast(ro.tuya.uuid,6)` als `deviceId` leeg is). Maar de gebruikte `deviceId` kon niet worden gekoppeld aan een leesbare identificator: `ro.serialno`, `android_id` en `ro.tuya.key` werden op een werkend exemplaar allemaal geweigerd. De logger van de app is **geen** logcat, dus de verwachte waarde kan ook niet op het apparaat worden gelezen. Het uitgewerkte voorbeeld in dat issue bevat ook een typefout (`11a` plus `xia` staat als `11xia`; het moet `11axia` zijn). Gebruik de rootmethode hierboven, die het wachtwoord overbodig maakt.
:::

:::danger
Schakel fabrikantpakketten `com.smartos.xinch.*` uitsluitend als **allerlaatste stap** uit, nadat je hebt bevestigd dat adb betrouwbaar werkt _en_ je een vervanging voor de hardwareknoppen hebt. De hardware- of instellingenapps uitschakelen voordat adb betrouwbaar is kan je buitensluiten. De externe navigatieacties van de paneelapp (Terug, Start) en zijn entiteiten voor knopverlichting en led vervangen de functies van de fabrikantapp.
:::

:::note
De apps van de fabrikant op het apparaat waren _geen_ bruikbare bron voor reverse-engineering. `com.tuya.devicetest` is geodext (geen dex in de APK) en `com.smartos.xinch.hardware` bevat de Tuya **AVS (Alexa) SDK** (`libLibSampleApp.so`, 17 MB) plus een lezer voor de knoppen (`libjnimain.so`). De gezaghebbende bron zijn de zelfdocumenterende sysfs-nodes van het apparaat zelf.
:::

<a id="webview-update-this-first"></a>

## WebView: werk deze eerst bij

De standaard-WebView is **Chrome 83**, veel te oud voor een actuele Home Assistant-frontend. Het dashboard blijft dus leeg of defect totdat je die vervangt. De aanbevolen build is **LineageOS System WebView 150** (`armeabi-v7a`), een actuele, onderhouden, ongewijzigde Chromium-engine. Geef die de voorkeur boven Cromite: Cromite wijzigt de autoplay-inhoudsinstelling van Chromium naar _blokkeren_, waardoor streams van Home Assistant-camerakaarten (WebRTC) niet starten zonder tik, terwijl LineageOS autoplay toestaat zodat camerastreams vanzelf starten.

De TPA10 heeft beperkte videodecoderruimte binnen WebView. Meerdere zichtbare 720p-WebRTC-kaarten kunnen frames verliezen of één stream op zijn eerste frame laten wachten, ook als één stream goed werkt. Gebruik dan substreams met lagere resolutie, minder gelijktijdige autoplay-kaarten of foto's die na een tik overschakelen naar livevideo.

Download vanaf de mirror (stabiele URL):

```
https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

### Waarom gewoon installeren niet werkt

De WebView heeft pakketnaam `com.android.webview` en moet dus de systeemprovider **vervangen**. Beide voor de hand liggende routes mislukken op dit Android 11-paneel:

- `adb install -r` wordt geweigerd met `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match`. Android staat alleen een update van `com.android.webview` toe met een APK die met **dezelfde sleutel** is ondertekend als de geïnstalleerde, en elke WebView-leverancier gebruikt een andere sleutel. Om dezelfde reden kan **gewoon sideloaden deze eerste vervanging niet uitvoeren**: dat installeert via `pm install`, wat het paneel blokkeert. De vervanging hieronder is een **eenmalige** handmatige stap. Zodra LineageOS is geïnstalleerd, kun je latere LineageOS-versies sideloaden met `adb install -r`, omdat ze dezelfde ondertekenaar hebben.
- De toelatingslijst van de ROM accepteert alleen `com.android.webview`, niet de variant `com.google.android.webview`. Een Google-build wordt dus geïnstalleerd maar nooit geselecteerd.

### Werkende methode met root: bestand vervangen en handtekeningvergrendeling wissen

Het paneel heeft een handtekeningvergrendeling maar root is mogelijk: de app kan geen `su` gebruiken, een shell wel (`adb shell su root <cmd>`). De methode plaatst de nieuwe APK in de _systeemlocatie_ voor WebView en verwijdert de vermelding uit de pakketdatabase. Daardoor registreert PackageManager die bij herstart **opnieuw**, met de eigen handtekening van de nieuwe APK en zonder conflict.

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

**Als iets misgaat**, herstel dan met de back-ups uit stap 1: kopieer `/data/local/tmp/webview.bak` terug over `/product/app/webview/webview.apk` en `/data/local/tmp/packages.xml.bak` terug over `/data/system/packages.xml` (met dezelfde `chown`, `chmod` en `restorecon`) en herstart daarna.

:::danger
**De gemelde WebView-versie is na deze methode onjuist; vertrouw er dus niet op.** `Instellingen, WebView` en `adb shell dumpsys webviewupdate` tonen nog **`83.0.4103.120`**, omdat een gesideloadete SystemWebView de **standaard-OEM-`versionName` en `versionCode` overneemt** om de minimumversiecontrole van het paneel te passeren en geselecteerd te worden. De _werkelijke_ engine is 150. Controleer dit via:

- **User-Agent:** open een pagina die je user-agent toont op het paneel; de UA bevat `Chrome/150.0.7871.63`.
- **De paneelapp:** de statuspagina van het paneel en `/diag`, via zijn gemelde HTTP-poort (standaard 8888), tonen `engine Chromium 150.0.7871.63`, omdat ze de UA lezen in plaats van de overgenomen pakketversie.

Gewoon sideloaden via adb werkt **niet** op dit paneel met handtekeningvergrendeling. Cromite 147 blijft als terugvaloptie op de mirror staan en gebruikt dezelfde procedure met een andere APK.
:::

## LED

### RGB-led: `avsux`-driver (root-helperdaemon)

De RGB-led vooraan is **één** led (`avsux_info` meldt `led type:[single] nums:[1]`) op de platformdriver `leds_pwm_avs` (apparaat `avsux`), beschikbaar via `/sys/class/leds/avs-pwm-led/`.

:::danger
Er is waargenomen dat schrijven van `custom_animation` naar `avsux_select` **het paneel herstart**. Gebruik `avsux_animation` voor kleur en behandel `avsux_select` en `custom_animation` als alleen-lezen, tenzij je tests uitvoert.
:::

Er is **geen vanuit de app toegankelijke `/dev`-node** voor de led (vergelijk `/dev/ledjni` van de [WF1589T](/nl/hardware/panels/electron/wf1589t/)). De sysfs-attributen zijn `system:system`, dus een `untrusted_app` kan ze niet schrijven. De paneelapp gebruikt daarom een kleine **root-helperdaemon** (`/system/bin/hapaneld-helper`, draait als root op een Unix-socket); `SocketLedController` is de client. Zie de [helperdocumentatie](https://github.com/panel-assistant/android/blob/main/helper/README.md).

#### Sysfs-attributen van `avs-pwm-led`

| Attribuut         | Machtigingen       | Gebruik                                                   |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | totaalniveau 0 tot 255                                    |
| `avsux_animation` | `system:system` rw | veilig kleur of animatie schrijven                        |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | noemt animaties (`bootanime`, `idle`)                     |
| `avsux_info`      | r                  | metadata (aantal en type leds)                            |

### Knopverlichting

`/sys/class/leds/button-backlight/brightness` is een **monochrome** PWM-uitgang, 0 tot 255 (standaarddriver `leds_pwm`, apparaat `pwmleds`). Deze is `system:system` 0664 en wordt dus via dezelfde daemon `hapaneld-helper` bediend.

<a id="sensors"></a>

## Sensoren

Nabijheid en omgevingslicht zijn rechtstreeks vanuit de app toegankelijk via `SensorManager`. Temperatuur en vochtigheid vereisen root (invoersubsysteem en I²C) en hebben de helperdaemon nodig.

:::tip
De CHT8305 maakt dit paneel bruikbaar als **sensor voor kamertemperatuur en luchtvochtigheid** voor Home Assistant. De helperdaemon leest deze uit met zijn opdracht `CHT8305`: een eenmalige uitlezing via `EVIOCGABS` van de invoeras `ABS_THROTTLE` van het stuurprogramma, waarbij de invoerapparaten `temperature` en `humidity` op naam worden herkend. De paneelapp biedt in Home Assistant de sensoren **Temperatuur in de ruimte** en **Luchtvochtigheid in de ruimte** aan. Rapportage is standaard ingeschakeld; de bedieningselementen staan onder Configureren, Sensoren, in de weergave Geavanceerd. De geavanceerde instelling **Correctie kamertemperatuur**, of `sensors.room_temp_offset_c` in het profiel, corrigeert voor de eigen warmte van het paneel.
:::

De time-of-flight-sensor van de TPA10 maakt nabijheid daadwerkelijk afstandsgebaseerd, maar de Android-HAL kwantiseert die. De begeleide nabijheidsconfiguratie op het paneel legt de vrije en nabije eindpunten en richting van de live sensor vast en slaat die op. Het paneel meldt vervolgens dezelfde genormaliseerde schaal als elk ondersteund paneel in plaats van een vaste apparaatspecifieke grens te gebruiken.

### Sensorchips en toegangspaden

| Sensor                     | Chip                                                                          | Toegang                                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Nabijheid (time of flight) | Vishay **VI5300** (i2c-3 `0x6c`, `proximity_vi5300`, 30 ms-polling)           | Android `SensorManager` `TYPE_PROXIMITY`, zonder root. De ruwe afstand in mm op de I²C-node van de driver (`…/i2c-3/3-006c`) vereist root. |
| Temperatuur en vochtigheid | **CHT8305** (`temperature_cht8305` op 3-0040, `humidity_cht8305` op 3-0040-1) | **Niet** in `SensorManager`; meldt via het **invoersubsysteem** op I²C, alleen met root.                                                   |
| Omgevingslicht             | **CG5256** (`light_cg5256`)                                                   | Android `SensorManager`-lichtsensor, zonder root.                                                                                          |

<a id="buttons"></a>

## Knoppen

De TPA10 heeft **drie klassen** fysieke knoppen, op het apparaat bevestigd met `getevent`:

- **De vier zijknoppen:** `adc-keys`, standaard-KeyEvents gekoppeld aan `F1` tot `F4`, vastgelegd door het toegankelijkheidstoetsfilter van de paneelapp zonder speciaal pad.
- **De vijfde (oranje) knop:** een `EV_SW`-_schakelaar_, geen toets, uitgelezen via de evdev-lezer van de root-helperdaemon en als gebeurtenis naar Home Assistant gestuurd.
- **De gaatjesknop** (verzonken, naast de USB-C-poort): geen Android-invoer en dus niet beschikbaar voor Home Assistant.

### Details per knop

**1. De vier zijknoppen zijn `adc-keys` en sturen standaard-KeyEvents.** Ze zitten op de rk3566-**SARADC** (`fe720000.saradc`), apparaat `adc-keys1` (`/dev/input/event7`), scancodes `59` tot `62`. De standaard-`Generic.kl` koppelt ze aan **`F1` tot `F4`**, die Android `KEYCODE_F1` tot `KEYCODE_F4` worden; de paneelapp legt ze vast via zijn toegankelijkheidstoetsfilter. Op een exemplaar met `su` kunnen ze opnieuw worden gekoppeld door `/system/usr/keylayout/Generic.kl` te bewerken (bijvoorbeeld naar `BRIGHTNESS_*` of `VOLUME_*`).

**2. De vijfde (oranje) knop is een schakelaar, geen toets.** Op `gpio-keys` (`/dev/input/event8`) meldt deze **`EV_SW` `SW_MUTE_DEVICE`** (schakelcode `14`), een _vergrendelende_ gebeurtenis, **geen** `EV_KEY`. Daarom is er geen keylayout-vermelding voor en ziet Android Toegankelijkheid deze nooit. De knop dempt de microfoons fysiek, onafhankelijk van toegankelijkheidstoetsgebeurtenissen. De paneelapp leest die via de evdev-lezer van de root-helperdaemon (`WATCH /dev/input/event8`, `sw=true`) en stuurt bij elke omschakeling een Home Assistant-gebeurtenis (`KEYCODE_MUTE`), van begin tot eind gevalideerd. Dit is **standaardgedrag**, bij het schrijven nergens anders gedocumenteerd.

**3. De gaatjesknop (verzonken, naast de USB-C-poort) is geen Android-invoer.** Deze ontbreekt in `getevent`, `gpio-keys` en `dmesg`, dus Home Assistant kan hem niet gebruiken. Zijn elektrische functie is niet veilig bevestigd. De plaatsing en het rk3566-platform suggereren een reset- of opstartmodusfunctie, maar er is geen geverifieerde indruktijd, fabrieksresetwerking of Maskrom-procedure. Druk of houd hem niet in vanuit de aanname dat dit een herstelbaar flashpad biedt. Gebruik de geverifieerde softwarematig gestarte Loader-route zolang Android nog opstart en volg de beperkingen in [Firmwareback-up en -herstel](/nl/hardware/guides/firmware-backup-and-restore/).

## Camera

GalaxyCore **GC05A2 / GC5035**, een 2592×1944-sensor. Android meldt één camera op hardwareniveau `LIMITED`, uitsluitend `BACKWARD_COMPATIBLE`, `Facing: Back`, zonder flitser en autofocus, via de provider `legacy/0` (`device@3.3`).

:::note
De eigen functievlaggen van de firmware zijn onjuist: het paneel declareert `android.hardware.camera.front` terwijl de HAL `Facing: Back` meldt. Ga af op het apparaatprofiel en wat `CameraManager` daadwerkelijk opsomt, nooit op `hasSystemFeature`.
:::

1280×720 is beschikbaar in alle drie formaten, `IMPLEMENTATION_DEFINED`, `YUV_420_888` en `BLOB`, dus zowel voorbeeld- als fotoformaten zijn beschikbaar. De HAL adverteert één frame vertraging voor een 720p-`BLOB`-opname bij 30 fps. Dat foto-opnamecijfer van de fabrikant meet niet de kosten van de H.264-stream van de paneelapp. `android.control.aeAvailableTargetFpsRanges` biedt alleen `[15 30]` en `[30 30]`: er is geen vaste 15 fps-sensormodus. Een 15 fps-stream ontstaat dus door de encoder te doseren, niet door de sensor.

De enige hardware-H.264-encoder is `OMX.rk.video_encoder.avc`, aangeboden door de OMX IL-HAL (dit paneel heeft een proces `media.codec` en geen Codec2-fabrikantdienst). Deze declareert `176x144` tot `1920x1088` met uitlijning `16x8`, een gerapporteerd bitratebereik van 1 bps tot 10 Mbps en vier gelijktijdige instanties. Er is **geen hardware-HEVC-encoder**; de enige HEVC-vermelding is de softwarematige `c2.android.hevc.encoder`, geleverd met `enabled="false"`.

:::caution
Behandel de cijfers in `media_codecs_performance.xml` van de fabrikant als standaardtekst, niet als metingen: de hardware- en software-AVC-encoders melden identieke `measured-frame-rate`-waarden bij zowel 720×480 als 1280×720, wat geen echte meting kan zijn. Ga uit van 720p totdat je op je eigen paneel anders hebt gemeten.
:::

Een paneel met camerakaarten is niet in rust. Op een gemeten dashboard had de paneelapp twee actieve instanties van `OMX.rk.video_decoder.avc`. Een encodeersessie concurreert dus met bestaand decodeerwerk op dezelfde Rockchip-VPU.

De paneelapp kan deze camera aanbieden als functie die **standaard uit** staat. De schakelaar **Camera** op de camerakaart in Configureren schakelt die in, met standaardwaarden voor **Resolutie**, **Framesnelheid** en **Bitsnelheid** (720p, 15 fps, 2000 kbps) en een **Belichting**-correctie. De app biedt een H.264-stream op `rtsp://<panel>:8554/live`, met kamergeluid waar microfoontoegang beschikbaar en toegestaan is. Home Assistant haalt foto's via de camera-entiteit van het paneel uit die stream. Wanneer de camera open is, toont het paneel een rode indicator die pagina-inhoud niet kan bedekken. Zie de [bedieningsreferentie](/nl/reference/api/) voor de camera-entiteit.

:::caution
Plaats geen Home Assistant-camerakaart voor **dit** paneel op het eigen dashboard van **dit** paneel. Het paneel zou zijn eigen codering in een lus decoderen op dezelfde video-engine, zonder voordeel.
:::

## Overige chips

Camera GalaxyCore **GC05A2 / GC5035**; audiocodec **ES7202** (een opname-ADC; spraak dichtbij het paneel en Assist zijn geverifieerd via Android-opname na het opheffen van dempen met de oranje hardwareknop; opname op afstand en prestaties met achtergrondmuziek zijn nog niet gekwalificeerd); Goodix-aanraakscherm; PMIC `rk808` en `rk860`.

## Samenvatting van het toegangsmodel

- **Led en knopverlichting:** alleen met root (`system:system` sysfs), via `hapaneld-helper`.
- **Nabijheid en omgevingslicht:** rechtstreeks vanuit de app (`SensorManager`).
- **Temperatuur, vochtigheid:** alleen met root (invoersubsysteem en I²C), via de helperdaemon.
- **Knoppen:** de vier zijknoppen zijn rechtstreeks toegankelijk voor de app (KeyEvents via Toegankelijkheid); de vijfde oranje knop is een `EV_SW`-schakelaar die de evdev-watch van `hapaneld-helper` leest; de gaatjesknop is geen invoer.
