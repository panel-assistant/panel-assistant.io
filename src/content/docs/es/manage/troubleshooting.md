---
title: Solución de problemas
description: Los problemas habituales de un panel de pared y dónde mirar primero.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Empieza por el dispositivo del panel en Home Assistant, que tiene un sensor de estado y una descarga de diagnóstico, y por la página de estado del propio panel, en su dirección y el puerto 8888: su informe `/diag` responde a la mayoría de las preguntas siguientes sin necesidad de hacer conjeturas.

Cuando necesites ver qué está haciendo el panel en ese momento, la pestaña **Registros** de esa página transmite en directo el registro de la aplicación del panel, con los tokens y las contraseñas ocultos.

![La pestaña Registros de la interfaz web del panel, que transmite el registro en directo de la aplicación del panel con un cuadro de filtro y controles de Seguir y Pausar](/screenshots/ui-logs-dark.png)

## El panel de control está en blanco, se muestra a medias o está lleno de errores de scripts

Comprueba primero el WebView del sistema. Es, con mucha diferencia, el fallo más habitual en el primer inicio, y un WebView antiguo produce exactamente estos síntomas, aunque parezca un fallo de la aplicación del panel. El procedimiento está en [Actualizar el WebView del sistema](/es/hardware/guides/update-the-webview/).

Si el WebView está actualizado, la sección [Inicio y recuperación](/es/manage/built-in-renderer/#startup-and-recovery) explica qué hace el panel cuando un panel de control no se carga y cómo averiguar el motivo.

## El panel de control va lento

Parte del problema está en el panel y parte en el panel de control. [Rendimiento](/es/manage/performance/) explica qué puede medir la página de estado del panel y qué suele ayudar, y la [referencia de hardware](/es/hardware/) clasifica los paneles compatibles para que puedas saber si estás pidiendo demasiado al hardware.

## El instalador no puede acceder al panel

Por red: confirma la dirección del panel y que ADB por red en el puerto TCP 5555 siga habilitado, porque algunos paneles vuelven a deshabilitarlo tras un reinicio. Si el panel muestra una solicitud de autorización, acéptala en su pantalla. Por USB: asegúrate de utilizar un navegador basado en Chromium, de que el cable esté conectado al ordenador que ejecuta el navegador y de que la depuración USB esté habilitada. La forma de acceder a las opciones para desarrolladores y habilitar la depuración varía según el modelo y se explica en [Preparar el panel](/es/install/prepare-a-panel/) y en las [páginas de hardware](/es/hardware/). Si el panel simplemente no acepta una conexión por red, [instala por USB](/es/install/install-over-usb/): el panel no necesita ADB por red, mientras que tu navegador permanece conectado a Home Assistant para obtener la versión verificada.

## Una instalación por red se detuvo a mitad del proceso

Cuando Home Assistant detiene una instalación por red, su mensaje indica hasta dónde llegó. Busca a continuación la frase que coincida con tu caso. En todos los casos, no desinstales Panel Assistant, no borres sus datos ni restablezcas el panel: el estado del panel es lo que permite saber dónde se detuvo la instalación.

### No se instaló ningún APK

Si el mensaje dice que no se instaló ningún APK o que no se realizó ningún cambio en el panel, la instalación se detuvo antes de modificar nada. Comprueba que el panel esté encendido y en tu red con la misma dirección; después, vuelve a añadir la integración Panel Assistant e introduce esa misma dirección. Home Assistant vuelve a comprobar el panel antes de modificar nada. Si la instalación se detiene en el mismo punto por segunda vez, mira el panel y sigue la sección siguiente si Panel Assistant está instalado.

### Instalado, pero no iniciado o comprobado

Si el mensaje dice que el APK está instalado pero Panel Assistant no se inició o no superó la comprobación, la aplicación está en el panel y solo falta el último paso. Abre Panel Assistant desde la lista de aplicaciones del panel y espera a que aparezca su pantalla de configuración. Después vuelve a añadir la integración Panel Assistant con la misma dirección: cuando la aplicación responde, Home Assistant ofrece conectarla («Panel Assistant está instalado, pero no conectado») y no instala nada. Si Home Assistant dice que la aplicación instalada no es la versión que elegiste, elige la versión instalada, que se muestra en los Ajustes de Android del panel, en Aplicaciones › Panel Assistant. Si Panel Assistant no se abre o su pantalla de configuración no aparece, no reintentes la instalación automática: pide ayuda como explica la sección siguiente.

### La instalación puede haber modificado el panel

Si el mensaje dice que la instalación puede haber modificado el panel, que Home Assistant no pudo verificar el resultado o que no puede demostrar que sea seguro continuar, Home Assistant no pudo determinar hasta dónde llegó el panel y se detiene en lugar de hacer suposiciones. No reintentes todavía la instalación automática. Mira primero el panel: si aparece la pantalla de configuración o el panel de control de Panel Assistant, o si la aplicación se abre desde la lista de aplicaciones del panel, sigue la sección anterior para conectarlo. Si Panel Assistant no está en el panel, pregunta en las [incidencias de la integración](https://github.com/panel-assistant/ha-integration/issues) e incluye el modelo del panel, la versión que elegiste, el mensaje completo y las líneas del registro de Home Assistant correspondientes a la instalación (busca `panel_assistant` en el registro).

## El hardware del panel no aparece en Home Assistant

Si aparecen algunas entidades y otras no, normalmente se debe al perfil de hardware del modelo, más que a un problema de conexión. Las [páginas de hardware](/es/hardware/) indican qué expone cada panel.

## Otro problema

Si la respuesta no está en este sitio ni en la documentación de referencia que enlaza, pregunta en las [incidencias de la integración](https://github.com/panel-assistant/ha-integration/issues) o, para cualquier tema relacionado con la propia aplicación del panel, en las [incidencias de ha-paneld](https://github.com/panel-assistant/android/issues). Incluye el modelo del panel, la versión que aparece en la página del dispositivo del panel y la descarga de diagnóstico, porque cualquier respuesta partirá de esos tres datos. El diagnóstico ya oculta información sensible, pero léelo completo antes de publicarlo y elimina cualquier dato que aún identifique tu panel, tu red o tu instalación de Home Assistant.
