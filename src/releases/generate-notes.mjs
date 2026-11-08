// Writes the release-notes page from src/releases/notes/ before every build and dev start.
// The generated page is ignored by Git; the notes files are the source.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readNotes, render } from './notes.mjs';

const notes = readNotes(fileURLToPath(new URL('./notes', import.meta.url)));
writeFileSync(
  fileURLToPath(new URL('../content/docs/release-notes.md', import.meta.url)),
  render(notes),
);
