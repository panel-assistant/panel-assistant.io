"""Release-note discovery and capture through the monitor's production command."""
import json
import pathlib
import tempfile
import unittest
from types import SimpleNamespace
from unittest import mock

import shelly_firmware as shelly
import wayback_archive as wayback

COMMIT = 'a' * 40
CHANGELOG = '''# Changelog
## 2.9.0
### Fixes
* Home Assistant stops loading slowly.
* Security: check server authentication.
## 2.8.4
* Restoring a settings backup no longer fails.
## 2.4.0
* New settings export and alarm controls.
## 2.3.9
* Old display changes.
'''


class ShellyNotesTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = pathlib.Path(self.temp.name) / 'notes.json'
        self.args = SimpleNamespace(notes=str(self.path))

    def run_notes(self, available=None, authenticated=False, text=CHANGELOG):
        with mock.patch.object(shelly, 'fetch_changelog', return_value=(COMMIT, text)), \
                mock.patch.object(wayback, 'auth_header', return_value=({}, authenticated)), \
                mock.patch.object(wayback, 'available', side_effect=available or (lambda _url: None)), \
                mock.patch.object(wayback, 'submit', return_value=('accepted-job', {})) as submit, \
                mock.patch.object(shelly.time, 'sleep'):
            result = shelly.cmd_notes(self.args)
        self.assertEqual(0, result)
        return json.loads(self.path.read_text()), submit

    def test_discovers_notes_without_fabricating_packages_and_preserves_pinned_summary_on_retry(self):
        notes, submit = self.run_notes()
        self.assertEqual({'2.9.0', '2.8.4', '2.4.0'}, set(notes))
        self.assertEqual(COMMIT, notes['2.9.0']['commit'])
        self.assertEqual('Changes to security and dashboard browsing.', notes['2.9.0']['summary'])
        self.assertFalse(notes['2.9.0']['review_required'])
        self.assertEqual('', notes['2.9.0']['wayback_ts'])
        self.assertEqual('', notes['2.9.0']['raw_wayback_ts'])
        submit.assert_not_called()
        # The vendor edits old wording; the already recorded immutable source stays pinned.
        again, _ = self.run_notes(text=CHANGELOG.replace('Home Assistant', 'Thermostat'))
        self.assertEqual(notes, again)

    def test_job_acceptance_is_not_capture_confirmation_and_later_run_confirms_both_resources(self):
        notes, submit = self.run_notes(authenticated=True)
        self.assertEqual(2, submit.call_count, 'one page and one raw file, shared across versions')
        urls = [call.args[0] for call in submit.call_args_list]
        self.assertTrue(any('/blob/' in url for url in urls))
        self.assertTrue(any('raw.githubusercontent.com/' in url for url in urls))
        self.assertTrue(all('#' not in url for url in urls))
        self.assertTrue(all(not note['wayback_ts'] and not note['raw_wayback_ts'] for note in notes.values()))
        confirmed, submit = self.run_notes(available=lambda url: '20261023123456')
        submit.assert_not_called()
        self.assertTrue(all(note['wayback_ts'] == '20261023123456' and
                            note['raw_wayback_ts'] == '20261023123456' for note in confirmed.values()))
        repeated, submit = self.run_notes(authenticated=True)
        self.assertEqual(confirmed, repeated)
        submit.assert_not_called()

    def test_partial_capture_does_not_claim_raw_preservation_and_unknown_topics_request_review(self):
        text = '## 2.9.1\n* Frobnication now includes quux.\n'
        notes, _ = self.run_notes(text=text, available=lambda url: '20261023123456' if '/blob/' in url else None)
        note = notes['2.9.1']
        self.assertTrue(note['review_required'])
        self.assertEqual('20261023123456', note['wayback_ts'])
        self.assertEqual('', note['raw_wayback_ts'])
        self.assertNotIn('Frobnication', note['summary'])

    def test_invalid_changelog_preserves_existing_notes(self):
        self.run_notes()
        before = self.path.read_bytes()
        for text in ('# vendor changed format', '## 2.9.0\n', '## 2.9.0\n* One\n## 2.9.0\n* Two'):
            with self.subTest(text=text), self.assertRaises(ValueError):
                self.run_notes(text=text)
            self.assertEqual(before, self.path.read_bytes())


if __name__ == '__main__':
    unittest.main()
