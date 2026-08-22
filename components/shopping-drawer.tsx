"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Copy, Minus, Plus, Printer, Share2, ShoppingBasket, Trash2, X } from "lucide-react";

export type ShoppingItem = { id: string; label: string; quantity: number; done: boolean };

function readItems(): ShoppingItem[] {
  try {
    const stored = JSON.parse(localStorage.getItem("pulse-shopping") || "[]") as unknown[];
    return stored.map((item, index) => typeof item === "string"
      ? { id: `legacy-${index}-${item}`, label: item, quantity: 1, done: false }
      : item as ShoppingItem);
  } catch { return []; }
}

export function ShoppingDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [notice, setNotice] = useState("");
  function load() { setItems(readItems()); }
  function save(next: ShoppingItem[]) { setItems(next); localStorage.setItem("pulse-shopping", JSON.stringify(next)); }
  useEffect(() => { load(); window.addEventListener("pulse-shopping", load); return () => window.removeEventListener("pulse-shopping", load); }, []);
  function update(id: string, changes: Partial<ShoppingItem>) { save(items.map((item) => item.id === id ? { ...item, ...changes } : item)); }
  function remove(id: string) { save(items.filter((item) => item.id !== id)); }
  function clear() { localStorage.removeItem("pulse-shopping"); setItems([]); }
  function listText() { return `Ma liste PULSE\n\n${items.map((item) => `${item.done ? "✓" : "○"} ${item.quantity > 1 ? `${item.quantity} × ` : ""}${item.label}`).join("\n")}`; }
  async function share() {
    const text = listText();
    if (navigator.share) await navigator.share({ title: "Ma liste PULSE", text });
    else { await navigator.clipboard.writeText(text); setNotice("Liste copiée"); setTimeout(() => setNotice(""), 2000); }
  }
  if (pathname.startsWith("/studio-") || pathname.startsWith("/admin")) return null;
  const remaining = items.filter((item) => !item.done).length;
  return <>
    <button className="shopping-fab" onClick={() => setOpen(true)} aria-label="Ouvrir la liste de courses"><ShoppingBasket /><span>{remaining}</span></button>
    {open && <><button className="shopping-backdrop" aria-label="Fermer" onClick={() => setOpen(false)} /><aside className="shopping-panel" aria-label="Liste de courses">
      <div className="shopping-head"><div><span className="eyebrow">MA SEMAINE</span><h2>Liste de courses</h2><p>{remaining} article{remaining > 1 ? "s" : ""} à prendre</p></div><button onClick={() => setOpen(false)} aria-label="Fermer"><X /></button></div>
      <div className="shopping-actions"><button onClick={share}><Share2 />Partager</button><button onClick={() => window.print()}><Printer />Imprimer</button></div>
      {notice && <div className="shopping-notice"><Copy />{notice}</div>}
      <div className="shopping-items">{items.map((item) => <div className={item.done ? "shopping-item done" : "shopping-item"} key={item.id}>
        <button className="item-check" onClick={() => update(item.id, { done: !item.done })} aria-label={item.done ? "Marquer comme non acheté" : "Marquer comme acheté"}>{item.done && <Check size={13} />}</button>
        <span>{item.label}</span>
        <div className="item-quantity"><button onClick={() => item.quantity <= 1 ? remove(item.id) : update(item.id, { quantity: item.quantity - 1 })}><Minus /></button><b>{item.quantity}</b><button onClick={() => update(item.id, { quantity: item.quantity + 1 })}><Plus /></button></div>
        <button className="item-remove" onClick={() => remove(item.id)} aria-label={`Supprimer ${item.label}`}><X /></button>
      </div>)}{!items.length && <div className="shopping-empty"><ShoppingBasket /><p>Ajoute les ingrédients d’une recette pour commencer.</p></div>}</div>
      {!!items.length && <button className="clear-list" onClick={clear}><Trash2 size={15} />Vider la liste</button>}
    </aside></>}
  </>;
}
