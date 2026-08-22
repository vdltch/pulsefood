CREATE TYPE "CommercialOffer" AS ENUM ('PULSE_PLUS', 'PACK', 'BUSINESS', 'PROFESSIONAL', 'CREATOR', 'PREMIUM_NEWSLETTER');
CREATE TABLE "CommercialLead" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "company" TEXT,
  "offer" "CommercialOffer" NOT NULL,
  "message" TEXT,
  "source" TEXT,
  "consent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CommercialLead_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CommercialLead_offer_createdAt_idx" ON "CommercialLead"("offer", "createdAt");
CREATE INDEX "CommercialLead_email_offer_idx" ON "CommercialLead"("email", "offer");
