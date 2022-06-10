import prisma from "../../../app/database";
import { CartRepository } from "../../orders/repositories/implementations/CartRepository";
import { CustomerRepository } from "./implementations/CustomerRepository";
import { TableRepository } from "./implementations/TableRepository";

export const cartRepository = new CartRepository(prisma.cart, prisma.cartItem);
export const tableRepository = new TableRepository(prisma.table);
export const customerRepository = new CustomerRepository(prisma.customer);
