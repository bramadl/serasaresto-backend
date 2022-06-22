-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_menu_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_order_id_fkey`;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
