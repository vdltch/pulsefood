"use client";
import { useActionState } from "react";
import { loginAction } from "./actions";
export function LoginForm(){const [state,action,pending]=useActionState(loginAction,null);return <form action={action} className="login-form"><label>Email<input required name="email" type="email" autoComplete="email" placeholder="admin@pulsefood.fr"/></label><label>Mot de passe<input required name="password" type="password" autoComplete="current-password"/></label>{state?.error&&<p className="form-error">{state.error}</p>}<button disabled={pending}>{pending?"Connexion…":"Entrer dans le studio"}</button></form>}
