---
title: Installer par USB
description: Mettre en service un panneau neuf depuis votre navigateur avec un câble USB, avant de le fixer au mur.
sourceCommit: ddee491d1892568fda8e9bb47f003b2333e3b666
---

L'installation par USB s'adresse à un panneau encore dans sa boîte, ou dont le logiciel du fabricant complique l'accès par le réseau. Branchez le panneau à l'ordinateur que vous utilisez : votre navigateur installe l'application du panneau directement par le câble. Rien ne transite par votre réseau, et le serveur Home Assistant n'a jamais besoin d'accéder au panneau. La plupart des utilisateurs n'emploient cette méthode qu'une seule fois, avant de monter le panneau.

## Tout commence dans Home Assistant

Un administrateur ouvre l'installateur USB depuis la page Panel Assistant, dans la barre latérale de Home Assistant. Home Assistant vérifie la version publiée et la transmet à l'installateur, qui s'ouvre dans sa propre fenêtre sécurisée. C'est pourquoi ce site ne comporte pas de bouton d'installation : la page qui effectue l'installation accepte uniquement une version publiée provenant de votre propre Home Assistant. Ainsi, rien n'est installé sur votre panneau sans avoir été vérifié par Home Assistant.

## Ce qu'il vous faut

- L'[intégration](/fr/home-assistant/custom-integration/) installée et un compte administrateur.
- Un navigateur basé sur Chromium, comme Chrome ou Edge. Firefox et Safari ne peuvent pas communiquer avec les périphériques USB.
- Un câble USB reliant le panneau à l'ordinateur ou au téléphone sur lequel ce navigateur fonctionne. Pas au serveur Home Assistant.
- Le débogage USB activé dans les options pour les développeurs du panneau, et une personne devant le panneau pour accepter la demande d'autorisation lorsqu'elle apparaît. Les [pages consacrées au matériel](/fr/hardware/) indiquent comment accéder aux options pour les développeurs sur chaque modèle.

## Le déroulement

1. Choisissez une version sur la page Panel Assistant. Seules les versions publiées de ha-paneld que Home Assistant peut vérifier pour l'installation sont proposées : la dernière version stable, ainsi que les éventuelles versions candidates récentes, signalées comme versions de test.
2. La fenêtre de l'installateur vérifie la version publiée et vous demande de sélectionner le panneau dans la boîte de dialogue USB du navigateur.
3. Acceptez la demande de débogage USB sur l'écran du panneau.
4. Confirmez. Rien ne change sur le panneau avant votre confirmation. L'installateur vérifie d'abord que le panneau est réellement dépourvu d'une installation existante : il refuse d'installer par-dessus une installation déjà présente pour ne pas mettre les données du panneau en danger.
5. Gardez le câble branché et l'onglet connecté jusqu'à ce que l'installateur annonce la fin de l'opération, puis terminez la configuration guidée sur le panneau lui-même.

Si le câble se débranche ou si la fenêtre se ferme pendant l'opération, rebranchez le câble, transférez de nouveau la même version publiée depuis Home Assistant et reconnectez le même panneau. L'installateur conserve sa progression dans votre navigateur, vérifie toute étape interrompue avant de faire quoi que ce soit d'autre et reprend à cet endroit au lieu de recommencer depuis le début.

## Ensuite

L'application fonctionne sur le panneau, qui est prêt à être ajouté à Home Assistant comme appareil. L'installateur USB ne met pas à jour un panneau qui possède déjà l'application ; pour cela, consultez [Mises à jour et récupération](/fr/manage/updates-and-recovery/).
