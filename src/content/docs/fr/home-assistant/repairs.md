---
title: Réparations
description: Signification de chaque réparation Panel Assistant, raison de son apparition et solution.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ouvrez **Paramètres → Système → Réparations** dans Home Assistant et choisissez le message Panel Assistant. Son premier lien ouvre le réglage ou les étapes de récupération utiles. Utilisez **En savoir plus** pour l’explication ci-dessous.

Gardez le rapport d’assistance enregistré pendant l’examen d’une installation ou mise à jour échouée. L’action **Effacer l’erreur** supprime ce rapport ; elle ne change pas le panneau.

N’utilisez **Réessayer**, avec les contrôles de la réparation existante, qu’après examen du rapport et du panneau. Ne lancez pas une nouvelle installation automatique, une désinstallation ou une réinitialisation tant que l’état installé est inconnu. Voir [Récupération d’installation](/fr/manage/troubleshooting/#une-installation-réseau-sest-arrêtée-en-cours-de-route) et [Rapports d’assistance](/fr/home-assistant/support-report/).

## Trouver votre réparation

- [Application du panneau trop ancienne](#panel-app-too-old)
- [L’ancienne application nécessite 0.9.0](#old-app-needs-090)
- [Le panneau MQTT nécessite 0.9.0](#mqtt-panel-needs-090)
- [Autorisations du panneau](#panel-permissions)
- [Configuration de proximité du panneau](#panel-proximity-setup)
- [Tableau de bord non filtré](#dashboard-unfiltered)
- [Microphone vocal silencieux](#voice-microphone-silent)
- [Microphone vocal sans audio](#voice-microphone-no-audio)
- [Détail du microphone vocal sans audio](#voice-microphone-no-audio-detail)
- [Mot d’activation conservé](#wake-word-kept)
- [Mot d’activation refusé](#wake-word-refused)
- [Nombre de volume supprimé](#volume-number-removed)
- [Redémarrage nécessaire](#restart-required)
- [Compte du panneau différent](#panel-user-mismatch)
- [Aucune voie de mise à jour](#no-update-route)
- [Identité de panneau fusionnée](#merged-panel-identity)
- [Échec de l’installateur](#installer-failure)
- [Échec de l’installateur : autorisation refusée](#installer-failure-authorization-failed)
- [Échec de l’installateur : contrôle préalable refusé](#installer-failure-preflight-rejected)
- [Échec de l’installateur : artefact refusé](#installer-failure-artifact-rejected)
- [Échec de l’installateur : transport défaillant](#installer-failure-transport-failed)
- [Échec de l’installateur : installation refusée](#installer-failure-install-failed)
- [Échec de l’installateur : lancement impossible](#installer-failure-launch-failed)
- [Échec de l’installateur : contrôle de santé échoué](#installer-failure-health-check-failed)
- [Échec de l’installateur : modification ambiguë](#installer-failure-ambiguous-mutation)
- [Échec de l’installateur : vérification requise](#installer-failure-verification-required)
- [Échec de l’installateur : mise à jour](#installer-failure-update)
- [Échec de l’installateur : nouvelle tentative suspendue](#installer-failure-retry-hold)
- [Adresse du panneau inaccessible](#panel-address-unreachable)
- [Adresse du panneau non vérifiée](#panel-address-unverified)
- [Identité du panneau différente](#panel-identity-mismatch)
- [Lien de panneau partagé](#panel-link-shared)
- [Confirmation d’identité du panneau](#panel-identity-confirmation)
- [Échec de l’installateur : autorisation ADB](#installer-failure-adb-authorization)
- [Autorisation de mise à jour ADB](#adb-update-authorization)
- [Un autre Home Assistant](#another-home-assistant)

<a id="panel-app-too-old"></a>

## Application du panneau trop ancienne

**Signification :** Home Assistant ne peut ni voir ni commander le panneau via le protocole de connexion actuel.

**Cause :** L’application ne signale aucun protocole pris en charge, ou sa plage de protocoles ne recoupe pas celle que ce Panel Assistant peut servir.

**Solution :** Ouvrez les mises à jour Home Assistant et installez une mise à jour compatible si proposée. Attendez la reconnexion. Sinon, utilisez le guide de récupération des mises à jour ; ne rétrogradez pas aveuglément.

<a id="old-app-needs-090"></a>

## L’ancienne application nécessite 0.9.0

**Signification :** Panel Assistant 1.0 ne peut pas installer ou mettre à jour ce panneau utilisant l’ancienne application.

**Cause :** La migration depuis l’ancienne application ha-paneld a été retirée en 1.0.

**Solution :** Ne retéléchargez pas Panel Assistant 0.9.0 par-dessus une installation 1.0 active : un réglage supprimé par 1.0 peut faire revenir les panneaux migrés à MQTT en 0.9.0. Uniquement si aucun panneau ne possède encore l’application 1.0, restaurez une sauvegarde Home Assistant antérieure à la mise à niveau, terminez toutes les migrations en 0.9.0, puis revenez à 1.0. Si un panneau possède déjà l’application 1.0 ou sans sauvegarde adaptée, demandez de l’aide avant de changer de version. Voir le [guide de récupération de mise à niveau 1.0](/fr/manage/upgrade-to-1-0/).

<a id="mqtt-panel-needs-090"></a>

## Le panneau MQTT nécessite 0.9.0

**Signification :** Panel Assistant ne peut pas connecter ce panneau MQTT non migré sans séparer ses entités et son historique.

**Cause :** Panel Assistant 1.0 n’effectue plus la migration MQTT.

**Solution :** Ne retéléchargez pas Panel Assistant 0.9.0 par-dessus une installation 1.0 active : un réglage supprimé par 1.0 peut faire revenir les panneaux migrés à MQTT en 0.9.0. Uniquement si aucun panneau ne possède encore l’application 1.0, restaurez une sauvegarde Home Assistant antérieure à la mise à niveau, terminez toutes les migrations en 0.9.0, puis revenez à 1.0. Si un panneau possède déjà l’application 1.0 ou sans sauvegarde adaptée, demandez de l’aide avant de changer de version. Voir le [guide de récupération de mise à niveau 1.0](/fr/manage/upgrade-to-1-0/).

<a id="panel-permissions"></a>

## Autorisations du panneau

**Signification :** Certaines fonctions ne peuvent pas fonctionner car Android n’a pas accordé leurs autorisations. Le tableau de bord reste disponible.

**Cause :** Une ancienne installation ou une autorisation Android modifiée peut laisser une permission requise absente. La caméra en a besoin lorsqu’elle est activée ; le microphone lorsque caméra ou voix est activé. Un état de fonction inconnu conserve l’avertissement jusqu’à vérification.

**Solution :** Sur le panneau physique, ouvrez les réglages Android → Applications → Panel Assistant. Autorisez caméra, microphone et notifications si listés. Dans les accès spéciaux, autorisez la modification des paramètres système et l’affichage par-dessus les autres applications, puis activez Panel Assistant dans Accessibilité. Si la navigation est par révélation au balayage ou toujours visible et que la permission de superposition manque, balayez vers le haut depuis le bas du tableau de bord pour ouvrir cet accès, autorisez-le, revenez et balayez à nouveau. Revenez à la réparation et validez. Home Assistant doit revérifier chaque autorisation pertinente ; une lecture échouée ou une mise à jour seule ne clôture pas la réparation.

<a id="panel-proximity-setup"></a>

## Configuration de proximité du panneau

**Signification :** Le réveil par geste est indisponible car le panneau n’a pas enregistré son étalonnage de proximité.

**Cause :** Le panneau signale calibration_required. L’étalonnage mesure cette installation et exige une personne devant le panneau ; lancer la configuration ne prouve pas son achèvement.

**Solution :** Ouvrez Configurer pour ce panneau, dans Présence et réveil, puis choisissez de configurer la proximité sur le panneau. Suivez les instructions physiques, environ une minute. Après confirmation de l’enregistrement, revenez à la réparation et validez. Home Assistant lit un état frais avant de terminer ; si la configuration continue ou si le panneau est illisible, terminez-la ou rétablissez la connexion puis validez à nouveau. L’action du tableau de bord ouvrant la configuration de proximité est aussi un point de départ sur le panneau.

<a id="dashboard-unfiltered"></a>

## Tableau de bord non filtré

**Signification :** Le panneau affiche le tableau avec toutes les entités Home Assistant plutôt que seulement celles qu’il utilise.

**Cause :** Pendant l’apprentissage des entités, le panneau attend derrière un écran expliquant l’attente. Après plus de 90 secondes, il affiche le tableau sans filtre plutôt que de vous en priver. Les causes courantes sont une analyse sans réponse Home Assistant, une connexion refusée, des règles nécessitant votre décision ou un moteur de navigateur trop ancien. Le panneau continue d’essayer derrière le tableau.

**Solution :** Ouvrez ce panneau dans la barre latérale Panel Assistant, puis Entités, pour voir ce qu’il attend. Répondez aux décisions sur les règles signalées ou reconnectez-vous depuis Configurer si Home Assistant a refusé la connexion. Si Panel Assistant propose un moteur plus récent, installez-le. Le panneau revient seul au tableau filtré et la réparation disparaît.

<a id="voice-microphone-silent"></a>

## Microphone vocal silencieux

**Signification :** Le panneau n’écoute pas de mot d’activation car le contrôle de capture du microphone n’a enregistré que du silence.

**Cause :** Le contrôle n’a trouvé que du silence ou un plancher audio stationnaire.

**Solution :** Ouvrez ce panneau dans la barre latérale Panel Assistant, puis Configurer → Assistant vocal. Désactivez-le puis réactivez-le pour lancer un nouveau contrôle. En cas d’échec, changez Source audio dans la même carte Voix ; son lien direct révèle le réglage avancé. Un contrôle réussi clôture la réparation. Désactiver la voix la retire aussi, puisque l’écoute n’est plus demandée.

<a id="voice-microphone-no-audio"></a>

## Microphone vocal sans audio

**Signification :** Le panneau n’écoute pas de mot d’activation car le contrôle de capture n’a reçu aucun audio.

**Cause :** La capture Android n’a fourni aucun audio, sans erreur plus précise.

**Solution :** Ouvrez ce panneau dans la barre latérale Panel Assistant, puis Configurer → Assistant vocal. Désactivez-le puis réactivez-le pour lancer un nouveau contrôle. En cas d’échec, changez Source audio dans la même carte Voix ; son lien direct révèle le réglage avancé. Un contrôle réussi clôture la réparation. Désactiver la voix la retire aussi, puisque l’écoute n’est plus demandée.

<a id="voice-microphone-no-audio-detail"></a>

## Détail du microphone vocal sans audio

**Signification :** Le panneau n’écoute pas de mot d’activation car le contrôle de capture n’a reçu aucun audio.

**Cause :** La capture Android n’a renvoyé aucun audio ; le détail signalé par le panneau explique l’erreur.

**Solution :** Ouvrez ce panneau dans la barre latérale Panel Assistant, puis Configurer → Assistant vocal. Désactivez-le puis réactivez-le pour lancer un nouveau contrôle. En cas d’échec, changez Source audio dans la même carte Voix ; son lien direct révèle le réglage avancé. Un contrôle réussi clôture la réparation. Désactiver la voix la retire aussi, puisque l’écoute n’est plus demandée.

<a id="wake-word-kept"></a>

## Mot d’activation conservé

**Signification :** Ce panneau a gardé son propre modèle sous l’identifiant partagé et n’utilise donc pas le modèle partagé.

**Cause :** Le modèle installé a un SHA-256 différent et n’est pas une ancienne copie partagée. Panel Assistant préserve un modèle importé indépendamment au lieu de l’écraser.

**Solution :** Ouvrez ce panneau dans Panel Assistant, Configurer, Mots d’activation. Pour y utiliser le modèle partagé, importez son manifeste .json et son modèle .tflite correspondants sur ce panneau. Gardez le modèle actuel si ce choix était volontaire ; le partage automatique ne le remplace jamais. Une importation par la barre latérale devient aussi la copie partagée ; le partage n’active pas les mots d’activation.

L’importation via la barre latérale remplace la copie partagée et peut mettre à jour d’autres panneaux. Voir [Mots de réveil personnalisés](/fr/manage/custom-wake-words/).

<a id="wake-word-refused"></a>

## Mot d’activation refusé

**Signification :** Le mot partagé n’a pas été installé sur ce panneau ; ses autres mots installés restent disponibles.

**Cause :** Le panneau a refusé le modèle et signalé une raison. Manifeste invalide, limites dépassées, échec du contrôle du moteur ou de l’enregistrement sont possibles. Un modèle accepté par un panneau peut être refusé par un autre.

**Solution :** Ouvrez ce panneau dans Panel Assistant, Configurer, Mots d’activation. Utilisez la raison signalée pour corriger ou réentraîner le modèle microWakeWord, puis importez son manifeste .json et son fichier .tflite correspondants. L’importation affiche la réponse du panneau et préserve son dernier modèle fonctionnel en cas de refus. Le partage n’active pas le mot ; sélectionnez-le pour l’écouter. Les commandes non prises en charge par une ancienne application et les délais de connexion produisent des avertissements plutôt que cette réparation.

L’importation via la barre latérale remplace la copie partagée et peut mettre à jour d’autres panneaux. Voir [Mots de réveil personnalisés](/fr/manage/custom-wake-words/).

<a id="volume-number-removed"></a>

## Nombre de volume supprimé

**Signification :** Des automatisations ou scripts utilisent encore un nombre de volume distinct supprimé d’un panneau possédant maintenant un lecteur multimédia. Ces actions doivent être mises à jour.

**Cause :** Le lecteur multimédia du panneau gère maintenant le volume. Panel Assistant supprime uniquement l’ancien nombre de ce panneau après le démarrage Home Assistant et nomme les automatisations et scripts qui le référencent encore.

**Solution :** Ouvrez Automatisations ou Scripts et retrouvez les éléments listés. Remplacez les actions number.set_value visant le nombre supprimé par media_player.volume_set visant le lecteur du panneau ; définissez volume_level entre 0 et 1, par exemple 0.5 pour 50 %. Adaptez les autres références à leur fonction. Enregistrez, vérifiez le fonctionnement puis ignorez la réparation. Panel Assistant ne les réécrit pas automatiquement.

<a id="restart-required"></a>

## Redémarrage nécessaire

**Signification :** Home Assistant exécute encore l’ancienne version Panel Assistant.

**Cause :** La version/compilation installée diffère du code déjà chargé dans Home Assistant.

**Solution :** Ouvrez la réparation, comparez les versions installée et active, puis validez lorsque vous êtes prêt à redémarrer Home Assistant et charger la version installée.

<a id="panel-user-mismatch"></a>

## Compte du panneau différent

**Signification :** Une demande de compte pour le panneau attend votre confirmation.

**Cause :** Un utilisateur Home Assistant connecté demande une connexion comme ce panneau. Une première association ou un changement du compte enregistré exige votre approbation.

**Solution :** Ouvrez la réparation et comparez panneau et utilisateur nommés au compte que vous avez volontairement configuré. Validez uniquement si vous reconnaissez la demande. Si le panneau a déjà un autre compte, confirmer le changement cesse d’accepter celui-ci. Pour une demande inattendue, fermez la boîte et ignorez le problème : tout utilisateur connecté peut demander une connexion de panneau.

<a id="no-update-route"></a>

## Aucune voie de mise à jour

**Signification :** Panel Assistant ne peut pas installer les mises à jour ; le panneau garde sa version actuelle et ses autres fonctions continuent.

**Cause :** Le panneau n’offre plus de voie utilisable, éventuellement après un changement de micrologiciel ou une réinitialisation.

**Solution :** Suivez le [guide d’un panneau impossible à mettre à jour](/fr/manage/updates-and-recovery/#un-panneau-qui-ne-peut-pas-être-mis-à-jour). La récupération dépend du modèle et du micrologiciel : rétablissez le débogage ou reconnectez par USB uniquement lorsque le guide le demande. La réparation disparaît lorsque Home Assistant retrouve une voie fonctionnelle.

<a id="merged-panel-identity"></a>

## Identité de panneau fusionnée

**Signification :** Plusieurs entrées revendiquent la même identité, empêchant une attribution native sûre.

**Cause :** Des identifiants clonés ou historiquement partagés rendent la session ambiguë ; l’intégration refuse de choisir un panneau.

**Solution :** Mettez à jour chaque panneau physique concerné pour qu’il signale sa propre identité. Supprimez ensuite l’appareil fusionné dans Home Assistant et laissez les panneaux se réenregistrer. Examinez les entités désactivées par une ancienne version ; elles ne sont pas restaurées automatiquement.

<a id="installer-failure"></a>

## Échec de l’installateur

**Signification :** L’installation ou la mise à jour n’est pas terminée.

**Cause :** L’échec ne correspond à aucune raison plus précise.

**Solution :** Ouvrez son rapport d’assistance pour voir ce qui s’est passé, puis utilisez Réessayer après résolution de la cause.

<a id="installer-failure-authorization-failed"></a>

## Échec de l’installateur : autorisation refusée

**Signification :** L’installation n’a pas pu se connecter à Android sur le panneau.

**Cause :** Le panneau n’a pas accepté la connexion ADB Home Assistant.

**Solution :** Vérifiez débogage et invite d’approbation avec Préparer un panneau, puis utilisez Réessayer dans la réparation.

<a id="installer-failure-preflight-rejected"></a>

## Échec de l’installateur : contrôle préalable refusé

**Signification :** L’application demandée n’a pas été installée.

**Cause :** Les contrôles de l’installateur ont refusé le panneau avant installation.

**Solution :** Ouvrez le rapport d’assistance, corrigez le contrôle signalé, puis utilisez Réessayer si le panneau et la version choisie correspondent toujours.

<a id="installer-failure-artifact-rejected"></a>

## Échec de l’installateur : artefact refusé

**Signification :** L’application demandée n’a pas été installée.

**Cause :** La version n’a pas pu être authentifiée ou ses contrôles de préparation locale ont échoué, notamment en présence d’un chemin temporaire dangereux ou occupé.

**Solution :** Ouvrez le rapport d’assistance pour identifier la version ou le contrôle refusé, puis réessayez via la réparation après résolution.

<a id="installer-failure-transport-failed"></a>

## Échec de l’installateur : transport défaillant

**Signification :** Home Assistant n’a pas pu finir le transfert ou l’installation de l’application.

**Cause :** Une opération de transport a échoué ; il peut s’agir d’une connexion défaillante ou d’un transfert ou d’une installation refusé.

**Solution :** Rétablissez la connexion du panneau, puis utilisez Réessayer dans la réparation pour que Panel Assistant vérifie son état actuel avant de continuer.

<a id="installer-failure-install-failed"></a>

## Échec de l’installateur : installation refusée

**Signification :** Android a refusé l’installation demandée.

**Cause :** L’installation du paquet a échoué ; le rapport d’assistance contient le résultat.

**Solution :** Lisez le rapport et résolvez l’erreur Android signalée, puis utilisez Réessayer dans la réparation.

<a id="installer-failure-launch-failed"></a>

## Échec de l’installateur : lancement impossible

**Signification :** L’application est installée mais n’a pas démarré.

**Cause :** L’installateur n’a pas pu lancer Panel Assistant après installation.

**Solution :** Ouvrez Panel Assistant depuis la liste des applications du panneau, puis utilisez Réessayer pour vérifier et terminer la tentative. Si elle ne s’ouvre pas, utilisez son rapport d’assistance pour obtenir de l’aide.

<a id="installer-failure-health-check-failed"></a>

## Échec de l’installateur : contrôle de santé échoué

**Signification :** L’application a démarré mais son bon fonctionnement n’est pas confirmé.

**Cause :** L’installateur n’a pas reçu la réponse saine requise.

**Solution :** Vérifiez l’application sur le panneau, puis utilisez Réessayer pour contrôler son état. Si elle reste défaillante, utilisez le rapport d’assistance pour obtenir de l’aide.

<a id="installer-failure-ambiguous-mutation"></a>

## Échec de l’installateur : modification ambiguë

**Signification :** Panel Assistant ignore si la tentative échouée a modifié le panneau.

**Cause :** Le résultat n’a pas prouvé l’état final du paquet.

**Solution :** Vérifiez le panneau physique et ouvrez le rapport d’assistance. Utilisez Réessayer avec ses contrôles uniquement après examen de l’état signalé ; ne désinstallez pas, n’effacez pas les données et ne réinitialisez pas pour supprimer le message.

<a id="installer-failure-verification-required"></a>

## Échec de l’installateur : vérification requise

**Signification :** Une autre installation est bloquée jusqu’à vérification du panneau.

**Cause :** La tentative précédente exige une vérification avant toute autre installation.

**Solution :** Vérifiez le panneau et son rapport, puis utilisez Réessayer pour revérifier son état actuel. Ne désinstallez pas, n’effacez pas les données et ne réinitialisez pas pour supprimer le message.

<a id="installer-failure-update"></a>

## Échec de l’installateur : mise à jour

**Signification :** Home Assistant n’a pas pu confirmer l’achèvement. En 1.0.0-rc2 non encore publiée, l’application peut déjà être installée alors que la mise à jour du moteur de navigateur reste inachevée.

**Cause :** La mise à jour de l’application ou, dans cette version, de son moteur a échoué ou n’a pas pu être vérifiée. La réparation conserve le rapport de toute la tentative.

**Solution :** Lisez le rapport, rétablissez la connexion ou la condition d’installation signalée, puis choisissez **Réessayer**. En 1.0.0-rc2 non publiée, si seul le moteur reste inachevé et que Panel Assistant confirme la version d’application demandée installée, il reprend cette étape sans réinstaller l’application. Si **Autoriser les mises à jour** est proposé, utilisez-le d’abord pour approuver Home Assistant sur le panneau. Voir le [guide WebView](/fr/hardware/guides/update-the-webview/) si le moteur ne peut pas être mis à jour.

<a id="installer-failure-retry-hold"></a>

## Échec de l’installateur : nouvelle tentative suspendue

**Signification :** La nouvelle tentative est suspendue et n’a pas été autorisée à continuer.

**Cause :** Un contrôle de sécurité ou une erreur inattendue l’a arrêtée. Le rapport conserve les observations ; une suspension n’autorise pas une réinstallation.

**Solution :** Lisez l’erreur et le rapport, vérifiez que le panneau et la version voulus correspondent toujours, puis utilisez Réessayer après résolution. Effacer l’erreur supprime uniquement sa réparation et le rapport enregistré.

<a id="panel-address-unreachable"></a>

## Adresse du panneau inaccessible

**Signification :** Les commandes restent disponibles via la connexion active, mais les opérations HTTP n’ont pas d’adresse accessible vérifiée.

**Cause :** L’adresse enregistrée ne répond plus ; la récupération automatique n’avait aucun candidat utilisable ou n’a pas pu le vérifier.

**Solution :** Rétablissez l’accès réseau/HTTP ou ajoutez le même panneau à son adresse actuelle ; ne contournez pas le contrôle d’identité.

<a id="panel-address-unverified"></a>

## Adresse du panneau non vérifiée

**Signification :** Les commandes restent disponibles via la connexion active, mais les opérations HTTP n’ont pas d’adresse accessible vérifiée.

**Cause :** L’adresse enregistrée ne répond plus ; la récupération automatique n’avait aucun candidat utilisable ou n’a pas pu le vérifier.

**Solution :** Rétablissez l’accès réseau/HTTP ou ajoutez le même panneau à son adresse actuelle ; ne contournez pas le contrôle d’identité.

<a id="panel-identity-mismatch"></a>

## Identité du panneau différente

**Signification :** État et commandes sont refusés à un point d’accès d’identité différente.

**Cause :** Une adresse répond maintenant comme une autre installation, ou les preuves d’identité enregistrées ne peuvent être rapprochées sûrement.

**Solution :** Vérifiez panneau physique et adresse ; ajoutez à nouveau le panneau actuel connu s’il a changé d’adresse. N’approuvez jamais une autre identité au seul motif qu’elle utilise l’ancienne adresse.

<a id="panel-link-shared"></a>

## Lien de panneau partagé

**Signification :** Un panneau réinstallé ne peut pas être attribué sûrement à une configuration existante.

**Cause :** Plusieurs entrées ont enregistré le même ancien lien d’appareil ; l’accessibilité de l’adresse n’est pas en cause.

**Solution :** Gardez les autres panneaux actifs ; ne supprimez que les entrées inutilisées ou ajoutez séparément le panneau réinstallé.

<a id="panel-identity-confirmation"></a>

## Confirmation d’identité du panneau

**Signification :** Les configurations existantes attendent votre confirmation après le signalement de nouvelles identités d’appareil.

**Cause :** Panel Assistant n’a pas pu prouver automatiquement que chaque nouvelle identité appartient à son ancienne configuration.

**Solution :** Examinez chaque nom et adresse de la liste. Validez uniquement si chaque panneau appartient bien à sa configuration existante. Ouvrir la boîte ne change rien.

<a id="installer-failure-adb-authorization"></a>

## Échec de l’installateur : autorisation ADB

**Signification :** La mise à jour échouée ne peut continuer tant que ce panneau n’autorise pas Home Assistant.

**Cause :** L’approbation de confiance ADB reste nécessaire ; le rapport de mise à jour échouée reste disponible.

**Solution :** Choisissez Autoriser les mises à jour dans la réparation et validez, puis cochez Toujours autoriser depuis cet ordinateur et touchez Autoriser sur le panneau nommé. Revenez à la réparation et utilisez Réessayer pour la mise à jour échouée.

<a id="adb-update-authorization"></a>

## Autorisation de mise à jour ADB

**Signification :** Home Assistant ne peut pas utiliser ADB pour mettre à jour ce panneau sans son autorisation.

**Cause :** La voie de mise à jour exige une approbation explicite sur le panneau.

**Solution :** Ouvrez la réparation et validez, puis cochez Toujours autoriser depuis cet ordinateur et touchez Autoriser sur le panneau nommé. Android peut appeler Home Assistant un ordinateur ; la procédure continue après approbation.

<a id="another-home-assistant"></a>

## Un autre Home Assistant

**Signification :** Ajouter le panneau ici ne change ni son serveur ni son compte enregistrés.

**Cause :** L’adresse Home Assistant enregistrée identifie un autre serveur.

**Solution :** Pour connecter ce panneau ici, suivez le lien de réparation vers Configurer, saisissez cette adresse Home Assistant, enregistrez, puis reconnectez-vous avec le compte voulu. S’il appartient à l’autre serveur, ne changez rien et ignorez cette réparation. Si la barre latérale ne l’atteint pas, ouvrez directement Configurer sur son réseau.
