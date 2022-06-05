import prisma from "../../../app/database";
import { CustomerRepository } from "./implementations/CustomerRepository";
import { TableRepository } from "./implementations/TableRepository";

export const tableRepository = new TableRepository(prisma.table);
export const customerRepository = new CustomerRepository(prisma.customer);
