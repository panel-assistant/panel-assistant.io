---
title: Modo de seguridad
description: El comportamiento predeterminado del panel para redes de confianza y el modo reforzado, que requiere que alguien en el panel apruebe las acciones remotas de gran impacto.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

La interfaz web del panel, su API y sus controles de Home Assistant están diseñados para una red doméstica de confianza. El **modo relajado** es el predeterminado: las automatizaciones, las herramientas de instalación y las acciones del navegador funcionan sin una solicitud adicional. Una acción queda fuera de esa regla deliberadamente. Encender la cámara a través de su entidad de Home Assistant pide aprobación en el panel en todos los modos, incluido el relajado. El ajuste Cámara de Configurar es una vía independiente de configuración del propietario. Apagarla nunca pide aprobación.

Para un panel en una red compartida con dispositivos de menor confianza, el **modo reforzado** opcional añade aprobación presencial a determinadas operaciones de red de gran impacto. Es un límite de seguridad adicional, no un sustituto de una red independiente o de un cortafuegos, ni una autenticación general para la API. Los puntos de conexión de solo lectura y los controles habituales del panel siguen disponibles según el modelo normal de red de confianza.

**En el modo reforzado, las solicitudes directas por LAN protegidas necesitan acceso físico al panel. No pueden ejecutarse hasta que alguien las apruebe en la pantalla del panel, y esa aprobación no puede darse de forma remota.**

Los administradores que utilizan la barra lateral autenticada de Panel Assistant pueden realizar determinadas acciones de gestión habituales sin la solicitud presencial: configuración de pantalla y energía, reconocimiento de seguridad de la alimentación, activación de perfiles, reproducción multimedia, control de paquetes del fabricante y recarga del panel de control. La instalación, la desinstalación, las copias de seguridad, las restauraciones, el reinicio y otras operaciones protegidas siguen requiriendo aprobación en el panel. Las solicitudes directas por LAN no tienen esta excepción.

La interfaz web marca las acciones afectadas con un pequeño escudo en ambos modos, para que puedas ver qué flujos de trabajo cruzan el límite de aprobación antes de habilitar el modo reforzado.

## Habilitar el modo reforzado

Este ajuste solo se puede cambiar en el propio panel:

1. Abre la pantalla **Configurar** de la aplicación del panel en el propio panel.
2. Abre el menú de opciones adicionales de la barra de herramientas y elige **Modo de seguridad**.
3. Elige **Habilitar el modo reforzado**.

Primero deben estar deshabilitados tanto ADB por red como la depuración inalámbrica de Android, porque cualquiera de los dos permite que un cliente ADB remoto inyecte entradas en la pantalla de aprobación. Antes de aplicar el cambio, la aplicación del panel comprueba todas las propiedades de Android compatibles relativas a ADB por red, ADB por red persistente, direcciones explícitas de escucha de ADB y el estado de la depuración inalámbrica. También detiene cualquier retransmisor de herramientas de desarrollo de WebView activo en la red y verifica que su proceso y su punto de escucha hayan desaparecido. Si no puede confirmar que estas vías de control remoto están inactivas, se niega a habilitar el modo reforzado. Deshabilita ADB y la depuración inalámbrica en las opciones para desarrolladores de Android y vuelve a intentarlo. Si falla la verificación del retransmisor, reinicia el panel antes de volver a intentarlo.

El ajuste pertenece únicamente al panel. No se incluye en las exportaciones de configuración ni en las copias de seguridad completas, y no se puede cambiar mediante la API, desde Home Assistant, mediante una restauración, importando una configuración o mediante una actualización ejecutada en varios paneles. Por tanto, un panel existente permanece en modo relajado a menos que alguien habilite el modo reforzado en el propio panel.

Utiliza el mismo menú para volver al modo relajado. Al hacerlo se borran todas las solicitudes de aprobación pendientes.

## Aprobar una solicitud de red

Cuando el modo reforzado intercepta una solicitud protegida a la API, el primer intento devuelve HTTP `202 Accepted` con una respuesta `approval-required`, por ejemplo:

```json
{
  "ok": false,
  "error": "approval-required",
  "approval_id": "…",
  "message": "Approve this request physically on the panel, then retry it; it cannot be approved remotely."
}
```

Para completar la operación:

1. En el panel, abre **Configurar**, el menú de opciones adicionales de la barra de herramientas, **Modo de seguridad** y luego **Revisar aprobaciones**.
2. Comprueba la operación, su resumen y el dispositivo que la ha solicitado y, después, apruébala o deniégala.
3. Dentro de los diez minutos siguientes a la solicitud original, envía de nuevo una solicitud idéntica desde el mismo dispositivo.

Una aprobación está vinculada a la operación, al dispositivo solicitante y al contenido protegido de la solicitud, y solo se puede utilizar una vez. Cambiar la solicitud, enviarla desde otra dirección, esperar más de diez minutos o reiniciar la aplicación del panel requiere una nueva aprobación. Solo el reintento coincidente consume una aprobación; no es una autorización general temporal para eludir las restricciones.

Los comandos nativos de entidades y automatizaciones de Home Assistant llevan el origen de transporte de Panel Assistant en lugar de la identidad del usuario individual. Sus aprobaciones están vinculadas a ese origen y al comando exacto. Esto difiere de la excepción de la barra lateral autenticada para administradores descrita anteriormente.

Las solicitudes por la interfaz de bucle local desde software que ya se ejecuta en el panel no necesitan aprobación de red. El modo reforzado considera de confianza las aplicaciones Android locales y no aísla unas aplicaciones del panel de otras, así que evita instalar aplicaciones que no sean de confianza en el panel.

## Operaciones protegidas

En el modo reforzado, un cliente de red directo necesita aprobación en el panel antes de poder:

- instalar una aplicación cargada, una copia gestionada de la aplicación del panel o una aplicación independiente para paneles de control;
- desinstalar una aplicación o cambiar si un paquete del fabricante está habilitado, en ejecución o autorizado para superponerse a la pantalla;
- exportar una copia de seguridad completa o un paquete de configuración que contenga secretos;
- importar una configuración, restaurar una revisión de configuración guardada o restaurar una copia de seguridad del panel;
- activar un perfil de hardware o volver a uno anterior;
- reproducir contenido multimedia obtenido de una URL remota;
- recargar el motor de renderizado del panel de control o reiniciar el panel;
- descargar una aplicación desde un enlace, lo que se aprueba por separado de su instalación: la descarga está vinculada al SHA-256 de esa URL exacta y no se abre ninguna conexión hasta que se aprueba, por lo que instalar desde un enlace en el modo reforzado requiere dos aprobaciones;
- hacer avanzar el mantenimiento de recuperación de la base de datos;
- reparar la configuración de una aplicación independiente para paneles de control o borrar los datos de navegación del motor de renderizado integrado;
- cambiar la densidad de pantalla o la escala de fuente del sistema;
- deshabilitar las protecciones configuradas para mantener el panel despierto o impedir la atenuación por inactividad, que permiten que siga accesible, desde la página Configurar o Home Assistant;
- reparar los ajustes de seguridad energética del panel; o
- ocultar una advertencia exacta y sin cambios sobre un ajuste de seguridad energética que solo se puede corregir manualmente. Esto cambia únicamente lo que se muestra; la evaluación subyacente, el diagnóstico y el resultado del instalador siguen siendo los mismos.

Encender la cámara del panel a través de su entidad de Home Assistant requiere aprobación en el panel en ambos modos. Encenderla desde Configurar sigue siendo un ajuste aparte, que corresponde al propietario; siguen siendo necesarios el permiso de cámara de Android y un indicador de cámara en uso que funcione.

Al guardar de forma remota desde Configurar en el modo reforzado, una reducción de la seguridad energética debe guardarse por separado de los cambios en paquetes del fabricante, porque necesitan distintos tipos de aprobación. Los cambios guardados conjuntamente en el modo relajado, o por la interfaz de bucle local, se aplican directamente.

El modo reforzado rechaza la inyección de pulsaciones desde cualquier lugar que no sea la interfaz de bucle local, por lo que una solicitud no puede aprobarse a sí misma. También se niega a habilitar ADB por red, la depuración inalámbrica de Android o el retransmisor de herramientas de desarrollo de WebView. Vuelve a poner el panel en modo relajado desde el propio panel antes de utilizar cualquiera de esas funciones.

El límite de aprobación no hace que el resto de la API del puerto 8888 requiera autenticación. Las lecturas de diagnóstico y estado y los controles habituales mantienen su comportamiento normal de red de confianza. Mantén la API del panel fuera del alcance de redes que no sean de confianza incluso con el modo reforzado habilitado; la [referencia de seguridad](/es/reference/security/) describe la situación completa.

Las actualizaciones empiezan cuando instalas a través de Panel Assistant o eliges una instalación por tu cuenta. La aplicación del panel no tiene una política de instalación programada ni un canal de actualización guardado. Las instalaciones iniciadas por el propietario desde la pestaña **Instalar** siguen disponibles, con aprobación en el panel para las solicitudes remotas protegidas en el modo reforzado.

## Cambiar la dirección de Home Assistant

Cambiar la **URL de Home Assistant** borra las credenciales anteriores de inicio de sesión, a menos que se proporcionen credenciales nuevas al guardar ese mismo cambio. Esto se aplica en ambos modos de seguridad. Los guardados normales que mantienen la misma dirección conservan los valores secretos almacenados cuando esos campos se dejan en blanco.
