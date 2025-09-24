/*
  Warnings:

  - You are about to drop the column `record` on the `campaigns` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "record",
ADD COLUMN     "records" TEXT[];
