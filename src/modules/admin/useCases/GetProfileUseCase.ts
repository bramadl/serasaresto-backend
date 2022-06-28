import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { AdminDTO } from "../dtos/LoginDTO";
import { IAdminRepo } from "../repositories/IAdminRepo";

export class GetProfileUseCase extends BaseController {
  private adminRepo: IAdminRepo;

  constructor(adminRepo: IAdminRepo) {
    super();
    this.adminRepo = adminRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const userLocals = req.app.locals.user;

      const user = await this.adminRepo.getById(userLocals.sub);
      if (!user) return this.notFound(res, "Admin not found");

      const userDTO: AdminDTO = {
        id: user.id,
        avatar: user.avatar as string,
        email: user.email.value,
        lastLoggedInAt: user.lastLoggedInAt,
        name: user.name.value,
        role: user.role,
      };

      return this.ok(res, userDTO);
    } catch (err) {
      console.log("[GetProfileUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
