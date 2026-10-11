---
title: Instalar por USB
description: Pon en marcha un panel nuevo desde tu navegador con un cable USB, antes de montarlo en la pared.
sourceCommit: ddee491d1892568fda8e9bb47f003b2333e3b666
---

La instalación por USB está pensada para un panel que todavía está en su caja o cuyo software del fabricante dificulta el acceso por red. Conecta el panel al ordenador que estás usando y tu navegador instalará la aplicación del panel directamente por el cable. No se transmite nada por tu red y el servidor de Home Assistant no necesita acceder al panel en ningún momento. La mayoría de las personas usan este método una sola vez, antes de montar el panel.

## Todo empieza dentro de Home Assistant

Un administrador abre el instalador USB desde la página de Panel Assistant en la barra lateral de Home Assistant. Home Assistant comprueba la versión publicada y la entrega al instalador, que se abre en su propia ventana segura. Por eso no hay un botón de instalación en este sitio: la página que realiza la instalación solo acepta una versión publicada que proceda de tu propio Home Assistant, de modo que no llega nada a tu panel que Home Assistant no haya verificado.

## Qué necesitas

- La [integración](/es/home-assistant/custom-integration/) instalada y una cuenta de administrador.
- Un navegador basado en Chromium, como Chrome o Edge. Firefox y Safari no pueden comunicarse con dispositivos USB.
- Un cable USB entre el panel y el ordenador o teléfono donde se ejecuta ese navegador. No al servidor de Home Assistant.
- La depuración USB activada en las opciones de desarrollador del panel y alguien junto al panel que acepte la solicitud de autorización cuando aparezca. Las [páginas de hardware](/es/hardware/) muestran cómo acceder a las opciones de desarrollador de cada modelo.

## Qué ocurre

1. Elige una versión en la página de Panel Assistant. Solo se muestran versiones publicadas de ha-paneld que Home Assistant puede verificar para su instalación: la última versión estable y las versiones candidatas recientes que haya, marcadas como versiones de prueba.
2. La ventana del instalador verifica la versión publicada y te pide que selecciones el panel en el cuadro de selección USB del navegador.
3. Acepta la solicitud de depuración USB en la pantalla del panel.
4. Confirma. Nada cambia en el panel hasta que lo hagas, y el instalador comprueba primero que el panel no tenga realmente una instalación previa: se niega a instalar sobre una instalación existente para no poner en riesgo los datos del panel.
5. Mantén el cable conectado y la pestaña conectada al panel hasta que indique que ha terminado. Después, completa la configuración guiada en el propio panel.

Si el cable se desconecta o la ventana se cierra durante el proceso, vuelve a conectar el cable, transfiere otra vez la misma versión publicada desde Home Assistant y vuelve a conectar el mismo panel. El instalador guarda el progreso en tu navegador, comprueba cualquier paso que se haya interrumpido antes de hacer otra cosa y continúa desde ahí en lugar de empezar de nuevo.

## Después

La aplicación está ejecutándose en el panel, que ya puede añadirse a Home Assistant como dispositivo. El instalador USB no actualiza un panel que ya tenga la aplicación; para ello, consulta [Actualizaciones y recuperación](/es/manage/updates-and-recovery/).
