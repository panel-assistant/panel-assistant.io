---
title: Conectar un panel
description: Cómo mostrar el panel de control en la pantalla y cómo aparece el hardware del panel en Home Assistant.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Un panel añadido a Home Assistant se conecta de dos formas. Una muestra un panel de control en la pantalla. La otra incorpora el hardware del propio panel como entidades.

## El panel de control en la pantalla

Eliges el panel de control en el asistente de configuración al añadir el panel. Para cambiarlo más adelante, selecciona **Visitar** en la página del dispositivo del panel en Home Assistant para abrir su página de estado y elige otro. El propio panel carga ese panel de control. Con el [filtrado de entidades activado](/es/manage/performance/), aprende qué entidades utiliza y solicita a Home Assistant únicamente esas entidades. La página sobre el [renderizador integrado](/es/manage/built-in-renderer/) explica cómo se carga y qué hace el panel si la carga falla.

## El hardware del panel en Home Assistant

La pantalla, los LED, los botones, los sensores y los relés de tu modelo aparecen en Home Assistant como entidades del dispositivo del panel, de modo que un botón físico puede activar una automatización y un LED puede mostrar cualquier estado. Las entidades disponibles dependen del perfil de hardware del modelo; las [páginas de hardware](/es/hardware/) indican qué expone cada panel.

## La página de estado del panel

Selecciona **Visitar** en la página del dispositivo del panel en Home Assistant para abrir su página de estado. Cada panel sirve esta página en tu red local, en el puerto **8888** de forma predeterminada (por ejemplo, `http://<panel>:8888/`). Allí eliges el panel de control, ves qué está haciendo el panel y lees su informe de diagnóstico. Está diseñada para una red doméstica de confianza, así que trata el acceso a ella igual que el acceso al propio panel. La [referencia de la API](/es/reference/api/) y el [modo de seguridad](/es/manage/security-mode/) explican sus funciones y su modelo de confianza.
