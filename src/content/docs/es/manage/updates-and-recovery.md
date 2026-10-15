---
title: Actualizaciones y recuperación
description: Cómo mantener actualizada la aplicación de un panel y qué se puede recuperar cuando algo falla.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

## Actualizar un panel

**Desde Home Assistant.** Cada panel tiene una entidad de actualización. Cuando se publica una versión más reciente, la entidad la ofrece y basta pulsar un botón para instalarla; Panel Assistant instala la actualización y confirma que el panel ha vuelto a funcionar correctamente. Esta es la vía que debes utilizar.

Una actualización empieza cuando Panel Assistant o tú la solicitáis expresamente. La aplicación del panel no instala actualizaciones programadas. La pestaña **Instalar** de su interfaz web también permite elegir e instalar una versión de la aplicación del panel, incluida una versión preliminar. Esa elección se aplica a la instalación que inicias; no hay ningún canal de actualización guardado.

El WebView del sistema Android se mantiene por separado, a través de Play Store, del firmware del fabricante o de una instalación manual, según corresponda a tu panel. Consulta [Actualizar el WebView del sistema](/es/hardware/guides/update-the-webview/).

### Paneles que necesitan ADB

Cuando instalas una actualización desde Home Assistant, Panel Assistant utiliza ADB automáticamente en los paneles que no pueden instalarla por sí mismos. Si el panel acepta la conexión sin pulsar en su pantalla, tu consentimiento original para instalar Panel Assistant también incluye crear y guardar una clave ADB para futuras actualizaciones. Si el panel requiere aprobación en su pantalla, Home Assistant muestra una reparación que identifica el panel e inicia la autorización. Sigue la reparación para aprobar la solicitud en ese panel.

### Un panel que no se puede actualizar

Algunos paneles solo se pueden actualizar mediante ADB porque no tienen forma de instalar una aplicación por sí mismos. En ellos, ADB no es una comodidad: es toda la vía de actualización y, si deja de funcionar, el panel sigue funcionando normalmente mientras permanece, sin avisar, en la versión que ya tiene. Home Assistant muestra una reparación que identifica el panel cuando esto ocurre.

La causa habitual es un cambio realizado en el panel, más que en Home Assistant. Una actualización del firmware del fabricante, un restablecimiento de fábrica o una opción del fabricante que restaura el software original pueden volver a deshabilitar las opciones para desarrolladores de Android y, con ellas, ADB. Nada te avisa en ese momento porque, desde el punto de vista del panel, no hay ningún problema.

Volver a habilitar las opciones para desarrolladores y la depuración USB restablece la vía de actualización, y los pasos son los mismos que al preparar ese panel por primera vez: consulta [Preparar un panel](/es/install/prepare-a-panel/#1-developer-options-and-debugging-are-on). La forma de acceder a esos ajustes varía entre paneles y algunos fabricantes los ocultan detrás de una secuencia de pulsaciones en una pantalla de información.

## Qué protege una actualización

Panel Assistant comprueba el panel antes de modificar nada y hace una copia de seguridad de su configuración antes de cada actualización, conservando las últimas cinco copias de cada panel.

Antes de un cambio del que no estés seguro, haz tú mismo una copia de seguridad: en la interfaz web del panel, abre **Instalar**, luego **Copia de seguridad**, y conserva el archivo `.hpb` descargado.

## Recuperación

Si un panel de control no se carga después de una actualización, el problema suele estar en el WebView del sistema o en el propio panel de control, y el panel tiene su propio comportamiento de [Inicio y recuperación](/es/manage/built-in-renderer/#startup-and-recovery) para esos casos. [Solución de problemas](/es/manage/troubleshooting/) explica las causas habituales. Volver a una versión anterior no es algo que la documentación describa actualmente, así que considera una exportación de la configuración como tu vía de recuperación.

La recuperación por debajo de la aplicación es otra cuestión. Panel Assistant nunca toca el firmware de un panel, pero en algunos paneles con acceso root se pueden hacer copias de seguridad de las particiones del firmware y restaurarlas manualmente; esto se documenta en [Copia de seguridad y restauración del firmware](/es/hardware/guides/firmware-backup-and-restore/).

:::danger
La restauración del firmware es experimental y no se ha probado en un dispositivo inutilizado. Considera que trabajar con las particiones de un panel puede dejarlo inutilizable y lee ese documento completo antes de empezar.
:::
