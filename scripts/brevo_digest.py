#!/usr/bin/env python3
"""Render and send the daily 5AI digest via Brevo."""

from __future__ import annotations

import argparse
import html
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Iterable

import requests
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
CONTENT_DIR = ROOT_DIR / "content"
NEWS_DIR = CONTENT_DIR / "news"
PREVIEW_DIR = CONTENT_DIR / "email-previews"

load_dotenv(ROOT_DIR / ".env")

BREVO_API_BASE = "https://api.brevo.com/v3"
FRONTEND_COLORS = {
    "background": "#071018",
    "surface": "#0D1924",
    "border": "#223548",
    "accent": "#FF6B2C",
    "text_primary": "#F4F7FB",
    "text_secondary": "#8CA0B6",
    "success": "#75F2B6",
}


def get_latest_news_date() -> str:
    files = sorted(NEWS_DIR.glob("*.json"), reverse=True)
    if not files:
        raise FileNotFoundError("No daily news files found in content/news")
    return files[0].stem


def load_news_items(date_str: str) -> list[dict]:
    path = NEWS_DIR / f"{date_str}.json"
    if not path.exists():
        raise FileNotFoundError(f"News file not found: {path}")
    with open(path, "r", encoding="utf-8") as handle:
        items = json.load(handle)
    items.sort(key=lambda item: item.get("rank", 99))
    return items


def format_domain(url: str) -> str:
    return url.replace("https://", "").replace("http://", "").split("/")[0]


def render_digest_html(date_str: str, items: list[dict], site_url: str, lang: str) -> str:
    is_en = lang == "en"
    top_items = items[:5]
    date_label = datetime.fromisoformat(date_str).strftime("%B %d, %Y") if is_en else datetime.fromisoformat(date_str).strftime("%d/%m/%Y")
    title = "The 5 AI news that matter today" if is_en else "Las 5 noticias de IA que importan hoy"
    intro = (
        "A compact brief with the most important stories in AI today."
        if is_en
        else "Un brief compacto con las historias de IA mas importantes del dia."
    )
    cta_label = "Read the full edition" if is_en else "Leer la edicion completa"
    footer = (
        "Made by two Chilean geeks with a one-shot prompt"
        if is_en
        else "Hecho por dos geeks chilenos con un solo prompt"
    )

    cards = []
    for index, item in enumerate(top_items, start=1):
        heading = item.get("title") if is_en else item.get("title_es")
        summary = item.get("bajada_en") if is_en else item.get("bajada")
        if is_en and not summary:
            summary = item.get("bajada")
        importance = item.get("importancia", 3)
        tag = {
            5: "BREAKING" if is_en else "BREAKING",
            4: "VERY IMPORTANT" if is_en else "MUY IMPORTANTE",
            3: "IMPORTANT" if is_en else "IMPORTANTE",
            2: "INTERESTING" if is_en else "INTERESANTE",
            1: "INFORMATIVE" if is_en else "INFORMATIVA",
        }.get(importance, "IMPORTANT" if is_en else "IMPORTANTE")
        cards.append(
            f"""
            <tr>
              <td style="padding:0 0 18px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:{FRONTEND_COLORS['surface']};border:1px solid {FRONTEND_COLORS['border']};border-radius:20px;">
                  <tr>
                    <td style="padding:24px;">
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:{FRONTEND_COLORS['accent']};margin-bottom:14px;">
                        #{index} · {html.escape(tag)} · {html.escape(item.get('source', ''))}
                      </div>
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:1.05;font-weight:800;letter-spacing:-0.03em;color:{FRONTEND_COLORS['text_primary']};margin:0 0 12px 0;">
                        {html.escape(heading or "")}
                      </div>
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:{FRONTEND_COLORS['text_secondary']};margin:0 0 18px 0;">
                        {html.escape(summary or "")}
                      </div>
                      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                          <td>
                            <a href="{html.escape(item.get('link', ''))}" style="display:inline-block;padding:12px 16px;background:{FRONTEND_COLORS['accent']};border-radius:999px;color:{FRONTEND_COLORS['background']};font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;text-decoration:none;">
                              {cta_label}
                            </a>
                          </td>
                          <td style="padding-left:12px;font-family:Courier New,monospace;font-size:12px;color:{FRONTEND_COLORS['text_secondary']};">
                            {html.escape(format_domain(item.get('link', '')))}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            """
        )

    return f"""<!DOCTYPE html>
<html lang="{lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>5AI Digest</title>
  </head>
  <body style="margin:0;padding:0;background:{FRONTEND_COLORS['background']};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:{FRONTEND_COLORS['background']};">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:720px;">
            <tr>
              <td style="padding:0 0 18px 0;">
                <div style="font-family:Arial,Helvetica,sans-serif;font-size:48px;font-weight:900;letter-spacing:-0.08em;color:{FRONTEND_COLORS['text_primary']};">
                  5AI
                </div>
                <div style="font-family:Courier New,monospace;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:{FRONTEND_COLORS['text_secondary']};margin-top:6px;">
                  {html.escape(date_label)}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 28px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:linear-gradient(180deg, rgba(255,107,44,0.18), rgba(13,25,36,1));border:1px solid {FRONTEND_COLORS['border']};border-radius:24px;">
                  <tr>
                    <td style="padding:28px;">
                      <div style="font-family:Courier New,monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:{FRONTEND_COLORS['accent']};margin-bottom:14px;">
                        Top 5
                      </div>
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:34px;line-height:1.02;font-weight:800;letter-spacing:-0.04em;color:{FRONTEND_COLORS['text_primary']};margin:0 0 12px 0;">
                        {html.escape(title)}
                      </div>
                      <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:{FRONTEND_COLORS['text_secondary']};max-width:560px;">
                        {html.escape(intro)}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            {''.join(cards)}
            <tr>
              <td style="padding:10px 0 0 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid {FRONTEND_COLORS['border']};">
                  <tr>
                    <td style="padding-top:18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:{FRONTEND_COLORS['text_secondary']};">
                      {html.escape(footer)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:8px;font-family:Courier New,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:{FRONTEND_COLORS['text_secondary']};">
                      <a href="{html.escape(site_url.rstrip('/') + '/dia/' + date_str)}" style="color:{FRONTEND_COLORS['text_secondary']};text-decoration:none;">{html.escape(site_url.rstrip('/') + '/dia/' + date_str)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"""


def render_digest_text(date_str: str, items: list[dict], site_url: str, lang: str) -> str:
    is_en = lang == "en"
    lines = [
        f"5AI - {date_str}",
        "",
        "The 5 AI news that matter today" if is_en else "Las 5 noticias de IA que importan hoy",
        "",
    ]
    for index, item in enumerate(items[:5], start=1):
        heading = item.get("title") if is_en else item.get("title_es")
        summary = item.get("bajada_en") if is_en else item.get("bajada")
        if is_en and not summary:
          summary = item.get("bajada")
        lines.extend(
            [
                f"{index}. {heading}",
                f"   {summary}",
                f"   {item.get('link', '')}",
                "",
            ]
        )

    lines.extend(
        [
            site_url.rstrip("/") + f"/dia/{date_str}",
            "",
            "Made by two Chilean geeks with a one-shot prompt"
            if is_en
            else "Hecho por dos geeks chilenos con un solo prompt",
        ]
    )
    return "\n".join(lines)


def brevo_headers(api_key: str) -> dict[str, str]:
    return {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": api_key,
    }


def fetch_all_contacts(api_key: str, list_id: int) -> list[dict]:
    contacts: list[dict] = []
    offset = 0

    while True:
        response = requests.get(
            f"{BREVO_API_BASE}/contacts/lists/{list_id}/contacts",
            headers=brevo_headers(api_key),
            params={"limit": 500, "offset": offset, "sort": "desc"},
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
        batch = payload.get("contacts", [])
        contacts.extend(batch)
        if len(batch) < 500:
            break
        offset += 500

    return contacts


def active_recipient_emails(contacts: Iterable[dict], list_id: int) -> list[dict]:
    recipients = []
    for contact in contacts:
        email = contact.get("email")
        if not email or contact.get("emailBlacklisted"):
            continue
        if list_id in contact.get("listUnsubscribed", []):
            continue
        recipients.append({"email": email})
    return recipients


def chunked(items: list[dict], size: int) -> Iterable[list[dict]]:
    for index in range(0, len(items), size):
        yield items[index : index + size]


def send_batches(
    api_key: str,
    recipients: list[dict],
    subject: str,
    html_content: str,
    text_content: str,
    sender_email: str,
    sender_name: str,
    sandbox: bool,
) -> int:
    sent = 0
    headers = brevo_headers(api_key)
    if sandbox:
        headers["X-Sib-Sandbox"] = "drop"

    for batch in chunked(recipients, 99):
        response = requests.post(
            f"{BREVO_API_BASE}/smtp/email",
            headers=headers,
            json={
                "sender": {"email": sender_email, "name": sender_name},
                "to": batch,
                "subject": subject,
                "htmlContent": html_content,
                "textContent": text_content,
            },
            timeout=30,
        )
        response.raise_for_status()
        sent += len(batch)
    return sent


def subject_for(date_str: str, lang: str) -> str:
    return (
        f"5AI - The 5 AI news that matter today ({date_str})"
        if lang == "en"
        else f"5AI - Las 5 noticias de IA que importan hoy ({date_str})"
    )


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required env var: {name}")
    return value


def write_preview(date_str: str, html_content: str) -> Path:
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    path = PREVIEW_DIR / f"{date_str}.html"
    path.write_text(html_content, encoding="utf-8")
    return path


def main() -> None:
    parser = argparse.ArgumentParser(description="Send the daily 5AI digest via Brevo")
    parser.add_argument("--date", help="News date in YYYY-MM-DD format")
    parser.add_argument("--preview-only", action="store_true", help="Only render the HTML preview file")
    args = parser.parse_args()

    date_str = args.date or get_latest_news_date()
    lang = os.getenv("BREVO_EMAIL_LANG", "en").lower()
    site_url = os.getenv("SITE_URL", "http://localhost:3000")
    items = load_news_items(date_str)
    html_content = render_digest_html(date_str, items, site_url, lang)
    text_content = render_digest_text(date_str, items, site_url, lang)
    preview_path = write_preview(date_str, html_content)
    print(f"[OK] Email preview generated: {preview_path}")

    if args.preview_only:
        return

    api_key = require_env("BREVO_API_KEY")
    list_id = int(require_env("BREVO_LIST_ID"))
    sender_email = require_env("BREVO_SENDER_EMAIL")
    sender_name = os.getenv("BREVO_SENDER_NAME", "5AI")
    sandbox = os.getenv("BREVO_SANDBOX", "0") == "1"

    contacts = fetch_all_contacts(api_key, list_id)
    recipients = active_recipient_emails(contacts, list_id)

    if not recipients:
        print("[SKIP] No active recipients found in the Brevo list.")
        return

    sent = send_batches(
        api_key=api_key,
        recipients=recipients,
        subject=subject_for(date_str, lang),
        html_content=html_content,
        text_content=text_content,
        sender_email=sender_email,
        sender_name=sender_name,
        sandbox=sandbox,
    )
    mode = "sandbox" if sandbox else "live"
    print(f"[OK] Sent {sent} recipients via Brevo ({mode}).")


if __name__ == "__main__":
    main()
