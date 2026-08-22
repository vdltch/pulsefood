import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Clock3, Flame, Instagram, Leaf, Menu, Play, Sparkles, Zap } from "lucide-react";
import { Logo } from "@/components/icons";
import { RecipeExplorer } from "@/components/home-client";
import { getPublishedRecipes } from "@/lib/recipe-repository";

export const dynamic="force-dynamic";
export default async function Home() { const recipes=await getPublishedRecipes(); return <main>
  <header><Link href="/"><Logo/></Link><nav><a href="#recettes">Recettes</a><a href="#programme">Collections</a><a href="#manifeste">Notre manifeste</a></nav><div className="nav-actions"><button className="menu"><Menu/></button></div></header>
  <section className="hero">
    <div className="hero-image"><Image src="/hero-bowl.png" alt="Bowl végétarien protéiné" fill priority sizes="100vw"/><div className="hero-stats"><span><Zap size={17}/>34g protéines</span><span><Clock3 size={17}/>25 min</span></div></div>
    <div className="hero-copy"><div className="edition">ÉDITION 01 — BIEN MANGER, POUR DE VRAI</div><h1>Veggie.<br/>Protéiné.<br/><em>Vivant.</em></h1><p>La cuisine végétarienne qui cale, nourrit et donne envie de recommencer. Sans poudre magique. Sans ennui.</p><div className="hero-actions"><a href="#recettes" className="primary">Explorer les recettes <ArrowDown size={18}/></a><button className="play"><span><Play size={15} fill="currentColor"/></span> Voir le film</button></div></div>
    <div className="side-note"><Leaf size={17}/><span>100% VÉGÉ</span><i></i><span>100% GOURMAND</span></div>
  </section>
  <div className="ticker"><div>PLUS DE GOÛT <Sparkles/> PLUS DE PROTÉINES <Sparkles/> MOINS DE ROUTINE <Sparkles/> PLUS DE GOÛT <Sparkles/> PLUS DE PROTÉINES</div></div>
  <RecipeExplorer recipes={recipes}/>
  <section className="feature" id="programme"><div className="feature-copy"><span className="eyebrow light">LE PLAN QUI CHANGE TOUT</span><h2>5 jours.<br/>Zéro charge<br/><em>mentale.</em></h2><p>Ta semaine complète, pensée pour réutiliser les ingrédients sans jamais manger deux fois la même chose.</p><Link href="/programme">Découvrir le meal plan <ArrowRight/></Link><div className="mini-metrics"><span><b>125g</b>prot. / jour</span><span><b>15 min</b>en moyenne</span><span><b>0</b>gaspillage</span></div></div><div className="feature-board"><div className="day"><small>LUN. 24</small><b>Green shakshuka</b><span>31g protéines</span></div><div className="day active"><small>MAR. 25</small><b>Tofu sesame crunch</b><span>34g protéines</span></div><div className="day"><small>MER. 26</small><b>Gnocchis nuage</b><span>29g protéines</span></div><div className="circle"><Flame/>5<br/><small>jours</small></div></div></section>
  <section className="manifesto" id="manifeste"><span>NOUS, ON CROIT QUE</span><h2>Le végétal n'est pas<br/>un accompagnement.<br/><em>C'est le plat principal.</em></h2><p>Une cuisine généreuse, colorée et construite autour de vrais ingrédients. Pensée pour ton énergie, pas pour compter les feuilles de salade.</p><div className="values"><div><b>01</b><h3>Du vrai</h3><p>Des ingrédients simples, trouvables et reconnaissables.</p></div><div><b>02</b><h3>Du goût</h3><p>Chaque recette passe le test du “j'en reprends”.</p></div><div><b>03</b><h3>Du muscle</h3><p>Une info nutrition claire, sans obsession ni blabla.</p></div></div></section>
  <footer><div><Logo/><p>La nouvelle énergie<br/>dans ton assiette.</p></div><div className="footer-links"><a href="#recettes">Recettes</a><a href="#programme">Collections</a><a href="#manifeste">Manifeste</a><a href="#">Newsletter</a></div><div className="newsletter"><span>UNE BONNE RECETTE, CHAQUE DIMANCHE.</span><form><input placeholder="ton@email.fr"/><button aria-label="S'inscrire"><ArrowRight/></button></form></div><div className="footer-bottom"><span>© 2026 PULSE FOOD STUDIO</span><span>FAIT AVEC DU GOÛT À PARIS</span><Instagram size={18}/></div></footer>
</main> }
