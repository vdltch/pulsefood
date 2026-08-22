"use client";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { Recipe } from "@/lib/recipes";
import { RecipeCard } from "./recipe-card";

export function FavoritesGrid({ recipes }: { recipes: Recipe[] }) {
  const [slugs, setSlugs] = useState<string[] | null>(null);
  useEffect(() => {
    const load = () => setSlugs(JSON.parse(localStorage.getItem("pulse-favorites") || "[]"));
    load();
    window.addEventListener("pulse-favorites", load);
    return () => window.removeEventListener("pulse-favorites", load);
  }, []);
  const favorites = recipes.filter((recipe) => slugs?.includes(recipe.slug));
  if (slugs === null) return <div className="favorites-loading">On retrouve tes recettes…</div>;
  if (!favorites.length) return <div className="favorites-empty"><span><Heart /></span><h2>Ton carnet attend<br /><em>son premier coup de cœur.</em></h2><p>Sauvegarde une recette avec le cœur : elle apparaîtra ici, uniquement sur cet appareil.</p><Link href="/#recettes"><Search /> Explorer les recettes</Link></div>;
  return <div className="recipe-grid favorites-recipes">{favorites.map((recipe, index) => <RecipeCard recipe={recipe} index={index} key={recipe.id} />)}</div>;
}
