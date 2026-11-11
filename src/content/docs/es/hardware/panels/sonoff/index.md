---
title: Sonoff NSPanel Pro
description: Datos de hardware de los Sonoff NSPanel Pro 86P y 120P originales, paneles Rockchip PX30 con radio Zigbee integrada.
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
vendor: Sonoff
panelIndex: true
sidebar:
  label: Resumen
  order: 0
---

La gama NSPanel Pro original incluye dos paneles físicamente diferentes, el **[86P](/es/hardware/panels/sonoff/nspanel-pro-86p/)** y el **[120P](/es/hardware/panels/sonoff/nspanel-pro-120p/)**, denominados por las cajas de pared europeas de 86 mm y 120 mm. Ambos incorporan un **coordinador Zigbee 3.0**, carecen de NFC e IR y tienen la CPU menos potente de los paneles plenamente compatibles. Comparten casi todo lo documentado aquí (root, WebView, LED, sensores, pasarela Zigbee); la página de cada variante contiene solo sus especificaciones propias y los pocos datos diferentes. Esta página se investigó principalmente mediante ingeniería inversa en un **86P** real (Android 8.1, con root, `su` de toolbox), con verificación independiente en un 120P real donde se indica.

## También se vende como

Sonoff NSPanel Pro 86, NSPanel Pro 120, NSPanel Pro 86P, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, px30_evb, SN_3326S, SN-RKPX30-NSP-01, nspanel-pro, nspanel-pro-ver120. No debe confundirse con NSPanel Pro Gen2 ni las placas Tuya S6E y T6E, que son hardware diferente.

:::tip
Lo esencial: el panel viene con **`userdebug` y sin contraseña adb**, por lo que `adb root` funciona directamente. El **LED no está caracterizado** (no se ha encontrado ningún nodo RGB controlable). Luz y proximidad llegan **directamente a la app**. La **radio Zigbee EFR32** integrada se gestiona mediante un broker local, sin reinstalar su firmware. La instalación y las actualizaciones de la app del panel iniciadas desde Home Assistant pueden instalar el WebView verificado; consulta [WebView: actualiza esto primero](#webview-actualiza-esto-primero).
:::

|                |                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| SoC            | Rockchip **PX30 / rk3326**                                                                                                             |
| CPU            | 4× **Cortex-A35** hasta **1.512 GHz** (408 MHz en reposo)                                                                              |
| GPU            | **Mali-G31** (confirmada en el dispositivo)                                                                                            |
| Pantalla       | **480×480 cuadrada** (1:1), unas 4 in, 160 dpi (mdpi, adecuado para unos 170 ppi físicos), 60 Hz, lienzo de **480×480 dp**             |
| RAM            | **2 GB** (unos 1960 MB utilizables)                                                                                                    |
| Almacenamiento | eMMC; `/data` de unos 3.5 GB                                                                                                           |
| Android        | 8.1 (API 27)                                                                                                                           |
| ABI            | arm64-v8a                                                                                                                              |
| Radios         | **Zigbee 3.0** (coordinador Silicon Labs EFR32 en UART `ttyS5`, más abajo), Wi-Fi, Bluetooth. Sin NFC, IR, Ethernet ni conexión móvil. |

:::note
El Cortex-A35 es un núcleo eficiente con rendimiento por ciclo notablemente inferior al A55 (TPA10) o A72 (WF1589T). Con 2 GB de RAM, el NSPanel Pro ofrece el **rendimiento de entrada** entre los paneles plenamente compatibles; consulta la [comparación de rendimiento](/es/hardware/#performance-comparison).
:::

:::tip
¿Vas a cambiar el firmware de un panel sin botones? Lee primero [Copia de seguridad y restauración del firmware](/es/hardware/guides/firmware-backup-and-restore/). El NSPanel Pro utiliza [las herramientas de seaky específicas del modelo](/es/hardware/guides/firmware-backup-and-restore/#per-panel-notes) en lugar de `rkdeveloptool`.
:::

## Variantes: 86P y 120P

La tabla anterior y la mayor parte de esta página se obtuvieron en un **86P**; el **120P** tiene otra placa. Consulta las páginas [86P](/es/hardware/panels/sonoff/nspanel-pro-86p/) y [120P](/es/hardware/panels/sonoff/nspanel-pro-120p/) para ver sus especificaciones y foto propias.

|                        | NSPanel Pro **86P**                                                                                                                                                    | NSPanel Pro **120P**                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| SoC                    | Rockchip **PX30**                                                                                                                                                      | Rockchip **RK3326-S** (misma familia PX30/RK3326; `ro.board.platform=rk3326`, árbol de dispositivos `rockchip,px30`)             |
| Pantalla               | **480×480** cuadrada, unos 160 dpi, solo vertical                                                                                                                      | **750×1334** vertical, **240 dpi** (ajuste 250); horizontal disponible; aproximadamente 1 cm más estrecho y más largo que el 86P |
| IDs de compilación     | Ambos informan `ro.product.model/device/name = px30_evb`, nombre compartido de placa Rockchip que _no_ distingue fiablemente las variantes                             | Igual que el 86P                                                                                                                 |
| `ro.product.version`   | Formato `NSPanel86P_x.y.z` o `s6_android_x.y.z`                                                                                                                        | `NSPanel120P_x.y.z` (canal OTA `nspanel-pro-ver120`, ROM completa `SN_3326S_750X1334_…`)                                         |
| Formato OTA            | ROM completa hasta **4.0.12**; versiones indexadas posteriores son diferencias o actualizaciones solo de app (consulta [firmware](/es/hardware/firmware/nspanel-pro/)) | Igual que el 86P                                                                                                                 |
| Firmware de proximidad | **4.0.12 recuperó lecturas graduadas**                                                                                                                                 | Siguió **binario** en 4.x (los kernels difieren por modelo; consulta [Sensores](#sensors-light-and-proximity-are-app-direct))    |

Ambos comparten radio Zigbee EFR32, Android 8.1 (AOSP), arm64-v8a y los procedimientos root y recuperación siguientes. Verificado en un 120P real (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, densidad 240, `ro.board.platform=rk3326`.

:::note
Esta página no recomienda una versión de firmware en su prosa; el [índice de firmware](/es/hardware/firmware/) generado es la referencia. El procedimiento de instalación está verificado en hardware hasta **4.4.0**. Las versiones indexadas posteriores solo se verificaron contra la CDN, nunca se instalaron en hardware real. A fecha de 2026-08-14, el [registro público de Sonoff](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq) documenta hasta **4.6.0**; 4.6.2 y 4.8.0 solo se localizaron sondeando la CDN, y 4.7.0 solo se comenta en un [hilo de comentarios de usuarios de eWeLink](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789), una conversación, no un anuncio de lanzamiento. **4.5.3** es una diferencia de ROM en el 120P pero una actualización solo de app en el 86P; **4.6.2** es solo de app sin diferencia de ROM en ningún canal, por lo que una actualización no siempre es un único salto. No figurar en el índice significa que no se encontró la compilación sondeando; no se puede enumerar la CDN, así que la ausencia nunca demuestra que no exista.

**La comunidad informa de bucles de reinicio en 4.5.1 y 4.5.2**, con intervalos de unos 10 a 60 minutos en ambos modelos. Para 4.7.0, el hilo contiene problemas de conexión de subdispositivos tras actualizar, algunos resueltos reiniciando y otros persistentes. No se han reproducido ni cuantificado: trátalos como informes de usuarios sin verificar, no como una regresión conocida. Verifica cualquier versión nueva en un panel antes de extenderla a varios; **4.0.12** sigue siendo el punto conservador de ROM completa para fijar.
:::

<a id="firmware-quirks-by-version"></a>

### Particularidades del firmware por versión

Comportamientos que cambian entre versiones de firmware eWeLink, de más antigua a más nueva. `ro.product.version` es el ID **interno** (`NSPanel86P_x.y.z` o `s6_android_x.y.z` en el 86P, `NSPanel120P_x.y.z` en el 120P), _no_ el número comercial u OTA que muestra eWeLink (4.0.12, 4.5.x). La detección y cualquier lógica por versión deben leer `ro.product.version`, no el texto comercial.

| Firmware                                 | Particularidad o comportamiento                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Qué hacer                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Antiguo (anterior a 1.3.2)**           | Sin interruptor adb en la app; opciones para desarrolladores inaccesibles desde la interfaz                                                                                                                                                                                                                                                                                                                                                                                             | Activa adb mediante el **puerto OTG** interno (abre la carcasa); consulta [Obtener acceso adb y root](#gaining-adb-and-root-access).                                                                                                                                                                                                                                 |
| **1.3.2 y posteriores**                  | La activación adb pasó a eWeLink                                                                                                                                                                                                                                                                                                                                                                                                                                                        | eWeLink, _Ajustes del dispositivo_, pulsa **ID del dispositivo** ocho veces, modo desarrollador, adb.                                                                                                                                                                                                                                                                |
| **1.4 y posteriores**                    | Modo desarrollador **eliminado** de la interfaz                                                                                                                                                                                                                                                                                                                                                                                                                                         | Activa adb mediante **cinco ciclos de alimentación** durante la animación de arranque Sonoff; consulta [Obtener acceso adb y root](#gaining-adb-and-root-access).                                                                                                                                                                                                    |
| **3.5.1 (86P, verificado)**              | WebView de fábrica **Chromium 107.0.5304.105**, demasiado antiguo para un panel de control moderno de Home Assistant; otros firmwares pueden variar                                                                                                                                                                                                                                                                                                                                     | Usa la actualización gestionada de WebView o la alternativa manual adb; consulta [WebView: actualiza esto primero](#webview-actualiza-esto-primero). El aviso de estado de la app también señala versiones inferiores a Chromium 110.                                                                                                                                |
| **3.7.1 (120P, real)**                   | Compilación de referencia inicial                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `wm size` 750×1334, densidad 240, `ro.board.platform=rk3326`.                                                                                                                                                                                                                                                                                                        |
| **4.0.0** (distribuida desde 2025-09-19) | Incluye la tienda F-Droid; interfaz notablemente más rápida                                                                                                                                                                                                                                                                                                                                                                                                                             | Confirma que las versiones **APP** _y_ **OS** son 4.0.0 o posteriores.                                                                                                                                                                                                                                                                                               |
| **4.0.12**                               | Recupera lecturas graduadas de proximidad en el **86P**; el **120P sigue binario** (kernels diferentes por modelo)                                                                                                                                                                                                                                                                                                                                                                      | Versión estable conservadora para fijar. La forma de entrada depende de modelo y firmware; la configuración guiada de proximidad calibra y normaliza ambas; consulta [Sensores](#sensors-light-and-proximity-are-app-direct).                                                                                                                                        |
| **4.5.1 y 4.5.2**                        | **Numerosos informes comunitarios de bucles de reinicio** (unos 10 a 60 minutos, ambos modelos); 4.5.2 es una capa solo de app sobre 4.5.1                                                                                                                                                                                                                                                                                                                                              | Sustituidas por versiones posteriores. Fija **4.0.12** para máxima estabilidad o prueba una versión nueva primero en un panel.                                                                                                                                                                                                                                       |
| **4.5.3**                                | Descubrimiento automático Matter y optimizaciones de gestión de pantalla; diferencia de ROM en 120P, solo app en 86P                                                                                                                                                                                                                                                                                                                                                                    | Sin pruebas de bucles de reinicio específicas de 4.5.3; sustituida por versiones posteriores.                                                                                                                                                                                                                                                                        |
| **4.6.0** (junio de 2026)                | **Portal web local** (`nspanelpro.local`: configuración LAN, exportación MQTT Discovery a Home Assistant, Matter Bridge); la inspección de CDN encontró diferencias desde 4.0.12, 4.4.0 y 4.5.1                                                                                                                                                                                                                                                                                         | Documentada en el registro público de Sonoff. **4.6.2** figura como actualización solo de app sin diferencia de ROM en ningún canal; no se ha encontrado 4.6.1.                                                                                                                                                                                                      |
| **4.7.0** (julio de 2026)                | Comentada en un hilo de usuarios eWeLink pero **ausente del registro público de Sonoff**; cubre Gen1 y Gen2; usuarios informan de compatibilidad añadida con el relé Basic gen-5 (BASIC-1GS); la inspección de CDN encontró diferencias de entrada desde 4.0.12, 4.4.0, 4.5.1 y 4.6.0 en ambos modelos, más 4.5.3 solo en 120P                                                                                                                                                          | Informes comunitarios de problemas de conexión de subdispositivos, algunos resueltos reiniciando y otros persistentes; sin verificar. Verifica en un panel antes de extenderla.                                                                                                                                                                                      |
| **4.8.0** (agosto de 2026)               | **Sin anuncio ni registro de cambios encontrado**; localizada sondeando CDN. Una publicación de personal eWeLink de 2026-07-16 en el [hilo de hoja de ruta](https://forum.ewelink.cc/t/nspanel-pro-roadmap-and-co-created-future/206240) la programaba para agosto y confirmaba una función: actualizar automáticamente el panel desde eWeLink. La inspección de CDN encontró diferencias de entrada desde 4.0.12, 4.4.0, 4.5.1, 4.6.0 y 4.7.0 en ambos modelos, más 4.5.3 solo en 120P | El resto del contenido es desconocido y no se encontró hilo de comentarios, así que no hay informes de estabilidad en ningún sentido. Trátala como no evaluada, no como libre de problemas. **Si la opción de actualización automática viene activada, el panel podría actualizar su firmware sin supervisión**; compruébala antes de confiar en una versión fijada. |

:::note
Estas particularidades corresponden a los 86P y 120P originales. NSPanel Pro **Gen2** (RK3326-**S**, dos relés, EFR32**MG24**) es otro objetivo de hardware. Sonoff distribuye Gen1 y Gen2 en la misma línea de versiones (4.7.0 cubre ambos); no deduzcas otra línea ni supongas que todas las notas del original se aplican. El perfil del NSPanel Pro original coincide con cualquier panel que informe una placa PX30 o RK3326, por lo que también coincide con un Gen2 que lo haga hasta disponer de perfil propio; ese perfil no se ha probado en Gen2 y no expone sus relés.
:::

Las placas emparentadas de la familia Tuya **S6E** y **T6E** (variantes con relés; S6E es un T6E con dos relés), [**Smatek S9E**](/es/hardware/panels/smatek/s9e/) y [**Tuya TPA10**](/es/hardware/panels/tuya/tpa10/) (RK3566, Cortex-A55, Android 11) son objetivos distintos y no ejecutan firmware NSPanel Pro.

:::danger
La detección no puede depender de `ro.product.model`: ambas variantes informan `px30_evb`. Usa `ro.product.version`, métricas de pantalla o `ro.board.platform` para distinguir 86P y 120P. La proximidad también difiere entre modelos y firmwares; la configuración guiada calibra las lecturas actuales y guarda el resultado en lugar de elegir un clasificador específico de firmware.
:::

<a id="gaining-adb-and-root-access"></a>

## Obtener acceso adb y root

A diferencia del TPA10, NSPanel Pro **no tiene contraseña adb**. Viene como compilación `userdebug` con claves de prueba (`ro.debuggable=1`), así que `adb root` funciona y se puede volver a montar `/system`. Lo difícil es _acceder_ a Opciones para desarrolladores, que eWeLink oculta de distintas formas según versión. Resumen de las guías de blakadder ([instalación lateral](https://blakadder.com/nspanel-pro-sideload/), [secretos](https://blakadder.com/nspanel-pro-secrets/)).

**Vía inicial (86P y 120P).** Poder activar ADB de red en TCP 5555 sin ordenador depende del firmware; no hay un interruptor universal demostrado en el panel. La vía de modo desarrollador de eWeLink siguiente está documentada para el firmware indicado, pero no demuestra TCP5555 en todas las compilaciones posteriores. Si no hay ADB de red, usa la vía USB documentada para tu firmware. Los comandos root no habilitan el acceso inicial.

**1. Activa adb.** La vía depende del firmware:

- **Firmware antiguo:** abre la carcasa (quita los tornillos traseros y desconecta el conector táctil) para acceder al puerto USB OTG y conecta un equipo; adb funciona directamente por USB.
- **Firmware 1.3.2 y posteriores:** en **eWeLink**, abre _Ajustes del dispositivo_ del panel y pulsa **ID del dispositivo** ocho veces para activar modo desarrollador, que recupera adb.
- **Firmware 1.4 y posteriores** (modo desarrollador eliminado): interrumpe y restablece la alimentación **cinco veces** durante la animación Sonoff para forzar el arranque de recuperación y ejecuta durante esa ventana `adb install ultra-small-launcher.apk`. Tras reiniciar, establece ese lanzador como predeterminado y pulsa siete veces _Ajustes, Sistema, Acerca del tablet, Número de compilación_ para recuperar Opciones para desarrolladores y activar depuración USB.

**2. Cambia a adb de red** para poder cerrar la carcasa:

```bash
adb tcpip 5555
adb shell ip -o a            # find the panel IP
adb connect <panel-ip>:5555
adb shell su 0 setprop persist.adb.tcp.port 5555   # survive reboot (service prop resets)
```

**3. Root.** Al ser `userdebug`, `adb root` proporciona inmediatamente una shell adbd root. La app llama a `su` desde su entorno aislado, así que instala un `su` persistente en `/system`. **SuperSU `su` 2.76** en `/system/xbin/su` es la compilación probada:

```bash
adb root
adb disable-verity          # only if remount is refused; this reboots the panel
adb remount                 # or: adb shell mount -o remount,rw /system
adb push su /system/xbin/su
adb shell chmod 06755 /system/xbin/su
```

:::danger
Desactiva las apps eWeLink (`com.eWeLinkNSPro.dev`, `com.eWeLinkControlPanel`) solo **después** de tener adb y `su` fiables y otra forma de volver a Inicio y Atrás; las acciones de navegación de la app lo cubren. La **pasarela Zigbee** eWeLink es independiente de estas apps y sigue funcionando; gestiónala con el [interruptor de router Zigbee](#zigbee-gateway) en lugar de eliminarla.
:::

## WebView: actualiza esto primero

En un 86P recién instalado con firmware `3.5.1` (compilación `164637`) se verificó `com.android.webview` **107.0.5304.105** (Chromium 107), demasiado antiguo para mostrar un panel de control actual de Home Assistant. Otros firmwares y modelos pueden variar: comprueba el proveedor instalado antes de decidir actualizar. Las diferencias OTA archivadas no incluyen APK de WebView; se leyó esta versión de la unidad real con `dumpsys webviewupdate`. Esa unidad ejecuta Chromium **138** después de una actualización adb. La instalación y las actualizaciones de la app del panel iniciadas desde Home Assistant pueden instalar un WebView compatible verificado. Si el intento queda incompleto, elige **Reintentar** en la reparación de actualización del panel para continuarlo. La alternativa manual es actualizar por adb; consulta [Actualizar WebView del sistema](/es/hardware/guides/update-the-webview/#alternativa-manual).

## LED

No se encontró nodo RGB en `/sys/class/leds` ni `/dev/ledjni` en esta unidad; **no hay LED RGB caracterizado controlable por app o sysfs** en NSPanel Pro (compáralo con `avsux` del TPA10 y `/dev/ledjni` del WF1589T). El brillo y la retroiluminación usan las vías estándar de Android.

<a id="sensors-light-and-proximity-are-app-direct"></a>

## Sensores: luz y proximidad llegan directamente a la app

A diferencia del TPA10, donde temperatura y humedad requieren root, NSPanel Pro expone su sensor combinado Sensortek mediante `SensorManager` estándar: `android.sensor.light`, `android.sensor.proximity` y `android.sensor.accelerometer`, todos legibles por una app normal sin root. La app lee directamente luz y proximidad. No hay sensor de temperatura ni humedad.

:::note
**Las lecturas de proximidad dependen tanto del firmware como del modelo.** El sensor es un Sensortek STK3A5x en un recorte de la placa superior tras el cristal. El nivel base en reposo varía mucho entre unidades (una cerca de 1000, otra de 4000); solo importa el cambio _relativo_, por lo que un nivel alto es normal, no un fallo. Hasta aproximadamente firmware **3.3**, informa lecturas graduadas cada unos 50 ms; entre aproximadamente **3.3 y 3.4**, el controlador del kernel cambió a binario 0 o 1. **4.0.12 recuperó lecturas graduadas solo en el 86P**; el **120P siguió binario**. La configuración guiada calibra cualquiera de las señales y guarda el resultado; el panel normaliza el intervalo útil entre tus paneles, por lo que los perfiles no codifican umbrales por firmware ni clasificadores graduados y binarios. (Fuentes: incidencias de las herramientas de seaky [142](https://github.com/seaky/nspanel_pro_tools_apk/issues/142), [144](https://github.com/seaky/nspanel_pro_tools_apk/issues/144), [171](https://github.com/seaky/nspanel_pro_tools_apk/issues/171) y [262](https://github.com/seaky/nspanel_pro_tools_apk/issues/262).)
:::

### Dispositivos I²C vinculados

| Dirección I²C       | Controlador o nombre        | Qué es                                                          |
| ------------------- | --------------------------- | --------------------------------------------------------------- |
| `0-0020`            | `rk809`                     | PMIC                                                            |
| `1-001a` / `1-005a` | `CST226` / `CST226SE`       | Controlador táctil capacitivo Hynitron                          |
| `2-003c`            | `tp`                        | Panel táctil                                                    |
| `2-0046`            | `ls_stk3a5x` y `ps_stk3a5x` | Combinado de luz ambiental y proximidad Sensortek **STK3A5x**   |
| `2-0047`            | `ls_stk3x3x` y `ps_stk3x3x` | Luz y proximidad Sensortek **STK3x3x** (componente alternativo) |

<a id="zigbee-gateway"></a>

## Pasarela Zigbee

NSPanel Pro incorpora una **radio Silicon Labs EFR32 Zigbee 3.0** en UART `/dev/ttyS5`, controlada por la pila anfitriona del fabricante (`/vendor/bin/siliconlabs_host/zgateway`) mediante un broker MQTT local. Las apps eWeLink usan la misma pila; por eso el panel viene como hub Zigbee eWeLink.

La app la gestiona directamente. `switch.<panel>_zigbee_router` convierte el panel en **router** Zigbee que amplía tu malla existente (inicia la pasarela y asegura el rol Repeater), y lo desactiva de nuevo (detiene la pasarela y libera la radio). Funciona mediante el broker local, sin credenciales ni manejo directo de `ttyS5`. El panel aparece como router normal en tu coordinador ZHA o Zigbee2MQTT.

:::note
Cambiar de rol **no reinstala el firmware**: no hay paso `.gbl` ni de cargador de arranque; solo cambia el tipo de nodo EZSP. Para trabajo de firmware a nivel de partición, consulta [Copia de seguridad y restauración del firmware](/es/hardware/guides/firmware-backup-and-restore/).
:::

:::note
**No hay Thread Border Router documentado ni caracterizado.** La pila instalada usa EFR32 como NCP Zigbee. El chip EFR32MG21 admite múltiples protocolos, pero eso no demuestra firmware Thread ni un border router en el panel; Sonoff documenta en cambio un Matter Bridge.

**El firmware 4.x rehízo la pila Zigbee.** La inspección comunitaria encontró una bifurcación de Zigbee2MQTT, otra contraseña MQTT en el dispositivo y otra secuencia de arranque. [Sonoff documenta el cambio entre coordinador y router](https://sonoff.tech/blogs/news/nspanel-pro-v4-3-0-central-heating-redefining-whole-home-temperature-automation) en firmware actual, pero el control de broker local de la app se creó para 3.x y anteriores y **puede necesitar adaptación en 4.x**. (Fuentes comunitarias: incidencias de las herramientas de seaky [241](https://github.com/seaky/nspanel_pro_tools_apk/issues/241), [244](https://github.com/seaky/nspanel_pro_tools_apk/issues/244) y [255](https://github.com/seaky/nspanel_pro_tools_apk/issues/255), e [incidencia 3 de roottool](https://github.com/seaky/nspanel_pro_roottool_apk/issues/3).)
:::

:::caution
**Un informante confirmó un defecto en el supervisor Zigbee antiguo del fabricante en NSPanel Pro 120 con firmware de fábrica 3.8.0.** El firmware con la asignación recursiva `LD_LIBRARY_PATH` descrita en [su incidencia](https://github.com/panel-assistant/android/issues/34) puede terminar haciendo fallar con `E2BIG` todos los comandos externos que lanza el supervisor, consumir un núcleo y dejar de recuperar un `zgateway` caído. Reiniciar solo lo resuelve temporalmente. Consulta [Ajuste de rendimiento](/es/manage/performance/) para las pruebas y los requisitos de una reparación segura. La solución provisional del informante no se ha validado independientemente. La inspección comunitaria de 4.0.12 y 4.6.0 no encontró la asignación vulnerable.
:::

### Requisitos: firmware 2.2.0 o posterior

La pila anfitriona es la pasarela **propia del fabricante** eWeLink y Sonoff, con versiones correspondientes al firmware (por ejemplo `sonoff-v3.5.4`). El **modo router** Zigbee llegó en **NSPanel Pro firmware 2.2.0** (2023; eWeLink, _Ajustes del dispositivo, Funciones piloto, Modo Zigbee_) y la compatibilidad de repetidor de la pila local en el paquete de pasarela 1.1.9. En la práctica:

- **Pasarela presente** (firmware 2.2.0 o posterior, o instalada lateralmente): la app la detecta y publica `switch.<panel>_zigbee_router`. Actívalo y el panel se une a tu coordinador como router.
- **Sin pasarela** (firmware muy antiguo, nunca aprovisionado): el interruptor **no aparece**, porque depende de que exista el script de inicio de la pasarela. Actualiza el firmware a 2.2.0 o posterior.

La app **controla** la pasarela; no la distribuye ni instala porque es un binario de eWeLink. El firmware 4.x añade un puente Matter y puede exportar dispositivos Zigbee a Home Assistant por MQTT Discovery, como alternativas al rol de router.

### Estado de la pasarela y contención automática

En un panel con Zigbee, `sensor.<panel>_zigbee_gateway_health` informa de la pila del fabricante independientemente del interruptor de router; una pasarela de fábrica sin configurar sigue siendo visible sin conceder a la app permiso para detenerla.

Cuando se activa explícitamente el interruptor de router, la app permite 15 minutos de gracia para inicio y emparejamiento; después comprueba cada minuto dos señales de descontrol: red explícitamente no válida o sin unir junto con más del 50% de un núcleo durante cinco muestras consecutivas, o al menos tres cambios de ID de proceso de la pasarela en diez minutos. Un router unido con CPU alta sostenida solo genera un aviso y sigue funcionando. Las estructuras 4.x desconocidas o la falta de pruebas de unión específicas del firmware se tratan de forma segura como `unknown`.

Activar el router Zigbee solicita explícitamente modo Repeater incluso si la pasarela ya funciona; activarlo mientras tu coordinador ZHA o Zigbee2MQTT permite uniones es un nuevo intento de unión sin iniciar otro supervisor de pasarela.

La pestaña Configurar muestra **Solicitar unión** justo debajo del interruptor de router Zigbee; el interruptor sigue siendo el único control de encendido y apagado. Permite uniones en ZHA o Zigbee2MQTT, solicita la unión y confirma que el permiso está abierto. La acción reafirma modo Repeater, inicia otros 15 minutos de gracia y sondea el estado; no reinicia el panel. El botón no está disponible si el router está desactivado, ya unido o esperando tras una solicitud reciente.

Tras la gracia, una pasarela activada que sigue sin unirse genera un aviso persistente en el panel de control y la pestaña Instalar, enlazado a esa acción de Configurar. No la dejes así: los intentos repetidos pueden consumir mucha CPU. Une el panel como router o desactiva su interruptor de router Zigbee.

Si una pasarela antigua configurada cumple una regla de descontrol, la app desactiva persistentemente el interruptor y realiza un intento acotado de contención. La contención nativa del fabricante solo puede dirigirse al supervisor Sonoff, `zgateway` y el broker local correspondiente. Si un proceso no puede detenerse, se elimina su mecanismo de relanzamiento cuando es posible y el trabajo superviviente de pasarela pasa a nice 19 y al cpuset de segundo plano de Android. Activar después el router inicia otra gracia y otro intento.

Los atributos de estado incluyen firmware y versión de producto, estructura y versión de paquete de pasarela, estado de unión y rol, CPU redondeada de pasarela y supervisor, recuento reciente de reinicios y resultado de contención. Nunca incluyen clave de red Zigbee, credenciales brutas del broker local, MAC de radio ni `netinfo` bruto de pasarela.

### Migrar desde NSPanelTools

Si NSPanelTools instaló la pasarela Sonoff en un panel antiguo, la pila de `/vendor` sobrevive a eliminar NSPanelTools. Elimina NSPanelTools antes de activar los controles de pantalla y sensores de Panel Assistant para evitar acciones duplicadas. Panel Assistant puede controlar la pasarela existente; dejando activado el router Zigbee, inicia la pasarela al arrancar incluso si se eliminó el antiguo enlace de arranque.

### Detalles internos de la pila anfitriona EZSP

En la pila nativa antigua (3.x y anteriores), la radio ejecuta **firmware EZSP NCP** (EFR32MG21, EZSP v8). `zgateway` es un binario _anfitrión_ EZSP en `/vendor/bin/siliconlabs_host/`, mantenido por su supervisor `guard_process.sh` (bucle de 5 segundos iniciado al arrancar) y controlado por un **broker mosquitto local** en `127.0.0.1:1883`. El broker es anónimo: la línea `password_file` está comentada en `mosquitto.conf`. La pila 4.x difiere como se describe arriba.

- Estado de rol: `zigbee/system/network-role/information` devuelve `{"role":"Repeater"|"Coordinator"}`
- Cambio de rol: publica `{"role":"Repeater"}` en `zigbee/system/network-role/switch`

«Repeater» es modo router, que amplía una malla existente; el rol persiste en la memoria no volátil del NCP. `zgateway` del fabricante sobrevive a quitar las _apps_ eWeLink porque está en `/vendor`, no en un APK.

Para un coordinador Zigbee2MQTT o ZHA independiente completo _en el panel_, consulta [seaky/nspanel_pro_zigbee](https://github.com/seaky/nspanel_pro_zigbee), que sustituye la pila anfitriona. Es más pesado y no es lo que hace la app.

## Resumen del modelo de acceso

- **Luz, proximidad, acelerómetro:** directamente a la app (`SensorManager`).
- **Brillo, suspensión, navegación, texto a voz:** vías estándar de Android (`su` para apagar realmente la retroiluminación).
- **LED:** ninguno caracterizado.
- **Zigbee:** radio EFR32 gestionada mediante el broker local de la pasarela del dispositivo (`switch.<panel>_zigbee_router`).
- **Radios:** Zigbee 3.0, Wi-Fi y Bluetooth.

## Rendimiento esperado

NSPanel Pro tiene **CPU y RAM limitadas** para paneles de control complejos:

- En reposo funciona a 408 MHz con unos 500 MB de RAM usados; un panel de control pesado exige mucho a ambos.
- **Los 2 GB de RAM son la limitación principal.** WebView, Android y apps en segundo plano compiten por ella; paneles de control grandes con muchas tarjetas, imágenes grandes, gráficos de historial largos o tarjetas personalizadas costosas provocan recargas de WebView y tirones.
- Los núcleos A35 hacen las transiciones y animaciones visiblemente más lentas que en paneles A55 o A72.

Con el renderizador integrado, empieza por el filtro automático de entidades descrito en [Ajuste de rendimiento](/es/manage/performance/) para no procesar estados que el panel de control nunca muestra. Usa después las tarjetas de rendimiento de la pestaña Panel de control para encontrar vistas pesadas restantes, presión de memoria o límites térmicos antes de simplificar el panel de control.
