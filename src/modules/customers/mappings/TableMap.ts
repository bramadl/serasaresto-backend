import { Table } from "../domains/Table";
import { TableNumber } from "../domains/valueObjects/TableNumber";
import { TableToken } from "../domains/valueObjects/TableToken";

export class TableMap {
  public static toDomain(raw: any): Table {
    const table = Table.create(
      {
        number: TableNumber.create(raw.number).getValue(),
        token: TableToken.create({
          value: raw.token,
          tableNumber: raw.number,
        }).getValue(),
        isReserved: raw.isReserved,
      },
      raw.id
    );

    return table.getValue();
  }
}
