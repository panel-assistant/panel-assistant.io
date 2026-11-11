---
title: Preparar el panel
description: Qué necesita un panel para instalar Panel Assistant y cómo la actualización de WebView determina si el primer panel de control se ve correctamente.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Hay un requisito antes de añadir un panel y otro que determina si el primer panel de control se ve correctamente. La vía depende del modelo y del firmware.

## 1. Las opciones para desarrolladores y la depuración están activadas

El instalador se comunica con el panel mediante la interfaz de depuración de Android, que los fabricantes pueden desactivar o restringir. En la mayoría de los paneles, abre **Ajustes**, después **Información** y pulsa **Número de compilación** siete veces hasta que el panel indique que eres desarrollador; entonces aparecerán las **Opciones para desarrolladores** en Ajustes. Algunos fabricantes ocultan esta opción o cambian su nombre, y las [páginas de hardware](/es/hardware/) ofrecen los pasos conocidos e indican los procedimientos que no se han verificado. En las opciones para desarrolladores, activa la **Depuración USB** para la [vía USB](/es/install/install-over-usb/), o **ADB por red en el puerto TCP 5555** para la vía de red. No todos los paneles tienen un interruptor para ADB por red; la página de hardware de tu modelo indica si lo tiene y, si no existe, utiliza la vía USB una vez que esté disponible la depuración USB. Si el acceso USB tampoco está verificado, pide al proveedor instrucciones para tu modelo y firmware antes de elegir cualquiera de los instaladores. El acceso root es independiente: un comando `adb root` presupone que la depuración ya funciona. La función de depuración inalámbrica con emparejamiento de Android es un método de conexión diferente y este instalador no la admite.

Si el panel pide autorización para la conexión, alguien debe aceptar la solicitud en la propia pantalla del panel; no se puede aceptar a distancia.

El panel no necesita una dirección fija: Panel Assistant sigue encontrándolo si cambia su dirección.

## 2. El WebView del sistema está actualizado

El WebView del sistema del panel, también llamado motor del navegador, dibuja el panel de control. Un WebView antiguo puede dejarlo en blanco o dibujarlo solo parcialmente.

Tanto el instalador de red como el USB pueden solicitar una actualización verificada y compatible del motor del navegador en los paneles compatibles. Si la actualización no puede terminar, la configuración y el emparejamiento siguen disponibles. Un intento incompleto puede continuarse desde la reparación de actualización del panel en Home Assistant: elige **Reintentar**. Comprueba el trabajo existente antes de solicitar otro intento; las actualizaciones fallidas no se reintentan de forma programada.

El asistente de configuración avisa si el motor del navegador integrado es demasiado antiguo. Puedes terminar la configuración y el emparejamiento, pero el panel de control puede seguir sin mostrarse. Si el panel no puede instalar la actualización, sigue [Actualizar el WebView del sistema](/es/hardware/guides/update-the-webview/).

## Antes de hacer un cambio irreversible

Panel Assistant no flashea ni rootea nada por sí mismo. Algunos paneles pueden rootearse o flashearse manualmente, y algunos de esos cambios son reversibles y otros no. Si vas a seguir esa vía, lee primero [Seguridad de la instalación](/es/manage/install-safety/) y consulta [Actualizaciones y recuperación](/es/manage/updates-and-recovery/) para saber qué puede guardarse en una copia de seguridad y qué no.
