---
title: Brillo adaptativo
description: Deja que el panel aprenda la iluminación de su habitación y ajuste por sí mismo el brillo de la pantalla, sin ninguna automatización de Home Assistant.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

El brillo adaptativo es un controlador opcional del panel que aprende el patrón normal de luz ambiental a su alrededor y ajusta la pantalla sin ninguna automatización de Home Assistant. Está desactivado de forma predeterminada, y el control habitual del brillo, manual o mediante Home Assistant, está disponible tanto si está activado como si está desactivado.

![La pestaña Configurar de la interfaz web del panel, con la tarjeta Pantalla que muestra la fuente de luz ambiental, Brillo automático, Nivel mínimo, Sensibilidad y el gráfico diario de aprendizaje de luz ambiental](/screenshots/ui-configure-dark.png)

## Elige la fuente de luz

Abre **Configurar**, después **Pantalla**, y elige **Fuente de luz ambiental**:

- Déjalo en blanco para usar el sensor de luz del propio panel, cuando tanto el perfil de hardware activo como la comprobación de capacidades en tiempo real del panel indiquen que hay uno disponible.
- Selecciona una entidad de iluminancia de Home Assistant cuando el panel no tenga un sensor propio adecuado, o cuando un sensor situado en otro lugar de la habitación represente mejor la luz que las personas ven realmente.

Una fuente de Home Assistant se lee mediante una única suscripción a esa entidad concreta, en lugar de a través del flujo completo de estados. Si ninguna de las dos fuentes está disponible, la aplicación del panel deja el control adaptativo no disponible en lugar de hacer estimaciones a partir de la hora del día.

Cuando la fuente es una entidad de iluminancia de Home Assistant, el panel puede inicializar su patrón aprendido con hasta siete días del historial existente de esa entidad. Esto proporciona al brillo automático un punto de partida útil, sin tener que esperar a que se acumulen nuevas lecturas. Para ello, es necesario que se registren los datos de la entidad y que el servicio de historial de Home Assistant esté disponible; si no se obtiene ningún historial utilizable, el aprendizaje simplemente comienza con las nuevas lecturas.

## Actívalo y ajústalo

Activa **Brillo automático** en la misma tarjeta Pantalla. El controlador conserva en el panel hasta siete días de historial de luz ambiental y aprende el patrón normal de cada momento del día. Un aumento breve por encima de ese patrón, como el que se produce al encender una luz de la habitación, puede elevar el nivel propuesto por encima del nivel de referencia.

**Nivel mínimo** establece el nivel más bajo que propondrá el control automático y reescala el rango aprendido entre **Nivel mínimo** y **Nivel máximo**. Su rango va del 4% al 99%. El límite inferior del 4% corresponde al mínimo de la propia retroiluminación (nunca se apaga), por lo que cualquier valor inferior movería el control sin cambiar la pantalla. No limita el brillo manual, que se puede seguir ajustando a un nivel inferior.

**Nivel máximo** limita el brillo automático, del 5% al 100%, por encima del mínimo seleccionado. No limita el brillo manual.

**Sensibilidad** determina qué proporción de la diferencia respecto al patrón aprendido se aplica a la pantalla, una vez que el controlador ha decidido que la diferencia es real. Al 0%, ignora la diferencia y utiliza únicamente el patrón aprendido. Los valores más bajos ofrecen una respuesta más estable, y el valor predeterminado del 50% deja el mismo margen de ajuste en ambos sentidos. No es un control que siga directamente la luz: solo responde a un aumento breve de la iluminación cuando este ha durado lo suficiente o ha sido lo bastante brusco como para tenerse en cuenta. Durante el calentamiento inicial, la pantalla sigue la luz medida suavizada independientemente de Sensibilidad; el ajuste entra en vigor mientras el modelo continúa aprendiendo.

El gráfico de siete días ofrece una vista previa del rango observado, el nivel de referencia aprendido y el nivel propuesto, antes de que el controlador esté activo o mientras lo está. Los cambios sin guardar en Nivel mínimo, Nivel máximo y Sensibilidad se muestran en la vista previa sin reescribir el historial almacenado.

El historial está asociado a la fuente seleccionada y a un contexto aproximado de habitación y tiempo obtenido de la ubicación y la zona horaria de Home Assistant. Un cambio significativo de ubicación, zona horaria o fuente inicia un historial independiente, en lugar de aplicar sin avisar lo aprendido en otro contexto.

## Cambios manuales y recuperación

Un cambio manual de brillo registra una preferencia temporal durante cuatro horas, para que el controlador no contrarreste de inmediato a la persona que lo cambió. Los cambios automáticos comienzan con una influencia del 20% y recuperan el control total a medida que la preferencia se desvanece suavemente durante cuatro horas. Selecciona **Reanudar modo totalmente automático** para poner fin a la preferencia de inmediato en lugar de esperar a que se desvanezca.

Selecciona **Restablecer historial aprendido** después de mover el panel, cambiar su fuente de luz o cuando la última semana ya no represente la habitación. Tras la confirmación, elimina los siete días de historial de luz ambiental de la fuente y el contexto actuales y comienza a aprender de nuevo. No cambia la fuente seleccionada ni el ajuste de Brillo automático.

El brillo adaptativo utiliza el ajuste normal de brillo de pantalla de Android y no necesita root. La lectura del sensor de luz de un panel concreto puede seguir dependiendo de cómo se acceda a ese sensor en ese hardware; lo determinan el perfil activo y la comprobación de capacidades en tiempo real.

## Control desde Home Assistant

Cuando el panel lo expone, `switch.<panel>_auto_brightness` activa y desactiva el mismo controlador. El brillo de la pantalla sigue en `light.<panel>_screen`, por lo que un cambio de brillo desde Home Assistant crea la misma preferencia temporal que un cambio en el panel. Usa **Reanudar modo totalmente automático** en la página Configurar para volver directamente al nivel aprendido.
