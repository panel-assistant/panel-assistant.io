---
title: Install safety
description: The checks behind the command-line installer, what it backs up before changing a panel, and when it stops.
---

This page records the checks and recovery limits behind the [command-line installer](/manage/command-line-install/), including its updates across several panels. Most people only need the commands on that page. The detail here is for anyone deciding whether an unattended update is safe enough for their panels, or working out why the installer stopped.

## Trust and credential boundaries

Credential files keep secrets out of shell history and out of the command lines of child processes on the computer running the installer. They do not add encryption to the panel's management API. The panel's API at `http://<panel>:8888` follows the project's trusted-network model, so broker credentials and Home Assistant tokens cross that connection as unencrypted HTTP. Run the installer only on a trusted, segmented network. The [security reference](/reference/security/) describes the model.

Signing in with a Home Assistant username and password works differently. The password goes from the installing computer to Home Assistant's login endpoint and never reaches the panel. Use an `https://` Home Assistant URL so the login is encrypted in transit; an `http://` URL sends the password unencrypted. The panel receives only the resulting refresh token, which can be revoked.

Configuration exports contain secrets and are written with owner-only permissions; treat them as credentials. The automatic settings and database copies made before an upgrade also go into an owner-only directory, as mode 600 files.

## Release and package authentication

The installer that needs no checkout downloads the matching release app and provisioner. It authenticates the published app and helper binaries against SHA-256 records signed with the release key before it changes the panel. It also inspects the app's package and signer with Android Build-Tools. Those tools are optional for a first installation on a panel that does not have the panel app yet, where Android checks the signature itself during installation, and required to update a panel that does: the installer compares the installed and new signers before it changes anything, and refuses rather than guessing. A mismatched signer would otherwise retire the running helper and only then fail to install. The installer picks the helper that matches the ABI the panel reports.

A locally built app follows a separate developer route. It must still contain the ha-paneld package with exactly one valid signer, but it may use the builder's own consistent signing key. `--require-release-signer` tightens that check when the local file is expected to be an official build. `--allow-unsigned-helper` is a separate acknowledgement for helper binaries controlled by the local builder rather than authenticated as release files.

## Backups and recovery

Three different files serve three different recovery jobs:

- A **configuration JSON export** contains settings and secrets. `--export FILE` creates one explicitly, and the installer also tries to make an owner-only export automatically before an ordinary upgrade. It does not contain the runtime profile catalogue, the profile selection, learned entity state, histories, or a Home Assistant login held by a separate dashboard app.
- An **`.hpb` backup** from **Install**, then **Backup**, on the panel's web interface is the fullest supported backup. It carries settings, durable panel state, the profile catalogue and an eligible login held by a separate dashboard app. The learned entity catalogue and the proximity and ambient histories are learned again rather than restored. Restore an `.hpb` through **Install**, then **Restore**, on the same page. The installer's `--restore FILE` accepts configuration JSON, not `.hpb` backups.
- An automatic **`…break-glass.db`** is a last-resort copy of the panel's internal database. Nothing restores it automatically, and it is only valid for the same panel and the same app version it came from.

When `--export FILE` is combined with installation or configuration options, the verified export is written before anything on the panel changes. If it cannot be produced and verified, the run stops. Run `--export FILE` as a separate command first when you want the export without installing anything.

The automatic settings export before an ordinary upgrade is best-effort. If it cannot be created, the installer removes the partial file, records that no settings export exists, and carries on with replacing the app.

Before an uninstall, clearing app data, or any other destructive recovery, make a separate **Install**, then **Backup**, and check that the downloaded `.hpb` is not empty. Those operations destroy the app's data. An ordinary `adb install -r` keeps it.

`--reset-config` works deliberately differently. **Reset is irreversible and makes no backup.** It asks for its own confirmation, then removes all of the panel app's data. The app, the helper and other Android apps stay installed.

## Automatic database snapshot

Before every ordinary upgrade, the installer tries to capture the panel's database, which holds the configuration, the entity catalogue, the proximity and ambient histories and the revision history kept on the panel. The snapshot is a recovery aid for a later uninstall or other destructive repair; Android's normal in-place app replacement leaves the original database where it is.

The installer sends the running app one upgrade-preparation request, over ADB only. The app stops accepting new work, finishes pending writes, pauses database writers, flushes its state, checkpoints the SQLite write-ahead log and closes the database. It acknowledges that exact request only after recording the old process, app version, byte count, a SHA-256 the computer can verify, the schema version and the state row count.

The installer copies the closed database straight from the app's private storage, without staging a second copy on the panel. The copy on the computer is accepted only when its size and its SHA-256, which is always checked, match the acknowledgement and the local SQLite integrity, schema and row checks pass.

If the app does not return the exact acknowledgement, for example because the request timed out or the reply was malformed, the installer falls back once to SQLite's live `.backup`. That produces the same single self-contained database, with no write-ahead log or journal files beside it. A panel with no root route cannot expose its private database, so only the settings export may be available.

For an ordinary in-place upgrade, the database backup is best-effort. A failed or inconsistent copy is removed, the installer prints a prominent warning, and replacing the app may go ahead with the original app data untouched. An invalid copy is never kept or labelled as a successful backup.

There is no fixed free-space threshold for this backup. The normal route stages nothing on the panel, and the single fallback lets the real capture show whether it fits. Storage pressure, a failed database health check, an unreachable status endpoint, a malformed reply or an unrecognised state is reported before and after installation. None of them blocks an ordinary app replacement, because the new build may be the only useful recovery attempt for an old build that is unhealthy or unreachable. A standalone `--verify` reports those conditions as a failure when you need a strict pass or fail.

## Time zone and first-install checks

Before changing the panel, the installer compares the panel's time zone with the computer's. A mismatch is a warning, not a stop, because a panel can legitimately use a different zone. The comparison uses zone names rather than the current UTC offset, and resolves known aliases through the computer's time zone database. It catches panels left on a factory default zone, which would otherwise stamp logs and run schedules at the wrong local hour.

The check stays silent if either value cannot be established. A missing response, an invalid zone name or an alias the computer's time zone database does not know neither fails nor changes the installation.

A clean panel has no status endpoint for the panel app, and neither do some broken installations. The installer asks Android's package manager whether ha-paneld is installed before deciding which case it has. A definite "not installed" starts a normal first installation. A package manager or ADB query that does not answer stops the run before the panel is changed.

## Root helper upgrades

Published releases include sealed `armeabi-v7a` and `arm64-v8a` helper binaries. On a panel with the vendor's `su` or root ADB, the installer authenticates the selected binary with the release key, verifies it again after staging, and installs or upgrades it atomically. It checks the protocol capabilities and the reproducible build identity the app needs before replacing the app.

The previous root-owned helper and its service stay available until the app installation succeeds. A failure to install or start the helper, or a wrong identity or capability, restores the previous working pair before the app is replaced. If the ADB connection drops while Android is installing the app, the installer keeps its recovery journal. Running the same command again authenticates the installed app and the running helper, then completes or rolls back the interrupted upgrade.

Recovery snapshots are owned by root, authenticated by their recorded digest, and synced to storage before the live files are retired. The standalone `helper/install-daemon.sh` keeps a separate journal for the helper alone. Each installer refuses to overwrite the other's unfinished transaction and names the command that has to be run again.

The installer prefers an init service on a writable `/system` when it can verify there is enough space. If `/system` is read-only, it uses a verified Magisk, KernelSU or APatch runner in `/data/adb/service.d`. A panel whose `/system` is writable but crowded can keep the helper and recovery files under `/data/adb/hapaneld` and put only the startup service in `/vendor/etc/init`, and later updates keep that verified layout. The installer stops before replacing the app when it cannot establish storage capacity, who owns startup, or the state of an existing transaction.

The app carries the matching helper as a fallback. If a panel with a direct `su` installation updates from the Install tab, the Home Assistant update entity or the automatic update setting before it has been through the installer again, the app's first start checks the helper protocol it needs and can launch a root-owned copy from `/data/local`. A rooted panel that sandboxes root cannot safely let an old helper replace itself, so it fails closed and asks for the authenticated installer to be run from a computer.

## Updating several panels

`update-fleet.sh` downloads or accepts one app, verifies its package and signer and records its SHA-256 digest before starting any worker. It passes that file to each worker, and each panel's installer runs its own checks again before changing the panel. A release downloaded into the script's private temporary directory stays tied to its signed checksum. If you supply a local app file, do not replace it while the script is running. The number of panels handled at once is between one and 32.

Options that describe a single panel are rejected before any worker starts: `--reset-config`, `--export FILE`, `--id` and the device-specific `--restore FILE`. `--restore-fleet FILE` is allowed because it imports only portable settings that are not secret. Each panel keeps its own identity. Credentials also stay as they are unless you pass shared ones on the command line; install panels one at a time when their credentials differ.

Hardware profile recommendations stay advisory. The script never disables packages, persists ADB, installs optional privileged software or changes display settings just because a profile recommends it.

## What can stop a run

The installer stops with a non-zero result when it cannot safely establish something the requested operation needs. Examples are a package query that does not answer, an app with the wrong package or signer, a helper transaction that cannot be recovered, a requested configuration export that cannot be verified, or a required self-check after installation that fails.

Other findings are warnings, because stopping would make recovery harder. An unavailable automatic database backup, a storage health warning or a failed status call before the upgrade does not on its own prevent an ordinary in-place app replacement. The installer states that limit plainly rather than presenting a partial or invalid recovery file as a success.
