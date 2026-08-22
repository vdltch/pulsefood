"use client";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./icons";

export function SimpleHeader() {
  const [open, setOpen] = useState(false);
  return <header className="solid-header">
    <Link href="/"><Logo /></Link>
    <nav><Link href="/#recettes">Recettes</Link><Link href="/programme">Programme</Link><Link href="/favoris">Favoris</Link></nav>
    <Link className="header-favorite" href="/favoris"><Heart size={17} /> Mes favoris</Link><button className="menu" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu"><Menu /></button>
    {open && <div className="mobile-menu"><button onClick={() => setOpen(false)} aria-label="Fermer"><X /></button><Link href="/#recettes">Recettes</Link><Link href="/programme">Programme</Link><Link href="/favoris">Mes favoris</Link></div>}
  </header>;
}
