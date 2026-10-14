#!/usr/bin/env python3

import contextlib
import io
import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import urllib.error
import urllib.request

import wayback_archive
from secure_urlopen import SameOriginRedirectHandler


class ArchiveProgressTest(unittest.TestCase):
    def test_ignores_stale_state_entries(self):
        urls = ["https://example.test/current-a", "https://example.test/current-b"]
        files = {
            "https://example.test/current-a": {"wb": "20260701000000"},
            "https://example.test/removed": {"wb": "20260601000000"},
        }

        self.assertEqual(wayback_archive.archive_progress(urls, files), (1, 1))

    def test_reports_complete_only_when_every_current_url_is_archived(self):
        urls = ["https://example.test/a", "https://example.test/b"]
        files = {url: {"wb": "20260701000000"} for url in urls}

        self.assertEqual(wayback_archive.archive_progress(urls, files), (2, 0))


class ManualCaptureTest(unittest.TestCase):
    def run_archive(self, extra, available=None):
        submitted = []
        with tempfile.TemporaryDirectory() as tmp:
            state = Path(tmp) / "state.json"
            with (patch.dict(os.environ, {"WAYBACK_S3": "fixture:fixture"}),
                  patch("sys.argv", ["wayback_archive.py", "--state", str(state), "--confirm-wait", "0", *extra]),
                  patch.object(wayback_archive, "available", side_effect=available or (lambda url: None)),
                  patch.object(wayback_archive, "submit", side_effect=lambda url: (submitted.append(url) or "job", {})),
                  patch.object(wayback_archive, "load_devices", return_value=[]),
                  patch.object(wayback_archive, "priority_urls", return_value=["https://example.test/sonoff.zip"]),
                  contextlib.redirect_stdout(io.StringIO())):
                self.assertEqual(0, wayback_archive.main())
            return submitted, json.loads(state.read_text())

    def test_manual_captures_only_requested_urls_deduplicated_with_max(self):
        urls = ["https://cdn.fbcdn.net/a.zip?sig=fixture", "https://cdn.fbcdn.net/a.zip?sig=fixture", "https://cdn.fbcdn.net/b.zip"]
        submitted, state = self.run_archive(["--urls-json", json.dumps(urls), "--max", "1"])
        self.assertEqual(submitted, urls[:1])
        self.assertEqual(state["files"], {})  # Accepted jobs are still pending.

    def test_manual_capture_confirmation_uses_existing_state_path(self):
        url = "https://cdn.fbcdn.net/a.zip"
        submitted, state = self.run_archive(["--urls-json", json.dumps([url])], available=lambda _: "20261014000000")
        self.assertEqual(submitted, [])
        self.assertEqual(state["files"][url]["wb"], "20261014000000")

    def test_default_keeps_indexed_sonoff_capture(self):
        submitted, _ = self.run_archive([])
        self.assertEqual(submitted, ["https://example.test/sonoff.zip"])

    def test_rejects_invalid_or_credential_bearing_manual_input_before_submission(self):
        invalid = [
            "not json", "{}", "[]", json.dumps(["https://cdn.fbcdn.net/a"] * 11),
            *[json.dumps([url]) for url in [
                None, "http://cdn.fbcdn.net/a", "https://fbcdn.net/a", "https://127.0.0.1/a",
                "https://drive.google.com/a", "https://graph.facebook.com/a",
                "https://cdn.fbcdn.net.evil.test/a", "https://user:pass@cdn.fbcdn.net/a",
                "https://cdn.fbcdn.net:80/a", "https://cdn.fbcdn.net/a#secret",
                "https://cdn.fbcdn.net/a?access_token=fixture", "https://cdn.fbcdn.net/a?ACCESS%5FTOKEN=fixture",
                "https://cdn.fbcdn.net/a?oauth_token=fixture", "https://cdn.fbcdn.net/a?client_secret=fixture",
                "https://cdn.fbcdn.net/a?api_key=fixture", "https://cdn.fbcdn.net/a?refresh_token=fixture",
                "https://cdn.fbcdn.net/a\ncredential", "https://cdn.fbcdn.net/a?token=fixture",
            ]],
        ]
        with tempfile.TemporaryDirectory() as tmp:
            for value in invalid:
                with self.subTest(value=value), patch.object(wayback_archive, "submit") as submit:
                    with (patch("sys.argv", ["wayback_archive.py", "--state", str(Path(tmp) / "state.json"), "--urls-json", value]),
                          contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as error):
                        wayback_archive.main()
                    self.assertEqual(error.exception.code, 2)
                    submit.assert_not_called()


class AvailabilityTest(unittest.TestCase):
    def test_only_successful_available_snapshot_is_confirmed(self):
        valid = {"available": True, "status": "200", "timestamp": "20261014000000"}
        cases = [
            (valid, "20261014000000"),
            ({**valid, "status": 200}, "20261014000000"),
            ({**valid, "available": False}, None),
            ({**valid, "status": "403"}, None),
            ({**valid, "status": "404"}, None),
            ({**valid, "timestamp": "20260231000000"}, None),
            ({**valid, "timestamp": "123"}, None),
            ({"timestamp": "20261014000000"}, None),
            (None, None),
        ]
        for snapshot, expected in cases:
            with self.subTest(snapshot=snapshot):
                response = io.StringIO(json.dumps({"archived_snapshots": {"closest": snapshot}}))
                with patch.object(wayback_archive, "urlopen", return_value=response):
                    self.assertEqual(wayback_archive.available("https://cdn.fbcdn.net/a.zip"), expected)


class CredentialRedirectTest(unittest.TestCase):
    def redirect(self, destination):
        request = urllib.request.Request(
            "https://web.archive.org/save",
            headers={"Authorization": "LOW secret"},
        )
        return SameOriginRedirectHandler().redirect_request(
            request, None, 302, "Found", {}, destination
        )

    def test_preserves_authorization_for_same_origin_https_redirect(self):
        redirected = self.redirect("https://web.archive.org/save/status")
        self.assertEqual("LOW secret", redirected.get_header("Authorization"))

    def test_strips_authorization_for_cross_origin_redirect(self):
        redirected = self.redirect("https://attacker.example/capture")
        self.assertIsNone(redirected.get_header("Authorization"))

    def test_refuses_https_downgrade(self):
        with self.assertRaises(urllib.error.HTTPError):
            self.redirect("http://web.archive.org/save/status")


if __name__ == "__main__":
    unittest.main()
