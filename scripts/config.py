"""Configuration for AI news sources."""

SOURCES = [
    # ==========================================
    # TIER 1: Grandes players de IA (RSS)
    # ==========================================
    {
        "name": "OpenAI",
        "type": "rss",
        "url": "https://openai.com/blog/rss.xml",
        "max_items": 5,
    },
    {
        "name": "Google AI",
        "type": "rss",
        "url": "https://blog.google/technology/ai/rss/",
        "max_items": 5,
    },
    {
        "name": "Hugging Face",
        "type": "rss",
        "url": "https://huggingface.co/blog/feed.xml",
        "max_items": 5,
    },
    {
        "name": "Meta AI",
        "type": "rss",
        "url": "https://ai.meta.com/blog/rss/",
        "max_items": 5,
    },
    {
        "name": "Microsoft AI",
        "type": "rss",
        "url": "https://blogs.microsoft.com/ai/feed/",
        "max_items": 5,
    },
    {
        "name": "NVIDIA AI",
        "type": "rss",
        "url": "https://blogs.nvidia.com/feed/",
        "max_items": 5,
    },
    # ==========================================
    # TIER 1: Grandes players (HTML scraping)
    # ==========================================
    {
        "name": "Anthropic",
        "type": "html",
        "url": "https://www.anthropic.com/news",
        "link_selector": "a[href*='/news/']",
        "title_selector": "h3",
        "base_url": "https://www.anthropic.com",
        "max_items": 5,
    },
    # ==========================================
    # TIER 2: Medios tech especializados (RSS)
    # ==========================================
    {
        "name": "TechCrunch",
        "type": "rss",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
        "max_items": 5,
    },
    {
        "name": "The Verge",
        "type": "rss",
        "url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
        "max_items": 5,
    },
    {
        "name": "Ars Technica",
        "type": "rss",
        "url": "https://feeds.arstechnica.com/arstechnica/technology-lab",
        "max_items": 5,
    },
    {
        "name": "VentureBeat",
        "type": "rss",
        "url": "https://venturebeat.com/category/ai/feed/",
        "max_items": 5,
    },
    {
        "name": "MIT Tech Review",
        "type": "rss",
        "url": "https://www.technologyreview.com/feed/",
        "max_items": 5,
    },
    {
        "name": "Wired",
        "type": "rss",
        "url": "https://www.wired.com/feed/tag/ai/latest/rss",
        "max_items": 5,
    },
    {
        "name": "The Information",
        "type": "rss",
        "url": "https://www.theinformation.com/feed",
        "max_items": 3,
    },
    # ==========================================
    # TIER 3: Comunidad dev / open-source
    # ==========================================
    {
        "name": "GitHub",
        "type": "html",
        "url": "https://github.com/trending?since=daily",
        "link_selector": "h2.h3 a",
        "title_selector": None,
        "base_url": "https://github.com",
        "max_items": 10,
    },
    {
        "name": "Hacker News",
        "type": "rss",
        "url": "https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT+OR+Claude+OR+Gemini&points=50",
        "max_items": 10,
    },
    {
        "name": "Reddit r/MachineLearning",
        "type": "rss",
        "url": "https://www.reddit.com/r/MachineLearning/hot.rss",
        "max_items": 5,
    },
    {
        "name": "Reddit r/LocalLLaMA",
        "type": "rss",
        "url": "https://www.reddit.com/r/LocalLLaMA/hot.rss",
        "max_items": 5,
    },
    {
        "name": "Reddit r/artificial",
        "type": "rss",
        "url": "https://www.reddit.com/r/artificial/hot.rss",
        "max_items": 5,
    },
    # ==========================================
    # TIER 4: Research / Papers
    # ==========================================
    {
        "name": "arXiv AI",
        "type": "rss",
        "url": "https://rss.arxiv.org/rss/cs.AI",
        "max_items": 5,
    },
    {
        "name": "arXiv LLM",
        "type": "rss",
        "url": "https://rss.arxiv.org/rss/cs.CL",
        "max_items": 5,
    },
    {
        "name": "Papers With Code",
        "type": "rss",
        "url": "https://paperswithcode.com/latest.rss",
        "max_items": 5,
    },
    # ==========================================
    # TIER 5: Startups e indie tools
    # ==========================================
    # ProductHunt bloquea scraping (403), deshabilitado
    # {
    #     "name": "ProductHunt",
    #     "type": "html",
    #     "url": "https://www.producthunt.com/topics/artificial-intelligence",
    #     "link_selector": "a[href*='/posts/']",
    #     "title_selector": None,
    #     "base_url": "https://www.producthunt.com",
    #     "max_items": 5,
    # },
    {
        "name": "Y Combinator",
        "type": "rss",
        "url": "https://www.ycombinator.com/blog/feed/",
        "max_items": 3,
    },
    {
        "name": "a16z AI",
        "type": "rss",
        "url": "https://a16z.com/feed/",
        "max_items": 3,
    },
]

# Claude model for synthesis
CLAUDE_MODEL = "claude-haiku-4-5-20251001"
MAX_ARTICLE_CHARS = 2000

# Máximo de noticias a publicar por corrida (las más relevantes)
MAX_NEWS_PER_RUN = 15

# Cuántas veces al día ejecutar (para GitHub Actions cron)
RUNS_PER_DAY = 3  # mañana, mediodía, noche
