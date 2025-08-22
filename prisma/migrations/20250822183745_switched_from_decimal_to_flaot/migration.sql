/*
  Warnings:

  - You are about to alter the column `funds` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "funds" SET DATA TYPE DOUBLE PRECISION;
