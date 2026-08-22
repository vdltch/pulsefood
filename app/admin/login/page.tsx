import { redirect } from "next/navigation";
import { Logo } from "@/components/icons";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";
export default async function LoginPage(){if(await getSession())redirect("/admin");return <main className="login-page"><div className="login-card"><Logo/><span className="eyebrow">ESPACE PRIVÉ</span><h1>Bienvenue<br/><em>au studio.</em></h1><p>Connecte-toi pour créer, éditer et publier les recettes PULSE.</p><LoginForm/></div></main>}
