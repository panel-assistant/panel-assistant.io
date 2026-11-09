---
title: Rendimiento
description: Por qué un panel de pared puede ir lento con un panel de control que funciona bien en un teléfono, cómo medirlo y las soluciones por orden de impacto.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Un panel Android económico puede responder lentamente, dar tirones al desplazarse, quedarse en blanco o dejar de actualizarse aunque el mismo panel de control funcione bien en un teléfono u ordenador. Empieza por el trabajo que Home Assistant envía al panel y después mide lo que queda del panel de control y los límites del hardware antes de suponer que hay que sustituirlo.

:::tip
Una causa habitual es la cantidad de estados y actualizaciones de entidades que recibe el panel de control. [La carrera](/es/manage/drag-race/) muestra su coste en dos paneles idénticos filmados juntos. Una instalación grande puede obligar a un panel poco potente a procesar miles de entidades que nunca muestra. Con el [renderizador integrado](/es/manage/built-in-renderer/), la primera solución que conviene probar es el filtrado de entidades.
:::

## Mide antes de cambiar nada

Usa **Visitar** en la página de dispositivo del panel en Home Assistant para abrir su interfaz web (por ejemplo, `http://<panel-ip>:8888/` con el puerto predeterminado). Registra la misma vista durante un periodo similar antes y después de cada cambio para que la comparación tenga sentido.

- **Fluidez del panel de control**: latencia real de interacción, interacción más lenta desglosada en entrada, procesamiento y presentación, bloqueo del hilo principal, tiempo hasta poder interactuar y recargas inesperadas.
- **Flujo de estados de Home Assistant**: actualizaciones por segundo, tasa de datos JSON sin comprimir, tamaño de hidratación inicial, tiempo hasta que el hilo principal cede el control y las tres entidades con mayor volumen total de datos en la última hora; también se muestra su frecuencia de actualización.
- **Rendimiento** y **Procesos principales**: CPU, GPU, RAM, velocidad de reloj, temperatura y procesos más ocupados.
- **Transmisión de la cámara**, si el panel ofrece cámara: suscriptores que mantienen abierta la sesión, codificador usado, frecuencia solicitada junto a la entregada y tasa de bits entregada junto al límite del codificador. Se informa si la frecuencia es mucho menor que la solicitada, sin atribuir causa: el ritmo de captura con poca luz, la vía de codificación y la competencia por el hardware de vídeo son posibilidades entre las que la tarjeta no adivina. Nunca se reduce la solicitud silenciosamente: si la sesión no puede dar la frecuencia pedida, muestra la solicitud junto a la frecuencia asignada al codificador. La tarjeta no indica CPU deliberadamente: la codificación por hardware trabaja en el códec y el compositor además de en la app, y ningún proceso representa todo su coste. Consulta la carga total en Rendimiento y Procesos principales.
- **Página Entidades**: suscripción actual del renderizador integrado, lo encontrado por el aprendizaje automático y reglas pendientes de decisión.
- **Informe de diagnóstico** (`/diag`): informe que puedes copiar en un reporte de error si la causa sigue sin estar clara.

El renderizador integrado recoge directamente estas mediciones del navegador sin root ni depuración WebView. Con otra app, la app del panel puede mostrar CPU del renderizador y métricas de dibujo Android si hay root o auxiliar, pero no medir su latencia real de interacción.

La cifra del hilo principal para eventos de estado empieza al despacharse un mensaje relevante de Home Assistant y termina cuando el navegador cede el control después de todos sus manejadores y microtareas. Incluye el pequeño coste del observador y cualquier otro trabajo de esa tarea; por eso no se etiqueta como tiempo exclusivo de Home Assistant. La tasa de datos es el JSON sin comprimir que procesa el frontend, no el tráfico de red comprimido.

Busca correlaciones en la gráfica alineada. Picos de interacción junto a tráfico intenso y ocupación por eventos de estado apuntan al tamaño del flujo. Procesamiento lento con poco tráfico apunta al JavaScript del panel de control. Retrasos de presentación y fotogramas de dibujo largos apuntan a distribución, animación, cámaras o medios. Recargas repetidas apuntan a memoria o inestabilidad. Lee las mediciones juntas: una captura de CPU aislada no identifica la causa.

**Causa probable** aplica estas reglas con prudencia e indica su confianza. Si las pruebas no respaldan una causa dominante, lo dice.

### Comparar con y sin filtro desde fuera del panel

Si el panel de control sin filtrar sobrecarga su WebView, sus cifras pueden dejar de actualizarse. Un script recolector en un equipo consulta en cambio la interfaz de rendimiento de la app, parte de la API REST obsoleta (consulta la [referencia de control](/es/reference/api/#la-api-rest-está-obsoleta)). Así sigue observándose la CPU total y, con root o auxiliar, un sondeo nativo del hilo del renderizador Chromium. También registra la antigüedad del último lote de mediciones del navegador: más de 15 segundos se considera bloqueado, no actual.

El recolector no cambia la configuración. Nunca activa, desactiva ni reescribe el filtro; su primera petición puede crear una clave privada de instalación en el estado interno de la app. Selecciona la misma vista y carga para ambas ejecuciones, cambia el filtro en la interfaz web, espera a la recarga y ejecuta un comando desde una copia del [repositorio de ha-paneld](https://github.com/panel-assistant/android) para cada estado:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Compara los resultados:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Cada ejecución dura tres minutos por defecto, con 30 segundos de calentamiento y consultas cada 10 segundos. `--pair-with` reutiliza un ID opaco del primer resultado para rechazar otro panel físico, otra configuración de Home Assistant o panel de control, o cambios de ajustes que afecten a la medición, sin registrar sus valores privados. No detecta una vista distinta elegida manualmente dentro del mismo panel de control: conserva la misma vista y carga.

Rechaza una ejecución si no está activo el modo esperado, cambia la revisión del filtro o generación del renderizador, cambia la compilación o configuración durante la recogida, se pierde el filtrado o conserva menos de tres muestras generales, tres de CPU total o tres de CPU nativa del renderizador. Escribe igualmente el resultado rechazado con los motivos exactos y nunca sobrescribe una salida existente.

El JSON omite URL e ID del panel, URL de Home Assistant y ruta del panel de control, IDs de entidades, nombres de procesos y hash del filtro. El panel calcula huellas opacas con una clave aleatoria privada de instalación de 256 bits que nunca sale de él; son únicas para cada pareja de comparación, por lo que no enlazan mediciones separadas ni permiten adivinar el nombre del panel. Si no puede guardar la clave, rechaza la medición. El recuento sin filtrar es el último sincronizado del catálogo, no uno en vivo recuperado del WebView sobrecargado; se indica no disponible si el catálogo está vacío. Los contadores de red y navegador se normalizan a los intervalos observados para que una consulta perdida no sesgue la comparación. Los tiempos y tasas del navegador obsoletos se omiten del resumen, mientras siguen recogiéndose CPU, memoria, red y renderizador desde la app.

### Depuración remota opcional de WebView

Las tarjetas de rendimiento integradas no necesitan DevTools. Usa **Depuración remota de WebView** solo para inspeccionar a fondo el código de la página.

Con otra app de panel de control, activa primero su propio ajuste de depuración remota WebView y vuelve a abrirla; sin él, el relé no encuentra su WebView. El relé de red necesita root.

### Descarta el defecto del supervisor Zigbee original del NSPanel Pro

El firmware original antiguo de Sonoff NSPanel Pro que contiene la asignación recursiva `export LD_LIBRARY_PATH=/vendor/bin/siliconlabs_host/:${LD_LIBRARY_PATH}` puede convertir `guard_process.sh` del fabricante en el propio problema de rendimiento. Una [investigación comunitaria](https://github.com/panel-assistant/android/issues/34) lo confirmó en un NSPanel Pro 120 con firmware original 3.8.0 y lo comunicó en los 16 paneles de esa persona. El script antepone su directorio cada cinco segundos. Tras unas diez horas, la cadena del entorno supera el límite Linux por cadena para iniciar programas; los comandos externos fallan con `E2BIG`, `sleep` deja de pausar el bucle y el supervisor puede ocupar un núcleo. También puede no reiniciar un `zgateway` muerto y dejar Zigbee indisponible. El firmware 1.x a 3.x podría estar afectado donde exista la misma línea, pero no se ha verificado independientemente.

Busca este patrón si un NSPanel Pro original muestra carga periódica estando inactivo:

- `guard_process.sh` permanece cerca del 100 % de un núcleo y su tamaño crece muy por encima de los aproximadamente 9 MB normales;
- falta `zgateway` o ya no se recupera; y
- reiniciar ayuda, pero la carga vuelve unas diez horas después.

Reiniciar solo restablece temporalmente el entorno acumulado. El enlace contiene una solución con root y ADB aportada por quien informó, que el proyecto no ha validado independientemente. No la apliques salvo que la asignación recursiva exacta aparezca una sola vez en el script. Cualquier reparación debe verificar primero una copia no vacía y conservar propietario, modo y metadatos SELinux. Detente antes de cambiar nada si la coincidencia no es la esperada; después del cambio revierte si falla el reinicio o la verificación, devuelve `/vendor` a solo lectura y comprueba `zgateway` y su disponibilidad en Home Assistant. Una actualización que reescriba `/vendor` elimina el parche; el defecto vuelve solo si conserva la asignación. La inspección comunitaria de 4.0.12 y 4.6.0 no la encontró.

Este defecto es distinto de un `zgateway` estable que gira en un bucle ocupado contra una radio que no responde. El sensor de salud Zigbee separa CPU del supervisor y gateway, pruebas de unión e historial de reinicios. Advierte de la asignación exacta pero no edita scripts. Un gateway configurado que explícitamente no se ha unido a una red y supera el 50 % de un núcleo durante cinco muestras de un minuto tras 15 minutos de gracia se apaga y contiene automáticamente; un router unido con CPU alta solo genera un aviso.

## Soluciones por orden de impacto

### 1. Filtra la suscripción de entidades del renderizador integrado

El frontend de Home Assistant normalmente se suscribe al estado de todas las entidades visibles para el usuario. El panel debe recibirlas y procesarlas aunque solo use unas pocas. El renderizador integrado añade el conjunto aprendido a la suscripción para que Home Assistant filtre antes de serializar y enviar. Conserva la conexión autenticada normal, sin proxy ni servidor adicional.

El filtro solo afecta al renderizador integrado. La configuración guiada pregunta si activarlo antes de la primera carga; en un panel ya configurado:

1. Usa **Visitar** en su página de dispositivo de Home Assistant, abre **Configurar**, después **Panel de control**, selecciona **Renderizador integrado (ha-paneld)** y activa **Filtrado de entidades**.
2. Abre **Entidades** y selecciona **Analizar el panel de control ahora**.
3. Visita todas las pestañas y usa controles, ventanas emergentes y contenido condicional para permitir observar las dependencias en ejecución.
4. Revisa entidades actuales, sugeridas y excluidas. Ancla las necesarias indirectamente por tarjetas o plantillas.
5. Resuelve las comprobaciones del filtro. Acota las reglas amplias o dinámicas cuando puedas, o elige explícitamente y acepta el aviso.
6. Aplica el conjunto, deja que recargue y compara las mismas vistas con las tarjetas de rendimiento de Panel de control.

El aprendizaje automático no demuestra todas las dependencias de tarjetas o plantillas. Una entidad ausente puede dejar una tarjeta obsoleta o indisponible: revisa primero en un panel del que no dependas y mantén desactivado el filtrado hasta que el candidato sea creíble. La suscripción sin filtrar sigue siendo la salida: desactiva **Filtrado de entidades** y recarga.

Si los datos aprendidos o decisiones manuales antiguos ya no describen el panel de control, usa **Restablecer datos aprendidos** en Entidades. Tras confirmar, borra pertenencia aprendida, fijaciones, exclusiones y decisiones de seguridad ignoradas, conserva el filtro activo correcto y empieza otro análisis. El filtro permanece como alternativa mientras se reconstruye el candidato.

### 2. Aligera el propio panel de control

- Divide uno denso en vistas enfocadas y evita cargar tarjetas innecesarias.
- Prefiere tarjetas integradas si una personalizada anima constantemente, crea un árbol documental grande o ejecuta JavaScript frecuente.
- Observa procesamiento de interacciones, fotogramas de animación largos y recargas. Si domina una vista, simplifícala o usa `button.<panel>_reload` para recuperarte temporalmente mientras localizas la tarjeta costosa.
- Prueba cámaras y gráficas por separado. Decodificación, consultas históricas y dibujo pueden dominar aunque el filtro funcione correctamente.

### 3. Reduce actualizaciones innecesarias en origen

El filtro protege de entidades no mostradas, pero no abarata una necesaria. Si realmente muestras un medidor de potencia, sensor de distancia Bluetooth, plantilla rápida o entidad diagnóstica ruidosa, reduce su frecuencia donde lo permita su integración. También puede reducir trabajo del registrador y base de datos de toda la instalación.

Sirven los filtros throttle y delta de ESPHome, intervalos de informes Zigbee, ajustes `scan_interval` y actualizaciones de plantillas menos frecuentes. Comprueba que no resten utilidad a una automatización o vista histórica antes de aplicarlos en todas partes.

### 4. Ajusta lo restante al hardware

Los paneles PX30 y RK3566 pueden mostrar bien un panel de control enfocado, pero su rendimiento de un solo hilo es limitado y suelen tener solo 2 GB de RAM. Filtrar elimina trabajo innecesario de estados; no hace gratuitas una cámara enorme, animación compleja o gráfica histórica muy grande. Diseña para el tamaño lógico de pantalla y prueba la vista más pesada, no solo la pestaña inicial. Las [páginas de hardware](/es/hardware/) comparan los paneles compatibles.

## Lista de comprobación

- [ ] Se selecciona el renderizador integrado cuando no hacen falta notificaciones nativas
- [ ] El filtrado automático está activo, analizado, revisado y aplicado explícitamente
- [ ] Durante el aprendizaje se usaron todas las pestañas, ventanas emergentes y rutas condicionales
- [ ] Se anclaron o tuvieron en cuenta las dependencias de tarjetas y plantillas
- [ ] Las comprobaciones se resolvieron deliberadamente y no se ignoraron por accidente
- [ ] Se compararon las mismas vistas antes y después con las tarjetas de rendimiento de Panel de control
- [ ] Si la página se bloquea sin filtrar, ambas ejecuciones se recogieron y validaron con el script
- [ ] Se probaron por separado tarjetas pesadas, cámaras y gráficas
- [ ] Se ajustaron en origen las entidades necesarias de alta frecuencia cuando procedía
- [ ] En un NSPanel Pro con Zigbee original se comprobó `guard_process.sh`
- [ ] Se probaron recargar y desactivar el filtro como vías de recuperación

## Referencia

### Por qué una instalación grande de Home Assistant puede ralentizar el panel

El frontend mantiene una suscripción WebSocket al estado actual y a cada actualización posterior de las entidades disponibles para el usuario. Sin restringir el conjunto, el renderizador recibe mucho más de lo que usa un panel de pared enfocado. Su hilo principal JavaScript debe analizar mensajes, actualizar el modelo de estados y determinar si cambió algo visible.

Los paneles económicos son especialmente sensibles porque JavaScript, distribución y dibujo dependen mucho de un hilo. Otros núcleos ayudan en otras tareas, pero no eliminan ese retraso. La RAM limitada hace más perturbadora la recolección de basura al crecer la memoria de WebView.

### Síntomas habituales

| Síntoma                                                                                                     | Causa probable                                                                          |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Toques tardíos, navegación lenta o desplazamiento a tirones                                                 | Trabajo del hilo principal por muchos estados, tarjetas pesadas o ambos                 |
| Una vista mucho peor que las demás                                                                          | Tarjetas costosas, decodificación de cámara, datos históricos o árbol documental grande |
| Toda la vista queda en blanco pero permanece la interfaz alrededor                                          | Presión de memoria de WebView o fallo del renderizador                                  |
| Deterioro gradual durante días                                                                              | Crecimiento de memoria, fragmentación o una tarjeta que acumula trabajo                 |
| Las entidades dejan de actualizarse y llegan en ráfaga                                                      | Interrupción WebSocket, reconexión o renderizador incapaz de seguir el ritmo            |
| Paneles similares se comportan distinto                                                                     | Diferencias de contenido, suscripción, WebView, tiempo de actividad o calor             |
| Un NSPanel Pro original da tirones unas diez horas después de arrancar y `guard_process.sh` ocupa un núcleo | Asignación recursiva del supervisor Zigbee que provoca `E2BIG`                          |

La recolección de basura pausa JavaScript periódicamente para recuperar memoria sin uso. Cerca del límite esas pausas se alargan y repiten más, pudiendo privar de tiempo al dibujo aunque el proceso Android no haya fallado.
