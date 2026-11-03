---
title: Panel Assistant es obligatorio
description: Qué hacer cuando un panel indica que Panel Assistant es obligatorio y cómo pasar de una aplicación de panel 0.9 a Panel Assistant 1.0.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Un panel que muestra **Panel Assistant es obligatorio** junto con la dirección de esta página ejecuta una aplicación de panel 0.9 que aún no se ha conectado a la integración Panel Assistant en Home Assistant. Tu elección de panel de control y la configuración del panel siguen en el panel. No necesitas reinstalarlo ni restablecerlo.

Panel Assistant 1.0 no puede hacerse cargo de un panel que aún ejecuta la antigua aplicación ha-paneld o cuyas entidades de hardware aún usan MQTT. Un panel en ese estado pasa a 1.0 a través de Panel Assistant 0.9.0, que primero lo migra:

1. [Instala la integración Panel Assistant a través de HACS](/es/home-assistant/custom-integration/). Si tu panel aún ejecuta la antigua aplicación o usa MQTT, elige la versión **0.9.0** antes del primer reinicio; si ya tienes Panel Assistant 1.0, sigue las indicaciones de [si una migración no se completó](/es/manage/upgrade-to-1-0/#si-una-migración-quedó-sin-terminar) antes de cambiar de versión. Reinicia Home Assistant cuando HACS te lo pida.
2. Si tu panel ya aparece en **Configuración → Dispositivos y servicios → Panel Assistant**, no hay nada que añadir de nuevo. De lo contrario, añade allí tu **panel existente** usando su nombre de host o su dirección; esto no es una instalación de un panel nuevo.
3. Abre **Configuración → Reparaciones**. Si Panel Assistant indica que el panel aún ejecuta la antigua aplicación ha-paneld, sigue su Reparación para migrar el panel a la aplicación Panel Assistant. Si las entidades de hardware del panel aún usan MQTT, [migrar un panel desde MQTT](/es/home-assistant/move-from-mqtt/) explica ese traspaso, que 0.9.0 completa.
4. Si instalaste 0.9.0, actualiza a 1.0 cuando ya no muestre ninguna migración para ninguno de tus paneles, como se describe en [actualizar a 1.0](/es/manage/upgrade-to-1-0/).

Para obtener ayuda para encontrar la dirección de tu panel o comprobar su conexión, consulta [Conectar un panel](/es/home-assistant/connect-a-panel/) y [Solución de problemas](/es/manage/troubleshooting/).
