import prisma from "../../../app/database";
import { CartRepository } from "./implementations/CartRepository";
import { MenuRepository } from "./implementations/MenuRepository";

export const menuRepository = new MenuRepository(prisma.menu);
export const cartRepository = new CartRepository(prisma.cart, prisma.cartItem);
