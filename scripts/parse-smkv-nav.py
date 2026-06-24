import re
import html
from pathlib import Path

p = Path(r"C:\Users\thatg\AppData\Local\Temp\smkv-home.html")
s = p.read_text(encoding="utf-8", errors="ignore")

for ul_id in [
    "Header_aboutUniv",
    "Header_academics",
    "Header_cell",
    "Header_facilities",
    "Header_research",
    "Header_library",
    "Header_admission",
    "Header_examination",
    "Header_media",
    "Header_career",
]:
    m = re.search(rf'id="{ul_id}"[^>]*>(.*?)</ul>', s, re.S)
    if not m:
        continue
    block = m.group(1)
    links = re.findall(r"<a[^>]*href='([^']*)'[^>]*>([^<]+)</a>", block)
    links += re.findall(r'<a[^>]*href="([^"]*)"[^>]*>([^<]+)</a>', block)
    print(f"=== {ul_id} ===")
    seen = set()
    for href, text in links:
        text = html.unescape(text.strip())
        if not text or text == "#":
            continue
        key = (text, href)
        if key in seen:
            continue
        seen.add(key)
        print(f"  {text} -> {href}")
    print()
