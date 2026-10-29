---
title: Profils de panneau communautaires
description: Profils communautaires de panneaux non intégrés à l’application, importation sûre et activation d’une caméra non déclarée par un profil.
sidebar:
  label: Vue d’ensemble
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ce catalogue regroupe des profils communautaires non intégrés à ha-paneld. La présence d’un profil ici ne signifie pas que ha-paneld fonctionne sur le matériel commercial nommé tel qu’il est vendu. Chaque profil peut décrire un reflashage particulier, une modification du micrologiciel ou une seule installation signalée plutôt que le logiciel d’origine du fabricant.

Les profils communautaires ne sont jamais sélectionnés automatiquement. Téléchargez le fichier YAML individuel, examinez sa source, le micrologiciel testé et ses limites, puis importez-le depuis la page **Profils** du panneau. L’importation et la validation sont uniquement un aperçu : elles n’enregistrent ni n’activent le profil.

Avant d’enregistrer, exigez que l’aperçu indique que chaque prédicat d’un groupe de correspondance complet concorde avec les caractéristiques immuables de l’appareil. Un nom correspondant ne suffit pas. L’activation vérifie strictement cette identité et rejette les captures dangereuses de l’écran tactile, mais ne vérifie pas préalablement chaque voie privilégiée en direct. Après le redémarrage contrôlé, les pilotes actifs propres aux capacités sondent leurs interfaces et leurs autorisations à l’initialisation ou à l’utilisation ; les capacités indisponibles restent indisponibles, et l’état de santé au démarrage détermine si le candidat reste actif ou fait l’objet d’un retour arrière. Ne considérez jamais une importation ou une activation réussie comme la preuve que toutes les capacités déclarées fonctionnent.

## Essayer un profil communautaire en sécurité

1. Ouvrez la page de l’appareil du panneau dans Home Assistant, sélectionnez **Visiter**, puis ouvrez **Profils**. Exportez la révision active et créez une sauvegarde complète actuelle du panneau. En connexion directe, utilisez le port HTTP indiqué par le panneau (`http://<panel-ip>:8888/profiles` avec le port par défaut).
2. Téléchargez et examinez le YAML. Confirmez que ses hypothèses exactes de micrologiciel et de modifications décrivent le panneau devant vous.
3. Collez ou téléversez le YAML sur **Profils**, puis validez-le. Ne continuez pas si la correspondance d’identité est incomplète, si un pilote compilé requis manque ou si un mappage d’entrée dangereux est signalé. La validation ne prouve pas l’autorisation matérielle réelle.
4. Enregistrez le contenu validé comme révision locale inactive. L’enregistrement ne modifie toujours pas le profil en cours d’exécution.
5. Testez-le et activez-le uniquement lorsqu’une personne peut voir et toucher le panneau, en suivant la [liste de vérification des profils](/fr/reference/profiles/testing/). L’activation est liée à l’identifiant exact du profil, à sa révision et à son empreinte de contenu.
6. Après le redémarrage, examinez les résultats réels des capacités et confirmez la révision active, les commandes attendues et les entités Home Assistant. Une voie indisponible doit le rester au lieu d’être considérée comme réussie. Essayez **Revenir en arrière** avant de compter sur le profil sans surveillance ; un échec de santé au démarrage doit rétablir automatiquement la dernière révision connue comme fonctionnelle.

Revenir à **Passer en automatique** ne sélectionne qu’un profil intégré ou le profil de repli prudent Generic. Cela ne réactive pas automatiquement une révision communautaire.

## Activer la caméra sur un panneau dont le profil n’en déclare pas

La caméra est proposée sur tout panneau qui en possède une : soit une caméra déclarée par le profil avec `hardware.camera`, soit une caméra énumérée par Android sur un panneau dont le profil ne dit rien. Une carte dotée d’une caméra fonctionnelle n’a donc généralement besoin d’aucune entrée de profil, et le groupe Caméra apparaît dans **Configurer** sans que personne modifie le YAML.

Trois conditions peuvent encore la rendre absente, et la carte Caméra dans **Configurer** indique laquelle s’applique au lieu de disparaître :

- **Le profil la supprime.** `hardware.camera: false` est un troisième état délibéré, différent de l’omission de la clé : il indique que l’appareil énuméré n’est pas une caméra de pièce utilisable, par exemple une entrée de capture HDMI. Retirez la ligne, ou définissez-la sur `true`, pour proposer la caméra.
- **Android n’a énuméré aucune caméra.** Si le panneau en possède bien une, déclarez `hardware.camera: true` dans son profil. Une déclaration prime sur une énumération vide : c’est aussi la solution lorsque le service caméra est présent mais que l’énumération manque de fiabilité.
- **L’énumération n’a pas encore répondu.** Cela ne dit rien du matériel. Attendez quelques secondes et rechargez Configurer ; aucune modification n’est nécessaire.

Déclarer une caméra que la carte n’expose pas est sans danger. Une sonde légère à l’exécution lit la liste des identifiants de caméra Android pour les rapports de capacités ; une caméra déclarée reste proposée, et une carte sans caméra refuse une ouverture avec une erreur classée `no_camera_id`, dont l’action indique que le profil est incorrect. Cela ne déstabilise pas le panneau.

Une exigence accompagne ce drapeau. La caméra reste bloquée si le panneau ne peut pas indiquer à la pièce qu’elle est ouverte ; lorsque l’écran est éteint, cela nécessite une indication hors écran. Pour capturer avec l’écran éteint, fournissez une voie d’indication LED fonctionnelle. Lorsque l’écran est allumé, l’indicateur à l’écran peut satisfaire l’exigence sans LED. Définissez `hardware.camera_lens_offset_px` pour placer cet indicateur sous l’objectif plutôt qu’à côté.

Tout le reste du fonctionnement de la caméra est inchangé : elle reste désactivée tant qu’elle n’a pas été activée, son interrupteur n’est jamais un réglage par défaut suggéré, et l’activer via l’entité caméra Home Assistant demande une approbation sur l’écran du panneau dans tous les modes de sécurité. Le réglage Caméra dans Configurer est une voie de configuration distincte pour le propriétaire.

## Catalogue

- [`community-cronos-lineageos18.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml) : un brouillon pour l’Amazon Echo Show 5 Gen 2 d’un contributeur, reflashé avec LineageOS 18.1. Fire OS d’origine ne peut pas exécuter ha-paneld ; déverrouillage, reflashage et récupération ne sont pas pris en charge, et le projet n’a pas validé le profil sur du matériel. Voir les [notes de preuve propres au profil](/fr/reference/profiles/community/echo-show-5-gen2/).
- [`community-lenovo-thinksmart-view-lineageos.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-lenovo-thinksmart-view-lineageos.yaml) : un brouillon pour le Lenovo ThinkSmart View d’un contributeur, reflashé avec LineageOS 8.1. Il sélectionne la mise en veille Android parce qu’une luminosité nulle reste visiblement allumée, indique que le toucher ne réveille pas le panneau et consigne la confirmation du contributeur selon laquelle Home Assistant peut réduire sa luminosité, l’éteindre complètement et le réveiller. Voir les [notes de preuve propres au profil](/fr/reference/profiles/community/lenovo-thinksmart-view/).
- [`community-sunworld-yc-sm55p-p76s01.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-sunworld-yc-sm55p-p76s01.yaml) : un brouillon pour le Sunworld YC-SM55P de 5.5 pouces d’un contributeur, sur carte Portworld P76S01. Le profil consigne l’identité RK3576S issue du micrologiciel et des voies de commande Android prudentes, mais laisse les capteurs facultatifs et la caméra désactivés jusqu’aux tests physiques. Son identité de compilation Rockchip générique ne permet pas une sélection automatique sûre. Voir les [notes de preuve propres au profil](/fr/reference/profiles/community/sunworld-yc-sm55p/).

Pour le format des profils, la frontière de confiance et les exigences de contribution, voir le [guide des profils à l’exécution](/fr/reference/profiles/), la [référence du format](/fr/reference/profiles/format/), la [liste de vérification des tests](/fr/reference/profiles/testing/) et le [guide de partage](/fr/reference/profiles/sharing/).
