"use server";
import {createHash} from "node:crypto";
import {AuthError} from "next-auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";
import {signIn,signOut} from "@/auth";
import {db} from "@/lib/db";
import {hashPassword} from "@/lib/password";

export type AuthState={error?:string}|null;
const registration=z.object({name:z.string().trim().min(2,"Indique ton prénom.").max(80),email:z.string().trim().toLowerCase().email("Adresse email invalide.").max(254),password:z.string().min(10,"Utilise au moins 10 caractères.").max(128).regex(/[A-Z]/,"Ajoute une majuscule.").regex(/[0-9]/,"Ajoute un chiffre.")});
async function requestKey(prefix:string,email:string){const h=await headers(),ip=(h.get("x-forwarded-for")||h.get("x-real-ip")||"unknown").split(",")[0].trim();return createHash("sha256").update(`${prefix}:${ip}:${email}`).digest("hex")}

export async function registerAction(_:AuthState,formData:FormData):Promise<AuthState>{
  const parsed=registration.safeParse({name:formData.get("name"),email:formData.get("email"),password:formData.get("password")});
  if(!parsed.success)return{error:parsed.error.issues[0]?.message||"Informations invalides."};
  const keyHash=await requestKey("register",parsed.data.email),since=new Date(Date.now()-60*60*1000);
  if(await db.loginAttempt.count({where:{keyHash,createdAt:{gte:since}}})>=5)return{error:"Trop de tentatives. Réessaie dans une heure."};
  await db.loginAttempt.create({data:{keyHash,success:false}});
  if(await db.user.findUnique({where:{email:parsed.data.email}}))return{error:"Un compte existe déjà avec cette adresse."};
  await db.user.create({data:{name:parsed.data.name,email:parsed.data.email,passwordHash:hashPassword(parsed.data.password),subscription:{create:{}}}});
  await signIn("credentials",{email:parsed.data.email,password:parsed.data.password,redirectTo:"/compte"});
  return null;
}

export async function loginMemberAction(_:AuthState,formData:FormData):Promise<AuthState>{
  const email=String(formData.get("email")||"").trim().toLowerCase(),password=String(formData.get("password")||"");
  const keyHash=await requestKey("member-login",email),since=new Date(Date.now()-15*60*1000);
  if(await db.loginAttempt.count({where:{keyHash,success:false,createdAt:{gte:since}}})>=8)return{error:"Trop de tentatives. Réessaie dans 15 minutes."};
  try{await signIn("credentials",{email,password,redirectTo:"/compte"})}catch(error){if(error instanceof AuthError){await db.loginAttempt.create({data:{keyHash,success:false}});return{error:"Email ou mot de passe incorrect."}}throw error}
  return null;
}
export async function googleAction(){"use server";await signIn("google",{redirectTo:"/compte"})}
export async function facebookAction(){"use server";await signIn("facebook",{redirectTo:"/compte"})}
export async function logoutMemberAction(){"use server";await signOut({redirectTo:"/"})}
