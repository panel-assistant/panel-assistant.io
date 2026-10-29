---
title: Perfiles de panel en tiempo de ejecución
description: Cómo describen los perfiles un modelo de panel Android de pared y cómo escribirlos, probarlos y activarlos desde la interfaz web del panel.
sidebar:
  label: Resumen
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Los perfiles describen lo especial de un modelo de panel Android de pared: cómo lo reconoce ha-paneld, qué controladores de hardware compilados puede usar, las características conocidas de pantalla y sensores y las variantes dependientes del firmware. Son archivos YAML legibles que puedes inspeccionar, exportar, editar, importar y activar desde una instalación de ha-paneld en marcha, sin recompilar la app Android.

Esta es la guía práctica de creación. Consulta la [referencia de formato y compatibilidad](/es/reference/profiles/format/) para el modelo documental, [pruebas y resolución de problemas](/es/reference/profiles/testing/) antes de activar controles de hardware y la [guía para compartir y contribuir](/es/reference/profiles/sharing/) antes de publicar. Hay un catálogo claramente separado de [perfiles de la comunidad](/es/reference/profiles/community/): se importan manualmente y no son soporte incluido.

Los perfiles incluidos con la app están en el repositorio de ha-paneld, en [`app/src/main/assets/device-profiles`](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles).

![Página Profile con el YAML de una revisión incluida en el editor, distintivos de revisión de recomendaciones de desactivación de paquetes, rutas root y metadatos de artefactos WebView, y los datos observados del dispositivo debajo](/screenshots/ui-profile-dark.png)

## Qué puede hacer un perfil

Un perfil puede seleccionar controladores y transformaciones ya incluidos en ha-paneld y aportar sus parámetros tipados. Puede describir datos del hardware, reglas de coincidencia, variantes de firmware, recomendaciones de pantalla, capacidades candidatas y el nivel de autoridad de Android que puede ser útil.

No puede añadir código ejecutable, comandos de shell, verbos del demonio auxiliar, ioctls del kernel, bibliotecas nativas ni protocolos de hardware nuevos. Si un panel necesita un mecanismo que no figure en el editor o la referencia de formato, primero debe implementarse y revisarse en ha-paneld. Este límite mantiene inspeccionable un YAML intercambiado e impide que se convierta en un script root arbitrario.

Los perfiles tampoco otorgan autoridad. Un controlador privilegiado sigue sin estar disponible si no funciona su vía de acceso en vivo. Consulta [Autoridad: Android estándar y vías privilegiadas](#autoridad-android-estándar-y-vías-privilegiadas).

## Inicio rápido sin entorno de desarrollo

Solo necesitas una instalación de ha-paneld con perfiles y un navegador. Profiles incluye un editor YAML con validación; exportar a otro editor es opcional. No necesitas Android Studio, Gradle, el SDK de Android ni una copia del repositorio.

1. Abre la página de dispositivo del panel en Home Assistant, selecciona **Visit** y abre **Profiles**. Para conectar directamente, usa el puerto HTTP que declara el panel (`http://<panel-ip>:8888/profiles` con el predeterminado).
2. Si ha-paneld ya reconoce el panel, exporta la revisión activa exacta como referencia. Los perfiles incluidos son inmutables: la primera edición crea una bifurcación local autónoma, sin modificar la copia distribuida.
3. Si usa **Generic**, descarga su borrador pasivo del dispositivo. Incluye la huella y valores desconocidos/TODO explícitos; no adivina hardware privilegiado ni ejecuta sondeos activos.
4. Asigna un ID estable en minúsculas y una versión, completa la procedencia y compatibilidad y empieza con reglas exactas. Usa el [ejemplo siguiente](#ejemplos) y la [referencia de formato](/es/reference/profiles/format/).
5. Importa el YAML en Profiles. Importar y validar solo generan una vista previa: no guardan ni activan nada.
6. Lee todos los mensajes de validación y compara con el perfil activo. Presta especial atención a la huella, controladores, rutas de hardware, entidades de Home Assistant nuevas o retiradas y requisitos de autoridad.
7. Guarda el candidato validado. Se crea una revisión local inmutable e inactiva, sin cambiar aún el panel en marcha.
8. Pruébalo por etapas con la [lista de pruebas](/es/reference/profiles/testing/). Si cambia pantalla, entrada, LED, relé, paquetes u otro comportamiento privilegiado, actívalo solo cuando alguien pueda ver y tocar el panel.
9. La activación exige una confirmación explícita vinculada al ID, revisión y hash exactos. ha-paneld reinicia su servicio para que todos los controladores reciban el mismo perfil resuelto.
10. Tras reiniciar, confirma que Profiles muestra la revisión esperada como **activo**, inspecciona capacidades y entidades de Home Assistant y prueba la reversión. Si falla la validación de inicio, ha-paneld vuelve a **last-known-good** e informa del candidato como **auto-rolled-back**.

Conserva el YAML exportado como fuente intercambiable. Una captura de Profiles en verde es una prueba útil, pero no sustituye al archivo, su procedencia ni los resultados de hardware por etapas.

## Ejemplos

[`minimal-community.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml) usa el esquema público aceptado por Profiles. Es material didáctico, no una afirmación de que exista ese hardware ficticio. Es un punto de partida conservador con Android estándar que no activa protocolos de fabricante, rutas root/auxiliar, relés, entrada evdev, artefactos de actualización, estados deseados de paquetes ni recetas de aprovisionamiento.

Impórtalo con **Profiles**, revisa la validación y guárdalo solo como revisión local inactiva. Cambia ID, procedencia, huella exacta, firmware probado y limitaciones antes de basarte en él para un panel real. Una coincidencia importada solo es evidencia de vista previa; los perfiles locales y comunitarios nunca se seleccionan automáticamente.

Como ejemplos completos de producción, exporta un perfil incluido e inmutable desde un panel o lee los [YAML incluidos](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles). Usan el mismo esquema, pero pueden seleccionar controladores privilegiados compilados y artefactos controlados por el núcleo que no debes copiar sin pruebas de hardware.

## Ciclo de vida del perfil

ha-paneld trata el contenido como revisiones inmutables en vez de un objeto de ajustes activo editable. Así las comparaciones son reproducibles y una subida modificada no puede activarse con una vista previa anterior.

- **Incluido**: incluido con ha-paneld e inmutable. Puede exportarse o bifurcarse.
- **Local inactive revision**: importado o creado, validado y guardado en este panel, pero sin uso por los controladores activos.
- **Pending**: la revisión exacta fue aceptada para activarse y el servicio se está reiniciando.
- **Activo**: revisión que construyó los sensores, controladores de hardware, modelo de capacidades de la interfaz y superficie de descubrimiento de Home Assistant actuales.
- **Last-known-good**: selección anterior probada, conservada para recuperación y reversión manual tras completar el inicio de una revisión nueva.
- **Auto-rolled-back**: candidato cuya activación falló y que fue sustituido automáticamente por la última revisión conocida como correcta.

Guardar, activar y borrar usa hashes de revisión y comprobaciones de generación. Si otro navegador o administrador cambió el catálogo desde que abriste la página, se rechaza la operación obsoleta: actualiza, compara de nuevo y actúa sobre el estado nuevo.

Borrar una revisión local inactiva no cambia el panel activo. No retires una revisión activa o last-known-good hasta disponer de otra vía de recuperación válida.

**Usar selección automática** devuelve un panel fijado a la coincidencia de huellas de los perfiles incluidos en el siguiente reinicio controlado. Las revisiones importadas y comunitarias nunca participan en esa elección automática; solo están disponibles para activación explícita y fijada.

## Empezar con Generic

`Generic` es la alternativa conservadora para un panel desconocido. Usa comprobaciones normales de capacidades Android y sondeos seguros en ejecución, pero deliberadamente no inventa hardware del fabricante, botones evdev, relés, radios, chips de climatización, artefactos de actualización ni acciones sobre paquetes.

Por eso es el punto de partida adecuado para crear perfiles comunitarios:

1. Descarga el **device draft** desde Profiles. Recoge el modelo de compilación, dispositivo de compilación y versión de producto exactos disponibles para ha-paneld, además del último informe pasivo acotado y saneado.
2. Revisa y elimina datos sensibles antes de compartir. El informe se diseña para soporte, pero el autor sigue siendo responsable de retirar nombres y direcciones de panel, datos de Home Assistant, credenciales y contenido del panel de control.
3. Añade primero identidad y procedencia. Usa un ID estable en minúsculas con prefijo de autor u organización, como `org.example.wallpanel-x1`, una versión inicial, autor/fuente/licencia, madurez, intervalo de firmware probado y limitaciones conocidas.
4. Añade reglas de huella estrechas y exactas. Un modelo del fabricante o prefijo de versión suele ser más seguro que un alias amplio de SoC como `px30`, `rk3326`, `rk3566` o `rk3576`, compartido por paneles no relacionados.
5. Omite las capacidades desconocidas o márcalas explícitamente como desconocidas. Un nombre de archivo, anuncio comercial o controlador del kernel compilado en el firmware no demuestra que exista hardware real ni que una app Android pueda acceder a él.
6. Añade una capacidad respaldada por pruebas cada vez; valida, compara y prueba antes de continuar.

El borrador es deliberadamente pasivo y de solo lectura. No conviertas comandos exploratorios ni experimentos root puntuales en campos del perfil. Si hace falta un nuevo sondeo activo o controlador, propón una implementación acotada de ha-paneld con validación y pruebas propias.

## Identificar un panel con seguridad

La coincidencia es una decisión de seguridad, no solo comodidad. Una coincidencia incorrecta puede seleccionar un controlador inadecuado o atribuir capacidades de otro producto con la misma placa de referencia.

Prefiere la identidad exacta en este orden:

1. modelo del fabricante o nombre de dispositivo único del producto;
2. formato exacto de versión del producto o prefijo estrictamente anclado;
3. combinación de campos de compilación independientes;
4. alias amplio de SoC/plataforma de referencia solo como alternativa deliberada de compatibilidad.

Asigna a cada grupo exacto una prioridad de rama mayor que a su alternativa amplia. ha-paneld compara primero la prioridad del grupo coincidente y después la del perfil; un empate exacto entre perfiles incluidos falla de forma segura a Generic. Las prioridades reproducen un orden deliberado, pero no sustituyen una huella precisa.

Las revisiones comunitarias e importadas nunca participan en la selección automática, aunque la coincidencia sea exacta. La coincidencia es evidencia de vista previa para decidir si el archivo describe el panel. Una revisión local solo puede sustituir la detección incluida mediante activación explícita, que fija ID, revisión y hash exactos. Una importación posterior no puede cambiar implícitamente el resultado activo.

Usa un campo de estrategia con nombre controlado por el núcleo para una diferencia admitida dentro de una familia, como una etiqueta de producto o regla de densidad. El formato no incluye un lenguaje general de expresiones ni parches arbitrarios de variantes. La escala, polaridad y comportamiento binario o de rango de proximidad deliberadamente no son estrategias: se aprenden de pruebas en vivo. Usa perfiles separados si las estrategias disponibles no describen una diferencia real de adquisición, controlador, límite de privilegios o recuperación.

## Autoridad: Android estándar y vías privilegiadas

Los perfiles describen mecanismos candidatos; los sondeos en vivo deciden si el panel activo puede usarlos.

### Android estándar

Empieza aquí. Mostrar el panel de control, emparejar Panel Assistant y usar sensores, brillo, audio, navegación e interfaz web normales de Android no requiere root. Un perfil nuevo debe demostrar identidad y comportamiento Android estándar antes de añadir un controlador privilegiado.

### Root del fabricante o auxiliar de ha-paneld

Un controlador compilado puede necesitar una vía `su` operativa del fabricante o el auxiliar root instalado por separado. Declarar el requisito no crea la vía, instala el auxiliar ni amplía su lista permitida. El auxiliar solo acepta comandos compilados y acotados y autentica al interlocutor; un perfil aporta parámetros validados, nunca texto de comandos.

No recomiendes rootear un dispositivo suministrado sin root solo para satisfacer un perfil. Documenta honestamente las funciones reducidas. Consulta [Acceso root](/es/hardware/guides/root-access/) para el hardware.

## Actualizar un perfil instalado

Las versiones del contenido y del esquema resuelven problemas distintos. Incrementa la versión del perfil cuando cambien el conocimiento del hardware o el comportamiento. La del esquema solo cambia cuando ha-paneld cambia el lenguaje documental.

Antes de guardar, compara con la revisión activa y lee el informe de compatibilidad. Una actualización de ha-paneld también revalida los perfiles instalados antes de usarlos. Un archivo que necesita un núcleo más reciente, un controlador no disponible o un esquema futuro no admitido permanece instalado pero no puede activarse; sigue funcionando el perfil last-known-good actual.

Trata un cambio de coincidencias, controlador privilegiado, ruta, variante de firmware, estado deseado de paquetes, receta o artefacto de actualización controlado por el núcleo como significativo para el comportamiento aunque el diff YAML sea pequeño. Repite las pruebas pertinentes e incrementa la versión.

## Próximos pasos

- [Formato y compatibilidad de perfiles](/es/reference/profiles/format/)
- [Pruebas y resolución de problemas](/es/reference/profiles/testing/)
- [Compartir y contribuir perfiles](/es/reference/profiles/sharing/)
- [Arquitectura de perfiles de dispositivo](/es/reference/profiles/architecture/)
- [Postura de seguridad](/es/reference/security/)
- [Hardware de paneles](/es/hardware/)
