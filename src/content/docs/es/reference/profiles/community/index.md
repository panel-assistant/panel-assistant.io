---
title: Perfiles de panel de la comunidad
description: Perfiles de la comunidad para paneles que la aplicación no incluye, cómo importarlos de forma segura y cómo habilitar una cámara que el perfil no declara.
sidebar:
  label: Resumen
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Este catálogo contiene perfiles aportados por la comunidad que no se incluyen en ha-paneld. Que un perfil aparezca aquí no significa que ha-paneld funcione en el hardware comercial indicado tal como se vende. Cada perfil puede describir un flasheo concreto, una modificación del firmware o una única instalación comunicada, en lugar del software original del fabricante.

Los perfiles de la comunidad nunca se seleccionan automáticamente. Descarga el archivo YAML individual, revisa su procedencia, el firmware probado y sus limitaciones, y utiliza la página **Perfiles** del panel para importarlo. Importar y validar solo ofrecen una vista previa; no guardan ni activan el perfil.

Antes de guardar, exige que la vista previa indique que todos los predicados de un grupo completo de coincidencia concuerdan con los datos inmutables del dispositivo. Una coincidencia de nombre por sí sola no basta. La activación comprueba estrictamente esa identidad y rechaza capturas inseguras de la pantalla táctil, pero no comprueba de antemano todas las vías privilegiadas reales. Tras el reinicio controlado, los controladores de cada capacidad comprueban sus interfaces y permisos al inicializarse o utilizarse; las capacidades no disponibles siguen sin estarlo y el estado de salud del arranque determina si el candidato permanece activo o se revierte. Nunca consideres una importación o activación correcta como prueba de que todas las capacidades declaradas funcionan.

## Probar un perfil de la comunidad con seguridad

1. Abre la página del dispositivo del panel en Home Assistant, selecciona **Visitar** y abre **Perfiles**. Exporta la revisión activa y haz una copia de seguridad completa y actual del panel. Si te conectas directamente, utiliza el puerto HTTP que indique el panel (`http://<panel-ip>:8888/profiles` con el puerto predeterminado).
2. Descarga y revisa el YAML. Confirma que sus supuestos sobre el firmware exacto y las modificaciones describen el panel que tienes delante.
3. Pega o carga el YAML en **Perfiles** y valídalo. No continúes si la coincidencia de identidad es incompleta, falta un controlador compilado obligatorio o se informa de una asignación de entrada insegura. La validación no demuestra que existan los permisos reales sobre el hardware.
4. Guarda el contenido validado como revisión local inactiva. Guardarlo sigue sin alterar el perfil en ejecución.
5. Pruébalo y actívalo solo cuando alguien pueda ver y tocar el panel, siguiendo la [lista de comprobaciones de perfiles](/es/reference/profiles/testing/). La activación queda vinculada al identificador exacto del perfil, su revisión y el hash de contenido.
6. Tras reiniciar, revisa los resultados reales de las capacidades y confirma la revisión activa, los controles esperados y las entidades de Home Assistant. Una vía no disponible debe seguir figurando así, sin tratarse como correcta. Prueba **Revertir** antes de confiar en el perfil sin supervisión; un fallo de salud del arranque debería devolver automáticamente a la última revisión válida.

Volver a **Usar selección automática** selecciona únicamente un perfil incluido o el perfil Genérico conservador. No reactivará automáticamente una revisión de la comunidad.

## Habilitar la cámara en un panel cuyo perfil no la declara

La cámara se ofrece en cualquier panel que tenga una: una cámara que el perfil declare con `hardware.camera`, o una que Android enumere en un panel cuyo perfil no diga nada. Por tanto, una placa con cámara funcional normalmente no necesita ninguna entrada en el perfil y el grupo Cámara aparece en **Configurar** sin editar YAML.

Hay tres motivos por los que puede seguir ausente; la tarjeta Cámara de **Configurar** indica cuál se aplica en lugar de desaparecer:

- **El perfil la suprime.** `hardware.camera: false` es un tercer estado deliberado, distinto de omitir la clave: indica que el dispositivo enumerado no es una cámara ambiental utilizable, como una entrada de captura HDMI. Elimina la línea o ponla en `true` para ofrecer la cámara.
- **Android no enumeró ninguna cámara.** Si el panel tiene una, declara `hardware.camera: true` en su perfil. Una declaración tiene prioridad sobre una enumeración vacía, así que también resuelve el caso en que el servicio de cámara existe pero la enumeración es poco fiable.
- **La enumeración todavía no ha respondido.** Esto no es una afirmación sobre el hardware. Espera unos segundos y vuelve a cargar Configurar; no hay que editar nada.

Declarar una cámara que la placa no expone es seguro. Una comprobación ligera en tiempo de ejecución lee la lista de identificadores de cámara de Android para informar de las capacidades; una cámara declarada sigue ofreciéndose y una placa sin cámara rechaza la apertura con un fallo clasificado `no_camera_id` cuya acción indica que el perfil es incorrecto. No desestabiliza el panel.

La opción lleva consigo un requisito. La cámara no funciona si el panel no puede indicar a quienes están en la habitación que está abierta; con la pantalla apagada, eso requiere una vía de indicación fuera de la pantalla. Para capturar con la pantalla apagada, proporciona una vía funcional de indicación LED. Con la pantalla encendida, el indicador en pantalla puede cumplir el requisito sin LED. Establece `hardware.camera_lens_offset_px` para que el indicador quede bajo la lente en lugar de a su lado.

El resto del comportamiento de la cámara no cambia: permanece apagada hasta que se habilite, el interruptor nunca se propone como opción predeterminada y encenderla mediante la entidad de cámara de Home Assistant requiere aprobación en la propia pantalla del panel en todos los modos de seguridad. El ajuste Cámara de Configurar es una vía independiente de configuración del propietario.

## Catálogo

- [`community-cronos-lineageos18.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml): un borrador para el Amazon Echo Show 5 Gen 2 de un colaborador, flasheado con LineageOS 18.1. Fire OS original no puede ejecutar ha-paneld; no se admiten el desbloqueo, el flasheo ni la recuperación, y el proyecto no ha validado el perfil en hardware. Consulta las [notas de evidencia específicas del perfil](/es/reference/profiles/community/echo-show-5-gen2/).
- [`community-lenovo-thinksmart-view-lineageos.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-lenovo-thinksmart-view-lineageos.yaml): un borrador para el Lenovo ThinkSmart View de un colaborador, flasheado con LineageOS 8.1. Selecciona la suspensión de Android porque el brillo cero sigue dejando la pantalla visiblemente encendida, registra que tocar no activa el panel y recoge la confirmación del colaborador de que Home Assistant puede atenuarlo, apagarlo completamente y volver a activarlo. Consulta las [notas de evidencia específicas del perfil](/es/reference/profiles/community/lenovo-thinksmart-view/).
- [`community-sunworld-yc-sm55p-p76s01.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-sunworld-yc-sm55p-p76s01.yaml): un borrador para el Sunworld YC-SM55P de 5.5 pulgadas de un colaborador, con placa Portworld P76S01. El perfil registra la identidad RK3576S respaldada por el firmware y vías de control Android conservadoras, pero deja desactivados los sensores opcionales y la cámara hasta realizar pruebas físicas. Su identidad de compilación Rockchip genérica no es segura para selección automática. Consulta las [notas de evidencia específicas del perfil](/es/reference/profiles/community/sunworld-yc-sm55p/).

Para conocer el formato, el límite de confianza y los requisitos de contribución, consulta la [guía de perfiles en tiempo de ejecución](/es/reference/profiles/), la [referencia de formato](/es/reference/profiles/format/), la [lista de pruebas](/es/reference/profiles/testing/) y la [guía para compartir](/es/reference/profiles/sharing/).
