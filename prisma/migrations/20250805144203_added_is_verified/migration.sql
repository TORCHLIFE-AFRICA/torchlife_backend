/*
  Warnings:

  - You are about to drop the column `caption` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `amount_raised` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `story` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target_amount` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isverified` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "USER_ROLES" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "DONATION_STATUS" AS ENUM ('PENDING', 'FAILED', 'REJECTED', 'SUCCESS');

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "caption",
ADD COLUMN     "amount_raised" INTEGER NOT NULL,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "story" TEXT NOT NULL,
ADD COLUMN     "target_amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "status" "DONATION_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isverified" BOOLEAN NOT NULL,
ADD COLUMN     "role" "USER_ROLES" DEFAULT 'USER';
