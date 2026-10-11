---
title: Comprendre un rapport d'assistance
description: Comprendre un échec d'installation ou de mise à jour de Panel Assistant et partager le rapport lorsque vous demandez de l'aide.
sourceCommit: ddee491d1892568fda8e9bb47f003b2333e3b666
---

Lorsqu'une installation ou une mise à jour échoue, ouvrez l'élément correspondant dans **Paramètres → Réparations** de Home Assistant et choisissez **Rapport d'assistance**. Le rapport conserve les noms et les valeurs exacts des champs dans un bloc de texte que vous pouvez copier. Il commence par `panel_assistant.version` et `panel_assistant.build`, suivis de `home_assistant.version` et du Repair ID dans `repair.issue_id`. Les événements enregistrés figurent sous `events[N]`, où `N` commence à 0.

Lisez le rapport avant de le partager. Il peut contenir l'adresse d'un panneau, des identifiants d'appareils, des détails sur la version publiée et une trace d'exception. Supprimez tout ce que vous ne souhaitez pas publier dans un ticket public. Si possible, conservez le motif de l'échec et les détails associés ; ils aident à expliquer ce qui s'est passé.

Pour obtenir de l'aide après un échec d'installation ou de mise à jour, [ouvrez un ticket pour l'intégration Home Assistant](https://panel-assistant.io/go/report-issue) et collez le rapport dans le corps du ticket. Précisez ce que vous faisiez, ce que vous attendiez et ce qui s'est passé sur le panneau. Si le panneau est accessible, le [téléchargement de ses diagnostics](/fr/manage/troubleshooting/) peut apporter davantage de contexte.

## Comment lire les champs

- `events[N]` présente les événements enregistrés dans l'ordre, en commençant par `events[0]`. Un événement ultérieur peut décrire une nouvelle tentative mise en attente plutôt que l'échec initial.
- `kind` indique si l'événement provient d'une tentative de type `install`, `update` ou `retry_hold`. `at`, lorsqu'il est présent, correspond à l'heure enregistrée.
- `panel` est le nom affiché ou l'adresse du panneau ; `address` est la cible réseau utilisée par Home Assistant. `entry_id` identifie l'entrée de l'intégration Home Assistant. `job_id` identifie une tentative d'installation.
- `reason` est le résultat enregistré ou le message d'erreur. Pour une installation, `receipt.result_code` indique le résultat général et `receipt.failure_stage` précise l'étape en cours au moment de l'échec. Un `receipt.result_subcode`, s'il est présent, affine le diagnostic ; sa valeur peut changer d'une version publiée à l'autre.
- `target_version` et `artifact.*` décrivent la version publiée choisie pour une mise à jour. `receipt.*` contient le compte rendu d'installation, avec les détails de la cible et des étapes. `exception` est une trace technique ; ses dernières lignes indiquent souvent l'échec immédiat.

Le résultat d'installation `authorization_failed` signifie que Home Assistant n'a pas pu obtenir l'autorisation d'intervenir sur le panneau. `preflight_rejected` signifie que le panneau n'a pas réussi les vérifications préalables à l'installation. `artifact_rejected` signifie que le fichier d'application sélectionné n'a pas été accepté. `transport_failed` signifie que la communication avec le panneau a échoué. `install_failed` et `launch_failed` désignent respectivement les étapes d'installation et de démarrage de l'application. `health_check_failed` signifie que l'application n'a pas réussi la vérification après installation. `ambiguous_mutation` ou `verification_required` signifie que Home Assistant n'a pas pu établir avec certitude l'état du panneau ; inspectez le panneau avant une nouvelle tentative. Une mise à jour ou une nouvelle tentative peut à la place afficher un message d'erreur descriptif dans `reason`.

## Demander à un assistant IA de vous aider à le lire

Copiez cette consigne, puis collez à sa suite le rapport que vous avez relu. Un assistant peut expliquer les éléments du rapport et proposer des vérifications, mais il ne peut pas connaître l'état actuel du panneau à partir du rapport seul.

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report is a copyable text block with exact dotted field names and values. It starts with panel_assistant.version and panel_assistant.build, followed by home_assistant.version and the Repair ID in repair.issue_id. Saved install, update, or retry-hold events appear under events[N], starting at events[0]. Each event preserves its original fields and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
