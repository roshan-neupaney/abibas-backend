/*
  Warnings:

  - Added the required column `items_total_price` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "items_total_price" TEXT NOT NULL;
