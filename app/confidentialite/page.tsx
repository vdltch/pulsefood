import Link from "next/link";
import { Logo } from "@/components/icons";

export const metadata = { title: "Confidentialité — PULSE" };

export default function Privacy() {
  return <main className="legal-page"><Link href="/"><Logo /></Link><span className="eyebrow">VIE PRIVÉE</span><h1>Simple,<br /><em>comme nos recettes.</em></h1><section>
    <h2>Données collectées</h2><p>PULSE mesure uniquement des consultations agrégées de pages et de recettes. Aucune adresse IP, aucun identifiant publicitaire et aucune donnée de navigation intersite ne sont enregistrés dans notre outil interne.</p>
    <h2>Newsletter</h2><p>Lorsque vous vous inscrivez à la newsletter, votre adresse e-mail est enregistrée uniquement pour vous envoyer les contenus PULSE. Elle n’est ni vendue ni transmise à des partenaires. Vous pouvez demander sa suppression à tout moment.</p>
    <h2>Stockage local</h2><p>Les favoris, ingrédients cochés et listes de courses sont conservés directement dans le stockage local de votre navigateur. Ils ne sont pas transmis au serveur et peuvent être effacés depuis les réglages de votre navigateur.</p>
    <h2>Cookies</h2><p>Le site public ne dépose aucun cookie de mesure ou de publicité. Un cookie strictement nécessaire et sécurisé est utilisé uniquement lors de la connexion au studio privé.</p>
    <h2>Durée et droits</h2><p>Les statistiques anonymes sont conservées au maximum treize mois. Pour toute question ou demande relative à vos données : <a href="mailto:contact@pulsefood.fr">contact@pulsefood.fr</a>.</p>
  </section><Link className="legal-back" href="/">Retour à l&apos;accueil</Link></main>;
}
