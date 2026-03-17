import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "5AI",
    short_name: "5AI",
    description:
      "The 5 AI news that matter today. Daily artificial intelligence news ranked and summarized.",
    start_url: "/",
    display: "standalone",
    background_color: "#071018",
    theme_color: "#071018",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
