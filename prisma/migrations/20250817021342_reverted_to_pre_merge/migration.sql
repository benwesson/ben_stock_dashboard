/*
  Warnings:

  - You are about to drop the column `user_id` on the `Stock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Stock" DROP CONSTRAINT "Stock_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "user_id";
