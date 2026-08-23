"use client";
import Link from "next/link";
import {signIn} from "next-auth/react";
import {useActionState} from "react";
import type {AuthState} from "@/app/(member)/actions";

export function MemberAuthForm({mode,action,googleEnabled,facebookEnabled}:{mode:"login"|"register";action:(state:AuthState,data:FormData)=>Promise<AuthState>;googleEnabled:boolean;facebookEnabled:boolean}){
  const [state,formAction,pending]=useActionState(action,null),register=mode==="register";
  return <div className="member-auth-card"><form action={formAction} className="member-auth-form">{register&&<label>Prénom<input name="name" autoComplete="name" required minLength={2}/></label>}<label>Email<input name="email" type="email" autoComplete="email" required/></label><label>Mot de passe<input name="password" type="password" autoComplete={register?"new-password":"current-password"} required minLength={register?10:8}/></label>{register&&<small>10 caractères minimum, avec une majuscule et un chiffre.</small>}{state?.error&&<p role="alert">{state.error}</p>}<button disabled={pending}>{pending?"Patiente…":register?"Créer mon compte":"Se connecter"}</button></form>{(googleEnabled||facebookEnabled)&&<div className="oauth-separator"><span>ou</span></div>}{googleEnabled&&<button type="button" className="oauth-button" onClick={()=>signIn("google",{redirectTo:"/compte"})}>Continuer avec Google</button>}{facebookEnabled&&<button type="button" className="oauth-button" onClick={()=>signIn("facebook",{redirectTo:"/compte"})}>Continuer avec Facebook</button>}<p>{register?"Déjà membre ?":"Pas encore de compte ?"} <Link href={register?"/connexion":"/inscription"}>{register?"Se connecter":"S’inscrire"}</Link></p></div>
}
