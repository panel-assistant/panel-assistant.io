---
title: Primeros pasos
description: De un panel de pared Android sin configurar a tu panel de control de Home Assistant en minutos, con Home Assistant guiándote en cada paso.
sourceCommit: a0f4f4fce9c24d9c344dbb001c39a8eef9bdd679
---

Si alguna vez has configurado un panel de pared o un quiosco, probablemente recuerdes cómo fue: instalar apps por tu cuenta, buscar un motor de navegador capaz de mostrar un panel de control, probar ajustes a ciegas y no acabar de fiarte del siguiente reinicio. Configurar un panel con Panel Assistant será una sorpresa agradable. Puedes terminar en minutos y, aunque el panel esté en la pared, no tendrás que levantarte de la silla. Bueno, quizá una vez ;-)

Lo difícil de cualquier panel es la primera hora. Panel Assistant se encarga de esa hora por ti, desde Home Assistant. Si el panel ya está en tu red, dale su dirección a la integración y ella hace el resto. Si aún está en la caja, conéctalo a tu portátil con un cable USB e instálalo directamente desde el navegador, antes de ponerlo en la pared. En ambos casos, aceptas un aviso en el panel y ves cómo termina.

## 1. Instala la integración

Añade Panel Assistant mediante HACS y reinicia Home Assistant. Es lo único que instalas a mano. A partir de aquí, Home Assistant te guía. Consulta [Instalar la integración](/es/home-assistant/custom-integration/).

## 2. Activa la depuración en el panel

Abre las opciones de desarrollador del panel y activa la depuración inalámbrica, o la depuración USB si vas a conectarlo por cable. Así Home Assistant puede hacer la instalación por ti. Las [páginas de hardware](/es/hardware/) muestran dónde está el interruptor en cada modelo, y [Preparar el panel](/es/install/prepare-a-panel/) explica los detalles.

## 3. Añade el panel

En Home Assistant, ve a **Ajustes**, **Dispositivos y servicios**, **Añadir integración** y elige **Panel Assistant**. Después selecciona cómo está conectado el panel.

### Conectado a tu ordenador

Puedes configurar un panel nuevo antes de ponerlo en la pared. Conéctalo a tu ordenador con un cable USB e instálalo directamente desde el navegador. Para esto necesitas Chrome o Edge.

<div class="pa-steps" role="region" aria-label="Instalación por USB, paso a paso" tabindex="0">
<figure>
<figcaption><span>1</span> Elige Instalar por USB</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="El paso Configurar un panel en Home Assistant, con las opciones Añadir un panel de tu red o Instalar por USB en este ordenador">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="El paso Configurar un panel en Home Assistant, con las opciones Añadir un panel de tu red o Instalar por USB en este ordenador">
</figure>
<figure>
<figcaption><span>2</span> Conecta el panel</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="El instalador por USB pide que conectes el panel y pulses Buscar mi panel">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="El instalador por USB pide que conectes el panel y pulses Buscar mi panel">
</figure>
<figure>
<figcaption><span>3</span> Toca Permitir en el panel</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="El instalador por USB espera mientras tocas Permitir en la pantalla del panel">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="El instalador por USB espera mientras tocas Permitir en la pantalla del panel">
</figure>
<figure>
<figcaption><span>4</span> Pulsa Instalar</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="El instalador por USB listo para instalar, con un único botón Instalar">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="El instalador por USB listo para instalar, con un único botón Instalar">
</figure>
<figure>
<figcaption><span>5</span> Mira cómo se instala</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="La barra de progreso del instalador por USB mientras se instala la app">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="La barra de progreso del instalador por USB mientras se instala la app">
</figure>
<figure>
<figcaption><span>6</span> Listo</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="El instalador por USB confirma la instalación y abre la configuración del panel">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="El instalador por USB confirma la instalación y abre la configuración del panel">
</figure>
</div>

### En tu red

Si el panel ya está en la pared, Home Assistant solo necesita su dirección.

<div class="pa-steps" role="region" aria-label="Añadir un panel de tu red, paso a paso" tabindex="0">
<figure>
<figcaption><span>1</span> Elige Añadir un panel de tu red</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="El paso Configurar un panel en Home Assistant, con las opciones Añadir un panel de tu red o Instalar por USB en este ordenador">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="El paso Configurar un panel en Home Assistant, con las opciones Añadir un panel de tu red o Instalar por USB en este ordenador">
</figure>
<figure>
<figcaption><span>2</span> Introduce la dirección del panel</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="El paso Añadir un panel, con la dirección IP del panel introducida">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="El paso Añadir un panel, con la dirección IP del panel introducida">
</figure>
<figure>
<figcaption><span>3</span> Elige una versión</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="El paso Elige una versión, con la versión recomendada al principio de la lista">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="El paso Elige una versión, con la versión recomendada al principio de la lista">
</figure>
<figure>
<figcaption><span>4</span> Toca Permitir en el panel y quedará añadido</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="El paso de confirmación que indica que el panel se ha añadido a Home Assistant">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="El paso de confirmación que indica que el panel se ha añadido a Home Assistant">
</figure>
</div>

En ambos casos, el asistente se encarga de la parte complicada. Comprueba qué hay ya en el panel, instala la versión actual de la app del panel, la inicia y confirma que funciona correctamente. Si un panel ya tiene la app en ejecución, lo adopta sin reinstalarla. El panel reconoce su propio modelo y carga el perfil de hardware correspondiente, de modo que su pantalla, botones, LED y sensores llegan a Home Assistant listos para usar. Consulta [Añadir un panel](/es/install/installing-ha-paneld/).

## 4. Termina en el asistente del propio panel

Home Assistant abre entonces el asistente de configuración del propio panel, que hace unas pocas preguntas rápidas, como el nombre del panel y el panel de control que mostrará en la pared. El panel solo carga las entidades que muestra ese panel de control, lo que mantiene su rapidez. Consulta [Conectar un panel](/es/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="El asistente de configuración del panel, paso a paso" tabindex="0">
<figure>
<figcaption><span>1</span> Ponle nombre al panel</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="El asistente de configuración del panel pide un ID de panel y un nombre descriptivo, con una vista previa de los nombres de las entidades que usará Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="El asistente de configuración del panel pide un ID de panel y un nombre descriptivo, con una vista previa de los nombres de las entidades que usará Home Assistant">
</figure>
<figure>
<figcaption><span>2</span> Elige el panel de control y el área</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="El asistente con un panel de control y un área de Home Assistant seleccionados para el panel">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="El asistente con un panel de control y un área de Home Assistant seleccionados para el panel">
</figure>
<figure>
<figcaption><span>3</span> Activa el filtro de entidades</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="El asistente recomienda el filtro de entidades para este panel y muestra el número de entidades de Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="El asistente recomienda el filtro de entidades para este panel y muestra el número de entidades de Home Assistant">
</figure>
<figure>
<figcaption><span>4</span> Ya casi está</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="El asistente espera mientras el panel crea su conjunto filtrado de entidades y carga el panel de control">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="El asistente espera mientras el panel crea su conjunto filtrado de entidades y carga el panel de control">
</figure>
<figure>
<figcaption><span>5</span> Todo listo</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="El asistente confirma que el panel está configurado y muestra el panel de control">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="El asistente confirma que el panel está configurado y muestra el panel de control">
</figure>
</div>

## Qué necesitas

- Home Assistant 2026.8.3 o posterior, con HACS.
- Un panel de pared con Android 8.0 o posterior. La mayoría de los paneles funciona con el perfil de hardware genérico, y [Elegir un panel](/es/install/supported-panels/) enumera los modelos con compatibilidad de hardware completa.
- Para la opción USB, un navegador basado en Chromium, como Chrome o Edge.

## Dónde encontrar los detalles

Las páginas de **Mantenlo funcionando** explican en profundidad cada función de la app del panel. La sección de referencia documenta la [API](/es/reference/api/), los [perfiles de hardware](/es/reference/profiles/) y el [modelo de seguridad](/es/reference/security/), y las [páginas de hardware](/es/hardware/) cubren cada panel compatible.
