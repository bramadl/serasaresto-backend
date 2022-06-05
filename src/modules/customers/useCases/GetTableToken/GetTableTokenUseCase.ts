import { Request, Response } from "express";

import { BaseController } from "../../../../shared/core/BaseController";
import { TableNumber } from "../../domains/valueObjects/TableNumber";
import { TableToken } from "../../domains/valueObjects/TableToken";
import { TableTokenDTO } from "../../dtos/TableTokenDTO";
import { ITableRepo } from "../../repositories/ITableRepo";

export class GetTableTokenUseCase extends BaseController {
  private tableRepo: ITableRepo;

  constructor(tableRepo: ITableRepo) {
    super();
    this.tableRepo = tableRepo;
  }

  async executeImpl(req: Request, res: Response): Promise<any | void> {
    try {
      // 1. Get the table-number from the request.
      const tableNumberQuery = req.query.table_number as string;

      // 2. Validate the table number from query.
      const createTableNumber = TableNumber.create(tableNumberQuery);
      if (createTableNumber.isFailure) {
        return this.badRequest(res, createTableNumber.error);
      }
      const tableNumber = createTableNumber.getValue();

      // 3. Find the table from table repository table by tableNumber.
      const tableFromRepo = await this.tableRepo.findByTableNumber(tableNumber);
      if (tableFromRepo.isFailure) {
        return this.notFound(res, tableFromRepo.error);
      }
      const table = tableFromRepo.getValue();

      // 4. Check if the table is being reserved.
      if (table.isReserved()) {
        return this.conflict(res, "The table is being used.");
      }

      // 5. Regenerate the table's token.
      const generatedToken = TableToken.generateToken(table.number.value);
      const createTableToken = TableToken.create({
        value: generatedToken,
      });
      const tableToken = createTableToken.getValue();

      // 6. Save the new generated token to database.
      await this.tableRepo.updateTableToken(table.id, tableToken);

      // 7. Map toDTO for the taken table so far.
      const token: TableTokenDTO = {
        token: tableToken.value,
      };

      // FINAL. Sends back the token to the customer.
      this.ok<TableTokenDTO>(res, token);
    } catch (err) {
      console.log("[GetTableTokenUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
