import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { OrderMap } from "../../mappings/OrderMap";
import { IOrderRepo } from "../../repositories/IOrderRepo";

export class ViewOrderUseCase extends BaseController {
  private orderRepo: IOrderRepo;

  constructor(orderRepo: IOrderRepo) {
    super();
    this.orderRepo = orderRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Take requests.
      const { id: orderIdRequest } = req.params;

      // 2. Get order from repo.
      const orderRepo = await this.orderRepo.getById(orderIdRequest);
      if (orderRepo.isFailure) return this.badRequest(res, orderRepo.error);
      const order = orderRepo.getValue();
      const orderDTO = OrderMap.toDTO(order);

      this.ok(res, orderDTO);
    } catch (err) {
      console.log("[ViewOrderUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
