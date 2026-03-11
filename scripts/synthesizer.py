"""
Two-step synthesis:
1. FILTER: Claude scores all scraped items by relevance, keeps top N
2. ENRICH: Claude generates Spanish title + bajada for each keeper
"""

import json
import anthropic
from config import CLAUDE_MODEL, MAX_NEWS_PER_RUN

BATCH_SIZE = 25  # Larger batches for filtering (lighter output)


def filter_relevant(items: list[dict]) -> list[dict]:
    """
    Send all items to Claude and ask it to pick the top MAX_NEWS_PER_RUN
    most relevant for an AI/dev audience. Returns filtered list.
    """
    if len(items) <= MAX_NEWS_PER_RUN:
        return items

    client = anthropic.Anthropic()

    # Build compact summaries for scoring
    compact = []
    for i, item in enumerate(items):
        compact.append({
            "i": i,
            "source": item.get("source", ""),
            "title": item.get("title", "")[:150],
            "snippet": item.get("summary", "")[:300],
        })

    prompt = f"""Eres un editor jefe de un blog de noticias de IA para developers.

De las siguientes {len(compact)} noticias, selecciona las {MAX_NEWS_PER_RUN} más relevantes e importantes.

Criterios de selección (en orden de prioridad):
1. Lanzamientos de nuevos modelos, APIs o productos de IA
2. Herramientas open-source nuevas o actualizaciones importantes
3. Adquisiciones, funding rounds o movimientos de negocio significativos
4. Papers con impacto real en la práctica (no incremental research)
5. Cambios regulatorios o controversias importantes
6. Noticias que afectan directamente a developers

Descarta:
- Noticias repetidas o muy similares entre sí (quedarse con la mejor fuente)
- Posts genéricos de blog sin novedad real
- Repos de GitHub que no están relacionados con IA
- Papers muy nicho o incrementales
- Noticias viejas reempaquetadas

Responde SOLO con un JSON array de los índices seleccionados, ordenados por relevancia (más importante primero).
Ejemplo: [3, 15, 7, 22, 1, ...]

Noticias:
{json.dumps(compact, ensure_ascii=False)}"""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    try:
        text = response.content[0].text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        selected_indices = json.loads(text)
        # Validate indices
        selected_indices = [i for i in selected_indices if isinstance(i, int) and 0 <= i < len(items)]
        selected = [items[i] for i in selected_indices[:MAX_NEWS_PER_RUN]]
        print(f"  Filtradas: {len(items)} → {len(selected)} noticias relevantes")
        return selected
    except (json.JSONDecodeError, IndexError) as e:
        print(f"  [WARN] Error en filtrado, usando primeras {MAX_NEWS_PER_RUN}: {e}")
        return items[:MAX_NEWS_PER_RUN]


def enrich_news(items: list[dict]) -> list[dict]:
    """Generate Spanish title + bajada for each item."""
    if not items:
        return []

    client = anthropic.Anthropic()
    enriched = []
    batch_size = 15

    for i in range(0, len(items), batch_size):
        batch = items[i : i + batch_size]
        print(f"  Generando bajadas batch {i // batch_size + 1} ({len(batch)} noticias)...")

        batch_input = []
        for j, item in enumerate(batch):
            batch_input.append({
                "index": j,
                "source": item.get("source", ""),
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "content": item.get("summary", "")[:1200],
            })

        prompt = f"""Eres un editor de un blog tech de noticias de IA en español.

Para cada noticia, genera:
1. "title_es": Un título atractivo en español (máximo 100 caracteres). Si la noticia ya está clara, podés traducirla y mejorarla. No uses clickbait.
2. "bajada": Un resumen breve de 2-3 oraciones en español que explique qué pasó y por qué importa. Tono profesional pero accesible, orientado a developers.
3. "categoria": Una de estas categorías: "modelos", "herramientas", "research", "negocio", "open-source", "regulacion", "producto"

Responde SOLO con un JSON array válido. Sin markdown, sin backticks, solo el JSON.

Ejemplo de formato:
[
  {{"index": 0, "title_es": "OpenAI adquiere plataforma de testing de IA", "bajada": "La compañía compró Promptfoo para reforzar la seguridad de sus modelos. Esto marca un cambio hacia evaluaciones más rigurosas antes de lanzar modelos a producción.", "categoria": "negocio"}}
]

Noticias a procesar:
{json.dumps(batch_input, ensure_ascii=False)}"""

        response = client.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )

        try:
            text = response.content[0].text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
            results = json.loads(text)
        except (json.JSONDecodeError, IndexError) as e:
            print(f"  [WARN] Error parseando respuesta: {e}")
            for item in batch:
                enriched.append({
                    **item,
                    "title_es": item.get("title", "Sin título"),
                    "bajada": item.get("summary", "")[:200],
                    "categoria": "herramientas",
                })
            continue

        results_by_index = {r["index"]: r for r in results}
        for j, item in enumerate(batch):
            result = results_by_index.get(j, {})
            enriched.append({
                **item,
                "title_es": result.get("title_es", item.get("title", "Sin título")),
                "bajada": result.get("bajada", item.get("summary", "")[:200]),
                "categoria": result.get("categoria", "herramientas"),
            })

    return enriched


def synthesize_news(items: list[dict]) -> list[dict]:
    """
    Full pipeline: filter by relevance, then enrich with Spanish titles + bajadas.
    """
    print(f"\n  [Paso 1/2] Filtrando por relevancia ({len(items)} candidatas, top {MAX_NEWS_PER_RUN})...")
    filtered = filter_relevant(items)

    print(f"\n  [Paso 2/2] Generando títulos y bajadas...")
    enriched = enrich_news(filtered)

    print(f"\n  Resultado: {len(enriched)} noticias listas para publicar")
    return enriched
