---
title: Antes de eliminar ha-paneld
description: Qué hace eliminar ha-paneld de un panel, qué paneles y firmwares pueden quedar sin acceso a los ajustes de Android y qué comprobar antes.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

<div id="removal-this-panel" class="removal-this-panel" hidden>
<p><strong>Tu panel:</strong> <span id="removal-this-panel-name"></span></p>
<p id="removal-this-panel-verdict"></p>
</div>

Panel Assistant elimina ha-paneld en un solo paso, desde la opción **Quitar de este panel**, en **Configurar** en Home Assistant (Panel Assistant 0.9 la llama Eliminar ha-paneld de este panel). En la mayoría de los paneles no hace falta nada más. En algunos, la eliminación deja el panel sin acceso a los Ajustes de Android o a la depuración por red; entonces nada puede volver a instalar una aplicación, incluido Panel Assistant, hasta que utilices la vía de recuperación del fabricante. En algunos firmwares, esa vía requiere iniciar sesión en una cuenta del fabricante o conectar un ordenador por USB.

Si la eliminación se completa correctamente, también elimina el panel de Home Assistant; no hay opción para conservar su entrada. La página del dispositivo del panel también tiene un botón **Quitar de este panel**. Pulsarlo no elimina nada: abre una reparación persistente, **Quitar Panel Assistant de &lt;panel&gt;**, en **Configuración → Sistema → Reparaciones**. Lee su advertencia antes de confirmar la eliminación seleccionando **Enviar** una vez. Si pulsaste el botón por error, cierra el diálogo sin enviar el formulario y deja la reparación sin confirmar.

Al eliminar la entrada del panel en Home Assistant, ha-paneld permanece instalado. Antes de eliminar la entrada, usa la opción de eliminación descrita arriba para eliminar la aplicación.

Si ya has eliminado la entrada, vuelve a añadir el panel en Home Assistant y, después, usa la opción de eliminación descrita arriba.

Lee la sección de tu panel antes de confirmar.

## Qué hace la eliminación

1. ha-paneld devuelve la pantalla de inicio al lanzador original del panel y vuelve a activar las aplicaciones del fabricante que había desactivado.
2. Panel Assistant comprueba en el panel que otro lanzador controle realmente la pantalla de inicio. Si no hay ninguno, se detiene y no elimina nada.
3. Panel Assistant desinstala ha-paneld mediante su conexión de gestión. Se eliminan los ajustes de ha-paneld en el panel.
4. Si la eliminación se completa correctamente, también elimina la entrada del panel de Home Assistant.

Si la eliminación se detiene a medias, vuelve a ejecutarla: continúa donde se detuvo.

## Reinstalación de este panel

Primero vuelve a habilitar la depuración siguiendo la sección correspondiente a tu panel más abajo y [Preparar un panel](/es/install/prepare-a-panel/#1-las-opciones-para-desarrolladores-y-la-depuración-están-activadas). Después sigue [Añadir un panel](/es/install/installing-ha-paneld/) para instalar Panel Assistant de nuevo. La eliminación borra la configuración de la aplicación; la reinstalación no la restaura.

## Por qué puede quedar bloqueado un panel

Si la persistencia de ADB por red está activada y es compatible, ha-paneld puede restablecerla tras un reinicio. Tras la eliminación, ese soporte desaparece y el firmware del fabricante puede desactivar la depuración, también después de un reinicio.

Esto solo importa si la pantalla de inicio original del panel no permite acceder a los Ajustes de Android, donde se vuelve a activar la depuración. Varias pantallas de inicio de fabricantes no lo permiten.

## Sonoff NSPanel Pro

<div class="removal-make" data-make="sonoff">

La pantalla de inicio de eWeLink no permite acceder a los Ajustes de Android, así que la versión del firmware determina la dificultad de recuperar la depuración.

- **Firmware 4.0.0 y posterior:** Sonoff añadió una entrada F-Droid al menú del panel y las aplicaciones instaladas desde allí se abren desde ese menú. Antes de eliminar ha-paneld, instala desde F-Droid un lanzador de aplicaciones que incluya los Ajustes de Android entre las aplicaciones del panel, para poder volver a activar la depuración después.
- **Firmware anterior a 4.0.0:** no hay tienda de aplicaciones ni acceso a los Ajustes de Android desde el panel. Si ya está vinculado a una cuenta eWeLink, la depuración se reactiva desde la aplicación móvil eWeLink: pulsa _Device ID_ en los ajustes del dispositivo del panel hasta que aparezca _Developer mode_ y activa ADB allí. Vincular el panel a una cuenta más adelante puede fallar: en un panel, el código de emparejamiento permaneció atenuado, en espera. Sin una cuenta vinculada, la vía restante es un arranque de recuperación con un ordenador conectado por USB: consulta [Obtener acceso adb y root](/es/hardware/panels/sonoff/#gaining-adb-and-root-access). Si el panel está vinculado a eWeLink, actualízalo allí a 4.0.0 o posterior antes de eliminar ha-paneld.

El número de firmware que debes comparar es el que muestran la aplicación eWeLink y Panel Assistant, como 4.0.12, no el `ro.product.version` interno. Consulta [Particularidades del firmware por versión](/es/hardware/panels/sonoff/#firmware-quirks-by-version).

</div>

## Shelly Wall Display

<div class="removal-make" data-make="shelly">

La pantalla de inicio de Shelly no permite acceder a los Ajustes de Android. En el X2i, las opciones para desarrolladores se desbloquean desde la aplicación Ajustes de Shelly: consulta [Desbloquear el modo de desarrollador](/es/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode). En los demás modelos Wall Display no se ha confirmado una vía así, por lo que debes considerar la eliminación irreversible salvo que sepas cómo volver a activar la depuración.

</div>

## Tuya TPA10

<div class="removal-make" data-make="tuya">

Las opciones para desarrolladores se abren desde la aplicación Ajustes del panel (pulsa el número de versión siete veces), y la depuración USB funciona mediante la aplicación de diagnóstico: consulta [Obtener acceso adb y root](/es/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access). Si la depuración por red se ha desactivado, requiere repetir ese paso USB.

</div>

## Otros paneles

<div class="removal-make" data-make="other">

Si la pantalla de inicio original puede abrir los Ajustes de Android, la eliminación deja el panel como estaba antes de ha-paneld. Si no puede, asegúrate de disponer de otra forma de activar la depuración antes de eliminar ha-paneld, como un lanzador que abra Ajustes.

</div>

## Comprobar antes de eliminar

- **Busca la versión del firmware.** Panel Assistant la muestra en la parte superior de esta página cuando enlaza a ella. Utiliza **Visitar** en la página del dispositivo del panel en Home Assistant para abrir la página del propio ha-paneld (por ejemplo, `http://<panel>:8888` con el puerto predeterminado), donde aparece como _Firmware_.
- **Conoce la vía para recuperar la depuración** en tu panel y firmware, según la sección anterior.
- **Conserva un lanzador que abra los Ajustes de Android** si la pantalla de inicio del fabricante no lo permite.
- **No reinicies el panel** entre la eliminación de ha-paneld y cualquier tarea pendiente que necesite depuración.

<script>
  // Panel Assistant links here with the panel's make, model and firmware
  // (make, model, fw). Each is optional; an unrecognised value is ignored.
  (() => {
    const query = new URLSearchParams(location.search);
    const clean = (value) =>
      value && /^[0-9A-Za-z][0-9A-Za-z ._+-]{0,79}$/.test(value) ? value : null;
    const make = clean(query.get('make'));
    const model = clean(query.get('model'));
    const fw = clean(query.get('fw'));
    const lower = (make || '').toLowerCase();
    const key = ['sonoff', 'shelly', 'tuya'].find((name) => lower.includes(name));
    if (!make && !fw) return;
    const box = document.getElementById('removal-this-panel');
    const name = [make, model].filter(Boolean).join(' ') || 'Panel desconocido';
    document.getElementById('removal-this-panel-name').textContent =
      fw ? `${name}, firmware ${fw}` : name;
    let verdict = 'Consulta más abajo la sección de tu panel.';
    if (key === 'sonoff' && fw && /^\d+(\.\d+)*$/.test(fw)) {
      const major = Number(fw.split('.')[0]);
      verdict =
        major >= 4
          ? 'Este firmware tiene F-Droid en su menú: instala desde allí un lanzador de aplicaciones antes de eliminar ha-paneld.'
          : 'Este firmware no permite acceder a los Ajustes de Android desde el panel. Recuperar la depuración requiere la aplicación móvil eWeLink con el panel ya vinculado a una cuenta, o un arranque de recuperación con un ordenador. Si está vinculado, actualízalo primero a 4.0.0 o posterior.';
    }
    document.getElementById('removal-this-panel-verdict').textContent = verdict;
    box.hidden = false;
    const section = document.querySelector(`.removal-make[data-make="${key || 'other'}"]`);
    if (section) section.classList.add('removal-make-match');
  })();
</script>

<style>
  .removal-this-panel {
    border: 2px solid var(--sl-color-accent);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
  }
  .removal-make-match {
    border-inline-start: 4px solid var(--sl-color-accent);
    padding-inline-start: 1rem;
  }
</style>
