import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const inputSchema=z.object({idea:z.string().trim().min(5).max(1200)});
const generatedSchema=z.object({title:z.string(),description:z.string(),prepMinutes:z.number(),protein:z.number(),calories:z.number(),servings:z.number(),difficulty:z.string(),category:z.string(),dietary:z.array(z.string()),tags:z.array(z.string()),ingredients:z.array(z.string()),steps:z.array(z.string())});
const schema={type:"object",additionalProperties:false,properties:{title:{type:"string"},description:{type:"string"},prepMinutes:{type:"integer"},protein:{type:"integer"},calories:{type:"integer"},servings:{type:"integer"},difficulty:{type:"string",enum:["Facile","Rapide","Intermédiaire","Weekend"]},category:{type:"string"},dietary:{type:"array",items:{type:"string"}},tags:{type:"array",items:{type:"string"}},ingredients:{type:"array",items:{type:"string"}},steps:{type:"array",items:{type:"string"}}},required:["title","description","prepMinutes","protein","calories","servings","difficulty","category","dietary","tags","ingredients","steps"]};

export async function POST(request:Request){
  if(!await getSession())return NextResponse.json({error:"Non autorisé"},{status:401});
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:"La clé OpenAI n’est pas encore configurée sur le serveur."},{status:503});
  try{
    const {idea}=inputSchema.parse(await request.json());
    const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{authorization:`Bearer ${process.env.OPENAI_API_KEY}`,"content-type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5.4-mini",store:false,instructions:"Tu es le chef éditorial de PULSE Food, média français de recettes végétariennes gourmandes et riches en protéines. Produis une recette réaliste, testable, avec des quantités précises dans chaque ingrédient. Les protéines et calories sont par portion. Le ton est vif, contemporain et appétissant. N’invente jamais de bénéfice médical.",input:idea,text:{format:{type:"json_schema",name:"pulse_recipe",strict:true,schema}}})});
    const result=await response.json() as {output_text?:string;error?:{message?:string};output?:Array<{content?:Array<{type?:string;text?:string}>}>};
    if(!response.ok)throw new Error(result.error?.message||"OpenAI indisponible");
    const text=result.output_text||result.output?.flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text;
    if(!text)throw new Error("Réponse IA vide");
    return NextResponse.json({data:generatedSchema.parse(JSON.parse(text))});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Génération impossible"},{status:400});}
}
