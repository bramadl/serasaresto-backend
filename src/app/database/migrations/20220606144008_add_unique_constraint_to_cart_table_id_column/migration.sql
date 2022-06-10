/*
  Warnings:

  - A unique constraint covering the columns `[table_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `carts_table_id_key` ON `carts`(`table_id`);
