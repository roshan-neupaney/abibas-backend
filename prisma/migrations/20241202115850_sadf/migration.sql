/*
  Warnings:

  - You are about to drop the column `images` on the `ColorVariation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ColorVariation" DROP COLUMN "images";

-- CreateTable
CREATE TABLE "ColorVariationImages" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "color_variation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorVariationImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ColorVariationImages" ADD CONSTRAINT "ColorVariationImages_color_variation_id_fkey" FOREIGN KEY ("color_variation_id") REFERENCES "ColorVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
