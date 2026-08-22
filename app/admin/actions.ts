"use server";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearSession, requireAdmin } from "@/lib/auth";
import { recipeInputSchema } from "@/lib/recipe-schema";
import { slugify } from "@/lib/slug";

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
}

async function imageFrom(formData: FormData, current = "") {
  const file = formData.get("imageFile");
  if (!(file instanceof File) || file.size === 0) return String(formData.get("image") || current);
  if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) throw new Error("Image invalide (8 Mo maximum).");
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const name = `${Date.now()}-${crypto.randomUUID()}.webp`;
  await sharp(Buffer.from(await file.arrayBuffer())).rotate().resize(1800, 1200, { fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toFile(path.join(directory, name));
  return `/uploads/${name}`;
}

async function parse(formData: FormData, currentImage = "") {
  return recipeInputSchema.parse({
    title: formData.get("title"), description: formData.get("description"), image: await imageFrom(formData, currentImage),
    prepMinutes: formData.get("prepMinutes"), protein: formData.get("protein"), calories: formData.get("calories"),
    difficulty: formData.get("difficulty"), category: formData.get("category"), ingredients: lines(formData.get("ingredients")),
    steps: lines(formData.get("steps")), featured: formData.get("featured") === "on", status: formData.get("status"),
  });
}

export async function createRecipe(formData: FormData) {
  await requireAdmin(); const data = await parse(formData); let slug = slugify(data.title);
  if (await db.recipe.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString().slice(-5)}`;
  await db.recipe.create({ data: { ...data, slug, publishedAt: data.status === "PUBLISHED" ? new Date() : null, ingredients: { create: data.ingredients.map((label, position) => ({ label, position })) }, steps: { create: data.steps.map((body, position) => ({ body, position })) } } });
  revalidatePath("/"); redirect("/admin?created=1");
}

export async function updateRecipe(id: string, formData: FormData) {
  await requireAdmin(); const current = await db.recipe.findUniqueOrThrow({ where: { id } }); const data = await parse(formData, current.image);
  await db.$transaction([db.ingredient.deleteMany({ where: { recipeId: id } }), db.recipeStep.deleteMany({ where: { recipeId: id } }), db.recipe.update({ where: { id }, data: { ...data, publishedAt: data.status === "PUBLISHED" ? (current.publishedAt ?? new Date()) : null, ingredients: { create: data.ingredients.map((label, position) => ({ label, position })) }, steps: { create: data.steps.map((body, position) => ({ body, position })) } } })]);
  revalidatePath("/"); revalidatePath(`/recettes/${current.slug}`); redirect("/admin?updated=1");
}

export async function deleteRecipe(id: string) { await requireAdmin(); await db.recipe.delete({ where: { id } }); revalidatePath("/"); redirect("/admin?deleted=1"); }
export async function logoutAction() { await clearSession(); redirect("/admin/login"); }
