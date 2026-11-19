#!/usr/bin/env python3
"""Render meme.svg to meme.png at exactly 720 x 1440.

Run after main.ts, whenever meme.svg changes:
    python3 render.py
"""
import sys
from pathlib import Path

import cairosvg

HERE = Path(__file__).resolve().parent
SVG_PATH = HERE / "meme.svg"
PNG_PATH = HERE / "meme.png"
WIDTH = 720
HEIGHT = 1440


def main() -> int:
    if not SVG_PATH.exists():
        print(f"error: {SVG_PATH} not found — run main.ts first", file=sys.stderr)
        return 1
    cairosvg.svg2png(
        url=str(SVG_PATH),
        write_to=str(PNG_PATH),
        output_width=WIDTH,
        output_height=HEIGHT,
    )
    size = PNG_PATH.stat().st_size
    print(f"meme.png written: {PNG_PATH} ({WIDTH}x{HEIGHT}, {size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
