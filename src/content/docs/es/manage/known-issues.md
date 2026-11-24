---
title: Problemas conocidos
description: Limitaciones conocidas de Panel Assistant y la aplicación del panel correspondiente, y qué hacer en cada caso.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Esta página enumera las limitaciones conocidas y qué hacer en cada caso. Informa de cualquier otro problema en el [seguimiento de incidencias](https://github.com/panel-assistant/ha-integration/issues), indicando el modelo del panel y qué has observado.

## La voz se activa cuando el perfil del dispositivo declara un micrófono

La voz se activa de forma predeterminada si el perfil del dispositivo del panel declara un micrófono, salvo que ya la hubieras desactivado. Si no quieres que el panel escuche una palabra de activación, desactiva **Asistente de voz** en **Voz**, dentro de la página **Configurar** del panel.

## Puede necesitarse el PIN de bloqueo después de apagar completamente la pantalla

En los paneles cuya vía de apagado de pantalla utiliza el tiempo de espera de Android o la administración del dispositivo, puede ser necesario introducir el PIN de bloqueo configurado al encenderse la pantalla. Elimina el PIN si quieres que el panel muestre directamente el panel de control al activarse.

## Se han eliminado dos entidades

Se ha eliminado la entidad de imagen independiente para las instantáneas de la cámara; utiliza la entidad de cámara del panel. En los paneles con altavoz se ha eliminado el número de volumen independiente; utiliza el volumen del reproductor multimedia con `media_player.volume_set`. Una reparación identifica las automatizaciones y los scripts que todavía utilizan el número de volumen. No hay una reparación equivalente para la imagen de instantánea eliminada, así que comprueba tú mismo qué la utiliza.

## Restaurar una copia de seguridad en un panel sin root puede omitir ajustes

Una copia de ajustes tomada en un panel con root puede contener ajustes que un panel sin root no puede aplicar. La restauración enumera los ajustes no disponibles que omite y aplica los compatibles. Comprueba el resultado de la restauración para detectar ajustes omitidos o fallos.
