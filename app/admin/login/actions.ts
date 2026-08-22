"use server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
export async function loginAction(_:unknown,formData:FormData){const email=String(formData.get("email")??"").trim().toLowerCase();const password=String(formData.get("password")??"");const user=await db.adminUser.findUnique({where:{email}});if(!user||!verifyPassword(password,user.passwordHash))return {error:"Email ou mot de passe incorrect."};await setSession(user.id,user.email);redirect("/admin")}
