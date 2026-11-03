---
title: Proximidad adaptativa y activación al pasar la mano
description: Cómo aprende el panel a interpretar su sensor de proximidad, qué comunica a Home Assistant y cómo se activa la pantalla al pasar la mano.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Los sensores de proximidad de los paneles murales Android no comparten una escala útil común. Algunos indican una distancia, otros solo indican dos valores, la polaridad puede estar invertida y las lecturas en reposo pueden presentar desviaciones entre unidades y versiones de firmware. La aplicación del panel utiliza el modelo calibrado del perfil de sensor activo, o un modelo que guardes mediante la configuración guiada, para interpretar su nivel de referencia, su referencia de proximidad y su polaridad.

![La configuración guiada de proximidad del panel, en el paso 3 de 7, que te pide que camines hacia el panel como lo harías normalmente mientras realiza una cuenta atrás](/es/screenshots/proximity-setup-screen-480.gif)

## Configuración guiada

Abre **Configurar** y luego **Presencia y activación** para ver si el perfil de sensor activo tiene un modelo utilizable. Si se ofrece la configuración, inicia allí la configuración guiada de proximidad y sigue las instrucciones en la propia pantalla del panel. La configuración mide la señal con el sensor despejado y los movimientos deliberados de la mano; revisa el resultado y guárdalo en el panel.

**Restaurar valores predeterminados del perfil** sustituye la calibración que hayas guardado por los valores predeterminados del perfil del sensor, cuando estén disponibles. Un sensor sin un modelo utilizable necesita una configuración guiada antes de que la activación por proximidad esté lista. La activación al tocar sigue estando disponible en los paneles con una vía de activación táctil validada.

## Entidades de Home Assistant

Cuando el modelo aprendido es fiable y el perfil de hardware activo ofrece una fuente de proximidad utilizable, el dispositivo del panel en Home Assistant obtiene:

- `binary_sensor.<panel>_proximity`, ocupación cercana o lejana aprendida; y
- `sensor.<panel>_proximity_level`, un valor normalizado de 0 (lejos) a 100 (cerca) en la misma escala para todos los paneles.

Ambas entidades permanecen no disponibles mientras no haya suficientes datos o el sensor no funcione correctamente. El panel no comunica un valor que parezca fiable a partir de un modelo en el que no confía. Un sensor que solo indica dos valores puede seguir proporcionando ocupación y gestos de activación, y el nivel solo se comunica cuando la señal realmente permite obtenerlo.

## Activación al pasar la mano

La opción **Activar al pasar la mano** utiliza el patrón de acercamiento o de movimiento de la mano validado por el perfil del sensor o la configuración guiada. Un patrón de una sola mano se activa al acercarse la mano; un patrón de doble movimiento de la mano comprueba los movimientos emparejados antes de activar la pantalla. La configuración y las fluctuaciones breves en reposo no generan solicitudes de activación.

Necesita una fuente de proximidad activa y un modelo aprendido que esté listo. La fuente puede ser un sensor Android convencional o una vía elegida por el perfil de hardware. La interfaz web y los diagnósticos del panel muestran la vía que se está utilizando realmente y si está lista; que un perfil declare un sensor no hace por sí solo que haya uno disponible.
