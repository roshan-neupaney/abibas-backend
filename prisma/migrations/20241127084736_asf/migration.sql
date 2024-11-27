/*
  Warnings:

  - You are about to drop the column `amount` on the `OrderItems` table. All the data in the column will be lost.
  - Added the required column `price` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItems" DROP COLUMN "amount",
ADD COLUMN     "price" TEXT NOT NULL;
