---
title: Installer par USB
description: Mettre en service un panneau neuf depuis votre navigateur avec un câble USB, avant de le fixer au mur.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

La méthode USB s’adresse à un panneau encore dans sa boîte ou dont le logiciel du fabricant complique l’accès réseau. Branchez le panneau à l’ordinateur devant lequel vous êtes installé : votre navigateur installe l’application du panneau directement par le câble. Le panneau n’a pas besoin d’ADB sur le réseau. Votre navigateur doit rester connecté à Home Assistant, qui fournit la version vérifiée. La plupart des gens ne l’utilisent qu’une seule fois, avant de fixer le panneau.

## Tout commence dans Home Assistant

L’installateur USB est lancé depuis Home Assistant par un administrateur : allez dans **Paramètres**, **Appareils et services**, **Ajouter une intégration**, choisissez **Panel Assistant**, puis **Installer par USB sur cet ordinateur**. Le lien **Ajouter un panneau** sur la page Panel Assistant de la barre latérale ouvre le même choix. Home Assistant vérifie la version publiée et la transmet à l’installateur, qui s'ouvre dans sa propre fenêtre sécurisée. C'est pourquoi ce site ne comporte pas de bouton d'installation : la page qui effectue l'installation accepte uniquement une version publiée provenant de votre propre Home Assistant. Ainsi, rien n'est installé sur votre panneau sans avoir été vérifié par Home Assistant.

## Ce qu'il vous faut

- L'[intégration](/fr/home-assistant/custom-integration/) installée et un compte administrateur.
- Un navigateur basé sur Chromium, comme Chrome ou Edge. Firefox et Safari ne peuvent pas communiquer avec les périphériques USB.
- Un câble USB reliant le panneau à l'ordinateur ou au téléphone sur lequel ce navigateur fonctionne. Pas au serveur Home Assistant.
- Le débogage USB activé dans les options pour les développeurs du panneau. Si le panneau affiche une demande d’autorisation lors de la connexion, quelqu’un doit l’accepter sur son écran ; certains panneaux ne la demandent jamais. Les [pages consacrées au matériel](/fr/hardware/) indiquent comment accéder aux options pour les développeurs sur chaque modèle.

## Le déroulement

1. Sélectionnez **Ouvrir l’installateur USB**. Sur la page qui s’ouvre, conservez la version recommandée et appuyez sur **Continuer**. Home Assistant propose les versions compatibles les plus récentes qu’il peut vérifier. Les versions de test sont signalées et proposées lorsque l’intégration en cours d’exécution les autorise.
2. L’installateur s’ouvre dans une nouvelle fenêtre et vérifie la version publiée. Appuyez sur **Trouver mon panneau** et choisissez le panneau dans la liste du navigateur.
3. Si le panneau vous demande d’autoriser le débogage USB, cochez **Toujours autoriser depuis cet ordinateur** et approuvez la demande sur l’écran du panneau. Certains panneaux ne demandent rien et l’installateur poursuit directement.
4. Confirmez. Rien ne change sur le panneau avant votre confirmation. L’installateur refuse d’écraser une installation existante différente ; si la version compilée exacte que vous avez sélectionnée est déjà installée, il termine sa configuration.
5. Gardez le câble branché et la fenêtre ouverte jusqu’à ce que l’installateur annonce la fin de l’opération. La même fenêtre passe ensuite à l’assistant de configuration du panneau, dans lequel vous terminez. Le panneau héberge l’assistant : l’ordinateur doit donc être sur le même réseau que le panneau.

Si le câble se débranche pendant l’opération, rebranchez-le, attendez que le panneau démarre, appuyez sur le bouton de l’écran d’erreur de l’installateur, puis sur **Trouver mon panneau**. Si la fenêtre de l’installateur a été fermée, recommencez depuis Home Assistant et choisissez la même version. Dans les deux cas, l’installateur conserve sa progression dans votre navigateur, vérifie toute étape interrompue avant de faire quoi que ce soit d’autre et reprend à cet endroit au lieu de recommencer depuis le début.

## Ensuite

L’application fonctionne sur le panneau. Un panneau tout juste sorti de sa boîte n’est pas encore sur votre réseau : connectez-le à votre Wi-Fi depuis sa propre application Paramètres, avant ou après l’installation, car son assistant de configuration et sa connexion à Home Assistant en ont tous deux besoin. Si le panneau n’apparaît pas dans Home Assistant une fois sa configuration terminée, allez dans **Paramètres**, **Appareils et services**, **Ajouter une intégration**, choisissez **Panel Assistant**, puis **Ajouter un panneau de votre réseau**, et saisissez l’adresse du panneau. L’installateur USB ne met pas à jour un panneau sur lequel l’application est déjà installée ; pour cela, voir [Mises à jour et récupération](/fr/manage/updates-and-recovery/).
