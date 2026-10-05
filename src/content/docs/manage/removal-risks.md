---
title: Before you remove ha-paneld
description: What removing ha-paneld from a panel does, which panels and firmware can be left without a way back to Android settings, and what to check first.
---

<div id="removal-this-panel" class="removal-this-panel" hidden>
<p><strong>Your panel:</strong> <span id="removal-this-panel-name"></span></p>
<p id="removal-this-panel-verdict"></p>
</div>

Panel Assistant removes ha-paneld in one step, from the panel's **Remove ha-paneld from this panel** option in Home Assistant. On most panels that is all there is to it. On some, removal leaves the panel with no way back to Android Settings or to network debugging, and then nothing can install an app on it again, Panel Assistant included, until you take the vendor's own route back. On some firmware that route means signing in to a vendor account or opening the case.

Read the section for your panel before you confirm.

## What removal does

1. ha-paneld gives the home screen back to the panel's own launcher, and turns back on the vendor apps it switched off.
2. Panel Assistant checks on the panel that another launcher really holds the home screen. If none does, it stops and removes nothing.
3. Panel Assistant uninstalls ha-paneld over the network debugging (ADB) connection it already uses. ha-paneld's settings on the panel are deleted.
4. You choose whether Home Assistant forgets the panel too.

If removal stops part way, run it again: it picks up where it stopped.

## Why a panel can get stuck

While ha-paneld is installed it keeps network debugging switched on, because some firmware switches it off again every time the panel restarts. Once ha-paneld is gone, nothing does that. Network debugging stays on until the panel next restarts, and after that it may not come back.

That only matters if the panel's own home screen has no way into Android Settings, where debugging is switched back on. Several vendor home screens have none.

## Sonoff NSPanel Pro

<div class="removal-make" data-make="sonoff">

The eWeLink home screen has no way into Android Settings, so the firmware version decides how hard it is to get debugging back.

- **Firmware 4.0.0 and later:** the stock firmware includes the F-Droid app store and lets you install apps directly on the panel. Before removing ha-paneld, install a launcher from F-Droid that can open Android Settings, so you can switch debugging back on later.
- **Firmware below 4.0.0:** there is no app store and no way into Android Settings from the panel. From firmware 1.3.2 debugging is switched on from the eWeLink app, which needs a Sonoff account. From 1.4 that option is gone, and the way back is a recovery boot with a computer: see [Gaining adb and root access](/hardware/panels/sonoff-nspanel-pro/#gaining-adb-and-root-access). If you can, update the panel to 4.0.0 or later in the eWeLink app before removing ha-paneld.

The firmware number to compare is the one the eWeLink app and Panel Assistant show, such as 4.0.12, not the internal `ro.product.version`. See [firmware quirks by version](/hardware/panels/sonoff-nspanel-pro/#firmware-quirks-by-version).

</div>

## Shelly Wall Display

<div class="removal-make" data-make="shelly">

The Shelly home screen has no way into Android Settings. On the X2i, developer options unlock from the Shelly Settings app: see [unlocking developer mode](/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode). On other Wall Display models no such route has been confirmed, so treat removal as one way unless you know how to turn debugging back on.

</div>

## Tuya TPA10

<div class="removal-make" data-make="tuya">

Developer options open from the panel's Settings app (tap the version number seven times), and debugging over USB works through the diagnostics app: see [Gaining adb and root access](/hardware/panels/tuya-tpa10/#gaining-adb-and-root-access). Network debugging needs that USB step again if it was switched off.

</div>

## Other panels

<div class="removal-make" data-make="other">

If the panel's own home screen can open Android Settings, removal leaves it as it was before ha-paneld. If it cannot, make sure you have another way to switch debugging on before you remove ha-paneld, such as a launcher that opens Settings.

</div>

## Check before you remove

- **Find your firmware version.** Panel Assistant shows it at the top of this page when it links here. On the panel, ha-paneld's own page at `http://<panel>:8888` lists it as _Firmware_.
- **Know your way back to debugging** for your panel and firmware, from the section above.
- **Keep a launcher that opens Android Settings** if the vendor's home screen has none.
- **Do not restart the panel** between removing ha-paneld and anything you still need debugging for.

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
    const name = [make, model].filter(Boolean).join(' ') || 'Unknown panel';
    document.getElementById('removal-this-panel-name').textContent =
      fw ? `${name}, firmware ${fw}` : name;
    let verdict = 'See the section for your panel below.';
    if (key === 'sonoff' && fw && /^\d+(\.\d+)*$/.test(fw)) {
      const major = Number(fw.split('.')[0]);
      verdict =
        major >= 4
          ? 'This firmware includes F-Droid: install a launcher that opens Android Settings before you remove ha-paneld.'
          : 'This firmware has no way back to Android Settings from the panel. Update it to 4.0.0 or later first if you can, or be ready to take the recovery route below.';
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
