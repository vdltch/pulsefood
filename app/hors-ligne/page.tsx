import Link from "next/link";import {WifiOff} from "lucide-react";
export default function OfflinePage(){return <main className="offline-page"><WifiOff/><span>MODE HORS LIGNE</span><h1>Pas de réseau,<br/>mais toujours de quoi cuisiner.</h1><p>Retrouve les recettes que tu as sauvegardées sur cet appareil.</p><Link href="/favoris">Voir mes recettes sauvegardées</Link></main>}
