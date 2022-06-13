import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { TableToken } from "../../../customers/domains/valueObjects/TableToken";
import { ICustomerRepo } from "../../../customers/repositories/ICustomerRepo";
import { ITableRepo } from "../../../customers/repositories/ITableRepo";
import { OrderMap } from "../../mappings/OrderMap";
import { IOrderRepo } from "../../repositories/IOrderRepo";

export class GetOrderHistoriesUseCase extends BaseController {
  private customerRepo: ICustomerRepo;
  private orderRepo: IOrderRepo;
  private tableRepo: ITableRepo;

  constructor(
    customerRepo: ICustomerRepo,
    orderRepo: IOrderRepo,
    tableRepo: ITableRepo
  ) {
    super();
    this.customerRepo = customerRepo;
    this.orderRepo = orderRepo;
    this.tableRepo = tableRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Take requests.
      const tableTokenRequest = (req.headers.authorization as string).split(
        " "
      )[1];

      // 2. Find the table and the customer id.
      const createTableToken = TableToken.create({ value: tableTokenRequest });
      if (createTableToken.isFailure) {
        return this.badRequest(res, createTableToken.error);
      }
      const tableToken = createTableToken.getValue();
      const tableRepo = await this.tableRepo.findByTableToken(tableToken);
      if (tableRepo.isFailure) return this.notFound(res, tableRepo.error);
      const table = tableRepo.getValue();
      const customerRepo = await this.customerRepo.findByToken(
        table.token.value
      );
      if (customerRepo.isFailure) return this.notFound(res, customerRepo.error);
      const customer = customerRepo.getValue();

      // 3. Get order from repo.
      const ordersRepo = await this.orderRepo.getAll(table.id, customer.id);
      const orders = ordersRepo.getValue();
      const ordersDTO = orders.map((order) => OrderMap.toDTO(order));

      // FINAL. Sends back response.
      this.ok(res, ordersDTO);
    } catch (err) {
      console.log("[GetOrderHistoriesUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
