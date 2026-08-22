ALTER TABLE "Recipe" ADD COLUMN "scheduledFor" TIMESTAMP(3);
ALTER TABLE "Recipe" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "RecipeCategory" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RecipeCategory_name_key" ON "RecipeCategory"("name");

CREATE TABLE "RecipeTag" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RecipeTag_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RecipeTag_name_key" ON "RecipeTag"("name");

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "width" INTEGER,
  "height" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MediaAsset_url_key" ON "MediaAsset"("url");
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");

CREATE TABLE "LoginAttempt" (
  "id" TEXT NOT NULL,
  "keyHash" TEXT NOT NULL,
  "success" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "LoginAttempt_keyHash_createdAt_idx" ON "LoginAttempt"("keyHash", "createdAt");
CREATE INDEX "LoginAttempt_createdAt_idx" ON "LoginAttempt"("createdAt");

INSERT INTO "RecipeCategory" ("id", "name") SELECT 'cat-' || md5("category"), "category" FROM "Recipe" GROUP BY "category" ON CONFLICT DO NOTHING;
INSERT INTO "RecipeTag" ("id", "name") SELECT 'tag-' || md5(tag), tag FROM (SELECT unnest("dietary") AS tag FROM "Recipe") tags ON CONFLICT DO NOTHING;
