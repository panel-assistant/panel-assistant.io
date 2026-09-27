# Firmware index and monitors

The three `fw-*.dat` files are the canonical list of indexed Sonoff and Shelly firmware. `src/firmware/generate.mjs` reads them directly when building the website. The site also reads the full `firmware-status` branch history and `wayback-state` for availability and archive links. Generated Markdown is never committed.

- `fw-120p.dat`, `fw-86p.dat`: Sonoff NSPanel Pro CDN objects, recorded with exact byte sizes.
- `fw-shelly-walldisplay.dat`: Shelly OTA releases and capture timestamps by vendor update track.
- `firmware_index.py probe --history history.json`: range-checks every Sonoff URL and checks every indexed Shelly URL through the vendor CA context, then records one daily sample. Only Sonoff failures request the one-hour retry; old Shelly CDN URLs commonly expire.
- `firmware_index.py discover`: validates its CDN prober against known objects, searches for new Sonoff releases, and can append confirmed entries with `--apply`.
- `shelly_firmware.py verify|probe|archive`: validates Shelly manifests, discovers new releases, and captures them before the CDN replaces them.
- `wayback_archive.py --state wayback.json`: archives every Sonoff object. It requires the website repository's `WAYBACK_S3` Actions secret.

The daily URL monitor appends `history.json` to `firmware-status`, then dispatches website CI to rebuild and publish from both data branches. A failed Sonoff URL gets one retry after an hour; that retry's sample is the day's final result. Sonoff and Shelly discoveries open reviewed pull requests for the `.dat` files. Their merge rebuilds the site. The weekly Wayback workflow appends `wayback.json` to `wayback-state`.

Run the local checks with `python -m unittest discover -s tools/firmware-index -p 'test_*.py'`. The scripts use only the Python standard library and the reviewed `shelly-cloud-ca.pem` trust anchor.
