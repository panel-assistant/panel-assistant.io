---
title: Shelly Wall Display (original)
description: Datos de hardware del Shelly Wall Display original, un panel MT6580 de 4 pulgadas con Android 7, nombre en clave Stargate.
vendor: Shelly
model: Wall Display (original)
soc: MT6580
android: '7.0'
screen: 4 pulgadas, 480 × 480
support: Investigación
root: No establecido; compilación base userdebug, sin confirmar
webview: 'com.google.android.webview 119.0.6045.194 mediante ZIP oficial'
released: '2023-09 (estimado)'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: Shelly Wall Display, modelo original, con su accesorio sensor H&T
  - src: 'asset:hardware-shelly-wall-display-rear-label.jpg'
    alt: Shelly Wall Display, vista trasera con la etiqueta del modelo y la caja de pared
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display (original)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Solo investigación: no se ha probado ninguna unidad de este modelo.** Consulta la [página de la familia Wall Display](/es/hardware/panels/shelly/) para conocer las fuentes, el mecanismo OTA del firmware, el modelo de acceso y las notas de seguridad compartidas por toda la línea.
:::

:::caution
**Viene con Android 7.0**, inferior a la versión mínima de Android compatible con Panel Assistant.
:::

El Wall Display original, con nombre en clave de firmware **Stargate**, es el modelo de entrada de la [familia Shelly Wall Display](/es/hardware/panels/shelly/): un panel de 4 pulgadas y 480×480 con MediaTek MT6580 y Android 7. Utiliza el canal OTA antiguo **WallDisplay** (armeabi-v7a), junto con el [X2](/es/hardware/panels/shelly/wall-display-x2/).

## Acceso inicial de depuración

**ADB por red en el puerto TCP 5555 sin ordenador: no establecido en este modelo.** La depuración USB inicial y el desbloqueo desde el menú del fabricante tampoco están verificados aquí. El [procedimiento del X2i](/es/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) solo está confirmado en el X2i; compartir firmware no demuestra que funcione aquí. Pide a Shelly el procedimiento para tu modelo y firmware. Utiliza el [instalador USB](/es/install/install-over-usb/) únicamente cuando estén disponibles la depuración USB y una conexión de datos USB. Una compilación con capacidad root no habilita por sí sola la depuración.

## También se vende como

Shelly Wall Display, SAWD-0A1XX10EU1, nombre en clave del firmware Stargate, ID de dispositivo k400_mt6580_32_n.

|             |                                                                                                                                                                                                                                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | MediaTek **MT6580**                                                                                                                                                                                                                                                                                                    |
| Pantalla    | **480×480 cuadrada**, 4 pulgadas                                                                                                                                                                                                                                                                                       |
| Android     | 7.0                                                                                                                                                                                                                                                                                                                    |
| ABI         | armeabi-v7a                                                                                                                                                                                                                                                                                                            |
| Sensores    | Temperatura, humedad y luz ambiental documentadas; exposición mediante la API de Android sin verificar                                                                                                                                                                                                                 |
| Relé        | 1 salida                                                                                                                                                                                                                                                                                                               |
| WebView     | No está en la OTA estándar; Shelly publica un ZIP independiente que instala `com.google.android.webview` **119.0.6045.194**                                                                                                                                                                                            |
| Root        | No establecido en este modelo. La OTA declara una compilación base `userdebug` (`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`), por lo que `adb root` podría funcionar **si** se consigue una conexión adb, aunque no se ha confirmado en una unidad.                                                   |
| Lanzamiento | Hacia septiembre de 2023 (estimado); Shelly presentó por primera vez Wall Display en IFA Berlín en septiembre de 2023 ([noticia de los productos de Shelly en IFA Berlín 2023, Maison et Objet Domotique](https://www.maison-et-domotique.com/en/157856-shelly-11-new-products-in-wi-fi-bluetooth-and-zwave-ifa2023/)) |

Consulta la [página de la familia Wall Display](/es/hardware/panels/shelly/) para conocer el razonamiento completo sobre el modelo de acceso, los puntos de actualización OTA (canal `WallDisplay`) y el historial de versiones del firmware.

## Fuente

[Base de conocimientos del Shelly Wall Display](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
