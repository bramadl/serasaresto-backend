import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { IOrderRepo } from "../../repositories/IOrderRepo";

export class GetAllOrdersUseCase extends BaseController {
  private orderRepo: IOrderRepo;

  constructor(orderRepo: IOrderRepo) {
    super();
    this.orderRepo = orderRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const orders = await this.orderRepo.listAll();
      const ordersDTO = orders.map((order) => ({
        id: order.id,
        total: order.total,
        status: order.status,
        tableNumber: order.table.number.value,
        orderItemsLength: order.orderDetails.length,
        customerName: order.customer.name.value,
      }));

      this.ok(res, ordersDTO);
    } catch (err) {
      console.log("[GetAllOrdersUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
