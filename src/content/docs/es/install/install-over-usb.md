---
title: Instalar por USB
description: Pon en marcha un panel nuevo desde tu navegador con un cable USB, antes de montarlo en la pared.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

La instalación por USB está pensada para un panel que aún está en la caja, o cuyo software del fabricante dificulta el acceso por red. Conecta el panel al ordenador que estás utilizando y tu navegador instalará la aplicación del panel directamente a través del cable. El panel no necesita ADB por red. Tu navegador debe permanecer conectado a Home Assistant, que proporciona la versión verificada. La mayoría de las personas la utilizan una sola vez, antes de montar el panel.

## Todo empieza dentro de Home Assistant

Home Assistant comprueba la versión publicada y la entrega al instalador, que se abre en su propia ventana segura. Por eso no hay un botón de instalación en este sitio: la página que realiza la instalación solo acepta una versión publicada que proceda de tu propio Home Assistant, de modo que no llega nada a tu panel que Home Assistant no haya verificado.

## Qué necesitas

- La [integración](/es/home-assistant/custom-integration/) instalada y una cuenta de administrador.
- Un navegador basado en Chromium, como Chrome o Edge. Firefox y Safari no pueden comunicarse con dispositivos USB.
- Un cable USB entre el panel y el ordenador o teléfono donde se ejecuta ese navegador. No al servidor de Home Assistant.
- La depuración USB activada en las opciones de desarrollador del panel y alguien junto al panel que acepte la solicitud de autorización cuando aparezca. Las [páginas de hardware](/es/hardware/) muestran cómo acceder a las opciones de desarrollador de cada modelo.

## Qué ocurre

1. Elige una versión. Home Assistant ofrece las versiones compatibles más recientes que puede verificar. Las versiones de prueba están identificadas y se ofrecen cuando la integración en funcionamiento las permite.
2. La ventana del instalador verifica la versión publicada y te pide que selecciones el panel en el cuadro de selección USB del navegador.
3. Acepta la solicitud de depuración USB en la pantalla del panel.
4. Confirma. Nada cambia en el panel hasta que lo hagas. El instalador se niega a sobrescribir una instalación existente diferente; si ya está instalada exactamente la compilación seleccionada, termina de configurar esa compilación.
5. Mantén el cable conectado y la pestaña conectada al panel hasta que indique que ha terminado.

Si el cable se desconecta o la ventana se cierra durante el proceso, vuelve a conectar el cable y vuelve a conectar el mismo panel. El instalador guarda el progreso en tu navegador, comprueba cualquier paso que se haya interrumpido antes de hacer otra cosa y continúa desde ahí en lugar de empezar de nuevo.

## Después

El panel está ejecutando la aplicación. Si Home Assistant no ha podido acceder a él, añádelo cuando el panel esté en la red de Home Assistant. El instalador USB no actualiza un panel que ya tiene la aplicación; para eso, consulta [Actualizaciones y recuperación](/es/manage/updates-and-recovery/).
