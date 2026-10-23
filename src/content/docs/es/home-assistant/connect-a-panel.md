---
title: Conectar un panel
description: Cómo poner tu panel de control en el panel y cómo aparece el hardware del propio panel en Home Assistant.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Un panel que se ha añadido a Home Assistant se conecta a él de dos formas. Una coloca un panel de control en la pantalla. La otra incorpora el hardware del propio panel como entidades.

## El panel de control en la pantalla

Eliges el panel de control en el asistente de configuración del panel al añadirlo. Para cambiarlo después, abre la página de estado del panel en tu navegador, en su dirección y el puerto 8888, y elige otro. El panel carga ese panel de control por sí mismo. Con el [filtrado de entidades habilitado](/es/manage/performance/), aprende qué entidades utiliza el panel de control y solicita a Home Assistant solo esas. Los detalles de cómo se carga el panel de control y qué hace el panel si no se carga están en la página del [motor de renderizado integrado](/es/manage/built-in-renderer/).

## El hardware del panel en Home Assistant

La pantalla, los LED, botones, sensores y relés que tenga tu modelo aparecen en Home Assistant como entidades del dispositivo del panel, de modo que un botón físico puede activar una automatización y un LED puede mostrar el estado de cualquier elemento. Las entidades disponibles dependen del perfil de hardware del modelo; las [páginas de hardware](/es/hardware/) indican qué expone cada panel.

## La página de estado del panel

Cada panel ofrece su propia página en tu red local, en el puerto 8888. En ella eliges el panel de control, ves qué está haciendo el panel y lees su informe de diagnóstico. Está diseñada para una red doméstica de confianza, así que trata el acceso a ella igual que el acceso al propio panel. La [referencia de la API](/es/reference/api/) y el [modo de seguridad](/es/manage/security-mode/) explican qué ofrece y su modelo de confianza.
