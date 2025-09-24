-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "verified_by_id" UUID,
ALTER COLUMN "amount_raised" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "social_media" TEXT,
    "image" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
