---
title: Añadir un panel
description: Cómo añadir un panel desde Home Assistant, por la red o mediante un cable USB.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Los paneles se añaden desde Home Assistant, sin línea de comandos. Hay dos vías y ambas terminan con el panel disponible como dispositivo.

Elijas la que elijas, sigue primero [Preparar el panel](/es/install/prepare-a-panel/).

## Por la red

Para un panel que ya está en tu red. Ve a **Ajustes**, **Dispositivos y servicios**, añade **Panel Assistant** e introduce la dirección del panel. La integración comprueba qué hay en el panel, te pide que apruebes una solicitud de depuración en la propia pantalla del panel si es necesario, te pide que confirmes la instalación, instala la aplicación del panel, la inicia y solo entonces crea el dispositivo. Si el panel ya ejecuta la aplicación, la adopta en su lugar, lo que resulta más rápido.

## Por USB

Para un panel que aún está en la caja o cuyo software del fabricante dificulta el acceso por red. Conéctalo al portátil e instala desde el navegador mediante el cable USB. El navegador permanece conectado a Home Assistant, que proporciona la versión verificada; el panel no necesita ADB por red. Inicia el proceso desde **Ajustes**, **Dispositivos y servicios**, **Añadir integración**, **Panel Assistant**, **Instalar mediante USB en este ordenador**; se necesita un navegador basado en Chromium. Consulta [Instalar por USB](/es/install/install-over-usb/).

En la versión 1.0.0-rc2, aún no publicada, ambos instaladores también pueden solicitar una actualización verificada y compatible del motor del navegador en los paneles compatibles. Si la actualización no puede terminar, no impide la configuración ni el emparejamiento; consulta las instrucciones de recuperación en [Preparar el panel](/es/install/prepare-a-panel/).

## Qué protege el instalador

Ambas vías comprueban el panel antes de cambiar nada. La vía de red adopta una aplicación existente en lugar de reinstalarla. USB no sobrescribe una instalación existente diferente; si ya está instalada exactamente la compilación seleccionada, termina la configuración de esa compilación. Una instalación USB interrumpida puede reintentarse con la misma versión, comprobando qué se completó antes de continuar. Para las copias de seguridad previas a una actualización de la aplicación, consulta [Actualizaciones y recuperación](/es/manage/updates-and-recovery/).

## Después de instalar

El panel aparece como dispositivo con un sensor de estado y diagnósticos, y en la página de Panel Assistant de la barra lateral. Después terminas la configuración en el asistente del propio panel, donde le das un nombre y eliges su panel de control. Hasta terminar, la pantalla del panel muestra un código QR y un botón **Configurar**, para que también puedas hacerlo desde un teléfono o desde el propio panel. Para cambiar el panel de control más adelante, abre la página del dispositivo del panel en Home Assistant y selecciona **Visitar**. Si abres directamente la dirección del panel, utiliza el puerto HTTP que indique; el predeterminado es 8888.

Continúa con [Conectar un panel](/es/home-assistant/connect-a-panel/).
