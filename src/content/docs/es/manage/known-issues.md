---
title: Problemas conocidos en 1.0.0-rc1
description: Limitaciones conocidas de Panel Assistant 1.0.0-rc1 y la aplicación del panel correspondiente, y qué hacer en cada caso.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0.0-rc1 y la aplicación del panel correspondiente son versiones candidatas. Esta página enumera las limitaciones conocidas y qué hacer en cada caso. Lee primero [Actualizar a 1.0](/es/manage/upgrade-to-1-0/): explica los requisitos previos a la instalación y por qué un panel con 1.0 no puede volver a 0.9. Informa de cualquier otro problema en el [seguimiento de incidencias](https://github.com/panel-assistant/ha-integration/issues), indicando el modelo del panel y qué has observado.

## Un panel que aún usa la aplicación 0.9 puede necesitar que se restablezca su conexión ADB

La reparación que indica que un panel necesita la aplicación 1.0.0-rc1 significa que su aplicación todavía no puede comunicarse con Panel Assistant 1.0. Si Home Assistant también indica que el panel no puede recibir actualizaciones de la aplicación, sigue esa reparación para restablecer su vía de actualización. En un panel con la depuración por red desactivada, conéctalo al ordenador e inicia el instalador USB desde Home Assistant, como se describe en [un panel que no puede actualizarse](/es/manage/updates-and-recovery/#un-panel-que-no-se-puede-actualizar). Si el panel ya tiene la aplicación, el instalador USB puede volver a conectarlo sin reinstalarla: si se solicita, marca **Permitir siempre desde este ordenador** y pulsa **Permitir** en el panel. El instalador vuelve a activar la depuración por red para que Home Assistant pueda actualizar la aplicación.

## La barra lateral no puede abrir un panel hasta que ejecute la aplicación 1.0

En 1.0, la barra lateral de Panel Assistant muestra las páginas del panel mediante la propia conexión del panel a Home Assistant. Un panel que aún usa una aplicación 0.9 no puede abrir sus páginas allí. Actualiza primero la aplicación del panel.

## La voz se activa cuando el perfil del dispositivo declara un micrófono

La voz se activa de forma predeterminada si el perfil del dispositivo del panel declara un micrófono, salvo que ya la hubieras desactivado. Si no quieres que el panel escuche una palabra de activación, desactiva **Asistente de voz** en **Voz**, dentro de la página **Configurar** del panel.

## Puede necesitarse el PIN de bloqueo después de apagar completamente la pantalla

En los paneles cuya vía de apagado de pantalla utiliza el tiempo de espera de Android o la administración del dispositivo, puede ser necesario introducir el PIN de bloqueo configurado al encenderse la pantalla. Elimina el PIN si quieres que el panel muestre directamente el panel de control al activarse.

## Se han eliminado dos entidades

Se ha eliminado la entidad de imagen independiente para las instantáneas de la cámara; utiliza la entidad de cámara del panel. En los paneles con altavoz se ha eliminado el número de volumen independiente; utiliza el volumen del reproductor multimedia con `media_player.volume_set`. Una reparación identifica las automatizaciones y los scripts que todavía utilizan el número de volumen. No hay una reparación equivalente para la imagen de instantánea eliminada, así que comprueba tú mismo qué la utiliza.

## Restaurar una copia de seguridad en un panel sin root puede omitir ajustes

Una copia de ajustes tomada en un panel con root puede contener ajustes que un panel sin root no puede aplicar. La restauración enumera los ajustes no disponibles que omite y aplica los compatibles. Comprueba el resultado de la restauración para detectar ajustes omitidos o fallos.
