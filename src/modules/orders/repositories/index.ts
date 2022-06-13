import prisma from "../../../app/database";
import { CartRepository } from "./implementations/CartRepository";
import { MenuRepository } from "./implementations/MenuRepository";
import { OrderRepository } from "./implementations/OrderRepository";

export const cartRepository = new CartRepository(prisma.cart, prisma.cartItem);
export const menuRepository = new MenuRepository(prisma.menu);
export const orderRepository = new OrderRepository(prisma.order);
