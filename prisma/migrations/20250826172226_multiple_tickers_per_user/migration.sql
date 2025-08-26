/*
  Warnings:

  - A unique constraint covering the columns `[userEmail]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Stock_userEmail_ticker_key";

-- CreateIndex
CREATE UNIQUE INDEX "Stock_userEmail_key" ON "public"."Stock"("userEmail");
