import "server-only";
import {cookies} from "next/headers";import {redirect} from "next/navigation";import {studioPath} from "./studio-path";import {createSessionToken,readSessionToken,MAX_AGE} from "./session-token";
const COOKIE="pulse_session";export {createSessionToken,readSessionToken};
export async function setSession(userId:string,email:string){(await cookies()).set(COOKIE,createSessionToken(userId,email),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:MAX_AGE})}
export async function clearSession(){(await cookies()).set(COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",expires:new Date(0),path:"/"})}
export async function getSession(){return readSessionToken((await cookies()).get(COOKIE)?.value)}
export async function requireAdmin(){const session=await getSession();if(!session)redirect(studioPath("/login"));return session}
