#!/usr/bin/env python3
"""NSPanel Pro firmware OTA index, URL monitor and discovery.

The fw-120p.dat and fw-86p.dat files are canonical. Probe records a seven-day
availability history; discover finds and validates candidate CDN releases.
The site generator reads the canonical data files and preserved history branches.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

HOST = "https://global-otadl2bsy.coolkit.cc"
HERE = os.path.dirname(os.path.abspath(__file__))

# (display name, sub-title, data file)
DEVICES = [
    ("120P", "750×1334, rk3326-S", "fw-120p.dat"),
    ("86P", "480×480, PX30", "fw-86p.dat"),
]

WINDOW_HOURS = 24 * 7    # 7-day rolling window
MAX_POINTS = 7           # one dot per day
PROBE_TIMEOUT = 20
PROBE_WORKERS = 16
# --------------------------------------------------------------------------- #
# data parsing + URL builders (shared by discovery, probe and archive)
# --------------------------------------------------------------------------- #

def human(b):
    return f"{b} ({b / 1048576:.1f} MB)"


def vkey(v):
    return tuple(int(x) for x in v.split("."))


def parse(path):
    d = {"fulls": [], "diffs": [], "apks": [], "suffix": "", "apkfmt": "", "channel": ""}
    with open(path) as fh:
        for raw in fh:
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("channel "):
                d["channel"] = line.split(" ", 1)[1].strip()
            elif line.startswith("diffsuffix"):
                parts = line.split(" ", 1)
                d["suffix"] = parts[1].strip() if len(parts) > 1 else ""
            elif line.startswith("apkfmt "):
                d["apkfmt"] = line.split(" ", 1)[1].strip()
            elif line.startswith("full|"):
                _, ver, idx, fn, sz = line.split("|")
                d["fulls"].append((ver, idx, fn, int(sz)))
            elif line.startswith("diff|"):
                p = line.split("|")
                to, idx = p[1], p[2]
                for fs in p[3:]:
                    frm, sz = fs.split(":")
                    d["diffs"].append((to, frm, idx, int(sz)))
            elif line.startswith("apk|"):
                _, ver, idx, sz = line.split("|")
                d["apks"].append((ver, idx, int(sz)))
    return d


def full_url(d, idx, fn):
    return f"{HOST}/{d['channel']}/rom/{idx}/{fn}"


def diff_url(d, idx, frm, to):
    return f"{HOST}/{d['channel']}/rom-diff/{idx}/CK_{frm}_{to}{d['suffix']}-diff.zip"


def apk_url(d, idx, ver):
    return f"{HOST}/{d['channel']}/apk/{idx}/{d['apkfmt']}{ver}.apk"


def all_urls(devices):
    """Every downloadable URL across all devices (deduped, stable order)."""
    return list(all_url_sizes(devices))


def all_url_sizes(devices):
    """Every downloadable URL mapped to its expected total byte size."""
    urls = {}
    for d in devices:
        for ver, idx, fn, sz in d["fulls"]:
            urls[full_url(d, idx, fn)] = sz
        for to, frm, idx, sz in d["diffs"]:
            urls[diff_url(d, idx, frm, to)] = sz
        for ver, idx, sz in d["apks"]:
            urls[apk_url(d, idx, ver)] = sz
    return urls


def load_devices():
    return [parse(os.path.join(HERE, fn)) for _, _, fn in DEVICES]


# --------------------------------------------------------------------------- #
# history
# --------------------------------------------------------------------------- #

def load_history(path):
    try:
        with open(path) as fh:
            h = json.load(fh)
    except (FileNotFoundError, json.JSONDecodeError):
        h = {}
    h.setdefault("samples", [])
    return h


def save_history(path, h):
    with open(path, "w") as fh:
        json.dump(h, fh, separators=(",", ":"))


def trim(h, now):
    cutoff = now - WINDOW_HOURS * 3600 - 1800   # 30 min grace for scheduler jitter
    latest_by_day = {}
    for sample in h["samples"]:
        timestamp = sample.get("t", 0)
        if timestamp < cutoff:
            continue
        day = timestamp // 86400
        previous = latest_by_day.get(day)
        if previous is None or timestamp >= previous.get("t", 0):
            latest_by_day[day] = sample
    h["samples"] = [latest_by_day[day] for day in sorted(latest_by_day)][-MAX_POINTS:]



# --------------------------------------------------------------------------- #
# probe
# --------------------------------------------------------------------------- #

def response_total_size(response):
    """Read the complete object size from a range or full response."""
    if response.status == 206:
        content_range = response.headers.get("Content-Range", "")
        try:
            return int(content_range.rsplit("/", 1)[1])
        except (IndexError, ValueError):
            return None
    if response.status == 200:
        try:
            return int(response.headers.get("Content-Length", ""))
        except ValueError:
            return None
    return None


def probe_one(url, expected_size):
    req = urllib.request.Request(url, method="GET")
    req.add_header("Range", "bytes=0-0")
    req.add_header("User-Agent", "ha-paneld-firmware-monitor")
    try:
        t0 = time.time()
        with urllib.request.urlopen(req, timeout=PROBE_TIMEOUT) as r:
            ms = int((time.time() - t0) * 1000)
            return response_total_size(r) == expected_size, ms
    except urllib.error.HTTPError:
        return False, None      # 403 (missing) → down
    except Exception:
        return False, None


# --------------------------------------------------------------------------- #
# discover — find versions that are on the CDN but not yet in the .dat
# --------------------------------------------------------------------------- #

ZIP_MAGIC = b"PK\x03\x04"
DISCOVER_INDEX_WINDOW = 32
DISCOVER_MINOR_WINDOW = 4
DISCOVER_PATCH_WINDOW = 8
# Waits before each retry of a throttled (429), unavailable (5xx) or timed-out
# probe. Sixteen parallel workers can briefly trip the CDN's rate limit.
DISCOVER_RETRY_DELAYS = (5, 15, 45)
TRANSIENT_HTTP_CODES = {429, 500, 502, 503, 504}


def discover_one(url):
    """Return the object's total size if `url` is a real ZIP, else None.

    The CDN answers 403 for anything that does not exist, so a 206 with ZIP
    magic is the only positive signal. Reading the first four bytes rather
    than one costs nothing and rejects a non-ZIP body that still ranges.
    """
    req = urllib.request.Request(url, method="GET")
    req.add_header("Range", "bytes=0-3")
    req.add_header("User-Agent", "ha-paneld-firmware-monitor")
    for delay in DISCOVER_RETRY_DELAYS + (None,):
        try:
            with urllib.request.urlopen(req, timeout=PROBE_TIMEOUT) as r:
                total = response_total_size(r)
                if total is None or r.read(4) != ZIP_MAGIC:
                    return None
                return total
        except urllib.error.HTTPError as exc:
            if exc.code == 403:
                return None         # This CDN's explicit missing-object response.
            if exc.code not in TRANSIENT_HTTP_CODES or delay is None:
                raise
        except (TimeoutError, urllib.error.URLError):
            if delay is None:
                raise
        # A throttled or briefly unavailable CDN is not an answer. Wait and ask
        # again; only a persistent failure fails the run, never "not found".
        time.sleep(delay)


def candidate_versions(
    known,
    minor_window=DISCOVER_MINOR_WINDOW,
    patch_window=DISCOVER_PATCH_WINDOW,
):
    """Plausible successors to the highest known version.

    Sonoff skips freely: 4.0.x jumped straight to 4.4.0, so a patch+1 guess
    alone would miss a release permanently. Cover the next few patches, the
    next few minors at .0/.1, and the next major.
    """
    major, minor, patch = vkey(known)
    out = []
    for p in range(patch + 1, patch + 1 + patch_window):
        out.append(f"{major}.{minor}.{p}")
    for m in range(minor + 1, minor + 1 + minor_window):
        for p in range(patch_window):
            out.append(f"{major}.{m}.{p}")
    out.append(f"{major + 1}.0.0")
    return out


def newest_version(entries):
    """Highest version across (ver, ...) tuples, by numeric key."""
    return max((e[0] for e in entries), key=vkey)


def rom_states(d):
    """Every version a panel's ROM can actually be sitting on.

    These are the plausible sources of an inbound diff: full ROMs, previous
    diff targets, and versions already used as a diff source. The newest
    release must be included even though it has never been a source yet —
    it is the single most likely upgrade origin, and deriving the set from
    observed sources alone would silently exclude it.
    """
    states = {frm for _t, frm, _i, _s in d["diffs"]}
    states |= {to for to, _f, _i, _s in d["diffs"]}
    states |= {ver for ver, _idx, _fn, _sz in d["fulls"]}
    return states


def discover_device(d, index_window, minor_window):
    """Probe one channel for unindexed APKs and their inbound ROM diffs.

    Returns (findings, searched) where `searched` records the exact window
    that was covered, so a miss is diagnosable rather than silent.
    """
    known_apk = {v for v, _idx, _sz in d["apks"]}
    known_versions = known_apk | {to for to, _f, _i, _s in d["diffs"]}
    newest = max(known_versions, key=vkey)
    versions = [v for v in candidate_versions(newest, minor_window) if v not in known_versions]

    max_apk_idx = max(int(idx) for _v, idx, _s in d["apks"])
    apk_indices = list(range(max_apk_idx + 1, max_apk_idx + 1 + index_window))

    apk_urls = {}
    for idx in apk_indices:
        for ver in versions:
            apk_urls[apk_url(d, idx, ver)] = (idx, ver)

    with ThreadPoolExecutor(max_workers=PROBE_WORKERS) as ex:
        sizes = list(ex.map(discover_one, apk_urls))

    findings = []
    for (url, (idx, ver)), size in zip(apk_urls.items(), sizes):
        if size is not None:
            findings.append({"kind": "apk", "version": ver, "index": idx, "bytes": size, "url": url})

    searched = {
        "channel": d["channel"],
        "apk_indices": [apk_indices[0], apk_indices[-1]],
        "versions": versions,
        "diff_indices": None,
    }

    # A release can be ROM-diff-only, so its diff must not depend on finding an
    # APK for the same version first. Probe every candidate target directly.
    max_diff_idx = max(int(idx) for _t, _f, idx, _s in d["diffs"])
    diff_indices = list(range(max_diff_idx + 1, max_diff_idx + 1 + index_window))
    froms = sorted(rom_states(d), key=vkey)
    diff_urls = {}
    for idx in diff_indices:
        for ver in versions:
            for frm in froms:
                diff_urls[diff_url(d, idx, frm, ver)] = (idx, ver, frm)
    with ThreadPoolExecutor(max_workers=PROBE_WORKERS) as ex:
        dsizes = list(ex.map(discover_one, diff_urls))
    for (url, (idx, ver, frm)), size in zip(diff_urls.items(), dsizes):
        if size is not None:
            findings.append({"kind": "diff", "version": ver, "index": idx,
                             "from": frm, "bytes": size, "url": url})
    searched["diff_indices"] = [diff_indices[0], diff_indices[-1]]
    searched["diff_froms"] = froms

    return findings, searched


def validate_harness(devices):
    """Prove the prober can see objects that are known to exist.

    Without this a broken prober, a DNS failure or a CDN change would report
    'nothing new' forever. Every device must confirm, and the check uses the
    newest indexed APK because that is the object most like what discovery is
    looking for.
    """
    ok = True
    for d in devices:
        ver, idx, expected = max(d["apks"], key=lambda a: vkey(a[0]))
        url = apk_url(d, idx, ver)
        size = discover_one(url)
        if size == expected:
            print(f"harness ok: {d['channel']} {ver} ({expected} bytes)")
        else:
            print(f"harness FAILED: {d['channel']} {ver} expected {expected}, got {size} — {url}")
            ok = False
    return ok


def format_findings(findings):
    """Render findings as `.dat` lines, one per version and kind.

    Diffs are grouped onto a single line per target, matching the existing
    format, with sources in ascending version order.
    """
    lines = []
    apks = sorted((f for f in findings if f["kind"] == "apk"), key=lambda f: vkey(f["version"]))
    for f in apks:
        lines.append(("apk", f"apk|{f['version']}|{f['index']}|{f['bytes']}"))

    diffs = [f for f in findings if f["kind"] == "diff"]
    by_target = {}
    for f in diffs:
        by_target.setdefault((f["version"], f["index"]), []).append(f)
    for (ver, idx) in sorted(by_target, key=lambda k: vkey(k[0])):
        group = sorted(by_target[(ver, idx)], key=lambda f: vkey(f["from"]))
        joined = "|".join(f"{f['from']}:{f['bytes']}" for f in group)
        lines.append(("diff", f"diff|{ver}|{idx}|{joined}"))
    return lines


def apply_findings(path, findings):
    """Append `.dat` lines after the last existing entry of the same kind.

    Appending inside the existing group keeps the file readable; the rendered
    tables sort by version regardless, so placement never changes output.
    """
    new_lines = format_findings(findings)
    if not new_lines:
        return 0
    lines = open(path).read().rstrip("\n").split("\n")
    for kind, text in new_lines:
        if text in lines:
            continue
        last = max((i for i, l in enumerate(lines) if l.startswith(f"{kind}|")), default=len(lines) - 1)
        lines.insert(last + 1, text)
    open(path, "w").write("\n".join(lines) + "\n")
    return len(new_lines)


def set_github_output(**kv):
    path = os.environ.get("GITHUB_OUTPUT")
    if not path:
        return
    with open(path, "a") as fh:
        for k, v in kv.items():
            fh.write(f"{k}={v}\n")


def cmd_discover(args):
    devices = load_devices()

    if not validate_harness(devices):
        print("discovery aborted: the prober could not see known-good objects, "
              "so a negative result would be meaningless.")
        set_github_output(harness_ok="false", found="false")
        return 2

    all_findings = []
    per_device = []
    for d in devices:
        findings, searched = discover_device(d, args.index_window, args.minor_window)
        per_device.append((d, findings))
        lo, hi = searched["apk_indices"]
        print(f"searched {searched['channel']}: apk indices {lo}-{hi} × "
              f"{len(searched['versions'])} candidate versions "
              f"({', '.join(searched['versions'])})")
        if searched["diff_indices"]:
            dlo, dhi = searched["diff_indices"]
            print(f"searched {searched['channel']}: rom-diff indices {dlo}-{dhi} × "
                  f"from {', '.join(searched['diff_froms'])}")
        all_findings.extend(findings)

    if not all_findings:
        print("no unindexed firmware found in the searched window")
        set_github_output(harness_ok="true", found="false")
        return 0

    print(f"\nFOUND {len(all_findings)} unindexed object(s):")
    for f in sorted(all_findings, key=lambda x: (vkey(x["version"]), x["kind"], x["url"])):
        label = f"{f['kind']} {f['version']}"
        if f["kind"] == "diff":
            label += f" ← {f['from']}"
        print(f"  {label}  idx={f['index']}  {human(f['bytes'])}  {f['url']}")

    versions = sorted({f["version"] for f in all_findings}, key=vkey)
    set_github_output(harness_ok="true", found="true", versions=",".join(versions))

    if args.apply:
        written = 0
        for (d, findings), (_name, _sub, fn) in zip(per_device, DEVICES):
            if findings:
                written += apply_findings(os.path.join(HERE, fn), findings)
        print(f"\nappended {written} line(s) to the index — re-run `probe` to validate "
              f"every new URL and byte size against the CDN")

    if args.json:
        with open(args.json, "w") as fh:
            json.dump(all_findings, fh, indent=2, sort_keys=True)
        print(f"\nwrote {args.json}")
    return 0


def cmd_probe(args):
    from shelly_firmware import head_size, load_dat

    devices = load_devices()
    url_sizes = all_url_sizes(devices)
    entries = list(url_sizes.items())
    with ThreadPoolExecutor(max_workers=PROBE_WORKERS) as ex:
        outcomes = list(ex.map(lambda item: probe_one(*item), entries))
    results = {u: (1 if up else 0) for (u, _size), (up, _ms) in zip(entries, outcomes)}
    sonoff_up = sum(results.values())

    # Shelly replaces old objects in place, so a 404 is an expected historical
    # observation and does not trigger Sonoff's one-hour outage retry. Reuse
    # Shelly's validated URL and pinned-CA HEAD path for every indexed object.
    shelly_entries = load_dat(os.path.join(HERE, "fw-shelly-walldisplay.dat"))

    def check_shelly(entry):
        try:
            size = head_size(entry["track"], entry["cdn_url"])
        except urllib.error.HTTPError as exc:
            if exc.code not in (403, 404):
                raise
            return entry["cdn_url"], 0
        return entry["cdn_url"], int(size == entry["bytes"])

    with ThreadPoolExecutor(max_workers=PROBE_WORKERS) as ex:
        for url, up in ex.map(check_shelly, shelly_entries):
            results[url] = up

    h = load_history(args.history)
    now = int(time.time())
    h["samples"].append({"t": now, "r": results})
    trim(h, now)
    save_history(args.history, h)
    set_github_output(sample_written="true")

    down = len(entries) - sonoff_up
    shelly_up = sum(results[e["cdn_url"]] for e in shelly_entries)
    print(f"probed {len(entries)} Sonoff URLs at {time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(now))}: "
          f"{sonoff_up} up, {down} down; {shelly_up}/{len(shelly_entries)} Shelly URLs available "
          f"({len(h['samples'])} samples retained)")
    return 1 if down > 0 else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    sub = ap.add_subparsers(dest="cmd", required=True)

    probe = sub.add_parser("probe", help="check every URL and append availability")
    probe.add_argument("--history", required=True)
    probe.set_defaults(func=cmd_probe)

    discover = sub.add_parser("discover", help="search the CDN for new releases")
    discover.add_argument("--index-window", type=int, default=DISCOVER_INDEX_WINDOW)
    discover.add_argument("--minor-window", type=int, default=DISCOVER_MINOR_WINDOW)
    discover.add_argument("--json", help="write findings to JSON")
    discover.add_argument("--apply", action="store_true")
    discover.set_defaults(func=cmd_discover)

    args = ap.parse_args()
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
