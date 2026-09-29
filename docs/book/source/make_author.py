# Usage: python3 make_author.py <photo.jpg>  -> author/author_circle.png (circle-cropped, 800px)
import sys, os
from PIL import Image, ImageDraw
src = sys.argv[1]; SD = os.path.dirname(os.path.abspath(__file__)); os.makedirs(f"{SD}/author", exist_ok=True)
im = Image.open(src).convert("RGB"); w, h = im.size; s = min(w, h)
im = im.crop(((w - s) // 2, max(0, (h - s) // 3), (w - s) // 2 + s, max(0, (h - s) // 3) + s)).resize((800, 800))
mask = Image.new("L", (800, 800), 0); ImageDraw.Draw(mask).ellipse((0, 0, 799, 799), fill=255)
out = Image.new("RGBA", (800, 800), (0, 0, 0, 0)); out.paste(im, (0, 0), mask); out.save(f"{SD}/author/author_circle.png")
print("ok")
