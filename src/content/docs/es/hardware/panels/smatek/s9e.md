---
title: Smatek S9E
description: Datos del Smatek S9E, panel empotrado Rockchip RK3566 de 10,1 pulgadas con dos relés de red eléctrica, cuatro botones con retroiluminación LED, proximidad por radar, Zigbee, Ethernet y RS485.
vendor: Smatek
model: S9E
soc: Rockchip RK3566
android: '11'
screen: 10,1 pulgadas, 1920 × 1200
support: Probado por la comunidad
root: Relés, LED de botones, proximidad (su de la app comunicado como operativo)
webview: Chromium 83 en 2024-07; 131 en 2025-12
released: 'no antes de 2021 (estimado, SoC RK3566)'
photos:
  - src: 'asset:hardware-smatek-s9e-front.jpg'
    alt: Frontal y parte posterior del Smatek S9E, con cableado de relés y terminales
photoCredit: 'Foto: Smatek'
sold_as_note: 'Versión Zigbee (Tuya) con dos relés de red eléctrica, CA 100-240 V'
sold_as:
  - brand: Smatek
    name: 'S9E-NZ'
    note: 'Versión Android sin gateway Zigbee: RS485, cuatro botones, CA 100-240 V'
  - brand: Smatek
    name: 'S9PE-NZ'
    note: 'Como S9E-NZ, alimentado por Ethernet (PoE) o CC 9-24 V en vez de red eléctrica'
evidence: [firmware, documented, platform, owners]
sidebar:
  label: S9E
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

No se encontraron notas de versión del fabricante. La comparación siguiente procede de inspeccionar las imágenes aportadas, no de un registro de cambios del fabricante.

:::note
A diferencia de los paneles con soporte completo, **no** se realizó ingeniería inversa sobre una unidad disponible. Las especificaciones proceden del anuncio Smatek y las rutas de control de [seaky/nspanel_pro_tools_apk, incidencia 98](https://github.com/seaky/nspanel_pro_tools_apk/issues/98), el foro Home Assistant e informantes. Un propietario conmutó relés y LED desde Home Assistant con firmware 1.1.0 ([incidencia 93](https://github.com/panel-assistant/android/issues/93)); considera sin confirmar los demás detalles hasta validarlos.
:::

Panel empotrado RK3566 de 10,1 pulgadas y **1920×1200**, misma familia SoC que TPA10, con **dos relés de red eléctrica**, cuatro botones con LED, proximidad por radar y **Zigbee, Ethernet y RS485**.

## Acceso inicial de depuración

**ADB por red en TCP 5555 sin ordenador: no establecido.** Que un propietario use Panel Assistant o firmware con root no demuestra cómo activa la depuración un panel nuevo.

**Tampoco se ha establecido la depuración USB inicial.** Pide al proveedor instrucciones para tu firmware exacto y confirmación de un puerto USB de datos. Si ofrece depuración USB, usa el [instalador USB](/es/install/install-over-usb/); no supongas que un puerto de carga ofrece ADB. No hay aquí una secuencia verificada del menú de fábrica.

Las comprobaciones root necesitan ADB ya operativo. Root y depuración inicial son cuestiones distintas.

## También se vende como

Smatek S9E, Smatek S9, S9E-NZ (sin gateway Zigbee), S9PE, S9PE-NZ (PoE), `Build.MODEL` S9, `Build.DEVICE` rk3566_r, `ro.product.version` S9_Android_1.0.2 y S9_Android_1.1.0.

:::tip
Lo esencial: comparte **RK3566** con TPA10; las funciones de la app probablemente funcionan sin código específico. Los **relés conmutan cargas de red eléctrica** (sysfs root, funcionamiento comunicado en 1.1.0). Los botones emiten KeyEvents **`F1` a `F4`** directamente, sin root. Comprueba WebView primero: 2024-07 trae **Chromium 83**.
:::

|                      |                                                                                                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC                  | Rockchip **RK3566** (cuatro Cortex-A55), misma familia que TPA10                                                                                                                                                                                                     |
| RAM y almacenamiento | **2 GB** RAM, **16 GB** eMMC                                                                                                                                                                                                                                         |
| Pantalla             | **10,1 pulgadas**, **1920×1200**, multitáctil                                                                                                                                                                                                                        |
| Android              | 11                                                                                                                                                                                                                                                                   |
| Conectividad         | Wi-Fi, Bluetooth, **Zigbee**, **Ethernet RJ45**, **RS485** (también hay **S9PE** PoE)                                                                                                                                                                                |
| Sensores             | Proximidad por **radar**, **luz** ambiental, **temperatura y humedad**                                                                                                                                                                                               |
| Entradas             | **4 botones físicos** con LED individuales                                                                                                                                                                                                                           |
| Relés                | **2 relés de red eléctrica** integrados                                                                                                                                                                                                                              |
| Root                 | La app del fabricante usa `execRootCmd`, por lo que hay root; algunas unidades traen modo desarrollador desbloqueado. Un informe muestra `su` accesible desde una app normal en 1.1.0: eso determina si la app accede directamente a sysfs o necesita auxiliar root. |
| Lanzamiento          | Sin fecha segura; RK3566 llegó al mercado hacia 2021, mejor límite inferior encontrado ([datos RK3566, CNX Software, diciembre de 2020](https://www.cnx-software.com/2020/12/16/rockchip-rk3566-and-rk3568-datasheets-and-features-comparison/))                     |

:::danger
Los controles siguientes escriben en **sysfs como root** y los relés conmutan **cargas de red eléctrica**. Se implementaron desde rutas comunicadas y un propietario informa de relés y LED operativos en 1.1.0; `st_relay` de 1.0.2 está **sin confirmar**: valídalo en tu S9E antes de depender de él.
:::

:::tip
Al compartir **RK3566** con TPA10, las funciones existentes probablemente no necesitan código específico; temperatura, humedad y luz pueden aparecer mediante `SensorManager`. En firmware antiguo **WebView es muy viejo (Chromium 83)**: actualízalo primero mediante Magisk OpenWebView, firmware 2025-03-24 o SystemWebView instalado manualmente. 2025-12 ya trae Chromium 131. Consulta [Actualizar WebView](/es/hardware/guides/update-the-webview/).
:::

:::tip
Tiene cuatro botones frontales pero ninguna combinación de recuperación de encendido y volumen documentada. No se han capturado en hardware real particiones, vía root ni recuperación: no apliques sin cambios la [guía de copia de firmware](/es/hardware/guides/firmware-backup-and-restore/) de TPA10 y WF1589T.
:::

## Versiones de firmware

Se analizaron dos imágenes originales: OTA `.zip` por bloques en formato de particiones dinámicas AOSP. Descomprime `.new.dat.br` con `brotli -d`, extrae super con `lpunpack` y busca en `build.prop` e init `.rc` con `strings`. Ambas declaran `Build.MODEL` **`S9`**, `Build.DEVICE` **`rk3566_r`** y Android 11; el código de versión está en **`ro.product.version`**:

| Imagen                             | `ro.product.version` | Compilación                  | Clase de relé         |
| ---------------------------------- | -------------------- | ---------------------------- | --------------------- |
| `S9_1920x1200_20240712_Android_US` | `S9_Android_1.0.2`   | `eng.*.20240712`             | `/sys/class/st_relay` |
| `S9_1920x1200_20251202_Android_US` | `S9_Android_1.1.0`   | `eng.xiaolp.20251202.160404` | `/sys/class/strelay`  |

:::caution
**La clase sysfs del relé cambió de nombre entre versiones.** Solo la **inicial** (1.0.2) usa `/sys/class/st_relay`; **todas las posteriores** (1.1.0 y siguientes), `/sys/class/strelay`, confirmado por [un informante](https://github.com/panel-assistant/android/issues/3) y el diff de firmware. La app prueba ambos nombres y usa el disponible; consulta [Relés](#relés-clase-strelay-o-st_relay-root).
:::

El informante compartió ambas desde Smatek: `S9_1920x1200_20240712_Android_US` (**1.0.2**) y `S9_1920x1200_20251202_Android_US` (**1.1.0**). Los enlaces originales `docs.smatek.store:10001` ya no responden; pide copia al soporte Smatek o al informante.

El diff muestra que **solo difieren `ro.product.version` y la clase del relé**. Las demás rutas (códigos de botones, GPIO LED y proximidad, cableado de sensores) son idénticas: detectar `ro.product.version` que empieza por `S9` cubre la línea completa.

## Relés: clase `strelay` o `st_relay` (root)

La app expone `switch.<panel>_relay1` y `switch.<panel>_relay2` solo si existe la clase sysfs del relé.

:::note
**El nombre depende del firmware** ([Versiones](#versiones-de-firmware)): `st_relay` en 1.0.2, `strelay` desde 1.1.0. La app prueba **ambos**.
:::

```bash
# firmware 1.1.0+ (most panels in the field)
echo 1 > /sys/class/strelay/relay1    # on
echo 0 > /sys/class/strelay/relay1    # off
echo 1 > /sys/class/strelay/relay2

# firmware 1.0.2 (initial release)
echo 1 > /sys/class/st_relay/relay1
```

## Botones: KeyEvents `F1` a `F4` (directos a la app)

Emiten códigos Android **131 a 134**, `KEYCODE_F1` a `KEYCODE_F4`. La captura de accesibilidad informa en `event.<panel>_button` (tipos `KEYCODE_F1` a `KEYCODE_F4`); vincula acciones del panel de control en Home Assistant. No necesitan root.

## LED: retroiluminación GPIO por botón

Cada botón tiene LED en `/sys/class/gpio/gpio<16+keycode>/value`: GPIO **147 a 150** para F1 a F4. Son monocromos, encendidos o apagados. La app expone `light.<panel>_button_led1` a `light.<panel>_button_led4` mediante `su`, contados desde `hardware.button_led_gpio_base` del perfil. **No** están en `/sys/class/leds`, que solo tiene `mmc2::` de la tarjeta SD: son GPIO directos.

:::note
**Análisis del firmware:** init solo exporta **`gpio113`**. **gpio147 a gpio150 no se exportan al arrancar**: sus nodos `/sys/class/gpio/gpioNNN/value` no existen hasta exportarlos. La app exporta cada pin bajo demanda y lo configura como salida antes de escribir; por eso funcionan.
:::

```bash
echo 147 > /sys/class/gpio/export        # one-time, if the node is absent
echo 1 > /sys/class/gpio/gpio147/value   # button F1 LED on
```

:::tip
También hay **LED RGB de estado** (`led_r`, `led_g`, `led_b`), **motor de vibración** y **LED de actividad Ethernet**. La app no expone ninguno.
:::

## Sensores: la proximidad viene de GPIO 18, no de `SensorManager`

:::caution
Hay un sensor _registrado_ en `SensorManager` que anuncia `Proximity=yes · Binary · 0/1 cm`, pero en S9E **nunca entrega eventos**. Lecturas en vivo de [un informe posterior](https://github.com/panel-assistant/android/issues/5) establecieron el silencio de Android. La luz del mismo panel funciona (unos 46 lx): es específico de proximidad. La señal real viene de `gpio18`.
:::

La señal real es una **lectura GPIO root de GPIO 18**. El kernel registra un sensor fantasma que nunca emite; hay que leer sysfs:

```bash
cat /sys/class/gpio/gpio18/value   # 1 = near, 0 = far  (no export needed — reporter-confirmed)
```

El perfil declara `sensors.proximity_gpio: 18` en lugar de la fuente muerta `SensorManager`. El auxiliar mantiene abierto el descriptor y transmite cambios inmediatamente si el kernel admite flancos GPIO; si no, relee el mismo descriptor dos veces por segundo. Informa explícitamente de la pérdida del descriptor: Home Assistant muestra indisponible hasta que el flujo recuperado aporta su valor actual. Usa la misma configuración guiada y calibración guardada que los sensores Android; presencia calibrada y gestos quedan disponibles cuando la configuración finaliza correctamente. Se confirmó **0 lejos, 1 cerca**; la configuración mide extremos sin adivinar polaridad. Luz, temperatura y humedad aparecen mediante `SensorManager` como se esperaba.

## Resumen del acceso

- **Relés:** `switch.<panel>_relay1` y `switch.<panel>_relay2` mediante sysfs root; prueba `strelay` y `st_relay`.
- **Botones:** `event.<panel>_button` (`KEYCODE_F1` a `KEYCODE_F4`), directos por accesibilidad.
- **LED de botones:** `light.<panel>_button_led1` a `light.<panel>_button_led4` por `su` (GPIO 147 a 150, exportados bajo demanda).
- **Proximidad:** `binary_sensor.<panel>_proximity` calibrado y `sensor.<panel>_proximity_level` normalizado desde el flujo `gpio18` del auxiliar. Se omite el sensor `SensorManager`, que se registra pero nunca emite.
- **Luz:** `sensor.<panel>_illuminance` por `SensorManager`, que **funciona**.

## Fuentes

- [Informe Smatek S9E en GitHub](https://github.com/panel-assistant/android/issues/3): `/diag`, cadenas de detección, proximidad `SensorManager`, cambio `st_relay` a `strelay` y dos imágenes.
- Firmware original Smatek compartido por el informante: 1.0.2 (20240712) y 1.1.0 (20251202), imágenes analizadas. Los enlaces `docs.smatek.store:10001` ya no responden.
- [seaky/nspanel_pro_tools_apk, incidencia 98, «Add Smatek S9E Support»](https://github.com/seaky/nspanel_pro_tools_apk/issues/98): relé (`st_relay`), botones (131 a 134), LED (GPIO 147 a 150) y proximidad (GPIO 18).
- [Comunidad Home Assistant: «Smatek S9E Touch Panel»](https://community.home-assistant.io/t/smatek-s9e-touch-panel/828244): WebView, scripts GPIO 18 e integración.
- [Producto Smatek S9E](https://smatek.com/product/10-1-inch-smart-control-panel-s9e/) y [variante PoE S9PE-NZ](https://smatek.com/product/10-1-inch-android-panel-s9e-nz/): SoC, RAM, almacenamiento, pantalla, sensores y conectividad.
- [Ficha Smatek S9E (PDF)](https://smatek.com/wp-content/uploads/2025/03/Smatek-S9E-10-Super-Smart-Control-Panelin-wall-SPEC.pdf): escaneo solo de imágenes, sin texto extraíble, pero ficha original.
