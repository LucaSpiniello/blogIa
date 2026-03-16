export type Lang = "en" | "es";

export const translations = {
  en: {
    // Header
    tagline: "The 5 AI news that matter today",
    navHome: "/home",
    navAbout: "/about",

    // Home
    heading: "5AI",
    emptyState: "No news yet. The pipeline runs 2 times per day.",
    newsCount: (n: number) => `${n} news`,
    topFive: "Top 5",
    heroDeck:
      "The signal first. The five stories driving the AI cycle today, ranked to be scanned in seconds.",

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
    subscribeTitle: "Subscribe to 5AI",
    subscribeDesc:
      "Subscribe to receive the daily 5AI brief every evening, around 7:30 PM Chile time.",
    subscribeWarning:
      "English edition.",
    subscribePlaceholder: "you@email.com",
    subscribeButton: "Subscribe",
    subscribeSuccess: "Subscribed successfully.",
    subscribeAlready: "You're already subscribed.",
    subscribeError: "Error subscribing",
    connectionError: "Connection error",

    // Footer
    footerTagline: "5AI — Made with AI, for curious humans",
    footerCredit: "Made by two Chilean geeks with a one-shot prompt",

    // About
    aboutTitle: "About 5AI",
    aboutDesc:
      "5AI is an automated blog that daily selects, filters and ranks the most important news from the world of artificial intelligence.",
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

    heading: "5AI",
    emptyState:
      "No hay noticias todavia. El pipeline se ejecuta 2 veces al dia.",
    newsCount: (n: number) => `${n} noticias`,
    topFive: "Top 5",
    heroDeck:
      "Primero la señal. Las cinco historias que están moviendo el ciclo de IA hoy, ordenadas para escanearlas en segundos.",

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

    subscribeTitle: "Suscribite a 5AI",
    subscribeDesc:
      "Suscribite para recibir el brief diario de 5AI todas las tardes, alrededor de las 19:30 de Chile.",
    subscribeWarning:
      "Edicion en ingles.",
    subscribePlaceholder: "tu@email.com",
    subscribeButton: "Suscribirse",
    subscribeSuccess: "Suscripto exitosamente.",
    subscribeAlready: "Ya estas suscripto.",
    subscribeError: "Error al suscribirse",
    connectionError: "Error de conexion",

    footerTagline: "5AI — Hecho con IA, para humanos curiosos",
    footerCredit: "Hecho por dos geeks chilenos con un solo prompt",

    aboutTitle: "Sobre 5AI",
    aboutDesc:
      "5AI es un blog automatizado que selecciona, filtra y rankea diariamente las noticias mas importantes del mundo de la inteligencia artificial.",
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
