"""Cut a full-body illustration into animatable layers for the hero puppet.

Usage: python3 tools/cut_layers.py <source-image> tools/rig.json src/assets/puppet

rig.json describes each layer as one or more polygons in source-image pixels, a
pivot point (where the layer rotates), its parent layer and draw order. The
script removes the white studio background, cuts each layer, optionally clones
patches to fill areas revealed when a layer moves (for example the pocket under
a hand), and writes PNGs plus a compact rig.json the site loads at runtime.
"""
from __future__ import annotations

import json
import sys
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


def background_mask(im: Image.Image, tol: int = 18, sat: int = 10) -> Image.Image:
    """Flood-fill light, unsaturated pixels connected to the border (the studio white and its
    soft floor shadow). Returns an L mask where 255 = background."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    seen = bytearray(w * h)
    out = Image.new("L", (w, h), 0)
    op = out.load()
    q: deque[tuple[int, int]] = deque()

    def is_bg(x: int, y: int) -> bool:
        r, g, b = px[x, y]
        return min(r, g, b) >= 255 - tol and max(r, g, b) - min(r, g, b) <= sat

    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y):
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y):
                q.append((x, y))
    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        if not is_bg(x, y):
            continue
        op[x, y] = 255
        if x > 0:
            q.append((x - 1, y))
        if x < w - 1:
            q.append((x + 1, y))
        if y > 0:
            q.append((x, y - 1))
        if y < h - 1:
            q.append((x, y + 1))
    # soften the silhouette edge by one pixel
    return out.filter(ImageFilter.GaussianBlur(0.8))


def main() -> None:
    src_path, rig_path, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    im = Image.open(src_path).convert("RGBA")
    rig = json.loads(Path(rig_path).read_text())
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    bg = background_mask(im, rig.get("bgTolerance", 18), rig.get("bgSaturation", 10))
    figure_alpha = Image.eval(bg, lambda v: 255 - v)

    runtime_layers = []
    for layer in rig["layers"]:
        work = im.copy()
        for patch in layer.get("patches", []):
            dx, dy, pw, ph = patch["dst"]
            sx, sy = patch["src"]
            tile = im.crop((sx, sy, sx + pw, sy + ph))
            work.paste(tile, (dx, dy))
        mask = Image.new("L", im.size, 0)
        d = ImageDraw.Draw(mask)
        for poly in layer["polygons"]:
            d.polygon([tuple(p) for p in poly], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(rig.get("edgeBlur", 1.2)))
        # keep only figure pixels inside the (softened) polygon
        alpha = ImageChops.multiply(figure_alpha, mask)
        work.putalpha(alpha)
        box = work.getbbox()
        if not box:
            raise SystemExit(f"layer {layer['name']} is empty")
        crop = work.crop(box)
        file = f"{layer['name']}.png"
        crop.save(out / file, optimize=True)
        runtime_layers.append(
            {
                "name": layer["name"],
                "file": file,
                "box": [box[0], box[1], crop.width, crop.height],
                "pivot": layer["pivot"],
                "parent": layer.get("parent"),
                "z": layer.get("z", 0),
            }
        )
        print(f"{layer['name']}: box={box} pivot={layer['pivot']}")

    runtime = {
        "image": [im.width, im.height],
        "height": rig.get("height", 4.2),
        "floor": rig.get("floor", im.height),
        "layers": runtime_layers,
    }
    (out / "rig.json").write_text(json.dumps(runtime, indent=2))
    print("wrote", out / "rig.json")


if __name__ == "__main__":
    main()
