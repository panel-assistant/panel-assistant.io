---
title: El renderizador integrado
description: Cómo dibuja la app del panel tu panel de control de Home Assistant, se recupera de los fallos y filtra las entidades que recibe.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

La app del panel dibuja tu panel de control de Home Assistant en su propio WebView en lugar de entregárselo a otra app. Así puede volver rápidamente al panel de control después de reiniciarse: abre el último que Home Assistant verificó para el mismo servidor, cuenta y ajuste de panel de control de inicio mientras consulta en segundo plano la lista actual. Si Home Assistant indica que se eliminó ese panel de control o cambió el predeterminado de la cuenta, el panel pasa a la opción actual.

Una vez en marcha, la app puede detectar una conexión bloqueada, liberar memoria acumulada de WebView y contener los fallos del renderizador. Esta conexión integrada también permite filtrar las entidades del panel de control. El panel sigue siendo un dispositivo de una sola app, con una única app que instalar y actualizar.

El renderizador integrado es, con diferencia, la opción preferida para mostrar el panel de control y la que elige la configuración guiada. También se admite una app independiente, por ejemplo si necesitas más de un servidor de Home Assistant o notificaciones nativas (consulta [Límites](#límites)). El control por voz de Assist no depende de ninguna de las dos: en un panel con micrófono lo proporciona el [asistente de voz](/es/manage/voice-assistant/) del propio panel, independientemente de la app activa.

## Inicio y recuperación

El renderizador usa la interfaz documentada `?external_auth=1` de Home Assistant, por lo que la app sabe cuándo se ha conectado el panel de control en vez de tratar la página como una caja negra. Hace lo siguiente:

- Tras reiniciarse la app, vuelve a abrir el último panel de control verificado mientras actualiza en segundo plano la lista de Home Assistant. Primero ejecuta una breve comprobación de compatibilidad. El panel de control recordado está vinculado al servidor, la cuenta y el panel de control configurado; un panel de control o una pestaña que hayas elegido explícitamente siempre tiene prioridad.
- Congela la página mientras la pantalla está apagada y la reanuda al activarla, ahorrando aproximadamente un 70 % de CPU del renderizador durante la noche.
- Recarga un panel de control que se abrió pero nunca se conectó. Los reintentos se espacian tras varios fallos y el panel muestra **Volviendo a conectar con Home Assistant…** en lugar de una página de error del navegador.
- Reintenta las comprobaciones recuperables con esperas crecientes. Si el inicio de sesión se rechaza de forma permanente, detiene los reintentos y muestra instrucciones para Inicio de sesión en el navegador. Si la versión de Home Assistant no es compatible o WebView es incompatible, indica qué actualización hace falta y espera a que se instale.
- Libera memoria acumulada mediante recargas invisibles mientras la pantalla está apagada.
- Contiene los fallos del renderizador y limita su frecuencia. Una página que falla repetidamente vuelve al lanzador de administración en vez de reiniciarse toda la noche.
- Si Home Assistant anuncia que se está deteniendo o se desconecta, muestra un aviso nativo en el panel y lo retira solo cuando se ha demostrado que Home Assistant vuelve a estar disponible.

Desliza hacia abajo desde el borde superior de la pantalla para actualizar, o hazlo dos veces para una recarga completa. El renderizador también admite el retorno opcional al panel de control de inicio tras un periodo de inactividad, la reproducción automática de cámaras y HTTPS con una autoridad de certificación privada instalada por el usuario. **Ocultar barras del sistema Android** permite ocupar toda la pantalla; desliza desde un borde para volver a mostrar las barras. En los paneles que usan la barra de navegación por software de la app, **Panel de control** lleva el renderizador al primer plano sin recargarlo y **Recargar** es una acción de recuperación independiente.

**Nivel de zoom (%)** ajusta el tamaño con el que el renderizador dibuja el panel de control; el valor predeterminado es 100 %. El renderizador añade **Ajustes de la app** a la barra lateral de Home Assistant para abrir la configuración del panel. En el primer inicio oculta la barra lateral anclada y mantiene la conexión durante la inactividad; después puedes abrirla o cambiar estos valores. La opción independiente **Ocultar navegación de Home Assistant (nativa)** pide al frontend que retire su navegación mientras está activo el modo quiosco nativo. Si solo falla el tamaño del panel de control, consulta [el tamaño de la pantalla](/es/manage/display-sizing/).

## Requisitos y compatibilidad

El renderizador integrado necesita ambas cosas:

- **Home Assistant 2026.4.2 o posterior**; y
- un Android System WebView compatible con el receptor seguro de WebMessage que utiliza la interfaz de host nativo de Home Assistant.

La mayoría de las personas solo necesita un Android System WebView actualizado. Antes de cargar el panel de control, la app comprueba esta capacidad de WebView y verifica la compatibilidad de Home Assistant.

Si el panel muestra **Es necesario actualizar Home Assistant**, actualiza Home Assistant y selecciona **Reintentar**. Ninguna acción en el panel puede sustituir esa actualización.

Si muestra **El visor web de este panel es demasiado antiguo**, sigue [la guía para actualizar WebView](/es/hardware/guides/update-the-webview/). En la versión 1.0.0-rc2, aún no publicada, una actualización de la app iniciada desde Home Assistant también puede instalar un WebView compatible verificado si el panel lo permite. Los demás paneles necesitan el método de la guía. Después de actualizar WebView, selecciona **Reintentar**.

El renderizador integrado nunca recurre a un puente con menos aislamiento. Otro renderizador puede servir si no puedes actualizar Home Assistant, pero todas las apps de panel de control del dispositivo usan el mismo WebView del sistema y ninguna puede evitar que esté obsoleto.

## Configuración

En un panel nuevo o restablecido, selecciona **Configurar** en el propio panel o abre su página de configuración desde un portátil o teléfono (por ejemplo, `http://<panel>:8888/setup` con el puerto predeterminado). El asistente elige el renderizador, inicia sesión en Home Assistant, selecciona el valor predeterminado de la cuenta, un panel de control o una pestaña concreta y pregunta por el filtro de entidades antes de la primera carga. La autorización ocurre en el navegador del administrador, sin escribir credenciales en el panel.

En un panel ya configurado, usa **Visitar** en su página de dispositivo de Home Assistant y abre **Configurar**. En **Conexión con Home Assistant**, introduce la URL de Home Assistant y elige **Inicio de sesión en el navegador**; después selecciona **Renderizador integrado** como Aplicación del panel de control.

## Aspecto del panel de control y bloqueo de Android

Los ajustes avanzados de Configurar incluyen tres controles independientes que afectan a capas distintas:

| Opción de Configurar                                                                 | Qué cambia                                                                                                                                                                                                            | Qué **no** cambia                                                                                                                                                         |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ocultar navegación de Home Assistant (nativa)** (desactivada por defecto)          | Cuando Home Assistant se conecta, pide a su frontend que oculte la navegación. Solo para el renderizador integrado.                                                                                                   | No bloquea Android, no oculta sus barras ni inyecta o cambia CSS. Si Home Assistant rechaza la petición o no la admite, el panel de control queda igual.                  |
| **Ocultar barras del sistema Android** (activada por defecto)                        | Oculta las barras de estado y navegación de Android para ocupar toda la pantalla. Desliza desde un borde para mostrarlas. Solo para el renderizador integrado.                                                        | No impide salir de la app ni oculta los menús y la navegación propios de Home Assistant.                                                                                  |
| **Bloquear Android en el panel de control (experimental)** (desactivada por defecto) | Con root, oculta las barras de Android y vuelve al panel de control elegido en unos tres segundos si se abre otra app o Recents. Disuade el uso casual; no es una barrera de seguridad frente a una persona decidida. | No cambia el aspecto del panel de control. Sin root no tiene efecto. Tras reiniciar hay 60 segundos sin bloqueo para recuperarlo y después se aplica el bloqueo guardado. |

Para despejar la pantalla, activa **Ocultar navegación de Home Assistant (nativa)** cuando nadie necesite esa navegación en el panel; **Ocultar barras del sistema Android** ya está activada. Activa **Bloquear Android en el panel de control** solo si necesitas disuadir la salida casual de la app y después de probar las salidas: Configurar, el interruptor de Home Assistant, `adb`, siete toques rápidos en la esquina superior izquierda o el intervalo sin bloqueo después de reiniciar.

## Filtro de entidades

:::caution
El aprendizaje automático no puede demostrar todas las dependencias de una tarjeta personalizada o plantilla dinámica. Un conjunto incompleto puede dejar tarjetas ausentes o sin actualizar. Revisa el conjunto aprendido después de cambiar el panel de control y ten a mano cómo desactivar el filtro.
:::

El filtro solo afecta al renderizador integrado. Cambia la suscripción del frontend a Home Assistant para que Home Assistant filtre los estados antes de serializarlos y enviarlos al panel. No afecta a otras apps. [Rendimiento](/es/manage/performance/) explica por qué suele ser la mejora más importante en un panel lento.

### Flujo automático

1. Usa **Visitar** en la página de dispositivo del panel en Home Assistant, abre **Configurar**, después **Panel de control**, selecciona **Renderizador integrado** y activa **Filtrado de entidades**.
2. Abre **Entidades** y selecciona **Analizar el panel de control ahora**.
3. Visita todas las pestañas y usa sus controles, ventanas emergentes y contenido condicional para que el panel observe sus dependencias durante la ejecución.
4. Revisa las listas de entidades actuales, sugeridas y excluidas. Fija las que usen indirectamente las tarjetas personalizadas o plantillas y resuelve las comprobaciones del filtro que aparezcan encima de las tablas.
5. Selecciona **Aplicar conjunto de políticas** cuando el candidato esté listo. El panel muestra los recuentos anterior y nuevo antes de pedir confirmación y después recarga con la suscripción filtrada.

![Pestaña Entidades de la interfaz web del panel, con el filtro de suscripción, las entidades suscritas actualmente y las sugeridas](/screenshots/ui-entities-dark.png)

Entidades explica por qué se encontró cada entidad, registra tus fijaciones y exclusiones manuales y mantiene visibles las reglas amplias o dinámicas que reconoce hasta que las corrijas o decidas explícitamente cómo continuar. Puede haber comportamientos que no reconozca; prueba todas las pestañas después de activar el filtro. Si falta algo, desactiva **Filtrado de entidades** en Configurar y recarga antes de revisar el candidato.

### Cuando el panel retiene el panel de control

Con el filtrado automático activo, el renderizador nunca abre Home Assistant sin filtrar. Hasta que un análisis produzca un conjunto defendible, muestra una pantalla nativa de espera por uno de tres motivos. Mientras el primer análisis está en marcha o ha fallado, lo reintenta con intervalos crecientes porque normalmente Home Assistant aún no está disponible. Si Home Assistant rechaza la credencial, la pantalla indica el inicio de sesión. Si el análisis terminó pero encontró una regla que no puede acotar, como un panel de control generado por una estrategia o un selector sin límites, pide una decisión: ignorar las reglas señaladas y continuar, desactivar el filtro o revisarlas en Entidades. Puedes decidir en el panel o desde cualquier dispositivo de la red: usa **Visitar** en su página de dispositivo de Home Assistant y abre **Entidades** (por ejemplo, `http://<panel>:8888/entities` con el puerto predeterminado). La pantalla de espera también muestra la dirección.

Una espera pendiente de decisión está estabilizada, por lo que el panel no vuelve a analizar el catálogo mientras espera. Pregunta a Home Assistant si cambió el panel de control cinco minutos después de estabilizarse y luego, como máximo, cada hora. Solo vuelve a analizar cuando cambia realmente la configuración del panel de control o el predeterminado de la cuenta, cuando se toma la decisión o cuando cambian los ajustes de Home Assistant del panel.

Una actualización de la app puede hacer que se vuelva a comprobar un panel de control que ya estaba filtrándose. Si esa comprobación señala una regla en un panel de control que ya usaba un filtro, el panel registra la regla como ignorada, restaura el conjunto de entidades que usaba y abre el panel de control en lugar de retenerlo. La regla sigue visible en Entidades y puede volver a habilitarse allí. Esto solo se aplica a una comprobación causada por una actualización, cuando ya existe un filtro aceptado y el conjunto restaurado no está vacío. Las reglas que nunca se pueden ignorar, como un panel de control demasiado grande para analizar, siguen reteniendo el renderizador.

### Plantillas y fijaciones manuales

La app no ejecuta las plantillas del panel de control, por lo que no sabe qué entidades devuelven y no lo adivina. Trata de manera distinta los dos tipos de entidad que usa una plantilla.

Las entidades que una plantilla solo **lee**, como un estado comprobado en una condición, no necesitan nada. Home Assistant procesa la plantilla y envía el resultado por una suscripción independiente que el filtro no toca. Es normal que esas entidades no aparezcan en las listas de Entidades; añadirlas solo ampliaría la suscripción sin beneficio.

Las entidades que una plantilla **devuelve** son distintas. Se convierten en tarjetas que leen su estado mediante la suscripción filtrada, así que deben estar en ella. El panel no puede descubrirlas sin ejecutar la plantilla. Continuar tras una comprobación de descubrimiento tampoco las añade: esa decisión solo permite continuar las actualizaciones automáticas sin ellas.

Para añadir una, escribe parte de su nombre o ID en el buscador de la parte superior de Entidades. Busca en todo el catálogo de Home Assistant, no solo en las entidades encontradas, y muestra cuántas coincidencias contiene cada tabla. Pon cada entidad necesaria en **Anclada**. La fijación manual permanece hasta que la retires, incluso tras cambios del panel de control y nuevos análisis.

### Restablecer los datos aprendidos

Usa **Restablecer datos aprendidos** en Entidades si las pruebas de un panel de control anterior o decisiones manuales previas hacen engañoso el candidato. Tras confirmar, borra la pertenencia y las pruebas aprendidas, las fijaciones y exclusiones manuales y las decisiones de seguridad ignoradas. Conserva el filtro activo conocido como correcto y el catálogo de Home Assistant usado para los nombres del candidato, e inicia otro análisis si el aprendizaje está activo. El restablecimiento reconstruye el candidato sin ampliar inmediatamente la suscripción a todos los estados de Home Assistant.

## Temas

**Tema del panel de control** (Configurar y después Renderizador integrado) decide quién elige entre claro y oscuro:

- **Seguir Home Assistant** (predeterminado) deja la decisión a Home Assistant. El panel solo aporta un punto de partida: en Android 13 y posteriores sigue el ajuste del sistema en tiempo real; en Android 10 a 12 lo sigue al cargar; en Android 9 y anteriores lo determina **Modo oscuro** (Configurar y después Display). Un tema elegido en Home Assistant tiene prioridad.
- **Ambiente** elige claro u oscuro a partir del modelo de la habitación usado por Brillo automático. Esta debe estar activa; hasta recibir lecturas útiles sigue Home Assistant. El cambio requiere un minuto completo de luz u oscuridad sostenida.
- **Oscuro** y **Claro** dejan la elección al panel. Sirven para un quiosco con la barra lateral oculta donde no se puede acceder al perfil de Home Assistant.

Forzar un tema solo cambia la parte clara u oscura. El tema con nombre y sus colores permanecen igual; volver a Seguir Home Assistant restaura la elección anterior o Auto si no había ninguna. El panel nunca cambia el tema guardado en tu cuenta de Home Assistant, por lo que elegir Oscuro en el panel no oscurece tu teléfono.

Hay un caso que no puede anular. Si ese usuario de Home Assistant ha elegido explícitamente Claro o Oscuro en vez de Auto, su elección sigue teniendo prioridad: anularla cambiaría un ajuste compartido con todos sus dispositivos. Pon su tema en Auto o usa una cuenta propia para el panel y se aplicará la elección del panel. En ese caso, la tarjeta **Diagnóstico en tiempo de ejecución** de la interfaz web indica que el tema de Home Assistant prevalece sobre Tema del panel de control y la línea `[renderer]` del informe `/diag` incluye `theme_overridden=true`.

La interfaz web del panel es independiente de todo esto y siempre sigue el navegador desde el que la miras.

## Usar una app de panel de control independiente

Si necesitas alguna capacidad de [Límites](#límites), abre Configurar y selecciona la otra app instalada en **Aplicación del panel de control**. El cambio es inmediato. No elijas **Automático** para ello: Auto usa el renderizador integrado siempre que está listo.

## Límites

- **No admite más de un servidor de Home Assistant ni notificaciones nativas.** Conserva una app independiente cuando las necesites. El control por voz de Assist no entra en esta lista: lo proporciona el [asistente de voz](/es/manage/voice-assistant/) del propio panel con micrófono, sea cual sea la app activa.
- **Sin extras multimedia de pantalla completa**, como un selector de archivos o reproducción tipo casting. Quedan fuera del alcance.
- Sigue haciendo falta un **WebView del sistema actualizado** para dibujar el frontend de Home Assistant. Uno obsoleto genera un aviso de salud en la interfaz web; actualízalo con el [método de tu panel](/es/hardware/guides/update-the-webview/).
- Inicio de sesión en el navegador y la instalación avanzada no interactiva funcionan sin root.
