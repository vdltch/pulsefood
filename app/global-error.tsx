"use client";
export default function GlobalError({reset}:{error:Error&{digest?:string};reset:()=>void}){return <html lang="fr"><body><main className="error-page"><span>Service indisponible</span><h1>On remet les fourneaux en route.</h1><p>Une erreur inattendue est survenue.</p><button onClick={reset}>Réessayer</button></main></body></html>}
