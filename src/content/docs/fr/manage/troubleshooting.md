---
title: Dépannage
description: Les problèmes courants d’un panneau mural et les premiers points à vérifier.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Commencez par l’appareil correspondant au panneau dans Home Assistant, qui propose un capteur d’état et un téléchargement des diagnostics, ainsi que par la page d’état du panneau à son adresse sur le port 8888 : son rapport `/diag` répond à la plupart des questions ci-dessous sans devoir deviner.

Pour voir ce que fait le panneau au moment où cela se produit, l’onglet **Journaux** de cette page diffuse en direct le journal de l’application du panneau, en masquant les jetons et les mots de passe.

![L’onglet Journaux de l’interface web du panneau, qui diffuse en direct le journal de l’application du panneau avec un champ de filtrage et les commandes Suivre et Pause](/screenshots/ui-logs-dark.png)

## Le tableau de bord est vide, partiellement affiché ou rempli d’erreurs de script

Vérifiez d’abord le WebView système. C’est de loin la cause la plus fréquente d’échec lors de la première utilisation, et un ancien WebView produit exactement ces symptômes tout en donnant l’impression que l’application du panneau est en cause. La procédure figure dans [Mettre à jour le WebView système](/fr/hardware/guides/update-the-webview/).

Si le WebView est à jour, la section [démarrage et récupération](/fr/manage/built-in-renderer/#startup-and-recovery) explique ce que fait le panneau lorsqu’un tableau de bord ne se charge pas et comment en connaître la raison.

## Le tableau de bord est lent

Cela tient en partie au panneau et en partie au tableau de bord. [Performances](/fr/manage/performance/) explique ce que la page d’état du panneau peut mesurer et ce qui aide généralement, et la [référence du matériel](/fr/hardware/) classe les panneaux pris en charge pour vous aider à savoir si vous en demandez trop au matériel.

## L’installateur ne peut pas joindre le panneau

Sur le réseau : vérifiez l’adresse du panneau et que l’accès ADB sur le réseau, sur le port TCP 5555, est toujours activé, car certains panneaux le désactivent à nouveau après un redémarrage. Si le panneau affiche une demande d’autorisation, acceptez-la sur son écran. Par USB : assurez-vous d’utiliser un navigateur basé sur Chromium, que le câble est relié à l’ordinateur qui exécute le navigateur et que le débogage USB est activé. L’accès aux options pour les développeurs et l’activation du débogage varient selon le modèle et sont décrits dans [Préparer le panneau](/fr/install/prepare-a-panel/) et les [pages consacrées au matériel](/fr/hardware/). Si le panneau refuse toute connexion réseau, [installez par USB](/fr/install/install-over-usb/) à la place : le panneau n’a pas besoin d’ADB sur le réseau, tandis que votre navigateur reste connecté à Home Assistant pour obtenir la version vérifiée.

## Le matériel du panneau n’apparaît pas dans Home Assistant

Si certaines entités apparaissent et d’autres non, cela tient généralement au profil matériel du modèle plutôt qu’à un problème de connexion. Les [pages consacrées au matériel](/fr/hardware/) indiquent ce que chaque panneau expose.

## Autre problème

Si la réponse ne figure ni sur ce site ni dans la documentation de référence vers laquelle il renvoie, posez votre question dans les [tickets de l’intégration](https://github.com/panel-assistant/ha-integration/issues) ou, pour tout ce qui concerne l’application du panneau elle-même, dans les [tickets de ha-paneld](https://github.com/panel-assistant/android/issues). Indiquez le modèle du panneau, la version figurant sur la page de l’appareil correspondant au panneau et le fichier de diagnostics, car toute réponse commencera par ces trois éléments. Les diagnostics sont déjà expurgés, mais relisez-les avant de les publier et supprimez tout ce qui permet encore d’identifier votre panneau, votre réseau ou votre installation Home Assistant.
