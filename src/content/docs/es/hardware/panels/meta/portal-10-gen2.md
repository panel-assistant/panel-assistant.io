---
title: Meta Portal 10" (2.ª generación)
description: Datos y consejos de compra del Meta Portal de 10 pulgadas (2.ª generación), modelo WD50JM, una pantalla Qualcomm QCS605 con Android 10, medida en una unidad física con Panel Assistant sin root.
vendor: Meta
model: Portal 10" (2nd gen), WD50JM
soc: Qualcomm QCS605
android: '10'
screen: 10,1 pulgadas, 1280 × 800
support: Preliminar
root: Sin root; el interruptor ADB de Meta basta para configurar
webview: WebView Chromium 131 propio de Meta
released: '2019'
evidence: [bench, firmware, documented]
sidebar:
  label: Portal 10" (2.ª generación)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Todo lo descrito se midió en un único Portal 10" comercial de 2.ª generación** con firmware Meta `QKQ1.210213.001.3051355900018050` (Android 10, parche 2020-08-05), ejecutando Panel Assistant sin root. El soporte Portal requiere la app 1.0 o posterior. No se comprobó nada en otro modelo; consulta [la familia Meta Portal](/es/hardware/panels/meta/) para los demás.
:::

Portal 10" (2.ª generación), modelo **WD50JM**, es una pantalla inteligente horizontal de 10,1 pulgadas con Qualcomm QCS605, unos 3 GB de RAM, cámara de 13 MP con luz propia, dos micrófonos, altavoz y deslizador físico de privacidad. Panel Assistant solo necesita [el interruptor ADB de Meta](#habilitar-adb): la app se instala por USB, reconoce el Portal y carga su perfil; panel de control, cámara, micrófono, palabra de activación, respuestas habladas, sensor de luz y apagado real funcionan sin root.

Es un buen panel con condiciones poco habituales, la mayoría impuestas por Meta. Las que conviene conocer antes de gastar están en [Antes de comprar](#antes-de-comprar).

:::tip
Lo esencial: **mantén iniciada la sesión de Meta**, porque el interruptor ADB está protegido por su PIN. **El interruptor ADB tiene el mismo aspecto activado y desactivado**: comprueba su estado en el ordenador. **Cuenta con volver a activar ADB tras reiniciar**; la depuración por red usada para actualizar nunca sobrevive al reinicio. Para restablecer, mantén **ambos botones de volumen al conectar la alimentación, sin ordenador conectado por USB**.
:::

## También se vende como

Meta Portal, Facebook Portal, Portal (2nd gen), Portal 10", modelo WD50JM. Android comunica modelo `Portal`, dispositivo y placa `omni`, producto `omni_prod`, fabricante y marca `Facebook`, plataforma `atlas`.

|                |                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| SoC            | Qualcomm **QCS605**, 8 núcleos                                                                                                         |
| RAM            | Unos **3 GB** (Android comunica 2,85 GB)                                                                                               |
| Almacenamiento | 6,7 GB para apps y datos, unos 3,9 GB libres tras configurar; sin ranura para tarjeta de memoria                                       |
| Pantalla       | **1280×800** horizontal, 10,1 pulgadas, **unos 149 ppi**, densidad base Android 160 dpi. Táctil FocalTech con doble toque para activar |
| Android        | 10 (API 29), producción `user`, SELinux enforcing; arm64-v8a                                                                           |
| WebView        | Compilación propia de Meta, Chromium **131**, actualizada en segundo plano por Meta. No requiere cambios                               |
| Sensores       | **Acelerómetro** e inclinación; **luz ambiental con color**. **Sin proximidad**                                                        |
| Cámara         | **13 MP** en la esquina superior izquierda del marco, con **luz verde** al lado. Las apps como la del panel reciben 1280×720           |
| Audio          | **Dos micrófonos**, un altavoz                                                                                                         |
| Privacidad     | **Deslizador de tres posiciones**: cámara y micrófonos activos; cámara tapada; cámara tapada y micrófonos apagados                     |
| Botones        | Subir y bajar volumen. Sin botón de encendido                                                                                          |
| Radios         | Wi-Fi, Bluetooth con **Bluetooth Low Energy**                                                                                          |
| Conectores     | **USB-C**, para ADB                                                                                                                    |
| Root           | Ninguno. Sin `su` ni desbloqueo de cargador conocido. ADB se activa en Debug de Meta                                                   |
| Lanzamiento    | 2019 (anunciado en septiembre, a la venta en octubre)                                                                                  |

## Antes de comprar

Ninguna de estas condiciones impide comprarlo, pero conviene conocerlas antes.

- **Necesitas una cuenta Facebook.** La configuración Meta no llega a los ajustes sin iniciar sesión. Ofrece Facebook o WhatsApp; no apareció el QR de WhatsApp y Facebook funcionó. Sirve una cuenta nueva para el panel.
- **La sesión debe permanecer iniciada.** Activar ADB pide el PIN de la cuenta Meta creada al configurar. Sin sesión no encontramos cómo reactivarlo y tampoco funcionó el restablecimiento de Meta en pantalla; solo lo recuperó el [restablecimiento físico](#recuperación-restablecimiento-de-fábrica). No retires la cuenta ni desactives la app de configuración Meta.
- **ADB no permanece activo.** Se informa de que Meta lo desactiva en cada reinicio: cuenta con reactivarlo. La conexión de red usada para actualizar se perdió en todos los reinicios probados. Esto afecta a las [actualizaciones](#actualizaciones).
- **Rechaza la descarga de firmware durante la configuración si puedes.** Meta ofrece una actualización. La rechazamos: todo se probó con la versión indicada arriba. Se desconoce si un firmware posterior cambia ADB y Meta no publica cómo retroceder.
- **Meta está retirando Portal.** Dejó de venderlos en 2022 y ha retirado funciones. Cabe esperar que más servicios propios y quizá métodos de inicio de sesión dejen de funcionar. La app del panel no depende de ellos.
- Necesitas **un ordenador con navegador basado en Chromium y cable USB-C de datos**, como en cualquier instalación [por USB](/es/install/install-over-usb/).

## Habilitar ADB

Meta documenta el procedimiento para todos los Portal ([Meta, configuración de Portal para apps Android](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)):

1. En Portal, abre **Ajustes › Depuración (Settings › Debug)**.
2. Toca **ADB Enabled** e introduce el PIN de Meta cuando lo pida.
3. Conéctalo al ordenador por USB-C.
4. La primera vez, toca **Permitir (Allow)** en Portal para confiar en el ordenador.

:::caution
**ADB Enabled tiene exactamente el mismo aspecto activado y desactivado y cada toque lo conmuta.** La pantalla no indica el estado. La única prueba está en el ordenador: que aparezca en la lista USB del navegador o `adb devices`. Si no aparece, toca una vez más y comprueba de nuevo, sin tocar repetidamente.
:::

No hay una vía verificada para habilitar ADB de red en TCP 5555 sin ordenador. Usa primero USB; activar el interruptor Meta no es por sí solo una vía verificada de instalación por red. El instalador USB prepara la depuración de red para actualizar después. No necesita root.

## Instalar Panel Assistant

Instala la app desde Home Assistant con el [instalador USB](/es/install/install-over-usb/), conectado por USB-C y con ADB activo como arriba. Panel Assistant es obligatorio: instala, conecta y actualiza la app. En la unidad probada, el instalador terminó normalmente, abrió la configuración del panel de control y seleccionó por sí solo el perfil Portal 10" de 2.ª generación en el primer inicio.

Durante la instalación también establece la app como pantalla de inicio, concede micrófono y desactiva el salvapantallas y la barra de deslizamiento hacia arriba de Meta; nada de ello puede cambiarse en los ajustes propios de Meta. El permiso de cámara se pide en pantalla al activarla por primera vez.

Tú eliges el **zoom del panel de control**. Con la densidad nativa se dibuja más grande que en otros paneles horizontales. El perfil fija **Nivel de zoom (%)** en **85** por defecto, manteniendo nítidas las pantallas Android. Cámbialo en los ajustes del [renderizador integrado](/es/manage/built-in-renderer/) si prefieres otro tamaño.

Después [añade el panel](/es/install/installing-ha-paneld/) en Panel Assistant de la forma habitual.

## Qué funciona

- **Panel de control** fluido con WebView actual de Meta.
- **Cámara.** Desactivada por defecto como en todos los paneles; se activa en **Cámara** de Configurar. Sirve vídeo 1280×720 e imágenes fijas a Home Assistant y enciende la luz verde mientras se usa.
- **Micrófonos, palabra de activación y respuestas habladas.** Reconoció la palabra y el flujo de voz de Home Assistant respondió por el altavoz. Consulta [asistente de voz](/es/manage/voice-assistant/).
- **Luz ambiental**, incluido color, mediante sensor Android normal para brillo adaptativo y Home Assistant.
- **Apagado real sin root.** La app usa el tiempo de espera de Android: la retroiluminación se apaga por completo en vez de bajar al mínimo. Brillo cero no basta en Portal: la imagen sigue visible. Si no se aplica el tiempo de espera, recurre al mínimo brillo.
- **Activación** con doble toque o con la detección de movimiento propia de Meta al moverse alguien cerca.
- **Botón Lanzador** de la navegación: abre el lanzador de la app. El perfil omite el de Meta, que es un reloj, no una lista de apps.

## Limitaciones actuales

- **La suspensión automática está desactivada por defecto y recomendamos dejarla así.** Sin proximidad, la app no sabe si hay alguien delante. Dormir tras inactividad táctil apagaba la pantalla ante una persona sentada y Meta la despertaba repetidamente. Su detección se activa con cualquier movimiento, incluso al pasar, a veces sin nadie en la habitación; otras apps no pueden leerla, por lo que no sirve de presencia. Aún puedes apagar y encender desde Home Assistant.
- **Dos indicadores de cámara.** La app dibuja uno arriba en el centro; lente y luz verde están arriba a la izquierda. El indicador en pantalla es redundante y no se puede desactivar.
- **El deslizador de volumen de Meta no cambia el volumen multimedia** usado por respuestas y anuncios. Puede empezar en cero y silenciar la primera respuesta. Usa **Volumen del panel** o su entidad en Home Assistant; Meta no lo cambia.
- **Los ajustes Android son mayormente inaccesibles.** Meta los sustituye por una app reducida. Panel Assistant configura lo necesario al instalar; lo demás no se cambia en el propio panel.

:::danger
**No desactives la app de configuración Meta (`com.facebook.alohaapps.devicesetup`) ni retires la cuenta.** Con la cuenta retirada y esa app desactivada, la unidad perdió ADB y el restablecimiento en pantalla; solo la recuperó el [restablecimiento físico](#recuperación-restablecimiento-de-fábrica). Deja intactas la cuenta y las apps de ajustes y configuración Meta.
:::

## Actualizaciones

Portal no puede actualizar la app por sí solo porque necesita root. Panel Assistant usa depuración por red, que se apaga tras cada reinicio, también un corte eléctrico. El panel sigue funcionando con su versión y Home Assistant muestra una reparación, como se explica en [Actualizaciones y recuperación](/es/manage/updates-and-recovery/#un-panel-que-no-se-puede-actualizar).

Para actualizar de nuevo, activa [ADB](#habilitar-adb), conecta por USB al ordenador e inicia el instalador USB desde Home Assistant como en [un panel que no se puede actualizar](/es/manage/updates-and-recovery/#un-panel-que-no-se-puede-actualizar). No instala nada si ya tiene la app; reactiva la depuración de red para que Panel Assistant actualice. Después comprueba que aún abre el panel de control como [pantalla de inicio](#instalar-panel-assistant).

## Privacidad

Portal sigue siendo un dispositivo Meta con su software; la app no lo cambia. Lo siguiente se midió en la unidad probada, no es una auditoría completa.

**Software Meta.** En unos 25 minutos tras restablecer, todas sus apps subieron unos 3 MB y los servicios de análisis de cámara y presencia menos de 0,05 MB cada uno. Subir vídeo continuamente sería mucho más, por lo que no se observó en ese intervalo corto; no descarta subidas ocasionales. Varios servicios mantienen conexiones con Meta y el sistema registra análisis, incluido cada uso del deslizador y el estado de la luz.

**El análisis de cámara de Meta no enciende la luz verde.** Su detección de movimiento y presencia observa mediante un flujo reducido separado que funciona continuamente sin luz. La luz verde solo indica el flujo usado por otras apps. La app del panel no accede al análisis Meta; siempre que usa cámara se enciende la luz.

**El deslizador de privacidad funciona para la app.** En posición de cámara, Android la declara indisponible y la app deja de entregar imágenes. Con micrófono apagado, el asistente no oyó nada. En 1.0 la app sigue el evento de privacidad Meta junto al silencio Android y puede mostrar el micrófono silenciado. Las transiciones físicas y el arranque con micrófono activo aún no están cualificados para esa vía de información.

**La app del panel.** La cámara permanece apagada hasta activarla. Activa, su flujo está disponible a clientes de tu red local, con audio ambiental donde se permita micrófono. Assist y las entidades usan tu conexión Home Assistant.

## Recuperación: restablecimiento de fábrica

El restablecimiento físico funciona sin apps Meta, pantalla operativa ni ADB:

1. Desconecta alimentación y **cualquier USB al ordenador**.
2. Mantén **ambos botones de volumen** al reconectar alimentación hasta que indique que está borrando.

Borra todo, incluida la app y sus ajustes. Después repite la configuración Meta, [activa ADB](#habilitar-adb) e [instala Panel Assistant](#instalar-panel-assistant).

:::caution
**Con USB conectado a un ordenador, la misma combinación no restablece Portal.** Inicia el modo de descarga de emergencia Qualcomm y aparece como dispositivo USB Qualcomm. No cambia nada. Desconecta alimentación para salir, retira USB y repite.
:::

## Firmware

Consulta el [catálogo de firmware Portal 10" de 2.ª generación](/es/hardware/firmware/builds/meta-portal-10-gen2/) para compilaciones indexadas, URL originales Meta y copias de Internet Archive.

## Fuente

[Meta for Developers: configurar Portal para apps Android](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): procedimiento ADB y modelos admitidos.
