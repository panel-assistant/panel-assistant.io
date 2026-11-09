---
title: Referencia de control y Home Assistant
description: Entidades y servicios de Home Assistant para automatizar un panel, sus páginas propias y la obsolescencia de la API REST.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Home Assistant es la vía para automatizar y supervisar un panel. Panel Assistant publica cada panel como dispositivo con entidades y servicios: ahí está todo lo que necesita una automatización o un panel de control. Esta página enumera entidades, páginas y endpoints propios y el estado de la API REST.

## Entidades de Home Assistant

Las entidades compatibles aparecen sin YAML. Los IDs predeterminados siguen las formas siguientes, donde `<panel>` es el ID configurado. Se omiten entidades específicas del hardware si el perfil activo declara ausente la capacidad; las opcionales de ajustes y diagnóstico pueden mostrarse u ocultarse individualmente en Configurar.

| Entidad                                                  | Contrato                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `light.<panel>_screen`                                   | Encendido, apagado y brillo con el esquema de luz JSON de Home Assistant y brillo de `0` a `255`. El apagado sigue el perfil: retroiluminación física si existe, suspensión Android si hay una vía `keyevent` validada o atenuación segura como alternativa. La suspensión Android rechaza paneles protegidos por PIN, patrón o contraseña. |
| `light.<panel>_led`                                      | LED RGB o solo de brillo según el backend; los compatibles también ofrecen efectos.                                                                                                                                                                                                                                                         |
| `light.<panel>_buttons`                                  | Retroiluminación de botones con brillo si la declara el perfil.                                                                                                                                                                                                                                                                             |
| `light.<panel>_button_led1` a `button_led4`              | LED individuales si los declara el perfil.                                                                                                                                                                                                                                                                                                  |
| `switch.<panel>_relay1` a `relay4`                       | Relés físicos si los declara el perfil.                                                                                                                                                                                                                                                                                                     |
| `text.<panel>_navigate`                                  | Envía una ruta al renderizador activo. El integrado navega en el proceso; el externo recibe un enlace profundo.                                                                                                                                                                                                                             |
| `text.<panel>_home_dashboard`                            | Configura la ruta de las acciones de retorno al panel de control.                                                                                                                                                                                                                                                                           |
| `number.<panel>_volume`                                  | Volumen de anuncios de `0` a `100` por ciento en el flujo musical Android, solo en un panel sin altavoz. Con altavoz se usa su reproductor multimedia.                                                                                                                                                                                      |
| `event.<panel>_button`                                   | Eventos físicos publicados con captura de Accesibilidad Android activa o una vía de botones verificada declarada por el perfil.                                                                                                                                                                                                             |
| `sensor.<panel>_illuminance`                             | Iluminancia ambiental en lux si hay sensor de luz Android estándar.                                                                                                                                                                                                                                                                         |
| `sensor.<panel>_temperature` / `sensor.<panel>_humidity` | Lecturas climáticas locales si las declara el perfil.                                                                                                                                                                                                                                                                                       |
| `binary_sensor.<panel>_proximity`                        | Ocupación cerca/lejos calibrada. No disponible hasta que el modelo local sea fiable.                                                                                                                                                                                                                                                        |
| `sensor.<panel>_proximity_level`                         | Proximidad normalizada desde `0` (base lejana calibrada) hasta `100` (referencia cercana calibrada).                                                                                                                                                                                                                                        |
| `sensor.<panel>_zigbee_gateway_health`                   | Salud acotada del gateway y atributos diagnósticos con datos sensibles eliminados en paneles Zigbee.                                                                                                                                                                                                                                        |
| `sensor.<panel>_storage_health`                          | Salud diagnóstica de almacenamiento y SQLite, con espacio libre, crecimiento y atributos de integridad acotados. La presión crítica o fallo de base de datos también hace fallar la verificación del instalador; ha-paneld no recupera espacio automáticamente.                                                                             |
| `camera.<panel>_camera`                                  | Vídeo e imágenes fijas desde el flujo RTSP de la cámara. Desactivada por defecto. Activarla mediante la entidad exige aprobación en pantalla en todos los modos de seguridad; apagarla no. También necesita permiso Android e indicador de cámara en uso operativo.                                                                         |
| `button.<panel>_reload`                                  | Recarga el renderizador integrado en el proceso o reinicia el externo elegido.                                                                                                                                                                                                                                                              |
| `button.<panel>_reboot`                                  | Reinicia mediante una vía privilegiada disponible.                                                                                                                                                                                                                                                                                          |
| `media_player.<panel>_media_player`                      | Altavoz: reproduce URL o fuente multimedia, anuncia sobre lo reproducido, pausa, reanuda, detiene y ajusta o silencia volumen.                                                                                                                                                                                                              |
| `sensor.<panel>_status`                                  | Indica `online`, `connected` (mantiene sesión pero su dirección guardada no responde), reinicio por `update`, `settings`, `recovery` o `reboot`, o sesión iniciada en otro Home Assistant. Incluye `reachable`, `connected`, `build`, `config_hash` y `home_assistant_state`.                                                               |

Con micrófono, Home Assistant también recibe `assist_satellite.<panel>`: el [asistente de voz](/es/manage/voice-assistant/) del panel. No está disponible mientras el asistente está desactivado.

Las entidades de configuración, rendimiento y diagnóstico basadas en el registro solo se publican si se exponen en Configurar. Los sensores diagnósticos opcionales son última hora de arranque, uso CPU, uso de memoria, temperatura SoC, dirección IP, red Wi-Fi, intensidad Wi-Fi y cortes Wi-Fi (24 h).

## Automatizar desde Home Assistant

Usa entidades y servicios estándar; no necesitas llamar al propio panel.

- **Reproducir audio o anunciar.** Invoca `media_player.play_media` en su reproductor con URL o fuente multimedia. `announce: true` habla sobre lo que se reproduzca. `media_player.media_pause`, `media_player.media_play`, `media_player.media_stop`, `media_player.volume_set` y `media_player.volume_mute` funcionan como en cualquier reproductor.
- **Ajustar volumen.** Con altavoz usa `media_player.volume_set` en el reproductor. Sin altavoz existe el número Volumen: usa `number.set_value`.
- **Controlar pantalla y panel de control.** Usa la luz Pantalla, texto Navegar, texto Panel de control de inicio y botón Recargar panel de control.
- **Supervisar.** Observa Estado, sus atributos y los sensores anteriores. Sustituyen consultar la línea de salud desde un script y Home Assistant conserva el historial.

```yaml
action: media_player.play_media
target:
  entity_id: media_player.wall_panel_media_player
data:
  media_content_type: music
  media_content_id: https://example.com/doorbell.mp3
  announce: true
```

El audio HTTPS usa el almacén de confianza Android y verifica el nombre de host. Rechaza certificados autofirmados salvo que su CA esté instalada; HTTP sigue disponible para fuentes LAN de confianza.

## Páginas y endpoints propios

Selecciona **Visitar** en la página de dispositivo de Home Assistant para abrir la página local. Cada panel sirve un conjunto pequeño y fijo de rutas en su puerto HTTP, `8888` por defecto (por ejemplo, `http://<panel>:8888/`). No se documenta ni promete nada más.

| Ruta                         | Finalidad                                                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `/`                          | Estado, capacidades, diagnóstico y vista previa del panel de control actual. Es `configuration_url` del dispositivo Home Assistant. |
| `/setup`                     | Configuración guiada inicial o tras restablecer: identidad, conexión, renderizador, panel de inicio y filtro.                       |
| `/configure`                 | Ajustes del renderizador y comportamiento.                                                                                          |
| `/profiles`                  | Selección, inspección y creación YAML de perfiles.                                                                                  |
| `/entities`                  | Aprendizaje, política y anulaciones de entidades del renderizador integrado.                                                        |
| `/install`                   | Software, copias, restauración y mantenimiento.                                                                                     |
| `/logs`                      | Registros en vivo de la app con datos sensibles eliminados.                                                                         |
| `/health` y `/api/v1/health` | Informe de salud de una línea descrito abajo.                                                                                       |
| `/diag` y `/api/v1/diag`     | Informe diagnóstico de texto. Revísalo antes de compartirlo.                                                                        |
| `/ui`                        | Socket de las páginas propias. No es interfaz de scripts y puede cambiar entre versiones.                                           |

Las páginas también cargan scripts, estilos e iconos desde el panel.

### Línea de salud

Puede incluir `ha=<state>`, donde el estado es `normal`, `shutting_down`, `starting`, `back_online` o `connection_lost`. Panel Assistant envía avisos nativos del ciclo de vida; `connection_lost` significa desconexión sin aviso de apagado y es distinto de detenerse deliberadamente.

`ha_src=native` identifica un estado observado mediante Panel Assistant. Los estados inferidos localmente pueden omitirlo. No se usa fuente MQTT del ciclo de vida.

Mientras el panel mantiene un socket autenticado con Home Assistant por cualquier motivo (fuente de luz o presencia de Home Assistant o vigilancia del registro), también informa de la conexión medida. Una vez que la sonda de eco ICMP ha respondido, `ha_net` y el aviso del panel usan su veredicto sobre las seis ráfagas más recientes, incluidas la latencia de la ruta y la pérdida de paquetes. Mientras esa sonda no sea compatible o nunca haya respondido, el veredicto recurre a las sondas WebSocket de cinco minutos: más del 5 % sin respuesta, con al menos dos fallos, genera un aviso; dos fallos consecutivos generan un estado grave. La latencia de ida y vuelta WebSocket se clasifica por separado como `ha_resp` y nunca genera el aviso del panel. La capacidad de respuesta WebSocket se clasifica por separado como `ha_resp=<healthy|warning|severe>`: aviso cuando más del 5 % de las respuestas de la ventana, y al menos dos respuestas, superan 250 ms; el estado grave usa la misma regla con 1.000 ms. Es solo una observación de rendimiento. `ha_net_p95=<ms>` es el percentil 95 por rango más próximo de los pings WebSocket propios (`-1` sin respuestas); `ha_net_n=<count>`, sondeos en la ventana; `ha_net_miss=<count>`, no respondidos; `ha_net_age=<ms>`, tiempo desde la última respuesta (`-1` si nunca hubo), que distingue un socket recién conectado de un flujo que dejó de sondear. Los tres primeros minutos tras iniciar la app solo se informa `ha_net=settling`, sin veredicto: la carga de arranque describe más el panel que la conexión. Un fallo WebSocket o un pico de tiempo de respuesta aislado nunca genera una alarma. Los fallos causados por Home Assistant, como cerrar o rechazar conexión al reiniciarse o rechazar el inicio de sesión, se cuentan aparte, nunca como pérdida. Un sondeo sin respuesta mientras sigue llegando cualquier otra trama, incluso una respuesta tardía anterior, indica servidor ocupado, no ruta perdida: cuenta como fallo del servidor y el socket compartido sigue activo. La medición pertenece a un socket autenticado, no al deseo de tenerlo: los tokens no aparecen hasta conectar e iniciar sesión, y desaparecen cuando deja de usarse (sin credenciales, sin necesidad de socket o conexión que ha desistido). Mientras se restablece uno antes activo, permanecen: hay que informar de una ruta rota durante el corte que explica. Por ello un veredicto sano siempre es explícito, no una omisión. `/diag` incluye ambos en `[ha-network]`, nunca dirección Home Assistant, nombre de red ni muestras individuales. A su lado se informa una segunda medición independiente: una pequeña ráfaga de ecos ICMP a la dirección real del socket, y `/diag` informa del resultado en una línea `[ha-path-probe]`. Es intermitente, no continua; el intervalo crece mientras la ruta se demuestra correcta y vuelve al mínimo ante cualquier anomalía. Informa `state=unsupported` si la plataforma no concede socket ICMP y `state=unproven` hasta recibir un eco: el silencio previo no cuenta como pérdida, porque un proxy inverso o host que filtre ICMP haría parecer totalmente fallida una red correcta. Ambas líneas indican la **familia de direcciones usada realmente por el socket** (`family=ipv4` o `family=ipv6`) en todos los estados, incluido `unsupported`: importa más cuando no hay otras pruebas de capa 3. No es una dirección, nombre de host ni nombre de red.

Configurar puede iniciar la autenticación normal en el navegador de Home Assistant. Puedes abrir o copiar el enlace en una ventana privada para evitar escribir credenciales en el panel. Home Assistant redirige al callback local; ha-paneld intercambia el código de un uso y nunca devuelve tokens de acceso o actualización al navegador. El callback sigue las mismas comprobaciones de LAN y Host que el servicio, se vincula a la dirección del panel que lo inició, caduca a los diez minutos y responde con `no-store`/`no-referrer`.

El servicio usa deliberadamente LAN de confianza en vez de autenticación general. Rechaza antes de enrutar clientes fuera de LAN, cabeceras Host inválidas y peticiones de navegador con Origin o Referer discordantes. Mantén el servicio en una red de confianza y no lo expongas directamente a Internet. El [modo reforzado](/es/manage/security-mode/) opcional exige acceso físico para peticiones LAN directas protegidas; la [referencia de seguridad](/es/reference/security/) describe el modelo completo.

## La API REST está obsoleta

La API REST bajo `/api/v1` está obsoleta y ya no se publica su referencia OpenAPI. Si el panel ya no sirve una ruta, responde `410` y `{"error": "gone"}`. La API deja de responder cuando Panel Assistant ya no la necesita. Usa Home Assistant para automatizar y supervisar.

## Emparejamiento y descubrimiento

ha-paneld anuncia `_ha-paneld._tcp.local.` con metadatos de versión, capacidades, rutas y nombre descriptivo. Un token opaco por respondedor permite comprobar que el anuncio actual propio sigue visible en la LAN; tras fallos repetidos reconstruye el respondedor con reintentos acotados y el diagnóstico avisa si se agota la recuperación.
