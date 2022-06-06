import { Result } from "../../../shared/logic/Result";
import { Table } from "../domains/Table";
import { TableNumber } from "../domains/valueObjects/TableNumber";
import { TableToken } from "../domains/valueObjects/TableToken";

export interface ITableRepo {
  findById(id: string): Promise<Result<Table>>;
  findByTableNumber(number: TableNumber): Promise<Result<Table>>;
  findByTableToken(token: TableToken): Promise<Result<Table>>;
  updateTableToken(id: string, token: TableToken): Promise<void>;
  updateTableReservationStatus(
    token: TableToken,
    status?: boolean
  ): Promise<void>;
}
