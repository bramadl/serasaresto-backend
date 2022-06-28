import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { IMenuRepo } from "../../repositories/IMenuRepo";

export class DeleteMenuUseCase extends BaseController {
  constructor(private menuRepo: IMenuRepo) {
    super();
  }

  public async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.menuRepo.delete(id);

      this.ok(res);
    } catch (error) {
      console.log("[DeleteMenuUseCaseError]", error);
      this.internalServerError(res, (error as Error).message);
    }
  }
}
