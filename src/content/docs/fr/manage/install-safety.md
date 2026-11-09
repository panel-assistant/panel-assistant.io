---
title: Sécurité de l’installation
description: Ce que Panel Assistant vérifie avant de modifier un panneau, pourquoi une installation interrompue peut être relancée sans risque et ce qu’il sauvegarde avant une mise à jour.
sourceCommit: 761d6a72fee28ab8639a6dca9fa60452d2cb5ff7
---

Panel Assistant installe et met à jour les panneaux depuis Home Assistant. Il est conçu pour qu’une installation donne le même résultat, qu’elle s’exécute une seule fois ou qu’elle soit relancée après une interruption. Cette page décrit ses vérifications et les données qu’il conserve.

## Des vérifications avant toute modification

Les deux installateurs examinent le panneau avant de le modifier. L’installateur réseau vérifie ce qui est déjà présent et vous demande de confirmer l’installation. Un panneau qui exécute déjà l’application du panneau est adopté plutôt que réinstallé. L’installateur USB n’écrase pas une autre installation existante : si la compilation sélectionnée est déjà installée à l’identique, il termine sa configuration ; si une autre compilation est installée, il la reconnecte à Panel Assistant sans installer de mise à jour.

La version provient de votre propre Home Assistant. Home Assistant la vérifie avant de la transmettre à l’installateur : rien n’atteint donc le panneau sans avoir été vérifié par Home Assistant. [Installer par USB](/fr/install/install-over-usb/) et [Ajouter un panneau](/fr/install/installing-ha-paneld/) décrivent chaque méthode.

## Une installation peut être relancée sans risque

Une installation arrêtée en cours de route peut être relancée. Par USB, l’installateur conserve sa progression dans votre navigateur, vérifie d’abord l’étape interrompue, puis reprend à cet endroit au lieu de tout recommencer. Par le réseau, ajouter de nouveau le panneau avec la même adresse demande à Home Assistant de le vérifier à nouveau avant toute modification ; si l’application du panneau est déjà installée, Home Assistant la connecte sans rien installer.

Lorsque Home Assistant ne peut pas déterminer jusqu’où l’installation est allée, il s’arrête plutôt que de deviner, et son message le précise. Le [dépannage](/fr/manage/troubleshooting/#une-installation-réseau-sest-arrêtée-en-cours-de-route) explique chaque message et la marche à suivre.

## Une sauvegarde avant chaque mise à jour

Panel Assistant sauvegarde les paramètres du panneau avant chaque mise à jour et conserve les cinq dernières sauvegardes de chaque panneau. Après la mise à jour, il confirme que le panneau fonctionne de nouveau correctement.

Avant une modification dont vous n’êtes pas sûr, et toujours avant de supprimer l’application ou d’effacer ses données, faites vous-même une sauvegarde complète : dans l’interface web du panneau, ouvrez **Installer**, puis **Sauvegarde**, et vérifiez que le fichier `.hpb` téléchargé n’est pas vide. Il contient les paramètres, l’état persistant du panneau, le catalogue des profils et une connexion admissible conservée par une application de tableau de bord distincte. Le catalogue des entités apprises et les historiques de proximité et d’ambiance sont réappris plutôt que restaurés. Restaurez la sauvegarde via **Installer**, puis **Restaurer**, sur la même page.

## Ce que Panel Assistant laisse intact

Panel Assistant ne reflashe pas un panneau, ne lui donne pas l’accès root et ne touche jamais à son firmware. Sur certains panneaux disposant de l’accès root, la sauvegarde et la restauration du firmware constituent une opération manuelle distincte, décrite dans [sauvegarde et restauration du firmware](/fr/hardware/guides/firmware-backup-and-restore/). [Mises à jour et récupération](/fr/manage/updates-and-recovery/) explique ce qui peut être récupéré en cas de problème.
