---
title: Premiers pas
description: En quelques minutes, passez d’un panneau mural Android non configuré à votre tableau de bord Home Assistant, avec Home Assistant pour vous guider à chaque étape.
sourceCommit: a0f4f4fce9c24d9c344dbb001c39a8eef9bdd679
---

Si vous avez déjà configuré un panneau mural ou un kiosque, vous vous souvenez sans doute du déroulement : installer des applications manuellement, chercher un moteur de navigateur capable d’afficher un tableau de bord, tâtonner dans les réglages et ne jamais vraiment faire confiance au prochain redémarrage. Configurer un panneau avec Panel Assistant sera une agréable surprise. Vous pouvez terminer en quelques minutes et, même si le panneau est au mur, vous n’aurez pas à vous lever de votre chaise. Bon, peut-être une fois ;-)

La première heure est la plus difficile avec un panneau. Panel Assistant s’en charge pour vous, depuis Home Assistant. Si le panneau est déjà sur votre réseau, indiquez son adresse à l’intégration, qui fait le reste. S’il est encore dans sa boîte, branchez-le à votre ordinateur portable avec un câble USB et installez directement depuis votre navigateur, avant même de le fixer au mur. Dans les deux cas, vous acceptez une demande sur le panneau et suivez le déroulement.

## 1. Installer l’intégration

Ajoutez Panel Assistant via HACS et redémarrez Home Assistant. C’est la seule chose que vous installez à la main. Ensuite, Home Assistant vous guide. Voir [Installer l’intégration](/fr/home-assistant/custom-integration/).

## 2. Activer le débogage sur le panneau

Ouvrez les options pour les développeurs sur le panneau et activez le débogage sans fil, ou le débogage USB si vous branchez le panneau par câble. C’est ce qui permet à Home Assistant de faire l’installation pour vous. Les [pages consacrées au matériel](/fr/hardware/) indiquent où se trouve le réglage sur chaque modèle, et [Préparer le panneau](/fr/install/prepare-a-panel/) donne les détails.

## 3. Ajouter le panneau

Dans Home Assistant, allez dans **Paramètres**, **Appareils et services**, **Ajouter une intégration**, puis choisissez **Panel Assistant**. Choisissez ensuite la façon dont le panneau est connecté.

### Branché à votre ordinateur

Un panneau neuf peut être configuré avant même d’être fixé au mur. Branchez-le à votre ordinateur avec un câble USB et installez directement depuis votre navigateur. Il vous faut Chrome ou Edge pour cela.

<div class="pa-steps" role="region" aria-label="Installer par USB, étape par étape" tabindex="0">
<figure>
<figcaption><span>1</span> Choisissez Installer par USB</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="L’étape Configurer un panneau dans Home Assistant propose Ajouter un panneau de votre réseau ou Installer par USB sur cet ordinateur">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="L’étape Configurer un panneau dans Home Assistant propose Ajouter un panneau de votre réseau ou Installer par USB sur cet ordinateur">
</figure>
<figure>
<figcaption><span>2</span> Branchez le panneau</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="L’installateur USB vous demande de brancher le panneau et d’appuyer sur Trouver mon panneau">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="L’installateur USB vous demande de brancher le panneau et d’appuyer sur Trouver mon panneau">
</figure>
<figure>
<figcaption><span>3</span> Appuyez sur Autoriser sur le panneau</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="L’installateur USB attend que vous appuyiez sur Autoriser sur l’écran du panneau">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="L’installateur USB attend que vous appuyiez sur Autoriser sur l’écran du panneau">
</figure>
<figure>
<figcaption><span>4</span> Appuyez sur Installer</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="L’installateur USB prêt à lancer l’installation, avec un seul bouton Installer">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="L’installateur USB prêt à lancer l’installation, avec un seul bouton Installer">
</figure>
<figure>
<figcaption><span>5</span> Suivez l’installation</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="La barre de progression de l’installateur USB pendant l’installation de l’application">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="La barre de progression de l’installateur USB pendant l’installation de l’application">
</figure>
<figure>
<figcaption><span>6</span> Terminé</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="L’installateur USB confirme l’installation et ouvre la configuration du panneau">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="L’installateur USB confirme l’installation et ouvre la configuration du panneau">
</figure>
</div>

### Sur votre réseau

Si le panneau est déjà au mur, Home Assistant n’a besoin que de son adresse.

<div class="pa-steps" role="region" aria-label="Ajouter un panneau sur votre réseau, étape par étape" tabindex="0">
<figure>
<figcaption><span>1</span> Choisissez Ajouter un panneau de votre réseau</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="L’étape Configurer un panneau dans Home Assistant propose Ajouter un panneau de votre réseau ou Installer par USB sur cet ordinateur">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="L’étape Configurer un panneau dans Home Assistant propose Ajouter un panneau de votre réseau ou Installer par USB sur cet ordinateur">
</figure>
<figure>
<figcaption><span>2</span> Indiquez l’adresse du panneau</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="L’étape Ajouter un panneau, avec l’adresse IP du panneau renseignée">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="L’étape Ajouter un panneau, avec l’adresse IP du panneau renseignée">
</figure>
<figure>
<figcaption><span>3</span> Choisissez une version</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="L’étape Choisir une version, avec la version recommandée en tête de liste">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="L’étape Choisir une version, avec la version recommandée en tête de liste">
</figure>
<figure>
<figcaption><span>4</span> Appuyez sur Autoriser sur le panneau, et il est ajouté</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="L’étape Réussite confirme que le panneau a été ajouté à Home Assistant">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="L’étape Réussite confirme que le panneau a été ajouté à Home Assistant">
</figure>
</div>

Dans les deux cas, l’assistant se charge de la partie compliquée. Il vérifie ce qui est déjà sur le panneau, installe la version actuelle de l’application du panneau, la démarre et confirme qu’elle fonctionne correctement. Un panneau sur lequel l’application fonctionne déjà est pris en charge sans réinstallation. Le panneau reconnaît son modèle et charge le profil matériel correspondant : son écran, ses boutons, ses LED et ses capteurs arrivent donc dans Home Assistant prêts à l’emploi. Voir [Ajouter un panneau](/fr/install/installing-ha-paneld/).

## 4. Terminer dans l’assistant de configuration du panneau

Home Assistant ouvre ensuite l’assistant de configuration du panneau, qui pose quelques questions rapides, notamment le nom du panneau et le tableau de bord à afficher au mur. Le panneau ne charge que les entités affichées par ce tableau de bord, ce qui le garde rapide. Voir [Connecter un panneau](/fr/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="L’assistant de configuration du panneau, étape par étape" tabindex="0">
<figure>
<figcaption><span>1</span> Nommez le panneau</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="L’assistant de configuration du panneau demande l’ID du panneau et son nom convivial, avec un aperçu des noms d’entités que Home Assistant utilisera">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="L’assistant de configuration du panneau demande l’ID du panneau et son nom convivial, avec un aperçu des noms d’entités que Home Assistant utilisera">
</figure>
<figure>
<figcaption><span>2</span> Choisissez le tableau de bord et la pièce</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="L’assistant avec un tableau de bord et une pièce Home Assistant sélectionnés pour le panneau">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="L’assistant avec un tableau de bord et une pièce Home Assistant sélectionnés pour le panneau">
</figure>
<figure>
<figcaption><span>3</span> Activez le filtre d’entités</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="L’assistant recommande le filtre d’entités pour ce panneau et affiche le nombre d’entités Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="L’assistant recommande le filtre d’entités pour ce panneau et affiche le nombre d’entités Home Assistant">
</figure>
<figure>
<figcaption><span>4</span> Presque terminé</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="L’assistant attend pendant que le panneau constitue son ensemble d’entités filtrées et charge le tableau de bord">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="L’assistant attend pendant que le panneau constitue son ensemble d’entités filtrées et charge le tableau de bord">
</figure>
<figure>
<figcaption><span>5</span> Tout est prêt</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="L’assistant confirme que le panneau est configuré et affiche le tableau de bord">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="L’assistant confirme que le panneau est configuré et affiche le tableau de bord">
</figure>
</div>

## Ce qu’il vous faut

- Home Assistant 2026.8.3 ou plus récent, avec HACS.
- Un panneau mural sous Android 8.0 ou plus récent. La plupart des panneaux fonctionnent avec le profil matériel générique, et [Choisir un panneau](/fr/install/supported-panels/) répertorie les modèles bénéficiant d’une prise en charge matérielle complète.
- Pour l’option USB, un navigateur basé sur Chromium, comme Chrome ou Edge.

## Où trouver les détails

Les pages de la rubrique **Au quotidien** expliquent en détail chaque fonction de l’application du panneau. La rubrique Référence documente l’[API](/fr/reference/api/), les [profils matériels](/fr/reference/profiles/) et le [modèle de sécurité](/fr/reference/security/), tandis que les [pages consacrées au matériel](/fr/hardware/) présentent chaque panneau pris en charge.
