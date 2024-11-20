-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_shoe_id_fkey";

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_shoe_id_fkey" FOREIGN KEY ("shoe_id") REFERENCES "Shoe"("slug_url") ON DELETE RESTRICT ON UPDATE CASCADE;
