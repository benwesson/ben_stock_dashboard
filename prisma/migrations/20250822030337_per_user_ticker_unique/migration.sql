/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,ticker]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userEmail` on table `Stock` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Stock" DROP CONSTRAINT "Stock_userEmail_fkey";

-- DropIndex
DROP INDEX "public"."Stock_ticker_key";

-- AlterTable
ALTER TABLE "public"."Stock" ALTER COLUMN "userEmail" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Stock_userEmail_idx" ON "public"."Stock"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_userEmail_ticker_key" ON "public"."Stock"("userEmail", "ticker");

-- AddForeignKey
ALTER TABLE "public"."Stock" ADD CONSTRAINT "Stock_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
