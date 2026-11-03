---
title: Reparaciones
description: Qué significa cada reparación de Panel Assistant, por qué aparece y cómo resolverla.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Abre **Configuración → Sistema → Reparaciones** en Home Assistant y elige el mensaje de Panel Assistant. Su primer enlace abre el ajuste o los pasos de recuperación pertinentes. Usa **Más información** para consultar la explicación siguiente.

Conserva el informe de soporte guardado mientras compruebas una instalación o actualización fallida. **Borrar error** elimina ese informe; no modifica el panel.

Usa **Reintentar** en la reparación existente, con sus comprobaciones de seguridad, solo después de revisar el informe y el panel. No inicies otra instalación automática, desinstalación ni restablecimiento mientras se desconozca el estado instalado. Consulta la [recuperación de instalación](/es/manage/troubleshooting/#una-instalación-por-red-se-detuvo-a-mitad-del-proceso) y los [informes de soporte](/es/home-assistant/support-report/).

<a id="find-your-repair"></a>

## Busca tu reparación

- [Quitar Panel Assistant de &lt;panel&gt;](#quitar-panel-assistant-de-panel)
- [App del panel demasiado antigua](#panel-app-too-old)
- [La app antigua necesita 0.9.0](#old-app-needs-090)
- [El panel MQTT necesita 0.9.0](#mqtt-panel-needs-090)
- [Permisos del panel](#panel-permissions)
- [Configuración de proximidad del panel](#panel-proximity-setup)
- [Panel de control sin filtrar](#dashboard-unfiltered)
- [Micrófono de voz en silencio](#voice-microphone-silent)
- [Micrófono de voz sin audio](#voice-microphone-no-audio)
- [Detalle del micrófono de voz sin audio](#voice-microphone-no-audio-detail)
- [Palabra de activación conservada](#wake-word-kept)
- [Palabra de activación rechazada](#wake-word-refused)
- [Entidad numérica de volumen eliminada](#volume-number-removed)
- [Reinicio necesario](#restart-required)
- [El usuario del panel no coincide](#panel-user-mismatch)
- [Sin vía de actualización](#no-update-route)
- [Identidad de panel fusionada](#merged-panel-identity)
- [Fallo del instalador](#installer-failure)
- [Fallo del instalador: autorización fallida](#installer-failure-authorization-failed)
- [Fallo del instalador: comprobación previa rechazada](#installer-failure-preflight-rejected)
- [Fallo del instalador: archivo rechazado](#installer-failure-artifact-rejected)
- [Fallo del instalador: transporte fallido](#installer-failure-transport-failed)
- [Fallo del instalador: instalación fallida](#installer-failure-install-failed)
- [Fallo del instalador: inicio fallido](#installer-failure-launch-failed)
- [Fallo del instalador: comprobación de estado fallida](#installer-failure-health-check-failed)
- [Fallo del instalador: cambio ambiguo](#installer-failure-ambiguous-mutation)
- [Fallo del instalador: verificación necesaria](#installer-failure-verification-required)
- [Fallo del instalador: actualización](#installer-failure-update)
- [Fallo del instalador: reintento retenido](#installer-failure-retry-hold)
- [Dirección del panel inaccesible](#panel-address-unreachable)
- [Dirección del panel sin verificar](#panel-address-unverified)
- [Identidad del panel no coincidente](#panel-identity-mismatch)
- [Enlace del panel compartido](#panel-link-shared)
- [Confirmación de identidad del panel](#panel-identity-confirmation)
- [Fallo del instalador: autorización ADB](#installer-failure-adb-authorization)
- [Autorización de actualización ADB](#adb-update-authorization)
- [Otro Home Assistant](#another-home-assistant)

## Quitar Panel Assistant de &lt;panel&gt;

**Qué significa:** En la versión aún no publicada 1.0.0-rc2, alguien pulsó **Quitar de este panel** en la página del dispositivo de este panel. El botón no elimina nada; la reparación sigue disponible hasta que finalice la eliminación.

**Por qué ocurre:** Panel Assistant te pide confirmación antes de restaurar la pantalla de inicio y las aplicaciones del fabricante, desinstalar ha-paneld y eliminar el panel de Home Assistant.

**Cómo resolverlo:** Lee [qué hace la eliminación y cómo reinstalar](/es/manage/removal-risks/) antes de seleccionar **Enviar** una vez para confirmar. Si fue un error, cierra el diálogo sin enviar y deja la reparación sin confirmar.

<a id="panel-app-too-old"></a>

## App del panel demasiado antigua

**Qué significa:** Home Assistant no puede ver ni controlar el panel mediante el protocolo de conexión actual.

**Por qué ocurre:** La app no declara ningún protocolo de conexión compatible, o su intervalo de protocolos no coincide con el que esta versión de Panel Assistant puede atender.

**Cómo resolverlo:** Abre Actualizaciones de Home Assistant e instala una actualización compatible para este panel si se ofrece. Espera a que vuelva a conectarse. Si no se ofrece ninguna, usa la guía de recuperación de actualizaciones; no cambies a una versión anterior a ciegas.

<a id="old-app-needs-090"></a>

## La app antigua necesita 0.9.0

**Qué significa:** Panel Assistant 1.0 no puede instalar ni actualizar este panel con la app antigua.

**Por qué ocurre:** En 1.0 se eliminó la migración desde la antigua app ha-paneld.

**Cómo resolverlo:** No vuelvas a descargar Panel Assistant 0.9.0 sobre una instalación 1.0 en ejecución: un ajuste eliminado por 1.0 puede hacer que 0.9.0 devuelva a MQTT los paneles migrados. Solo si ningún panel tiene todavía la app 1.0, restaura una copia de seguridad de Home Assistant anterior a la actualización, termina todas las migraciones en 0.9.0 y vuelve después a 1.0. Si algún panel ya tiene la app 1.0 o no hay una copia adecuada, pide soporte antes de cambiar de versión. Consulta la [guía de recuperación de la actualización a 1.0](/es/manage/upgrade-to-1-0/).

<a id="mqtt-panel-needs-090"></a>

## El panel MQTT necesita 0.9.0

**Qué significa:** Panel Assistant no puede conectar este panel MQTT sin migrar sin separar sus entidades e historial.

**Por qué ocurre:** Panel Assistant 1.0 ya no realiza la migración desde MQTT.

**Cómo resolverlo:** No vuelvas a descargar Panel Assistant 0.9.0 sobre una instalación 1.0 en ejecución: un ajuste eliminado por 1.0 puede hacer que 0.9.0 devuelva a MQTT los paneles migrados. Solo si ningún panel tiene todavía la app 1.0, restaura una copia de seguridad de Home Assistant anterior a la actualización, termina todas las migraciones en 0.9.0 y vuelve después a 1.0. Si algún panel ya tiene la app 1.0 o no hay una copia adecuada, pide soporte antes de cambiar de versión. Consulta la [guía de recuperación de la actualización a 1.0](/es/manage/upgrade-to-1-0/).

<a id="panel-permissions"></a>

## Permisos del panel

**Qué significa:** Algunas funciones del panel no pueden funcionar porque Android no les ha concedido permisos. El panel de control sigue disponible.

**Por qué ocurre:** Una instalación antigua o un permiso de Android modificado puede dejar sin conceder un permiso necesario. El permiso de cámara importa mientras la cámara está activada; el de micrófono, mientras la cámara o la voz están activadas. Si se desconoce el estado de una función, el aviso permanece hasta poder comprobarlo.

**Cómo resolverlo:** En el panel físico, abre Ajustes de Android → Aplicaciones → Panel Assistant. Permite cámara, micrófono y notificaciones donde aparezcan. En Acceso especial de aplicaciones, permite Modificar ajustes del sistema y Mostrar sobre otras aplicaciones; después activa Panel Assistant en Accesibilidad. Si la navegación está en Mostrar al deslizar o Siempre activa y falta el permiso de superposición, desliza hacia arriba desde el borde inferior del panel de control para abrir Mostrar sobre otras aplicaciones, concédelo, vuelve y desliza de nuevo. Regresa a la reparación y pulsa Enviar. Home Assistant debe verificar de nuevo cada permiso pertinente; una lectura fallida o una actualización de la app por sí sola no puede cerrar la reparación.

<a id="panel-proximity-setup"></a>

## Configuración de proximidad del panel

**Qué significa:** La activación al pasar la mano no está disponible porque el panel no ha guardado su calibración de proximidad.

**Por qué ocurre:** El panel informa de calibration_required. La calibración mide esta instalación y necesita una persona delante del panel; iniciar la configuración por sí solo no demuestra que haya terminado.

**Cómo resolverlo:** Abre Configurar en este panel, ve a Presencia y activación y elige Configurar proximidad en el panel. Sigue las instrucciones físicas en el panel, que tardan aproximadamente un minuto. Cuando indique que la calibración se ha guardado, vuelve a la reparación y pulsa Enviar. Home Assistant lee el estado actualizado antes de completarla; si la configuración sigue en curso o no puede leer el panel, termínala o restablece la conexión y vuelve a enviar. La acción Abrir configuración de proximidad del panel de control también permite empezar en el propio panel.

<a id="dashboard-unfiltered"></a>

## Panel de control sin filtrar

**Qué significa:** El panel muestra su panel de control con todas las entidades de Home Assistant, en lugar de solo las que utiliza.

**Por qué ocurre:** Mientras aprende qué entidades utiliza su panel de control, el panel espera tras una pantalla que explica qué está esperando. Si espera más de 90 segundos, muestra el panel de control sin filtrar para no dejarte sin él. Entre las causas habituales están un análisis sin respuesta de Home Assistant, un inicio de sesión rechazado por Home Assistant, reglas del panel de control que necesitan tu decisión y un motor de navegador demasiado antiguo para filtrar. El panel sigue intentándolo en segundo plano.

**Cómo resolverlo:** Abre este panel en la barra lateral de Panel Assistant y después Entidades para ver qué está esperando. Responde allí a la decisión sobre las reglas señaladas, o vuelve a iniciar sesión desde Configurar si Home Assistant lo rechazó. Si Panel Assistant ofrece un motor de navegador más reciente para el panel, instálalo. El panel vuelve por sí solo al panel de control filtrado y la reparación desaparece.

<a id="voice-microphone-silent"></a>

## Micrófono de voz en silencio

**Qué significa:** El panel no escucha palabras de activación porque la comprobación de captura del micrófono solo grabó silencio.

**Por qué ocurre:** La comprobación solo encontró silencio o un nivel de fondo de audio constante.

**Cómo resolverlo:** Abre este panel en la barra lateral de Panel Assistant y después Configurar → Asistente de voz. Desactívalo y actívalo para repetir la comprobación. Si sigue fallando, cambia Fuente de audio en la misma tarjeta de Voz; su enlace directo muestra el ajuste avanzado. Una comprobación correcta elimina la reparación. Desactivar la voz también la retira porque ya no se solicita escuchar.

<a id="voice-microphone-no-audio"></a>

## Micrófono de voz sin audio

**Qué significa:** El panel no escucha palabras de activación porque la comprobación de captura del micrófono no recibió audio.

**Por qué ocurre:** La captura de Android no entregó audio, sin un error más específico.

**Cómo resolverlo:** Abre este panel en la barra lateral de Panel Assistant y después Configurar → Asistente de voz. Desactívalo y actívalo para repetir la comprobación. Si sigue fallando, cambia Fuente de audio en la misma tarjeta de Voz; su enlace directo muestra el ajuste avanzado. Una comprobación correcta elimina la reparación. Desactivar la voz también la retira porque ya no se solicita escuchar.

<a id="voice-microphone-no-audio-detail"></a>

## Detalle del micrófono de voz sin audio

**Qué significa:** El panel no escucha palabras de activación porque la comprobación de captura del micrófono no recibió audio.

**Por qué ocurre:** La captura de Android no devolvió audio; el detalle comunicado por el panel explica el error de captura.

**Cómo resolverlo:** Abre este panel en la barra lateral de Panel Assistant y después Configurar → Asistente de voz. Desactívalo y actívalo para repetir la comprobación. Si sigue fallando, cambia Fuente de audio en la misma tarjeta de Voz; su enlace directo muestra el ajuste avanzado. Una comprobación correcta elimina la reparación. Desactivar la voz también la retira porque ya no se solicita escuchar.

<a id="wake-word-kept"></a>

## Palabra de activación conservada

**Qué significa:** Este panel conservó su propio modelo con el ID de la palabra de activación compartida, por lo que no usa el modelo compartido.

**Por qué ocurre:** El modelo instalado tiene un SHA-256 distinto al compartido y no es una copia compartida anterior. Panel Assistant conserva un modelo importado de forma independiente en lugar de sobrescribirlo.

**Cómo resolverlo:** Abre este panel en Panel Assistant, Configurar, Palabras de activación. Si quieres el modelo compartido allí, importa en este panel su manifiesto .json y modelo .tflite correspondientes. Deja el modelo actual si era intencionado; el uso compartido automático nunca lo sustituye. Importar desde la barra lateral también convierte el modelo importado en la copia compartida; compartir no activa palabras de activación.

Importar desde la barra lateral sustituye la copia compartida y puede actualizar otros paneles. Consulta las [palabras de activación personalizadas](/es/manage/custom-wake-words/).

<a id="wake-word-refused"></a>

## Palabra de activación rechazada

**Qué significa:** La palabra de activación compartida no se instaló en este panel; sus demás palabras instaladas siguen disponibles.

**Por qué ocurre:** El panel rechazó el modelo importado e indicó el motivo. Un modelo puede tener un manifiesto no válido, superar sus límites, no superar la comprobación del motor de palabras de activación o no guardarse. Un modelo aceptado por un panel puede ser rechazado por otro.

**Cómo resolverlo:** Abre este panel en Panel Assistant, Configurar, Palabras de activación. Usa el motivo indicado para corregir o volver a entrenar el modelo microWakeWord; después importa allí su manifiesto .json y archivo .tflite correspondientes. La importación muestra la respuesta del panel y conserva su último modelo válido si lo rechaza. Compartir no activa la palabra de activación; selecciónala si quieres que el panel la escuche. Los comandos no compatibles de apps antiguas y los tiempos de espera de conexión producen avisos en lugar de esta reparación.

Importar desde la barra lateral sustituye la copia compartida y puede actualizar otros paneles. Consulta las [palabras de activación personalizadas](/es/manage/custom-wake-words/).

<a id="volume-number-removed"></a>

## Entidad numérica de volumen eliminada

**Qué significa:** Hay automatizaciones o scripts que aún hacen referencia a una entidad numérica de volumen independiente que se eliminó de un panel que ahora tiene reproductor multimedia. Esas acciones necesitan actualizarse.

**Por qué ocurre:** El reproductor multimedia del panel gestiona ahora el volumen. Panel Assistant elimina solo la antigua entidad numérica de volumen de ese panel después de iniciar Home Assistant e indica las automatizaciones y scripts que aún la usan.

**Cómo resolverlo:** Abre Automatizaciones o Scripts y busca los elementos enumerados en la reparación. Sustituye las acciones number.set_value dirigidas a la entidad eliminada por media_player.volume_set dirigido al reproductor multimedia del panel; establece volume_level entre 0 y 1, por ejemplo 0.5 para el 50%. Actualiza otras referencias según su finalidad. Guarda, comprueba que la automatización o el script funciona y después ignora la reparación. Panel Assistant no los reescribe automáticamente.

<a id="restart-required"></a>

## Reinicio necesario

**Qué significa:** Home Assistant aún ejecuta la versión anterior de Panel Assistant.

**Por qué ocurre:** La versión o compilación instalada de la integración difiere del código ya cargado en Home Assistant.

**Cómo resolverlo:** Abre la reparación, comprueba las versiones instalada y en ejecución y pulsa Enviar cuando estés listo para reiniciar Home Assistant y cargar la versión instalada.

<a id="panel-user-mismatch"></a>

## El usuario del panel no coincide

**Qué significa:** Una solicitud de cuenta del panel espera tu confirmación.

**Por qué ocurre:** Un usuario que ha iniciado sesión en Home Assistant pidió conectarse como este panel. La primera vinculación o un cambio de la cuenta guardada necesita tu aprobación.

**Cómo resolverlo:** Abre la reparación y compara el panel y usuario indicados con la cuenta que configuraste deliberadamente. Pulsa Enviar solo si reconoces la solicitud. Si el panel ya tiene otra cuenta, confirmar el cambio deja de aceptar esa cuenta. Ante una solicitud inesperada, cierra el diálogo e ignora el problema: cualquier usuario con sesión iniciada puede solicitar una conexión de panel.

<a id="no-update-route"></a>

## Sin vía de actualización

**Qué significa:** Panel Assistant no puede instalar actualizaciones de la app; el panel conserva su versión actual mientras sus otras funciones siguen funcionando.

**Por qué ocurre:** El panel ya no ofrece una vía de actualización utilizable, algo que puede ocurrir tras cambios de firmware o un restablecimiento.

**Cómo resolverlo:** Sigue [la guía para un panel que no se puede actualizar](/es/manage/updates-and-recovery/#un-panel-que-no-se-puede-actualizar). La recuperación depende del modelo y firmware: restablece el acceso de depuración o reconecta por USB solo cuando la guía lo indique. La reparación desaparece cuando Home Assistant dispone de una vía de actualización funcional.

<a id="merged-panel-identity"></a>

## Identidad de panel fusionada

**Qué significa:** Varias entradas reclaman una identidad, lo que impide asignar su control nativo con seguridad.

**Por qué ocurre:** Los identificadores clonados o compartidos históricos hacen ambigua la sesión; la integración se niega a elegir un panel.

**Cómo resolverlo:** Actualiza la app en cada panel físico afectado para que cada uno comunique su propia identidad. Después elimina el dispositivo fusionado en Home Assistant y deja que los paneles se registren de nuevo. Revisa las entidades desactivadas por una versión anterior; no se restauran automáticamente.

<a id="installer-failure"></a>

## Fallo del instalador

**Qué significa:** La instalación o actualización no terminó.

**Por qué ocurre:** El fallo no coincidió con un motivo de reparación más específico.

**Cómo resolverlo:** Abre su Informe de soporte para ver qué ocurrió y usa Reintentar después de resolver la causa indicada.

<a id="installer-failure-authorization-failed"></a>

## Fallo del instalador: autorización fallida

**Qué significa:** La instalación no pudo conectarse a Android en el panel.

**Por qué ocurre:** El panel no aceptó la conexión ADB de Home Assistant.

**Cómo resolverlo:** Comprueba la depuración y el aviso de autorización del panel siguiendo Preparar un panel; después usa Reintentar en la reparación.

<a id="installer-failure-preflight-rejected"></a>

## Fallo del instalador: comprobación previa rechazada

**Qué significa:** La app solicitada no se instaló.

**Por qué ocurre:** Las comprobaciones del instalador rechazaron el panel antes de instalar.

**Cómo resolverlo:** Abre el Informe de soporte, corrige la comprobación indicada y usa Reintentar si el panel y la versión seleccionada aún coinciden.

<a id="installer-failure-artifact-rejected"></a>

## Fallo del instalador: archivo rechazado

**Qué significa:** La app solicitada no se instaló.

**Por qué ocurre:** No pudo autenticarse la versión o fallaron las comprobaciones de preparación local, incluida una ruta de preparación insegura u ocupada.

**Cómo resolverlo:** Abre el Informe de soporte para identificar la versión o comprobación de preparación rechazada; después reintenta desde la reparación una vez resuelta la causa.

<a id="installer-failure-transport-failed"></a>

## Fallo del instalador: transporte fallido

**Qué significa:** Home Assistant no pudo terminar de transferir o instalar la app.

**Por qué ocurre:** Falló una operación de transporte; puede ser un problema de conexión o una operación de transferencia o instalación rechazada.

**Cómo resolverlo:** Restablece la conexión del panel y usa Reintentar en la reparación para que Panel Assistant compruebe su estado actual antes de continuar.

<a id="installer-failure-install-failed"></a>

## Fallo del instalador: instalación fallida

**Qué significa:** Android rechazó la instalación solicitada.

**Por qué ocurre:** Falló la instalación del paquete en el panel; el Informe de soporte contiene el resultado.

**Cómo resolverlo:** Lee el Informe de soporte y resuelve el error de Android indicado; después usa Reintentar en la reparación.

<a id="installer-failure-launch-failed"></a>

## Fallo del instalador: inicio fallido

**Qué significa:** La app está instalada pero no se inició.

**Por qué ocurre:** El instalador no pudo iniciar Panel Assistant tras instalarlo.

**Cómo resolverlo:** Abre Panel Assistant desde la lista de aplicaciones del panel y usa Reintentar en la reparación para comprobar y terminar el intento. Si no se abre, usa su Informe de soporte para pedir ayuda.

<a id="installer-failure-health-check-failed"></a>

## Fallo del instalador: comprobación de estado fallida

**Qué significa:** La app se inició pero no se ha confirmado su buen estado.

**Por qué ocurre:** El instalador no recibió la respuesta de buen estado necesaria.

**Cómo resolverlo:** Comprueba la app en el panel y usa Reintentar en la reparación para comprobar su estado. Si sigue sin estar en buen estado, usa el Informe de soporte para pedir ayuda.

<a id="installer-failure-ambiguous-mutation"></a>

## Fallo del instalador: cambio ambiguo

**Qué significa:** Panel Assistant no puede determinar si el intento fallido modificó el panel.

**Por qué ocurre:** El resultado de instalación no demostró el estado final de los paquetes del panel.

**Cómo resolverlo:** Comprueba qué hay en el panel físico y abre el Informe de soporte de la reparación. Usa su acción Reintentar con comprobaciones de seguridad solo después de comprobar el estado indicado; no desinstales, borres datos de la app ni restablezcas el panel para quitar el mensaje.

<a id="installer-failure-verification-required"></a>

## Fallo del instalador: verificación necesaria

**Qué significa:** Otra instalación queda retenida hasta poder comprobar el panel.

**Por qué ocurre:** El intento anterior necesita verificación antes de cualquier otra instalación.

**Cómo resolverlo:** Comprueba el panel y su Informe de soporte y usa Reintentar en la reparación para volver a comprobar su estado actual. No desinstales, borres datos de la app ni restablezcas el panel para quitar el mensaje.

<a id="installer-failure-update"></a>

## Fallo del instalador: actualización

**Qué significa:** Home Assistant no pudo confirmar que la actualización terminó. En la versión aún no publicada 1.0.0-rc2, la app del panel puede estar ya instalada mientras sigue pendiente la actualización de su motor de navegador.

**Por qué ocurre:** La actualización de la app o, en esa versión, de su motor de navegador falló o no pudo verificarse. La reparación conserva el informe de todo el intento.

**Cómo resolverlo:** Lee el Informe de soporte, restablece la conexión o el requisito de instalación indicado y elige **Reintentar**. En la versión aún no publicada 1.0.0-rc2, si solo queda pendiente la actualización del motor de navegador y Panel Assistant confirma que está instalada la versión solicitada de la app, continúa esa etapa sin reinstalar la app. Si se ofrece **Permitir actualizaciones**, úsalo para autorizar primero Home Assistant en el panel. Consulta la [guía de WebView](/es/hardware/guides/update-the-webview/) si el motor de navegador no puede actualizarse.

<a id="installer-failure-retry-hold"></a>

## Fallo del instalador: reintento retenido

**Qué significa:** El reintento está pausado y no se ha autorizado que continúe.

**Por qué ocurre:** Una comprobación de seguridad o un error inesperado del reintento detuvo este intento. El informe guardado registra lo observado; una retención no concede permiso para reinstalar.

**Cómo resolverlo:** Lee el error del reintento y el Informe de soporte, comprueba que el panel previsto y la versión siguen coincidiendo y usa Reintentar después de resolver la causa. Borrar el error solo elimina su reparación y el informe guardado.

<a id="panel-address-unreachable"></a>

## Dirección del panel inaccesible

**Qué significa:** Los controles siguen disponibles mediante la conexión activa, pero las operaciones HTTP carecen de una dirección accesible verificada.

**Por qué ocurre:** La dirección guardada dejó de responder; la recuperación automática no tenía ningún candidato utilizable o no pudo verificarlo.

**Cómo resolverlo:** Restablece la accesibilidad de red/HTTP del panel o añade el mismo panel en su dirección actual; no eludas la comprobación de identidad.

<a id="panel-address-unverified"></a>

## Dirección del panel sin verificar

**Qué significa:** Los controles siguen disponibles mediante la conexión activa, pero las operaciones HTTP carecen de una dirección accesible verificada.

**Por qué ocurre:** La dirección guardada dejó de responder; la recuperación automática no tenía ningún candidato utilizable o no pudo verificarlo.

**Cómo resolverlo:** Restablece la accesibilidad de red/HTTP del panel o añade el mismo panel en su dirección actual; no eludas la comprobación de identidad.

<a id="panel-identity-mismatch"></a>

## Identidad del panel no coincidente

**Qué significa:** Se rechazan el estado y los controles del panel en un endpoint con una identidad diferente.

**Por qué ocurre:** Una dirección ahora responde como otra instalación o las pruebas de identidad guardadas no pueden conciliarse con seguridad.

**Cómo resolverlo:** Comprueba el panel físico y su dirección; vuelve a añadir el panel actual conocido si se trasladó. Nunca apruebes otra identidad únicamente porque utiliza la dirección antigua.

<a id="panel-link-shared"></a>

## Enlace del panel compartido

**Qué significa:** Un panel reinstalado no puede asignarse con seguridad a una configuración existente.

**Por qué ocurre:** Varias entradas registraron el mismo enlace de dispositivo heredado; el problema no es la accesibilidad de la dirección en sí.

**Cómo resolverlo:** Conserva los otros paneles activos; elimina solo las entradas sin uso o añade por separado el panel reinstalado.

<a id="panel-identity-confirmation"></a>

## Confirmación de identidad del panel

**Qué significa:** Las configuraciones existentes esperan tu confirmación después de que los paneles comuniquen nuevas identidades de dispositivo.

**Por qué ocurre:** Panel Assistant no pudo demostrar automáticamente que cada identidad nueva pertenece a su configuración anterior.

**Cómo resolverlo:** Revisa cada nombre y dirección de panel de la lista. Pulsa Enviar solo si cada panel enumerado pertenece a su configuración existente. Abrir el diálogo no cambia nada.

<a id="installer-failure-adb-authorization"></a>

## Fallo del instalador: autorización ADB

**Qué significa:** La actualización fallida no puede continuar hasta que este panel autorice Home Assistant.

**Por qué ocurre:** Todavía se necesita la aprobación de confianza ADB; el informe de la actualización fallida sigue disponible.

**Cómo resolverlo:** Elige Permitir actualizaciones en la reparación y pulsa Enviar; después marca Permitir siempre desde este ordenador y pulsa Permitir en el panel indicado. Vuelve a la reparación y usa Reintentar para la actualización fallida.

<a id="adb-update-authorization"></a>

## Autorización de actualización ADB

**Qué significa:** Home Assistant no puede usar ADB para actualizar este panel hasta que el panel lo autorice.

**Por qué ocurre:** La vía de actualización necesita aprobación de confianza explícita en el panel.

**Cómo resolverlo:** Abre la reparación y pulsa Enviar; después, en el panel indicado, marca Permitir siempre desde este ordenador y pulsa Permitir. Android puede llamar ordenador a Home Assistant; el proceso continúa tras la aprobación.

<a id="another-home-assistant"></a>

## Otro Home Assistant

**Qué significa:** Añadir aquí el panel no cambia su servidor ni cuenta guardados.

**Por qué ocurre:** La dirección de Home Assistant guardada en el panel identifica un servidor distinto a este.

**Cómo resolverlo:** Si quieres que este panel se conecte aquí, sigue el enlace de su reparación a Configurar, introduce esta dirección de Home Assistant, guarda, vuelve a conectar e inicia sesión con la cuenta que quieres que use el panel. Si corresponde al otro servidor, deja sus ajustes como están e ignora esta reparación. Si la barra lateral no puede acceder a él, abre Configurar directamente en la red del panel.
