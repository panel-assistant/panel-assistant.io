---
title: La carrera
description: Dos paneles de pared idénticos, el mismo panel de control y las mismas pulsaciones al mismo tiempo. Uno ejecuta la aplicación Companion de Home Assistant tal como viene de fábrica; el otro, Panel Assistant. Mediciones, vídeos y por qué la latencia importa más que el cronómetro.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Dos Sonoff NSPanel Pro 86, uno junto al otro, conectados al mismo Home Assistant y mostrando copias idénticas del mismo panel de control. Un script pulsa ambas pantallas al mismo tiempo, página tras página, y el reloj bajo cada panel se detiene cuando esa pantalla ha respondido. El panel izquierdo ejecuta la aplicación Companion de Home Assistant con el motor web incluido en el firmware del panel. El derecho ejecuta Panel Assistant con el motor web que instala para sí mismo. Después intercambian sus funciones y se repite la carrera, para que la velocidad propia de cada panel no incline el resultado.

## Renderizado: aproximadamente el doble de rápido

![Vídeo A: el primer panel con la aplicación Companion y el segundo con Panel Assistant, compitiendo al mismo tiempo](/screenshots/drag-race-film-a.gif)

Siete pulsaciones: tres cambios de página, una vuelta al inicio y tres pulsaciones en una tarjeta de luz. Tres ejecuciones en cada sentido; los vídeos muestran la ejecución mediana y los paneles intercambian sus funciones entre ambos vídeos.

|                                                  | Aplicación Companion, motor web del firmware | Panel Assistant, su propio motor web |
| ------------------------------------------------ | -------------------------------------------- | ------------------------------------ |
| Primera disposición, mediana de tres ejecuciones | 11.7 s                                       | 6.4 s                                |
| Segunda disposición, paneles intercambiados      | 14.3 s                                       | 6.1 s                                |
| Procesador utilizado por los procesos de dibujo  | 1.3 a 1.5 núcleos                            | 0.4 a 0.6 núcleos                    |
| Frecuencia de fotogramas de la página en reposo  | 5 fotogramas por segundo                     | 59 fotogramas por segundo            |
| Entidades que sigue la página                    | 4,118                                        | 54                                   |

La página bajo Panel Assistant solo sigue las entidades que muestra. Bajo la aplicación Companion recibe todos los cambios de estado de la casa, miles de entidades, y dedica la mayor parte de su tiempo a procesarlos. Por eso la misma página se dibuja a cinco fotogramas por segundo en un panel y a sesenta en el otro, y por eso los procesos de dibujo consumen dos veces y media más procesador.

![Vídeo B: los paneles intercambiados, el segundo con la aplicación Companion y el primero con Panel Assistant](/screenshots/drag-race-film-b.gif)

## Latencia: el verdadero problema

El doble de rápido en un cronómetro es una mejora modesta. No es lo que percibes en la pared. Lo que percibes es el momento en que pulsas un botón y no pasa nada.

Pulsas. Esperas que algo cambie. Tras más de medio segundo sin reacción, decides que no has acertado y vuelves a pulsar. Ahora llegan ambas pulsaciones: la luz se enciende y se apaga inmediatamente, o aparece la página que pediste y la sustituye la que solicitó la segunda pulsación. Hiciste todo bien y obtuviste lo contrario de lo que querías. Un panel así es inutilizable y, al cabo de una semana, nadie en casa confía en él.

![La doble pulsación: la misma pulsación sobre la misma luz en ambos paneles, con la regla humana de volver a pulsar tras un segundo sin reacción](/screenshots/drag-race-double-press.gif)

Los mismos dos paneles, la misma tarjeta de luz y la luz apagada en ambos. Un dedo pulsa la luz y sigue la regla que seguiría cualquiera: si nada ha cambiado tras un segundo, vuelve a pulsar, hasta tres veces.

|                                                      | Aplicación Companion, motor web del firmware                               | Panel Assistant, su propio motor web |
| ---------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------ |
| Luz visiblemente encendida tras la primera pulsación | 15.2 s, tras tres pulsaciones                                              | 0.3 s, tras una pulsación            |
| Las otras dos tomas                                  | 7 s tras una pulsación; todavía cargando la página, tres pulsaciones, nada | 0.3 s tras una pulsación, siempre    |

Quince segundos son suficientes para que hayas desistido y te hayas alejado del panel, y entonces la luz se encienda a tus espaldas. La página bajo la aplicación Companion no estaba averiada: estaba ocupada procesando el flujo de estados de toda la casa en un panel de cuatro núcleos, y la pulsación esperaba su turno detrás de ese trabajo. La página de Panel Assistant solo tenía que atender sus propias entidades, así que la pulsación se procesó de inmediato.

## Cómo se midió

- Dos Sonoff NSPanel Pro 86 (Rockchip PX30 de cuatro núcleos, pantallas de 480 por 480) en un Home Assistant de producción con unas 4,100 entidades y unos 20 cambios de estado por segundo.
- Dos copias de un panel de control, idénticas salvo por la luz detrás de una tarjeta, para que los dos paneles nunca compitan por una misma entidad.
- La aplicación Companion 2026.6.5 con el motor web del firmware, Chromium 107, que sigue siendo el que ejecutan la mayoría de los paneles instalados. Panel Assistant con Chromium 138, el motor web compatible utilizado en estas ejecuciones.
- Pulsaciones inyectadas como eventos de pantalla sin procesar en el mismo instante en ambos paneles. Cada paso lo registra el propio panel; el reloj cuenta desde la pulsación hasta que la pantalla deja de cambiar. Si un paso sigue cambiando cuando termina su clip, la ejecución se invalida.
- Tres ejecuciones en cada sentido, con la mediana grabada. Se retiró de la carrera una tarjeta de música que descargaba letras de internet, porque ninguna aplicación del panel puede acelerar un servicio externo; la página de cámara en directo se excluyó porque su tiempo corresponde al establecimiento del flujo, no al trabajo del panel de control.

Puedes consultar el uso de CPU, la capacidad de respuesta del panel de control y el flujo de estados de Home Assistant de tu propio panel en **Rendimiento** de su interfaz web; consulta [Rendimiento](/es/manage/performance/) para saber cómo interpretar esas mediciones.
