"""Encode GIF thumbnails from browser screenshots of the actual simulations.

Requires Pillow. Usage: python _tools/encode_simulation_cards.py CAPTURE_DIRECTORY
The directory contains binary/000.png…047.png (one orbit, 7.5° increments)
and emission/000.png…063.png (a short recording at 8.4 GHz, Frame core).
Captures use a 1280 × 720 viewport. Crop rectangles isolate the model panels;
the jet preview retains its observer brightness strip alongside the packets.
No simulation equations or rendering code are duplicated here.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps


DEST = Path(__file__).resolve().parents[1] / "images/projects"
SIZE = (640, 360)


def prepare(path, kind):
    with Image.open(path) as screenshot:
        assert screenshot.size == (1280, 720), "Capture viewport changed; review crops."
        if kind == "binary":
            panel = screenshot.crop((58, 118, 903, 603))
        else:
            panel = screenshot.crop((58, 38, 903, 627))
        return ImageOps.pad(panel.convert("RGB"), SIZE,
                            method=Image.Resampling.LANCZOS, color="#0b1725")


def encode(captures, kind, name, count, duration):
    frames = [prepare(captures / kind / f"{i:03}.png", kind) for i in range(count)]
    swatches = Image.new("RGB", (160 * 8, 90 * ((count + 7) // 8)))
    for i, frame in enumerate(frames):
        swatches.paste(frame.resize((160, 90)), ((i % 8) * 160, (i // 8) * 90))
    palette = swatches.quantize(colors=208, dither=Image.Dither.NONE)
    # Keep small colored markers legible despite the mostly dark backgrounds.
    accents = ["65d9ec", "ffb578", "bf9bff", "dbe7f3", "e4d89d", "91a6ba",
               "02070d", "81d9ed", "b8eeff", "ffffff", "0b1929", "335c71",
               "20364a", "8caec2", "72c8e3", "829bae"]
    colors = palette.getpalette()[:208 * 3]
    colors += [int(c[i:i + 2], 16) for c in accents for i in (0, 2, 4)]
    # Reserve a smooth ramp for the observer strip; its intensity carries meaning.
    for step in range(32):
        t = step / 31
        colors += [round(lo + t * (hi - lo))
                   for lo, hi in zip((18, 34, 42), (101, 217, 238))]
    palette.putpalette(colors + colors[-3:] * (256 - len(colors) // 3))
    indexed = []
    for frame in frames:
        encoded = frame.quantize(palette=palette, dither=Image.Dither.NONE)
        if kind == "emission":
            # Smooth the physically meaningful jet glow and brightness strip,
            # without adding dither noise to the whole moving scene.
            smooth = frame.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG)
            for box in ((80, 120, 565, 202), (80, 290, 565, 320)):
                encoded.paste(smooth.crop(box), box[:2])
        indexed.append(encoded)
    output = DEST / f"{name}.gif"
    indexed[0].save(output, save_all=True, append_images=indexed[1:],
                    duration=duration, loop=0, disposal=1, optimize=True)
    frames[12].save(DEST / f"{name}.png", optimize=True)
    print(f"{output.name}: {count} frames, {count * duration / 1000:.2f}s, "
          f"{output.stat().st_size / 1024:.0f} KiB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("captures", type=Path)
    args = parser.parse_args()
    encode(args.captures, "binary", "3c66b-preview", 48, 100)
    encode(args.captures, "emission", "jet-core-shift-preview", 64, 60)
