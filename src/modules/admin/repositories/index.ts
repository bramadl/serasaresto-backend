import prisma from "../../../app/database";
import { AdminRepository } from "./implementations/AdminRepository";

export const adminRepository = new AdminRepository(prisma.admin);
