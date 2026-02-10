/*
  Warnings:

  - Made the column `provider` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "provider" SET NOT NULL;
