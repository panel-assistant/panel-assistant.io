---
title: Seguridad de la instalación
description: Las comprobaciones del instalador de línea de comandos retirado, qué respaldaba antes de cambiar un panel y cuándo se detenía.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Esta página describe las comprobaciones del [instalador de línea de comandos](/es/install/installing-ha-paneld/) retirado, que instalaba paneles antes de ha-paneld v0.9.9. Ahora Panel Assistant instala y actualiza los paneles: los comprueba antes de cambiar nada y respalda sus ajustes antes de cada actualización, como se explica en [actualizaciones y recuperación](/es/manage/updates-and-recovery/).

## Límites de confianza y credenciales

Los archivos de credenciales mantienen los secretos fuera del historial del shell y de las líneas de comandos de los procesos secundarios del equipo que ejecuta el instalador. No cifran la API de administración del panel. La API (por ejemplo, `http://<panel>:8888` con el puerto predeterminado) sigue el modelo de red de confianza del proyecto: las credenciales del broker y los tokens de Home Assistant cruzan esa conexión mediante HTTP sin cifrar. Ejecuta el instalador solo en una red segmentada de confianza. La [referencia de seguridad](/es/reference/security/) describe este modelo.

El inicio de sesión con usuario y contraseña de Home Assistant funciona de otra manera. La contraseña va del equipo instalador al endpoint de inicio de sesión de Home Assistant y nunca llega al panel. Usa una URL `https://` de Home Assistant para cifrarla en tránsito; una URL `http://` la envía sin cifrar. El panel solo recibe el token de actualización resultante, que se puede revocar.

Las exportaciones de configuración contienen secretos y se escriben con permisos exclusivos del propietario; trátalas como credenciales. Las copias automáticas de ajustes y base de datos anteriores a una actualización también se guardan en un directorio exclusivo del propietario, como archivos de modo 600.

## Autenticación de versiones y paquetes

El instalador que no necesita una copia del repositorio descarga la app y el aprovisionador de la misma versión. Antes de cambiar el panel, autentica la app publicada y los binarios auxiliares mediante registros SHA-256 firmados con la clave de publicación. También inspecciona el paquete y el firmante de la app con Android Build-Tools. Estas herramientas son opcionales en una primera instalación sin la app, ya que Android comprueba la firma al instalarla, y obligatorias para actualizar un panel que ya la tiene: compara los firmantes instalado y nuevo antes de cambiar nada y rechaza la operación en vez de adivinar. Un firmante distinto retiraría el auxiliar activo y solo después fallaría la instalación. El instalador elige el auxiliar para la ABI que declara el panel.

Una app compilada localmente sigue una ruta independiente para desarrolladores. Debe contener el paquete ha-paneld con exactamente un firmante válido, pero puede usar una clave propia y consistente del compilador. `--require-release-signer` endurece esa comprobación cuando se espera una compilación oficial. `--allow-unsigned-helper` es una aceptación independiente para auxiliares controlados por quien compila localmente, en vez de autenticados como archivos publicados.

## Copias de seguridad y recuperación

Tres archivos distintos sirven para tres tareas de recuperación:

- Una **exportación JSON de configuración** contiene ajustes y secretos. `--export FILE` la crea explícitamente; el instalador también intenta crear automáticamente una exportación exclusiva del propietario antes de una actualización normal. No contiene el catálogo de perfiles de ejecución, la selección de perfil, el estado aprendido de entidades, los historiales ni el inicio de sesión de Home Assistant de otra app de panel de control.
- Una **copia `.hpb`**, creada con **Instalar** y después **Copia de seguridad** en la interfaz web, es la copia admitida más completa. Contiene ajustes, estado duradero del panel, catálogo de perfiles y un inicio de sesión elegible de otra app de panel de control. El catálogo aprendido de entidades y los historiales de proximidad y ambiente se vuelven a aprender en vez de restaurarse. Restaura un `.hpb` con **Instalar** y después **Restaurar** en la misma página. `--restore FILE` acepta JSON de configuración, no copias `.hpb`.
- Una **`…break-glass.db`** automática es una copia de último recurso de la base de datos interna. Nada la restaura automáticamente y solo es válida para el mismo panel y la misma versión de app de origen.

Cuando combinas `--export FILE` con opciones de instalación o configuración, la exportación verificada se escribe antes de cambiar nada en el panel. Si no se puede producir y verificar, la ejecución se detiene. Ejecuta primero `--export FILE` por separado si quieres exportar sin instalar nada.

La exportación automática de ajustes antes de una actualización normal es de mejor esfuerzo. Si no se puede crear, el instalador elimina el archivo parcial, registra que no hay exportación y continúa sustituyendo la app.

Antes de desinstalar, borrar datos de la app o hacer otra recuperación destructiva, crea una copia independiente mediante **Instalar** y **Copia de seguridad**, y comprueba que el `.hpb` descargado no esté vacío. Esas operaciones destruyen los datos de la app. Un `adb install -r` normal los conserva.

`--reset-config` funciona deliberadamente de otra manera. **El restablecimiento es irreversible y no crea copia de seguridad.** Pide su propia confirmación y después elimina todos los datos de la app del panel. La app, el auxiliar y las demás apps de Android siguen instalados.

## Instantánea automática de la base de datos

Antes de cada actualización normal, el instalador intenta capturar la base de datos del panel, que contiene configuración, catálogo de entidades, historiales de proximidad y ambiente e historial de revisiones. La instantánea ayuda a recuperarse de una desinstalación posterior u otra reparación destructiva; la sustitución normal de la app conserva la base de datos original.

El instalador envía a la app activa una petición de preparación de actualización, solo por ADB. La app deja de aceptar trabajo nuevo, termina las escrituras pendientes, pausa los escritores de la base de datos, vuelca su estado, consolida el registro de escritura anticipada de SQLite y cierra la base de datos. Solo confirma esa petición exacta después de registrar el proceso anterior, la versión de app, el número de bytes, un SHA-256 verificable por el equipo, la versión del esquema y el número de filas de estado.

Copia la base de datos cerrada directamente desde el almacenamiento privado de la app, sin preparar una segunda copia en el panel. La copia del equipo solo se acepta si su tamaño y su SHA-256, que siempre se comprueba, coinciden con la confirmación y supera las comprobaciones locales de integridad, esquema y filas de SQLite.

Si la app no devuelve la confirmación exacta, por ejemplo por tiempo de espera agotado o respuesta mal formada, el instalador recurre una sola vez a `.backup` en vivo de SQLite. Produce la misma base de datos única y autónoma, sin archivos de registro de escritura anticipada ni diario junto a ella. Un panel sin acceso root no puede exponer su base de datos privada; puede que solo esté disponible la exportación de ajustes.

En una actualización normal sobre la instalación existente, la copia de la base de datos es de mejor esfuerzo. Una copia fallida o inconsistente se elimina, el instalador muestra un aviso destacado y la sustitución de la app puede continuar conservando sus datos originales. Nunca se conserva ni se etiqueta como correcta una copia inválida.

No hay un umbral fijo de espacio libre para esta copia. La ruta normal no prepara nada en el panel y el único intento alternativo deja que la captura real determine si cabe. La presión de almacenamiento, una comprobación de salud fallida, un endpoint de estado inaccesible, una respuesta mal formada o un estado desconocido se notifican antes y después de instalar. Ninguno bloquea una sustitución normal de la app, porque la nueva compilación puede ser el único intento útil de recuperar una antigua que falla o es inaccesible. Un `--verify` independiente informa de esas condiciones como fallo si necesitas un resultado estricto.

## Zona horaria y primera instalación

Antes de cambiar el panel, el instalador compara su zona horaria con la del equipo. Una diferencia genera un aviso, no una parada: el panel puede usar legítimamente otra zona. Compara nombres de zona, no el desplazamiento UTC actual, y resuelve alias conocidos mediante la base de zonas horarias del equipo. Así detecta paneles que conservan la zona de fábrica, que de otro modo registrarían eventos y ejecutarían horarios a una hora local incorrecta.

No informa de nada si no puede determinar cualquiera de los valores. Una respuesta ausente, un nombre inválido o un alias desconocido para la base de zonas del equipo no hacen fallar ni cambian la instalación.

Un panel limpio no tiene endpoint de estado de la app, igual que algunas instalaciones averiadas. El instalador pregunta al gestor de paquetes de Android si ha-paneld está instalado antes de distinguir los casos. Un «no instalado» definitivo inicia una primera instalación normal. Una consulta de ADB o del gestor de paquetes sin respuesta detiene la ejecución antes de cambiar el panel.

## Actualizaciones del auxiliar root

Las versiones publicadas incluyen auxiliares sellados `armeabi-v7a` y `arm64-v8a`. En un panel con `su` del fabricante o ADB root, el instalador autentica el binario elegido con la clave de publicación, lo verifica de nuevo tras prepararlo y lo instala o actualiza de forma atómica. Comprueba las capacidades del protocolo y la identidad de compilación reproducible que necesita la app antes de sustituirla.

El auxiliar anterior, propiedad de root, y su servicio siguen disponibles hasta que la app se instala correctamente. Un fallo de instalación o inicio del auxiliar, o una identidad o capacidad incorrecta, restaura la pareja anterior operativa antes de sustituir la app. Si ADB se desconecta mientras Android instala la app, conserva el diario de recuperación. Repetir el mismo comando autentica la app instalada y el auxiliar activo, y completa o revierte la actualización interrumpida.

Las instantáneas de recuperación pertenecen a root, se autentican mediante su resumen registrado y se sincronizan al almacenamiento antes de retirar los archivos activos. El instalador se niega a empezar si existe una transacción del auxiliar sin terminar e indica qué comando debes repetir.

Prefiere un servicio init en `/system` escribible cuando puede verificar espacio suficiente. Si `/system` es de solo lectura, usa un ejecutor verificado de Magisk, KernelSU o APatch en `/data/adb/service.d`. Si `/system` es escribible pero está lleno, puede mantener el auxiliar y los archivos de recuperación en `/data/adb/hapaneld` y poner solo el servicio de arranque en `/vendor/etc/init`; las actualizaciones posteriores conservan esa distribución verificada. Se detiene antes de sustituir la app si no puede determinar la capacidad, quién controla el arranque o el estado de una transacción existente.

La app incluye el auxiliar correspondiente como alternativa. Si un panel con instalación directa mediante `su` se actualiza desde Instalar o la entidad de actualización de Home Assistant sin volver a pasar por el instalador, el primer inicio comprueba el protocolo necesario y puede lanzar una copia propiedad de root desde `/data/local`. Un panel rooteado que aísla root no puede permitir con seguridad que un auxiliar antiguo se sustituya a sí mismo, por lo que rechaza la operación y pide ejecutar el instalador autenticado desde un equipo.

## Qué puede detener una ejecución

El instalador termina con resultado distinto de cero si no puede determinar con seguridad algo necesario para la operación solicitada. Por ejemplo: una consulta de paquetes sin respuesta, una app con paquete o firmante incorrecto, una transacción del auxiliar irrecuperable, una exportación solicitada que no puede verificarse o una autocomprobación obligatoria posterior a la instalación fallida.

Otros hallazgos son avisos porque detenerse dificultaría la recuperación. Una copia automática de base de datos no disponible, un aviso de salud del almacenamiento o una consulta de estado fallida antes de actualizar no impiden por sí solos una sustitución normal. El instalador expresa ese límite claramente en vez de presentar como correcta una copia parcial o inválida.

### Interpretar un rechazo

Cada rechazo indica una condición y no cambia nada en el panel salvo que diga lo contrario. El mensaje señala qué reparar, porque las soluciones son muy distintas.

- **La base de datos canónica seguía cambiando mientras se leía.** La app seguía escribiendo mientras el instalador intentaba copiarla de forma consistente. El panel está ocupado, no dañado. La copia se reintenta automáticamente; este mensaje significa que siguió escribiendo en todos los intentos. Normalmente basta con repetir cuando esté más tranquilo.
- **No se pudo leer la base de datos canónica**, o **no es un archivo normal.** Es el caso contrario: afecta a los datos guardados, no a la app. El archivo falta, no es un archivo o no puede abrirse. Recupera la base de datos antes de reintentar.
- **Falta la base de datos canónica aunque la app está instalada.** La app está presente, pero no su almacén; una actualización normal no puede resolverlo. Restaura una copia en vez de reintentar.
- **El destino de instalación es de solo lectura.** El directorio del auxiliar privilegiado está en un sistema de archivos montado como solo lectura. En la mayoría de paneles puedes remontarlo escribible sin reiniciar. El instalador indica qué sistema de archivos midió; consulta esa línea antes de suponer la partición.
- **El destino de instalación no tiene espacio o inodos libres.** Ambos indican lo medido y se distinguen porque puede agotarse uno mientras sobra el otro.
- **No se pudo conciliar una actualización anterior incompleta.** Una ejecución anterior dejó un registro de recuperación que no puede conciliarse con lo instalado. No cambia nada. Hay que examinar el registro: repetir llegaría a la misma conclusión.
- **La app sigue instalada pasado un tiempo desde el aprovisionamiento de su sucesora.** La app nueva se instaló, pero la antigua no se retiró dentro del plazo de espera. El panel funciona; lo que no terminó fue la retirada.

Un rechazo que menciona una reversión indica si se verificó. «Reversión completada y verificada» significa que el panel está como antes de la ejecución. «No se pudo verificar la reversión» significa que debes comprobar el auxiliar privilegiado antes de confiar en operaciones privilegiadas, aunque no se sustituyera la app.
