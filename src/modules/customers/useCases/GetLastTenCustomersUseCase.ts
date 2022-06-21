import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { CustomerMap } from "../mappings/CustomerMap";
import { ICustomerRepo } from "../repositories/ICustomerRepo";

export class GetLastTenCustomersUseCase extends BaseController {
  private customerRepo: ICustomerRepo;

  constructor(customerRepo: ICustomerRepo) {
    super();
    this.customerRepo = customerRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const customers = await this.customerRepo.getLatestTen();
      const customerDTO = customers.map((customer) =>
        CustomerMap.toDTO(customer)
      );

      return this.ok(res, customerDTO);
    } catch (err) {
      console.log("[GetDashboardStatsUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
