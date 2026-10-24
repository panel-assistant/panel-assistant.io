---
title: Primeros pasos
description: De un panel de pared Android sin configurar a tu panel de control de Home Assistant en minutos, con Home Assistant guiándote en cada paso.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Si alguna vez has configurado un panel de pared o un quiosco, probablemente recuerdes cómo fue: instalar apps por tu cuenta, buscar un motor de navegador capaz de mostrar un panel de control, probar ajustes a ciegas y no acabar de fiarte del siguiente reinicio. Configurar un panel con Panel Assistant será una sorpresa agradable. Puedes terminar en minutos y, aunque el panel esté en la pared, no tendrás que levantarte de la silla. Bueno, quizá una vez ;-)

La parte difícil de cualquier panel es la primera hora. Panel Assistant se encarga de esa hora por ti, desde Home Assistant. Si el panel ya está en tu red, indica su dirección a la integración y ella se encarga del resto. Si aún está en la caja, conéctalo a tu portátil con un cable USB e instala directamente desde el navegador, antes de colocarlo en la pared. Si el panel te pide que autorices la depuración, acepta la solicitud en su pantalla y sigue la instalación hasta que termine.

## 1. Instala la integración

Añade Panel Assistant mediante HACS y reinicia Home Assistant. Es lo único que instalas a mano. A partir de aquí, Home Assistant te guía. Consulta [Instalar la integración](/es/home-assistant/custom-integration/).

:::note
Panel Assistant 1.0 is a release candidate. HACS offers 0.9.0 by default. To try the release candidate, enable and turn on the **Pre-release** switch on the Panel Assistant device under **Settings**, **Devices and services**, **HACS**; [Install the integration](/es/home-assistant/custom-integration/) walks through the disabled-entity step. A panel that runs the 1.0 app cannot go back to 0.9; [Upgrading to 1.0](/es/manage/upgrade-to-1-0/) explains what changes.
:::

## 2. Activa la depuración en el panel

Abre las opciones para desarrolladores del panel: en la mayoría de los paneles, abre **Ajustes**, luego **Información** y toca **Número de compilación** siete veces. Después activa **Depuración USB** si vas a conectar el panel por cable, o **ADB por red en el puerto TCP 5555** para la opción de red. No todos los paneles tienen un interruptor de ADB por red; cada [página de hardware](/es/hardware/) indica si el tuyo lo tiene y dónde está, y, si no lo tiene, utiliza la opción USB. [Preparar el panel](/es/install/prepare-a-panel/) explica los detalles.

## 3. Añade el panel

En Home Assistant, ve a **Configuración**, **Dispositivos y servicios**, **Añadir integración** y elige **Panel Assistant**. Después selecciona cómo está conectado el panel.

### Conectado a tu ordenador

Puedes configurar un panel nuevo antes de ponerlo en la pared. Conéctalo a tu ordenador con un cable USB e instálalo directamente desde el navegador. Para esto necesitas Chrome o Edge. Después de elegir **Instalar por USB en este ordenador**, selecciona **Abrir el instalador USB**, mantén la versión recomendada y pulsa **Continuar**; el instalador se abre en una ventana nueva. El panel sigue necesitando Wi-Fi para terminar la configuración, así que conéctalo a tu red desde su propia aplicación Ajustes, antes o después de instalar.

<div class="pa-steps" role="region" aria-label="Instalación por USB, paso a paso" tabindex="0">
<figure>
<figcaption><span>1</span> Elige Instalar por USB</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="El paso Configurar un panel en Home Assistant, con las opciones Añadir un panel de tu red o Instalar por USB en este ordenador">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="El paso Configurar un panel en Home Assistant, con las opciones Añadir un panel de tu red o Instalar por USB en este ordenador">
</figure>
<figure>
<figcaption><span>2</span> Conecta el panel, pulsa Buscar mi panel y elige el panel en la lista del navegador</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-connect-dark.png" width="520" height="375" alt="El instalador por USB pide que conectes el panel y pulses Buscar mi panel">
<img class="dark:sl-hidden" src="/screenshots/usb-connect-light.png" width="520" height="375" alt="El instalador por USB pide que conectes el panel y pulses Buscar mi panel">
</figure>
<figure>
<figcaption><span>3</span> Permite la depuración en el panel si lo pide</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-allow-dark.png" width="520" height="263" alt="El instalador por USB espera mientras tocas Permitir en la pantalla del panel">
<img class="dark:sl-hidden" src="/screenshots/usb-allow-light.png" width="520" height="263" alt="El instalador por USB espera mientras tocas Permitir en la pantalla del panel">
</figure>
<figure>
<figcaption><span>4</span> Pulsa Instalar</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-confirm-dark.png" width="520" height="323" alt="El instalador por USB listo para instalar, con un único botón Instalar">
<img class="dark:sl-hidden" src="/screenshots/usb-confirm-light.png" width="520" height="323" alt="El instalador por USB listo para instalar, con un único botón Instalar">
</figure>
<figure>
<figcaption><span>5</span> Mira cómo se instala</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-progress-dark.png" width="520" height="309" alt="La barra de progreso del instalador por USB mientras se instala la app">
<img class="dark:sl-hidden" src="/screenshots/usb-progress-light.png" width="520" height="309" alt="La barra de progreso del instalador por USB mientras se instala la app">
</figure>
<figure>
<figcaption><span>6</span> Listo</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-done-dark.png" width="520" height="308" alt="El instalador por USB confirma la instalación y abre la configuración del panel">
<img class="dark:sl-hidden" src="/screenshots/usb-done-light.png" width="520" height="308" alt="El instalador por USB confirma la instalación y abre la configuración del panel">
</figure>
</div>

### En tu red

Si el panel ya está en la pared, Home Assistant solo necesita su dirección.

<div class="pa-steps" role="region" aria-label="Añadir un panel de tu red, paso a paso" tabindex="0">
<figure>
<figcaption><span>1</span> Elige Añadir un panel de tu red</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="El paso Configurar un panel en Home Assistant, con las opciones Añadir un panel de tu red o Instalar por USB en este ordenador">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="El paso Configurar un panel en Home Assistant, con las opciones Añadir un panel de tu red o Instalar por USB en este ordenador">
</figure>
<figure>
<figcaption><span>2</span> Introduce la dirección del panel</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-address-dark.png" width="580" height="377" alt="El paso Añadir un panel, con la dirección IP del panel introducida">
<img class="dark:sl-hidden" src="/screenshots/ha-address-light.png" width="580" height="377" alt="El paso Añadir un panel, con la dirección IP del panel introducida">
</figure>
<figure>
<figcaption><span>3</span> Elige una versión</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-version-dark.png" width="580" height="304" alt="El paso Elige una versión, con la versión recomendada al principio de la lista">
<img class="dark:sl-hidden" src="/screenshots/ha-version-light.png" width="580" height="304" alt="El paso Elige una versión, con la versión recomendada al principio de la lista">
</figure>
<figure>
<figcaption><span>4</span> Permite la depuración en el panel si lo pide</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-authorize-dark.png" width="580" height="354" alt="Home Assistant espera a que marques Permitir siempre desde este ordenador y toques Permitir en el panel; continúa automáticamente">
<img class="dark:sl-hidden" src="/screenshots/ha-authorize-light.png" width="580" height="354" alt="Home Assistant espera a que marques Permitir siempre desde este ordenador y toques Permitir en el panel; continúa automáticamente">
</figure>
<figure>
<figcaption><span>5</span> Abre la página de configuración del panel</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-done-dark.png" width="580" height="248" alt="Home Assistant ofrece la página de configuración del panel y pide que vuelvas y selecciones Listo al terminar">
<img class="dark:sl-hidden" src="/screenshots/ha-done-light.png" width="580" height="248" alt="Home Assistant ofrece la página de configuración del panel y pide que vuelvas y selecciones Listo al terminar">
</figure>
</div>

Si el panel te pregunta si quieres permitir la depuración, marca **Permitir siempre desde este ordenador** y toca **Permitir** en el panel; Home Assistant continúa por sí solo. Después confirma la instalación.

En ambos casos, el asistente se encarga de la parte complicada. Comprueba qué hay ya en el panel, instala la versión actual de la app del panel, la inicia y confirma que funciona correctamente. Si un panel ya tiene la app en ejecución, lo adopta sin reinstalarla. El panel reconoce su propio modelo y carga el perfil de hardware correspondiente, de modo que su pantalla, botones, LED y sensores llegan a Home Assistant listos para usar. Consulta [Añadir un panel](/es/install/installing-ha-paneld/).

## 4. Termina en el asistente del propio panel

A continuación viene el asistente de configuración del propio panel. El panel lo sirve y se abre en el navegador de tu ordenador, no en la pantalla del panel. Después de una instalación por red, Home Assistant muestra **Terminar de configurar este panel**: abre la página de configuración del panel, completa sus pasos y luego vuelve a Home Assistant y selecciona **Listo**. Después de una instalación por USB, la ventana del instalador pasa directamente al asistente. Como lo sirve el panel, solo se carga en un navegador que esté en la misma red que el panel.

El asistente pide un nombre para el panel, inicia su sesión en Home Assistant y pregunta qué panel de control mostrar y en qué área está el panel. El panel se conecta con la cuenta de Home Assistant con la que inicies sesión, así que, si tu navegador tiene iniciada tu sesión, el panel puede conectarse con tu cuenta; para que utilice su propia cuenta, inicia sesión con ella. Con el filtrado de entidades habilitado, el panel carga solo las entidades que utiliza ese panel de control, lo que lo mantiene ágil. Consulta [Conectar un panel](/es/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="El asistente de configuración del panel, paso a paso" tabindex="0">
<figure>
<figcaption><span>1</span> Ponle nombre al panel</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-name-dark.png" width="524" height="702" alt="El asistente de configuración del panel pide un ID de panel y un nombre descriptivo, con una vista previa de los nombres de las entidades que usará Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-name-light.png" width="524" height="702" alt="El asistente de configuración del panel pide un ID de panel y un nombre descriptivo, con una vista previa de los nombres de las entidades que usará Home Assistant">
</figure>
<figure>
<figcaption><span>2</span> Inicia sesión en Home Assistant</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-sign-in-dark.png" width="524" height="688" alt="El asistente ofrece iniciar sesión desde este navegador o en el panel, con la cuenta de Home Assistant con la que debe conectarse el panel">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-sign-in-light.png" width="524" height="688" alt="El asistente ofrece iniciar sesión desde este navegador o en el panel, con la cuenta de Home Assistant con la que debe conectarse el panel">
</figure>
<figure>
<figcaption><span>3</span> Elige el panel de control y el área</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-dashboard-dark.png" width="524" height="485" alt="El asistente con un panel de control y un área de Home Assistant seleccionados para el panel">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-dashboard-light.png" width="524" height="485" alt="El asistente con un panel de control y un área de Home Assistant seleccionados para el panel">
</figure>
<figure>
<figcaption><span>4</span> Activa el filtro de entidades si lo pide</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-filter-dark.png" width="524" height="636" alt="El asistente recomienda el filtro de entidades para este panel y muestra el número de entidades de Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-filter-light.png" width="524" height="636" alt="El asistente recomienda el filtro de entidades para este panel y muestra el número de entidades de Home Assistant">
</figure>
<figure>
<figcaption><span>5</span> Ya casi está</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-almost-there-dark.png" width="524" height="339" alt="El asistente espera mientras el panel crea su conjunto filtrado de entidades y carga el panel de control">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-almost-there-light.png" width="524" height="339" alt="El asistente espera mientras el panel crea su conjunto filtrado de entidades y carga el panel de control">
</figure>
<figure>
<figcaption><span>6</span> Todo listo</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-done-dark.png" width="524" height="526" alt="El asistente confirma que el panel está configurado y muestra el panel de control">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-done-light.png" width="524" height="526" alt="El asistente confirma que el panel está configurado y muestra el panel de control">
</figure>
</div>

## Qué necesitas

- Home Assistant 2026.8.3 o posterior, con HACS.
- Un panel de pared ARM con Android 8.0 o posterior y acceso de depuración. La mayoría de los paneles funcionan con el perfil de hardware genérico, y [Elegir un panel](/es/install/supported-panels/) enumera los modelos con compatibilidad completa con el hardware.
- Para la opción USB, un navegador basado en Chromium, como Chrome o Edge.

## Dónde encontrar los detalles

Las páginas de **Mantenlo funcionando** explican en profundidad cada función de la app del panel. La sección de referencia documenta la [API](/es/reference/api/), los [perfiles de hardware](/es/reference/profiles/) y el [modelo de seguridad](/es/reference/security/), y las [páginas de hardware](/es/hardware/) cubren cada panel compatible.
