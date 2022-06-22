/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `token` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_token_key` ON `customers`(`token`);
