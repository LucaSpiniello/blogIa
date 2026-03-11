import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d1117",
        surface: "#161b22",
        border: "#30363d",
        accent: "#58a6ff",
        "accent-green": "#3fb950",
        "accent-purple": "#bc8cff",
        "accent-orange": "#f0883e",
        "text-primary": "#e6edf3",
        "text-secondary": "#8b949e",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#e6edf3",
            a: { color: "#58a6ff", "&:hover": { color: "#79c0ff" } },
            h1: { color: "#e6edf3" },
            h2: { color: "#e6edf3" },
            h3: { color: "#e6edf3" },
            h4: { color: "#e6edf3" },
            strong: { color: "#e6edf3" },
            code: { color: "#bc8cff" },
            blockquote: { color: "#8b949e", borderLeftColor: "#30363d" },
            hr: { borderColor: "#30363d" },
            "ul > li::marker": { color: "#8b949e" },
            "ol > li::marker": { color: "#8b949e" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
