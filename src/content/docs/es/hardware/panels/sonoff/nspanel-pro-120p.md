---
title: Sonoff NSPanel Pro 120P
description: Datos de hardware del Sonoff NSPanel Pro 120P, un panel vertical Rockchip RK3326-S de 750×1334 con radio Zigbee integrada.
vendor: Sonoff
model: NSPanel Pro 120P
soc: Rockchip RK3326-S
android: '8.1'
screen: 4.7 pulgadas, 750 × 1334, vertical, horizontal disponible
support: Completo
root: userdebug, sin contraseña adb; su para apagar la retroiluminación
webview: Chromium 107 en 3.5.1; instalación manual de LineageOS 138
released: '2024-08 (estimado)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-120p-front.jpg'
    alt: Sonoff NSPanel Pro 120P, acabados blanco y negro, vista frontal, montado en la pared
photoCredit: 'Foto: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 120P
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

El **120P** es la variante alargada de la línea [Sonoff NSPanel Pro](/es/hardware/panels/sonoff/), llamada así por la caja de pared europea de 120 mm. Esta página solo recoge sus especificaciones y las diferencias con el [86P](/es/hardware/panels/sonoff/nspanel-pro-86p/); el resto (proceso de root, actualización de WebView, LED, sensores, pasarela Zigbee y particularidades del firmware) se documenta una sola vez en la [página de la familia](/es/hardware/panels/sonoff/), a la que enlazan estas secciones.

## También se vende como

NSPanel Pro 120, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, SN_3326S, nspanel-pro-ver120. No debe confundirse con el NSPanel Pro Gen2 ni con las placas Tuya S6E y T6E, que son hardware diferente.

|                |                                                                                                                                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC            | Rockchip **RK3326-S** (misma familia PX30/RK3326 que el 86P; `ro.board.platform=rk3326`, árbol de dispositivos `rockchip,px30`)                                                                                                                      |
| CPU            | 4× **Cortex-A35** hasta **1.512 GHz** (408 MHz en reposo)                                                                                                                                                                                            |
| GPU            | **Mali-G31** (confirmado en el dispositivo)                                                                                                                                                                                                          |
| Pantalla       | **750×1334** vertical, **240 dpi** (ajuste alternativo 250); horizontal disponible; aproximadamente 1 cm más estrecho y más largo que el 86P                                                                                                         |
| RAM            | **2 GB** (unos 1960 MB utilizables)                                                                                                                                                                                                                  |
| Almacenamiento | eMMC; `/data` de unos 3.5 GB                                                                                                                                                                                                                         |
| Android        | 8.1 (API 27)                                                                                                                                                                                                                                         |
| ABI            | arm64-v8a                                                                                                                                                                                                                                            |
| Radios         | **Zigbee 3.0** (coordinador Silicon Labs EFR32, consulta la [página de la familia](/es/hardware/panels/sonoff/#zigbee-gateway)), Wi-Fi, Bluetooth. Sin NFC, IR, Ethernet ni conexión móvil.                                                          |
| Lanzamiento    | Hacia agosto de 2024 (estimado); salió a la venta en el sitio de Sonoff alrededor del 14 de agosto de 2024 ([noticia del lanzamiento, haade.fr, agosto de 2024](https://haade.fr/en/blog/special-discount-new-sonoff-nspanel-pro-120-on-itead-site)) |

`ro.product.model` y `ro.product.device` indican ambos `px30_evb`, un nombre de placa Rockchip compartido que _no_ permite distinguir de forma fiable el 120P del 86P; `ro.product.version` utiliza el formato específico `NSPanel120P_x.y.z` (canal OTA `nspanel-pro-ver120`, ROM completa `SN_3326S_750X1334_…`). Por lo demás, el formato OTA sigue al 86P (consulta la [página del firmware](/es/hardware/firmware/nspanel-pro/)). El firmware de proximidad del 120P **siguió siendo binario en 4.x** (el 86P recuperó las lecturas de distancia en 4.0.12; los kernels divergen según el modelo); consulta [Sensores](/es/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) en la página de la familia. Verificado en vivo en un 120P (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, densidad 240, `ro.board.platform=rk3326`.

:::note
El Cortex-A35 es un núcleo de eficiencia con un rendimiento por ciclo notablemente inferior al A55 (TPA10) o al A72 (WF1589T). Con 2 GB de RAM, la línea NSPanel Pro ofrece el **rendimiento de entrada** entre los paneles con compatibilidad completa; consulta la [comparación de rendimiento](/es/hardware/#performance-comparison).
:::

## Acceso inicial de depuración

El acceso a ADB por red en el puerto TCP 5555 sin ordenador depende del firmware instalado; no se ha establecido un interruptor universal. Sigue los [pasos de acceso inicial a ADB del NSPanel Pro](/es/hardware/panels/sonoff/#gaining-adb-and-root-access), incluido el procedimiento USB específico del firmware cuando no haya acceso por red. Los pasos posteriores de root requieren una conexión de depuración existente.
