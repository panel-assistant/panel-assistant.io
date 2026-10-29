---
title: Referencia
description: Referencia técnica de la aplicación del panel, sus entidades de Home Assistant, los perfiles de dispositivo, la seguridad y cómo compilarla.
sidebar:
  label: Resumen
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Estas páginas documentan el funcionamiento interno de la aplicación del panel: las interfaces que expone, el formato de perfil que describe cada modelo y las decisiones de seguridad de ambos. No necesitas consultarlas para instalar ni utilizar Panel Assistant.

## Interfaces

- [Referencia de control y Home Assistant](/es/reference/api/): las entidades y los servicios que automatizan un panel, y sus páginas y puntos de acceso en el puerto HTTP (8888 de forma predeterminada).
- [Seguridad](/es/reference/security/): el modelo de confianza, la superficie de ataque y las decisiones adoptadas.

## Perfiles de dispositivo

- [Perfiles de panel en tiempo de ejecución](/es/reference/profiles/): qué es un perfil y cómo escribirlo, probarlo y activarlo.
- [Formato y compatibilidad de los perfiles](/es/reference/profiles/format/): referencia completa de los campos del esquema 2.
- [Pruebas y resolución de problemas de los perfiles](/es/reference/profiles/testing/): una secuencia gradual de pruebas de hardware y pasos de recuperación.
- [Compartir y contribuir perfiles](/es/reference/profiles/sharing/): procedencia, intercambio seguro y requisitos de inclusión.
- [Arquitectura de los perfiles de dispositivo](/es/reference/profiles/architecture/): cómo la aplicación resuelve, compara y activa los perfiles.
- [Perfiles de panel de la comunidad](/es/reference/profiles/community/): perfiles para paneles que la aplicación no incluye.
  - [Echo Show 5 Gen 2 (LineageOS)](/es/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/es/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/es/reference/profiles/community/sunworld-yc-sm55p/)

## El código

- [Entorno de desarrollo](/es/reference/development-environment/): las herramientas, los scripts de compilación y lo que debe saber un fork sobre la firma.
- [Recorrido por el código en DeepWiki](https://deepwiki.com/panel-assistant/android): una visita guiada al código fuente de ha-paneld.
