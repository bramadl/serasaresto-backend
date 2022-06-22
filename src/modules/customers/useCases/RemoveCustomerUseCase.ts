import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { ICustomerRepo } from "../repositories/ICustomerRepo";

export class RemoveCustomerUseCase extends BaseController {
  private customerRepo: ICustomerRepo;

  constructor(customerRepo: ICustomerRepo) {
    super();
    this.customerRepo = customerRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      await this.customerRepo.remove(id);

      return this.ok(res);
    } catch (err) {
      console.log("[GetCustomersUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
