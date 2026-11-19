#!/usr/bin/env python3

import http.client
import io
import os
import pathlib
import tempfile
import time
import unittest
import urllib.error
from types import SimpleNamespace
from unittest import mock

import firmware_index
import shelly_firmware


class ResponseTotalSizeTest(unittest.TestCase):
    def test_reads_total_from_partial_response(self):
        response = SimpleNamespace(
            status=206,
            headers={"Content-Range": "bytes 0-0/309567578", "Content-Length": "1"},
        )

        self.assertEqual(firmware_index.response_total_size(response), 309567578)

    def test_rejects_partial_response_without_total(self):
        response = SimpleNamespace(status=206, headers={"Content-Range": "bytes 0-0/*"})

        self.assertIsNone(firmware_index.response_total_size(response))

    def test_reads_full_response_content_length(self):
        response = SimpleNamespace(status=200, headers={"Content-Length": "136037762"})

        self.assertEqual(firmware_index.response_total_size(response), 136037762)


class HistoryTrimTest(unittest.TestCase):
    def test_retry_replaces_the_same_utc_days_initial_sample(self):
        day = 20000 * 86400
        first = {"t": day + 8 * 3600, "r": {"firmware": 0}}
        retry = {"t": day + 9 * 3600, "r": {"firmware": 1}}
        history = {"samples": [first, retry]}

        firmware_index.trim(history, day + 10 * 3600)

        self.assertEqual(history["samples"], [retry])

    def test_retains_the_latest_sample_for_each_of_seven_days(self):
        base_day = 20000
        samples = []
        for offset in range(8):
            day = (base_day + offset) * 86400
            samples.append({"t": day + 8 * 3600, "r": {"day": offset, "attempt": 1}})
            samples.append({"t": day + 9 * 3600, "r": {"day": offset, "attempt": 2}})
        history = {"samples": list(reversed(samples))}
        now = (base_day + 7) * 86400 + 10 * 3600

        firmware_index.trim(history, now)

        self.assertEqual(len(history["samples"]), 7)
        self.assertEqual(
            [(sample["r"]["day"], sample["r"]["attempt"]) for sample in history["samples"]],
            [(offset, 2) for offset in range(1, 8)],
        )


class AvailabilityProbeTest(unittest.TestCase):
    def test_daily_probe_records_shelly_404s_without_requesting_sonoff_retry(self):
        entries = shelly_firmware.load_dat(
            pathlib.Path(firmware_index.HERE) / "fw-shelly-walldisplay.dat"
        )
        self.assertGreaterEqual(len(entries), 2)
        available = entries[0]
        missing = urllib.error.HTTPError(
            "https://fwcdn.shelly.cloud/old", 404, "replaced", {}, None
        )

        def head(track, url):
            if url == available["cdn_url"]:
                return available["bytes"]
            raise missing

        with tempfile.TemporaryDirectory() as tmp, \
                mock.patch.object(firmware_index, "probe_one", return_value=(True, 1)), \
                mock.patch.object(shelly_firmware, "head_size", side_effect=head):
            history = pathlib.Path(tmp) / "history.json"
            outputs = pathlib.Path(tmp) / "github-output"
            with mock.patch.dict(os.environ, {"GITHUB_OUTPUT": str(outputs)}):
                result = firmware_index.cmd_probe(SimpleNamespace(history=str(history)))
            sample = firmware_index.load_history(history)["samples"][-1]["r"]
            self.assertIn("sample_written=true", outputs.read_text())

        self.assertEqual(result, 0)
        self.assertEqual(sample[available["cdn_url"]], 1)
        for entry in entries[1:]:
            self.assertEqual(sample[entry["cdn_url"]], 0)
        for url in firmware_index.all_urls(firmware_index.load_devices()):
            self.assertEqual(sample[url], 1)


class DiscoveryTest(unittest.TestCase):
    """Contracts for `discover`, checked against the real index data.

    Discovery guesses forward into a bucket that cannot be listed, so its
    failure mode is a silent false negative. Each contract below pins a way
    that has already been observed to happen or would hide a real release.
    """

    def setUp(self):
        self.devices = firmware_index.load_devices()

    def test_every_rom_target_can_be_an_upgrade_source(self):
        # Regression: the from-set was built only from versions already used
        # as a diff SOURCE, so the newest release — which has only ever been
        # a TARGET — was excluded, and the likeliest upgrade path of all
        # (latest → next) could never be discovered.
        for d in self.devices:
            targets = {to for to, _f, _i, _s in d["diffs"]}
            states = firmware_index.rom_states(d)
            missing = sorted(targets - states, key=firmware_index.vkey)
            self.assertEqual(
                missing, [], f"{d['channel']}: ROM targets absent from the upgrade-source set"
            )

    def test_candidate_versions_span_the_largest_historical_minor_jump(self):
        # Sonoff shipped 4.0.12 and then 4.4.0 with nothing between, so the
        # candidate window must reach at least that far or a real release
        # would sit undiscovered forever.
        jumps = []
        for d in self.devices:
            versions = sorted({v for v, _i, _s in d["apks"]}, key=firmware_index.vkey)
            for earlier, later in zip(versions, versions[1:]):
                a, b = firmware_index.vkey(earlier), firmware_index.vkey(later)
                if b[0] == a[0]:
                    jumps.append(b[1] - a[1])
        widest = max(jumps)
        self.assertGreater(widest, 0, "index data has no minor-version jump to calibrate against")

        newest = firmware_index.newest_version(self.devices[0]["apks"])
        major, minor, _patch = firmware_index.vkey(newest)
        candidates = firmware_index.candidate_versions(newest)
        self.assertIn(
            f"{major}.{minor + widest}.0",
            candidates,
            f"candidate versions do not reach a {widest}-minor jump, which has happened before",
        )

    def test_candidate_versions_exclude_the_known_release(self):
        newest = firmware_index.newest_version(self.devices[0]["apks"])
        self.assertNotIn(newest, firmware_index.candidate_versions(newest))

    def test_default_windows_cover_observed_index_and_patch_gaps(self):
        def widest_gap(position, kind):
            gaps = []
            for d in self.devices:
                indices = sorted({int(entry[position]) for entry in d[kind]})
                gaps.extend(later - earlier for earlier, later in zip(indices, indices[1:]))
            return max(gaps)

        self.assertGreaterEqual(firmware_index.DISCOVER_INDEX_WINDOW, widest_gap(1, "apks"))
        self.assertGreaterEqual(firmware_index.DISCOVER_DIFF_INDEX_WINDOW, widest_gap(2, "diffs"))
        self.assertIn("3.8.7", firmware_index.candidate_versions("3.8.0"))
        self.assertIn("3.9.3", firmware_index.candidate_versions("3.8.0"))

    def test_discover_one_requires_zip_magic(self):
        # A 206 alone is not proof: the CDN could serve an error body that
        # still satisfies a range request.
        response = mock.MagicMock()
        response.status = 206
        response.headers = {"Content-Range": "bytes 0-3/137890388"}
        response.read.return_value = b"<htm"
        response.__enter__.return_value = response

        with mock.patch("firmware_index._open", return_value=response):
            self.assertIsNone(firmware_index.discover_one("https://example.invalid/x.apk"))

    def test_discover_one_accepts_a_real_zip(self):
        response = mock.MagicMock()
        response.status = 206
        response.headers = {"Content-Range": "bytes 0-3/137890388"}
        response.read.return_value = b"PK\x03\x04"
        response.__enter__.return_value = response

        with mock.patch("firmware_index._open", return_value=response):
            self.assertEqual(
                firmware_index.discover_one("https://example.invalid/x.apk"), 137890388
            )

    def test_only_the_cdns_explicit_missing_response_means_absent(self):
        missing = urllib.error.HTTPError("https://example.invalid/x", 403, "missing", {}, None)
        throttled = urllib.error.HTTPError("https://example.invalid/x", 429, "slow down", {}, None)
        with mock.patch("firmware_index._open", side_effect=missing):
            self.assertIsNone(firmware_index.discover_one("https://example.invalid/x"))
        with mock.patch("firmware_index._open", side_effect=throttled), \
                mock.patch("time.sleep"):
            with self.assertRaises(firmware_index.CdnUnreachable):
                firmware_index.discover_one("https://example.invalid/x")
        with mock.patch("firmware_index._open", side_effect=TimeoutError("timed out")), \
                mock.patch("time.sleep"):
            with self.assertRaises(firmware_index.CdnUnreachable):
                firmware_index.discover_one("https://example.invalid/x")

    def test_a_briefly_unavailable_cdn_is_asked_again(self):
        unavailable = urllib.error.HTTPError("https://example.invalid/x", 503, "unavailable", {}, None)
        response = mock.MagicMock()
        response.__enter__.return_value = response
        response.status = 206
        response.headers = {"Content-Range": "bytes 0-3/137890388"}
        response.read.return_value = b"PK\x03\x04"
        with mock.patch("firmware_index._open", side_effect=[unavailable, unavailable, response]) as urlopen, \
                mock.patch("time.sleep") as sleep:
            self.assertEqual(firmware_index.discover_one("https://example.invalid/x.apk"), 137890388)
        self.assertEqual(urlopen.call_count, 3)
        self.assertEqual([c.args[0] for c in sleep.call_args_list], [5, 15])

    def test_a_persistently_unavailable_cdn_fails_the_run(self):
        unavailable = urllib.error.HTTPError("https://example.invalid/x", 503, "unavailable", {}, None)
        with mock.patch("firmware_index._open", side_effect=unavailable) as urlopen, \
                mock.patch("time.sleep"):
            with self.assertRaises(firmware_index.CdnUnreachable):
                firmware_index.discover_one("https://example.invalid/x")
        self.assertEqual(urlopen.call_count, 4)

    def test_a_vanished_known_object_still_fails_the_run(self):
        # A 404 for an indexed object means the CDN changed, not an outage:
        # it must stay red, never a daily warning that hides a blind prober.
        gone = urllib.error.HTTPError("https://example.invalid/x", 404, "not found", {}, None)
        with mock.patch("firmware_index._open", side_effect=gone), \
                mock.patch("time.sleep"), mock.patch("sys.stdout", io.StringIO()):
            with self.assertRaises(urllib.error.HTTPError):
                firmware_index.cmd_discover(
                    SimpleNamespace(index_window=2, minor_window=1, json=None, apply=False)
                )

    def test_every_indexed_diff_was_within_the_search_its_predecessors_imply(self):
        # Replay the real index: for each diff target in index order, the
        # search computed from the diffs before it must have covered its
        # index, and every source the old every-ROM-state search would have
        # tried. (A source first seen in that same diff, 3.7.0 → 3.7.1 on the
        # 86P, was never findable by either.) Full ROMs are never discovered,
        # so all of them count as known throughout.
        for d in self.devices:
            targets = sorted({(int(i), to) for to, _f, i, _s in d["diffs"]})
            for (index, target), (prev_index, _prev) in zip(targets[1:], targets):
                earlier = dict(d, diffs=[e for e in d["diffs"] if int(e[2]) <= prev_index])
                max_index = max(int(e[2]) for e in earlier["diffs"])
                self.assertLessEqual(
                    index - max_index, firmware_index.DISCOVER_DIFF_INDEX_WINDOW,
                    f"{d['channel']} {target}: diff index {index} outside the window",
                )
                sources = {f for to, f, i, _s in d["diffs"] if to == target and int(i) == index}
                missed = (sources & firmware_index.rom_states(earlier)) - firmware_index.diff_sources(earlier)
                self.assertEqual(missed, set(), f"{d['channel']} {target}: sources outside the search")

    def test_daily_search_stays_well_inside_the_job_limit(self):
        # The full cross of every ROM state ever seen made about 70,000 probes
        # and ran past the then 45-minute limit on hosted runners (about 26 to 41
        # probes a second there). 15,000 keeps a slow day under ten minutes.
        probes = 0
        with mock.patch.object(firmware_index, "discover_one", return_value=None):
            for d in self.devices:
                _findings, searched = firmware_index.discover_device(
                    d, firmware_index.DISCOVER_INDEX_WINDOW, firmware_index.DISCOVER_MINOR_WINDOW
                )
                probes += searched["probes"]
        self.assertLess(probes, 15000)

    def test_rom_diffs_are_probed_without_an_apk_hit(self):
        d = self.devices[0]
        with mock.patch.object(firmware_index, "discover_one", return_value=None):
            findings, searched = firmware_index.discover_device(
                d, index_window=1, minor_window=1, diff_index_window=1
            )
        self.assertEqual(findings, [])
        next_diff = max(int(index) for _to, _frm, index, _size in d["diffs"]) + 1
        self.assertEqual(searched["diff_indices"], [next_diff, next_diff])

    def test_a_blind_prober_aborts_instead_of_reporting_nothing_new(self):
        # The whole point of the daily job is that "nothing found" is
        # trustworthy. If the prober cannot see objects that are known to
        # exist, it must fail loudly rather than emit a clean negative.
        output = io.StringIO()
        with mock.patch.object(firmware_index, "discover_one", return_value=None), \
                mock.patch("sys.stdout", output):
            code = firmware_index.cmd_discover(
                SimpleNamespace(index_window=2, minor_window=1, json=None, apply=False)
            )

        self.assertEqual(code, 2)
        self.assertIn("harness FAILED", output.getvalue())
        self.assertNotIn("no unindexed firmware found", output.getvalue())

    def test_searched_window_is_reported_even_when_nothing_is_found(self):
        # A fixed window can miss a release when the CDN skips indices, so a
        # negative result must say what it actually covered.
        real = firmware_index.discover_one
        devices = self.devices

        def only_known_objects(url):
            known = firmware_index.all_url_sizes(devices)
            return known.get(url)

        output = io.StringIO()
        with mock.patch.object(firmware_index, "discover_one", side_effect=only_known_objects), \
                mock.patch("sys.stdout", output):
            code = firmware_index.cmd_discover(
                SimpleNamespace(index_window=2, minor_window=1, json=None, apply=False)
            )

        self.assertIsNot(real, None)
        self.assertEqual(code, 0)
        text = output.getvalue()
        self.assertIn("no unindexed firmware found", text)
        for d in devices:
            self.assertIn(f"searched {d['channel']}: apk indices", text)



class DroppedConnectionTest(unittest.TestCase):
    """The CDN closing a connection without a response (2026-10-04, 10-06, 11-04)."""

    URL = "https://example.invalid/x.apk"

    def zip_response(self):
        response = mock.MagicMock()
        response.__enter__.return_value = response
        response.status = 206
        response.headers = {"Content-Range": "bytes 0-3/137890388"}
        response.read.return_value = b"PK\x03\x04"
        return response

    def test_a_dropped_connection_is_retried(self):
        dropped = http.client.RemoteDisconnected("Remote end closed connection without response")
        with mock.patch("firmware_index._open", side_effect=[dropped, self.zip_response()]) as urlopen, \
                mock.patch("time.sleep") as sleep:
            self.assertEqual(firmware_index.discover_one(self.URL), 137890388)
        self.assertEqual(urlopen.call_count, 2)
        self.assertEqual([c.args[0] for c in sleep.call_args_list], [5])

    def test_a_persistently_dropping_cdn_ends_the_run_as_a_warning(self):
        dropped = http.client.RemoteDisconnected("Remote end closed connection without response")
        with tempfile.TemporaryDirectory() as tmp:
            # The harness sees known objects; every search probe is dropped.
            known = firmware_index.all_url_sizes(firmware_index.load_devices())
            known_zip = {url for url in known}

            def urlopen(request, timeout=None):
                if request.full_url in known_zip:
                    response = self.zip_response()
                    response.headers = {"Content-Range": f"bytes 0-3/{known[request.full_url]}"}
                    return response
                raise dropped

            dats = {n: pathlib.Path(firmware_index.HERE, n).read_bytes() for n in ("fw-120p.dat", "fw-86p.dat")}
            github_output = pathlib.Path(tmp, "output")
            output = io.StringIO()
            with mock.patch("firmware_index._open", side_effect=urlopen), \
                    mock.patch("time.sleep") as sleep, \
                    mock.patch.dict(os.environ, {"GITHUB_OUTPUT": str(github_output)}), \
                    mock.patch("sys.stdout", output):
                code = firmware_index.cmd_discover(
                    SimpleNamespace(index_window=2, minor_window=1, json=None, apply=True)
                )

            self.assertEqual(code, 0)
            self.assertIn("::warning::", output.getvalue())
            self.assertIn("RemoteDisconnected", output.getvalue())
            self.assertIn("found=false", github_output.read_text())
            self.assertTrue(sleep.called)
            for name, before in dats.items():
                self.assertEqual(pathlib.Path(firmware_index.HERE, name).read_bytes(), before)


class FakeResponse:
    """An http.client response that records how much of its body was read."""

    def __init__(self, status, headers, body):
        self.status, self.reason, self.headers, self.body, self.consumed = status, "", headers, body, 0

    def read(self, n=None):
        end = len(self.body) if n is None or n < 0 else min(len(self.body), self.consumed + n)
        chunk, self.consumed = self.body[self.consumed:end], end
        return chunk

    def isclosed(self):
        return self.consumed >= len(self.body)


class FakeConnection:
    """http.client.HTTPSConnection stand-in: answers from a script of outcomes."""

    made = []

    def __init__(self, host, timeout=None):
        self.host, self.timeout, self.requests, self.closed = host, timeout, [], False
        FakeConnection.made.append(self)

    def request(self, method, path, headers=None):
        self.requests.append((method, path, headers))
        outcome = FakeConnection.script.pop(0)
        if isinstance(outcome, BaseException):
            raise outcome
        self.outcome = outcome

    def getresponse(self):
        status, total, body = self.outcome
        headers = http.client.HTTPMessage()
        if status == 200:
            headers["Content-Length"] = str(total)
        elif total is not None:
            headers["Content-Range"] = f"bytes 0-3/{total}"
        self.response = FakeResponse(status, headers, body)
        return self.response

    def close(self):
        self.closed = True


class KeptAliveConnectionTest(unittest.TestCase):
    """Discover probes reuse one connection per worker with urlopen's semantics."""

    URL = "https://cdn.invalid/nspanel-pro/apk/1/x.apk"

    def setUp(self):
        firmware_index._connections.__dict__.clear()
        FakeConnection.made = []
        patches = [mock.patch("http.client.HTTPSConnection", FakeConnection),
                   mock.patch("urllib.request.getproxies", return_value={}),
                   mock.patch("urllib.request.urlopen", side_effect=AssertionError("fresh connection")),
                   mock.patch("time.sleep")]
        self.sleep = [p.start() for p in patches][-1]
        for p in patches:
            self.addCleanup(p.stop)
        self.addCleanup(firmware_index._connections.__dict__.clear)

    def test_probes_share_one_connection_and_keep_their_answers(self):
        FakeConnection.script = [(403, None, b"<Error/>"), (206, 137890388, b"PK\x03\x04"),
                                 (206, 99, b"<htm"), (404, None, b"")]
        self.assertIsNone(firmware_index.discover_one(self.URL))
        self.assertEqual(firmware_index.discover_one(self.URL), 137890388)
        self.assertIsNone(firmware_index.discover_one(self.URL))
        with self.assertRaises(urllib.error.HTTPError) as gone:
            firmware_index.discover_one(self.URL)
        self.assertEqual(gone.exception.code, 404)
        self.assertEqual(len(FakeConnection.made), 1)
        method, path, headers = FakeConnection.made[0].requests[0]
        self.assertEqual((method, path, headers["Range"]), ("GET", "/nspanel-pro/apk/1/x.apk", "bytes=0-3"))

    def test_a_response_that_ignores_the_range_is_not_downloaded(self):
        # An edge that ignores Range answers 200 with the whole ZIP. Only the
        # start is read; the unread connection is dropped, never reused.
        size = 4 * firmware_index.PROBE_READ_LIMIT
        whole_zip = b"PK\x03\x04" + bytes(size - 4)
        FakeConnection.script = [(200, size, whole_zip), (403, None, b"<Error/>")]
        self.assertEqual(firmware_index.discover_one(self.URL), size)
        first = FakeConnection.made[0]
        self.assertLessEqual(first.response.consumed, firmware_index.PROBE_READ_LIMIT)
        self.assertTrue(first.closed)
        self.assertIsNone(firmware_index.discover_one(self.URL))
        self.assertEqual(len(FakeConnection.made), 2)
        self.sleep.assert_not_called()

    def test_a_closed_idle_connection_is_reopened_without_a_retry(self):
        FakeConnection.script = [(403, None, b""),
                                 http.client.RemoteDisconnected("closed idle connection"),
                                 (206, 137890388, b"PK\x03\x04")]
        firmware_index.discover_one(self.URL)
        self.assertEqual(firmware_index.discover_one(self.URL), 137890388)
        self.assertEqual(len(FakeConnection.made), 2)
        self.assertTrue(FakeConnection.made[0].closed)
        self.sleep.assert_not_called()

    def test_a_drop_on_a_new_connection_keeps_the_retry_and_wait(self):
        FakeConnection.script = [http.client.RemoteDisconnected("dropped"),
                                 (206, 137890388, b"PK\x03\x04")]
        self.assertEqual(firmware_index.discover_one(self.URL), 137890388)
        self.assertEqual([c.args[0] for c in self.sleep.call_args_list], [5])

    def test_a_timeout_on_a_reused_connection_keeps_the_retry_and_wait(self):
        FakeConnection.script = [(403, None, b""), TimeoutError("timed out"), (403, None, b"")]
        firmware_index.discover_one(self.URL)
        self.assertIsNone(firmware_index.discover_one(self.URL))
        self.assertEqual([c.args[0] for c in self.sleep.call_args_list], [5])

    def test_a_throttled_answer_keeps_the_retry_and_wait(self):
        FakeConnection.script = [(429, None, b""), (503, None, b""), (206, 137890388, b"PK\x03\x04")]
        self.assertEqual(firmware_index.discover_one(self.URL), 137890388)
        self.assertEqual([c.args[0] for c in self.sleep.call_args_list], [5, 15])
        self.assertEqual(len(FakeConnection.made), 1)


class ConcurrentSearchTest(unittest.TestCase):
    """The parallel sweep finds and writes exactly what a serial one does."""

    def search(self, workers, discover_one):
        results = []
        with mock.patch.object(firmware_index, "PROBE_WORKERS", workers), \
                mock.patch.object(firmware_index, "discover_one", side_effect=discover_one):
            for d in firmware_index.load_devices():
                results.append(firmware_index.discover_device(d, 4, 2, diff_index_window=2))
        return results

    def test_parallel_and_serial_searches_agree(self):
        devices = firmware_index.load_devices()
        hits = {}
        for d, (idx, ver) in zip(devices, ((2, "5.0.0"), (1, "4.11.0"))):
            apk_idx = max(int(i) for _v, i, _s in d["apks"]) + idx
            diff_idx = max(int(i) for _t, _f, i, _s in d["diffs"]) + 1
            hits[firmware_index.apk_url(d, apk_idx, ver)] = 1000 + idx
            for frm in sorted(firmware_index.diff_sources(d), key=firmware_index.vkey)[-2:]:
                hits[firmware_index.diff_url(d, diff_idx, frm, ver)] = 2000 + len(hits)
        probed = {1: [], 16: []}
        rng = __import__("random").Random(7)
        delays = {}

        def fake(workers):
            def discover_one(url):
                probed[workers].append(url)
                time.sleep(delays.setdefault(url, rng.random() / 2000))
                return hits.get(url)
            return discover_one

        serial = self.search(1, fake(1))
        parallel = self.search(16, fake(16))
        self.assertEqual(parallel, serial)
        self.assertEqual(sorted(probed[16]), sorted(probed[1]))
        self.assertEqual(len(probed[16]), len(set(probed[16])))
        found = [f["url"] for findings, _s in serial for f in findings]
        self.assertEqual(sorted(found), sorted(hits))

        written = {}
        for label, results in (("serial", serial), ("parallel", parallel)):
            with tempfile.TemporaryDirectory() as tmp:
                for (findings, _s), (_n, _sub, name) in zip(results, firmware_index.DEVICES):
                    path = pathlib.Path(tmp, name)
                    path.write_bytes(pathlib.Path(firmware_index.HERE, name).read_bytes())
                    firmware_index.apply_findings(str(path), findings)
                    written[label, name] = path.read_bytes()
        for _n, _sub, name in firmware_index.DEVICES:
            self.assertEqual(written["parallel", name], written["serial", name])

    def test_an_outage_mid_sweep_ends_both_searches_alike(self):
        for workers in (1, 16):
            calls = []

            def discover_one(url):
                calls.append(url)
                if len(calls) == 5:
                    raise firmware_index.CdnUnreachable("HTTP 503")
                return None

            with self.assertRaises(firmware_index.CdnUnreachable):
                self.search(workers, discover_one)


if __name__ == "__main__":
    unittest.main()
