import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { JWT } from "../../../shared/logic/JWT";
import { IAdminRepo } from "../repositories/IAdminRepo";

export class GetProfileUseCase extends BaseController {
  private adminRepo: IAdminRepo;

  constructor(adminRepo: IAdminRepo) {
    super();
    this.adminRepo = adminRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const authorization = req.headers.authorization as string;
      const { token } = JWT.parseTokenFromHeader(authorization);

      return this.ok(res, token);
    } catch (err) {
      console.log("[GetProfileUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
