import { PrismaClient, RecipeStatus } from "@prisma/client";
import { hashPassword } from "../lib/password";
import { recipes } from "../lib/recipes";
const db=new PrismaClient();
async function main(){const email=process.env.ADMIN_EMAIL??"admin@pulsefood.fr";const password=process.env.ADMIN_PASSWORD??"change-me";await db.adminUser.upsert({where:{email},update:{},create:{email,name:"Chef Pulse",passwordHash:hashPassword(password)}});for(const r of recipes){await db.recipe.upsert({where:{slug:r.slug},update:{servings:r.servings??2,dietary:r.dietary??[]},create:{slug:r.slug,title:r.title,description:r.description,image:r.image,prepMinutes:r.prepMinutes,protein:r.protein,calories:r.calories,servings:r.servings??2,dietary:r.dietary??[],difficulty:r.difficulty,category:r.category,featured:!!r.featured,status:RecipeStatus.PUBLISHED,publishedAt:new Date(),ingredients:{create:r.ingredients.map((label,position)=>({label,position}))},steps:{create:r.steps.map((body,position)=>({body,position}))}}})}}
main().finally(()=>db.$disconnect());
