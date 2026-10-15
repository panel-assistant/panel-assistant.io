---
title: Tamaño de pantalla
description: Cómo ajustar el tamaño de un panel de control de Home Assistant en un panel para que coincida con su aspecto en un navegador de escritorio, mediante la densidad y el tamaño del texto.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Un panel de control de Home Assistant diseñado en un navegador de escritorio suele mostrarse con un tamaño incorrecto en un panel de pared Android: tarjetas demasiado grandes con bordes recortados, o demasiado pequeñas. Un teléfono suele mantener un aspecto bastante parecido al del escritorio, pero los paneles a menudo no lo hacen porque sus fabricantes establecen una densidad del sistema y una escala de fuente poco adecuadas para la pantalla física. La aplicación del panel ofrece dos controles, **densidad (DPI)** y **tamaño del texto (escala de fuente)**, en **Instalar**, luego **Tamaño de pantalla**, para ajustar de nuevo el diseño y el texto. Normalmente necesitas ambos.

:::caution[Experimental]
Los controles funcionan, pero aún no se han establecido los valores adecuados para cada panel. Considera la densidad y el tamaño del texto como algo con lo que experimentar, más que como una función terminada. Se agradecen comentarios sobre valores que funcionen bien en un panel concreto.
:::

## Cómo utilizarlo

La tarjeta **Tamaño de pantalla** de la pestaña **Instalar** del panel establece una densidad lógica y un tamaño del texto personalizados, los aplica en directo o restablece la densidad base de fábrica de Android. Ambos ajustes se conservan tras un reinicio porque son ajustes del sistema Android.

:::note
Esto requiere una vía con privilegios aprobada: normalmente el `su` del fabricante o el [asistente root](https://github.com/panel-assistant/android/blob/main/helper/README.md). Un panel compatible sin root cuyo acceso mejorado opcional ya se haya aprobado en el propio panel también puede realizar estos cambios exactos de pantalla. Si no hay ninguna vía compatible lista, la tarjeta sigue visible, pero bloqueada.
:::

Para ajustarlo, abre el mismo panel de control en un navegador de escritorio como referencia. Reduce la densidad hasta que el diseño coincida (cabrán más tarjetas) y luego ajusta ligeramente el tamaño del texto hasta que coincida. Los valores adecuados dependen de la instalación (la resolución del panel, la distancia a la que se sitúan las personas y el diseño del panel de control), más que del modelo, por lo que no se incluyen valores estándar.

## Los dos controles

| Control                                 | Qué cambia                                                                                                                                                                                                                                      | Mecanismo                            |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Densidad (DPI)**                      | El diseño completo. El área de visualización efectiva en dp es `physical px ÷ (density / 160)`. Una densidad menor permite mostrar más contenido, acercándose al área de visualización más ancha de un escritorio; una mayor aumenta el tamaño. | `wm density <n>`                     |
| **Tamaño del texto (escala de fuente)** | El texto del panel de control. La escala de fuente del sistema Android se convierte en el `textZoom` del WebView (`textZoom = scale × 100`).                                                                                                    | `settings put system font_scale <f>` |

La salida de `wm density` de Android llama al valor base de fábrica `Physical density`. Esa etiqueta es engañosa: es la densidad que Android utiliza para el diseño cuando se restablece una modificación, no una medición de los píxeles por pulgada de la pantalla. La aplicación del panel lo muestra como **base de fábrica** y solo muestra un PPI físico para perfiles de hardware cuyas dimensiones de pantalla se hayan comprobado de forma independiente.

Cambiar solo la densidad ajusta la escala del diseño, pero puede dejar el texto con un tamaño incorrecto en comparación con el escritorio; la escala de fuente corrige el texto. Ajustar ambos a la vez es lo que hace que un panel coincida con el navegador en el que se diseñó el panel de control.
