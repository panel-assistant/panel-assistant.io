import io
import json
import pathlib
import tempfile
import unittest
from types import SimpleNamespace
from unittest import mock

import firmware_index as firmware
import wayback_archive as archive

HTML = '''<html><script>V9.9.9 Fake notes</script><h2>Version Updates</h2>
<h3>V4.6.0 (June 30, 2026)</h3><p>Local web portal and relay controls.</p>
<h3>V4.5.3</h3><p>Improved display layout.</p><h2>FAQ</h2><p>Unrelated shop text.</p></html>'''


class VendorNotesTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.path = pathlib.Path(self.temp.name) / 'notes.json'
        self.path.write_text(json.dumps({'sonoff': {'url': firmware.SONOFF_NOTES_URL, 'versions': {},
                                                   'supplements': {'4.0.7': {'summary': 'Reviewed staff notes'}}},
                                         'meta': {'notice': 'No vendor notes found'}}))
        self.args = SimpleNamespace(notes=str(self.path))

    def run_notes(self, live=HTML, replay=HTML, stamp='20261024001234', authenticated=False):
        def fetch(url):
            if isinstance(live, Exception):
                raise live
            return replay if url.startswith('https://web.archive.org/') else live
        with mock.patch.object(firmware, 'fetch_notes_html', side_effect=fetch), \
                mock.patch.object(archive, 'available', return_value=stamp), \
                mock.patch.object(archive, 'auth_header', return_value=({}, authenticated)), \
                mock.patch.object(archive, 'submit', return_value=('accepted-job', {})) as submit, \
                mock.patch.object(firmware.time, 'sleep'):
            self.assertEqual(0, firmware.cmd_notes(self.args))
        return json.loads(self.path.read_text()), submit

    def test_command_matches_exact_headings_and_preserves_other_vendors_and_confirmed_pins(self):
        data, submit = self.run_notes()
        notes = data['sonoff']['versions']
        self.assertEqual({'4.6.0', '4.5.3'}, set(notes))
        self.assertEqual('20261024001234', notes['4.6.0']['wayback_ts'])
        self.assertEqual('Changes to device controls.', notes['4.6.0']['summary'])
        self.assertEqual('No vendor notes found', data['meta']['notice'])
        self.assertEqual('Reviewed staff notes', data['sonoff']['supplements']['4.0.7']['summary'])
        submit.assert_not_called()
        again, submit = self.run_notes(live=HTML.replace('relay controls', 'thermostat controls'))
        self.assertEqual(data, again)
        submit.assert_not_called()

    def test_old_capture_and_accepted_job_cannot_confirm_new_or_changed_section(self):
        old = HTML.replace('<h3>V4.6.0 (June 30, 2026)</h3><p>Local web portal and relay controls.</p>', '')
        data, submit = self.run_notes(replay=old, authenticated=True)
        self.assertEqual('', data['sonoff']['versions']['4.6.0']['wayback_ts'])
        self.assertEqual('20261024001234', data['sonoff']['versions']['4.5.3']['wayback_ts'])
        submit.assert_called_once_with(firmware.SONOFF_NOTES_URL, freshness='1s')
        # Same heading with different text is also a stale capture, not preservation of these notes.
        data, _ = self.run_notes(replay=HTML.replace('relay controls', 'different older wording'))
        self.assertEqual('', data['sonoff']['versions']['4.6.0']['wayback_ts'])
        confirmed, _ = self.run_notes()
        self.assertEqual('20261024001234', confirmed['sonoff']['versions']['4.6.0']['wayback_ts'])
        self.assertEqual(data['sonoff']['versions']['4.6.0']['summary'],
                         confirmed['sonoff']['versions']['4.6.0']['summary'])

    def test_denied_or_unrecognised_source_leaves_verified_file_unchanged(self):
        self.run_notes()
        original = self.path.read_bytes()
        for live in (OSError('source refused access'), '<html>Access denied</html>',
                     '<h3>V4.6.0</h3>', '<h3>V4.6.0</h3><p>one</p><h3>V4.6.0</h3><p>two</p>'):
            with self.subTest(live=str(live)), self.assertRaises((ValueError, OSError)):
                self.run_notes(live=live)
            self.assertEqual(original, self.path.read_bytes())


if __name__ == '__main__':
    unittest.main()
