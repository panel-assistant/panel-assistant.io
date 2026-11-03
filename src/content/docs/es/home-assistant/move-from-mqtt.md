---
title: Migrar un panel desde MQTT
description: Transferir las entidades de un panel de la integración MQTT de Home Assistant a Panel Assistant, conservando sus ID de entidad, historial y personalizaciones.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Panel Assistant 1.0 utiliza la conexión nativa de Home Assistant y no es compatible con MQTT. Si las entidades de tu panel todavía utilizan MQTT, ejecuta primero Panel Assistant **0.9.0** para que pueda completar la migración conservando los ID de entidad, el historial y las personalizaciones. Si ya has actualizado a 1.0, sigue las indicaciones de [si una migración no se completó](/es/manage/upgrade-to-1-0/#si-una-migración-quedó-sin-terminar) antes de cambiar de versión.

La guía paso a paso que aparece a continuación contiene instrucciones históricas para Panel Assistant de la versión 0.3 a la 0.8. Su opción **Control** no está presente en 1.0.

Migras un panel cada vez, y cada migración se puede revertir. Las entidades del panel conservan sus ID de entidad, su historial y cualquier nombre, icono o área que les hayas asignado, por lo que los paneles de control y las automatizaciones que las utilizan siguen funcionando.

:::caution[Acceso anticipado]
La migración es nueva. Pruébala primero en un panel y cuéntanos cómo ha ido en [Discord](https://panel-assistant.io/go/discord) o en las [incidencias](https://github.com/panel-assistant/ha-integration/issues).
:::

## Antes de empezar

- **Panel Assistant de la versión 0.3.0 a la 0.8** en Home Assistant, instalado mediante HACS como se describe en [Instalar la integración](/es/home-assistant/custom-integration/).
- **ha-paneld 0.9.8-rc1 o posterior** en el panel. Instala una actualización disponible desde la entidad de actualización de Panel Assistant del panel en Home Assistant. Si necesitas una versión preliminar que no se ofrece allí, selecciónala en la pestaña **Instalar** de la interfaz web del panel e inicia tú mismo la instalación.
- **El panel ha iniciado sesión en Home Assistant**, lo cual se cumple si muestra tu panel de control.
- **Deja tu configuración MQTT tal como está.** El panel sigue utilizando el broker durante la migración y no es necesario cambiar nada en él.

## 1. Habilitar las entidades de Panel Assistant

Añade esto a `configuration.yaml` y después reinicia Home Assistant:

```yaml
panel_assistant:
  native_entities: true
```

Todavía no se migra nada. Cada panel que Panel Assistant conoce obtiene un segundo conjunto de entidades en su dispositivo de Panel Assistant, junto a las de MQTT, para poder comparar ambos conjuntos. Cuando migras un panel, sus entidades MQTT sustituyen a este segundo conjunto.

## 2. Añadir el panel a Panel Assistant

Omite este paso si el panel ya aparece en Panel Assistant en **Configuración**, **Dispositivos y servicios**.

Elige **Añadir integración**, después **Panel Assistant** y luego **Añadir un panel**, e introduce el nombre de host o la dirección del panel. Panel Assistant detecta que ha-paneld ya está en ejecución y ofrece **Conectar a Home Assistant**. No se reinstala nada en el panel.

## 3. Confirmar el usuario del panel

Cuando el panel se conecta por primera vez, Home Assistant muestra una reparación: **Confirmar el usuario de Home Assistant para** tu panel. Ábrela desde **Configuración**, **Reparaciones**, comprueba que el usuario indicado sea la cuenta con la que el panel inicia sesión y confirma.

El panel vuelve a intentarlo por sí solo, por lo que la reparación puede tardar hasta 15 minutos en aparecer, y el panel puede tardar otro tanto en conectarse después de que confirmes.

## 4. Migrar el panel

Abre la entrada de Panel Assistant del panel en **Dispositivos y servicios**, elige **Configurar**, establece **Control** en **Panel Assistant** y guarda.

La entrada se recarga y el panel vuelve a conectarse. Sus entidades MQTT se migran a Panel Assistant y, una vez que el panel ha confirmado la migración, se elimina el dispositivo MQTT del panel. Es normal que las entidades aparezcan como no disponibles durante unos segundos y otra vez unos 30 segundos después, mientras el proceso se estabiliza. El registro de actividad del dispositivo se llena de cambios de estado a medida que cada entidad comunica su estado; es lo esperado.

A partir de ahora, cambiar un ajuste o pulsar un botón en las entidades del panel se realiza a través de Panel Assistant. Antes de migrar un panel, esos mismos controles responden que el panel se controla a través de MQTT.

### Qué no se migra

Dos botones MQTT no tienen equivalente en Panel Assistant, **Update ha-paneld** y **Update Companion app**, por lo que se eliminan, junto con cualquier entidad de actualización MQTT de ha-paneld que aún quede. Utiliza la entidad de actualización de Panel Assistant del panel para actualizar la aplicación del panel.

Si has asignado a alguno de ellos un nombre, icono o área personalizados, o lo has ocultado o deshabilitado, Panel Assistant no lo eliminará por ti. En su lugar, una reparación lo incluye en su lista, y el panel conserva sus entidades MQTT hasta que elimines esa entidad o borres esos ajustes.

## Revertir la migración de un panel

Abre **Configurar** de nuevo y establece **Control** en **MQTT, con informes nativos para comparar**, o en **MQTT**. Las entidades vuelven a la integración MQTT con los mismos ID de entidad e historial, y el panel vuelve a anunciar su dispositivo MQTT.

Revierte siempre la migración de un panel de esta forma. No elimines la entrada de Panel Assistant de un panel mientras Panel Assistant lo controla: Home Assistant elimina las entidades de esa entrada como parte de la eliminación y, aunque Panel Assistant las devuelve primero, una entidad personalizada puede perder su nombre, icono o área durante el proceso.

## Limitaciones conocidas

- **Algunos sensores siguen sin estar disponibles.** Un panel puede ofrecer entidades para sensores cuyos datos no comunica su hardware, como proximidad, temperatura o humedad. Son entidades nuevas de Panel Assistant, no entidades migradas, por lo que no se pierde nada al deshabilitarlas.
- **ha-paneld antiguo en un panel migrado.** Si posteriormente se instala en un panel migrado una versión anterior a 0.9.8-rc1, este vuelve a anunciar sus entidades MQTT. Panel Assistant deshabilita los duplicados y genera una reparación, **Actualiza ha-paneld**, que desaparece una vez que se actualiza el panel.
- **Avisos de reinicio.** Mientras Home Assistant se reinicia, un panel cuya cuenta no es de administrador sigue recibiendo el aviso a través de MQTT, lo que supone un motivo más para dejar el broker en ejecución por ahora.
