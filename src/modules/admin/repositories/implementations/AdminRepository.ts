import { Prisma } from "@prisma/client";
import { Admin } from "../../domains/Admin";
import { AdminMap } from "../../mappings/AdminMap";
import { IAdminRepo } from "../IAdminRepo";

export class AdminRepository implements IAdminRepo {
  private adminPrisma: Prisma.AdminDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  constructor(
    adminPrisma: Prisma.AdminDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  ) {
    this.adminPrisma = adminPrisma;
  }

  async getById(id: string): Promise<Admin | null> {
    const admin = await this.adminPrisma.findUnique({ where: { id } });
    if (!admin) return null;
    return AdminMap.toDomain(admin);
  }

  async save(admin: Admin): Promise<void> {
    const isExists = await this.exists(admin);
    const adminPersistence = AdminMap.toPersistence(admin);

    if (isExists) {
      // Run update command.
    } else {
      await this.adminPrisma.create({
        data: {
          ...adminPersistence,
        },
      });
    }
  }

  async exists(admin: Admin): Promise<boolean> {
    const found = await this.adminPrisma.findUnique({
      where: { id: admin.id },
    });

    return Boolean(found);
  }
}
