from PIL import Image, ImageDraw
import os

src = r"D:\XiaomiMiMoProjects\grow-up\generated-1789895078903.png"
im = Image.open(src).convert("RGBA")
pixels = im.load()
w, h = im.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r > 200 and b > 180 and g < 120 and (r - g) > 80 and (b - g) > 60:
            pixels[x, y] = (0, 0, 0, 0)
        if x > w * 0.80 and y > h * 0.86:
            pixels[x, y] = (0, 0, 0, 0)

bbox = im.getbbox()
if bbox:
    m = int(min(w, h) * 0.04)
    im = im.crop((max(0, bbox[0] - m), max(0, bbox[1] - m), min(w, bbox[2] + m), min(h, bbox[3] + m)))

w2, h2 = im.size
side = max(w2, h2)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.paste(im, ((side - w2) // 2, (side - h2) // 2), im)
im = sq

out_dir = r"D:\XiaomiMiMoProjects\grow-up\assets"
os.makedirs(out_dir, exist_ok=True)
logo_path = os.path.join(out_dir, "logo-sprout.png")
im.save(logo_path, "PNG")
print("logo", logo_path, im.size)


def make_tile(size, radius_ratio=0.22, bg=(255, 45, 149, 255)):
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    r = int(size * radius_ratio)
    if r > 0:
        draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=255)
    else:
        draw.rectangle([0, 0, size - 1, size - 1], fill=255)
    base = Image.new("RGBA", (size, size), bg)
    tile = Image.composite(base, Image.new("RGBA", (size, size), (0, 0, 0, 0)), mask)
    mark = im.copy()
    pad = int(size * 0.14)
    inner = max(1, size - pad * 2)
    mark = mark.resize((inner, inner), Image.LANCZOS)
    tile.alpha_composite(mark, (pad, pad))
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(tile, (0, 0), mask)
    return out


public = r"D:\XiaomiMiMoProjects\grow-up\public"
app_dir = r"D:\XiaomiMiMoProjects\grow-up\app"

for size, name in [(512, "icon-512.png"), (192, "icon-192.png"), (32, "favicon-32.png"), (16, "favicon-16.png")]:
    img = make_tile(size)
    img.save(os.path.join(public, name), "PNG")
    print("wrote", name, img.size)

make_tile(180, 0.0).save(os.path.join(public, "apple-touch-icon.png"), "PNG")
print("wrote apple-touch-icon")
make_tile(512).save(os.path.join(app_dir, "icon.png"), "PNG")
print("wrote app/icon.png")
im.save(os.path.join(public, "logo-mark.png"), "PNG")
print("done")
