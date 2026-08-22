"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingBasket, X } from "lucide-react";
import type { ShoppingItem } from "./shopping-drawer";
import { formatIngredient, type StructuredIngredient } from "@/lib/ingredient";
import { updateOfflineRecipe } from "@/lib/pwa-client";

function scaleIngredient(label: string, ratio: number) {
  return label.replace(/^(\d+(?:[.,]\d+)?)/, (value) => {
    const amount = Number(value.replace(",", ".")) * ratio;
    return Number.isInteger(amount) ? String(amount) : amount.toFixed(1).replace(".", ",");
  });
}

export function AnalyticsBeacon({ recipeId, path }: { recipeId?: string; path: string }) {
  useEffect(() => { fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ recipeId, path }), keepalive: true }).catch(() => {}); }, [recipeId, path]);
  return null;
}

export function RecipeExperience({ recipe }: { recipe: { id: string; slug: string; title: string; servings: number; ingredients: string[]; structuredIngredients?:StructuredIngredient[]; steps: string[] } }) {
  const [servings, setServings] = useState(recipe.servings || 2);
  const [cook, setCook] = useState(false);
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const [liked, setLiked] = useState(false);
  const [shoppingAdded, setShoppingAdded] = useState(false);
  const ratio = servings / (recipe.servings || 2);
  const ingredients = useMemo(() => recipe.structuredIngredients?.length ? recipe.structuredIngredients.map(item=>formatIngredient(item,ratio)) : recipe.ingredients.map((item) => scaleIngredient(item, ratio)), [recipe.ingredients,recipe.structuredIngredients, ratio]);

  useEffect(() => { setLiked(JSON.parse(localStorage.getItem("pulse-favorites") || "[]").includes(recipe.slug)); }, [recipe.slug]);
  function favorite() {
    const list: string[] = JSON.parse(localStorage.getItem("pulse-favorites") || "[]");
    const next = liked ? list.filter((item) => item !== recipe.slug) : [...new Set([...list, recipe.slug])];
    localStorage.setItem("pulse-favorites", JSON.stringify(next));
    updateOfflineRecipe(recipe.slug,!liked);
    setLiked(!liked);
    window.dispatchEvent(new Event("pulse-favorites"));
  }
  function addShopping() {
    const raw = JSON.parse(localStorage.getItem("pulse-shopping") || "[]") as unknown[];
    const current = raw.map((item, index) => typeof item === "string" ? { id: `legacy-${index}-${item}`, label: item, quantity: 1, done: false } : item) as ShoppingItem[];
    ingredients.forEach((label) => {
      const match = current.find((item) => item.label.toLocaleLowerCase("fr") === label.toLocaleLowerCase("fr"));
      if (match) match.quantity += 1;
      else current.push({ id: crypto.randomUUID(), label, quantity: 1, done: false });
    });
    localStorage.setItem("pulse-shopping", JSON.stringify(current));
    window.dispatchEvent(new Event("pulse-shopping"));
    setShoppingAdded(true);
    setTimeout(() => setShoppingAdded(false), 2000);
  }

  return <>
    <div className="recipe-tools"><div className="servings"><span>Portions</span><button onClick={() => setServings(Math.max(1, servings - 1))}><Minus size={15} /></button><b>{servings}</b><button onClick={() => setServings(Math.min(20, servings + 1))}><Plus size={15} /></button></div><button className={liked ? "tool liked" : "tool"} onClick={favorite}><Heart size={17} fill={liked ? "currentColor" : "none"} />{liked ? "Sauvegardée" : "Sauvegarder"}</button><button className={shoppingAdded ? "tool added" : "tool"} onClick={addShopping}>{shoppingAdded ? <Check size={17} /> : <ShoppingBasket size={17} />}{shoppingAdded ? "Ajoutée" : "Liste de courses"}</button><button className="cook-button" onClick={() => setCook(true)}>Lancer le mode cuisine</button></div>
    <section className="recipe-body"><div><span className="eyebrow">À PRÉPARER</span><h2>Les ingrédients</h2><ul className="ingredients interactive">{ingredients.map((item, index) => <li key={`${item}-${index}`} className={checked.includes(index) ? "checked" : ""} onClick={() => setChecked(checked.includes(index) ? checked.filter((number) => number !== index) : [...checked, index])}><span>{checked.includes(index) && <Check size={14} />}</span>{item}</li>)}</ul></div><div><span className="eyebrow">EN CUISINE</span><h2>La méthode</h2><ol className="steps">{recipe.steps.map((item) => <li key={item}>{item}</li>)}</ol></div></section>
    {cook && <div className="cook-mode"><button className="cook-close" onClick={() => setCook(false)}><X /></button><div className="cook-progress"><span>ÉTAPE {step + 1} SUR {recipe.steps.length}</span><i style={{ width: `${((step + 1) / recipe.steps.length) * 100}%` }} /></div><h2>{recipe.steps[step]}</h2><div className="cook-nav"><button disabled={step === 0} onClick={() => setStep(step - 1)}><ChevronLeft />Précédente</button>{step < recipe.steps.length - 1 ? <button onClick={() => setStep(step + 1)}>Suivante<ChevronRight /></button> : <button onClick={() => setCook(false)}>C&apos;est prêt <Check /></button>}</div></div>}
  </>;
}
