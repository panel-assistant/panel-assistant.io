---
title: Meta Portal 10" (2e génération)
description: Caractéristiques et conseils d’achat pour le Meta Portal 10 pouces (2e génération), modèle WD50JM, un écran connecté Qualcomm QCS605 sous Android 10, mesuré sur un appareil physique exécutant Panel Assistant sans root.
vendor: Meta
model: Portal 10" (2nd gen), WD50JM
soc: Qualcomm QCS605
android: '10'
screen: 10.1 in, 1280 × 800
support: Préliminaire
root: Sans root ; le commutateur ADB de Meta suffit pour la configuration
webview: WebView Chromium 131 propre à Meta
released: '2019'
evidence: [bench, firmware, documented]
sidebar:
  label: Portal 10" (2e génération)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Tout ce qui figure sur cette page a été mesuré sur un seul Portal 10" (2e génération) du commerce**, sous le micrologiciel Meta `QKQ1.210213.001.3051355900018050` (Android 10, correctif de sécurité 2020-08-05), exécutant Panel Assistant sans root. La prise en charge du Portal exige la version 1.0 ou ultérieure de l’application du panneau. Rien n’a été vérifié ici sur un autre modèle Portal ; voir la [page de la famille Meta Portal](/fr/hardware/panels/meta/) pour les autres modèles.
:::

Le Portal 10" (2e génération), modèle **WD50JM**, est un écran connecté paysage de 10.1 pouces sur Qualcomm QCS605 avec environ 3 GB de RAM, une caméra 13 MP avec son propre voyant, deux microphones, un haut-parleur et un curseur physique de confidentialité. Le [commutateur ADB](#activer-adb) de Meta suffit à Panel Assistant : l’application s’installe par USB, reconnaît le Portal et charge son profil matériel. Tableau de bord, caméra, microphone, mot de réveil, réponses vocales, capteur de lumière et véritable extinction de l’écran fonctionnent sans root.

C’est un bon panneau avec des conditions inhabituelles, principalement imposées par Meta. Celles à connaître avant de dépenser de l’argent figurent dans [Avant l’achat](#avant-lachat).

:::tip
Les faits essentiels : **gardez le compte Meta connecté**, car le commutateur ADB est protégé par son code PIN. **Le commutateur ADB a le même aspect activé ou désactivé** : vérifiez son état sur votre ordinateur. **Prévoyez de réactiver ADB après un redémarrage**, et le débogage réseau utilisé par Panel Assistant pour les mises à jour ne survit jamais à un redémarrage. Pour réinitialiser, maintenez **les deux boutons de volume en branchant l’alimentation, sans ordinateur connecté par USB**.
:::

## Également vendu sous les noms

Meta Portal, Facebook Portal, Portal (2nd gen), Portal 10", modèle WD50JM. Android indique le modèle `Portal`, l’appareil et la carte `omni`, le produit `omni_prod`, le fabricant et la marque `Facebook`, la plateforme matérielle `atlas`.

|                 |                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC             | Qualcomm **QCS605**, 8 cœurs                                                                                                                                 |
| RAM             | Environ **3 GB** (Android indique 2.85 GB)                                                                                                                   |
| Stockage        | 6.7 GB pour applications et données, environ 3.9 GB libres après configuration ; aucun emplacement de carte mémoire                                          |
| Écran           | **1280×800** paysage, 10.1 pouces, **environ 149 ppi**, à la densité de base Android de 160 dpi. Contrôleur tactile FocalTech avec réveil par double toucher |
| Android         | 10 (API 29), version de production `user`, SELinux enforcing ; arm64-v8a                                                                                     |
| WebView         | Version WebView propre à Meta, Chromium **131**, maintenue à jour par l’outil de mise à jour en arrière-plan de Meta. Aucune intervention WebView nécessaire |
| Capteurs        | **Accéléromètre** et inclinaison ; **lumière ambiante avec couleur**. **Aucun capteur de proximité**                                                         |
| Caméra          | Capteur **13 MP** en haut à gauche du cadre, avec un **voyant vert** voisin. Les applications comme celle du panneau disposent de 1280×720                   |
| Audio           | **Deux microphones**, un haut-parleur                                                                                                                        |
| Confidentialité | **Curseur à trois positions** : caméra et microphones actifs ; caméra couverte ; caméra couverte et microphones coupés                                       |
| Boutons         | Volume haut et bas. Aucun bouton d’alimentation                                                                                                              |
| Radios          | Wi-Fi, Bluetooth avec **Bluetooth Low Energy**                                                                                                               |
| Connecteurs     | **USB-C**, utilisé pour ADB                                                                                                                                  |
| Root            | Aucun. Aucun `su`, aucun déverrouillage de chargeur de démarrage connu. ADB provient du réglage Debug de Meta                                                |
| Sortie          | 2019 (annoncé en septembre, commercialisé en octobre)                                                                                                        |

## Avant l’achat

Aucun de ces points n’interdit d’acheter un Portal, mais mieux vaut les connaître à l’avance.

- **Il faut un compte Facebook.** La configuration Meta ne donne pas accès aux réglages sans connexion. Elle propose Facebook ou WhatsApp ; le code QR WhatsApp n’est jamais apparu lors de nos essais, et la connexion Facebook a fonctionné. Un nouveau compte créé pour le panneau convient.
- **Le compte doit rester connecté.** Activer ADB demande le code PIN du compte Meta créé à la configuration. Sans compte connecté, nous n’avons trouvé aucun moyen de réactiver ADB, et la réinitialisation Meta à l’écran a aussi cessé de fonctionner ; seule la [réinitialisation matérielle](#récupération-réinitialisation-dusine) a rétabli le Portal. Ne supprimez pas le compte et ne désactivez pas l’application de configuration Meta.
- **ADB ne reste pas activé.** Le réglage ADB Meta est signalé comme se désactivant à chaque redémarrage ; prévoyez donc de le réactiver. La connexion de débogage réseau utilisée par Panel Assistant pour les mises à jour a été perdue à chaque redémarrage essayé. Cela a des conséquences pour les [mises à jour](#mises-à-jour).
- **Refusez si possible le téléchargement du micrologiciel à la configuration.** Meta propose de télécharger une mise à jour. Nous l’avons refusée : tout a donc été testé sur la version nommée en tête de page. On ignore si un micrologiciel Meta ultérieur change l’accès ADB, et Meta ne publie aucun moyen de revenir en arrière.
- **Meta abandonne progressivement Portal.** Meta a cessé de vendre les Portal en 2022 et a retiré des fonctions depuis. Attendez-vous à l’arrêt d’autres services Meta, voire de méthodes de connexion. L’application du panneau ne dépend d’aucun de ces services.
- **Un ordinateur avec navigateur Chromium et un câble USB-C de données** sont nécessaires à l’installation, comme pour tout panneau installé [par USB](/fr/install/install-over-usb/).

## Activer ADB

Meta documente la procédure pour chaque Portal ([Meta, configuration Portal pour les applications Android](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)) :

1. Sur le Portal, ouvrez **Settings › Debug**.
2. Touchez **ADB Enabled** et saisissez le code PIN du compte Meta lorsqu’il est demandé.
3. Connectez le Portal à l’ordinateur par USB-C.
4. La première fois, touchez **Allow** sur le Portal pour approuver l’ordinateur.

:::caution
**L’élément ADB Enabled a exactement le même aspect avec ADB activé ou désactivé, et chaque toucher le bascule.** Rien à l’écran n’indique son état. La seule preuve est sur l’ordinateur : présence du Portal dans la liste USB du navigateur ou dans `adb devices`. S’il est absent, touchez l’élément une fois de plus et revérifiez, au lieu de le toucher plusieurs fois.
:::

Aucun moyen vérifié ne permet d’activer ADB réseau sur le port TCP 5555 sans ordinateur. Utilisez d’abord la voie USB ci-dessus ; activer uniquement le commutateur ADB de Meta n’est pas une voie d’installation réseau vérifiée. L’installateur USB prépare le débogage réseau pour les mises à jour ultérieures. Root n’est pas nécessaire.

## Installer Panel Assistant

Installez l’application depuis Home Assistant avec l’[installateur USB](/fr/install/install-over-usb/), le Portal connecté à l’ordinateur par USB-C et ADB activé comme ci-dessus. Panel Assistant est nécessaire : il assure l’installation, la connexion et les mises à jour de l’application. Sur le Portal testé, l’installateur s’est terminé normalement, l’application a affiché la configuration du tableau de bord et a sélectionné seule le profil Portal 10" (2e génération) au premier lancement.

Pour un Portal, Panel Assistant prépare aussi le panneau pendant l’installation : il définit l’application comme écran d’accueil, accorde l’autorisation microphone et désactive l’économiseur d’écran et la barre de balayage vers le haut de Meta. Aucun de ces réglages n’est modifiable depuis les réglages Meta. L’autorisation caméra est demandée à l’écran du Portal à sa première activation.

Un réglage vous appartient : le **zoom du tableau de bord**. À la densité native du Portal, le tableau de bord s’affiche plus grand que sur les autres panneaux paysage. Le profil définit **Zoom (%)** sur **85** par défaut, pour conserver la netteté des écrans Android ; modifiez-le dans les réglages du [moteur de rendu intégré](/fr/manage/built-in-renderer/) si vous préférez une autre taille.

Puis [ajoutez le panneau](/fr/install/installing-ha-paneld/) dans Panel Assistant comme d’habitude.

## Ce qui fonctionne

- **Le tableau de bord**, fluidement, dans le WebView actuel de Meta.
- **Caméra.** Désactivée par défaut comme sur tous les panneaux, elle s’active depuis la carte **Caméra** de Configurer. Elle fournit alors un flux 1280×720 et des images fixes à Home Assistant ; le voyant vert du Portal s’allume pendant son utilisation.
- **Microphones, mot de réveil et réponses vocales.** Le mot de réveil a été reconnu et le pipeline vocal Home Assistant a répondu par le haut-parleur du Portal. Voir [Assistant vocal](/fr/manage/voice-assistant/).
- **Lumière ambiante**, couleur comprise, comme capteur Android normal pour la luminosité adaptative et Home Assistant.
- **Une véritable extinction de l’écran sans root.** L’application éteint l’écran via le délai de veille Android : le rétroéclairage devient entièrement noir plutôt que minimal. Mettre la luminosité à zéro ne suffit pas sur un Portal : l’image reste visible. Si le délai n’est pas appliqué, l’application utilise son réglage le plus sombre.
- **Réveil :** un double toucher réveille l’écran, tout comme la détection de mouvement Meta lorsque quelqu’un bouge à proximité.
- **Le bouton Lanceur** de la navigation de l’application ouvre son propre lanceur. Le profil lui dit d’éviter celui de Meta, qui est une horloge plutôt qu’une liste d’applications.

## Limites actuelles

- **La veille automatique est désactivée par défaut, et nous recommandons de la laisser ainsi.** Le Portal n’a pas de capteur de proximité : l’application ne peut donc pas savoir si quelqu’un se tient devant. La veille après une période sans toucher a éteint l’écran alors qu’une personne était assise devant ; la détection Meta le réveillait ensuite, en boucle. Cette détection réagit à tout mouvement, y compris un simple passage, a parfois réveillé l’écran dans une pièce vide et n’est pas lisible par les autres applications. L’application ne peut donc pas l’utiliser comme signal de présence. Vous pouvez toujours éteindre et allumer l’écran depuis Home Assistant.
- **Deux indicateurs caméra.** L’application dessine son propre indicateur en haut au centre, alors que l’objectif et le voyant vert du Portal sont en haut à gauche. L’indicateur à l’écran est redondant ici et ne peut pas être désactivé.
- **Le curseur de volume Meta ne modifie pas le volume multimédia**, utilisé par les réponses vocales et annonces. Ce volume peut démarrer à zéro et rendre la première réponse silencieuse. Réglez-le avec **Volume du panneau** ou son entité de volume Home Assistant ; le curseur Meta ne le change pas.
- **Les réglages Android sont largement inaccessibles.** Meta remplace l’application Réglages Android par une version réduite. Panel Assistant règle les besoins de l’application pendant l’installation ; les autres réglages Android ne peuvent pas être modifiés sur le panneau.

:::danger
**Ne désactivez pas l’application de configuration Meta (`com.facebook.alohaapps.devicesetup`) et ne supprimez pas le compte Meta.** Avec le compte supprimé et cette application désactivée, le Portal testé a perdu le commutateur ADB et la réinitialisation Meta à l’écran ; seule la [réinitialisation matérielle](#récupération-réinitialisation-dusine) l’a récupéré. Laissez intacts le compte Meta et ses applications de réglages et de configuration.
:::

## Mises à jour

Un Portal ne peut pas installer lui-même les mises à jour d’application, car cela exige root. Panel Assistant le met donc à jour par débogage réseau, que le Portal désactive à chaque redémarrage, notamment après une coupure de courant. Le panneau continue alors à fonctionner avec sa version actuelle, et Home Assistant affiche une réparation, comme décrit dans [Mises à jour et récupération](/fr/manage/updates-and-recovery/#un-panneau-qui-ne-peut-pas-être-mis-à-jour).

Pour permettre une nouvelle mise à jour, activez [ADB](#activer-adb), connectez le Portal à l’ordinateur par USB et lancez l’installateur USB depuis Home Assistant, comme décrit dans [Un panneau qui ne peut pas être mis à jour](/fr/manage/updates-and-recovery/#un-panneau-qui-ne-peut-pas-être-mis-à-jour). L’installateur n’installe rien sur un Portal ayant déjà l’application ; il réactive le débogage réseau pour permettre la mise à jour. Après celle-ci, vérifiez que le Portal ouvre toujours le tableau de bord comme [écran d’accueil](#installer-panel-assistant).

## Confidentialité

Un Portal reste un appareil Meta exécutant le logiciel Meta ; l’application du panneau n’y change rien. Les éléments suivants sont nos mesures sur l’exemplaire testé, pas un audit complet.

**Le logiciel Meta.** Pendant environ 25 minutes après une réinitialisation, toutes les applications Meta ont envoyé au total environ 3 MB ; les services d’analyse caméra et de présence Meta ont chacun envoyé moins de 0.05 MB. Un envoi vidéo continu serait bien plus volumineux : aucun n’a donc été observé dans cette fenêtre. C’est toutefois un essai court qui n’exclut pas des envois occasionnels. Plusieurs services gardent des connexions ouvertes vers les serveurs Meta, et le logiciel système consigne des événements analytiques, notamment chaque utilisation du curseur de confidentialité et l’état du voyant caméra.

**L’analyse caméra Meta n’allume pas le voyant vert.** La détection de mouvement et de présence Meta observe la pièce via un flux caméra distinct et réduit, actif en continu sans allumer le voyant. Celui-ci indique uniquement le flux utilisé par les autres applications. L’application du panneau ne peut pas ouvrir le flux d’analyse Meta : lorsqu’elle utilise la caméra, le voyant vert est donc allumé.

**Le curseur de confidentialité fonctionne pour l’application du panneau.** En position caméra, Android signale la caméra indisponible et l’application cesse de fournir des images. En position microphones coupés, son assistant vocal n’entend rien. En 1.0, l’application suit l’événement de confidentialité Meta en plus de l’état de coupure Android et peut afficher la coupure du microphone. Les transitions physiques du curseur et le démarrage avec microphone actif n’ont pas encore été qualifiés pour cette voie de signalement.

**L’application du panneau.** La caméra reste désactivée jusqu’à son activation. Ensuite, son flux est disponible aux clients du réseau local, avec le son de la pièce si l’accès microphone est autorisé. Assist et les entités Home Assistant utilisent votre propre connexion Home Assistant.

## Récupération : réinitialisation d’usine

La réinitialisation matérielle du Portal fonctionne sans applications Meta, écran fonctionnel ni ADB :

1. Débranchez l’alimentation et **tout câble USB relié à un ordinateur**.
2. Maintenez **les deux boutons de volume** et rebranchez l’alimentation, en les gardant enfoncés jusqu’à l’annonce de l’effacement.

La réinitialisation efface tout, y compris l’application et ses réglages. Recommencez ensuite la configuration Meta, [activez ADB](#activer-adb) et [installez Panel Assistant](#installer-panel-assistant).

:::caution
**Avec un câble USB relié à un ordinateur, la même combinaison ne réinitialise pas le Portal.** Elle lance le mode de téléchargement d’urgence Qualcomm, qui apparaît sur l’ordinateur comme périphérique USB Qualcomm. Rien n’est modifié dans ce mode. Débranchez l’alimentation pour le quitter, déconnectez le câble USB et réessayez.
:::

## Micrologiciel

Voir le [catalogue des micrologiciels Portal 10" (2e génération)](/fr/hardware/firmware/builds/meta-portal-10-gen2/) pour les versions indexées, les URL Meta d’origine et les copies Internet Archive.

## Source

[Meta for Developers : configuration Portal pour les applications Android](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/) : procédure ADB et liste des modèles pris en charge.
