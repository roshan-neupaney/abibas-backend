/*
  Warnings:

  - You are about to drop the `ColorVariationImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ColorVariationImages" DROP CONSTRAINT "ColorVariationImages_color_variation_id_fkey";

-- AlterTable
ALTER TABLE "ColorVariation" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "ColorVariationImages";
