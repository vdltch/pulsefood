"use server";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearSession, requireAdmin } from "@/lib/auth";
import { recipeInputSchema } from "@/lib/recipe-schema";
import { slugify } from "@/lib/slug";
import { studioPath } from "@/lib/studio-path";
import { parseIngredient } from "@/lib/ingredient";

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
}

async function imageFrom(formData: FormData, current = "") {
  const file = formData.get("imageFile");
  if (!(file instanceof File) || file.size === 0) return String(formData.get("image") || formData.get("mediaChoice") || current);
  if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) throw new Error("Image invalide (8 Mo maximum).");
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const name = `${Date.now()}-${crypto.randomUUID()}.webp`;
  const output = path.join(directory, name); const buffer = Buffer.from(await file.arrayBuffer());
  const info = await sharp(buffer).rotate().resize(1800, 1200, { fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toFile(output);
  const url = `/uploads/${name}`;
  await db.mediaAsset.create({ data: { filename: file.name, url, mimeType: "image/webp", size: info.size, width: info.width, height: info.height } });
  return url;
}

async function parse(formData: FormData, currentImage = "") {
  return recipeInputSchema.parse({
    title: formData.get("title"), description: formData.get("description"), image: await imageFrom(formData, currentImage),
    prepMinutes: formData.get("prepMinutes"), protein: formData.get("protein"), calories: formData.get("calories"), carbohydrates:formData.get("carbohydrates"),fat:formData.get("fat"),fiber:formData.get("fiber"),sugar:formData.get("sugar"),sodium:formData.get("sodium"), servings: formData.get("servings"),
    difficulty: formData.get("difficulty"), category: formData.get("category"), dietary: lines(formData.get("dietary")), tags: lines(formData.get("tags")), collections:lines(formData.get("collections")), ingredients: lines(formData.get("ingredients")),
    steps: lines(formData.get("steps")), featured: formData.get("featured") === "on", status: formData.get("status"), scheduledFor: formData.get("scheduledFor") ? new Date(String(formData.get("scheduledFor"))) : null,
  });
}

export async function createRecipe(formData: FormData) {
  await requireAdmin(); const data = await parse(formData); let slug = slugify(data.title);
  if (await db.recipe.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString().slice(-5)}`;
  await db.recipe.create({ data: { ...data, slug, publishedAt: data.status === "PUBLISHED" ? (data.scheduledFor ?? new Date()) : null, ingredients: { create: data.ingredients.map((label, position) => ({ ...parseIngredient(label), position })) }, steps: { create: data.steps.map((body, position) => ({ body, position })) } } });
  revalidatePath("/"); redirect(`${studioPath()}?created=1`);
}

export async function updateRecipe(id: string, formData: FormData) {
  await requireAdmin(); const current = await db.recipe.findUniqueOrThrow({ where: { id } }); const data = await parse(formData, current.image);
  await db.$transaction([db.ingredient.deleteMany({ where: { recipeId: id } }), db.recipeStep.deleteMany({ where: { recipeId: id } }), db.recipe.update({ where: { id }, data: { ...data, publishedAt: data.status === "PUBLISHED" ? (data.scheduledFor ?? current.publishedAt ?? new Date()) : null, ingredients: { create: data.ingredients.map((label, position) => ({ ...parseIngredient(label), position })) }, steps: { create: data.steps.map((body, position) => ({ body, position })) } } })]);
  revalidatePath("/"); revalidatePath(`/recettes/${current.slug}`); redirect(`${studioPath()}?updated=1`);
}

export async function deleteRecipe(id: string) { await requireAdmin(); await db.recipe.delete({ where: { id } }); revalidatePath("/"); redirect(`${studioPath()}?deleted=1`); }
export async function duplicateRecipe(id: string) { await requireAdmin(); const source=await db.recipe.findUniqueOrThrow({where:{id},include:{ingredients:true,steps:true}});const slug=`${source.slug}-copie-${Date.now().toString().slice(-5)}`;await db.recipe.create({data:{slug,title:`${source.title} — copie`,description:source.description,image:source.image,prepMinutes:source.prepMinutes,protein:source.protein,calories:source.calories,carbohydrates:source.carbohydrates,fat:source.fat,fiber:source.fiber,sugar:source.sugar,sodium:source.sodium,servings:source.servings,difficulty:source.difficulty,category:source.category,dietary:source.dietary,tags:source.tags,collections:source.collections,featured:false,status:"DRAFT",ingredients:{create:source.ingredients.map(x=>({label:x.label,quantity:x.quantity,unit:x.unit,name:x.name,position:x.position}))},steps:{create:source.steps.map(x=>({body:x.body,position:x.position}))}}});redirect(`${studioPath()}?duplicated=1`);}
export async function createTaxonomy(kind:"category"|"tag",formData:FormData){await requireAdmin();const name=String(formData.get("name")??"").trim();if(name.length<2)return;if(kind==="category")await db.recipeCategory.upsert({where:{name},create:{name},update:{}});else await db.recipeTag.upsert({where:{name},create:{name},update:{}});revalidatePath(studioPath("/reglages"));}
export async function deleteTaxonomy(kind:"category"|"tag",id:string){await requireAdmin();if(kind==="category")await db.recipeCategory.delete({where:{id}});else await db.recipeTag.delete({where:{id}});revalidatePath(studioPath("/reglages"));}
export async function deleteMedia(id:string){await requireAdmin();const media=await db.mediaAsset.delete({where:{id}});try{await unlink(path.join(process.cwd(),"public",media.url))}catch{}revalidatePath(studioPath("/medias"));}
export async function uploadMedia(formData:FormData){await requireAdmin();await imageFrom(formData);revalidatePath(studioPath("/medias"));}
export async function importRecipes(formData:FormData){await requireAdmin();const file=formData.get("file");if(!(file instanceof File)||!file.size)return;const text=await file.text();let rows:unknown[];if(file.name.endsWith(".json")){const parsed=JSON.parse(text);rows=Array.isArray(parsed)?parsed:(parsed as {recipes?:unknown[]}).recipes??[];}else{const [header,...linesCsv]=text.split(/\r?\n/).filter(Boolean);const keys=header.split(",").map(x=>x.replace(/^"|"$/g,""));rows=linesCsv.map(line=>{const cells=line.match(/("(?:[^"]|"")*"|[^,]*)/g)?.filter((_,i)=>i%2===0).map(x=>x.replace(/^"|"$/g,"").replace(/""/g,'"'))??[];return Object.fromEntries(keys.map((key,i)=>[key,["ingredients","steps","dietary","tags"].includes(key)?(cells[i]||"").split("|").filter(Boolean):cells[i]]));});}for(const raw of rows){const record=raw as Record<string,unknown>;const candidate=recipeInputSchema.safeParse({...record,image:String(record.image||"/hero-bowl.png"),status:"DRAFT",featured:false,scheduledFor:null});if(!candidate.success)continue;const data=candidate.data;let slug=slugify(data.title);if(await db.recipe.findUnique({where:{slug}}))slug=`${slug}-${Date.now().toString().slice(-5)}`;await db.recipe.create({data:{...data,slug,publishedAt:null,ingredients:{create:data.ingredients.map((label,position)=>({label,position}))},steps:{create:data.steps.map((body,position)=>({body,position}))}}});}revalidatePath(studioPath());redirect(`${studioPath()}?imported=1`);}
export async function logoutAction() { await clearSession(); redirect(studioPath("/login")); }
