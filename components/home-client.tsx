"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { RecipeCard } from "./recipe-card";
import type { Recipe } from "@/lib/recipes";

export function RecipeExplorer({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState(""); const [cat, setCat] = useState("Tout");
  const cats = ["Tout", ...Array.from(new Set(recipes.map(r => r.category)))];
  const shown = useMemo(() => recipes.filter(r => (cat === "Tout" || r.category === cat) && r.title.toLowerCase().includes(query.toLowerCase())), [query, cat, recipes]);
  return <section className="explore" id="recettes">
    <div className="section-head"><div><span className="eyebrow">LA SÉLECTION</span><h2>Que vas-tu cuisiner<br/><em>aujourd'hui ?</em></h2></div><p>Des recettes testées, équilibrées et surtout franchement délicieuses.</p></div>
    <div className="toolbar"><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Chercher une envie…"/></div><button className="filter"><SlidersHorizontal size={17}/> Filtres</button></div>
    <div className="chips">{cats.map(c=><button key={c} className={cat===c?"active":""} onClick={()=>setCat(c)}>{c}</button>)}</div>
    <div className="recipe-grid">{shown.map((r,i)=><RecipeCard key={r.id} recipe={r} index={i}/>)}</div>
    {!shown.length && <div className="empty">Rien ici pour l'instant. Essaie une autre envie 🌱</div>}
  </section>
}
