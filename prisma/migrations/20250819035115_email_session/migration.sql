-- AlterTable
ALTER TABLE "public"."Stock" ADD COLUMN     "userEmail" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Stock" ADD CONSTRAINT "Stock_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
