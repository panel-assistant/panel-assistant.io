---
title: Formato y compatibilidad de perfiles
description: Resumen anotado de los perfiles de panel del esquema 2, con las reglas de validación, coincidencia y compatibilidad que aplica la app.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Los perfiles de panel en ejecución son documentos YAML con un esquema cerrado y versionado. La página Perfil de un panel compatible ofrece un descriptor de autoría legible por máquinas y un catálogo de controladores; esta página es un resumen anotado. Para todos los campos y el vocabulario de controladores de tu compilación instalada, usa Perfil. Aquí se explican el modelo de documento y las reglas de compatibilidad, sin sustituir la validación de la versión ha-paneld de destino.

## Modelo de documento

Cada perfil contiene estas secciones conceptuales:

| Sección                        | Finalidad                                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Esquema                        | Selecciona el lenguaje de documento que entiende ha-paneld.                                                                                         |
| Identidad                      | ID estable del perfil y contenido versionado independientemente.                                                                                    |
| Metadatos                      | Nombre legible, autor, fuente, enlaces solo visibles, licencia, madurez, firmware probado y limitaciones conocidas.                                 |
| Requisitos                     | Núcleo mínimo compatible y controladores/funciones compilados que exige el documento.                                                               |
| Coincidencia                   | Reglas acotadas sobre la huella del panel.                                                                                                          |
| Capacidades y controladores    | Datos de hardware, selección de controladores compilados y parámetros tipados.                                                                      |
| Estrategias con nombre         | Reglas opcionales del núcleo para el pequeño conjunto admitido de valores dependientes de firmware/modelo.                                          |
| Intención de aprovisionamiento | Orientación de acceso, recomendaciones de software/pantalla, estado deseado de paquetes y recetas seleccionadas del núcleo; nunca concede permisos. |

Los campos raíz incluyen `schema`, `id`, `version`, `display_name`, `soc_class`, `soc`, `metadata`, `requires`, `match`, `platform`, `hardware`, `sensors`, `identity`, `input`, `cpu`, `display` y `provisioning`. Los nombres usan `snake_case` en minúsculas; los valores distinguen mayúsculas salvo indicación contraria del campo. Consulta el [ejemplo comunitario mínimo](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml).

Los valores enumerados permitidos y el vocabulario de controladores y artefactos se definen en el esquema y catálogo servidos por la versión en ejecución. Valida con la misma versión que activará el perfil.

## Esquema cerrado

Los campos desconocidos son errores. Esto detecta erratas que de otro modo eliminarían silenciosamente una propiedad de seguridad o dejarían una capacidad sin configurar. El esquema 2 no tiene zona de extensiones libres. Pon autor, fuente HTTPS, licencia de estilo SPDX, madurez `draft`/`experimental`/`verified`, firmware probado y limitaciones en `metadata`; esos valores no pueden definir coincidencias, controladores, acceso ni comportamiento en ejecución.

Las claves YAML duplicadas, alias y claves recursivas son errores. Solo se permite un documento YAML. Las etiquetas YAML no pueden construir objetos de aplicación ni Java, y los perfiles no pueden contener predicados de expresión regular. El cargador admite como máximo 20 niveles de anidación, 20,000 eventos del analizador, 512 entradas en cada mapa o lista y 16,384 caracteres en cada cadena. Mantén documentos simples y explícitos aunque el editor YAML permita sintaxis más elaborada.

Cada revisión YAML está limitada a 128 KiB. El catálogo local importado también está limitado a 128 revisiones totales, 16 por ID de perfil y 4 MiB de YAML. Exporta y elimina revisiones inactivas obsoletas antes de guardar más; las activas, pendientes y últimas válidas siguen protegidas. Estos límites evitan agotar almacenamiento o analizar un catálogo ilimitado al arrancar al intercambiar perfiles.

Los campos obligatorios no pueden ser null. En los opcionales, el lector actual suele tratar null como ausencia, pero los autores deben omitir valores desconocidos para dejar clara la intención. Cadenas, listas y mapas vacíos, ceros y false son valores reales y pueden diferir de la omisión o del valor predeterminado documentado.

## Identidad y versiones

Usa un ID estable y distinguible de 1 a 128 letras ASCII minúsculas o dígitos, con puntos y guiones solo en el interior. No se permiten puntos consecutivos. Prefiere un prefijo de autor u organización si un nombre genérico puede coincidir, por ejemplo `org.example.wallpanel-x1`. No incluyas un número de firmware en el ID si un perfil y sus estrategias con nombre pueden cubrir la familia de hardware.

La versión de contenido del perfil pertenece al autor y cambia al cambiar sus conocimientos o comportamiento. Usa versionado semántico si lo compartirás:

- patch: aclaraciones o metadatos sin cambiar coincidencias ni comportamiento en ejecución;
- minor: conocimientos adicionales de capacidades, una variante compatible nueva de firmware o una recomendación más segura;
- major: cambio de identidad de coincidencia, selección de controladores, privilegios necesarios u otro cambio que merezca una migración deliberada.

La versión del esquema pertenece a ha-paneld. Los autores no deben incrementarla para versionar su propio perfil.

## Resumen anotado de campos del esquema 2

«Obligatorio» significa que la clave debe estar presente con el tipo indicado. «Opcional; predeterminado …» significa que omitirla (o null en un campo opcional) produce ese valor. Las claves desconocidas son errores en todos los niveles. Los enteros deben caber en un valor de 32 bits con signo antes de comprobar el intervalo más estrecho del campo; los números deben seguir siendo finitos al convertirlos a flotante de 32 bits donde el campo use un número.

### Campos raíz

| Campo          | Presencia                        | Tipo y validación                                                                                                                                                                                                                                                |
| -------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`       | Obligatorio                      | Entero; exactamente `2`. No se acepta el esquema 1.                                                                                                                                                                                                              |
| `id`           | Obligatorio                      | Cadena de 1 a 128 caracteres; letras ASCII minúsculas/dígitos, con `.` o `-` solo en el interior; `..` está prohibido.                                                                                                                                           |
| `version`      | Obligatorio                      | Versión de contenido: exactamente tres componentes separados por puntos, cada uno `0` o de 1 a 9 dígitos sin cero inicial; identificadores preliminares opcionales separados por puntos con letras ASCII, dígitos y `-`; sin sufijo de metadatos de compilación. |
| `display_name` | Obligatorio                      | Cadena no vacía ni compuesta solo por espacios en blanco, de 1 a 100 caracteres.                                                                                                                                                                                 |
| `soc_class`    | Obligatorio                      | Cadena no vacía ni compuesta solo por espacios en blanco, de 1 a 100 caracteres.                                                                                                                                                                                 |
| `soc`          | Opcional; predeterminado ausente | Datos estructurados de SoC respaldados por pruebas del perfil; campos siguientes.                                                                                                                                                                                |
| `metadata`     | Obligatorio                      | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `requires`     | Obligatorio                      | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `match`        | Obligatorio                      | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `platform`     | Obligatorio                      | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `hardware`     | Obligatorio                      | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `sensors`      | Opcional; predeterminado `{}`    | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `identity`     | Opcional; predeterminado `{}`    | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `input`        | Opcional; predeterminado `{}`    | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `cpu`          | Opcional; predeterminado `{}`    | Mapa; campos siguientes.                                                                                                                                                                                                                                         |
| `display`      | Opcional; predeterminado `{}`    | Datos de pantalla física; campos siguientes.                                                                                                                                                                                                                     |
| `provisioning` | Obligatorio                      | Mapa de intención de aprovisionamiento; campos siguientes.                                                                                                                                                                                                       |

### `metadata` y `requires`

| Campo                       | Presencia                        | Tipo y validación                                                                                                                                                                                                                                                              |
| --------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `metadata.author`           | Obligatorio                      | Cadena no vacía ni compuesta solo por espacios en blanco, de 1 a 100 caracteres.                                                                                                                                                                                               |
| `metadata.source`           | Opcional; predeterminado ausente | URL HTTPS absoluta, máximo 500 caracteres, host no vacío y sin componente de información de usuario.                                                                                                                                                                           |
| `metadata.links`            | Opcional; predeterminado `[]`    | Lista de hasta ocho enlaces externos solo para mostrar. ha-paneld nunca los descarga, precarga ni usa para aprovisionar. URL y etiquetas deben ser únicas; ningún enlace puede repetir `metadata.source`.                                                                      |
| `metadata.links[].label`    | Obligatorio por elemento         | Etiqueta visible no vacía ni compuesta solo por espacios en blanco de 1 a 48 caracteres, sin caracteres de control ni formato bidireccional. Perfiles también muestra el host de destino en un segmento de texto aislado.                                                      |
| `metadata.links[].url`      | Obligatorio por elemento         | URL HTTPS absoluta con las mismas reglas de 500 caracteres, host y ausencia de información de usuario que `metadata.source`.                                                                                                                                                   |
| `metadata.license`          | Obligatorio                      | Cadena de estilo SPDX con uno o más identificadores de 1 a 64 caracteres que coincidan con `[A-Za-z0-9][A-Za-z0-9.+-]*`, separados solo por `AND` u `OR`. No admite paréntesis, `WITH` ni prosa arbitraria.                                                                    |
| `metadata.maturity`         | Obligatorio                      | `draft`, `experimental` o `verified`.                                                                                                                                                                                                                                          |
| `metadata.tested_firmware`  | Opcional; predeterminado `[]`    | Lista de hasta 32 cadenas no vacías ni compuestas solo por espacios en blanco, cada una de hasta 120 caracteres.                                                                                                                                                               |
| `metadata.limitations`      | Opcional; predeterminado `[]`    | Lista de hasta 32 cadenas no vacías ni compuestas solo por espacios en blanco, cada una de hasta 500 caracteres.                                                                                                                                                               |
| `requires.min_core_version` | Opcional; predeterminado ausente | Versión con puntos, máximo 64 caracteres: de 1 a 4 componentes numéricos de 1 a 6 dígitos cada uno, con sufijo preliminar opcional alfanumérico ASCII/`-` separado por puntos. El núcleo en ejecución debe ser igual o posterior, incluido el orden de versiones preliminares. |
| `requires.drivers`          | Obligatorio                      | Lista de IDs de controladores del núcleo. Los desconocidos son errores; debe enumerarse todo controlador exigido por una capacidad rellenada. Un controlador no utilizado genera un aviso.                                                                                     |

### `soc`

`soc_class` sigue siendo la etiqueta amplia obligatoria de familia. El bloque estructurado opcional registra datos que Android no suele identificar fiablemente, como si un panel supuestamente de cuatro núcleos usa Cortex-A35 o Cortex-A55. Aparecen en Panel de control y Perfiles, pero se omiten del informe público breve `/diag`. Añade solo datos respaldados por una fuente pública o pruebas de hardware; omite lo desconocido en vez de adivinar.

| Campo                          | Presencia                              | Tipo y validación                                                                                                                                                            |
| ------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `soc.model`                    | Obligatorio cuando está presente `soc` | Nombre de modelo no vacío ni compuesto solo por espacios en blanco, de 1 a 100 caracteres, sin controles C0 ni DEL.                                                          |
| `soc.introduced_year`          | Opcional; predeterminado ausente       | Entero de 1970 a 2100. Usa el año de presentación pública del SoC, no el de lanzamiento del panel.                                                                           |
| `soc.cpu_cores`                | Opcional; predeterminado `[]`          | Hasta ocho grupos de arquitecturas y 256 núcleos en total. Una lista vacía indica modelo conocido pero topología CPU insuficientemente respaldada.                           |
| `soc.cpu_cores[].architecture` | Obligatorio por elemento               | Arquitectura de núcleo no vacía ni compuesta solo por espacios en blanco, de 1 a 64 caracteres, sin controles; las arquitecturas deben ser únicas sin distinguir mayúsculas. |
| `soc.cpu_cores[].count`        | Obligatorio por elemento               | Entero de 1 a 128.                                                                                                                                                           |

### `match`

`match.any` aplica OR entre grupos; la lista `all` de un grupo aplica AND entre predicados; la lista `values` de un predicado aplica OR. Se distingue entre mayúsculas y minúsculas al comparar con los datos de compilación que ha-paneld ya pasó a minúsculas.

| Campo                      | Presencia   | Tipo y validación                                                                                                                                    |
| -------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `match.priority`           | Obligatorio | Entero de 0 a 1000; desempata perfiles tras la prioridad del grupo coincidente.                                                                      |
| `match.fallback`           | Obligatorio | Booleano. `true` solo es válido para el perfil incluido con ID `generic`; los importados/comunitarios no pueden ser alternativas de reserva.         |
| `match.any`                | Obligatorio | Lista de hasta 64 objetos de grupo. Un perfil que no sea de reserva necesita al menos un grupo; Generic incluido puede usar lista vacía.             |
| `match.any[].priority`     | Obligatorio | Entero de 0 a 1000; especificidad de rama usada antes de la prioridad del perfil.                                                                    |
| `match.any[].all`          | Obligatorio | Lista de 1 a 8 objetos de predicado.                                                                                                                 |
| `match.any[].all[].field`  | Obligatorio | `model`, `device` o `product_version`.                                                                                                               |
| `match.any[].all[].op`     | Obligatorio | `equals`, `starts_with` o `contains`.                                                                                                                |
| `match.any[].all[].values` | Obligatorio | Lista de 1 a 32 cadenas no vacías ni compuestas solo por espacios en blanco en minúsculas; cada una de hasta 100 caracteres sin controles C0 ni DEL. |

### `platform` y `hardware`

| Campo                                    | Presencia                           | Tipo y validación                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform.su_form`                       | Obligatorio                         | `none`, `android` o `toolbox`.                                                                                                                                                                                                                                                                                                                                                         |
| `platform.app_can_su`                    | Obligatorio                         | Booleano. Debe ser `false` si `su_form` es `none`; las formas `android` o `toolbox` aún pueden declararse con `false` para una app limitada por su entorno aislado.                                                                                                                                                                                                                    |
| `platform.has_recents`                   | Opcional; predeterminado `true`     | Booleano.                                                                                                                                                                                                                                                                                                                                                                              |
| `platform.has_native_navbar`             | Opcional; predeterminado ausente    | Omítelo para comprobar la visibilidad de la barra de navegación del firmware. `true` o `false` explícitos sustituyen esa comprobación.                                                                                                                                                                                                                                                 |
| `platform.launcher.vendor_home_packages` | Opcional; predeterminado vacío      | Lista de hasta 8 nombres de paquete Android, sin duplicados. Apps del fabricante registradas como Inicio de Android que no son cajones de apps, como su app de control. El botón Lanzador de navegación las omite y, si ninguna otra cumple, abre Lanzador del panel, que sí las enumera como apps.                                                                                    |
| `hardware.led`                           | Obligatorio                         | Mapa con los campos LED siguientes.                                                                                                                                                                                                                                                                                                                                                    |
| `hardware.led.mechanism`                 | Obligatorio                         | `none`, `autodetect`, `rk3576-ioctl`, `rk3576-ioctl-daemon` o `sysfs-daemon`. Se rechazan mecanismos exclusivos de daemon si `platform.app_can_su` es `true`.                                                                                                                                                                                                                          |
| `hardware.led.transfer`                  | Opcional; predeterminado `identity` | Selecciona una curva de transferencia compilada. Ejemplos: `identity`, `rk3576-four-bit`, `perceptual`, `gamma` y `points` medidos; usa el esquema servido para parámetros.                                                                                                                                                                                                            |
| `hardware.screen_off`                    | Obligatorio                         | Selecciona un controlador compilado de apagado, como `brightness-zero`, `su-blpower`, `daemon-blpower`, `keyevent`, `screen-timeout`, `device-admin` o `vendor-rpc`. Autoridad y requisitos de activación local dependen de la vía; usa el esquema servido y verifícala en hardware.                                                                                                   |
| `hardware.has_button_backlight`          | Opcional; predeterminado `false`    | Booleano; true selecciona la capacidad acotada de retroiluminación de botones mediante auxiliar.                                                                                                                                                                                                                                                                                       |
| `hardware.local_wake`                    | Opcional; predeterminado ausente    | Lista de valores únicos entre `touch`, `proximity` y `button`: formas de despertar localmente un panel totalmente oscuro. `touch` significa cualquier toque, `proximity` pasar la mano tras calibrar proximidad, y `button` un botón físico. Omite si se desconoce; lista vacía declara que solo Home Assistant lo despierta. Home Assistant siempre puede hacerlo y nunca se enumera. |
| `hardware.zigbee_gateway_dir`            | Opcional; predeterminado ausente    | Ruta exacta permitida `/vendor/bin/siliconlabs_host`; no acepta otra.                                                                                                                                                                                                                                                                                                                  |
| `hardware.relay_base`                    | Opcional; predeterminado ausente    | Una ruta exacta permitida: `/sys/class/relay`, `/sys/class/st_relay` o `/sys/class/strelay`.                                                                                                                                                                                                                                                                                           |
| `hardware.relay_base_fallbacks`          | Opcional; predeterminado `[]`       | Lista de hasta tres rutas de la misma lista permitida de relés. Deben ser únicas y no repetir `relay_base`.                                                                                                                                                                                                                                                                            |
| `hardware.button_led_gpio_base`          | Opcional; predeterminado ausente    | Entero de 0 a 4092, primer GPIO de un bloque de cuatro.                                                                                                                                                                                                                                                                                                                                |
| `hardware.camera`                        | Opcional; predeterminado ausente    | Booleano con tres estados: omisión permite enumeración Android; `true` declara candidato aunque falle; `false` suprime la cámara. La captura siempre exige un indicador adjunto en pantalla; con pantalla apagada exige además indicación LED activa. Sin indicación con pantalla apagada, la captura se detiene al apagarla.                                                          |
| `hardware.microphone`                    | Opcional; predeterminado ausente    | `true` declara micrófono probado, `false` lo suprime y la omisión usa enumeración de micrófono integrado Android seguida de comprobación de captura antes de escuchar. Independiente de la cámara.                                                                                                                                                                                     |
| `hardware.camera_lens_offset_px`         | Opcional                            | Entero; píxeles desde arriba del área activa de pantalla hasta el centro de la lente. El indicador de uso se dibuja como arco centrado en la lente; este valor lo posiciona. Es una medida del marco y difiere entre placas. Omítelo si no lo has medido; se usa una posición predeterminada.                                                                                          |
| `hardware.touch_click_gain`              | Opcional; predeterminado `0.2`      | Número de 0.05 a 1.0; escala el volumen de respuesta de pulsación para una placa cuyo clic sea demasiado alto o bajo con el valor del sistema.                                                                                                                                                                                                                                         |

### `sensors` e `identity`

| Campo                           | Presencia                               | Tipo y validación                                                                                                                                                            |
| ------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sensors.proximity_technology`  | Opcional; predeterminado ausente        | Cadena no vacía ni compuesta solo por espacios en blanco, de 1 a 100 caracteres, sin controles C0 ni DEL. Si está presente, declara uso del sensor de proximidad Android.    |
| `sensors.proximity_gpio`        | Opcional; predeterminado ausente        | Entero de 0 a 4095 para la vía GPIO binaria compatible con root.                                                                                                             |
| `sensors.light_technology`      | Opcional; predeterminado ausente        | Cadena no vacía ni compuesta solo por espacios en blanco, de 1 a 100 caracteres, sin controles C0 ni DEL. Si está presente, declara uso del sensor de luz ambiental Android. |
| `sensors.vi530x`                | Opcional; predeterminado `false`        | Booleano; expone una fuente de distancia por tiempo de vuelo VI530x iniciada por el auxiliar mediante ioctl y después sondeada. Requiere el auxiliar autenticado.            |
| `sensors.cht8305`               | Opcional; predeterminado `false`        | Booleano; activa una entrada climática de habitación exacta compatible con CHT8305 y admitida por el núcleo mediante el auxiliar autenticado.                                |
| `sensors.room_temp_offset_c`    | Opcional; predeterminado `0.0`          | Número finito de -30 a 30 °C.                                                                                                                                                |
| `identity.manufacturer`         | Opcional; predeterminado ausente        | Cadena no vacía ni compuesta solo por espacios en blanco, de 1 a 100 caracteres, sin controles C0 ni DEL; ausencia significa deducir en ejecución.                           |
| `identity.model`                | Opcional; predeterminado ausente        | Cadena no vacía ni compuesta solo por espacios en blanco, de 1 a 100 caracteres, sin controles C0 ni DEL; ausencia significa deducir en ejecución.                           |
| `identity.model_label_strategy` | Opcional; predeterminado `display-name` | `display-name` o `nspanel-product-version`.                                                                                                                                  |

Una revisión guardada del esquema 2 puede contener `proximity_near_below`, `proximity_near_raw`, `proximity_far_raw` o `proximity_graded_strategy`. El cargador solo acepta estas claves retiradas como marcas de compatibilidad: las ignora al cargar y las omite al serializar el documento. Exportar una revisión inmutable guardada conserva sus bytes originales. En ejecución se usan valores calibrados predeterminados del perfil de sensor o la configuración guiada guardada, y se comprueba la fuente activa antes de informar valores normalizados.

### `input`, `cpu` y `display`

| Campo                              | Presencia                        | Tipo y validación                                                                                                                                                             |
| ---------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input.evdev_buttons`              | Opcional; predeterminado `[]`    | Lista de hasta 32 objetos de asignación evdev. Se rechazan pares `(sw, code)` duplicados aunque difieran los nodos.                                                           |
| `input.evdev_buttons[].node`       | Obligatorio por elemento         | Cadena que coincida con `/dev/input/eventN`, donde `N` son de 1 a 3 dígitos decimales. No acepta otra ruta de dispositivo.                                                    |
| `input.evdev_buttons[].code`       | Obligatorio por elemento         | Entero de código de entrada/interruptor Linux de 1 a 767.                                                                                                                     |
| `input.evdev_buttons[].grab`       | Obligatorio por elemento         | Booleano; true solicita `EVIOCGRAB` exclusivo.                                                                                                                                |
| `input.evdev_buttons[].event_type` | Obligatorio por elemento         | Cadena de hasta 64 caracteres que coincida con `KEYCODE_[A-Z0-9_]+`.                                                                                                          |
| `input.evdev_buttons[].sw`         | Opcional; predeterminado `false` | Booleano; false selecciona `EV_KEY`, true selecciona `EV_SW`.                                                                                                                 |
| `cpu.governors`                    | Opcional; predeterminado ausente | Mapa cuyas únicas claves permitidas son `Performance`, `Efficiency` y `Auto`. Cada valor es un nombre de gobernador de 1 a 32 caracteres que coincida con `[a-z][a-z0-9_-]*`. |
| `display.physical_ppi`             | Opcional; predeterminado ausente | Entero de 50 a 1000.                                                                                                                                                          |

### `provisioning`

| Campo                                         | Presencia                             | Tipo y validación                                                                                                                                                                                             |
| --------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provisioning.access`                         | Opcional; predeterminado `{}`         | Mapa de recomendaciones de acceso.                                                                                                                                                                            |
| `provisioning.access.shizuku`                 | Campo de compatibilidad retirado      | Se aceptan e ignoran valores antiguos. No aportan vía de acceso en ejecución.                                                                                                                                 |
| `provisioning.software`                       | Opcional; predeterminado `{}`         | Mapa de política de software controlada por el núcleo.                                                                                                                                                        |
| `provisioning.software.webview.artifact`      | Opcional; predeterminado ausente      | ID del núcleo `lineageos-138-arm`, `lineageos-150-arm` o `lineageos-150-arm64`. Un perfil no puede aportar URL, versión ni hash del firmante.                                                                 |
| `provisioning.software.companion.max_version` | Opcional; predeterminado ausente      | Versión con puntos con la misma sintaxis y límite de 64 caracteres que `requires.min_core_version`.                                                                                                           |
| `provisioning.display.density`                | Opcional; predeterminado ausente      | Entero de 80 a 640 dpi o estrategia `nspanel-variant`.                                                                                                                                                        |
| `provisioning.display.font_scale`             | Opcional; predeterminado ausente      | Número finito de 0.5 a 1.5.                                                                                                                                                                                   |
| `provisioning.packages`                       | Opcional; predeterminado `[]`         | Lista de 0 a 128 objetos de estado deseado de paquetes.                                                                                                                                                       |
| `provisioning.packages[].package`             | Obligatorio por elemento              | Nombre de paquete Android único que coincida con `[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+`.                                                                                                                   |
| `provisioning.packages[].desired_state`       | Obligatorio por elemento              | `disabled`. Describe el estado deseado y no es consentimiento para ejecutarlo.                                                                                                                                |
| `provisioning.packages[].importance`          | Obligatorio por elemento              | `recommended` u `optional`. La importancia solo controla presentación, nunca significa aplicar de forma predeterminada.                                                                                       |
| `provisioning.packages[].tags`                | Opcional; predeterminado `[]`         | Lista de hasta ocho etiquetas. Cada una de 1 a 24 caracteres; empieza por letra ASCII minúscula y solo contiene después letras minúsculas, dígitos o `-`.                                                     |
| `provisioning.packages[].note`                | Opcional; predeterminado cadena vacía | Cadena de hasta 500 caracteres. Las notas son explicaciones complementarias, no procedimientos.                                                                                                               |
| `provisioning.recipes`                        | Opcional; predeterminado `[]`         | Lista de hasta 32 selecciones de recetas del núcleo.                                                                                                                                                          |
| `provisioning.recipes[].id`                   | Obligatorio por elemento              | ID registrado único. El esquema 2 conoce `nspanel-pro.watchdog-e2big-repair` y `tpa10.vendor-stack-minimize`. Las entradas no pueden contener argumentos, comandos, URL ni definiciones de flujos de trabajo. |

En la versión aún no publicada 1.0.0-rc2, los tres IDs WebView se resuelven a estas compilaciones y metadatos de compatibilidad controlados por el núcleo:

| ID de artefacto       | Compilación del núcleo                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `lineageos-138-arm`   | LineageOS System WebView `138.0.7204.63`; ARM ABIs `armeabi-v7a` y `arm64-v8a`; Android 8–9.            |
| `lineageos-150-arm`   | LineageOS System WebView `150.0.7871.63`; ARM ABI `armeabi-v7a`; Android 10 o posterior.                |
| `lineageos-150-arm64` | LineageOS System WebView `150.0.7871.63`; ARM ABIs `armeabi-v7a` y `arm64-v8a`; Android 10 o posterior. |

El campo de artefacto WebView elige una compilación cuya descarga, suma de comprobación, paquete, versión y firmante están compilados en el núcleo. En la versión aún no publicada 1.0.0-rc2, una actualización de la app iniciada desde Home Assistant también puede instalar un WebView compatible. Si queda incompleta, usa su reparación de actualización para reintentar. Importar o activar un perfil no inicia una actualización. Consulta [Actualizar WebView](/es/hardware/guides/update-the-webview/).

### Requisitos condicionales de controladores

Cada controlador seleccionado por campos rellenados debe aparecer en `requires.drivers`. El catálogo servido indica los requisitos de autoridad de cada controlador; varias vías Android y servicios del fabricante funcionan sin root.

| Condición del perfil                                                        | Controlador obligatorio   |
| --------------------------------------------------------------------------- | ------------------------- |
| `platform.su_form: android` y `platform.app_can_su: true`                   | `access.android-su`       |
| `platform.su_form: toolbox` y `platform.app_can_su: true`                   | `access.toolbox-su`       |
| `hardware.led.mechanism: autodetect`                                        | `led.autodetect`          |
| `hardware.led.mechanism: rk3576-ioctl`                                      | `led.rk3576-ioctl`        |
| `hardware.led.mechanism: rk3576-ioctl-daemon`                               | `led.rk3576-ioctl-daemon` |
| `hardware.led.mechanism: sysfs-daemon`                                      | `led.sysfs-daemon`        |
| `hardware.screen_off: brightness-zero`                                      | `screen.brightness-zero`  |
| `hardware.screen_off: su-blpower`                                           | `screen.su-blpower`       |
| `hardware.screen_off: daemon-blpower`                                       | `screen.daemon-blpower`   |
| `hardware.screen_off: keyevent`                                             | `screen.keyevent`         |
| `hardware.zigbee_gateway_dir` está presente                                 | `radio.siliconlabs-host`  |
| `hardware.relay_base` está presente, o `relay_base_fallbacks` no está vacío | `relay.sysfs`             |
| `hardware.button_led_gpio_base` está presente                               | `relay.gpio-button-led`   |
| `hardware.has_button_backlight: true`                                       | `input.button-backlight`  |
| `sensors.proximity_technology` o `sensors.light_technology` está presente   | `sensor.android`          |
| `sensors.proximity_gpio` está presente                                      | `sensor.gpio-proximity`   |
| `sensors.cht8305: true`                                                     | `sensor.cht8305-daemon`   |
| `sensors.vi530x: true`                                                      | `sensor.vi530x-daemon`    |
| `input.evdev_buttons` no está vacío                                         | `input.evdev`             |
| `provisioning.software.webview.artifact` está presente                      | `update.webview`          |

### Cuotas de sintaxis y almacenamiento

| Ámbito                         | Límite                                                            |
| ------------------------------ | ----------------------------------------------------------------- |
| Una revisión YAML sin procesar | 128 KiB de bytes UTF-8.                                           |
| Cantidad de documentos YAML    | Exactamente uno; entrada vacía no válida.                         |
| Alias YAML                     | Cero.                                                             |
| Anidación                      | Máximo 20 niveles de colecciones.                                 |
| Trabajo del analizador         | Máximo 20,000 eventos del analizador.                             |
| Cada mapa o lista              | Máximo 512 entradas antes de límites de campo más estrechos.      |
| Cada cadena                    | Máximo 16,384 caracteres antes de límites de campo más estrechos. |
| Catálogo importado             | Máximo 128 revisiones admitidas.                                  |
| Un ID de perfil importado      | Máximo 16 revisiones admitidas.                                   |
| Almacenamiento YAML importado  | Máximo 4 MiB en total.                                            |

## Requisitos

Un perfil declara el comportamiento mínimo del núcleo y los controladores compilados que necesita. La validación rechaza de forma segura un requisito no disponible. Un requisito no disponible difiere de una comprobación activa fallida: el primero significa que esta compilación no conoce el mecanismo solicitado; la segunda, que existe en el núcleo pero no fue accesible en este panel.

No amplíes requisitos por adelantado. Exigir un controlador privilegiado no utilizado dificulta ejecutar y revisar el perfil sin añadir capacidad.

## Reglas de coincidencia

Las reglas solo operan sobre los datos inmutables `model`, `device` y `product_version` expuestos por ha-paneld. Una lista `match.any` aplica OR; los predicados de la lista `all` de un grupo aplican AND. Admiten `equals`, `starts_with` y `contains` sobre valores esperados en minúsculas, nunca expresiones regulares.

Cada grupo tiene una `priority` de rama de 0 a 1000. Gana el perfil incluido coincidente con la mayor prioridad de grupo coincidente; `match.priority` del perfil rompe un empate restante, y un empate exacto pasa de forma segura a Generic. Usa prioridades de grupo mayores para identidades exactas de producto y menores para alternativas amplias de compatibilidad. Coincidir solo con `px30`, `rk3326`, `rk3566`, `rk3576` o un nombre de referencia reutilizado similar no basta para justificar controles específicos de hardware.

La coincidencia elige un perfil candidato; no demuestra una capacidad. Los controladores siguen comprobando su disponibilidad real, y prevalece el resultado conservador si pruebas y declaración discrepan.

## Estrategias de modelo con nombre

El esquema no tiene lenguaje genérico de expresiones ni sección de parches condicionales arbitrarios. Sus estrategias con nombre son deliberadamente pequeñas y controladas por el núcleo:

- `identity.model_label_strategy: nspanel-product-version` decodifica variante NSPanel y etiqueta de firmware;
- `provisioning.display.density: nspanel-variant` selecciona la densidad documentada 86P/120P;
- `display-name` predeterminado y valores enteros fijos evitan esas transformaciones.

`hardware.relay_base_fallbacks` son datos normales acotados para cambios conocidos y compatibles de nombre de clase de relé, no una expresión ni una búsqueda de rutas arbitraria.

Las estrategias son transformaciones compiladas y acotadas nombradas en el esquema, no scripts del perfil. No pueden invocar E/S ni controladores. El esquema servido describe las estrategias compatibles y sus entradas.

Crea perfiles separados si ninguna estrategia cubre la diferencia o si los productos necesitan otros controladores compilados, niveles de autoridad, expectativas de recuperación o pruebas mantenidas independientemente.

## Capacidades y controladores compilados

Una declaración de capacidad contiene datos de hardware y, cuando hace falta, un ID de controlador con parámetros tipados. Los IDs nombran implementaciones compiladas en ha-paneld. El controlador valida rutas, intervalos, códigos de evento, nombres de paquete y otras entradas sensibles para la seguridad. Las rutas privilegiadas se eligen de listas del núcleo. Los metadatos conservados `provisioning.software.webview.artifact` nombran URL, versión, suma del artefacto y hash del firmante compilados y auditados con el núcleo; el perfil no puede redefinir esa raíz de confianza. En la versión aún no publicada 1.0.0-rc2, una actualización iniciada por el propietario comprueba el proveedor instalado y su compatibilidad antes de usar ese artefacto; el perfil no puede aportar otra descarga ni raíz de confianza.

Los perfiles no pueden aportar:

- comandos shell o matrices de argumentos;
- nombres de comandos del daemon auxiliar;
- operaciones arbitrarias de lectura/escritura del sistema de archivos;
- bibliotecas nativas, números ioctl o cargas de bytes;
- URL APK, hashes de firmantes o nuevos artefactos de actualización;
- expresiones ejecutables con acceso a red, archivos, procesos, reflexión o reloj;
- credenciales, tokens Home Assistant o configuración MQTT.

Una capacidad declarada es candidata hasta que la confirme el controlador. La interfaz y el diagnóstico deben distinguir **declarada**, **disponible**, **no disponible** y **falta autoridad**, sin tratar YAML como prueba.

## Comportamiento de compatibilidad

ha-paneld trata los fallos de compatibilidad como problemas de perfil inactivo, no como fallos de arranque del panel:

- El esquema `2` es el único lenguaje aceptado. Las revisiones guardadas de esquema 1 pueden listarse, exportarse y eliminarse, pero no activarse; una selección incompatible vuelve a la última revisión válida compatible del esquema 2, al perfil incluido coincidente o al `generic.yaml` incluido.
- Un controlador o transformación obligatorio desconocido impide activar.
- Las revisiones locales instaladas se revalidan tras actualizar la app.
- El YAML original y su hash de contenido siguen identificables tras validar y normalizar.
- Un fallo de activación vuelve a la última revisión válida.
- Si ningún perfil específico puede ejecutarse, ha-paneld arranca con el comportamiento conservador de `generic.yaml` incluido. Si falta o está corrupto, un contrato de emergencia sin capacidades mantiene disponible la gestión local sin afirmar hardware del panel.

Los hashes de contenido y las firmas publicadas por separado responden a preguntas distintas. El hash de revisión vincula guardado y activación a los bytes inspeccionados. Una firma externa puede ayudar a identificar al publicador, pero el cargador no la interpreta como señal de autoridad. Ninguno concede root ni permiso para eludir validación y confirmación.

## Prioridad de coincidencias

La política de resolución evita que archivos comunitarios se activen implícitamente sobre productos conocidos:

1. selección administrativa explícita y válida fijada a una revisión exacta incluida o local;
2. coincidencia automática exacta de perfiles incluidos;
3. alternativas automáticas de compatibilidad incluidas;
4. Generic.

Las reglas locales o comunitarias solo se evalúan para vista previa y comparación. Nunca entran en la selección automática; importar o guardar no puede sustituir la detección incluida. Activarlas siempre exige una selección explícita fijada a una revisión.

## Comprobaciones de compatibilidad para autores

Antes de compartir una revisión nueva, confirma:

- el esquema `2` y cada campo se validan en la versión más antigua del núcleo que declara el archivo;
- cada controlador obligatorio está presente en esa versión;
- casos de prueba de huellas exactas cubren cada modelo y familia de firmware declarados;
- un caso casi coincidente no selecciona otro producto con el mismo SoC;
- cada límite de estrategia con nombre se ha probado justo por debajo, en él y por encima de la transición cuando corresponda;
- cada grupo de coincidencia exacta tiene mayor prioridad de rama que su alternativa amplia, con casos de colisión entre perfiles;
- el perfil funciona con hardware opcional no disponible y sin autoridad sin bloquear el arranque;
- la revisión activa anterior sigue siendo un destino utilizable para volver atrás.
