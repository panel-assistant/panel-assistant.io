#!/usr/bin/env python3
"""Sanitize a captured ha-paneld standing screen for publication.

The screen shows the panel's real LAN address twice -- once as text and once encoded in the QR --
and the address is derived from the device's own IP, so it cannot be staged in the app. Both have to
be replaced after capture, and they have to agree afterwards or the published image is a lie that
someone will eventually scan.

Everything here is MEASURED from the frame rather than assumed, because the layout moves between
locales: a longer paragraph pushes the address line and the QR down (German and French sit 15px
lower than English; Simplified Chinese sits 15px higher). Hard-coded coordinates from an English
capture silently corrupt the others.

  python3 sanitize-standing.py <in.png> <out.png> [--ip 192.168.1.42]

Exits non-zero unless the finished image's QR decodes to exactly the address now printed on it.
"""
import argparse
import io
import os
from pathlib import Path
import sys

import cv2
import numpy as np
import segno
from PIL import Image, ImageDraw, ImageFont

ROBOTO = str(Path(os.environ["HA_PANELD_ROBOTO_DIR"]) / "Roboto.ttf")


def qr_box(rgb):
    """Exact pixel bounds of the QR, from the detector rather than a guess."""
    data, pts, _ = cv2.QRCodeDetector().detectAndDecode(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))
    if pts is None or not data:
        raise SystemExit("no QR found - not a standing screen")
    p = pts.reshape(-1, 2)
    return data, (int(p[:, 0].min()), int(p[:, 1].min()), int(p[:, 0].max()), int(p[:, 1].max()))


def address_band(rgb, qr_top):
    """Rows/cols of the accent-coloured address line, and its mean colour."""
    r, g, b = rgb[:, :, 0].astype(int), rgb[:, :, 1].astype(int), rgb[:, :, 2].astype(int)
    blue = (b - r > 45) & (b - g > 30) & (b > 120)
    band = blue[: qr_top - 6, :]
    rows = np.where(band.any(axis=1))[0]
    rows = rows[rows > 130]                      # below the wordmark and version line
    if not len(rows):
        raise SystemExit("address line not found")
    y0, y1 = int(rows.min()), int(rows.max())
    cols = np.where(blue[y0 : y1 + 1, :].any(axis=0))[0]
    colour = tuple(rgb[y0 : y1 + 1][blue[y0 : y1 + 1]].mean(axis=0).astype(int))
    return (int(cols.min()), y0, int(cols.max()), y1), colour


def fit_font(text, target_w, target_h):
    """Pick the Roboto size whose rendered ink matches the original line."""
    best = None
    for size in range(9, 26):
        f = ImageFont.truetype(ROBOTO, size)
        x0, y0, x1, y1 = f.getbbox(text)
        score = abs((x1 - x0) - target_w) + 3 * abs((y1 - y0) - target_h)
        if best is None or score < best[0]:
            best = (score, size, f, (x1 - x0), (y1 - y0), y0)
    return best[1], best[2], best[3], best[5]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--ip", default="192.168.1.42")
    args = ap.parse_args()

    im = Image.open(args.src).convert("RGB")
    rgb = np.array(im)
    real_url, (qx0, qy0, qx1, qy1) = qr_box(rgb)
    (ax0, ay0, ax1, ay1), colour = address_band(rgb, qy0)
    new_url = real_url.replace(real_url.split("//")[1].split(":")[0], args.ip)

    draw = ImageDraw.Draw(im)
    # Background behind the address line: sample well left of the text, same rows.
    bg = tuple(int(v) for v in rgb[ay0 : ay1 + 1, 8:24].reshape(-1, 3).mean(axis=0))
    draw.rectangle([ax0 - 6, ay0 - 4, ax1 + 6, ay1 + 4], fill=bg)

    size, font, width, top_off = fit_font(new_url, ax1 - ax0 + 1, ay1 - ay0 + 1)
    draw.text((240 - width / 2, ay0 - top_off), new_url, font=font, fill=tuple(int(c) for c in colour))

    # Regenerate the QR at the exact box the original occupied. ECC L keeps it to version 3 (29x29),
    # matching the on-device module grid so the block lands on the same pixels.
    side = qx1 - qx0 + 1
    qr = segno.make(new_url, error="l")
    modules = qr.symbol_size(border=0)[0]
    # Render at an INTEGER module size. Resizing an arbitrary raster down to the measured box gives
    # a fractional pixels-per-module (29 modules into 86px is 2.97), which smears the module grid
    # and produces a QR that no longer decodes -- while still looking perfectly convincing.
    scale = max(1, round(side / modules))
    png = io.BytesIO()
    qr.save(png, kind="png", scale=scale, border=0)
    png.seek(0)
    buf = Image.open(png).convert("RGB")
    dark = im.getpixel((5, 5))[0] < 128
    # Centre the regenerated block on the original one; it sits on a white card in both themes.
    ox = qx0 + (side - buf.width) // 2
    oy = qy0 + (side - buf.height) // 2
    im.paste(buf, (ox, oy))

    im.save(args.dst)

    # Prove it: the finished image must scan to exactly the address now printed on it.
    # Decode the QR REGION rather than the whole 480x480 frame. OpenCV's detector reads a
    # device-rendered QR full-frame but not always a freshly rasterised one at 3px per module; a
    # real scanner sees the code, not the wallpaper around it, and cropping to the measured box
    # with its quiet zone is the same evidence without the detector's scale sensitivity.
    saved = Image.open(args.dst).convert("RGB")
    pad = 14
    check = np.array(saved.crop((max(0, qx0 - pad), max(0, qy0 - pad),
                                 min(saved.width, qx1 + 1 + pad), min(saved.height, qy1 + 1 + pad))))
    decoded, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.cvtColor(check, cv2.COLOR_RGB2BGR))
    if decoded != new_url:
        print(f"FAIL {args.dst}: QR decodes to {decoded!r}, printed {new_url!r}", file=sys.stderr)
        return 1
    print(f"{args.dst}  addr rows {ay0}-{ay1}  qr {qx0},{qy0} {side}px  font {size}px  "
          f"{'dark' if dark else 'light'}  -> {decoded}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
