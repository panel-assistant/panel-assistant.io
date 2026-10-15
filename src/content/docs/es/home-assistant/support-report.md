---
title: Entender un informe de soporte
description: Interpreta un fallo de instalación o actualización de Panel Assistant y comparte el informe al pedir ayuda.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Cuando falle una instalación por red o una actualización de la aplicación del panel, abre su elemento en **Configuración → Reparaciones** de Home Assistant y elige **Informe de soporte**. El informe conserva los nombres y valores exactos de los campos en un bloque de texto que puedes copiar. Empieza con `panel_assistant.version` y `panel_assistant.build`, seguidos de `home_assistant.version` y el identificador de reparación (Repair ID) en `repair.issue_id`. Los eventos guardados aparecen en `events[N]`, donde `N` empieza en 0.

Si ha fallado una [instalación por USB](/es/install/install-over-usb/), abre en su lugar los detalles de soporte del instalador.

Lee el informe antes de compartirlo. Puede incluir la dirección de un panel, identificadores de dispositivos, detalles de la versión publicada y una traza de excepción. Elimina cualquier dato que no quieras publicar en una incidencia pública. Si puedes, conserva el motivo del fallo y los detalles relacionados; ayudan a explicar lo que ocurrió.

Para obtener ayuda con una instalación o actualización fallida, [abre una incidencia para la integración de Home Assistant](https://panel-assistant.io/go/report-issue) y pega el informe en el cuerpo de la incidencia. Añade qué estabas haciendo, qué esperabas y qué ocurrió en el panel. Si el panel es accesible, su [descarga de diagnóstico](/es/manage/troubleshooting/) puede aportar más contexto.

## Cómo interpretar los campos

- `events[N]` enumera los eventos guardados en orden, comenzando por `events[0]`. Un evento posterior puede describir un reintento en espera en lugar del fallo original.
- `kind` indica si el evento procede de un intento de tipo `install`, `update` o `retry_hold`. `at`, si aparece, es la hora registrada.
- `panel` es el nombre mostrado o la dirección del panel; `address` es el destino de red que utilizó Home Assistant. `entry_id` identifica la entrada de la integración en Home Assistant. `job_id` identifica un intento de instalación.
- `reason` es el resultado guardado o el mensaje de error. En una instalación, `receipt.result_code` indica el resultado general y `receipt.failure_stage` señala qué paso estaba activo cuando se produjo el fallo. Si aparece `receipt.result_subcode`, ayuda a concretar el diagnóstico; su valor puede cambiar entre versiones publicadas.
- `target_version` y `artifact.*` describen la versión publicada seleccionada para una actualización. `receipt.*` contiene el comprobante de instalación, incluidos los detalles del destino y de los pasos. `exception` es una traza técnica; sus últimas líneas suelen indicar el fallo inmediato.

Un resultado de instalación `authorization_failed` significa que Home Assistant no pudo obtener permiso para trabajar con el panel. `preflight_rejected` significa que el panel no superó las comprobaciones previas a la instalación. `artifact_rejected` significa que no se aceptó el archivo de la aplicación seleccionado. `transport_failed` significa que falló la comunicación con el panel. `install_failed` y `launch_failed` corresponden a los pasos de instalación y de inicio de la aplicación. `health_check_failed` significa que la aplicación no superó la comprobación posterior a la instalación. `ambiguous_mutation` o `verification_required` significa que Home Assistant no pudo comprobar el estado del panel; inspecciona el panel antes de volver a intentarlo. Una actualización o un reintento pueden mostrar, en cambio, un mensaje de error descriptivo en `reason`.

## Pedir a un asistente de IA que te ayude a interpretarlo

Copia este texto y pega a continuación el informe que has revisado. Un asistente puede explicar las pruebas y sugerir comprobaciones, pero no puede conocer el estado actual del panel solo a partir del informe.

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report is a copyable text block with exact dotted field names and values. It starts with panel_assistant.version and panel_assistant.build, followed by home_assistant.version and the Repair ID in repair.issue_id. Saved install, update, or retry-hold events appear under events[N], starting at events[0]. Each event preserves its original fields and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
