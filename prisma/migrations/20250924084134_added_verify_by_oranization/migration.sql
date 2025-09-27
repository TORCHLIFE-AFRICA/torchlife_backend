/*
  Warnings:

  - Made the column `verified_by_id` on table `campaigns` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_verified_by_id_fkey";

-- AlterTable
ALTER TABLE "campaigns" ALTER COLUMN "verified_by_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
