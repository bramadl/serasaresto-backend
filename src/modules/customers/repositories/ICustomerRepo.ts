import { CustomerName } from "../domains/valueObjects/CustomerName";
import { TableToken } from "../domains/valueObjects/TableToken";

export interface ICustomerRepo {
  reserveTableFor(
    customerName: CustomerName,
    tableToken: TableToken
  ): Promise<void>;
}
