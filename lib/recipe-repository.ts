import { db } from "./db";
import { recipes as demoRecipes, type Recipe } from "./recipes";

const recipeInclude = {
  ingredients: { orderBy: { position: "asc" as const } },
  steps: { orderBy: { position: "asc" as const } },
};

export async function getPublishedRecipes(): Promise<Recipe[]> {
  try {
    const rows = await db.recipe.findMany({
      where: { status: "PUBLISHED" },
      include: recipeInclude,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return rows.map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((item) => item.label),
      steps: recipe.steps.map((step) => step.body),
    }));
  } catch {
    if (process.env.NODE_ENV !== "production") console.warn("PostgreSQL indisponible, utilisation des données de démonstration.");
    return demoRecipes;
  }
}

export async function getPublishedRecipe(slug: string): Promise<Recipe | undefined> {
  try {
    const recipe = await db.recipe.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: recipeInclude,
    });
    return recipe ? {
      ...recipe,
      ingredients: recipe.ingredients.map((item) => item.label),
      steps: recipe.steps.map((step) => step.body),
    } : undefined;
  } catch {
    return demoRecipes.find((recipe) => recipe.slug === slug);
  }
}
