import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";

export class ConfirmOrderUseCase extends BaseController {
  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      this.ok(res);
    } catch (err) {
      console.log("[ConfirmOrderUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
