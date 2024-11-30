-- CreateTable
CREATE TABLE "ColorVariationImages" (
    "id" TEXT NOT NULL,
    "images" TEXT[],
    "color_variation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorVariationImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ColorVariationImages" ADD CONSTRAINT "ColorVariationImages_color_variation_id_fkey" FOREIGN KEY ("color_variation_id") REFERENCES "ColorVariation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
