"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Clock3, ShoppingBasket, Zap } from "lucide-react";
import type { Recipe } from "@/lib/recipes";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export function ProgramPlanner({ recipes }: { recipes: Recipe[] }) {
  const selection = useMemo(() => recipes.slice(0, 5), [recipes]);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const recipe = selection[active];

  function addWeek() {
    const raw = JSON.parse(localStorage.getItem("pulse-shopping") || "[]") as unknown[];
    const existing = raw.map((entry, index) => typeof entry === "string" ? { id: `legacy-${index}-${entry}`, label: entry, quantity: 1, done: false } : entry) as { id: string; label: string; quantity: number; done: boolean }[];
    const next = [...existing];
    selection.flatMap((item) => item.ingredients).forEach((label) => {
      const match = next.find((item) => item.label.toLocaleLowerCase("fr") === label.toLocaleLowerCase("fr"));
      if (match) match.quantity += 1;
      else next.push({ id: crypto.randomUUID(), label, quantity: 1, done: false });
    });
    localStorage.setItem("pulse-shopping", JSON.stringify(next));
    window.dispatchEvent(new Event("pulse-shopping"));
    setAdded(true);
  }

  if (!recipe) return null;
  const totalProtein = selection.reduce((sum, item) => sum + item.protein, 0);
  const totalMinutes = selection.reduce((sum, item) => sum + item.prepMinutes, 0);

  return <div className="planner">
    <div className="planner-tabs">{selection.map((item, index) => <button className={active === index ? "active" : ""} onClick={() => setActive(index)} key={item.id}><small>0{index + 1}</small><span>{days[index]}</span></button>)}</div>
    <div className="planner-card">
      <div className="planner-photo"><Image src={recipe.image} alt={recipe.title} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
      <div className="planner-copy">
        <span className="eyebrow">{days[active]} — DÎNER</span>
        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>
        <div className="planner-meta"><span><Clock3 />{recipe.prepMinutes} min</span><span><Zap />{recipe.protein} g protéines</span></div>
        <Link href={`/recettes/${recipe.slug}`}>Voir la recette <ChevronRight /></Link>
        <div className="planner-nav"><button disabled={active === 0} onClick={() => setActive(active - 1)}><ChevronLeft /></button><span>{active + 1} / {selection.length}</span><button disabled={active === selection.length - 1} onClick={() => setActive(active + 1)}><ChevronRight /></button></div>
      </div>
    </div>
    <div className="week-summary"><div><span>PROTÉINES — 5 DÎNERS</span><b>{totalProtein} g</b></div><div><span>TEMPS TOTAL</span><b>{totalMinutes} min</b></div><button onClick={addWeek}>{added ? <Check /> : <ShoppingBasket />}{added ? "Liste ajoutée" : "Ajouter la semaine aux courses"}</button></div>
  </div>;
}
