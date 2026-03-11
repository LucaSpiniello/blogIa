"""Scrapes AI news from multiple sources (RSS + HTML)."""

import feedparser
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from config import MAX_ARTICLE_CHARS

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; IAalDia/1.0; +https://github.com/LucaSpiniello/blogIa)"
}
REQUEST_TIMEOUT = 15


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
    """Parse an RSS feed and return recent items."""
    feed = feedparser.parse(source["url"])
    items = []
    cutoff = datetime.now() - timedelta(days=2)

    for entry in feed.entries[: source["max_items"]]:
        published = ""
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            pub_date = datetime(*entry.published_parsed[:6])
            if pub_date < cutoff:
                continue
            published = pub_date.isoformat()

        summary = entry.get("summary", entry.get("description", ""))
        # Clean HTML from summary
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
    """Scrape an HTML page for article links."""
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

        # Get title
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

        # Try to fetch article content
        summary = fetch_article_content(href)

        items.append(
            {
                "source": source["name"],
                "title": title.strip(),
                "link": href,
                "summary": summary,
                "published": "",
            }
        )

    print(f"[OK] {source['name']}: {len(items)} items")
    return items


def fetch_article_content(url: str) -> str:
    """Fetch an article page and extract main text content."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")

        # Try common article containers
        article = (
            soup.find("article")
            or soup.find("main")
            or soup.find("div", class_="post-content")
            or soup.find("div", class_="entry-content")
        )

        if article:
            # Remove scripts, styles, navs
            for tag in article.find_all(["script", "style", "nav", "footer"]):
                tag.decompose()
            text = article.get_text(separator=" ", strip=True)
        else:
            text = soup.get_text(separator=" ", strip=True)

        return text[:MAX_ARTICLE_CHARS]
    except Exception:
        return ""
