---
title: Actualizaciones y recuperación
description: Cómo mantener actualizada la aplicación de un panel y qué se puede recuperar cuando algo falla.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

## Actualizar un panel

**Desde Home Assistant.** Cada panel tiene una entidad de actualización. Cuando se publica una versión más reciente, la entidad la ofrece y basta pulsar un botón para instalarla; Panel Assistant instala la actualización y confirma que el panel ha vuelto a funcionar correctamente. Esta es la vía que debes utilizar. Las [notas de la versión](/es/release-notes/) indican qué ha cambiado en cada versión.

Una actualización empieza cuando Panel Assistant o tú la solicitáis expresamente. La aplicación del panel no instala actualizaciones programadas. Instala las actualizaciones de la aplicación del panel a través de Home Assistant. La pestaña **Instalar** del panel ya no ofrece un selector independiente de la versión de la aplicación.

Una actualización de la aplicación del panel iniciada desde Home Assistant también puede instalar un WebView del sistema verificado y compatible en los paneles compatibles. Si la fase del motor del navegador queda incompleta, utiliza la acción **Reintentar** de la reparación de actualización. Comprueba el trabajo existente antes de solicitar otro intento; no hay reintentos programados. Los demás paneles siguen necesitando Play Store, el firmware del fabricante o la vía manual descrita en [Actualizar el WebView del sistema](/es/hardware/guides/update-the-webview/).

Un panel compatible con root puede mantener ADB por red desactivado mientras Panel Assistant lo gestiona mediante la conexión autenticada de su aplicación. Las actualizaciones de la aplicación y el mantenimiento compatible utilizan esa conexión y el instalador privilegiado del panel. El servicio de recuperación local puede volver a abrir ADB por red si la conexión de la aplicación deja de renovarse o la recuperación lo requiere.

### Paneles que necesitan ADB

Cuando instalas una actualización desde Home Assistant, Panel Assistant utiliza ADB automáticamente en los paneles que no pueden instalarla por sí mismos. Si el panel acepta la conexión sin pulsar en su pantalla, tu consentimiento original para instalar Panel Assistant también incluye crear y guardar una clave ADB para futuras actualizaciones. Si el panel requiere aprobación en su pantalla, Home Assistant muestra una reparación que identifica el panel e inicia la autorización. Sigue la reparación para aprobar la solicitud en ese panel.

### Un panel que no se puede actualizar

Algunos paneles solo se pueden actualizar mediante ADB porque no tienen forma de instalar una aplicación por sí mismos. En ellos, ADB no es una comodidad: es toda la vía de actualización y, si deja de funcionar, el panel sigue funcionando normalmente mientras permanece, sin avisar, en la versión que ya tiene. Home Assistant muestra una reparación que identifica el panel cuando esto ocurre.

La causa habitual es un cambio realizado en el panel, más que en Home Assistant. Una actualización del firmware del fabricante, un restablecimiento de fábrica o una opción del fabricante que restaura el software original pueden volver a deshabilitar las opciones para desarrolladores de Android y, con ellas, ADB. Nada te avisa en ese momento porque, desde el punto de vista del panel, no hay ningún problema.

Volver a habilitar las opciones para desarrolladores y la depuración USB restablece la vía de actualización en la mayoría de los paneles, y los pasos son los mismos que al preparar ese panel por primera vez: consulta [Preparar un panel](/es/install/prepare-a-panel/#1-las-opciones-para-desarrolladores-y-la-depuración-están-activadas). La forma de acceder a esos ajustes varía entre paneles y algunos fabricantes los ocultan detrás de una secuencia de pulsaciones en una pantalla de información.

Si la reparación persiste o el panel desactiva por sí solo la depuración por red, como un Meta Portal después de un reinicio o un Shelly Wall Display después de un restablecimiento, conecta el panel a tu ordenador por USB e inicia el instalador USB desde Home Assistant, como se explica en [Instalar por USB](/es/install/install-over-usb/#todo-empieza-dentro-de-home-assistant). No hace falta quitar nada antes: en un panel que ya tiene la aplicación, el instalador no instala nada. Si el panel lo pide, marca **Permitir siempre desde este ordenador** y toca **Permitir**; el instalador vuelve a activar la depuración por red e indica que Panel Assistant puede acceder de nuevo al panel. A partir de ahí, Home Assistant ofrece la actualización del panel, que conserva su configuración e historial.

Si Home Assistant también muestra **Permitir actualizaciones en …** para el panel, se puede acceder a él, pero aún no ha aceptado este Home Assistant. Abre esa reparación o ve a **Configuración**, **Dispositivos y servicios**, **Panel Assistant**, selecciona **Configurar** para el panel y elige **Permitir actualizaciones**; después toca **Permitir** en el panel cuando lo pida.

## Qué protege una actualización

Panel Assistant comprueba el panel antes de modificar nada y hace una copia de seguridad de su configuración antes de cada actualización, conservando las últimas cinco copias de cada panel.

Antes de un cambio del que no estés seguro, haz tú mismo una copia de seguridad: en la interfaz web del panel, abre **Instalar**, luego **Copia de seguridad**, y conserva el archivo `.hpb` descargado.

## Recuperación

Si un panel de control no se carga después de una actualización, el problema suele estar en el WebView del sistema o en el propio panel de control, y el panel tiene su propio comportamiento de [Inicio y recuperación](/es/manage/built-in-renderer/#inicio-y-recuperación) para esos casos. [Solución de problemas](/es/manage/troubleshooting/) explica las causas habituales. Un panel con la aplicación del panel 1.0 no puede volver a una versión anterior; [Actualizar a 1.0](/es/manage/upgrade-to-1-0/#volver-atrás) explica qué se puede hacer.

La recuperación por debajo de la aplicación es otra cuestión. Panel Assistant nunca toca el firmware de un panel, pero en algunos paneles con acceso root se pueden hacer copias de seguridad de las particiones del firmware y restaurarlas manualmente; esto se documenta en [Copia de seguridad y restauración del firmware](/es/hardware/guides/firmware-backup-and-restore/).

:::danger
La restauración del firmware es experimental y no se ha probado en un dispositivo inutilizado. Considera que trabajar con las particiones de un panel puede dejarlo inutilizable y lee ese documento completo antes de empezar.
:::
