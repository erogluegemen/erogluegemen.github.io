#!/usr/bin/env python3
"""
Phase 2: Map bottle images to bottles.json entries using Claude vision.

Usage:
    export ANTHROPIC_API_KEY="sk-ant-..."
    python3 map_bottles.py

Output:
    - Updates bottles.json with image paths
    - Writes mapping_report.json with results and unmatched list
"""

import anthropic
import base64
import io
import json
import os
import time
from difflib import SequenceMatcher
from pathlib import Path

from PIL import Image

IMAGES_DIR = Path(__file__).parent / "bottle_images_clean"
BOTTLES_JSON = Path(__file__).parent / "bottles.json"
REPORT_JSON = Path(__file__).parent / "mapping_report.json"
MODEL = "claude-opus-4-8"
MAX_WIDTH = 800          # resize before API call
MATCH_THRESHOLD = 0.50   # minimum similarity score to accept a match


def resize_png(image_path: Path, max_width: int) -> bytes:
    with Image.open(image_path) as img:
        w, h = img.size
        if w > max_width:
            scale = max_width / w
            img = img.resize((max_width, int(h * scale)), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()


def encode_image(image_path: Path) -> str:
    data = resize_png(image_path, MAX_WIDTH)
    return base64.standard_b64encode(data).decode("utf-8")


def identify_bottle(client: anthropic.Anthropic, image_path: Path) -> str:
    image_b64 = encode_image(image_path)
    response = client.messages.create(
        model=MODEL,
        max_tokens=128,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": (
                            "Read the label on this bottle and return the exact product name. "
                            "Reply with ONLY the product name — brand + variant — nothing else. "
                            "Include variant details (e.g. 'Black Label', 'Dry Gin', 'Citron', 'Heritage') if visible on the label."
                        ),
                    },
                ],
            }
        ],
    )
    return response.content[0].text.strip()


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def best_match(identified: str, names: list[str]) -> tuple[str, float]:
    best_name, best_score = names[0], 0.0
    for name in names:
        score = similarity(identified, name)
        if score > best_score:
            best_score = score
            best_name = name
    return best_name, best_score


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        raise SystemExit("Set ANTHROPIC_API_KEY environment variable first.")

    client = anthropic.Anthropic(api_key=api_key)

    with open(BOTTLES_JSON, encoding="utf-8") as f:
        bottles = json.load(f)

    name_to_idx = {b["name"]: i for i, b in enumerate(bottles)}
    names = list(name_to_idx)

    images = sorted(IMAGES_DIR.glob("*.png"))
    print(f"Processing {len(images)} images against {len(names)} bottle entries\n")

    matched = []
    unmatched = []

    for i, img_path in enumerate(images, 1):
        filename = f"bottle_images_clean/{img_path.name}"
        print(f"[{i:3}/{len(images)}] {img_path.name} ", end="", flush=True)

        try:
            identified = identify_bottle(client, img_path)
            match_name, score = best_match(identified, names)
            print(f"'{identified}' → '{match_name}' ({score:.2f})", end="")

            if score < MATCH_THRESHOLD:
                print("  ✗ low confidence")
                unmatched.append({
                    "image": img_path.name,
                    "identified": identified,
                    "best_match": match_name,
                    "score": round(score, 3),
                    "reason": "low_confidence",
                })
                continue

            idx = name_to_idx[match_name]
            existing = bottles[idx]["image"]
            if existing and existing != "":
                print(f"  ⚠ already mapped ({existing}) — skipping")
                unmatched.append({
                    "image": img_path.name,
                    "identified": identified,
                    "best_match": match_name,
                    "score": round(score, 3),
                    "reason": f"duplicate (existing: {existing})",
                })
                continue

            bottles[idx]["image"] = filename
            print("  ✓")
            matched.append({
                "image": img_path.name,
                "bottle": match_name,
                "score": round(score, 3),
            })

        except anthropic.RateLimitError:
            print("  rate limited — waiting 30s")
            time.sleep(30)
            unmatched.append({
                "image": img_path.name,
                "identified": "",
                "best_match": "",
                "score": 0.0,
                "reason": "rate_limit",
            })
        except Exception as e:
            print(f"  ERROR: {e}")
            unmatched.append({
                "image": img_path.name,
                "identified": "",
                "best_match": "",
                "score": 0.0,
                "reason": str(e),
            })

        # polite pause between requests
        time.sleep(0.5)

    # Save updated bottles.json
    with open(BOTTLES_JSON, "w", encoding="utf-8") as f:
        json.dump(bottles, f, ensure_ascii=False, indent=2)

    # Save report
    report = {"matched": matched, "unmatched": unmatched}
    with open(REPORT_JSON, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"Matched:   {len(matched)}")
    print(f"Unmatched: {len(unmatched)}")
    print(f"bottles.json updated")
    print(f"Report: {REPORT_JSON}")

    if unmatched:
        print("\nUnmatched — review manually:")
        for u in unmatched:
            print(f"  {u['image']}: '{u['identified']}' → {u['reason']}")


if __name__ == "__main__":
    main()
