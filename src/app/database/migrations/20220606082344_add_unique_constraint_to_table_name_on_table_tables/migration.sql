/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `tables` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tables_number_key` ON `tables`(`number`);
