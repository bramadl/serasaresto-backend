import { Request, Response } from "express";

import { BaseController } from "../../../shared/core/BaseController";
import { Guard } from "../../../shared/logic/Guard";
import { TableToken } from "../domains/valueObjects/TableToken";
import { ICustomerRepo } from "../repositories/ICustomerRepo";
import { ITableRepo } from "../repositories/ITableRepo";

export class LogoutApplicationUseCase extends BaseController {
  private tableRepo: ITableRepo;
  private customerRepo: ICustomerRepo;

  constructor(tableRepo: ITableRepo, customerRepo: ICustomerRepo) {
    super();
    this.tableRepo = tableRepo;
    this.customerRepo = customerRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Needs the table's token from the request.
      const { table_token: tableTokenRequest } = req.body;

      // 2. Validate the incoming request token.
      const propsResult = Guard.againstNullOrUndefined({
        argument: tableTokenRequest,
        argumentName: "Table token",
      });
      if (!propsResult.succeeded) {
        return this.badRequest(res, propsResult.message);
      }
      const createTableToken = TableToken.create({ value: tableTokenRequest });
      if (createTableToken.error) {
        return this.badRequest(res, createTableToken.error);
      }

      // 3. Find the table with the given token.
      const tableToken = createTableToken.getValue();
      const foundTable = await this.tableRepo.findByTableToken(tableToken);
      if (foundTable.isFailure) return this.notFound(res, foundTable.error);

      // 4. Match the table from repo within the table payload values.
      const tableFromRepo = foundTable.getValue();
      const tablePayload = tableFromRepo.decryptTableToken(
        tableFromRepo.token.value
      );
      const { value: tableRepoNum } = tableFromRepo.number;
      const { table_number: tablePayloadNum } = JSON.parse(tablePayload);
      if (tableRepoNum !== tablePayloadNum) return this.forbiddenAccess(res);

      // 5. Find the customer that owns this valid token.
      const findCustomer = await this.customerRepo.findByToken(
        tableToken.value
      );
      if (findCustomer.isFailure) return this.notFound(res, findCustomer.error);
      const customer = findCustomer.getValue();

      // 6. Soft delete the user and mark the table as not being reserved.
      /**
       * @note
       * Soft delete means we do not actually destroy / remove the user record
       * from our database, instead we mark the user as is the user has logged
       * out from the application. Hence, making the user is no longer accessing
       * the application (and guaranteed that there is no way the system can fetch
       * the user while accessing the system) but still remains in the db for data
       * report functionality if needed (for example: usage in admin dashboard).
       */
      await this.customerRepo.logsOutCustomer(customer.id);
      await this.tableRepo.updateTableReservationStatus(tableToken, false);
      await this.tableRepo.updateTableToken(
        tableFromRepo.id,
        TableToken.create({
          value: TableToken.generateToken(tableFromRepo.number.value),
        }).getValue()
      );

      this.noContent(res);
    } catch (err) {
      console.log("[LogoutApplicationUseCaseError]", err);
      throw new Error((err as Error).message);
    }
  }
}
