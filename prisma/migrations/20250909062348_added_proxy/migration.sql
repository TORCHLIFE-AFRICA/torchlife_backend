/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "USER_ROLES" ADD VALUE 'PROXY';

-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "proxyAddress" TEXT,
ADD COLUMN     "proxyEmail" TEXT,
ADD COLUMN     "proxyName" TEXT,
ADD COLUMN     "proxyNote" TEXT,
ADD COLUMN     "proxyPhone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");
