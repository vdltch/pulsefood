import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { studioPath } from "./studio-path";
const COOKIE="pulse_session"; const MAX_AGE=60*60*12;
type Session={userId:string;email:string;exp:number};
function secret(){const value=process.env.AUTH_SECRET;if(!value)throw new Error("AUTH_SECRET manquant");return value}
function sign(payload:string){return createHmac("sha256",secret()).update(payload).digest("base64url")}
export function createSessionToken(userId:string,email:string){const payload=Buffer.from(JSON.stringify({userId,email,exp:Date.now()+MAX_AGE*1000} satisfies Session)).toString("base64url");return `${payload}.${sign(payload)}`}
export function readSessionToken(token?:string):Session|null{if(!token)return null;const [payload,sig]=token.split(".");if(!payload||!sig)return null;const expected=Buffer.from(sign(payload));const actual=Buffer.from(sig);if(expected.length!==actual.length||!timingSafeEqual(expected,actual))return null;try{const session=JSON.parse(Buffer.from(payload,"base64url").toString()) as Session;return session.exp>Date.now()?session:null}catch{return null}}
export async function setSession(userId:string,email:string){(await cookies()).set(COOKIE,createSessionToken(userId,email),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:MAX_AGE})}
export async function clearSession(){(await cookies()).set(COOKIE,"",{httpOnly:true,expires:new Date(0),path:"/"})}
export async function getSession(){return readSessionToken((await cookies()).get(COOKIE)?.value)}
export async function requireAdmin(){const session=await getSession();if(!session)redirect(studioPath("/login"));return session}
