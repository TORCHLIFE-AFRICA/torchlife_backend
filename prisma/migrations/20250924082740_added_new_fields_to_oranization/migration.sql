/*
  Warnings:

  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_verified_by_id_fkey";

-- DropTable
DROP TABLE "Organization";

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
