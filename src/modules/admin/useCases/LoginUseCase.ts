import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { IAdminRepo } from "../repositories/IAdminRepo";

export class LoginUseCase extends BaseController {
  private adminRepo: IAdminRepo;

  constructor(adminRepo: IAdminRepo) {
    super();
    this.adminRepo = adminRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      //
    } catch (err) {
      console.log("[LoginUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
