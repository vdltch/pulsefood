import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp,rateLimit,tooManyRequests } from "@/lib/request-security";
const schema=z.object({path:z.string().startsWith("/").max(300),recipeId:z.string().max(100).optional()});
export async function POST(request:Request){const rate=rateLimit(`analytics:${clientIp(request.headers)}`,60,60_000);if(!rate.allowed)return tooManyRequests(rate.retryAfter);try{const data=schema.parse(await request.json());await db.viewEvent.create({data});return new NextResponse(null,{status:204})}catch{return NextResponse.json({error:"Événement invalide"},{status:400})}}
