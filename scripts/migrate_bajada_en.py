"""One-time migration: add bajada_en to existing news JSON files."""
import json, glob, anthropic
from config import CLAUDE_MODEL

client = anthropic.Anthropic()

for path in sorted(glob.glob("../content/news/*.json")):
    with open(path) as f:
        items = json.load(f)

    # Skip if already migrated
    if all(item.get("bajada_en") for item in items):
        print(f"  {path}: already has bajada_en, skipping")
        continue

    bajadas = [{"i": i, "bajada": item["bajada"]} for i, item in enumerate(items) if not item.get("bajada_en")]

    prompt = f"""Translate each Spanish "bajada" to English. Keep the same professional, developer-oriented tone.
Return ONLY a JSON array with objects containing "i" (index) and "bajada_en" (English translation).

{json.dumps(bajadas, ensure_ascii=False)}"""

    resp = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}],
    )

    text = resp.content[0].text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    # Find the JSON array in the response
    start = text.find("[")
    end = text.rfind("]") + 1
    if start == -1 or end == 0:
        print(f"  {path}: ERROR - no JSON array found")
        continue

    results = json.loads(text[start:end])
    by_index = {r["i"]: r["bajada_en"] for r in results}

    for i, item in enumerate(items):
        if i in by_index:
            item["bajada_en"] = by_index[i]

    with open(path, "w") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"  {path}: migrated {len(by_index)} bajadas")

print("\nDone!")
