-- DropIndex
DROP INDEX "public"."Stock_userEmail_idx";

-- DropIndex
DROP INDEX "public"."Stock_userEmail_key";

-- CreateIndex
CREATE INDEX "Stock_userEmail_ticker_idx" ON "public"."Stock"("userEmail", "ticker");
