---
title: Comment ça fonctionne
description: Ce que Panel Assistant apporte à un panneau, ce qui reste dans Home Assistant et pourquoi tout peut être open source.
sourceCommit: f84c3d3fbf79006c96fdb0539ba346aaa9ff6435
---

Panel Assistant comporte deux parties. L’une se trouve dans Home Assistant et correspond à ce que vous voyez et utilisez. L’autre se trouve sur chaque panneau et le rend rapide.

## Dans Home Assistant: l’intégration

L’intégration est ce que vous installez via HACS. C’est là que vous ajoutez un panneau, que chaque panneau apparaît comme un appareil avec son propre état et ses diagnostics, et qu’une page Panel Assistant dans la barre latérale réunit tous vos panneaux en indiquant pour chacun s’il est joignable, quelle version il exécute et si quelque chose demande votre attention.

Elle sert aussi de programme d’installation. Indiquez-lui l’adresse d’un panneau neuf, ou branchez un panneau neuf à votre ordinateur portable, et elle vérifie ce qui est présent, installe l’application du panneau, la lance et crée l’appareil seulement ensuite. Si un panneau exécute déjà l’application, elle l’adopte à la place.

## Sur le panneau: l’application

Un panneau mural est un petit ordinateur Android, et si la plupart semblent lents, c’est à cause du logiciel fourni avec eux. Panel Assistant remplace la partie de ce logiciel qui compte par sa propre application, qui fait trois choses.

- **Affiche votre tableau de bord.** L’application charge elle-même votre tableau de bord Home Assistant existant, détermine quelles entités il affiche réellement et ne demande que celles-ci à Home Assistant. Sur un panneau bon marché, cela explique l’essentiel de la différence entre une interface qui répond avec retard et une interface sans retard.
- **Pilote le matériel du panneau.** L’écran, sa luminosité et sa mise en veille, les LED, boutons, relais, capteurs de proximité et de luminosité, ainsi que tout autre équipement du modèle sont pilotés directement et apparaissent dans Home Assistant comme des entités de l’appareil correspondant au panneau. Chaque modèle est décrit par un profil matériel: du texte brut que vous pouvez lire, modifier et valider dans votre navigateur sur le panneau, sans outils de développement. Un panneau que le projet n’a jamais rencontré démarre avec le profil prudent Generic, qui lui fournit le tableau de bord, les capteurs, la luminosité, l’audio et la navigation que tout appareil Android peut proposer, puis acquiert le reste à mesure que son profil est complété. Le panneau en fonctionnement vérifie chaque capacité déclarée avant de l’utiliser. Une fonction absente est donc affichée comme verrouillée avec une explication, au lieu de rester en panne, et un profil qui échoue au démarrage est remplacé par le dernier qui fonctionnait.
- **Se comporte comme un appareil ménager.** L’application remplace le lanceur du fabricant, permet de naviguer à l’écran sur un panneau sans boutons, propose sa propre page d’état sur votre réseau et se rétablit toute seule quand quelque chose va mal. Vous pouvez ainsi installer un panneau une fois et le laisser fonctionner sans intervenir.

Cette application s’appelle ha-paneld. Ce nom vient de son histoire comme service d’assistance en arrière-plan dont dépendaient d’autres logiciels de tableaux de bord. Elle a depuis évolué pour prendre en charge toute la partie du produit qui se trouve sur le panneau. Vous rencontrerez ce nom dans la documentation de référence et sur la propre page d’état du panneau. Il est utile de le connaître pour éviter les surprises, mais vous n’avez jamais à le saisir ni à y penser pour utiliser Panel Assistant.

## Pourquoi tout peut être open source

La plupart des fabricants de panneaux fournissent leur prise en charge du matériel sous forme de bibliothèques fermées que seule leur propre application est autorisée à utiliser. ha-paneld ne les utilise pas. Il pilote directement le matériel de chaque panneau grâce à ses propres profils par modèle, ce qui a demandé beaucoup de travail et explique pourquoi le projet prend en charge le matériel. C’est aussi ce qui permet de tout distribuer gratuitement: aucun code de fabricant n’est inclus, donc rien n’empêche de proposer l’ensemble gratuitement et en open source sous des licences permissives, pour toutes les marques de panneaux.

Pour la même raison, c’est pour la prise en charge du matériel que le projet a le plus besoin d’aide. Chaque panneau qui se manifeste, qu’il fonctionne ou non, améliore le profil suivant. Voir [Choisir un panneau](/fr/install/supported-panels/) pour connaître l’état actuel de la prise en charge.

## Où se trouvent les éléments

| Élément                    | Ce que c’est                                                                                              | Où                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Panel Assistant            | L’intégration Home Assistant: programme d’installation, appareils et page regroupant tous les panneaux.   | [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) |
| ha-paneld                  | L’application sur le panneau: tableau de bord, matériel, lanceur et page d’état.                          | [panel-assistant/android](https://github.com/panel-assistant/android)               |
| Profils matériels          | Les descriptions par modèle qui indiquent à l’application ce qu’un panneau possède et comment le piloter. | [Référence du matériel](/fr/hardware/)                                              |
| Documentation de référence | L’API, les profils matériels et le modèle de sécurité en détail.                                          | [Référence](/fr/reference/api/)                                                     |

## Ce que ce n’est pas

Le produit est destiné aux panneaux muraux dédiés. Les tablettes et les téléphones peuvent l’exécuter, mais tout appareil avec une batterie a besoin d’un câble, et la conception suppose un panneau alimenté sur secteur, configuré une fois puis laissé fonctionner sans intervention. Ce n’est pas un outil de création de tableaux de bord; il affiche ceux que vous avez déjà. Et il n’est pas terminé: l’objectif est une prise en charge universelle du matériel et la gestion de tous les panneaux sans intervention.
