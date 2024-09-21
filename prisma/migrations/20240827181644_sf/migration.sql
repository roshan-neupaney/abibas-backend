/*
  Warnings:

  - You are about to drop the column `user_id` on the `Order` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_user_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "myUsers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
