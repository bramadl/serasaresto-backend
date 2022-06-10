/*
  Warnings:

  - A unique constraint covering the columns `[menu_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `cart_items_menu_id_key` ON `cart_items`(`menu_id`);
