import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PULSE Food",
    short_name: "PULSE",
    description: "La cuisine végétarienne qui nourrit vraiment.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2F0E7",
    theme_color: "#17251B",
    icons: [
      { src: "/brand/pulse-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/pulse-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
