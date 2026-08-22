import Link from "next/link";
import { BarChart3, BookOpen, Images, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Logo } from "./icons";
import { logoutAction } from "@/app/admin/actions";
import { studioPath } from "@/lib/studio-path";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const base = studioPath();
  return <div className="admin-shell"><aside className="admin-side"><Link href={base}><Logo /></Link><Link className="active" href={base}><LayoutDashboard size={15} /> Vue d&apos;ensemble</Link><Link href={`${base}/recettes/nouvelle`}><BookOpen size={15} /> Nouvelle recette</Link><Link href={`${base}/medias`}><Images size={15} /> Médiathèque</Link><Link href={`${base}/analyses`}><BarChart3 size={15} /> Analyses</Link><Link href={`${base}/reglages`}><Settings size={15} /> Réglages</Link><form action={logoutAction}><button className="logout"><LogOut size={15} /> Déconnexion</button></form><small>PULSE STUDIO — V2.0</small></aside>{children}</div>;
}
