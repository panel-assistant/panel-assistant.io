---
title: Paquets du fabricant
description: Empêcher une application intrusive du fabricant de se relancer au démarrage et de recouvrir votre tableau de bord, de façon réversible et uniquement pour les paquets choisis.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Une mise à jour du micrologiciel peut laisser sur le panneau une application du fabricant qui se relance au démarrage et affiche un widget flottant par-dessus votre tableau de bord. Sur le Sonoff NSPanel Pro 120, par exemple, une mise à jour du micrologiciel a laissé `com.eWeLinkControlPanel` démarrer au lancement et superposer un widget de commande à tout ce qu’affichait le panneau. L’application du panneau peut neutraliser de tels paquets, mais uniquement ceux que vous nommez.

## Son fonctionnement

Pour chaque paquet que vous maîtrisez, l’application du panneau applique trois actions privilégiées réversibles, répétées à chaque démarrage :

| Étape                              | Mécanisme                                   | Effet                                                                                 |
| ---------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| Forcer l’arrêt                     | `am force-stop <pkg>`                       | Arrête l’application immédiatement, pour que son widget disparaisse aussitôt.         |
| Désactiver la relance au démarrage | `pm disable-user --user 0 <pkg>`            | Empêche son redémarrage au prochain démarrage. Réversible avec `pm enable <pkg>`.     |
| Bloquer les superpositions         | `appops set <pkg> SYSTEM_ALERT_WINDOW deny` | Retire sa permission de dessiner une fenêtre flottante par-dessus le tableau de bord. |

Ces trois actions sont privilégiées : la fonction nécessite donc **root ou l’[assistant root](https://github.com/panel-assistant/android/blob/main/helper/README.md)**. Elle fonctionne aussi sur les panneaux qui isolent root, comme le [Tuya TPA10](/fr/hardware/panels/tuya/tpa10/), où les actions passent par les commandes `STOP`, `DISABLE` et `OVERLAY` de l’assistant.

## Utilisation

La gestion se fait **sur l’interface web du panneau**, dans l’onglet **Installer**, et non depuis Home Assistant. Il s’agit d’une opération ponctuelle lors de la configuration d’un panneau ou après une mise à jour du micrologiciel, et non d’un réglage quotidien : elle n’a donc pas sa place sur un tableau de bord.

Sélectionnez **Visiter** sur la page de l’appareil du panneau dans Home Assistant, ouvrez **Installer** et trouvez la carte **Paquets du fabricant** (par exemple, `http://<panel-ip>:8888/install` avec le port par défaut).

Appuyez sur **Rechercher un paquet…** pour ouvrir une liste des applications du panneau que vous pourriez vouloir contrôler, regroupées pour faciliter le choix :

- **Recommandées pour ce panneau** : les applications intrusives du micrologiciel connues pour votre matériel, qui sont les premiers choix sûrs. Sur un panneau dont le profil matériel est connu, comme le NSPanel Pro, `com.eWeLinkControlPanel` apparaît ici. Chaque entrée comporte des **étiquettes** (par exemple `vendor` pour les applications du fabricant du panneau, `chipset` pour les applications d’usine et de test du fabricant de la puce, `overlay`, `boot`) et une courte **note** de l’auteur du profil expliquant de quoi il s’agit et pourquoi elle est signalée. Vous pouvez ainsi distinguer une application de superposition Sonoff d’une application de test Rockchip inoffensive laissée dans l’image.
- **Autres applications** : les applications du panneau qui ne font pas partie du système Android de base. Sur un panneau sans profil connu, c’est ici qu’il faut chercher les ajouts du fabricant disposant d’une entrée dans le lanceur ou d’une permission de superposition. Si un paquet ne figure pas dans la liste, vous pouvez saisir son nom directement.
- **Utilisant le plus le CPU** : les applications qui utilisent le plus le processeur à cet instant. Ne maîtrisez que celles que vous reconnaissez.

Chaque entrée possède un bouton **Neutraliser** ; vous pouvez aussi saisir directement un nom de paquet dans le champ si vous le connaissez. **Neutraliser** agit immédiatement, sans enregistrement distinct, et son action est réappliquée à chaque démarrage. Un paquet maîtrisé ou déjà désactivé affiche à la place **Réactiver**, qui annule l’action. La carte elle-même ne répertorie que les paquets que vous avez maîtrisés, chacun avec son état : `active`, `disabled` ou `not installed`.

Rien n’est maîtrisé tant que vous n’appuyez pas sur un bouton Neutraliser. Sans root ni assistant, la carte reste visible mais verrouillée, avec une explication de l’accès manquant.

## Sécurité

- **Réversible.** La désactivation s’annule avec `pm enable <pkg>`, ou par une mise à jour de cette application ou du micrologiciel. Aucune action n’est destructive : ni désinstallation ni effacement de données.
- **Les paquets critiques sont refusés.** L’application du panneau n’arrête ni ne désactive jamais l’interface système, les paramètres, la téléphonie, le framework Android ou elle-même, même si vous les nommez. L’application et l’assistant privilégié imposent tous deux cette protection : une faute de frappe ne peut donc pas rendre le panneau inutilisable.
- **Seuls les paquets installés que vous nommez sont modifiés.** Retirer de la liste souhaitée un paquet pris en charge par l’application du panneau le réactive et restaure sa permission de superposition enregistrée. **Réactiver** annule aussi sa maîtrise.

:::caution
Vous choisissez les paquets à désactiver : limitez-vous donc aux logiciels du fabricant que vous reconnaissez. Désactiver un élément dont dépend le panneau, comme un lanceur du fabricant que vous utilisez réellement ou une méthode de saisie, peut rendre la navigation difficile jusqu’à sa réactivation via `adb`. En cas de doute, n’y touchez pas.
:::
