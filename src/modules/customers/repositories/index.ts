import prisma from "../../../app/database";
import { TableRepository } from "./implementations/TableRepository";

export const tableRepository = new TableRepository(prisma.table);
