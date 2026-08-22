"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { studioPath } from "@/lib/studio-path";

const WINDOW_MS=15*60*1000;const MAX_ATTEMPTS=5;
export async function loginAction(_:unknown,formData:FormData){const email=String(formData.get("email")??"").trim().toLowerCase();const password=String(formData.get("password")??"");const requestHeaders=await headers();const ip=(requestHeaders.get("x-forwarded-for")||requestHeaders.get("x-real-ip")||"unknown").split(",")[0].trim();const keyHash=createHash("sha256").update(`${ip}:${email}`).digest("hex");const since=new Date(Date.now()-WINDOW_MS);const failures=await db.loginAttempt.count({where:{keyHash,success:false,createdAt:{gte:since}}});if(failures>=MAX_ATTEMPTS)return {error:"Trop de tentatives. Réessaie dans 15 minutes."};const allowed=(process.env.ADMIN_EMAIL||"admin@pulsefood.fr").toLowerCase();const user=email===allowed?await db.adminUser.findUnique({where:{email}}):null;const valid=!!user&&verifyPassword(password,user.passwordHash);await db.loginAttempt.create({data:{keyHash,success:valid}});if(!valid)return {error:"Email ou mot de passe incorrect."};await db.loginAttempt.deleteMany({where:{keyHash}});await setSession(user.id,user.email);redirect(studioPath())}
