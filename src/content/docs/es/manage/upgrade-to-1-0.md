---
title: Actualizar a 1.0
description: Migrar Home Assistant y tus paneles de Panel Assistant 0.9 a 1.0 y qué implica volver atrás.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0 y la aplicación del panel 1.0 avanzan juntos. La integración 1.0 solo se comunica con la aplicación del panel 1.0, y esta solo se comunica con la integración 1.0, así que ninguno funciona con una versión 0.9 del otro. Primero actualizas la integración y después cada panel desde Home Assistant; **un panel que ejecuta la aplicación 1.0 no puede volver a 0.9**. Lee toda la página antes de empezar.

## Antes de empezar

**Termina todo lo que deba hacer 0.9.0.** Ejecuta Panel Assistant **0.9.0** y abre **Ajustes**, **Reparaciones**. Panel Assistant 1.0 ya no puede migrar un panel desde MQTT ni desde la antigua aplicación ha-paneld, así que deja ambos casos sin cambios. Si 0.9.0 muestra cualquiera de ellos para alguno de tus paneles, sigue su reparación hasta completar la migración; [Migrar un panel desde MQTT](/es/home-assistant/move-from-mqtt/) explica la parte de MQTT. Si utilizas una versión de Panel Assistant anterior a 0.9.0, actualiza primero a 0.9.0 y deja que termine.

**Haz una copia de seguridad de Home Assistant.** En **Ajustes**, **Sistema**, **Copias de seguridad**, crea una copia y consérvala hasta que todos los paneles ejecuten 1.0 y estés satisfecho con su funcionamiento. Es tu vía para volver atrás en el lado de Home Assistant.

**Conserva una copia de seguridad de cada panel.** En la interfaz web de cada panel, abre **Instalar**, después **Copia de seguridad**, y guarda el archivo `.hpb` descargado. Panel Assistant también guarda los ajustes del panel antes de cada actualización, pero tu propia copia es la que puedes restaurar tú mismo.

## 1. Actualizar la integración

1.0 se ofrece primero como versión candidata. Abre **Ajustes**, **Dispositivos y servicios**, **HACS** y elige el dispositivo **Panel Assistant**. Despliega las entidades deshabilitadas y abre **Versión preliminar**. En sus ajustes, activa **Habilitado** y selecciona **Actualizar**; después activa el interruptor **Versión preliminar** en **Diagnóstico**. Vuelve a Panel Assistant en HACS y descarga la versión candidata de 1.0. Reinicia Home Assistant cuando HACS lo solicite o cuando aparezca la reparación **Reinicia Home Assistant para terminar de actualizar Panel Assistant**.

## 2. Comprobar las reparaciones

Después del reinicio, vuelve a abrir **Ajustes**, **Reparaciones**.

- **«… necesita la aplicación 1.0.0-rc1»** es normal en todos los paneles que aún ejecutan una aplicación 0.9. Hasta que se actualicen, Home Assistant no puede verlos ni controlarlos y sus entidades aparecen como no disponibles. El propio panel sigue funcionando con sus ajustes y su historial.
- **«… no puede recibir actualizaciones de la aplicación»** significa que Panel Assistant no tiene una vía para instalar en ese panel, normalmente tras un cambio realizado en el propio panel, como una actualización de firmware o un restablecimiento. Vuelve a conectar el panel a Panel Assistant por USB, como describe **Más información** de la reparación, y la actualización estará disponible. No se elimina nada: en un panel que ya tiene la aplicación, el instalador USB no instala nada y solo permite que Panel Assistant vuelva a acceder a él.
- **«… nunca se migró desde MQTT»** o **«… todavía ejecuta la aplicación antigua»** significa que una migración no terminó en 0.9.0. Consulta [Si una migración quedó sin terminar](#si-una-migración-quedó-sin-terminar).

## 3. Actualizar un panel y después los demás

Cuando se publique la versión de la aplicación del panel 1.0, la entidad de actualización de cada panel en Home Assistant la ofrecerá. Instálala primero en un panel y úsalo durante un tiempo antes de instalarla en los demás, porque ese panel no podrá volver atrás. Panel Assistant guarda una copia de los ajustes, instala la actualización y confirma que el panel vuelve a funcionar correctamente, como se describe en [Actualizaciones y recuperación](/es/manage/updates-and-recovery/). Se conservan los ajustes de la aplicación del panel 0.9.

## Volver atrás

Hay dos partes y son diferentes.

**Un panel con la aplicación 1.0 permanece en 1.0.** La aplicación del panel rechaza instalar una versión anterior sobre sí misma, Panel Assistant nunca la ofrece y una integración 0.9 no puede comunicarse con ella. Si un panel 1.0 funciona mal, consulta [Resolución de problemas](/es/manage/troubleshooting/) y después informa del problema con un [informe de soporte](/es/home-assistant/support-report/) para que pueda corregirse en la siguiente versión candidata.

**La integración puede volver atrás mientras ningún panel ejecute 1.0.** Restaura la copia de seguridad de Home Assistant que hiciste antes de empezar. Esto también deshace cualquier otro cambio realizado en Home Assistant desde que la creaste. Tus paneles siguen usando la aplicación 0.9 y vuelven a conectarse a 0.9.0. En cuanto algún panel ejecuta la aplicación 1.0, restaurar la copia deja ese panel fuera del alcance de Home Assistant hasta que la integración vuelva a 1.0.

No vuelvas atrás descargando de nuevo 0.9.0 en HACS sobre 1.0. La actualización a 1.0 elimina un ajuste del que depende 0.9.0 y, sin él, 0.9.0 devuelve a MQTT los paneles que ya se habían migrado, donde la aplicación del panel 1.0 ya no responde. Restaura la copia de seguridad en su lugar.

## Si una migración quedó sin terminar

Si 1.0 indica que un panel nunca se migró desde MQTT o todavía ejecuta la aplicación antigua, la reparación te pide que elijas **Volver a descargar** en HACS, selecciones 0.9.0, termines la migración allí y después instales de nuevo 1.0. No descargues de nuevo 0.9.0 sobre 1.0. Mientras ninguno de tus paneles ejecute todavía la aplicación 1.0, vuelve a 0.9.0 restaurando la copia de seguridad de Home Assistant que hiciste antes de actualizar, por el motivo anterior. Después termina la migración en 0.9.0 y vuelve a empezar esta página. Si otros paneles ya ejecutan la aplicación 1.0, o no tienes una copia de seguridad anterior a la actualización, pregunta en [Discord](https://panel-assistant.io/go/discord) o en las [incidencias](https://github.com/panel-assistant/ha-integration/issues) antes de cambiar nada.

Para un panel que aún utiliza MQTT, la reparación también ofrece empezar desde cero: elimina el dispositivo del panel de la integración MQTT y vuelve a añadirlo. Esto crea entidades nuevas y no conserva su historial.
