/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "myUsers" ADD COLUMN     "image_name" TEXT;

-- DropTable
DROP TABLE "users";