"""Render the Projects thumbnail. Requires Pillow and NumPy.

Run from any directory with: python _tools/render_binary_card.py
The wave surface is a schematic retarded quadrupole, not a numerical-relativity
solution. Fixed separation and exaggerated wave heights make a seamless loop;
the depicted wavelength, orbit and black-hole sizes are not to scale.
"""

from pathlib import Path
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "images/projects"
W, H, SCALE = 720, 360, 2
N_FRAMES = 48
OUTPUT_SIZE = (512, 256)
ORBIT = 65
WAVE_START = 85
K = 2 * math.pi / 148


def surface(x, y, phase):
    r = np.hypot(x, y)
    phi = np.arctan2(y, x)
    envelope = np.clip((r - WAVE_START) / 38, 0, 1) * np.exp(-r / 880)
    # At a fixed direction, phase crests move outward; f_GW = 2 f_orbit.
    wave = np.sin(K * (r - WAVE_START) + 2 * phi - 2 * phase)
    return 28 * envelope * wave, wave, envelope


def project(x, y, z=0):
    return (W / 2 + x, H * 0.49 + 0.48 * y - 0.88 * z)


def coords(x, y, z=0):
    px, py = project(x, y, z)
    return list(zip(np.asarray(px) * SCALE, np.asarray(py) * SCALE))


def color_mix(a, b, t):
    return tuple(round(c * (1 - t) + d * t) for c, d in zip(a, b))


yy, xx = np.mgrid[:H * SCALE, :W * SCALE]
glow = np.exp(-(((xx / SCALE - W / 2) / 280) ** 2 +
                ((yy / SCALE - H / 2) / 160) ** 2))
bg = np.stack([7 + glow * 5, 15 + glow * 10, 29 + glow * 20], axis=-1)
BACKGROUND = Image.fromarray(bg.astype(np.uint8))


def frame(phase):
    image = BACKGROUND.copy()
    draw = ImageDraw.Draw(image)
    # Distant stars remain stationary throughout the loop.
    rng = np.random.default_rng(26)
    for x, y, intensity in zip(rng.uniform(15, W - 15, 55),
                               rng.uniform(15, H - 15, 55),
                               rng.uniform(0.12, 0.5, 55)):
        c = color_mix((7, 17, 31), (128, 174, 201), float(intensity))
        draw.ellipse((x * SCALE, y * SCALE,
                      x * SCALE + SCALE, y * SCALE + SCALE), fill=c)

    # The gently deformed mesh supplies depth cues without obscuring the pair.
    samples = np.linspace(-570, 570, 150)
    for fixed in np.arange(-510, 511, 22):
        for x, y in ((samples, np.full_like(samples, fixed)),
                     (np.full_like(samples, fixed), samples)):
            z, _, _ = surface(x, y, phase)
            draw.line(coords(x, y, z), fill=(17, 36, 53), width=SCALE)

    # Positive and negative crests form two retarded spiral arms each.
    light = Image.new("RGB", image.size)
    ld = ImageDraw.Draw(light)
    phi = np.linspace(-math.pi, math.pi, 650)
    for offset, base_color in ((math.pi / 2, (85, 218, 244)),
                               (3 * math.pi / 2, (163, 137, 235))):
        for turn in range(-3, 7):
            r = WAVE_START + (offset + 2 * phase - 2 * phi +
                              2 * math.pi * turn) / K
            valid = (r > WAVE_START) & (r < 660)
            ids = np.flatnonzero(valid)
            if not len(ids):
                continue
            # Draw short pieces to fade the wave smoothly toward the edge.
            for i in range(ids[0], ids[-1], 5):
                sl = slice(i, min(i + 6, ids[-1] + 1))
                rr, pp = r[sl], phi[sl]
                x, y = rr * np.cos(pp), rr * np.sin(pp)
                z, _, envelope = surface(x, y, phase)
                alpha = float(np.mean(envelope)) * 0.85
                col = tuple(round(v * alpha) for v in base_color)
                ld.line(coords(x, y, z), fill=col, width=SCALE * 2)

    # Additive bloom keeps the narrow crests sharp and the field luminous.
    bloom = light.filter(ImageFilter.GaussianBlur(6 * SCALE))
    image = Image.fromarray(np.clip(np.asarray(image).astype(float) +
                                    np.asarray(bloom) * 1.1 +
                                    np.asarray(light) * 1.1, 0, 255).astype(np.uint8))
    draw = ImageDraw.Draw(image)
    orbit_phi = np.linspace(0, 2 * math.pi, 180)
    draw.line(coords(ORBIT * np.cos(orbit_phi), ORBIT * np.sin(orbit_phi), 2),
              fill=(44, 72, 94), width=SCALE)

    # Colored photon-ring accents distinguish the two dark black-hole silhouettes.
    holes = [(phase, (104, 224, 248)), (phase + math.pi, (255, 193, 115))]
    holes.sort(key=lambda hole: math.sin(hole[0]))
    for angle, tint in holes:
        x, y = ORBIT * math.cos(angle), ORBIT * math.sin(angle)
        px, py = project(x, y, 14)
        halo = Image.new("RGB", image.size)
        hd = ImageDraw.Draw(halo)
        for radius in range(32, 13, -1):
            strength = 0.17 * math.exp(-((radius - 15) / 9) ** 2)
            hd.ellipse(((px - radius) * SCALE, (py - radius * 0.7) * SCALE,
                        (px + radius) * SCALE, (py + radius * 0.7) * SCALE),
                       fill=tuple(round(v * strength) for v in tint))
        image = Image.fromarray(np.clip(np.asarray(image).astype(int) +
                                        np.asarray(halo.filter(ImageFilter.GaussianBlur(3 * SCALE))),
                                        0, 255).astype(np.uint8))
        draw = ImageDraw.Draw(image)
        r = 13
        draw.ellipse(((px - r - 1) * SCALE, (py - r - 1) * SCALE,
                      (px + r + 1) * SCALE, (py + r + 1) * SCALE), fill=tint)
        draw.ellipse(((px - r + 1) * SCALE, (py - r + 1) * SCALE,
                      (px + r - 1) * SCALE, (py + r - 1) * SCALE), fill=(3, 7, 14))
        draw.arc(((px - 19) * SCALE, (py - 7) * SCALE,
                  (px + 19) * SCALE, (py + 7) * SCALE), 0, 180,
                 fill=color_mix(tint, (255, 255, 255), 0.25), width=2 * SCALE)

    return image.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)


if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)
    frames = [frame(2 * math.pi * i / N_FRAMES) for i in range(N_FRAMES)]
    # A single palette avoids color flicker. Dithering makes GIFs unnecessarily large.
    swatches = Image.new("RGB", (180 * 8, 90 * 6))
    for i, image in enumerate(frames):
        swatches.paste(image.resize((180, 90)), ((i % 8) * 180, (i // 8) * 90))
    palette = swatches.quantize(colors=48, dither=Image.Dither.NONE)
    # Preserve small bright rings that a background-dominated palette can lose.
    accents = [(104, 224, 248), (255, 193, 115), (3, 7, 14), (255, 231, 185),
               (180, 240, 255), (85, 218, 244), (163, 137, 235), (210, 215, 250)]
    accent_shades = [color_mix((12, 24, 40), c, t)
                     for c in accents[:2] for t in (0.2, 0.4, 0.6, 0.8)]
    colors = palette.getpalette()[:48 * 3]
    colors += [v for c in accents + accent_shades for v in c]
    palette.putpalette(colors + colors[-3:] * (256 - len(colors) // 3))
    encoded = [f.quantize(palette=palette, dither=Image.Dither.NONE) for f in frames]
    encoded[0].save(DEST / "smbhb-gravitational-waves.gif", save_all=True,
                    append_images=encoded[1:], duration=100, loop=0,
                    optimize=True, disposal=1)
    frames[5].save(DEST / "smbhb-gravitational-waves.png", optimize=True)
    print(f"Saved {N_FRAMES} frames, {OUTPUT_SIZE}, {N_FRAMES * 0.1:.2f} second loop")
