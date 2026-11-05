---
title: Obtener acceso adb y root
description: Cómo acceder a adb y root en cada panel de pared documentado, para qué utiliza root la aplicación y dónde encontrar el procedimiento exacto de cada modelo.
sidebar:
  label: Acceso adb y root
  order: 1
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Cada panel permite acceder a adb y, cuando dispone de él, a root por una vía distinta. Esta página ofrece una visión general; los pasos exactos para cada firmware están en la página de cada panel.

## Para qué sirve root

La aplicación del panel se instala y funciona sin root. Root solo importa para el hardware que Android no expone a una aplicación normal:

- **Nodos sysfs y de entrada propiedad de `system`.** En algunos paneles, el LED, la retroiluminación de los botones y los sensores ambientales son archivos `system:system` que una aplicación aislada no puede escribir ni leer. En ese caso, la aplicación del panel se comunica con un pequeño servicio auxiliar con root, `hapaneld-helper`, mediante un socket Unix. Consulta la [documentación del auxiliar](https://github.com/panel-assistant/android/blob/main/helper/README.md).
- **Apagado real de la retroiluminación, reinicio y control del gobernador de CPU.** Sin una vía root, se recurre a lo que permite Android, por ejemplo brillo cero en lugar de apagar la retroiluminación.
- **Relés y líneas GPIO**, cuando un panel solo los expone mediante sysfs con root.

La aplicación del panel comprueba las vías con privilegios cuando las utiliza. Un panel sin acceso root sigue disponiendo del panel de control, los sensores estándar, el brillo y la navegación compatible. Algunos controles con privilegios siguen visibles cuando se puede leer su estado, pero modificarlos puede fallar si no funciona ninguna vía con privilegios.

## Vías según el panel

- **[Sonoff NSPanel Pro](/es/hardware/panels/sonoff/#gaining-adb-and-root-access).** Una compilación `userdebug` con claves de prueba y **sin contraseña de adb**. El único obstáculo es acceder al modo de desarrollador, cuyo procedimiento varía con el firmware eWeLink. Después, `adb root`, remontar e instalar un `su` persistente.
- **[Tuya TPA10](/es/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access).** adb está **protegido con contraseña**. La vía fiable es la puerta trasera de la aplicación de diagnóstico por USB, y `su` ya está presente. Un pequeño script hace después que adb por red persista tras los reinicios.
- **[Electron WF1589T](/es/hardware/panels/electron/wf1589t/#gaining-adb-and-root-access).** Una compilación `userdebug` con Google Play. `adb root` funciona directamente. La aplicación controla el LED directamente, así que rara vez se necesita root.
- **[Electron WF2489T (ZHICAI SMT1019)](/es/hardware/panels/electron/wf2489t/#root-access-by-firmware-build).** La compilación de producción comercial no tiene root. La compilación `userdebug` del proveedor sí lo tiene, pero necesita un remontaje para que el auxiliar pueda persistir.
- **[SMT156](/es/hardware/panels/electron/smt156/).** No hay un `su` accesible para la aplicación en la instalación comunicada. No se han probado `adb root` por USB, el modo de ingeniería del fabricante ni las vías de desbloqueo persistente.
- **[Smatek S9E](/es/hardware/panels/smatek/s9e/).** La aplicación del fabricante ejecuta comandos root y algunas unidades vienen con el modo de desarrollador desbloqueado. Se ha comunicado la disponibilidad de `su` a nivel de aplicación en el firmware 1.1.0; el acceso sigue dependiendo de la unidad y del firmware.
- **[Shelly Wall Display](/es/hardware/panels/shelly/).** En un [Wall Display X2i](/es/hardware/panels/shelly/wall-display-x2i/) probado con el firmware de fábrica 2.5.4, las opciones para desarrolladores y la depuración USB se desbloquean desde la aplicación Ajustes; después adb se conecta sin solicitud de autorización y no hay root: no existe `su` y `adb root` no está disponible. Allí no se necesita root para instalar la aplicación del panel ni para usarla a diario, pero sí para las funciones privilegiadas de esta página. Los demás modelos no se han probado; el firmware antiguo tiene como base una compilación `userdebug`, por lo que `adb root` podría funcionar si se consigue establecer una conexión adb.

## Antes de cambiar nada

- Consigue que adb funcione de forma fiable, preferiblemente por red y con la clave de tu estación de trabajo preautorizada, antes de desactivar cualquier aplicación del fabricante. Desactivar primero el lanzador, los ajustes o una aplicación de hardware del fabricante puede dejarte sin acceso al panel.
- Conserva una forma de navegar. En los paneles sin botones, las acciones de navegación de la aplicación sustituyen Atrás y Recientes del fabricante.
- Detén el actualizador del fabricante si existe, o una actualización inalámbrica puede revertir tus cambios. Consulta [Detener las actualizaciones no deseadas](/es/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Haz una copia de seguridad de las particiones antes de modificar el firmware de un panel Rockchip con root. Consulta [Copia de seguridad y restauración del firmware](/es/hardware/guides/firmware-backup-and-restore/).
- Algunas vías necesitan `adb disable-verity`, que reinicia el panel. Un panel protegido con PIN no puede volver a iniciar sus aplicaciones tras un reinicio hasta que alguien introduzca el PIN, así que debes estar delante de él.
