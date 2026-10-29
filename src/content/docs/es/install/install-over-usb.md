---
title: Instalar por USB
description: Poner en marcha un panel nuevo desde el navegador mediante un cable USB, antes de colocarlo en la pared.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

La vía USB sirve para un panel que aún está en la caja o cuyo software del fabricante dificulta el acceso por red. Conecta el panel al ordenador que estás utilizando y el navegador instala la aplicación directamente por el cable. El panel no necesita ADB por red. El navegador debe permanecer conectado a Home Assistant, que proporciona la versión verificada. La mayoría de la gente lo utiliza una sola vez, antes de montar el panel.

## Todo empieza dentro de Home Assistant

Un administrador inicia el instalador USB desde Home Assistant: ve a **Ajustes**, **Dispositivos y servicios**, **Añadir integración**, elige **Panel Assistant** y después **Instalar mediante USB en este ordenador**. El enlace **Añadir panel** de la página de Panel Assistant en la barra lateral abre la misma elección. Home Assistant verifica la versión y se la entrega al instalador, que se abre en su propia ventana segura. Por eso no hay un botón de instalación en este sitio: la página que realiza el trabajo solo acepta una versión de tu propio Home Assistant, para que no llegue al panel nada que Home Assistant no haya verificado.

## Qué necesitas

- La [integración](/es/home-assistant/custom-integration/) instalada y una cuenta de administrador.
- Un navegador basado en Chromium, como Chrome o Edge. Firefox y Safari no pueden comunicarse con dispositivos USB.
- Un cable USB desde el panel hasta el ordenador o teléfono que ejecuta ese navegador. No hasta el servidor de Home Assistant.
- Depuración USB activada en las opciones para desarrolladores del panel. Si muestra una solicitud de autorización al conectar, alguien debe aceptarla en el panel; algunos paneles nunca la solicitan. Las [páginas de hardware](/es/hardware/) indican los procedimientos de depuración conocidos e identifican los modelos cuyo acceso USB inicial sigue sin verificarse.

## Qué ocurre

1. Selecciona **Abrir el instalador USB**. En la página que se abre, conserva la versión recomendada y pulsa **Continuar**. Home Assistant ofrece las versiones compatibles más recientes que puede verificar. Las versiones de prueba se identifican y se ofrecen cuando la integración en ejecución lo permite.
2. El instalador se abre en una ventana nueva y verifica la versión. Pulsa **Buscar mi panel** y selecciona el panel en la lista del navegador.
3. Si el panel pide permiso para la depuración USB, marca **Permitir siempre desde este ordenador** y aprueba la solicitud en su pantalla. Algunos paneles no lo piden y el instalador continúa directamente.
4. Confirma. Nada cambia en el panel hasta que lo hagas. El instalador rechaza sobrescribir una instalación existente diferente; si ya está instalada exactamente la compilación seleccionada, termina la configuración de esa compilación.
5. Mantén el cable conectado y la ventana abierta hasta que indique que ha terminado. La misma ventana pasa después al asistente de configuración del panel, donde terminas el proceso. El panel sirve el asistente, por lo que el ordenador debe estar en su misma red.

Si el cable se desconecta a medias, vuelve a conectarlo, espera a que arranque el panel, pulsa el botón de la pantalla de error del instalador y después **Buscar mi panel**. Si cerraste la ventana del instalador, vuelve a empezar desde Home Assistant y elige la misma versión. En ambos casos, el instalador conserva el progreso en el navegador, comprueba cualquier paso interrumpido antes de hacer otra cosa y continúa desde allí en lugar de empezar de cero.

## Después

El panel ya ejecuta la aplicación. Un panel recién sacado de la caja aún no está en tu red, así que conéctalo al Wi-Fi desde la aplicación Ajustes del propio panel, antes o después de instalar: tanto el asistente de configuración como la conexión a Home Assistant lo necesitan. Si el panel no aparece en Home Assistant al terminar la configuración, ve a **Ajustes**, **Dispositivos y servicios**, **Añadir integración**, elige **Panel Assistant**, después **Añadir un panel de tu red**, e introduce su dirección. El instalador USB no actualiza un panel que ya tiene la aplicación; para eso consulta [Actualizaciones y recuperación](/es/manage/updates-and-recovery/).
