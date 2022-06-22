import {
  Customer as CustomerPrisma,
  Order,
  Table as TablePrisma,
} from "@prisma/client";

import { Table } from "../domains/Table";
import { Customer } from "../domains/Customer";
import { CustomerName } from "../domains/valueObjects/CustomerName";
import { TableToken } from "../domains/valueObjects/TableToken";
import { TableNumber } from "../domains/valueObjects/TableNumber";

export interface ICustomerRepo {
  countCustomers(): Promise<number>;
  getLatestTen(): Promise<
    (CustomerPrisma & {
      table: TablePrisma;
      orders: Order[];
    })[]
  >;
  findByTable(table: Table): Promise<Customer | null>;
  reserveTableFor(
    customerName: CustomerName,
    tableToken: TableToken,
    tableNumber: TableNumber
  ): Promise<void>;
  logsOutCustomer(id: string): Promise<void>;
}
