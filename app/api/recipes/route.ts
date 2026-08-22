import { NextResponse } from "next/server";
import { z } from "zod";
import { getPublishedRecipes } from "@/lib/recipe-repository";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { recipeInputSchema } from "@/lib/recipe-schema";
import { slugify } from "@/lib/slug";
import { sameOrigin } from "@/lib/request-security";
import { parseIngredient } from "@/lib/ingredient";
export async function GET(){const data=await getPublishedRecipes();return NextResponse.json({data,total:data.length},{headers:{"Cache-Control":"public, max-age=60, stale-while-revalidate=300"}})}
export async function POST(req:Request){if(!sameOrigin(req))return NextResponse.json({error:"Origine refusée"},{status:403});if(!await getSession())return NextResponse.json({error:"Non autorisé"},{status:401});try{const data=recipeInputSchema.parse(await req.json());let slug=slugify(data.title);if(await db.recipe.findUnique({where:{slug}}))slug=`${slug}-${Date.now().toString().slice(-5)}`;const recipe=await db.recipe.create({data:{...data,slug,publishedAt:data.status==="PUBLISHED"?new Date():null,ingredients:{create:data.ingredients.map((label,position)=>({...parseIngredient(label),position}))},steps:{create:data.steps.map((body,position)=>({body,position}))}}});return NextResponse.json({data:recipe,message:"Recette créée"},{status:201})}catch(error){return NextResponse.json({error:"Données invalides",details:error instanceof z.ZodError?error.flatten():undefined},{status:400})}}
