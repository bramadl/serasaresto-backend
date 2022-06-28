import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { IAdminRepo } from "../repositories/IAdminRepo";

export class DeleteAdminUseCase extends BaseController {
  constructor(private adminRepo: IAdminRepo) {
    super();
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      await this.adminRepo.delete(id);

      this.ok(res, "Deleted");
    } catch (error) {
      console.log("[DeleteAdminUseCaseError]", error);
      this.internalServerError(res, (error as Error).message);
    }
  }
}
