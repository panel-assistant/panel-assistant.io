---
title: Asistente de voz
description: Convertir el micrófono del panel en un satélite Assist de Home Assistant, palabras de activación, flujos, anuncios y resolución de problemas.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Un panel con micrófono puede actuar como [satélite Assist](https://www.home-assistant.io/voice_control/) de Home Assistant. Escucha una palabra de activación, transmite tu orden a Home Assistant y reproduce la respuesta por el altavoz del panel. No hay que añadir otro dispositivo: el satélite es una entidad `assist_satellite.<panel>` en el dispositivo que ya tiene el panel en Home Assistant y el audio viaja por la misma conexión que ya utiliza el panel.

:::note
La tarjeta Voz se ofrece cuando el perfil del dispositivo declara un micrófono o cuando Android detecta un micrófono integrado en un panel cuyo perfil no lo especifica. Un micrófono sin verificar debe superar la comprobación de captura del panel antes de empezar a escuchar. Un perfil que declare explícitamente que no hay micrófono no ofrece Voz.
:::

## Activarlo

La voz está activada de forma predeterminada en una instalación nueva cuando el perfil del dispositivo declara un micrófono. Se conservan los ajustes ya guardados. En los demás paneles donde se ofrece la tarjeta Voz, activa **Asistente de voz** para utilizarla. Desactívalo si no quieres que el panel escuche una palabra de activación.

1. Utiliza **Visitar** en la página del dispositivo del panel en Home Assistant y abre **Configurar** (por ejemplo, `http://<panel>:8888/` con el puerto predeterminado).
2. En la tarjeta **Voz**, activa **Asistente de voz**.
3. Marca cada palabra que quieras que escuche el panel en **Palabras de activación**.
4. En **Flujos de palabra de activación**, elige qué flujo de Assist debe utilizar cada palabra marcada.

Con el asistente de voz desactivado, se liberan sus reservas de micrófono y la entidad de satélite aparece como no disponible en Home Assistant. Otra función activada, como el audio ambiental de la cámara, puede seguir utilizando el micrófono.

## Palabras de activación y flujos

El panel incluye cuatro palabras de activación: **Okay Nabu**, **Hey Jarvis**, **Hey Mycroft** y **Alexa**. Puedes activar varias a la vez y asignar a cada una un flujo de Assist diferente, para que una responda en otro idioma o recurra a otro agente de conversación. Dejar una palabra en su opción predeterminada utiliza el flujo que Home Assistant considere preferido en ese momento. Si más adelante se elimina un flujo asignado, esa palabra también vuelve al flujo preferido.

También puedes cambiar las palabras activas desde el propio Home Assistant: los ajustes del satélite, en **Configuración > Asistentes de voz** o en la página del dispositivo del panel, muestran la misma lista y envían los cambios al panel. El flujo de cada palabra se establece en la página Configurar del panel.

La detección de palabras de activación se ejecuta en el panel, no en la nube ni en el servidor de Home Assistant. El panel solo empieza a enviar audio a Home Assistant cuando oye una palabra de activación y únicamente mientras la conversión de voz a texto sigue recibiendo tu orden; deja de enviar en cuanto Home Assistant informa de que la orden ha terminado.

¿Quieres una palabra que no aparece en esta lista? Consulta [Palabras de activación personalizadas](/es/manage/custom-wake-words/).

## Qué muestra el panel

Un breve tono y una onda indican el momento en que el panel oye una palabra de activación. Mientras escucha, piensa o responde, los bordes de la pantalla adquieren un tono suave que pulsa lentamente. El color identifica qué flujo está respondiendo: Panel Assistant asigna un color a cada flujo la primera vez que lo utiliza algún panel y conserva esa asociación, de modo que el mismo flujo tiene el mismo aspecto en todos los paneles de la casa. Aquí no hay nada que configurar.

Si el agente de conversación del flujo hace una pregunta de seguimiento, el panel vuelve a escuchar por sí solo, sin necesidad de repetir la palabra de activación.

## Anuncios e inicio de conversaciones

Una vez activado el asistente de voz, `assist_satellite.announce` pronuncia un mensaje en el panel desde cualquier automatización o script, opcionalmente precedido de un breve tono. `assist_satellite.start_conversation` pronuncia un mensaje inicial y después escucha la respuesta; Home Assistant solo lo permite con un agente de conversación que admita iniciar una conversación por sí mismo, lo que no admite el agente integrado de Home Assistant. Ambos servicios requieren el asistente de voz activado; consulta [Texto a voz](/es/manage/text-to-speech/#reproducir-un-anuncio-con-el-asistente-de-voz-habilitado) para conocer la alternativa REST más sencilla en paneles sin micrófono.

## Varios asistentes en una habitación

Si dos satélites de la misma instancia de Home Assistant oyen la misma frase de activación con menos de dos segundos de diferencia, Home Assistant suprime el duplicado para que solo uno responda. Esto se aplica a todos los satélites de esa instancia, no solo a los paneles de una misma área de Home Assistant, por lo que también abarca un panel y cualquier otro satélite que ya tengas. Si quieres elegir qué dispositivo responde en una habitación compartida, asígnales palabras de activación diferentes.

## Ajustes

La tarjeta Voz incluye algunas opciones de ajuste además de la lista de palabras:

- **Sensibilidad de activación:** Baja, Normal o Alta. Alta reduce el umbral del modelo, de modo que el panel se activa con más facilidad, pero también aumenta la probabilidad de activaciones falsas; Baja requiere una coincidencia más clara antes de activarse.
- **Ganancia del micrófono (dB):** amplifica únicamente el audio enviado a Home Assistant para transcribirlo, nunca el que analiza el detector de la palabra de activación. Auméntala si la palabra activa el panel de forma fiable pero las órdenes desde el otro lado de la habitación se pierden o se entienden mal.
- **Fuente de audio:** la fuente de audio de Android utilizada para capturar el micrófono. Déjala en su valor predeterminado (`voice_recognition`) salvo que te indiquen lo contrario.

## Resolución de problemas

**El panel nunca se activa.** Confirma que **Asistente de voz** esté activado y que la palabra que pronuncias esté marcada en **Palabras de activación**. Prueba **Sensibilidad de activación: Alta** y habla desde donde utilizarías normalmente el panel, no justo al lado del micrófono.

**Se activa, pero no entiende la orden.** Aumenta un poco la **Ganancia del micrófono (dB)** y vuelve a probar; esto solo afecta al audio enviado para transcripción, así que no hará que el panel se active con más facilidad. Si entrenas tu propia palabra, el registro del panel también muestra las detecciones cercanas al umbral con su puntuación, la forma más directa de saber si una palabra no detectada estuvo cerca de activarlo o muy lejos. Consulta [Palabras de activación personalizadas](/es/manage/custom-wake-words/#pruebas-y-ajustes).

**La entidad del satélite aparece como no disponible.** El asistente de voz está desactivado o el panel no está conectado a Home Assistant mediante Panel Assistant. Actívalo desde la página Configurar del panel; no puede activarse desde Home Assistant.
