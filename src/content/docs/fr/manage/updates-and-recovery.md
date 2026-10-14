---
title: Mises à jour et récupération
description: Maintenir l’application du panneau à jour et savoir ce qui peut être récupéré en cas de problème.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

## Mettre à jour un panneau

**Depuis Home Assistant.** Chaque panneau possède une entité de mise à jour. Lorsqu’une version plus récente est publiée, l’entité la propose et un appui sur un bouton suffit à lancer l’installation ; Panel Assistant installe la mise à jour et confirme que le panneau a repris un fonctionnement normal. C’est la méthode à utiliser.

Une mise à jour commence lorsque Panel Assistant ou vous-même la demandez explicitement. L’application du panneau n’installe pas de mises à jour planifiées. L’onglet **Installer** de son interface web vous permet aussi de choisir et d’installer une version de l’application du panneau, y compris une préversion. Ce choix s’applique à l’installation que vous lancez ; aucun canal de mise à jour n’est enregistré.

Android System WebView est maintenu séparément, via le Play Store, le micrologiciel du fabricant ou une installation manuelle, selon ce qui convient à votre panneau. Voir [mettre à jour le WebView système](/fr/hardware/guides/update-the-webview/).

### Panneaux qui ont besoin d’ADB

Lorsque vous installez une mise à jour depuis Home Assistant, Panel Assistant utilise automatiquement ADB pour les panneaux qui ne peuvent pas installer eux-mêmes la mise à jour. Si le panneau accepte la connexion sans appui sur son écran, votre consentement initial à l’installation de Panel Assistant couvre également la création et le stockage d’une clé ADB pour les futures mises à jour. Si le panneau exige une approbation sur son écran, Home Assistant affiche une réparation qui nomme le panneau et lance l’autorisation. Suivez cette réparation pour approuver la demande sur ce panneau.

### Un panneau qui ne peut pas être mis à jour

Certains panneaux ne peuvent être mis à jour que par ADB, car ils n’ont aucun moyen d’installer eux-mêmes une application. Sur ces panneaux, ADB n’est pas un simple confort : c’est le seul moyen de mise à jour, et s’il cesse de fonctionner, le panneau continue à fonctionner normalement tout en restant discrètement sur sa version actuelle. Home Assistant affiche alors une réparation qui nomme le panneau.

La cause habituelle est une modification effectuée sur le panneau plutôt que dans Home Assistant. Une mise à jour du micrologiciel du fabricant, une réinitialisation d’usine ou une option du fabricant qui rétablit le logiciel d’origine peuvent toutes désactiver à nouveau les options pour les développeurs d’Android, et donc ADB. Rien ne vous avertit sur le moment, car, du point de vue du panneau, tout fonctionne normalement.

Réactiver les options pour les développeurs et le débogage USB rétablit le moyen de mise à jour, et les étapes sont les mêmes que lors de la préparation initiale de ce panneau : voir [préparer un panneau](/fr/install/prepare-a-panel/#1-developer-options-and-debugging-are-on). L’accès à ces paramètres diffère selon les panneaux, et certains fabricants les cachent derrière une série d’appuis sur un écran À propos.

## Ce qu’une mise à jour protège

Panel Assistant vérifie le panneau avant de modifier quoi que ce soit et sauvegarde ses paramètres avant chaque mise à jour, en conservant les cinq dernières sauvegardes de chaque panneau.

Avant une modification dont vous n’êtes pas sûr, faites vous-même une sauvegarde : dans l’interface web du panneau, ouvrez **Installer**, puis **Sauvegarde**, et conservez le fichier `.hpb` téléchargé.

## Récupération

Lorsqu’un tableau de bord ne se charge plus après une mise à jour, la cause est généralement le WebView système ou le tableau de bord lui-même, et le panneau possède son propre comportement de [démarrage et récupération](/fr/manage/built-in-renderer/#startup-and-recovery) pour y faire face. [Dépannage](/fr/manage/troubleshooting/) présente les causes habituelles. Le retour à une version antérieure n’est pas actuellement décrit dans la documentation ; considérez donc un export de configuration comme votre moyen de revenir en arrière.

La récupération à un niveau inférieur à celui de l’application est une autre affaire. Panel Assistant ne touche jamais au micrologiciel d’un panneau, mais les partitions du micrologiciel de certains panneaux disposant d’un accès root peuvent être sauvegardées et restaurées manuellement, comme décrit dans [sauvegarde et restauration du micrologiciel](/fr/hardware/guides/firmware-backup-and-restore/).

:::danger
La restauration du micrologiciel est expérimentale et n’a pas été testée sur un appareil rendu inutilisable. Considérez toute intervention sur les partitions d’un panneau comme susceptible de le rendre inutilisable, et lisez ce document en entier avant de commencer.
:::
