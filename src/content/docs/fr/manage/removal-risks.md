---
title: Avant de retirer ha-paneld
description: Les effets du retrait de ha-paneld d’un panneau, les panneaux et micrologiciels qui peuvent perdre l’accès aux paramètres Android, et les vérifications préalables.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

<div id="removal-this-panel" class="removal-this-panel" hidden>
<p><strong>Votre panneau :</strong> <span id="removal-this-panel-name"></span></p>
<p id="removal-this-panel-verdict"></p>
</div>

Panel Assistant retire ha-paneld en une seule étape, depuis l’option **Retirer Panel Assistant de ce panneau**, sous **Configurer** dans Home Assistant (Panel Assistant 0.9 l’appelle Retirer ha-paneld de ce panneau). Sur la plupart des panneaux, cela suffit. Sur certains, le retrait ne laisse aucun moyen de revenir aux paramètres Android ou au débogage réseau ; plus rien ne peut alors y installer d’application, Panel Assistant compris, tant que vous n’utilisez pas la méthode de récupération du fabricant. Sur certains micrologiciels, cela implique de se connecter à un compte du fabricant ou de brancher un ordinateur par USB.

Dans la version 1.0.0-rc2 non encore publiée, cette option s’appelle **Retirer de ce panneau** et un retrait réussi supprime aussi le panneau de Home Assistant ; aucune option ne permet de conserver son entrée.

Lisez la section de votre panneau avant de confirmer.

## Ce que fait le retrait

1. ha-paneld rend l’écran d’accueil au lanceur du panneau et réactive les applications du fabricant qu’il avait désactivées.
2. Panel Assistant vérifie sur le panneau qu’un autre lanceur détient réellement l’écran d’accueil. Si aucun ne le détient, il s’arrête sans rien retirer.
3. Panel Assistant désinstalle ha-paneld avec sa connexion de gestion. Les réglages de ha-paneld sur le panneau sont supprimés.
4. Dans la version 1.0.0-rc1, si vous avez sélectionné **Supprimer aussi ce panneau de Home Assistant** avant de valider, Home Assistant oublie aussi le panneau. Laissez cette option désactivée pour conserver ses entités et son historique. Dans la version 1.0.0-rc2 non encore publiée, un retrait réussi supprime toujours l’entrée.

Si le retrait s’interrompt, relancez-le : il reprend là où il s’est arrêté.

## Pourquoi un panneau peut se retrouver bloqué

Si la persistance d’ADB réseau est activée et prise en charge, ha-paneld peut la rétablir après un redémarrage. Après son retrait, cette aide disparaît, et le micrologiciel du fabricant peut désactiver le débogage, notamment après un redémarrage.

Cela ne pose problème que si l’écran d’accueil du panneau ne permet pas d’ouvrir les paramètres Android pour réactiver le débogage. Plusieurs écrans d’accueil de fabricants ne le permettent pas.

## Sonoff NSPanel Pro

<div class="removal-make" data-make="sonoff">

L’écran d’accueil eWeLink ne permet pas d’ouvrir les paramètres Android : la version du micrologiciel détermine donc la difficulté à rétablir le débogage.

- **Micrologiciel 4.0.0 ou ultérieur :** Sonoff a ajouté une entrée F-Droid au menu du panneau, et les applications installées depuis celle-ci s’ouvrent depuis ce menu. Avant de retirer ha-paneld, installez depuis F-Droid un lanceur d’applications qui répertorie les paramètres Android parmi les applications du panneau, afin de pouvoir réactiver le débogage plus tard.
- **Micrologiciel antérieur à 4.0.0 :** il n’y a ni boutique d’applications ni accès aux paramètres Android depuis le panneau. Si le panneau est déjà lié à un compte eWeLink, le débogage se réactive depuis l’application eWeLink du téléphone : appuyez sur _Device ID_ dans les paramètres de l’appareil du panneau jusqu’à l’apparition de _Developer mode_, puis activez ADB à cet endroit. Lier ultérieurement un panneau à un compte peut échouer : sur un panneau, le code d’association restait grisé, en attente. Sans compte lié, la dernière méthode est un démarrage en récupération avec un ordinateur connecté par USB : voir [Obtenir l’accès adb et root](/fr/hardware/panels/sonoff/#gaining-adb-and-root-access). Si le panneau est lié à eWeLink, mettez-le à jour vers 4.0.0 ou une version ultérieure avant de retirer ha-paneld.

Le numéro de micrologiciel à comparer est celui qu’affichent l’application eWeLink et Panel Assistant, comme 4.0.12, et non le `ro.product.version` interne. Voir [Particularités du micrologiciel par version](/fr/hardware/panels/sonoff/#firmware-quirks-by-version).

</div>

## Shelly Wall Display

<div class="removal-make" data-make="shelly">

L’écran d’accueil Shelly ne permet pas d’ouvrir les paramètres Android. Sur le X2i, les options pour les développeurs se déverrouillent depuis l’application Paramètres de Shelly : voir [Déverrouiller le mode développeur](/fr/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode). Sur les autres modèles Wall Display, aucune méthode de ce type n’a été confirmée : considérez donc le retrait comme irréversible, sauf si vous savez réactiver le débogage.

</div>

## Tuya TPA10

<div class="removal-make" data-make="tuya">

Les options pour les développeurs s’ouvrent depuis l’application Paramètres du panneau (appuyez sept fois sur le numéro de version), et le débogage USB fonctionne via l’application de diagnostic : voir [Obtenir l’accès adb et root](/fr/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access). Si le débogage réseau a été désactivé, cette étape USB est à refaire.

</div>

## Autres panneaux

<div class="removal-make" data-make="other">

Si l’écran d’accueil du panneau peut ouvrir les paramètres Android, le retrait le remet dans son état antérieur à ha-paneld. Sinon, assurez-vous d’avoir un autre moyen d’activer le débogage avant de retirer ha-paneld, comme un lanceur qui ouvre les paramètres.

</div>

## Vérifications avant le retrait

- **Trouvez votre version de micrologiciel.** Panel Assistant l’affiche en haut de cette page lorsqu’il y renvoie. Sélectionnez **Visiter** sur la page de l’appareil du panneau dans Home Assistant pour ouvrir la page de ha-paneld (par exemple, `http://<panel>:8888` avec le port par défaut), où elle figure sous _Micrologiciel_.
- **Sachez comment rétablir le débogage** pour votre panneau et votre micrologiciel, d’après la section ci-dessus.
- **Conservez un lanceur qui ouvre les paramètres Android** si l’écran d’accueil du fabricant ne le permet pas.
- **Ne redémarrez pas le panneau** entre le retrait de ha-paneld et toute opération qui nécessite encore le débogage.

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
    const name = [make, model].filter(Boolean).join(' ') || 'Panneau inconnu';
    document.getElementById('removal-this-panel-name').textContent =
      fw ? `${name}, micrologiciel ${fw}` : name;
    let verdict = 'Consultez la section de votre panneau ci-dessous.';
    if (key === 'sonoff' && fw && /^\d+(\.\d+)*$/.test(fw)) {
      const major = Number(fw.split('.')[0]);
      verdict =
        major >= 4
          ? 'Ce micrologiciel propose F-Droid dans son menu : installez-y un lanceur d’applications avant de retirer ha-paneld.'
          : 'Ce micrologiciel ne permet pas d’ouvrir les paramètres Android depuis le panneau. Rétablir le débogage nécessite l’application eWeLink du téléphone avec le panneau déjà lié à un compte, ou un démarrage en récupération avec un ordinateur. S’il est lié, mettez-le d’abord à jour vers 4.0.0 ou une version ultérieure.';
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
