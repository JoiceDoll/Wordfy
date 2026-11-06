#!/usr/bin/env python3
"""Generate Wordfy magnifier app icons for iOS, Android and in-app assets."""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
BLUE = (37, 99, 235)
WHITE = (255, 255, 255)


def draw_app_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = int(size * 0.22)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=BLUE)

    cx = int(size * 0.42)
    cy = int(size * 0.42)
    r = int(size * 0.22)
    stroke = max(2, int(size * 0.08))
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=WHITE, width=stroke)

    hx0 = cx + int(r * 0.72)
    hy0 = cy + int(r * 0.72)
    hx1 = int(size * 0.78)
    hy1 = int(size * 0.78)
    length = math.hypot(hx1 - hx0, hy1 - hy0)
    steps = max(int(length), 1)
    half = max(1, stroke // 2 + 1)
    for i in range(steps + 1):
        t = i / steps
        x = hx0 + (hx1 - hx0) * t
        y = hy0 + (hy1 - hy0) * t
        draw.ellipse([x - half, y - half, x + half, y + half], fill=WHITE)
    return img


def draw_round_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([0, 0, size - 1, size - 1], fill=BLUE)

    cx = int(size * 0.42)
    cy = int(size * 0.42)
    r = int(size * 0.22)
    stroke = max(2, int(size * 0.08))
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=WHITE, width=stroke)

    hx0 = cx + int(r * 0.72)
    hy0 = cy + int(r * 0.72)
    hx1 = int(size * 0.78)
    hy1 = int(size * 0.78)
    length = math.hypot(hx1 - hx0, hy1 - hy0)
    steps = max(int(length), 1)
    half = max(1, stroke // 2 + 1)
    for i in range(steps + 1):
        t = i / steps
        x = hx0 + (hx1 - hx0) * t
        y = hy0 + (hy1 - hy0) * t
        draw.ellipse([x - half, y - half, x + half, y + half], fill=WHITE)
    return img


def draw_logo_transparent(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx = int(size * 0.42)
    cy = int(size * 0.42)
    r = int(size * 0.28)
    stroke = max(2, int(size * 0.09))
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=BLUE, width=stroke)

    hx0 = cx + int(r * 0.72)
    hy0 = cy + int(r * 0.72)
    hx1 = int(size * 0.88)
    hy1 = int(size * 0.88)
    length = math.hypot(hx1 - hx0, hy1 - hy0)
    steps = max(int(length), 1)
    half = max(1, stroke // 2 + 1)
    for i in range(steps + 1):
        t = i / steps
        x = hx0 + (hx1 - hx0) * t
        y = hy0 + (hy1 - hy0) * t
        draw.ellipse([x - half, y - half, x + half, y + half], fill=BLUE)
    return img


def main() -> None:
    assets = ROOT / "src" / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    draw_logo_transparent(512).save(assets / "logo.png", format="PNG")
    draw_app_icon(512).save(assets / "logo-mark.png", format="PNG")
    draw_app_icon(1024).save(assets / "app-icon.png", format="PNG")

    ios = ROOT / "ios" / "Wordfy" / "Images.xcassets" / "AppIcon.appiconset"
    ios.mkdir(parents=True, exist_ok=True)
    for path in ios.glob("*.png"):
        path.unlink()

    ios_icons = [
        ("Icon-20@2x.png", 40),
        ("Icon-20@3x.png", 60),
        ("Icon-29@2x.png", 58),
        ("Icon-29@3x.png", 87),
        ("Icon-40@2x.png", 80),
        ("Icon-40@3x.png", 120),
        ("Icon-60@2x.png", 120),
        ("Icon-60@3x.png", 180),
        ("Icon-1024.png", 1024),
    ]
    for name, px in ios_icons:
        draw_app_icon(px).convert("RGB").save(ios / name, format="PNG")
        print("ios", name)

    launch = ROOT / "ios" / "Wordfy" / "Images.xcassets" / "LaunchLogo.imageset"
    launch.mkdir(parents=True, exist_ok=True)
    draw_app_icon(120).save(launch / "logo.png", format="PNG")
    draw_app_icon(240).save(launch / "logo-2x.png", format="PNG")
    draw_app_icon(360).save(launch / "logo-3x.png", format="PNG")

    android_sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }
    for folder, px in android_sizes.items():
        directory = ROOT / "android" / "app" / "src" / "main" / "res" / folder
        draw_app_icon(px).save(directory / "ic_launcher.png", format="PNG")
        draw_round_icon(px).save(directory / "ic_launcher_round.png", format="PNG")
        print("android", folder)

    print("done")


if __name__ == "__main__":
    main()
