import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/favorites-grid";
import { SimpleHeader } from "@/components/simple-header";
import { getPublishedRecipes } from "@/lib/recipe-repository";

export const metadata: Metadata = { title: "Mes favoris — PULSE Food", description: "Retrouve toutes tes recettes PULSE sauvegardées." };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const recipes = await getPublishedRecipes();
  return <main className="favorites-page"><SimpleHeader /><section className="favorites-hero"><span className="eyebrow">TON CARNET PULSE</span><h1>Les recettes que<br /><em>tu veux refaire.</em></h1></section><FavoritesGrid recipes={recipes} /></main>;
}
