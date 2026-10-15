---
title: Cuenta del panel y seguridad de red
description: Elige la cuenta de Home Assistant que utiliza tu panel y planifica su acceso a la red.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

## ¿Qué cuenta de Home Assistant utiliza el panel?

Cuando añades un panel nuevo desde Panel Assistant, su inicio de sesión en el navegador normalmente utiliza la cuenta de Home Assistant con la que ya has iniciado sesión en tu ordenador. Si es tu cuenta de administrador, el panel inicia sesión como ese administrador. Panel Assistant no te pide la contraseña ni crea otro usuario de Home Assistant. El panel mantiene su propia sesión de Home Assistant para poder cargar tu panel de control y comunicarse con Home Assistant como ese usuario.

Utilizar tu cuenta habitual está bien, sobre todo si tu instalación de Home Assistant solo tiene un usuario. Merece la pena utilizar un usuario independiente **ya existente** si quieres que el acceso del panel sea distinto del de tu cuenta de administrador. Un usuario que no sea administrador puede utilizar paneles de control sin tener acceso a la configuración de Home Assistant. Una cuenta independiente es opcional; Panel Assistant no la crea durante la configuración.

Home Assistant también guarda un panel de control y un tema predeterminados para cada usuario. Un usuario del panel puede tener un panel de control de pared y una apariencia propios sin cambiar las elecciones de tu teléfono u ordenador. El motor de renderizado integrado utiliza ese panel de control predeterminado cuando **Panel de control de inicio** está en **Auto**; un panel de control seleccionado en la configuración del panel tiene prioridad. Su ajuste **Tema del panel de control** puede solicitar el modo claro u oscuro, pero una elección explícita de tema en Home Assistant sigue teniendo prioridad.

Puedes asignar al usuario del panel sus propios elementos de la barra lateral y su orden, idioma, zona horaria y formatos de números, fecha y hora en **Home Assistant → Perfil de usuario → General**. Las preferencias de la barra lateral importan cuando esta es visible; el panel oculta la navegación de forma predeterminada. Ocultar un elemento de la barra lateral no restringe el acceso a él. Consulta la [guía del perfil de usuario de Home Assistant](https://www.home-assistant.io/docs/configuration/user-configuration/) para estos ajustes de la cuenta.

### Cambiar la sesión del panel

En Home Assistant, abre **Panel Assistant**, selecciona el panel y abre su pestaña **Configurar**. En **Inicio de sesión en el navegador**, elige **Reconectar** y **Copiar enlace**. Abre ese enlace en una ventana privada del navegador, inicia sesión en Home Assistant como el usuario existente que quieres que utilice el panel y deja que el navegador vuelva al panel. Una ventana privada ayuda cuando tu navegador habitual ya tiene iniciada la sesión como administrador. También puedes abrir **Configurar** directamente en el panel e iniciar allí el inicio de sesión en el navegador. Si Home Assistant informa entonces de una discrepancia del usuario del panel en **Configuración → Reparaciones**, confirma que el nuevo usuario indicado es el que has elegido.

El navegador debe poder acceder tanto a Home Assistant como a la dirección local del panel para completar el inicio de sesión. El panel también debe poder acceder a Home Assistant. Si has abierto Configurar de forma remota a través de Home Assistant, pero tu navegador no puede acceder a la dirección local del panel, completa el inicio de sesión conectado a la red del panel o directamente en el panel.

## Colocar el panel en una red independiente

Un panel puede utilizar una VLAN sin acceso a internet si tu cortafuegos sigue permitiendo que el panel y Home Assistant se comuniquen entre sí y que un navegador de tu red acceda al panel cuando alguien necesite iniciar sesión. El panel utiliza la dirección local de Home Assistant para el inicio de sesión y para su panel de control. Home Assistant también necesita acceder al panel para la gestión y las actualizaciones.

Panel Assistant puede obtener una actualización verificada de la aplicación del panel en el equipo de Home Assistant y enviarla al panel por la red local. Home Assistant sigue necesitando acceso al origen de las actualizaciones. Las comprobaciones de versión del panel y las instalaciones iniciadas por el propietario desde su pestaña Instalar utilizan GitHub y también necesitan acceso a internet. Esas comprobaciones y descargas no funcionarán en una VLAN sin salida a internet. El WebView del sistema Android se mantiene por separado a través de Play Store, del firmware del fabricante o de una instalación manual, así que planifica también cómo lo mantendrás.

La separación de redes limita qué dispositivos pueden acceder a la interfaz web y la API del panel. No reduce los permisos de una cuenta de Home Assistant que ya tenga iniciada la sesión en el panel. Si el panel utiliza una cuenta de administrador, esa sesión sigue siendo de administrador incluso en una VLAN aislada. Elige la cuenta y las reglas del cortafuegos según lo que consideres de confianza en la pared y en la red local.

La interfaz web del panel y los controles habituales presuponen una red local de confianza. El [modo reforzado](/es/manage/security-mode/) opcional requiere acceso físico para determinadas solicitudes directas por LAN de gran impacto. Algunas acciones de gestión habituales pueden realizarse a través de la barra lateral autenticada de Panel Assistant para un administrador de Home Assistant; otras operaciones protegidas siguen necesitando aprobación en la pantalla del panel. No sustituye a la separación de redes ni autentica todas las solicitudes a la API.
