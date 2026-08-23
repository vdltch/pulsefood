import Link from "next/link";
import { Logo } from "@/components/icons";

export const metadata = { title: "Confidentialité — PULSE" };

export default function Privacy() {
  return <main className="legal-page"><Link href="/"><Logo /></Link><span className="eyebrow">VIE PRIVÉE</span><h1>Simple,<br /><em>comme nos recettes.</em></h1><section>
    <h2>Données collectées</h2><p>PULSE mesure uniquement des consultations agrégées de pages et de recettes. Aucune adresse IP, aucun identifiant publicitaire et aucune donnée de navigation intersite ne sont enregistrés dans notre outil interne.</p>
    <h2>Newsletter</h2><p>Lorsque vous vous inscrivez à la newsletter, votre adresse e-mail est enregistrée uniquement pour vous envoyer les contenus PULSE. Elle n’est ni vendue ni transmise à des partenaires. Vous pouvez demander sa suppression à tout moment.</p>
    <h2>Compte PULSE</h2><p>Si vous créez un compte, PULSE conserve votre nom, votre adresse e-mail, vos favoris, programmes et listes de courses afin de les synchroniser entre vos appareils. Le mot de passe est uniquement conservé sous forme de condensat cryptographique. Une connexion Google ou Facebook transmet à PULSE les informations de profil autorisées par le fournisseur.</p>
    <h2>Stockage local</h2><p>Les favoris, recettes hors ligne et listes de courses peuvent aussi être conservés sur votre appareil pour fonctionner sans réseau. Après connexion, les données compatibles sont synchronisées avec votre compte.</p>
    <h2>Cookies</h2><p>Le site public ne dépose aucun cookie publicitaire. Des cookies sécurisés strictement nécessaires sont utilisés pour maintenir les sessions du compte membre et du Studio privé.</p>
    <h2>Durée et droits</h2><p>Les statistiques anonymes sont conservées au maximum treize mois. Pour toute question ou demande relative à vos données : <a href="mailto:contact@pulsefood.fr">contact@pulsefood.fr</a>.</p>
  </section><Link className="legal-back" href="/">Retour à l&apos;accueil</Link></main>;
}
