---
title: Dépannage
description: Les problèmes courants d’un panneau mural et les premiers points à vérifier.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
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

## Une installation réseau s’est arrêtée en cours de route

Lorsque Home Assistant arrête une installation réseau, son message indique jusqu’où l’installation est allée. Retrouvez ci-dessous la phrase qui correspond à votre message. Dans tous les cas, ne désinstallez pas Panel Assistant, n’effacez pas ses données et ne réinitialisez pas le panneau : c’est l’état du panneau qui permet de savoir où l’installation s’est arrêtée.

### Aucun APK n’a été installé

Si le message indique qu’aucun APK n’a été installé ou qu’aucune modification n’a été apportée au panneau, l’installation s’est arrêtée avant de changer quoi que ce soit. Vérifiez que le panneau est allumé et connecté à votre réseau à la même adresse, puis ajoutez de nouveau l’intégration Panel Assistant et saisissez la même adresse. Home Assistant vérifie de nouveau le panneau avant toute modification. Si l’installation s’arrête au même endroit une deuxième fois, regardez le panneau et suivez la section suivante si Panel Assistant y est présent.

### Installé, mais pas démarré ou vérifié

Si le message indique que l’APK est installé mais que Panel Assistant n’a pas démarré ou n’a pas réussi sa vérification, l’application est sur le panneau et seule la dernière étape manque. Ouvrez Panel Assistant depuis la liste des applications du panneau et attendez son écran de configuration. Ajoutez ensuite de nouveau l’intégration Panel Assistant avec la même adresse : lorsque l’application répond, Home Assistant propose de la connecter (« Panel Assistant est installé mais pas connecté ») et n’installe rien. Si Home Assistant indique que l’application installée n’est pas la version que vous avez choisie, choisissez la version installée, indiquée dans les paramètres Android du panneau sous Applications › Panel Assistant. Si Panel Assistant ne s’ouvre pas ou si son écran de configuration n’apparaît jamais, ne relancez pas l’installation automatique : demandez de l’aide comme indiqué dans la section suivante.

### L’installation a peut-être modifié le panneau

Si le message indique que l’installation a peut-être modifié le panneau, que Home Assistant n’a pas pu vérifier le résultat ou qu’il ne peut pas prouver qu’il est sûr de continuer, Home Assistant n’a pas pu déterminer jusqu’où le panneau est allé et s’arrête donc plutôt que de deviner. Ne relancez pas encore l’installation automatique. Regardez d’abord le panneau : si l’écran de configuration ou le tableau de bord de Panel Assistant est affiché, ou si l’application s’ouvre depuis la liste des applications du panneau, suivez la section précédente pour le connecter. Si Panel Assistant n’est pas sur le panneau, demandez de l’aide dans les [tickets de l’intégration](https://github.com/panel-assistant/ha-integration/issues) et indiquez le modèle du panneau, la version que vous avez choisie, le message complet et les lignes du journal Home Assistant correspondant à l’installation (recherchez `panel_assistant` dans le journal).

## Le matériel du panneau n’apparaît pas dans Home Assistant

Si certaines entités apparaissent et d’autres non, cela tient généralement au profil matériel du modèle plutôt qu’à un problème de connexion. Les [pages consacrées au matériel](/fr/hardware/) indiquent ce que chaque panneau expose.

## Autre problème

Si la réponse ne figure ni sur ce site ni dans la documentation de référence vers laquelle il renvoie, posez votre question dans les [tickets de l’intégration](https://github.com/panel-assistant/ha-integration/issues) ou, pour tout ce qui concerne l’application du panneau elle-même, dans les [tickets de ha-paneld](https://github.com/panel-assistant/android/issues). Indiquez le modèle du panneau, la version figurant sur la page de l’appareil correspondant au panneau et le fichier de diagnostics, car toute réponse commencera par ces trois éléments. Les diagnostics sont déjà expurgés, mais relisez-les avant de les publier et supprimez tout ce qui permet encore d’identifier votre panneau, votre réseau ou votre installation Home Assistant.
