"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDown, Play, X } from "lucide-react";

export function BrandFilm() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return <>
    <button className="play" onClick={() => setOpen(true)}><span><Play size={15} fill="currentColor" /></span> Voir le film</button>
    {open && <div className="brand-film" role="dialog" aria-modal="true" aria-label="Le manifeste PULSE">
      <Image src="/hero-bowl.png" alt="" fill priority sizes="100vw" />
      <div className="film-shade" />
      <button className="film-close" onClick={() => setOpen(false)} aria-label="Fermer"><X /></button>
      <div className="film-copy">
        <span>PULSE FOOD — MANIFESTE 01</span>
        <p>On n’a pas retiré<br />la viande.</p>
        <p>On a remis<br /><em>l’envie.</em></p>
        <small>DU VÉGÉTAL. DU GOÛT. DE L’ÉNERGIE.</small>
        <button onClick={() => { setOpen(false); setTimeout(() => document.querySelector("#recettes")?.scrollIntoView(), 50); }}>Passer en cuisine <ArrowDown /></button>
      </div>
    </div>}
  </>;
}
