import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { Result } from "../../../shared/logic/Result";
import { Admin } from "../domains/Admin";
import { AdminEmail } from "../domains/valueObjects/AdminEmail";
import { AdminName } from "../domains/valueObjects/AdminName";
import { AdminPassword } from "../domains/valueObjects/AdminPassword";
import { IAdminRepo } from "../repositories/IAdminRepo";

export class CreateAdminUseCase extends BaseController {
  constructor(private adminRepo: IAdminRepo) {
    super();
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const { name, email } = req.body;

      const createName = AdminName.create(name);
      const createEmail = AdminEmail.create(email);
      const propsResult = Result.combine([createName, createEmail]);
      if (propsResult.isFailure) return this.badRequest(res, propsResult.error);

      const createPassword = AdminPassword.create({
        isHashed: false,
        value: "kasir", // #HARD CODED KASIR
      });

      const createAdmin = Admin.create({
        name: createName.getValue(),
        email: createEmail.getValue(),
        password: createPassword.getValue(),
        role: "kasir",
      });
      if (createAdmin.isFailure) {
        return this.badRequest(res, createAdmin.error);
      }

      const admin = createAdmin.getValue();
      await this.adminRepo.createAdmin(admin);

      this.created(res);
    } catch (error) {
      console.log("[CreateAdminUseCaseError]", error);
      this.internalServerError(res, (error as Error).message);
    }
  }
}
