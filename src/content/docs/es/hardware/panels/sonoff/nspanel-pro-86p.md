---
title: Sonoff NSPanel Pro 86P
description: Datos de hardware del Sonoff NSPanel Pro 86P, un panel cuadrado Rockchip PX30 de 480×480 con radio Zigbee integrada.
vendor: Sonoff
model: NSPanel Pro 86P
soc: Rockchip PX30
android: '8.1'
screen: 4 pulgadas, 480 × 480, solo vertical
support: Completo
root: userdebug, sin contraseña adb; su para apagar la retroiluminación
webview: Chromium 107 en 3.5.1; instalación manual de LineageOS 138
released: '2022-09 (estimado)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-front.jpg'
    alt: Sonoff NSPanel Pro 86P, vista frontal, montado en la pared
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-black-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, acabado negro, vista oblicua que muestra la profundidad de montaje
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-white-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, acabado blanco, vista oblicua que muestra la profundidad de montaje
photoCredit: 'Foto: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 86P
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

El **86P** es la variante cuadrada de la línea [Sonoff NSPanel Pro](/es/hardware/panels/sonoff/), llamada así por la caja de pared europea de 86 mm. Esta página solo recoge sus especificaciones y las diferencias con el [120P](/es/hardware/panels/sonoff/nspanel-pro-120p/); el resto (proceso de root, actualización de WebView, LED, sensores, pasarela Zigbee y particularidades del firmware) se documenta una sola vez en la [página de la familia](/es/hardware/panels/sonoff/), a la que enlazan estas secciones.

## También se vende como

NSPanel Pro 86, NSPanel Pro 86P, NSPanel120P (algunos anuncios del 86P reutilizan este nombre), NSPanel Pro Gen1, px30_evb, SN-RKPX30-NSP-01, nspanel-pro. No debe confundirse con el NSPanel Pro Gen2 ni con las placas Tuya S6E y T6E, que son hardware diferente.

|                |                                                                                                                                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC            | Rockchip **PX30**                                                                                                                                                                                                                                                                                                                 |
| CPU            | 4× **Cortex-A35** hasta **1.512 GHz** (408 MHz en reposo)                                                                                                                                                                                                                                                                         |
| GPU            | **Mali-G31** (confirmado en el dispositivo)                                                                                                                                                                                                                                                                                       |
| Pantalla       | **480×480 cuadrada** (1:1), unas 4 pulgadas, 160 dpi (mdpi, bien adaptado a unos 170 ppi físicos), 60 Hz, un lienzo de **480×480 dp**                                                                                                                                                                                             |
| RAM            | **2 GB** (unos 1960 MB utilizables)                                                                                                                                                                                                                                                                                               |
| Almacenamiento | eMMC; `/data` de unos 3.5 GB                                                                                                                                                                                                                                                                                                      |
| Android        | 8.1 (API 27)                                                                                                                                                                                                                                                                                                                      |
| ABI            | arm64-v8a                                                                                                                                                                                                                                                                                                                         |
| Radios         | **Zigbee 3.0** (coordinador Silicon Labs EFR32, consulta la [página de la familia](/es/hardware/panels/sonoff/#zigbee-gateway)), Wi-Fi, Bluetooth. Sin NFC, IR, Ethernet ni conexión móvil.                                                                                                                                       |
| Lanzamiento    | Hacia septiembre de 2022 (estimado); las reservas se abrieron en agosto de 2022 con envíos previstos a partir del 20 de septiembre de 2022 ([noticia de las reservas, CNX Software, agosto de 2022](https://www.cnx-software.com/2022/08/12/sonoff-nspanel-pro-android-control-panel-doubles-as-wifi-zigbee-smart-home-gateway/)) |

`ro.product.model` y `ro.product.device` indican ambos `px30_evb`, un nombre de placa Rockchip compartido que _no_ permite distinguir de forma fiable el 86P del 120P; `ro.product.version` utiliza el formato específico `NSPanel86P_x.y.z`, o `s6_android_x.y.z` en algunos firmwares. OTA se distribuye como ROM completa hasta **4.0.12**; las versiones posteriores indexadas son diferencias o actualizaciones solo de aplicaciones (consulta la [página del firmware](/es/hardware/firmware/nspanel-pro/)). El firmware de proximidad del 86P **recuperó las lecturas de distancia en 4.0.12** (el 120P siguió siendo binario en 4.x); consulta [Sensores](/es/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) en la página de la familia.

:::note
El Cortex-A35 es un núcleo de eficiencia con un rendimiento por ciclo notablemente inferior al A55 (TPA10) o al A72 (WF1589T). Con 2 GB de RAM, la línea NSPanel Pro ofrece el **rendimiento de entrada** entre los paneles con compatibilidad completa; consulta la [comparación de rendimiento](/es/hardware/#performance-comparison).
:::

## Acceso inicial de depuración

El acceso a ADB por red en el puerto TCP 5555 sin ordenador depende del firmware instalado; no se ha establecido un interruptor universal. Sigue los [pasos de acceso inicial a ADB del NSPanel Pro](/es/hardware/panels/sonoff/#gaining-adb-and-root-access), incluido el procedimiento USB específico del firmware cuando no haya acceso por red. Los pasos posteriores de root requieren una conexión de depuración existente.
