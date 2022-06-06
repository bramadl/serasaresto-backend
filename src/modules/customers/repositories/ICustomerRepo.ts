import { Customer as CustomerPrisma } from "@prisma/client";

import { Result } from "../../../shared/logic/Result";
import { CustomerName } from "../domains/valueObjects/CustomerName";
import { TableToken } from "../domains/valueObjects/TableToken";

export interface ICustomerRepo {
  findByToken(token: string): Promise<Result<CustomerPrisma>>;

  reserveTableFor(
    customerName: CustomerName,
    tableToken: TableToken
  ): Promise<void>;

  logsOutCustomer(id: string): Promise<void>;
}
