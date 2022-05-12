/*
  Warnings:

  - You are about to alter the column `phone_number` on the `Seller` table. The data in that column could be lost. The data in that column will be cast from `Char(15)` to `Char(10)`.

*/
-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "phone_number" SET DATA TYPE CHAR(10);
