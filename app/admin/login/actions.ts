"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { studioPath } from "@/lib/studio-path";
export async function loginAction(_:unknown,formData:FormData){const email=String(formData.get("email")??"").trim().toLowerCase();const password=String(formData.get("password")??"");const allowed=(process.env.ADMIN_EMAIL||"admin@pulsefood.fr").toLowerCase();if(email!==allowed)return {error:"Email ou mot de passe incorrect."};const user=await db.adminUser.findUnique({where:{email}});if(!user||!verifyPassword(password,user.passwordHash))return {error:"Email ou mot de passe incorrect."};await setSession(user.id,user.email);redirect(studioPath())}
