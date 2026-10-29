---
title: Prima di rimuovere ha-paneld
description: Cosa comporta rimuovere ha-paneld da un pannello, quali pannelli e firmware possono rimanere senza un modo per tornare alle impostazioni Android e cosa controllare prima.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

<div id="removal-this-panel" class="removal-this-panel" hidden>
<p><strong>Il tuo pannello:</strong> <span id="removal-this-panel-name"></span></p>
<p id="removal-this-panel-verdict"></p>
</div>

Panel Assistant rimuove ha-paneld in un unico passaggio, dall'opzione **Rimuovi Panel Assistant da questo pannello** del pannello, sotto **Configura** in Home Assistant (Panel Assistant 0.9 la chiama Rimuovi ha-paneld da questo pannello). Sulla maggior parte dei pannelli non serve altro. Su alcuni, la rimozione lascia il pannello senza un modo per tornare alle Impostazioni Android o al debug di rete: nulla può quindi installarvi nuovamente un'app, Panel Assistant incluso, finché non segui il percorso di ripristino del produttore. Su alcuni firmware quel percorso richiede l'accesso a un account del produttore o il collegamento di un computer tramite USB.

Nella versione 1.0.0-rc2 non ancora rilasciata, questa opzione si chiama **Rimuovi da questo pannello** e una rimozione riuscita elimina anche il pannello da Home Assistant; non esiste un'opzione per conservarne la voce.

Leggi la sezione relativa al tuo pannello prima di confermare.

## Cosa fa la rimozione

1. ha-paneld restituisce la schermata iniziale al launcher del pannello e riattiva le app del produttore che aveva disattivato.
2. Panel Assistant verifica sul pannello che un altro launcher gestisca effettivamente la schermata iniziale. Se nessuno lo fa, si ferma e non rimuove nulla.
3. Panel Assistant disinstalla ha-paneld usando la propria connessione di gestione. Le impostazioni di ha-paneld sul pannello vengono eliminate.
4. In 1.0.0-rc1, se hai selezionato **Elimina anche questo pannello da Home Assistant** prima dell'invio, anche Home Assistant dimentica il pannello. Lascia l'opzione disattivata per conservarne entità e cronologia. Nella versione 1.0.0-rc2 non ancora rilasciata, una rimozione riuscita elimina sempre la voce.

Se la rimozione si ferma a metà, eseguila nuovamente: riprende da dove si era fermata.

## Perché un pannello può rimanere bloccato

Se la persistenza di ADB di rete è abilitata e supportata, ha-paneld può ripristinarla dopo un riavvio. Dopo la rimozione quel supporto non c'è più e il firmware del produttore potrebbe disattivare il debug, anche dopo un riavvio.

Questo conta solo se la schermata iniziale del pannello non offre un modo per aprire le Impostazioni Android, dove si riattiva il debug. Diverse schermate iniziali dei produttori non lo offrono.

## Sonoff NSPanel Pro

<div class="removal-make" data-make="sonoff">

La schermata iniziale eWeLink non offre un modo per aprire le Impostazioni Android, quindi la versione del firmware determina quanto sia difficile ripristinare il debug.

- **Firmware 4.0.0 e successivi:** Sonoff ha aggiunto una voce F-Droid al menu del pannello, e le app installate da lì si aprono da quel menu. Prima di rimuovere ha-paneld, installa da F-Droid un launcher di app che elenchi le Impostazioni Android tra le app del pannello, così potrai riattivare il debug in seguito.
- **Firmware precedenti a 4.0.0:** non c'è un negozio di app né un modo per aprire le Impostazioni Android dal pannello. Se il pannello è già associato a un account eWeLink, il debug si riattiva dall'app eWeLink sul telefono: tocca _ID dispositivo_ nelle impostazioni del dispositivo del pannello finché non compare _Modalità sviluppatore_, poi attiva ADB lì. Associare un pannello a un account in seguito potrebbe non funzionare: su un pannello il codice di associazione è rimasto grigio, in attesa. Senza un account associato, il percorso rimanente è un avvio in recovery con un computer collegato tramite USB: vedi [Ottenere l'accesso adb e root](/it/hardware/panels/sonoff/#ottenere-accesso-adb-e-root). Se il pannello è associato a eWeLink, aggiornalo da lì alla versione 4.0.0 o successiva prima di rimuovere ha-paneld.

Il numero di firmware da confrontare è quello mostrato dall'app eWeLink e da Panel Assistant, come 4.0.12, non il valore interno `ro.product.version`. Vedi [Particolarità del firmware per versione](/it/hardware/panels/sonoff/#particolarità-del-firmware-per-versione).

</div>

## Shelly Wall Display

<div class="removal-make" data-make="shelly">

La schermata iniziale Shelly non offre un modo per aprire le Impostazioni Android. Su X2i, le opzioni sviluppatore si sbloccano dall'app Impostazioni di Shelly: vedi [Sbloccare la modalità sviluppatore](/it/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode). Sugli altri modelli Wall Display non è stato confermato un percorso del genere: considera quindi la rimozione irreversibile a meno che tu non sappia come riattivare il debug.

</div>

## Tuya TPA10

<div class="removal-make" data-make="tuya">

Le opzioni sviluppatore si aprono dall'app Impostazioni del pannello (tocca il numero di versione sette volte), e il debug tramite USB funziona attraverso l'app diagnostica: vedi [Ottenere l'accesso adb e root](/it/hardware/panels/tuya/tpa10/#ottenere-accesso-adb-e-root). Il debug di rete richiede nuovamente quel passaggio USB se è stato disattivato.

</div>

## Altri pannelli

<div class="removal-make" data-make="other">

Se la schermata iniziale del pannello può aprire le Impostazioni Android, la rimozione lo lascia com'era prima di ha-paneld. Se non può farlo, assicurati di avere un altro modo per attivare il debug prima di rimuovere ha-paneld, ad esempio un launcher che apra Impostazioni.

</div>

## Controlla prima di rimuovere

- **Trova la versione del firmware.** Panel Assistant la mostra in cima a questa pagina quando vi rimanda. Usa **Visita** nella pagina del dispositivo del pannello in Home Assistant per aprire la pagina di ha-paneld (ad esempio, `http://<panel>:8888` con la porta predefinita), che la elenca come _Firmware_.
- **Conosci il percorso per tornare al debug** per il tuo pannello e firmware, dalla sezione sopra.
- **Conserva un launcher che apra le Impostazioni Android** se la schermata iniziale del produttore non lo consente.
- **Non riavviare il pannello** tra la rimozione di ha-paneld e qualsiasi operazione per cui ti serva ancora il debug.

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
    const name = [make, model].filter(Boolean).join(' ') || 'Pannello sconosciuto';
    document.getElementById('removal-this-panel-name').textContent =
      fw ? `${name}, firmware ${fw}` : name;
    let verdict = 'Consulta la sezione relativa al tuo pannello qui sotto.';
    if (key === 'sonoff' && fw && /^\d+(\.\d+)*$/.test(fw)) {
      const major = Number(fw.split('.')[0]);
      verdict =
        major >= 4
          ? 'Questo firmware ha F-Droid nel menu: usalo per installare un launcher di app prima di rimuovere ha-paneld.'
          : 'Questo firmware non offre un modo per aprire le Impostazioni Android dal pannello. Per ripristinare il debug serve l’app eWeLink sul telefono con il pannello già associato a un account, oppure un avvio in recovery con un computer. Se è associato, aggiornalo prima alla versione 4.0.0 o successiva.';
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
