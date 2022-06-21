import { Admin as AdminPrisma } from "@prisma/client";
import { Admin } from "../domains/Admin";
import { AdminEmail } from "../domains/valueObjects/AdminEmail";
import { AdminName } from "../domains/valueObjects/AdminName";
import { AdminPassword } from "../domains/valueObjects/AdminPassword";

export class AdminMap {
  public static toDomain(admin: AdminPrisma): Admin {
    const createName = AdminName.create(admin.name);
    const createEmail = AdminEmail.create(admin.email);
    const createPassword = AdminPassword.create({
      value: admin.password,
      isHashed: true,
    });

    const createAdmin = Admin.create(
      {
        email: createEmail.getValue(),
        password: createPassword.getValue(),
        name: createName.getValue(),
        avatar: admin.avatar,
        lastLoggedInAt: admin.lastLoggedInAt,
      },
      admin.id
    );

    return createAdmin.getValue();
  }

  public static toPersistence(admin: Admin): AdminPrisma {
    return {
      id: admin.id,
      name: admin.name.value,
      avatar: admin.avatar,
      email: admin.email.value,
      password: admin.password.value,
      lastLoggedInAt: admin.lastLoggedInAt,
      createdAt: admin.createdAt,
      updatedAt: admin.createdAt,
    };
  }
}
