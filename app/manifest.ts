import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PULSE Food",
    short_name: "PULSE",
    description: "La cuisine végétarienne qui nourrit vraiment.",
    start_url: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone"],
    scope: "/",
    id: "/",
    orientation: "portrait-primary",
    background_color: "#F2F0E7",
    theme_color: "#17251B",
    icons: [
      { src: "/brand/pulse-192.png", sizes: "192x192", type: "image/png", purpose:"any" },
      { src: "/brand/pulse-512.png", sizes: "512x512", type: "image/png", purpose:"any" },
      { src: "/brand/pulse-512.png", sizes: "512x512", type: "image/png", purpose:"maskable" },
    ],
    categories:["food","lifestyle"],
    shortcuts:[{name:"Explorer les recettes",short_name:"Recettes",url:"/#recettes",icons:[{src:"/brand/pulse-192.png",sizes:"192x192"}]},{name:"Mes recettes sauvegardées",short_name:"Favoris",url:"/favoris",icons:[{src:"/brand/pulse-192.png",sizes:"192x192"}]}],
  };
}
