#!/usr/bin/env python3
"""
Daily AI News Pipeline (multi-run)
Scrapes news, generates Spanish summaries with Claude, saves as JSON feed.
Supports running N times per day — each run adds new items without duplicates.
"""

import json
import os
import re
import sys
from datetime import date, datetime, timedelta
from hashlib import sha256
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

from config import SOURCES
from scraper import scrape_source
from synthesizer import synthesize_news

CONTENT_DIR = Path(__file__).parent.parent / "content"
RAW_DIR = CONTENT_DIR / "raw"
NEWS_DIR = CONTENT_DIR / "news"

# Máximo de días a retener
MAX_DAYS_RETAINED = 3


def item_id(item: dict) -> str:
    """Generate a unique ID for a news item based on link or title."""
    key = item.get("link") or item.get("title", "")
    return sha256(key.encode()).hexdigest()[:16]


def cleanup_old_files():
    """Delete news and raw JSON files older than MAX_DAYS_RETAINED days."""
    cutoff = date.today() - timedelta(days=MAX_DAYS_RETAINED)
    deleted = 0

    for directory in (NEWS_DIR, RAW_DIR):
        if not directory.exists():
            continue
        for f in directory.glob("*.json"):
            # Extract date from filename (e.g., 2026-03-10.json)
            match = re.match(r"(\d{4}-\d{2}-\d{2})\.json$", f.name)
            if not match:
                continue
            try:
                file_date = date.fromisoformat(match.group(1))
                if file_date < cutoff:
                    f.unlink()
                    deleted += 1
                    print(f"  Borrado: {f}")
            except ValueError:
                continue

    return deleted


def load_existing_raw(today: str) -> dict:
    raw_path = RAW_DIR / f"{today}.json"
    if raw_path.exists():
        with open(raw_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"date": today, "items": [], "seen_ids": []}


def load_existing_news(today: str) -> list[dict]:
    news_path = NEWS_DIR / f"{today}.json"
    if news_path.exists():
        with open(news_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def main():
    today = date.today().isoformat()
    now = datetime.now().strftime("%H:%M")

    print(f"\n{'='*50}")
    print(f"  IA al Día - Pipeline de noticias")
    print(f"  Fecha: {today}  Hora: {now}")
    print(f"{'='*50}\n")

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    NEWS_DIR.mkdir(parents=True, exist_ok=True)

    # Load previous data
    existing = load_existing_raw(today)
    seen_ids = set(existing.get("seen_ids", []))
    existing_news = load_existing_news(today)
    prev_count = len(existing.get("items", []))

    print(f"[INFO] Items previos de hoy: {prev_count}")
    print(f"[INFO] Noticias publicadas: {len(existing_news)}\n")

    # Step 1: Scrape
    print("[1/3] Scraping fuentes...\n")
    new_items = []
    for source in SOURCES:
        items = scrape_source(source)
        for item in items:
            iid = item_id(item)
            if iid not in seen_ids:
                seen_ids.add(iid)
                item["_id"] = iid
                item["_scraped_at"] = now
                new_items.append(item)

    print(f"\n[INFO] Nuevas noticias: {len(new_items)}")

    if not new_items and prev_count == 0:
        print("[ABORT] No se encontraron noticias.")
        sys.exit(1)

    if not new_items:
        print("[SKIP] No hay noticias nuevas desde la última corrida.")
        sys.exit(0)

    # Save raw
    all_raw_items = list(existing.get("items", [])) + new_items
    raw_data = {
        "date": today,
        "items": all_raw_items,
        "seen_ids": list(seen_ids),
        "last_run": now,
        "run_count": existing.get("run_count", 0) + 1,
    }
    raw_path = RAW_DIR / f"{today}.json"
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(raw_data, f, ensure_ascii=False, indent=2)
    print(f"[OK] Raw guardado ({len(all_raw_items)} total, run #{raw_data['run_count']})\n")

    # Step 2: Synthesize only new items
    print("[2/3] Generando bajadas con Claude AI...\n")

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("[ERROR] ANTHROPIC_API_KEY no configurada.")
        sys.exit(1)

    enriched_new = synthesize_news(new_items)

    # Step 3: Merge with existing news and save
    print("\n[3/3] Guardando noticias...\n")

    all_news = existing_news + enriched_new
    news_path = NEWS_DIR / f"{today}.json"
    with open(news_path, "w", encoding="utf-8") as f:
        json.dump(all_news, f, ensure_ascii=False, indent=2)

    print(f"[OK] {len(enriched_new)} noticias nuevas agregadas")
    print(f"[OK] Total noticias de hoy: {len(all_news)}")
    print(f"[OK] Archivo: {news_path}")

    sources = list(set(item.get("source", "") for item in all_news))
    print(f"[OK] Fuentes: {', '.join(sorted(sources))}")

    # Step 4: Cleanup old files
    print("\n[4/4] Limpiando archivos antiguos...\n")
    deleted = cleanup_old_files()
    if deleted:
        print(f"[OK] {deleted} archivos antiguos eliminados (>{MAX_DAYS_RETAINED} días)")
    else:
        print("[OK] Nada que limpiar")

    print(f"\n{'='*50}")
    print(f"  Pipeline completado!")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    main()
