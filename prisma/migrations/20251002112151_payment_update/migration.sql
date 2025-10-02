/*
  Warnings:

  - You are about to drop the column `to` on the `WithdrawalRequest` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `wallets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[campaign_id]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_donation_id_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_user_id_fkey";

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "payment_id" UUID;

-- AlterTable
ALTER TABLE "WithdrawalRequest" DROP COLUMN "to",
ADD COLUMN     "payment_id" UUID;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "donation_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at",
ADD COLUMN     "campaign_id" UUID,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "wallets_campaign_id_key" ON "wallets"("campaign_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_donation_id_fkey" FOREIGN KEY ("donation_id") REFERENCES "donations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
