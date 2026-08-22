import { NextResponse } from "next/server";import { z } from "zod";import { db } from "@/lib/db";
const schema=z.object({path:z.string().startsWith("/").max(300),recipeId:z.string().optional()});
export async function POST(request:Request){try{const data=schema.parse(await request.json());await db.viewEvent.create({data});return new NextResponse(null,{status:204})}catch{return NextResponse.json({error:"Événement invalide"},{status:400})}}
