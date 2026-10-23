---
title: Instalar por USB
description: Pon en marcha un panel nuevo desde tu navegador con un cable USB, antes de montarlo en la pared.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

La instalación por USB está pensada para un panel que aún está en la caja, o cuyo software del fabricante dificulta el acceso por red. Conecta el panel al ordenador que estás utilizando y tu navegador instalará la aplicación del panel directamente a través del cable. El panel no necesita ADB por red. Tu navegador debe permanecer conectado a Home Assistant, que proporciona la versión verificada. La mayoría de las personas la utilizan una sola vez, antes de montar el panel.

## Todo empieza dentro de Home Assistant

Un administrador inicia el instalador USB desde Home Assistant: ve a **Configuración**, **Dispositivos y servicios**, **Añadir integración**, elige **Panel Assistant** y luego **Instalar por USB en este ordenador**. El enlace **Añadir panel** de la página Panel Assistant en la barra lateral abre la misma opción. Home Assistant comprueba la versión publicada y la entrega al instalador, que se abre en su propia ventana segura. Por eso no hay un botón de instalación en este sitio: la página que realiza la instalación solo acepta una versión publicada que proceda de tu propio Home Assistant, de modo que no llega nada a tu panel que Home Assistant no haya verificado.

## Qué necesitas

- La [integración](/es/home-assistant/custom-integration/) instalada y una cuenta de administrador.
- Un navegador basado en Chromium, como Chrome o Edge. Firefox y Safari no pueden comunicarse con dispositivos USB.
- Un cable USB entre el panel y el ordenador o teléfono donde se ejecuta ese navegador. No al servidor de Home Assistant.
- La depuración USB activada en las opciones de desarrollador del panel. Si el panel muestra una solicitud de autorización al conectarlo, alguien junto al panel debe aceptarla; algunos paneles nunca la muestran. Las [páginas de hardware](/es/hardware/) muestran cómo acceder a las opciones de desarrollador de cada modelo.

## Qué ocurre

1. Selecciona **Abrir el instalador USB**. En la página que se abre, mantén la versión recomendada y pulsa **Continuar**. Home Assistant ofrece las versiones compatibles más recientes que puede verificar. Las versiones de prueba están identificadas y se ofrecen cuando la integración en funcionamiento las permite.
2. El instalador se abre en una ventana nueva y verifica la versión publicada. Pulsa **Buscar mi panel** y elige el panel en la lista del navegador.
3. Si el panel te pide que permitas la depuración USB, marca **Permitir siempre desde este ordenador** y apruébala en la pantalla del panel. Algunos paneles no lo piden y el instalador continúa directamente.
4. Confirma. Nada cambia en el panel hasta que lo hagas. El instalador se niega a sobrescribir una instalación existente diferente; si ya está instalada exactamente la compilación seleccionada, termina de configurar esa compilación.
5. Mantén el cable y la ventana conectados hasta que indique que ha terminado. La misma ventana pasa entonces al asistente de configuración del panel, donde terminas. El panel sirve el asistente, así que el ordenador debe estar en la misma red que el panel.

Si el cable se desconecta durante el proceso, vuelve a conectarlo, espera a que el panel arranque, pulsa el botón de la pantalla de error del instalador y luego **Buscar mi panel**. Si cerraste la ventana del instalador, empieza de nuevo desde Home Assistant y elige la misma versión. En ambos casos, el instalador guarda el progreso en tu navegador, comprueba cualquier paso que se haya interrumpido antes de hacer otra cosa y continúa desde ahí en lugar de empezar de nuevo.

## Después

El panel está ejecutando la aplicación. Un panel recién sacado de la caja aún no está en tu red, así que conéctalo a tu Wi-Fi desde la aplicación Ajustes del propio panel, antes o después de instalar: tanto su asistente de configuración como su conexión con Home Assistant la necesitan. Si el panel no aparece en Home Assistant al terminar su configuración, ve a **Configuración**, **Dispositivos y servicios**, **Añadir integración**, elige **Panel Assistant**, luego **Añadir un panel de tu red** e introduce la dirección del panel. El instalador USB no actualiza un panel que ya tiene la aplicación; para eso, consulta [Actualizaciones y recuperación](/es/manage/updates-and-recovery/).
