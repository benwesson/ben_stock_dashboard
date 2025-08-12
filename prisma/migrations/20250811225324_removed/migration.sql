/*
  Warnings:

  - You are about to drop the column `price` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `purchaseTime` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Stock" DROP COLUMN "price",
ADD COLUMN     "purchaseTime" TIMESTAMP(3) NOT NULL;
