"""Scrapes AI news from multiple sources (RSS + HTML). Only today's news."""

import re
import feedparser
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, date
from config import MAX_ARTICLE_CHARS

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; IAalDia/1.0; +https://github.com/LucaSpiniello/blogIa)"
}
REQUEST_TIMEOUT = 15

# Only accept news from the last 24 hours
CUTOFF = datetime.now() - timedelta(hours=36)
TODAY_STR = date.today().isoformat()  # "2026-03-11"


def scrape_source(source: dict) -> list[dict]:
    """Dispatch to RSS or HTML scraper based on source type."""
    try:
        if source["type"] == "rss":
            return scrape_rss(source)
        elif source["type"] == "html":
            return scrape_html(source)
        else:
            print(f"[WARN] Unknown source type: {source['type']}")
            return []
    except Exception as e:
        print(f"[ERROR] Failed to scrape {source['name']}: {e}")
        return []


def scrape_rss(source: dict) -> list[dict]:
    """Parse an RSS feed and return only recent items (last 36h)."""
    feed = feedparser.parse(source["url"])
    items = []

    for entry in feed.entries[: source["max_items"]]:
        # Try to get publication date
        pub_date = None
        for date_field in ("published_parsed", "updated_parsed"):
            parsed = getattr(entry, date_field, None)
            if parsed:
                pub_date = datetime(*parsed[:6])
                break

        # STRICT: skip items without a date or older than cutoff
        if not pub_date:
            continue
        if pub_date < CUTOFF:
            continue

        published = pub_date.isoformat()

        summary = entry.get("summary", entry.get("description", ""))
        if summary:
            soup = BeautifulSoup(summary, "html.parser")
            summary = soup.get_text(strip=True)[:MAX_ARTICLE_CHARS]

        items.append(
            {
                "source": source["name"],
                "title": entry.get("title", "Sin título"),
                "link": entry.get("link", ""),
                "summary": summary,
                "published": published,
            }
        )

    print(f"[OK] {source['name']}: {len(items)} items")
    return items


def scrape_html(source: dict) -> list[dict]:
    """Scrape an HTML page for article links. Tries to detect date from URL/page."""
    resp = requests.get(source["url"], headers=HEADERS, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    links = soup.select(source["link_selector"])
    items = []

    for link_el in links[: source["max_items"]]:
        href = link_el.get("href", "")
        if not href:
            continue
        if href.startswith("/"):
            href = source["base_url"] + href

        # Try to detect date from URL (common pattern: /2026/03/11/ or /2026-03-11)
        if not _url_is_recent(href):
            continue

        title_el = (
            link_el.select_one(source["title_selector"])
            if source.get("title_selector")
            else None
        )
        title = (
            title_el.get_text(strip=True) if title_el else link_el.get_text(strip=True)
        )
        if not title.strip():
            continue

        summary, detected_date = fetch_article_with_date(href)

        # If we detected a date from the page and it's old, skip
        if detected_date and detected_date < CUTOFF:
            continue

        items.append(
            {
                "source": source["name"],
                "title": title.strip(),
                "link": href,
                "summary": summary,
                "published": detected_date.isoformat() if detected_date else "",
            }
        )

    print(f"[OK] {source['name']}: {len(items)} items")
    return items


def _url_is_recent(url: str) -> bool:
    """Check if URL contains a date pattern and if so, whether it's recent."""
    # Match patterns like /2026/03/11 or /2026-03-11
    date_pattern = re.search(r"(\d{4})[/-](\d{2})[/-](\d{2})", url)
    if date_pattern:
        try:
            url_date = datetime(
                int(date_pattern.group(1)),
                int(date_pattern.group(2)),
                int(date_pattern.group(3)),
            )
            return url_date >= CUTOFF
        except ValueError:
            pass
    # No date in URL — allow through (GitHub, Anthropic, etc. don't have dates in URLs)
    return True


def fetch_article_with_date(url: str) -> tuple[str, datetime | None]:
    """Fetch article content and try to extract publication date."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # Try to detect date from meta tags
        detected_date = None
        for meta_name in (
            "article:published_time",
            "datePublished",
            "publication_date",
            "og:article:published_time",
        ):
            meta = soup.find("meta", {"property": meta_name}) or soup.find(
                "meta", {"name": meta_name}
            )
            if meta and meta.get("content"):
                try:
                    detected_date = datetime.fromisoformat(
                        meta["content"].replace("Z", "+00:00").split("+")[0]
                    )
                    break
                except ValueError:
                    pass

        # Also check <time> tags
        if not detected_date:
            time_tag = soup.find("time", {"datetime": True})
            if time_tag:
                try:
                    detected_date = datetime.fromisoformat(
                        time_tag["datetime"].replace("Z", "+00:00").split("+")[0]
                    )
                except ValueError:
                    pass

        # Extract content
        article = (
            soup.find("article")
            or soup.find("main")
            or soup.find("div", class_="post-content")
            or soup.find("div", class_="entry-content")
        )

        if article:
            for tag in article.find_all(["script", "style", "nav", "footer"]):
                tag.decompose()
            text = article.get_text(separator=" ", strip=True)
        else:
            text = soup.get_text(separator=" ", strip=True)

        return text[:MAX_ARTICLE_CHARS], detected_date
    except Exception:
        return "", None
