/*
  Warnings:

  - You are about to drop the `order_histories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order_histories` DROP FOREIGN KEY `order_histories_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_histories` DROP FOREIGN KEY `order_histories_table_id_fkey`;

-- DropTable
DROP TABLE `order_histories`;
