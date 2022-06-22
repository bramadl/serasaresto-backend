import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { ITableRepo } from "../repositories/ITableRepo";

export class GetAllTableUseCase extends BaseController {
  private tableRepo: ITableRepo;

  constructor(tableRepo: ITableRepo) {
    super();
    this.tableRepo = tableRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const tables = await this.tableRepo.getAll();
      const responseDTO = tables.map((table) => ({
        id: table.id,
        number: table.number,
        token: table.token,
        isReserved: table.isReserved,
        customer: table.customer,
        orders: table.orders,
      }));

      this.ok(res, responseDTO);
    } catch (err) {
      console.log("[GetAllTableUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
