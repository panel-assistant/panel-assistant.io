---
title: Voordat je ha-paneld verwijdert
description: Wat ha-paneld verwijderen doet, welke panelen en firmware mogelijk geen weg terug naar Android-instellingen overhouden en wat je eerst moet controleren.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

<div id="removal-this-panel" class="removal-this-panel" hidden>
<p><strong>Je paneel:</strong> <span id="removal-this-panel-name"></span></p>
<p id="removal-this-panel-verdict"></p>
</div>

Panel Assistant verwijdert ha-paneld in één stap, via de paneeloptie **Panel Assistant van dit paneel verwijderen** onder **Configureren** in Home Assistant (Panel Assistant 0.9 noemt dit ha-paneld van dit paneel verwijderen). Op de meeste panelen is dat alles. Op sommige blijft na verwijdering geen route naar Android-instellingen of netwerkfoutopsporing over. Dan kan niets er opnieuw een app op installeren, ook Panel Assistant niet, totdat je de eigen herstelroute van de fabrikant gebruikt. Bij sommige firmware vereist dat aanmelden bij een fabrieksaccount of een computer aansluiten via USB.

In de nog niet uitgebrachte versie 1.0.0-rc2 heet deze optie **Van dit paneel verwijderen** en wordt het paneel bij een geslaagde verwijdering ook uit Home Assistant verwijderd; er is geen optie om de vermelding te behouden. Op de apparaatpagina van het paneel staat ook een knop **Van dit paneel verwijderen**. Als je erop drukt, wordt er niets verwijderd: de knop opent een blijvende reparatie, **Panel Assistant van &lt;panel&gt; halen**, onder **Instellingen → Systeem → Reparaties**. Lees de waarschuwing voordat je de verwijdering bevestigt door eenmaal **Verzenden** te selecteren. Als je per ongeluk op de knop hebt gedrukt, sluit je het dialoogvenster zonder het formulier te verzenden en laat je de reparatie onbevestigd.

Als je de vermelding van het paneel in Home Assistant verwijdert, blijft ha-paneld geïnstalleerd. Gebruik de hierboven beschreven verwijderoptie om de app te verwijderen voordat je de vermelding verwijdert.

Als je de vermelding al hebt verwijderd, voeg je het paneel opnieuw toe in Home Assistant en gebruik je daarna de hierboven beschreven verwijderoptie.

Lees het gedeelte over jouw paneel voordat je bevestigt.

## Wat verwijderen doet

1. ha-paneld geeft het startscherm terug aan de eigen launcher van het paneel en zet de door hem uitgeschakelde fabrieksapps weer aan.
2. Panel Assistant controleert op het paneel of een andere launcher werkelijk het startscherm beheert. Zo niet, dan stopt het en verwijdert niets.
3. Panel Assistant verwijdert ha-paneld via zijn beheerverbinding. De ha-paneld-instellingen op het paneel worden verwijderd.
4. Heb je in 1.0.0-rc1 vóór het verzenden **Dit paneel ook uit Home Assistant verwijderen** geselecteerd, dan vergeet Home Assistant het paneel ook. Laat dit uit om entiteiten en geschiedenis te behouden. In de nog niet uitgebrachte versie 1.0.0-rc2 verwijdert geslaagde verwijdering de vermelding altijd.

Stopt de verwijdering halverwege, voer haar dan opnieuw uit: ze gaat verder waar ze stopte.

## Dit paneel opnieuw installeren

Zorg eerst dat foutopsporing weer beschikbaar is met behulp van het onderstaande gedeelte voor jouw paneel en [Een paneel voorbereiden](/nl/install/prepare-a-panel/#1-ontwikkelaarsopties-en-foutopsporing-staan-aan). Volg daarna [Een paneel toevoegen](/nl/install/installing-ha-paneld/) om Panel Assistant opnieuw te installeren. Bij het verwijderen worden de instellingen van de app gewist; opnieuw installeren herstelt ze niet.

## Waarom een paneel kan vastlopen

Als blijvende netwerk-ADB is ingeschakeld en wordt ondersteund, kan ha-paneld die na een herstart herstellen. Na verwijdering ontbreekt die ondersteuning en kan de fabrieksfirmware foutopsporing uitschakelen, ook na een herstart.

Dat is alleen van belang als het eigen startscherm geen route naar Android-instellingen heeft, waar foutopsporing weer wordt ingeschakeld. Meerdere fabrieksstartschermen hebben die niet.

## Sonoff NSPanel Pro

<div class="removal-make" data-make="sonoff">

Het eWeLink-startscherm heeft geen route naar Android-instellingen, dus de firmwareversie bepaalt hoe lastig foutopsporing terug te krijgen is.

- **Firmware 4.0.0 en later:** Sonoff heeft F-Droid aan het paneelmenu toegevoegd; daaruit geïnstalleerde apps openen vanuit dat menu. Installeer vóór verwijdering van ha-paneld een app-launcher vanuit F-Droid die Android-instellingen tussen de paneelapps toont, zodat je foutopsporing later weer kunt inschakelen.
- **Firmware onder 4.0.0:** er is geen appwinkel en geen route naar Android-instellingen op het paneel. Is het paneel al aan een eWeLink-account gekoppeld, dan schakel je foutopsporing weer in vanuit de eWeLink-telefoonapp: tik op _Device ID_ in de apparaatinstellingen tot _Developer mode_ verschijnt en schakel daar ADB in. Een paneel later koppelen lukt mogelijk niet: op één paneel bleef de koppelcode grijs en wachten. Zonder gekoppeld account resteert opstarten in herstelmodus met een via USB aangesloten computer: zie [adb- en roottoegang verkrijgen](/nl/hardware/panels/sonoff/#gaining-adb-and-root-access). Is het paneel aan eWeLink gekoppeld, werk het daar dan bij naar 4.0.0 of later voordat je ha-paneld verwijdert.

Vergelijk het firmwarenummer dat de eWeLink-app en Panel Assistant tonen, zoals 4.0.12, niet de interne `ro.product.version`. Zie [Firmware-eigenaardigheden per versie](/nl/hardware/panels/sonoff/#firmware-quirks-by-version).

</div>

## Shelly Wall Display

<div class="removal-make" data-make="shelly">

Het Shelly-startscherm heeft geen route naar Android-instellingen. Op de X2i ontgrendel je ontwikkelaarsopties via de Shelly-app Instellingen: zie [Ontwikkelaarsmodus ontgrendelen](/nl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode). Voor andere Wall Display-modellen is zo’n route niet bevestigd. Beschouw verwijdering dus als eenrichtingsverkeer tenzij je weet hoe je foutopsporing weer inschakelt.

</div>

## Tuya TPA10

<div class="removal-make" data-make="tuya">

Ontwikkelaarsopties openen vanuit de app Instellingen van het paneel (tik zevenmaal op het versienummer), en USB-foutopsporing werkt via de diagnoseapp: zie [adb- en roottoegang verkrijgen](/nl/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access). Als netwerkfoutopsporing was uitgeschakeld, is die USB-stap opnieuw nodig.

</div>

## Andere panelen

<div class="removal-make" data-make="other">

Kan het eigen startscherm Android-instellingen openen, dan laat verwijdering het paneel achter zoals vóór ha-paneld. Kan dat niet, zorg dan vóór verwijdering voor een andere route om foutopsporing aan te zetten, zoals een launcher die Instellingen opent.

</div>

## Controleer vóór verwijdering

- **Zoek je firmwareversie.** Panel Assistant toont deze bovenaan wanneer het hierheen linkt. Kies **Bezoeken** op de apparaatpagina in Home Assistant om de eigen ha-paneld-pagina te openen (bijvoorbeeld `http://<panel>:8888` met de standaardpoort), waar deze onder _Firmware_ staat.
- **Ken je weg terug naar foutopsporing** voor je paneel en firmware via het bovenstaande gedeelte.
- **Bewaar een launcher die Android-instellingen opent** als het fabrieksstartscherm die niet heeft.
- **Herstart het paneel niet** tussen het verwijderen van ha-paneld en alles waarvoor je nog foutopsporing nodig hebt.

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
    const name = [make, model].filter(Boolean).join(' ') || 'Onbekend paneel';
    document.getElementById('removal-this-panel-name').textContent =
      fw ? `${name}, firmware ${fw}` : name;
    let verdict = 'Zie hieronder het gedeelte voor jouw paneel.';
    if (key === 'sonoff' && fw && /^\d+(\.\d+)*$/.test(fw)) {
      const major = Number(fw.split('.')[0]);
      verdict =
        major >= 4
          ? 'Deze firmware heeft F-Droid in het menu: installeer daaruit een app-launcher voordat je ha-paneld verwijdert.'
          : 'Deze firmware heeft geen route naar Android-instellingen op het paneel. Foutopsporing herstellen vereist de eWeLink-telefoonapp met het paneel al aan een account gekoppeld, of opstarten in herstelmodus met een computer. Is het gekoppeld, werk het dan eerst bij naar 4.0.0 of later.';
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
