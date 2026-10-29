---
title: Tuya TPA10
description: Datos de hardware del Tuya TPA10, un panel Rockchip rk3566 de 10,1 pulgadas con LED RGB, cinco botones, cámara y sensores de temperatura, humedad y proximidad.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Completo
root: su presente; auxiliar para LED, clima y quinto botón
webview: Chrome 83; sustitución con root por LineageOS 150
released: '2023-08 (estimado)'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10 de frente, con su fila lateral de botones
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Vista frontal plana del Tuya TPA10, con la fila lateral de botones y el borde del marco
photoCredit: 'Foto: Tuya'
sold_as:
  - brand: Tuya
    name: 'TPA10-M2'
    note: 'Nombre en el catálogo de Tuya'
  - brand: Tuya
    name: 'Control Panel MAX'
    note: 'Nombre comercial y del registro FCC'
evidence: [bench, mostly-open, firmware, documented, owners]
sidebar:
  label: TPA10
---

No se encontraron notas de versiones de firmware del fabricante para este panel. Los datos de firmware de esta página son observaciones del dispositivo inspeccionado.

Un amplio panel rk3566 de **10.1 in 1920×1200** con un único LED RGB frontal, retroiluminación monocroma de botones, numerosos sensores (proximidad por tiempo de vuelo, temperatura y humedad, luz ambiental), cámara y cinco botones físicos. No tiene Zigbee, NFC ni IR. Se investigó mediante ingeniería inversa en una unidad real (Android 11, con root, `su` presente).

## También se vende como

Tuya TPA10, TPA10, TPA10-M2 (M2A, M2E, M2U, M2X), TPA10 Control Panel MAX, Control Panel MAX, Panel MAX, panel Tuya rk3566, SmartOS Xinch (paquetes del fabricante `com.smartos.xinch.setting`, `com.smartos.xinch.hardware`, `com.smartos.xinch.platform.ethernet`), `com.tuya.devicetest`.

:::tip
Lo esencial: adb está **protegido con contraseña**, así que usa la vía de acceso USB de la app de diagnóstico. El LED y los sensores exclusivos de root necesitan el **daemon auxiliar root `hapaneld-helper`**. Escribir `custom_animation` en el LED frontal puede **reiniciar el panel** (consulta el aviso siguiente). Actualiza **WebView primero**; consulta [WebView: actualiza esto primero](#webview-actualiza-esto-primero).
:::

|             |                                                                                                                                                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **rk3566**                                                                                                                                                                                                                       |
| Pantalla    | **1920×1200** (16:10 horizontal), unos 10.1 in, **aproximadamente 226 ppi físicos**, 56 Hz. Densidad lógica base de fábrica de Android **240 dpi** (suele ajustarse para dimensionar el panel de control; se recomienda 212)              |
| Android     | 11 (API 30)                                                                                                                                                                                                                               |
| ABI         | armeabi-v7a (espacio de usuario de 32 bits)                                                                                                                                                                                               |
| Radios      | Wi-Fi, Bluetooth y BLE, además de una función del fabricante `com.smartos.xinch.platform.ethernet` (cableada, PoE). **Sin Zigbee, NFC, IR ni conexión móvil.**                                                                            |
| Root        | `su` disponible; el LED y los sensores sysfs son `system:system`, por lo que **necesitan un daemon auxiliar root** (más abajo).                                                                                                           |
| Lanzamiento | Aproximadamente agosto de 2023 (estimado); FCC ID 2A789-TPA10, registrado como «Control Panel MAX», recibió autorización alrededor del 22 de agosto de 2023 ([registro de autorización FCC ID 2A789-TPA10](https://fccid.io/2A789-TPA10)) |

:::tip
¿Vas a cambiar el firmware de un panel sin botones? Lee primero [Copia de seguridad y restauración del firmware](/es/hardware/guides/firmware-backup-and-restore/). El TPA10 (rk3566, Android 11, eMMC de 7.28 GB `mmcblk2`) tiene una vía Loader verificada que se inicia por software mediante `adb reboot loader` y `rkdeveloptool`. El [botón empotrado](#botones) no es una entrada de Linux y su comportamiento de restablecimiento de fábrica o Maskrom no se ha confirmado con seguridad; no dependas de él como vía de recuperación.
:::

<a id="gaining-adb-and-root-access"></a>

## Obtener acceso adb y root

El TPA10 viene con adb **protegido con contraseña** y adb de red desactivado. La vía fiable para el primer acceso es la entrada USB de la app de diagnóstico, sin cálculos de contraseñas. `su` ya está presente, así que, una vez conectado por adb, tienes root. Resumen de [seaky/nspanel_pro_tools_apk, incidencia 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123).

**Vía inicial.** No hay una forma verificada de activar ADB de red en el puerto TCP 5555 sin ordenador. Usa primero USB siguiendo el procedimiento de la app de diagnóstico; los comandos root posteriores solo hacen persistente ADB de red después de esa primera conexión.

**1. Activa Opciones para desarrolladores.** Ajustes, _Acerca de_, pulsa siete veces el número de compilación o versión.

**2. Primer acceso mediante la entrada USB de la app de diagnóstico (recomendado).** Opciones para desarrolladores expone una **app de diagnóstico** de ingeniería de Tuya con interfaz solo en chino. Mientras está abierta, se permite adb por el puerto **USB** _sin_ contraseña, y la sesión ya tiene root. Conecta USB y ejecuta:

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

El adb root del TPA10 es más fiable por USB que por red.

**3. Haz persistente adb (root, sin contraseña, la vía fiable).** Con la app de diagnóstico en primer plano tienes una sesión adb con root (`su` está presente y `adb root` también funciona porque es una compilación `userdebug`). Úsala para hacer persistente adb y no volver a necesitar la app de prueba ni contraseña. Esto sobrevive al cierre de la app de diagnóstico **y** a un reinicio completo, verificado en una unidad real. Transfiere y ejecuta como root:

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

El panel debe estar conectado a Wi-Fi para la vía de red. Desde entonces, `adb connect <panel-ip>:5555` funciona desde cualquier equipo previamente autorizado, incluso tras reinicios y con las apps del fabricante cerradas. Borrar `/data` o restablecer de fábrica elimina `adb_keys` y `adb_enabled`; ejecuta después el script de nuevo.

:::caution
**La contraseña «Enable ADB» de Opciones para desarrolladores no es una vía utilizable; no intentes calcularla.** La receta comunitaria de la [incidencia 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) no se reproduce. Descompilar `checkDevPassword` de `com.smartos.xinch.setting` confirma su _estructura_: `base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))` y después `takeLast(6)`, sin distinguir mayúsculas (o `takeLast(ro.tuya.uuid,6)` si `deviceId` está vacío). Pero no se pudo relacionar el `deviceId` utilizado con ningún identificador legible: `ro.serialno`, `android_id` y `ro.tuya.key` fueron rechazados en una unidad real. El registro de la app **no** es logcat, por lo que tampoco puede leerse el valor esperado en el dispositivo. El ejemplo de esa incidencia también tiene una errata (`11a` más `xia` escrito como `11xia`; debe ser `11axia`). Usa el método root anterior, que hace irrelevante la contraseña.
:::

:::danger
Desactiva los paquetes del fabricante `com.smartos.xinch.*` solo como **último paso**, tras confirmar que adb es fiable _y_ tienes sustitutos para los botones físicos. Desactivar las apps de hardware o ajustes antes de disponer de adb fiable puede dejarte sin acceso. Las acciones de navegación remota de la app del panel (Atrás, Inicio) y sus entidades de retroiluminación de botones y LED sustituyen las funciones de la app del fabricante.
:::

:::note
Las apps del fabricante en el dispositivo _no_ fueron una fuente útil de ingeniería inversa. `com.tuya.devicetest` está odexada (sin dex en el APK) y `com.smartos.xinch.hardware` incluye el **SDK AVS (Alexa)** de Tuya (`libLibSampleApp.so`, 17 MB) y un lector de teclas (`libjnimain.so`). La fuente de referencia son los propios nodos sysfs autodescriptivos del dispositivo.
:::

## WebView: actualiza esto primero

El WebView original es **Chrome 83**, demasiado antiguo para la interfaz actual de Home Assistant; el panel de control queda en blanco o falla hasta sustituirlo. La compilación recomendada es **LineageOS System WebView 150** (`armeabi-v7a`), un motor Chromium actual, mantenido y sin modificaciones. Es preferible a Cromite: Cromite modifica el ajuste de reproducción automática de Chromium para _bloquearla_, lo que impide iniciar sin pulsar las transmisiones de las tarjetas de cámara (WebRTC) de Home Assistant; LineageOS deja permitida la reproducción automática y las transmisiones comienzan solas.

El TPA10 tiene capacidad limitada de decodificación de vídeo dentro de WebView. Varias tarjetas WebRTC visibles a 720p pueden perder fotogramas o dejar una transmisión esperando su primer fotograma aunque una sola funcione bien. Si ocurre, usa subtransmisiones de menor resolución, menos tarjetas simultáneas con reproducción automática o instantáneas que cambien a vídeo en directo al pulsarlas.

Descárgalo del espejo (URL estable):

```
https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

### Por qué no funciona una instalación normal

WebView usa el paquete `com.android.webview`, por lo que debe **sustituir** al proveedor del sistema; las dos vías obvias fallan en este panel Android 11:

- `adb install -r` se rechaza con `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match`. Android solo permite actualizar `com.android.webview` con un APK firmado con la **misma clave** que el instalado, y cada proveedor de WebView utiliza otra. Por lo mismo, **una instalación lateral normal no puede hacer este primer cambio**: instala mediante `pm install`, que el panel bloquea. El cambio siguiente es un paso manual **único**. Una vez instalado LineageOS, se pueden instalar lateralmente versiones posteriores de LineageOS con `adb install -r` porque comparten firmante.
- La lista de permitidos de la ROM solo acepta `com.android.webview`, no la variante `com.google.android.webview`; una compilación de Google se instala pero nunca se selecciona.

### Método funcional con root: sustituir el archivo y quitar el bloqueo de firma

El panel está bloqueado por firma pero permite root: la app no puede usar `su`, pero una shell sí (`adb shell su root <cmd>`). El método coloca el APK nuevo en la ubicación de WebView del _sistema_ y elimina su entrada de la base de datos de paquetes; PackageManager lo registra **de nuevo** al reiniciar, leyendo la firma del nuevo APK sin conflictos.

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

**Si algo sale mal**, revierte usando las copias del paso 1: copia `/data/local/tmp/webview.bak` sobre `/product/app/webview/webview.apk` y `/data/local/tmp/packages.xml.bak` sobre `/data/system/packages.xml` (con los mismos `chown`, `chmod` y `restorecon`); después reinicia.

:::danger
**La versión de WebView indicada es incorrecta tras este método; no te fíes de ella.** Ajustes, WebView y `adb shell dumpsys webviewupdate` siguen mostrando **`83.0.4103.120`**, porque SystemWebView instalado lateralmente **copia los `versionName` y `versionCode` originales del fabricante** para superar el umbral de versión mínima del panel y ser seleccionado. El motor _real_ es 150. Compruébalo mediante:

- **User-Agent:** abre cualquier página que muestre el agente de usuario en el panel; el UA contiene `Chrome/150.0.7871.63`.
- **La app del panel:** su página de estado y `/diag`, en el puerto HTTP indicado (8888 de forma predeterminada), muestran `engine Chromium 150.0.7871.63` porque leen el UA, no la versión copiada del paquete.

La instalación lateral normal por adb **no** funciona en este panel bloqueado por firma. Cromite 147 sigue en el espejo como alternativa, con el mismo procedimiento y otro APK.
:::

## LED

### LED RGB: controlador `avsux` (daemon auxiliar root)

El LED RGB frontal es un **único** LED (`avsux_info` informa `led type:[single] nums:[1]`) del controlador de plataforma `leds_pwm_avs` (dispositivo `avsux`), expuesto en `/sys/class/leds/avs-pwm-led/`.

:::danger
Se ha observado que escribir `custom_animation` en `avsux_select` **reinicia el panel**. Usa `avsux_animation` para el color y trata `avsux_select` y `custom_animation` como solo lectura salvo durante pruebas.
:::

**No hay un nodo `/dev` accesible para la app** para el LED (compáralo con `/dev/ledjni` del [WF1589T](/es/hardware/panels/electron/wf1589t/)), y los atributos sysfs son `system:system`, por lo que un `untrusted_app` no puede escribirlos. La app usa un pequeño **daemon auxiliar root** (`/system/bin/hapaneld-helper`, ejecutado como root sobre un socket Unix); `SocketLedController` es el cliente. Consulta la [documentación del auxiliar](https://github.com/panel-assistant/android/blob/main/helper/README.md).

#### Atributos sysfs de `avs-pwm-led`

| Atributo          | Permisos           | Uso                                                       |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | nivel general de 0 a 255                                  |
| `avsux_animation` | `system:system` rw | escritura segura de color o animación                     |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | enumera animaciones con nombre (`bootanime`, `idle`)      |
| `avsux_info`      | r                  | metadatos (cantidad y tipo de LED)                        |

### Retroiluminación de botones

`/sys/class/leds/button-backlight/brightness` es una salida PWM **monocroma**, de 0 a 255 (controlador estándar `leds_pwm`, dispositivo `pwmleds`). Tiene permisos `system:system` 0664 y se controla mediante el mismo daemon `hapaneld-helper`.

## Sensores

La proximidad y la luz ambiental llegan directamente a la app mediante `SensorManager`. Temperatura y humedad son exclusivas de root (subsistema de entrada e I²C) y necesitan el daemon auxiliar.

:::tip
El CHT8305 convierte este panel en un **sensor de temperatura y humedad de la habitación** utilizable para Home Assistant. El daemon auxiliar lo lee mediante su verbo `CHT8305`, una lectura puntual `EVIOCGABS` del eje de entrada `ABS_THROTTLE` del controlador que busca por nombre los dispositivos de entrada `temperature` y `humidity`. La app ofrece después dos sensores opcionales en Home Assistant: **Temperatura de la habitación** y **Humedad de la habitación** (Configurar, Diagnóstico; desactivados de forma predeterminada). El ajuste avanzado **Corrección de temperatura ambiente**, o `sensors.room_temp_offset_c` del perfil, compensa el calor del propio panel.
:::

El sensor de tiempo de vuelo del TPA10 hace que la proximidad se base realmente en distancia, aunque la HAL de Android la cuantiza. La configuración guiada de proximidad en el panel captura y guarda los extremos despejado y cercano y la dirección del sensor activo; después el panel informa de la misma escala normalizada utilizada en todos los paneles compatibles, en lugar de depender de un umbral fijo específico del dispositivo.

### Chips de sensores y vías de acceso

| Sensor                       | Chip                                                                          | Acceso                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Proximidad (tiempo de vuelo) | Vishay **VI5300** (i2c-3 `0x6c`, `proximity_vi5300`, sondeo de 30 ms)         | Android `SensorManager` `TYPE_PROXIMITY`, sin root. La distancia bruta en mm del nodo I²C del controlador (`…/i2c-3/3-006c`) necesita root. |
| Temperatura y humedad        | **CHT8305** (`temperature_cht8305` en 3-0040, `humidity_cht8305` en 3-0040-1) | **No** están en `SensorManager`; informan mediante el **subsistema de entrada** sobre I²C, solo con root.                                   |
| Luz ambiental                | **CG5256** (`light_cg5256`)                                                   | Sensor de luz Android `SensorManager`, sin root.                                                                                            |

## Botones

El TPA10 tiene **tres clases** de botón físico, confirmadas en el dispositivo con `getevent`:

- **Los cuatro botones laterales:** `adc-keys`, KeyEvents estándar asignados a `F1` a `F4`, capturados por el filtro de teclas de accesibilidad de la app sin ninguna vía especial.
- **El quinto botón (naranja):** un _interruptor_ `EV_SW`, no una tecla, leído mediante el lector evdev del daemon auxiliar root y enviado a Home Assistant como evento.
- **El botón empotrado** (junto al puerto USB-C): no es una entrada de Android y no está disponible para Home Assistant.

### Detalle de cada botón

**1. Los cuatro botones laterales son `adc-keys` y envían KeyEvents estándar.** Están en el **SARADC** del rk3566 (`fe720000.saradc`), dispositivo `adc-keys1` (`/dev/input/event7`), códigos de exploración `59` a `62`. El `Generic.kl` original los asigna a **`F1` a `F4`**, que se convierten en `KEYCODE_F1` a `KEYCODE_F4` de Android; la app los captura mediante su filtro de teclas de accesibilidad. En una unidad con `su` se pueden reasignar editando `/system/usr/keylayout/Generic.kl` (por ejemplo a `BRIGHTNESS_*` o `VOLUME_*`).

**2. El quinto botón (naranja) es un interruptor, no una tecla.** En `gpio-keys` (`/dev/input/event8`) informa **`EV_SW` `SW_MUTE_DEVICE`** (código de interruptor `14`), un evento _enclavado_, **no** un `EV_KEY`. Por eso no tiene entrada keylayout y la accesibilidad de Android nunca lo ve. Silencia físicamente los micrófonos, independientemente de la entrega de teclas de accesibilidad. La app lo lee con el lector evdev del daemon auxiliar root (`WATCH /dev/input/event8`, `sw=true`) y envía un evento de Home Assistant (`KEYCODE_MUTE`) en cada cambio, validado de extremo a extremo. Es comportamiento **de fábrica**, no documentado en otras fuentes al escribir esto.

**3. El botón empotrado (junto al puerto USB-C) no es una entrada de Android.** No aparece en `getevent`, `gpio-keys` ni `dmesg`, así que Home Assistant no puede usarlo. Su función eléctrica no se ha confirmado con seguridad. Su posición y la plataforma rk3566 sugieren una función de restablecimiento o modo de arranque, pero no hay duración de pulsación, comportamiento de restablecimiento de fábrica ni procedimiento de entrada en Maskrom verificados. No lo pulses ni mantengas pulsado suponiendo que ofrece una vía recuperable de reinstalación de firmware. Usa la vía Loader verificada iniciada por software mientras Android aún arranque y respeta los límites de [Copia de seguridad y restauración del firmware](/es/hardware/guides/firmware-backup-and-restore/).

## Cámara

GalaxyCore **GC05A2 / GC5035**, sensor de 2592×1944. Android informa de una cámara con nivel de hardware `LIMITED`, solo `BACKWARD_COMPATIBLE`, `Facing: Back`, sin flash ni enfoque automático, mediante el proveedor `legacy/0` (`device@3.3`).

:::note
Los indicadores de funciones del propio firmware son incorrectos: el panel declara `android.hardware.camera.front` mientras la HAL informa `Facing: Back`. Decide según el perfil del dispositivo y lo que realmente enumera `CameraManager`, nunca según `hasSystemFeature`.
:::

1280×720 se ofrece en los tres formatos: `IMPLEMENTATION_DEFINED`, `YUV_420_888` y `BLOB`, por lo que hay formatos tanto de vista previa como de captura de imágenes fijas. La HAL anuncia una pausa de un fotograma para una captura `BLOB` a 720p y 30 fps. Esa cifra del fabricante para imágenes fijas no mide el coste de la transmisión H.264 de la app. `android.control.aeAvailableTargetFpsRanges` solo ofrece `[15 30]` y `[30 30]`: no hay modo del sensor fijo a 15 fps, así que una transmisión de 15 fps se obtiene regulando el codificador, no el sensor.

El único codificador H.264 de hardware es `OMX.rk.video_encoder.avc`, servido por la HAL OMX IL (este panel tiene un proceso `media.codec` y ningún servicio Codec2 del fabricante). Declara de `176x144` a `1920x1088` con alineación `16x8`, un intervalo de tasa de bits indicado de 1 bps a 10 Mbps y cuatro instancias simultáneas. **No hay codificador HEVC de hardware**; la única entrada HEVC es `c2.android.hevc.encoder` de software, distribuida con `enabled="false"`.

:::caution
Trata las cifras de `media_codecs_performance.xml` del fabricante como datos de plantilla, no mediciones: los codificadores AVC de hardware y software indican valores `measured-frame-rate` idénticos tanto a 720×480 como a 1280×720, lo que no puede ser una medición real. Asume 720p hasta medir otra cosa en tu propio panel.
:::

Un panel que muestra tarjetas de cámara no está inactivo. En un panel de control medido, la app mantenía dos instancias activas de `OMX.rk.video_decoder.avc`, por lo que una sesión de codificación compite con la decodificación existente en la misma VPU Rockchip.

La app puede ofrecer esta cámara como función **desactivada de forma predeterminada**. El interruptor **Cámara** de la tarjeta Cámara en Configurar la activa, con valores predeterminados de **Resolución**, **Frecuencia de fotogramas** y **Tasa de bits** (720p, 15 fps, 2000 kbps) y una compensación de **Exposición**. Sirve una transmisión H.264 en `rtsp://<panel>:8554/live`, con audio de la habitación cuando el acceso al micrófono está disponible y autorizado. Home Assistant obtiene imágenes fijas de esa transmisión mediante la entidad de cámara del panel. Siempre que la cámara está abierta, el panel muestra un indicador rojo que el contenido de la página no puede tapar. Consulta la [referencia de control](/es/reference/api/) para la entidad de cámara.

:::caution
No pongas una tarjeta de cámara de Home Assistant de **este** panel en el panel de control del **propio** panel. Decodificaría su propia codificación en bucle, en el mismo motor de vídeo y sin beneficio.
:::

## Otros componentes

Cámara GalaxyCore **GC05A2 / GC5035**; códec de audio **ES7202** (ADC de captura; se verificaron voz cerca del panel y Assist mediante captura Android después de quitar el silencio con el botón naranja; la captación a distancia y el rendimiento con música de fondo siguen sin cualificar); táctil Goodix; PMIC `rk808` y `rk860`.

## Resumen del modelo de acceso

- **LED y retroiluminación de botones:** solo root (sysfs `system:system`), mediante `hapaneld-helper`.
- **Proximidad y luz ambiental:** directamente a la app (`SensorManager`).
- **Temperatura y humedad:** solo root (subsistema de entrada e I²C), mediante el daemon auxiliar.
- **Botones:** los cuatro laterales llegan directamente a la app (KeyEvents mediante accesibilidad); el quinto naranja es un interruptor `EV_SW` leído mediante la vigilancia evdev de `hapaneld-helper`; el botón empotrado no es una entrada.
