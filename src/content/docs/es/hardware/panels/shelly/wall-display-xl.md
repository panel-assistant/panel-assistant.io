---
title: Shelly Wall Display XL
description: Datos de hardware del Shelly Wall Display XL, un panel RK3566 de 10.1 pulgadas con Android 11, nombre en clave Blake.
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 pulgadas
support: Sin probar
root: No establecido en este modelo
webview: 'No establecido (el canal WallDisplayV2 no incluye un paquete OTA de WebView)'
released: '2025-09 (estimado)'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL, vista frontal
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL, vista frontal de la pantalla
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL, vista lateral que muestra la profundidad de montaje
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**No se ha probado ninguna unidad de este modelo.** Consulta la [página de la familia Wall Display](/es/hardware/panels/shelly/) para conocer las fuentes, el mecanismo OTA del firmware, el modelo de acceso y las notas de seguridad compartidas por toda la línea.
:::

El Wall Display XL, con nombre en clave de firmware **Blake**, es un panel de 10.1 pulgadas con Rockchip RK3566 (Cortex-A55) y Android 11: el modelo más grande y potente de la [familia Shelly Wall Display](/es/hardware/panels/shelly/). Utiliza el canal OTA moderno **WallDisplayV2** (arm64-v8a), junto con el [X1i](/es/hardware/panels/shelly/wall-display-x1i/), el [X2i](/es/hardware/panels/shelly/wall-display-x2i/), Maverick y Dayna, y tiene acceso a la AppStore integrada.

## Acceso inicial de depuración

**ADB por red en el puerto TCP 5555 sin ordenador: no establecido en este modelo.** La depuración USB inicial y el desbloqueo desde el menú del fabricante tampoco están verificados aquí. El [procedimiento del X2i](/es/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) solo está confirmado en el X2i; compartir firmware no demuestra que funcione aquí. Pide a Shelly el procedimiento para tu modelo y firmware. Utiliza el [instalador USB](/es/install/install-over-usb/) únicamente cuando estén disponibles la depuración USB y una conexión de datos USB. Una compilación con capacidad root no habilita por sí sola la depuración.

## También se vende como

Shelly Wall Display XL, nombre en clave del firmware Blake.

|             |                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                                                                                                                                                             |
| Pantalla    | 10.1 pulgadas                                                                                                                                                                                                                                                                                                                                                                               |
| Android     | 11                                                                                                                                                                                                                                                                                                                                                                                          |
| ABI         | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                                   |
| Sensores    | Luz ambiental documentada; un sensor de movimiento (oficial, tecnología exacta sin verificar); exposición mediante la API de Android sin verificar                                                                                                                                                                                                                                          |
| Relé        | 1 salida                                                                                                                                                                                                                                                                                                                                                                                    |
| Root        | No establecido en este modelo; la OTA moderna no declara el tipo de compilación. En un [Wall Display X2i](/es/hardware/panels/shelly/wall-display-x2i/) probado con firmware de fábrica 2.5.4, las opciones para desarrolladores y la depuración USB se desbloquean desde la aplicación Ajustes y después adb se conecta, aún sin root; no se ha probado si ocurre lo mismo en este modelo. |
| Lanzamiento | Hacia septiembre de 2025 (estimado); Shelly lanzó el XL en Europa alrededor del 10 de septiembre de 2025 ([noticia del lanzamiento, Notebookcheck, septiembre de 2025](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html))                                                                                                                    |

:::caution
El navegador de Home Assistant integrado en el XL tuvo problemas de renderizado y disposición con el frontend de Home Assistant 2025.12 y una versión preliminar de 2026.1 (registrados en [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) y `#28746`; compatibilidad del núcleo en [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). Una aplicación que utilizaba el WebView del sistema en el mismo dispositivo renderizaba correctamente, lo que demuestra que el problema era específico del WebView del navegador integrado y no del hardware.
:::

Desde Panel Assistant 1.0, el XL utiliza el perfil compartido de Shelly, que recoge lo que mostró el [X2i](/es/hardware/panels/shelly/wall-display-x2i/) sobre este firmware: apagado completo de pantalla sin root, y Atrás e Inicio sin Recientes. Sus propios sensores se comprueban en el panel al iniciarse Panel Assistant. Todavía no se ha confirmado ningún XL, por lo que agradecemos los informes de sus propietarios; consulta [Qué significa el X2i para el resto de la línea](/es/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Consulta la [página de la familia Wall Display](/es/hardware/panels/shelly/) para conocer el razonamiento completo sobre el modelo de acceso, los puntos de actualización OTA (canal `WallDisplayV2`) y el historial de versiones del firmware.

## Fuente

[Base de conocimientos del Shelly Wall Display XL](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
