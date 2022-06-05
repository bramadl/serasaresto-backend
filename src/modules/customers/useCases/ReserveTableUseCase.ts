import { Request, Response } from "express";
import { BaseController } from "../../../shared/core/BaseController";
import { Result } from "../../../shared/logic/Result";
import { CustomerName } from "../domains/valueObjects/CustomerName";
import { TableToken } from "../domains/valueObjects/TableToken";
import { ReservedTableDTO } from "../dtos/ReservedTableDTO";
import { ICustomerRepo } from "../repositories/ICustomerRepo";
import { ITableRepo } from "../repositories/ITableRepo";

export class ReserveTableUseCase extends BaseController {
  private customerRepo: ICustomerRepo;
  private tableRepo: ITableRepo;

  constructor(tableRepo: ITableRepo, customerRepo: ICustomerRepo) {
    super();
    this.tableRepo = tableRepo;
    this.customerRepo = customerRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Get the customer name and table token from the request.
      const {
        customer_name: customerNameRequest,
        table_token: tableTokenRequest,
      } = req.body;

      // 2. Validate each property.
      const createCustomerName = CustomerName.create(customerNameRequest);
      const createTableToken = TableToken.create({ value: tableTokenRequest });
      const propsResult = Result.combine([
        createCustomerName,
        createTableToken,
      ]);
      if (propsResult.isFailure) return this.badRequest(res, propsResult.error);
      const customerName = createCustomerName.getValue();
      const tableToken = createTableToken.getValue();

      // 3. Find the table based on the table token value.
      const foundTable = await this.tableRepo.findByTableToken(tableToken);
      if (foundTable.isFailure) return this.notFound(res, foundTable.error);
      const table = foundTable.getValue();

      // 4. Checks if the table under reservation.
      if (table.isReserved()) {
        return this.conflict(res, "This table is under reservation.");
      }

      // 5. Make the user, reserve this table.
      await this.customerRepo.reserveTableFor(customerName, table.token);
      await this.tableRepo.updateTableReservationStatus(table.token);

      // 6. Map toDTO for the reserved table.
      const reservedTable: ReservedTableDTO = {
        customerName: customerName.value,
        tableNumber: table.number.value,
        tableToken: table.token.value,
      };

      // FINAL. Return the reserved table information.
      return this.ok(res, reservedTable);
    } catch (err) {
      console.log("[ReserveTableUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
