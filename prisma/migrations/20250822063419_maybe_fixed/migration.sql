/*
  Warnings:

  - You are about to alter the column `funds` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - Made the column `funds` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "funds" SET NOT NULL,
ALTER COLUMN "funds" SET DEFAULT 0,
ALTER COLUMN "funds" SET DATA TYPE DECIMAL(65,30);
