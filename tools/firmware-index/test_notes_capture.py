import contextlib
import io
import json
import os
import pathlib
import tempfile
import unittest
from unittest.mock import patch

import wayback_archive as archive


class NotesCaptureTest(unittest.TestCase):
    def test_command_captures_only_fixed_pinned_page_and_raw_file_without_claiming_job_success(self):
        commit = 'a' * 40
        expected = [f'https://github.com/ShellyGroup/Wall-Display-Changelog/blob/{commit}/README.md',
                    f'https://raw.githubusercontent.com/ShellyGroup/Wall-Display-Changelog/{commit}/README.md']
        with tempfile.TemporaryDirectory() as d:
            state = pathlib.Path(d) / 'state.json'
            with patch.dict(os.environ, {'WAYBACK_S3': 'fixture:fixture'}), \
                    patch('sys.argv', ['archive', '--state', str(state), '--shelly-notes-commit', commit, '--confirm-wait', '0']), \
                    patch.object(archive, 'available', return_value=None), \
                    patch.object(archive, 'submit', return_value=('accepted', {})) as submit, \
                    patch.object(archive, 'load_devices') as devices, contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(0, archive.main())
            self.assertEqual(set(expected), {c.args[0] for c in submit.call_args_list})
            devices.assert_not_called()
            self.assertEqual({}, json.loads(state.read_text())['files'])

    def test_rejects_unpinned_or_injected_input_before_any_submission(self):
        for value in ('main', 'a' * 40 + '?token=fixture', 'a' * 39, 'A' * 40):
            with patch('sys.argv', ['archive', '--state', 'unused', '--shelly-notes-commit', value]), \
                    patch.object(archive, 'submit') as submit, contextlib.redirect_stderr(io.StringIO()), \
                    self.assertRaises(SystemExit) as error:
                archive.main()
            self.assertEqual(2, error.exception.code)
            submit.assert_not_called()

    def test_available_requires_success_and_real_timestamp(self):
        valid = {'available': True, 'status': '200', 'timestamp': '20261023123456'}
        for snap, expected in ((valid, valid['timestamp']), ({**valid, 'status': '404'}, None),
                               ({**valid, 'available': False}, None), ({**valid, 'timestamp': '20260231000000'}, None)):
            response = io.StringIO(json.dumps({'archived_snapshots': {'closest': snap}}))
            with patch.object(archive, 'urlopen', return_value=response):
                self.assertEqual(expected, archive.available('https://example.test/notes'))
