import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { IOrderRepo } from "../../repositories/IOrderRepo";

export class ConfirmOrderUseCase extends BaseController {
  private orderRepo: IOrderRepo;

  constructor(orderRepo: IOrderRepo) {
    super();
    this.orderRepo = orderRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Take request data.
      const { id: orderIdRequest } = req.params;

      // 2. Confirm the order
      await this.orderRepo.confirm(orderIdRequest);

      // FINAL. Sends response back
      this.noContent(res);
    } catch (err) {
      console.log("[ConfirmOrderUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
