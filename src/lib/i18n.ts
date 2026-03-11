export type Lang = "en" | "es";

export const translations = {
  en: {
    // Header
    tagline: "The 5 AI news that matter today",
    navHome: "/home",
    navAbout: "/about",

    // Home
    heading: "5IA",
    emptyState: "No news yet. The pipeline runs 2 times per day.",
    newsCount: (n: number) => `${n} news`,

    // NewsCard
    readMore: "read more →",

    // ImportanceBadge
    importance: {
      5: "BREAKING",
      4: "VERY IMPORTANT",
      3: "IMPORTANT",
      2: "INTERESTING",
      1: "INFORMATIVE",
    } as Record<number, string>,

    // ExpandableNews
    expandButton: (n: number) => `+ See ${n} more news`,
    moreNews: "// more news",
    collapse: "← Collapse",

    // SubscribeForm
    subscribeTitle: "Subscribe to 5IA",
    subscribeDesc: "Get the 5 most important AI news of the day in your inbox.",
    subscribePlaceholder: "you@email.com",
    subscribeButton: "Subscribe",
    subscribeSuccess: "Subscribed successfully",
    subscribeError: "Error subscribing",
    connectionError: "Connection error",

    // Footer
    footerTagline: "5IA — Made with AI, for curious humans",
    footerCredit: "Content curated and synthesized with Claude AI",

    // About
    aboutTitle: "About 5IA",
    aboutDesc:
      "5IA is an automated blog that daily selects, filters and ranks the most important news from the world of artificial intelligence.",
    howItWorks: "How it works",
    steps: [
      "Scraping from 20+ sources (RSS + HTML) twice a day",
      "Claude AI filters the most relevant and discards noise",
      "Generates title, summary and importance ranking",
      "The top 5 are highlighted, the rest remains accessible",
    ],
    sourcesTitle: "Sources",
  },
  es: {
    tagline: "Las 5 noticias de IA que importan hoy",
    navHome: "/inicio",
    navAbout: "/about",

    heading: "5IA",
    emptyState:
      "No hay noticias todavia. El pipeline se ejecuta 2 veces al dia.",
    newsCount: (n: number) => `${n} noticias`,

    readMore: "leer mas →",

    importance: {
      5: "BREAKING",
      4: "MUY IMPORTANTE",
      3: "IMPORTANTE",
      2: "INTERESANTE",
      1: "INFORMATIVA",
    } as Record<number, string>,

    expandButton: (n: number) => `+ Ver ${n} noticias mas`,
    moreNews: "// mas noticias",
    collapse: "← Colapsar",

    subscribeTitle: "Suscribite a 5IA",
    subscribeDesc:
      "Recibe las 5 noticias de IA mas importantes del dia en tu inbox.",
    subscribePlaceholder: "tu@email.com",
    subscribeButton: "Suscribirse",
    subscribeSuccess: "Suscrito exitosamente",
    subscribeError: "Error al suscribirse",
    connectionError: "Error de conexion",

    footerTagline: "5IA — Hecho con IA, para humanos curiosos",
    footerCredit: "Contenido curado y sintetizado con Claude AI",

    aboutTitle: "Sobre 5IA",
    aboutDesc:
      "5IA es un blog automatizado que selecciona, filtra y rankea diariamente las noticias mas importantes del mundo de la inteligencia artificial.",
    howItWorks: "Como funciona",
    steps: [
      "Scraping de +20 fuentes (RSS + HTML) dos veces al dia",
      "Claude AI filtra las mas relevantes y descarta ruido",
      "Genera titulo en espanol, bajada y ranking de importancia",
      "Las top 5 se destacan, el resto queda accesible",
    ],
    sourcesTitle: "Fuentes",
  },
};

export type Translations = (typeof translations)["en"];
