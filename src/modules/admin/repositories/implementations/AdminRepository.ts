import { Prisma } from "@prisma/client";
import { Admin } from "../../domains/Admin";
import { AdminEmail } from "../../domains/valueObjects/AdminEmail";
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

  async getAll(): Promise<Admin[]> {
    const admins = await this.adminPrisma.findMany({});
    return admins.map((admin) => AdminMap.toDomain(admin));
  }

  async getById(id: string): Promise<Admin | null> {
    const admin = await this.adminPrisma.findUnique({ where: { id } });
    if (!admin) return null;
    return AdminMap.toDomain(admin);
  }

  async getByEmail(email: AdminEmail): Promise<Admin | null> {
    const admin = await this.adminPrisma.findFirst({
      where: { email: email.value },
    });
    if (!admin) return null;
    return AdminMap.toDomain(admin);
  }

  async save(admin: Admin): Promise<void> {
    const isExists = await this.exists(admin);
    const adminPersistence = AdminMap.toPersistence(admin);

    if (isExists) {
      await this.adminPrisma.update({
        where: { id: admin.id },
        data: { ...adminPersistence },
      });
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
