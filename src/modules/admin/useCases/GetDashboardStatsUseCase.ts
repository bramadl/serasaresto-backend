import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { ICustomerRepo } from "../../customers/repositories/ICustomerRepo";
import { IMenuRepo } from "../../orders/repositories/IMenuRepo";
import { IOrderRepo } from "../../orders/repositories/IOrderRepo";

export class GetDashboardStatsUseCase extends BaseController {
  customerRepo: ICustomerRepo;
  menuRepo: IMenuRepo;
  orderRepo: IOrderRepo;

  constructor(
    customerRepo: ICustomerRepo,
    menuRepo: IMenuRepo,
    orderRepo: IOrderRepo
  ) {
    super();
    this.customerRepo = customerRepo;
    this.menuRepo = menuRepo;
    this.orderRepo = orderRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Get count of customers, menus, and orders.
      const customers = await this.customerRepo.countCustomers();
      const menus = await this.menuRepo.countMenus();
      const orders = await this.orderRepo.countOrders();

      return this.ok(res, {
        customer_count: customers,
        menu_count: menus,
        order_count: orders,
      });
    } catch (err) {
      console.log("[GetDashboardStatsUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
