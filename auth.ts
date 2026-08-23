import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {z} from "zod";
import {db} from "@/lib/db";
import {verifyPassword} from "@/lib/password";

const credentialsSchema=z.object({email:z.string().email().max(254),password:z.string().min(8).max(128)});
const providers=[Credentials({name:"Email",credentials:{email:{label:"Email",type:"email"},password:{label:"Mot de passe",type:"password"}},async authorize(values){const parsed=credentialsSchema.safeParse(values);if(!parsed.success)return null;const user=await db.user.findUnique({where:{email:parsed.data.email.toLowerCase()}});if(!user?.passwordHash||!verifyPassword(parsed.data.password,user.passwordHash))return null;return{id:user.id,email:user.email,name:user.name,image:user.image}}})];
if(process.env.AUTH_GOOGLE_ID&&process.env.AUTH_GOOGLE_SECRET)providers.push(Google({clientId:process.env.AUTH_GOOGLE_ID,clientSecret:process.env.AUTH_GOOGLE_SECRET}) as never);
if(process.env.AUTH_FACEBOOK_ID&&process.env.AUTH_FACEBOOK_SECRET)providers.push(Facebook({clientId:process.env.AUTH_FACEBOOK_ID,clientSecret:process.env.AUTH_FACEBOOK_SECRET}) as never);

export const {handlers,auth,signIn,signOut}=NextAuth({
  adapter:PrismaAdapter(db),
  providers,
  session:{strategy:"jwt",maxAge:30*24*60*60},
  pages:{signIn:"/connexion"},
  trustHost:true,
  callbacks:{jwt({token,user}){if(user?.id)token.sub=user.id;return token},session({session,token}){if(session.user&&token.sub)(session.user as typeof session.user&{id:string}).id=token.sub;return session}},
});
