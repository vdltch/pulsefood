import type { Metadata } from "next";
import { ProgramPlanner } from "@/components/program-planner";
import { SimpleHeader } from "@/components/simple-header";
import { getPublishedRecipes } from "@/lib/recipe-repository";

export const metadata: Metadata = { title: "Programme 5 jours — PULSE Food", description: "Cinq dîners végétariens protéinés, une seule liste de courses." };
export const dynamic = "force-dynamic";

export default async function ProgrammePage() {
  const recipes = await getPublishedRecipes();
  return <main className="program-page"><SimpleHeader /><section className="program-intro"><span className="eyebrow">LE PLAN QUI CHANGE TOUT</span><h1>5 jours.<br /><em>Zéro charge mentale.</em></h1><p>Cinq dîners végétariens riches en protéines et une liste de courses prête en un clic. Tu choisis le jour, PULSE s’occupe du reste.</p></section><ProgramPlanner recipes={recipes} /></main>;
}
