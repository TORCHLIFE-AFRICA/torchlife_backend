/*
  Warnings:

  - The `currency` column on the `campaigns` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `currency` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CURRENCY" AS ENUM ('NGN', 'USD');

-- CreateEnum
CREATE TYPE "PAYMENT_TYPE" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "WITHDRAWAL_STATUS" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "currency",
ADD COLUMN     "currency" "CURRENCY" NOT NULL DEFAULT 'NGN';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "currency" "CURRENCY" NOT NULL,
ADD COLUMN     "type" "PAYMENT_TYPE" NOT NULL;

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "currency" "CURRENCY" NOT NULL DEFAULT 'NGN';

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "PAYMENT_TYPE" NOT NULL,
    "currency" "CURRENCY" NOT NULL,
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "meta" JSONB,
    "wallet_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "to" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "WITHDRAWAL_STATUS" NOT NULL,
    "reason" TEXT,
    "initiated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_reference_key" ON "WalletTransaction"("reference");

-- CreateIndex
CREATE INDEX "WalletTransaction_wallet_id_idx" ON "WalletTransaction"("wallet_id");

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
