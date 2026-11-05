---
title: Obtenir l’accès adb et root
description: Comment chaque panneau mural documenté accède à adb et root, à quoi sert root dans l’application du panneau et où trouver la procédure exacte de chaque modèle.
sidebar:
  label: Accès adb et root
  order: 1
sourceCommit: f49bf12954ed3e89e5e32d635b4bbcb06095cf9b
---

Chaque panneau accède à adb, et à root lorsqu’il le possède, par une voie différente. Cette page donne une vue générale ; les étapes exactes propres au micrologiciel figurent sur la page de chaque panneau.

## À quoi sert root

L’application du panneau s’installe et fonctionne sans root. Root n’intervient que pour le matériel qu’Android n’expose pas à une application ordinaire :

- **Nœuds sysfs et d’entrée appartenant à `system`.** Sur certains panneaux, les LED, le rétroéclairage des boutons et les capteurs climatiques sont des fichiers `system:system` qu’une application isolée ne peut ni écrire ni lire. L’application du panneau communique alors avec un petit démon d’assistance root, `hapaneld-helper`, via un socket Unix. Voir la [documentation de l’assistant](https://github.com/panel-assistant/android/blob/main/helper/README.md).
- **Extinction réelle du rétroéclairage, redémarrage et contrôle du gouverneur du processeur.** Sans voie root, ces fonctions utilisent ce qu’Android permet, par exemple une luminosité nulle au lieu de couper l’alimentation du rétroéclairage.
- **Relais et lignes GPIO**, lorsque le panneau ne les expose que via sysfs root.

L’application du panneau vérifie chaque voie privilégiée au moment de l’utiliser : un panneau sans root conserve donc le tableau de bord, les capteurs standard, la luminosité et la navigation ; une capacité nécessitant root apparaît indisponible plutôt que d’échouer.

## Méthodes par panneau

- **[Sonoff NSPanel Pro](/fr/hardware/panels/sonoff/#gaining-adb-and-root-access).** Une compilation `userdebug` avec des clés de test et **sans mot de passe adb**. La seule difficulté est d’atteindre le mode développeur, ce qui varie selon le micrologiciel eWeLink. Ensuite, `adb root`, remontage et installation d’un `su` persistant.
- **[Tuya TPA10](/fr/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access).** adb est **protégé par un mot de passe**. La voie fiable est la porte dérobée de l’application de diagnostic USB, et `su` est déjà présent. Un court script rend ensuite adb réseau persistant après redémarrage.
- **[Electron WF1589T](/fr/hardware/panels/electron/wf1589t/#gaining-adb-and-root-access).** Une compilation `userdebug` avec Google Play. `adb root` fonctionne directement. La LED est accessible directement par l’application, donc root est rarement nécessaire.
- **[Electron WF2489T (ZHICAI SMT1019)](/fr/hardware/panels/electron/wf2489t/#root-access-by-firmware-build).** La compilation de production vendue au détail n’a pas root. La compilation fournisseur `userdebug` est rootée, mais nécessite un remontage avant que l’assistant puisse persister.
- **[SMT156](/fr/hardware/panels/electron/smt156/).** Aucun `su` accessible à l’application sur l’installation signalée. `adb root` par USB, le mode d’ingénierie du fabricant et les méthodes de déverrouillage persistant n’ont pas été testés.
- **[Smatek S9E](/fr/hardware/panels/smatek/s9e/).** L’application du fabricant exécute des commandes root et certains exemplaires sont livrés avec le mode développeur déverrouillé. Un `su` accessible à l’application a été signalé sur le micrologiciel 1.1.0 ; l’accès dépend toujours de l’exemplaire et du micrologiciel.
- **[Shelly Wall Display](/fr/hardware/panels/shelly/).** Sur un [Wall Display X2i](/fr/hardware/panels/shelly/wall-display-x2i/) testé avec le micrologiciel d’usine 2.5.4, les options pour les développeurs et le débogage USB se déverrouillent depuis l’application Paramètres ; adb se connecte ensuite sans invite d’autorisation, et root est absent : pas de `su`, et `adb root` est indisponible. L’installation et l’utilisation quotidienne de l’application du panneau n’y nécessitent pas root, mais les fonctions privilégiées de cette page en ont besoin. Les autres modèles n’ont pas été testés ; l’ancien micrologiciel cible une base `userdebug`, donc `adb root` pourrait y fonctionner si une connexion adb peut être établie.

## Avant toute modification

- Faites fonctionner adb de façon fiable, idéalement sur le réseau avec la clé de votre poste préautorisée, avant de désactiver une application du fabricant. Désactiver d’abord un lanceur, une application de paramètres ou de matériel du fabricant peut vous bloquer l’accès au panneau.
- Conservez un moyen de navigation. Sur un panneau sans boutons, les actions de navigation de l’application du panneau remplacent Retour et Applications récentes du fabricant.
- Vérifiez ce qu’une mise à jour du fabricant modifie avant de décider de la reporter : les mises à jour peuvent annuler les modifications d’accès, mais aussi corriger des failles de sécurité. Voir [Mises à jour du micrologiciel et capacités](/fr/hardware/firmware/#firmware-updates-and-capabilities) et [Arrêter les mises à jour indésirables](/fr/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Sauvegardez les partitions avant de modifier le micrologiciel d’un panneau Rockchip rooté. Voir [Sauvegarde et restauration du micrologiciel](/fr/hardware/guides/firmware-backup-and-restore/).
- Certaines méthodes nécessitent `adb disable-verity`, qui redémarre le panneau. Un panneau protégé par un code PIN ne peut pas relancer ses applications après un redémarrage tant que quelqu’un ne saisit pas le code : soyez donc devant le panneau.

## Voies d’accès potentielles sur d’autres micrologiciels

[CVE-2026-43499](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/43xxx/CVE-2026-43499.json) est une faille d’élévation de privilèges du noyau Linux exploitable par du code déjà en cours d’exécution localement. Elle constitue une piste de recherche pour d’autres familles de panneaux actuelles et futures, pas seulement Meta Portal. La version du noyau ne suffit pas à elle seule à établir l’existence d’une voie d’accès utilisable sur une compilation du fabricant : les correctifs, la configuration du noyau et les restrictions de l’appareil doivent être vérifiés.

Distinguez trois questions : un propriétaire peut-il d’abord installer ou exécuter du code ; ce code peut-il obtenir les privilèges du noyau ; et l’application du panneau peut-elle utiliser l’accès ainsi obtenu, y compris après un redémarrage ? Des privilèges temporaires pourraient faciliter l’installation, rendre ADB moins contraignant à utiliser, modifier des paramètres d’administration ou permettre l’accès à du matériel soumis à des restrictions. Ils ne fournissent pas à eux seuls un accès root persistant ni un assistant accessible à l’application.

Les [recherches sur Meta Portal](/fr/hardware/panels/meta/#cve-2026-43499-and-community-provisioning) constituent un exemple avec des cibles exactes signalées et des limites explicites. Il ne s’agit ni d’un programme d’installation générique de Panel Assistant ni d’une capacité nouvellement fournie. L’applicabilité à Shelly et les compilations corrigées des fabricants n’ont pas été établies. L’installation normale et l’utilisation quotidienne restent sans root lorsque le panneau les prend en charge.
