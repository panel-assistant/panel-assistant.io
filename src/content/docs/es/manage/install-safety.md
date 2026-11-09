---
title: Seguridad de la instalación
description: Qué comprueba Panel Assistant antes de modificar un panel, por qué es seguro repetir una instalación interrumpida y qué respalda antes de una actualización.
sourceCommit: 761d6a72fee28ab8639a6dca9fa60452d2cb5ff7
---

Panel Assistant instala y actualiza paneles desde Home Assistant, y está diseñado para que una instalación dé el mismo resultado tanto si se ejecuta una vez como si se repite tras una interrupción. Esta página explica qué comprueba y qué conserva.

## Comprobaciones antes de cambiar nada

Ambos instaladores examinan el panel antes de modificarlo. El instalador de red comprueba qué hay ya en el panel y te pide que confirmes la instalación; si el panel ya ejecuta la aplicación del panel, lo adopta en lugar de reinstalarla. El instalador USB no sobrescribe otra instalación existente: si ya está instalada exactamente la compilación seleccionada, termina su configuración; si hay otra compilación instalada, vuelve a conectarla a Panel Assistant sin instalar una actualización.

La versión procede de tu propio Home Assistant. Home Assistant la comprueba antes de entregársela al instalador, así que nada llega al panel sin que Home Assistant lo haya verificado. [Instalar por USB](/es/install/install-over-usb/) y [Añadir un panel](/es/install/installing-ha-paneld/) describen cada vía.

## Es seguro volver a ejecutarla

Puedes repetir una instalación que se detiene a medias. Por USB, el instalador guarda el progreso en tu navegador, comprueba el paso interrumpido antes de hacer nada más y continúa desde ahí en lugar de empezar de nuevo. Por red, añadir de nuevo el panel con la misma dirección hace que Home Assistant vuelva a comprobarlo antes de cambiar nada; si la aplicación del panel ya está instalada, Home Assistant la conecta y no instala nada.

Cuando Home Assistant no puede determinar hasta dónde llegó la instalación, se detiene en lugar de adivinar y lo indica en su mensaje. La [resolución de problemas](/es/manage/troubleshooting/#una-instalación-por-red-se-detuvo-a-mitad-del-proceso) explica cada mensaje y qué hacer después.

## Copia de seguridad antes de cada actualización

Panel Assistant hace una copia de seguridad de los ajustes del panel antes de cada actualización y conserva las últimas cinco copias de cada panel. Después de actualizar, confirma que el panel vuelve a funcionar correctamente.

Antes de un cambio que te genere dudas, y siempre antes de eliminar la aplicación o borrar sus datos, haz tú mismo una copia de seguridad completa: en la interfaz web del panel, abre **Instalar**, después **Copia de seguridad**, y comprueba que el archivo `.hpb` descargado no esté vacío. Incluye los ajustes, el estado persistente del panel, el catálogo de perfiles y un inicio de sesión compatible guardado por una aplicación de panel de control independiente. El catálogo de entidades aprendido y los historiales de proximidad y ambiente vuelven a aprenderse en lugar de restaurarse. Restaura la copia desde **Instalar**, después **Restaurar**, en la misma página.

## Lo que Panel Assistant deja intacto

Panel Assistant no vuelve a flashear un panel ni le da acceso root, y nunca toca su firmware. La copia de seguridad y restauración del firmware en algunos paneles con root es una tarea manual independiente, descrita en [copia de seguridad y restauración del firmware](/es/hardware/guides/firmware-backup-and-restore/). [Actualizaciones y recuperación](/es/manage/updates-and-recovery/) explica qué puede recuperarse cuando algo sale mal.
