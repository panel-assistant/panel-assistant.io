---
title: Paquetes del fabricante
description: Impedir de forma reversible que una aplicación intrusiva del fabricante vuelva a iniciarse al arrancar y se superponga al panel de control, solo para los paquetes que elijas.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Una actualización de firmware puede dejar en el panel una aplicación del fabricante que vuelve a iniciarse al arrancar y muestra un widget flotante sobre el panel de control. En el Sonoff NSPanel Pro 120, por ejemplo, una actualización dejó `com.eWeLinkControlPanel` iniciándose al arrancar y superponiendo un widget de control sobre cualquier contenido. La aplicación del panel puede neutralizar paquetes como este, pero solo los que indiques.

## Qué hace

Para cada paquete que restrinjas, la aplicación aplica tres acciones privilegiadas y reversibles, y las repite en cada arranque:

| Paso                             | Mecanismo                                   | Efecto                                                                                    |
| -------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Forzar detención                 | `am force-stop <pkg>`                       | Detiene la aplicación ahora, de modo que su widget desaparece inmediatamente.             |
| Desactivar el inicio al arrancar | `pm disable-user --user 0 <pkg>`            | Impide que vuelva a iniciarse en el siguiente arranque. Reversible con `pm enable <pkg>`. |
| Bloquear superposiciones         | `appops set <pkg> SYSTEM_ALERT_WINDOW deny` | Retira su permiso para dibujar una ventana flotante sobre el panel de control.            |

Las tres acciones son privilegiadas, así que la función necesita **root o el [auxiliar root](https://github.com/panel-assistant/android/blob/main/helper/README.md)**. Por eso también funciona en paneles que aíslan el acceso root, como el [Tuya TPA10](/es/hardware/panels/tuya/tpa10/), donde las acciones pasan por los comandos `STOP`, `DISABLE` y `OVERLAY` del auxiliar.

## Cómo utilizarlo

Se gestiona **en la propia interfaz web del panel**, en la pestaña **Instalar**, no desde Home Assistant. Es algo que haces una vez al configurar el panel o después de actualizar el firmware, no algo que actives a diario, por lo que no pertenece a un panel de control.

Utiliza **Visitar** en la página del dispositivo del panel en Home Assistant, abre **Instalar** y busca la tarjeta **Paquetes del fabricante** (por ejemplo, `http://<panel-ip>:8888/install` con el puerto predeterminado).

Pulsa **Buscar un paquete…** para abrir una lista de aplicaciones del panel que quizá quieras controlar, agrupadas para facilitar la elección:

- **Recomendadas para este panel**: las aplicaciones intrusivas del firmware conocidas para tu hardware, que son las primeras opciones seguras. En un panel con un perfil de hardware conocido, como el NSPanel Pro, aquí aparece `com.eWeLinkControlPanel`. Cada entrada lleva **etiquetas** (por ejemplo, `vendor` para aplicaciones del fabricante del panel, `chipset` para aplicaciones de fábrica y pruebas del fabricante del chip, `overlay`, `boot`) y una breve **nota** del autor del perfil que explica qué es y por qué está marcada, para que puedas distinguir una aplicación de superposición de Sonoff de una aplicación de prueba inofensiva de Rockchip incluida en la imagen.
- **Otras aplicaciones**: aplicaciones del panel que no forman parte de los componentes básicos de Android. En un panel sin un perfil conocido, aquí es donde debes buscar complementos del fabricante con una entrada en el lanzador o permiso de superposición. Si un paquete no aparece en la lista, puedes introducir su nombre directamente.
- **Mayor uso de CPU**: las que más CPU consumen en ese momento. Restringe solo las que reconozcas.

Cada entrada tiene un botón **Controlar**; también puedes escribir directamente el nombre de un paquete si lo conoces. **Controlar** actúa inmediatamente, sin guardar por separado, y vuelve a aplicarse en cada arranque. Un paquete restringido o ya desactivado muestra **Volver a habilitar**, que revierte la acción. La tarjeta solo enumera lo que has restringido, con su estado: `active`, `disabled` o `not installed`.

No se restringe nada hasta que pulses un botón Controlar. Sin root ni el auxiliar, la tarjeta permanece visible pero bloqueada y explica qué acceso falta.

## Seguridad

- **Reversible.** La desactivación se revierte con `pm enable <pkg>` o mediante una actualización de esa aplicación o del firmware. Nada aquí es destructivo: no se desinstala ni se borran datos.
- **Se rechazan los paquetes críticos.** La aplicación del panel nunca detendrá ni desactivará la interfaz del sistema, Ajustes, telefonía, el framework de Android ni a sí misma, aunque indiques sus nombres. Tanto la aplicación como el auxiliar privilegiado imponen esta protección, de modo que un error de escritura no inutilice el panel.
- **Solo se modifican los paquetes instalados que indiques.** Quitar de la lista deseada un paquete gestionado por la aplicación lo vuelve a habilitar y restaura su permiso de superposición guardado. **Volver a habilitar** también revierte la restricción.

:::caution
Estás eligiendo qué paquetes desactivar, así que limita la selección a software del fabricante que reconozcas. Desactivar algo de lo que depende el panel, como un lanzador del fabricante que utilices o un método de entrada, puede dificultar la navegación hasta que lo vuelvas a habilitar por `adb`. En caso de duda, déjalo como está.
:::
