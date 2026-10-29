---
title: Script de instalación (retirado)
description: El instalador por línea de comandos ya no instala ni actualiza paneles. Qué utilizar en su lugar y cómo eliminar ha-paneld de un panel.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Se ha eliminado el instalador por línea de comandos. Añade y actualiza los paneles mediante Panel Assistant en Home Assistant.

Añade y actualiza los paneles desde [Home Assistant](/es/install/installing-ha-paneld/) con Panel Assistant. Los paneles instalados con el script siguen funcionando. Añádelos a Panel Assistant y se conectarán sin reinstalarse; después, Panel Assistant ofrecerá sus actualizaciones.

## Habilitar ADB por red

En algunos paneles Tuya TPA10 y Smatek, ADB solo funciona por USB al principio. Conecta el cable USB y activa ADB por red antes de añadir el panel en Home Assistant:

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

## Eliminar ha-paneld de un panel

Elige la opción **Eliminar Panel Assistant de este panel**, en **Configurar** en Home Assistant. En 1.0.0-rc1, elige si Home Assistant debe olvidar el panel y después selecciona **Enviar**. En la versión 1.0.0-rc2, aún no publicada, la opción se llama **Eliminar de este panel** y, si la eliminación termina correctamente, siempre se borra su entrada de Home Assistant. Panel Assistant devuelve al panel su pantalla de inicio original y desinstala la aplicación del panel. Lee primero [Antes de eliminar ha-paneld](/es/manage/removal-risks/).

## Vías de acceso y modo de seguridad

Las recomendaciones de los perfiles de hardware son meramente informativas. Elegir un perfil no autoriza a desactivar paquetes, hacer persistente ADB, instalar software con privilegios ni cambiar ajustes de pantalla. Los paquetes que ya hayas restringido en la tarjeta de [paquetes del fabricante](/es/manage/vendor-packages/) vuelven a restringirse en cada arranque.

El [modo de seguridad reforzado](/es/manage/security-mode/) requiere que alguien en el panel apruebe determinadas acciones remotas de gran impacto. Solo puede activarse desde el propio panel. No se puede utilizar ADB por red mientras está activado, así que vuelve al modo Relajado desde el panel antes de instalar o actualizar por ADB.

## Compilarlo tú mismo

La aplicación es software libre y de código abierto; la página del [entorno de desarrollo](/es/reference/development-environment/) explica cómo compilarla.
