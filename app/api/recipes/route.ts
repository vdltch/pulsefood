import { NextResponse } from "next/server"; import { z } from "zod"; import { recipes } from "@/lib/recipes";
const recipeSchema=z.object({title:z.string().min(3),description:z.string().min(10),protein:z.number().int().positive(),prepMinutes:z.number().int().positive(),category:z.string().min(2)});
export async function GET(){return NextResponse.json({data:recipes,total:recipes.length})}
export async function POST(req:Request){try{const data=recipeSchema.parse(await req.json());return NextResponse.json({data:{id:crypto.randomUUID(),slug:data.title.toLowerCase().replace(/[^a-z0-9]+/g,"-"),...data},message:"Recette créée"},{status:201})}catch(e){return NextResponse.json({error:"Données invalides",details:e instanceof z.ZodError?e.flatten():undefined},{status:400})}}
