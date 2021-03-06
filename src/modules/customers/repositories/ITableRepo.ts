import {
  Order as OrderPrisma,
  Customer as CustomerPrisma,
  Table as TablePrisma,
} from "@prisma/client";

import { Result } from "../../../shared/logic/Result";
import { Table } from "../domains/Table";
import { TableNumber } from "../domains/valueObjects/TableNumber";
import { TableToken } from "../domains/valueObjects/TableToken";

export interface ITableRepo {
  getAll(): Promise<
    (TablePrisma & {
      orders: OrderPrisma[];
      customer: CustomerPrisma[];
    })[]
  >;
  findById(id: string): Promise<Result<Table>>;
  findByTableNumber(number: TableNumber): Promise<Result<Table>>;
  findByTableToken(token: TableToken): Promise<Result<Table>>;
  updateTableToken(id: string, token: TableToken): Promise<void>;
  updateTableReservationStatus(
    token: TableToken,
    status?: boolean
  ): Promise<void>;
}
