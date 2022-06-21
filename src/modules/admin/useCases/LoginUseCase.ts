import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { JWT } from "../../../shared/logic/JWT";
import { Result } from "../../../shared/logic/Result";
import { Admin } from "../domains/Admin";
import { AdminEmail } from "../domains/valueObjects/AdminEmail";
import { AdminPassword } from "../domains/valueObjects/AdminPassword";
import { LoginDTO } from "../dtos/LoginDTO";
import { IAdminRepo } from "../repositories/IAdminRepo";

export class LoginUseCase extends BaseController {
  private adminRepo: IAdminRepo;

  constructor(adminRepo: IAdminRepo) {
    super();
    this.adminRepo = adminRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Take requests.
      const { email, password } = req.body;

      // 2. Validate requests.
      const createEmail = AdminEmail.create(email);
      const createPassword = AdminPassword.create({
        value: password,
        isHashed: false,
      });
      const resultProps = Result.combine([createEmail, createPassword]);
      if (resultProps.isFailure) return this.badRequest(res, resultProps.error);

      // 3. Find admin by email.
      const admin = await this.adminRepo.getByEmail(createEmail.getValue());
      if (!admin) return this.notFound(res, "Admin not found.");

      // 4. Compare password
      const passwordMatch = AdminPassword.comparePassword(
        password,
        admin.password
      );
      if (!passwordMatch) {
        return this.forbiddenAccess(res, "Password does not match");
      }

      // 5. Generate access token for admin.
      const token = await JWT.generateAccessToken(admin.id, admin.name.value);

      // 6. Generate Login Response DTO.
      const loginDTO: LoginDTO = {
        token,
        user: {
          id: admin.id,
          avatar: admin.avatar as string,
          email: admin.email.value,
          name: admin.name.value,
          lastLoggedInAt: admin.lastLoggedInAt,
        },
      };

      // 7. Update admin last loggedInAt value.
      const createAdmin = Admin.create(
        {
          name: admin.name,
          email: admin.email,
          password: admin.password,
          avatar: admin.avatar,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
          lastLoggedInAt: new Date(),
        },
        admin.id
      );
      await this.adminRepo.save(createAdmin.getValue());

      // FINAL. Sends response
      return this.ok(res, loginDTO);
    } catch (err) {
      console.log("[LoginUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
