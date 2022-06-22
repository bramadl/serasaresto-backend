/*
  Warnings:

  - Made the column `token` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `token` on table `tables` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `customers_name_token_key` ON `customers`;

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `table_number` CHAR(3) NULL,
    MODIFY `token` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `tables` MODIFY `token` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_table_number_fkey` FOREIGN KEY (`table_number`) REFERENCES `tables`(`number`) ON DELETE SET NULL ON UPDATE SET NULL;
