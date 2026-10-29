---
title: Shelly Wall Display X1i
description: Datos de hardware del Shelly Wall Display X1i, un panel RK3326-S de 4 pulgadas con Android 11, nombre en clave Cally.
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 pulgadas, 720 × 720
support: Sin probar
root: No establecido en este modelo
webview: 'No establecido (el canal WallDisplayV2 no incluye un paquete OTA de WebView)'
released: '2026-07 (estimado)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x1i-front.jpg'
    alt: Shelly Wall Display X1i, vista frontal
  - src: 'asset:hardware-shelly-wall-display-x1i-silver.jpg'
    alt: Shelly Wall Display X1i, acabado plateado, vista frontal
  - src: 'asset:hardware-shelly-wall-display-x1i-rear-label.jpg'
    alt: Shelly Wall Display X1i, vista trasera que muestra la etiqueta del modelo SAWD-6A1XX10EU0
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display X1i
  order: 3
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**No se ha probado ninguna unidad de este modelo.** Consulta la [página de la familia Wall Display](/es/hardware/panels/shelly/) para conocer las fuentes, el mecanismo OTA del firmware, el modelo de acceso y las notas de seguridad compartidas por toda la línea.
:::

El Wall Display X1i, con nombre en clave de firmware **Cally**, es un panel de 4 pulgadas y 720×720 con Rockchip RK3326-S (Cortex-A35) y Android 11. Utiliza el canal OTA moderno **WallDisplayV2** (arm64-v8a), junto con el [X2i](/es/hardware/panels/shelly/wall-display-x2i/), el [XL](/es/hardware/panels/shelly/wall-display-xl/), Maverick y Dayna, y tiene acceso a la AppStore integrada.

## Acceso inicial de depuración

**ADB por red en el puerto TCP 5555 sin ordenador: no establecido en este modelo.** La depuración USB inicial y el desbloqueo desde el menú del fabricante tampoco están verificados aquí. El [procedimiento del X2i](/es/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) solo está confirmado en el X2i; compartir firmware no demuestra que funcione aquí. Pide a Shelly el procedimiento para tu modelo y firmware. Utiliza el [instalador USB](/es/install/install-over-usb/) únicamente cuando estén disponibles la depuración USB y una conexión de datos USB. Una compilación con capacidad root no habilita por sí sola la depuración.

## También se vende como

Shelly Wall Display X1i, nombre en clave del firmware Cally.

|             |                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **RK3326-S**, Cortex-A35                                                                                                                                                                                                                                                                                                                                                           |
| Pantalla    | **720×720 cuadrada**, 4 pulgadas                                                                                                                                                                                                                                                                                                                                                            |
| Android     | 11                                                                                                                                                                                                                                                                                                                                                                                          |
| ABI         | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                                   |
| Sensores    | Luz ambiental y proximidad documentadas; sin sensor de temperatura ni humedad; exposición mediante la API de Android sin verificar                                                                                                                                                                                                                                                          |
| Relé        | Base intercambiable: 1 salida de serie, base opcional de 2 salidas                                                                                                                                                                                                                                                                                                                          |
| Root        | No establecido en este modelo; la OTA moderna no declara el tipo de compilación. En un [Wall Display X2i](/es/hardware/panels/shelly/wall-display-x2i/) probado con firmware de fábrica 2.5.4, las opciones para desarrolladores y la depuración USB se desbloquean desde la aplicación Ajustes y después adb se conecta, aún sin root; no se ha probado si ocurre lo mismo en este modelo. |
| Lanzamiento | Hacia julio de 2026 (estimado); Shelly anunció el X1i el 15 de julio de 2026 ([noticia del lanzamiento, TechBuzz Ireland, julio de 2026](https://techbuzzireland.com/2026/07/15/shelly-expands-its-smart-home-portfolio-with-wall-display-x1i-and-blu-motion-zb/))                                                                                                                          |

Desde Panel Assistant 1.0, el X1i utiliza el perfil compartido de Shelly, que recoge lo que mostró el [X2i](/es/hardware/panels/shelly/wall-display-x2i/) sobre este firmware: apagado completo de pantalla sin root, y Atrás e Inicio sin Recientes. Sus propios sensores se comprueban en el panel al iniciarse Panel Assistant. Todavía no se ha confirmado ningún X1i, por lo que agradecemos los informes de sus propietarios; consulta [Qué significa el X2i para el resto de la línea](/es/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Consulta la [página de la familia Wall Display](/es/hardware/panels/shelly/) para conocer el razonamiento completo sobre el modelo de acceso, los puntos de actualización OTA (canal `WallDisplayV2`) y el historial de versiones del firmware.

## Fuente

[Base de conocimientos del Shelly Wall Display X1i](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
