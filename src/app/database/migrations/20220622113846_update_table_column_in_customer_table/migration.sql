/*
  Warnings:

  - You are about to drop the column `token` on the `customers` table. All the data in the column will be lost.
  - Made the column `table_number` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `customers_table_number_fkey`;

-- DropIndex
DROP INDEX `customers_token_key` ON `customers`;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `token`,
    MODIFY `table_number` CHAR(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_table_number_fkey` FOREIGN KEY (`table_number`) REFERENCES `tables`(`number`) ON DELETE CASCADE ON UPDATE CASCADE;
