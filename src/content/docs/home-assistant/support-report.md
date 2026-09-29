---
title: Understand a support report
description: Read a Panel Assistant installation or update failure and share it when asking for help.
---

When an installation or update fails, open its item under **Settings → Repairs** in Home Assistant and choose **Support report**. The report starts with the Panel Assistant integration version and build, the Home Assistant version, and the Repair ID. Each **Failure** section summarizes one saved event. The **Full details** block keeps the exact field names and values for diagnosis.

Read the report before sharing it. It may include a panel address, device identifiers, release details, and an exception trace. Remove anything you do not want to put in a public issue. Keep the failure reason and the surrounding details if you can; they help explain what happened.

For help with a failed installation or update, [open an issue for the Home Assistant integration](https://panel-assistant.io/go/report-issue) and paste the report into the issue body. Add what you were doing, what you expected, and what happened on the panel. If the panel is reachable, its [diagnostics download](/manage/troubleshooting/) can provide more context.

## How to read the fields

- **Failure N** lists saved events in order. A later event may describe a retry hold rather than the original failure.
- `kind` says whether the event came from an `install`, `update`, or `retry_hold` attempt. `at`, when present, is the recorded time.
- `panel` is the panel's display name or address; `address` is the network target Home Assistant used. `entry_id` identifies the Home Assistant integration entry. `job_id` identifies an installation attempt.
- `reason` is the saved result or error message. For an installation, `receipt.result_code` is the broad outcome and `receipt.failure_stage` says which step was active when it failed. A `receipt.result_subcode`, if present, narrows the diagnosis; its value can change between releases.
- `target_version` and `artifact.*` describe the release selected for an update. `receipt.*` holds the installation receipt, including target and step details. `exception` is a technical trace; its last lines often point to the immediate failure.

An installation result of `authorization_failed` means Home Assistant could not obtain permission to work with the panel. `preflight_rejected` means the panel did not pass checks before installing. `artifact_rejected` means the selected app file was not accepted. `transport_failed` means communication with the panel failed. `install_failed` and `launch_failed` name the install and app-start steps. `health_check_failed` means the app did not pass the post-install check. `ambiguous_mutation` or `verification_required` means Home Assistant could not prove the panel's state; inspect the panel before another attempt. An update or retry can instead show a descriptive error message in `reason`.

## Ask an AI assistant to help read it

Copy this prompt, then paste your reviewed report after it. An assistant can explain the evidence and suggest checks, but it cannot see the current panel state from the report alone.

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report starts with integration and Home Assistant versions and a Repair ID. Each numbered Failure is a saved install, update, or retry-hold event. The Full details block uses dotted field names from the original event and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
