/*
  Warnings:

  - You are about to drop the column `shoe_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - Added the required column `district` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax_amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shoe_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shoe_id",
DROP COLUMN "totalAmount",
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "municipality" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "shipping_status" "ShippingStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tax_amount" TEXT NOT NULL,
ADD COLUMN     "total_amount" TEXT NOT NULL,
ADD COLUMN     "ward" INTEGER;

-- CreateTable
CREATE TABLE "OrderItems" (
    "id" TEXT NOT NULL,
    "shoe_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color_variation_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_color_variation_id_fkey" FOREIGN KEY ("color_variation_id") REFERENCES "ColorVariation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_shoe_id_fkey" FOREIGN KEY ("shoe_id") REFERENCES "Shoe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
