-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_shoe_id_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_user_id_fkey";

-- DropIndex
DROP INDEX "Payment_order_id_key";
