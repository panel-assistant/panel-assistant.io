---
title: Actualizar a 1.0
description: Migrar Home Assistant y tus paneles de Panel Assistant 0.9 a 1.0 y qué implica volver atrás.
sourceCommit: 45ad784a56e8c07917f0c76636d2b389a610b982
---

Panel Assistant 1.0 y la aplicación del panel 1.0 avanzan juntos. La integración 1.0 solo se comunica con la aplicación del panel 1.0, y esta solo se comunica con la integración 1.0, así que ninguno funciona con una versión 0.9 del otro. Primero actualizas la integración y después cada panel desde Home Assistant; **un panel que ejecuta la aplicación 1.0 no puede volver a 0.9**. Lee toda la página antes de empezar. Las [notas de la versión 1.0.0](/es/release-notes/#panel-assistant-100) enumeran todos los cambios.

## Antes de empezar

**Termina todo lo que deba hacer 0.9.0.** Ejecuta Panel Assistant **0.9.0** y abre **Configuración**, **Reparaciones**. Panel Assistant 1.0 ya no puede migrar un panel desde MQTT ni desde la antigua aplicación ha-paneld, así que deja ambos casos sin cambios. Si 0.9.0 muestra cualquiera de ellos para alguno de tus paneles, sigue su reparación hasta completar la migración; [Migrar un panel desde MQTT](/es/home-assistant/move-from-mqtt/) explica la parte de MQTT. Si utilizas una versión de Panel Assistant anterior a 0.9.0, actualiza primero a 0.9.0 y deja que termine.

**Haz una copia de seguridad de Home Assistant.** En **Configuración**, **Sistema**, **Copias de seguridad**, crea una copia y consérvala hasta que todos los paneles ejecuten 1.0 y estés satisfecho con su funcionamiento. Es tu vía para volver atrás en el lado de Home Assistant.

**Conserva una copia de seguridad de cada panel.** En la interfaz web de cada panel, abre **Instalar**, después **Copia de seguridad**, y guarda el archivo `.hpb` descargado. Panel Assistant también guarda los ajustes del panel antes de cada actualización, pero tu propia copia es la que puedes restaurar tú mismo.

## 1. Actualizar la integración

En Home Assistant **2026.11 o posterior**, instala la actualización de Panel Assistant desde **Configuración**, **Actualizaciones**. En versiones anteriores compatibles, de **2026.8.3 a 2026.10**, descarga la actualización en HACS. Después reinicia Home Assistant para cargar la nueva integración, siguiendo la reparación de reinicio o la indicación de HACS. [Instalar la integración](/es/home-assistant/custom-integration/#updates) explica las actualizaciones a través de Marketplace o HACS.

## 2. Comprobar las reparaciones

Después del reinicio, vuelve a abrir **Configuración**, **Reparaciones**.

- **«… necesita la aplicación …»** es normal en todos los paneles que aún ejecutan una aplicación 0.9. Hasta que se actualicen, Home Assistant no puede verlos ni controlarlos y sus entidades aparecen como no disponibles. El propio panel sigue funcionando con sus ajustes y su historial.
- **«… no puede recibir actualizaciones de la aplicación»** significa que Panel Assistant no tiene una vía para instalar en ese panel, normalmente tras un cambio realizado en el propio panel, como una actualización de firmware o un restablecimiento. Vuelve a conectar el panel a Panel Assistant por USB, como describe **Más información** de la reparación, y la actualización estará disponible. No se elimina nada: en un panel que ya tiene la aplicación, el instalador USB no instala nada y solo permite que Panel Assistant vuelva a acceder a él.
- **«… nunca se migró desde MQTT»** o **«… todavía ejecuta la aplicación antigua»** significa que una migración no terminó en 0.9.0. Consulta [Si una migración quedó sin terminar](#si-una-migración-quedó-sin-terminar).

## 3. Actualizar un panel y después los demás

La entidad de actualización de cada panel en Home Assistant ofrece la última aplicación del panel 1.0. Instálala primero en un panel y úsalo durante un tiempo antes de instalarla en los demás, porque ese panel no podrá volver atrás. Panel Assistant guarda una copia de los ajustes, instala la actualización y confirma que el panel vuelve a funcionar correctamente, como se describe en [Actualizaciones y recuperación](/es/manage/updates-and-recovery/). Se conservan los ajustes de la aplicación del panel 0.9.

## Volver atrás

Hay dos partes y son diferentes.

**Un panel con la aplicación 1.0 permanece en 1.0.** La aplicación del panel rechaza instalar una versión anterior sobre sí misma, Panel Assistant nunca la ofrece y una integración 0.9 no puede comunicarse con ella. Si un panel 1.0 funciona mal, consulta [Resolución de problemas](/es/manage/troubleshooting/) y después informa del problema con un [informe de soporte](/es/home-assistant/support-report/) para que pueda corregirse en una versión futura.

**La integración puede volver atrás mientras ningún panel ejecute 1.0.** Restaura la copia de seguridad de Home Assistant que hiciste antes de empezar. Esto también deshace cualquier otro cambio realizado en Home Assistant desde que la creaste. Tus paneles siguen usando la aplicación 0.9 y vuelven a conectarse a 0.9.0. En cuanto algún panel ejecuta la aplicación 1.0, restaurar la copia deja ese panel fuera del alcance de Home Assistant hasta que la integración vuelva a 1.0.

No vuelvas atrás instalando 0.9.0 sobre 1.0 mediante Marketplace o HACS. La actualización a 1.0 elimina un ajuste del que depende 0.9.0 y, sin él, 0.9.0 devuelve a MQTT los paneles que ya se habían migrado, donde la aplicación del panel 1.0 ya no responde. Restaura la copia de seguridad en su lugar.

## Si una migración quedó sin terminar

Si 1.0 indica que un panel nunca se migró desde MQTT o aún ejecuta la aplicación antigua, sigue los pasos de recuperación segura de la reparación para terminar la migración con Panel Assistant 0.9.0 y después volver a 1.0. No instales 0.9.0 sobre 1.0 mediante Marketplace o HACS. Mientras ninguno de tus paneles ejecute todavía la aplicación 1.0, vuelve a 0.9.0 restaurando la copia de seguridad de Home Assistant que hiciste antes de actualizar, por el motivo anterior. Después termina la migración en 0.9.0 y vuelve a empezar esta página. Si otros paneles ya ejecutan la aplicación 1.0, o no tienes una copia de seguridad anterior a la actualización, pregunta en [Discord](https://panel-assistant.io/go/discord) o en las [incidencias](https://github.com/panel-assistant/ha-integration/issues) antes de cambiar nada.

Para un panel que aún utiliza MQTT, la reparación también ofrece empezar desde cero: elimina el dispositivo del panel de la integración MQTT y vuelve a añadirlo. Esto crea entidades nuevas y no conserva su historial.
