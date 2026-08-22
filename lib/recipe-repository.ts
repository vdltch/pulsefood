import { db } from "./db";
import { recipes as demoRecipes, type Recipe } from "./recipes";
import { parseIngredient } from "./ingredient";

const recipeInclude = {
  ingredients: { orderBy: { position: "asc" as const } },
  steps: { orderBy: { position: "asc" as const } },
};

export async function getPublishedRecipes(): Promise<Recipe[]> {
  try {
    const rows = await db.recipe.findMany({
      where: { status: "PUBLISHED", OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
      include: recipeInclude,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return rows.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((item) => item.label),
      structuredIngredients: recipe.ingredients.map((item) => item.quantity==null ? parseIngredient(item.label) : ({ label:item.label, quantity:item.quantity, unit:item.unit, name:item.name })),
      steps: recipe.steps.map((step) => step.body),
    }));
  } catch {
    if (process.env.NODE_ENV !== "production") console.warn("PostgreSQL indisponible, utilisation des données de démonstration.");
    return demoRecipes.map(recipe=>({...recipe,structuredIngredients:recipe.ingredients.map(parseIngredient)}));
  }
}

export async function getPublishedRecipe(slug: string): Promise<Recipe | undefined> {
  try {
    const recipe = await db.recipe.findFirst({
      where: { slug, status: "PUBLISHED", OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] },
      include: recipeInclude,
    });
    return recipe ? {
      ...recipe,
      ingredients: recipe.ingredients.map((item) => item.label),
      structuredIngredients: recipe.ingredients.map((item) => item.quantity==null ? parseIngredient(item.label) : ({ label:item.label, quantity:item.quantity, unit:item.unit, name:item.name })),
      steps: recipe.steps.map((step) => step.body),
    } : undefined;
  } catch {
    const recipe=demoRecipes.find((recipe) => recipe.slug === slug);
    return recipe ? {...recipe,structuredIngredients:recipe.ingredients.map(parseIngredient)} : undefined;
  }
}

export async function getSimilarRecipes(recipe: Recipe, limit=3): Promise<Recipe[]> {
  const all=await getPublishedRecipes();
  return all.filter(item=>item.id!==recipe.id).map(item=>({item,score:(item.category===recipe.category?4:0)+(item.dietary||[]).filter(x=>recipe.dietary?.includes(x)).length*2+(item.tags||[]).filter(x=>recipe.tags?.includes(x)).length})).sort((a,b)=>b.score-a.score).slice(0,limit).map(x=>x.item);
}
