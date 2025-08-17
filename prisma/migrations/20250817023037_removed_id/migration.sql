/*
  Warnings:

  - You are about to drop the column `userId` on the `Stock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Stock" DROP CONSTRAINT "Stock_userId_fkey";

-- DropIndex
DROP INDEX "public"."Stock_userId_ticker_key";

-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "userId";
