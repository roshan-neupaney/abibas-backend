/*
  Warnings:

  - A unique constraint covering the columns `[slug_url]` on the table `Shoe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shoe_slug_url_key" ON "Shoe"("slug_url");
