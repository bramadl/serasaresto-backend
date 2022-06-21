import { Result } from "../../../shared/logic/Result";
import { Customer as CustomerPrisma, Order, Table } from "@prisma/client";
import { Customer } from "../domains/Customer";
import { CustomerName } from "../domains/valueObjects/CustomerName";
import { TableToken } from "../domains/valueObjects/TableToken";

export interface ICustomerRepo {
  countCustomers(): Promise<number>;
  getLatestTen(): Promise<
    (CustomerPrisma & {
      table: Table;
      orders: Order[];
    })[]
  >;
  findByToken(token: string): Promise<Result<Customer>>;
  reserveTableFor(
    customerName: CustomerName,
    tableToken: TableToken
  ): Promise<void>;
  logsOutCustomer(id: string): Promise<void>;
}
