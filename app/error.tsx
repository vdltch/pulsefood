"use client";
import Link from "next/link";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="error-page"><span>Oups.</span><h1>La cuisine a eu un raté.</h1><p>La page n’a pas pu être chargée. Tes favoris et ta liste de courses sont conservés.</p><div><button onClick={reset}>Réessayer</button><Link href="/">Retour à l’accueil</Link></div></main>}
