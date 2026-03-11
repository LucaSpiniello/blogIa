"""
Three-step synthesis:
1. FILTER: Claude picks top N most relevant news from all scraped items
2. ENRICH: Claude generates Spanish title + bajada + category for each
3. RANK: Claude assigns importance level (1-5) to each, sorted by importance
"""

import json
import anthropic
from config import CLAUDE_MODEL, MAX_NEWS_PER_RUN

BATCH_SIZE = 25


def filter_relevant(items: list[dict]) -> list[dict]:
    """Pick top MAX_NEWS_PER_RUN most relevant items using Claude."""
    if len(items) <= MAX_NEWS_PER_RUN:
        return items

    client = anthropic.Anthropic()

    from datetime import date
    today = date.today().isoformat()

    compact = []
    for i, item in enumerate(items):
        compact.append({
            "i": i,
            "source": item.get("source", ""),
            "title": item.get("title", "")[:150],
            "published": item.get("published", ""),
            "snippet": item.get("summary", "")[:300],
        })

    prompt = f"""Eres un editor jefe de un blog de noticias de IA para developers.
Hoy es {today}.

De las siguientes {len(compact)} noticias, selecciona las {MAX_NEWS_PER_RUN} más relevantes e importantes.

REGLA CRÍTICA: Solo incluir noticias de HOY o de ayer. Si una noticia tiene fecha ("published") y es de hace más de 2 días, DESCÁRTALA sin importar qué tan relevante sea.

Criterios de selección (en orden de prioridad):
1. Lanzamientos de nuevos modelos, APIs o productos de IA
2. Herramientas open-source nuevas o actualizaciones importantes
3. Adquisiciones, funding rounds o movimientos de negocio significativos
4. Papers con impacto real en la práctica (no incremental research)
5. Cambios regulatorios o controversias importantes
6. Noticias que afectan directamente a developers

Descarta:
- CUALQUIER noticia que no sea reciente (últimas 48h)
- Noticias repetidas o muy similares entre sí (quedarse con la mejor fuente)
- Posts genéricos de blog sin novedad real
- Repos de GitHub que no están relacionados con IA
- Papers muy nicho o incrementales

Si hay menos de {MAX_NEWS_PER_RUN} noticias recientes y relevantes, devuelve solo las que califiquen.

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
        selected_indices = [i for i in selected_indices if isinstance(i, int) and 0 <= i < len(items)]
        selected = [items[i] for i in selected_indices[:MAX_NEWS_PER_RUN]]
        print(f"  Filtradas: {len(items)} -> {len(selected)} noticias relevantes")
        return selected
    except (json.JSONDecodeError, IndexError) as e:
        print(f"  [WARN] Error en filtrado, usando primeras {MAX_NEWS_PER_RUN}: {e}")
        return items[:MAX_NEWS_PER_RUN]


def enrich_and_rank(items: list[dict]) -> list[dict]:
    """Generate Spanish title + bajada + category + importance rank for each item."""
    if not items:
        return []

    client = anthropic.Anthropic()
    batch_input = []
    for j, item in enumerate(items):
        batch_input.append({
            "index": j,
            "source": item.get("source", ""),
            "title": item.get("title", ""),
            "link": item.get("link", ""),
            "content": item.get("summary", "")[:1200],
        })

    prompt = f"""Eres un editor de 5AI, un blog tech de noticias de IA bilingüe (español e inglés).

Para cada noticia, genera:
1. "title_es": Un título atractivo en español (máximo 100 caracteres). No uses clickbait.
2. "bajada": Un resumen breve de 2-3 oraciones en español que explique qué pasó y por qué importa. Tono profesional pero accesible, orientado a developers.
3. "bajada_en": The same summary in English (2-3 sentences). Professional but accessible tone for developers.
4. "categoria": Una de: "modelos", "herramientas", "research", "negocio", "open-source", "regulacion", "producto"
5. "importancia": Un número del 1 al 5 que indica qué tan importante es la noticia:
   - 5: BREAKING - Noticia que cambia la industria (nuevo modelo revolucionario, adquisición masiva, regulación que afecta a todos)
   - 4: MUY IMPORTANTE - Noticia significativa (lanzamiento de producto importante, funding grande, herramienta que muchos usarán)
   - 3: IMPORTANTE - Noticia relevante (actualización notable, paper influyente, movimiento de negocio interesante)
   - 2: INTERESANTE - Noticia menor pero útil (herramienta nicho, actualización incremental)
   - 1: INFORMATIVA - Noticia de contexto o background

Sé estricto con la importancia. No todo es 5. La distribución típica debería ser: 1-2 noticias de importancia 5 o 4, y el resto 3 o menos.

Responde SOLO con un JSON array válido. Sin markdown, sin backticks, solo el JSON.

Ejemplo:
[
  {{"index": 0, "title_es": "OpenAI adquiere Promptfoo", "bajada": "La compañía compró Promptfoo para reforzar la seguridad.", "bajada_en": "The company acquired Promptfoo to strengthen security.", "categoria": "negocio", "importancia": 4}}
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
        enriched = []
        for rank, item in enumerate(items):
            enriched.append({
                **item,
                "title_es": item.get("title", "Sin título"),
                "bajada": item.get("summary", "")[:200],
                "bajada_en": item.get("summary", "")[:200],
                "categoria": "herramientas",
                "importancia": 3,
                "rank": rank + 1,
            })
        return enriched

    results_by_index = {r["index"]: r for r in results}
    enriched = []
    for j, item in enumerate(items):
        result = results_by_index.get(j, {})
        enriched.append({
            **item,
            "title_es": result.get("title_es", item.get("title", "Sin título")),
            "bajada": result.get("bajada", item.get("summary", "")[:200]),
            "bajada_en": result.get("bajada_en", ""),
            "categoria": result.get("categoria", "herramientas"),
            "importancia": result.get("importancia", 3),
        })

    # Sort by importance (highest first)
    enriched.sort(key=lambda x: x.get("importancia", 3), reverse=True)

    # Assign rank (1 = most important)
    for rank, item in enumerate(enriched):
        item["rank"] = rank + 1

    return enriched


def synthesize_news(items: list[dict]) -> list[dict]:
    """Full pipeline: filter -> enrich + rank."""
    print(f"\n  [Paso 1/2] Filtrando por relevancia ({len(items)} candidatas, top {MAX_NEWS_PER_RUN})...")
    filtered = filter_relevant(items)

    print(f"\n  [Paso 2/2] Generando títulos, bajadas y ranking de importancia...")
    enriched = enrich_and_rank(filtered)

    print(f"\n  Resultado: {len(enriched)} noticias rankeadas")
    return enriched
