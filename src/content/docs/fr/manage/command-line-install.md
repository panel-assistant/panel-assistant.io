---
title: Script d’installation (retiré)
description: L’installateur en ligne de commande n’installe et ne met plus à jour les panneaux. Qu’utiliser à la place et comment retirer ha-paneld d’un panneau.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

L’installateur en ligne de commande a été supprimé. Ajoutez et mettez à jour les panneaux avec Panel Assistant dans Home Assistant.

Ajoutez et mettez à jour les panneaux depuis [Home Assistant](/fr/install/installing-ha-paneld/) avec Panel Assistant. Un panneau installé avec le script continue de fonctionner. Ajoutez-le à Panel Assistant : il est connecté au lieu d’être réinstallé, puis Panel Assistant propose ses mises à jour.

## Rendre ADB accessible sur le réseau

Sur certains panneaux Tuya TPA10 et Smatek, ADB fonctionne d’abord uniquement par USB. Branchez le câble USB et activez ADB réseau avant d’ajouter le panneau dans Home Assistant :

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

## Retirer ha-paneld d’un panneau

Choisissez l’option **Retirer Panel Assistant de ce panneau**, sous **Configurer** dans Home Assistant. Dans la version 1.0.0-rc1, choisissez si Home Assistant doit oublier le panneau, puis sélectionnez **Valider**. Dans la version 1.0.0-rc2 non encore publiée, l’option s’appelle **Retirer de ce panneau** et une suppression réussie supprime toujours son entrée Home Assistant. Panel Assistant rend au panneau son écran d’accueil d’origine et désinstalle l’application du panneau. Lisez d’abord [Avant de retirer ha-paneld](/fr/manage/removal-risks/).

## Voies d’accès et mode de sécurité

Les recommandations des profils matériels sont uniquement informatives. Choisir un profil ne constitue pas un consentement à désactiver des paquets, rendre ADB persistant, installer des logiciels privilégiés ou modifier les réglages de l’écran. Les paquets que vous avez déjà maîtrisés sur la carte [Paquets du fabricant](/fr/manage/vendor-packages/) le sont à nouveau à chaque démarrage.

Le [mode de sécurité renforcé](/fr/manage/security-mode/) exige qu’une personne présente devant le panneau approuve certaines actions à distance à fort impact. Il ne peut être activé que sur le panneau. ADB réseau est inutilisable lorsqu’il est activé : repassez donc le panneau en mode Assoupli sur le panneau avant toute installation ou mise à jour via ADB.

## Compiler vous-même

L’application est libre et open source ; la page [Environnement de développement](/fr/reference/development-environment/) explique comment la compiler.
