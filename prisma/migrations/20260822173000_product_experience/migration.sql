ALTER TABLE "Recipe" ADD COLUMN "servings" INTEGER NOT NULL DEFAULT 2;
ALTER TABLE "Recipe" ADD COLUMN "dietary" TEXT[] DEFAULT ARRAY[]::TEXT[];
CREATE TABLE "ViewEvent" ("id" TEXT NOT NULL,"path" TEXT NOT NULL,"recipeId" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "ViewEvent_pkey" PRIMARY KEY ("id"));
CREATE INDEX "ViewEvent_createdAt_idx" ON "ViewEvent"("createdAt");
CREATE INDEX "ViewEvent_recipeId_createdAt_idx" ON "ViewEvent"("recipeId", "createdAt");
ALTER TABLE "ViewEvent" ADD CONSTRAINT "ViewEvent_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
