---
title: Préparer le panneau
description: Ce dont un panneau a besoin avant l’installation de Panel Assistant, et la mise à jour de WebView qui détermine si le premier tableau de bord s’affiche correctement.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Une condition doit être remplie avant d’ajouter un panneau, et une seconde détermine si le premier tableau de bord s’affiche correctement. La méthode dépend de votre modèle et de votre micrologiciel.

## 1. Les options pour les développeurs et le débogage sont activés

L’installateur communique avec le panneau via l’interface de débogage d’Android, que les fabricants peuvent désactiver ou restreindre. Sur la plupart des panneaux, ouvrez **Paramètres**, puis **À propos**, et appuyez sept fois sur **Numéro de build** jusqu’à ce que le panneau indique que vous êtes développeur ; **Options pour les développeurs** apparaît alors dans les paramètres. Certains fabricants masquent ou renomment ces éléments ; les [pages consacrées au matériel](/fr/hardware/) donnent les étapes connues et signalent les procédures non vérifiées. Dans les options pour les développeurs, activez **Débogage USB** pour la [méthode USB](/fr/install/install-over-usb/), ou **ADB réseau sur le port TCP 5555** pour la méthode réseau. Tous les panneaux ne disposent pas d’un interrupteur ADB réseau ; la page matérielle de votre modèle l’indique. S’il n’y en a pas, utilisez la méthode USB une fois le débogage USB disponible. Si l’accès USB n’est pas non plus vérifié, demandez au fournisseur les instructions pour votre modèle et votre micrologiciel avant de choisir un installateur. L’accès root est distinct : une commande `adb root` suppose que le débogage fonctionne déjà. La fonction Débogage sans fil d’Android avec association est un autre mode de connexion, que cet installateur ne prend pas en charge.

Si le panneau vous demande d’autoriser la connexion, quelqu’un doit accepter cette invite sur l’écran du panneau ; elle ne peut pas être acceptée à distance.

Le panneau n’a pas besoin d’une adresse fixe : Panel Assistant suit un panneau dont l’adresse change.

## 2. Le WebView système est à jour

Le tableau de bord est dessiné par le WebView système du panneau, aussi appelé moteur de navigateur. Un ancien WebView peut laisser le tableau de bord vide ou partiellement affiché.

Dans la version 1.0.0-rc2 non encore publiée, les installateurs réseau et USB peuvent demander une mise à jour vérifiée et compatible du moteur de navigateur sur les panneaux pris en charge. Si cette mise à jour n’aboutit pas, la configuration et l’association restent disponibles. Une tentative inachevée peut être poursuivie depuis la Réparation de mise à jour du panneau dans Home Assistant : choisissez **Réessayer**. Elle vérifie le travail existant avant de demander une nouvelle tentative ; les mises à jour en échec ne sont pas relancées automatiquement selon un calendrier.

Dans cette version, l’assistant de configuration avertit lorsque le moteur de navigateur intégré est trop ancien. Vous pouvez terminer la configuration et l’association, mais le tableau de bord peut toujours ne pas s’afficher. Si le panneau ne peut pas installer la mise à jour, suivez [Mettre à jour le WebView système](/fr/hardware/guides/update-the-webview/).

## Avant toute modification irréversible

Panel Assistant ne reflashe rien et n’accorde pas d’accès root. Certains panneaux peuvent être rootés ou reflashés manuellement, avec des modifications parfois réversibles, parfois non. Si vous envisagez cette voie, lisez d’abord [Sécurité de l’installation](/fr/manage/install-safety/), puis [Mises à jour et récupération](/fr/manage/updates-and-recovery/) pour savoir ce qui peut être sauvegardé et ce qui ne peut pas l’être.
