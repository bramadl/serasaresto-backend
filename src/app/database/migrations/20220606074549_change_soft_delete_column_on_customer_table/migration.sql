/*
  Warnings:

  - You are about to drop the column `has_logged_out` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customers` DROP COLUMN `has_logged_out`,
    ADD COLUMN `logged_out_at` DATETIME(3) NULL;
