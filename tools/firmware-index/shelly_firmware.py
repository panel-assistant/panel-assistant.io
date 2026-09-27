#!/usr/bin/env python3
"""Shelly Wall Display firmware monitor and Wayback Machine archiver.

Polls the Shelly OTA manifest endpoints for new firmware versions, preserves
them in the Internet Archive before Shelly replaces the CDN object in-place,
and keeps the canonical .dat file for the site catalogue.

Unlike Sonoff NSPanel Pro (CoolKit CDN retains all versions indefinitely),
Shelly's CDN keeps only the *current* build per product. Once a new version
ships, the previous firmware URL goes 404. Hourly polling + immediate archival
gives the best chance to capture every release before it disappears.

Data file (fw-shelly-walldisplay.dat):
    track|version|build_id|bytes|discovered|cdn_url|wayback_ts

Commands:
    verify  strictly validate every current manifest and CDN object without writes
    probe   poll manifests, append new versions to .dat, set GITHUB_OUTPUT flags
    archive submit unarchived CDN URLs to Wayback Machine, fill wayback_ts
"""

import argparse
import json
import os
import pathlib
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from secure_urlopen import urlopen

# Shelly's OTA hosts use a private Allterco CA rather than the public Web PKI.
# Keep normal certificate and hostname verification, adding only the vendor CA
# recovered from Shelly's own `shelly_cloud.pem` firmware trust store.
_SHELLY_CA = pathlib.Path(__file__).with_name("shelly-cloud-ca.pem")
_SSL_CONTEXT = ssl.create_default_context()
_SSL_CONTEXT.load_verify_locations(cafile=_SHELLY_CA)

MANIFESTS = {
    "WallDisplay": "https://updates.shelly.cloud/update/WallDisplay",
    "WallDisplayV2": "https://updates.shelly.cloud/update/WallDisplayV2",
}

TRACK_LABELS = {
    "WallDisplay": (
        "WallDisplay — armeabi-v7a",
        "original Wall Display (MT6580/Android 7), X2 (SC7731E/Android 8.1)",
    ),
    "WallDisplayV2": (
        "WallDisplayV2 — arm64-v8a",
        "X1i/X2i (RK3326-S), XL (RK3566); U1/D1 hardware not established",
    ),
}

PROBE_TIMEOUT = 20
SPN_URL = "https://web.archive.org/save"
AVAIL_URL = "https://archive.org/wayback/available"
WAVE_SIZE = 3          # keep waves small — firmware ZIPs are 30–40 MB each
DRAIN_WAIT = 90        # seconds between SPN waves
CONFIRM_WAIT = 180     # seconds to let captures settle before confirming

_VERSION_RE = re.compile(r"[0-9A-Za-z][0-9A-Za-z._+-]{0,63}\Z")
_BUILD_ID_RE = re.compile(r"(?:[0-9A-Za-z][0-9A-Za-z._/+:-]{0,127})?\Z")
_CDN_PATH_RE = re.compile(r"/[0-9A-Za-z._~/%+-]+\Z")
_DATE_RE = re.compile(r"[0-9]{4}-[0-9]{2}-[0-9]{2}\Z")
_WAYBACK_TS_RE = re.compile(r"(?:[0-9]{14})?\Z")
_CDN_HOST = "fwcdn.shelly.cloud"


def validate_cdn_url(track, value):
    """Accept only the HTTPS Shelly CDN namespace expected for this fixed OTA track."""
    if not isinstance(value, str) or len(value) > 1024:
        raise ValueError("url must be a bounded string")
    try:
        parsed = urllib.parse.urlsplit(value)
        port = parsed.port
    except ValueError as exc:
        raise ValueError("url authority is invalid") from exc
    if (parsed.scheme != "https" or parsed.hostname != _CDN_HOST or
            parsed.username is not None or parsed.password is not None or
            port is not None or parsed.query or parsed.fragment):
        raise ValueError("url must use the pinned Shelly HTTPS CDN authority")
    prefix = f"/gen2-ntest/{track}/"
    if not parsed.path.startswith(prefix) or not _CDN_PATH_RE.fullmatch(parsed.path):
        raise ValueError("url path is outside the expected OTA track")
    return value


def validate_release(track, stable):
    """Validate untrusted manifest fields before network requests, files, outputs, or Markdown."""
    if not isinstance(stable, dict):
        raise ValueError("stable release must be an object")
    version = stable.get("version", "")
    build_id = stable.get("build_id", "")
    cdn_url = stable.get("url", "")
    if not isinstance(version, str) or not _VERSION_RE.fullmatch(version):
        raise ValueError("version has an invalid format")
    if not isinstance(build_id, str) or not _BUILD_ID_RE.fullmatch(build_id):
        raise ValueError("build_id has an invalid format")
    validate_cdn_url(track, cdn_url)
    return version, build_id, cdn_url


def validate_entry(entry):
    track = entry.get("track")
    if track not in MANIFESTS:
        raise ValueError("unknown OTA track")
    if not _VERSION_RE.fullmatch(entry.get("version", "")):
        raise ValueError("version has an invalid format")
    if not _BUILD_ID_RE.fullmatch(entry.get("build_id", "")):
        raise ValueError("build_id has an invalid format")
    if not isinstance(entry.get("bytes"), int) or not 0 <= entry["bytes"] <= 2 ** 31:
        raise ValueError("byte count is invalid")
    if not _DATE_RE.fullmatch(entry.get("discovered", "")):
        raise ValueError("discovery date is invalid")
    validate_cdn_url(track, entry.get("cdn_url", ""))
    if not _WAYBACK_TS_RE.fullmatch(entry.get("wayback_ts", "")):
        raise ValueError("Wayback timestamp is invalid")


# --------------------------------------------------------------------------- #
# data file
# --------------------------------------------------------------------------- #

def load_dat(path):
    entries = []
    try:
        with open(path) as fh:
            for line_number, raw in enumerate(fh, 1):
                line = raw.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split("|")
                if len(parts) != 7:
                    continue
                track, version, build_id, bytes_str, discovered, cdn_url, wayback_ts = parts
                entry = {
                    "track": track,
                    "version": version,
                    "build_id": build_id,
                    "bytes": int(bytes_str) if bytes_str else 0,
                    "discovered": discovered,
                    "cdn_url": cdn_url,
                    "wayback_ts": wayback_ts,
                }
                try:
                    validate_entry(entry)
                except (TypeError, ValueError) as exc:
                    raise ValueError(f"invalid data row {line_number}: {exc}") from exc
                entries.append(entry)
    except FileNotFoundError:
        pass
    return entries


def save_dat(path, entries):
    lines = [
        "# Shelly Wall Display firmware archive — managed by shelly-firmware-monitor workflow",
        "# Source of truth: track|version|build_id|bytes|discovered|cdn_url|wayback_ts",
        "#",
        "# Tracks:",
        "#   WallDisplay    — armeabi-v7a (original: MT6580/Android 7; X2: SC7731E/Android 8.1)",
        "#   WallDisplayV2  — arm64-v8a (X1i/X2i: RK3326-S; XL: RK3566; U1/D1 hardware not established)",
        "#",
        "# cdn_url:   the opaque hash-addressed CDN URL from the manifest at time of discovery.",
        "#            Valid only while this version is current; Shelly replaces in-place on each release.",
        "# wayback_ts: Wayback Machine capture timestamp (yyyymmddHHMMSS), filled by the archive step.",
        "#             Empty = archival pending. Use the Wayback URL for durable access to old versions.",
    ]
    for e in entries:
        validate_entry(e)
        lines.append("|".join([
            e["track"], e["version"], e["build_id"],
            str(e["bytes"]), e["discovered"], e["cdn_url"], e["wayback_ts"],
        ]))
    with open(path, "w") as fh:
        fh.write("\n".join(lines) + "\n")


def gha_output(name, value):
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", name) or "\r" in value or "\n" in value:
        raise ValueError("GitHub Actions output must be a single safe assignment")
    path = os.environ.get("GITHUB_OUTPUT")
    if path:
        with open(path, "a") as fh:
            fh.write(f"{name}={value}\n")
    else:
        print(f"  (output) {name}={value}")


# --------------------------------------------------------------------------- #
# probe
# --------------------------------------------------------------------------- #

def fetch_manifest(url):
    req = urllib.request.Request(url, headers={"User-Agent": "ha-paneld-shelly-monitor"})
    with urllib.request.urlopen(req, timeout=PROBE_TIMEOUT, context=_SSL_CONTEXT) as r:
        return json.load(r)


def head_size(track, url):
    validate_cdn_url(track, url)
    req = urllib.request.Request(
        url, method="HEAD", headers={"User-Agent": "ha-paneld-shelly-monitor"})
    with urllib.request.urlopen(req, timeout=PROBE_TIMEOUT, context=_SSL_CONTEXT) as r:
        validate_cdn_url(track, r.geturl())
        return int(r.headers.get("Content-Length") or 0)


def cmd_verify(_args):
    """Strictly exercise both vendor TLS hosts for every configured OTA track."""
    failed = False
    for track, manifest_url in MANIFESTS.items():
        try:
            data = fetch_manifest(manifest_url)
            version, _build_id, cdn_url = validate_release(track, data.get("stable"))
            size = head_size(track, cdn_url)
        except Exception as exc:
            print(f"ERROR: could not verify {track}: {exc}", file=sys.stderr)
            failed = True
            continue
        print(f"verified: {track} {version} ({size / 1e6:.1f} MB)")
    return 1 if failed else 0


def cmd_probe(args):
    entries = load_dat(args.dat)
    known = {(e["track"], e["version"]) for e in entries}
    new_entries = []
    releases = []
    fetch_failed = False
    invalid_manifest = False

    for track, manifest_url in MANIFESTS.items():
        try:
            data = fetch_manifest(manifest_url)
        except Exception as exc:
            print(f"ERROR: could not fetch {track} manifest: {exc}", file=sys.stderr)
            fetch_failed = True
            continue
        try:
            version, build_id, cdn_url = validate_release(track, data.get("stable"))
        except (AttributeError, TypeError, ValueError) as exc:
            print(f"ERROR: rejected invalid {track} manifest: {exc}", file=sys.stderr)
            invalid_manifest = True
            continue
        releases.append((track, version, build_id, cdn_url))

    # Do not make CDN requests or partially persist another track unless every expected manifest
    # was fetched and passed the fixed schema. Network and vendor format changes must fail closed.
    if fetch_failed or invalid_manifest:
        return 1

    for track, version, build_id, cdn_url in releases:
        if (track, version) in known:
            print(f"known:  {track} {version}")
        else:
            try:
                size = head_size(track, cdn_url)
            except Exception as exc:
                print(f"ERROR: could not verify {track} CDN object: {exc}", file=sys.stderr)
                return 1
            today = time.strftime("%Y-%m-%d", time.gmtime())
            entry = {
                "track": track, "version": version, "build_id": build_id,
                "bytes": size, "discovered": today,
                "cdn_url": cdn_url, "wayback_ts": "",
            }
            new_entries.append(entry)
            print(f"NEW:    {track} {version} ({size / 1e6:.1f} MB)")

    if new_entries:
        entries.extend(new_entries)
        save_dat(args.dat, entries)
        gha_output("has_new", "true")
        gha_output("new_versions",
                   " ".join(f"{e['track']}/{e['version']}" for e in new_entries))
    else:
        gha_output("has_new", "false")
        gha_output("new_versions", "")

    pending = [e for e in entries if not e["wayback_ts"]]
    gha_output("has_pending", "true" if pending else "false")
    print(f"pending archival: {len(pending)}")
    return 0


# --------------------------------------------------------------------------- #
# archive
# --------------------------------------------------------------------------- #

def _wayback_auth():
    key = os.environ.get("WAYBACK_S3", "").strip()
    return (f"LOW {key}", True) if key else (None, False)


def _spn_request(url, body_fields, auth):
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "ha-paneld-shelly-archiver",
    }
    if auth:
        headers["Authorization"] = auth
    body = urllib.parse.urlencode(body_fields).encode()
    req = urllib.request.Request(SPN_URL, data=body, headers=headers, method="POST")
    try:
        with urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace") if e.fp else ""
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"status": "error", "raw": raw[:200]}
    except Exception as exc:
        return {"status": "error", "exc": str(exc)}


def spn_submit(url, auth):
    resp = _spn_request(url, {
        "url": url,
        "skip_first_archive": "1",
        "if_not_archived_within": "365d",
    }, auth)
    return resp.get("job_id"), resp


def spn_available(url):
    q = AVAIL_URL + "?url=" + urllib.parse.quote(url, safe="")
    try:
        with urlopen(q, timeout=30) as r:
            d = json.load(r)
    except Exception:
        return None
    snap = d.get("archived_snapshots", {}).get("closest")
    timestamp = snap.get("timestamp") if snap else None
    return timestamp if isinstance(timestamp, str) and _WAYBACK_TS_RE.fullmatch(timestamp) and timestamp else None


def cmd_archive(args):
    auth, authed = _wayback_auth()
    if not authed:
        print("WAYBACK_S3 not set — skipping archival. Set the secret to enable automatic "
              "Wayback Machine preservation.")
        return 0

    entries = load_dat(args.dat)
    pending = [e for e in entries if not e["wayback_ts"]]
    if not pending:
        print("All entries already archived.")
        return 0

    print(f"Archiving {len(pending)} entry/entries to Wayback Machine...")

    # Pass A: confirm anything already captured from prior submissions.
    def _check(e):
        return e, spn_available(e["cdn_url"])

    with ThreadPoolExecutor(max_workers=8) as ex:
        for entry, ts in ex.map(_check, pending):
            if ts:
                entry["wayback_ts"] = ts
                print(f"  pre-confirmed: {entry['track']} {entry['version']} ({ts})")

    still_pending = [e for e in pending if not e["wayback_ts"]]

    # Pass B: submit remaining, paced into waves.
    submitted = []
    waves = [still_pending[i:i + WAVE_SIZE] for i in range(0, len(still_pending), WAVE_SIZE)]
    for wi, wave in enumerate(waves, 1):
        for entry in wave:
            jid, resp = spn_submit(entry["cdn_url"], auth)
            if jid:
                submitted.append(entry)
                print(f"  submitted:  {entry['track']} {entry['version']} (job {jid})")
            else:
                ext = resp.get("status_ext") or resp.get("status") or repr(resp)
                print(f"  WARN: submit failed for {entry['track']} {entry['version']}: {ext}",
                      file=sys.stderr)
        if wi < len(waves):
            time.sleep(DRAIN_WAIT)

    # Pass C: confirm this run's submissions.
    if submitted:
        print(f"Waiting {CONFIRM_WAIT}s for captures to settle...")
        time.sleep(CONFIRM_WAIT)
        for entry in submitted:
            ts = spn_available(entry["cdn_url"])
            if ts:
                entry["wayback_ts"] = ts
                print(f"  confirmed:  {entry['track']} {entry['version']} ({ts})")
            else:
                print(f"  WARN: {entry['track']} {entry['version']} not confirmed yet "
                      f"(will retry next run)", file=sys.stderr)

    save_dat(args.dat, entries)
    done = sum(1 for e in pending if e["wayback_ts"])
    print(f"Archived {done}/{len(pending)} this run.")
    return 0


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

def main():
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    v = sub.add_parser("verify", help="strictly validate current manifests and CDN objects")
    v.set_defaults(func=cmd_verify)

    p = sub.add_parser("probe", help="check manifests for new versions, update .dat")
    p.add_argument("--dat", required=True)
    p.set_defaults(func=cmd_probe)

    a = sub.add_parser("archive", help="submit unarchived URLs to the Wayback Machine")
    a.add_argument("--dat", required=True)
    a.set_defaults(func=cmd_archive)

    args = ap.parse_args()
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
