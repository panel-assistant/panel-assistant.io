---
title: Bevor du ha-paneld entfernst
description: Was das Entfernen von ha-paneld bewirkt, welche Panels und Firmwares danach keinen Rückweg zu den Android-Einstellungen bieten können und was du vorher prüfen solltest.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

<div id="removal-this-panel" class="removal-this-panel" hidden>
<p><strong>Dein Panel:</strong> <span id="removal-this-panel-name"></span></p>
<p id="removal-this-panel-verdict"></p>
</div>

Panel Assistant entfernt ha-paneld in einem Schritt über die Option **Panel Assistant von diesem Panel entfernen** unter **Konfigurieren** in Home Assistant (Panel Assistant 0.9 nennt sie „ha-paneld von diesem Panel entfernen“). Auf den meisten Panels ist damit alles erledigt. Auf manchen gibt es nach dem Entfernen keinen Weg zurück zu den Android-Einstellungen oder zum Netzwerk-Debugging. Dann kann nichts mehr eine App darauf installieren, auch Panel Assistant nicht, bis du den Rückweg des Herstellers verwendest. Bei manchen Firmwares bedeutet das die Anmeldung bei einem Herstellerkonto oder den Anschluss eines Computers über USB.

In der noch nicht veröffentlichten Version 1.0.0-rc2 heißt diese Option **Remove from this panel**, und bei erfolgreicher Entfernung wird das Panel auch aus Home Assistant gelöscht; es gibt keine Option, seinen Eintrag zu behalten. Auf der Geräteseite des Panels gibt es außerdem die Schaltfläche **Remove from this panel**. Wenn du sie drückst, wird nichts entfernt: Sie öffnet unter **Settings → System → Repairs** eine dauerhaft bestehende Reparaturmeldung namens **Remove Panel Assistant from &lt;panel&gt;**. Lies die darin enthaltene Warnung, bevor du die Entfernung durch einmaliges Betätigen von **Submit** bestätigst. Wenn du die Schaltfläche versehentlich gedrückt hast, schließe den Dialog ohne Absenden und lasse die Reparaturmeldung unbestätigt.

Wenn du den Eintrag des Panels in Home Assistant löschst, bleibt ha-paneld installiert. Nutze vor dem Löschen des Eintrags die oben beschriebene Entfernungsoption, um die App zu entfernen.

Wenn du den Eintrag bereits gelöscht hast, füge das Panel in Home Assistant erneut hinzu und nutze anschließend die oben beschriebene Entfernungsoption.

Lies den Abschnitt für dein Panel, bevor du bestätigst.

## Was beim Entfernen passiert

1. ha-paneld gibt den Startbildschirm an den eigenen Launcher des Panels zurück und schaltet die von ihm ausgeschalteten Hersteller-Apps wieder ein.
2. Panel Assistant prüft auf dem Panel, ob tatsächlich ein anderer Launcher den Startbildschirm übernommen hat. Falls nicht, stoppt es und entfernt nichts.
3. Panel Assistant deinstalliert ha-paneld über seine Verwaltungsverbindung. Die Einstellungen von ha-paneld auf dem Panel werden gelöscht.
4. Wenn du in 1.0.0-rc1 vor dem Absenden **Dieses Panel auch aus Home Assistant löschen** ausgewählt hast, vergisst Home Assistant das Panel ebenfalls. Lasse es ausgeschaltet, um Entitäten und Verlauf zu behalten. In der unveröffentlichten Version 1.0.0-rc2 löscht eine erfolgreiche Entfernung immer den Eintrag.

Wenn die Entfernung unterbrochen wird, führe sie erneut aus: Sie setzt dort fort, wo sie angehalten hat.

## Dieses Panel neu installieren

Aktiviere zunächst das Debugging wieder mithilfe des unten stehenden Abschnitts für dein Panel und der Anleitung [Ein Panel vorbereiten](/de/install/prepare-a-panel/#1-entwickleroptionen-und-debugging-sind-eingeschaltet). Folge anschließend der Anleitung [Ein Panel hinzufügen](/de/install/installing-ha-paneld/), um Panel Assistant erneut zu installieren. Beim Entfernen werden die Einstellungen der App gelöscht; eine erneute Installation stellt sie nicht wieder her.

## Warum ein Panel feststecken kann

Wenn die dauerhafte Aktivierung von Netzwerk-ADB eingeschaltet und unterstützt ist, kann ha-paneld es nach einem Neustart wiederherstellen. Nach dem Entfernen entfällt diese Unterstützung. Die Herstellerfirmware kann Debugging dann ausschalten, auch nach einem Neustart.

Das ist nur relevant, wenn der eigene Startbildschirm des Panels keinen Zugang zu den Android-Einstellungen bietet, wo Debugging wieder eingeschaltet wird. Mehrere Hersteller-Startbildschirme bieten keinen.

## Sonoff NSPanel Pro

<div class="removal-make" data-make="sonoff">

Der eWeLink-Startbildschirm bietet keinen Zugang zu den Android-Einstellungen. Daher entscheidet die Firmwareversion, wie schwierig es ist, Debugging zurückzubekommen.

- **Firmware 4.0.0 und neuer:** Sonoff hat dem Panelmenü einen F-Droid-Eintrag hinzugefügt. Von dort installierte Apps lassen sich über dieses Menü öffnen. Installiere vor dem Entfernen von ha-paneld einen App-Launcher aus F-Droid, der die Android-Einstellungen unter den Apps des Panels auflistet, damit du Debugging später wieder einschalten kannst.
- **Firmware unter 4.0.0:** Es gibt weder einen App-Store noch einen Zugang zu den Android-Einstellungen am Panel. Ist das Panel bereits mit einem eWeLink-Konto verknüpft, lässt sich Debugging über die eWeLink-Telefon-App wieder einschalten: Tippe in den Geräteeinstellungen des Panels auf _Geräte-ID_, bis _Entwicklermodus_ erscheint, und schalte dort ADB ein. Ein Panel erst später mit einem Konto zu verknüpfen, funktioniert möglicherweise nicht: Auf einem Panel blieb der Kopplungscode ausgegraut und wartete. Ohne verknüpftes Konto bleibt ein Recovery-Start mit einem per USB angeschlossenen Computer: siehe [adb- und Root-Zugriff erhalten](/de/hardware/panels/sonoff/#gaining-adb-and-root-access). Wenn das Panel mit eWeLink verknüpft ist, aktualisiere es dort vor dem Entfernen von ha-paneld auf 4.0.0 oder neuer.

Vergleiche die Firmwareversion, die die eWeLink-App und Panel Assistant anzeigen, etwa 4.0.12, nicht den internen Wert `ro.product.version`. Siehe [Firmwarebesonderheiten nach Version](/de/hardware/panels/sonoff/#firmware-quirks-by-version).

</div>

## Shelly Wall Display

<div class="removal-make" data-make="shelly">

Der Shelly-Startbildschirm bietet keinen Zugang zu den Android-Einstellungen. Auf dem X2i lassen sich die Entwickleroptionen über die Shelly-Einstellungen-App freischalten: siehe [Entwicklermodus freischalten](/de/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode). Auf anderen Wall Display-Modellen ist kein solcher Weg bestätigt. Betrachte das Entfernen daher als unumkehrbar, sofern du nicht weißt, wie du Debugging wieder einschaltest.

</div>

## Tuya TPA10

<div class="removal-make" data-make="tuya">

Die Entwickleroptionen öffnen sich über die Einstellungen-App des Panels (tippe siebenmal auf die Versionsnummer). USB-Debugging funktioniert über die Diagnose-App: siehe [adb- und Root-Zugriff erhalten](/de/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access). Wurde Netzwerk-Debugging ausgeschaltet, benötigt es diesen USB-Schritt erneut.

</div>

## Andere Panels

<div class="removal-make" data-make="other">

Wenn der eigene Startbildschirm des Panels die Android-Einstellungen öffnen kann, hinterlässt das Entfernen es im Zustand vor ha-paneld. Falls nicht, stelle vor dem Entfernen von ha-paneld sicher, dass du einen anderen Weg zum Einschalten von Debugging hast, etwa einen Launcher, der die Einstellungen öffnet.

</div>

## Vor dem Entfernen prüfen

- **Ermittle deine Firmwareversion.** Panel Assistant zeigt sie oben auf dieser Seite, wenn es hierher verlinkt. Wähle auf der Geräteseite des Panels in Home Assistant **Besuchen**, um die eigene Seite von ha-paneld zu öffnen (zum Beispiel `http://<panel>:8888` beim Standardport). Dort ist sie als _Firmware_ aufgeführt.
- **Kenne deinen Rückweg zum Debugging** für dein Panel und seine Firmware aus dem obigen Abschnitt.
- **Behalte einen Launcher, der die Android-Einstellungen öffnet**, wenn der Hersteller-Startbildschirm das nicht kann.
- **Starte das Panel nicht neu**, nachdem du ha-paneld entfernt hast und solange du Debugging noch benötigst.

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
    const name = [make, model].filter(Boolean).join(' ') || 'Unbekanntes Panel';
    document.getElementById('removal-this-panel-name').textContent =
      fw ? `${name}, Firmware ${fw}` : name;
    let verdict = 'Siehe unten den Abschnitt für dein Panel.';
    if (key === 'sonoff' && fw && /^\d+(\.\d+)*$/.test(fw)) {
      const major = Number(fw.split('.')[0]);
      verdict =
        major >= 4
          ? 'Diese Firmware hat F-Droid im Menü: Installiere daraus einen App-Launcher, bevor du ha-paneld entfernst.'
          : 'Diese Firmware bietet am Panel keinen Zugang zu den Android-Einstellungen. Für Debugging benötigst du die eWeLink-Telefon-App mit bereits verknüpftem Panel oder einen Recovery-Start mit einem Computer. Ist es verknüpft, aktualisiere es zuerst auf 4.0.0 oder neuer.';
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
