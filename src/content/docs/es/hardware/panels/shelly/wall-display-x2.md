---
title: Shelly Wall Display X2
description: Datos de hardware del Shelly Wall Display X2, un panel SC7731E de 6.9 pulgadas con Android 8.1, nombre en clave Pegasus.
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 pulgadas, 1440 × 720
support: Sin probar
root: No establecido en este modelo
webview: 'No establecido (el canal WallDisplay no incluye un paquete OTA de WebView para este modelo)'
released: '2025-01 (estimado)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, vista frontal
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**No se ha probado ninguna unidad de este modelo.** Panel Assistant le asigna el perfil Shelly antiguo incluido, que todavía no ha ejecutado ningún X2. Consulta la [página de la familia Wall Display](/es/hardware/panels/shelly/) para conocer las fuentes, el mecanismo OTA del firmware, el modelo de acceso y las notas de seguridad compartidas por toda la línea.
:::

El Wall Display X2, con nombre en clave de firmware **Pegasus**, es un panel de 6.9 pulgadas y 1440×720 con Spreadtrum/UNISOC SC7731E (Cortex-A7) y Android 8.1. Utiliza el canal OTA antiguo **WallDisplay** (armeabi-v7a), junto con el [original](/es/hardware/panels/shelly/wall-display/).

## Acceso inicial de depuración

**ADB por red en el puerto TCP 5555 sin ordenador: no establecido en este modelo.** La depuración USB inicial y el desbloqueo desde el menú del fabricante tampoco están verificados aquí. El [procedimiento del X2i](/es/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) solo está confirmado en el X2i; compartir firmware no demuestra que funcione aquí. Pide a Shelly el procedimiento para tu modelo y firmware. Utiliza el [instalador USB](/es/install/install-over-usb/) únicamente cuando estén disponibles la depuración USB y una conexión de datos USB. Una compilación con capacidad root no habilita por sí sola la depuración.

## También se vende como

Shelly Wall Display X2, SAWD-2A1XX10EU1, nombre en clave del firmware Pegasus, ID de dispositivo e500_7731e_32u_o.

|             |                                                                                                                                                                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                                                    |
| Pantalla    | **1440×720**, 6.9 pulgadas                                                                                                                                                                                                                                  |
| Android     | 8.1                                                                                                                                                                                                                                                         |
| ABI         | armeabi-v7a                                                                                                                                                                                                                                                 |
| Sensores    | Temperatura, humedad, luz ambiental y proximidad documentadas; exposición mediante la API de Android sin verificar                                                                                                                                          |
| Relé        | 1 salida                                                                                                                                                                                                                                                    |
| Root        | No establecido en este modelo; no hay pruebas del tipo de compilación OTA específicas de este modelo                                                                                                                                                        |
| Lanzamiento | Hacia enero de 2025 (estimado); anunciado junto a la serie Gen4 de Shelly en CES 2025 ([página de prensa de Shelly para CES 2025](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)) |

Consulta la [página de la familia Wall Display](/es/hardware/panels/shelly/) para conocer el razonamiento completo sobre el modelo de acceso, los puntos de actualización OTA (canal `WallDisplay`) y el historial de versiones del firmware.

## Fuente

[Base de conocimientos del Shelly Wall Display X2](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
