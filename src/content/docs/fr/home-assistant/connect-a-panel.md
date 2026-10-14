---
title: Connecter un panneau
description: Afficher votre tableau de bord sur le panneau et comprendre comment le matériel du panneau apparaît dans Home Assistant.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Un panneau ajouté à Home Assistant s’y connecte de deux façons. L’une affiche un tableau de bord à l’écran. L’autre intègre le matériel du panneau sous forme d’entités.

## Le tableau de bord à l’écran

Ouvrez la page d’état du panneau dans votre navigateur, à son adresse sur le port 8888, et choisissez le tableau de bord que vous souhaitez afficher au mur. Le panneau charge lui-même ce tableau de bord. Lorsque le [filtrage des entités est activé](/fr/manage/performance/), il apprend quelles entités le tableau de bord utilise et ne demande que celles-ci à Home Assistant. La page consacrée au [moteur de rendu intégré](/fr/manage/built-in-renderer/) détaille le chargement du tableau de bord et le comportement du panneau si celui-ci ne se charge pas.

## Le matériel du panneau dans Home Assistant

L’écran, les LED, les boutons, les capteurs et les relais de votre modèle apparaissent dans Home Assistant comme des entités de l’appareil correspondant au panneau, afin qu’un bouton physique puisse déclencher une automatisation et qu’une LED puisse afficher l’état de n’importe quel élément. Les entités disponibles dépendent du profil matériel du modèle ; les [pages consacrées au matériel](/fr/hardware/) indiquent ce que chaque panneau expose.

## La page d’état du panneau

Chaque panneau sert sa propre page sur votre réseau local, sur le port 8888. Vous y choisissez le tableau de bord, voyez ce que fait le panneau et lisez son rapport de diagnostic. Elle est conçue pour un réseau domestique de confiance : traitez donc l’accès à cette page de la même manière que l’accès au panneau lui-même. La [référence de l’API](/fr/reference/api/) et le [mode de sécurité](/fr/manage/security-mode/) décrivent ses possibilités et son modèle de confiance.
